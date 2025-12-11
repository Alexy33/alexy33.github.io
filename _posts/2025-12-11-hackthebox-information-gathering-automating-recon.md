---
title: "HackTheBox - Information Gathering - Automating Recon"
date: 2025-12-11 14:51:00 +0200
categories: [HackTheBox, Learning]
tags: [automation, reconnaissance, finalrecon, recon-ng, theharvester, spiderfoot, osint-framework]
description: "Découvrir comment automatiser la reconnaissance web avec des frameworks comme FinalRecon pour gagner en efficacité et en couverture"
image:
  path: /assets/img/posts/information-gathering.png
  alt: "Automating Recon - HTB Academy"
---

## Informations sur le module

Ce module explore l'automatisation de la reconnaissance web. Plutôt que de tout faire manuellement, on apprend à utiliser des frameworks puissants qui exécutent des dizaines de tâches en quelques secondes, permettant de se concentrer sur l'analyse plutôt que sur la collecte.

**Lien :** [Automating Recon](https://academy.hackthebox.com/beta/module/144/section/3081)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre les avantages de l'automatisation en reconnaissance
- Maîtriser l'utilisation de FinalRecon pour la reconnaissance complète
- Découvrir les principaux frameworks de reconnaissance
- Automatiser la collecte d'informations à grande échelle
- Intégrer l'automatisation dans un workflow de pentest

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Automating Recon

### Pourquoi j'automatise ma reconnaissance

Au début, je faisais tout manuellement : un Whois par-ci, un dig par-là, un scan de sous-domaines ici. **C'était épuisant et lent.** Puis j'ai découvert l'automatisation et ma productivité a explosé.

> **Pour les débutants** : L'automatisation en reconnaissance, c'est comme avoir un assistant qui exécute simultanément des dizaines de tâches pendant que vous analysez les résultats.
{: .prompt-info}

**Les avantages qui m'ont convaincu :**

**Efficacité**
J'ai chronométré : une reconnaissance manuelle complète me prenait 2-3 heures. Avec FinalRecon, **10 minutes** suffisent pour collecter plus d'informations.

**Scalabilité**
Quand j'ai eu 50 domaines à analyser pour un client, impossible de tout faire manuellement. L'automatisation m'a permis de traiter tous les domaines en une journée.

**Consistance**
Plus d'oublis. Le script exécute toujours les mêmes vérifications, dans le même ordre. Mes rapports sont devenus beaucoup plus uniformes.

**Couverture complète**
Un framework comme FinalRecon combine DNS enumeration, subdomain discovery, crawling, port scanning et plus. Je ne rate rien.

### Les frameworks que j'utilise

J'ai testé plusieurs frameworks avant de trouver mes favoris. Voici mon retour d'expérience :

| Framework | Mon usage principal | Points forts |
|-----------|---------------------|--------------|
| **FinalRecon** | Reconnaissance initiale complète | Tout-en-un, facile à utiliser |
| **Recon-ng** | Reconnaissance modulaire avancée | Extensible, base de données intégrée |
| **theHarvester** | Collecte d'emails et noms | Sources OSINT multiples |
| **SpiderFoot** | Intelligence automation | Intégrations nombreuses |
| **OSINT Framework** | Collection d'outils | Ressource centrale pour OSINT |

#### FinalRecon : Mon outil principal

**Pourquoi j'adore FinalRecon :**
- Interface simple et claire
- Résultats exportables automatiquement
- Module pour presque tout ce dont j'ai besoin
- Installation rapide

**Ce qu'il fait pour moi :**

**Header Information**
Révèle le serveur, les technologies utilisées et les erreurs de configuration. J'ai déjà trouvé des headers qui exposaient des versions vulnérables.

**Whois Lookup**
Informations sur l'enregistrement du domaine, contacts, dates d'expiration. Utile pour le social engineering et la timeline.

**SSL Certificate Information**
Examine le certificat SSL/TLS. J'ai découvert des certificats expirés ou mal configurés qui révélaient d'autres domaines.

**Crawler**
- Extrait HTML, CSS, JavaScript
- Map les liens internes et externes
- Récupère images, robots.txt, sitemap.xml
- Trouve des liens cachés dans le JavaScript
- Intègre même la Wayback Machine

**DNS Enumeration**
Interroge plus de 40 types d'enregistrements DNS, incluant les DMARC pour évaluer la sécurité email.

**Subdomain Enumeration**
Utilise plusieurs sources : crt.sh, AnubisDB, ThreatMiner, CertSpotter, Facebook API, VirusTotal API, Shodan API, BeVigil API. **Énorme gain de temps.**

**Directory Enumeration**
Supporte des wordlists personnalisées et extensions de fichiers pour trouver des répertoires et fichiers cachés.

**Wayback Machine Integration**
Récupère les URLs des 5 dernières années automatiquement. Plus besoin de chercher manuellement.

### Installation de FinalRecon

L'installation m'a pris **2 minutes chrono** :

```bash
git clone https://github.com/thewhiteh4t/FinalRecon.git
cd FinalRecon
pip3 install -r requirements.txt
chmod +x ./finalrecon.py
./finalrecon.py --help
```

**Mon observation :** L'outil nécessite Python 3 et quelques dépendances. Si `pip3 install` échoue, vérifier que python3-pip est installé.

> **Astuce** : Je crée toujours un alias dans mon `.bashrc` pour lancer FinalRecon rapidement : `alias finalrecon='/path/to/FinalRecon/finalrecon.py'`
{: .prompt-tip}

### Les options que j'utilise le plus

Quand je lance `--help`, voici les options qui m'intéressent le plus :

| Option | Ce que je l'utilise pour |
|--------|--------------------------|
| `--url URL` | Spécifier la cible |
| `--headers` | Récupérer les headers HTTP |
| `--sslinfo` | Analyser le certificat SSL |
| `--whois` | Lookup Whois complet |
| `--crawl` | Crawler le site entier |
| `--dns` | Énumération DNS complète |
| `--sub` | Découvrir les sous-domaines |
| `--dir` | Recherche de répertoires |
| `--wayback` | URLs de la Wayback Machine |
| `--ps` | Scan de ports rapide |
| `--full` | **Tout en une seule commande** |

#### Options avancées que j'ajuste souvent

| Option | Argument | Mon usage |
|--------|----------|-----------|
| `-dt` | Nombre de threads | J'augmente à 50 pour les gros sites |
| `-T` | Timeout | Je passe à 60 si la cible est lente |
| `-w` | Wordlist custom | J'utilise mes propres wordlists ciblées |
| `-e` | Extensions | `php,txt,bak,old` pour trouver des backups |
| `-o` | Format d'export | `json` pour parser automatiquement |
| `-k` | API key | J'ajoute mes clés Shodan et VirusTotal |

> **Important** : Les API keys (Shodan, VirusTotal, etc.) multiplient la quantité d'informations découvertes. Je recommande vivement de les configurer.
{: .prompt-warning}

### Ma première utilisation réelle

Pour tester FinalRecon, j'ai lancé une reconnaissance sur `inlanefreight.com` avec juste deux modules :

```bash
./finalrecon.py --headers --whois --url http://inlanefreight.com
```

**Résultat en quelques secondes :**

**Headers récupérés :**
```
Server : Apache/2.4.41 (Ubuntu)
Content-Type : text/html; charset=UTF-8
```

**Mon analyse :** Apache 2.4.41 sur Ubuntu. Je note immédiatement la version pour vérifier les CVE connues.

**Whois découvert :**
```
Domain Name: INLANEFREIGHT.COM
Creation Date: 2019-08-05T22:43:09Z
Registrar: Amazon Registrar, Inc.
Name Server: NS-1303.AWSDNS-34.ORG
```

**Mon observation :** Domaine enregistré en 2019, hébergé sur AWS (les nameservers AWSDNS le confirment). Protection contre le transfert et la suppression activées.

> L'IP trouvée : `134.209.24.248`. Je la note pour la suite de l'analyse.
{: .prompt-info}

**Temps d'exécution total :** 0.26 secondes. **Impressionnant.**

### Ma méthodologie d'automatisation

Voici comment j'intègre l'automatisation dans mon workflow :

#### Phase 1 : Reconnaissance initiale (--full)

```bash
./finalrecon.py --full --url https://target.com -k shodan@MY_KEY -k virustotal@MY_KEY
```

Je lance un scan complet avec toutes mes API keys. Pendant que ça tourne, je commence l'analyse manuelle sur d'autres aspects.

#### Phase 2 : Analyse des résultats

FinalRecon exporte tout dans `~/.local/share/finalrecon/dumps/`. J'examine :
- Les sous-domaines découverts
- Les répertoires trouvés
- Les URLs de la Wayback Machine
- Les ports ouverts

#### Phase 3 : Reconnaissance ciblée

Selon les résultats, je relance des modules spécifiques avec des options personnalisées :

```bash
# Énumération de répertoires avec wordlist custom
./finalrecon.py --dir --url https://target.com -w /usr/share/seclists/Discovery/Web-Content/big.txt -e php,bak,txt

# Sous-domaines avec toutes les sources
./finalrecon.py --sub --url target.com -k shodan@KEY
```

#### Phase 4 : Validation manuelle

**Important :** L'automatisation trouve beaucoup de choses, mais la validation reste manuelle. Je vérifie toujours :
- Les faux positifs dans l'énumération de répertoires
- La validité des sous-domaines trouvés
- L'accessibilité réelle des ressources découvertes

### Autres frameworks dans mon arsenal

#### Recon-ng : Pour aller plus loin

Quand FinalRecon ne suffit pas, je passe à Recon-ng. **Plus complexe, mais plus puissant.**

```bash
recon-ng
[recon-ng][default] > marketplace install all
[recon-ng][default] > modules load recon/domains-hosts/hackertarget
```

**Ce que j'aime :** Structure modulaire, base de données intégrée, reporting avancé.

#### theHarvester : Spécialiste OSINT

Pour la collecte d'emails et de noms d'employés :

```bash
theHarvester -d target.com -b google,linkedin,bing
```

**Mon usage :** Phase de social engineering ou de cartographie organisationnelle.

#### SpiderFoot : L'intégration ultime

SpiderFoot interroge des centaines de sources de données. Interface web et automatisation complète.

```bash
python3 sf.py -l 127.0.0.1:5001
```

**Ce qui m'impressionne :** Le graphe de relations entre les entités découvertes. Parfait pour visualiser l'infrastructure.

### Ressources pour approfondir

- [FinalRecon GitHub](https://github.com/thewhiteh4t/FinalRecon) - Le repo officiel
- [Recon-ng Wiki](https://github.com/lanmaster53/recon-ng/wiki) - Documentation complète
- [theHarvester](https://github.com/laramies/theHarvester) - Code source et exemples
- [SpiderFoot Documentation](https://www.spiderfoot.net/documentation/) - Guide d'utilisation
- [OSINT Framework](https://osintframework.com/) - Collection de ressources OSINT

> **Conseil professionnel** : Créez vos propres scripts qui combinent plusieurs frameworks. Par exemple, FinalRecon pour la découverte initiale, puis theHarvester pour l'OSINT ciblé.
{: .prompt-tip}

### Ce que j'ai appris

L'automatisation a **transformé** ma façon de faire de la reconnaissance. Je suis passé de 3 heures de travail répétitif à 10 minutes de collecte automatisée + 2 heures d'analyse approfondie.

**Mes takeaways essentiels :**
- L'automatisation libère du temps pour l'analyse, la vraie valeur ajoutée
- Aucun framework ne fait tout : combiner plusieurs outils est la clé
- La validation manuelle reste indispensable
- Les API keys multiplient l'efficacité (Shodan, VirusTotal, etc.)
- Toujours exporter les résultats pour analyse ultérieure

**Ma règle d'or :** Automatiser la collecte, pas la réflexion. Les outils trouvent les données, mais c'est moi qui les interprète et les exploite.

FinalRecon et les autres frameworks ne remplacent pas la reconnaissance manuelle - ils la **complètent** et la **démultiplient**. La vraie compétence, c'est de savoir quand utiliser quoi.

**Cours complété**

{% include comments.html %}