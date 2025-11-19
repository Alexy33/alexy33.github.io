---
title: "HackTheBox - Bypass Security Measures"
date: 2025-11-18 17:58:00 +0200
categories: [HackTheBox, Learning]
tags: [nmap, firewall, ids, ips, evasion, network-security, scanning]
description: "Techniques d'évasion pour contourner les firewalls et systèmes IDS/IPS lors de scans Nmap"
image:
  path: /assets/img/posts/nmap.png
  alt: "Techniques d'évasion firewall et IDS/IPS"
---

## Informations sur le module

Ce module explore les différentes techniques permettant de contourner les règles de firewall et les systèmes de détection/prévention d'intrusion lors de scans avec Nmap. On va voir comment fragmenter les paquets, utiliser des leurres, et manipuler les sources pour rester furtif.

**Lien :** [Firewall and IDS/IPS Evasion](https://academy.hackthebox.com/beta/module/19/section/106)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre comment les firewalls et IDS/IPS fonctionnent
- Identifier la présence de firewalls et analyser leurs règles
- Utiliser les scans TCP ACK pour contourner les filtres
- Employer des techniques de decoy et de manipulation d'IP source
- Exploiter DNS et ports spécifiques pour contourner les restrictions

---

> Attention ceci est un cours **TIER 1** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Firewall and IDS/IPS Evasion

### Comprendre les défenses réseau

Avant de pouvoir contourner quoi que ce soit, j'ai d'abord dû comprendre ce contre quoi je me bats. Il y a principalement trois types de défenses :

#### Les Firewalls

Un firewall, c'est comme un videur à l'entrée d'une boîte de nuit. Il examine chaque paquet qui arrive et décide :
- **Pass** : Le paquet est autorisé à entrer
- **Drop** : Le paquet est ignoré silencieusement (pas de réponse)
- **Reject** : Le paquet est rejeté avec un message d'erreur

> La différence entre Drop et Reject est cruciale pour nos scans : avec Drop, on ne sait pas si le port existe, avec Reject, on reçoit une confirmation
{: .prompt-tip}

#### IDS (Intrusion Detection System)

L'IDS est un **système passif** qui surveille le trafic réseau. Quand il détecte quelque chose de suspect (comme un scan de ports), il alerte l'administrateur. Mais il ne bloque rien lui-même.

#### IPS (Intrusion Prevention System)

L'IPS va plus loin : il **prend des mesures automatiques** pour bloquer les attaques détectées. C'est l'IDS avec des pouvoirs d'action.

> IDS = Caméra de surveillance, IPS = Système de sécurité automatique qui verrouille les portes
{: .prompt-info}

### Identifier les firewalls et leurs règles

#### Les différents types d'erreurs

Quand un port est marqué comme `filtered` dans Nmap, ça peut signifier plusieurs choses. Le firewall peut renvoyer différents messages d'erreur ICMP :

- **Net Unreachable** : Le réseau n'est pas accessible
- **Net Prohibited** : Le réseau est interdit
- **Host Unreachable** : L'hôte n'est pas accessible
- **Host Prohibited** : L'hôte est interdit
- **Port Unreachable** : Le port n'est pas accessible
- **Proto Unreachable** : Le protocole n'est pas accessible

#### Ma première observation : ACK scan vs SYN scan

J'ai fait l'expérience suivante : scanner le même hôte avec un SYN scan puis un ACK scan. Les résultats étaient totalement différents !

**Test avec SYN scan :**
```bash
sudo nmap 10.129.2.28 -p 21,22,25 -sS -Pn -n --disable-arp-ping --packet-trace
```

**Résultat du SYN scan :**
```
SENT (0.0278s) TCP 10.10.14.2:57347 > 10.129.2.28:22 S ttl=53 id=22412 iplen=44  seq=4092255222 win=1024 <mss 1460>
SENT (0.0278s) TCP 10.10.14.2:57347 > 10.129.2.28:25 S ttl=50 id=62291 iplen=44  seq=4092255222 win=1024 <mss 1460>
SENT (0.0278s) TCP 10.10.14.2:57347 > 10.129.2.28:21 S ttl=58 id=38696 iplen=44  seq=4092255222 win=1024 <mss 1460>
RCVD (0.0329s) ICMP [10.129.2.28 > 10.10.14.2 Port 21 unreachable (type=3/code=3) ]
RCVD (0.0341s) TCP 10.129.2.28:22 > 10.10.14.2:57347 SA ttl=64 id=0 iplen=44  seq=1153454414 win=64240 <mss 1460>

PORT   STATE    SERVICE
21/tcp filtered ftp
22/tcp open     ssh
25/tcp filtered smtp
```

**Mon observation :**
- Port 21 : ICMP "Port Unreachable" → **filtered**
- Port 22 : Réponse SYN-ACK → **open**
- Port 25 : Aucune réponse → **filtered**

**Puis avec ACK scan :**
```bash
sudo nmap 10.129.2.28 -p 21,22,25 -sA -Pn -n --disable-arp-ping --packet-trace
```

**Résultat du ACK scan :**
```
SENT (0.0422s) TCP 10.10.14.2:49343 > 10.129.2.28:21 A ttl=49 id=12381 iplen=40  seq=0 win=1024
SENT (0.0423s) TCP 10.10.14.2:49343 > 10.129.2.28:22 A ttl=41 id=5146 iplen=40  seq=0 win=1024
SENT (0.0423s) TCP 10.10.14.2:49343 > 10.129.2.28:25 A ttl=49 id=5800 iplen=40  seq=0 win=1024
RCVD (0.1252s) ICMP [10.129.2.28 > 10.129.2.28 Port 21 unreachable (type=3/code=3) ]
RCVD (0.1268s) TCP 10.129.2.28:22 > 10.10.14.2:49343 R ttl=64 id=0 iplen=40  seq=1660784500 win=0

PORT   STATE      SERVICE
21/tcp filtered   ftp
22/tcp unfiltered ssh
25/tcp filtered   smtp
```

**Ce que j'ai compris :**

Le scan ACK est **beaucoup plus efficace** pour contourner les firewalls ! Pourquoi ?

1. Les paquets avec **flag SYN** (connexion entrante) sont souvent bloqués par défaut
2. Les paquets avec **flag ACK** passent car le firewall pense que c'est une réponse à une connexion établie depuis l'intérieur
3. Pour le port 22 : on reçoit un **RST** (reset), ce qui prouve que le port est ouvert mais qu'il n'y a pas de connexion active
4. Pour le port 25 : aucune réponse, les paquets sont **droppés**

> Le scan ACK ne détermine pas si un port est ouvert ou fermé, mais s'il est **filtré ou non filtré**
{: .prompt-warning}

### Détecter la présence d'IDS/IPS

Contrairement aux firewalls qui sont faciles à détecter, les **IDS/IPS sont beaucoup plus sournois** car ce sont des systèmes passifs de surveillance du trafic.

#### Ma stratégie de détection

Pour savoir si un IDS/IPS est présent, j'ai appris qu'il faut :

1. **Utiliser plusieurs VPS avec différentes IPs** pour les tests
2. **Scanner agressivement** un port spécifique
3. **Observer si l'IP est bloquée** après le scan

Si mon IP est bloquée après un scan agressif, je sais qu'il y a un IPS actif qui a pris des mesures automatiques.

> Important : Si un IPS me bloque, mon FAI peut aussi être contacté et bloquer complètement mon accès Internet
{: .prompt-danger}

**La différence clé :**
- **IDS** : Détecte et alerte → L'admin décide quoi faire
- **IPS** : Détecte et bloque → Action automatique

#### Rester discret

Une fois qu'on sait qu'il y a un IPS, il faut **être beaucoup plus subtil** dans nos scans. C'est là que les techniques d'évasion deviennent essentielles.

### Technique 1 : Les Decoys (Leurres)

#### Le problème des blocages géographiques

Parfois, les admins bloquent des **sous-réseaux entiers** de certaines régions. Ou alors, l'IPS bloque notre IP après détection. Comment continuer à scanner ?

#### La solution : Brouiller les pistes

La technique des decoys consiste à **générer de fausses IP sources** pour masquer notre vraie IP. Nmap va envoyer les mêmes paquets depuis plusieurs IPs différentes, et notre vraie IP sera mélangée parmi les fausses.

**Ma commande avec 5 decoys aléatoires :**
```bash
sudo nmap 10.129.2.28 -p 80 -sS -Pn -n --disable-arp-ping --packet-trace -D RND:5
```

**Ce qui se passe :**
```
SENT (0.0378s) TCP 102.52.161.59:59289 > 10.129.2.28:80 S    ← Decoy 1
SENT (0.0378s) TCP 10.10.14.2:59289 > 10.129.2.28:80 S      ← MA vraie IP
SENT (0.0379s) TCP 210.120.38.29:59289 > 10.129.2.28:80 S   ← Decoy 2
SENT (0.0379s) TCP 191.6.64.171:59289 > 10.129.2.28:80 S    ← Decoy 3
SENT (0.0379s) TCP 184.178.194.209:59289 > 10.129.2.28:80 S ← Decoy 4
SENT (0.0379s) TCP 43.21.121.33:59289 > 10.129.2.28:80 S    ← Decoy 5
RCVD (0.1370s) TCP 10.129.2.28:80 > 10.10.14.2:59289 SA
```

**Mon observation :**

Ma vraie IP (10.10.14.2) est placée **aléatoirement** parmi les decoys. L'admin verra 6 IPs différentes scanner son serveur, mais il ne saura pas laquelle est la vraie !

> ATTENTION : Les decoys doivent être des IPs "vivantes", sinon la cible peut subir un SYN flooding et bloquer toutes les connexions
{: .prompt-warning}

**Limitation importante :**

Les paquets avec IP source usurpée sont souvent **filtrés par les ISP et routeurs**, même si on est sur le même réseau. C'est pourquoi il vaut mieux utiliser des VPS réels qu'on contrôle.

### Technique 2 : Changer l'IP source

#### Le cas des sous-réseaux privilégiés

Parfois, seuls certains sous-réseaux ont accès à des services spécifiques. Par exemple, peut-être que le sous-réseau `10.129.2.0/24` a accès au port 445, mais pas mon sous-réseau.

#### Test pratique : Port 445 bloqué

**Premier scan depuis ma vraie IP :**
```bash
sudo nmap 10.129.2.28 -n -Pn -p445 -O
```

**Résultat :**
```
PORT    STATE    SERVICE
445/tcp filtered microsoft-ds
Too many fingerprints match this host to give specific OS details
```

Le port 445 est **filtré**, je ne peux pas faire de détection d'OS.

**Deuxième scan avec une IP source autorisée :**
```bash
sudo nmap 10.129.2.28 -n -Pn -p 445 -O -S 10.129.2.200 -e tun0
```

**Résultat :**
```
PORT    STATE SERVICE
445/tcp open  microsoft-ds
Aggressive OS guesses: Linux 2.6.32 (96%), Linux 3.2 - 4.9 (96%), Linux 2.6.32 - 3.10 (96%)
```

**Incroyable !** En utilisant l'IP source `10.129.2.200`, le port devient **open** et je peux même faire la détection d'OS !

> L'option `-e tun0` est cruciale : elle spécifie l'interface réseau à utiliser pour envoyer les paquets
{: .prompt-tip}

**Ce que j'ai appris :**

Tester différentes IP sources peut révéler des règles de firewall basées sur des **whitelists de sous-réseaux**. Certaines IPs internes ont des privilèges que les externes n'ont pas.

### Technique 3 : DNS Proxying

#### Pourquoi le DNS est spécial

Par défaut, Nmap fait des **requêtes DNS inversées** pour obtenir plus d'infos sur la cible. Ces requêtes DNS passent généralement sans problème car :

1. Le serveur web doit être accessible par son nom de domaine
2. Les serveurs DNS internes sont souvent **plus fiables/privilégiés** que ceux d'Internet
3. Le port UDP 53 (et de plus en plus TCP 53) est rarement filtré

#### Exploiter le port source DNS

Voici une technique redoutable que j'ai testée : utiliser le **port 53 comme port source** pour mes scans.

**Scan d'un port filtré (port 50000) :**
```bash
sudo nmap 10.129.2.28 -p50000 -sS -Pn -n --disable-arp-ping --packet-trace
```

**Résultat :**
```
SENT (0.0417s) TCP 10.10.14.2:33436 > 10.129.2.28:50000 S
SENT (1.0481s) TCP 10.10.14.2:33437 > 10.129.2.28:50000 S

PORT      STATE    SERVICE
50000/tcp filtered ibm-db2
```

Le port 50000 est **filtré**, pas de réponse.

**Même scan mais depuis le port 53 :**
```bash
sudo nmap 10.129.2.28 -p50000 -sS -Pn -n --disable-arp-ping --packet-trace --source-port 53
```

**Résultat :**
```
SENT (0.0482s) TCP 10.10.14.2:53 > 10.129.2.28:50000 S
RCVD (0.0608s) TCP 10.129.2.28:50000 > 10.10.14.2:53 SA ← SYN-ACK reçu !

PORT      STATE SERVICE
50000/tcp open  ibm-db2
```

**Wow !** Le port devient **open** juste en changeant mon port source pour 53 !

#### Pourquoi ça marche ?

1. Les firewalls ont souvent des règles qui **font confiance au port 53**
2. Les IDS/IPS sont souvent **moins stricts** pour le trafic DNS
3. Les admins oublient que TCP/53 peut être utilisé pour autre chose que du DNS

> Les règles de firewall mal configurées peuvent faire confiance au port source 53, pensant que c'est du trafic DNS légitime
{: .prompt-info}

#### Connexion interactive via Netcat

Une fois qu'on sait que le port 53 passe, on peut même établir une connexion interactive :
```bash
ncat -nv --source-port 53 10.129.2.28 50000
```

**Résultat :**
```
Ncat: Connected to 10.129.2.28:50000.
220 ProFTPd
```

Je suis **connecté directement au service ProFTPd** sur le port 50000, tout ça grâce au port source 53 !

### Résumé des options de scan utilisées

| Option | Description | Mon usage |
|--------|-------------|-----------|
| `-sS` | SYN scan (stealth) | Scan classique mais détectable |
| `-sA` | ACK scan | Contourner les firewalls, identifier les règles |
| `-Pn` | Pas de ping ICMP | Éviter la détection préalable |
| `-n` | Pas de résolution DNS | Plus rapide et plus discret |
| `--disable-arp-ping` | Désactive ARP ping | Encore plus furtif sur réseau local |
| `--packet-trace` | Affiche tous les paquets | Comprendre ce qui se passe vraiment |
| `-D RND:5` | 5 decoys aléatoires | Masquer ma vraie IP |
| `-S` | Spécifier IP source | Usurper une IP autorisée |
| `-e tun0` | Forcer l'interface | Nécessaire avec `-S` |
| `--source-port 53` | Port source 53 | Contourner les règles DNS |
| `-O` | Détection OS | Obtenir plus d'infos sur la cible |

> Dans un pentest réel, avoir plusieurs VPS avec différentes IPs est indispensable pour ne pas se faire bloquer définitivement
{: .prompt-danger}

---

## Firewall and IDS/IPS Evasion - Easy Lab

### Le contexte du pentest

Une entreprise m'a engagé pour tester leurs défenses IT, notamment leurs systèmes **IDS et IPS**. Ce qui est intéressant, c'est qu'après chaque test réussi, ils vont améliorer leurs défenses. Je ne sais pas selon quelles règles ils vont renforcer leur sécurité, ce qui rend l'exercice encore plus réaliste.

#### Mon objectif

Extraire des informations spécifiques de la machine cible `sans me faire bannir par l'IPS`.

### L'outil de monitoring : status.php

Contrairement à un vrai pentest où je serais complètement aveugle sur la détection, ici j'ai accès à une page de statut :
```
http://<target>/status.php
```

Cette page m'indique le **nombre d'alertes générées** par mes scans. C'est un luxe pour apprendre, car ça me permet de voir en temps réel l'impact de mes techniques d'évasion.

> En production, je n'aurais jamais ce feedback. Je saurais que j'ai été détecté uniquement quand mon IP serait bloquée ou que les admins réagiraient
{: .prompt-info}

### La règle du jeu

Si je génère **trop d'alertes**, je serai **banni**. Je dois donc scanner la cible le plus **discrètement possible** en utilisant toutes les techniques d'évasion que j'ai apprises.

> Le défi : obtenir un maximum d'informations tout en restant sous le radar de l'IDS/IPS
{: .prompt-warning}

---

**Our client wants to know if we can identify which operating system their provided machine is running on. Submit the OS name as the answer.**

Nous devons trouver l'OS sur lequel tourne la machine cible, donc nous allons forcément utiliser le `-O` pour la détection d'OS voici le scan que j'ai fais pour être le plus discret possible:

```bash
┌─[eu-academy-3]─[10.10.14.131]─[htb-ac-1999270@htb-27mq5opzfr]─[~]
└──╼ [★]$ nmap -Pn -n -sC -O 10.129.140.97
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-18 14:49 CST
Stats: 0:00:01 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 34.65% done; ETC: 14:50 (0:00:02 remaining)
Stats: 0:00:15 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
NSE Timing: About 0.00% done
Nmap scan report for 10.129.140.97
Host is up (0.066s latency).
Not shown: 869 closed tcp ports (reset), 128 filtered tcp ports (no-response)
PORT      STATE SERVICE
22/tcp    open  ssh
| ssh-hostkey: 
|   2048 71:c1:89:90:7f:fd:4f:60:e0:54:f3:85:e6:35:6c:2b (RSA)
|   256 e1:8e:53:18:42:af:2a:de:c0:12:1e:2e:54:06:4f:70 (ECDSA)
|_  256 1a:cc:ac:d4:94:5c:d6:1d:71:e7:39:de:14:27:3c:3c (ED25519)
80/tcp    open  http
|_http-title: Apache2 Ubuntu Default Page: It works
10001/tcp open  scp-config
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.94SVN%E=4%D=11/18%OT=22%CT=1%CU=30839%PV=Y%DS=2%DC=I%G=Y%TM=691
OS:CDC0F%P=x86_64-pc-linux-gnu)SEQ(CI=Z)SEQ(SP=103%GCD=1%ISR=10B%TI=Z%CI=Z%
OS:II=I%TS=A)OPS(O1=M552ST11NW7%O2=M552ST11NW7%O3=M552NNT11NW7%O4=M552ST11N
OS:W7%O5=M552ST11NW7%O6=M552ST11)WIN(W1=FE88%W2=FE88%W3=FE88%W4=FE88%W5=FE8
OS:8%W6=FE88)ECN(R=N)ECN(R=Y%DF=Y%T=40%W=FAF0%O=M552NNSNW7%CC=Y%Q=)T1(R=N)T
OS:1(R=Y%DF=Y%T=40%S=O%A=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0
OS:%S=A%A=Z%F=R%O=%RD=0%Q=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6
OS:(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T7(R=N)U1(R=N)U1(R=Y%DF=N%T=40
OS:%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=N)IE(R=Y%DFI=N%T=40
OS:%CD=S)

Network Distance: 2 hops

OS detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 23.99 seconds
```

Alors nous voyons beaucoup de choses mais nous pouvons noter notemment cette ligne : 

```bash
|_http-title: Apache2 Ubuntu Default Page: It works
```

Nous avons donc trouver sur quoi était basé la machine cible même si nous nous sommes fait repérer après...

**Réponse :** `Ubuntu`

---

## Firewall and IDS/IPS Evasion - Medium Lab

### Retour de mission : Les admins ont durci les règles

Après avoir soumis mes premiers résultats au client, les administrateurs ont fait des **changements et améliorations** sur leurs systèmes IDS/IPS et firewall. 

Lors de la réunion, j'ai pu entendre que les admins n'étaient **pas satisfaits** de leur configuration précédente. Ils ont réalisé que le trafic réseau pouvait être filtré de manière **beaucoup plus stricte**.

> Traduction : Mes techniques d'évasion du niveau Easy ne marcheront plus. Il faut que je sois encore plus créatif et furtif
{: .prompt-warning}

### Note importante sur le protocole

Pour réussir cet exercice, je dois utiliser le **protocole UDP sur le VPN**.

> Contrairement au niveau Easy où TCP fonctionnait, maintenant je dois passer par UDP. C'est un indice majeur sur les nouvelles règles de filtrage
{: .prompt-tip}

**Mon observation :** Les admins ont probablement renforcé le filtrage TCP. UDP est souvent moins surveillé car plus difficile à tracker pour les IDS/IPS (pas de handshake, pas de connexion établie).

---

**After the configurations are transferred to the system, our client wants to know if it is possible to find out our target's DNS server version. Submit the DNS server version of the target as the answer.**

**Ma démarche pour trouver la version DNS**

```bash
┌─[eu-academy-3]─[10.10.14.131]─[htb-ac-1999270@htb-96g25pilkl]─[~]
└──╼ [★]$ sudo nmap 10.129.2.48 -T4 -p53 -sU -sV -Pn -D RND:5 -stats-every=5s -vv -n
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-18 17:01 CST
NSE: Loaded 46 scripts for scanning.
Initiating UDP Scan at 17:01
Scanning 10.129.2.48 [1 port]
Discovered open port 53/udp on 10.129.2.48
Completed UDP Scan at 17:01, 0.14s elapsed (1 total ports)
Initiating Service scan at 17:01
Scanning 1 service on 10.129.2.48
Stats: 0:00:05 elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan
Service scan Timing: About 0.00% done
Stats: 0:00:10 elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan
Service scan Timing: About 0.00% done
Stats: 0:00:15 elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan
Service scan Timing: About 100.00% done; ETC: 17:01 (0:00:00 remaining)
Completed Service scan at 17:01, 15.02s elapsed (1 service on 1 host)
NSE: Script scanning 10.129.2.48.
NSE: Starting runlevel 1 (of 2) scan.
Initiating NSE at 17:01
Completed NSE at 17:01, 0.00s elapsed
NSE: Starting runlevel 2 (of 2) scan.
Initiating NSE at 17:01
Completed NSE at 17:01, 0.00s elapsed
Nmap scan report for 10.129.2.48
Host is up, received user-set (0.050s latency).
Scanned at 2025-11-18 17:01:36 CST for 15s
PORT   STATE SERVICE REASON              VERSION
53/udp open  domain  udp-response ttl 63 (unknown banner: HTB{GoTtgUnyze9Psw4vGjcuMpHRp})
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port53-UDP:V=7.94SVN%I=7%D=11/18%Time=691CFAD5%P=x86_64-pc-linux-gnu%r(
SF:DNSVersionBindReq,57,"\0\x06\x85\0\0\x01\0\x01\0\x01\0\0\x07version\x04
SF:bind\0\0\x10\0\x03\xc0\x0c\0\x10\0\x03\0\0\0\0\0\x1f\x1eHTB{GoTtgUnyze9
SF:Psw4vGjcuMpHRp}\xc0\x0c\0\x02\0\x03\0\0\0\0\0\x02\xc0\x0c")%r(DNSStatus
SF:Request,C,"\0\0\x90\x04\0\0\0\0\0\0\0\0")%r(NBTStat,105,"\x80\xf0\x80\x
SF:90\0\x01\0\0\0\r\0\0\x20CKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\0\0!\0\x01\0\0
SF:\x02\0\x01\x006\xee\x80\0\x14\x01F\x0cROOT-SERVERS\x03NET\0\0\0\x02\0\x
SF:01\x006\xee\x80\0\x04\x01G\xc0\?\0\0\x02\0\x01\x006\xee\x80\0\x04\x01D\
SF:xc0\?\0\0\x02\0\x01\x006\xee\x80\0\x04\x01M\xc0\?\0\0\x02\0\x01\x006\xe
SF:e\x80\0\x04\x01C\xc0\?\0\0\x02\0\x01\x006\xee\x80\0\x04\x01I\xc0\?\0\0\
SF:x02\0\x01\x006\xee\x80\0\x04\x01K\xc0\?\0\0\x02\0\x01\x006\xee\x80\0\x0
SF:4\x01L\xc0\?\0\0\x02\0\x01\x006\xee\x80\0\x04\x01H\xc0\?\0\0\x02\0\x01\
SF:x006\xee\x80\0\x04\x01A\xc0\?\0\0\x02\0\x01\x006\xee\x80\0\x04\x01J\xc0
SF:\?\0\0\x02\0\x01\x006\xee\x80\0\x04\x01B\xc0\?\0\0\x02\0\x01\x006\xee\x
SF:80\0\x04\x01E\xc0\?");
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 15.31 seconds
           Raw packets sent: 12 (588B) | Rcvd: 1 (115B)
```

**Le scan qui a fonctionné**

Une fois l'IP du serveur DNS identifiée (10.129.2.48), j'ai utilisé les techniques d'évasion :
```bash
sudo nmap 10.129.2.48 -T4 -p53 -sU -sV -Pn -D RND:5 --stats-every=5s -vv -n
```

**Décortiquons cette commande :**

| Option | Objectif | Pourquoi c'est important |
|--------|----------|--------------------------|
| `10.129.2.48` | **IP du serveur DNS** (pas ma target initiale !) | C'est une autre machine sur le réseau |
| `-T4` | Timing agressif | Accélère le scan UDP (sinon très lent) |
| `-p53` | Port DNS uniquement | Rester ciblé, moins d'alertes IDS |
| `-sU` | Scan UDP | **DNS fonctionne principalement en UDP** |
| `-sV` | Détection de version | Obtenir la version exacte du service |
| `-Pn` | Pas de ping | Éviter la détection préalable |
| `-D RND:5` | 5 decoys aléatoires | Masquer ma vraie IP parmi 5 fausses |
| `--stats-every=5s` | Stats toutes les 5s | Voir la progression (UDP est lent) |
| `-vv` | Double verbose | Voir tous les détails |
| `-n` | Pas de DNS | Plus rapide et discret |

**Résultat :**
```
Discovered open port 53/udp on 10.129.2.48
Completed UDP Scan at 17:01, 0.14s elapsed (1 total ports)

PORT   STATE SERVICE REASON              VERSION
53/udp open  domain  udp-response ttl 63 (unknown banner: HTB{GoTtgUnyze9Psw4vGjcuMpHRp})
```

**Parfait !** Le banner DNS affiche directement : `HTB{GoTtgUnyze9Psw4vGjcuMpHRp}`

#### Ce qui s'est réellement passé

1. **DNSVersionBindReq** : Nmap a envoyé une requête spéciale `version.bind` au serveur DNS
2. Le serveur a répondu avec son banner personnalisé : le flag HTB !
3. C'est équivalent à la commande `dig @10.129.2.48 version.bind chaos txt`

> Le flag **EST** la version du serveur DNS dans cet exercice. Les admins ont configuré le banner DNS pour afficher le flag directement
{: .prompt-tip}

**Réponse finale :** `HTB{GoTtgUnyze9Psw4vGjcuMpHRp}`

#### Pourquoi le scan UDP a fonctionné

Rappelez-vous l'énoncé du lab : *"To successfully solve the exercise, we must use the **UDP protocol** on the VPN"*

C'était un **gros indice** :
- DNS utilise principalement **UDP port 53**
- Les admins ont renforcé le firewall sur TCP
- Mais ils ont laissé UDP 53 plus accessible (c'est réaliste : bloquer UDP DNS casserait tout)
- Avec les bonnes techniques d'évasion (decoys, timing, pas de ping), on passe sous le radar

---

## Firewall and IDS/IPS Evasion - Hard Lab

### L'escalade de la sécurité

Grâce à mes tests précédents, le client a pu identifier des failles dans sa sécurité. La direction a décidé de prendre les choses au sérieux : ils ont envoyé un de leurs administrateurs suivre une **formation d'une semaine** sur les systèmes **IDS/IPS**.

#### Ce qui a changé

L'administrateur est revenu de formation et a pris **toutes les précautions nécessaires**. Le client m'informe que :

1. Certains **services ont dû être modifiés**
2. La **communication pour le logiciel fourni** a été adaptée
3. Les règles IDS/IPS sont maintenant **beaucoup plus strictes**

> Traduction : Mes techniques des niveaux Easy et Medium ne marcheront probablement plus. L'admin a appris les contre-mesures contre les scans Nmap classiques, les decoys, et les techniques de port source
{: .prompt-danger}

**Mon défi :**

Tester à nouveau le système avec ces nouvelles protections en place. Je dois être encore plus créatif, plus patient, et probablement combiner plusieurs techniques d'évasion avancées pour ne pas me faire détecter et bannir.

> Une semaine de formation IDS/IPS, c'est suffisant pour apprendre à détecter les patterns de scan Nmap, les decoys trop évidents, et mettre en place des règles de rate-limiting sophistiquées
{: .prompt-warning}

**Mon état d'esprit :**

C'est maintenant un vrai challenge. L'admin sait ce qu'il fait. Je vais devoir :
- Scanner **beaucoup plus lentement**
- Utiliser des techniques **moins connues**
- Peut-être fragmenter mes paquets
- Espacer mes requêtes dans le temps
- Surveiller constamment le nombre d'alertes sur status.php

---

**Now our client wants to know if it is possible to find out the version of the running services. Identify the version of service our client was talking about and submit the flag as the answer.**

**Ma démarche pour identifier le service critique**

**Analyse des indices**

L'énoncé me donnait des informations cruciales :
- **"forced to add a service"** = Un nouveau service ajouté récemment
- **"plays a vital role"** = Service essentiel pour leurs clients
- **"require large amounts of data"** = Transfert de gros volumes de données

Mon hypothèse : un service de **transfert de fichiers** (FTP, TFTP, ou similaire).

`Premier scan` : Identifier les ports de transfert de données

J'ai commencé par scanner les ports standards de transfert de fichiers, en utilisant un timing **très lent** pour éviter l'IDS/IPS nouvellement configuré :
```bash
sudo nmap 10.129.2.47 -p21,22,69,111,139,445,2049 -sV -T1 -Pn -D RND:5
```

**Résultat :**
```
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-18 17:24 CST
Stats: 0:03:01 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 92.86% done; ETC: 17:28 (0:00:14 remaining)

Nmap scan report for 10.129.2.47
Host is up (0.049s latency).

PORT     STATE    SERVICE      VERSION
21/tcp   closed   ftp
22/tcp   open     ssh          OpenSSH 7.6p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
69/tcp   filtered tftp
111/tcp  filtered rpcbind
139/tcp  filtered netbios-ssn
445/tcp  filtered microsoft-ds
2049/tcp closed   nfs
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 197.45 seconds
```

**Mon observation :** Plusieurs ports sont **filtered** (bloqués par le firewall), mais aucun ne semble être le service recherché. FTP (21) est fermé, TFTP et les autres sont filtrés.

> Le timing `-T1` (paranoid) est essentiel pour le lab Hard. Avec l'admin formé, un scan plus rapide me ferait bannir immédiatement. Le scan a pris plus de 3 minutes !
{: .prompt-tip}

**Test avec UDP et port source 53**

J'ai ensuite tenté un scan UDP avec le port source 53 (technique DNS proxying du cours) :
```bash
sudo nmap 10.129.2.47 -p69,111,139,445 -sU -sV -Pn --source-port 53 -T2
```

**Résultat :**
```
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-18 17:31 CST
Nmap scan report for 10.129.2.47
Host is up (0.15s latency).

PORT    STATE  SERVICE      VERSION
69/udp  closed tftp
111/udp closed rpcbind
139/udp closed netbios-ssn
445/udp closed microsoft-ds

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 2.61 seconds
```

Tous fermés en UDP aussi. Le service n'est clairement pas sur un port standard.

**Exploration des ports non-standards**

Sachant que le lab Easy avait un service sur le port 10001, j'ai cherché sur des **ports inhabituels** ainsi que des ports de bases de données (qui transfèrent de gros volumes de données) :
```bash
sudo nmap 10.129.2.47 -p8080,3306,5432,27017,50000 -sV -T2 -Pn --source-port 53
```

**Résultat :**
```
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-18 17:33 CST
Nmap scan report for 10.129.2.47
Host is up (0.049s latency).

PORT      STATE  SERVICE    VERSION
3306/tcp  closed mysql
5432/tcp  closed postgresql
8080/tcp  closed http-proxy
27017/tcp closed mongod
50000/tcp open   tcpwrapped

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 37.25 seconds
```

**Parfait !** Le port **50000** est **open** avec un service marqué `tcpwrapped`.

> `tcpwrapped` signifie que le service est protégé par **TCP Wrappers**, un système de contrôle d'accès. Le service existe mais est filtré selon l'IP source
{: .prompt-info}

**Tentatives de détection de version**

J'ai essayé plusieurs méthodes pour identifier le service :

**Première tentative avec netcat sans sudo (échouée) :**
```bash
ncat -nv --source-port 53 10.129.2.47 50000
```

**Résultat :**
```
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
libnsock mksock_bind_addr(): Bind to 0.0.0.0:53 failed (IOD #1): Permission denied (13)
Ncat: TIMEOUT.
```

Permission refusée ! Il faut sudo pour utiliser le port 53.

**Deuxième tentative avec scripts NSE :**
```bash
sudo nmap 10.129.2.47 -p50000 -sV -sC -Pn --source-port 53 --script banner
```

**Résultat :**
```
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-18 17:38 CST
Nmap scan report for 10.129.2.47
Host is up (0.049s latency).

PORT      STATE SERVICE    VERSION
50000/tcp open  tcpwrapped
|_drda-info: TIMEOUT

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 35.29 seconds
```

Toujours `tcpwrapped`, pas de banner détecté par Nmap.

**Troisième tentative avec intensité maximale :**
```bash
sudo nmap 10.129.2.47 -p50000 -sV -Pn --source-port 53 --version-intensity 9
```

**Résultat :**
```
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-18 17:40 CST
Nmap scan report for 10.129.2.47
Host is up (0.049s latency).

PORT      STATE SERVICE    VERSION
50000/tcp open  tcpwrapped

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 35.27 seconds
```

Encore `tcpwrapped`, même avec l'intensité maximale. Nmap ne peut pas identifier le service.

**Mon analyse :** Le service est protégé par TCP Wrappers et ne répond pas aux sondes standards de Nmap. Je dois établir une **connexion interactive** directement.

**Connexion manuelle avec Netcat**

Rappelez-vous la technique du cours : quand Nmap échoue, on utilise **netcat avec le port source 53** :
```bash
sudo ncat -nv --source-port 53 10.129.2.47 50000
```

**Résultat :**
```
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
Ncat: Connected to 10.129.2.47:50000.
220 HTB{kjnsdf2n982n1827eh76238s98di1w6}
```

**SUCCÈS !** Le service a répondu avec un **banner FTP** (code 220) contenant le flag !

#### Ce qui s'est passé

1. Le service sur le port 50000 est un **serveur FTP sur port non-standard**
2. Il est protégé par **TCP Wrappers** qui vérifie l'IP/port source
3. En utilisant le **port source 53** (DNS), on contourne cette protection
4. Le banner FTP affiche directement : `220 HTB{kjnsdf2n982n1827eh76238s98di1w6}`

> Code 220 = Message de bienvenue FTP. C'est bien un serveur FTP déplacé sur le port 50000 pour "cacher" le service
{: .prompt-info}

**Réponse :** `HTB{kjnsdf2n982n1827eh76238s98di1w6}`

#### Pourquoi cette technique a fonctionné

1. **Port non-standard (50000)** : Évite les scans automatisés qui ciblent le port 21
2. **TCP Wrappers** : Filtre les connexions selon l'IP/port source
3. **Port source 53** : Fait croire que la connexion vient d'un serveur DNS légitime
4. **Timing lent (`-T1`, `-T2`)** : Évite de déclencher les seuils de l'IDS/IPS
5. **Netcat au lieu de Nmap** : Les connexions manuelles sont moins détectables

**Mes observations finales :**

1. **Les services critiques sont souvent déplacés** sur des ports non-standards
2. **TCP Wrappers bloque Nmap** mais pas les connexions manuelles bien configurées
3. **Le port source 53 est magique** - Les firewalls lui font souvent confiance
4. **Quand Nmap échoue, netcat réussit** - Les connexions manuelles sont moins détectables
5. **La patience est essentielle** - Timing lent = clé du succès sur le lab Hard
6. **sudo est obligatoire** pour utiliser les ports < 1024 comme port source

> Dans un vrai pentest, déplacer un service critique comme FTP sur un port non-standard est une "security through obscurity" qui ne résiste pas à un scan complet. Mais combiné avec TCP Wrappers et un bon IDS/IPS, ça ralentit considérablement l'attaquant
{: .prompt-warning}

**Cours complété**

{% include comments.html %}