---
title: "HackTheBox - Information Gathering Fingerprinting"
date: 2025-12-05 15:23:00 +0200
categories: [HackTheBox, Learning]
tags: [fingerprinting, reconnaissance, web, apache, wordpress, waf, nikto, wafw00f, banner-grabbing]
description: "Découverte des techniques de fingerprinting web pour identifier les technologies et vulnérabilités d'un site cible"
image:
  path: /assets/img/posts/information-gathering.png
  alt: "Fingerprinting web reconnaissance"
---

## Informations sur le module

Ce module couvre les techniques de **fingerprinting**, c'est-à-dire l'identification des technologies qui font tourner un site web. Comme une empreinte digitale identifie une personne, les signatures numériques des serveurs révèlent des informations critiques sur l'infrastructure et les failles potentielles.

**Lien :** [Web Reconnaissance - Fingerprinting](https://academy.hackthebox.com/beta/module/144/section/3075)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre l'importance du fingerprinting dans la reconnaissance web
- Maîtriser les techniques de banner grabbing et d'analyse des headers HTTP
- Utiliser des outils automatisés pour identifier les technologies web
- Détecter la présence de WAF (Web Application Firewall)
- Analyser un site réel avec plusieurs techniques combinées

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Fingerprinting : Qu'est-ce que c'est ?

### Pourquoi c'est crucial en pentest

Quand j'ai commencé à m'intéresser au fingerprinting, j'ai réalisé que c'est **la base de toute attaque ciblée**. Au lieu de tester des centaines d'exploits au hasard, on identifie d'abord **exactement** ce qui tourne sur le serveur cible.

> **Pour les débutants** : Le fingerprinting, c'est comme analyser l'ADN numérique d'un site web. On cherche à identifier le serveur web, le système d'exploitation, les frameworks utilisés, et tout ce qui peut nous donner un avantage.
{: .prompt-info}

**Pourquoi c'est si important ?**

1. **Attaques ciblées** : Si je sais qu'un site utilise Apache 2.4.41, je peux chercher des vulnérabilités **spécifiques** à cette version
2. **Détection de mauvaises configurations** : Des versions obsolètes ou des paramètres par défaut sont souvent invisibles sans fingerprinting
3. **Priorisation des cibles** : Face à plusieurs cibles, je peux me concentrer sur les plus vulnérables
4. **Vision globale** : Combiner le fingerprinting avec d'autres techniques de reconnaissance donne une image complète de l'infrastructure

### Les différentes techniques

J'ai appris qu'il existe plusieurs approches pour identifier les technologies :

#### Banner Grabbing

C'est la technique la plus directe : **demander au serveur de se présenter**. Les serveurs web envoient souvent des "banners" qui révèlent leur identité.

#### Analyse des headers HTTP

Chaque requête HTTP contient des headers. Le header `Server` indique généralement le logiciel du serveur, et `X-Powered-By` peut révéler des frameworks supplémentaires.

#### Requêtes spécifiques

Envoyer des requêtes particulières peut provoquer des réponses uniques qui trahissent une technologie spécifique. Par exemple, certains messages d'erreur sont caractéristiques d'un serveur précis.

#### Analyse du contenu

Le code source HTML, les scripts, et même les commentaires peuvent contenir des indices sur les technologies utilisées.

### Les outils disponibles

Voici les outils que j'ai découverts pour automatiser le fingerprinting :

| Outil | Usage | Mon avis |
|-------|-------|----------|
| **Wappalyzer** | Extension navigateur | Parfait pour une analyse rapide |
| **BuiltWith** | Service en ligne | Rapports détaillés mais limité en version gratuite |
| **WhatWeb** | Ligne de commande | Très puissant avec une énorme base de signatures |
| **Nmap** | Scanner réseau | Polyvalent, peut faire du fingerprinting OS et services |
| **Netcraft** | Service de sécurité web | Rapports complets sur l'hébergement et la sécurité |
| **wafw00f** | Détection WAF | Indispensable avant toute analyse poussée |
| **Nikto** | Scanner de vulnérabilités | Excellent pour identifier technologies et failles |

## Fingerprinting de inlanefreight.com

J'ai appliqué toutes ces techniques sur **inlanefreight.com**, un site de test fourni par HTB. Voici mon processus complet.

### Banner Grabbing avec curl

Ma première action a été de récupérer les headers HTTP avec `curl`. L'option `-I` (ou `--head`) récupère uniquement les headers, pas tout le contenu de la page.

> **Pour les débutants** : `curl` est un outil en ligne de commande qui permet de faire des requêtes HTTP et d'afficher les réponses. C'est comme un navigateur web, mais en mode texte.
{: .prompt-info}

```bash
curl -I inlanefreight.com
```

**Résultat :**

```
HTTP/1.1 301 Moved Permanently
Date: Fri, 31 May 2024 12:07:44 GMT
Server: Apache/2.4.41 (Ubuntu)
Location: https://inlanefreight.com/
Content-Type: text/html; charset=iso-8859-1
```

**Mon observation :** Le serveur exécute **Apache 2.4.41** sur Ubuntu. Le code `301 Moved Permanently` indique une redirection vers HTTPS. C'est déjà une info précieuse pour cibler mes recherches d'exploits.

#### Suivre les redirections

Le site redirige vers HTTPS, donc j'ai suivi cette redirection :

```bash
curl -I https://inlanefreight.com
```

**Résultat :**

```
HTTP/1.1 301 Moved Permanently
Date: Fri, 31 May 2024 12:12:12 GMT
Server: Apache/2.4.41 (Ubuntu)
X-Redirect-By: WordPress
Location: https://www.inlanefreight.com/
Content-Type: text/html; charset=UTF-8
```

**Ce qui m'a surpris :** Un nouveau header apparaît : `X-Redirect-By: WordPress`. Le site utilise donc **WordPress** ! C'est une information capitale, car WordPress a des vulnérabilités connues et des outils spécialisés pour l'analyser.

Pour plus d'infos sur les headers HTTP : [RFC 7231 - HTTP/1.1 Semantics](https://www.rfc-editor.org/rfc/rfc7231)

#### Analyse finale

Dernière redirection vers le domaine complet :

```bash
curl -I https://www.inlanefreight.com
```

**Résultat :**

```
HTTP/1.1 200 OK
Date: Fri, 31 May 2024 12:12:26 GMT
Server: Apache/2.4.41 (Ubuntu)
Link: <https://www.inlanefreight.com/index.php/wp-json/>; rel="https://api.w.org/"
Link: <https://www.inlanefreight.com/index.php/wp-json/wp/v2/pages/7>; rel="alternate"; type="application/json"
Link: <https://www.inlanefreight.com/>; rel=shortlink
Content-Type: text/html; charset=UTF-8
```

**Mon analyse :** Maintenant on a un `200 OK`, donc le site charge correctement. Les headers `Link` révèlent des chemins intéressants, notamment **wp-json**, qui est l'API REST de WordPress. Le préfixe `wp-` est typique de WordPress.

> Ces chemins peuvent être utilisés pour énumérer les utilisateurs, les articles, et d'autres informations via l'API REST de WordPress.
{: .prompt-tip}

### Détection du WAF avec wafw00f

Avant d'aller plus loin, j'ai vérifié si un **WAF (Web Application Firewall)** protège le site. Un WAF peut bloquer nos requêtes ou fausser nos résultats.

> **Pour les débutants** : Un WAF est comme un garde de sécurité pour un site web. Il analyse toutes les requêtes entrantes et bloque celles qui semblent malveillantes. C'est crucial de savoir s'il y en a un avant de continuer.
{: .prompt-info}

**Installation :**

```bash
pip3 install git+https://github.com/EnableSecurity/wafw00f
```

**Scan :**

```bash
wafw00f inlanefreight.com
```

**Résultat :**

```
                ______
               /      \
              (  W00f! )
               \  ____/
               ,,    __            404 Hack Not Found
           |`-.__   / /                      __     __
           /"  _/  /_/                       \ \   / /
          *===*    /                          \ \_/ /  405 Not Allowed
         /     )__//                           \   /
    /|  /     /---`                        403 Forbidden
    \\/`   \ |                                 / _ \
    `\    /_\\_              502 Bad Gateway  / / \ \  500 Internal Error
      `_____``-`                             /_/   \_\

                        ~ WAFW00F : v2.2.0 ~
        The Web Application Firewall Fingerprinting Toolkit
    
[*] Checking https://inlanefreight.com
[+] The site https://inlanefreight.com is behind Wordfence (Defiant) WAF.
[~] Number of requests: 2
```

**Mon observation :** Le site est protégé par **Wordfence**, un WAF populaire pour WordPress. C'est une information cruciale : si je continue mes scans, je dois m'attendre à ce que certaines requêtes soient bloquées. Dans un vrai pentest, il faudrait adapter mes techniques pour contourner ou éviter la détection du WAF.

Documentation Wordfence : [Wordfence WordPress Security](https://www.wordfence.com/)

### Scan approfondi avec Nikto

Nikto est un scanner de vulnérabilités web très complet. En plus de chercher des failles, il peut identifier les technologies utilisées.

**Installation (si nécessaire) :**

```bash
sudo apt update && sudo apt install -y perl
git clone https://github.com/sullo/nikto
cd nikto/program
chmod +x ./nikto.pl
```

**Mon scan :**

J'ai utilisé l'option `-Tuning b` pour ne lancer que les modules d'identification logicielle, sans tester les vulnérabilités cette fois.

```bash
nikto -h inlanefreight.com -Tuning b
```

**Résultat complet :**

```
- Nikto v2.5.0
---------------------------------------------------------------------------
+ Multiple IPs found: 134.209.24.248, 2a03:b0c0:1:e0::32c:b001
+ Target IP:          134.209.24.248
+ Target Hostname:    www.inlanefreight.com
+ Target Port:        443
---------------------------------------------------------------------------
+ SSL Info:        Subject:  /CN=inlanefreight.com
                   Altnames: inlanefreight.com, www.inlanefreight.com
                   Ciphers:  TLS_AES_256_GCM_SHA384
                   Issuer:   /C=US/O=Let's Encrypt/CN=R3
+ Start Time:         2024-05-31 13:35:54 (GMT0)
---------------------------------------------------------------------------
+ Server: Apache/2.4.41 (Ubuntu)
+ /: Link header found with value: ARRAY(0x558e78790248).
+ /: The site uses TLS and the Strict-Transport-Security HTTP header is not defined.
+ /: The X-Content-Type-Options header is not set.
+ /index.php?: Uncommon header 'x-redirect-by' found, with contents: WordPress.
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ /: The Content-Encoding header is set to "deflate" which may mean that the server is vulnerable to the BREACH attack.
+ Apache/2.4.41 appears to be outdated (current is at least 2.4.59). Apache 2.2.34 is the EOL for the 2.x branch.
+ /: Web Server returns a valid response with junk HTTP methods which may cause false positives.
+ /license.txt: License file found may identify site software.
+ /: A Wordpress installation was found.
+ /wp-login.php?action=register: Cookie wordpress_test_cookie created without the httponly flag.
+ /wp-login.php:X-Frame-Options header is deprecated and has been replaced with the Content-Security-Policy HTTP header with the frame-ancestors directive instead.
+ /wp-login.php: Wordpress login found.
+ 1316 requests: 0 error(s) and 12 item(s) reported on remote host
+ End Time:           2024-05-31 13:47:27 (GMT0) (693 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```

**Mon analyse détaillée :**

#### Informations réseau

- **Deux adresses IP** : IPv4 (134.209.24.248) et IPv6 (2a03:b0c0:1:e0::32c:b001)
- **Certificat SSL** : Émis par Let's Encrypt, ce qui est standard et gratuit
- **Chiffrement TLS** : TLS_AES_256_GCM_SHA384, ce qui est solide

#### Serveur et technologies

- **Apache 2.4.41 (Ubuntu)** : Confirmé à nouveau
- **WordPress** : Confirmé par plusieurs indices, y compris le fichier `/license.txt` et la page de login `/wp-login.php`

> Le fichier `license.txt` de WordPress contient des informations sur la licence GPL. C'est un indicateur classique de la présence de WordPress.
{: .prompt-tip}

#### Problèmes de sécurité identifiés

1. **Apache obsolète** : La version 2.4.41 est ancienne (la dernière est au moins 2.4.59). Des vulnérabilités connues existent peut-être.
2. **Headers de sécurité manquants** :
   - Pas de `Strict-Transport-Security` (HSTS) : Le navigateur pourrait accepter des connexions HTTP non sécurisées
   - Pas de `X-Content-Type-Options` : Risque de MIME type sniffing
3. **Cookie sans flag HttpOnly** : Le cookie `wordpress_test_cookie` peut être lu par JavaScript, ce qui est un risque XSS
4. **Vulnérabilité BREACH potentielle** : L'utilisation de la compression `deflate` avec HTTPS peut permettre certaines attaques

Pour comprendre HSTS : [RFC 6797 - HTTP Strict Transport Security](https://www.rfc-editor.org/rfc/rfc6797)

#### Points d'intérêt pour la suite

- **Page de login WordPress** : `/wp-login.php` est accessible
- **API REST WordPress** : Déjà identifiée avec curl
- **Aucun répertoire CGI** : Ce qui limite certains vecteurs d'attaque classiques

### Synthèse de mes découvertes

Après ces trois techniques (curl, wafw00f, Nikto), voici le profil complet de **inlanefreight.com** :

| Élément | Valeur |
|---------|--------|
| **Serveur web** | Apache 2.4.41 (Ubuntu) - obsolète |
| **CMS** | WordPress |
| **Protection** | Wordfence WAF |
| **Certificat SSL** | Let's Encrypt |
| **IPs** | 134.209.24.248 (IPv4), 2a03:b0c0:1:e0::32c:b001 (IPv6) |
| **Points d'intérêt** | `/wp-login.php`, `/wp-json/`, `/license.txt` |

> Avec ces informations, un attaquant pourrait rechercher des exploits spécifiques à Apache 2.4.41 et WordPress, tester l'énumération des utilisateurs via l'API REST, et éventuellement tenter de contourner Wordfence.
{: .prompt-warning}

## Ce que j'ai appris

Le fingerprinting n'est pas qu'une simple identification technique. C'est une **phase stratégique** qui oriente toute la suite d'un pentest. En combinant plusieurs outils et techniques, j'ai pu :

1. **Identifier les technologies** : Apache, WordPress, Wordfence
2. **Repérer des faiblesses** : Version obsolète, headers manquants
3. **Trouver des points d'entrée** : Login WordPress, API REST
4. **Comprendre les défenses** : Présence d'un WAF

Cette approche méthodique est essentielle. Chaque outil apporte sa propre perspective, et c'est la **combinaison** de tous ces résultats qui donne une image complète.

---

### Questions

**Determine the Apache version running on app.inlanefreight.local on the target system. (Format: 0.0.0)**

```bash
└──╼ [★]$ nikto -h inlanefreight.local -Tuning b
- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          10.129.231.207
+ Target Hostname:    inlanefreight.local
+ Target Port:        80
+ Start Time:         2025-12-05 08:41:41 (GMT-6)
---------------------------------------------------------------------------
+ Server: Apache/2.4.41 (Ubuntu)
+ /: The anti-clickjacking X-Frame-Options header is not present. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
+ /: The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type. See: https://www.netsparker.com/web-vulnerability-scanner/vulnerabilities/missing-content-type-header/
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ /: Server may leak inodes via ETags, header found with file /, inode: b8, size: 5c9b12f02857c, mtime: gzip. See: http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-1418
+ Apache/2.4.41 appears to be outdated (current is at least Apache/2.4.54). Apache 2.2.34 is the EOL for the 2.x branch.
+ OPTIONS: Allowed HTTP Methods: GET, POST, OPTIONS, HEAD .
+ 1209 requests: 0 error(s) and 5 item(s) reported on remote host
+ End Time:           2025-12-05 08:43:01 (GMT-6) (80 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```

**Réponse :** `2.4.41`

**Which CMS is used on app.inlanefreight.local on the target system? Respond with the name only, e.g., WordPress.**

```bash
└──╼ [★]$ whatweb app.inlanefreight.local
http://app.inlanefreight.local [200 OK] Apache[2.4.41], Bootstrap, Cookies[72af8f2b24261272e581a49f5c56de40], Country[RESERVED][ZZ], HTML5, HTTPServer[Ubuntu Linux][Apache/2.4.41 (Ubuntu)], HttpOnly[72af8f2b24261272e581a49f5c56de40], IP[10.129.232.46], JQuery, MetaGenerator[Joomla! - Open Source Content Management], OpenSearch[http://app.inlanefreight.local/index.php/component/search/?layout=blog&amp;id=9&amp;Itemid=101&amp;format=opensearch], Script, Title[Home], UncommonHeaders[permissions-policy]
```

**Réponse :** `Joomla!`

**On which operating system is the dev.inlanefreight.local webserver running in the target system? Respond with the name only, e.g., Debian.**

```bash
└──╼ [★]$ curl -I dev.inlanefreight.local
HTTP/1.1 200 OK
Date: Fri, 05 Dec 2025 15:16:54 GMT
Server: Apache/2.4.41 (Ubuntu)
Set-Cookie: 02a93f6429c54209e06c64b77be2180d=qf4miaa1i1flelk9vdaodcf52m; path=/; HttpOnly
Expires: Wed, 17 Aug 2005 00:00:00 GMT
Last-Modified: Fri, 05 Dec 2025 15:17:02 GMT
Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0
Pragma: no-cache
Content-Type: text/html; charset=utf-8
```

Bon alors ici en premier j'ai eu l'idée de faire un scan nmap avec le `-O` pour l'**OS detection** mais c'était long donc j'ai testé à côté de faire simplement un `curl` et en 3 secondes j'ai eu le résultat

**Réponse :** `Ubuntu`

**Cours complété**

{% include comments.html %}