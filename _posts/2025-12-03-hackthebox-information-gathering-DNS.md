---
title: "HackTheBox - Information Gathering - DNS"
date: 2025-12-03 23:50:00 +0200
categories: [HackTheBox, Learning]
tags: [dns, enumeration, reconnaissance, network, web-recon]
description: "Découverte du fonctionnement du DNS et son importance en reconnaissance web"
image:
  path: /assets/img/posts/information-gathering.png
  alt: "DNS Enumeration"
---

## Informations sur le module

Dans cette section, j'explore le DNS (Domain Name System), son fonctionnement, et pourquoi c'est un élément crucial en reconnaissance web. Le DNS est bien plus qu'un simple traducteur de noms de domaine en adresses IP.

**Lien :** [DNS](https://academy.hackthebox.com/beta/module/144/section/3074)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre le fonctionnement du DNS et son rôle sur Internet
- Identifier les différents types d'enregistrements DNS
- Utiliser le fichier hosts pour des tests locaux
- Exploiter le DNS en reconnaissance pour découvrir des actifs

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## DNS : Le GPS d'Internet

### Une analogie qui m'a marqué

Quand j'ai commencé à apprendre le DNS, l'analogie avec le GPS m'a vraiment aidé à comprendre. Imaginez que vous vouliez aller quelque part : vous tapez "Tour Eiffel" dans votre GPS plutôt que les coordonnées GPS exactes. C'est exactement ce que fait le DNS.

> **Pour les débutants** : DNS signifie "Domain Name System". C'est le système qui permet de traduire un nom de domaine comme "www.google.com" en une adresse IP numérique comme "142.250.201.78" que les ordinateurs comprennent.
{: .prompt-info}

Sans le DNS, on devrait mémoriser des adresses IP pour chaque site web qu'on veut visiter. Vous imaginez retenir "142.250.201.78" au lieu de simplement taper "google.com" ? Ce serait l'enfer.

### Comment fonctionne une requête DNS

Quand j'ai tracé ma première requête DNS avec Wireshark, j'ai été surpris par le nombre d'étapes impliquées. Voici ce qui se passe réellement quand vous tapez "www.example.com" dans votre navigateur :

#### Le processus étape par étape

**Étape 1 : Vérification locale**

Votre ordinateur vérifie d'abord sa mémoire cache. Si vous avez visité le site récemment, l'adresse IP est peut-être déjà enregistrée.

**Étape 2 : Le résolveur DNS**

Si ce n'est pas en cache, votre ordinateur contacte un résolveur DNS (généralement celui de votre FAI). Ce résolveur agit comme un intermédiaire intelligent.

**Étape 3 : Les serveurs racine**

Le résolveur commence par interroger un serveur racine. Il existe 13 serveurs racine dans le monde, nommés de A à M (a.root-servers.net, b.root-servers.net, etc.).

> Ces serveurs racine ne connaissent pas l'adresse IP de example.com, mais ils savent qui s'occupe des domaines en .com, .org, etc.
{: .prompt-tip}

**Étape 4 : Les serveurs TLD**

Le serveur racine redirige vers le serveur TLD (Top-Level Domain) responsable du .com. Ce serveur sait qui gère example.com spécifiquement.

**Étape 5 : Le serveur autoritatif**

Enfin, le résolveur contacte le serveur de nom autoritatif qui possède la vraie adresse IP de www.example.com.

**Étape 6 : Retour de l'information**

L'adresse IP remonte toute la chaîne jusqu'à votre ordinateur, qui peut maintenant se connecter directement au serveur web.

### Ce qui m'a surpris : la mise en cache

Chaque niveau du processus met en cache les informations pour accélérer les requêtes futures. C'est pour ça que la première visite d'un site peut être lente, mais les suivantes sont instantanées.

### Le fichier hosts : un raccourci pratique

#### Qu'est-ce que c'est ?

Le fichier hosts permet de contourner complètement le DNS en définissant manuellement des correspondances nom de domaine vers adresse IP.

**Emplacement du fichier :**
- Windows : `C:\Windows\System32\drivers\etc\hosts`
- Linux/MacOS : `/etc/hosts`

### Format du fichier

```txt
<Adresse IP>    <Nom d'hôte> [<Alias> ...]
```

**Exemple :**

```txt
127.0.0.1       localhost
192.168.1.10    devserver.local
```

#### Mes cas d'usage en pratique

Pendant mes labs HTB, j'utilise le fichier hosts pour plusieurs choses :

**1. Rediriger vers un serveur local**

```txt
127.0.0.1       myapp.local
```

Cela me permet de tester une application web localement avec un nom de domaine réaliste.

**2. Tester la connectivité**

```txt
192.168.1.20    testserver.local
```

Pratique quand je veux tester une machine sans passer par le DNS.

**3. Bloquer des sites indésirables**

```txt
0.0.0.0       unwanted-site.com
```

En redirigeant vers une adresse inexistante, le site devient inaccessible.

> Attention : Les modifications prennent effet immédiatement, sans redémarrage nécessaire. Mais il faut des privilèges administrateur pour modifier ce fichier.
{: .prompt-warning}

### Les concepts clés du DNS

#### Les zones DNS

Une **zone DNS** est comme un container virtuel qui regroupe tous les enregistrements d'un domaine. Par exemple, example.com et tous ses sous-domaines (mail.example.com, blog.example.com) appartiennent à la même zone.

Le **fichier de zone** contient toutes les informations sur cette zone.

#### Exemple de fichier de zone

Voici un exemple simplifié que j'ai analysé :

```dns-zone
$TTL 3600 ; Durée de vie par défaut (1 heure)
@       IN SOA   ns1.example.com. admin.example.com. (
                2024060401 ; Numéro de série
                3600       ; Intervalle de rafraîchissement
                900        ; Intervalle de réessai
                604800     ; Temps d'expiration
                86400 )    ; TTL minimum

@       IN NS    ns1.example.com.
@       IN NS    ns2.example.com.
@       IN MX 10 mail.example.com.
www     IN A     192.0.2.1
mail    IN A     198.51.100.1
ftp     IN CNAME www.example.com.
```

**Mon observation :** Le symbole `@` représente le domaine racine (example.com). Le `IN` signifie "Internet" et indique que l'enregistrement utilise les protocoles Internet standards.

#### Les concepts fondamentaux

| Concept | Description | Exemple pratique |
|---------|-------------|------------------|
| Nom de domaine | Label lisible pour identifier un site | www.example.com |
| Adresse IP | Identifiant numérique unique | 192.0.2.1 |
| Résolveur DNS | Serveur qui traduit les noms | 8.8.8.8 (Google DNS) |
| Serveur racine | Niveau le plus haut de la hiérarchie | a.root-servers.net |
| Serveur TLD | Gère les extensions (.com, .org) | Géré par Verisign pour .com |
| Serveur autoritatif | Détient la vraie adresse IP | Souvent chez l'hébergeur |

Pour approfondir la structure hiérarchique du DNS, consulter [RFC 1034 - Domain Names Concepts](https://www.rfc-editor.org/rfc/rfc1034.html)

### Les types d'enregistrements DNS

#### Les enregistrements essentiels

J'ai créé ce tableau basé sur ce que je rencontre régulièrement en pentest :

| Type | Nom complet | Description | Usage en pentest |
|------|-------------|-------------|------------------|
| A | Address Record | Associe un nom d'hôte à une IPv4 | Trouver les serveurs web |
| AAAA | IPv6 Address Record | Associe un nom d'hôte à une IPv6 | Identifier les services IPv6 |
| CNAME | Canonical Name | Crée un alias pointant vers un autre hôte | Découvrir l'infrastructure |
| MX | Mail Exchange | Indique le serveur mail du domaine | Identifier les serveurs email |
| NS | Name Server | Délègue une zone à un serveur de noms | Cartographier le DNS |
| TXT | Text Record | Stocke du texte arbitraire | Trouver des infos de config |
| SOA | Start of Authority | Informations administratives de la zone | Identifier l'admin |
| SRV | Service Record | Définit l'hôte et le port pour un service | Découvrir des services |
| PTR | Pointer Record | Résolution inverse (IP vers nom) | Reverse DNS lookup |

#### Exemples concrets d'enregistrements

**Enregistrement A :**
```dns
www.example.com. IN A 192.0.2.1
```

**Enregistrement CNAME :**
```dns
blog.example.com. IN CNAME webserver.example.net.
```

Ce CNAME m'indique que blog.example.com pointe vers webserver.example.net, ce qui peut révéler l'hébergeur ou l'architecture.

**Enregistrement MX :**
```dns
example.com. IN MX 10 mail.example.com.
```

Le numéro 10 est la priorité. Plus le chiffre est bas, plus le serveur est prioritaire.

**Enregistrement TXT :**
```dns
example.com. IN TXT "v=spf1 mx -all"
```

Cet enregistrement SPF indique quels serveurs peuvent envoyer des emails pour ce domaine. Utile en pentest pour comprendre la configuration email.

> **Pour les débutants** : SPF (Sender Policy Framework) est un mécanisme de sécurité qui empêche l'usurpation d'adresse email. L'enregistrement TXT ci-dessus dit "seuls mes serveurs MX peuvent envoyer des emails, rejette tout le reste".
{: .prompt-info}

**Enregistrement SRV :**
```dns
_sip._udp.example.com. IN SRV 10 5 5060 sipserver.example.com.
```

Les enregistrements SRV sont précieux en pentest car ils révèlent des services spécifiques et leurs ports.

#### Ce que signifie vraiment "IN"

Pendant longtemps je me suis demandé pourquoi on voyait toujours "IN" dans les enregistrements DNS. C'est simplement une convention historique qui signifie "Internet" et indique que l'enregistrement utilise la famille de protocoles Internet (IP).

Il existe d'autres classes comme CH (Chaosnet) ou HS (Hesiod), mais elles ne sont quasiment jamais utilisées aujourd'hui.

### Pourquoi le DNS est crucial en reconnaissance web

#### Découvrir des actifs cachés

Le DNS révèle énormément d'informations sur l'infrastructure cible. Pendant mes labs, j'ai découvert plusieurs techniques :

**1. Les sous-domaines oubliés**

Un enregistrement CNAME comme `dev.example.com CNAME oldserver.example.net` peut pointer vers un serveur obsolète et potentiellement vulnérable.

**2. Identifier l'hébergeur**

En analysant les enregistrements NS, je peux savoir quel provider héberge le domaine :

```dns
example.com. IN NS ns1.cloudprovider.com.
```

Cela me donne des indices sur l'infrastructure utilisée.

**3. Trouver des load balancers**

Un enregistrement A pour `loadbalancer.example.com` révèle la présence d'un équilibreur de charge, ce qui m'aide à comprendre l'architecture réseau.

#### Cartographier le réseau

En collectant tous les enregistrements DNS, je peux créer une carte complète de l'infrastructure :

- Serveurs web (enregistrements A)
- Serveurs mail (enregistrements MX)
- Services spécifiques (enregistrements SRV)
- Aliases et redirections (enregistrements CNAME)

Cette carte révèle les flux de trafic et les points d'entrée potentiels.

#### Surveiller les changements

Ce qui est vraiment intéressant, c'est de monitorer les changements DNS dans le temps :

**Exemple 1 : Nouveau sous-domaine**

L'apparition soudaine de `vpn.example.com` indique un nouveau point d'accès au réseau. C'est une cible potentielle à explorer.

**Exemple 2 : Enregistrements TXT révélateurs**

Un enregistrement TXT contenant `_1password=...` révèle que l'organisation utilise 1Password. Cette information peut être utilisée en ingénierie sociale ou pour des campagnes de phishing ciblées.

> En pentest, le DNS n'est pas juste un protocole technique. C'est une mine d'or d'informations sur l'infrastructure, les technologies utilisées, et les potentielles vulnérabilités.
{: .prompt-tip}

#### Ressources pour aller plus loin

Pour comprendre en profondeur le DNS, voici les RFC essentiels :
- [RFC 1034 - Domain Names Concepts](https://www.rfc-editor.org/rfc/rfc1034.html)
- [RFC 1035 - Domain Names Implementation](https://www.rfc-editor.org/rfc/rfc1035.html)

Documentation pratique sur les outils d'énumération DNS :
- [DNSDumpster](https://dnsdumpster.com/) - Outil en ligne pour la reconnaissance DNS
- [dnsrecon Documentation](https://github.com/darkoperator/dnsrecon) - Outil d'énumération DNS avancé

---

## Digging DNS : les outils pratiques

### Les outils de reconnaissance DNS

Maintenant que je comprends la théorie, passons à la pratique. En pentest, plusieurs outils permettent d'interroger les serveurs DNS et d'extraire des informations précieuses.

Voici les outils que j'utilise régulièrement :

| Outil | Caractéristiques principales | Mes cas d'usage |
|-------|------------------------------|-----------------|
| dig | Outil polyvalent supportant tous les types de requêtes, sortie détaillée | Requêtes manuelles, analyse approfondie, zone transfers |
| nslookup | Simple, principalement pour A, AAAA et MX | Vérifications rapides de résolution |
| host | Sortie concise et rapide | Checks rapides d'enregistrements basiques |
| dnsenum | Énumération automatisée, attaques par dictionnaire, bruteforce | Découverte de sous-domaines efficace |
| fierce | Reconnaissance DNS avec recherche récursive et détection wildcard | Interface conviviale pour l'énumération |
| dnsrecon | Combine plusieurs techniques, supporte divers formats de sortie | Énumération complète et exhaustive |
| theHarvester | Outil OSINT collectant des infos depuis plusieurs sources | Récolte d'emails et d'informations publiques |

> **Pour les débutants** : OSINT signifie "Open Source Intelligence", c'est-à-dire la collecte d'informations à partir de sources publiques et accessibles.
{: .prompt-info}

### La commande dig : mon outil préféré

Le **dig** (Domain Information Groper) est devenu mon outil de prédilection pour les requêtes DNS. Sa flexibilité et ses sorties détaillées en font un choix parfait pour la reconnaissance.

Pour plus de détails sur dig, consulter la [documentation officielle dig](https://linux.die.net/man/1/dig)

#### Les commandes dig essentielles

Voici les commandes que j'utilise le plus souvent :

| Commande | Ce qu'elle fait |
|----------|-----------------|
| `dig domain.com` | Requête A par défaut |
| `dig domain.com A` | Récupère l'IPv4 |
| `dig domain.com AAAA` | Récupère l'IPv6 |
| `dig domain.com MX` | Trouve les serveurs mail |
| `dig domain.com NS` | Identifie les serveurs de noms autoritatifs |
| `dig domain.com TXT` | Récupère les enregistrements texte |
| `dig domain.com CNAME` | Trouve les alias |
| `dig domain.com SOA` | Récupère l'enregistrement SOA |
| `dig @1.1.1.1 domain.com` | Interroge un serveur DNS spécifique |
| `dig +trace domain.com` | Montre le chemin complet de résolution |
| `dig -x 192.168.1.1` | Résolution inverse (IP vers nom) |
| `dig +short domain.com` | Réponse courte et concise |
| `dig +noall +answer domain.com` | Affiche uniquement la section réponse |
| `dig domain.com ANY` | Tous les enregistrements disponibles |

> Attention : Certains serveurs DNS peuvent détecter et bloquer les requêtes excessives. Toujours obtenir l'autorisation avant une reconnaissance extensive et respecter les rate limits.
{: .prompt-danger}

### Ma première requête dig

Quand j'ai lancé ma première vraie requête dig, j'ai été submergé par la quantité d'informations retournées. Décortiquons ensemble :

```bash
dig google.com
```

**Résultat :**

```
; <<>> DiG 9.18.24-0ubuntu0.22.04.1-Ubuntu <<>> google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 16449
;; flags: qr rd ad; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0
;; WARNING: recursion requested but not available

;; QUESTION SECTION:
;google.com.                    IN      A

;; ANSWER SECTION:
google.com.             0       IN      A       142.251.47.142

;; Query time: 0 msec
;; SERVER: 172.23.176.1#53(172.23.176.1) (UDP)
;; WHEN: Thu Jun 13 10:45:58 SAST 2024
;; MSG SIZE  rcvd: 54
```

#### Décryptage de la sortie

**Section Header (En-tête)**

La ligne `opcode: QUERY, status: NOERROR, id: 16449` m'indique :
- Type de requête : QUERY
- Statut : NOERROR (succès)
- Identifiant unique : 16449

Les flags sont particulièrement intéressants :
- `qr` (Query Response) : C'est une réponse
- `rd` (Recursion Desired) : Récursion demandée
- `ad` (Authentic Data) : Le résolveur considère les données authentiques

Les compteurs montrent : 1 question, 1 réponse, 0 enregistrement d'autorité, 0 enregistrement additionnel.

> Le warning "recursion requested but not available" signifie que j'ai demandé une résolution récursive, mais le serveur ne la supporte pas. Ce n'est pas grave pour une requête simple comme celle-ci.
{: .prompt-info}

**Section Question**

```
;google.com.                    IN      A
```

Ma question était claire : "Quelle est l'adresse IPv4 (enregistrement A) pour google.com ?"

**Section Answer**

```
google.com.             0       IN      A       142.251.47.142
```

La réponse : l'IP est `142.251.47.142`. Le `0` représente le TTL (Time To Live), indiquant combien de temps ce résultat peut être mis en cache avant d'être rafraîchi.

**Section Footer (Pied de page)**

- `Query time: 0 msec` : Temps de traitement (instantané)
- `SERVER: 172.23.176.1#53` : Le serveur DNS qui a répondu, sur le port 53 via UDP
- Timestamp de la requête
- Taille du message : 54 octets

#### Ce que j'ai appris : la section OPT

Parfois, on voit une section "OPT pseudosection" dans les résultats. C'est lié à EDNS (Extension Mechanisms for DNS), qui permet des fonctionnalités supplémentaires comme :
- Des messages DNS plus grands
- Support de DNSSEC (sécurité DNS)

### Simplifier la sortie avec +short

Quand je veux juste l'essentiel sans tout le détail, j'utilise l'option `+short` :

```bash
dig +short hackthebox.com
```

**Résultat :**

```
104.18.20.126
104.18.21.126
```

Beaucoup plus simple et rapide à lire. On voit immédiatement que HackTheBox utilise deux adresses IP (probablement pour la redondance et le load balancing).

> Astuce : J'utilise `+short` pour mes scripts automatisés, et la sortie complète quand je fais de l'analyse manuelle approfondie.
{: .prompt-tip}

---

### Questions

**Which IP address maps to inlanefreight.com?**

```bash
└──╼ [★]$ dig inlanefreight.com

; <<>> DiG 9.18.33-1~deb12u2-Debian <<>> inlanefreight.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 33054
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
; EDE: 18 (Prohibited)
;; QUESTION SECTION:
;inlanefreight.com.		IN	A

;; ANSWER SECTION:
inlanefreight.com.	300	IN	A	134.209.24.248

;; Query time: 26 msec
;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)
;; WHEN: Wed Dec 03 17:08:41 CST 2025
;; MSG SIZE  rcvd: 68
```

**Réponse :** `134.209.24.248`

**Which domain is returned when querying the PTR record for 134.209.24.248?**

```bash
└──╼ [★]$ dig -x 134.209.24.248

; <<>> DiG 9.18.33-1~deb12u2-Debian <<>> -x 134.209.24.248
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 18258
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;248.24.209.134.in-addr.arpa.	IN	PTR

;; ANSWER SECTION:
248.24.209.134.in-addr.arpa. 1800 IN	PTR	inlanefreight.com.

;; Query time: 29 msec
;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)
;; WHEN: Wed Dec 03 17:11:31 CST 2025
;; MSG SIZE  rcvd: 87
```

Le `-x` est pour faire de l'ip vers le DNS

**Réponse :** `inlanefreight.com`

**What is the full domain returned when you query the mail records for facebook.com?**

```bash
└──╼ [★]$ dig facebook.com MX

; <<>> DiG 9.18.33-1~deb12u2-Debian <<>> facebook.com MX
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 58491
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;facebook.com.			IN	MX

;; ANSWER SECTION:
facebook.com.		702	IN	MX	10 smtpin.vvv.facebook.com.

;; Query time: 3 msec
;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)
;; WHEN: Wed Dec 03 17:12:48 CST 2025
;; MSG SIZE  rcvd: 68
```

Le `MX` est pour les `Mail Exange`

**Réponse :** `smtpin.vvv.facebook.com`

---

## Les sous-domaines : une mine d'or cachée

### Qu'est-ce qu'un sous-domaine ?

Jusqu'à présent, j'ai surtout travaillé sur les domaines principaux comme `example.com`. Mais la vraie richesse se trouve souvent dans les **sous-domaines**.

Un sous-domaine est une extension du domaine principal, créé pour organiser différentes sections d'un site web. Par exemple :
- `blog.example.com` pour le blog
- `shop.example.com` pour la boutique en ligne
- `mail.example.com` pour les services email

> **Pour les débutants** : Un sous-domaine est comme une pièce dans une maison. `example.com` est la maison principale, et `blog.example.com` est une pièce spécifique de cette maison.
{: .prompt-info}

### Pourquoi les sous-domaines sont précieux en pentest

Ce qui m'a vraiment frappé pendant mes labs, c'est que les sous-domaines contiennent souvent des informations et ressources qui ne sont pas directement liées au site principal.

**1. Environnements de développement et staging**

Les entreprises utilisent des sous-domaines pour tester leurs nouvelles fonctionnalités avant le déploiement. Ces environnements ont parfois des mesures de sécurité moins strictes.

J'ai trouvé des sous-domaines comme `dev.example.com` ou `staging.example.com` qui exposaient :
- Des informations sensibles en clair
- Des vulnérabilités non patchées
- Des configurations de développement

**2. Portails de connexion cachés**

Certains sous-domaines hébergent des panneaux d'administration qui ne sont pas censés être publics. Par exemple :
- `admin.example.com`
- `panel.example.com`
- `cpanel.example.com`

Ce sont des cibles de choix pour les attaquants recherchant un accès non autorisé.

**3. Applications legacy oubliées**

Des anciennes applications peuvent résider sur des sous-domaines abandonnés, contenant potentiellement :
- Des logiciels obsolètes avec des vulnérabilités connues
- Des bases de données non sécurisées
- Des backdoors non intentionnelles

**4. Fuites d'informations sensibles**

Les sous-domaines peuvent exposer involontairement :
- Documents confidentiels
- Données internes
- Fichiers de configuration

> En pentest, ignorer l'énumération de sous-domaines, c'est comme fouiller une maison en ne regardant que le salon et en ignorant toutes les autres pièces.
{: .prompt-warning}

### L'énumération de sous-domaines

L'**énumération de sous-domaines** est le processus d'identification systématique de tous les sous-domaines d'un domaine cible.

D'un point de vue DNS, les sous-domaines sont représentés par :
- **Enregistrements A** (ou AAAA pour IPv6) : mappent le sous-domaine vers une IP
- **Enregistrements CNAME** : créent des alias pointant vers d'autres domaines

Il existe deux approches principales que j'utilise en combinaison.

### Énumération active : interaction directe

L'énumération active consiste à interroger directement les serveurs DNS de la cible.

#### Méthode 1 : Zone Transfer DNS

Un **zone transfer** est une fonctionnalité DNS permettant de répliquer les enregistrements DNS d'un serveur à un autre. Si le serveur est mal configuré, on peut récupérer la liste complète des sous-domaines.

**Mon expérience :** J'ai tenté de nombreux zone transfers pendant mes labs, mais avec le durcissement de la sécurité, cette technique réussit rarement aujourd'hui. Cependant, quand ça marche, c'est jackpot.

> Un zone transfer réussi vous donne TOUS les sous-domaines d'un coup. C'est pourquoi les admins sécurisent cette fonctionnalité en priorité.
{: .prompt-tip}

#### Méthode 2 : Brute-force

Le **brute-force** consiste à tester systématiquement une liste de noms de sous-domaines potentiels contre le domaine cible.

**Outils que j'utilise :**
- `dnsenum` : Automatisation de l'énumération DNS
- `ffuf` : Fuzzer rapide et efficace
- `gobuster` : Excellent pour le bruteforce de sous-domaines

Ces outils utilisent des **wordlists** contenant des noms de sous-domaines courants comme :
- admin
- dev
- staging
- api
- mail
- vpn
- test

Documentation des outils de bruteforce :
- [ffuf sur GitHub](https://github.com/ffuf/ffuf)
- [gobuster sur GitHub](https://github.com/OJ/gobuster)

**Mon observation :** Le brute-force est plus détectable car on envoie de nombreuses requêtes DNS. Il faut toujours avoir l'autorisation et respecter les rate limits.

### Énumération passive : sources externes

L'énumération passive exploite des sources d'information externes sans interroger directement les serveurs DNS de la cible. C'est beaucoup plus discret.

#### Méthode 1 : Certificate Transparency Logs

Les **CT logs** sont des dépôts publics de certificats SSL/TLS. Ces certificats contiennent souvent une liste de sous-domaines associés dans le champ **Subject Alternative Name (SAN)**.

**Mon expérience :** C'est devenu ma méthode préférée pour la découverte passive. Les CT logs sont une vraie mine d'or.

Un certificat pour `example.com` peut révéler :
```
Subject Alternative Names:
- example.com
- www.example.com
- mail.example.com
- dev.example.com
- api.example.com
```

**Outils pour exploiter les CT logs :**
- [crt.sh](https://crt.sh/) : Interface web pour rechercher dans les CT logs
- [Entrust Certificate Search](https://www.entrust.com/resources/certificate-solutions/tools/certificate-transparency-search)

> Les CT logs sont entièrement légaux et publics. Pas besoin d'autorisation pour les consulter, ce qui en fait un excellent point de départ en reconnaissance.
{: .prompt-info}

#### Méthode 2 : Moteurs de recherche

Les moteurs de recherche indexent des millions de pages web, y compris de nombreux sous-domaines.

**Opérateur Google que j'utilise :**
```
site:example.com -www
```

Cette requête trouve tous les sous-domaines indexés par Google, en excluant le www.

**Autres opérateurs utiles :**
- `site:*.example.com` : Trouve les sous-domaines
- `site:example.com inurl:admin` : Trouve les pages d'admin

**Mon observation :** Google filtre parfois les résultats. Je combine donc Google avec DuckDuckGo pour avoir une couverture plus complète.

#### Méthode 3 : Bases de données DNS publiques

Plusieurs outils et bases de données agrègent des données DNS provenant de multiples sources :

- **VirusTotal** : En plus de scanner les malwares, il collecte des données DNS
- **SecurityTrails** : Base de données historique des DNS
- **DNSDumpster** : Outil gratuit de découverte de sous-domaines

Ces ressources permettent de rechercher des sous-domaines sans interaction directe avec la cible.

Documentation des ressources passives :
- [VirusTotal](https://www.virustotal.com/)
- [SecurityTrails](https://securitytrails.com/)
- [DNSDumpster](https://dnsdumpster.com/)

> L'énumération passive d'abord permet de comprendre la structure de nommage de l'organisation, ce qui rend le bruteforce actif beaucoup plus efficace ensuite.
{: .prompt-tip}

---

## Subdomain Bruteforcing

Après avoir exploré les méthodes passives de découverte de sous-domaines, je passe maintenant aux techniques **actives**. Le brute-forcing de sous-domaines est une approche directe qui consiste à tester systématiquement des noms potentiels contre le domaine cible.

> **Pour les débutants** : Le brute-forcing consiste à essayer une liste de noms courants (comme "dev", "staging", "admin") pour voir s'ils existent en tant que sous-domaines. C'est comme essayer toutes les clés d'un trousseau pour trouver celle qui ouvre une porte.
{: .prompt-info}

### Le principe du brute-forcing

La méthode se déroule en quatre étapes que j'applique systématiquement :

**1. Sélection de la wordlist**

Je dois choisir une liste de noms potentiels. Trois types existent :

- **Générique** : Noms courants (dev, staging, blog, mail, admin, test) - utile quand je ne connais pas les conventions de nommage de la cible
- **Ciblée** : Focalisée sur des secteurs, technologies ou patterns spécifiques - plus efficace et réduit les faux positifs
- **Personnalisée** : Je crée ma propre liste basée sur des mots-clés ou des informations collectées

**2. Itération et construction**

Un script parcourt la wordlist et ajoute chaque mot au domaine principal. Par exemple, avec `example.com`, je teste `dev.example.com`, `staging.example.com`, etc.

**3. Requête DNS**

Pour chaque sous-domaine potentiel, j'effectue une requête DNS pour vérifier s'il résout vers une adresse IP (enregistrement A ou AAAA).

**4. Filtrage et validation**

Si un sous-domaine résout avec succès, je l'ajoute à ma liste de résultats. Je peux ensuite valider son existence en tentant d'y accéder via un navigateur.

> **Attention** : Le brute-forcing génère beaucoup de requêtes DNS vers le serveur cible. Cette activité est facilement détectable et peut être considérée comme intrusive. Toujours avoir une autorisation écrite avant de lancer ce type d'énumération.
{: .prompt-danger}

### Les outils de brute-forcing

Plusieurs outils excellent dans cette technique :

| Outil | Ce que j'en retiens |
|-------|---------------------|
| `dnsenum` | Outil complet de reconnaissance DNS avec support du brute-forcing par dictionnaire |
| `fierce` | Interface simple, détection des wildcards, découverte récursive de sous-domaines |
| `dnsrecon` | Polyvalent, combine plusieurs techniques DNS, formats de sortie personnalisables |
| `amass` | Activement maintenu, intégration avec d'autres outils, sources de données étendues |
| `assetfinder` | Léger et rapide, idéal pour des scans rapides |
| `puredns` | Puissant pour le brute-forcing DNS, résolution et filtrage efficaces |

### Énumération avec dnsenum

`dnsenum` est un outil Perl polyvalent que j'utilise régulièrement. Ses fonctionnalités principales :

**Récupération d'enregistrements DNS**
Il collecte les enregistrements A, AAAA, NS, MX et TXT pour avoir une vue complète de la configuration DNS.

**Tentatives de transfert de zone**
L'outil teste automatiquement les transferts de zone depuis les serveurs de noms découverts. La plupart des serveurs bien configurés bloquent cette tentative, mais un succès révèle énormément d'informations DNS.

**Brute-forcing de sous-domaines**
Il teste systématiquement les noms d'une wordlist contre le domaine cible.

**Scraping Google**
Il peut extraire des résultats de recherche Google pour trouver des sous-domaines additionnels.

**Lookups inversés**
Il effectue des requêtes DNS inversées pour identifier les domaines associés à une IP donnée.

**Requêtes WHOIS**
Il collecte des informations sur la propriété et l'enregistrement du domaine.

### Mon test avec inlanefreight.com

J'ai lancé une énumération sur `inlanefreight.com` en utilisant la wordlist `subdomains-top1million-20000.txt` de SecLists, qui contient les 20 000 sous-domaines les plus courants.

**Ma commande :**
```bash
dnsenum --enum inlanefreight.com -f /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt -r
```

**Décortiquons les options :**
- `--enum inlanefreight.com` : Le domaine cible avec des options de tuning par défaut
- `-f /chemin/wordlist` : Le chemin vers ma wordlist de brute-forcing
- `-r` : Active le brute-forcing **récursif** - si dnsenum trouve un sous-domaine, il tentera d'énumérer les sous-domaines de ce sous-domaine

**Mon résultat :**
```
dnsenum VERSION:1.2.6

-----   inlanefreight.com   -----


Host's addresses:
__________________

inlanefreight.com.                       300      IN    A        134.209.24.248

[...]

Brute forcing with /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt:
_______________________________________________________________________________________

www.inlanefreight.com.                   300      IN    A        134.209.24.248
support.inlanefreight.com.               300      IN    A        134.209.24.248
[...]


done.
```

**Mon observation :**

J'ai découvert plusieurs sous-domaines actifs, notamment `www` et `support`. Tous résolvent vers la même adresse IP `134.209.24.248`, ce qui suggère qu'ils sont probablement hébergés sur le même serveur.

> **Astuce** : L'option `-r` (récursif) est puissante mais génère encore plus de requêtes DNS. À utiliser avec précaution, surtout si vous voulez rester discret pendant un engagement de pentest.
{: .prompt-tip}

La récursivité est particulièrement utile quand je trouve des sous-domaines qui pourraient eux-mêmes avoir des sous-domaines (comme `dev.internal.example.com`).

Pour plus de détails sur les techniques de brute-forcing DNS, consulter la [documentation de dnsenum](https://github.com/fwaeytens/dnsenum).

---

### Question

**Using the known subdomains for inlanefreight.com (www, ns1, ns2, ns3, blog, support, customer), find any missing subdomains by brute-forcing possible domain names. Provide your answer with the complete subdomain, e.g., www.inlanefreight.com.**

Nous allons utiliser l'outil `dnsenum`

```bash
└──╼ [★]$ dnsenum --enum inlanefreight.com -f /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -r
dnsenum VERSION:1.2.6

-----   inlanefreight.com   -----


Host's addresses:
__________________

inlanefreight.com.                       300      IN    A        134.209.24.248


Name Servers:
______________

ns2.inlanefreight.com.                   300      IN    A        206.189.119.186
ns1.inlanefreight.com.                   300      IN    A        178.128.39.165


Mail (MX) Servers:
___________________



Trying Zone Transfers and getting Bind Versions:
_________________________________________________


Trying Zone Transfer for inlanefreight.com on ns2.inlanefreight.com ... 
AXFR record query failed: Connection timed out

Trying Zone Transfer for inlanefreight.com on ns1.inlanefreight.com ... 
AXFR record query failed: Connection timed out


Scraping inlanefreight.com subdomains from Google:
___________________________________________________



Brute forcing with /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt:
______________________________________________________________________________________

www.inlanefreight.com.                   300      IN    A        134.209.24.248
ns1.inlanefreight.com.                   300      IN    A        178.128.39.165
blog.inlanefreight.com.                  300      IN    A        134.209.24.248
ns2.inlanefreight.com.                   300      IN    A        206.189.119.186
ns3.inlanefreight.com.                   300      IN    A        134.209.24.248
support.inlanefreight.com.               300      IN    A        134.209.24.248
my.inlanefreight.com.                    300      IN    A        134.209.24.248
customer.inlanefreight.com.              300      IN    A        134.209.24.248


Performing recursion:
______________________


 ---- Checking subdomains NS records ----

  Can't perform recursion no NS records.


Launching Whois Queries:
_________________________

 whois ip result:   134.209.24.0       ->      134.209.0.0/16
 whois ip result:   178.128.39.0       ->      178.128.32.0/20
 whois ip result:   206.189.119.0      ->      206.189.0.0/16


inlanefreight.com_________________

 178.128.32.0/20
 206.189.0.0/16
 134.209.0.0/16


Performing reverse lookup on 135168 ip addresses:
__________________________________________________

^C

```

J'ai arrété le scan car nous avions déjà ce que nous voulions.

**Réponse :** `my.inlanefreight.com`

---

## Transferts de zone DNS

Bien que le brute-forcing soit efficace, il existe une méthode **moins invasive** et potentiellement plus performante pour découvrir des sous-domaines : les transferts de zone DNS. Ce mécanisme, conçu pour répliquer les enregistrements DNS entre serveurs de noms, peut devenir une mine d'or d'informations s'il est mal configuré.

> **Pour les débutants** : Un transfert de zone DNS, c'est comme copier tout un annuaire téléphonique d'un serveur à un autre. Si cette copie n'est pas protégée, n'importe qui peut la demander et obtenir toutes les informations d'un coup.
{: .prompt-info}

### Qu'est-ce qu'un transfert de zone ?

Un transfert de zone DNS est essentiellement une **copie complète** de tous les enregistrements DNS d'une zone (un domaine et ses sous-domaines) d'un serveur de noms vers un autre. Ce processus est essentiel pour maintenir la cohérence et la redondance entre les serveurs DNS.

Cependant, si ce mécanisme n'est pas correctement sécurisé, des parties non autorisées peuvent télécharger l'intégralité du fichier de zone, révélant ainsi une liste complète des sous-domaines, leurs adresses IP associées et d'autres données DNS sensibles.

### Le processus de transfert de zone

Voici comment se déroule un transfert de zone légitime entre serveurs :

**1. Requête de transfert de zone (AXFR)**

Le serveur DNS secondaire initie le processus en envoyant une requête de transfert au serveur primaire. Cette requête utilise généralement le type AXFR (Full Zone Transfer).

**2. Transfert de l'enregistrement SOA**

Après réception de la requête (et potentiellement l'authentification du serveur secondaire), le serveur primaire répond en envoyant son enregistrement Start of Authority (SOA). Cet enregistrement contient des informations vitales sur la zone, notamment son numéro de série, qui aide le serveur secondaire à déterminer si ses données de zone sont à jour.

**3. Transmission des enregistrements DNS**

Le serveur primaire transfère ensuite tous les enregistrements DNS de la zone vers le serveur secondaire, un par un. Cela inclut les enregistrements A, AAAA, MX, CNAME, NS et autres qui définissent les sous-domaines, serveurs mail, serveurs de noms et autres configurations du domaine.

**4. Fin du transfert de zone**

Une fois tous les enregistrements transmis, le serveur primaire signale la fin du transfert, informant le serveur secondaire qu'il a reçu une copie complète des données de zone.

**5. Accusé de réception (ACK)**

Le serveur secondaire envoie un message d'accusé de réception au serveur primaire, confirmant la réception et le traitement réussis des données de zone. Cela complète le processus de transfert.

### La vulnérabilité du transfert de zone

Bien que les transferts de zone soient essentiels pour la gestion DNS légitime, un serveur DNS mal configuré peut transformer ce processus en **vulnérabilité de sécurité majeure**. Le problème central réside dans les contrôles d'accès régissant qui peut initier un transfert de zone.

Aux débuts d'Internet, permettre à n'importe quel client de demander un transfert de zone était une pratique courante. Cette approche ouverte simplifiant l'administration, mais ouvrait une **faille de sécurité béante**. N'importe qui, y compris des acteurs malveillants, pouvait demander une copie complète du fichier de zone d'un serveur DNS.

**Ce qu'un transfert de zone non autorisé révèle :**

- **Sous-domaines** : Une liste complète des sous-domaines, dont beaucoup pourraient ne pas être liés au site principal ou facilement découvrables par d'autres moyens. Ces sous-domaines cachés pourraient héberger des serveurs de développement, environnements de staging, panneaux d'administration ou autres ressources sensibles.
- **Adresses IP** : Les adresses IP associées à chaque sous-domaine, fournissant des cibles potentielles pour des reconnaissances ou attaques supplémentaires.
- **Enregistrements de serveurs de noms** : Détails sur les serveurs de noms autoritaires pour le domaine, révélant le fournisseur d'hébergement et de potentielles mauvaises configurations.

> **Bonne nouvelle** : La plupart des administrateurs DNS ont pris conscience de cette vulnérabilité. Les serveurs DNS modernes sont généralement configurés pour autoriser les transferts de zone uniquement vers des serveurs secondaires de confiance.
{: .prompt-tip}

Cependant, des mauvaises configurations peuvent toujours survenir en raison d'erreurs humaines ou de pratiques obsolètes. C'est pourquoi tenter un transfert de zone (avec autorisation appropriée) reste une technique de reconnaissance précieuse.

### Exploitation des transferts de zone

Je peux utiliser la commande `dig` pour demander un transfert de zone :
```bash
dig axfr @nsztm1.digi.ninja zonetransfer.me
```

Cette commande demande à `dig` de requêter un transfert de zone complet (axfr) depuis le serveur DNS responsable de `zonetransfer.me`. Si le serveur est mal configuré et autorise le transfert, je recevrai une liste complète des enregistrements DNS du domaine, incluant tous les sous-domaines.

**Mon test avec zonetransfer.me :**
```bash
dig axfr @nsztm1.digi.ninja zonetransfer.me
```

**Mon résultat :**
```
; <<>> DiG 9.18.12-1~bpo11+1-Debian <<>> axfr @nsztm1.digi.ninja zonetransfer.me
; (1 server found)
;; global options: +cmd
zonetransfer.me.    7200    IN  SOA nsztm1.digi.ninja. robin.digi.ninja. 2019100801 172800 900 1209600 3600
zonetransfer.me.    300 IN  HINFO   "Casio fx-700G" "Windows XP"
zonetransfer.me.    301 IN  TXT "google-site-verification=tyP28J7JAUHA9fw2sHXMgcCC0I6XBmmoVi04VlMewxA"
zonetransfer.me.    7200    IN  MX  0 ASPMX.L.GOOGLE.COM.
...
zonetransfer.me.    7200    IN  A   5.196.105.14
zonetransfer.me.    7200    IN  NS  nsztm1.digi.ninja.
zonetransfer.me.    7200    IN  NS  nsztm2.digi.ninja.
_acme-challenge.zonetransfer.me. 301 IN TXT "6Oa05hbUJ9xSsvYy7pApQvwCUSSGgxvrbdizjePEsZI"
_sip._tcp.zonetransfer.me. 14000 IN SRV 0 0 5060 www.zonetransfer.me.
14.105.196.5.IN-ADDR.ARPA.zonetransfer.me. 7200 IN PTR www.zonetransfer.me.
asfdbauthdns.zonetransfer.me. 7900 IN   AFSDB   1 asfdbbox.zonetransfer.me.
asfdbbox.zonetransfer.me. 7200  IN  A   127.0.0.1
asfdbvolume.zonetransfer.me. 7800 IN    AFSDB   1 asfdbbox.zonetransfer.me.
canberra-office.zonetransfer.me. 7200 IN A  202.14.81.230
...
;; Query time: 10 msec
;; SERVER: 81.4.108.41#53(nsztm1.digi.ninja) (TCP)
;; WHEN: Mon May 27 18:31:35 BST 2024
;; XFR size: 50 records (messages 1, bytes 2085)
```

**Mon observation :**

Le transfert de zone a fonctionné et j'ai obtenu **50 enregistrements** en une seule requête ! C'est impressionnant comparé au brute-forcing qui nécessite des milliers de requêtes.

J'ai découvert des sous-domaines intéressants comme :
- `canberra-office.zonetransfer.me` (202.14.81.230) - probablement un bureau distant
- `asfdbbox.zonetransfer.me` (127.0.0.1) - configuration localhost
- Des enregistrements SRV pour `_sip._tcp` révélant des services de téléphonie

> **Note importante** : `zonetransfer.me` est un service spécialement configuré pour démontrer les risques des transferts de zone. C'est donc un environnement d'apprentissage légitime où le transfert de zone fonctionne volontairement.
{: .prompt-info}

> **En situation réelle** : La plupart des serveurs DNS modernes refuseront votre requête de transfert de zone si vous n'êtes pas un serveur secondaire autorisé. Mais tenter la requête reste utile car même un refus peut révéler des informations sur la configuration du serveur.
{: .prompt-warning}

---

### Questions

**After performing a zone transfer for the domain inlanefreight.htb on the target system, how many DNS records are retrieved from the target system's name server? Provide your answer as an integer, e.g, 123.**

```bash
└──╼ [★]$ dig axfr @10.129.238.10 inlanefreight.htb

; <<>> DiG 9.18.33-1~deb12u2-Debian <<>> axfr @10.129.238.10 inlanefreight.htb
; (1 server found)
;; global options: +cmd
inlanefreight.htb.	604800	IN	SOA	inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
inlanefreight.htb.	604800	IN	NS	ns.inlanefreight.htb.
admin.inlanefreight.htb. 604800	IN	A	10.10.34.2
ftp.admin.inlanefreight.htb. 604800 IN	A	10.10.34.2
careers.inlanefreight.htb. 604800 IN	A	10.10.34.50
dc1.inlanefreight.htb.	604800	IN	A	10.10.34.16
dc2.inlanefreight.htb.	604800	IN	A	10.10.34.11
internal.inlanefreight.htb. 604800 IN	A	127.0.0.1
admin.internal.inlanefreight.htb. 604800 IN A	10.10.1.11
wsus.internal.inlanefreight.htb. 604800	IN A	10.10.1.240
ir.inlanefreight.htb.	604800	IN	A	10.10.45.5
dev.ir.inlanefreight.htb. 604800 IN	A	10.10.45.6
ns.inlanefreight.htb.	604800	IN	A	127.0.0.1
resources.inlanefreight.htb. 604800 IN	A	10.10.34.100
securemessaging.inlanefreight.htb. 604800 IN A	10.10.34.52
test1.inlanefreight.htb. 604800	IN	A	10.10.34.101
us.inlanefreight.htb.	604800	IN	A	10.10.200.5
cluster14.us.inlanefreight.htb.	604800 IN A	10.10.200.14
messagecenter.us.inlanefreight.htb. 604800 IN A	10.10.200.10
ww02.inlanefreight.htb.	604800	IN	A	10.10.34.112
www1.inlanefreight.htb.	604800	IN	A	10.10.34.111
inlanefreight.htb.	604800	IN	SOA	inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
;; Query time: 43 msec
;; SERVER: 10.129.238.10#53(10.129.238.10) (TCP)
;; WHEN: Thu Dec 04 08:58:23 CST 2025
;; XFR size: 22 records (messages 1, bytes 594)
```

Comme on peut le voir sur la dernière ligne il y a 22 records

**Réponse :** `22`

**Within the zone record transferred above, find the ip address for ftp.admin.inlanefreight.htb. Respond only with the IP address, eg 127.0.0.1**

Nous voyons que l'IP de `ftp.admin.inlanefreight.htb` est la suivante

**Réponse :** `10.10.34.2`

**Within the same zone record, identify the largest IP address allocated within the 10.10.200 IP range. Respond with the full IP address, eg 10.10.200.1**

La range d'IP la plus grande nous pouvons voir que c'est celle ci

**Réponse :** `10.10.200.14`

---

## Virtual Hosts

Une fois que le DNS a dirigé le trafic vers le bon serveur, la configuration du serveur web devient **cruciale** pour déterminer comment les requêtes entrantes sont traitées. Les serveurs web comme Apache, Nginx ou IIS sont conçus pour héberger plusieurs sites web ou applications sur un seul serveur. Ils y parviennent grâce à l'**hébergement virtuel** (virtual hosting), qui leur permet de différencier les domaines, sous-domaines ou même des sites web distincts avec du contenu différent.

> **Pour les débutants** : Un virtual host (VHost), c'est comme avoir plusieurs boutiques dans le même bâtiment. Le serveur web lit l'adresse demandée et vous dirige vers la bonne "boutique" (le bon site web).
{: .prompt-info}

### Comment fonctionnent les Virtual Hosts

Au cœur de l'hébergement virtuel se trouve la capacité des serveurs web à distinguer plusieurs sites web ou applications partageant la même adresse IP. Cela est réalisé en exploitant l'**en-tête HTTP Host**, une information incluse dans chaque requête HTTP envoyée par un navigateur web.

**La différence clé entre VHosts et sous-domaines :**

Les VHosts et les sous-domaines ont une relation différente avec le DNS et la configuration du serveur web.

**Sous-domaines**

Ce sont des extensions d'un nom de domaine principal (par exemple, `blog.example.com` est un sous-domaine de `example.com`). Les sous-domaines ont généralement leurs propres enregistrements DNS, pointant soit vers la même adresse IP que le domaine principal, soit vers une différente. Ils permettent d'organiser différentes sections ou services d'un site web.

**Virtual Hosts (VHosts)**

Ce sont des configurations au sein d'un serveur web qui permettent d'héberger plusieurs sites web ou applications sur un seul serveur. Ils peuvent être associés à des domaines de premier niveau (par exemple, `example.com`) ou à des sous-domaines (par exemple, `dev.example.com`). Chaque virtual host peut avoir sa propre configuration distincte, permettant un contrôle précis sur la manière dont les requêtes sont traitées.

> **Point important** : Si un virtual host n'a pas d'enregistrement DNS, vous pouvez quand même y accéder en modifiant le fichier `hosts` sur votre machine locale. Ce fichier permet de mapper manuellement un nom de domaine vers une adresse IP, contournant ainsi la résolution DNS.
{: .prompt-tip}

Les sites web ont souvent des sous-domaines qui ne sont **pas publics** et n'apparaîtront pas dans les enregistrements DNS. Ces sous-domaines sont uniquement accessibles en interne ou via des configurations spécifiques. Le **VHost fuzzing** est une technique pour découvrir ces sous-domaines publics et non-publics en testant divers noms d'hôtes contre une adresse IP connue.

### Exemple de configuration Virtual Host

Les virtual hosts peuvent être configurés pour utiliser différents domaines, pas seulement des sous-domaines :
```apache
# Exemple de configuration de virtual host basée sur le nom dans Apache
<VirtualHost *:80>
    ServerName www.example1.com
    DocumentRoot /var/www/example1
</VirtualHost>

<VirtualHost *:80>
    ServerName www.example2.org
    DocumentRoot /var/www/example2
</VirtualHost>

<VirtualHost *:80>
    ServerName www.another-example.net
    DocumentRoot /var/www/another-example
</VirtualHost>
```

Ici, `example1.com`, `example2.org` et `another-example.net` sont des domaines distincts hébergés sur le même serveur. Le serveur web utilise l'en-tête Host pour servir le contenu approprié en fonction du nom de domaine demandé.

### Processus de résolution VHost du serveur

Voici comment un serveur web détermine le bon contenu à servir en fonction de l'en-tête Host :

**1. Le navigateur demande un site web**

Quand vous entrez un nom de domaine (par exemple, `www.inlanefreight.com`) dans votre navigateur, celui-ci initie une requête HTTP vers le serveur web associé à l'adresse IP de ce domaine.

**2. L'en-tête Host révèle le domaine**

Le navigateur inclut le nom de domaine dans l'en-tête Host de la requête, qui agit comme une étiquette pour informer le serveur web quel site est demandé.

**3. Le serveur web détermine le Virtual Host**

Le serveur web reçoit la requête, examine l'en-tête Host et consulte sa configuration de virtual hosts pour trouver une entrée correspondant au nom de domaine demandé.

**4. Servir le bon contenu**

Une fois le bon virtual host identifié, le serveur web récupère les fichiers et ressources correspondants depuis son répertoire racine et les renvoie au navigateur dans la réponse HTTP.

En essence, l'en-tête Host fonctionne comme un **interrupteur**, permettant au serveur web de déterminer dynamiquement quel site servir en fonction du nom de domaine demandé par le navigateur.

### Types d'hébergement virtuel

Il existe trois types principaux d'hébergement virtuel, chacun avec ses avantages et inconvénients :

**Name-Based Virtual Hosting (Basé sur le nom)**

Cette méthode repose uniquement sur l'en-tête HTTP Host pour distinguer les sites web. C'est la méthode la plus courante et flexible, car elle ne nécessite pas plusieurs adresses IP. Elle est économique, facile à configurer et supportée par la plupart des serveurs web modernes. Cependant, elle nécessite que le serveur web supporte l'hébergement virtuel basé sur le nom et peut avoir des limitations avec certains protocoles comme SSL/TLS.

**IP-Based Virtual Hosting (Basé sur l'IP)**

Ce type d'hébergement attribue une adresse IP unique à chaque site web hébergé sur le serveur. Le serveur détermine quel site servir en fonction de l'adresse IP vers laquelle la requête a été envoyée. Il ne dépend pas de l'en-tête Host, peut être utilisé avec n'importe quel protocole et offre une meilleure isolation entre les sites web. Cependant, il nécessite plusieurs adresses IP, ce qui peut être coûteux et moins évolutif.

**Port-Based Virtual Hosting (Basé sur le port)**

Différents sites web sont associés à différents ports sur la même adresse IP. Par exemple, un site pourrait être accessible sur le port 80, tandis qu'un autre est sur le port 8080. L'hébergement basé sur le port peut être utilisé quand les adresses IP sont limitées, mais ce n'est pas aussi courant ou convivial que l'hébergement basé sur le nom, et peut nécessiter que les utilisateurs spécifient le numéro de port dans l'URL.

### Outils de découverte de Virtual Hosts

Bien que l'analyse manuelle des en-têtes HTTP et les lookups DNS inversés puissent être efficaces, des outils spécialisés automatisent et rationalisent le processus, le rendant plus efficace et complet.

| Outil | Description | Caractéristiques clés |
|-------|-------------|----------------------|
| `gobuster` | Outil polyvalent souvent utilisé pour le brute-forcing de répertoires/fichiers, mais aussi efficace pour la découverte de virtual hosts | Rapide, supporte plusieurs méthodes HTTP, peut utiliser des wordlists personnalisées |
| `Feroxbuster` | Similaire à Gobuster, mais avec une implémentation en Rust, connu pour sa vitesse et flexibilité | Supporte la récursion, découverte de wildcards, et divers filtres |
| `ffuf` | Fuzzer web rapide qui peut être utilisé pour la découverte de virtual hosts en fuzzant l'en-tête Host | Options de wordlist et de filtrage personnalisables |

### Découverte avec gobuster

`gobuster` est un outil polyvalent couramment utilisé pour le brute-forcing de répertoires et fichiers, mais il excelle aussi dans la découverte de virtual hosts. Il envoie systématiquement des requêtes HTTP avec différents en-têtes Host vers une adresse IP cible, puis analyse les réponses pour identifier les virtual hosts valides.

**Ce dont j'ai besoin pour le brute-forcing d'en-têtes Host :**

**1. Identification de la cible**

D'abord, identifier l'adresse IP du serveur web cible. Cela peut être fait via des lookups DNS ou d'autres techniques de reconnaissance.

**2. Préparation de la wordlist**

Préparer une wordlist contenant des noms de virtual hosts potentiels. Je peux utiliser une wordlist pré-compilée comme SecLists, ou créer une personnalisée basée sur le secteur de ma cible, ses conventions de nommage ou d'autres informations pertinentes.

**Ma commande gobuster pour le brute-force de vhosts :**
```bash
gobuster vhost -u http://<target_IP_address> -w <wordlist_file> --append-domain
```

**Décortiquons les options :**

- `-u` : Spécifie l'URL cible (remplacer `<target_IP_address>` par l'IP réelle)
- `-w` : Spécifie le fichier wordlist (remplacer `<wordlist_file>` par le chemin de ma wordlist)
- `--append-domain` : Ajoute le domaine de base à chaque mot de la wordlist

> **Note importante** : Dans les versions récentes de Gobuster, le flag `--append-domain` est **requis** pour ajouter le domaine de base à chaque mot de la wordlist lors de la découverte de virtual hosts. Ce flag garantit que Gobuster construit correctement les noms d'hôtes virtuels complets, ce qui est essentiel pour une énumération précise des sous-domaines potentiels. Dans les anciennes versions, cette fonctionnalité était gérée différemment et ce flag n'était pas nécessaire.
{: .prompt-info}

**Options supplémentaires utiles :**

- `-t` : Augmenter le nombre de threads pour un scan plus rapide
- `-k` : Ignorer les erreurs de certificat SSL/TLS
- `-o` : Sauvegarder la sortie dans un fichier pour une analyse ultérieure

### Mon test avec inlanefreight.htb

J'ai lancé une découverte de virtual hosts sur `inlanefreight.htb` sur le port 81 :
```bash
gobuster vhost -u http://inlanefreight.htb:81 -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt --append-domain
```

**Mon résultat :**
```
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:             http://inlanefreight.htb:81
[+] Method:          GET
[+] Threads:         10
[+] Wordlist:        /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
[+] User Agent:      gobuster/3.6
[+] Timeout:         10s
[+] Append Domain:   true
===============================================================
Starting gobuster in VHOST enumeration mode
===============================================================
Found: forum.inlanefreight.htb:81 Status: 200 [Size: 100]
[...]
Progress: 114441 / 114442 (100.00%)
===============================================================
Finished
===============================================================
```

**Mon observation :**

J'ai découvert un virtual host `forum.inlanefreight.htb` sur le port 81 qui retourne un statut HTTP 200 avec une taille de réponse de 100 octets. Ce sous-domaine n'apparaissait probablement pas dans les enregistrements DNS publics, mais existe bel et bien sur le serveur.

> **Attention** : La découverte de virtual hosts génère un trafic significatif et pourrait être détectée par des systèmes de détection d'intrusion (IDS) ou des pare-feu d'applications web (WAF). Faire preuve de prudence et obtenir une autorisation appropriée avant de scanner des cibles.
{: .prompt-danger}

Pour approfondir les techniques de fuzzing web avec Gobuster, consulter la [documentation officielle de Gobuster](https://github.com/OJ/gobuster).

---

### Questions

**Brute-force vhosts on the target system. What is the full subdomain that is prefixed with "web"? Answer using the full domain, e.g. "x.inlanefreight.htb"**

Nous allons utiliser l'outil `gobuster` en mode `vhost`

```bash
└──╼ [★]$ gobuster vhost -u http://inlanefreight.htb:49258 -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt --append-domain
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:             http://inlanefreight.htb:49258
[+] Method:          GET
[+] Threads:         10
[+] Wordlist:        /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
[+] User Agent:      gobuster/3.6
[+] Timeout:         10s
[+] Append Domain:   true
===============================================================
Starting gobuster in VHOST enumeration mode
===============================================================
Found: blog.inlanefreight.htb:49258 Status: 200 [Size: 98]
Found: forum.inlanefreight.htb:49258 Status: 200 [Size: 100]
Found: admin.inlanefreight.htb:49258 Status: 200 [Size: 100]
Found: support.inlanefreight.htb:49258 Status: 200 [Size: 104]
Found: vm5.inlanefreight.htb:49258 Status: 200 [Size: 96]
Found: browse.inlanefreight.htb:49258 Status: 200 [Size: 102]
Found: web17611.inlanefreight.htb:49258 Status: 200 [Size: 106]
Progress: 114441 / 114442 (100.00%)
===============================================================
Finished
===============================================================
```

Il fallait d'abors ajouter l'ip cible dans notre fichier `/etc/hosts` et puis nous pouvons faire le scan sur les `virtual hosts`

**Réponse :** `web17611.inlanefreight.htb`

**Brute-force vhosts on the target system. What is the full subdomain that is prefixed with "vm"? Answer using the full domain, e.g. "x.inlanefreight.htb"**

**Réponse :** `vm5.inlanefreight.htb`

**Brute-force vhosts on the target system. What is the full subdomain that is prefixed with "br"? Answer using the full domain, e.g. "x.inlanefreight.htb"**

**Réponse :** `browse.inlanefreight.htb`

**Brute-force vhosts on the target system. What is the full subdomain that is prefixed with "a"? Answer using the full domain, e.g. "x.inlanefreight.htb"**

**Réponse :** `admin.inlanefreight.htb`

**Brute-force vhosts on the target system. What is the full subdomain that is prefixed with "su"? Answer using the full domain, e.g. "x.inlanefreight.htb"**

**Réponse :** `support.inlanefreight.htb`

---

## Certificate Transparency Logs

Dans l'immensité d'Internet, la confiance est une denrée fragile. L'un des piliers de cette confiance est le protocole **Secure Sockets Layer/Transport Layer Security (SSL/TLS)**, qui chiffre la communication entre votre navigateur et un site web. Au cœur de SSL/TLS se trouve le **certificat numérique**, un petit fichier qui vérifie l'identité d'un site web et permet une communication sécurisée et chiffrée.

Cependant, le processus d'émission et de gestion de ces certificats n'est pas infaillible. Des attaquants peuvent exploiter des certificats frauduleux ou mal émis pour usurper l'identité de sites légitimes, intercepter des données sensibles ou diffuser des malwares. C'est là qu'interviennent les **logs de Certificate Transparency (CT)**.

> **Pour les débutants** : Les certificats SSL/TLS sont comme des cartes d'identité pour les sites web. Les logs CT sont des registres publics qui enregistrent tous ces certificats émis, permettant de détecter rapidement les faux certificats.
{: .prompt-info}

### Qu'est-ce que les Certificate Transparency Logs ?

Les logs de Certificate Transparency (CT) sont des **registres publics en ajout seul** (append-only) qui enregistrent l'émission de certificats SSL/TLS. Chaque fois qu'une Autorité de Certification (CA) émet un nouveau certificat, elle doit le soumettre à plusieurs logs CT. Ces logs sont maintenus par des organisations indépendantes et sont ouverts à l'inspection publique.

Pensez aux logs CT comme un **registre mondial de certificats**. Ils fournissent un enregistrement transparent et vérifiable de chaque certificat SSL/TLS émis pour un site web. Cette transparence sert plusieurs objectifs cruciaux :

**Détection précoce de certificats frauduleux**

En surveillant les logs CT, les chercheurs en sécurité et propriétaires de sites web peuvent rapidement identifier des certificats suspects ou mal émis. Un certificat frauduleux est un certificat numérique non autorisé ou frauduleux émis par une autorité de certification de confiance. Les détecter tôt permet d'agir rapidement pour révoquer ces certificats avant qu'ils ne soient utilisés à des fins malveillantes.

**Responsabilisation des Autorités de Certification**

Les logs CT tiennent les CA responsables de leurs pratiques d'émission. Si une CA émet un certificat qui viole les règles ou normes, celui-ci sera publiquement visible dans les logs, conduisant à des sanctions potentielles ou à une perte de confiance.

**Renforcement de la PKI Web (Public Key Infrastructure)**

La PKI Web est le système de confiance sous-jacent à la communication sécurisée en ligne. Les logs CT contribuent à renforcer la sécurité et l'intégrité de la PKI Web en fournissant un mécanisme de supervision publique et de vérification des certificats.

### Les logs CT et la reconnaissance web

Les logs de Certificate Transparency offrent un **avantage unique** dans l'énumération de sous-domaines par rapport à d'autres méthodes. Contrairement au brute-forcing ou aux approches basées sur des wordlists, qui reposent sur la devinette ou la prédiction de noms de sous-domaines, les logs CT fournissent un **enregistrement définitif** des certificats émis pour un domaine et ses sous-domaines.

Cela signifie que je ne suis pas limité par la portée de ma wordlist ou l'efficacité de mon algorithme de brute-forcing. Au lieu de cela, j'obtiens un **accès à une vue historique et complète** des sous-domaines d'un domaine, y compris ceux qui pourraient ne pas être activement utilisés ou facilement devinables.

De plus, les logs CT peuvent révéler des sous-domaines associés à d'anciens certificats ou des certificats expirés. Ces sous-domaines pourraient héberger des logiciels ou configurations obsolètes, les rendant potentiellement vulnérables à l'exploitation.

> **Ce qui m'impressionne** : Les logs CT fournissent un moyen fiable et efficace de découvrir des sous-domaines sans avoir besoin de brute-forcing exhaustif ou de dépendre de la complétude des wordlists. Ils offrent une fenêtre unique sur l'historique d'un domaine et peuvent révéler des sous-domaines qui resteraient autrement cachés.
{: .prompt-tip}

### Recherche dans les logs CT

Il existe deux options populaires pour rechercher dans les logs CT :

| Outil | Caractéristiques clés | Cas d'usage | Avantages | Inconvénients |
|-------|----------------------|-------------|-----------|---------------|
| `crt.sh` | Interface web conviviale, recherche simple par domaine, affiche les détails de certificats, entrées SAN | Recherches rapides et faciles, identification de sous-domaines, vérification de l'historique d'émission de certificats | Gratuit, facile à utiliser, aucune inscription requise | Options de filtrage et d'analyse limitées |
| `Censys` | Moteur de recherche puissant pour les appareils connectés à Internet, filtrage avancé par domaine, IP, attributs de certificat | Analyse approfondie des certificats, identification de mauvaises configurations, recherche de certificats et hôtes liés | Données étendues et options de filtrage, accès API | Nécessite une inscription (niveau gratuit disponible) |

### Recherche avec crt.sh

Bien que crt.sh offre une interface web pratique, je peux aussi exploiter son API pour des recherches automatisées directement depuis mon terminal. Voici comment trouver tous les sous-domaines 'dev' sur facebook.com en utilisant `curl` et `jq` :

**Ma commande :**
```bash
curl -s "https://crt.sh/?q=facebook.com&output=json" | jq -r '.[] | select(.name_value | contains("dev")) | .name_value' | sort -u
```

**Mon résultat :**
```
*.dev.facebook.com
*.newdev.facebook.com
*.secure.dev.facebook.com
dev.facebook.com
devvm1958.ftw3.facebook.com
facebook-amex-dev.facebook.com
facebook-amex-sign-enc-dev.facebook.com
newdev.facebook.com
secure.dev.facebook.com
```

**Décortiquons la commande :**

- `curl -s "https://crt.sh/?q=facebook.com&output=json"` : Cette commande récupère la sortie JSON depuis crt.sh pour les certificats correspondant au domaine facebook.com. L'option `-s` (silent) supprime la barre de progression.

- `jq -r '.[] | select(.name_value | contains("dev")) | .name_value'` : Cette partie filtre les résultats JSON, sélectionnant uniquement les entrées où le champ `name_value` (qui contient le domaine ou sous-domaine) inclut la chaîne "dev". Le flag `-r` indique à `jq` de sortir des chaînes brutes (sans guillemets).

- `sort -u` : Cela trie les résultats par ordre alphabétique et supprime les doublons.

**Mon observation :**

J'ai découvert plusieurs sous-domaines liés au développement que je n'aurais probablement pas trouvés avec du brute-forcing classique, notamment `devvm1958.ftw3.facebook.com` qui semble être une machine virtuelle de développement spécifique. Les certificats wildcard (`*.dev.facebook.com`) indiquent qu'il existe probablement de nombreux autres sous-domaines sous cette structure.

> **Astuce pratique** : Pour rechercher un domaine spécifique sans filtrage, supprimez simplement la partie `select` de la commande jq. Cela vous donnera tous les sous-domaines trouvés dans les logs CT pour ce domaine.
{: .prompt-tip}

Cette technique est particulièrement puissante car elle révèle l'historique complet des certificats émis, même pour des sous-domaines qui n'existent plus ou qui ont changé de configuration.

Pour explorer l'API de crt.sh en détail, consulter la [documentation crt.sh](https://crt.sh/).

**Cours complété**

{% include comments.html %}