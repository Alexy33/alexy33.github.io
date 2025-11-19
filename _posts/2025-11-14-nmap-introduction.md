---
title: "HackTheBox - Nmap introduction"
date: 2025-11-14 14:46:00 +0200
categories: [HackTheBox, Learning]
tags: [learning]
description: "Write-up du cours sur l'intoduction de nmap"
image:
  path: /assets/img/posts/nmap.png
  alt: "nmap introduction"
---

## Informations sur la room

Découvrez le cours HTB sur nmap, comment l'utilser correctement

**Lien :** [NMAP introduction](https://academy.hackthebox.com/beta/module/19/section/99)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Utiliser nmap comme un pro à la fin du Module

---

> Attention ceci est un cours **TIER 1** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend a chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Enumeration

L'**énumération** est la phase la plus critique en pentest. L'objectif n'est pas simplement d'accéder au système cible, mais d'**identifier toutes les manières possibles** de l'attaquer.

> L'énumération est la clé - mais attention à bien la comprendre !
{: .prompt-tip}

Ce n'est pas une question d'outils, mais de **savoir quoi faire** avec les informations collectées. Les outils seuls ne remplacent jamais :
- Nos connaissances
- Notre attention aux détails
- Notre compréhension des services

Imaginez chercher des clés de voiture :
- **Réponse vague** : "Dans le salon" → Perte de temps
- **Réponse précise** : "Dans le salon, sur l'étagère blanche, à côté de la TV, dans le 3ème tiroir" → Rapide et efficace

**Plus on a d'informations, plus c'est facile de trouver des vecteurs d'attaque.**

1. **Fonctions/ressources** permettant d'interagir avec la cible ou fournissant des informations supplémentaires
2. **Informations** donnant accès à encore plus de données importantes

> La plupart des informations proviennent de mauvaises configurations ou de négligences de sécurité
{: .prompt-warning}

Beaucoup pensent ne pas avoir essayé tous les outils. En réalité, le problème est souvent :
- Ne pas savoir **comment interagir** avec le service
- Ne pas comprendre **ce qui est pertinent**

**Investir du temps** pour apprendre :
- Comment fonctionne le service
- À quoi il sert
- Comment communiquer avec lui

> Quelques heures d'apprentissage peuvent sauver des jours de blocage !
{: .prompt-info}

L'**énumération manuelle** est **critique** car :

- **Timeout** : Si un service ne répond pas assez vite, il sera marqué comme "fermé", "filtré" ou "inconnu"
- **Faux négatifs** : Un port marqué "fermé" par Nmap pourrait en réalité être accessible et crucial
- **Perte d'opportunités** : Ce port "invisible" pourrait être la porte d'entrée au système

> Ne jamais faire confiance aveuglément aux résultats des scanners automatiques
{: .prompt-danger}

L'énumération n'est pas juste une étape technique, c'est un **art** qui demande :
- De la patience
- De la curiosité
- Une volonté d'apprendre constamment
- Une interaction active avec les services

**Plus on collecte d'informations, plus on trouve de vecteurs d'attaque.**

---

## Introduction to Nmap

**Network Mapper (Nmap)** est un outil open-source d'analyse réseau et d'audit de sécurité écrit en C, C++, Python et Lua. Il est conçu pour scanner les réseaux et identifier quels hôtes sont disponibles sur le réseau en utilisant des paquets bruts, ainsi que les services et applications, incluant leur nom et version quand c'est possible. Il peut également **identifier les systèmes d'exploitation et leurs versions** sur ces hôtes.

Parmi ses autres fonctionnalités, Nmap offre aussi des capacités de scanning qui peuvent déterminer si les filtres de paquets, pare-feu ou systèmes de détection d'intrusion (IDS) sont configurés correctement.

---

### Use Cases

Cet outil est l'un des plus utilisés par les administrateurs réseau et les spécialistes en sécurité informatique. Il est utilisé pour :

* Auditer les aspects de sécurité des réseaux
* Simuler des tests de pénétration
* Vérifier les paramètres et configurations des pare-feu et IDS
* Identifier les types de connexions possibles
* Cartographier le réseau
* Analyser les réponses
* Identifier les ports ouverts
* Évaluer les vulnérabilités

---

### Nmap Architecture

Nmap offre de nombreux **types de scans** différents qui peuvent être utilisés pour obtenir divers résultats sur nos cibles. Fondamentalement, Nmap peut être divisé en les techniques de scanning suivantes :

* Découverte d'hôtes (Host discovery)
* Scan de ports (Port scanning)
* Énumération et détection de services
* Détection de l'OS
* Interaction scriptable avec le service cible (Nmap Scripting Engine)

---

### Syntax

Voici sa syntax:

```bash
Arcony@htb[/htb]$ nmap <scan types> <options> <target>
```

---

### Scan Techniques

Nmap offre de nombreuses techniques de scanning différentes, permettant différents types de connexions et utilisant des paquets structurés de manière différente à envoyer. Voici toutes les techniques de scanning que Nmap propose :

```bash
Arcony@htb[/htb]$ nmap --help

<SNIP>
SCAN TECHNIQUES:
  -sS/sT/sA/sW/sM: TCP SYN/Connect()/ACK/Window/Maimon scans
  -sU: UDP Scan
  -sN/sF/sX: TCP Null, FIN, and Xmas scans
  --scanflags <flags>: Customize TCP scan flags
  -sI <zombie host[:probeport]>: Idle scan
  -sY/sZ: SCTP INIT/COOKIE-ECHO scans
  -sO: IP protocol scan
  -b <FTP relay host>: FTP bounce scan
<SNIP>
```

Par exemple, le scan TCP-SYN (`-sS`) est l'un des paramètres par défaut sauf si on a défini autre chose, et c'est aussi l'une des méthodes de scan les plus populaires. Cette méthode de scan permet de scanner plusieurs milliers de ports par seconde. Le scan TCP-SYN envoie un paquet avec le flag SYN et, par conséquent, ne complète jamais le three-way handshake, ce qui évite d'établir une connexion TCP complète vers le port scanné.

* Si notre cible nous renvoie un paquet avec le flag `SYN-ACK`, Nmap détecte que le port est `ouvert`
* Si la cible répond avec un paquet avec le flag `RST`, c'est un indicateur que le port est `fermé`
* Si Nmap ne reçoit aucun paquet en retour, il l'affichera comme `filtré`. Selon la configuration du pare-feu, certains paquets peuvent être abandonnés ou ignorés par le pare-feu

Prenons un exemple d'un tel scan.

```bash
Arcony@htb[/htb]$ sudo nmap -sS localhost

Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-11 22:50 UTC
Nmap scan report for localhost (127.0.0.1)
Host is up (0.000010s latency).
Not shown: 996 closed ports
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
5432/tcp open  postgresql
5901/tcp open  vnc-1

Nmap done: 1 IP address (1 host up) scanned in 0.18 seconds
```

Dans cet exemple, on peut voir qu'on a quatre ports TCP différents ouverts. Dans la première colonne, on voit le numéro du port. Ensuite, dans la deuxième colonne, on voit le statut du service et enfin quel type de service c'est.

**Cours complété**

{% include comments.html %}