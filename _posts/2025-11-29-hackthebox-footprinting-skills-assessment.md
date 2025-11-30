---
title: "HackTheBox - Footprinting - Skills Assessment"
date: 2025-11-29 11:33:00 +0200
categories: [HackTheBox, Learning]
tags: [footprinting, enumeration, dns, ssh, reconnaissance, pentest]
description: "Mon premier lab pratique de footprinting sur un serveur DNS interne avec découverte d'informations critiques"
image:
  path: /assets/img/posts/footprinting-introduction.png
  alt: "Footprinting Lab HTB"
---

## Informations sur le module

Premier lab pratique de footprinting où je dois énumérer un serveur DNS interne pour la société Inlanefreight Ltd. L'objectif est de découvrir un maximum d'informations exploitables sans attaquer agressivement les services en production.

**Lien :** [Footprinting Module](https://academy.hackthebox.com/beta/module/112/section/1078)

## Objectifs d'apprentissage

Ce lab couvre les compétences suivantes :

- Énumération méthodique d'un serveur DNS
- Exploitation d'informations d'identification trouvées
- Recherche et utilisation de clés SSH
- Escalade des privilèges d'énumération
- Collecte d'informations sans exploitation agressive

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Footprinting Lab - Easy

### Contexte de la mission

La société Inlanefreight Ltd m'a confié l'audit de trois serveurs dans leur réseau interne. Pour ce premier lab, je me concentre sur un **serveur DNS interne**.

**Contraintes importantes :**
- Pas d'exploitation agressive avec des exploits
- Services en production à ne pas perturber
- Objectif : collecter un maximum d'informations exploitables

> **Pour les débutants** : En pentest réel, il est crucial de respecter les limites définies par le client. Ici, on doit rester en mode "énumération" sans attaquer les services directement.
{: .prompt-warning}

### Informations initiales disponibles

Mes collègues m'ont fourni des éléments précieux :

**Identifiants découverts :**
```
ceil:qwer1234
```

**Information OSINT :**
Des employés ont mentionné des **clés SSH** sur un forum public.

> Cette information est cruciale ! Les clés SSH mal protégées sont une porte d'entrée fréquente dans les infrastructures.
{: .prompt-tip}

---

### Question

**Enumerate the server carefully and find the flag.txt file. Submit the contents of this file as the answer.**

J'ai d'abors fait un scan complexe et long avec nmap mais au bout de 15min j'ai fait un autre scan beaucoup plus rapide et voici ce que ça m'a donné:

```bash
──╼ [★]$ sudo nmap 10.129.173.127
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-29 07:00 CST
Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn
Nmap done: 1 IP address (0 hosts up) scanned in 3.09 seconds
```

Il fallait donc que je rajoute le `-Pn` et voici ce que ça m'a donné ensuite

```bash
└──╼ [★]$ sudo nmap -Pn -sC -sV 10.129.173.127
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-29 07:05 CST
Nmap scan report for 10.129.173.127
Host is up (0.055s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
21/tcp   open  ftp     ProFTPD
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 3f:4c:8f:10:f1:ae:be:cd:31:24:7c:a1:4e:ab:84:6d (RSA)
|   256 7b:30:37:67:50:b9:ad:91:c0:8f:f7:02:78:3b:7c:02 (ECDSA)
|_  256 88:9e:0e:07:fe:ca:d0:5c:60:ab:cf:10:99:cd:6c:a7 (ED25519)
53/tcp   open  domain  ISC BIND 9.16.1 (Ubuntu Linux)
| dns-nsid: 
|_  bind.version: 9.16.1-Ubuntu
2121/tcp open  ftp     ProFTPD
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 77.63 seconds
```

Nous voyons qu'il n'y a pas de page a proprement parlé donc nous ne pouvons pas consulter directment la page mais nous voyons un port ftp que nous allons tester de ce pas. Ainsi qu'un port intéressant `2121`

```bash
└──╼ [★]$ ftp 10.129.173.127
Connected to 10.129.173.127.
220 ProFTPD Server (ftp.int.inlanefreight.htb) [10.129.173.127]
Name (10.129.173.127:root): ceil
331 Password required for ceil
Password: 
230 User ceil logged in
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> 
```

Nous sommes bien connecté en tant que `ceil` et son mot de passe découvert par la team OSINT avant `qwer1234` maintenant cherchons le `flag.txt`

```bash
ftp> ls -a
229 Entering Extended Passive Mode (|||37778|)
150 Opening ASCII mode data connection for file list
drwxr-xr-x   4 ceil     ceil         4096 Nov 10  2021 .
drwxr-xr-x   4 ceil     ceil         4096 Nov 10  2021 ..
-rw-------   1 ceil     ceil          294 Nov 10  2021 .bash_history
-rw-r--r--   1 ceil     ceil          220 Nov 10  2021 .bash_logout
-rw-r--r--   1 ceil     ceil         3771 Nov 10  2021 .bashrc
drwx------   2 ceil     ceil         4096 Nov 10  2021 .cache
-rw-r--r--   1 ceil     ceil          807 Nov 10  2021 .profile
drwx------   2 ceil     ceil         4096 Nov 10  2021 .ssh
-rw-------   1 ceil     ceil          759 Nov 10  2021 .viminfo
226 Transfer complete
```

Nous voyons un dossier ssh

```bash
ftp> get .ssh/id_rsa
local: .ssh/id_rsa remote: .ssh/id_rsa
229 Entering Extended Passive Mode (|||9644|)
150 Opening BINARY mode data connection for .ssh/id_rsa (3381 bytes)
100% |***********************************|  3381        2.60 MiB/s    00:00 ETA
226 Transfer complete
3381 bytes received in 00:00 (61.98 KiB/s)
```

Maintenant il faut que sur notre machine on `chmod 600` la clé rsa pour l'utiliser avec le `-i` de ssh

```bash
└──╼ [★]$ ssh -i id_rsa ceil@10.129.173.127
Welcome to Ubuntu 20.04.1 LTS (GNU/Linux 5.4.0-90-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Sat 29 Nov 2025 01:25:58 PM UTC

  System load:  0.0               Processes:               176
  Usage of /:   86.3% of 3.87GB   Users logged in:         0
  Memory usage: 14%               IPv4 address for ens192: 10.129.173.127
  Swap usage:   0%

  => / is using 86.3% of 3.87GB

 * Super-optimized for small spaces - read how we shrank the memory
   footprint of MicroK8s to make it the smallest full K8s around.

   https://ubuntu.com/blog/microk8s-memory-optimisation

116 updates can be installed immediately.
1 of these updates is a security update.
To see these additional updates run: apt list --upgradable


The list of available updates is more than a week old.
To check for new updates run: sudo apt update

Last login: Wed Nov 10 05:48:02 2021 from 10.10.14.20
ceil@NIXEASY:~$
```

Nous sommes connecté ! Et dans le fichier .bash_history nous pouvons y voir ceci 

```bash
└──╼ [★]$ cat .bash_history 
ls -al
mkdir ssh
cd ssh/
echo "test" > id_rsa
id
ssh-keygen -t rsa -b 4096
cd ..
rm -rf ssh/
ls -al
cd .ssh/
cat id_rsa
ls a-l
ls -al
cat id_rsa.pub >> authorized_keys
cd ..
cd /home
cd ceil/
ls -l
ls -al
mkdir flag
cd flag/
touch flag.txt
vim flag.txt 
cat flag.txt 
ls -al
mv flag/flag.txt .
```

Bien sûr avant j'ai fait un `get` de ce fichier dans le ftp et on voir qu'ils ont créer un dossier juste pour le flag donc nous pouvons aller le chercher maintenant:

```bash
ceil@NIXEASY:/home$ ls
ceil  cry0l1t3  flag
ceil@NIXEASY:/home$ cd flag/
ceil@NIXEASY:/home/flag$ ls
flag.txt
ceil@NIXEASY:/home/flag$ cat flag.txt 
```

**Réponse :** `HTB{7nrzise7hednrxihskjed7nzrgkweunj47zngrhdbkjhgdfbjkc7hgj}`

---

## Footprinting Lab - Medium

### Contexte de la mission

Le deuxième serveur audité est un **serveur accessible à tous les employés** du réseau interne d'Inlanefreight Ltd. 

Lors de mes discussions avec le client, j'ai souligné un point critique : ces serveurs partagés sont souvent les **premières cibles** des attaquants. Pourquoi ? Parce qu'ils sont accessibles à de nombreux utilisateurs, ce qui augmente la surface d'attaque.

**Contraintes importantes :**
- Pas d'exploitation agressive avec des exploits
- Services en production à ne pas perturber
- Objectif : obtenir les credentials de l'utilisateur `HTB` comme preuve

> **Pour les débutants** : Un serveur accessible à tous les employés accumule souvent des mauvaises pratiques de sécurité : permissions trop larges, partages mal configurés, mots de passe faibles, fichiers sensibles oubliés...
{: .prompt-warning}

### Informations initiales disponibles

**Objectif de preuve :**
Récupérer les credentials de l'utilisateur `HTB` créé spécifiquement pour valider ma progression dans ce lab.

> Cette approche est courante en pentest : le client crée des "drapeaux" (flags) ou des comptes tests pour mesurer l'efficacité de l'audit sans compromettre de vraies données sensibles.
{: .prompt-info}

---

### Question

**Enumerate the server carefully and find the username "HTB" and its password. Then, submit this user's password as the answer.**

Nous devons trouver le mot de passe de l'utilisateur `HTB` voici comment j'ai procédé, comme toujours en premier nous faisons des scan pour mieux connaître notre cible

```bash
└──╼ [★]$ sudo nmap -sC -sV -Pn 10.129.149.56
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-29 08:34 CST
Nmap scan report for 10.129.149.56
Host is up (0.045s latency).
Not shown: 994 closed tcp ports (reset)
PORT     STATE SERVICE       VERSION
111/tcp  open  rpcbind       2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/tcp6  rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  2,3,4        111/udp6  rpcbind
|   100003  2,3         2049/udp   nfs
|   100003  2,3         2049/udp6  nfs
|   100003  2,3,4       2049/tcp   nfs
|   100003  2,3,4       2049/tcp6  nfs
|   100005  1,2,3       2049/tcp   mountd
|   100005  1,2,3       2049/tcp6  mountd
|   100005  1,2,3       2049/udp   mountd
|   100005  1,2,3       2049/udp6  mountd
|   100021  1,2,3,4     2049/tcp   nlockmgr
|   100021  1,2,3,4     2049/tcp6  nlockmgr
|   100021  1,2,3,4     2049/udp   nlockmgr
|   100021  1,2,3,4     2049/udp6  nlockmgr
|   100024  1           2049/tcp   status
|   100024  1           2049/tcp6  status
|   100024  1           2049/udp   status
|_  100024  1           2049/udp6  status
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds?
2049/tcp open  nlockmgr      1-4 (RPC #100021)
3389/tcp open  ms-wbt-server Microsoft Terminal Services
| ssl-cert: Subject: commonName=WINMEDIUM
| Not valid before: 2025-11-28T14:33:23
|_Not valid after:  2026-05-30T14:33:23
| rdp-ntlm-info: 
|   Target_Name: WINMEDIUM
|   NetBIOS_Domain_Name: WINMEDIUM
|   NetBIOS_Computer_Name: WINMEDIUM
|   DNS_Domain_Name: WINMEDIUM
|   DNS_Computer_Name: WINMEDIUM
|   Product_Version: 10.0.17763
|_  System_Time: 2025-11-29T14:46:10+00:00
|_ssl-date: 2025-11-29T14:46:19+00:00; -21s from scanner time.
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: mean: -21s, deviation: 0s, median: -21s
| smb2-time: 
|   date: 2025-11-29T14:46:15
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 704.76 seconds
```

Nous voyons que les script NSE ont trouvé des problèmes de sécurité au niveau de SMB nous allons donc les tester

Ok j'ai essayé de me connecter en anonyme mais ça ne marche pas donc je suis parti tester les `partages NFS` comme on peut le voir il y a beaucoup de choses qui parle de ça dans le scan

```bash
└──╼ [★]$ mkdir -p medium-NFS
```

Je créer un dossier quelquonque

```bash
└──╼ [★]$ sudo mount -t nfs 10.129.149.56:/ ./medium-NFS/ -o nolock
```

Et je monte la partition pour avoir le partage dessu

```bash
└──╼ [★]$ ls
cacert.der  Documents  medium-NFS  Pictures  Templates
Desktop     Downloads  Music       Public    Videos
┌─[eu-academy-3]─[10.10.14.201]─[htb-ac-1999270@htb-ztjhkb25ui]─[~]
└──╼ [★]$ cd medium-NFS/
┌─[eu-academy-3]─[10.10.14.201]─[htb-ac-1999270@htb-ztjhkb25ui]─[~/medium-NFS]
└──╼ [★]$ ls
TechSupport
┌─[eu-academy-3]─[10.10.14.201]─[htb-ac-1999270@htb-ztjhkb25ui]─[~/medium-NFS]
└──╼ [★]$ cd TechSupport/
bash: cd: TechSupport/: Permission denied
```

Il y a un dossier `TechSupport` mais nous n'avons pas les droits donc on va regarder les UID du dossier pour créer un utilisateur qui aura les même permissions

```bash
└──╼ [★]$ ls -l
total 64
drwx------ 2 nobody nogroup 65536 Nov 10  2021 TechSupport
```

```bash
└──╼ [★]$ sudo useradd -u 65536 tempuser
```

Maintenant nous pouvons accéder au dossier en temps que cet utilisateur mais aussi en tant que `root` après avoir testé

```bash
└──╼ [★]$ sudo -s
```

```bash
┌─[root@htb-ztjhkb25ui]─[/home]
└──╼ #cd /home/htb-ac-1999270/
┌─[root@htb-ztjhkb25ui]─[/home/htb-ac-1999270]
└──╼ #ls
cacert.der  Documents  medium-NFS  Pictures  Templates
Desktop     Downloads  Music       Public    Videos
┌─[root@htb-ztjhkb25ui]─[/home/htb-ac-1999270]
└──╼ #cd medium-NFS/
┌─[root@htb-ztjhkb25ui]─[/home/htb-ac-1999270/medium-NFS]
└──╼ #ls
TechSupport
┌─[root@htb-ztjhkb25ui]─[/home/htb-ac-1999270/medium-NFS]
└──╼ #cd TechSupport/
┌─[root@htb-ztjhkb25ui]─[/home/htb-ac-1999270/medium-NFS/TechSupport]
└──╼ #ls
ticket4238791283649.txt  ticket4238791283700.txt  ticket4238791283751.txt
ticket4238791283650.txt  ticket4238791283701.txt  ticket4238791283752.txt
ticket4238791283651.txt  ticket4238791283702.txt  ticket4238791283753.txt
ticket4238791283652.txt  ticket4238791283703.txt  ticket4238791283754.txt
ticket4238791283653.txt  ticket4238791283704.txt  ticket4238791283755.txt
ticket4238791283654.txt  ticket4238791283705.txt  ticket4238791283756.txt
ticket4238791283655.txt  ticket4238791283706.txt  ticket4238791283757.txt
ticket4238791283656.txt  ticket4238791283707.txt  ticket4238791283758.txt
ticket4238791283657.txt  ticket4238791283708.txt  ticket4238791283759.txt
ticket4238791283658.txt  ticket4238791283709.txt  ticket4238791283760.txt
ticket4238791283659.txt  ticket4238791283710.txt  ticket4238791283761.txt
ticket4238791283660.txt  ticket4238791283711.txt  ticket4238791283762.txt
ticket4238791283661.txt  ticket4238791283712.txt  ticket4238791283763.txt
ticket4238791283662.txt  ticket4238791283713.txt  ticket4238791283764.txt
ticket4238791283663.txt  ticket4238791283714.txt  ticket4238791283765.txt
ticket4238791283664.txt  ticket4238791283715.txt  ticket4238791283766.txt
ticket4238791283665.txt  ticket4238791283716.txt  ticket4238791283767.txt
ticket4238791283666.txt  ticket4238791283717.txt  ticket4238791283768.txt
ticket4238791283667.txt  ticket4238791283718.txt  ticket4238791283769.txt
ticket4238791283668.txt  ticket4238791283719.txt  ticket4238791283770.txt
ticket4238791283669.txt  ticket4238791283720.txt  ticket4238791283771.txt
ticket4238791283670.txt  ticket4238791283721.txt  ticket4238791283772.txt
ticket4238791283671.txt  ticket4238791283722.txt  ticket4238791283773.txt
ticket4238791283672.txt  ticket4238791283723.txt  ticket4238791283774.txt
ticket4238791283673.txt  ticket4238791283724.txt  ticket4238791283775.txt
ticket4238791283674.txt  ticket4238791283725.txt  ticket4238791283776.txt
ticket4238791283675.txt  ticket4238791283726.txt  ticket4238791283777.txt
ticket4238791283676.txt  ticket4238791283727.txt  ticket4238791283778.txt
ticket4238791283677.txt  ticket4238791283728.txt  ticket4238791283779.txt
ticket4238791283678.txt  ticket4238791283729.txt  ticket4238791283780.txt
ticket4238791283679.txt  ticket4238791283730.txt  ticket4238791283781.txt
ticket4238791283680.txt  ticket4238791283731.txt  ticket4238791283782.txt
ticket4238791283681.txt  ticket4238791283732.txt  ticket4238791283783.txt
ticket4238791283682.txt  ticket4238791283733.txt  ticket4238791283784.txt
ticket4238791283683.txt  ticket4238791283734.txt  ticket4238791283785.txt
ticket4238791283684.txt  ticket4238791283735.txt  ticket4238791283786.txt
ticket4238791283685.txt  ticket4238791283736.txt  ticket4238791283787.txt
ticket4238791283686.txt  ticket4238791283737.txt  ticket4238791283788.txt
ticket4238791283687.txt  ticket4238791283738.txt  ticket4238791283789.txt
ticket4238791283688.txt  ticket4238791283739.txt  ticket4238791283790.txt
ticket4238791283689.txt  ticket4238791283740.txt  ticket4238791283791.txt
ticket4238791283690.txt  ticket4238791283741.txt  ticket4238791283792.txt
ticket4238791283691.txt  ticket4238791283742.txt  ticket4238791283793.txt
ticket4238791283692.txt  ticket4238791283743.txt  ticket4238791283794.txt
ticket4238791283693.txt  ticket4238791283744.txt  ticket4238791283795.txt
ticket4238791283694.txt  ticket4238791283745.txt  ticket4238791283796.txt
ticket4238791283695.txt  ticket4238791283746.txt  ticket4238791283797.txt
ticket4238791283696.txt  ticket4238791283747.txt  ticket4238791283798.txt
ticket4238791283697.txt  ticket4238791283748.txt  ticket4238791283799.txt
ticket4238791283698.txt  ticket4238791283749.txt  ticket4238791283800.txt
ticket4238791283699.txt  ticket4238791283750.txt  ticket4238791283801.txt
```

Nous voyons beaucoup de tickets maintenant et si on `cat` certains d'entre eux, beaucoup sont vide donc on va tout regarder avec `grep`

```bash
└──╼ #grep -r "password\|passwd\|pwd\|ssh\|key\|flag\|user" .
./ticket4238791283782.txt: 5    user="alex"
./ticket4238791283782.txt: 6    password="lol123!mD"
./ticket4238791283782.txt:16    userpass {    
```

Et voici le fichier qui contient par `userpass {`:

```bash
└──╼ #cat ticket4238791283782.txt
Conversation with InlaneFreight Ltd

Started on November 10, 2021 at 01:27 PM London time GMT (GMT+0200)
---
01:27 PM | Operator: Hello,. 
 
So what brings you here today?
01:27 PM | alex: hello
01:27 PM | Operator: Hey alex!
01:27 PM | Operator: What do you need help with?
01:36 PM | alex: I run into an issue with the web config file on the system for the smtp server. do you mind to take a look at the config?
01:38 PM | Operator: Of course
01:42 PM | alex: here it is:

 1smtp {
 2    host=smtp.web.dev.inlanefreight.htb
 3    #port=25
 4    ssl=true
 5    user="alex"
 6    password="lol123!mD"
 7    from="alex.g@web.dev.inlanefreight.htb"
 8}
 9
10securesocial {
11    
12    onLoginGoTo=/
13    onLogoutGoTo=/login
14    ssl=false
15    
16    userpass {      
17    	withUserNameSupport=false
18    	sendWelcomeEmail=true
19    	enableGravatarSupport=true
20    	signupSkipLogin=true
21    	tokenDuration=60
22    	tokenDeleteInterval=5
23    	minimumPasswordLength=8
24    	enableTokenJob=true
25    	hasher=bcrypt
26	}
27
28     cookie {
29     #       name=id
30     #       path=/login
31     #       domain="10.129.2.59:9500"
32            httpOnly=true
33            makeTransient=false
34            absoluteTimeoutInMinutes=1440
35            idleTimeoutInMinutes=1440
36    }   



---
```

Parfait nous avons une très bonne piste que nous allons approfondir

Nous pouvons essayer de regarder de nouveau SMB grâce aux identifiants que nous avons eu

```bash
└──╼ [★]$ smbclient -L //10.129.149.56 -U alex%'lol123!mD'

	Sharename       Type      Comment
	---------       ----      -------
	ADMIN$          Disk      Remote Admin
	C$              Disk      Default share
	devshare        Disk      
	IPC$            IPC       Remote IPC
	Users           Disk      
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to 10.129.149.56 failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)
Unable to connect with SMB1 -- no workgroup available
```

Maintenant nous allons pouvoir y voir plus clair avec l'outil `smbmap`

```bash
└──╼ [★]$ smbmap -H 10.129.202.41 -u 'alex' -p 'lol123!mD'
[+] IP: 10.129.202.41:445	Name: 10.129.202.41                                     
        Disk                                                  	Permissions	Comment
	----                                                  	-----------	-------
	ADMIN$                                            	NO ACCESS	Remote Admin
	C$                                                	NO ACCESS	Default share
	devshare                                          	READ, WRITE	
	IPC$                                              	READ ONLY	Remote IPC
	Users                                             	READ ONLY
```

Donc nous avons les permissions d'écriture et de lecture sur le dossier `devshare` donc nous allons pouvoir nous y connecter avec `smbclient`

```bash
└──╼ [★]$ smbclient //10.129.202.41/devshare -U alex
Password for [WORKGROUP\alex]:
Try "help" to get a list of possible commands.
smb: \> 
```

Nous sommes maintenant connecté avec `alex` regardons ce qu'il y a dedans

```bash
smb: \> ls
  .                                   D        0  Sun Nov 30 04:04:30 2025
  ..                                  D        0  Sun Nov 30 04:04:30 2025
  important.txt                       A       16  Wed Nov 10 10:12:55 2021

		10328063 blocks of size 4096. 6098551 blocks available
```

Nous avons un fichier que nous allons récupérer avec `get` et en voici le contenu

```bash
└──╼ [★]$ cat important.txt 
sa:87N1ns@slls83
```

Parfait nous avons le mot de passe de l'utilisateur `sa` qui je le rappel est un compte admin sur SQL

Nous pouvons nous connecter sur le compte windows en automatique avec la commande `xfreerdp` 

```bash
└──╼ [★]$ xfreerdp /u:alex /p:'lol123!mD' /v:10.129.202.41
```

ça va vous ouvrir une fenêtre avec windows dedans pour avoir une interface graphique, maintenant on peut voir la base de donnée SQL mais il faut run le logiciel en admin en premier pour passer le compte avec l'utilisateur `sa` et son mot de passe donc on fait un clique droit sur le logiciel puis `run as admin`

Le problème est que on ne peut pas coller le mot de passe, ni faire de `@` donc j'ai du activer le clavier sur l'écran avec l'application `on screen keyboard`

Maintenant nous sommes connecté sur la base de donnée en tant qu'admin il reste plus qu'a trouver le mot de passe de l'utilisateur `HTB`

Maintenant il faut aller dans `Databases/Accounts/Tables/dbo.devacc`

Faire un clic droit sur `dbo/devacc` et cliquer sur `Edit Top 200 rows` pour éditer les 200 dernières lignes et voir toute la base de donnée

Et en cherchant un peut sur tout les compte et les mots de passes, on peut voir sur la ligne 157 le compte `HTB` ainsi que son mot de passe !

**Réponse :** `lnch7ehrdn43i7AoqVPK4zWR`

---

## Footprinting Lab - Hard

### Contexte de la mission

Le troisième serveur audité est un **serveur MX et de gestion** pour le réseau interne d'Inlanefreight Ltd. 

Ce serveur remplit également une fonction cruciale : il sert de **serveur de sauvegarde pour les comptes internes du domaine**. Cette double fonction (messagerie + backup) en fait une cible particulièrement sensible, car il centralise des informations critiques sur l'infrastructure.

**Contraintes importantes :**
- Pas d'exploitation agressive avec des exploits
- Services de messagerie et de backup en production à ne pas perturber
- Objectif : obtenir les credentials de l'utilisateur `HTB` comme preuve

> **Pour les débutants** : Un serveur combinant fonctions MX (Mail eXchange) et backup du domaine contient souvent des informations sensibles : boîtes mail, sauvegardes de comptes Active Directory, configurations système... C'est une mine d'or pour un attaquant !
{: .prompt-warning}

### Informations initiales disponibles

**Objectif de preuve :**

Un compte utilisateur nommé `HTB` a été créé sur ce serveur dans le cadre des sauvegardes de comptes du domaine. Ma mission est de récupérer ses credentials pour valider ma progression dans ce lab.

> Les serveurs de backup stockent souvent des copies de bases de données d'authentification, d'anciennes configurations, ou des scripts contenant des credentials. L'énumération minutieuse de ces serveurs révèle fréquemment des accès non intentionnels.
{: .prompt-info}

---

### Question

**Enumerate the server carefully and find the username "HTB" and its password. Then, submit HTB's password as the answer.**

Nous allons commencer par un scan basique de la cible

```bash
└──╼ [★]$ sudo nmap -sC -sV 10.129.202.20
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-30 05:21 CST
Nmap scan report for 10.129.202.20
Host is up (0.044s latency).
Not shown: 995 closed tcp ports (reset)
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 3f:4c:8f:10:f1:ae:be:cd:31:24:7c:a1:4e:ab:84:6d (RSA)
|   256 7b:30:37:67:50:b9:ad:91:c0:8f:f7:02:78:3b:7c:02 (ECDSA)
|_  256 88:9e:0e:07:fe:ca:d0:5c:60:ab:cf:10:99:cd:6c:a7 (ED25519)
110/tcp open  pop3     Dovecot pop3d
|_pop3-capabilities: RESP-CODES TOP USER PIPELINING CAPA AUTH-RESP-CODE SASL(PLAIN) UIDL STLS
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=NIXHARD
| Subject Alternative Name: DNS:NIXHARD
| Not valid before: 2021-11-10T01:30:25
|_Not valid after:  2031-11-08T01:30:25
143/tcp open  imap     Dovecot imapd (Ubuntu)
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=NIXHARD
| Subject Alternative Name: DNS:NIXHARD
| Not valid before: 2021-11-10T01:30:25
|_Not valid after:  2031-11-08T01:30:25
|_imap-capabilities: AUTH=PLAINA0001 IDLE LOGIN-REFERRALS ID listed SASL-IR capabilities Pre-login post-login have LITERAL+ more STARTTLS OK ENABLE IMAP4rev1
993/tcp open  ssl/imap Dovecot imapd (Ubuntu)
| ssl-cert: Subject: commonName=NIXHARD
| Subject Alternative Name: DNS:NIXHARD
| Not valid before: 2021-11-10T01:30:25
|_Not valid after:  2031-11-08T01:30:25
|_ssl-date: TLS randomness does not represent time
|_imap-capabilities: IDLE LOGIN-REFERRALS ID listed AUTH=PLAINA0001 capabilities LITERAL+ post-login have Pre-login more IMAP4rev1 OK ENABLE SASL-IR
995/tcp open  ssl/pop3 Dovecot pop3d
|_pop3-capabilities: PIPELINING CAPA SASL(PLAIN) AUTH-RESP-CODE UIDL TOP USER RESP-CODES
| ssl-cert: Subject: commonName=NIXHARD
| Subject Alternative Name: DNS:NIXHARD
| Not valid before: 2021-11-10T01:30:25
|_Not valid after:  2031-11-08T01:30:25
|_ssl-date: TLS randomness does not represent time
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 17.08 seconds
```

Nous voyons des ports TCP qui utilisent `imap` et `pop3` et qui sont ouverts mais faisons un scan UDP avant de continuer pour checker les services SNMP

```bash
└──╼ [★]$ sudo nmap -sV --top-port 100 -sU 10.129.202.20
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-30 06:17 CST
Nmap scan report for 10.129.202.20
Host is up (0.18s latency).
Not shown: 98 closed udp ports (port-unreach)
PORT    STATE         SERVICE VERSION
68/udp  open|filtered dhcpc
161/udp open          snmp    net-snmp; net-snmp SNMPv3 server

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 222.54 seconds
```

Nous voyons un port qui est filtré donc potentiellement ouvert ou pas et un autre `161` qui est ouvert a coup sûr et avec `snmp` donc on va pouvoir utiliser notre outil `snmpwalk`

```bash
└──╼ [★]$ snmpwalk -v2c -c public 10.129.202.20
Timeout: No Response from 10.129.202.20
```

Mais celui ci ne fonctionne pas donc on va utiliser un outil tout comme : `onesixtyone`

```bash
└──╼ [★]$ onesixtyone -c /usr/share/seclists/Discovery/SNMP/snmp.txt 10.129.202.20
Scanning 1 hosts, 3219 communities
```

Alors avec la seclists installé directement dans la `pwnbox` de HTB on ne trouve rien **MAIS** si on clone le github des seclists de nouveau dans la pwnbox et qu'on refait la commande voici ce qu'on obtient et voici les commandes a faire avant:

- sudo apt install seclists

- git clone https://github.com/danielmiessler/SecLists.git

```bash
└──╼ [★]$ onesixtyone -c SecLists/Discovery/SNMP/snmp.txt 10.129.202.20
Scanning 1 hosts, 3219 communities
10.129.202.20 [backup] Linux NIXHARD 5.4.0-90-generic #101-Ubuntu SMP Fri Oct 15 20:00:55 UTC 2021 x86_64
```

Bien maintenant nous savons qu'il y a un server de `backup` et nous allons faire la commande `snmpwalk`

```bash
└──╼ [★]$ snmpwalk -v2c -c backup 10.129.202.20
iso.3.6.1.2.1.1.1.0 = STRING: "Linux NIXHARD 5.4.0-90-generic #101-Ubuntu SMP Fri Oct 15 20:00:55 UTC 2021 x86_64"
iso.3.6.1.2.1.1.2.0 = OID: iso.3.6.1.4.1.8072.3.2.10
iso.3.6.1.2.1.1.3.0 = Timeticks: (486638) 1:21:06.38
iso.3.6.1.2.1.1.4.0 = STRING: "Admin <tech@inlanefreight.htb>"
iso.3.6.1.2.1.1.5.0 = STRING: "NIXHARD"
iso.3.6.1.2.1.1.6.0 = STRING: "Inlanefreight"
iso.3.6.1.2.1.1.7.0 = INTEGER: 72
iso.3.6.1.2.1.1.8.0 = Timeticks: (38) 0:00:00.38
iso.3.6.1.2.1.1.9.1.2.1 = OID: iso.3.6.1.6.3.10.3.1.1
iso.3.6.1.2.1.1.9.1.2.2 = OID: iso.3.6.1.6.3.11.3.1.1
iso.3.6.1.2.1.1.9.1.2.3 = OID: iso.3.6.1.6.3.15.2.1.1
iso.3.6.1.2.1.1.9.1.2.4 = OID: iso.3.6.1.6.3.1
iso.3.6.1.2.1.1.9.1.2.5 = OID: iso.3.6.1.6.3.16.2.2.1
iso.3.6.1.2.1.1.9.1.2.6 = OID: iso.3.6.1.2.1.49
iso.3.6.1.2.1.1.9.1.2.7 = OID: iso.3.6.1.2.1.4
iso.3.6.1.2.1.1.9.1.2.8 = OID: iso.3.6.1.2.1.50
iso.3.6.1.2.1.1.9.1.2.9 = OID: iso.3.6.1.6.3.13.3.1.3
iso.3.6.1.2.1.1.9.1.2.10 = OID: iso.3.6.1.2.1.92
iso.3.6.1.2.1.1.9.1.3.1 = STRING: "The SNMP Management Architecture MIB."
iso.3.6.1.2.1.1.9.1.3.2 = STRING: "The MIB for Message Processing and Dispatching."
iso.3.6.1.2.1.1.9.1.3.3 = STRING: "The management information definitions for the SNMP User-based Security Model."
iso.3.6.1.2.1.1.9.1.3.4 = STRING: "The MIB module for SNMPv2 entities"
iso.3.6.1.2.1.1.9.1.3.5 = STRING: "View-based Access Control Model for SNMP."
iso.3.6.1.2.1.1.9.1.3.6 = STRING: "The MIB module for managing TCP implementations"
iso.3.6.1.2.1.1.9.1.3.7 = STRING: "The MIB module for managing IP and ICMP implementations"
iso.3.6.1.2.1.1.9.1.3.8 = STRING: "The MIB module for managing UDP implementations"
iso.3.6.1.2.1.1.9.1.3.9 = STRING: "The MIB modules for managing SNMP Notification, plus filtering."
iso.3.6.1.2.1.1.9.1.3.10 = STRING: "The MIB module for logging SNMP Notifications."
iso.3.6.1.2.1.1.9.1.4.1 = Timeticks: (38) 0:00:00.38
iso.3.6.1.2.1.1.9.1.4.2 = Timeticks: (38) 0:00:00.38
iso.3.6.1.2.1.1.9.1.4.3 = Timeticks: (38) 0:00:00.38
iso.3.6.1.2.1.1.9.1.4.4 = Timeticks: (38) 0:00:00.38
iso.3.6.1.2.1.1.9.1.4.5 = Timeticks: (38) 0:00:00.38
iso.3.6.1.2.1.1.9.1.4.6 = Timeticks: (38) 0:00:00.38
iso.3.6.1.2.1.1.9.1.4.7 = Timeticks: (38) 0:00:00.38
iso.3.6.1.2.1.1.9.1.4.8 = Timeticks: (38) 0:00:00.38
iso.3.6.1.2.1.1.9.1.4.9 = Timeticks: (38) 0:00:00.38
iso.3.6.1.2.1.1.9.1.4.10 = Timeticks: (38) 0:00:00.38
iso.3.6.1.2.1.25.1.1.0 = Timeticks: (487703) 1:21:17.03
iso.3.6.1.2.1.25.1.2.0 = Hex-STRING: 07 E9 0B 1E 0C 27 38 00 2B 00 00 
iso.3.6.1.2.1.25.1.3.0 = INTEGER: 393216
iso.3.6.1.2.1.25.1.4.0 = STRING: "BOOT_IMAGE=/vmlinuz-5.4.0-90-generic root=/dev/mapper/ubuntu--vg-ubuntu--lv ro ipv6.disable=1 maybe-ubiquity
"
iso.3.6.1.2.1.25.1.5.0 = Gauge32: 0
iso.3.6.1.2.1.25.1.6.0 = Gauge32: 159
iso.3.6.1.2.1.25.1.7.0 = INTEGER: 0
iso.3.6.1.2.1.25.1.7.1.1.0 = INTEGER: 1
iso.3.6.1.2.1.25.1.7.1.2.1.2.6.66.65.67.75.85.80 = STRING: "/opt/tom-recovery.sh"
iso.3.6.1.2.1.25.1.7.1.2.1.3.6.66.65.67.75.85.80 = STRING: "tom NMds732Js2761"
iso.3.6.1.2.1.25.1.7.1.2.1.4.6.66.65.67.75.85.80 = ""
iso.3.6.1.2.1.25.1.7.1.2.1.5.6.66.65.67.75.85.80 = INTEGER: 5
iso.3.6.1.2.1.25.1.7.1.2.1.6.6.66.65.67.75.85.80 = INTEGER: 1
iso.3.6.1.2.1.25.1.7.1.2.1.7.6.66.65.67.75.85.80 = INTEGER: 1
iso.3.6.1.2.1.25.1.7.1.2.1.20.6.66.65.67.75.85.80 = INTEGER: 4
iso.3.6.1.2.1.25.1.7.1.2.1.21.6.66.65.67.75.85.80 = INTEGER: 1
iso.3.6.1.2.1.25.1.7.1.3.1.1.6.66.65.67.75.85.80 = STRING: "chpasswd: (user tom) pam_chauthtok() failed, error:"
iso.3.6.1.2.1.25.1.7.1.3.1.2.6.66.65.67.75.85.80 = STRING: "chpasswd: (user tom) pam_chauthtok() failed, error:
Authentication token manipulation error
chpasswd: (line 1, user tom) password not changed
Changing password for tom."
iso.3.6.1.2.1.25.1.7.1.3.1.3.6.66.65.67.75.85.80 = INTEGER: 4
iso.3.6.1.2.1.25.1.7.1.3.1.4.6.66.65.67.75.85.80 = INTEGER: 1
iso.3.6.1.2.1.25.1.7.1.4.1.2.6.66.65.67.75.85.80.1 = STRING: "chpasswd: (user tom) pam_chauthtok() failed, error:"
iso.3.6.1.2.1.25.1.7.1.4.1.2.6.66.65.67.75.85.80.2 = STRING: "Authentication token manipulation error"
iso.3.6.1.2.1.25.1.7.1.4.1.2.6.66.65.67.75.85.80.3 = STRING: "chpasswd: (line 1, user tom) password not changed"
iso.3.6.1.2.1.25.1.7.1.4.1.2.6.66.65.67.75.85.80.4 = STRING: "Changing password for tom."
iso.3.6.1.2.1.25.1.7.1.4.1.2.6.66.65.67.75.85.80.4 = No more variables left in this MIB View (It is past the end of the MIB tree)
```

Nous voyons ces deux lignes qui sont très intéressante :

```bash
iso.3.6.1.2.1.25.1.7.1.2.1.2.6.66.65.67.75.85.80 = STRING: "/opt/tom-recovery.sh"
iso.3.6.1.2.1.25.1.7.1.2.1.3.6.66.65.67.75.85.80 = STRING: "tom NMds732Js2761"
```

Et un peu plus bas on y voit que cet utilisateur n'a pas changé de mot de passe

Maintenant que nous avons un nom d'utilisateur et un mot de passe nous allons pouvoir les utiliser sur les services comme IMAP ou POP3

```bash
a LOGIN tom NMds732Js2761
a OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE SORT SORT=DISPLAY THREAD=REFERENCES THREAD=REFS THREAD=ORDEREDSUBJECT MULTIAPPEND URL-PARTIAL CATENATE UNSELECT CHILDREN NAMESPACE UIDPLUS LIST-EXTENDED I18NLEVEL=1 CONDSTORE QRESYNC ESEARCH ESORT SEARCHRES WITHIN CONTEXT=SEARCH LIST-STATUS BINARY MOVE SNIPPET=FUZZY PREVIEW=FUZZY LITERAL+ NOTIFY SPECIAL-USE] Logged in
a LIST "" ""
* LIST (\Noselect) "." ""
a OK List completed (0.001 + 0.000 secs).
a LIST "" *
* LIST (\HasNoChildren) "." Notes
* LIST (\HasNoChildren) "." Meetings
* LIST (\HasNoChildren \UnMarked) "." Important
* LIST (\HasNoChildren) "." INBOX
a OK List completed (0.006 + 0.000 + 0.005 secs).
```

Maintenant nous sommes connecté en tant que `tom` et nous voyons tout les différents dossiers auquels nous avons accès qui sont `Notes`, `Mettings`, `Important` et `INBOX` mais ce qui va surement nous intéresser sera l'INBOX et Important qui pourrait contenir des informations précieuses

```bash
a SELECT INBOX
* FLAGS (\Answered \Flagged \Deleted \Seen \Draft)
* OK [PERMANENTFLAGS (\Answered \Flagged \Deleted \Seen \Draft \*)] Flags permitted.
* 1 EXISTS
* 0 RECENT
* OK [UIDVALIDITY 1636509064] UIDs valid
* OK [UIDNEXT 2] Predicted next UID
a OK [READ-WRITE] Select completed (0.008 + 0.000 + 0.007 secs).
a FETCH 1 BODY[]
* 1 FETCH (BODY[] {3661}
HELO dev.inlanefreight.htb
MAIL FROM:<tech@dev.inlanefreight.htb>
RCPT TO:<bob@inlanefreight.htb>
DATA
From: [Admin] <tech@inlanefreight.htb>
To: <tom@inlanefreight.htb>
Date: Wed, 10 Nov 2010 14:21:26 +0200
Subject: KEY

-----BEGIN OPENSSH PRIVATE KEY-----
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
-----END OPENSSH PRIVATE KEY-----
)
```

Donc d'abors je sélectionne l'INBOX avec `a SELECT INBOX` et ensuite je l'affiche avec `a FETCH 1 BODY[]`

Nous avons une clé ssh et le mail semble être pour l'utilisateur `tom` donc nous pouvons mettre la clé ssh dans un fichier, le `chmod 600 ssh_key` et se connecter

```bash
└──╼ [★]$ ssh -i ssh_key tom@10.129.202.20
```

Maintenant nous sommes connecté en tant que `tom` en ssh

```bash
tom@NIXHARD:~$ ls -a
.   .bash_history  .bashrc  mail     .mysql_history  .ssh
..  .bash_logout   .cache   Maildir  .profile        .viminfo
```

Nous voyons un fichier `.bash_history` pour voir ce que l'utilisateur a fait comme commande avant notre passage qui pourrait nous donner des indices

```bash
tom@NIXHARD:~$ cat .bash_history 
mysql -u tom -p
ssh-keygen -t rsa -b 4096
ls
ls -al
cd .ssh/
ls
cd mail/
ls
ls -al
cd .imap/
ls
cd Important/
ls
set term=xterm
vim key
cat ~/.ssh/id_rsa
vim key
ls
mv key ..
cd ..
ls
mv key Important/
mv Important/key ../
cd ..
ls
ls -l
id
cat /etc/passwd
ls
cd mail/
ls
ls -al
cd mail/
ls
rm Meetings 
rm TESTING Important 
ls -l
cd ..
ls -al
mv mail/key Maildir/.Important/new/
mv Maildir/.Important/new/key Maildir/new/
cd Maildir/new/
ls
cd ..
tree .
cat cur/key
cd cur/
ls
ls -al
cat "key:2,"
mysql -u tom -p 
mysql -u tom -p
```

Nous voyons beaucoup de références par rapport a la commande `mysql -u tom -p` donc nous allons aussi essayer de l'exécuter

```bash
tom@NIXHARD:~$ mysql -u tom -p
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.27-0ubuntu0.20.04.1 (Ubuntu)

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```

Bien maintenant nous sommes dans mysql, observons ce qu'il y a

```bash
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| users              |
+--------------------+
5 rows in set (0.01 sec)
```

```bash
mysql> use users;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
```

Et maintenant on peut afficher son contenu avec la commande `select * from users;`

```bash
+------+-------------------+------------------------------+
| id   | username          | password                     |
+------+-------------------+------------------------------+
|    1 | ppavlata0         | 6znAfvTbB2                   |
|    2 | ktofanini1        | TP2NxFD62e                   |
|    3 | rallwell2         | t1t7WaqvEfv                  |
|    4 | efernier3         | ZRYOBO9PI                    |
|    5 | fpoon4            | 5Spyx2Jb                     |
|    6 | jgurnell5         | LMCnWKD                      |
|    7 | aminter6          | ngCyGg3                      |
|    8 | dwattinham7       | H2bpGC5                      |
|    9 | ddumphreys8       | eGek5Q8                      |
|   10 | etookey9          | kXBd88ZX                     |
|   11 | mlindbacka        | H9uTnIvli92                  |
|   12 | awebbeb           | RALeM2IfuwA                  |
|   13 | tswannellc        | oHdZWwO9                     |
|   14 | slydiattd         | r3wRgn                       |
|   15 | cparslowe         | nVdJAHr                      |
|   16 | sheartfieldf      | ofTf0hE7OL                   |
|   17 | aalvesg           | diTzuE                       |
|   18 | eshilstoneh       | NVSRa5L8Lx                   |
|   19 | eludovicoi        | w2uUtLGYkDi                  |
|   20 | rcoppenhallj      | 8T1AO16C4pm                  |
|   21 | rfuxmank          | oOVWyPyo                     |
|   22 | tmoraledal        | CDNj7KH                      |
|   23 | vdurdanm          | KBM4BTldF                    |
|   24 | mlandisn          | oCOZcC                       |
|   25 | gfancutto         | RNHlBaFKLLt                  |
|   26 | dfigliovannip     | Cf7T9osx                     |
|   27 | ngoedeq           | eDfTnH                       |
|   28 | abalhamr          | Qc2Tia0zM                    |
|   29 | tmartys           | VC65xd6o                     |
|   30 | sallewellt        | Y5VSv1rm                     |
|   31 | mjoveyu           | ej3amn                       |
|   32 | mgoodlifev        | lCbzNIw7B90                  |
|   33 | gmargeramw        | hbVF2G                       |
|   34 | leberlex          | Nj6UCAQ                      |
|   35 | mtrimbyy          | jfNkfg5ZW                    |
|   36 | mkimmz            | pZZepTCVlkN                  |
|   37 | mflaunier10       | 9TZ8mfLA                     |
|   38 | vgomes11          | qM6nHjMtD                    |
|   39 | sbrimham12        | FoXudHc4Ocr                  |
|   40 | cbendle13         | zFUIGVBx                     |
|   41 | ralgeo14          | YTB8IXOk                     |
|   42 | rsandyfirth15     | vARbkPRQv                    |
|   43 | bcarlesi16        | m4H6q6pH                     |
|   44 | cfrude17          | Za8UHiSe25N                  |
|   45 | rjullian18        | 6QyxSjg                      |
|   46 | bgissing19        | fjes6w8Ovw0                  |
|   47 | limore1a          | gVzkv8syQ                    |
|   48 | scarlisle1b       | sR9rPBL5                     |
|   49 | hamoss1c          | tbmK9XBhn57j                 |
|   50 | cradmore1d        | TQkfKxEl7                    |
|   51 | apetican1e        | ABibihOvMOu                  |
|   52 | eweber1f          | sEDynNORm7b                  |
|   53 | nbockmaster1g     | M1tVaH                       |
|   54 | cianne1h          | Vc8agpinq                    |
|   55 | khatchette1i      | xXOnQFOsF0I                  |
|   56 | tkroger1j         | uisR7g1eVEU                  |
|   57 | sgladtbach1k      | iIVQ4l                       |
|   58 | bmockford1l       | BBsZPmwk0r                   |
|   59 | balabone1m        | aTUbGm0                      |
|   60 | jmantripp1n       | DTVAdvbadbA2                 |
|   61 | tchown1o          | dCulXiBc                     |
|   62 | vconradsen1p      | v5E0sgqzo                    |
|   63 | hfudge1q          | cSODbEMtCm                   |
|   64 | syaneev1r         | ilXo6tKGHY7                  |
|   65 | btheyer1s         | LxNk1t                       |
|   66 | fcahn1t           | oSBmcLx                      |
|   67 | edurrington1u     | LMomwfQkq3                   |
|   68 | kcounter1v        | 1zUE6RHS                     |
|   69 | bqueripel1w       | 0A2OfeQPnhd                  |
|   70 | mnacci1x          | lNyUiY8U4t                   |
|   71 | dcabell1y         | W6Q7R3zsxB                   |
|   72 | ctaleworth1z      | d3JWwTj                      |
|   73 | mmcgrah20         | yPxlvhS                      |
|   74 | jgannaway21       | oGfIrDxkSIo                  |
|   75 | eiacovone22       | 8jKlhgvC                     |
|   76 | rnaughton23       | Gyf6awYCm4                   |
|   77 | adobbins24        | ashZ0G                       |
|   78 | pwarbeys25        | nSmfKSYW9GL                  |
|   79 | bbrabbins26       | YZWuH6D8Q                    |
|   80 | adandy27          | dF1VPsn                      |
|   81 | mfarrens28        | ucPclA8K9c                   |
|   82 | dhaysar29         | MeGzIGeyKXyw                 |
|   83 | efoot2a           | Q2ks5eg                      |
|   84 | tpelosi2b         | 8yjhdx                       |
|   85 | binman2c          | 3uO3PeL8e                    |
|   86 | krait2d           | EFD5FpEtu2                   |
|   87 | jcrook2e          | VFsdmvhDz4O                  |
|   88 | falonso2f         | 4ifO54                       |
|   89 | jmacak2g          | KUDAxTXU                     |
|   90 | nnorville2h       | WCYa9C1G                     |
|   91 | tlevington2i      | If46bHoGr                    |
|   92 | abartak2j         | erFX4u0e0                    |
|   93 | jgoad2k           | gunnsPy1pMCd                 |
|   94 | dwadham2l         | 89IiRFy0frst                 |
|   95 | hvenditti2m       | NS0U18XON                    |
|   96 | gpitchers2n       | j7RVE2                       |
|   97 | aiskowitz2o       | 8iVpSQUEXn2K                 |
|   98 | gcars2p           | 8i3nsQU9wp                   |
|   99 | bjacke2q          | 2PtrA0C                      |
|  100 | fstorton2r        | XmjbfR1vK1                   |
|  101 | pbrinded2s        | Jf9uWJ                       |
|  102 | penriques2t       | o3kmQ5zHF5Qb                 |
|  103 | awinckworth2u     | LEwOydD3nncQ                 |
|  104 | lkinsell2v        | kvoIZupHNt                   |
|  105 | wdavisson2w       | nk5HVS                       |
|  106 | rrenzini2x        | LiCJccRxumYU                 |
|  107 | kdavys2y          | ZXpRVEn                      |
|  108 | ravann2z          | YLkKN4JzzM                   |
|  109 | hrallings30       | 6wS4x0IeLW                   |
|  110 | sbrackpool31      | lBa8AVaPQg                   |
|  111 | epulham32         | yIV88FM9DM                   |
|  112 | mspeachley33      | JSa9aUv1h                    |
|  113 | vforkan34         | 26Q6gTgsOE8T                 |
|  114 | jprichard35       | sggVPPMfRA3T                 |
|  115 | abisatt36         | GcSlKIuky                    |
|  116 | todocherty37      | BwSfFV3qj                    |
|  117 | njayne38          | D8yr44NNQ                    |
|  118 | gwhyman39         | h0WJ4p2F2x8                  |
|  119 | lkristoffersson3a | mARndSF                      |
|  120 | lmcallan3b        | gmpkAKF                      |
|  121 | kdouble3c         | qYtstjmdR                    |
|  122 | sgooding3d        | venooIUMMHE                  |
|  123 | lgaffney3e        | 1fCwgoaCtz                   |
|  124 | emuriel3f         | Wz582Y22                     |
|  125 | mlamasna3g        | MhqsPNMRYwJE                 |
|  126 | omander3h         | CuB3JbXJ                     |
|  127 | fropkes3i         | jVBeawjIPXS                  |
|  128 | mhawk3j           | g0sPpI8                      |
|  129 | wseres3k          | zgsXeR7blA                   |
|  130 | bflaws3l          | 0dTvgBkaFYqi                 |
|  131 | ccyson3m          | EtCscA                       |
|  132 | afowell3n         | cRG0x5                       |
|  133 | jmolian3o         | fCwa9ry                      |
|  134 | gterzo3p          | Srv77g                       |
|  135 | ravrahamy3q       | dFjfFMEJ                     |
|  136 | amaden3r          | n1WAtKT                      |
|  137 | gdeverall3s       | 1Vj3bbr                      |
|  138 | ejansema3t        | 4MyiArdEVq                   |
|  139 | snormanville3u    | l1s9Ao9omd                   |
|  140 | nfinder3v         | Rd1POwc3                     |
|  141 | lrodway3w         | UNW82GQfd0q                  |
|  142 | lstening3x        | JaSkROwU83UB                 |
|  143 | hemer3y           | GlPpKB                       |
|  144 | eblamphin3z       | 7Zjz7RvcC9x                  |
|  145 | lwederell40       | eyWsJl                       |
|  146 | nverick41         | Mr1r2H                       |
|  147 | mlawlie42         | XrHEZJbuUd                   |
|  148 | swahlberg43       | 46gOiZ                       |
|  149 | crubinivitz44     | FLlYii1mQz84                 |
|  150 | HTB               | cr3n4o7rzse7rzhnckhssncif7ds |
|  151 | wdoswell46        | FYXMuelBVcS                  |
|  152 | ccollingwood47    | LM6SU2N3w7KQ                 |
|  153 | nfoux48           | N40DfFww                     |
|  154 | gboyat49          | W1LDy7                       |
|  155 | csuddick4a        | UIGXl3lL                     |
|  156 | tmatieu4b         | c5PYl7yfJi                   |
|  157 | ielsy4c           | 3hLC705Oj                    |
|  158 | ebotwood4d        | aQmW5c7                      |
|  159 | gcirlos4e         | SPsU9obCa                    |
|  160 | smucklestone4f    | Ho96mUx                      |
|  161 | hdain4g           | BGMRtb                       |
|  162 | dmcquillin4h      | 37kwHEdFhAlL                 |
|  163 | gfolan4i          | 1d9kcofM                     |
|  164 | gtamlett4j        | 4HlL18RM37l3                 |
|  165 | cchapelle4k       | xezsRgOt8OW8                 |
|  166 | channy4l          | 68lHKp                       |
|  167 | ffennick4m        | jNLpCeyoYY                   |
|  168 | mmcgarrell4n      | Ttvat7WvkI                   |
|  169 | mmcdowell4o       | jfOR6B                       |
|  170 | sconquer4p        | ase5Qid5vWD                  |
|  171 | hskune4q          | UUoqC30g5w                   |
|  172 | mblasli4r         | dcjNDHzrA                    |
|  173 | sefford4s         | ui0r4FKwD38                  |
|  174 | gscotter4t        | f2vUKUzHLmEW                 |
|  175 | nmenhenitt4u      | gXHceINuKdF                  |
|  176 | laldridge4v       | 7o4agC3m                     |
|  177 | rlingner4w        | 8mYREIR7                     |
|  178 | mmcfall4x         | sd3N0GDK                     |
|  179 | smoscon4y         | BCPAyKFkKKL                  |
|  180 | ggillespey4z      | LHyQ7f4Br                    |
|  181 | onewberry50       | aKdinUPQ9r                   |
|  182 | dinsley51         | hy8agAF9c4VS                 |
|  183 | mcommon52         | Buh2VR                       |
|  184 | bmosdill53        | IgNAGOBrzlu                  |
|  185 | rrobart54         | SkBqsiQGSK                   |
|  186 | hdurrance55       | 1cljoZoy7Fc                  |
|  187 | hwinterflood56    | F9PH0X0                      |
|  188 | jbier57           | Ug88Nd37N96v                 |
|  189 | hmaccumeskey58    | 3rb3rz2kq2                   |
|  190 | orangell59        | IWz01iHsv                    |
|  191 | velsie5a          | mWcslVm2                     |
|  192 | igeorgelin5b      | 6WHS6OS                      |
|  193 | rrushsorth5c      | hXiQn9bW6W                   |
|  194 | mbrucker5d        | cT5Z6K                       |
|  195 | darnull5e         | EzagIo6Sd                    |
|  196 | jparkhouse5f      | HCEchNzf                     |
|  197 | smcgunley5g       | 9ivT96O                      |
|  198 | ssoal5h           | qi6WX7TGIA                   |
|  199 | npeak5i           | 3gR7Iuc0                     |
|  200 | mleidl5j          | qwfjY9RGk6                   |
+------+-------------------+------------------------------+
200 rows in set (0.00 sec)
```

Et nous pouvons y retrouver le mot de passe de l'utilisateur `HTB` qui est le suivant:

**Réponse :** `cr3n4o7rzse7rzhnckhssncif7ds`

**Cours complété**

{% include comments.html %}