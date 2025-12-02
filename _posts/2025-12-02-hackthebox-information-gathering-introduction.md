---
title: "HackTheBox - Information Gathering - Introduction"
date: 2025-12-02 13:09:00 +0200
categories: [HackTheBox, Learning]
tags: [reconnaissance, web, osint, active-recon, passive-recon, pentest, information-gathering]
description: "Découverte des fondamentaux de la reconnaissance web : comprendre la différence entre reconnaissance active et passive, et pourquoi c'est la base de toute évaluation de sécurité."
image:
  path: /assets/img/posts/information-gathering.png
  alt: "Introduction à la Web Reconnaissance"
---

## Informations sur le module

Ce module couvre les fondamentaux de la reconnaissance web, une phase cruciale avant toute évaluation de sécurité. On y découvre les deux approches principales : la reconnaissance active (interaction directe) et passive (collecte d'informations publiques).

**Lien :** [Introduction Information Gathering](https://academy.hackthebox.com/beta/module/144/section/1247)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre l'importance de la reconnaissance web dans le processus de pentest
- Différencier reconnaissance active et passive
- Identifier les risques de détection associés à chaque technique
- Connaître les outils principaux pour chaque type de reconnaissance

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Introduction à la Web Reconnaissance

### Pourquoi la reconnaissance est cruciale

Quand j'ai commencé à apprendre le pentesting, je voulais directement exploiter des vulnérabilités. Mais j'ai vite compris qu'avant d'attaquer, il faut **connaître sa cible**.

> **Pour les débutants** : La reconnaissance web, c'est comme étudier une carte avant de partir en randonnée. Vous devez savoir où vous allez, quels obstacles vous attendent, et quels chemins sont praticables.
{: .prompt-info}

La reconnaissance fait partie de la phase **"Information Gathering"** du processus de pentest. C'est la **fondation** de toute évaluation de sécurité réussie.

### Les quatre objectifs principaux

Lors de mes premières recons, j'ai appris qu'il y a quatre buts essentiels à atteindre :

1. **Identifier les assets** : Découvrir tous les composants accessibles publiquement (pages web, sous-domaines, adresses IP, technologies utilisées)
2. **Découvrir des informations cachées** : Trouver des fichiers de backup, des configurations exposées, de la documentation interne
3. **Analyser la surface d'attaque** : Examiner les technologies, configurations et points d'entrée potentiels
4. **Collecter du renseignement** : Rassembler des informations exploitables (personnel clé, adresses email, patterns comportementaux)

> Les attaquants utilisent ces infos pour cibler des faiblesses spécifiques. Les défenseurs les utilisent pour identifier et corriger les vulnérabilités **avant** qu'elles soient exploitées.
{: .prompt-tip}

## Reconnaissance Active vs Passive

### Ce qui m'a surpris : les deux approches complémentaires

Au début, je pensais qu'il fallait choisir entre actif et passif. En réalité, **les deux se complètent** !

### Reconnaissance Active : interaction directe

La reconnaissance active, c'est quand on **interagit directement** avec la cible. Comme sonner à la porte d'une maison pour voir qui répond.

> **Pour les débutants** : C'est comme envoyer des "pings" à un serveur pour voir s'il répond, ou scanner ses ports pour savoir quels services tournent dessus.
{: .prompt-info}

#### Les techniques actives que j'utilise

Voici les techniques que j'ai expérimentées, classées par **risque de détection** :

| Technique | Ce que ça fait | Risque | Outils |
|-----------|----------------|--------|--------|
| **Port Scanning** | Identifier les ports ouverts et services actifs | 🔴 Élevé | Nmap, Masscan |
| **Vulnerability Scanning** | Chercher des vulnérabilités connues | 🔴 Élevé | Nessus, OpenVAS, Nikto |
| **Network Mapping** | Cartographier la topologie réseau | 🟡 Moyen-Élevé | Traceroute, Nmap |
| **Web Spidering** | Crawler le site pour trouver pages/fichiers cachés | 🟡 Moyen-Faible | Burp Suite Spider, ZAP |
| **Banner Grabbing** | Récupérer les banners des services | 🟢 Faible | Netcat, curl |
| **OS Fingerprinting** | Identifier l'OS de la cible | 🟢 Faible | Nmap -O |
| **Service Enumeration** | Déterminer les versions des services | 🟢 Faible | Nmap -sV |

**Mon observation** : Les techniques à risque élevé peuvent déclencher des **IDS/IPS** (systèmes de détection/prévention d'intrusion). En environnement réel, il faut être stratégique !

> Les scans de vulnérabilités envoient des payloads d'exploits qui sont **facilement détectables** par les solutions de sécurité. À utiliser avec précaution !
{: .prompt-danger}

#### Exemple concret : Banner Grabbing

J'ai testé cette commande sur un serveur web :
```bash
curl -I http://target.com
```

**Résultat :**
```
HTTP/1.1 200 OK
Server: Apache/2.4.50 (Ubuntu)
```

**Mon observation :** En récupérant le banner, j'ai identifié que le serveur utilise Apache 2.4.50 sur Ubuntu. Cette info peut révéler des vulnérabilités connues liées à cette version spécifique.

### Reconnaissance Passive : le mode furtif

La reconnaissance passive, c'est collecter des infos **sans toucher à la cible**. Comme observer une maison depuis la rue sans jamais y entrer.

> **Pour les débutants** : On utilise uniquement des informations publiques : moteurs de recherche, réseaux sociaux, archives web, registres de domaines, etc.
{: .prompt-info}

#### Les techniques passives les plus efficaces

| Technique | Ce que ça fait | Risque | Outils |
|-----------|----------------|--------|--------|
| **Requêtes moteurs de recherche** | Trouver des infos publiques sur la cible | 🟢 Très faible | Google, Shodan |
| **WHOIS Lookups** | Récupérer les détails d'enregistrement du domaine | 🟢 Très faible | whois, services en ligne |
| **DNS Analysis** | Analyser les enregistrements DNS (sous-domaines, serveurs mail) | 🟢 Très faible | dig, dnsenum, fierce |
| **Web Archive Analysis** | Examiner les versions historiques du site | 🟢 Très faible | Wayback Machine |
| **Social Media Analysis** | Collecter des infos depuis LinkedIn, Twitter, Facebook | 🟢 Très faible | LinkedIn, OSINT tools |
| **Code Repositories** | Chercher du code exposé ou des credentials | 🟢 Très faible | GitHub, GitLab |

**Mon observation** : La recon passive est **beaucoup plus discrète** mais peut fournir moins d'informations détaillées. C'est parfait pour la phase initiale !

> Les requêtes WHOIS et DNS font partie du fonctionnement normal d'Internet. Elles ne déclenchent **jamais** d'alertes de sécurité.
{: .prompt-tip}

#### Exemple concret : recherche Google

J'ai utilisé cette requête Google pour trouver des employés :
```
"[Nom de l'entreprise]" site:linkedin.com
```

**Résultat :** J'ai trouvé plusieurs profils d'employés avec leurs rôles, ce qui peut être utile pour du **social engineering** (même si ce n'est pas éthique !).

### Ma stratégie : combiner les deux approches

Dans mes exercices HTB, j'ai compris qu'il faut **commencer par du passif** pour rester discret, puis passer à l'actif quand on a une meilleure compréhension de la cible.

**Mon workflow typique :**

1. WHOIS lookup → connaître le propriétaire du domaine
2. DNS enumeration → trouver des sous-domaines
3. Web archive → voir l'historique du site
4. Port scanning → identifier les services actifs (plus risqué)
5. Service enumeration → version des services pour chercher des CVE

> En environnement professionnel, il faut toujours avoir l'**autorisation écrite** avant de faire de la reconnaissance active !
{: .prompt-danger}

## Ce que j'ai retenu

La reconnaissance web n'est pas optionnelle en pentest, c'est la **première étape obligatoire**. Sans une bonne recon, on attaque à l'aveugle.

Les deux approches (active et passive) ont leurs avantages :

- **Passive** = discret, légal, risque zéro de détection
- **Active** = plus d'infos, mais risque de détection élevé

Le module commence par WHOIS, et c'est logique : c'est une technique passive qui donne des **informations fondamentales** sur la cible (propriétaire, serveurs DNS, dates d'enregistrement).

Documentation utile :
- [Guide OWASP sur l'Information Gathering](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/)
- [Documentation Nmap](https://nmap.org/book/man.html)

**Cours complété**

{% include comments.html %}