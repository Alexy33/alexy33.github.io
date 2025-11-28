---
title: "HackTheBox - Footprinting - Remote management protocols"
date: 2025-11-28 16:04:00 +0200
categories: [HackTheBox, Learning]
tags: [ssh, rsync, r-services, remote-management, linux, enumeration, penetration-testing]
description: "Mon apprentissage des protocoles de gestion à distance sous Linux : SSH, Rsync et R-Services"
image:
  path: /assets/img/posts/footprinting-introduction.png
  alt: "Linux Remote Management Protocols"
---

## Informations sur le module

Ce module couvre les protocoles essentiels pour la gestion à distance des systèmes Linux. J'ai exploré SSH, Rsync et les R-Services, en analysant leurs configurations, leurs vulnérabilités potentielles et comment les énumérer durant un pentest.

**Lien :** [Linux Remote Management Protocols](https://academy.hackthebox.com/beta/module/112/section/1240)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre et énumérer le protocole SSH et ses méthodes d'authentification
- Identifier les configurations SSH dangereuses
- Énumérer et exploiter Rsync pour extraire des fichiers
- Comprendre les R-Services et leurs failles de sécurité inhérentes
- Abuser des fichiers de confiance (hosts.equiv et .rhosts) pour obtenir un accès non autorisé

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Linux Remote Management Protocols

### Pourquoi la gestion à distance est essentielle

Dans le monde Linux, gérer des serveurs à distance est une nécessité quotidienne. Imaginez devoir aider un collègue bloqué par une erreur sur un serveur situé dans une autre ville. Impossible de tout faire par téléphone, il faut pouvoir se connecter directement au système.

> **Pour les débutants** : La gestion à distance permet de contrôler un serveur Linux comme si vous étiez physiquement devant, mais depuis n'importe où via le réseau.
{: .prompt-info}

Ces protocoles sont omniprésents sur les serveurs publics, ce qui en fait des cibles privilégiées en pentest. Une mauvaise configuration peut ouvrir la porte à un accès complet au système.

### SSH - Secure Shell

#### Ce que j'ai compris du protocole

SSH permet d'établir une connexion chiffrée entre deux machines sur le port TCP 22 par défaut. C'est crucial pour empêcher l'interception de données sensibles sur le réseau.

> **Pour les débutants** : SSH est comme un tunnel sécurisé entre deux ordinateurs. Toutes les données qui passent dedans sont chiffrées et illisibles pour un attaquant qui intercepterait la communication.
{: .prompt-info}

L'avantage principal : SSH fonctionne sur tous les systèmes d'exploitation courants (Linux, MacOS, Windows avec un client approprié). Le serveur OpenSSH est open-source et largement déployé.

#### Les deux versions du protocole

Il existe SSH-1 et SSH-2. **SSH-2 est bien supérieur** en termes de chiffrement, vitesse, stabilité et sécurité. SSH-1 est notamment vulnérable aux attaques Man-in-the-Middle (MITM), contrairement à SSH-2.

Pour en savoir plus sur SSH : [RFC 4251 - SSH Protocol Architecture](https://www.rfc-editor.org/rfc/rfc4251)

#### Les méthodes d'authentification

OpenSSH propose six méthodes d'authentification différentes :

- Authentification par mot de passe
- Authentification par clé publique
- Authentification basée sur l'hôte
- Authentification par clavier
- Authentification challenge-response
- Authentification GSSAPI

J'ai approfondi l'authentification par clé publique car c'est la plus sécurisée et la plus utilisée.

#### Authentification par clé publique : comment ça marche

Le principe repose sur une paire de clés : publique et privée.

**Étape 1 : Authentification mutuelle**

Quand je me connecte à un serveur SSH pour la première fois, celui-ci m'envoie sa clé publique d'hôte. Mon client SSH vérifie cette clé pour s'assurer de l'identité du serveur.

> Le seul moment où il y a un risque d'interception est lors de cette première connexion. C'est pourquoi SSH affiche un avertissement nous demandant de vérifier l'empreinte de la clé.
{: .prompt-warning}

**Étape 2 : Ma clé privée reste secrète**

Sur mon poste local, je génère une paire de clés. La clé privée reste **exclusivement** sur ma machine et est protégée par une passphrase. La clé publique est copiée sur le serveur.

**Étape 3 : Le challenge cryptographique**

Quand je me connecte, le serveur crée un défi cryptographique avec ma clé publique et me l'envoie. Je déchiffre ce défi avec ma clé privée, renvoie la solution, et prouve ainsi mon identité.

**Avantage majeur** : Je n'entre la passphrase qu'une seule fois par session, puis je peux me connecter à autant de serveurs que je veux sans la ressaisir.

#### Configuration par défaut d'OpenSSH

J'ai examiné le fichier de configuration sur mon système :
```bash
cat /etc/ssh/sshd_config | grep -v "#" | sed -r '/^\s*$/d'
```

**Résultat :**
```
Include /etc/ssh/sshd_config.d/*.conf
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding yes
PrintMotd no
AcceptEnv LANG LC_*
Subsystem       sftp    /usr/lib/openssh/sftp-server
```

**Mon observation** : La majorité des paramètres sont commentés par défaut. Il faut une configuration manuelle pour sécuriser correctement le serveur.

#### Configurations dangereuses à éviter

| Paramètre | Description | Pourquoi c'est dangereux |
|-----------|-------------|--------------------------|
| `PasswordAuthentication yes` | Active l'authentification par mot de passe | Vulnérable au brute-force |
| `PermitEmptyPasswords yes` | Autorise les mots de passe vides | Accès sans authentification |
| `PermitRootLogin yes` | Permet la connexion directe en root | Accès administrateur total si compromis |
| `Protocol 1` | Utilise l'ancien protocole SSH-1 | Vulnérable aux attaques MITM |
| `X11Forwarding yes` | Active le transfert X11 | Vulnérabilité d'injection de commande (CVE-2016-3115) |

> L'authentification par mot de passe est particulièrement risquée. Les humains créent des mots de passe prévisibles (ex: "Password123!") et les attaquants utilisent des patterns pour les deviner.
{: .prompt-danger}

#### Énumération du service SSH

J'ai utilisé l'outil `ssh-audit` pour analyser un serveur :
```bash
git clone https://github.com/jtesta/ssh-audit.git && cd ssh-audit
./ssh-audit.py 10.129.14.132
```

**Résultat partiel :**
```
# general
(gen) banner: SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.3
(gen) software: OpenSSH 8.2p1
(gen) compatibility: OpenSSH 7.4+, Dropbear SSH 2018.76+

# key exchange algorithms
(kex) ecdh-sha2-nistp256    -- [fail] using weak elliptic curves
(kex) ecdh-sha2-nistp384    -- [fail] using weak elliptic curves

# host-key algorithms
(key) ssh-rsa (3072-bit)    -- [fail] using weak hashing algorithm
```

**Ce que j'ai remarqué** : Le banner révèle immédiatement la version d'OpenSSH (8.2p1). Les anciennes versions comportent des vulnérabilités connues comme CVE-2020-14145 qui permet des attaques MITM lors de la connexion initiale.

Documentation complète de ssh-audit : [GitHub - ssh-audit](https://github.com/jtesta/ssh-audit)

#### Identifier les méthodes d'authentification disponibles

J'ai testé une connexion en mode verbeux pour voir quelles méthodes le serveur accepte :
```bash
ssh -v cry0l1t3@10.129.14.132
```

**Résultat :**
```
OpenSSH_8.2p1 Ubuntu-4ubuntu0.3, OpenSSL 1.1.1f  31 Mar 2020
debug1: Authentications that can continue: publickey,password,keyboard-interactive
```

**Mon observation** : Le serveur accepte trois méthodes. Pour un brute-force ciblé, je peux forcer l'utilisation d'une méthode spécifique :
```bash
ssh -v cry0l1t3@10.129.14.132 -o PreferredAuthentications=password
```

#### Interpréter les banners SSH

Durant mes pentests, j'ai appris à lire les banners SSH :

- `SSH-1.99-OpenSSH_3.9p1` → Supporte SSH-1 ET SSH-2, serveur OpenSSH 3.9p1
- `SSH-2.0-OpenSSH_8.2p1` → Supporte UNIQUEMENT SSH-2, serveur OpenSSH 8.2p1

> Le numéro de version exacte du serveur SSH est une information précieuse pour rechercher des exploits spécifiques.
{: .prompt-tip}

### Rsync - Synchronisation de fichiers

#### Ce que fait Rsync

Rsync est un outil puissant pour copier des fichiers localement ou à distance. Ce qui le rend unique : son algorithme de transfert différentiel.

> **Pour les débutants** : Au lieu de transférer un fichier entier, Rsync n'envoie que les parties qui ont changé. C'est comme envoyer uniquement les pages modifiées d'un document au lieu du document complet.
{: .prompt-info}

**Caractéristiques** :
- Port par défaut : TCP 873
- Peut utiliser SSH pour sécuriser les transferts
- Souvent utilisé pour les sauvegardes et la synchronisation

En pentest, Rsync est intéressant car on peut parfois lister et télécharger des fichiers **sans authentification**.

#### Énumération basique

J'ai d'abord scanné pour confirmer la présence de Rsync :
```bash
sudo nmap -sV -p 873 127.0.0.1
```

**Résultat :**
```
PORT    STATE SERVICE VERSION
873/tcp open  rsync   (protocol version 31)
```

**Mon observation** : Le service utilise le protocole version 31.

#### Lister les partages accessibles

J'ai utilisé netcat pour interroger le service :
```bash
nc -nv 127.0.0.1 873
```

**Résultat :**
```
@RSYNCD: 31.0
@RSYNCD: 31.0
#list
dev             Dev Tools
@RSYNCD: EXIT
```

**Ce que j'ai découvert** : Un partage nommé "dev" est disponible. Je peux l'énumérer en détail :
```bash
rsync -av --list-only rsync://127.0.0.1/dev
```

**Résultat :**
```
receiving incremental file list
drwxr-xr-x             48 2022/09/19 09:43:10 .
-rw-r--r--              0 2022/09/19 09:34:50 build.sh
-rw-r--r--              0 2022/09/19 09:36:02 secrets.yaml
drwx------             54 2022/09/19 09:43:10 .ssh
```

**Analyse critique** : Je vois des fichiers potentiellement intéressants :
- `secrets.yaml` → Pourrait contenir des credentials
- `.ssh/` → Probablement des clés SSH privées

Pour tout télécharger :
```bash
rsync -av rsync://127.0.0.1/dev .
```

#### Rsync via SSH

Si Rsync est configuré pour utiliser SSH, j'adapte mes commandes :
```bash
rsync -av -e ssh user@target:/path/to/files .
```

Pour un port SSH non-standard :
```bash
rsync -av -e "ssh -p2222" user@target:/path/to/files .
```

Guide détaillé : [Rsync over SSH](https://linux.die.net/man/1/rsync)

### R-Services - Les protocoles obsolètes

#### Qu'est-ce que les R-Services ?

Les R-Services sont une suite de services Unix pour l'accès distant développés par l'Université de Berkeley. Ils ont été **remplacés par SSH** car ils transmettent tout en **clair** sur le réseau.

> **Pour les débutants** : Imaginez envoyer votre mot de passe sur une carte postale plutôt que dans une enveloppe scellée. C'est exactement le problème des R-Services : n'importe qui sur le réseau peut lire les informations échangées.
{: .prompt-danger}

Bien qu'obsolètes, je les rencontre encore sur des systèmes anciens (Solaris, HP-UX, AIX) durant les pentests internes.

#### Les commandes R-Services

| Commande | Daemon | Port | Description |
|----------|--------|------|-------------|
| `rcp` | rshd | 514/TCP | Copie de fichiers à distance |
| `rsh` | rshd | 514/TCP | Shell distant sans login |
| `rexec` | rexecd | 512/TCP | Exécution de commandes distantes |
| `rlogin` | rlogind | 513/TCP | Login distant (comme telnet) |

#### Énumération des R-Services

J'ai scanné les ports associés :
```bash
sudo nmap -sV -p 512,513,514 10.0.17.2
```

**Résultat :**
```
PORT    STATE SERVICE    VERSION
512/tcp open  exec?
513/tcp open  login?
514/tcp open  tcpwrapped
```

**Mon observation** : Les trois ports sont ouverts, le système utilise probablement les R-Services.

#### La faille critique : fichiers de confiance

Les R-Services utilisent deux fichiers pour définir les relations de confiance :

**1. `/etc/hosts.equiv` (configuration globale)**
```
# <hostname> <local username>
pwnbox cry0l1t3
```

**2. `.rhosts` (configuration par utilisateur)**
```
htb-student     10.0.17.5
+               10.0.17.10
+               +
```

**Le modificateur `+` est dangereux** :
- `+ 10.0.17.10` → N'importe quel utilisateur depuis 10.0.17.10 est de confiance
- `+ +` → N'importe quel utilisateur depuis n'importe quelle IP est de confiance

> Cette configuration contourne complètement l'authentification PAM. Un attaquant peut se connecter sans mot de passe si ces fichiers sont mal configurés.
{: .prompt-danger}

#### Exploitation avec rlogin

J'ai testé une connexion en utilisant une mauvaise configuration :
```bash
rlogin 10.0.17.2 -l htb-student
```

**Résultat :**
```
Last login: Fri Dec  2 16:11:21 from localhost

[htb-student@localhost ~]$
```

**Succès** : Je me suis connecté sans mot de passe grâce à la mauvaise configuration du fichier `.rhosts`.

#### Énumérer les utilisateurs connectés

**Avec rwho** (requêtes UDP sur le port 513) :
```bash
rwho
```

**Résultat :**
```
root     web01:pts/0 Dec  2 21:34
htb-student     workstn01:tty1  Dec  2 19:57  2:25
```

**Avec rusers** (informations détaillées) :
```bash
rusers -al 10.0.17.5
```

**Résultat :**
```
htb-student     10.0.17.5:console          Dec 2 19:57     2:25
```

**Mon analyse** : Ces commandes révèlent les utilisateurs actifs et leurs sessions. Utile pour identifier des cibles potentielles durant un pentest.

### Réflexions finales

Les services de gestion à distance sont des mines d'informations en pentest. Que ce soit SSH mal configuré, Rsync accessible sans authentification, ou les R-Services obsolètes mais encore présents, chacun peut mener à un accès non autorisé.

**Mes leçons clés** :
- Toujours énumérer en profondeur ces services
- Tester la réutilisation de credentials trouvés ailleurs
- Ne jamais sous-estimer l'importance d'une bonne configuration

---

## Windows Remote Management Protocols

### La gestion à distance sous Windows

Depuis Windows Server 2016, la gestion à distance est activée par défaut. Cette fonctionnalité s'appuie sur le protocole WS-Management et permet d'administrer les serveurs Windows à distance via trois composants principaux.

Les trois piliers de la gestion à distance Windows :

- **RDP** (Remote Desktop Protocol)
- **WinRM** (Windows Remote Management)  
- **WMI** (Windows Management Instrumentation)

> **Pour les débutants** : Ces protocoles permettent de contrôler des serveurs Windows à distance, comme si vous étiez physiquement devant la machine. Chacun a ses spécificités et cas d'usage.
{: .prompt-info}

### RDP - Remote Desktop Protocol

#### Le fonctionnement de RDP

RDP est le protocole développé par Microsoft pour l'accès distant aux machines Windows. Il transmet les commandes d'affichage et de contrôle via une interface graphique chiffrée sur les réseaux IP.

**Caractéristiques techniques** :
- Fonctionne au niveau de la couche application (modèle TCP/IP)
- Port par défaut : TCP 3389
- Peut également utiliser UDP 3389 pour l'administration distante

#### Les prérequis pour établir une session RDP

Pour qu'une session RDP fonctionne, j'ai appris que plusieurs conditions doivent être réunies :

1. Le firewall réseau doit autoriser les connexions entrantes
2. Le firewall du serveur doit être configuré correctement
3. Si NAT est utilisé (connexions Internet), le serveur a besoin de l'IP publique
4. Le port forwarding doit être configuré sur le routeur NAT

> **Pour les débutants** : NAT (Network Address Translation) est une technique qui permet à plusieurs machines d'un réseau local de partager une seule adresse IP publique pour accéder à Internet.
{: .prompt-info}

#### La sécurité de RDP : TLS/SSL

Depuis Windows Vista, RDP supporte TLS/SSL, ce qui signifie que toutes les données, notamment le processus de connexion, sont bien chiffrées. **Mais attention** : beaucoup de systèmes Windows n'imposent pas ce chiffrement et acceptent encore l'ancien "RDP Security" qui est inadéquat.

**Le problème des certificats auto-signés** :

Par défaut, RDP utilise des certificats auto-signés. Le client ne peut pas distinguer un certificat légitime d'un faux, ce qui génère simplement un avertissement pour l'utilisateur.

> Cette faiblesse rend RDP vulnérable aux attaques Man-in-the-Middle si l'utilisateur accepte le certificat sans vérification.
{: .prompt-warning}

#### NLA - Network Level Authentication

Le service Remote Desktop est installé par défaut sur les serveurs Windows et peut être activé via Server Manager. Par défaut, seules les connexions avec NLA (Network Level Authentication) sont autorisées.

> NLA force l'authentification avant même d'établir la session RDP complète, ce qui ajoute une couche de sécurité supplémentaire.
{: .prompt-tip}

#### Énumération du service RDP

J'ai utilisé Nmap avec des scripts NSE spécifiques pour collecter des informations sur un serveur RDP :
```bash
nmap -sV -sC 10.129.201.248 -p3389 --script rdp*
```

**Résultat :**
```
PORT     STATE SERVICE       VERSION
3389/tcp open  ms-wbt-server Microsoft Terminal Services
| rdp-enum-encryption: 
|   Security layer
|     CredSSP (NLA): SUCCESS
|     CredSSP with Early User Auth: SUCCESS
|_    RDSTLS: SUCCESS
| rdp-ntlm-info: 
|   Target_Name: ILF-SQL-01
|   NetBIOS_Domain_Name: ILF-SQL-01
|   NetBIOS_Computer_Name: ILF-SQL-01
|   DNS_Domain_Name: ILF-SQL-01
|   DNS_Computer_Name: ILF-SQL-01
|   Product_Version: 10.0.17763
|_  System_Time: 2021-11-06T13:46:00+00:00
```

**Mon analyse** :
- Le hostname est révélé : `ILF-SQL-01`
- NLA est activé (bon signe de sécurité)
- Version du produit : `10.0.17763` (Windows Server 2019)
- Les trois couches de sécurité sont supportées

Documentation complète sur RDP : [Microsoft RDP Documentation](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/welcome-to-rds)

#### Tracer les paquets RDP avec Nmap

J'ai utilisé l'option `--packet-trace` pour observer les échanges réseau en détail :
```bash
nmap -sV -sC 10.129.201.248 -p3389 --packet-trace --disable-arp-ping -n
```

**Ce qui m'a surpris** : Nmap utilise un cookie RDP spécifique (`mstshash=nmap`) pour interagir avec le serveur. Ce cookie peut être détecté par les systèmes EDR (Endpoint Detection and Response) et nous faire repérer durant un pentest.

**Extrait intéressant du trace** :
```
NSE: TCP 10.10.14.20:36630 > 10.129.201.248:3389 | 
00000000: 03 00 00 2a 25 e0 00 00 00 00 00 43 6f 6f 6b 69
00000010: 65 3a 20 6d 73 74 73 68 61 73 68 3d 6e 6d 61 70 
          e: mstshash=nmap
```

> Sur des réseaux durcis, ce comportement de Nmap peut nous faire bloquer. Il faut être conscient de cette signature.
{: .prompt-danger}

#### Analyse avancée avec rdp-sec-check

J'ai installé et utilisé l'outil `rdp-sec-check.pl` développé par Cisco CX Security Labs :

**Installation des dépendances** :
```bash
sudo cpan
cpan[1]> install Encoding::BER
```

**Analyse du serveur** :
```bash
git clone https://github.com/CiscoCXSecurity/rdp-sec-check.git && cd rdp-sec-check
./rdp-sec-check.pl 10.129.201.248
```

**Résultat détaillé** :
```
[+] Checking supported protocols

[-] Checking if RDP Security (PROTOCOL_RDP) is supported...Not supported - HYBRID_REQUIRED_BY_SERVER
[-] Checking if TLS Security (PROTOCOL_SSL) is supported...Not supported - HYBRID_REQUIRED_BY_SERVER
[-] Checking if CredSSP Security (PROTOCOL_HYBRID) is supported [uses NLA]...Supported

[+] Summary of protocol support

[-] 10.129.201.248:3389 supports PROTOCOL_SSL   : FALSE
[-] 10.129.201.248:3389 supports PROTOCOL_HYBRID: TRUE
[-] 10.129.201.248:3389 supports PROTOCOL_RDP   : FALSE
```

**Mon observation** : Ce serveur est bien configuré. Seul le protocole HYBRID (avec NLA) est accepté, les anciens protocoles non sécurisés sont désactivés. Aucune méthode de chiffrement faible n'est supportée.

Pour plus d'informations : [rdp-sec-check GitHub](https://github.com/CiscoCXSecurity/rdp-sec-check)

#### Se connecter via RDP sous Linux

Sous Linux, plusieurs clients RDP sont disponibles : xfreerdp, rdesktop ou Remmina. J'ai testé xfreerdp :
```bash
xfreerdp /u:cry0l1t3 /p:"P455w0rd!" /v:10.129.201.248
```

**Résultat de la connexion** :
```
[16:37:47:599] [WARN][com.freerdp.crypto] - Certificate verification failure 'self signed certificate (18)' at stack position 0
[16:37:47:599] [WARN][com.freerdp.crypto] - CN = ILF-SQL-01
[16:37:47:600] [ERROR][com.freerdp.crypto] - @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
[16:37:47:600] [ERROR][com.freerdp.crypto] - @           WARNING: CERTIFICATE NAME MISMATCH!           @
[16:37:47:600] [ERROR][com.freerdp.crypto] - @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

Certificate details for 10.129.201.248:3389 (RDP-Server):
        Common Name: ILF-SQL-01
        Thumbprint:  b7:5f:00:ca:91:00:0a:29:0c:b5:14:21:f3:b0:ca:9e:af:8c:62:d6:dc:f9:50:ec:ac:06:38:1f:c5:d6:a9:39

Do you trust the above certificate? (Y/T/N) y
```

**Mon analyse** : Le certificat auto-signé génère un avertissement, mais après acceptation, la connexion s'établit et j'obtiens un accès graphique complet au bureau du serveur.

### WinRM - Windows Remote Management

#### Comprendre WinRM

WinRM est un protocole de gestion à distance basé sur la ligne de commande, intégré nativement à Windows. Il utilise SOAP (Simple Object Access Protocol) pour établir des connexions avec les hôtes distants et leurs applications.

> **Pour les débutants** : SOAP est un protocole d'échange de messages structurés, souvent utilisé pour les services web. WinRM l'utilise pour envoyer des commandes à distance.
{: .prompt-info}

**Ports utilisés** :
- TCP 5985 (HTTP)
- TCP 5986 (HTTPS)

**Important** : Sur Windows 10 et versions ultérieures, WinRM doit être explicitement activé et configuré. Il est activé par défaut sur Windows Server 2012 et versions supérieures.

#### WinRS - Windows Remote Shell

WinRS est le composant qui permet d'exécuter des commandes arbitraires sur le système distant. Il est inclus par défaut depuis Windows 7.

Les services nécessitant WinRM :
- Sessions distantes PowerShell
- Fusion de journaux d'événements
- Gestion à distance via cmdlets PowerShell

#### Énumération de WinRM

J'ai scanné les ports WinRM avec Nmap :
```bash
nmap -sV -sC 10.129.201.248 -p5985,5986 --disable-arp-ping -n
```

**Résultat :**
```
PORT     STATE SERVICE VERSION
5985/tcp open  http    Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
```

**Mon observation** : Seul le port HTTP (5985) est ouvert. Le port HTTPS (5986) n'est pas utilisé, ce qui est courant mais moins sécurisé.

#### Se connecter via Evil-WinRM

Sous Linux, j'utilise `evil-winrm` pour interagir avec WinRM. C'est un outil de pentest spécialement conçu pour ce protocole :
```bash
evil-winrm -i 10.129.201.248 -u Cry0l1t3 -p P455w0rD!
```

**Résultat :**
```
Evil-WinRM shell v3.3

Info: Establishing connection to remote endpoint

*Evil-WinRM* PS C:\Users\Cry0l1t3\Documents>
```

**Succès** : J'obtiens un shell PowerShell distant sur le serveur cible. Je peux maintenant exécuter des commandes comme si j'étais localement sur la machine.

> Evil-WinRM offre des fonctionnalités avancées comme l'upload/download de fichiers et l'exécution de scripts PowerShell.
{: .prompt-tip}

Pour plus d'informations : [Evil-WinRM GitHub](https://github.com/Hackplayers/evil-winrm)

### WMI - Windows Management Instrumentation

#### Qu'est-ce que WMI ?

WMI est l'implémentation Microsoft du modèle CIM (Common Information Model), une fonctionnalité centrale de WBEM (Web-Based Enterprise Management) pour la plateforme Windows.

**Pourquoi WMI est crucial** :

WMI permet l'accès en lecture **ET** en écriture à presque tous les paramètres des systèmes Windows. C'est l'interface la plus critique pour l'administration et la maintenance à distance des machines Windows.

> **Pour les débutants** : WMI est comme une base de données géante contenant toutes les informations sur un système Windows : matériel, logiciels, services, utilisateurs, processus, etc. On peut non seulement consulter ces informations mais aussi les modifier.
{: .prompt-info}

#### Comment accéder à WMI

WMI est accessible via :
- PowerShell
- VBScript
- Windows Management Instrumentation Console (WMIC)

**Architecture de WMI** : WMI n'est pas un simple programme mais un ensemble de programmes et de bases de données (appelées "repositories").

#### Énumération de WMI

**Le processus de communication WMI** :

L'initialisation de la communication WMI se fait toujours sur le port TCP 135. Après l'établissement réussi de la connexion, la communication est déplacée vers un port aléatoire.

J'ai utilisé `wmiexec.py` de la suite Impacket pour exploiter WMI :
```bash
/usr/share/doc/python3-impacket/examples/wmiexec.py Cry0l1t3:"P455w0rD!"@10.129.201.248 "hostname"
```

**Résultat :**
```
Impacket v0.9.22 - Copyright 2020 SecureAuth Corporation

[*] SMBv3.0 dialect used
ILF-SQL-01
```

**Mon analyse** : La commande s'est exécutée avec succès et a retourné le hostname du serveur distant. WMI fonctionne via SMB pour l'authentification, puis exécute les commandes.

Documentation Impacket : [Impacket GitHub](https://github.com/SecureAuthCorp/impacket)

### Réflexions finales

Les protocoles de gestion à distance Windows offrent des capacités puissantes mais présentent aussi des risques importants en cas de mauvaise configuration.

**Mes observations clés** :

- **RDP** nécessite une attention particulière aux certificats et à l'activation de NLA
- **WinRM** est souvent configuré en HTTP non chiffré, ce qui expose les credentials
- **WMI** donne un accès presque total au système, ce qui en fait une cible privilégiée

> L'expérimentation pratique est essentielle. Installer un Windows Server dans une VM, activer ces services, les configurer et les scanner répétitivement permet de vraiment comprendre leur fonctionnement.
{: .prompt-tip}

**Cours complété**

{% include comments.html %}