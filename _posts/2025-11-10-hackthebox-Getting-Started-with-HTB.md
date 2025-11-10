---
title: "HackTheBox - Getting Started with HTB"
date: 2025-11-10 11:48:00 +0200
categories: [HackTheBox, Learning]
tags: [learning]
description: "Write-up du module Getting Started with HTB"
image:
  path: /assets/img/posts/getting-started.png
  alt: "Getting Started"
---

## Informations sur la room

Découvrez le cours HTB sur comment bien commencer dans HTB

**Lien :** [Getting Started with HTB](https://academy.hackthebox.com/beta/module/77/section/727)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Bien s'en sortir dans HTB

---

## Starting Out

Pour un débutant en sécurité informatique, il peut être extrêmement `difficile de savoir par où commencer`. Nous avons vu des personnes de tous horizons partir de zéro, voire sans aucune connaissance préalable, **et réussir sur la plateforme HTB**, s'engageant ainsi dans une carrière technique. De nombreuses ressources de qualité existent pour les débutants : formations gratuites et payantes, machines et laboratoires volontairement vulnérables, sites web de tutoriels, blogs, chaînes YouTube, etc.

Tout au long de notre parcours, nous aborderons les notions d'apprentissage `guidé` et d'`apprentissage exploratoire`.

HTB Academy privilégie une approche d'**apprentissage guidé** : les étudiants travaillent sur un module consacré à un sujet donné, en lisant les documents et en reproduisant les exemples pour consolider leurs connaissances. La plupart des modules proposent un ou plusieurs exercices pratiques pour tester les acquis des étudiants. De nombreux modules se concluent par une évaluation des compétences en plusieurs étapes, permettant de vérifier la compréhension des étudiants et **leur application à des situations concrètes**.

L'apprentissage guidé présente l'avantage de fournir aux étudiants des méthodes structurées pour acquérir diverses techniques, de manière à construire correctement leurs connaissances. Il leur propose également des ressources complémentaires, des connaissances de base et des applications concrètes pour **approfondir un sujet**, tout en les incitant à tester leurs acquis à différents moments clés de leur apprentissage.

La plateforme principale HTB adopte une approche d'apprentissage exploratoire, plaçant les utilisateurs dans une grande variété de scénarios réalistes où ils doivent mobiliser leurs compétences techniques et des processus tels que l'énumération pour atteindre un objectif souvent inconnu. La plateforme propose des défis individuels dans des catégories comme la rétro-ingénierie, la cryptographie, la stéganographie, l'intrusion (pwn), le web, l'informatique légale, l'OSINT, le mobile, le matériel, et bien plus encore, à différents niveaux de difficulté conçus pour **tester leurs compétences techniques et leur esprit critique**.

On y trouve également des machines individuelles (**boxes**) fonctionnant sous différents systèmes d'exploitation, des `mini-laboratoires` (petits et stimulants) appelés « `Endgames` », des « `Fortress` » (machines individuelles proposant de nombreux défis) et des « `Pro Labs` » (grands réseaux d'entreprise simulés où les utilisateurs peuvent réaliser des tests d'intrusion fictifs à différents niveaux de difficulté).

Il existe toujours des machines et des défis « `actifs` » gratuits que les utilisateurs doivent attaquer en adoptant une approche « `black blox` », c'est-à-dire avec peu ou pas de connaissances préalables. Les machines, les défis et les endgames sont ensuite retirés de la plateforme et mis à **disposition des utilisateurs VIP**, accompagnés de `tutoriels officiels` pour faciliter l'apprentissage. Lorsque du contenu est retiré, la communauté est invitée à créer des tutoriels (**articles de blog et vidéos**). Il est conseillé de lire plusieurs articles ou de visionner plusieurs vidéos sur une même machine retirée afin de découvrir différentes perspectives et approches et ainsi développer l'approche qui vous convient le mieux.

Le principal avantage de l'apprentissage exploratoire est de nous permettre de nous appuyer sur nos compétences pour pénétrer des machines et résoudre des défis. Cela nous aide à développer nos méthodologies et techniques et à façonner notre **style de test d'intrusion**.

Il est toujours judicieux d'alterner les deux styles d'apprentissage afin de développer nos compétences de manière structurée et de nous mettre au défi pour approfondir notre compréhension des compétences acquises.

### Resources

Au premier abord, la quantité impressionnante de contenu disponible sur le web **peut être déconcertante**. De plus, il n'est pas toujours facile de savoir par où commencer ni d'évaluer la qualité des ressources proposées. Vous trouverez ci-dessous quelques ressources externes à HTB que nous recommandons à tous ceux qui **débutent ou souhaitent perfectionner leurs compétences** et acquérir de nouvelles techniques.

#### Vulnerable Machines/Applications

De nombreuses ressources permettent de s'exercer aux vulnérabilités web et réseau courantes dans un environnement sécurisé et contrôlé. Voici quelques exemples d'applications web et de machines volontairement vulnérables que nous pouvons configurer en laboratoire pour approfondir nos connaissances.

- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) -> Il s'agit d'une application web moderne vulnérable, écrite en **Node.js, Express et Angular**, qui présente l'intégralité des dix principales vulnérabilités de l[OWASP](https://owasp.org/www-project-top-ten/) ainsi que de nombreuses autres failles de sécurité réelles.

- [Metasploitable 2](https://docs.rapid7.com/metasploit/metasploitable-2-exploitability-guide/) -> Il s'agit d'une machine virtuelle Ubuntu Linux volontairement vulnérable qui peut être utilisée pour pratiquer l'énumération, l'exploitation automatisée et manuelle.

- [Metasploitable 3](https://github.com/rapid7/metasploitable3) -> Il s'agit d'un modèle pour la construction d'une machine virtuelle Windows vulnérable, configurée avec un large éventail de [failles de sécurité](https://github.com/rapid7/metasploitable3/wiki/Vulnerabilities).

- [DVWA](https://github.com/digininja/DVWA) -> Il s'agit d'une application web **PHP/MySQL** vulnérable illustrant de nombreuses vulnérabilités courantes des applications web, avec des degrés de difficulté variables.

Il est judicieux d'apprendre à configurer ces machines virtuelles dans votre environnement de laboratoire afin de vous familiariser avec leur installation et leur utilisation, **notamment pour la mise en place d'un serveur web**. Outre ces machines et applications vulnérables, nous pouvons également configurer de nombreuses autres machines et applications dans un environnement de laboratoire pour nous entraîner à la configuration, à l'énumération/exploitation et à la **correction des vulnérabilités**.

#### YouTube Channels

Il existe de nombreuses chaînes YouTube qui présentent des techniques de test d'intrusion et de piratage. En voici quelques-unes à ajouter à vos favoris :

- [IppSec](https://www.youtube.com/channel/UCa6eh7gCkpPo5XXUDfygQQA) -> Il propose une analyse extrêmement détaillée de chaque box HTB retirée du marché, regorgeant d'informations tirées de sa propre expérience, ainsi que des vidéos sur diverses techniques.

- [VbScrub](https://www.youtube.com/channel/UCpoyhjwNIWZmsiKNKpsMAQQ) -> Fournit des vidéos HTB ainsi que des vidéos sur les techniques, axées principalement sur l'exploitation d'Active Directory.

- [STÖK](https://www.youtube.com/channel/UCQN2DsjnYH60SFBIA6IkNwg) -> Propose des vidéos sur divers sujets liés à la sécurité informatique, principalement axées sur les programmes de primes aux bogues et les tests d'intrusion d'applications web.

- [LiveOverflow](https://www.youtube.com/channel/UClcE-kVhqyiHCcjYwcpfj9w) -> Propose des vidéos sur une grande variété de sujets techniques liés à la sécurité informatique.

#### Blogs

Il existe tellement de blogs sur le sujet qu'il est impossible de tous les recenser. Si vous effectuez une recherche Google pour trouver une analyse détaillée d'une machine HTB abandonnée, vous tomberez généralement sur les mêmes blogs. Ces derniers peuvent être très utiles pour découvrir d'autres points de vue sur un même sujet, surtout si leurs articles contiennent des informations supplémentaires sur la cible, informations que les autres blogs n'abordent pas.

Un excellent blog à consulter est [0xdf hacks stuff](https://0xdf.gitlab.io/). Ce blog propose des analyses détaillées de la plupart des machines HTB abandonnées, chacune comportant une section `Beyond Root` qui traite d'un aspect unique de la machine que l'auteur a remarqué. Le blog publie également des articles sur diverses techniques, l'analyse de logiciels malveillants et des comptes **rendus d'anciens CTF**.

À chaque étape de votre apprentissage, il est important de **lire autant de ressources que possible** pour mieux comprendre un sujet et découvrir différentes perspectives. Outre les blogs consacrés aux machines HTB abandonnées, il est également judicieux de consulter des **articles de blog sur les exploits et attaques récents**, les techniques d'exploitation d'**Active Directory**, les comptes rendus d'événements CTF et les rapports de programmes de primes aux bogues. Ces ressources peuvent toutes contenir une mine d'informations qui peuvent nous aider à faire des liens dans notre apprentissage, voire nous apprendre quelque chose de nouveau qui peut s'avérer utile lors d'une évaluation.

#### Tutorial Websites

Il existe de nombreux sites web de tutoriels pour s'exercer aux compétences informatiques fondamentales, comme la programmation de scripts.

Deux excellents sites de ce type sont [Under The Wire](https://underthewire.tech/wargames) et [Over The Wire](https://overthewire.org/wargames/). Ils sont conçus pour former les utilisateurs à l'utilisation de Windows PowerShell et de la ligne de commande Linux, respectivement, à travers divers scénarios **sous forme de jeux de simulation**.

Ils proposent différents niveaux de formation, composés de tâches ou de défis, afin d'acquérir des compétences allant des bases aux techniques avancées de l'utilisation des lignes de commande Windows et Linux, ainsi que de la **programmation de scripts Bash et PowerShell**. Ces compétences sont essentielles pour quiconque souhaite réussir dans ce secteur.

#### HTB Starting Point

[Le point de départ](https://app.hackthebox.com/starting-point) est une **introduction aux laboratoires HTB** et aux machines/défis de base. Après un tutoriel sur la connexion VPN, l'énumération, l'obtention d'un point d'entrée et l'élévation de privilèges sur une cible unique, plusieurs machines de difficulté facile sont proposées pour les attaques avant d'accéder au reste de la plateforme HTB.

#### HTB Tracks

Sur la plateforme principale HTB, les [Parcours](https://app.hackthebox.com/tracks) proposent une sélection de machines et de défis liés entre eux, permettant aux utilisateurs de progresser et de maîtriser un sujet particulier. Ces Parcours couvrent une variété de thèmes et sont **régulièrement enrichis**. Leur objectif est d'aider les étudiants à rester concentrés sur un objectif précis de manière structurée, tout en adoptant une approche d'apprentissage exploratoire.

#### Beginner Friendly HTB Machines

La plateforme HTB principale propose de nombreuses machines adaptées aux débutants. En voici quelques-unes recommandées :

- [Lame](https://app.hackthebox.com/machines/1)
- [Blue](https://app.hackthebox.com/machines/51)
- [Nibbles](https://app.hackthebox.com/machines/121)
- [Shocker](https://app.hackthebox.com/machines/108)
- [Jerry](https://app.hackthebox.com/machines/144)

Si vous préférez regarder un tutoriel vidéo tout en travaillant sur une machine simple, les listes de lecture ci-dessous de la chaîne IppSec proposent des tutoriels pour diverses machines HTB Linux/Windows faciles à utiliser :

[Première Vidéo](https://www.youtube.com/watch?list=PLidcsTyj9JXJfpkDrttTdk1MNT6CDwVZF&time_continue=2&v=V_CkT7xyiCc&embeds_referring_euri=https%3A%2F%2Facademy.hackthebox.com%2F&source_ve_path=MjM4NTE)

[Deuxième Vidéo](https://www.youtube.com/watch?list=PLidcsTyj9JXJfpkDrttTdk1MNT6CDwVZF&time_continue=2&v=V_CkT7xyiCc&embeds_referring_euri=https%3A%2F%2Facademy.hackthebox.com%2F&source_ve_path=MjM4NTE)

#### Beginner Friendly HTB Challenges

La plateforme HTB propose des défis ponctuels dans diverses catégories. Voici quelques exemples de défis adaptés aux débutants :

- [Find The Easy Pass](https://app.hackthebox.com/challenges/5)
- [Weak RSA](https://app.hackthebox.com/challenges/6)
- [You know 0xDiablos](https://app.hackthebox.com/challenges/106)

#### Dante Prolab

La plateforme HTB propose différents laboratoires professionnels simulant des réseaux d'entreprise composés de nombreux hôtes interconnectés. Ces laboratoires permettent aux joueurs de perfectionner leurs compétences sur un réseau comportant de multiples cibles.

L'exploitation réussie d'hôtes spécifiques fournira des informations précieuses pour attaquer les hôtes rencontrés ultérieurement dans le laboratoire.

Le laboratoire [Dante Pro](https://app.hackthebox.com/prolabs/overview/dante) est le plus accessible aux débutants à ce jour. Il s'adresse aux joueurs ayant déjà une certaine expérience des attaques réseau et web, ainsi qu'une bonne compréhension des concepts de base des réseaux et des méthodologies d'intrusion telles que l'analyse/l'énumération, le déplacement latéral, l'élévation de privilèges, la post-exploitation, etc.

### Moving On

Maintenant que nous avons abordé la terminologie et les techniques de base ainsi que le balayage/l'énumération, assemblons les pièces du puzzle en parcourant étape par étape une boîte HTB de niveau facile.

## Navigating HTB

`Hack The Box` regorge d'informations pour quiconque débute dans le domaine des tests d'intrusion ou souhaite perfectionner ses compétences. Le site propose de nombreuses opportunités d'apprentissage; il est donc essentiel de bien comprendre sa structure et son organisation pour tirer le meilleur parti de cette expérience.

### Profile

Vous pouvez accéder à votre page de profil HTB soit dans le volet de gauche, soit en cliquant sur votre nom d'utilisateur dans le volet supérieur.

![profile](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_profile.jpg)

Votre page de profil affiche vos statistiques HTB, notamment **votre rang**, **votre progression vers le rang suivant**, le pourcentage de possession des différents défis et laboratoires HTB, et d'autres statistiques similaires.

![stats](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_profile_2.jpg)

Vous trouverez également des statistiques détaillées sur votre machine et votre progression dans les défis, ainsi que **l'historique de votre progression pour chacun**. Vous pouvez aussi consulter les badges et **certificats** que vous avez obtenus. Partagez votre profil en cliquant sur le bouton « **Partager le profil** ».

### Rankings

La page des classements HTB affiche les classements actuels des utilisateurs, des équipes, des universités, des pays et des membres VIP.

![rankings](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_rankings.jpg)

Vous pouvez également consulter votre classement parmi les autres utilisateurs, votre meilleur classement et votre progression générale. De plus, votre classement et vos points **contribuent à votre classement national**, que vous pouvez également consulter sur la page dédiée. Si vous faites partie d'une équipe ou d'une université, vos points s'y ajoutent également. Si vous disposez d'un abonnement VIP, vous pouvez consulter votre rang VIP, qui comptabilise les points obtenus sur toutes les machines. Sur la page principale de `HackTheBox`, l'onglet « `Labs` » apparaît dans le panneau latéral et comprend les sections principales suivantes :

![rank](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_main_1.jpg)

### Tracks

![tracks](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_tracks.jpg)

`HTB Tracks` est une fonctionnalité très pratique pour planifier vos prochains exercices et défis. Un parcours est une sélection d'exercices et de défis liés entre eux, permettant aux utilisateurs de progresser dans la maîtrise d'un sujet particulier. Que vous débutiez, souhaitiez tester vos compétences **Active Directory** ou soyez prêt à relever un défi du parcours Expert, vous trouverez un parcours adapté comprenant une vaste sélection d'exercices et de défis pour vous aider à perfectionner vos compétences dans un domaine spécifique. Les parcours sont créés par l'équipe HTB, des entreprises, des universités et même des utilisateurs. En cliquant sur un parcours, vous verrez tous les exercices et défis qui le composent, votre progression dans chacun d'eux et votre progression globale dans le parcours.

![progression](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/beginner_track.jpg)

Vous pouvez facilement vous inscrire au programme et commencer à progresser.

### Machines

Ensuite, nous avons la page `Machines`, l'une des pages les plus populaires de `HackTheBox`.

![machines](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_machines_1.jpg)

La première chose que vous verrez, ce sont deux machines recommandées auxquelles vous pouvez jouer : l’une est la dernière machine hebdomadaire sortie, et l’autre est une machine « `Staff Pick` » recommandée par l’équipe HTB.

![staff pick](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_machines_2.jpg)

En faisant défiler vers le bas, vous trouverez la liste de **toutes les machines HTB**, réparties en deux onglets : `Actives et Retirées`.

Les machines actives vous rapportent des points pour votre classement, mais vous devrez les résoudre **par vous-même** en utilisant vos connaissances en tests d'intrusion. Il y a toujours `20 machines actives`, réparties selon le niveau de difficulté. Une nouvelle machine est ajoutée chaque semaine, et l'une des machines actives est retirée, ce qui supprime les points associés pour tous les joueurs.

Les machines retirées sont toutes les machines qui **figuraient auparavant parmi les machines actives hebdomadaires**. Vous trouverez un guide pour chacune d'elles, mais **elles ne vous rapporteront aucun point** pour votre classement. En revanche, elles vous permettent d'obtenir **des points pour le classement VIP**, comme expliqué précédemment.

> Les machines mises hors service ne sont accessibles qu'avec un abonnement VIP, seules les deux machines mises hors service les plus récemment étant accessibles gratuitement.
{: .prompt-info}

Vous pouvez filtrer les machines selon que vous les ayez terminées ou non, leur difficulté ou leur système d'exploitation. Vous pouvez également les trier par date de sortie, note ou difficulté évaluée par les utilisateurs. En cliquant sur une machine, vous accédez à sa page dédiée.

![stats_2](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/machine_page.jpg)

Vous pourrez jouer sur la machine en cliquant sur `Rejoindre la machine`. Vous obtiendrez alors l'adresse IP de la machine, accessible une fois connecté via `HTB VPN`. Vous pourrez également soumettre les flags utilisateur et root indiqués sur cette page.

Si la machine est hors service, vous pouvez cliquer sur l'onglet `Solutions` pour consulter la liste des solutions disponibles, **écrites et vidéo**. Enfin, vous pouvez consulter les onglets `Statistiques` et `Activité` pour obtenir les statistiques et l'activité les plus récentes des utilisateurs.

### Challenges

![challenges](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_challenges.jpg)

La page des défis présente une mise en page similaire à **celle des machines**. Vous y trouverez des défis actifs et retirés, répartis en dix catégories, chacune contenant jusqu'à dix défis. Cliquez sur une catégorie pour prévisualiser la liste des défis, puis sur un défi pour accéder à sa page et soumettre ses drapeaux.

### Fortress

Les forteresses sont des laboratoires vulnérables créés par des entreprises externes et hébergés sur HackTheBox.

![fortress](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_fortress_1.jpg)

Chaque laboratoire comporte plusieurs drapeaux à trouver et à déposer sur la page Forteresse. Une fois le laboratoire terminé et **tous les drapeaux récupérés**, vous recevez un `badge de l'entreprise créatrice` de la forteresse. Certaines entreprises proposent également des `offres d'emploi liées à la réussite de ces laboratoires`. Pour jouer aux forteresses, vous devez posséder le rang Hacker HTB ou supérieur. Améliorez votre rang en jouant sur les machines actives et en relevant les défis.

### Endgame

Les scénarios de Endgames sont des laboratoires virtuels composés de plusieurs machines connectées à un même réseau. Ils visent à reproduire une situation réelle que vous pourriez rencontrer lors d'un test d'intrusion pour une entreprise.

![endgames](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_endgame_1.jpg)

Tout comme les machines, chaque laboratoire de fin de partie possède une **stratégie d'attaque spécifique** qu'il vous faut exploiter. Cependant, comme les fins de partie comportent plusieurs machines, vous pouvez apprendre des stratégies d'attaque spécifiques qu'il serait **impossible d'apprendre avec une seule machine**. Vous devez être de `rang Guru ou supérieur dans HTB pour jouer` aux Endgames actives. Les Endgames retirées sont uniquement accessibles aux utilisateurs disposant d'un abonnement VIP, et peuvent être jouées à n'importe quel rang.

### Pro Labs

Les Pro Labs offrent une expérience de laboratoire ultime, car ils sont conçus pour simuler une infrastructure d'entreprise réelle, ce qui constitue une excellente opportunité pour tester vos compétences en matière de tests d'intrusion.

![prolabs](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_prolab_dante.jpg)

Les Pro Labs sont volumineux et leur achèvement **peut prendre du temps**, tout comme l'apprentissage de leurs vecteurs d'attaque et de leurs défis de sécurité. Chaque Pro Lab propose un scénario et un niveau de difficulté spécifiques.

| Lab | Scénario |
|-----|----------|
| `Dante` | Adapté aux débutants pour apprendre les techniques et méthodologies courantes de test d'intrusion, les outils de pentesting courants et les vulnérabilités communes. |
| `Offshore` | Laboratoire Active Directory qui simule un réseau d'entreprise réel. |
| `Cybernetics` | Simule un environnement réseau Active Directory entièrement mis à niveau et à jour, durci contre les attaques. Il est destiné aux testeurs d'intrusion expérimentés et aux Red Teamers. |
| `RastaLabs` | Environnement de simulation Red Team, comportant une combinaison d'attaques contre des erreurs de configuration et des utilisateurs simulés. |
| `APTLabs` | Ce laboratoire simule une attaque ciblée par un agent de menace externe contre un MSP (Managed Service Provider) et est le Pro Lab le plus avancé proposé actuellement. |

Les Pro Labs **nécessitent un abonnement distinct**. Une fois un Pro Lab terminé, vous recevez un `certificat de réussite HTB`.

### Battlegrounds

La dernière nouveauté sur `HackThebox` est `HTB Battlegrounds`.

![battleground](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_battlegrounds.jpg)

HTB Battlegrounds est un **jeu de stratégie et de piratage en temps réel**. Vous pouvez jouer en `équipe de 4 ou de 2`.

Les batailles de `Cyber ​​Mayhem` reposent sur un système **d'attaque/défense**. Chaque équipe dispose de **plusieurs machines à défendre tout en attaquant celles de l'équipe adverse**. Chaque attaque ou défense rapporte des points, et chaque drapeau capturé compte également. La partie dure un temps déterminé, et l'équipe qui totalise le plus de points à la fin remporte la victoire.

`HTB Battlegrounds` est accessible à tous, mais le nombre de parties autorisées est limité.

| Status | Matches |
|--------|---------|
| `Free Users` | 2 matches par mois |
| `VIP` | 5 matches par mois |
| `VIP+` | 10 matches par mois |

Le `mode Siège` de serveur est un mode d'attaque uniquement : **l'équipe qui pirate l'équipe adverse le plus rapidement remporte la victoire**. Vous trouverez un article détaillé sur HTB Battlegrounds en suivant [ce lien](https://help.hackthebox.com/en/articles/5185620-gs-how-to-play-battlegrounds).

**Cours complété**

{% include comments.html %}