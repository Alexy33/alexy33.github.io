---
title: "TryHackMe - Web Application Basics"
date: 2025-10-19 13:19:00 +0200
categories: [TryHackMe, Learning]
tags: [http, urls, web, security-headers]
description: "Write-up de la room Web Application Basics qui nous apprend les protocoles HTTP, les URLs, les méthodes de requêtes, les codes de réponse et les headers de sécurité"
image:
  path: /assets/img/posts/tryhackme-web_application.png
  alt: "Web Application Basics"
---

## Informations sur la room

Cette room propose un cours complet sur les applications web, leur fonctionnement et les bases de leur sécurité. Elle couvre les concepts fondamentaux nécessaires pour comprendre et tester les applications web.

**Lien :** [Web Application Basics](https://tryhackme.com/room/webapplicationbasics)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Comprendre l'architecture des applications web et leur fonctionnement dans un navigateur
- Décomposer les composants d'une URL et naviguer entre les ressources web
- Maîtriser le fonctionnement des requêtes et réponses HTTP
- Connaître les différentes méthodes HTTP et leurs cas d'usage
- Interpréter les codes de statut HTTP
- Comprendre les headers HTTP et leur importance pour la sécurité

---

## Solutions des tâches

### Task 1 - Introduction

Préparation à l'apprentissage des applications web et de leurs mécanismes fondamentaux.

---

### Task 2 - Web Application Overview

#### Analogie de l'application web

Une application web peut être comparée à une planète. Les astronautes explorent sa surface, tout comme nous explorons une application web via notre navigateur. La surface visible représente ce que nous voyons (les pages web), mais beaucoup d'activité se déroule sous la surface du serveur web.

#### Front-End : La couche visible

Le **front-end** représente la partie visible de l'application, composée de trois technologies principales :

- **HTML (HyperText Markup Language)**
- **CSS (Cascading Style Sheets)**
- **JavaScript (JS)**

> Imaginez que nous voulons construire une maison : en premier, nous avons besoin de fondations, donc l'`HTML` sera nos fondations. Maintenant que nous avons la charpente et les fondations en bois, nous voulons ajouter de la matière, des murs pour rendre belle notre maison. Alors nous ajoutons du `CSS` pour faire ceci. Enfin, nous allons placer de l'utilitaire, comme par exemple une porte d'entrée ou des lumières pour éclairer le tout. En Web, nous faisons ça avec du `JavaScript`.
{: .prompt-tip }

#### Back-End : La couche invisible

Le **back-end**, c'est ce qu'on ne voit pas en premier lieu. Reprenons l'analogie de la maison :

**Base de données (Database)**

C'est comme le sous-sol ou la cave de la maison - l'endroit où vous stockez toutes vos affaires importantes : vos meubles, vos archives, vos provisions. Tout est organisé et rangé pour être retrouvé facilement quand vous en avez besoin.

**Infrastructure (Serveurs, hébergement)**

C'est le terrain sur lequel la maison est construite et les réseaux publics (eau, électricité, internet) qui la desservent. Sans un bon terrain et de bonnes connexions, même la plus belle maison ne fonctionnera pas correctement.

**WAF (Web Application Firewall)**

C'est votre système de sécurité - l'alarme, les caméras de surveillance, la clôture, le portail sécurisé. Le WAF protège votre maison contre les intrus qui voudraient entrer par effraction ou faire du mal à vos occupants.

**Serveur back-end lui-même**

C'est comme la plomberie et l'électricité cachées dans les murs - tout ce qui fait fonctionner la maison mais que les invités ne voient pas. C'est ce qui traite les demandes, gère la logique métier, et fait le lien entre le front-end visible et la base de données cachée.

---

#### Questions et résolutions

**Question 1 : Which component on a computer is responsible for hosting and delivering content for web applications?**

Le composant responsable de l'hébergement et de la livraison du contenu web est le serveur.

**Réponse :** `Web Server`

---

**Question 2 : Which tool is used to access and interact with web applications?**

L'outil utilisé pour accéder aux applications web est le navigateur.

**Réponse :** `Web Browser`

---

**Question 3 : Which component acts as a protective layer, filtering incoming traffic to block malicious attacks, and ensuring the security of the web application?**

Le composant de protection qui filtre le trafic malveillant est le pare-feu applicatif.

**Réponse :** `web application firewall`

---

### Task 3 - Uniform Resource Locator

#### Qu'est-ce qu'une URL ?

Une **URL (Uniform Resource Locator)** est une adresse web permettant d'accéder à des ressources en ligne : pages web, images, vidéos, API, etc.

#### Anatomie d'une URL

![Structure d'une URL](https://tryhackme-images.s3.amazonaws.com/user-uploads/5c549500924ec576f953d9fc/room-content/34ad66d8b90aaaa35f9536d3b152ea97.png)

**Composants détaillés :**

**1. Scheme (Protocole)**
- Définit le protocole de communication (HTTP, HTTPS, FTP, etc.)
- **HTTP** : HyperText Transfer Protocol
- **HTTPS** : HTTP Secure (chiffré)

> HTTPS chiffre toutes les communications entre le client et le serveur, protégeant ainsi les données sensibles contre l'interception. Privilégiez toujours HTTPS pour la sécurité.
{: .prompt-info }

**2. User (Utilisateur)**
- Informations d'authentification (rare aujourd'hui)
- Format : `username:password@domain.com`

> L'inclusion de credentials dans l'URL est fortement déconseillée car elle expose les informations sensibles en clair.
{: .prompt-warning }

**3. Host / Domain (Hôte / Domaine)**
- Identifie le serveur web cible
- Doit être unique et enregistré auprès d'un registraire
- Exemple : `tryhackme.com`, `google.com`

**Attention au typosquatting :** Les attaquants créent des domaines similaires aux sites légitimes (ex: `g00gle.com` au lieu de `google.com`) pour des attaques de phishing.

**4. Port**
- Dirige vers le service spécifique sur le serveur
- Plage : 1-65535
- Ports standards :
  - **80** : HTTP
  - **443** : HTTPS
  - **21** : FTP
  - **22** : SSH

**5. Path (Chemin)**
- Localise la ressource spécifique sur le serveur
- Exemple : `/api/users/profile`

> Les chemins doivent être sécurisés pour empêcher l'accès non autorisé aux ressources sensibles via des attaques comme le path traversal.
{: .prompt-warning }

**6. Query String (Chaîne de requête)**
- Commence par `?`
- Contient des paramètres sous forme `clé=valeur`
- Séparés par `&`
- Exemple : `?search=cybersecurity&page=1`

**7. Fragment**
- Commence par `#`
- Pointe vers une section spécifique de la page
- Exemple : `#section-introduction`

> Les query strings et fragments peuvent être manipulés par l'utilisateur. Validez et sanitisez toujours ces données pour éviter les injections.
{: .prompt-danger }

---

#### Questions et résolutions

**Question 1 : Which protocol provides encrypted communication to ensure secure data transmission between a web browser and a web server?**

Le protocole qui chiffre les communications est HTTPS.

**Réponse :** `https`

---

**Question 2 : What term describes the practice of registering domain names that are misspelt variations of popular websites to exploit user errors and potentially engage in fraudulent activities?**

Cette technique d'enregistrement de domaines similaires est appelée typosquatting.

**Réponse :** `typosquatting`

---

**Question 3 : What part of a URL is used to pass additional information, such as search terms or form inputs, to the web server?**

La partie qui transmet des informations supplémentaires est la query string.

**Réponse :** `Query String`

---

### Task 4 - HTTP Messages

#### Qu'est-ce qu'un message HTTP ?

Les **messages HTTP** sont les communications entre un client (navigateur) et un serveur web. Ils sont essentiels pour comprendre le fonctionnement des applications web.

#### Types de messages HTTP

**1. Requête HTTP (HTTP Request)**
- Envoyée par le client
- Déclenche une action sur le serveur
- Contient la méthode, l'URL, les headers et optionnellement un body

**2. Réponse HTTP (HTTP Response)**
- Envoyée par le serveur
- Répond à la requête du client
- Contient le code de statut, les headers et le contenu

![Communication HTTP](https://tryhackme-images.s3.amazonaws.com/user-uploads/645b19f5d5848d004ab9c9e2/room-content/645b19f5d5848d004ab9c9e2-1728786920770.png)

#### Structure d'un message HTTP

**Composants communs :**

1. **Ligne de départ** (Request line ou Status line)
2. **Headers** (En-têtes)
3. **Ligne vide** (obligatoire)
4. **Body** (Corps, optionnel)

> La ligne vide entre les headers et le body est obligatoire, même si le body est vide. Elle marque la fin des headers.
{: .prompt-info }

---

#### Questions et résolutions

**Question 1 : Which HTTP message is returned by the web server after processing a client's request?**

Le message retourné par le serveur est la réponse HTTP.

**Réponse :** `http response`

---

**Question 2 : What follows the headers in an HTTP message?**

Une ligne vide sépare toujours les headers du body.

**Réponse :** `Empty line`

---

### Task 5 - HTTP Request: Request Line and Methods

#### Structure d'une requête HTTP

Une requête HTTP commence toujours par une **ligne de requête** suivant ce format :

```
METHOD /path HTTP/version
```

**Exemple :**
```
GET /api/users HTTP/1.1
```

![Structure requête HTTP](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f04259cf9bf5b57aed2c476/room-content/5f04259cf9bf5b57aed2c476-1730445201524.png)

#### Méthodes HTTP principales

**GET - Récupération de données**
- Récupère des ressources sans modification
- Données visibles dans l'URL

> Ne jamais inclure de données sensibles (tokens, mots de passe) dans une requête GET car elles apparaissent en clair dans l'URL et les logs.
{: .prompt-warning }

**POST - Création de ressources**
- Envoie des données au serveur
- Crée ou met à jour des ressources
- Données dans le body de la requête

> Validez et sanitisez toujours les données POST pour prévenir les injections SQL et XSS.
{: .prompt-danger }

**PUT - Remplacement complet**
- Remplace entièrement une ressource existante
- Mise à jour totale

> Vérifiez les autorisations avant d'accepter une requête PUT pour éviter les modifications non autorisées.
{: .prompt-warning }

**DELETE - Suppression**
- Supprime une ressource du serveur

> Implémentez une authentification forte pour les requêtes DELETE afin d'empêcher les suppressions malveillantes.
{: .prompt-danger }

#### Méthodes HTTP moins courantes

**PATCH**
- Mise à jour partielle d'une ressource
- Modifie uniquement les champs spécifiés

**HEAD**
- Identique à GET mais sans le body
- Récupère uniquement les headers
- Utile pour vérifier les métadonnées

**OPTIONS**
- Liste les méthodes HTTP supportées par une ressource
- Utilisé pour la découverte d'API

**TRACE**
- Effectue un test de boucle de retour
- Souvent désactivé pour des raisons de sécurité

**CONNECT**
- Établit un tunnel (proxy)
- Utilisé pour HTTPS via proxy

---

#### Versions du protocole HTTP

**HTTP/0.9 (1991)**
- Version initiale
- Supportait uniquement GET

**HTTP/1.0 (1996)**
- Ajout des headers
- Support de différents types de contenu
- Amélioration du cache

**HTTP/1.1 (1997)**
- Connexions persistantes
- Chunked transfer encoding
- Meilleur support du cache
- Encore largement utilisé aujourd'hui

**HTTP/2 (2015)**
- Multiplexage des requêtes
- Compression des headers
- Priorisation des requêtes
- Performances améliorées

**HTTP/3 (2022)**
- Basé sur QUIC (UDP)
- Connexions plus rapides
- Meilleure gestion des pertes de paquets
- Sécurité renforcée

---

#### Questions et résolutions

**Question 1 : Which HTTP protocol version became widely adopted and remains the most commonly used version for web communication, known for introducing features like persistent connections and chunked transfer encoding?**

La version la plus adoptée introduisant les connexions persistantes est HTTP/1.1.

**Réponse :** `HTTP/1.1`

---

**Question 2 : Which HTTP request method describes the communication options for the target resource, allowing clients to determine which HTTP methods are supported by the web server?**

La méthode qui décrit les options de communication est OPTIONS.

**Réponse :** `OPTIONS`

---

**Question 3 : In an HTTP request, which component specifies the specific resource or endpoint on the web server that the client is requesting, typically appearing after the domain name in the URL?**

Le composant qui spécifie la ressource est le chemin d'URL.

**Réponse :** `URL Path`

---

### Task 6 - HTTP Request: Headers and Body

#### Headers de requête courants

Les headers fournissent des métadonnées sur la requête. Voici les plus importants :

| Header | Exemple | Description |
|--------|---------|-------------|
| **Host** | `Host: tryhackme.com` | Spécifie le nom du serveur web cible |
| **User-Agent** | `User-Agent: Mozilla/5.0` | Identifie le navigateur et l'OS du client |
| **Referer** | `Referer: https://www.google.com/` | Indique l'URL d'origine de la requête |
| **Cookie** | `Cookie: session=abc123; user=john` | Contient les cookies précédemment envoyés par le serveur |
| **Content-Type** | `Content-Type: application/json` | Spécifie le format des données envoyées |

---

#### Corps de requête (Request Body)

Le body contient les données envoyées au serveur dans les requêtes POST, PUT, PATCH. Plusieurs formats sont possibles :

**1. URL Encoding (application/x-www-form-urlencoded)**

Format par défaut des formulaires HTML. Les données sont encodées en paires `clé=valeur`.

```http
POST /profile HTTP/1.1
Host: tryhackme.com
User-Agent: Mozilla/5.0
Content-Type: application/x-www-form-urlencoded
Content-Length: 33

name=Aleksandra&age=27&country=US
```

**Caractéristiques :**
- Séparateur : `&`
- Format : `clé1=valeur1&clé2=valeur2`
- Caractères spéciaux encodés en pourcentage

---

**2. Form Data (multipart/form-data)**

Utilisé pour les formulaires contenant des fichiers binaires (images, documents).

```http
POST /upload HTTP/1.1
Host: tryhackme.com
User-Agent: Mozilla/5.0
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="username"

aleksandra
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="profile_pic"; filename="aleksandra.jpg"
Content-Type: image/jpeg

[Binary Data Here representing the image]
----WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Caractéristiques :**
- Séparateur : boundary unique
- Support des données binaires
- Chaque partie a ses propres headers

---

**3. JSON (application/json)**

Format moderne privilégié pour les APIs REST.

```http
POST /api/user HTTP/1.1
Host: tryhackme.com
User-Agent: Mozilla/5.0
Content-Type: application/json
Content-Length: 62

{
    "name": "Aleksandra",
    "age": 27,
    "country": "US"
}
```

**Caractéristiques :**
- Structure en objets et tableaux
- Paires `nom: valeur`
- Facile à parser pour les applications

> JSON est devenu le standard de facto pour les APIs modernes grâce à sa simplicité et sa lisibilité.
{: .prompt-tip }

---

**4. XML (application/xml)**

Format structuré avec des balises.

```http
POST /api/user HTTP/1.1
Host: tryhackme.com
User-Agent: Mozilla/5.0
Content-Type: application/xml
Content-Length: 124

<user>
    <name>Aleksandra</name>
    <age>27</age>
    <country>US</country>
</user>
```

**Caractéristiques :**
- Balises ouvrantes et fermantes
- Support de l'imbrication
- Plus verbeux que JSON

---

#### Questions et résolutions

**Question 1 : Which HTTP request header specifies the domain name of the web server to which the request is being sent?**

Le header qui spécifie le domaine est Host.

**Réponse :** `Host`

---

**Question 2 : What is the default content type for form submissions in an HTTP request where the data is encoded as key=value pairs in a query string format?**

Le type de contenu par défaut pour les formulaires est l'encodage URL.

**Réponse :** `application/x-www-form-urlencoded`

---

**Question 3 : Which part of an HTTP request contains additional information like host, user agent, and content type, guiding how the web server should process the request?**

La partie contenant les métadonnées de la requête est les headers.

**Réponse :** `Request Headers`

---

### Task 7 - HTTP Response: Status Line and Status Codes

#### Ligne de statut (Status Line)

Chaque réponse HTTP commence par une ligne de statut contenant :

```
HTTP/version StatusCode ReasonPhrase
```

**Exemple :**
```
HTTP/1.1 200 OK
```

---

#### Catégories de codes de statut

**1xx - Réponses informationnelles**
- Indication que la requête est en cours de traitement
- Le serveur attend plus de données

**2xx - Réponses de succès**
- La requête a été traitée avec succès
- Le serveur a effectué l'action demandée

**3xx - Redirections**
- La ressource a été déplacée
- Une action supplémentaire du client est nécessaire

**4xx - Erreurs client**
- Problème avec la requête du client
- URL incorrecte, authentification manquante, etc.

**5xx - Erreurs serveur**
- Problème côté serveur
- Le serveur ne peut pas traiter la requête valide

---

#### Codes de statut courants

**100 Continue**
- Le serveur a reçu les headers de la requête
- Le client peut continuer à envoyer le body

**200 OK**
- Succès complet
- La ressource demandée est retournée

**201 Created**
- Nouvelle ressource créée avec succès
- Souvent utilisé avec POST

**204 No Content**
- Succès mais pas de contenu à retourner
- Utilisé pour les DELETE réussis

**301 Moved Permanently**
- La ressource a définitivement changé d'URL
- Les futurs accès doivent utiliser la nouvelle URL

**302 Found**
- Redirection temporaire
- L'URL originale reste valide

**304 Not Modified**
- La ressource n'a pas changé depuis la dernière requête
- Utilisé pour l'optimisation du cache

**400 Bad Request**
- La syntaxe de la requête est invalide
- Le serveur ne peut pas traiter la requête

**401 Unauthorized**
- Authentification requise
- Les credentials sont manquants ou invalides

**403 Forbidden**
- Le serveur refuse l'accès
- L'authentification ne suffit pas

**404 Not Found**
- La ressource demandée n'existe pas
- URL incorrecte ou ressource supprimée

> Le code 404 est l'un des plus connus mais ne révèle pas si la ressource a existé ou non, protégeant ainsi certaines informations.
{: .prompt-info }

**500 Internal Server Error**
- Erreur générique du serveur
- Le serveur a rencontré une condition inattendue

**502 Bad Gateway**
- Le serveur proxy a reçu une réponse invalide
- Problème de communication entre serveurs

**503 Service Unavailable**
- Le serveur est temporairement indisponible
- Maintenance ou surcharge

---

#### Questions et résolutions

**Question 1 : What part of an HTTP response provides the HTTP version, status code, and a brief explanation of the response's outcome?**

La partie qui contient ces informations est la ligne de statut.

**Réponse :** `status line`

---

**Question 2 : Which category of HTTP response codes indicates that the web server encountered an internal issue or is unable to fulfil the client's request?**

La catégorie indiquant les erreurs serveur est 5xx.

**Réponse :** `Server Error Responses`

---

**Question 3 : Which HTTP status code indicates that the requested resource could not be found on the web server?**

Le code indiquant une ressource introuvable est 404.

**Réponse :** `404`

---

### Task 8 - HTTP Response: Headers and Body

#### Structure d'une réponse HTTP

![Structure réponse HTTP](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f04259cf9bf5b57aed2c476/room-content/5f04259cf9bf5b57aed2c476-1741854427607.svg)

---

#### Headers de réponse obligatoires

**Date**
```
Date: Fri, 23 Aug 2024 10:43:21 GMT
```
- Horodatage de génération de la réponse
- Format standardisé GMT/UTC

**Content-Type**
```
Content-Type: text/html; charset=utf-8
```
- Spécifie le type MIME du contenu
- Inclut le charset (encodage des caractères)
- Exemples : `text/html`, `application/json`, `image/png`

**Server**
```
Server: nginx/1.21.0
```
- Identifie le logiciel serveur
- Utile pour le débogage

> Le header Server peut révéler des informations sensibles sur l'infrastructure. Beaucoup d'administrateurs le masquent ou le suppriment pour des raisons de sécurité.
{: .prompt-warning }

---

#### Headers de réponse courants

**Set-Cookie**
```
Set-Cookie: sessionId=38af1337es7a8; HttpOnly; Secure; SameSite=Strict
```
- Envoie des cookies au client
- Le navigateur les stocke et les renvoie aux requêtes suivantes

**Flags de sécurité des cookies :**
- `HttpOnly` : Empêche l'accès JavaScript (protection XSS)
- `Secure` : Transmission uniquement via HTTPS
- `SameSite` : Protection contre CSRF

> Toujours utiliser les flags HttpOnly et Secure pour les cookies de session afin de maximiser la sécurité.
{: .prompt-danger }

**Cache-Control**
```
Cache-Control: max-age=3600, public
```
- Contrôle la mise en cache de la réponse
- `max-age` : Durée en secondes
- `no-cache` : Revalidation obligatoire
- `no-store` : Aucune mise en cache (données sensibles)

**Location**
```
Location: /login
```
- Utilisé avec les codes 3xx (redirections)
- Spécifie la nouvelle URL

> Validez toujours le header Location pour éviter les vulnérabilités de redirection ouverte (Open Redirect) où un attaquant pourrait rediriger vers un site malveillant.
{: .prompt-warning }

---

#### Questions et résolutions

**Question 1 : Which HTTP response header can reveal information about the web server's software and version, potentially exposing it to security risks if not removed?**

Le header qui révèle des informations sur le serveur est Server.

**Réponse :** `server`

---

**Question 2 : Which flag should be added to cookies in the Set-Cookie HTTP response header to ensure they are only transmitted over HTTPS, protecting them from being exposed during unencrypted transmissions?**

Le flag garantissant la transmission HTTPS uniquement est Secure.

**Réponse :** `secure`

---

**Question 3 : Which flag should be added to cookies in the Set-Cookie HTTP response header to prevent them from being accessed via JavaScript, thereby enhancing security against XSS attacks?**

Le flag empêchant l'accès JavaScript est HttpOnly.

**Réponse :** `HttpOnly`

---

### Task 9 - Security Headers

#### Introduction aux headers de sécurité

Les headers de sécurité HTTP renforcent la protection des applications web contre diverses attaques : XSS, clickjacking, injection de code, etc.

> Utilisez [SecurityHeaders.com](https://securityheaders.com/) pour auditer les headers de sécurité d'un site web et obtenir un score de sécurité.
{: .prompt-tip }

---

#### Content-Security-Policy (CSP)

Le CSP est une défense puissante contre les attaques XSS en définissant les sources autorisées pour chaque type de contenu.

**Exemple de politique CSP :**
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.tryhackme.com; style-src 'self'
```

**Directives principales :**

- **default-src**
  - Politique par défaut pour tous les types de ressources
  - Utilise `'self'` pour autoriser uniquement le domaine actuel

- **script-src**
  - Définit les sources autorisées pour les scripts JavaScript
  - Bloque les scripts inline par défaut

- **style-src**
  - Définit les sources autorisées pour les feuilles de style CSS

- **img-src**
  - Contrôle les sources d'images

- **connect-src**
  - Limite les connexions AJAX, WebSocket, etc.

> Un CSP bien configuré peut bloquer 99% des attaques XSS, même si une vulnérabilité d'injection existe dans le code.
{: .prompt-info }

---

#### Strict-Transport-Security (HSTS)

HSTS force les navigateurs à toujours utiliser HTTPS pour communiquer avec le serveur.

**Exemple de configuration HSTS :**
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

**Directives :**

- **max-age**
  - Durée en secondes pendant laquelle la politique s'applique
  - Exemple : 63072000 = 2 ans

- **includeSubDomains**
  - Applique HSTS à tous les sous-domaines
  - Paramètre optionnel mais recommandé

- **preload**
  - Permet l'inclusion dans les listes de préchargement des navigateurs
  - Les navigateurs appliqueront HSTS avant même la première visite

> HSTS protège contre les attaques de rétrogradation SSL/TLS où un attaquant force une connexion HTTP non chiffrée.
{: .prompt-warning }

---

#### X-Content-Type-Options

Empêche le navigateur de deviner le type MIME d'une ressource.

**Configuration :**
```
X-Content-Type-Options: nosniff
```

**Directive :**

- **nosniff**
  - Désactive le MIME sniffing
  - Le navigateur utilise uniquement le Content-Type déclaré

> Le MIME sniffing peut être exploité pour exécuter du JavaScript malveillant déguisé en image ou autre type de fichier.
{: .prompt-danger }

---

#### Referrer-Policy

Contrôle les informations de référent envoyées lors de la navigation.

**Exemples de politiques :**
```
Referrer-Policy: no-referrer
Referrer-Policy: same-origin
Referrer-Policy: strict-origin
Referrer-Policy: strict-origin-when-cross-origin
```

**Directives :**

- **no-referrer**
  - Aucune information de référent n'est envoyée
  - Protection maximale de la vie privée

- **same-origin**
  - Envoie le référent uniquement pour les requêtes de même origine
  - Protège contre les fuites d'informations vers des sites externes

- **strict-origin**
  - Envoie uniquement l'origine (pas le chemin complet)
  - Uniquement si le protocole reste le même (HTTPS → HTTPS)

- **strict-origin-when-cross-origin**
  - Pour same-origin : envoie l'URL complète
  - Pour cross-origin : envoie uniquement l'origine si HTTPS

> La politique Referrer empêche la fuite d'informations sensibles présentes dans l'URL (tokens, IDs de session) vers des sites tiers.
{: .prompt-info }

---

#### Questions et résolutions

**Question 1 : In a Content Security Policy (CSP) configuration, which property can be set to define where scripts can be loaded from?**

La propriété qui définit les sources de scripts est script-src.

**Réponse :** `script-src`

---

**Question 2 : When configuring the Strict-Transport-Security (HSTS) header to ensure that all subdomains of a site also use HTTPS, which directive should be included to apply the security policy to both the main domain and its subdomains?**

La directive qui applique HSTS aux sous-domaines est includeSubDomains.

**Réponse :** `includeSubDomains`

---

**Question 3 : Which HTTP header directive is used to prevent browsers from interpreting files as a different MIME type than what is specified by the server, thereby mitigating content type sniffing attacks?**

La directive qui empêche le MIME sniffing est nosniff.

**Réponse :** `nosniff`

---

### Task 10 - Practical Task: Making HTTP Requests

#### Exercice pratique

Cette tâche met en pratique les connaissances acquises sur les méthodes HTTP en effectuant différentes requêtes vers une API.

---

**Question 1 : Make a GET request to /api/users. What is the flag?**

J'ai effectué une requête GET vers l'endpoint `/api/users` pour récupérer la liste des utilisateurs.

**Requête :**
```http
GET /api/users HTTP/1.1
Host: 10.10.X.X
User-Agent: Mozilla/5.0
```

**Réponse obtenue :**
```http
HTTP/1.1 200 OK
Server: nginx/1.15.8
Date: Sun, 19 Oct 2025 17:40:31 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 633
Last-Modified: Sun, 19 Oct 2025 17:40:31 GMT

<html>
<head>
    <title>TryHackMe</title>
</head>
<body>
    <table class="table-auto">
        <thead>
            <tr class="bg-gray text-white">
                <th class="w-20">Name</th>
                <th class="w-20">Age</th>
                <th class="w-20">Country</th>
                <th>Flag</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center">Alice</td>
                <td class="text-center">28</td>
                <td class="text-center">US</td>
                <td class="text-center"></td>
            </tr>
            <tr>
                <td class="text-center">Bob</td>
                <td class="text-center">34</td>
                <td class="text-center">UK</td>
                <td class="text-center"></td>
            </tr>
            <tr>
                <td class="text-center">Charlie</td>
                <td class="text-center">25</td>
                <td class="text-center">CA</td>
                <td class="text-center">THM{YOU_HAVE_JUST_FOUND_THE_USER_LIST}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
```

Le flag se trouve dans la dernière ligne du tableau HTML.

**Réponse :** `THM{YOU_HAVE_JUST_FOUND_THE_USER_LIST}`

---

**Question 2 : Make a POST request to /api/user/2 and update the country of Bob from UK to US. What is the flag?**

Pour modifier les données de l'utilisateur Bob, j'ai effectué une requête POST vers `/api/user/2`.

**Étapes effectuées :**

1. Première requête POST pour identifier l'utilisateur
2. Modification du paramètre `country` de `UK` à `US`

**Requête :**
```http
POST /api/user/2 HTTP/1.1
Host: 10.10.X.X
Content-Type: application/x-www-form-urlencoded
Content-Length: 10

country=US
```

**Réponse :**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "status": "success",
    "message": "User updated successfully",
    "flag": "THM{YOU_HAVE_MODIFIED_THE_USER_DATA}"
}
```

> La méthode POST est appropriée ici car nous modifions des données existantes. PUT aurait été plus sémantiquement correct pour un remplacement complet, et PATCH pour une modification partielle.
{: .prompt-tip }

**Réponse :** `THM{YOU_HAVE_MODIFIED_THE_USER_DATA}`

---

**Question 3 : Make a DELETE request to /api/user/1 to delete the user. What is the flag?**

Pour supprimer l'utilisateur avec l'ID 1, j'ai effectué une requête DELETE.

**Requête :**
```http
DELETE /api/user/1 HTTP/1.1
Host: 10.10.X.X
```

**Réponse :**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "status": "success",
    "message": "User deleted successfully",
    "flag": "THM{YOU_HAVE_JUST_DELETED_A_USER}"
}
```

> Dans un environnement de production, les requêtes DELETE devraient toujours être protégées par une authentification forte et une confirmation de l'action pour éviter les suppressions accidentelles ou malveillantes.
{: .prompt-warning }

**Réponse :** `THM{YOU_HAVE_JUST_DELETED_A_USER}`

---

### Task 11 - Conclusion

> La maîtrise des bases HTTP est essentielle pour tout testeur de pénétration web. Ces connaissances constituent le fondement de toutes les techniques d'exploitation avancées.
{: .prompt-info }

**Room complétée**

{% include comments.html %}