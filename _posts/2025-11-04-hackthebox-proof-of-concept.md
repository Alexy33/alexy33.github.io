---
title: "HackTheBox - Proof of Concept"
date: 2025-11-04 18:22:00 +0200
categories: [HackTheBox, Learning]
tags: [learning]
description: "Write-up du module Proof of Concept"
image:
  path: /assets/img/posts/hackthebox-penetration-testing.png
  alt: "PoC"
---

## Informations sur la room

Découvrez le cours HTB sur l'Exploitation

**Lien :** [Proof of Concept](https://academy.hackthebox.com/beta/module/90/section/943)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Comprendre ce qu'est un **PoC**

---

## Proof-of-Concept

`La preuve de concept` (PoC) ou `preuve de principe` est un terme de gestion de projet. Elle sert à démontrer la faisabilité de principe d'un projet. Les critères de cette preuve peuvent être d'ordre technique ou commercial. Elle constitue donc le fondement des travaux ultérieurs, en l'occurrence, les mesures nécessaires à la sécurisation du réseau de l'entreprise par la confirmation des vulnérabilités identifiées. Autrement dit, elle sert de base à la prise de décision quant aux actions à entreprendre. Parallèlement, elle permet d'identifier et de minimiser les risques.

![PoC](https://academy.hackthebox.com/storage/modules/90/0-PT-Process-POC.png)

Cette étape de projet est souvent intégrée au **processus de développement de nouveaux logiciels applicatifs** (prototypage) ou de solutions de sécurité informatique. En sécurité de l'information, `c'est à cette étape que nous prouvons les vulnérabilités` des systèmes d'exploitation ou des logiciels applicatifs. Nous utilisons cette preuve de concept (PoC) pour démontrer l'existence d'un problème de sécurité, permettant ainsi aux développeurs ou administrateurs de le valider, de le reproduire, d'en observer l'impact et de tester leurs mesures correctives. Un exemple courant de preuve de vulnérabilité logicielle consiste à exécuter la calculatrice (calc.exe sous Windows) sur le système cible. En principe, la PoC évalue également la probabilité de succès d'un accès au système suite à une exploitation réelle.

Une PoC peut prendre différentes formes. Par exemple, la documentation des vulnérabilités découvertes peut également constituer une PoC. La version la plus pratique d'une PoC est `un script ou un code qui exploite automatiquement les vulnérabilités` identifiées. Cela démontre l'exploitation sans faille des vulnérabilités. Cette variante est simple à appréhender pour un administrateur ou un développeur, car elle lui permet de visualiser les étapes suivies par notre script pour exploiter la vulnérabilité.

Cependant, un inconvénient majeur se manifeste parfois. Une fois que les administrateurs et les développeurs ont reçu un tel script de notre part, il leur est facile de le contrer. Ils se concentrent sur la modification des systèmes afin de rendre le script inopérant. Or, ce script n'est qu'une méthode parmi d'autres pour exploiter une vulnérabilité donnée. Par conséquent, le fait de s'attaquer à notre script plutôt que de l'utiliser, et de modifier et sécuriser les systèmes pour le rendre inopérant, ne signifie pas que les informations qu'il contient ne peuvent pas être obtenues autrement. Il est essentiel d'aborder ce point avec les administrateurs et les développeurs, et `de le mentionner et de le souligner clairement`.

Le rapport que nous leur fournissons doit leur permettre d'avoir **une vision d'ensemble**, de se concentrer sur les problèmes plus généraux et de recevoir des recommandations de correction claires. Inclure une description détaillée de la chaîne d'attaque en cas de compromission de domaine lors d'un audit interne est un excellent moyen de montrer comment plusieurs failles peuvent se combiner et comment la correction d'une seule faille interrompt la chaîne, sans pour autant laisser les autres intactes. Si ces problèmes ne sont pas également corrigés, il existe peut-être une autre voie pour parvenir au point où la chaîne d'attaque a été neutralisée et se poursuivre. Nous devons insister sur ce point lors de notre réunion d'examen du rapport.

Par exemple, si un utilisateur utilise le mot de passe « Password123 », la vulnérabilité sous-jacente ne réside pas dans le mot de passe lui-même, `mais dans la politique de mots de passe`. Si un administrateur de domaine utilise ce mot de passe et que celui-ci est modifié, ce compte bénéficiera certes d'un mot de passe plus robuste, mais le problème des mots de passe faibles **restera probablement endémique au sein de l'organisation**.

Si la politique de mots de passe respectait des normes élevées, l'utilisateur ne pourrait pas utiliser un mot de passe aussi faible. Les administrateurs et les développeurs sont responsables du bon fonctionnement et de la qualité de leurs systèmes et applications. De plus, la qualité repose sur des normes élevées, que nous devons souligner dans nos recommandations de correction.

## Post-Engagement

De même qu'un travail préparatoire considérable est nécessaire avant le début officiel d'une mission (lorsque les tests commencent), nous devons réaliser de nombreuses activités (dont plusieurs sont contractuellement contraignantes) une fois nos analyses, l'exploitation des vulnérabilités, les déplacements latéraux et les opérations post-exploitation terminés. Chaque mission étant unique, ces activités peuvent légèrement varier, mais elles sont généralement indispensables pour la clôturer entièrement.

![pre-engagement](https://academy.hackthebox.com/storage/modules/90/0-PT-Process.png)

### Cleanup

Une fois les tests terminés, nous devons `effectuer le nettoyage nécessaire`, notamment **supprimer les outils et scripts téléchargés sur les systèmes cibles, annuler les modifications de configuration (mineures) que nous avons pu apporter, etc**. Nous devons consigner par écrit toutes nos activités afin de faciliter et d'optimiser le nettoyage. Si nous ne pouvons accéder à un système où un élément doit être supprimé ou une modification annulée, nous devons en informer le client et mentionner ces problèmes dans les annexes du rapport. Même si nous parvenons à supprimer les fichiers téléchargés et à annuler les modifications (comme l'ajout d'un compte administrateur local), nous devons documenter ces changements dans les annexes du rapport. Ainsi, au cas où le client recevrait des alertes nécessitant un suivi, il pourrait être utile de confirmer que l'activité en question faisait partie des tests autorisés.

### Documentation and Reporting

Avant de finaliser l'évaluation et de nous déconnecter du réseau interne du client, ou d'envoyer des notifications par e-mail pour signaler la fin des tests (et donc l'arrêt de toute interaction avec les hôtes du client), nous devons nous **assurer de disposer d'une documentation complète** pour toutes les constatations que nous prévoyons d'inclure dans notre rapport. Cela inclut les **résultats des commandes, des captures d'écran, la liste des hôtes affectés et tout autre élément** spécifique à l'environnement du client ou à la constatation. Nous devons également nous assurer d'avoir récupéré tous les résultats d'analyse et les journaux si le client a hébergé une machine virtuelle dans son infrastructure pour un test d'intrusion interne, ainsi que toutes les autres données susceptibles d'être incluses dans le rapport ou en tant que documentation complémentaire. Nous ne devons conserver aucune information personnelle identifiable (IPI), aucune information potentiellement compromettante ni aucune autre donnée sensible rencontrée au cours des tests.

Nous devons déjà disposer d'une liste détaillée des constatations qui figureront dans le rapport, ainsi que de tous les détails nécessaires pour adapter ces constatations à l'environnement du client. Notre rapport (dont le détail est présenté dans le module Documentation et Reporting) doit comprendre les éléments suivants :

- `Une chaîne d’attaque` (en cas de compromission interne totale ou d’accès externe) détaillant les étapes suivies pour parvenir à la compromission.

- `Un résumé concis et compréhensible` par un public non technique.

- `Des conclusions détaillées`, spécifiques à l’environnement du client, incluant une évaluation des risques, l’impact des constatations, des recommandations de remédiation et des références externes de qualité relatives au problème.

- `Une procédure permettant de reproduire chaque constatation` afin que l’équipe de remédiation puisse comprendre et tester le problème lors de la mise en œuvre des correctifs.

- `Des recommandations` à court, moyen et long terme, spécifiques à l’environnement.

Des annexes contenant des informations telles que le périmètre cible, les données OSINT (le cas échéant), l’analyse du craquage de mots de passe (le cas échéant), les ports/services découverts, les hôtes compromis, les comptes compromis, les fichiers transférés vers les systèmes du client, toute création de compte/modification du système, une analyse de sécurité Active Directory (le cas échéant), les données d’analyse pertinentes/la documentation complémentaire et toute autre information nécessaire pour expliquer plus en détail une constatation ou une recommandation.

À ce stade… À cette étape, nous rédigerons un rapport préliminaire qui constituera le premier livrable remis à notre client. Ce dernier pourra alors commenter le rapport et demander les clarifications ou modifications nécessaires.

### Report Review Meeting

Une fois le rapport préliminaire remis et après diffusion en interne et examen approfondi par le client, une réunion de revue est d'usage afin d'analyser les résultats de l'évaluation. Cette réunion rassemble généralement les mêmes personnes du client et du cabinet ayant réalisé l'évaluation. Selon la nature des constatations, le client peut faire intervenir des experts techniques supplémentaires si celles-ci concernent un système ou une application dont il est responsable. Nous ne lisons généralement pas l'intégralité du rapport, mais nous passons brièvement en revue chaque constatation et fournissons une explication basée sur notre expérience. Le client a la possibilité de poser des questions sur tous les points du rapport, de demander des éclaircissements ou de signaler les problèmes à corriger. Souvent, le client arrive avec une liste de questions sur des constatations spécifiques et ne souhaite pas aborder chaque constatation en détail (notamment celles présentant un faible risque).

### Deliverable Acceptance

Le cahier des charges doit définir clairement les modalités d'acceptation des livrables du projet. Dans le cadre des tests d'intrusion, nous fournissons généralement un `rapport préliminaire` afin de laisser au client la possibilité de le relire et de formuler des commentaires. Une fois que le client a transmis ses commentaires (réponses de la direction, demandes de clarifications/modifications, éléments complémentaires, etc.), soit par courriel, soit (idéalement) lors d'une réunion de relecture du rapport, nous pouvons lui fournir une version finale. Certains cabinets d'audit auxquels les clients peuvent être liés n'acceptent pas les rapports de test d'intrusion préliminaires. D'autres entreprises n'y attachent pas d'importance, mais il est préférable d'`adopter une approche uniforme pour tous les clients`.

### Post-Remediation Testing

La plupart de nos missions incluent des tests post-correction dans le coût total du projet. Durant cette phase, nous examinerons toute documentation fournie par le client attestant de la correction des problèmes ou présentant simplement la liste des problèmes résolus. Nous devrons accéder à nouveau à l'environnement cible et tester chaque problème afin de nous assurer qu'il a été correctement corrigé. Nous établirons un rapport post-correction présentant clairement l'état de l'environnement avant et après les tests. Par exemple, ce rapport pourra inclure un tableau tel que :

| # | Gravité de la découverte | Titre de la découverte | Statut |
|---|--------------------------|------------------------|--------|
| 1 | High | SQL Injection | Remediated |
| 2 | High | Broken Authentication | Remediated |
| 3 | High | Unrestricted File Upload | Remediated |
| 4 | High | Inadequate Web and Egress Filtering | Not Remediated |
| 5 | Medium | SMB Signing Not Enabled | Not Remediated |
| 6 | Low | Directory Listing Enabled | Not Remediated |

Pour chaque constatation (lorsque cela est possible), nous souhaiterons démontrer que le problème n'est plus présent dans l'environnement, soit par le biais des résultats d'analyse, soit par la preuve que les techniques d'exploitation initiales échouent.

### Role of the Pentester in Remediation

Puisqu'un test d'intrusion est essentiellement un audit, nous devons rester des tiers impartiaux et `nous abstenir de toute correction` suite à nos constatations (comme la correction de code, l'application de correctifs système ou la modification de la configuration d'Active Directory). Nous devons préserver notre indépendance et pouvons intervenir en tant que conseillers de confiance en fournissant des conseils généraux sur la manière de résoudre un problème spécifique ou en expliquant/démontrant plus en détail une constatation afin que l'équipe chargée de sa correction puisse mieux la comprendre. Nous ne devons ni implémenter nous-mêmes les modifications, ni même donner de conseils précis de correction (par exemple, en cas d'injection SQL, nous pouvons suggérer de « nettoyer les entrées utilisateur » `sans fournir au client un code réécrit`). Ceci permettra de préserver l'**intégrité de l'évaluation** et d'éviter tout conflit d'intérêts potentiel.

### Data Retention

À l'issue d'un test d'intrusion, nous disposerons d'une quantité considérable de données spécifiques au client, telles que les résultats d'analyse, les journaux d'activité, les identifiants, les captures d'écran, etc. Les exigences en matière de conservation et de destruction des données peuvent varier d'un pays à l'autre et d'une entreprise à l'autre. Les procédures relatives à chacune d'elles doivent être clairement définies dans le contrat, notamment dans le périmètre des travaux et les règles d'engagement. Conformément aux recommandations relatives aux tests d'intrusion de la norme de sécurité des données PCI (PCI DSS) :

> Bien qu'il n'existe actuellement aucune exigence PCI DSS concernant la conservation des preuves recueillies par le testeur d'intrusion, il est recommandé que ce dernier conserve ces preuves (qu'elles soient internes à l'organisation ou provenant d'un prestataire tiers) pendant une certaine période, en tenant compte des lois locales, régionales ou internes à l'entreprise applicables. Ces preuves doivent être disponibles sur demande auprès de l'entité cible ou d'autres entités autorisées, conformément aux règles d'engagement.
{: .prompt-info}

Il convient de `conserver les preuves pendant un certain` temps après le test d'intrusion, afin de pouvoir répondre à d'**éventuelles questions concernant des résultats spécifiques** ou pour faciliter la réalisation de nouveaux tests sur des failles « clôturées » après la mise en œuvre des mesures correctives par le client. Toutes les données conservées après l'évaluation doivent être stockées dans un emplacement sécurisé appartenant à l'entreprise et contrôlé par elle, et chiffrées au repos. Toutes les données doivent être effacées des systèmes des testeurs à la fin de l'évaluation. Une nouvelle machine virtuelle, dédiée au client concerné, doit être créée pour tout test post-correction ou toute investigation relative aux résultats suite aux demandes du client.

### Close Out

Une fois le rapport final remis, le client accompagné dans ses questions relatives à la remédiation et les tests post-remédiation effectués/un nouveau rapport émis, nous pouvons clôturer le projet. À ce stade, nous devons nous assurer que tous les systèmes utilisés pour se connecter aux systèmes du client ou traiter des données ont été effacés ou détruits et que tous les éléments résiduels de la mission sont stockés en toute sécurité (cryptés) conformément à la politique de notre cabinet et à nos obligations contractuelles. Les dernières étapes consistent à facturer le client et à encaisser le paiement des services rendus. Il est toujours judicieux de réaliser `un questionnaire de satisfaction client après l'évaluation` afin que l'équipe et la direction, en particulier, puissent identifier les points forts et les axes d'amélioration, tant au niveau des processus de l'entreprise que du consultant affecté au projet. Si le client est satisfait de notre travail et de nos échanges quotidiens, des discussions concernant une mission ultérieure pourront avoir lieu dans les semaines ou les mois qui suivent.

`Tout en développant nos compétences techniques, nous devons constamment chercher à améliorer nos compétences relationnelles` et à devenir des consultants plus complets. Au final, le client se souviendra généralement des interactions lors de l'évaluation, de la communication et de la façon dont il a été traité et considéré par l'entreprise, et non de la chaîne d'exploitation sophistiquée mise en œuvre par le testeur d'intrusion pour compromettre ses systèmes. Profitez de ce temps pour une introspection et pour travailler à l'amélioration continue de tous les aspects de votre rôle de testeur d'intrusion professionnel.

---

**What designation do we typically give a report when it is first delivered to a client for a chance to review and comment? (One word)**

**Réponse :** `DRAFT`

## Practice

`Toutes les théories du monde nous seront inutiles si nous ne pouvons pas les mettre en pratique` et appliquer nos connaissances à des **situations concrètes**. Mettre régulièrement en application les tactiques, techniques et procédures (TTP) abordées dans le cadre du parcours de testeur d'intrusion est la meilleure façon de perfectionner nos compétences et de garantir que, lorsque nous les mettrons en œuvre chez un client, nous serons sûrs de nous et de l'impact potentiel de nos actions. Cependant, les compétences techniques ne représentent que la moitié du travail. D'excellentes compétences en communication écrite et orale sont également indispensables pour être un testeur d'intrusion efficace. Cela inclut des aspects qui peuvent paraître mineurs, comme la capacité à rédiger un courriel clair et professionnel, ainsi qu'à présenter et défendre notre travail lors d'une réunion client et dans un rapport professionnel.

Dans ce domaine, **vous travaillerez souvent en équipe**, et ensemble, nous pouvons nous entraider pour progresser et perfectionner nos compétences. Besoin de vous entraîner à animer une réunion de lancement avec un client ? `Demandez à un ami ou un collègue de jouer le rôle d'un client fictif`. Profitez de ce temps pour vous entraîner à poser vos questions initiales de cadrage et à définir le test d'intrusion que vous prévoyez de réaliser. Ces mêmes actions peuvent être appliquées lors de la préparation de la présentation de votre rapport final au client.

**Les tests d'intrusion sont passionnants**. Nous avons l'opportunité d'attaquer un réseau et de nous comporter comme de véritables hackers pendant un certain temps. Cependant, **ce que certains peuvent trouver ennuyeux est essentiel** : `une documentation complète et des compétences rédactionnelles solides`. Un client ne pourra pas faire grand-chose avec un rapport vague de deux pages (de la même manière qu'un module en deux sections ne vous serait pas très utile). Si nous étions engagés par une entreprise du Fortune 500 et que nous parvenions à prendre le contrôle de l'intégralité de son domaine sans déclencher d'alarme, nous devrions être en mesure de le prouver. Si nous ne pouvons pas étayer nos affirmations par des preuves claires, **nous perdrons en crédibilité et notre travail sera remis en question**.

De même, si nous disposons d'une documentation de plus de 50 pages, nous avons beaucoup plus de preuves pour étayer notre travail et nous avons plus de chances de faire bonne impression auprès des décideurs de l'entreprise cliente. Cela dit, si notre présentation est bâclée, que le rapport est difficile à suivre, qu'il ne détaille pas les étapes de reproduction des vulnérabilités et ne fournit pas de recommandations de correction claires, ou encore que le résumé est mal rédigé, nos efforts seront mal perçus. La documentation et la rédaction de rapports (y compris la manière de rédiger un rapport de qualité) seront abordées dans un autre module. Ce module propose également de nombreuses suggestions et ressources pour **développer cette compétence relationnelle essentielle**.

> Au sein d'une équipe de tests d'intrusion, nous nous entraînions régulièrement aux réunions de lancement avec les clients et aux revues de rapports. Nous nous exercions à analyser les résultats et à peaufiner le contenu de nos rapports ainsi que les recommandations formulées. Lorsque nos clients posaient des questions ou contestaient nos recommandations, nous étions préparés à gérer la situation et pouvions expliquer clairement et immédiatement le bien-fondé de chaque solution proposée. Ce type d'entraînement vous permettra sans aucun doute de gagner en professionnalisme et en rigueur.
{: .prompt-info}

Aussi cruciales que soient les interactions avec le client lors d'un test d'intrusion, elles seront vaines si nous ne pratiquons pas nos compétences techniques. `La pratique nous permettra d'identifier nos points forts et nos axes d'amélioration`. La lecture ne remplace pas la pratique (même si **la théorie écrite est essentielle pour une compréhension approfondie** des nombreux sujets abordés). Une fois certaines tâches maîtrisées grâce à une pratique conséquente, nous gagnerons du temps et de l'énergie pour approfondir les évaluations clients ou pour nos propres recherches et analyses.

Nous pouvons être des experts en exploitation web, mais rencontrer des difficultés face à un environnement Active Directory. Idéalement, il faudrait s'entraîner dans des environnements de laboratoire similaires à ceux de vos clients. (Si vous effectuez souvent des tests d'intrusion contre des organisations utilisant des équipements spécifiques, comme dans le secteur médical, l'idéal serait de disposer de répliques des appareils courants que vous pourriez rencontrer.) Mais ce n'est pas toujours possible. Alors, comment faire ? Chez **Hack The Box**, nous vous proposons de nombreuses solutions pour perfectionner vos compétences. Tout, des machines actives aux défis en passant par les Prolabs et les Battlegrounds, permet d'acquérir une expérience pratique approfondie face à tous types de vulnérabilités. Les modules de HTB Academy constituent une **excellente ressource pour perfectionner nos compétences**. De nombreux modules du parcours de formation de testeur d'intrusion proposent des travaux pratiques pouvant servir de simulation de tests d'intrusion. Cette répétition peut paraître fastidieuse au départ, mais elle nous fera gagner un temps précieux que nous pourrons consacrer à notre progression. Les étapes ci-dessous nous guideront dans la mise en pratique de nos acquis :

### Practicing Steps

Réfléchissez aux compétences que vous avez acquises et à ce qui vous intéresse le plus. À partir de là, nous pouvons sélectionner quelques modules supplémentaires pour approfondir nos connaissances, des machines pour nous entraîner et des Prolabs ou des Endgames pour vraiment nous mettre à l'épreuve. Voici un bon exemple pour commencer :

- 2 modules
- 3 machines hors service
- 5 machines actives
- 1 Prolab/Endgame

#### Modules

Les modules choisis doivent être **classés selon deux niveaux de difficulté** : technique et offensif. Ils nous permettent de nous familiariser avec les attaques et leurs possibilités, et d’en acquérir une compréhension précise. Nous utilisons ensuite les exercices fournis et leurs machines pour apprendre à appliquer ces techniques et, simultanément, `prendre des notes` et réaliser des captures d’écran pertinentes pour une documentation précise. Voici un bon plan pour aborder un module :

| Étape | Tâche |
|-------|-------|
| 1. | Lire le module |
| 2. | Pratiquer les exercices |
| 3. | Compléter le module |
| 4. | Recommencer les exercices du module depuis le début |
| 5. | Prendre des notes en résolvant à nouveau les exercices |
| 6. | Créer une documentation technique basée sur les notes |
| 7. | Créer une documentation non technique basée sur les notes |

Le choix de plusieurs modules nous permet d'aborder différentes technologies et problématiques. Nous découvrirons divers aspects à prendre en compte et parfois à documenter plus en détail. Ces notes seront précieuses pour notre évolution professionnelle. Certaines combinaisons de technologies et de vecteurs d'attaque sont rares; des notes détaillées sur ces systèmes, prises lors de nos interactions, nous permettront de progresser plus rapidement dans les évaluations où nous les rencontrerons.

Après avoir terminé le module, nous devrions créer une `documentation technique` et `non technique` concise (par exemple, des exemples de résultats techniques, des étapes de reproduction et des résumés pouvant être intégrés à un rapport). Il est important de s'exercer à créer une documentation prête à être présentée au client. On sous-estime souvent l'importance des connaissances et des `compétences acquises grâce à la création de documentation`. S'exercer à rédiger de la documentation permet de consolider nos connaissances et de mieux expliquer les concepts à un public technique comme non technique.

#### Retired Machines

Une fois que nous aurons terminé **(au moins) deux modules** et que nous serons satisfaits de nos notes et de notre documentation, nous pourrons sélectionner `trois machines hors service différentes`. Celles-ci devront présenter un niveau de difficulté différent, mais nous recommandons d'en choisir `deux faciles et une de difficulté moyenne`. À la fin de chaque module, vous trouverez des machines hors service recommandées pour vous aider à mettre en pratique les outils et les sujets spécifiques abordés. Ces hôtes partageront un ou plusieurs vecteurs d'attaque liés au module.

L'utilisation de ces machines hors service présente un avantage considérable : nous pouvons trouver en ligne des comptes rendus rédigés par différents auteurs (avec des approches variées) avec lesquels nous pourrons comparer nos notes. Si nous optons pour un **abonnement VIP** sur la plateforme principale HTB, nous aurons également accès aux `comptes rendus officiels HTB` qui présentent un autre point de vue et incluent souvent des **pistes de défense**. Nous pourrons ainsi vérifier que nous avons bien noté tous les éléments nécessaires et que nous n'avons rien omis. L'ordre dans lequel nous pouvons procéder pour nous entraîner sur les machines hors service est le suivant :

| Étape | Tâche |
|-------|-------|
| 1. | Obtenir le flag utilisateur par vous-même |
| 2. | Obtenir le flag root par vous-même |
| 3. | Rédiger votre documentation technique |
| 4. | Rédiger votre documentation non technique |
| 5. | Comparer vos notes avec le write-up officiel (ou un write-up de la communauté si vous n'avez pas d'abonnement VIP) |
| 6. | Créer une liste des informations que vous avez manquées |
| 7. | Regarder la procédure pas à pas d'Ippsec et la comparer avec vos notes |
| 8. | Développer vos notes et votre documentation en ajoutant les parties manquées |

#### Active Machines

Après avoir acquis de solides bases avec les modules et les machines hors service, nous pouvons nous attaquer à **deux machines actives faciles**, `deux de difficulté moyenne et une difficile`. Nous pouvons également nous baser sur les recommandations des modules correspondants, disponibles **à la fin de chaque module de l'Académie**.

L'avantage de cette méthode est de simuler une situation **aussi réaliste que possible** sur une seule machine hôte que nous ne connaissons pas et pour laquelle nous ne trouvons aucune documentation (approche « `boîte noire` »). **Tant que la machine reste active, aucune documentation officielle n'est publiée**. Cela signifie que nous ne pouvons vérifier auprès d'aucune source officielle si nous possédons toutes les informations nécessaires ou si nous avons omis quelque chose. Nous sommes donc contraints de nous fier à nous-mêmes et à nos compétences. Voici un exemple de procédure idéale pour les machines actives :

| Étape | Tâche |
|-------|-------|
| 1. | Obtenir les flags utilisateur et root |
| 2. | Rédiger votre documentation technique |
| 3. | Rédiger votre documentation non technique |
| 4. | Faire relire par des personnes techniques et non techniques |

La relecture nous donne une première impression de la façon dont les lecteurs perçoivent les deux types de documentation. Cela nous permet **d'identifier les aspects à améliorer**, tant pour un public technique que non technique. Comme on peut s'en douter, peu de personnes non techniques s'intéressent à ce type de documentation. **Il est donc essentiel de concevoir une documentation non technique** informative, de haute qualité, concise mais pertinente et exempte de jargon technique. Le module « Documentation et rapports » aborde ce sujet plus en détail.

#### Pro Lab/Endgame

Une fois à l'aise avec l'attaque d'hôtes individuels et la documentation de nos résultats, nous pouvons aborder les **Prolabs et les Endgames**. Ces laboratoires sont de vastes environnements multi-hôtes qui `simulent souvent des réseaux d'entreprise de tailles variées`, similaires à ceux que nous rencontrons lors de tests d'intrusion réels pour nos clients. Cela nous confrontera à des défis différents de ceux auxquels nous sommes habitués. Nous ne nous concentrerons plus sur un seul hôte et devrons désormais considérer comment les différents hôtes interagissent entre eux. Ces interactions créeront de nouveaux vecteurs d'attaque intéressants sur lesquels nous pourrons nous entraîner. Par exemple, l'exécution d'un outil comme `Responder` dans un environnement Active Directory pour observer le trafic et capturer le hachage du mot de passe d'un utilisateur ou toute autre interaction utilisateur est beaucoup plus probable dans un réseau simulé que lors de l'attaque d'un seul serveur. Attaquer une infrastructure composée de plusieurs hôtes et composants réseau interconnectés créera des connexions supplémentaires que nous devrons prendre en compte dans notre documentation. Au lieu de montrer comment compromettre un seul hôte du début à la fin, nous devrons nous entraîner à rédiger une chaîne d'attaque complète, en décrivant notre cheminement depuis le point d'entrée jusqu'à la compromission du réseau. Ceci est, là encore, traité dans le module « Documentation et rapports ». L'expérience acquise lors des tâches précédentes nous facilitera grandement la tâche, car tout s'appuie sur le précédent.

### Wrapping Up

Nous avons abordé de nombreuses informations dans ce module. Si vous débutez dans le métier de testeur d'intrusion, nous vous recommandons de **suivre l'ordre de présentation des modules**. Si vous êtes novice en la matière, sauter des modules pourrait entraîner des lacunes et rendre certains modules difficiles à terminer sans les prérequis. Si vous avez déjà avancé dans le parcours, il est conseillé de revoir les modules que vous avez déjà terminés et de considérer les différentes étapes dans le contexte du processus de test d'intrusion présenté dans ce module.

`La pratique et l'amélioration continues sont essentielles, quel que soit votre niveau`. Nous pouvons constamment perfectionner nos méthodes, apprendre différemment et découvrir de nouveaux concepts. Le domaine des technologies de l'information évolue rapidement. De nouvelles attaques sont fréquemment découvertes et nous devons rester à la pointe des dernières et meilleures tactiques, techniques et procédures (**TTP**) pour être aussi efficaces que possible et fournir à nos clients les informations nécessaires pour sécuriser leurs environnements face à un paysage de menaces en constante évolution. **N'arrêtez jamais d'apprendre et de vous améliorer**. Relevez des défis chaque jour. Faites des pauses. Appréciez le parcours et n'oubliez pas de `sortir des sentiers battus !` "**Think Outside The Box !**"

**Cours complété**

{% include comments.html %}