---
title: "HackTheBox - Pre-Engagement"
date: 2025-11-02 17:17:00 +0200
categories: [HackTheBox, Learning]
tags: [learning]
description: "Write-up du module Pre-Engagement"
image:
  path: /assets/img/posts/hackthebox-penetration-testing.png
  alt: "pre-engagement"
---

## Informations sur la room

Découvrez le cours HTB sur Pre-engagement

**Lien :** [Background & preparation](https://academy.hackthebox.com/beta/module/90/section/937)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Comprendre les notions de pré engagements dans la cybersécurité

---

## Pre-Engagement

La phase de pré-engagement **prépare le terrain** pour le test d'intrusion proprement dit. Durant cette phase, de nombreuses questions sont posées et des accords contractuels sont établis. Le client nous informe des éléments à tester et nous lui expliquons en détail comment optimiser le test.

![pre-engagement](https://academy.hackthebox.com/storage/modules/90/0-PT-Process-PRE.png)

L'ensemble du processus de pré-engagement comprend trois composantes essentielles :

- Questionnaire de cadrage
- Réunion de pré-engagement
- Réunion de lancement

Avant d'aborder ces points en détail, un `accord de confidentialité (NDA) doit être signé par toutes les parties`. Il existe plusieurs types d'accords de confidentialité :

| Type | Description |
|------|-------------|
| **Unilateral NDA** | Ce type de NDA oblige une seule partie à maintenir la confidentialité et permet à l'autre partie de partager les informations reçues avec des tiers. |
| **Bilateral NDA** | Dans ce type, les deux parties sont obligées de garder confidentielles les informations résultantes et acquises. C'est le type de NDA le plus courant qui protège le travail des testeurs d'intrusion. |
| **Multilateral NDA** | Le NDA multilatéral est un engagement de confidentialité par plus de deux parties. Si nous effectuons un test d'intrusion pour un réseau coopératif, toutes les parties responsables et impliquées doivent signer ce document. |

Des exceptions peuvent être faites en cas d'urgence, auquel cas nous organisons une réunion de lancement, qui peut également se tenir par visioconférence. `Il est essentiel de savoir qui, au sein de l'entreprise, est autorisé à nous solliciter pour un test d'intrusion.` En effet, nous ne pouvons accepter une telle demande de n'importe qui. Imaginez, par exemple, qu'un employé nous engage sous prétexte de vérifier la sécurité du réseau de l'entreprise. Or, une fois l'évaluation terminée, il s'avère que cet employé souhaitait nuire à sa propre entreprise et n'était pas autorisé à faire réaliser un test. Cela nous placerait dans une situation juridique délicate.

Vous trouverez ci-dessous une liste non exhaustive des membres de l'entreprise susceptibles d'être autorisés à nous solliciter pour un test d'intrusion. Cette liste peut varier d'une entreprise à l'autre; dans les grandes organisations, cette responsabilité n'incombe généralement pas à la direction générale, mais plutôt à la direction informatique, à l'audit ou à la sécurité informatique.

- Chief Executive Officer (CEO)	
- Chief Technical Officer (CTO)	
- Chief Information Security Officer (CISO)
- Chief Security Officer (CSO)	
- Chief Risk Officer (CRO)	
- Chief Information Officer (CIO)
- VP of Internal Audit	
- Audit Manager	
- VP or Director of IT/Information Security

Il est essentiel de déterminer dès le début du processus qui est habilité à signer le contrat et les documents relatifs aux règles d'engagement, ainsi que les principaux et secondaires interlocuteurs, le support technique et les personnes à contacter en cas de problème.

Cette étape requiert également la préparation de plusieurs documents préalables au test d'intrusion. Ces documents doivent être signés par notre client et par nous-mêmes afin de pouvoir présenter une déclaration de consentement écrite si nécessaire. À défaut, le test d'intrusion pourrait enfreindre la loi relative à la cybercriminalité. Ces documents comprennent, entre autres :

| Document | Moment de création |
|----------|-------------------|
| **1. Non-Disclosure Agreement** (`NDA`) | `Après` le contact initial |
| **2. Scoping Questionnaire** | `Avant` la réunion de pré-engagement |
| **3. Scoping Document** | `Pendant` la réunion de pré-engagement |
| **4. Penetration Testing Proposal** (`Contract/Scope of Work` (`SoW`)) | `Pendant` la réunion de pré-engagement |
| **5. Rules of Engagement** (`RoE`) | `Avant` la réunion de lancement (Kick-Off Meeting) |
| **6. Contractors Agreement** (Physical Assessments) | `Avant` la réunion de lancement (Kick-Off Meeting) |
| **7. Reports** | `Pendant` et `après` le test d'intrusion effectué |

> Notre client peut fournir un document de cadrage distinct listant les adresses IP, plages d’adresses IP et URL concernées, ainsi que toutes les informations d’identification nécessaires. Ces informations doivent également figurer en annexe du document RoE.

> Ces documents doivent être examinés et adaptés par un avocat après leur élaboration.
{: .prompt-info}

### Scoping Questionnaire

Après un premier contact avec le client, nous lui envoyons généralement un questionnaire de cadrage afin de mieux comprendre ses besoins. Ce questionnaire présente clairement nos services et peut lui demander de choisir un ou plusieurs éléments parmi la liste suivante :

- Internal Vulnerability Assessment	
- External Vulnerability Assessment
- Internal Penetration Test
- External Penetration Test
- Wireless Security Assessment
- Application Security Assessment
- Physical Security Assessment
- Social Engineering Assessment
- Red Team Assessment
- Web Application Security Assessment

Pour chacune de ces catégories, le questionnaire doit permettre au client de préciser l'évaluation requise. A-t-il besoin d'une évaluation d'application web ou mobile ? D'un audit de sécurité du code ? Le test d'intrusion interne doit-il être de type « boîte noire » et semi-évasif ? Souhaite-t-il uniquement une évaluation de phishing dans le cadre d'une évaluation d'ingénierie sociale, ou également une évaluation des appels vishing ? C'est l'occasion pour nous d'expliquer l'étendue de nos services, de nous assurer de bien comprendre les besoins et les attentes de notre client, et de garantir que nous sommes en mesure de réaliser l'évaluation adéquate.

Outre le type d'évaluation, le nom du client, son adresse et les coordonnées de son principal interlocuteur, voici d'autres informations essentielles :

- Combien d'hôtes actifs sont prévus ?

- Combien d'adresses IP/plages CIDR sont concernées ?

- Combien de domaines/sous-domaines sont concernés ?

- Combien de SSID Wi-Fi sont concernés ?
- Combien d'applications web/mobiles sont concernées ? Si les tests nécessitent une authentification, combien de rôles (utilisateur standard, administrateur, etc.) sont concernés ?

- Pour une évaluation de phishing, combien d'utilisateurs seront ciblés ? Le client fournira-t-il une liste ou devrons-nous la recueillir par OSINT ?

- Si le client demande une évaluation physique, combien de sites sont concernés ? Si plusieurs sites sont concernés, sont-ils géographiquement dispersés ?
 
- Quel est l'objectif de l'évaluation Red Team ? Certaines activités (comme le phishing ou les attaques physiques) sont-elles exclues du périmètre ?
 
- Une évaluation de sécurité Active Directory distincte est-elle souhaitée ?
 
- Les tests réseau seront-ils effectués depuis un compte utilisateur anonyme ou un compte utilisateur standard du domaine ?
 
- Devons-nous contourner le contrôle d'accès réseau (NAC) ?

Enfin, nous souhaiterons vous interroger sur la divulgation d'informations et le niveau d'évasion (le cas échéant) :

Le test d'intrusion est-il de type boîte noire (aucune information fournie), boîte grise (seules les adresses IP/plages CIDR/URL sont fournies) ou boîte blanche (informations détaillées fournies) ?

Souhaitez-vous que nous procédions au test de manière non évasive, hybride (en commençant discrètement et en augmentant progressivement le niveau d'intrusion pour évaluer la capacité de votre équipe de sécurité à détecter nos activités) ou totalement évasive ?

Ces informations nous permettront d'affecter les ressources adéquates et de réaliser la prestation conformément à vos attentes. Elles sont également indispensables pour établir une proposition précise, incluant un calendrier (par exemple, une évaluation de vulnérabilité sera nettement plus rapide qu'une évaluation Red Team) et un coût (un test d'intrusion externe ciblant 10 adresses IP coûtera beaucoup moins cher qu'un test d'intrusion interne couvrant 30 réseaux sur 24).

Sur la base des informations recueillies grâce au questionnaire de cadrage, nous créons un aperçu et résumons toutes les informations dans le `document de cadrage`.

### Pre-Engagement Meeting

Une fois que nous avons une première idée des besoins du client concernant son projet, nous pouvons passer à la `réunion de pré-engagement`. Cette réunion permet d'aborder avec le client tous les éléments pertinents et essentiels avant le test d'intrusion, en les lui expliquant en détail. Les informations recueillies lors de cette phase, ainsi que les données issues du questionnaire de cadrage, serviront à l'élaboration de la proposition de test d'intrusion, également appelée contrat ou cahier des charges. On peut comparer ce processus à une consultation médicale pour s'informer sur les examens prévus. Cette phase se déroule généralement par e-mail et lors d'une visioconférence ou d'une réunion en présentiel.

> Il arrive que, dans le cadre de notre carrière, nous rencontrions des clients qui réalisent leur tout premier test d'intrusion, ou que leur interlocuteur direct ne soit pas familiarisé avec le processus. Il est fréquent de consacrer une partie de la réunion de pré-engagement à examiner le questionnaire de cadrage, soit partiellement, soit étape par étape.

#### Contract - Checklist

| Checkpoint | Description |
|------------|-------------|
| **NDA** | Le Non-Disclosure Agreement (NDA) fait référence à un contrat de confidentialité entre le client et le prestataire concernant toutes les informations écrites ou verbales relatives à une commande/un projet. Le prestataire s'engage à traiter toutes les informations confidentielles portées à sa connaissance comme strictement confidentielles, même après l'achèvement de la commande/du projet. De plus, toute exception à la confidentialité, la transférabilité des droits et obligations, et les pénalités contractuelles doivent être stipulées dans l'accord. Le NDA doit être signé avant la réunion de lancement ou au plus tard pendant la réunion avant que toute information ne soit discutée en détail. |
| **Goals** | Les objectifs sont des jalons qui doivent être atteints pendant la commande/le projet. Dans ce processus, la définition des objectifs commence par les objectifs importants et se poursuit avec des objectifs plus fins et plus petits. |
| **Scope** | Les composants individuels à tester sont discutés et définis. Ceux-ci peuvent inclure des domaines, des plages d'IP, des hôtes individuels, des comptes spécifiques, des systèmes de sécurité, etc. Nos clients peuvent s'attendre à ce que nous découvrions tel ou tel point par nous-mêmes. Cependant, la base juridique pour tester les composants individuels a la plus haute priorité ici. |
| **Penetration Testing Type** | Lors du choix du type de test d'intrusion, nous présentons les différentes options et expliquons les avantages et les inconvénients. Puisque nous connaissons déjà les objectifs et le périmètre de nos clients, nous pouvons et devons également faire une recommandation sur ce que nous conseillons et justifier notre recommandation en conséquence. Le type utilisé au final est la décision du client. |
| **Methodologies** | Exemples : OSSTMM, OWASP, analyse automatisée et manuelle non authentifiée des composants réseau internes et externes, évaluations de vulnérabilité des composants réseau et des applications web, vectorisation des menaces de vulnérabilité, vérification et exploitation, et développement d'exploits pour faciliter les techniques d'évasion. |
| **Penetration Testing Locations** | Externe : à distance (via VPN sécurisé) et/ou Interne : sur site ou à distance (via VPN sécurisé) |
| **Time Estimation** | Pour l'estimation du temps, nous avons besoin des dates de début et de fin du test d'intrusion. Cela fournit une fenêtre temporelle précise pour effectuer le test et nous aide à planifier notre procédure. Il est également vital de déterminer explicitement la durée des fenêtres temporelles pour chaque phase de l'attaque, telles que l'Exploitation, la Post-Exploitation et le Lateral Movement. Celles-ci peuvent être effectuées pendant ou en dehors des heures de travail régulières. Lors des tests en dehors des heures de travail régulières, l'accent est davantage mis sur les solutions et systèmes de sécurité qui doivent résister à nos attaques. |
| **Third Parties** | Pour les tiers, il faut déterminer via quels fournisseurs tiers notre client obtient des services. Il peut s'agir de fournisseurs cloud, de FAI et d'autres fournisseurs d'hébergement. Notre client doit obtenir le consentement écrit de ces fournisseurs décrivant qu'ils acceptent et sont conscients que certaines parties de leur service feront l'objet d'une attaque de piratage simulée. Il est également fortement conseillé d'exiger que le prestataire transmette l'autorisation du tiers qui nous est envoyée afin que nous ayons une confirmation réelle que cette autorisation a bien été obtenue. |
| **Evasive Testing** | Le test d'évasion consiste à tester le contournement et le passage du trafic de sécurité et des systèmes de sécurité dans l'infrastructure du client. Nous recherchons des techniques qui nous permettent de découvrir des informations sur les composants internes et de les attaquer. Cela dépend si notre client souhaite ou non que nous utilisions de telles techniques. |
| **Risks** | Nous devons également informer notre client des risques impliqués dans les tests et des conséquences possibles. Sur la base des risques et de leur gravité potentielle, nous pouvons ensuite définir ensemble les limitations et prendre certaines précautions. |
| **Scope Limitations & Restrictions** | Il est également essentiel de déterminer quels serveurs, postes de travail ou autres composants réseau sont essentiels au bon fonctionnement du client et de ses clients. Nous devrons les éviter et ne devons pas les influencer davantage, car cela pourrait conduire à des erreurs techniques critiques qui pourraient également affecter les clients de notre client en production. |
| **Information Handling** | HIPAA, PCI, HITRUST, FISMA/NIST, etc. |
| **Contact Information** | Pour les informations de contact, nous devons créer une liste avec le nom de chaque personne, son titre, son poste, son adresse e-mail, son numéro de téléphone, son numéro de téléphone de bureau et un ordre de priorité d'escalade. |
| **Lines of Communication** | Il doit également être documenté quels canaux de communication sont utilisés pour échanger des informations entre le client et nous. Cela peut impliquer une correspondance par e-mail, des appels téléphoniques ou des réunions en personne. |
| **Reporting** | Outre la structure du rapport, toutes les exigences spécifiques au client que le rapport devrait contenir sont également discutées. De plus, nous clarifions comment le reporting doit avoir lieu et si une présentation des résultats est souhaitée. |
| **Payment Terms** | Enfin, les prix et les conditions de paiement sont expliqués. |

L'élément crucial de cette réunion est la présentation détaillée du test d'intrusion à notre client et de ses objectifs. Comme nous le savons déjà, chaque infrastructure est généralement unique et chaque client a des préférences particulières auxquelles il accorde une importance particulière. Identifier ces priorités est essentiel lors de cette réunion.

On peut comparer cela à une commande au restaurant. Si nous demandons un steak saignant et que le chef nous sert un steak bien cuit parce qu'il pense que c'est meilleur, nous serons déçus. Par conséquent, nous devons privilégier les souhaits de notre client et lui servir le steak comme il l'a commandé.

À partir de la `check liste` du contrat et des informations fournies lors de la définition du périmètre, la proposition de test d'intrusion (`contrat`) et les `règles d'engagement` associées sont élaborées.

#### Rules of Engagement - Checklist

| Checkpoint | Contenu |
|------------|---------|
| **Introduction** | Description de ce document. |
| **Contractor** | Nom de l'entreprise, nom complet du prestataire, titre du poste. |
| **Penetration Testers** | Nom de l'entreprise, nom complet des testeurs d'intrusion. |
| **Contact Information** | Adresses postales, adresses e-mail et numéros de téléphone de toutes les parties clientes et des testeurs d'intrusion. |
| **Purpose** | Description de l'objectif du test d'intrusion effectué. |
| **Goals** | Description des objectifs qui devraient être atteints avec le test d'intrusion. |
| **Scope** | Toutes les IP, noms de domaine, URLs ou plages CIDR. |
| **Lines of Communication** | Conférences en ligne ou appels téléphoniques ou réunions en personne, ou par e-mail. |
| **Time Estimation** | Dates de début et de fin. |
| **Time of the Day to Test** | Heures de la journée pour tester. |
| **Penetration Testing Type** | Test d'intrusion externe/interne/Évaluations de vulnérabilité/Ingénierie sociale. |
| **Penetration Testing Locations** | Description de la façon dont la connexion au réseau client est établie. |
| **Methodologies** | OSSTMM, PTES, OWASP et autres. |
| **Objectives / Flags** | Utilisateurs, fichiers spécifiques, informations spécifiques et autres. |
| **Evidence Handling** | Chiffrement, protocoles sécurisés. |
| **System Backups** | Fichiers de configuration, bases de données et autres. |
| **Information Handling** | Chiffrement fort des données. |
| **Incident Handling and Reporting** | Cas de contact, interruptions du test d'intrusion, type de rapports. |
| **Status Meetings** | Fréquence des réunions, dates, heures, parties incluses. |
| **Reporting** | Type, lecteurs cibles, focus. |
| **Retesting** | Dates de début et de fin. |
| **Disclaimers and Limitation of Liability** | Dommages au système, perte de données. |
| **Permission to Test** | Contrat signé, accord des prestataires. |

### Kick-Off Meeting

La réunion de lancement se tient généralement en présentiel à une date et une heure convenues, après la signature de tous les documents contractuels. Cette réunion réunit généralement le ou les interlocuteurs du client (audit interne, sécurité de l'information, informatique, gouvernance et gestion des risques, etc., selon le client), son équipe de support technique (développeurs, administrateurs système, ingénieurs réseau, etc.) et l'équipe de test d'intrusion (un responsable, comme le chef de projet, le ou les testeurs d'intrusion, et parfois un chef de projet ou le responsable commercial). Nous y détaillerons la nature du test d'intrusion et son déroulement. En règle générale, aucun test de déni de service (DoS) n'est effectué. Nous expliquerons également qu'en cas d'identification d'une vulnérabilité critique, les activités de test d'intrusion seront suspendues, un rapport de notification de vulnérabilité sera généré et les contacts d'urgence seront contactés. Ces rapports sont généralement générés uniquement lors de tests d'intrusion externes pour des failles critiques telles que l'exécution de code à distance non authentifiée (RCE), l'injection SQL ou toute autre faille entraînant la divulgation de données sensibles. L'objectif de cette notification est de permettre au client d'évaluer le risque en interne et de déterminer si le problème nécessite une intervention d'urgence. Nous n'interrompons généralement un test d'intrusion interne et n'alertons le client que si un système devient inaccessible, si nous décelons des activités illégales (comme du contenu illégal sur un partage de fichiers) ou la présence d'un acteur malveillant externe sur le réseau, ou encore une intrusion antérieure.

Nous devons également informer nos clients des risques potentiels liés à un test d'intrusion. Par exemple, nous devons préciser qu'un test d'intrusion **peut générer de nombreuses entrées de journal et alertes** dans leurs applications de sécurité. De plus, si une attaque par force brute ou une attaque similaire est utilisée, il est important de mentionner que `nous pouvons bloquer accidentellement certains comptes` utilisateurs identifiés lors du test. Nous devons également informer nos clients qu'ils doivent nous contacter immédiatement si le test d'intrusion effectué a un impact négatif sur leur réseau.

Expliquer le processus de test d'intrusion permet à toutes les parties prenantes de bien comprendre notre démarche. Cela témoigne de notre professionnalisme et convainc nos interlocuteurs de notre expertise. En dehors du personnel technique, du directeur technique et du responsable de la sécurité des systèmes d'information, cela peut paraître du charabia, difficilement compréhensible pour les non-initiés. Il est donc essentiel de bien connaître notre public et de cibler les personnes les moins expérimentées techniquement afin que notre approche soit accessible à tous.

Tous les points relatifs aux tests doivent être abordés et clarifiés. Il est crucial de répondre précisément aux souhaits et aux attentes du client. Chaque entreprise, avec sa structure et son réseau spécifiques, requiert une approche adaptée. Chaque client a des objectifs différents, et nous devons ajuster nos tests en conséquence. En général, nous pouvons évaluer l'expérience de nos clients en matière de tests d'intrusion dès le début de l'appel. Nous devrons alors peut-être approfondir certains points et nous préparer à répondre à davantage de questions, ou au contraire, l'appel de lancement peut être très court et direct.

### Contractors Agreement

Si le test d'intrusion inclut également des tests physiques, un accord supplémentaire avec le prestataire est nécessaire. Puisqu'il s'agit non seulement d'une intrusion virtuelle, mais aussi physique, des lois totalement différentes s'appliquent. De plus, il est possible que de nombreux employés n'aient pas été informés du test. Imaginons que, lors de l'attaque physique et des tentatives d'ingénierie sociale, nous rencontrions des employés très sensibilisés à la sécurité et que nous soyons pris la main dans le sac. Dans ce cas, les employés contacteront très probablement la police. Cet accord supplémentaire avec le prestataire est alors `notre meilleur atout pour nous sortir d'affaire`.

### Setting Up

Une fois tous les points précédents traités et les informations nécessaires recueillies, nous planifions notre approche et préparons tout. Même si les résultats du test d'intrusion restent inconnus, nous pouvons préparer nos machines virtuelles, nos serveurs privés virtuels et nos autres outils/systèmes pour tous les scénarios et situations. Vous trouverez plus d'informations et la procédure de préparation de ces systèmes dans le module « Configuration ».

### Connect to HTB

**How many documents must be prepared in total for a penetration test?**

Nous avons 7 documents a faire pour un test de pénétration

**Réponse :** `7`

## Information Gathering

Une fois la phase de pré-engagement terminée et les termes et conditions contractuels signés par toutes les parties, `la phase de collecte d'informations commence`. Cette phase est essentielle à toute évaluation de sécurité. Elle consiste à rassembler toutes les informations disponibles sur l'entreprise, ses employés, son infrastructure et son organisation. La collecte d'informations est l'étape la plus fréquente et la plus cruciale du processus de test d'intrusion ; nous y reviendrons régulièrement.

![information](https://academy.hackthebox.com/storage/modules/90/0-PT-Process-IG.png)

Toutes les étapes que nous entreprenons pour exploiter les vulnérabilités reposent sur les informations que nous recueillons sur nos cibles. Cette phase constitue la pierre angulaire de tout test d'intrusion. Nous pouvons obtenir les informations nécessaires de différentes manières, que l'on peut toutefois classer dans les catégories suivantes :

- Renseignement en sources ouvertes
- Énumération de l'infrastructure
- Énumération des services
- Énumération des hôtes

Les quatre catégories d'analyses doivent impérativement être réalisées lors de chaque test d'intrusion. En effet, `l'information` est l'élément clé de la réussite de ces tests et de l'identification des failles de sécurité. Cette information peut provenir de sources diverses : réseaux sociaux, offres d'emploi, hôtes et serveurs individuels, voire même des employés. L'information circule et se partage en permanence.

Après tout, nous, humains, communiquons en échangeant des informations, et les composants et services réseau fonctionnent de manière similaire. Tout échange d'informations a un objectif précis. Pour les réseaux informatiques, il s'agit toujours de déclencher un processus particulier : stockage de données dans une base de données, enregistrement, génération de valeurs spécifiques ou transmission d'informations.

### Open-Source Intelligence

Supposons que notre client souhaite que nous recherchions des informations sur son entreprise sur Internet. Pour ce faire, nous utilisons de `Open Source Intelligence (OSINT)`. L'OSINT est un processus permettant de trouver des informations publiques sur une entreprise ou des individus cibles, ce qui permet d'identifier des événements (réunions publiques et privées, par exemple), les dépendances externes et internes, ainsi que les connexions. L'OSINT utilise des informations publiques (sources ouvertes) provenant de sources librement accessibles pour obtenir les résultats souhaités. Nous pouvons souvent trouver des informations sensibles et cruciales pour la sécurité des entreprises et de leurs employés. Généralement, les personnes qui partagent ces informations ignorent qu'elles ne sont pas les seules à y avoir accès.

Il est possible de trouver des informations hautement sensibles telles que des mots de passe, des hachages, des clés, des jetons, et bien d'autres, qui peuvent nous donner accès au réseau en quelques minutes seulement. Les dépôts sur des sites comme GitHub ou d'autres plateformes de développement sont souvent mal configurés, et des personnes externes peuvent consulter ces informations. Si ce type d'information sensible est découvert dès le début des tests, la section « Gestion et signalement des incidents » des règles d'engagement (RoE) doit décrire la procédure de signalement de ces vulnérabilités de sécurité critiques. Les mots de passe ou clés SSH publiés publiquement constituent une faille de sécurité critique s'ils n'ont pas été supprimés ou modifiés. Par conséquent, l'administrateur de notre client doit examiner ces informations avant toute poursuite des tests.

#### Private and Public SSH Keys

![key](https://academy.hackthebox.com/storage/modules/90/searchcode3.png)

Les développeurs partagent souvent des sections entières de code sur [Stack Overflow](https://stackoverflow.com/questions) afin d'offrir à leurs pairs une meilleure compréhension du fonctionnement de leur code et de les aider à résoudre leurs problèmes. Ce type d'information peut également être rapidement découvert et utilisé contre l'entreprise. Notre mission est de détecter ces failles de sécurité et de les corriger. [Le module OSINT](https://academy.hackthebox.com/course/preview/osint-corporate-recon) : Reconnaissance d'entreprise nous apporte de précieux enseignements. Il présente différentes techniques pour recueillir ce type d'informations.

### Infrastructure Enumeration

Lors de l'énumération de l'infrastructure, nous dressons un panorama de la présence de l'entreprise sur Internet et son intranet. Pour ce faire, nous utilisons l'**OSINT** et les premières analyses actives. Nous exploitons des services tels que le **DNS afin de cartographier les serveurs et hôtes** du client et de comprendre la `structure de son infrastructure`. Cela inclut les serveurs de noms, les serveurs de messagerie, les serveurs web, les instances cloud, etc. Nous établissons une liste précise des hôtes et de leurs adresses IP, que nous comparons à notre périmètre d'analyse pour vérifier leur présence.

Au cours de cette phase, nous cherchons également à identifier les mesures de sécurité de l'entreprise. Plus ces informations sont précises, plus il sera aisé de dissimuler nos attaques (`tests d'intrusion`). L'identification des pare-feu, notamment des pare-feu applicatifs web, nous permet également de mieux comprendre les techniques susceptibles de déclencher une alerte chez notre client et les méthodes permettant de l'éviter.

Ici, notre position importe peu, que nous cherchions à obtenir une vue d'ensemble de l'infrastructure depuis l'extérieur (`vue externe`) ou depuis l'intérieur (`vue interne`) du réseau. L'énumération depuis l'intérieur du réseau nous offre une bonne vue d'ensemble des hôtes et serveurs pouvant servir de cibles pour une attaque par `pulvérisation de mots de passe`. Cette technique consiste à utiliser **un seul mot de passe pour tenter de s'authentifier avec un maximum de noms d'utilisateur** différents, dans l'espoir qu'une authentification réussie nous permette d'accéder au réseau. Toutes ces méthodes et techniques seront examinées plus en détail dans les modules correspondants.

### Service Enumeration

Lors de l'énumération des services, nous identifions ceux qui nous permettent d'interagir avec l'hôte ou le serveur via le réseau (**ou localement, en interne**). Il est donc crucial de se renseigner sur **le service, sa version, les informations qu'il fournit et sa finalité**. Une fois le contexte et la finalité de ce service compris, nous pouvons en tirer des conclusions logiques et envisager plusieurs options.

De nombreux services disposent d'un historique des versions, ce qui nous permet de vérifier si la version installée sur l'hôte ou le serveur est à jour. Cela nous aide également à identifier les failles de sécurité présentes dans la plupart des versions antérieures. Nombre d'administrateurs hésitent à modifier des applications fonctionnelles, car cela pourrait impacter l'ensemble de l'infrastructure. Par conséquent, ils préfèrent souvent prendre `le risque de laisser une ou plusieurs vulnérabilités ouvertes` et maintenir la fonctionnalité plutôt que de corriger les failles de sécurité.

### Host Enumeration

Une fois que nous disposons d'une liste détaillée de l'infrastructure du client, nous examinons chaque hôte mentionné dans le document de cadrage. Nous cherchons à identifier le système d'exploitation installé sur chaque hôte ou serveur, les services utilisés, leurs versions, et bien plus encore. Outre les analyses actives, nous pouvons également recourir à diverses méthodes **OSINT** pour déterminer la configuration potentielle de cet hôte ou serveur.

Nous pouvons ainsi identifier de nombreux services, comme un `serveur FTP` utilisé par l'entreprise pour l'échange de données entre employés et autorisant même un accès anonyme. Aujourd'hui encore, de nombreux hôtes et serveurs ne sont plus pris en charge par les fabricants. Pourtant, des vulnérabilités persistent sur ces anciennes versions de systèmes d'exploitation et de services, menaçant ainsi l'ensemble de l'infrastructure de notre client.

L'examen de chaque hôte ou serveur, qu'il soit externe ou interne, est indifférent. Cependant, une analyse interne permet souvent de découvrir des services inaccessibles depuis l'extérieur. De ce fait, de nombreux administrateurs, par négligence, les considèrent comme « **sécurisés** » `du simple fait de leur inaccessibilité`. Ainsi, de nombreuses erreurs de configuration sont souvent découvertes à ce stade, dues à ces hypothèses ou à des pratiques négligentes. Lors de l'énumération des hôtes, nous cherchons à déterminer le rôle de chaque hôte ou serveur et les composants réseau avec lesquels il communique. De plus, nous devons identifier les services utilisés à cette fin et les ports sur lesquels ils se trouvent.

Lors de l'énumération interne des hôtes, qui intervient généralement après l'exploitation réussie d'une ou plusieurs vulnérabilités, nous examinons également **l'hôte ou le serveur de l'intérieur**. Cela signifie que nous recherchons **les fichiers sensibles, les services locaux, les scripts, les applications, les informations et autres éléments** susceptibles d'être stockés sur l'hôte. Cette étape est également essentielle à la phase de post-exploitation, où nous tentons d'exploiter la vulnérabilité et d'élever nos privilèges.

### Pillaging

Une autre étape essentielle est le `pillage`. Après la phase de post-exploitation, le pillage consiste à **collecter des informations sensibles localement** sur le système compromis, telles que **les noms des employés, les données clients, etc**. Toutefois, cette collecte d'informations n'a lieu qu'après l'exploitation du système cible et l'obtention d'un accès à celui-ci.

Les informations que nous pouvons obtenir sur les systèmes compromis peuvent être classées en de nombreuses catégories et varient considérablement. Cela dépend de la finalité du système et de sa position au sein du réseau d'entreprise. Les administrateurs chargés de la sécurité de ces systèmes jouent également un rôle important. Néanmoins, ces informations peuvent révéler l'impact d'une attaque potentielle sur notre client et être utilisées pour des actions ultérieures `visant à élever nos privilèges` ou à nous déplacer latéralement au sein du réseau.

> Notez que HTB Academy ne propose pas de module spécifiquement dédié au pillage.

Ce choix est intentionnel et nous allons l'expliquer. Le pillage n'est pas une simple étape ou sous-catégorie, comme on le décrit souvent, mais une partie intégrante des phases de collecte d'informations et d'élévation de privilèges, qui **sont inévitablement** réalisées localement sur les systèmes cibles.

Le pillage est expliqué en détail dans d'autres modules, où nous considérons les étapes correspondantes comme essentielles et nécessaires.

Voici une courte liste de modules traitant du pillage ; ce sujet sera également abordé dans de nombreux autres modules :

- Network Enumeration with Nmap
- Getting Started
- Password Attacks
- Active Directory Enumeration & Attacks
- Linux Privilege Escalation
- Windows Privilege Escalation
- Attacking Common Services
- Attacking Common Applications
- Attacking Enterprise Networks

Au cours du parcours de formation de **testeur d'intrusion**, nous interagirons avec plus de `150 cibles et réaliserons neuf mini-tests d'intrusion simulés`, ce qui nous offrira de nombreuses occasions de travailler et de pratiquer ce sujet. De plus, les modules spécifiques au système d'exploitation doivent être pris en compte dans une perspective de pillage, car une grande partie de leur contenu peut être utilisée pour extraire des informations ou obtenir une élévation de privilèges sur les systèmes cibles.

## Vulnerability Assessment

Lors de la `phase d'évaluation de la vulnérabilité`, nous examinons et analysons les informations recueillies pendant la phase de collecte. Cette phase est un processus analytique fondé sur les résultats obtenus.

![vulnerability](https://academy.hackthebox.com/storage/modules/90/0-PT-Process-VA.png)

> Une analyse est un examen détaillé d'un événement ou d'un processus, décrivant son origine et son impact. Grâce à certaines précautions et actions, elle peut être déclenchée pour favoriser ou prévenir des occurrences futures.

**Toute analyse peut s'avérer très complexe**, car de nombreux facteurs et leurs interdépendances jouent un rôle important. Outre le fait que chaque analyse se concentre sur les trois temporalités (passé, présent et futur), l'origine et la destination sont des éléments essentiels. Il existe quatre types d'analyse :

| Type d'analyse | Description |
|----------------|-------------|
| **Descriptive** | L'analyse descriptive est essentielle dans toute analyse de données. D'une part, elle décrit un ensemble de données basé sur des caractéristiques individuelles. Elle aide à détecter d'éventuelles erreurs dans la collecte de données ou des valeurs aberrantes dans l'ensemble de données. |
| **Diagnostic** | L'analyse diagnostique clarifie les causes, les effets et les interactions des conditions. Ce faisant, elle fournit des informations obtenues par des corrélations et des interprétations. Nous devons adopter une vue rétrospective, similaire à l'analyse descriptive, avec la subtile différence que nous essayons de trouver les raisons des événements et des développements. |
| **Predictive** | En évaluant les données historiques et actuelles, l'analyse prédictive crée un modèle prédictif pour les probabilités futures. Sur la base des résultats des analyses descriptives et diagnostiques, cette méthode d'analyse de données permet d'identifier les tendances, de détecter les écarts par rapport aux valeurs attendues à un stade précoce, et de prédire les occurrences futures aussi précisément que possible. |
| **Prescriptive** | L'analyse prescriptive vise à déterminer quelles actions entreprendre pour éliminer ou prévenir un problème futur ou déclencher une activité ou un processus spécifique. |

Nous utilisons les résultats et les informations obtenus jusqu'à présent et les analysons pour en **tirer des conclusions**. Ces conclusions peuvent être **poussées à l'extrême**, mais nous devons ensuite les confirmer ou les infirmer. Supposons que nous ayons trouvé un `port TCP ouvert (2121)` sur un hôte lors de la phase de collecte d'informations.

Hormis le fait que ce port est ouvert, **Nmap** ne nous a rien révélé d'autre. Nous devons maintenant nous interroger sur les conclusions que nous pouvons tirer de ce résultat. Par conséquent, la question de départ importe peu. Il est cependant essentiel de poser des questions précises et de garder à l'esprit **ce que nous savons et ce que nous ignorons**. À ce stade, nous devons d'abord nous demander **ce que nous voyons et ce que nous possédons réellement**, `car ce que nous voyons ne correspond pas toujours à ce que nous avons`.

- Le port `TCP 2121`. – TCP indique déjà que ce service est `orienté connexion`.

- S'agit-il d'un port `standard` ? – **Non**, car les ports standard sont `compris entre 0 et 1023`, c'est-à-dire les **ports système**.

- Y a-t-il des chiffres dans ce numéro de port qui vous semblent familiers ? – **Oui**, le port `TCP 21 (FTP)`. D'après notre expérience, nous connaissons bien les ports standard et leurs services, que les administrateurs tentent souvent de dissimuler, préférant généralement des alternatives plus simples à retenir.

D'après notre hypothèse, nous pouvons tenter de nous connecter au service via `Netcat` ou un `client FTP` afin de confirmer ou d'infirmer notre supposition.

Lors de la tentative de connexion, nous avons constaté un délai `anormalement long (environ 15 secondes)`. Certains services permettent de configurer leur vitesse de connexion, ou temps de réponse. Sachant désormais qu'un serveur **FTP est actif sur ce port**, nous pouvons déduire l'origine de l'échec de notre analyse. Nous pourrions le confirmer **en spécifiant le délai minimal d'aller-retour pour la sonde** (`--min-rtt-timeout) dans Nmap`) à 15 ou 20 secondes et en relançant l'analyse.

### Vulnerability Research and Analysis

**La collecte d'informations et la recherche de vulnérabilités** font partie intégrante de l'analyse descriptive. C'est à cette étape que nous identifions les composants individuels du réseau ou du système que nous étudions. La recherche de vulnérabilités consiste à `rechercher les vulnérabilités, les exploits et les failles` de sécurité connus qui ont déjà été découverts et signalés. Par conséquent, si nous avons identifié une version d'un service ou d'une application lors de la collecte d'informations et `trouvé une vulnérabilité commune (CVE)`, il est très probable que cette vulnérabilité soit toujours présente.

Nous pouvons trouver des informations sur les vulnérabilités de chaque composant à partir de nombreuses sources différentes, notamment :

- [CVE Details](https://www.cvedetails.com/)
- [Packet Storm Security](https://packetstorm.news/)
- [Exploit DB](https://www.exploit-db.com/)
- [NIST](https://nvd.nist.gov/vuln/search?execution=e2s1#/nvd/home?resultType=records)
- [Vulners](https://vulners.com/)

C’est là qu’interviennent l’analyse diagnostique et l’analyse prédictive. Une fois une vulnérabilité publiée identifiée, nous pouvons la **diagnostiquer afin d’en déterminer la cause**. Il est essentiel de bien comprendre le fonctionnement du `code de preuve de concept "POC"`, de l’application ou du service lui-même, car de nombreuses configurations manuelles effectuées par les administrateurs nécessitent une personnalisation. Chaque POC étant conçu pour un cas spécifique, nous devrons généralement l’adapter au nôtre.

### Assessment of Possible Attack Vectors

**L'évaluation des vulnérabilités** comprend également les tests proprement dits, qui font partie de l'analyse prédictive. Pour ce faire, nous analysons les données historiques et les combinons aux informations actuelles que nous avons pu recueillir. Que notre client nous ait communiqué ou non des exigences spécifiques en matière de `niveau d'évasion`, nous testons les services et applications présents localement ou sur le système cible. Si nous devons effectuer des tests furtifs et éviter les alertes, nous devons **répliquer le système cible localement** avec la plus grande précision possible. Cela signifie que nous utilisons les informations recueillies lors de la phase de collecte pour répliquer le système cible, puis rechercher les vulnérabilités dans le système déployé localement.

### The Return

Supposons que notre analyse ne nous permette pas de détecter ou d'identifier de **vulnérabilités potentielles**. Dans ce cas, nous retournerons à la **phase de collecte d'informations** afin d'obtenir des données plus approfondies. Il est important de noter que ces deux phases (collecte d'informations et évaluation des vulnérabilités) **se chevauchent souvent, entraînant des allers-retours réguliers entre elles**. On observe ce phénomène dans de nombreuses vidéos où l'auteur résout une machine HTB ou un défi CTF. Il faut garder à l'esprit que ces défis sont souvent relevés le plus rapidement possible; `la vitesse prime donc sur la qualité`. Dans un CTF, l'objectif est d'accéder à la machine cible et de capturer les flags avec les privilèges **les plus élevés le plus rapidement possible**, plutôt que d'exposer toutes les faiblesses potentielles du système.

> Un test d'intrusion (réel) n'est pas un CTF.

Ici, la `qualité` et `l'intensité` de notre test d'intrusion et de son analyse sont primordiales, car il n'y a rien de pire que de voir notre client se faire pirater avec succès via un vecteur relativement simple que nous aurions dû découvrir lors de notre test d'intrusion.

---

**What type of analysis can be used to predict future probabilities?**

**Réponse :** `Predictive`

**Cours complétée**

{% include comments.html %}