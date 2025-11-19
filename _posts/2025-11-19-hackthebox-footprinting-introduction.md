---
title: "HackTheBox - Footprinting Introduction"
date: 2025-11-19 23:29:00 +0200
categories: [HackTheBox, Learning]
tags: [nmap, enumeration, reconnaissance, network-security, information-gathering]
description: "Comprendre les principes fondamentaux de l'énumération réseau et développer une méthodologie structurée pour la reconnaissance active et passive"
image:
  path: /assets/img/posts/footprinting-introduction.png
  alt: "Network Enumeration with Nmap - HTB Academy"
---

## Informations sur le module

Ce module explore les principes fondamentaux de l'énumération réseau, une étape cruciale dans tout engagement de test d'intrusion. L'énumération va au-delà du simple scan technique - c'est une méthodologie de collecte d'informations qui combine approches actives et passives pour comprendre l'infrastructure cible.

**Lien :** [Network Enumeration with Nmap](https://academy.hackthebox.com/beta/module/112/section/1060)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre la différence entre énumération active et passive
- Développer une méthodologie structurée pour la reconnaissance
- Appliquer les principes d'énumération à des scénarios réels
- Distinguer ce qui est visible de ce qui ne l'est pas dans une infrastructure

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Principes d'énumération

### L'énumération : plus qu'un simple scan

Quand j'ai commencé à apprendre le pentesting, je pensais que l'énumération se résumait à lancer Nmap et analyser les ports ouverts. **Grosse erreur !** L'énumération est en réalité un **processus itératif** de collecte d'informations qui utilise deux approches complémentaires :

- **Méthodes actives** : scans directs de l'infrastructure cible (Nmap, Nikto, etc.)
- **Méthodes passives** : utilisation de sources tierces sans interaction directe (DNS, WHOIS, moteurs de recherche)

> L'OSINT (Open Source Intelligence) est une discipline à part entière et doit être traitée séparément de l'énumération active car elle repose exclusivement sur la collecte passive d'informations
{: .prompt-info}

#### Ce qui a changé ma perspective

L'énumération n'est **pas linéaire**. C'est une **boucle continue** où chaque information découverte peut mener à de nouvelles pistes d'investigation. Par exemple :

1. Je découvre un domaine
2. J'analyse les enregistrements DNS de ce domaine
3. Je trouve des sous-domaines
4. Je scanne les services sur ces sous-domaines
5. Je découvre de nouveaux domaines dans les certificats SSL
6. **Retour à l'étape 2** avec ces nouvelles cibles

#### L'erreur classique du débutant

Voici l'erreur que j'ai faite au début (et que beaucoup font encore) :

**Scénario :** Je trouve des services d'authentification (SSH, RDP, WinRM)  
**Ma première réaction :** Lancer un brute-force avec des mots de passe courants  
**Pourquoi c'est une mauvaise idée :**

- Le brute-force est **bruyant** et détectable
- Risque de **blacklistage** immédiat
- Peut **bloquer l'accès** pour la suite des tests
- Montre un manque de compréhension de l'infrastructure

> Notre objectif n'est pas de forcer l'accès aux systèmes, mais de **découvrir tous les chemins possibles** pour y accéder
{: .prompt-warning}

### L'analogie du chasseur de trésor

Cette analogie du cours m'a vraiment aidé à comprendre l'approche correcte :

Un chasseur de trésor ne prend pas simplement une pelle et ne commence pas à creuser au hasard. Il va :

1. **Planifier** son expédition
2. **Rassembler** le bon équipement
3. **Étudier** les cartes et le terrain
4. **Analyser** où le trésor pourrait se trouver
5. **Apporter** les outils appropriés

Si je creuse des trous partout sans réflexion :
- Je cause des **dégâts** inutiles
- Je **gaspille** du temps et de l'énergie
- Je n'atteindrai probablement **jamais** mon objectif

**C'est exactement pareil en pentesting !** Je dois comprendre l'infrastructure interne et externe de l'entreprise, la cartographier soigneusement, et formuler mon plan d'attaque avec précision.

### Les questions fondamentales de l'énumération

#### Ce que j'ai appris à me demander systématiquement

J'ai remarqué que la plupart des pentesters (moi y compris au début) se concentrent uniquement sur **ce qu'ils peuvent voir**. Mais ce qui est invisible est tout aussi important !

#### Questions sur ce qui EST visible

1. **Qu'est-ce que je peux voir ?**
2. **Pourquoi est-ce que je le vois ?** (raisons business, techniques, etc.)
3. **Quelle image cela crée-t-il ?** (vision globale de l'infrastructure)
4. **Qu'est-ce que j'en retire ?** (informations exploitables)
5. **Comment puis-je l'utiliser ?** (vecteurs d'attaque potentiels)

#### Questions sur ce qui N'EST PAS visible

6. **Qu'est-ce que je ne vois pas ?**
7. **Pourquoi ne le vois-je pas ?** (firewall, segmentation, services internes)
8. **Quelle image cela crée-t-il ?** (mesures de sécurité en place)

> Avec l'expérience, on commence à "voir" les composants qui ne sont pas visibles au premier regard
{: .prompt-tip}

### Mon observation personnelle

Quand je teste maintenant, je passe autant de temps à analyser **ce qui manque** qu'à analyser ce qui est présent. Par exemple :

- **Si je vois :** Un serveur web sur le port 443 mais pas sur le port 80
- **Je me demande :** Pourquoi pas de redirection HTTP vers HTTPS ? Y a-t-il une séparation des flux ?

- **Si je ne vois pas :** De service d'administration externe (SSH, RDP)
- **Je me demande :** Utilisent-ils un VPN ? Un bastion host ? Accès via autre méthode ?

### Les trois principes immuables

Le cours souligne un point crucial : **il y a toujours des exceptions aux règles, mais les principes ne changent jamais**.

| N° | Principe | Mon interprétation |
|----|----------|-------------------|
| 1 | Il y a plus que ce qui rencontre l'œil. Considérer tous les points de vue. | Ne jamais se contenter de la première couche d'information |
| 2 | Distinguer entre ce que nous voyons et ce que nous ne voyons pas. | L'absence d'information EST une information |
| 3 | Il y a toujours des moyens d'obtenir plus d'informations. Comprendre la cible. | L'énumération n'est jamais "terminée" |

> J'ai imprimé ces questions et principes et je les garde à côté de mon écran. C'est devenu un réflexe de m'y référer quand je bloque sur un engagement
{: .prompt-tip}

### Ce que j'ai vraiment retenu

#### Le problème n'est pas technique, il est conceptuel

Un point qui m'a marqué dans ce cours : quand je bloque sur un pentest, **ce n'est pas que je manque de compétences techniques**, c'est que je manque de **compréhension technique** de l'environnement.

Notre tâche principale n'est pas d'exploiter les machines, mais de **découvrir comment elles peuvent être exploitées**.

#### L'approche méthodique change tout

Avant ce cours, mon approche était :
1. Scan Nmap
2. Recherche d'exploits
3. Tentative d'exploitation

Maintenant, mon approche est :
1. Comprendre le **business** de l'entreprise
2. Identifier les **services nécessaires** à ce business
3. Cartographier l'**infrastructure** qui supporte ces services
4. Analyser les **mesures de sécurité** en place
5. Identifier les **vecteurs d'attaque** potentiels
6. **Seulement ensuite** : exploitation ciblée

> La différence entre un script kiddie et un pentester professionnel se trouve dans cette méthodologie
{: .prompt-danger}

---

## Méthodologie d'énumération

### Pourquoi une méthodologie standardisée est essentielle

Au début de mon apprentissage, je suivais une approche **basée sur l'expérience** : je faisais ce qui me semblait naturel, dans l'ordre qui me paraissait logique. Le problème ? **Ce n'est pas une méthodologie standardisée**.

Quand on fait face à des infrastructures complexes avec des centaines de services différents, il est presque **impossible de prévoir** comment notre approche devrait être conçue. Sans méthodologie claire, on risque :

- D'**oublier** des aspects importants
- De **perdre du temps** sur des pistes non pertinentes
- De **manquer** des vecteurs d'attaque évidents

> Une méthodologie n'est pas un guide pas-à-pas, c'est un **résumé de procédures systématiques** pour explorer une cible donnée
{: .prompt-info}

### Le modèle en 6 couches

Le cours propose une méthodologie **statique** avec une **dynamique libre**. C'est un concept qui m'a semblé contradictoire au début, mais qui fait totalement sens maintenant :

- La **structure** (les 6 couches) est fixe
- L'**exécution** (outils, techniques) est flexible et s'adapte

L'énumération est divisée en **trois niveaux principaux** :

1. **Infrastructure-based enumeration** (couches 1-2)
2. **Host-based enumeration** (couches 3-4)
3. **OS-based enumeration** (couches 5-6)

### L'analogie du labyrinthe qui a tout changé

Le cours utilise une métaphore que j'adore : **chaque couche est un mur avec des obstacles à franchir**.

Mon approche maintenant :
1. Je **regarde autour** pour trouver l'entrée
2. Je cherche les **failles** par lesquelles je peux passer
3. Je peux **escalader** si nécessaire

Ce que je **ne fais plus** :
- ❌ Foncer tête baissée à travers le mur
- ❌ Perdre du temps et de l'énergie sur un point qui ne mène nulle part
- ❌ Forcer un passage sans savoir s'il y a une entrée de l'autre côté

> Toutes les vulnérabilités (les "trous") que je trouve ne mènent pas forcément à l'intérieur. C'est une réalité que j'ai appris à accepter
{: .prompt-warning}

### Les 6 couches en détail

#### Couche 1 : Présence Internet

**Ce que je cherche ici :** Identifier TOUS les systèmes cibles possibles et interfaces testables.

| Catégorie d'information | Ce que j'analyse |
|------------------------|------------------|
| Domaines | Domaines principaux et variations |
| Sous-domaines | Découverte de sous-domaines actifs |
| vHosts | Hôtes virtuels sur les mêmes IPs |
| ASN | Numéros de système autonome |
| Netblocks | Blocs d'adresses IP |
| Adresses IP | IPs publiques de l'infrastructure |
| Instances Cloud | Services hébergés dans le cloud |
| Mesures de sécurité | WAF, CDN, protections visibles |

**Mon approche personnelle :**

Si le contrat m'autorise à chercher des hôtes supplémentaires, cette couche devient **critique**. Je passe beaucoup de temps ici car chaque nouvel asset découvert = nouvelle surface d'attaque.

> Note importante : Cette couche s'applique principalement aux tests externes. Pour l'interne (Active Directory par exemple), l'approche sera différente
{: .prompt-info}

#### Couche 2 : Passerelle (Gateway)

**Ce que je cherche ici :** Comprendre avec quoi j'ai affaire et ce que je dois surveiller.

| Mesure de sécurité | Mon analyse |
|-------------------|-------------|
| Firewalls | Quelles règles bloquent mon trafic ? |
| DMZ | Y a-t-il une zone démilitarisée ? |
| IPS/IDS | Mes scans sont-ils détectés ? |
| EDR | Protection des endpoints en place ? |
| Proxies | Le trafic est-il filtré/inspecté ? |
| NAC | Contrôle d'accès réseau actif ? |
| Segmentation réseau | Les réseaux sont-ils isolés ? |
| VPN | Accès VPN requis pour certains services ? |
| Cloudflare | Protection CDN/WAF en place ? |

**Mon observation :**

Cette couche est cruciale pour **adapter ma stratégie**. Par exemple :
- Si je détecte un IPS agressif → Je ralentis mes scans
- Si je vois Cloudflare → Je ne perds pas de temps à scanner l'IP réelle
- Si je trouve un VPN → Je note que l'accès interne nécessitera des credentials

#### Couche 3 : Services accessibles

**Ce que je cherche ici :** Comprendre la raison et la fonctionnalité du système cible pour communiquer efficacement avec lui.

| Information | Pourquoi c'est important |
|-------------|-------------------------|
| Type de service | HTTP, SSH, SMB, etc. |
| Fonctionnalité | À quoi sert ce service ? |
| Configuration | Comment est-il configuré ? |
| Port | Port standard ou personnalisé ? |
| Version | Version vulnérable connue ? |
| Interface | Comment interagir avec ? |

**C'est la partie du cours sur laquelle on va principalement se concentrer dans ce module.**

Chaque service a été installé pour une **raison spécifique** par l'administrateur. Pour travailler efficacement avec ces services, je dois comprendre :
- **Comment ils fonctionnent**
- **Pourquoi ils existent**
- **Comment communiquer avec eux**

#### Couche 4 : Processus

**Ce que je cherche ici :** Comprendre les facteurs et identifier les dépendances entre les processus.

À chaque fois qu'une commande ou fonction est exécutée, des données sont traitées. Cela démarre un processus qui a :
- Au moins **une source**
- Au moins **une destination**
- Des **tâches** à accomplir

| Élément | Mon analyse |
|---------|-------------|
| PID | Quel processus tourne ? |
| Données traitées | Quelles données sont manipulées ? |
| Tâches | Que fait le processus exactement ? |
| Source | D'où viennent les données ? |
| Destination | Où vont les données ? |

**Exemple concret que j'ai vécu :**

Sur un serveur web, j'ai remarqué qu'un processus PHP écrivait dans `/tmp/` puis un cron job déplaçait ces fichiers vers `/var/www/uploads/`. Cette dépendance m'a permis d'identifier une fenêtre temporelle pour injecter du code.

#### Couche 5 : Privilèges

**Ce que je cherche ici :** Identifier les permissions et comprendre ce qui est possible ou impossible avec ces privilèges.

Chaque service tourne avec :
- Un **utilisateur spécifique**
- Dans un **groupe particulier**
- Avec des **permissions définies**

| Élément | Ce que j'analyse |
|---------|------------------|
| Groupes | Appartenance aux groupes |
| Utilisateurs | Comptes de service |
| Permissions | Droits effectifs |
| Restrictions | Limitations en place |
| Environnement | Variables et contexte |

> Les privilèges offrent souvent des fonctions que les administrateurs **négligent**. C'est particulièrement vrai dans les infrastructures Active Directory
{: .prompt-tip}

**Mon expérience personnelle :**

J'ai souvent trouvé des comptes de service avec des privilèges **excessifs** parce que l'administrateur gérait plusieurs domaines et avait pris des raccourcis. C'est un pattern récurrent.

#### Couche 6 : Configuration OS

**Ce que je cherche ici :** Voir comment les administrateurs gèrent les systèmes et quelles informations sensibles internes je peux récupérer.

Avec un **accès interne**, je collecte des informations sur :

| Information | Mon analyse |
|-------------|-------------|
| Type OS | Linux ? Windows ? Version ? |
| Niveau de patch | Système à jour ? |
| Configuration réseau | Interfaces, routes, DNS |
| Environnement OS | Variables, chemins |
| Fichiers de configuration | Configs potentiellement sensibles |
| Fichiers privés sensibles | Clés SSH, historiques, etc. |

Cette couche me donne un **aperçu de la sécurité interne** et reflète les compétences des équipes d'administration.

### La méthodologie en pratique

#### Ce que j'ai vraiment compris

Une méthodologie ≠ un guide pas-à-pas avec des commandes exactes.

**La méthodologie** = L'approche systématique pour explorer une cible  
**Les outils et commandes** = Un cheat sheet que je consulte selon les cas

#### L'aspect dynamique qui change tout

Les outils pour identifier les composants et obtenir les informations sont **dynamiques** et en **constante évolution**.

**Exemple concret :**

Pour l'énumération de serveurs web, j'ai des dizaines d'outils disponibles :
- `nikto`
- `gobuster`
- `ffuf`
- `wfuzz`
- `feroxbuster`

Chaque outil a un **focus spécifique** et livre des **résultats différents**. Mais l'**objectif reste le même** : énumérer le serveur web.

> La collection d'outils n'est pas la méthodologie elle-même, c'est une ressource à laquelle je me réfère dans des cas donnés
{: .prompt-info}

#### La réalité du pentesting

Un point crucial que le cours souligne et que j'ai vérifié sur le terrain :

**Même après 4 semaines de test, je ne peux JAMAIS dire à 100% qu'il n'y a plus de vulnérabilités.**

Quelqu'un qui étudie l'entreprise depuis des mois aura une compréhension **bien plus profonde** que ce que je peux obtenir en quelques semaines.

**Exemple parfait :** L'attaque SolarWinds mentionnée dans le cours. Les attaquants ont passé des mois à étudier l'infrastructure avant de frapper.

> C'est pour ça qu'une méthodologie structurée est essentielle - elle doit maximiser l'efficacité dans le temps limité disponible
{: .prompt-danger}

### Mon approche personnelle maintenant

Avant ce cours, je sautais des couches ou les faisais dans le désordre. Maintenant, je suis **méthodique** :

1. **Couche 1** : Je cartographie TOUTE la présence Internet (3-4 jours)
2. **Couche 2** : J'identifie les protections (1-2 jours)
3. **Couche 3** : J'énumère tous les services accessibles (2-3 jours)
4. **Couche 4** : J'analyse les processus et dépendances (1-2 jours)
5. **Couche 5** : Je vérifie les privilèges (1 jour)
6. **Couche 6** : J'examine la configuration OS (1 jour)

Ces durées sont indicatives et varient selon la taille de l'infrastructure, mais l'**ordre reste constant**.

**Cours complété**

{% include comments.html %}