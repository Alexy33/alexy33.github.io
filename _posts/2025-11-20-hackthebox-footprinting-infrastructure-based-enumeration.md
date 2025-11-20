---
title: "HackTheBox - Footprinting Infrastructure based enumeration"
date: 2025-11-20 21:22:00 +0200
categories: [HackTheBox, Learning]
tags: [osint, reconnaissance, dns, certificate-transparency, shodan, enumeration]
description: "Découverte passive de l'infrastructure d'une entreprise : certificats SSL, logs de transparence, enregistrements DNS et identification des services tiers"
image:
  path: /assets/img/posts/footprinting-introduction.png
  alt: "HTB Academy - Domain Information"
---

## Informations sur le module

Ce module couvre la collecte passive d'informations sur un domaine cible lors d'un test d'intrusion. L'objectif est de comprendre la présence complète d'une entreprise sur Internet sans effectuer de scans actifs directs.

**Lien :** [Infrastructure based enumeration](https://academy.hackthebox.com/beta/module/112/section/1061)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Identifier les sous-domaines via les certificats SSL et les logs de transparence
- Analyser les enregistrements DNS pour découvrir l'infrastructure
- Utiliser Shodan pour la reconnaissance passive
- Identifier les services tiers utilisés par l'entreprise
- Distinguer les serveurs gérés en interne des services hébergés par des tiers

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Comprendre l'entreprise cible

### Première étape : analyser le site web principal

Avant de lancer des outils, j'ai commencé par **visiter le site web de l'entreprise** comme un simple client. Cette approche permet de rester discret et de comprendre :

- Quels services l'entreprise propose (développement d'applications, IoT, hébergement, data science, etc.)
- Quelles technologies sont probablement utilisées en coulisses
- Comment l'infrastructure pourrait être organisée

> Cette phase combine les deux premiers principes d'énumération : observer ce qu'on voit ET ce qu'on ne voit pas
{: .prompt-tip}

**Mon observation :** En analysant les services proposés, je peux déduire les technologies nécessaires. Par exemple, si une entreprise propose du développement IoT, elle doit forcément avoir des serveurs MQTT, des bases de données temps réel, etc.

### Découvrir les sous-domaines via les certificats SSL

#### Les certificats SSL révèlent beaucoup d'informations

La première chose que j'ai analysée, c'est le **certificat SSL du site principal**. Ce qui m'a surpris : un seul certificat peut couvrir **plusieurs domaines et sous-domaines** !

**Exemple de certificat analysé :**
```
Validité : 18 mai 2021 → 6 avril 2022
DNS names inclus :
- inlanefreight.htb
- www.inlanefreight.htb
- support.inlanefreight.htb
```

**Pourquoi c'est important ?** Ces sous-domaines sont probablement encore actifs et représentent des points d'entrée potentiels.

### Certificate Transparency Logs avec crt.sh

J'ai ensuite utilisé **crt.sh**, un service qui archive tous les certificats SSL émis publiquement. C'est une mine d'or pour la reconnaissance passive !

> Le standard RFC 6962 impose aux autorités de certification de logger tous les certificats émis. Ces logs sont publics et consultables !
{: .prompt-info}

**Ma recherche sur crt.sh :**
```bash
# Recherche simple via l'interface web
https://www.crt.sh/?q=inlanefreight.com

# Version automatisée en JSON
curl -s https://crt.sh/\?q\=inlanefreight.com\&output\=json | jq .
```

**Résultat :** J'ai trouvé des certificats pour :
- `matomo.inlanefreight.com` (Let's Encrypt)
- `smartfactory.inlanefreight.com` (Let's Encrypt)
- Et bien d'autres...

#### Extraire uniquement les sous-domaines uniques

Pour avoir une liste propre, j'ai filtré les résultats JSON :
```bash
curl -s https://crt.sh/\?q\=inlanefreight.com\&output\=json | jq . | grep name | cut -d":" -f2 | grep -v "CN=" | cut -d'"' -f2 | awk '{gsub(/\\n/,"\n");}1;' | sort -u
```

**Liste de sous-domaines découverts :**
```
account.ttn.inlanefreight.com
blog.inlanefreight.com
console.ttn.inlanefreight.com
iot.inlanefreight.com
marina.inlanefreight.com
matomo.inlanefreight.com
shop.inlanefreight.com
smartfactory.inlanefreight.com
... et plus encore
```

> À ce stade, j'ai déjà une bonne vue de la surface d'attaque sans avoir envoyé un seul paquet à la cible !
{: .prompt-tip}

### Identifier les serveurs hébergés en interne

#### Pourquoi faire cette distinction ?

Tous ces sous-domaines ne sont pas forcément hébergés directement par l'entreprise. Certains peuvent pointer vers AWS, Cloudflare, ou d'autres fournisseurs tiers.

> **Règle importante :** Je ne peux PAS tester les serveurs hébergés par des tiers sans leur autorisation explicite
{: .prompt-danger}

**Ma commande pour résoudre les IPs :**
```bash
for i in $(cat subdomainlist);do host $i | grep "has address" | grep inlanefreight.com | cut -d" " -f1,4;done
```

**Résultats filtrés :**
```
blog.inlanefreight.com 10.129.24.93
inlanefreight.com 10.129.27.33
matomo.inlanefreight.com 10.129.127.22
www.inlanefreight.com 10.129.127.33
s3-website-us-west-2.amazonaws.com 10.129.95.250
```

**Mon analyse :** 
- Les IPs `10.129.x.x` semblent être des serveurs internes → **OK pour le test**
- L'adresse AWS → **À exclure du scope** (hébergement tiers)

### Reconnaissance avec Shodan

#### Qu'est-ce que Shodan révèle ?

Shodan est un moteur de recherche qui scanne constamment Internet et indexe tous les services exposés. C'est parfait pour la reconnaissance passive !

**Ma démarche :**
1. J'ai extrait les IPs des serveurs internes
2. J'ai interrogé Shodan pour chaque IP

```bash
#Créer une liste d'IPs
for i in $(cat subdomainlist);do host $i | grep "has address" | grep inlanefreight.com | cut -d" " -f4 >> ip-addresses.txt;done
```
```bash
#Interroger Shodan
for i in $(cat ip-addresses.txt);do shodan host $i;done
```

##### Analyse d'un serveur intéressant : 10.129.127.22

**Ce que Shodan m'a révélé :**
```
Organization: InlaneFreight
Location: Berlin, Germany
Open ports: 8

Ports découverts :
- 25/tcp : TLS 1.2, 1.3 (mail sécurisé)
- 53/tcp + 53/udp : DNS
- 80/tcp : Apache httpd
- 81/tcp : Apache httpd (port alternatif ?)
- 110/tcp : TLS 1.2 (POP3 sécurisé)
- 443/tcp : Apache httpd avec TLS
- 444/tcp : Service non identifié
```

**Mon observation :** Ce serveur `matomo.inlanefreight.com` a **beaucoup de ports ouverts**. C'est probablement un serveur multi-services qui mérite une investigation active approfondie.

> Shodan me permet de prioriser mes cibles sans envoyer un seul paquet ! Le serveur sur 10.129.127.22 devient ma cible prioritaire.
{: .prompt-tip}

#### Analyse des enregistrements DNS

##### Pourquoi interroger les DNS records ?

Les enregistrements DNS contiennent bien plus que des adresses IP. Ils révèlent l'architecture complète de l'infrastructure.

**Ma commande :**
```bash
dig any inlanefreight.com
```

##### Types d'enregistrements découverts

###### Enregistrements A (Adresses IP)
```
inlanefreight.com. 300 IN A 10.129.27.33
inlanefreight.com. 300 IN A 10.129.95.250
```

**Analyse :** Deux IPs pour le domaine principal → probable load balancing ou redondance.

###### Enregistrements MX (Serveurs mail)
```
inlanefreight.com. 3600 IN MX 1 aspmx.l.google.com
inlanefreight.com. 3600 IN MX 5 alt1.aspmx.l.google.com
```

**Mon observation :** L'entreprise utilise **Google pour les emails**. Je note cela pour plus tard, mais ce n'est pas ma cible directe (service tiers).

###### Enregistrements NS (Name Servers)
```
inlanefreight.com. 21600 IN NS ns.inwx.net
inlanefreight.com. 21600 IN NS ns2.inwx.net
inlanefreight.com. 21600 IN NS ns3.inwx.eu
```

**Déduction :** Le domaine est géré par **INWX**, probablement le registrar et hébergeur DNS.

###### Enregistrements TXT (Les plus riches en informations !)

C'est là que ça devient vraiment intéressant :
```
"MS=ms92346782372"
"atlassian-domain-verification=IJdXMt1rKCy68JFszSdCKVpwPN"
"google-site-verification=O7zV5-xFh_jn7JQ31"
"logmein-verification-code=87123gff5a479e-61d4325gddkbvc1..."
"v=spf1 include:mailgun.org include:_spf.google.com include:spf.protection.outlook.com include:_spf.atlassian.net ip4:10.129.24.8 ip4:10.129.27.2 ip4:10.72.82.106 ~all"
```

##### Ce que j'ai appris des enregistrements TXT

**Services tiers identifiés :**

| Service | Ce que ça m'apprend | Impact pour le pentest |
|---------|---------------------|------------------------|
| **Atlassian** | Collaboration et développement logiciel | Possible Jira/Confluence à découvrir |
| **Google Gmail** | Gestion des emails | Potentiels Google Drive partagés publiquement |
| **LogMeIn** | Accès à distance centralisé | Cible critique si compromis = accès à tout |
| **Mailgun** | API d'envoi d'emails | Tester les APIs pour IDOR, SSRF, injections |
| **Outlook** | Office 365, OneDrive, Azure | Chercher des partages Azure Blob/File Storage (SMB) |
| **INWX** | Hébergeur et registrar | Le code "MS=" ressemble à un identifiant de connexion |

**IPs additionnelles découvertes dans l'enregistrement SPF :**
- `10.129.24.8`
- `10.129.27.2`
- `10.72.82.106`

> Ces IPs sont autorisées à envoyer des emails pour le domaine. Ce sont probablement des serveurs internes supplémentaires à investiguer !
{: .prompt-info}

##### Pourquoi c'est une mine d'or ?

**Ma réflexion stratégique :**

1. **LogMeIn centralisé** : Si je compromets un compte admin LogMeIn (via réutilisation de mot de passe par exemple), j'ai potentiellement accès à TOUS les systèmes.

2. **Mailgun APIs** : Je dois chercher des endpoints API exposés et tester les vulnérabilités classiques (IDOR, SSRF, manipulations POST/PUT).

3. **Azure/OneDrive** : Outlook suggère Office 365. Je dois chercher des partages Azure mal configurés, surtout les File Storage qui utilisent **SMB** (protocole que je connais bien).

4. **INWX** : La valeur "MS=" ressemble fortement à un identifiant utilisateur. Combiné avec OSINT sur les employés, ça pourrait donner un vecteur d'attaque.

#### Ce que je retiens de cette reconnaissance passive

##### Méthodologie efficace

1. **Commencer large** : Analyser le site web pour comprendre les services
2. **Certificats SSL** : Découvrir les sous-domaines cachés
3. **Certificate Transparency** : Automatiser avec crt.sh
4. **Résolution DNS** : Identifier les serveurs internes vs. externes
5. **Shodan** : Prioriser les cibles sans scans actifs
6. **DNS records** : Cartographier les services tiers et trouver des IPs supplémentaires

##### Points d'attention découverts

- **Serveur prioritaire** : `matomo.inlanefreight.com` (10.129.127.22) avec 8 ports ouverts
- **Services critiques** : LogMeIn pour l'accès à distance centralisé
- **Vecteurs d'attaque** : APIs Mailgun, partages Azure, réutilisation de credentials INWX
- **IPs supplémentaires** : 3 serveurs de mail internes découverts via SPF

> Tout cela a été obtenu SANS envoyer un seul scan direct vers la cible. C'est ça, la puissance de l'OSINT passif !
{: .prompt-tip}

---

## Cloud Resources

### Pourquoi le cloud est une cible prioritaire en OSINT

Aujourd'hui, **presque toutes les entreprises utilisent le cloud** : AWS, GCP (Google Cloud Platform), ou Azure. L'objectif est simple : permettre aux équipes de travailler de n'importe où avec un point d'accès centralisé.

**Ce qui m'a surpris :** Même si les fournisseurs cloud (Amazon, Google, Microsoft) sécurisent leur infrastructure, **ce sont les mauvaises configurations des administrateurs** qui créent des vulnérabilités.

> Le cloud est sécurisé par défaut, mais les entreprises le rendent vulnérable par des configurations incorrectes
{: .prompt-warning}

### Les cibles cloud les plus courantes

**Terminologie selon les fournisseurs :**

| AWS | Azure | GCP |
|-----|-------|-----|
| S3 buckets | Blobs | Cloud Storage |

**Le problème récurrent :** Ces espaces de stockage peuvent être **accessibles sans authentification** si mal configurés.

### Découvrir les ressources cloud dans les DNS

#### Retour sur la résolution DNS

En reprenant ma commande de résolution DNS du domaine :
```bash
for i in $(cat subdomainlist);do host $i | grep "has address" | grep inlanefreight.com | cut -d" " -f1,4;done
```

**Résultat intéressant découvert :**
```
blog.inlanefreight.com 10.129.24.93
inlanefreight.com 10.129.27.33
matomo.inlanefreight.com 10.129.127.22
www.inlanefreight.com 10.129.127.33
s3-website-us-west-2.amazonaws.com 10.129.95.250
```

**Mon observation :** La dernière ligne révèle un **bucket S3 AWS** ! C'est exactement le type de ressource cloud qu'on cherche.

#### Pourquoi les entreprises ajoutent le cloud au DNS ?

**Ma réflexion :** Les administrateurs ajoutent souvent ces entrées DNS pour faciliter l'accès aux employés. C'est pratique pour eux, mais ça facilite aussi **ma reconnaissance passive** !

> Les ressources cloud ajoutées au DNS = signaux clairs pour le pentester
{: .prompt-tip}

### Google Dorking pour trouver du stockage cloud

#### Ma technique de recherche AWS

J'ai utilisé **Google Dorks** avec les opérateurs `inurl:` et `intext:` pour trouver des buckets S3 exposés.

**Ma recherche Google :**
```
intext:inlanefreight inurl:amazonaws.com
```

**Ce que j'ai découvert :**
- Des liens directs vers des **fichiers PDF** hébergés sur S3
- Des URLs du type : `https://s3.amazonaws.com/bucket-name/document.pdf`

#### Ma technique de recherche Azure

Pour Azure, j'ai adapté ma recherche :

**Ma recherche Google :**
```
intext:inlanefreight inurl:blob.core.windows.net
```

**Résultats similaires :**
- PDFs stockés sur Azure Blob Storage
- Documents texte, présentations, et autres fichiers sensibles

**Mon analyse :** Ces fichiers sont souvent publiquement accessibles car les développeurs ont mal configuré les permissions !

#### Pourquoi ce contenu est externalisé ?

**Ce que j'ai compris :** Les entreprises stockent leurs ressources statiques (images, JavaScript, CSS, PDFs) sur le cloud pour :
1. **Alléger le serveur web** principal
2. Bénéficier de la distribution CDN
3. Simplifier la gestion des fichiers

### Analyse du code source des sites web

#### Trouver les liens cloud dans le HTML

J'ai inspecté le **code source** du site web cible et j'ai trouvé des références directes au cloud :

**Exemple de code HTML découvert :**
```html
<link rel="dns-prefetch" href="https://[redacted].blob.core.windows.net">
<link rel="preconnect" href="https://[redacted].blob.core.windows.net" crossorigin>
```

**Mon observation :** Ces balises `dns-prefetch` et `preconnect` sont ajoutées pour **optimiser les performances**, mais elles révèlent aussi les ressources Azure utilisées !

> Le code source du site web = carte au trésor vers les ressources cloud
{: .prompt-info}

### Outils tiers pour l'énumération cloud

#### Domain.Glass - Vue d'ensemble de l'infrastructure

J'ai utilisé [domain.glass](https://domain.glass/) pour obtenir des informations supplémentaires sur l'infrastructure du domaine cible.

**Ce que j'ai appris :**
- Statut de sécurité Cloudflare : **"Safe"**
- Présence de certificats SSL
- Informations sur les DNS et IPs

**Mon analyse stratégique :** Le statut "Safe" de Cloudflare indique que l'entreprise utilise un WAF (Web Application Firewall). Je note cela comme une **mesure de sécurité de Layer 2** à contourner lors de tests actifs.

> Cloudflare = obstacle potentiel pour les tests d'intrusion actifs
{: .prompt-warning}

#### GrayHatWarfare - Moteur de recherche cloud

[GrayHatWarfare](https://buckets.grayhatwarfare.com/) est un outil spécialisé qui indexe les buckets cloud publiquement accessibles. C'est devenu mon outil favori pour cette phase !

**Fonctionnalités que j'ai utilisées :**
- Recherche par nom d'entreprise
- Filtrage par type de fichier
- Support AWS, Azure, et GCP
- Affichage du **nombre de fichiers** par bucket

**Ma recherche sur GrayHatWarfare :**

J'ai cherché le nom de l'entreprise et j'ai découvert :
- **Bucket 1** : 1 fichier
- **Bucket 2** : 73 fichiers
- **Bucket 3** : 0 fichier

**Mon observation :** Le bucket avec 73 fichiers est très prometteur ! Il contient probablement des documents internes, backups, ou autres données sensibles.

### Découverte critique : Clés SSH exposées

#### Recherche ciblée sur les fichiers sensibles

En utilisant GrayHatWarfare, j'ai filtré par type de fichier et cherché des **clés SSH**.

**Fichiers découverts :**
```
id_rsa          (Clé privée SSH)
id_rsa.pub      (Clé publique SSH)
```

**Date de découverte :** Août 2021

#### L'erreur humaine fatale

**Ma réflexion sur ce cas :** Un employé a probablement été sous **pression** ou **surchargé de travail** et a commis une erreur critique : uploader ses clés SSH sur un bucket public.

> Ce type d'erreur peut compromettre toute l'infrastructure de l'entreprise
{: .prompt-danger}

**Contenu de la clé privée découverte :**
```
-----BEGIN RSA PRIVATE KEY-----
[Contenu de la clé RSA]
-----END RSA PRIVATE KEY-----
```

#### Impact d'une clé SSH compromise

**Ce que cette découverte signifie pour moi en tant que pentester :**

1. **Accès direct sans mot de passe** à un ou plusieurs serveurs
2. **Authentification automatique** via la clé privée
3. **Aucune alerte** générée (connexion légitime avec clé valide)
4. **Persistance facile** si la clé n'est pas révoquée

**Ma commande pour utiliser cette clé :**
```bash
chmod 600 id_rsa
ssh -i id_rsa user@target-server.com
```

> Une seule clé SSH exposée = accès root potentiel à plusieurs machines
{: .prompt-danger}

### Techniques avancées : Recherche par abréviations

#### Comprendre la convention de nommage interne

**Ce que j'ai appris :** Les entreprises utilisent souvent des **abréviations** de leur nom pour nommer leurs ressources cloud.

**Exemples de patterns :**
- Nom complet : `inlanefreight`
- Abréviations possibles : `ilf`, `if`, `inlane`, `freight`
- Avec environnement : `ilf-prod`, `ilf-dev`, `ilf-backup`

**Ma stratégie de recherche :**

J'ai testé plusieurs combinaisons sur GrayHatWarfare :
```
ilf-backup
inlane-prod
freight-documents
ilf-private
```

**Résultat :** Cette approche m'a permis de découvrir des buckets supplémentaires non référencés dans les DNS !

### Méthodologie complète pour l'énumération cloud

#### Mon workflow de découverte cloud

1. **Résolution DNS** : Identifier les entrées cloud explicites
2. **Google Dorking** : 
   - AWS : `intext:[company] inurl:amazonaws.com`
   - Azure : `intext:[company] inurl:blob.core.windows.net`
   - GCP : `intext:[company] inurl:storage.googleapis.com`
3. **Code source web** : Chercher les préchargements DNS et CDN
4. **Domain.glass** : Vue d'ensemble de l'infrastructure
5. **GrayHatWarfare** : Énumération systématique avec filtres
6. **Variations de noms** : Tester les abréviations et environnements

#### Types de fichiers à prioriser

**Ma liste de fichiers critiques à rechercher :**

| Type de fichier | Intérêt | Extension |
|-----------------|---------|-----------|
| Clés SSH | Accès direct aux serveurs | `.pem`, `.key`, `id_rsa` |
| Credentials | Mots de passe, tokens API | `.env`, `.config`, `.conf` |
| Backups | Bases de données, code source | `.sql`, `.zip`, `.tar.gz`, `.bak` |
| Documents | Info confidentielle | `.pdf`, `.docx`, `.xlsx` |
| Code source | Secrets hardcodés | `.py`, `.js`, `.php` |

### Ce que je retiens sur le cloud en OSINT

#### Erreurs humaines courantes

**Patterns que j'ai identifiés :**

- Clés SSH uploadées par erreur (pression, fatigue)
- Permissions par défaut jamais modifiées (lazy configuration)
- Backups "temporaires" oubliés en public
- Variables d'environnement avec credentials exposés

> En OSINT cloud, la patience paie : tester toutes les variations de noms et tous les types de fichiers
{: .prompt-tip}

---

## Staff - Reconnaissance via les employés

### Pourquoi cibler les employés en OSINT ?

Les réseaux sociaux professionnels des employés sont une **mine d'or d'informations techniques**. En analysant leurs profils, je peux découvrir :

- Les technologies utilisées en interne
- Les langages de programmation privilégiés
- Les frameworks et outils déployés
- La structure des équipes IT
- Les projets en cours et les centres d'intérêt actuels

**Mon observation :** Les employés partagent naturellement ce qu'ils considèrent important ou valorisant pour leur carrière, ce qui me donne un aperçu direct de l'infrastructure technique.

> Les profils LinkedIn/Xing = documentation technique involontaire de l'entreprise
{: .prompt-tip}

### Analyse des offres d'emploi

### Décortiquer une offre pour comprendre la stack technique

**Ce que j'ai appris :** Les offres d'emploi sont des **descriptifs complets** de la stack technique utilisée. Les entreprises y listent explicitement ce qu'elles utilisent !

#### Exemple d'analyse d'une offre d'emploi

**Offre découverte sur LinkedIn :**

**Compétences requises :**
```
- 3-10+ ans d'expérience en développement logiciel professionnel
- Langages orientés objet : Java, C#, C++
- Langages de script : Python, Ruby, PHP, Perl
- Bases de données SQL : PostgreSQL, MySQL, SQL Server, Oracle
- Frameworks ORM : SQLAlchemy, Hibernate, Entity Framework
- Frameworks Web : Flask, Django, Spring, ASP.NET MVC
- Tests unitaires : pytest, JUnit, NUnit, xUnit
- Architecture SOA/microservices & API RESTful
- Processus Agile
- Intégration Continue (CI)
- Contrôle de version : Git, SVN, Mercurial, Perforce
```

**Compétences souhaitées :**
```
- Certification CompTIA Security+
- Suite Atlassian : Confluence, Jira, Bitbucket
- Développement d'algorithmes (traitement d'images)
- Sécurité logicielle
- Containerisation : Docker, Kubernetes
- Redis
- NumPy
```

#### Ma déduction technique complète

**Stack technologique identifiée :**

| Catégorie | Technologies confirmées |
|-----------|------------------------|
| **Backend** | Java, C#, C++, Python (Flask/Django), Ruby, PHP |
| **Bases de données** | PostgreSQL, MySQL, Oracle, SQL Server |
| **ORM** | SQLAlchemy (Python), Hibernate (Java), Entity Framework (.NET) |
| **Frontend/API** | REST APIs, microservices architecture |
| **DevOps** | Docker, Kubernetes, CI/CD pipelines |
| **Versioning** | Git, SVN, Perforce |
| **Collaboration** | Atlassian Suite (Jira, Confluence, Bitbucket) |
| **Cache** | Redis |

**Mon analyse stratégique :**

1. **Flask et Django** = frameworks Python web → chercher des vulnérabilités OWASP Top 10 spécifiques à Django
2. **Atlassian Suite** = possibles instances Jira/Confluence exposées → tester l'accès anonyme
3. **Docker/Kubernetes** = environnements conteneurisés → chercher des API Kubernetes exposées
4. **Git/Bitbucket** = dépôts de code → possibles leaks de credentials dans l'historique
5. **REST APIs** = surface d'attaque importante → tester IDOR, broken authentication, etc.

> Une seule offre d'emploi = blueprint complet de l'infrastructure technique
{: .prompt-info}

### Analyse des profils LinkedIn des employés

#### Employé #1 - Développeur Frontend

**Section "À propos" de son profil :**
```
Spécialisé en spécifications W3C, web components, React, Svelte, AngularJS
Projets open source disponibles sur GitHub
```

**Ce que j'en déduis :**

- **Stack frontend moderne** : React, Svelte, AngularJS
- **Web components** : utilisation de standards modernes
- **GitHub public** : possibilité de trouver du code de l'entreprise ou des patterns utilisés

**Ma démarche :** J'ai visité son GitHub pour analyser ses projets open source.

#### Découverte critique sur GitHub

**Fichier de configuration trouvé :**
```json
{
  "name": "project-name",
  "author": "employee-name",
  "email": "employee@personal-email.com",
  "repository": "https://github.com/username/project"
}
```

**Fonction sensible découverte :**
```python
def decode_jwt(payload, secret):
    jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[redacted]"
    # JWT token hardcodé dans le code !
```

**Mon analyse de cette découverte :**

1. **Email personnel exposé** : `employee@personal-email.com` → vecteur de phishing ou OSINT approfondi
2. **JWT token hardcodé** : erreur de sécurité **critique** → potentiel accès à l'application web
3. **Secret partagé** : si ce token est utilisé en production, je peux forger mes propres tokens

> Un seul dépôt GitHub mal nettoyé = credentials exposés et accès potentiel
{: .prompt-danger}

**Ma réflexion :** Cette erreur est typique : le développeur a testé en local, oublié de supprimer le token, et a push sur GitHub. Même s'il le supprime maintenant, **l'historique Git conserve tout**.

#### Employé #2 - Ingénieur logiciel senior

**Parcours professionnel LinkedIn :**
```
Poste actuel : Vice President Software Engineer
Poste précédent : Associate Software Engineer

Responsabilités :
- Direction du développement d'application mobile CRM
- Livraison du système BrokerVotes

Compétences :
- Java
- React
- Slang
- Elasticsearch
- Kafka
```

**Ma déduction technique :**

| Technologie | Usage probable |
|-------------|----------------|
| **Mobile CRM** | Application React Native ou hybride |
| **Java** | Backend microservices |
| **Elasticsearch** | Moteur de recherche et analytics |
| **Kafka** | Streaming de données temps réel |
| **React** | Frontend web moderne |

**Mon analyse stratégique :**

- **Elasticsearch** : souvent mal sécurisé → tester l'accès sans authentification sur les ports 9200/9300
- **Kafka** : chercher des brokers exposés publiquement
- **Mobile CRM** : APK à analyser pour reverse engineering et extraction de secrets

### Recherche avancée LinkedIn

#### Filtres disponibles pour cibler les profils

LinkedIn offre des filtres très puissants pour affiner ma recherche :

**Critères de recherche que j'utilise :**

- **Connexions** : 1er, 2ème, 3ème degré
- **Localisation** : Ville, région, pays
- **Entreprise actuelle** : Nom exact de la cible
- **École** : Pour identifier les juniors récemment diplômés
- **Secteur** : IT, Cybersécurité, DevOps
- **Services** : Développement web, Cloud, etc.
- **Titre du poste** : CTO, DevOps Engineer, Security Analyst, etc.

#### Ma stratégie de recherche ciblée

**Objectif :** Identifier l'infrastructure et les technologies utilisées.

**Profils à prioriser :**

1. **Développeurs techniques** : Stack complète dans leurs compétences
2. **Équipe sécurité** : Révèle les mesures défensives en place
3. **DevOps/SRE** : Infrastructure cloud, outils CI/CD
4. **Architectes** : Décisions techniques haut niveau

**Ma recherche LinkedIn type :**
```
Entreprise : "InlaneFreight"
Titre : "Security Engineer" OR "DevOps" OR "Software Developer"
Localisation : Berlin, Germany
```

**Ce que cette recherche me révèle :**

- **Équipe sécurité présente** → L'entreprise a des mesures de sécurité actives
- **DevOps nombreux** → Infrastructure cloud mature, probablement AWS/Azure
- **Développeurs variés** → Stack polyglotte, multiples surfaces d'attaque

### Exploitation des informations de sécurité

#### Comprendre les défenses en place

**Mon raisonnement :** En identifiant les employés de l'équipe sécurité, je peux déduire :

1. **Taille de l'équipe** → Maturité sécurité (1-2 personnes vs. 10+ personnes)
2. **Spécialités** → SOC analyst, Pentest interne, AppSec, Cloud Security
3. **Certifications** → OSCP, CEH, CISSP → niveau de compétence défensive
4. **Outils mentionnés** → SIEM utilisé, EDR déployé, WAF en place

**Exemple de déduction :**

Si je trouve un "SOC Analyst" avec compétence en **Splunk**, je sais que :
- L'entreprise a un **SIEM actif**
- Mes activités seront **potentiellement loggées**
- Je dois être **plus discret** lors des tests actifs

> L'équipe sécurité sur LinkedIn = carte des défenses à contourner
{: .prompt-warning}

### Recherche de mauvaises configurations Django

#### Suivre les trails technologiques

**Ma démarche après avoir identifié Django :**

1. J'ai cherché "Django security misconfiguration" sur Google
2. J'ai trouvé le dépôt **OWASP Top 10 for Django** sur GitHub
3. J'ai étudié les best practices... et leurs **anti-patterns**

**Pourquoi c'est utile ?**

- Les best practices révèlent ce qu'il **ne faut PAS faire**
- Beaucoup d'entreprises **copient aveuglément** les exemples
- Les noms de fichiers et structures sont souvent **identiques** aux tutoriels

**Exemples de vulnérabilités Django à chercher :**

| Vulnérabilité | Fichier/Config à cibler |
|---------------|------------------------|
| **Debug mode activé** | `settings.py` avec `DEBUG=True` |
| **SECRET_KEY exposée** | Fichiers de config commités sur Git |
| **SQL Injection** | ORM mal utilisé avec `raw()` |
| **XSS** | Templates sans `|safe` filter |
| **CSRF désactivé** | Middleware CSRF commenté |

**Mon approche :**

Je cherche les dépôts GitHub publics des employés qui contiennent :
```bash
filename:settings.py SECRET_KEY
filename:settings.py DEBUG=True
```

> Les best practices révèlent aussi les worst practices à exploiter
{: .prompt-tip}

### Le double tranchant du partage public

#### Avantages professionnels vs. risques de sécurité

**Ce que j'ai compris :**

Partager ses projets publiquement sur GitHub ou LinkedIn présente des avantages :
- **Networking** professionnel
- **Preuve de compétences** pour recruteurs
- **Contribution** à l'open source

Mais aussi des **risques critiques** :

1. **Exposition d'emails personnels** → phishing, OSINT avancé
2. **Credentials hardcodés** → accès directs aux systèmes
3. **Architecture révélée** → blueprint pour l'attaquant
4. **Erreurs difficiles à corriger** → l'historique Git ne s'efface pas facilement

**Mon observation éthique :** En tant que pentester, je dois signaler ces expositions dans mon rapport, même si elles facilitent mon travail.

### Ce que je retiens sur la reconnaissance des employés

#### Méthodologie complète

**Mon workflow OSINT staff :**

1. **Identifier l'entreprise** sur LinkedIn/Xing
2. **Analyser les offres d'emploi** → stack technique complète
3. **Lister les employés techniques** → développeurs, DevOps, sécurité
4. **Visiter leurs GitHub** → chercher du code d'entreprise ou patterns
5. **Analyser les compétences listées** → technologies confirmées
6. **Identifier l'équipe sécurité** → comprendre les défenses
7. **Chercher les erreurs** → credentials, emails, tokens exposés

#### Informations critiques obtenues

**Ce que cette reconnaissance m'a apporté :**

- **Stack technique complète** : langages, frameworks, bases de données
- **Infrastructure cloud** : AWS/Azure/GCP, Docker/Kubernetes
- **Outils de sécurité** : WAF, SIEM, EDR identifiés
- **Surface d'attaque** : APIs REST, Elasticsearch, Kafka
- **Credentials exposés** : JWT tokens, secrets API
- **Emails personnels** : vecteurs de phishing

#### Leçons sur les erreurs humaines

**Patterns d'erreurs que j'ai identifiés :**

1. **Partage de code privé** sur GitHub public par erreur
2. **Tokens hardcodés** oubliés dans les commits
3. **Emails personnels** dans les métadonnées de fichiers
4. **Secrets dans l'historique Git** même après suppression
5. **Copie aveugle** de tutoriels avec configurations dangereuses

> Les employés sont la source d'information la plus riche et la plus involontaire
{: .prompt-info}

**Cours complété**

{% include comments.html %}