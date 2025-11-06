---
title: "HackTheBox - Getting Started - infosec overview"
date: 2025-11-05 23:22:00 +0200
categories: [HackTheBox, Learning]
tags: [learning]
description: "Write-up du module Getting Started - infosec overview"
image:
  path: /assets/img/posts/getting-started.png
  alt: "infosec overview"
---

## Informations sur la room

Découvrez le cours HTB sur l'Exploitation

**Lien :** [Infosec Overview](https://academy.hackthebox.com/beta/module/77/section/721)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Comprendre comment marche les VPN pour se connecter aux machines HTB
- Comprendre quelques infos de bases pour bien commencer

---

## Infosec Overview

[La sécurité de l'information](https://en.wikipedia.org/wiki/Information_security) (infosec) est un vaste domaine qui a connu une croissance et une évolution considérables ces dernières années. Elle offre de nombreuses spécialisations, notamment :

- Sécurité des réseaux et des infrastructures
- Sécurité des applications
- Tests de sécurité
- Audit des systèmes
- Planification de la continuité des activités
- Analyse forensique numérique
- Détection et réponse aux incidents

En résumé, la sécurité de l'information (ou cybersécurité) consiste à **protéger les données** contre les accès non autorisés, les modifications, les utilisations illicites, les interruptions, etc. Les professionnels de la sécurité de l'information prennent également des mesures pour minimiser l'impact de tout incident de ce type.

Les données peuvent être électroniques ou physiques, tangibles (par exemple, des plans de conception) ou intangibles (connaissances). Un concept fondamental du métier de la sécurité de l'information est la protection de la confidentialité, de l'intégrité et de la disponibilité des données, ou le `triptyque CIA` (CIA triad).

### Risk Management Process

La protection des données doit privilégier une mise en œuvre efficace et efficiente des politiques, sans impacter négativement les opérations et la productivité de l'organisation. Pour ce faire, les organisations doivent suivre un `processus de gestion des risques`, qui comprend les cinq étapes suivantes :

| Étape | Explication |
|-------|-------------|
| **Identifying the Risk** | Identifier les risques auxquels l'entreprise est exposée, tels que les risques juridiques, environnementaux, de marché, réglementaires et autres types de risques. |
| **Analyze the Risk** | Analyser les risques pour déterminer leur impact et leur probabilité. Les risques doivent être associés aux différentes politiques, procédures et processus métier de l'organisation. |
| **Evaluate the Risk** | Évaluer, classer et hiérarchiser les risques. Ensuite, l'organisation doit décider d'accepter (inévitable), d'éviter (modifier les plans), de contrôler (atténuer) ou de transférer le risque (assurer). |
| **Dealing with Risk** | Éliminer ou contenir les risques du mieux possible. Cela est géré en s'interfaçant directement avec les parties prenantes du système ou du processus auquel le risque est associé. |
| **Monitoring Risk** | Tous les risques doivent être constamment surveillés. Les risques doivent être constamment surveillés pour tout changement de situation qui pourrait modifier leur score d'impact, `c'est-à-dire passer d'un impact faible à moyen ou élevé`. |

Comme mentionné précédemment, le principe fondamental de la sécurité de l'information est la garantie de l'information, c'est-à-dire le maintien de l'intégrité, de la disponibilité et de l'accessibilité des données, et la garantie qu'elles ne soient compromises d'aucune manière, sous aucune forme, en cas d'incident. Un incident peut être une catastrophe naturelle, un dysfonctionnement du système ou une faille de sécurité.

### Red Team vs. Blue Team

En cybersécurité, on entend souvent parler de la `red team` et de la `blue team`. En termes simples, la `red team` joue le **rôle des attaquants**, tandis que la `blue team` **joue celui des défenseurs**.

Les membres de la **red team** simulent une intrusion dans l'organisation afin d'identifier les failles potentielles que de véritables attaquants pourraient exploiter pour compromettre ses défenses. Leurs tâches les plus courantes consistent à réaliser des tests d'intrusion, de l'ingénierie sociale et d'autres techniques offensives similaires.

La **blue team**, quant à elle, **représente la majorité des emplois en cybersécurité**. Elle est chargée de **renforcer les défenses** de l'organisation en analysant les risques, en élaborant des politiques de sécurité, en répondant aux menaces et aux incidents, et en utilisant efficacement les outils de sécurité, entre autres tâches similaires.

### Role of Penetration Testers

Un évaluateur de sécurité (testeur d'intrusion réseau, testeur d'intrusion d'applications web, membre de la red team, etc.) aide une organisation à identifier les risques liés à ses réseaux externes et internes. Ces risques peuvent inclure des vulnérabilités réseau ou d'applications web, la divulgation de données sensibles, des erreurs de configuration ou des problèmes susceptibles de nuire à sa réputation. Un bon testeur peut collaborer avec un client pour **identifier les risques pesant sur son organisation**, fournir des informations sur la manière de les reproduire et des conseils sur les mesures d'atténuation ou de correction des problèmes identifiés lors des tests.

Les évaluations peuvent prendre différentes formes : un test d'intrusion en `boîte blanche` (white box) couvrant l'ensemble des systèmes et applications concernés afin d'identifier un maximum de vulnérabilités; une **évaluation du phishing** pour évaluer le risque ou la **sensibilisation des employés à la sécurité**; ou encore une évaluation ciblée de type red team basée sur un scénario **simulant une attaque réelle**.

Il est essentiel d'avoir une vision globale des risques auxquels une organisation est confrontée et de son environnement afin d'évaluer et de hiérarchiser avec précision les vulnérabilités découvertes lors des tests. Une compréhension approfondie du processus de gestion des risques est cruciale pour toute personne débutant dans le domaine de la sécurité de l'information.

Ce module vous apprendra à débuter en cybersécurité et en tests d'intrusion de manière pratique. Vous découvrirez notamment comment choisir et utiliser une distribution Linux dédiée aux tests d'intrusion, les technologies courantes et les outils essentiels, les différents niveaux et les fondamentaux des tests d'intrusion, comment pirater votre première machine sur Hack the Box**, comment trouver et demander de l'aide efficacement, les problèmes potentiels les plus fréquents et comment naviguer sur la plateforme Hack the Box.

Bien que ce module utilise la plateforme Hack the Box et des machines volontairement vulnérables comme exemples, les compétences fondamentales présentées sont applicables à tout environnement.

## Getting Started with a Pentest Distro

Toute personne souhaitant s'orienter vers une carrière technique en sécurité informatique doit maîtriser un **large éventail de technologies et de systèmes d'exploitation**. En tant que testeurs d'intrusion, nous devons savoir **configurer, maintenir et sécuriser** des machines d'attaque **Linux et Windows**. Selon l'environnement du client ou la portée de l'évaluation, nous pouvons utiliser une machine virtuelle Linux ou Windows sur notre poste, notre système d'exploitation principal, un serveur Linux dans le cloud, une machine virtuelle installée chez le client, ou même effectuer des tests directement depuis un poste de travail du client pour simuler une menace interne (en cas de violation de données).

### Choosing a Distro

Il existe de nombreuses distributions Linux (**distros**) pour les tests d'intrusion. Plusieurs distributions préexistantes **basées sur Debian** intègrent de nombreux outils nécessaires à nos évaluations. Cependant, nombre de ces outils sont rarement utilisés, et aucune distribution ne contient l'ensemble des outils requis. Au fil de notre expérience, nous nous orientons vers des outils spécifiques et établissons une liste de « **compléments indispensables** » à ajouter à toute nouvelle distribution. Avec l'expérience, nous pouvons même préférer personnaliser entièrement notre propre machine virtuelle de test d'intrusion à partir d'une image de base Debian ou Ubuntu, mais la création d'une machine virtuelle entièrement personnalisée dépasse le cadre de ce module.

Le choix d'une distribution est personnel et, comme mentionné précédemment, il est même possible de créer et de maintenir sa propre distribution. Il existe d'innombrables distributions Linux répondant à divers besoins : certaines sont spécifiquement conçues pour les tests d'intrusion, d'autres sont orientées vers les tests d'intrusion d'applications web, l'analyse forensique, etc.

Cette section abordera la configuration et l'utilisation de `Parrot OS`. Cette distribution est utilisée pour la `Pwnbox` que nous verrons tout au long de l'Académie, personnalisée pour pratiquer et résoudre les exercices des différents modules que nous rencontrerons.

![ParrorOS](https://www.parrotsec.org/_next/static/media/htb-1.14502f45.png)

Il est important de noter que chaque test d'intrusion ou évaluation de sécurité doit être réalisé à partir d'une machine virtuelle fraîchement installée afin d'éviter d'inclure par inadvertance des informations sensibles provenant d'un autre environnement client dans nos rapports ou de conserver des données confidentielles du client pendant une période prolongée. C'est pourquoi nous devons pouvoir déployer rapidement une nouvelle machine de test d'intrusion et disposer de processus (automatisation, scripts, procédures détaillées, etc.) permettant de configurer rapidement la ou les distributions Linux de notre choix pour chaque évaluation.

### Setting Up a Pentest Distro

Il existe plusieurs façons de configurer notre distribution Linux pour les tests d'intrusion. On peut l'installer comme système d'exploitation principal (bien que déconseillé), configurer notre poste de travail en dual boot (mais fastidieux de basculer constamment entre les deux systèmes), ou l'installer via la virtualisation.

Plusieurs options s'offrent à nous : [Hyper-V](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/overview?pivots=windows) sous Windows, les [machines virtuelles sur des hyperviseurs dédiés](https://www.vmware.com/topics/bare-metal-hypervisor) comme [Proxmox](https://proxmox.com/en/) ou [VMware ESXi](https://www.vmware.com/products/cloud-infrastructure/vsphere), ou encore des hyperviseurs gratuits tels que [VirtualBox](https://www.virtualbox.org/) ou [VMware Workstation Player](https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion), qui peuvent être installés et utilisés comme hyperviseurs sous Windows et Linux.

[VMware Workstation](https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion) est une autre option, désormais disponible gratuitement pour tous.

Un hyperviseur est un logiciel qui permet de **créer et d'exécuter des machines virtuelles (VM)**. Il nous permet d'utiliser notre ordinateur hôte (fixe ou portable) pour exécuter plusieurs VM en partageant virtuellement la mémoire et les ressources de traitement. Les machines virtuelles (VM) exécutées sur un hyperviseur sont `isolées du système d'exploitation principal`, ce qui offre une couche d'isolation et de **protection entre notre réseau de production et les réseaux vulnérables**, tels que Hack The Box, ou lors de la connexion à des environnements clients depuis une VM (bien que des vulnérabilités d'échappement de VM apparaissent ponctuellement).

Selon les ressources disponibles sur notre système hôte (par exemple, la RAM), nous pouvons généralement exécuter plusieurs VM simultanément. Il est souvent utile de déployer une VM lors d'une évaluation pour tester une vulnérabilité ou tenter de recréer une application cible, et de déployer des machines virtuelles dans un environnement de laboratoire pour tester les outils, les exploits et les techniques les plus récents. Toute personne occupant un poste technique en sécurité de l'information devrait **maîtriser l'utilisation d'un ou plusieurs hyperviseurs et la création de machines virtuelles**, tant pour le travail que pour la pratique.

Pour réussir, nous devons constamment perfectionner nos compétences. Un excellent moyen d'y parvenir est de mettre en place un laboratoire personnel pour tenter de reproduire des vulnérabilités, installer des applications et des services vulnérables, observer l'impact des recommandations de correction et disposer d'un environnement sécurisé pour s'exercer à de nouvelles techniques d'attaque et exploits. Nous pouvons construire notre laboratoire sur un vieil ordinateur portable ou de bureau, mais il est préférable d'utiliser un serveur pour installer un hyperviseur bare metal.

![ParrotOS_2](https://academy.hackthebox.com/storage/modules/77/notebook.png)

Pour nos besoins, nous utiliserons une version modifiée de Parrot Security (Pwnbox), disponible [ici](https://www.parrotsec.org/download/), afin de créer une machine virtuelle locale. Deux formats sont possibles :

- Image disque optique (ISO)
- Appliance virtuelle ouverte (OVA)

#### ISO

Le fichier `ISO` est essentiellement un CD-ROM que l'on peut monter dans l'hyperviseur de son choix pour créer la machine virtuelle en y installant soi-même le système d'exploitation. L'ISO offre une plus grande flexibilité de personnalisation (disposition du clavier, paramètres régionaux, environnement de bureau, partitionnement personnalisé, etc.) et permet ainsi une configuration plus précise de la machine virtuelle d'attaque.

#### OVA

Le fichier `OVA` est une machine virtuelle préconfigurée contenant un fichier XML `OVF` spécifiant les paramètres matériels de la machine virtuelle et un fichier `VMDK`, qui représente le disque virtuel sur lequel le système d'exploitation est installé. Un fichier `OVA` étant préconfiguré, son déploiement est rapide, permettant une mise en service immédiate.

Une fois le système opérationnel, vous pouvez explorer ses fonctionnalités, vous familiariser avec ses outils et effectuer les personnalisations souhaitées. L'équipe Parrot Linux met à votre disposition une documentation complète et utile.

- [What is Parrot?](https://www.parrotsec.org/docs/introduction/what-is-parrot/)
- [Installation](https://www.parrotsec.org/docs/installation/)
- [Configuration](https://www.parrotsec.org/docs/configuration/parrot-software-management/)

### Practicing with Parrot

Nous utiliserons **Parrot Linux** tout au long de ce module. La version web, ou **Pwnbox**, est disponible dans toutes les sections nécessitant une interaction avec un hôte cible de notre environnement de laboratoire. Cliquez sur le bouton « `Démarrer une instance` » ci-dessous pour vous familiariser avec **Pwnbox**. Toutes les sections interactives du module peuvent être réalisées depuis notre propre machine virtuelle après avoir déployé une image Docker ou un ou plusieurs hôtes cibles et téléchargé une `clé VPN`. L'utilisation de Pwnbox n'est pas obligatoire, mais elle est pratique car elle permet de réaliser tous les travaux du module **directement dans le navigateur, sans logiciel de virtualisation ni ressources supplémentaires**.

**Les instances Docker sont accessibles sans connexion VPN**. Certains hôtes (par exemple, les cibles Active Directory) nécessitent un accès VPN s'ils ne sont pas accessibles depuis **Pwnbox**. Dans ce cas, un bouton permettant de télécharger une clé VPN apparaîtra après le déploiement de la cible. Nous commencerons à travailler avec les hôtes cibles plus tard dans ce module.

## Staying Organized

Que ce soit pour des évaluations clients, des CTF, des formations (en présentiel ou ailleurs) ou des sessions de simulation HTB, **l'organisation est primordiale**. Il est essentiel de privilégier une **documentation claire et précise dès le départ**. Cette compétence nous sera utile quel que soit notre parcours en sécurité informatique ou dans d'autres domaines professionnels.

### Folder Structure

Lors d'une attaque ciblant un seul poste, un environnement de laboratoire ou un client, il est essentiel `d'organiser clairement les dossiers` de la machine d'attaque afin d'y stocker des données telles que : informations de cadrage, données d'énumération, preuves de tentatives d'exploitation, données sensibles (identifiants, etc.) et autres données obtenues lors des phases de reconnaissance, d'exploitation et de post-exploitation. Voici un exemple d'organisation :

```bash
Arcony@htb[/htb]$ tree Projects/

Projects/
└── Acme Company
    ├── EPT
    │   ├── evidence
    │   │   ├── credentials
    │   │   ├── data
    │   │   └── screenshots
    │   ├── logs
    │   ├── scans
    │   ├── scope
    │   └── tools
    └── IPT
        ├── evidence
        │   ├── credentials
        │   ├── data
        │   └── screenshots
        ├── logs
        ├── scans
        ├── scope
        └── tools
```

Nous avons ici un dossier pour le client `Acme Company` contenant deux évaluations : un test d'intrusion interne (`IPT`) et un test d'intrusion externe (`EPT`). Chaque dossier comprend des sous-dossiers pour l'enregistrement des données d'analyse, des outils pertinents, des journaux de sortie, des informations de cadrage (listes d'adresses IP et de réseaux à fournir à nos outils d'analyse) et un dossier de preuves pouvant contenir les identifiants récupérés lors de l'évaluation, les données pertinentes collectées ainsi que des captures d'écran.

C'est une question de **préférence personnelle** : certains créent un dossier par hôte cible et y enregistrent les captures d'écran. D'autres organisent leurs notes par hôte ou réseau et enregistrent les captures d'écran directement dans leur outil de prise de notes. N'hésitez pas à expérimenter différentes structures de dossiers pour trouver celle qui vous convient le mieux et vous permet de travailler plus efficacement.

### Note Taking Tools

La productivité et l'organisation sont essentielles. Un testeur d'intrusion très technique mais désorganisé aura du mal à réussir dans ce secteur. Différents outils permettent de s'organiser et de `prendre des notes`. Le choix d'un outil de prise de notes est très personnel. Certaines fonctionnalités peuvent être superflues pour certains, mais indispensables pour d'autres. Voici quelques options intéressantes à explorer :

- [Cherrytree](https://www.giuspen.com/cherrytree/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Evernote](https://evernote.com/fr-fr)
- [Notion](https://www.notion.com/)
- [GitBook](https://www.gitbook.com/)
- [Sublime Text](https://www.sublimetext.com/)
- [Notepad++](https://notepad-plus-plus.org/downloads/)

Certains de ces outils sont davantage axés sur la prise de notes, tandis que d'autres, comme **Notion** et **GitBook**, offrent des fonctionnalités plus complètes permettant de créer des pages de type wiki, des aide-mémoire, etc. Il est essentiel de veiller à ce que les données des clients soient stockées localement et non synchronisées avec le cloud lors de l'utilisation de ces outils dans le cadre d'évaluations réelles.

> Apprendre le langage [Markdown](https://en.wikipedia.org/wiki/Markdown) est facile et très utile pour la prise de notes, car il permet de représenter facilement le contenu de manière visuellement attrayante et organisée.
{: .prompt-tip}

### Other Tools and Tips

Tout professionnel de la sécurité informatique devrait tenir à jour une base de connaissances. Le format est libre (bien que les outils mentionnés ci-dessus soient recommandés). Cette base de connaissances devrait contenir des guides de référence rapide pour les tâches de configuration effectuées lors de la plupart des évaluations, ainsi que des aide-mémoires pour les commandes courantes utilisées à chaque phase d'une évaluation.

Au fur et à mesure que nous réalisons des exercices pratiques, des laboratoires, des évaluations, des formations, etc., nous devrions centraliser toutes les informations concernant les charges utiles, les commandes et les astuces, car on ne sait jamais quand elles pourraient s'avérer utiles. Avoir ces informations à portée de main améliorera notre efficacité et notre productivité globales. Chaque module de la HTB Academy contient un aide-mémoire des commandes pertinentes, présenté dans les sections du module, que vous pouvez télécharger et conserver pour consultation ultérieure.

Nous devrions également tenir à jour des listes de contrôle, des modèles de rapports pour différents types d'évaluations et constituer une base de données des constats/vulnérabilités. Cette base de données peut prendre la forme d'une feuille de calcul ou d'un format plus complexe et inclure le titre du constat, sa description, son impact, des conseils de remédiation et des références. Le fait que ces résultats soient déjà rédigés nous permettra de gagner un temps considérable et d'éviter des corrections lors de la phase de rédaction du rapport, car l'essentiel des résultats sera déjà écrit et ne nécessitera probablement qu'une légère adaptation à l'environnement cible.

### Moving On

Testez différents outils de prise de notes et créez une structure de dossiers qui vous convient et qui correspond à votre méthode de travail. Commencez tôt pour prendre cette habitude ! Le tutoriel Nibbles, plus loin dans ce module, est une excellente occasion de mettre en pratique nos conseils de documentation. Ce module contient également de nombreuses commandes utiles à ajouter à notre aide-mémoire.

## Connecting Using VPN

Un [réseau privé virtuel (VPN)](https://en.wikipedia.org/wiki/Virtual_private_network) permet de se connecter à un réseau privé (interne) et d'accéder à ses hôtes et ressources comme si l'on était directement connecté à ce réseau. Il s'agit d'un canal de communication sécurisé utilisant des réseaux publics partagés pour se connecter à un réseau privé (par exemple, un employé se connectant à distance au réseau de son entreprise depuis son domicile). Les VPN offrent un niveau de confidentialité et de sécurité élevé en chiffrant les communications afin d'empêcher toute écoute clandestine et tout accès aux données transitant par le canal.

![VPN](https://academy.hackthebox.com/storage/modules/77/GettingStarted.png)

En résumé, un VPN fonctionne en faisant **transiter la connexion Internet de votre appareil par le serveur privé du VPN cible**, au lieu de votre fournisseur d'accès Internet (FAI). Une fois connecté à un VPN, les données proviennent du serveur VPN et non de votre ordinateur, et apparaissent comme provenant d'une adresse IP publique différente de la vôtre.

Il existe deux principaux types de VPN d'accès distant : les VPN clients et les VPN SSL. Les VPN SSL utilisent le navigateur web comme client VPN. La connexion s'établit entre le navigateur et une **passerelle VPN SSL**. Cette passerelle peut être configurée pour autoriser uniquement l'accès aux applications web, telles que la messagerie et les sites intranet, voire au réseau interne, sans que l'utilisateur final ait besoin d'installer ou d'utiliser de logiciel spécifique. Les VPN clients nécessitent l'utilisation d'un logiciel client pour établir la connexion VPN. Une fois connecté, l'ordinateur de l'utilisateur fonctionne comme s'il était connecté directement au réseau de l'entreprise et peut accéder à toutes les ressources (applications, hôtes, sous-réseaux, etc.) autorisées par la configuration du serveur. Certains VPN d'entreprise offrent aux employés un accès complet au réseau interne de l'entreprise, tandis que d'autres placent les utilisateurs sur un segment spécifique réservé aux télétravailleurs.

### Why Use A VPN?

Nous pouvons utiliser un service VPN comme **NordVPN** ou **Private Internet Access** et nous connecter à un serveur VPN situé dans une autre région de notre pays ou du monde afin de masquer notre trafic de navigation ou notre adresse **IP publique**. Cela peut nous offrir un certain niveau de sécurité et de confidentialité. Cependant, comme nous nous connectons au serveur d'une entreprise, il existe toujours un risque que **des données soient enregistrées ou que le service VPN ne respecte pas les bonnes pratiques de sécurité** ou les fonctionnalités de sécurité annoncées. Utiliser un service VPN comporte le risque que le fournisseur ne tienne pas ses promesses et enregistre toutes les données. `L'utilisation d'un VPN ne garantit ni l'anonymat ni la confidentialité, mais elle est utile pour contourner certaines restrictions de réseau` ou de pare-feu, ou lors de la connexion à un réseau potentiellement hostile (par exemple, le réseau Wi-Fi d'un aéroport public). Un service VPN ne doit jamais être utilisé dans l'espoir de se protéger des conséquences d'activités illégales.

### Connecting to HTB VPN

HTB et d'autres services proposant des machines virtuelles/réseaux volontairement vulnérables exigent que les joueurs se connectent au réseau cible via un VPN pour accéder au réseau de laboratoire privé. Les hôtes des réseaux HTB ne peuvent pas se connecter directement à Internet. Lors de la connexion au VPN HTB (ou à tout laboratoire dédié aux tests d'intrusion/au piratage), il est impératif de considérer le réseau comme « hostile ». La connexion doit se faire exclusivement depuis une machine virtuelle, l'authentification par mot de passe doit être désactivée si SSH est activé sur la machine virtuelle d'attaque, tous les serveurs web doivent être verrouillés et aucune information sensible ne doit être laissée sur la machine virtuelle d'attaque (autrement dit, il est déconseillé de jouer à HTB ou à d'autres réseaux vulnérables avec la même machine virtuelle que celle utilisée pour les évaluations clients). Pour se connecter à un VPN (que ce soit au sein de HTB Academy ou de la plateforme HTB principale), la commande suivante est utilisée :

```bash
Arcony@htb[/htb]$ sudo openvpn user.ovpn

Thu Dec 10 18:42:41 2020 OpenVPN 2.4.9 x86_64-pc-linux-gnu [SSL (OpenSSL)] [LZO] [LZ4] [EPOLL] [PKCS11] [MH/PKTINFO] [AEAD] built on Apr 21 2020
Thu Dec 10 18:42:41 2020 library versions: OpenSSL 1.1.1g  21 Apr 2020, LZO 2.10
Thu Dec 10 18:42:41 2020 Outgoing Control Channel Authentication: Using 256 bit message hash 'SHA256' for HMAC authentication
Thu Dec 10 18:42:41 2020 Incoming Control Channel Authentication: Using 256 bit message hash 'SHA256' for HMAC authentication
Thu Dec 10 18:42:41 2020 TCP/UDP: Preserving recently used remote address: [AF_INET]
Thu Dec 10 18:42:41 2020 Socket Buffers: R=[212992->212992] S=[212992->212992]
Thu Dec 10 18:42:41 2020 UDP link local: (not bound)
<SNIP>
Thu Dec 10 18:42:41 2020 Initialization Sequence Completed
```

La dernière ligne `Initialization Sequence Completed` nous indique que la connexion au VPN a réussi.

La commande `sudo` indique à notre système d'exécuter la commande en tant qu'utilisateur root avec privilèges élevés. `openvpn` est le client VPN, et le fichier `user.ovpn` est la clé VPN que nous téléchargeons depuis la section des modules de l'Académie ou depuis la plateforme HTB principale. Si nous saisissons `ifconfig` dans une autre fenêtre de terminal, nous verrons un adaptateur tun si la connexion au VPN a réussi.

```bash
Arcony@htb[/htb]$ ifconfig

<SNIP>

tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1500
        inet 10.10.x.2  netmask 255.255.254.0  destination 10.10.x.2
        inet6 dead:beef:1::2000  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::d82f:301a:a94a:8723  prefixlen 64  scopeid 0x20<link>
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen
```

La commande `netstat -rn` affichera les réseaux accessibles via le VPN.

```bash
Arcony@htb[/htb]$ netstat -rn

Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
0.0.0.0         192.168.1.2     0.0.0.0         UG        0 0          0 eth0
10.10.14.0      0.0.0.0         255.255.254.0   U         0 0          0 tun0
10.129.0.0      10.10.14.1      255.255.0.0     UG        0 0          0 tun0
192.168.1.0     0.0.0.0         255.255.255.0   U         0 0          0 eth0
```

On peut voir ici que le réseau `10.129.0.0/16` utilisé pour les machines HTB Academy **est accessible via l'adaptateur** `tun0` via le réseau `10.10.14.0/23`.

**Cours complété**

{% include comments.html %}