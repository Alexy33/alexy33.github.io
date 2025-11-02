---
title: "HackTheBox - Background & preparation"
date: 2025-11-02 12:49:00 +0200
categories: [HackTheBox, Learning]
tags: [learning]
description: "Write-up du module Background & preparation"
image:
  path: /assets/img/posts/hackthebox-penetration-testing.png
  alt: "background & preparation"
---

## Informations sur la room

Découvrez le cours HTB sur Background & preparation

**Lien :** [Background & preparation](https://academy.hackthebox.com/beta/module/90/section/935)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Comprendre les notions en terme de légalité du Penetration tester

---

## Penetration Testing Overview

L'informatique est un élément essentiel de presque toutes les entreprises. Le volume de données critiques et confidentielles stockées dans les systèmes informatiques ne cesse de croître, tout comme la dépendance à leur fonctionnement ininterrompu. Par conséquent, les attaques contre les réseaux d'entreprise, les interruptions de service et autres moyens de causer des dommages importants (comme les attaques par rançongiciel) sont de plus en plus fréquents. Les informations confidentielles obtenues suite à des failles de sécurité et des cyberattaques peuvent être vendues à la concurrence, divulguées sur des forums publics ou utilisées à des fins malveillantes. Les pannes de système sont souvent provoquées délibérément car elles sont de plus en plus difficiles à contrer.

Un `test d'intrusion (pentest)` est une **tentative d'attaque organisée**, ciblée et autorisée visant à **tester l'infrastructure informatique et ses défenses** afin d'évaluer leur vulnérabilité aux failles de sécurité. Un pentest utilise les mêmes méthodes et techniques que les attaquants professionnels. En tant que testeurs d'intrusion, nous appliquons diverses techniques et analyses pour évaluer l'impact qu'une vulnérabilité ou une chaîne de vulnérabilités peut avoir sur la confidentialité, l'intégrité et la disponibilité des systèmes et des données informatiques d'une organisation.

> Un test d'intrusion vise à découvrir et identifier TOUTES les vulnérabilités des systèmes étudiés et à améliorer la sécurité des systèmes testés.

D'autres évaluations, comme une évaluation par `Red Team`, peuvent être basées sur des scénarios et se concentrer uniquement sur les vulnérabilités exploitées pour atteindre un objectif final spécifique (par exemple, accéder à la boîte de réception du PDG ou obtenir un flag implanté sur un serveur critique).

### Risk Management

De manière générale, la gestion des risques liés à la sécurité informatique fait partie intégrante de la gestion des risques d'une entreprise. Son principal objectif est `d'identifier, d'évaluer et d'atténuer` les risques potentiels susceptibles de compromettre la confidentialité, l'intégrité et la disponibilité des systèmes d'information et des données d'une organisation, et de réduire le risque global à un niveau acceptable. Cela implique d'identifier les menaces potentielles, d'évaluer leurs risques et de prendre les mesures nécessaires pour les réduire ou les éliminer. Pour ce faire, il convient de mettre en œuvre les contrôles et politiques de sécurité appropriés, notamment le contrôle d'accès, le chiffrement et d'autres mesures de sécurité. En consacrant le temps nécessaire à la gestion adéquate des risques de sécurité des systèmes informatiques d'une organisation, il est possible de garantir la sécurité des données.

Cependant, il est impossible d'éliminer tous les risques. Le risque inhérent de violation de la sécurité persiste, même lorsque l'organisation a pris toutes les mesures raisonnables pour le gérer. Par conséquent, certains risques subsisteront. Le risque inhérent est le niveau de risque présent même lorsque les contrôles de sécurité appropriés sont en place. Les entreprises peuvent accepter, transférer, éviter et atténuer les risques de diverses manières. Par exemple, les entreprises peuvent souscrire une assurance pour se couvrir contre certains risques, tels que les catastrophes naturelles ou les accidents. En concluant un contrat, elles peuvent également transférer leurs risques à un tiers, comme un prestataire de services. De plus, elles peuvent mettre en œuvre des mesures préventives pour réduire la probabilité d'occurrence de certains risques et, si un risque survient, instaurer des processus pour en minimiser l'impact. Enfin, elles peuvent utiliser des instruments financiers, tels que les produits dérivés, pour atténuer les conséquences économiques de risques spécifiques. Toutes ces stratégies permettent aux entreprises de gérer efficacement leurs risques.

Lors d'un test d'intrusion, nous établissons une documentation détaillée sur les étapes suivies et les résultats obtenus. Cependant, il incombe au client ou à l'exploitant des systèmes testés de corriger les vulnérabilités identifiées. Notre rôle est celui de conseillers de confiance : nous signalons les vulnérabilités, fournissons les étapes de reproduction détaillées et formulons des recommandations de correction appropriées, mais nous n'intervenons pas pour appliquer des correctifs ou modifier le code. Il est important de noter qu'un test d'intrusion ne constitue pas une surveillance de l'infrastructure ou des systèmes informatiques, mais un instantané de l'état de la sécurité. Une déclaration à cet égard devra figurer dans notre rapport de test d'intrusion.

### Vulnerability Assessments

`L'analyse de vulnérabilité` est un terme générique qui englobe les évaluations de vulnérabilité ou de sécurité et les tests d'intrusion. Contrairement à un test d'intrusion, les évaluations de vulnérabilité ou de sécurité sont réalisées à l'aide d'outils entièrement automatisés. Les systèmes sont analysés afin de détecter les problèmes connus et les vulnérabilités de sécurité grâce à des outils d'analyse tels que [Nessus](https://www.tenable.com/products/nessus), [Qualys](https://www.qualys.com/apps/vulnerability-management-detection-response/), [OpenVAS](https://www.openvas.org/), etc. Dans la plupart des cas, ces vérifications automatisées ne permettent pas d'adapter les attaques à la configuration du système cible. C'est pourquoi les tests manuels effectués par un testeur humain expérimenté sont essentiels.

En revanche, un test d'intrusion combine tests et validations automatisés et manuels et est réalisé après une collecte d'informations exhaustive, généralement manuelle. Il est conçu sur mesure et adapté au système testé. La planification, l'exécution et le choix des outils utilisés sont bien plus complexes lors d'un test d'intrusion. Les tests d'intrusion, comme les autres évaluations de sécurité, ne peuvent être effectués qu'après accord mutuel entre l'entreprise commanditaire et l'organisation employant le testeur. En effet, les tests et activités réalisés lors d'un test d'intrusion peuvent constituer des infractions pénales si le testeur ne dispose pas d'une autorisation écrite explicite pour attaquer les systèmes du client. L'organisation commanditaire du test d'intrusion ne peut demander que des tests sur ses propres ressources. Si elle utilise des tiers pour héberger des sites web ou d'autres infrastructures, elle doit généralement obtenir leur accord écrit explicite. Des entreprises comme Amazon n'exigent plus d'autorisation préalable pour tester certains services, conformément à cette politique, si une entreprise utilise AWS pour héberger tout ou partie de son infrastructure. Cela varie d'un fournisseur à l'autre, il est donc toujours préférable de confirmer la propriété des actifs avec le client lors de la phase d'étude de faisabilité et de vérifier si les tiers auxquels ils font appel exigent une procédure de demande écrite avant tout test.

Un test d'intrusion réussi exige une organisation et une préparation considérables. Il est indispensable de disposer d'un modèle de processus clair et précis, adaptable aux besoins de chaque client, car chaque environnement est unique et présente ses propres spécificités. Il arrive que nous travaillions avec des clients n'ayant jamais subi de test d'intrusion auparavant; nous devons alors être en mesure de leur expliquer le processus en détail afin qu'ils comprennent parfaitement nos activités et que nous puissions les aider à définir précisément le périmètre de l'évaluation.

En principe, `les employés ne sont pas informés des tests d'intrusion` à venir. Cependant, les responsables peuvent décider de les en informer, car les employés ont le droit de savoir lorsqu'ils ne peuvent s'attendre à aucune confidentialité.

En tant que testeurs d'intrusion, nous pouvons avoir accès à des données personnelles telles que les noms, adresses, salaires, etc. La meilleure façon de respecter la loi sur la protection des données est de garantir la confidentialité de ces informations. Par exemple, nous pourrions avoir accès à une base de données contenant des numéros de carte bancaire, des noms et des codes CVV. En conséquence, nous recommandons à nos clients d'améliorer et de modifier leurs mots de passe dès que possible et de chiffrer les données de leur base de données.

### Testing Methods

Une étape essentielle du processus consiste à déterminer le point de départ de notre test d'intrusion. Chaque test d'intrusion peut être réalisé selon deux perspectives différentes :

- `External` ou `Internal`

#### External Penetration Test

De nombreux tests d'intrusion sont réalisés depuis l'extérieur ou en tant qu'utilisateur anonyme sur Internet. La plupart des clients souhaitent une protection optimale contre les attaques ciblant leur réseau externe. Nous pouvons effectuer les tests depuis nos propres serveurs (idéalement via une connexion VPN pour éviter le blocage par notre FAI) ou **depuis un VPS**. Certains clients privilégient la discrétion, tandis que d'autres exigent une approche aussi discrète que possible, en approchant les systèmes cibles `sans déclencher de blocage par pare-feu, de détection par IDS/IPS ou d'alarme`. Ils peuvent demander une `approche furtive` ou « `hybride` », où nous augmentons progressivement notre niveau sonore afin de tester leurs capacités de détection. Notre objectif final est d'accéder aux hôtes exposés, d'obtenir des données sensibles ou d'accéder au réseau interne.

#### Internal Penetration Test

Contrairement à un test d'intrusion externe, un test d'intrusion interne consiste à effectuer des tests depuis le réseau de l'entreprise. Cette étape peut être réalisée après avoir réussi à pénétrer le réseau de l'entreprise lors d'un test d'intrusion externe ou suite à une hypothèse de violation de données. Les tests d'intrusion internes permettent également d'accéder à des systèmes isolés, sans aucun accès à Internet, ce qui nécessite généralement notre présence physique dans les locaux du client.

### Types of Penetration Testing

Peu importe la manière dont nous abordons le test d'intrusion, son type est primordial. Ce type détermine la quantité d'informations auxquelles nous avons accès. On peut distinguer les types suivants :

| Type | Description |
|------|-------------|
| **Blackbox Minimal** | Uniquement les informations essentielles sont fournies, telles que les adresses IP et les domaines. |
| **Greybox Extended** | Des informations supplémentaires sont fournies, telles que des URLs spécifiques, des noms d'hôtes, des sous-réseaux et similaires. |
| **Whitebox Maximum** | Tout est divulgué. Cela nous donne une vue interne de l'ensemble de la structure, ce qui permet de préparer une attaque en utilisant des informations internes. Nous pouvons recevoir des configurations détaillées, des identifiants administrateur, le code source d'applications web, etc. |
| **Red-Teaming** | Peut inclure des tests physiques et de l'ingénierie sociale, entre autres. Peut être combiné avec n'importe lequel des types ci-dessus. |
| **Purple-Teaming** | Peut être combiné avec n'importe lequel des types ci-dessus. Cependant, il se concentre sur une collaboration étroite avec les défenseurs. |

Moins nous disposons d'informations, plus l'approche sera longue et complexe. Par exemple, pour un test d'intrusion en boîte noire, nous devons d'abord obtenir une vue d'ensemble des serveurs, hôtes et services présents dans l'infrastructure, surtout si des réseaux entiers sont testés. Ce type de reconnaissance peut prendre beaucoup de temps, notamment si le client a demandé une approche plus discrète.

## Laws and Regulations

Chaque pays possède des lois spécifiques régissant les activités informatiques, la protection des droits d'auteur, l'interception des communications électroniques, l'utilisation et la divulgation des informations de santé protégées, ainsi que la collecte de données personnelles auprès des enfants.

Il est essentiel de respecter ces lois afin de protéger les individus contre tout accès non autorisé à leurs données et leur exploitation, et de **garantir le respect de leur vie privée**. Nous devons connaître ces lois pour nous assurer que nos activités de recherche sont conformes et ne contreviennent à aucune disposition légale. Le non-respect de ces lois peut entraîner des sanctions civiles ou pénales; il est donc essentiel que chacun se familiarise avec la législation et comprenne les conséquences potentielles de ses activités. De plus, il est crucial de veiller à ce que les activités de recherche respectent les exigences de ces lois afin de protéger la vie privée des individus et de prévenir toute utilisation abusive de leurs données. En respectant ces lois et en faisant preuve de prudence lors de leurs recherches, les chercheurs en sécurité peuvent contribuer à garantir la sécurité des données personnelles et la protection des droits des individus. Voici un résumé des lois et réglementations applicables dans quelques pays et régions :

| Categories | USA | Europe | UK | India | China |
|------------|-----|--------|----|----|-------|
| Protection des infrastructures d'information critiques et des données personnelles | Cybersecurity Information Sharing Act (`CISA`) | General Data Protection Regulation (`GDPR`) | Data Protection Act 2018 | Information Technology Act 2000 | Cyber Security Law |
| Criminalisation de l'utilisation malveillante d'ordinateurs et de l'accès non autorisé aux systèmes informatiques | Computer Fraud and Abuse Act (`CFAA`) | Network and Information Systems Directive (`NISD 2`) | Computer Misuse Act 1990 | Information Technology Act 2000 | National Security Law |
| Interdiction de contourner les mesures technologiques protégeant les œuvres protégées par le droit d'auteur | Digital Millennium Copyright Act (`DMCA`) | Cybercrime Convention of the Council of Europe | | | Anti-Terrorism Law |
| Réglementation de l'interception des communications électroniques | Electronic Communications Privacy Act (`ECPA`) | E-Privacy Directive 2002/58/EC | Human Rights Act 1998 (`HRA`) | Indian Evidence Act of 1872 | |
| Gouvernance de l'utilisation et de la divulgation des informations de santé protégées | Health Insurance Portability and Accountability Act (`HIPAA`) | | Police and Justice Act 2006 | Indian Penal Code of 1860 | |
| Réglementation de la collecte d'informations personnelles auprès des enfants | Children's Online Privacy Protection Act (`COPPA`) | | Investigatory Powers Act 2016 (`IPA`) | | |
| Cadre de coopération entre pays pour enquêter et poursuivre la cybercriminalité | | | Regulation of Investigatory Powers Act 2000 (`RIPA`) | | |
| Définition des droits légaux et des protections des individus concernant leurs données personnelles | | | | Personal Data Protection Bill 2019 | Measures for the Security Assessment of Cross-border Transfer of Personal Information and Important Data |
| Définition des droits et libertés fondamentaux des individus | | | | | State Council Regulation on the Protection of Critical Information Infrastructure Security |

### USA

La loi [fédérale américaine sur la fraude et l'abus informatique](https://www.justice.gov/jm/jm-9-48000-computer-fraud) (`CFAA`) érige en infraction pénale l'accès non autorisé à un ordinateur. Elle s'applique aux activités informatiques, notamment le piratage, l'usurpation d'identité et la diffusion de logiciels malveillants. La CFAA a fait l'objet de nombreuses critiques et controverses, certains estimant que ses dispositions sont trop larges et pourraient servir à criminaliser des recherches légitimes en matière de sécurité. De plus, des critiques s'inquiètent du fait que les définitions générales des activités informatiques, telles qu'elles sont formulées dans la CFAA, puissent être interprétées de manière à conduire à des poursuites pour des activités qui n'étaient pas censées constituer des infractions pénales. Par ailleurs, la CFAA est critiquée pour son manque de clarté quant à la signification de certains termes, ce qui rend difficile pour les particuliers de comprendre leurs droits et obligations en vertu de cette loi. C'est pourquoi il est essentiel que chacun se familiarise avec la loi et comprenne les conséquences potentielles de ses activités.

La loi [américaine sur le droit d'auteur du millénaire numérique](https://www.congress.gov/bill/105th-congress/house-bill/2281) (`DMCA`) comprend des dispositions interdisant le contournement des mesures technologiques de protection des œuvres protégées. Ces mesures incluent les verrous numériques, le chiffrement et les protocoles d'authentification, qui protègent les logiciels, les micrologiciels et autres contenus numériques. Les chercheurs en sécurité doivent connaître les dispositions de la DMCA afin de s'assurer que leurs activités de recherche ne contreviennent pas à la loi. Il est important de rappeler que le contournement des mesures de protection du droit d'auteur, même dans le cadre de recherches ou d'activités pédagogiques, peut entraîner des sanctions civiles ou pénales. Par conséquent, les chercheurs doivent faire preuve de prudence et de diligence raisonnable pour éviter toute infraction involontaire à la DMCA.

La loi [américaine sur la protection de la vie privée dans les communications électroniques](https://www.congress.gov/bill/99th-congress/house-bill/4952) (`ECPA`) encadre l'interception des communications électroniques, notamment celles transmises par Internet. Cette loi interdit d'intercepter, d'accéder à, de surveiller ou de stocker des communications sans le consentement de l'une ou des deux parties. De plus, l'ECPA interdit l'utilisation des communications interceptées comme preuve devant un tribunal. L'ECPA définit également les responsabilités des fournisseurs de services, qui ne sont pas autorisés à divulguer le contenu des communications à quiconque autre que l'expéditeur et le destinataire. Ainsi, l'ECPA protège la confidentialité des communications électroniques et garantit que les individus ne soient pas soumis à une interception ou à une utilisation illégale de leurs communications.

La loi `HIPAA` ([Health Insurance Portability and Accountability Act](https://aspe.hhs.gov/reports/health-insurance-portability-accountability-act-1996)) encadre l'utilisation et la divulgation des informations de santé protégées et définit des règles pour la protection des données de santé personnelles stockées électroniquement. Les chercheurs doivent connaître ces exigences et veiller à ce que leurs activités de recherche soient conformes à la réglementation HIPAA. Cela implique notamment de mettre en œuvre des mesures telles que le chiffrement des données, la tenue de registres détaillés des accès aux données et le partage des dossiers. De plus, la recherche doit être menée conformément aux politiques et procédures institutionnelles, et toute modification apportée doit être approuvée par l'instance de gouvernance compétente. Les chercheurs doivent également être attentifs au risque de violation de données et prendre les mesures nécessaires pour garantir la sécurité des informations de santé personnelles. Le non-respect de la réglementation HIPAA peut entraîner de lourdes sanctions juridiques et financières ; les chercheurs doivent donc s'assurer que leurs activités de recherche sont conformes à la loi HIPAA.

La loi [américaine sur la protection de la vie privée des enfants en ligne](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa) (`COPPA`) est une législation importante qui encadre la collecte de données personnelles concernant les enfants de moins de 13 ans. Il est essentiel de connaître les dispositions de la COPPA et de prendre les précautions nécessaires pour que nos activités de recherche respectent ses exigences. Pour se conformer à la COPPA, les chercheurs doivent faire preuve de vigilance et prendre des mesures spécifiques afin de s'assurer qu'ils ne collectent, n'utilisent ni ne divulguent aucune information personnelle concernant des enfants de moins de 13 ans. Le non-respect de la COPPA peut entraîner des poursuites judiciaires et des sanctions ; les chercheurs en sécurité doivent donc se familiariser avec cette loi et s'y conformer.

### Europe

Le [Règlement général sur la protection des données](https://gdpr-info.eu/) (`RGPD`) encadre le traitement des données personnelles, renforce les droits des personnes concernées et prévoit des sanctions pouvant atteindre 4 % du chiffre d'affaires annuel mondial ou 20 millions d'euros, le montant le plus élevé étant retenu, en cas de non-conformité. Les chercheurs en sécurité doivent connaître ces dispositions et s'assurer que leurs recherches sont conformes au RGPD. Il est important de noter que le RGPD s'applique à toute entreprise traitant les données personnelles de citoyens de l'UE, quel que soit son lieu d'établissement.

La [directive relative aux réseaux et systèmes d'information](https://www.enisa.europa.eu/topics/cybersecurity-policy/nis-directive-new) (`DRIS`) impose aux opérateurs de services essentiels et aux fournisseurs de services numériques de prendre les mesures de sécurité appropriées et de signaler les incidents spécifiques. Il est important de noter que la DRIS s'applique à diverses organisations et personnes, y compris celles qui effectuent des tests d'intrusion et des recherches en sécurité.

La [Convention du Conseil de l’Europe](https://www.europarl.europa.eu/cmsdata/179163/20090225ATT50418EN.pdf) sur la cybercriminalité, premier traité international relatif aux crimes commis via Internet et autres réseaux informatiques, établit un cadre de coopération entre les pays pour enquêter sur la cybercriminalité et la poursuivre.

La [directive 2002/58/CE](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32002L0058) relative à la vie privée dans le secteur des communications électroniques encadre le traitement des données à caractère personnel dans le secteur des communications électroniques. Cette directive s'applique au traitement des données à caractère personnel effectué dans le cadre de la fourniture de services de communications électroniques accessibles au public au sein de l'Union européenne.

### UK

La loi de 1990 sur la cybercriminalité ([Computer Misuse Act 1990](https://www.legislation.gov.uk/ukpga/1990/18/contents)) a été introduite pour lutter contre l'utilisation malveillante des ordinateurs. Accéder à un système informatique sans autorisation, modifier des données sans permission ou utiliser des ordinateurs à des fins frauduleuses ou autres activités illégales constitue une infraction pénale. Cette loi autorise également la confiscation des ordinateurs et autres appareils utilisés pour commettre une infraction informatique et encourage le signalement des incidents de cybercriminalité aux autorités compétentes. Elle prévoit également la mise en œuvre de diverses mesures de prévention, notamment la création d'une équipe spéciale des forces de l'ordre et la mise en place de mesures de sécurité appropriées.

La loi de 2018 sur la protection des données ([Data Protection Act 2018](https://www.legislation.gov.uk/ukpga/2018/12/contents/enacted)) est un texte législatif important qui confère aux individus certains droits et protections concernant leurs données personnelles. Elle détaille les droits des personnes, tels que le droit d'accès à leurs données, le droit de rectification et le droit d'opposition au traitement. Elle définit également les obligations des responsables du traitement des données personnelles, notamment l'obligation de traiter les données de manière sécurisée et transparente et de fournir aux individus des informations claires et compréhensibles sur l'utilisation de leurs données. En prenant en compte cette loi, les chercheurs en sécurité peuvent s'assurer que leurs recherches sont menées de manière responsable et légale. La loi de 1998 sur les droits de l'homme (Human Rights Act 1998 - HRA) est une loi importante du Royaume-Uni qui définit les droits et libertés fondamentaux des individus. Elle intègre la Convention européenne des droits de l'homme dans le droit britannique. Elle garantit à chacun le droit à un traitement juste et égal dans divers domaines, tels que le droit à un procès équitable, le droit au respect de la vie privée et familiale et le droit à la liberté d'expression. Elle confère également aux individus le droit d'accéder à des recours judiciaires en cas de violation de leurs droits. La loi leur donne aussi le droit de contester la légalité de toute loi ou mesure administrative qui viole leurs droits et libertés fondamentaux. La HRA est une loi essentielle qui contribue à protéger les individus contre les abus de pouvoir et garantit le respect de leurs droits.

La loi de 2006 sur la police et la justice ([Police and Justice Act 2006](https://www.legislation.gov.uk/ukpga/2006/48/contents()) est une loi du Parlement britannique visant à établir un cadre global pour la réforme du système de justice pénale et des forces de l'ordre. Cette loi a créé plusieurs nouvelles infractions pénales, notamment l'incitation à la haine religieuse, et a instauré des mesures pour protéger les enfants contre l'exploitation et les adultes vulnérables. Elle prévoyait également la création de l'Agence de lutte contre la criminalité organisée et d'une base de données nationale d'ADN. La loi établissait aussi de nouvelles mesures pour lutter contre les comportements antisociaux, notamment l'introduction d'ordonnances d'interdiction de comportements antisociaux. De plus, elle comprenait des dispositions visant à moderniser le système des coroners et à octroyer des pouvoirs supplémentaires à la police pour lutter contre le terrorisme. Enfin, la loi cherchait à améliorer les droits des victimes d'actes criminels et à renforcer la protection des victimes de violence domestique.

La [loi de 2016 sur les pouvoirs d'enquête](https://www.legislation.gov.uk/ukpga/2016/25/contents/enacted) (`IPA`) réglemente l'utilisation des pouvoirs d'enquête par les forces de l'ordre et les services de renseignement, y compris le piratage informatique et d'autres formes de surveillance numérique. L'IPA impose également aux fournisseurs d'accès à Internet et autres fournisseurs de services de communication de conserver certains types de données pendant une période déterminée.

La [loi de 2000 sur la réglementation des pouvoirs d'enquête](https://www.legislation.gov.uk/ukpga/2000/23/contents) (`RIPA`) réglemente l'utilisation par les autorités publiques de techniques d'enquête secrètes, notamment le piratage informatique et d'autres formes de surveillance numérique.

### India

La loi indienne sur les technologies de l'information de 2000 ([Information Technology Act 2000](https://www.indiacode.nic.in/bitstream/123456789/13116/1/it_act_2000_updated.pdf)) prévoit la reconnaissance juridique des transactions effectuées par échange de données informatisé et autres moyens de communication électronique. Elle érige également en infraction le piratage informatique et tout autre accès non autorisé aux systèmes informatiques, et impose des sanctions pour de tels actes.

Le projet de loi sur la protection des données personnelles de 2019 ([Personal Data Protection Bill 2019](https://www.congress.gov/bill/116th-congress/senate-bill/2889)) vise à protéger les données personnelles des individus et à sanctionner les infractions.

La loi indienne sur la preuve de 1872 ([Indian Evidence Act 1872](https://legislative.gov.in/sites/default/files/A1872-01.pdf)) et le Code pénal indien de 1860 (Indian Penal Code 1860) contiennent des dispositions applicables en cas de cybercriminalité, notamment le piratage informatique et l'accès non autorisé aux systèmes informatiques. Les chercheurs en sécurité doivent connaître ces lois et veiller à ce que leurs recherches soient conformes à la législation en vigueur.

### China

La [loi sur la cybersécurité](https://digichina.stanford.edu/work/translation-cybersecurity-law-of-the-peoples-republic-of-china-effective-june-1-2017/) établit un cadre juridique pour la protection des infrastructures d'information critiques et des données personnelles. Elle impose aux organisations de se conformer à certaines mesures de sécurité et de signaler certains types d'incidents de sécurité.

La [loi sur la sécurité nationale](https://www.chinalawtranslate.com/en/2015nsl/#gsc.tab=0) érige en infraction les activités qui menacent la sécurité nationale, notamment le piratage informatique et tout autre accès non autorisé aux systèmes informatiques.

La [loi antiterroriste](https://ni.china-embassy.gov.cn/esp/sgxw/202402/t20240201_11237595.htm) érige en infraction les activités qui soutiennent ou encouragent le terrorisme, notamment le piratage informatique et tout autre accès non autorisé aux systèmes informatiques.

Les [mesures relatives à l'évaluation de la sécurité des transferts transfrontaliers](https://www.mayerbrown.com/en/insights/publications/2022/07/china-s-security-assessments-for-cross-border-data-transfers-effective-september-2022) d'informations personnelles et de données importantes encadrent les transferts transfrontaliers d'informations personnelles et de données importantes. Elles imposent également aux organisations de réaliser des évaluations de sécurité et d'obtenir l'autorisation des autorités compétentes avant tout transfert de ces données.

Le [règlement du Conseil d'État relatif à la protection de la sécurité des infrastructures](https://english.www.gov.cn/policies/latestreleases/202108/17/content_WS611b8062c6d0df57f98de907.html) d'information critiques encadre la protection de ces infrastructures. Il impose également aux organisations de prendre certaines mesures de sécurité et de signaler certains types d'incidents de sécurité.

## Penetration Testing Process

En sciences sociales, un processus désigne une séquence d'événements ordonnée. Dans un contexte opérationnel et organisationnel, on parle plus précisément de processus de travail, d'affaires, de production ou de création de valeur. Les processus sont également appelés programmes exécutés dans les systèmes informatiques, qui font généralement partie du logiciel système.

Il est également essentiel de distinguer les processus `déterministes` des processus `stochastiques`. Un processus déterministe est un processus dans lequel `chaque état dépend causalement des états et événements précédents` et est déterminé par eux. Un processus stochastique est un processus dans lequel `un état découle d'autres états` avec une certaine probabilité seulement. Dans ce cas, seules des conditions statistiques peuvent être prises en compte. Pour nous, plusieurs de ces définitions se recoupent. Nous utilisons la définition du processus de test d'intrusion issue des sciences sociales pour représenter un enchaînement d'événements liés à des processus déterministes. En effet, toutes nos étapes reposent sur les événements et les résultats que nous pouvons découvrir ou provoquer.

> Un processus de test d'intrusion est défini par des étapes et des événements successifs réalisés par le testeur d'intrusion pour trouver un chemin vers l'objectif prédéfini.
{: .prompt-info}

Les processus décrivent une séquence d'opérations précise, réalisée dans un laps de temps donné, permettant d'atteindre le résultat souhaité. Il est essentiel de noter que les processus ne constituent pas une recette figée ni un guide pas à pas. Nos processus de tests d'intrusion doivent donc être à la fois généraux et flexibles. En effet, chaque client possède une infrastructure, des besoins et des attentes qui lui sont propres.

### Penetration Testing Stages

La manière la plus efficace de représenter et de définir ces processus est de les décomposer en **étapes interdépendantes**. Nos recherches montrent souvent qu'ils se présentent sous la forme d'un processus circulaire. Si l'on examine ce processus de plus près et que l'on imagine qu'un seul de ses composants soit défaillant, l'ensemble du processus est perturbé. En d'autres termes, le processus entier échoue. Si l'on part du principe que l'on recommence ce processus depuis le début, en intégrant les nouvelles informations acquises, on obtient une nouvelle approche qui ne remet pas en cause la précédente.

Le problème est qu'avec ces représentations et approches, il est souvent difficile de faire évoluer notre processus de test d'intrusion. Comme nous l'avons évoqué, il n'existe pas de guide pas à pas à suivre, mais des étapes permettant de moduler et d'adapter les différentes actions et approches aux résultats et aux informations obtenus. Nous pouvons certes élaborer notre propre stratégie pour les différentes actions entreprises aux différentes étapes d'un test d'intrusion, mais chaque environnement étant différent, une adaptation constante est nécessaire.

![stages](https://academy.hackthebox.com/storage/modules/90/0-PT-Process.png)

Nous allons examiner chacune de ces étapes plus en détail et aborder leurs spécificités dans les sections suivantes. Nous vous proposerons également un plan d'étude optionnel pour apprendre les nombreuses tactiques, techniques et procédures (TTP), en utilisant une structure qui montre comment chaque étape s'appuie sur la précédente et peut être itérative. Tout d'abord, examinons les grandes composantes du processus de test d'intrusion et discutons des modules individuels et de leur importance.

Ce plan d'étude optionnel est basé sur des ensembles de modules pour chaque étape. Nous vous recommandons de les suivre avant de passer à la suivante. Nous aborderons différentes phases dans presque tous les modules, en répétant des étapes telles que la collecte d'informations, la progression latérale et l'exploration. La séparation des modules vise à se concentrer sur le sujet, qui requiert des connaissances spécifiques qu'il ne faut pas négliger. Toute lacune dans ces connaissances, même si nous pensons les maîtriser, peut entraîner des malentendus ou des difficultés au cours de l'étude. En conséquence, le processus de test d'intrusion et ses étapes se présentent comme suit :

#### Pre-Engagement

La phase de pré-engagement consiste à informer le client et à adapter le contrat. Tous les tests nécessaires et leurs composantes sont clairement définis et consignés contractuellement. Lors d'une réunion en face à face ou d'une téléconférence, plusieurs points sont abordés, notamment :

- Accord de confidentialité
- Objectifs
- Périmètre d'intervention
- Estimation du temps
- Règles d'intervention

#### Information Gathering

La collecte d'informations décrit comment nous obtenons des renseignements sur les composants nécessaires de différentes manières. Nous recherchons des informations sur l'entreprise cible, ainsi que sur les logiciels et le matériel utilisés, afin de déceler d'éventuelles failles de sécurité que nous pourrions exploiter pour nous infiltrer.

#### Vulnerability Assessment

Une fois l'étape d'évaluation des vulnérabilités atteinte, nous analysons les résultats de la phase de collecte d'informations afin d'identifier les vulnérabilités connues des systèmes, des applications et de leurs différentes versions, et ainsi découvrir d'éventuels vecteurs d'attaque. L'évaluation des vulnérabilités consiste à analyser les vulnérabilités potentielles, manuellement et automatiquement. Elle permet de déterminer le niveau de menace et la vulnérabilité de l'infrastructure réseau d'une entreprise aux cyberattaques.

#### Exploitation

Lors de la phase d'exploitation, nous utilisons les résultats pour tester nos attaques contre les vecteurs potentiels et les exécuter contre les systèmes cibles afin d'obtenir un accès initial à ces systèmes.

#### Post-Exploitation

À ce stade du test d'intrusion, nous avons déjà accès à la machine compromise et nous nous assurons de conserver cet accès même en cas de modifications. Durant cette phase, nous pouvons tenter d'élever nos privilèges afin d'obtenir les droits les plus élevés et de rechercher des données sensibles, telles que des identifiants ou d'autres données que le client souhaite protéger (vol de données). Nous effectuons parfois une post-exploitation pour démontrer au client l'impact de notre intrusion. Dans d'autres cas, cette post-exploitation sert de base au processus de déplacement latéral décrit ci-après.

#### Lateral Movement

Le déplacement latéral désigne le déplacement au sein du réseau interne de l'entreprise cible pour accéder à d'autres hôtes avec un niveau de privilèges égal ou supérieur. Il s'agit souvent d'un processus itératif, combiné à des activités post-exploitation, jusqu'à l'atteinte de l'objectif. Par exemple, nous obtenons un accès à un serveur web, élevons nos privilèges et trouvons un mot de passe dans le registre. Nous poursuivons l'analyse et constatons que ce mot de passe permet d'accéder à un serveur de base de données en tant qu'administrateur local. À partir de là, nous pouvons extraire des données sensibles de la base de données et trouver d'autres identifiants pour étendre notre accès plus profondément au réseau. À cette étape, nous utilisons généralement diverses techniques en fonction des informations trouvées sur l'hôte ou le serveur compromis.

#### Proof-of-Concept

Dans cette étape, nous documentons en détail les actions entreprises pour compromettre le réseau ou obtenir un certain niveau d'accès. Notre objectif est de démontrer comment nous avons exploité plusieurs failles pour atteindre notre but, afin que le client comprenne clairement le rôle de chaque vulnérabilité et puisse ainsi prioriser ses efforts de remédiation. Un manque de documentation rend difficile la compréhension de nos actions par le client et complique d'autant plus ses efforts de remédiation. Si possible, nous pouvons créer un ou plusieurs scripts pour automatiser les étapes suivies et aider le client à reproduire nos résultats. Ce point est abordé en détail dans le module « Documentation et rapports ».

#### Post-Engagement

Après notre intervention, nous préparons une documentation détaillée à destination des administrateurs et de la direction de l'entreprise cliente afin de leur permettre d'appréhender la gravité des vulnérabilités identifiées. À ce stade, nous effaçons également toute trace de notre intervention sur l'ensemble des hôtes et serveurs. Nous créons ensuite les livrables pour notre client, organisons une réunion de présentation du rapport et, le cas échéant, présentons un exposé aux dirigeants ou au conseil d'administration de l'entreprise cible. Enfin, conformément à nos obligations contractuelles et à la politique de l'entreprise, nous archivons nos données de test. Ces données sont généralement conservées pendant une période déterminée ou jusqu'à la réalisation d'une évaluation post-correction (retest) afin de vérifier l'efficacité des correctifs mis en place par le client.

