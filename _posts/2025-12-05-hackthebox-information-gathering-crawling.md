---
title: "HackTheBox - Information gathering - Crawling"
date: 2025-12-05 16:22:00 +0200
categories: [HackTheBox, Learning]
tags: [crawling, reconnaissance, web-scraping, enumeration, osint]
description: "Découverte du crawling web : comment les bots parcourent systématiquement les sites pour collecter des informations durant la phase de reconnaissance"
image:
  path: /assets/img/posts/information-gathering.png
  alt: "Illustration du processus de crawling web"
---

## Informations sur le module

Cette section couvre le **crawling web**, une technique d'exploration automatisée qui permet de parcourir méthodiquement un site internet pour en extraire des informations. C'est une compétence essentielle en reconnaissance passive.

**Lien :** [Crawling - HTB Academy](https://academy.hackthebox.com/beta/module/144/section/3076)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre le fonctionnement des web crawlers
- Différencier les stratégies de crawling (breadth-first vs depth-first)
- Identifier les types de données extraites durant le crawling
- Analyser les informations collectées dans leur contexte

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Qu'est-ce que le crawling web ?

Le **crawling** (ou "spidering" en anglais) est un processus d'exploration automatisée du web. J'aime bien l'analogie avec l'araignée : comme elle se déplace sur sa toile, un crawler suit les liens d'une page à l'autre pour collecter des informations.

> **Pour les débutants** : Un crawler est un bot (programme automatisé) qui visite des pages web, récupère leur contenu, et suit tous les liens qu'il trouve pour continuer son exploration.
{: .prompt-info}

**Pourquoi c'est différent du fuzzing ?**

Contrairement au fuzzing où on "devine" des URLs potentielles, le crawling suit **uniquement les liens existants**. C'est beaucoup plus précis et permet de cartographier la structure réelle d'un site.

### Comment ça fonctionne concrètement

Le processus est assez simple mais très efficace :

1. **Point de départ** : On donne au crawler une URL initiale (appelée "seed URL")
2. **Extraction** : Le crawler visite cette page et récupère tous les liens
3. **File d'attente** : Ces liens sont ajoutés dans une liste à visiter
4. **Itération** : Le crawler visite chaque lien, extrait de nouveaux liens, et répète le processus

**Exemple d'exploration :**
```
Homepage
├── link1
├── link2
└── link3

En visitant link1, on découvre :
link1 Page
├── Homepage (déjà visité)
├── link2 (déjà visité)
├── link4 (nouveau !)
└── link5 (nouveau !)
```

Le crawler continue ainsi jusqu'à avoir exploré toutes les pages accessibles.

### Les deux stratégies de crawling

J'ai appris qu'il existe deux approches principales pour parcourir un site, chacune ayant ses avantages selon l'objectif.

#### Crawling en largeur (Breadth-First)

Cette stratégie explore **d'abord tous les liens au même niveau** avant de descendre plus profondément.
```
Seed URL → Page 1
            ├── Page 2
            │   ├── Page 4
            │   └── Page 5
            └── Page 3
                ├── Page 6
                └── Page 7
```

**Mon observation :** C'est parfait quand je veux avoir une **vue d'ensemble rapide** de la structure d'un site. Ça me donne un aperçu de toutes les sections principales avant de plonger dans les détails.

#### Crawling en profondeur (Depth-First)

À l'inverse, cette approche suit **un chemin jusqu'au bout** avant de revenir en arrière.
```
Seed URL → Page 1 → Page 2 → Page 3
                              ├── Page 4
                              └── Page 5
```

**Quand l'utiliser ?** Quand je cherche quelque chose de spécifique ou que je veux atteindre les pages les plus profondes du site rapidement.

> Le choix de la stratégie dépend entièrement de l'objectif de reconnaissance. Pour une cartographie complète : breadth-first. Pour trouver des fichiers cachés en profondeur : depth-first.
{: .prompt-tip}

### Les informations précieuses à extraire

Durant mes tests de crawling, j'ai découvert qu'on peut récupérer plusieurs types de données très utiles :

#### Les liens (internes et externes)

C'est la base du crawling. Les **liens internes** permettent de cartographier la structure du site, tandis que les **liens externes** révèlent les relations avec d'autres domaines.

**Ce que j'en fais :**
- Identifier les sections cachées du site
- Découvrir des sous-domaines mentionnés
- Repérer les partenaires ou services tiers utilisés

#### Les commentaires utilisateurs

> Les sections de commentaires sont souvent négligées, mais elles peuvent contenir des **révélations involontaires** sur les processus internes ou des vulnérabilités.
{: .prompt-warning}

J'ai vu des utilisateurs mentionner des versions de logiciels, des problèmes techniques, ou même des chemins d'accès internes dans leurs commentaires.

#### Les métadonnées

Les métadonnées sont des **données sur les données**. Sur une page web, ça inclut :
- Titre et description de la page
- Mots-clés
- Nom de l'auteur
- Dates de création/modification

**Mon astuce :** Les métadonnées me donnent le contexte et la pertinence d'une page sans même avoir à lire tout le contenu.

#### Les fichiers sensibles

C'est probablement l'aspect le plus critique. Un crawler peut être configuré pour chercher activement des fichiers qui ne devraient pas être exposés :

| Type de fichier | Exemples | Risques |
|-----------------|----------|---------|
| Sauvegardes | `.bak`, `.old`, `.backup` | Code source, configurations |
| Configuration | `web.config`, `settings.php` | Credentials, clés API |
| Logs | `error_log`, `access_log` | Chemins internes, comportements |

> Toujours examiner attentivement les fichiers de sauvegarde et de configuration découverts. Ils contiennent souvent des informations critiques comme des identifiants de base de données ou des clés de chiffrement.
{: .prompt-danger}

### L'importance du contexte dans l'analyse

**Voici ce que j'ai compris de crucial :** une information isolée ne vaut rien. C'est la **corrélation entre plusieurs découvertes** qui révèle les vraies vulnérabilités.

#### Exemple concret de mon expérience

Imaginons que durant un crawling, je découvre :

1. **Un commentaire** mentionnant "le serveur de fichiers est lent aujourd'hui"
2. **Plusieurs liens** pointant vers `/files/`
3. **Une métadonnée** indiquant une modification récente du répertoire

Individuellement, ces informations semblent anodines. Mais en les **combinant**, je me dis : "Et si ce répertoire `/files/` était accessible publiquement ?"

Je visite manuellement l'URL, et **bingo** : le directory listing est activé, exposant des archives de sauvegarde et des documents internes !

**Sans cette analyse contextuelle, j'aurais raté cette découverte.**

#### Autre scénario révélateur

Un commentaire mentionne "la version 2.3.1 plante souvent". Seul, ça ne dit pas grand-chose.

Mais si je trouve aussi :
- Dans les métadonnées : une version logicielle correspondante
- Dans un fichier de config : des paramètres pour cette version
- Via une recherche : que cette version a une vulnérabilité connue

Là, j'ai une **piste concrète** à exploiter !

> Le véritable art de la reconnaissance réside dans la capacité à **connecter les points** entre différentes sources d'information. Chaque donnée collectée doit être analysée dans son contexte global.
{: .prompt-tip}

### Ma méthodologie d'analyse

Quand j'analyse les résultats d'un crawl, je procède toujours ainsi :

1. **Premier passage** : Identifier les patterns et anomalies
2. **Regroupement** : Classer les informations par thème (fichiers, liens, métadonnées)
3. **Corrélation** : Chercher les connexions entre différentes découvertes
4. **Priorisation** : Évaluer quelles pistes méritent une investigation manuelle
5. **Vérification** : Tester manuellement les hypothèses les plus prometteuses

---

## Le fichier robots.txt

Durant mes reconnaissances web, j'ai découvert que **robots.txt** fonctionne comme un panneau "Privé - Ne pas entrer" pour les bots. C'est une sorte de **code de bonne conduite** que la plupart des crawlers respectent.

> **Pour les débutants** : robots.txt est un simple fichier texte placé à la racine d'un site web (par exemple `www.example.com/robots.txt`) qui indique aux bots quelles parties du site ils peuvent explorer ou non.
{: .prompt-info}

### Fonctionnement technique

Le fichier suit le **Robots Exclusion Standard**, un ensemble de règles qui définissent comment les crawlers doivent se comporter. Les instructions sont appelées "directives" et ciblent des "user-agents" (identifiants de bots).

**Exemple basique que j'utilise souvent :**
```txt
User-agent: *
Disallow: /private/
```

Cette directive dit à **tous les bots** (`*` = wildcard) qu'ils ne peuvent pas accéder aux URLs commençant par `/private/`.

### Structure d'un fichier robots.txt

Quand j'analyse un robots.txt, je regarde toujours deux éléments clés :

#### 1. User-agent

Cette ligne spécifie **quel bot** est concerné par les règles qui suivent. Le wildcard `*` s'applique à tous les bots, mais on peut aussi cibler des crawlers spécifiques comme "Googlebot" ou "Bingbot".

#### 2. Les directives

Ce sont les instructions concrètes données aux bots. Voici celles que je rencontre le plus souvent :

| Directive | Description | Mon usage |
|-----------|-------------|-----------|
| `Disallow` | Chemins interdits au crawl | Identifier les zones sensibles |
| `Allow` | Autorise explicitement un chemin | Exceptions dans les zones interdites |
| `Crawl-delay` | Délai (en secondes) entre requêtes | Éviter de surcharger le serveur |
| `Sitemap` | URL du sitemap XML | Cartographie efficace du site |

**Exemple de Crawl-delay :**
```txt
Crawl-delay: 10
```

Cela demande au bot d'attendre 10 secondes entre chaque requête. C'est important pour ne pas surcharger le serveur cible.

### Pourquoi respecter robots.txt ?

Même si techniquement un bot malveillant **peut ignorer** ces directives, la plupart des crawlers légitimes les respectent. Voici pourquoi c'est important :

**Éviter la surcharge serveur**

En limitant l'accès à certaines zones, les propriétaires de sites empêchent un trafic excessif qui pourrait ralentir ou crasher leurs serveurs.

**Protéger les informations sensibles**

Le robots.txt peut empêcher l'indexation de données privées ou confidentielles par les moteurs de recherche.

**Conformité légale et éthique**

> Ignorer robots.txt peut être considéré comme une violation des conditions d'utilisation d'un site, voire constituer un problème légal, surtout si cela implique l'accès à des données protégées par copyright.
{: .prompt-warning}

### Utilisation en reconnaissance web

**Ce qui est fascinant :** robots.txt est une mine d'informations pour la phase de reconnaissance, tout en respectant les directives.

#### Découvrir des répertoires cachés

Les chemins interdits pointent souvent vers des zones que le propriétaire veut **volontairement cacher** des moteurs de recherche. Ces zones peuvent contenir :
- Fichiers de sauvegarde
- Panneaux d'administration
- Données sensibles
- Ressources internes

**Mon observation :** Si un site interdit `/admin/`, il y a de fortes chances qu'un panneau d'administration existe à cet emplacement !

#### Cartographier la structure du site

En analysant les chemins autorisés et interdits, je peux créer une **carte rudimentaire** de la structure du site. Cela révèle des sections non liées depuis la navigation principale.

#### Détecter les pièges à crawlers

Certains sites incluent intentionnellement des répertoires "honeypot" dans robots.txt pour **piéger les bots malveillants**. Identifier ces pièges me renseigne sur le niveau de sensibilisation à la sécurité du site cible.

> Un répertoire leurre typique pourrait être `/trap/` ou `/honeypot/` mentionné dans le Disallow. Tenter d'y accéder pourrait déclencher des alertes chez l'administrateur.
{: .prompt-tip}

### Analyse d'un exemple concret

Voici un fichier robots.txt que j'ai récemment analysé :
```txt
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /public/

User-agent: Googlebot
Crawl-delay: 10

Sitemap: https://www.example.com/sitemap.xml
```

**Ma démarche d'analyse :**

1. **Tous les bots** ne peuvent pas accéder à `/admin/` et `/private/`
2. **Tous les bots** peuvent accéder à `/public/`
3. **Googlebot spécifiquement** doit attendre 10 secondes entre chaque requête
4. Un **sitemap** est disponible pour faciliter l'exploration

**Ce que j'en déduis :**

- Le site possède probablement un **panneau d'administration** à `/admin/`
- Du contenu privé existe dans `/private/`
- Le site veut contrôler la charge sur le serveur (crawl-delay pour Google)
- Le sitemap peut me donner une vue complète de l'architecture publique

### Mon approche éthique

Même si je trouve des répertoires intéressants dans robots.txt, je respecte toujours les directives, surtout les `Disallow`. 

**Pourquoi ?**
- C'est la **bonne pratique** en pentest éthique
- Cela évite de déclencher des alertes prématurément
- Le but est d'identifier les zones sensibles, pas de les exploiter sans autorisation

> En phase de reconnaissance, robots.txt est une source d'intelligence passive parfaite : elle révèle des informations précieuses sans nécessiter d'interaction agressive avec le site cible.
{: .prompt-info}

### Ressources pour approfondir

Pour comprendre le standard en détail :
- [Robots Exclusion Protocol (robotstxt.org)](https://www.robotstxt.org/) : Documentation officielle du standard
- [Google Search Central - robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro) : Guide détaillé de Google sur l'utilisation de robots.txt

---

## Les URIs Well-Known

Durant mes reconnaissances, j'ai découvert un mécanisme standardisé fascinant : le répertoire **/.well-known/**. C'est comme un "bureau d'information" standardisé que tous les sites peuvent avoir à la racine de leur domaine.

> **Pour les débutants** : .well-known est un répertoire spécial défini dans le RFC 8615 qui centralise les métadonnées importantes d'un site web (configuration, services, sécurité) à un emplacement prévisible : `https://example.com/.well-known/`
{: .prompt-info}

### Pourquoi c'est génial pour la reconnaissance

**L'avantage majeur :** Au lieu de chercher partout, je sais exactement où trouver certaines informations critiques. Les navigateurs, applications et outils de sécurité peuvent automatiquement localiser des fichiers de configuration en construisant l'URL appropriée.

**Exemple concret :**
Pour accéder à la politique de sécurité d'un site, je visite simplement :
```
https://example.com/.well-known/security.txt
```

### Les URIs well-known les plus utiles

L'**IANA** (Internet Assigned Numbers Authority) maintient un registre officiel de ces URIs. Voici ceux que j'utilise régulièrement en reconnaissance :

| URI | Description | Mon usage en recon |
|-----|-------------|-------------------|
| `security.txt` | Contacts pour signaler des vulnérabilités | Identifier qui contacter en pentest |
| `change-password` | URL standardisée pour changer son mot de passe | Tester les flux d'authentification |
| `openid-configuration` | Configuration OpenID Connect (OAuth 2.0) | Découvrir les endpoints d'authentification |
| `assetlinks.json` | Vérification de propriété d'assets numériques | Mapper les apps associées au domaine |
| `mta-sts.txt` | Politique de sécurité email (SMTP) | Analyser la configuration email |

> Chaque entrée du registre IANA a des guidelines spécifiques d'implémentation, assurant une approche standardisée. C'est parfait pour l'automatisation !
{: .prompt-tip}

### Focus sur openid-configuration

**C'est mon URI préféré** en reconnaissance car il révèle énormément d'informations sur l'infrastructure d'authentification.

#### Qu'est-ce que c'est ?

OpenID Connect Discovery est une couche d'identité construite sur OAuth 2.0. Quand une application veut utiliser OpenID Connect, elle récupère la configuration du fournisseur via :
```
https://example.com/.well-known/openid-configuration
```

**Exemple de réponse que j'ai obtenue :**
```json
{
  "issuer": "https://example.com",
  "authorization_endpoint": "https://example.com/oauth2/authorize",
  "token_endpoint": "https://example.com/oauth2/token",
  "userinfo_endpoint": "https://example.com/oauth2/userinfo",
  "jwks_uri": "https://example.com/oauth2/jwks",
  "response_types_supported": ["code", "token", "id_token"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "scopes_supported": ["openid", "profile", "email"]
}
```

#### Ce que j'extrais de cette configuration

**1. Découverte des endpoints**

Chaque endpoint révèle un point d'entrée de l'infrastructure :

- **authorization_endpoint** : URL où les utilisateurs sont redirigés pour s'authentifier
- **token_endpoint** : URL où les tokens sont émis
- **userinfo_endpoint** : Endpoint qui fournit les informations utilisateur

**Mon observation :** Ces endpoints sont des cibles potentielles pour tester les mécanismes d'authentification et d'autorisation.

**2. JWKS URI**

Le `jwks_uri` révèle le **JSON Web Key Set**, qui détaille les clés cryptographiques utilisées par le serveur.
```
https://example.com/oauth2/jwks
```

**Pourquoi c'est important ?** Comprendre quelles clés sont utilisées aide à évaluer la robustesse de l'implémentation cryptographique.

**3. Scopes et types de réponse supportés**

Les `scopes_supported` et `response_types_supported` me permettent de **cartographier les fonctionnalités** disponibles :

- `openid` : Authentification de base
- `profile` : Accès au profil utilisateur
- `email` : Accès à l'email

**Ce que j'en déduis :** Cela me montre les limites et possibilités de l'implémentation OpenID Connect.

**4. Détails des algorithmes**

Le champ `id_token_signing_alg_values_supported` indique les algorithmes de signature supportés (ici `RS256`).

> Connaître les algorithmes utilisés est crucial pour comprendre les mesures de sécurité en place. Des algorithmes faibles ou obsolètes pourraient indiquer des vulnérabilités potentielles.
{: .prompt-warning}

### Ma méthodologie d'exploration

Quand j'analyse un site cible, voici mon processus avec .well-known :

**1. Test systématique des URIs courants**

Je commence toujours par tester les URIs les plus communs :
```bash
curl https://target.com/.well-known/security.txt
curl https://target.com/.well-known/openid-configuration
curl https://target.com/.well-known/assetlinks.json
```

**2. Analyse du registre IANA**

J'explore ensuite le [registre IANA complet](https://www.iana.org/assignments/well-known-uris/well-known-uris.xhtml) pour identifier d'autres URIs potentiellement intéressants selon le contexte du site.

**3. Corrélation avec d'autres découvertes**

Les informations extraites des .well-known URIs sont **toujours corrélées** avec mes autres trouvailles (robots.txt, crawling, DNS, etc.).

**Exemple de corrélation :**

Si `openid-configuration` révèle un endpoint `/oauth2/authorize`, je vérifie si :
- Ce chemin apparaît dans robots.txt
- Il a été découvert durant le crawling
- Des commentaires ou métadonnées le mentionnent

### Opportunités de reconnaissance

Les .well-known URIs offrent plusieurs avantages tactiques :

**Découverte passive**

C'est une technique **complètement passive** : je consulte simplement des fichiers publics standardisés sans interaction suspecte.

**Cartographie de l'infrastructure**

Les endpoints découverts dans openid-configuration me permettent de :
- Identifier les services d'authentification utilisés
- Comprendre l'architecture OAuth/OIDC
- Repérer les APIs et microservices

**Identification des contacts de sécurité**

Le fichier `security.txt` contient souvent :
- Emails de contact pour le signalement de vulnérabilités
- Clés PGP pour communication chiffrée
- Politique de divulgation responsable

> En pentest autorisé, security.txt m'indique exactement qui contacter et comment communiquer les vulnérabilités découvertes de manière responsable.
{: .prompt-info}

### Exemple pratique de découverte

Lors d'un test récent, voici ce que j'ai trouvé sur un domaine cible :

**1. Visite de security.txt**
```
https://target.com/.well-known/security.txt
```

Résultat : Email de contact et politique de bug bounty !

**2. Vérification de openid-configuration**
```
https://target.com/.well-known/openid-configuration
```

Résultat : Découverte de 5 endpoints OAuth supplémentaires non listés dans la navigation.

**3. Exploration de assetlinks.json**
```
https://target.com/.well-known/assetlinks.json
```

Résultat : Liste des applications mobiles associées au domaine.

**Bilan :** En quelques requêtes HTTP simples, j'ai cartographié une partie significative de l'infrastructure d'authentification et identifié les assets numériques liés.

### Ressources pour aller plus loin

Documentation officielle et standards :
- [RFC 8615 - Well-Known URIs](https://www.rfc-editor.org/rfc/rfc8615.html) : Standard officiel définissant .well-known
- [IANA Well-Known URIs Registry](https://www.iana.org/assignments/well-known-uris/well-known-uris.xhtml) : Registre complet des URIs standardisés
- [RFC 9116 - security.txt](https://www.rfc-editor.org/rfc/rfc9116.html) : Spécification du fichier security.txt
- [OpenID Connect Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html) : Documentation complète du protocole

---

## Les outils de crawling

Le crawling web est un domaine vaste et complexe, mais heureusement, **je n'ai pas besoin de tout faire manuellement**. Il existe une multitude d'outils de crawling, chacun avec ses forces et spécialités.

> **Pour les débutants** : Les outils de crawling automatisent le processus d'exploration, le rendant plus rapide et efficace. Cela me permet de me concentrer sur l'analyse des données extraites plutôt que sur la collecte elle-même.
{: .prompt-info}

### Les crawlers populaires que j'utilise

Voici les outils que j'ai testés et qui ont chacun leur utilité selon le contexte :

#### Burp Suite Spider

**Burp Suite** est une plateforme complète de test d'applications web. Son crawler actif appelé **Spider** excelle à :
- Cartographier les applications web
- Identifier le contenu caché
- Découvrir des vulnérabilités potentielles

**Mon usage :** Je l'utilise principalement quand j'ai besoin d'une interface graphique et d'une intégration avec d'autres outils Burp.

#### OWASP ZAP (Zed Attack Proxy)

**ZAP** est un scanner de sécurité gratuit et open-source. Il peut être utilisé en mode automatisé ou manuel et inclut un composant spider.

**Avantage principal :** C'est gratuit et très efficace pour identifier rapidement les vulnérabilités pendant le crawl.

#### Scrapy (Framework Python)

**Scrapy** est un framework Python versatile et scalable pour construire des crawlers personnalisés.

**Pourquoi je l'adore :**
- Extraction de données structurées
- Gestion de scénarios complexes
- Automatisation du traitement des données
- **Flexibilité totale** pour des tâches de reconnaissance sur-mesure

#### Apache Nutch

**Nutch** est un crawler open-source hautement extensible écrit en Java, conçu pour gérer des crawls massifs.

**Quand l'utiliser :** Pour des projets de reconnaissance à grande échelle nécessitant de crawler l'ensemble d'un domaine ou plusieurs domaines.

> Quel que soit l'outil choisi, il est CRUCIAL de respecter les pratiques éthiques : toujours obtenir la permission avant de crawler un site, surtout pour des scans extensifs ou intrusifs. Il faut être conscient des ressources serveur et éviter de les surcharger.
{: .prompt-danger}

### Focus sur Scrapy : ReconSpider

Pour mes reconnaissances, j'utilise **Scrapy** avec un spider personnalisé appelé **ReconSpider**. C'est un excellent exemple de ce qu'on peut faire avec ce framework.

#### Installation de Scrapy

La première étape est d'installer Scrapy si ce n'est pas déjà fait :
```bash
pip3 install scrapy
```

Cette commande télécharge et installe Scrapy avec toutes ses dépendances.

#### Récupération de ReconSpider

Pour obtenir le spider personnalisé, j'utilise ces commandes :
```bash
wget -O ReconSpider.zip https://academy.hackthebox.com/storage/modules/144/ReconSpider.v1.2.zip
unzip ReconSpider.zip
```

**Ce qui m'a plu :** ReconSpider est déjà configuré pour extraire automatiquement différents types de données pertinentes en reconnaissance.

#### Utilisation de ReconSpider

Une fois extrait, je lance le spider avec cette commande simple :
```bash
python3 ReconSpider.py http://inlanefreight.com
```

> Remplacer `inlanefreight.com` par le domaine cible. Le spider va automatiquement crawler le site et collecter les informations.
{: .prompt-tip}

**Mon observation :** Le processus est complètement automatisé. Je lance la commande et je peux aller prendre un café pendant que le spider travaille.

### Analyse du fichier results.json

Après l'exécution, toutes les données sont sauvegardées dans **results.json**. Voici la structure que j'obtiens :
```json
{
    "emails": [
        "lily.floid@inlanefreight.com",
        "cvs@inlanefreight.com"
    ],
    "links": [
        "https://www.themeansar.com",
        "https://www.inlanefreight.com/index.php/offices/"
    ],
    "external_files": [
        "https://www.inlanefreight.com/wp-content/uploads/2020/09/goals.pdf"
    ],
    "js_files": [
        "https://www.inlanefreight.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.3.2"
    ],
    "form_fields": [],
    "images": [
        "https://www.inlanefreight.com/wp-content/uploads/2021/03/AboutUs_01-1024x810.png"
    ],
    "videos": [],
    "audio": [],
    "comments": [
        "<!-- #masthead -->"
    ]
}
```

#### Comprendre la structure JSON

Chaque clé représente un type de données spécifique. Voici comment j'utilise chacune :

| Clé JSON | Description | Mon usage en recon |
|----------|-------------|-------------------|
| `emails` | Adresses email trouvées | Identifier les contacts, patterns de naming |
| `links` | URLs de liens internes/externes | Cartographier la structure du site |
| `external_files` | Fichiers externes (PDFs, docs) | Trouver des documents sensibles |
| `js_files` | Fichiers JavaScript | Analyser le code front-end, chercher des APIs |
| `form_fields` | Champs de formulaire | Identifier les points d'entrée utilisateur |
| `images` | URLs des images | Métadonnées EXIF, chemins intéressants |
| `videos` | URLs des vidéos | Contenu multimédia |
| `audio` | URLs des fichiers audio | Fichiers audio exposés |
| `comments` | Commentaires HTML | Informations laissées par les développeurs |

### Ce que j'extrais de results.json

#### 1. Les adresses email

**Pourquoi c'est utile :**
- Identifier le pattern de naming (`prenom.nom@domain.com`)
- Trouver des contacts clés
- Préparer des campagnes de phishing (en test autorisé)

**Mon observation :** Les emails révèlent souvent la structure organisationnelle de l'entreprise.

#### 2. Les liens externes et internes

Les **liens internes** me permettent de :
- Comprendre l'architecture du site
- Identifier les sections importantes
- Découvrir des pages non référencées

Les **liens externes** révèlent :
- Les partenaires et fournisseurs
- Les services tiers utilisés
- Les dépendances externes

#### 3. Les fichiers externes

**C'est souvent une mine d'or !** Les PDFs, documents Word, ou fichiers Excel peuvent contenir :
- Métadonnées révélatrices (auteur, version logicielle)
- Informations confidentielles
- Structure organisationnelle

**Exemple de ce que j'ai trouvé :**
Un fichier `goals.pdf` qui contenait dans ses métadonnées le nom complet d'employés et la version d'Adobe Acrobat utilisée.

#### 4. Les fichiers JavaScript

Les JS files sont cruciaux car ils peuvent contenir :
- Endpoints d'API non documentés
- Clés API hardcodées (mauvaise pratique mais ça arrive)
- Logique métier front-end
- Versions de librairies (pour identifier des vulnérabilités connues)

> Toujours analyser les fichiers JavaScript en détail. J'ai déjà trouvé des clés API et des endpoints d'administration cachés dans du code JS minifié.
{: .prompt-warning}

#### 5. Les commentaires HTML

Les développeurs laissent parfois des **commentaires très révélateurs** dans le code source :
```html
<!-- TODO: Remove admin panel before production -->
<!-- API key: abc123 (temporary) -->
<!-- Old login at /legacy/admin -->
```

**Mon expérience :** J'ai découvert un ancien panneau d'administration via un commentaire "à faire" qui n'avait jamais été supprimé.

### Ma méthodologie d'analyse post-crawl

Une fois le `results.json` généré, voici mon processus systématique :

**1. Triage initial**

Je commence par identifier les catégories avec le plus de résultats :
```bash
cat results.json | jq '.emails | length'
cat results.json | jq '.links | length'
cat results.json | jq '.external_files | length'
```

**2. Analyse des emails**

J'examine les patterns pour comprendre la convention de nommage :
```bash
cat results.json | jq '.emails[]'
```

**3. Exploration des fichiers externes**

Je télécharge et analyse tous les fichiers externes pour vérifier leurs métadonnées :
```bash
cat results.json | jq '.external_files[]' | xargs -I {} wget {}
exiftool *.pdf
```

**4. Inspection des JS files**

Je recherche des patterns suspects dans les fichiers JavaScript :
```bash
# Chercher des clés API
grep -r "api[_-]key" *.js
# Chercher des endpoints
grep -r "/api/" *.js
```

**5. Corrélation avec autres découvertes**

Je croise les informations du crawl avec :
- Les données DNS
- Le contenu de robots.txt
- Les .well-known URIs
- Les résultats de subdomain enumeration

### Exemple pratique d'analyse

Voici un cas concret où ReconSpider m'a fait gagner beaucoup de temps :

**Contexte :** Reconnaissance sur un site d'e-commerce

**Résultats du crawl :**
- 47 emails récupérées
- 320 liens internes
- 12 fichiers PDF externes
- 85 fichiers JavaScript

**Découvertes intéressantes :**

1. **Pattern email identifié :** `prenom.nom@company.com`
2. **Lien caché découvert :** `/admin-backup/` (non référencé nulle part)
3. **Fichier sensible :** Un PDF avec la liste complète des employés et leurs rôles
4. **JS file révélateur :** Un fichier contenant l'URL d'une API interne non documentée
5. **Commentaire HTML :** `<!-- Legacy system at legacy.company.com -->`

**Impact :** Ces découvertes m'ont permis de cartographier l'infrastructure complète et d'identifier plusieurs vecteurs d'attaque potentiels, le tout de manière passive.

### Bonnes pratiques que j'applique

**Respect du crawl-delay**

Je configure toujours un délai entre les requêtes pour ne pas surcharger le serveur cible :
```python
# Dans les settings Scrapy
DOWNLOAD_DELAY = 2  # 2 secondes entre chaque requête
```

**Utilisation du User-Agent approprié**

Je personnalise le User-Agent pour être transparent sur mes intentions :
```python
USER_AGENT = 'ReconSpider/1.0 (Security Research)'
```

**Respect des directives robots.txt**

Scrapy respecte automatiquement robots.txt, mais je peux le vérifier :
```python
ROBOTSTXT_OBEY = True
```

> Même si techniquement je peux ignorer robots.txt, je le respecte toujours en phase de reconnaissance passive. C'est une question d'éthique et de professionnalisme.
{: .prompt-info}

### Ressources pour approfondir

Documentation et guides :
- [Documentation Scrapy](https://docs.scrapy.org/) : Guide complet du framework
- [Scrapy Tutorial](https://docs.scrapy.org/en/latest/intro/tutorial.html) : Tutoriel pour créer son premier spider
- [Burp Suite Spider Documentation](https://portswigger.net/burp/documentation/desktop/tools/spider) : Guide d'utilisation du spider Burp
- [OWASP ZAP User Guide](https://www.zaproxy.org/docs/) : Documentation complète de ZAP

---

### Question

**After spidering inlanefreight.com, identify the location where future reports will be stored. Respond with the full domain, e.g., files.inlanefreight.com.**

```bash
└──╼ [★]$ python3 ReconSpider.py http://inlanefreight.com
2025-12-05 10:10:39 [scrapy.utils.log] INFO: Scrapy 2.13.4 started (bot: scrapybot)
2025-12-05 10:10:39 [scrapy.utils.log] INFO: Versions:
{'lxml': '5.3.0',
 'libxml2': '2.12.9',
 'cssselect': '1.3.0',
 'parsel': '1.10.0',
 'w3lib': '2.3.1',
 'Twisted': '25.5.0',
 'Python': '3.11.2 (main, Apr 28 2025, 14:11:48) [GCC 12.2.0]',
 'pyOpenSSL': '24.0.0 (OpenSSL 3.2.2 4 Jun 2024)',
 'cryptography': '42.0.8',
 'Platform': 'Linux-6.12.32-amd64-x86_64-with-glibc2.36'}
2025-12-05 10:10:39 [scrapy.addons] INFO: Enabled addons:
[]
2025-12-05 10:10:39 [scrapy.extensions.telnet] INFO: Telnet Password: 97a21ab04c8fe128
2025-12-05 10:10:39 [scrapy.middleware] INFO: Enabled extensions:
['scrapy.extensions.corestats.CoreStats',
 'scrapy.extensions.telnet.TelnetConsole',
 'scrapy.extensions.memusage.MemoryUsage',
 'scrapy.extensions.logstats.LogStats']
2025-12-05 10:10:39 [scrapy.crawler] INFO: Overridden settings:
{'LOG_LEVEL': 'INFO'}
2025-12-05 10:10:39 [py.warnings] WARNING: /home/htb-ac-1999270/.local/lib/python3.11/site-packages/scrapy/downloadermiddlewares/httpcompression.py:40: UserWarning: You have brotli installed. But 'br' encoding support now requires brotli version >= 1.2.0. Please upgrade brotli version to make Scrapy decode 'br' encoded responses.
  warnings.warn(

2025-12-05 10:10:40 [scrapy.middleware] INFO: Enabled downloader middlewares:
['scrapy.downloadermiddlewares.offsite.OffsiteMiddleware',
 'scrapy.downloadermiddlewares.httpauth.HttpAuthMiddleware',
 'scrapy.downloadermiddlewares.downloadtimeout.DownloadTimeoutMiddleware',
 'scrapy.downloadermiddlewares.defaultheaders.DefaultHeadersMiddleware',
 'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware',
 '__main__.CustomOffsiteMiddleware',
 'scrapy.downloadermiddlewares.retry.RetryMiddleware',
 'scrapy.downloadermiddlewares.redirect.MetaRefreshMiddleware',
 'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware',
 'scrapy.downloadermiddlewares.redirect.RedirectMiddleware',
 'scrapy.downloadermiddlewares.cookies.CookiesMiddleware',
 'scrapy.downloadermiddlewares.httpproxy.HttpProxyMiddleware',
 'scrapy.downloadermiddlewares.stats.DownloaderStats']
2025-12-05 10:10:40 [scrapy.middleware] INFO: Enabled spider middlewares:
['scrapy.spidermiddlewares.start.StartSpiderMiddleware',
 'scrapy.spidermiddlewares.httperror.HttpErrorMiddleware',
 'scrapy.spidermiddlewares.referer.RefererMiddleware',
 'scrapy.spidermiddlewares.urllength.UrlLengthMiddleware',
 'scrapy.spidermiddlewares.depth.DepthMiddleware']
2025-12-05 10:10:40 [scrapy.middleware] INFO: Enabled item pipelines:
[]
2025-12-05 10:10:40 [scrapy.core.engine] INFO: Spider opened
2025-12-05 10:10:40 [scrapy.extensions.logstats] INFO: Crawled 0 pages (at 0 pages/min), scraped 0 items (at 0 items/min)
2025-12-05 10:10:40 [scrapy.extensions.telnet] INFO: Telnet console listening on 127.0.0.1:6023
2025-12-05 10:10:41 [scrapy.core.engine] INFO: Closing spider (finished)
2025-12-05 10:10:41 [scrapy.statscollectors] INFO: Dumping Scrapy stats:
{'downloader/request_bytes': 2697,
 'downloader/request_count': 10,
 'downloader/request_method_count/GET': 10,
 'downloader/response_bytes': 93960,
 'downloader/response_count': 10,
 'downloader/response_status_count/200': 8,
 'downloader/response_status_count/301': 2,
 'dupefilter/filtered': 52,
 'elapsed_time_seconds': 0.95375,
 'finish_reason': 'finished',
 'finish_time': datetime.datetime(2025, 12, 5, 16, 10, 41, 8831, tzinfo=datetime.timezone.utc),
 'httpcompression/response_bytes': 162654,
 'httpcompression/response_count': 7,
 'items_per_minute': None,
 'log_count/INFO': 10,
 'log_count/WARNING': 1,
 'memusage/max': 70418432,
 'memusage/startup': 70418432,
 'request_depth_max': 2,
 'response_received_count': 8,
 'responses_per_minute': None,
 'scheduler/dequeued': 10,
 'scheduler/dequeued/memory': 10,
 'scheduler/enqueued': 10,
 'scheduler/enqueued/memory': 10,
 'start_time': datetime.datetime(2025, 12, 5, 16, 10, 40, 55081, tzinfo=datetime.timezone.utc)}
2025-12-05 10:10:41 [scrapy.core.engine] INFO: Spider closed (finished)
```

Nous voyons que ça nous a donner le mot de passe pour `telnet` mais ce n'est pas ce que nous cherchons, nous recherchons, maintenant nous pouvons `cat` le fichier `result.json` qui a été créer après la finalisation de la commande:

```bash
└──╼ [★]$ cat results.json 
{
    "emails": [
        "lily.floid@inlanefreight.com",
        "john.smith4@inlanefreight.com",
        "enterprise@inlanefreight.com",
        "enterprise-support@inlanefreight.com",
        "freya.kartboom@inlanefreight.com",
        "info@inlanefreight.com",
        "hans.mueller@inlanefreight.com",
        "samuel.dot@inlanefreight.com",
        "info@themeansar.com",
        "manuel.pernilious@inlanefreight.com",
        "cvs@inlanefreight.com",
        "support@inlanefreight.com",
        "emma.williams@inlanefreight.com",
        "jeremy-ceo@inlanefreight.com",
        "david.jones@inlanefreight.com",
        "fiona.dante@inlanefreight.com"
    ],
    "links": [
        "https://www.inlanefreight.com/index.php/news/#content",
        "https://www.inlanefreight.com/wp-content/uploads/2020/09/goals.pdf",
        "https://www.inlanefreight.com/index.php/about-us/#content",
        "https://www.inlanefreight.com/index.php/offices/",
        "https://www.inlanefreight.com/index.php/offices/#content",
        "https://www.inlanefreight.com/index.php/about-us/",
        "https://www.inlanefreight.com",
        "https://www.inlanefreight.com/#content",
        "https://www.inlanefreight.com/",
        "https://www.inlanefreight.com/index.php/news/",
        "https://www.themeansar.com",
        "https://www.inlanefreight.com/index.php/contact/#content",
        "https://www.inlanefreight.com/index.php/contact/",
        "https://www.inlanefreight.com/index.php/career/",
        "https://www.inlanefreight.com/index.php/career/#content"
    ],
    "external_files": [
        "https://www.inlanefreight.com/wp-content/uploads/2020/09/goals.pdf",
        "https://www.inlanefreight.com/index.php/news/pdf"
    ],
    "js_files": [
        "https://www.inlanefreight.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.3.2",
        "https://www.inlanefreight.com/wp-content/themes/ben_theme/js/bootstrap.min.js?ver=5.6.16",
        "https://www.inlanefreight.com/wp-content/themes/ben_theme/js/navigation.js?ver=5.6.16",
        "https://www.inlanefreight.com/wp-content/themes/ben_theme/js/jquery.smartmenus.bootstrap.js?ver=5.6.16",
        "https://www.inlanefreight.com/wp-includes/js/wp-embed.min.js?ver=5.6.16",
        "https://www.inlanefreight.com/wp-content/themes/ben_theme/js/owl.carousel.min.js?ver=5.6.16",
        "https://www.inlanefreight.com/wp-includes/js/jquery/jquery.min.js?ver=3.5.1",
        "https://www.inlanefreight.com/wp-content/themes/ben_theme/js/jquery.smartmenus.js?ver=5.6.16"
    ],
    "form_fields": [],
    "images": [
        "https://www.inlanefreight.com/wp-content/uploads/2021/03/Offices_01-1024x359.png",
        "https://www.inlanefreight.com/wp-content/uploads/2021/03/Career_01-300x235.jpg",
        "https://www.inlanefreight.com/wp-content/uploads/2021/03/AboutUs_01-1024x810.png",
        "https://www.inlanefreight.com/wp-content/uploads/2021/03/AboutUs_04-1024x810.png",
        "https://www.inlanefreight.com/wp-content/uploads/2021/03/AboutUs_03-1024x810.png",
        "https://www.inlanefreight.com/wp-content/uploads/2021/03/Career_02-300x235.jpg",
        "https://www.inlanefreight.com/wp-content/uploads/2021/03/AboutUs_02-1024x810.png"
    ],
    "videos": [],
    "audio": [],
    "comments": [
        "<!-- Right nav -->",
        "<!-- /navbar-toggle -->",
        "<!-- TO-DO: change the location of future reports to inlanefreight-comp133.s3.amazonaws.htb -->",
        "<!-- #secondary -->",
        "<!-- Blog Area -->",
        "<!-- change Jeremy's email to jeremy-ceo@inlanefreight.com -->",
        "<!-- Navigation -->",
        "<!-- navbar-toggle -->",
        "<!--/overlay-->",
        "<!-- Logo -->",
        "<!--==================== TOP BAR ====================-->",
        "<!-- /Right nav -->",
        "<!--==================== transportex-FOOTER AREA ====================-->",
        "<!--==================== feature-product ====================-->",
        "<!-- /Navigation -->",
        "<!--Sidebar Area-->",
        "<!--\nSkip to content<div class=\"wrapper\">\n<header class=\"transportex-trhead\">\n\t<!--==================== Header ====================-->",
        "<!-- #masthead -->"
    ]
}
```

Nous voyons cette ligne qui est suspecte
```bash
"<!-- TO-DO: change the location of future reports to inlanefreight-comp133.s3.amazonaws.htb -->",
```

**Réponse :** `inlanefreight-comp133.s3.amazonaws.htb`

**Cours complété**

{% include comments.html %}