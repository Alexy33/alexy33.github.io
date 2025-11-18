---
title: "HackTheBox - Host Enumeration avec Nmap"
date: 2025-11-16 19:59:00 +0200
categories: [HackTheBox, Learning]
tags: [nmap, enumeration, networking]
description: "Mes notes sur la découverte d'hôtes avec Nmap - HTB Academy Module"
image:
  path: /assets/img/posts/nmap.png
  alt: "nmap host enumeration"
---

## Informations sur le module

Suite du module HTB Academy sur Nmap, focus sur la **découverte d'hôtes** (Host Discovery) - une étape cruciale avant toute énumération de ports ou exploitation.

**Lien :** [Network Enumeration with Nmap](https://academy.hackthebox.com/beta/module/19/section/101)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre la différence entre ARP et ICMP pour la découverte d'hôtes
- Scanner efficacement des réseaux complets
- Identifier les hôtes actifs malgré les firewalls
- Débugger les scans avec les options avancées de Nmap

---

> Attention ceci est un cours **TIER 1** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Host Discovery

En pentest interne, la première étape est de **savoir quelles machines sont en ligne** sur le réseau cible. On ne peut pas scanner des ports ou exploiter des services si on ne sait pas quelles IPs sont actives.

> La découverte d'hôtes = la reconnaissance du terrain avant l'attaque
{: .prompt-tip}

La méthode la plus efficace est d'utiliser des **ICMP echo requests** (ping), mais comme on va le voir, Nmap est plus intelligent que ça et utilise **ARP** par défaut sur un réseau local.

**Important :** Toujours sauvegarder chaque scan pour :
- Comparaison entre différents outils
- Documentation du pentest
- Reporting final

---

### Scanner un réseau complet

#### Scan basique d'un range réseau

La première chose que j'ai testée : scanner tout un réseau `/24` :
```bash
sudo nmap 10.129.2.0/24 -sn -oA tnet | grep for | cut -d" " -f5
```

**Résultat :**
```
10.129.2.4
10.129.2.10
10.129.2.11
10.129.2.18
10.129.2.19
10.129.2.20
10.129.2.28
```

**Options utilisées :**

| Option | Description |
|--------|-------------|
| `10.129.2.0/24` | Range réseau cible (256 IPs) |
| `-sn` | Désactive le scan de ports (juste la découverte) |
| `-oA tnet` | Sauvegarde en 3 formats : .nmap, .xml, .gnmap |

> Cette méthode fonctionne **seulement si les firewalls le permettent** !
{: .prompt-warning}

Si certains hosts ne répondent pas, ça ne veut pas forcément dire qu'ils sont éteints - ils peuvent juste bloquer ICMP.

---

### Scanner depuis une liste d'IPs

En pentest, on reçoit souvent une **liste d'IPs à tester** fournie par le client. Nmap peut lire directement depuis un fichier :

**Création de la liste :**
```bash
cat hosts.lst
```

**Contenu :**
```
10.129.2.4
10.129.2.10
10.129.2.11
10.129.2.18
10.129.2.19
10.129.2.20
10.129.2.28
```

**Scan de la liste :**
```bash
sudo nmap -sn -oA tnet -iL hosts.lst | grep for | cut -d" " -f5
```

**Résultat :**
```
10.129.2.18
10.129.2.19
10.129.2.20
```

**Ce que j'ai appris ici :** Sur 7 IPs dans la liste, seulement 3 répondent. Les 4 autres ignorent probablement les ICMP requests à cause de leur firewall.

> Nmap ne reçoit pas de réponse → Il marque l'host comme inactif (mais il peut être en ligne !)
{: .prompt-danger}

---

### Scanner des IPs spécifiques

Parfois on veut juste scanner quelques IPs précises. Plusieurs méthodes :

#### Méthode 1 : IPs séparées par des espaces
```bash
sudo nmap -sn -oA tnet 10.129.2.18 10.129.2.19 10.129.2.20
```

#### Méthode 2 : Range dans l'octet
```bash
sudo nmap -sn -oA tnet 10.129.2.18-20
```

Les deux donnent le même résultat :
```
10.129.2.18
10.129.2.19
10.129.2.20
```

> Pratique pour scanner rapidement un petit segment du réseau !
{: .prompt-tip}

---

### La découverte ARP vs ICMP - Le truc important

#### Ce qui m'a surpris : Nmap utilise ARP par défaut !

Quand j'ai scanné une IP unique :
```bash
sudo nmap 10.129.2.18 -sn -oA host
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-14 23:59 CEST
Nmap scan report for 10.129.2.18
Host is up (0.087s latency).
MAC Address: DE:AD:00:00:BE:EF
Nmap done: 1 IP address (1 host up) scanned in 0.11 seconds
```

Je pensais que Nmap envoyait un ICMP ping, mais **non** ! Pour le confirmer :
```bash
sudo nmap 10.129.2.18 -sn -oA host -PE --packet-trace
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 00:08 CEST
SENT (0.0074s) ARP who-has 10.129.2.18 tell 10.10.14.2
RCVD (0.0309s) ARP reply 10.129.2.18 is-at DE:AD:00:00:BE:EF
Nmap scan report for 10.129.2.18
Host is up (0.023s latency).
MAC Address: DE:AD:00:00:BE:EF
Nmap done: 1 IP address (1 host up) scanned in 0.05 seconds
```

**Observation :** Nmap envoie une **ARP request** au lieu d'un ping ICMP !

**Pourquoi ?** 
- ARP fonctionne au **Layer 2** (liaison de données)
- Plus fiable sur un réseau local
- Ne peut **pas être bloqué** par les firewalls comme ICMP

---

### Comprendre pourquoi un host est "up"

Pour voir exactement **pourquoi** Nmap marque un host comme actif :
```bash
sudo nmap 10.129.2.18 -sn -oA host -PE --reason
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 00:10 CEST
SENT (0.0074s) ARP who-has 10.129.2.18 tell 10.10.14.2
RCVD (0.0309s) ARP reply 10.129.2.18 is-at DE:AD:00:00:BE:EF
Nmap scan report for 10.129.2.18
Host is up, received arp-response (0.028s latency).
MAC Address: DE:AD:00:00:BE:EF
Nmap done: 1 IP address (1 host up) scanned in 0.03 seconds
```

**L'option `--reason` montre clairement :** `received arp-response`

> Très utile pour débugger quand des hosts sont marqués "down" alors qu'ils sont en ligne !
{: .prompt-tip}

---

### Forcer l'utilisation d'ICMP

Pour **désactiver ARP** et utiliser uniquement ICMP (utile pour l'OS fingerprinting) :
```bash
sudo nmap 10.129.2.18 -sn -oA host -PE --packet-trace --disable-arp-ping
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 00:12 CEST
SENT (0.0107s) ICMP [10.10.14.2 > 10.129.2.18 Echo request (type=8/code=0) id=13607 seq=0] IP [ttl=255 id=23541 iplen=28 ]
RCVD (0.0152s) ICMP [10.129.2.18 > 10.10.14.2 Echo reply (type=0/code=0) id=13607 seq=0] IP [ttl=128 id=40622 iplen=28 ]
Nmap scan report for 10.129.2.18
Host is up (0.086s latency).
MAC Address: DE:AD:00:00:BE:EF
Nmap done: 1 IP address (1 host up) scanned in 0.11 seconds
```

**Maintenant on voit :**
- `SENT` : ICMP Echo request (type=8)
- `RCVD` : ICMP Echo reply (type=0)
- **TTL = 128** → Très probablement un système **Windows** !

> Le TTL dans la réponse ICMP peut révéler l'OS : 64 (Linux), 128 (Windows), 255 (Cisco/Network)
{: .prompt-info}

---

### Options importantes

| Option | Description | Usage personnel |
|--------|-------------|-----------------|
| `-sn` | Pas de scan de ports | Toujours pour découverte initiale |
| `-PE` | ICMP Echo requests | Identification OS via TTL |
| `-oA` | Save all formats | Par défaut sur tous mes scans |
| `--packet-trace` | Voir tous les paquets | Debug quand ça marche pas |
| `--reason` | Pourquoi up/down | Comprendre les résultats |
| `--disable-arp-ping` | Force TCP/ICMP | Tester la vraie réponse réseau |
| `-iL` | Scan depuis fichier | Quand le client donne une liste |

---

**Based on the last result, find out which operating system it belongs to. Submit the name of the operating system as result.**

Le dernier résultat était le suivant :

```bash
Arcony@htb[/htb]$ sudo nmap 10.129.2.18 -sn -oA host -PE --packet-trace --disable-arp-ping 

Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 00:12 CEST
SENT (0.0107s) ICMP [10.10.14.2 > 10.129.2.18 Echo request (type=8/code=0) id=13607 seq=0] IP [ttl=255 id=23541 iplen=28 ]
RCVD (0.0152s) ICMP [10.129.2.18 > 10.10.14.2 Echo reply (type=0/code=0) id=13607 seq=0] IP [ttl=128 id=40622 iplen=28 ]
Nmap scan report for 10.129.2.18
Host is up (0.086s latency).
MAC Address: DE:AD:00:00:BE:EF
Nmap done: 1 IP address (1 host up) scanned in 0.11 seconds
```

J'ai analysé la ligne **RCVD** (paquet reçu de la cible), le paramètre qui est important ici est : **`ttl=128`**

J'ai comparé avec les TTL par défaut des OS courants :
   - **Linux/Unix** : TTL = 64
   - **Windows** : TTL = 128
   - **Cisco/Network devices** : TTL = 255

**Conclusion :** TTL = 128 → C'est un système **Windows**

**Réponse :** `Windows`

> Astuce : Le TTL (Time To Live) dans la réponse ICMP est un excellent indicateur pour identifier l'OS sans scan actif !
{: .prompt-tip}

---

## Host and Port Scanning

Après avoir découvert quels hôtes sont en ligne, il est temps d'obtenir une **image plus précise du système**. Les informations dont on a besoin :

- Les ports ouverts et leurs services
- Les versions des services
- Les informations que les services fournissent
- Le système d'exploitation

> La phase de scan de ports est cruciale pour identifier les vecteurs d'attaque potentiels
{: .prompt-tip}

---

### Les 6 états possibles d'un port

Nmap peut déterminer **6 états différents** pour un port scanné :

| État | Description |
|------|-------------|
| `open` | La connexion au port a été établie (TCP, UDP ou SCTP) |
| `closed` | Le port répond avec un flag **RST** - le port est fermé mais l'hôte est actif |
| `filtered` | Nmap ne peut pas déterminer si le port est ouvert ou fermé (firewall probable) |
| `unfiltered` | Le port est accessible mais on ne peut pas dire s'il est ouvert/fermé (TCP-ACK scan uniquement) |
| `open\|filtered` | Aucune réponse reçue - probablement un firewall qui protège le port |
| `closed\|filtered` | État visible uniquement avec IP ID idle scans |

> L'état `filtered` ne signifie pas forcément que le port est inaccessible - juste que le firewall bloque notre scan !
{: .prompt-warning}

---

### Découvrir les ports TCP ouverts

Par défaut, Nmap scanne les **top 1000 ports TCP** avec le scan SYN (`-sS`). Ce scan SYN est défini par défaut **uniquement si on est root** (permissions nécessaires pour créer des raw TCP packets).

Sinon, c'est le **TCP Connect scan** (`-sT`) qui est utilisé.

**Différentes façons de définir les ports :**
- Ports individuels : `-p 22,25,80,139,445`
- Range de ports : `-p 22-445`
- Top ports : `--top-ports=10`
- Tous les ports : `-p-`
- Fast scan (top 100) : `-F`

---

### Scanner les top 10 ports TCP

Premier test : scanner les 10 ports les plus fréquents :
```bash
sudo nmap 10.129.2.28 --top-ports=10
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 15:36 CEST
Nmap scan report for 10.129.2.28
Host is up (0.021s latency).

PORT     STATE    SERVICE
21/tcp   closed   ftp
22/tcp   open     ssh
23/tcp   closed   telnet
25/tcp   open     smtp
80/tcp   open     http
110/tcp  open     pop3
139/tcp  filtered netbios-ssn
443/tcp  closed   https
445/tcp  filtered microsoft-ds
3389/tcp closed   ms-wbt-server
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)

Nmap done: 1 IP address (1 host up) scanned in 1.44 seconds
```

**Observations :**
- **4 ports ouverts** : SSH (22), SMTP (25), HTTP (80), POP3 (110)
- **2 ports filtrés** : NetBIOS (139), Microsoft-DS (445)
- **4 ports fermés** : FTP (21), Telnet (23), HTTPS (443), RDP (3389)

> Les ports `filtered` sont intéressants - ils indiquent la présence d'un firewall !
{: .prompt-info}

---

### Tracer les paquets - Comprendre le SYN scan

Pour comprendre ce qui se passe réellement, on peut tracer les paquets avec `--packet-trace` :
```bash
sudo nmap 10.129.2.28 -p 21 --packet-trace -Pn -n --disable-arp-ping
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 15:39 CEST
SENT (0.0429s) TCP 10.10.14.2:63090 > 10.129.2.28:21 S ttl=56 id=57322 iplen=44  seq=1699105818 win=1024 <mss 1460>
RCVD (0.0573s) TCP 10.129.2.28:21 > 10.10.14.2:63090 RA ttl=64 id=0 iplen=40  seq=0 win=0
Nmap scan report for 10.129.2.28
Host is up (0.014s latency).

PORT   STATE  SERVICE
21/tcp closed ftp
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)

Nmap done: 1 IP address (1 host up) scanned in 0.07 seconds
```

**Décryptage de la requête (SENT) :**

| Message | Description |
|---------|-------------|
| `SENT (0.0429s)` | Nmap envoie un paquet à la cible |
| `TCP` | Protocole utilisé |
| `10.10.14.2:63090 >` | Notre IP et port source |
| `10.129.2.28:21` | IP cible et port cible |
| `S` | Flag **SYN** du paquet TCP |
| `ttl=56 id=57322 ...` | Paramètres supplémentaires du header TCP |

**Décryptage de la réponse (RCVD) :**

| Message | Description |
|---------|-------------|
| `RCVD (0.0573s)` | Paquet reçu de la cible |
| `TCP` | Protocole utilisé |
| `10.129.2.28:21 >` | IP cible et port source de la réponse |
| `10.10.14.2:63090` | Notre IP et port de destination |
| `RA` | Flags **RST** et **ACK** → Port fermé ! |
| `ttl=64 id=0 ...` | Paramètres supplémentaires du header TCP |

> Flag **RST + ACK (RA)** = Le port est **fermé** mais l'hôte est **actif**
{: .prompt-tip}

---

### TCP Connect Scan (-sT)

Le **Connect Scan** utilise le **three-way handshake TCP complet** pour déterminer l'état d'un port.

**Avantages :**
- Très précis (complète le handshake)
- Fonctionne sans privilèges root
- Interagit proprement avec les services

**Inconvénients :**
- **Pas du tout furtif** - crée des logs sur la plupart des systèmes
- Facilement détectable par les IDS/IPS modernes
- Plus lent que le SYN scan

**Quand l'utiliser ?**
- Quand on n'a pas les droits root
- Quand la précision est prioritaire sur la discrétion
- Quand le firewall de l'hôte drop les paquets entrants mais autorise les sortants
```bash
sudo nmap 10.129.2.28 -p 443 --packet-trace --disable-arp-ping -Pn -n --reason -sT
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 16:26 CET
CONN (0.0385s) TCP localhost > 10.129.2.28:443 => Operation now in progress
CONN (0.0396s) TCP localhost > 10.129.2.28:443 => Connected
Nmap scan report for 10.129.2.28
Host is up, received user-set (0.013s latency).

PORT    STATE SERVICE REASON
443/tcp open  https   syn-ack

Nmap done: 1 IP address (1 host up) scanned in 0.04 seconds
```

> Le Connect scan est plus "poli" car il se comporte comme une connexion client normale
{: .prompt-info}

---

### Ports filtrés - Comprendre le comportement du firewall

Un port marqué comme **`filtered`** peut avoir plusieurs raisons. Généralement, c'est dû à des **règles de firewall**.

Les paquets peuvent être :
- **Dropped** (abandonnés) - Aucune réponse
- **Rejected** (rejetés) - Réponse ICMP "unreachable"

#### Cas 1 : Firewall qui DROP les paquets

Nmap envoie le paquet et... **aucune réponse**. Par défaut, Nmap va réessayer 10 fois (`--max-retries=10`).
```bash
sudo nmap 10.129.2.28 -p 139 --packet-trace -n --disable-arp-ping -Pn
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 15:45 CEST
SENT (0.0381s) TCP 10.10.14.2:60277 > 10.129.2.28:139 S ttl=47 id=14523 iplen=44  seq=4175236769 win=1024 <mss 1460>
SENT (1.0411s) TCP 10.10.14.2:60278 > 10.129.2.28:139 S ttl=45 id=7372 iplen=44  seq=4175171232 win=1024 <mss 1460>
Nmap scan report for 10.129.2.28
Host is up.

PORT    STATE    SERVICE
139/tcp filtered netbios-ssn
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)

Nmap done: 1 IP address (1 host up) scanned in 2.06 seconds
```

**Observation :** Le scan a pris **2.06 secondes** au lieu de 0.05s - Nmap a attendu une réponse qui n'est jamais venue !

#### Cas 2 : Firewall qui REJECT les paquets

Cette fois, le firewall **répond activement** avec un message ICMP "Port Unreachable" :
```bash
sudo nmap 10.129.2.28 -p 445 --packet-trace -n --disable-arp-ping -Pn
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 15:55 CEST
SENT (0.0388s) TCP 10.129.2.28:52472 > 10.129.2.28:445 S ttl=49 id=21763 iplen=44  seq=1418633433 win=1024 <mss 1460>
RCVD (0.0487s) ICMP [10.129.2.28 > 10.129.2.28 Port 445 unreachable (type=3/code=3) ] IP [ttl=64 id=20998 iplen=72 ]
Nmap scan report for 10.129.2.28
Host is up (0.0099s latency).

PORT    STATE    SERVICE
445/tcp filtered microsoft-ds
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)

Nmap done: 1 IP address (1 host up) scanned in 0.05 seconds
```

**Observation :** On reçoit **ICMP type=3/code=3** (Port unreachable) - Le firewall nous dit explicitement que le port est inaccessible.

> Si on sait que l'hôte est vivant, un port `filtered` indique très probablement un firewall actif - À investiguer plus tard !
{: .prompt-warning}

---

### Découvrir les ports UDP ouverts

Les administrateurs système **oublient souvent de filtrer les ports UDP** en plus des TCP !

**Problème avec UDP :**
- UDP est un protocole **stateless** (sans état)
- Pas de three-way handshake
- Pas d'acknowledgement
- **Les timeouts sont beaucoup plus longs**
- Le scan UDP (`-sU`) est **beaucoup plus lent** que TCP

#### Scan UDP basique
```bash
sudo nmap 10.129.2.28 -F -sU
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 16:01 CEST
Nmap scan report for 10.129.2.28
Host is up (0.059s latency).
Not shown: 95 closed ports
PORT     STATE         SERVICE
68/udp   open|filtered dhcpc
137/udp  open          netbios-ns
138/udp  open|filtered netbios-dgm
631/udp  open|filtered ipp
5353/udp open          zeroconf
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)

Nmap done: 1 IP address (1 host up) scanned in 98.07 seconds
```

**Observation :** Scan de seulement 100 ports a pris **98 secondes** ! C'est **beaucoup plus long** qu'avec TCP.

> Nmap envoie des **datagrams UDP vides** - On ne reçoit une réponse que si l'application est configurée pour répondre
{: .prompt-info}

---

### Comprendre les réponses UDP

#### Port UDP ouvert
```bash
sudo nmap 10.129.2.28 -sU -Pn -n --disable-arp-ping --packet-trace -p 137 --reason
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 16:15 CEST
SENT (0.0367s) UDP 10.10.14.2:55478 > 10.129.2.28:137 ttl=57 id=9122 iplen=78
RCVD (0.0398s) UDP 10.129.2.28:137 > 10.10.14.2:55478 ttl=64 id=13222 iplen=257
Nmap scan report for 10.129.2.28
Host is up, received user-set (0.0031s latency).

PORT    STATE SERVICE    REASON
137/udp open  netbios-ns udp-response ttl 64
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)

Nmap done: 1 IP address (1 host up) scanned in 0.04 seconds
```

**Conclusion :** On a reçu une **réponse UDP** → Le port est **ouvert** !

#### Port UDP fermé
```bash
sudo nmap 10.129.2.28 -sU -Pn -n --disable-arp-ping --packet-trace -p 100 --reason
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 16:25 CEST
SENT (0.0445s) UDP 10.10.14.2:63825 > 10.129.2.28:100 ttl=57 id=29925 iplen=28
RCVD (0.1498s) ICMP [10.129.2.28 > 10.10.14.2 Port unreachable (type=3/code=3) ] IP [ttl=64 id=11903 iplen=56 ]
Nmap scan report for 10.129.2.28
Host is up, received user-set (0.11s latency).

PORT    STATE  SERVICE REASON
100/udp closed unknown port-unreach ttl 64
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)

Nmap done: 1 IP address (1 host up) scanned in  0.15 seconds
```

**Conclusion :** On a reçu **ICMP type=3/code=3** (Port unreachable) → Le port est **fermé** !

#### Port UDP filtré ou ouvert ?
```bash
sudo nmap 10.129.2.28 -sU -Pn -n --disable-arp-ping --packet-trace -p 138 --reason
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 16:32 CEST
SENT (0.0380s) UDP 10.10.14.2:52341 > 10.129.2.28:138 ttl=50 id=65159 iplen=28
SENT (1.0392s) UDP 10.10.14.2:52342 > 10.129.2.28:138 ttl=40 id=24444 iplen=28
Nmap scan report for 10.129.2.28
Host is up, received user-set.

PORT    STATE         SERVICE     REASON
138/udp open|filtered netbios-dgm no-response
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)

Nmap done: 1 IP address (1 host up) scanned in 2.06 seconds
```

**Conclusion :** **Aucune réponse** reçue → État **`open|filtered`** - Impossible de savoir !

---

### Version Scan - Obtenir les détails des services

L'option `-sV` permet d'obtenir des **informations supplémentaires** sur les ports ouverts :
- Versions des services
- Noms des services
- Détails sur la cible
```bash
sudo nmap 10.129.2.28 -Pn -n --disable-arp-ping --packet-trace -p 445 --reason -sV
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2022-11-04 11:10 GMT
SENT (0.3426s) TCP 10.10.14.2:44641 > 10.129.2.28:445 S ttl=55 id=43401 iplen=44  seq=3589068008 win=1024 <mss 1460>
RCVD (0.3556s) TCP 10.129.2.28:445 > 10.10.14.2:44641 SA ttl=63 id=0 iplen=44  seq=2881527699 win=29200 <mss 1337>
NSOCK INFO [0.4980s] nsock_iod_new2(): nsock_iod_new (IOD #1)
NSOCK INFO [0.4980s] nsock_connect_tcp(): TCP connection requested to 10.129.2.28:445 (IOD #1) EID 8
NSOCK INFO [0.5130s] nsock_trace_handler_callback(): Callback: CONNECT SUCCESS for EID 8 [10.129.2.28:445]
Service scan sending probe NULL to 10.129.2.28:445 (tcp)
NSOCK INFO [0.5130s] nsock_read(): Read request from IOD #1 [10.129.2.28:445] (timeout: 6000ms) EID 18
NSOCK INFO [6.5190s] nsock_trace_handler_callback(): Callback: READ TIMEOUT for EID 18 [10.129.2.28:445]
Service scan sending probe SMBProgNeg to 10.129.2.28:445 (tcp)
NSOCK INFO [6.5190s] nsock_write(): Write request for 168 bytes to IOD #1 EID 27 [10.129.2.28:445]
NSOCK INFO [6.5190s] nsock_read(): Read request from IOD #1 [10.129.2.28:445] (timeout: 5000ms) EID 34
NSOCK INFO [6.5190s] nsock_trace_handler_callback(): Callback: WRITE SUCCESS for EID 27 [10.129.2.28:445]
NSOCK INFO [6.5320s] nsock_trace_handler_callback(): Callback: READ SUCCESS for EID 34 [10.129.2.28:445] (135 bytes)
Service scan match (Probe SMBProgNeg matched with SMBProgNeg line 13836): 10.129.2.28:445 is netbios-ssn.  Version: |Samba smbd|3.X - 4.X|workgroup: WORKGROUP|
NSOCK INFO [6.5320s] nsock_iod_delete(): nsock_iod_delete (IOD #1)
Nmap scan report for 10.129.2.28
Host is up, received user-set (0.013s latency).

PORT    STATE SERVICE     REASON         VERSION
445/tcp open  netbios-ssn syn-ack ttl 63 Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
Service Info: Host: Ubuntu

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.55 seconds
```

**Informations récupérées :**
- Service : **Samba smbd 3.X - 4.X**
- Workgroup : **WORKGROUP**
- Host : **Ubuntu**

> Le scan de version (`-sV`) envoie des **probes spécifiques** à chaque service pour identifier précisément la version !
{: .prompt-tip}

---

### Options importantes

| Option | Description | Usage personnel |
|--------|-------------|-----------------|
| `-sS` | TCP SYN scan (half-open) | Scan par défaut avec root - furtif |
| `-sT` | TCP Connect scan | Quand pas root ou besoin de précision |
| `-sU` | UDP scan | Scanner les services UDP oubliés |
| `-sV` | Version detection | Identifier versions des services |
| `-p-` | Scan tous les ports (65535) | Scan complet (lent) |
| `-F` | Fast scan (top 100 ports) | Scan rapide initial |
| `--top-ports=X` | Scanner les X ports les plus fréquents | Compromis vitesse/couverture |
| `--packet-trace` | Voir tous les paquets | Debug et apprentissage |
| `--reason` | Afficher pourquoi un port est dans cet état | Comprendre les résultats |
| `--max-retries=X` | Nombre de retry | Ajuster selon le réseau |

---

**Find all TCP ports on your target. Submit the total number of found TCP ports as the answer.**

Nous allons utiliser simplement le `-sS` qui nous permet de voir tout les ports **TCP**

```bash
┌─[eu-academy-3]─[10.10.15.151]─[htb-ac-1999270@htb-disygjack0]─[~]
└──╼ [★]$ nmap -sS 10.129.2.49
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-16 19:40 CST
Nmap scan report for 10.129.2.49
Host is up (0.044s latency).
Not shown: 993 closed tcp ports (reset)
PORT      STATE SERVICE
22/tcp    open  ssh
80/tcp    open  http
110/tcp   open  pop3
139/tcp   open  netbios-ssn
143/tcp   open  imap
445/tcp   open  microsoft-ds
31337/tcp open  Elite

Nmap done: 1 IP address (1 host up) scanned in 0.84 seconds
```

**Réponse :** `7`

**Enumerate the hostname of your target and submit it as the answer. (case-sensitive)**

Et pour cette question nous allons utiliser le flag `-sV` pour avoir tout les détails de notre scan

```bash
┌─[eu-academy-3]─[10.10.15.151]─[htb-ac-1999270@htb-disygjack0]─[~]
└──╼ [★]$ nmap 10.129.2.49 -sV
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-16 19:48 CST
Nmap scan report for 10.129.2.49
Host is up (0.044s latency).
Not shown: 993 closed tcp ports (reset)
PORT      STATE SERVICE     VERSION
22/tcp    open  ssh         OpenSSH 7.6p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
80/tcp    open  http        Apache httpd 2.4.29 ((Ubuntu))
110/tcp   open  pop3        Dovecot pop3d
139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
143/tcp   open  imap        Dovecot imapd (Ubuntu)
445/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
31337/tcp open  Elite?
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port31337-TCP:V=7.94SVN%I=7%D=11/16%Time=691A7F04%P=x86_64-pc-linux-gnu
SF:%r(NULL,1F,"220\x20HTB{pr0F7pDv3r510nb4nn3r}\r\n")%r(GetRequest,1F,"220
SF:\x20HTB{pr0F7pDv3r510nb4nn3r}\r\n");
Service Info: Host: NIX-NMAP-DEFAULT; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 156.71 seconds
```

Et comme nous pouvons le voir dans cette ligne : `Service Info: Host: NIX-NMAP-DEFAULT; OS: Linux; CPE: cpe:/o:linux:linux_kernel` on y retrouve notre hostname que nous cherchons

**Réponse :** `NIX-NMAP-DEFAULT`

---

## Saving the Results

Pendant nos scans, il est **essentiel de toujours sauvegarder les résultats**. Cela permet de :
- Comparer les différentes méthodes de scan utilisées
- Garder une trace pour la documentation
- Analyser les résultats plus tard

> Toujours sauvegarder ses scans = Bonne pratique en pentest !
{: .prompt-tip}

---

### Les 3 formats de sortie Nmap

Nmap peut sauvegarder les résultats dans **3 formats différents** :

| Format | Option | Extension | Usage |
|--------|--------|-----------|-------|
| **Normal output** | `-oN` | `.nmap` | Lecture humaine, comme dans le terminal |
| **Grepable output** | `-oG` | `.gnmap` | Parsing facile avec grep/awk/sed |
| **XML output** | `-oX` | `.xml` | Import dans d'autres outils, génération de rapports |

**L'option magique** : `-oA` sauvegarde dans **les 3 formats en même temps** !

---

### Sauvegarder tous les formats en une commande

J'ai testé un scan complet avec sauvegarde :
```bash
sudo nmap 10.129.2.28 -p- -oA target
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-16 12:14 CEST
Nmap scan report for 10.129.2.28
Host is up (0.0091s latency).
Not shown: 65525 closed ports
PORT      STATE SERVICE
22/tcp    open  ssh
25/tcp    open  smtp
80/tcp    open  http
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)

Nmap done: 1 IP address (1 host up) scanned in 10.22 seconds
```

**Options utilisées :**

| Option | Description |
|--------|-------------|
| `10.129.2.28` | Cible à scanner |
| `-p-` | Scan de TOUS les ports (1-65535) |
| `-oA target` | Sauvegarde dans les 3 formats avec le nom de base "target" |

> Si aucun chemin complet n'est spécifié, les fichiers sont créés dans le répertoire courant
{: .prompt-info}

---

### Vérification des fichiers créés
```bash
ls
```

**Résultat :**
```
target.gnmap  target.xml  target.nmap
```

Parfait ! Les **3 fichiers** ont été créés automatiquement.

---

### Format Normal (.nmap)

C'est le format **lisible par un humain**, identique à ce qu'on voit dans le terminal :
```bash
cat target.nmap
```

**Contenu :**
```
# Nmap 7.80 scan initiated Tue Jun 16 12:14:53 2020 as: nmap -p- -oA target 10.129.2.28
Nmap scan report for 10.129.2.28
Host is up (0.053s latency).
Not shown: 4 closed ports
PORT   STATE SERVICE
22/tcp open  ssh
25/tcp open  smtp
80/tcp open  http
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)

# Nmap done at Tue Jun 16 12:15:03 2020 -- 1 IP address (1 host up) scanned in 10.22 seconds
```

**Utilité :** Documentation, lecture facile, copier-coller dans les rapports.

---

### Format Grepable (.gnmap)

Format **optimisé pour le parsing** avec des outils comme `grep`, `awk`, ou `cut` :
```bash
cat target.gnmap
```

**Contenu :**
```
# Nmap 7.80 scan initiated Tue Jun 16 12:14:53 2020 as: nmap -p- -oA target 10.129.2.28
Host: 10.129.2.28 ()    Status: Up
Host: 10.129.2.28 ()    Ports: 22/open/tcp//ssh///, 25/open/tcp//smtp///, 80/open/tcp//http///  Ignored State: closed (4)
# Nmap done at Tue Jun 16 12:14:53 2020 -- 1 IP address (1 host up) scanned in 10.22 seconds
```

**Utilité :** Scripts d'automatisation, extraction rapide d'informations.

**Exemple d'utilisation :**
```bash
# Extraire uniquement les ports ouverts
cat target.gnmap | grep "Ports:" | cut -d" " -f4-
```

---

### Format XML (.xml)

Format **structuré** pour l'import dans d'autres outils ou la génération de rapports :
```bash
cat target.xml
```

**Contenu :**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE nmaprun>
<?xml-stylesheet href="file:///usr/local/bin/../share/nmap/nmap.xsl" type="text/xsl"?>
<!-- Nmap 7.80 scan initiated Tue Jun 16 12:14:53 2020 as: nmap -p- -oA target 10.129.2.28 -->
<nmaprun scanner="nmap" args="nmap -p- -oA target 10.129.2.28" start="12145301719" startstr="Tue Jun 16 12:15:03 2020" version="7.80" xmloutputversion="1.04">
<scaninfo type="syn" protocol="tcp" numservices="65535" services="1-65535"/>
<verbose level="0"/>
<debugging level="0"/>
<host starttime="12145301719" endtime="12150323493"><status state="up" reason="arp-response" reason_ttl="0"/>
<address addr="10.129.2.28" addrtype="ipv4"/>
<address addr="DE:AD:00:00:BE:EF" addrtype="mac" vendor="Intel Corporate"/>
<hostnames>
</hostnames>
<ports><extraports state="closed" count="4">
<extrareasons reason="resets" count="4"/>
</extraports>
<port protocol="tcp" portid="22"><state state="open" reason="syn-ack" reason_ttl="64"/><service name="ssh" method="table" conf="3"/></port>
<port protocol="tcp" portid="25"><state state="open" reason="syn-ack" reason_ttl="64"/><service name="smtp" method="table" conf="3"/></port>
<port protocol="tcp" portid="80"><state state="open" reason="syn-ack" reason_ttl="64"/><service name="http" method="table" conf="3"/></port>
</ports>
<times srtt="52614" rttvar="75640" to="355174"/>
</host>
<runstats><finished time="12150323493" timestr="Tue Jun 16 12:14:53 2020" elapsed="10.22" summary="Nmap done at Tue Jun 16 12:15:03 2020; 1 IP address (1 host up) scanned in 10.22 seconds" exit="success"/><hosts up="1" down="0" total="1"/>
</runstats>
</nmaprun>
```

**Utilité :** Import dans des outils comme Metasploit, génération de rapports HTML professionnels.

---

### Convertir XML en rapport HTML

Le format XML peut être **transformé en rapport HTML** avec l'outil `xsltproc` :
```bash
xsltproc target.xml -o target.html
```

**Résultat :** Un fichier `target.html` est créé !

En ouvrant ce fichier dans un navigateur, on obtient un **rapport visuel clair et professionnel** :

![Nmap Report](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/19/nmap-report.png)

**Ce que j'aime dans le rapport HTML :**
- Présentation claire et structurée
- Facile à partager avec des non-techniciens
- Parfait pour la documentation client
- Inclut toutes les informations du scan

> Les rapports HTML sont essentiels pour la documentation professionnelle en pentest !
{: .prompt-tip}

---

### Options de sauvegarde

| Option | Description | Usage |
|--------|-------------|-------|
| `-oN fichier.nmap` | Sauvegarde format normal | Documentation lisible |
| `-oG fichier.gnmap` | Sauvegarde format grepable | Scripts et parsing |
| `-oX fichier.xml` | Sauvegarde format XML | Rapports et import outils |
| `-oA nom_base` | Sauvegarde les 3 formats | **À utiliser systématiquement** |

> J'utilise **toujours** `-oA` pour avoir tous les formats d'un coup !
{: .prompt-tip}

---

**Perform a full TCP port scan on your target and create an HTML report. Submit the number of the highest port as the answer.**

Nous allons utiliser de nouveau le flag `-sS` pour tout les port **TCP** ainsi que `-oA` pour avoir le résultat du scan en **XML** et pouvoir le traduire en html par la suite avec la commande `xsltproc`

```bash
┌─[eu-academy-3]─[10.10.15.151]─[htb-ac-1999270@htb-omo0uwa7td]─[~]
└──╼ [★]$ nmap 10.129.101.37 -sS -oA target
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-16 20:16 CST
Nmap scan report for 10.129.101.37
Host is up (0.051s latency).
Not shown: 993 closed tcp ports (reset)
PORT      STATE SERVICE
22/tcp    open  ssh
80/tcp    open  http
110/tcp   open  pop3
139/tcp   open  netbios-ssn
143/tcp   open  imap
445/tcp   open  microsoft-ds
31337/tcp open  Elite

Nmap done: 1 IP address (1 host up) scanned in 0.98 seconds
```

Maintenant si nous faisons un **ls** nous pouvons voir les fichiers qui ont été créer

```bash
┌─[eu-academy-3]─[10.10.15.151]─[htb-ac-1999270@htb-omo0uwa7td]─[~]
└──╼ [★]$ ls
cacert.der  Documents  Music     Public        target.nmap  Templates
Desktop     Downloads  Pictures  target.gnmap  target.xml   Videos
```

- target.gnmap
- target.nmap
- target.xml

Plus qu'a transformer le tout en **HTML**

```bash
┌─[eu-academy-3]─[10.10.15.151]─[htb-ac-1999270@htb-omo0uwa7td]─[~]
└──╼ [★]$ xsltproc target.xml -o target.html
```

Et d'ouvrir le fichier html et constater que le port le plus gros que nous avons trouvé même précédemment est:

**Réponse :** `31337`

---

## Service Enumeration

Après avoir découvert les ports ouverts, l'étape suivante est **d'identifier précisément les services** qui tournent sur ces ports et surtout **leurs versions**.

**Pourquoi c'est crucial ?**
- Rechercher des **vulnérabilités connues** pour cette version spécifique
- Analyser le **code source** si disponible
- Trouver des **exploits précis** qui correspondent au service ET à l'OS

> Un numéro de version exact = La clé pour trouver l'exploit parfait !
{: .prompt-tip}

---

### Ma stratégie de scan en deux phases

#### Phase 1 : Scan rapide initial

J'ai appris qu'il vaut mieux commencer par un **scan rapide** des ports les plus courants. Pourquoi ?
- Génère **moins de trafic**
- Réduit les chances d'être **détecté et bloqué** par les mécanismes de sécurité
- Donne un premier aperçu rapidement

Pendant ce temps, je lance un scan complet (`-p-`) en arrière-plan.

#### Phase 2 : Version scan sur les ports identifiés

Une fois les ports ouverts connus, j'utilise le **version scan** (`-sV`) pour identifier précisément les services :
```bash
sudo nmap 10.129.2.28 -p- -sV
```

**Mon observation :** Un scan complet de tous les ports prend **beaucoup de temps**. Heureusement, Nmap a une astuce !

---

### Suivre la progression du scan

#### Astuce 1 : Appuyer sur la barre Espace

Pendant qu'un scan tourne, j'ai découvert qu'on peut appuyer sur **[Espace]** pour voir le statut :
```bash
sudo nmap 10.129.2.28 -p- -sV
```

**Résultat après avoir appuyé sur Espace :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 19:44 CEST
Stats: 0:00:03 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 3.64% done; ETC: 19:45 (0:00:53 remaining)
```

**Ce que ça m'apprend :**
- Temps écoulé : 3 secondes
- Progression : 3.64%
- Temps restant estimé : 53 secondes

> Pratique pour savoir si le scan va prendre 5 minutes ou 2 heures !
{: .prompt-info}

#### Astuce 2 : Affichage automatique toutes les X secondes

Pour ne pas avoir à appuyer manuellement sur Espace, j'utilise `--stats-every=5s` :
```bash
sudo nmap 10.129.2.28 -p- -sV --stats-every=5s
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 19:46 CEST
Stats: 0:00:05 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 13.91% done; ETC: 19:49 (0:00:31 remaining)
Stats: 0:00:10 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 39.57% done; ETC: 19:48 (0:00:15 remaining)
```

**Mon observation :** Toutes les 5 secondes, j'ai une mise à jour automatique ! Je peux spécifier des secondes (`5s`) ou des minutes (`2m`).

---

### Mode verbeux : Voir les ports en temps réel

L'option `-v` (ou `-vv` pour encore plus de détails) affiche les **ports ouverts immédiatement** quand Nmap les découvre :
```bash
sudo nmap 10.129.2.28 -p- -sV -v
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 20:03 CEST
NSE: Loaded 45 scripts for scanning.
Initiating ARP Ping Scan at 20:03
Scanning 10.129.2.28 [1 port]
Completed ARP Ping Scan at 20:03, 0.03s elapsed (1 total hosts)
Initiating Parallel DNS resolution of 1 host. at 20:03
Completed Parallel DNS resolution of 1 host. at 20:03, 0.02s elapsed
Initiating SYN Stealth Scan at 20:03
Scanning 10.129.2.28 [65535 ports]
Discovered open port 995/tcp on 10.129.2.28
Discovered open port 80/tcp on 10.129.2.28
Discovered open port 993/tcp on 10.129.2.28
Discovered open port 143/tcp on 10.129.2.28
Discovered open port 25/tcp on 10.129.2.28
Discovered open port 110/tcp on 10.129.2.28
Discovered open port 22/tcp on 10.129.2.28
```

**Pourquoi j'aime ça :**
- Je vois les ports ouverts **au fur et à mesure**
- Je peux commencer à analyser certains ports pendant que le scan continue
- Plus **interactif** et moins ennuyeux à attendre

> Le mode verbeux est mon meilleur ami pour les longs scans !
{: .prompt-tip}

---

### Résultats du Banner Grabbing

Une fois le scan terminé, j'obtiens toutes les informations sur les services :
```bash
sudo nmap 10.129.2.28 -p- -sV
```

**Résultat complet :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-15 20:00 CEST
Nmap scan report for 10.129.2.28
Host is up (0.013s latency).
Not shown: 65525 closed ports
PORT      STATE    SERVICE      VERSION
22/tcp    open     ssh          OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
25/tcp    open     smtp         Postfix smtpd
80/tcp    open     http         Apache httpd 2.4.29 ((Ubuntu))
110/tcp   open     pop3         Dovecot pop3d
139/tcp   filtered netbios-ssn
143/tcp   open     imap         Dovecot imapd (Ubuntu)
445/tcp   filtered microsoft-ds
993/tcp   open     ssl/imap     Dovecot imapd (Ubuntu)
995/tcp   open     ssl/pop3     Dovecot pop3d
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)
Service Info: Host:  inlane; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 91.73 seconds
```

**Ce que j'ai appris de ce scan :**
- **SSH** : OpenSSH 7.6p1 sur Ubuntu
- **SMTP** : Postfix smtpd
- **HTTP** : Apache 2.4.29 sur Ubuntu
- **Hostname** : inlane
- **OS** : Linux

> Ces informations précises me permettent de chercher des CVE spécifiques à ces versions !
{: .prompt-info}

---

### Comment fonctionne la détection de version ?

Nmap utilise **deux méthodes** pour identifier les services :

#### Méthode 1 : Lecture des banners

Nmap regarde les **banners** que les services envoient et les affiche. C'est rapide et efficace.

#### Méthode 2 : Système de signatures

Si le banner n'est pas clair, Nmap utilise un **système de matching basé sur des signatures**. 

**Inconvénient :** Ça prend **beaucoup plus de temps**.

---

### Le problème : Nmap peut rater des informations

Nmap n'affiche pas toujours **toutes** les informations disponibles. Exemple concret :
```bash
sudo nmap 10.129.2.28 -p- -sV -Pn -n --disable-arp-ping --packet-trace
```

**Résultat avec --packet-trace :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-16 20:10 CEST
<SNIP>
NSOCK INFO [0.4200s] nsock_trace_handler_callback(): Callback: READ SUCCESS for EID 18 [10.129.2.28:25] (35 bytes): 220 inlane ESMTP Postfix (Ubuntu)..
Service scan match (Probe NULL matched with NULL line 3104): 10.129.2.28:25 is smtp.  Version: |Postfix smtpd|||
NSOCK INFO [0.4200s] nsock_iod_delete(): nsock_iod_delete (IOD #1)
Nmap scan report for 10.129.2.28
Host is up (0.076s latency).

PORT   STATE SERVICE VERSION
25/tcp open  smtp    Postfix smtpd
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)
Service Info: Host:  inlane

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 0.47 seconds
```

**Regardez cette ligne :**
```
NSOCK INFO [0.4200s] nsock_trace_handler_callback(): Callback: READ SUCCESS for EID 18 [10.129.2.28:25] (35 bytes): 220 inlane ESMTP Postfix (Ubuntu)..
```

Le serveur SMTP nous dit qu'il tourne sur **Ubuntu**, mais Nmap ne l'affiche pas dans le résultat final !

> Parfois, il faut aller chercher les informations plus profondément avec --packet-trace
{: .prompt-warning}

---

### Vérification manuelle avec Netcat et Tcpdump

Pour comprendre ce qui se passe vraiment au niveau réseau, j'ai fait une vérification manuelle.

#### Configuration de Tcpdump

Terminal 1 - J'écoute le trafic réseau :
```bash
sudo tcpdump -i eth0 host 10.10.14.2 and 10.129.2.28
```

**Résultat :**
```
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
```

#### Connexion avec Netcat

Terminal 2 - Je me connecte manuellement au port SMTP :
```bash
nc -nv 10.129.2.28 25
```

**Résultat :**
```
Connection to 10.129.2.28 port 25 [tcp/*] succeeded!
220 inlane ESMTP Postfix (Ubuntu)
```

Parfait ! Le serveur m'envoie son banner avec l'info **Ubuntu**.

#### Analyse du trafic intercepté

Retour au Terminal 1 - Tcpdump montre ce qui s'est passé :
```
18:28:07.128564 IP 10.10.14.2.59618 > 10.129.2.28.smtp: Flags [S], seq 1798872233, win 65535, options [mss 1460,nop,wscale 6,nop,nop,TS val 331260178 ecr 0,sackOK,eol], length 0
18:28:07.255151 IP 10.129.2.28.smtp > 10.10.14.2.59618: Flags [S.], seq 1130574379, ack 1798872234, win 65160, options [mss 1460,sackOK,TS val 1800383922 ecr 331260178,nop,wscale 7], length 0
18:28:07.255281 IP 10.10.14.2.59618 > 10.129.2.28.smtp: Flags [.], ack 1, win 2058, options [nop,nop,TS val 331260304 ecr 1800383922], length 0
18:28:07.319306 IP 10.129.2.28.smtp > 10.10.14.2.59618: Flags [P.], seq 1:36, ack 1, win 510, options [nop,nop,TS val 1800383985 ecr 331260304], length 35: SMTP: 220 inlane ESMTP Postfix (Ubuntu)
18:28:07.319426 IP 10.10.14.2.59618 > 10.129.2.28.smtp: Flags [.], ack 36, win 2058, options [nop,nop,TS val 331260368 ecr 1800383985], length 0
```

**Décortiquons ce qui s'est passé :**

#### Le Three-Way Handshake

Les 3 premières lignes montrent l'établissement de la connexion TCP :

| Étape | Flag | Description |
|-------|------|-------------|
| 1 | `[S]` | J'envoie un SYN pour initier la connexion |
| 2 | `[S.]` | Le serveur répond avec SYN-ACK |
| 3 | `[.]` | J'envoie ACK pour confirmer |

#### L'envoi du Banner

Ligne 4 - Le serveur envoie les données :
```
18:28:07.319306 IP 10.129.2.28.smtp > 10.10.14.2.59618: Flags [P.], <SNIP> length 35: SMTP: 220 inlane ESMTP Postfix (Ubuntu)
```

**Flags utilisés :**
- **PSH (Push)** : Le serveur envoie des données
- **ACK** : Il confirme aussi que tout a bien été reçu

**Mon observation :** C'est ici que le banner `220 inlane ESMTP Postfix (Ubuntu)` est transmis !

#### Confirmation de réception

Ligne 5 - Je confirme avoir reçu les données :
```
18:28:07.319426 IP 10.10.14.2.59618 > 10.129.2.28.smtp: Flags [.], <SNIP>
```

Flag **ACK** : J'accuse réception du banner.

> Le flag PSH dans les paquets TCP indique l'envoi de données - C'est souvent là que se trouvent les banners !
{: .prompt-tip}

---

### Options importantes pour Service Enumeration

| Option | Description | Usage |
|--------|-------------|-------|
| `-sV` | Détection de version des services | **Toujours utiliser** après découverte des ports |
| `-p-` | Scanner tous les 65535 ports | Scan complet mais lent |
| `--stats-every=5s` | Affiche la progression toutes les 5s | Pratique pour les longs scans |
| `-v` / `-vv` | Mode verbeux | Voir les ports ouverts en temps réel |
| `--packet-trace` | Trace tous les paquets | Debug et analyse approfondie |
| `-Pn` | Désactive ICMP Echo | Utile si le ping est bloqué |
| `-n` | Désactive résolution DNS | Accélère le scan |
| `--disable-arp-ping` | Désactive ARP ping | Force l'utilisation d'autres méthodes |

---

**Enumerate all ports and their services. One of the services contains the flag you have to submit as the answer.**

Ok donc pour énumérer tout les ports déjà c'est le `-p-` et les services qui en font parti c'est le `-sV` nous allons voir ce que ça va nous donner

```bash
┌─[eu-academy-3]─[10.10.14.131]─[htb-ac-1999270@htb-yz1xtgvsk9]─[~]
└──╼ [★]$ nmap -sV -v -Pn --disable-arp-ping 10.129.42.164
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-17 18:01 CST
NSE: Loaded 46 scripts for scanning.
Initiating Parallel DNS resolution of 1 host. at 18:01
Completed Parallel DNS resolution of 1 host. at 18:01, 0.00s elapsed
Initiating SYN Stealth Scan at 18:01
Scanning 10.129.42.164 [1000 ports]
Discovered open port 445/tcp on 10.129.42.164
Discovered open port 22/tcp on 10.129.42.164
Discovered open port 143/tcp on 10.129.42.164
Discovered open port 139/tcp on 10.129.42.164
Discovered open port 80/tcp on 10.129.42.164
Discovered open port 110/tcp on 10.129.42.164
Discovered open port 31337/tcp on 10.129.42.164
Completed SYN Stealth Scan at 18:01, 0.82s elapsed (1000 total ports)
Initiating Service scan at 18:01
Scanning 7 services on 10.129.42.164
```

Alors j'ai tenté des scan mais ça ne servait a rien, ils étaient infini et donnaient les mêmes infos peut importe ce que je faisais.

Alors que la réponse se trouvait dans un des ports directement comme nous l'avons vu avec un `nc -nc [IP_MACHINE] [PORT]`

```bash
┌─[eu-academy-3]─[10.10.14.131]─[htb-ac-1999270@htb-yz1xtgvsk9]─[~]
└──╼ [★]$ nc -nv 10.129.42.164 31337
(UNKNOWN) [10.129.42.164] 31337 (?) open
220 HTB{pr0F7pDv3r510nb4nn3r}
```

**Réponse :** `HTB{pr0F7pDv3r510nb4nn3r}`

---

## Nmap Scripting Engine

Le **Nmap Scripting Engine (NSE)** est une fonctionnalité que j'ai découverte et qui permet de créer des **scripts en Lua** pour interagir avec des services spécifiques. C'est comme donner des super-pouvoirs à Nmap !

> NSE transforme Nmap d'un simple scanner de ports en un véritable outil d'énumération avancée
{: .prompt-tip}

---

### Les 14 catégories de scripts NSE

Nmap organise ses scripts en **14 catégories** selon leur fonction :

| Catégorie | Description |
|-----------|-------------|
| `auth` | Détermination des identifiants d'authentification |
| `broadcast` | Découverte d'hôtes par broadcasting |
| `brute` | Tentatives de connexion par brute-force |
| `default` | Scripts par défaut exécutés avec `-sC` |
| `discovery` | Évaluation des services accessibles |
| `dos` | Test de vulnérabilités de déni de service |
| `exploit` | Tentative d'exploitation de vulnérabilités connues |
| `external` | Scripts utilisant des services externes |
| `fuzzer` | Identification de vulnérabilités par fuzzing |
| `intrusive` | Scripts intrusifs pouvant affecter négativement la cible |
| `malware` | Vérification d'infection par malware |
| `safe` | Scripts défensifs non destructifs |
| `version` | Extension pour la détection de services |
| `vuln` | Identification de vulnérabilités spécifiques |

**Mon observation :** Certaines catégories comme `dos` et `exploit` sont à utiliser avec **précaution** car elles peuvent endommager le système cible !

---

### Les différentes façons d'utiliser les scripts

#### Méthode 1 : Scripts par défaut

La façon la plus simple - utiliser l'option `-sC` :
```bash
sudo nmap <target> -sC
```

**Ce que ça fait :** Exécute tous les scripts de la catégorie `default` - ceux considérés comme utiles et sûrs.

#### Méthode 2 : Par catégorie

Pour utiliser tous les scripts d'une catégorie spécifique :
```bash
sudo nmap <target> --script <category>
```

**Exemple :**
```bash
sudo nmap 10.129.2.28 --script vuln
```

#### Méthode 3 : Scripts spécifiques

Pour utiliser des scripts précis :
```bash
sudo nmap <target> --script <script-name>,<script-name>,...
```

**Exemple :**
```bash
sudo nmap 10.129.2.28 --script banner,smtp-commands
```

---

### Exemple pratique : Énumération SMTP

J'ai testé deux scripts spécifiques sur le port SMTP (25) :
```bash
sudo nmap 10.129.2.28 -p 25 --script banner,smtp-commands
```

**Résultat :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-16 23:21 CEST
Nmap scan report for 10.129.2.28
Host is up (0.050s latency).

PORT   STATE SERVICE
25/tcp open  smtp
|_banner: 220 inlane ESMTP Postfix (Ubuntu)
|_smtp-commands: inlane, PIPELINING, SIZE 10240000, VRFY, ETRN, STARTTLS, ENHANCEDSTATUSCODES, 8BITMIME, DSN, SMTPUTF8,
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)
```

**Ce que j'ai appris :**

**Script `banner` :**
- Révèle que c'est **Ubuntu** qui tourne sur la cible
- Montre le banner : `220 inlane ESMTP Postfix (Ubuntu)`

**Script `smtp-commands` :**
- Liste toutes les **commandes SMTP disponibles**
- Je peux voir `VRFY` qui permet de vérifier si un utilisateur existe !

> Ces commandes SMTP peuvent m'aider à énumérer les utilisateurs existants sur le système
{: .prompt-info}

---

### Le scan agressif (-A)

Nmap propose une option **tout-en-un** qui combine plusieurs techniques :
```bash
sudo nmap 10.129.2.28 -p 80 -A
```

**Qu'est-ce que `-A` fait exactement ?**
- `-sV` : Détection de version des services
- `-O` : Détection de l'OS
- `--traceroute` : Traçage de route
- `-sC` : Scripts NSE par défaut

**Résultat sur le port 80 :**
```
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-17 01:38 CEST
Nmap scan report for 10.129.2.28
Host is up (0.012s latency).

PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-generator: WordPress 5.3.4
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: blog.inlanefreight.com
MAC Address: DE:AD:00:00:BE:EF (Intel Corporate)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Aggressive OS guesses: Linux 2.6.32 (96%), Linux 3.2 - 4.9 (96%), Linux 2.6.32 - 3.10 (96%), Linux 3.4 - 3.10 (95%), Linux 3.1 (95%), Linux 3.2 (95%), 
AXIS 210A or 211 Network Camera (Linux 2.6.17) (94%), Synology DiskStation Manager 5.2-5644 (94%), Netgear RAIDiator 4.2.28 (94%), 
Linux 2.6.32 - 2.6.35 (94%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 1 hop

TRACEROUTE
HOP RTT      ADDRESS
1   11.91 ms 10.129.2.28

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 11.36 seconds
```

**Analyse des informations récupérées :**

**Web server :** Apache 2.4.29 sur Ubuntu
**Application web :** WordPress 5.3.4
**Hostname :** blog.inlanefreight.com
**OS probable :** Linux (96% de confiance)
**Distance réseau :** 1 hop (même réseau local)

> Le scan agressif `-A` est un gain de temps énorme pour la reconnaissance initiale !
{: .prompt-tip}

---

### Vulnerability Assessment avec NSE

J'ai voulu aller plus loin en testant la catégorie `vuln` sur le port HTTP :
```bash
sudo nmap 10.129.2.28 -p 80 -sV --script vuln
```

**Résultat :**
```
Nmap scan report for 10.129.2.28
Host is up (0.036s latency).

PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
| http-enum:
|   /wp-login.php: Possible admin folder
|   /readme.html: Wordpress version: 2
|   /: WordPress version: 5.3.4
|   /wp-includes/images/rss.png: Wordpress version 2.2 found.
|   /wp-includes/js/jquery/suggest.js: Wordpress version 2.5 found.
|   /wp-includes/images/blank.gif: Wordpress version 2.6 found.
|   /wp-includes/js/comment-reply.js: Wordpress version 2.7 found.
|   /wp-login.php: Wordpress login page.
|   /wp-admin/upgrade.php: Wordpress login page.
|_  /readme.html: Interesting, a readme.
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-stored-xss: Couldn't find any stored XSS vulnerabilities.
| http-wordpress-users:
| Username found: admin
|_Search stopped at ID #25. Increase the upper limit if necessary with 'http-wordpress-users.limit'
| vulners:
|   cpe:/a:apache:http_server:2.4.29:
|       CVE-2019-0211   7.2 https://vulners.com/cve/CVE-2019-0211
|       CVE-2018-1312   6.8 https://vulners.com/cve/CVE-2018-1312
|       CVE-2017-15715  6.8 https://vulners.com/cve/CVE-2017-15715
<SNIP>
```

**Ce que j'ai découvert avec le script vuln :**

**Énumération WordPress :**
- Page de login : `/wp-login.php`
- Fichier readme : `/readme.html`
- Utilisateur trouvé : **admin**

**Vulnérabilités identifiées :**
- **CVE-2019-0211** (score 7.2) - Élévation de privilèges Apache
- **CVE-2018-1312** (score 6.8) - Vulnérabilité d'authentification
- **CVE-2017-15715** (score 6.8) - Vulnérabilité d'upload

> Les scripts `vuln` interrogent des bases de données de vulnérabilités connues - c'est un excellent point de départ pour l'exploitation !
{: .prompt-info}

**Mon observation :** Le script a même trouvé le nom d'utilisateur `admin` sur WordPress - ça pourrait être utile pour une attaque par brute-force !

---

### Options importantes pour NSE

| Option | Description | Usage |
|--------|-------------|-------|
| `-sC` | Exécute les scripts par défaut | Reconnaissance initiale sûre |
| `--script <category>` | Exécute tous les scripts d'une catégorie | Ex: `--script vuln` |
| `--script <name>` | Exécute un script spécifique | Ex: `--script banner` |
| `-A` | Scan agressif (combinaison de tout) | Reconnaissance complète rapide |
| `--script vuln` | Recherche de vulnérabilités | Assessment de sécurité |

---

### Ma stratégie d'utilisation de NSE

**Phase 1 - Reconnaissance initiale :**
```bash
nmap -sC -sV <target>
```
Scripts par défaut + détection de version

**Phase 2 - Énumération ciblée :**
```bash
nmap --script <specific-script> -p <port> <target>
```
Scripts spécifiques sur les ports intéressants

**Phase 3 - Vulnerability Assessment :**
```bash
nmap --script vuln -sV <target>
```
Recherche de CVE et vulnérabilités connues

> Ne jamais utiliser les catégories `dos` ou `exploit` sans autorisation explicite - elles peuvent endommager le système !
{: .prompt-danger}

---

**Use NSE and its scripts to find the flag that one of the services contain and submit it as the answer.**

Voici ce que j'ai fait pour commencer :

```bash
nmap -sC -sV 10.129.98.200
```

Résultat:
```bash
Nmap scan report for 10.129.98.200
Host is up (0.051s latency).
Not shown: 993 closed tcp ports (reset)
PORT      STATE SERVICE     VERSION
22/tcp    open  ssh         OpenSSH 7.6p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 71:c1:89:90:7f:fd:4f:60:e0:54:f3:85:e6:35:6c:2b (RSA)
|   256 e1:8e:53:18:42:af:2a:de:c0:12:1e:2e:54:06:4f:70 (ECDSA)
|_  256 1a:cc:ac:d4:94:5c:d6:1d:71:e7:39:de:14:27:3c:3c (ED25519)
80/tcp    open  http        Apache httpd 2.4.29 ((Ubuntu))
|_http-title: Apache2 Ubuntu Default Page: It works
|_http-server-header: Apache/2.4.29 (Ubuntu)
110/tcp   open  pop3        Dovecot pop3d
|_pop3-capabilities: CAPA SASL RESP-CODES PIPELINING TOP AUTH-RESP-CODE UIDL
139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
143/tcp   open  imap        Dovecot imapd (Ubuntu)
|_imap-capabilities: LOGINDISABLEDA0001 IMAP4rev1 ENABLE post-login more have LITERAL+ listed capabilities IDLE Pre-login OK LOGIN-REFERRALS ID SASL-IR
445/tcp   open  netbios-ssn Samba smbd 4.7.6-Ubuntu (workgroup: WORKGROUP)
31337/tcp open  ftp         ProFTPD
Service Info: Host: NIX-NMAP-DEFAULT; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
| smb2-time: 
|   date: 2025-11-18T00:40:05
|_  start_date: N/A
|_nbstat: NetBIOS name: NIX-NMAP-DEFAUL, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
| smb-os-discovery: 
|   OS: Windows 6.1 (Samba 4.7.6-Ubuntu)
|   Computer name: nix-nmap-default
|   NetBIOS computer name: NIX-NMAP-DEFAULT\x00
|   Domain name: \x00
|   FQDN: nix-nmap-default
|_  System time: 2025-11-18T01:40:05+01:00
|_clock-skew: mean: -20m00s, deviation: 34m38s, median: 0s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 88.70 seconds
```

Donc là j'ai testé avec les scripts basiques NSE avec le `-sC` maintenant nous allons faire avec le script `vuln` pour voir

```bash
┌─[eu-academy-3]─[10.10.14.131]─[htb-ac-1999270@htb-yz1xtgvsk9]─[~]
└──╼ [★]$ nmap --script vuln -p 80 10.129.98.200
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-17 18:45 CST
Nmap scan report for 10.129.98.200
Host is up (0.049s latency).

PORT   STATE SERVICE
80/tcp open  http
|_http-dombased-xss: Couldn't find any DOM based XSS.
|_http-stored-xss: Couldn't find any stored XSS vulnerabilities.
|_http-csrf: Couldn't find any CSRF vulnerabilities.
| http-enum: 
|_  /robots.txt: Robots file

Nmap done: 1 IP address (1 host up) scanned in 32.20 seconds
```

Et nous trouvons un fichier dans le port `80` nommé `robots.txt` alors je vais le **curl** pour vérifier si il contiendrait pas le flag que nous cherchons.

```bash
┌─[eu-academy-3]─[10.10.14.131]─[htb-ac-1999270@htb-yz1xtgvsk9]─[~]
└──╼ [★]$ curl http://10.129.98.200/robots.txt
User-agent: *

Allow: /

HTB{873nniuc71bu6usbs1i96as6dsv26}
```

Parfait nous avons ce que nous avions besoin

**Réponse :** `HTB{873nniuc71bu6usbs1i96as6dsv26}`

---

## Performance

La **performance de scan** joue un rôle crucial quand on doit scanner un **grand réseau** ou qu'on travaille avec une **bande passante limitée**. Nmap offre plusieurs options pour contrôler la vitesse et l'agressivité des scans.

> Un scan trop lent = perte de temps. Un scan trop rapide = risque de rater des informations !
{: .prompt-warning}

---

### Les options de performance disponibles

Nmap permet de contrôler plusieurs paramètres :

| Paramètre | Option | Description |
|-----------|--------|-------------|
| **Vitesse** | `-T <0-5>` | Templates de timing prédéfinis |
| **Fréquence** | `--min-parallelism <number>` | Nombre de sondes simultanées |
| **Timeouts** | `--max-rtt-timeout <time>` | Temps d'attente maximal pour une réponse |
| **Taux d'envoi** | `--min-rate <number>` | Nombre minimum de paquets par seconde |
| **Retries** | `--max-retries <number>` | Nombre de tentatives par port |

---

### Optimisation des Timeouts

Quand Nmap envoie un paquet, il attend un certain temps (**Round-Trip-Time - RTT**) pour recevoir une réponse. Par défaut, Nmap commence avec un timeout élevé de **100ms**.

#### Test : Scanner un réseau /24 avec les top 100 ports

**Scan par défaut :**
```bash
sudo nmap 10.129.2.0/24 -F
```

**Résultat :**
```
Nmap done: 256 IP addresses (10 hosts up) scanned in 39.44 seconds
```

**Scan avec RTT optimisé :**
```bash
sudo nmap 10.129.2.0/24 -F --initial-rtt-timeout 50ms --max-rtt-timeout 100ms
```

**Résultat :**
```
Nmap done: 256 IP addresses (8 hosts up) scanned in 12.29 seconds
```

**Mon analyse :**
- **Temps de scan divisé par 3** : de 39.44s à 12.29s
- **Mais 2 hôtes en moins détectés** : 10 → 8

> Réduire trop le timeout initial peut faire rater des hôtes qui répondent lentement !
{: .prompt-danger}

**Conclusion :** Un RTT timeout trop court = gain de temps mais **perte de précision**.

---

### Réduction du nombre de Retries

Par défaut, Nmap **réessaie 10 fois** (`--max-retries 10`) si un port ne répond pas. On peut réduire ce nombre pour accélérer le scan.

#### Comparaison avec --max-retries

**Scan par défaut :**
```bash
sudo nmap 10.129.2.0/24 -F | grep "/tcp" | wc -l
```

**Résultat :** 23 ports trouvés

**Scan sans retry :**
```bash
sudo nmap 10.129.2.0/24 -F --max-retries 0 | grep "/tcp" | wc -l
```

**Résultat :** 21 ports trouvés

**Mon observation :**
- **2 ports en moins** détectés avec `--max-retries 0`
- Ces ports ont probablement mis plus de temps à répondre

> `--max-retries 0` = Nmap abandonne immédiatement si pas de réponse. Risqué !
{: .prompt-warning}

**Cas d'usage :** Utile quand on veut un scan **ultra-rapide** sur un réseau stable et qu'on accepte de possiblement rater quelques ports.

---

### Contrôle du taux d'envoi (Rate)

En **pentest white-box**, on peut être **whitelisté** par les systèmes de sécurité. Dans ce cas, on peut augmenter le **taux d'envoi de paquets** pour accélérer drastiquement le scan.

L'option `--min-rate <number>` indique à Nmap d'envoyer **au minimum X paquets par seconde**.

#### Test avec --min-rate

**Scan par défaut :**
```bash
sudo nmap 10.129.2.0/24 -F -oN tnet.default
```

**Résultat :**
```
Nmap done: 256 IP addresses (10 hosts up) scanned in 29.83 seconds
```

**Scan optimisé avec rate :**
```bash
sudo nmap 10.129.2.0/24 -F -oN tnet.minrate300 --min-rate 300
```

**Résultat :**
```
Nmap done: 256 IP addresses (10 hosts up) scanned in 8.67 seconds
```

**Vérification des ports trouvés :**

Scan par défaut :
```bash
cat tnet.default | grep "/tcp" | wc -l
```
Résultat : **23 ports**

Scan optimisé :
```bash
cat tnet.minrate300 | grep "/tcp" | wc -l
```
Résultat : **23 ports**

**Mon analyse :**
- **Temps divisé par 3.5** : de 29.83s à 8.67s
- **Aucune perte d'information** : 23 ports dans les deux cas !

> Quand la bande passante le permet, `--min-rate` est un excellent moyen d'accélérer sans perdre de précision
{: .prompt-tip}

---

### Les Templates de Timing (-T)

Parce qu'on ne peut pas toujours optimiser manuellement (surtout en **black-box**), Nmap propose **6 templates de timing** prédéfinis :

| Template | Valeur | Nom | Usage |
|----------|--------|-----|-------|
| `-T 0` | 0 | Paranoid | Scan ultra-lent, furtif (IDS evasion) |
| `-T 1` | 1 | Sneaky | Scan très lent et discret |
| `-T 2` | 2 | Polite | Scan lent, réduit la charge réseau |
| `-T 3` | 3 | Normal | **Valeur par défaut**, équilibré |
| `-T 4` | 4 | Aggressive | Scan rapide (réseaux rapides et fiables) |
| `-T 5` | 5 | Insane | Scan ultra-rapide (réseaux très rapides) |

**Par défaut :** Si on ne spécifie rien, Nmap utilise **-T 3 (Normal)**.

> Les templates `-T 0` et `-T 1` sont tellement lents qu'ils peuvent prendre des heures. À utiliser seulement pour l'évasion IDS !
{: .prompt-info}

---

### Comparaison : Normal vs Insane

#### Scan Normal (par défaut)
```bash
sudo nmap 10.129.2.0/24 -F -oN tnet.default
```

**Résultat :**
```
Nmap done: 256 IP addresses (10 hosts up) scanned in 32.44 seconds
```

#### Scan Insane
```bash
sudo nmap 10.129.2.0/24 -F -oN tnet.T5 -T 5
```

**Résultat :**
```
Nmap done: 256 IP addresses (10 hosts up) scanned in 18.07 seconds
```

**Vérification des ports trouvés :**

Normal :
```bash
cat tnet.default | grep "/tcp" | wc -l
```
Résultat : **23 ports**

Insane :
```bash
cat tnet.T5 | grep "/tcp" | wc -l
```
Résultat : **23 ports**

**Mon observation :**
- **Temps réduit de 44%** : de 32.44s à 18.07s
- **Aucune perte d'information** dans ce cas

> `-T 5` peut être détecté par les IDS/IPS et peut provoquer des pertes de paquets sur des réseaux lents !
{: .prompt-warning}

---

### Ma stratégie selon le contexte

#### En Black-Box (pentest externe)
```bash
nmap -T 2 <target>  # Polite - Discret et lent
```

**Pourquoi ?** Pour éviter la détection par les IDS/IPS.

#### En White-Box (pentest interne avec autorisation)
```bash
nmap -T 4 --min-rate 300 <target>  # Aggressive + Rate
```

**Pourquoi ?** On peut être plus agressif, les systèmes de sécurité nous ignorent.

#### Sur un réseau rapide et stable
```bash
nmap -T 5 <target>  # Insane
```

**Pourquoi ?** Pour gagner un maximum de temps.

#### Quand on veut de la PRÉCISION avant tout
```bash
nmap -T 3 <target>  # Normal (par défaut)
```

**Pourquoi ?** Le meilleur compromis vitesse/fiabilité.

---

### Options de performance importantes

| Option | Description | Impact |
|--------|-------------|--------|
| `-T 0` à `-T 5` | Templates de timing | Contrôle global de la vitesse |
| `--min-rate 300` | Minimum 300 paquets/sec | Accélération importante |
| `--max-retries 0` | Pas de retry | Très rapide mais peut rater des ports |
| `--initial-rtt-timeout 50ms` | RTT initial réduit | Gain de temps mais risque de faux négatifs |
| `--max-rtt-timeout 100ms` | RTT max réduit | Plus rapide mais moins fiable |

> Un scan trop rapide qui rate des informations critiques est pire qu'un scan lent mais complet !
{: .prompt-danger}

**Cours complété**

{% include comments.html %}