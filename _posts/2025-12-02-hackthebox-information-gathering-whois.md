---
title: "HackTheBox - Information Gathering - WHOIS"
date: 2025-12-02 13:22:00 +0200
categories: [HackTheBox, Learning]
tags: [reconnaissance, whois, passive-recon, domain-registration, osint, information-gathering]
description: "Découverte du protocole WHOIS : comment interroger les bases de données de domaines pour révéler des informations critiques sur une cible lors de la phase de reconnaissance."
image:
  path: /assets/img/posts/information-gathering.png
  alt: "WHOIS Reconnaissance"
---

## Informations sur le module

Cette section couvre le protocole WHOIS, un outil fondamental de reconnaissance passive qui permet d'accéder aux informations d'enregistrement des domaines Internet. C'est la première technique concrète que j'apprends dans ce module de Web Reconnaissance.

**Lien :** [WHOIS](https://academy.hackthebox.com/beta/module/144/section/3073)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre le protocole WHOIS et son utilité
- Interpréter les enregistrements WHOIS pour extraire des informations critiques
- Utiliser WHOIS pour identifier des personnes clés et l'infrastructure réseau
- Analyser les données historiques pour tracer l'évolution d'une cible

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## WHOIS : Qu'est-ce que c'est ?

### Ma première découverte du protocole

Quand j'ai utilisé WHOIS pour la première fois, j'ai été surpris par la **quantité d'informations publiques** disponibles sur un simple domaine !

> **Pour les débutants** : WHOIS, c'est comme l'annuaire téléphonique d'Internet. Vous donnez un nom de domaine (exemple.com), et vous obtenez des infos sur qui le possède, quand il a été créé, quand il expire, etc.
{: .prompt-info}

Le protocole WHOIS permet d'interroger des **bases de données** qui stockent des informations sur :

- Les noms de domaine (exemple.com, google.fr, etc.)
- Les blocs d'adresses IP
- Les systèmes autonomes (AS)

### Mon premier test WHOIS

J'ai testé cette commande sur un domaine d'exemple :
```bash
whois inlanefreight.com
```

**Résultat :**
```
Domain Name: inlanefreight.com
Registry Domain ID: 2420436757_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.registrar.amazon
Registrar URL: https://registrar.amazon.com
Updated Date: 2023-07-03T01:11:15Z
Creation Date: 2019-08-05T22:43:09Z
[...]
```

**Mon observation :** En une seule commande, j'ai obtenu des infos cruciales : le registrar (Amazon), les dates de création et mise à jour, et bien plus encore !

### Les informations contenues dans un enregistrement WHOIS

Chaque enregistrement WHOIS contient typiquement ces éléments :

| Champ | Description | Utilité en recon |
|-------|-------------|------------------|
| **Domain Name** | Le nom de domaine lui-même | Confirmer la cible |
| **Registrar** | L'entreprise où le domaine a été enregistré | Identifier les pratiques de l'organisation |
| **Registrant Contact** | La personne ou organisation propriétaire | Cible potentielle pour social engineering |
| **Administrative Contact** | Le responsable de la gestion du domaine | Contact clé dans l'organisation |
| **Technical Contact** | Le responsable technique | Souvent l'admin système |
| **Creation Date** | Date d'enregistrement du domaine | Âge du domaine, légitimité |
| **Expiration Date** | Date d'expiration | Fenêtre d'opportunité si oubli de renouvellement |
| **Name Servers** | Serveurs qui traduisent le domaine en IP | Infrastructure DNS, prestataires |

> Les **Name Servers** sont particulièrement intéressants : ils révèlent souvent l'hébergeur ou le fournisseur DNS utilisé par la cible.
{: .prompt-tip}

### Un peu d'histoire : Elizabeth Feinler

#### Ce qui m'a fasciné : les origines du WHOIS

J'ai découvert que WHOIS existe depuis les **années 1970** ! C'est Elizabeth Feinler, une pionnière de l'informatique, qui l'a créé.

> **Pour les débutants** : Dans les années 70, Internet s'appelait ARPANET et commençait tout juste à grandir. Elizabeth Feinler et son équipe ont compris qu'il fallait un moyen de suivre qui possédait quoi sur le réseau.
{: .prompt-info}

**Mon observation :** Le WHOIS était à l'origine une base de données rudimentaire pour suivre les utilisateurs réseau, les noms d'hôtes et les domaines sur l'ARPANET (l'ancêtre d'Internet). C'est fascinant de voir qu'on utilise encore ce protocole aujourd'hui, plus de 50 ans après !

Pour en savoir plus sur l'histoire d'Internet et d'ARPANET : [RFC 3912 - WHOIS Protocol Specification](https://www.rfc-editor.org/rfc/rfc3912)

### Pourquoi WHOIS est crucial en reconnaissance web

#### Identifier des personnes clés

**Ce qui m'a surpris** : Les enregistrements WHOIS révèlent souvent des **noms, emails et numéros de téléphone** des responsables du domaine !

> Ces informations sont une **mine d'or** pour le social engineering. Un attaquant pourrait cibler ces personnes avec des emails de phishing personnalisés ou des appels téléphoniques malveillants.
{: .prompt-danger}

**Mon observation personnelle :** En pentest éthique, ces infos permettent d'identifier les bonnes personnes à contacter pour obtenir des autorisations ou signaler des vulnérabilités.

#### Découvrir l'infrastructure réseau

Les détails techniques comme les **name servers** et **adresses IP** donnent des indices sur :

- L'hébergeur utilisé
- Le fournisseur DNS
- Les configurations potentielles
- Les points d'entrée possibles

**Exemple concret :** Si je vois que les name servers pointent vers `ns1.cloudflare.com`, je sais que la cible utilise Cloudflare. Cela m'indique qu'il y a probablement un WAF (Web Application Firewall) devant le site.

#### Analyser les données historiques

Un point que j'ai trouvé particulièrement intéressant : on peut consulter les **enregistrements WHOIS historiques** via des services comme WhoisFreaks.

> **Pour les débutants** : C'est comme avoir accès aux anciennes versions de "l'annuaire". On peut voir comment l'enregistrement du domaine a évolué dans le temps.
{: .prompt-info}

**Pourquoi c'est utile :**

1. **Changements de propriétaire** : Rachats d'entreprises, acquisitions
2. **Évolution des contacts** : Turnover du personnel IT
3. **Modifications techniques** : Changements d'hébergeur ou de prestataire DNS
4. **Patterns temporels** : Quand l'organisation fait des changements majeurs

**Mon observation :** Ces changements historiques peuvent révéler des périodes de transition où la sécurité était peut-être moins rigoureuse, ou identifier d'anciens employés qui pourraient avoir conservé des accès.

> En pentest, commencer par WHOIS permet de construire une **carte d'identité numérique** de la cible avant d'aller plus loin.
{: .prompt-tip}

Documentation utile :
- [RFC 3912 - WHOIS Protocol Specification](https://www.rfc-editor.org/rfc/rfc3912)
- [ICANN WHOIS Lookup](https://lookup.icann.org/)

---

## Utiliser WHOIS en pratique

### Trois scénarios réels qui m'ont ouvert les yeux

Quand j'ai étudié ces cas d'usage, j'ai réalisé que WHOIS n'est pas juste un outil théorique. C'est une **arme d'investigation** utilisée quotidiennement par les analystes en sécurité.

### Scénario 1 : Investigation de phishing

**Le contexte :** Un email suspect arrive dans une entreprise, prétendant venir de leur banque et demandant de cliquer sur un lien pour "mettre à jour leur compte".

> **Pour les débutants** : Le phishing, c'est quand des attaquants se font passer pour une entité légitime (banque, entreprise) pour voler vos identifiants ou informations personnelles.
{: .prompt-info}

L'analyste fait un WHOIS lookup sur le domaine du lien et découvre :

1. **Date d'enregistrement** : Le domaine a été créé il y a **quelques jours seulement**
2. **Registrant** : Les informations sont **cachées derrière un service de confidentialité**
3. **Name Servers** : Associés à un hébergeur "bulletproof" connu pour activités malveillantes

**Mon observation :** Ces trois indicateurs ensemble sont des **red flags énormes** ! Un domaine légitime de banque existe depuis des années, pas quelques jours.

> Un hébergeur "bulletproof" est un prestataire qui ignore volontairement les plaintes d'abus et héberge des contenus malveillants. C'est un indicateur majeur d'activité criminelle.
{: .prompt-danger}

**Résultat :** L'analyste bloque immédiatement le domaine et alerte les employés. En creusant l'infrastructure de l'hébergeur, il peut même découvrir d'autres domaines de phishing du même attaquant.

### Scénario 2 : Analyse de malware

**Le contexte :** Un chercheur analyse un malware qui communique avec un serveur de commande et contrôle (C2) pour recevoir des ordres et exfiltrer des données volées.

> **Pour les débutants** : Un serveur C2 (Command & Control), c'est le "quartier général" de l'attaquant. Le malware se connecte à ce serveur pour recevoir ses instructions.
{: .prompt-info}

Le WHOIS lookup sur le domaine C2 révèle :

1. **Registrant** : Enregistré par un individu utilisant un **email anonyme gratuit**
2. **Localisation** : Adresse dans un pays à **forte prévalence de cybercriminalité**
3. **Registrar** : Registrar connu pour ses **politiques laxistes** sur les abus

**Mon observation :** Ces éléments pointent vers un serveur C2 hébergé sur une infrastructure compromise ou "bulletproof". Le chercheur peut alors notifier l'hébergeur pour faire tomber le serveur.

> Identifier rapidement un serveur C2 permet de **couper la communication** entre le malware et l'attaquant, limitant ainsi les dégâts.
{: .prompt-tip}

### Scénario 3 : Rapport de Threat Intelligence

**Le contexte :** Une entreprise de cybersécurité traque un groupe APT (Advanced Persistent Threat) qui cible les institutions financières.

Les analystes collectent les données WHOIS de **plusieurs domaines** utilisés par le groupe et découvrent des patterns :

1. **Dates d'enregistrement** : Les domaines sont enregistrés en **clusters**, juste avant les attaques majeures
2. **Registrants** : Utilisation de **multiples alias et fausses identités**
3. **Name Servers** : Les domaines partagent souvent les **mêmes name servers** (infrastructure commune)
4. **Historique de takedown** : Beaucoup ont été supprimés après des attaques (interventions judiciaires)

**Mon observation :** En analysant ces patterns, les analystes peuvent créer un **profil des TTP** (Tactics, Techniques, and Procedures) du groupe. Ces indicateurs de compromission (IOCs) peuvent ensuite être partagés avec d'autres organisations pour détecter et bloquer de futures attaques.

> L'analyse de multiples enregistrements WHOIS permet d'identifier des **signatures comportementales** uniques à un groupe d'attaquants.
{: .prompt-tip}

### Installation et utilisation de WHOIS

#### Installer l'outil sur Linux

Avant ma première utilisation, j'ai dû installer l'outil :
```bash
sudo apt update
sudo apt install whois -y
```

> Sur la plupart des distributions Linux modernes, `whois` n'est pas installé par défaut. C'est une installation rapide via le gestionnaire de paquets.
{: .prompt-info}

#### Mon premier lookup complet : facebook.com

J'ai testé la commande sur facebook.com pour voir un exemple de domaine bien établi :
```bash
whois facebook.com
```

**Résultat (extrait) :**
```
Domain Name: FACEBOOK.COM
Registry Domain ID: 2320948_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.registrarsafe.com
Registrar URL: http://www.registrarsafe.com
Updated Date: 2024-04-24T19:06:12Z
Creation Date: 1997-03-29T05:00:00Z
Registry Expiry Date: 2033-03-30T04:00:00Z
Registrar: RegistrarSafe, LLC
Registrar IANA ID: 3237
Domain Status: clientDeleteProhibited
Domain Status: clientTransferProhibited
Domain Status: clientUpdateProhibited
Domain Status: serverDeleteProhibited
Domain Status: serverTransferProhibited
Domain Status: serverUpdateProhibited
Name Server: A.NS.FACEBOOK.COM
Name Server: B.NS.FACEBOOK.COM
Name Server: C.NS.FACEBOOK.COM
Name Server: D.NS.FACEBOOK.COM
[...]
Registrant Organization: Meta Platforms, Inc.
```

### Analyse détaillée de ce que j'ai découvert

#### 1. Informations d'enregistrement

**Ce que j'ai vu :**
- **Registrar** : RegistrarSafe, LLC
- **Date de création** : 1997-03-29 (il y a plus de 25 ans !)
- **Date d'expiration** : 2033-03-30 (encore 9 ans)

**Mon observation :** Un domaine enregistré depuis 1997 et renouvelé jusqu'en 2033, c'est le signe d'une **organisation légitime et bien établie**. Comparez ça aux domaines de phishing enregistrés quelques jours avant une attaque !

#### 2. Propriétaire du domaine

**Ce que j'ai vu :**
- **Organisation** : Meta Platforms, Inc.
- **Contact** : Domain Admin

**Mon observation :** Cela confirme que facebook.com appartient bien à Meta (anciennement Facebook Inc.). Le contact "Domain Admin" est générique, ce qui est normal pour les grandes entreprises qui veulent éviter de publier des infos personnelles.

#### 3. Statuts de protection du domaine

**Ce que j'ai remarqué :** Le domaine a **six statuts de protection** actifs :

| Statut | Signification |
|--------|---------------|
| `clientDeleteProhibited` | Le registrar ne peut pas supprimer le domaine |
| `clientTransferProhibited` | Le domaine ne peut pas être transféré vers un autre registrar |
| `clientUpdateProhibited` | Les infos du domaine ne peuvent pas être modifiées |
| `serverDeleteProhibited` | Le registre ne peut pas supprimer le domaine |
| `serverTransferProhibited` | Protection supplémentaire contre les transferts |
| `serverUpdateProhibited` | Protection supplémentaire contre les modifications |

> Ces protections empêchent les **hijackings de domaine** (piratage et vol de domaine). C'est crucial pour un site comme Facebook utilisé par des milliards de personnes !
{: .prompt-tip}

**Mon observation :** Ces statuts montrent que Meta prend **très au sérieux** la sécurité de son domaine. Un attaquant ne pourrait pas facilement voler ou modifier ce domaine.

#### 4. Name Servers

**Ce que j'ai vu :**
```
A.NS.FACEBOOK.COM
B.NS.FACEBOOK.COM
C.NS.FACEBOOK.COM
D.NS.FACEBOOK.COM
```

**Mon observation :** Tous les name servers sont **dans le domaine facebook.com lui-même**. Cela signifie que Meta gère sa propre infrastructure DNS au lieu d'utiliser un service tiers comme Cloudflare ou AWS Route53.

> Les grandes organisations préfèrent gérer leur propre DNS pour avoir un **contrôle total** et une **meilleure fiabilité**. C'est un signe de maturité technique.
{: .prompt-info}

### Ce que cette analyse m'a appris

L'enregistrement WHOIS de facebook.com correspond exactement à ce qu'on attend d'un **domaine légitime d'une grande organisation** :

- ✅ Enregistré depuis longtemps
- ✅ Propriété claire et vérifiable
- ✅ Protections maximales activées
- ✅ Infrastructure DNS maîtrisée

**MAIS** (et c'est important) : Le WHOIS seul ne me donne pas d'infos sur :
- Les employés individuels
- Les vulnérabilités techniques spécifiques
- L'architecture interne du réseau

> WHOIS est puissant, mais doit être **combiné avec d'autres techniques de reconnaissance** pour avoir une vue complète de la cible.
{: .prompt-warning}

### Ma stratégie personnelle avec WHOIS

Quand j'analyse un domaine maintenant, je cherche ces **indicateurs clés** :

**Red flags (suspect) :**
- Domaine enregistré récemment (< 30 jours)
- Informations du registrant cachées
- Hébergeur "bulletproof" connu
- Registrar avec réputation douteuse
- Date d'expiration proche

**Indicateurs de légitimité :**
- Domaine ancien (plusieurs années)
- Organisation clairement identifiée
- Protections de domaine activées
- Infrastructure DNS cohérente
- Historique stable

> En pentest, WHOIS est toujours ma **première étape** : rapide, passif, légal, et riche en informations exploitables.
{: .prompt-tip}

Documentation utile :
- [ICANN WHOIS Data Reminder Policy](https://www.icann.org/resources/pages/rdds-labeling-policy-2017-02-01-en)
- [Domain Status Codes Explained](https://www.icann.org/resources/pages/epp-status-codes-2014-06-16-en)

---

### Questions

**Perform a WHOIS lookup against the paypal.com domain. What is the registrar Internet Assigned Numbers Authority (IANA) ID number?**

Nous allons faire la commande `whois` :

```bash
└──╼ [★]$ whois paypal.com | grep IANA
   Registrar IANA ID: 292
Registrar IANA ID: 292
```

**Réponse :** `292`

**What is the admin email contact for the tesla.com domain (also in-scope for the Tesla bug bounty program)?**

```bash
└──╼ [★]$ whois tesla.com | grep @
   Registrar Abuse Contact Email: abusecomplaints@markmonitor.com
Registrar Abuse Contact Email: abusecomplaints@markmonitor.com
Registrant Email: admin@dnstinations.com
Tech Email: admin@dnstinations.com
your request and the reasons for your request to whoisrequest@markmonitor.com
```

**Réponse :** `admin@dnstinations.com`

**Cours complété**

{% include comments.html %}