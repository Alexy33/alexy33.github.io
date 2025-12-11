---
title: "HackTheBox - Information Gathering - Search Engine Discovery"
date: 2025-12-11 14:30:00 +0200
categories: [HackTheBox, Learning]
tags: [osint, google-dorking, reconnaissance, search-operators, information-gathering]
description: "Apprendre à utiliser les moteurs de recherche comme outils de reconnaissance pour découvrir des informations sensibles et des vulnérabilités"
image:
  path: /assets/img/posts/information-gathering.png
  alt: "Search Engine Discovery - HTB Academy"
---

## Informations sur le module

Ce module explore comment transformer les moteurs de recherche en outils puissants de reconnaissance web. Au-delà de leur fonction première, Google et les autres moteurs indexent une quantité massive d'informations qui peuvent révéler des données sensibles, des vulnérabilités ou des points d'entrée potentiels.

**Lien :** [Search Engine Discovery](https://academy.hackthebox.com/beta/module/144/section/3080)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre les principes de l'OSINT avec les moteurs de recherche
- Maîtriser les opérateurs de recherche avancés
- Utiliser le Google Dorking pour découvrir des informations sensibles
- Identifier des vulnérabilités et des expositions de données
- Appliquer des techniques de reconnaissance éthique

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Search Engine Discovery

### Pourquoi j'utilise les moteurs de recherche en reconnaissance

Quand j'ai commencé à apprendre la reconnaissance web, je pensais que les moteurs de recherche servaient uniquement à trouver des sites. **Grave erreur !** Les moteurs comme Google indexent des milliards de pages et, avec les bons opérateurs, deviennent des outils d'OSINT incroyablement puissants.

> **Pour les débutants** : OSINT signifie "Open Source Intelligence" - c'est l'art de collecter des informations publiquement accessibles pour comprendre une cible.
{: .prompt-info}

**Ce qui rend cette approche unique :**

- **Tout est légal** - On utilise des informations publiques
- **Énorme couverture** - Les moteurs indexent une portion massive du web
- **Accessible à tous** - Pas besoin d'outils coûteux ou complexes
- **Gratuit** - Aucun abonnement requis

### Mes cas d'usage pratiques

J'applique la découverte par moteur de recherche dans plusieurs contextes :

**En audit de sécurité :**
- Identifier des fichiers sensibles exposés accidentellement
- Découvrir des pages d'administration oubliées
- Repérer des configurations mal sécurisées

**En veille concurrentielle :**
- Analyser les services d'un concurrent
- Comprendre leur infrastructure technique
- Identifier leurs technologies utilisées

**En threat intelligence :**
- Traquer des acteurs malveillants
- Anticiper des menaces émergentes
- Analyser des patterns d'attaque

> **Limitation importante** : Les moteurs de recherche n'indexent pas tout. Certaines données sont volontairement cachées ou protégées par des robots.txt.
{: .prompt-warning}

### Les opérateurs de recherche que j'utilise

Les opérateurs sont comme des **codes secrets** qui débloquent la vraie puissance des moteurs de recherche. Au lieu de chercher "login page", je peux cibler exactement ce que je veux avec `site:example.com inurl:login`.

#### Opérateurs essentiels

| Opérateur | Ce que j'en fais | Exemple concret |
|-----------|------------------|-----------------|
| `site:` | Limiter à un domaine spécifique | `site:hackthebox.com` trouve tout sur HTB |
| `inurl:` | Chercher dans les URLs | `inurl:admin` repère les panels d'administration |
| `filetype:` | Trouver des documents spécifiques | `filetype:pdf` pour les documents PDF |
| `intitle:` | Chercher dans les titres de page | `intitle:"confidential"` trouve des docs sensibles |
| `intext:` | Chercher dans le contenu | `intext:"password reset"` localise les pages de reset |
| `cache:` | Voir la version en cache | `cache:example.com` pour voir l'ancien contenu |

> **Astuce** : La syntaxe peut varier légèrement entre Google, Bing et DuckDuckGo, mais les principes restent identiques.
{: .prompt-tip}

#### Opérateurs avancés que j'utilise souvent

**Pour combiner des critères :**

```
site:bank.com AND (inurl:admin OR inurl:login)
```

Cette requête trouve les pages d'admin OU de login spécifiquement sur bank.com.

**Pour exclure du contenu :**

```
site:news.com -inurl:sports
```

J'utilise le `-` pour exclure les pages sportives d'un site d'actualités.

**Pour les recherches exactes :**

```
"information security policy"
```

Les guillemets forcent la recherche de cette phrase exacte, pas juste des mots séparés.

#### Mon tableau de référence complet

| Opérateur | Usage personnel | Exemple pratique |
|-----------|-----------------|------------------|
| `link:` | Qui pointe vers un site | `link:example.com` pour l'analyse de backlinks |
| `related:` | Sites similaires | `related:github.com` trouve des alternatives |
| `info:` | Infos sur un site | `info:example.com` donne un résumé rapide |
| `numrange:` | Plage numérique | `site:shop.com numrange:100-500` pour les prix |
| `allintext:` | Tous les mots dans le texte | `allintext:admin password` trouve les deux termes |
| `*` (wildcard) | Remplace n'importe quoi | `user* manual` trouve "user guide", "user handbook", etc. |
| `..` (range) | Plage de valeurs | `price 100..500` pour une fourchette de prix |

### Google Dorking : Ma technique préférée

Le Google Dorking (aussi appelé Google Hacking) est devenu mon outil favori. C'est l'art d'utiliser les opérateurs pour découvrir des **informations qui ne devraient pas être publiques**.

> **Pour les débutants** : Le terme "Dorking" vient de la Google Hacking Database (GHDB), une collection de requêtes avancées pour trouver des vulnérabilités.
{: .prompt-info}

#### Mes dorks les plus utilisés

**Trouver des pages de login :**

```
site:example.com inurl:login
site:example.com (inurl:login OR inurl:admin)
```

**Ma première tentative :** J'ai cherché `inurl:admin` sans spécifier de site. **Erreur !** J'ai obtenu des millions de résultats inutiles. Maintenant, je combine toujours avec `site:` pour cibler un domaine précis.

**Identifier des fichiers exposés :**

```
site:example.com filetype:pdf
site:example.com (filetype:xls OR filetype:docx)
```

**Ce qui m'a surpris :** En testant `filetype:xls` sur certains sites, j'ai trouvé des feuilles Excel avec des **données sensibles** (emails, numéros de téléphone) qui n'auraient jamais dû être publiques.

**Découvrir des fichiers de configuration :**

```
site:example.com inurl:config.php
site:example.com (ext:conf OR ext:cnf)
```

> Les fichiers de configuration contiennent souvent des informations critiques : identifiants de base de données, clés API, chemins système.
{: .prompt-danger}

**Localiser des backups de base de données :**

```
site:example.com inurl:backup
site:example.com filetype:sql
```

**Mon observation :** Les fichiers `.sql` exposés sont une **mine d'or** pour un attaquant. Ils peuvent contenir toute la structure et les données d'une base. En pentest, c'est une découverte critique.

### Ma méthodologie en pratique

Quand je fais de la reconnaissance sur une cible, voici ma démarche :

**1. Reconnaissance large**

```bash
site:target.com
```

Je commence par voir tout ce qui est indexé.

**2. Recherche de points d'entrée**

```bash
site:target.com (inurl:admin OR inurl:login OR inurl:dashboard)
```

**3. Chasse aux fichiers sensibles**

```bash
site:target.com (filetype:pdf OR filetype:xls OR filetype:doc OR filetype:sql)
```

**4. Analyse des configurations**

```bash
site:target.com (ext:conf OR ext:config OR ext:cnf OR ext:ini)
```

**5. Recherche de données exposées**

```bash
site:target.com (intext:"password" OR intext:"username" OR intext:"email")
```

### Ressources pour approfondir

Pour explorer plus de Google Dorks, je consulte régulièrement :
- [Google Hacking Database (GHDB)](https://www.exploit-db.com/google-hacking-database) - La référence en matière de dorks
- [Documentation des opérateurs Google](https://support.google.com/websearch/answer/2466433) - Guide officiel

> **Éthique** : N'utilisez ces techniques QUE sur des cibles pour lesquelles vous avez une autorisation écrite. Le Google Dorking est légal, mais exploiter les failles découvertes sans autorisation est illégal.
{: .prompt-danger}

### Ce que j'ai appris

La découverte par moteur de recherche m'a montré que la **sécurité par l'obscurité ne fonctionne pas**. Si quelque chose est accessible publiquement, même "caché", il peut être trouvé.

**Mes takeaways :**
- Toujours combiner plusieurs opérateurs pour affiner les résultats
- Documenter chaque découverte avec des captures d'écran
- Vérifier manuellement les résultats critiques
- Respecter les limites légales et éthiques

Le Google Dorking est une compétence fondamentale en reconnaissance web. Avec de la pratique, on développe une intuition pour construire les bonnes requêtes qui révèlent ce que d'autres ne voient pas.

**Cours complété**

{% include comments.html %}