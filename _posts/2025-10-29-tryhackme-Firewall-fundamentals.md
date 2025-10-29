---
title: "TryHackMe - Firewall fundamentals"
date: 2025-10-29 14:50:00 +0200
categories: [TryHackMe, Learning]
tags: [defense, firewall, security]
description: "Write-up de la room qui nous apprendra exactement ce qu'est qu'un pare-feu (firewall)"
image:
  path: /assets/img/posts/tryhackme-firewall-fundamentals.png
  alt: "Firewall fundamentals"
---

## Informations sur la room

Découvrez les pare-feu et familiarisez-vous avec les pare-feu intégrés de Windows et Linux.

**Lien :** [Firewall fundamentals](https://tryhackme.com/room/firewallfundamentals)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Les types de pare-feu
- Les règles et les composants d'un pare-feu
- Prise en main du pare-feu intégré de Windows
- Prise en main du pare-feu intégré de Linux

---

## Solutions des tâches

### Task 1 - What Is the Purpose of a Firewall

On voit souvent des agents de sécurité devant les centres commerciaux, les banques, les restaurants et les maisons. Postés aux entrées, ils contrôlent les allées et venues afin d'empêcher toute intrusion. L'agent fait office de rempart entre sa zone et les visiteurs.

Un trafic important circule quotidiennement entre nos appareils numériques et Internet. Que se passerait-il si quelqu'un parvenait à s'infiltrer dans ce trafic sans se faire repérer ? Il nous faudrait alors un système de sécurité pour nos appareils, capable de contrôler les données qui y transitent. Ce système, `c'est le pare-feu`. Un pare-feu est conçu pour `inspecter le trafic entrant et sortant d'un réseau ou d'un appareil` numérique. Son objectif est le même que celui de l'agent de sécurité posté devant un bâtiment : **empêcher toute intrusion non autorisée**. Le pare-feu se configure en définissant des règles de contrôle pour tout le trafic. Toutes les données entrant ou sortant de votre appareil ou réseau sont d'abord analysées par le pare-feu. Le pare-feu autorisera ou bloquera le trafic en fonction des règles qu'il a définies. La plupart des pare-feu actuels vont au-delà du simple filtrage par règles et offrent des fonctionnalités supplémentaires pour protéger votre appareil ou votre réseau des menaces extérieures. Nous allons examiner tous ces pare-feu et réaliser des démonstrations pratiques en laboratoire sur certains d'entre eux.

![firewall](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1723114287705.svg)

---

**Which security solution inspects the incoming and outgoing traffic of a device or a network?**

**Réponse :** `Firewall`

### Task 2 - Types of Firewalls

Le déploiement de pare-feu s'est généralisé sur les réseaux après que les entreprises ont découvert leur capacité à filtrer le trafic malveillant de leurs systèmes et réseaux. Plusieurs types de pare-feu ont ensuite été introduits, chacun ayant une **fonction spécifique**. Il est également important de noter que chaque type de pare-feu fonctionne sur `différentes couches du modèle OSI`. Il existe de nombreux types de pare-feu.

Examinons quelques-uns des types de pare-feu les plus courants et leur rôle dans le **modèle OSI**.

![OSI](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1725967312491.png)

#### Pare-feu sans état (Stateless Firewall)

Ce type de pare-feu opère sur les `couches 3 et 4 du modèle OSI` et **filtre uniquement les données selon des règles prédéfinies**, sans tenir compte de l'état des connexions précédentes. Cela signifie qu'il associe chaque paquet aux règles, qu'il fasse partie ou non d'une connexion légitime. Il ne conserve aucune information sur l'état des connexions précédentes pour prendre des décisions concernant les paquets futurs. De ce fait, ces pare-feu peuvent traiter les paquets rapidement. Cependant, ils ne peuvent pas appliquer de politiques complexes aux données en fonction de leur relation avec les connexions précédentes. Supposons que le pare-feu refuse quelques paquets provenant d'une source unique en raison de ses règles. Idéalement, il devrait rejeter tous les paquets futurs de cette source, car les paquets précédents ne respectaient pas ses règles. Cependant, le pare-feu oublie constamment cela, et les paquets futurs de cette source seront traités comme nouveaux et soumis à nouveau à ses règles.

#### Pare-feu avec état (Stateful Firewall)

Contrairement aux pare-feu sans état, ce type de pare-feu va au-delà du filtrage des paquets selon des règles prédéfinies. Il `conserve également la trace des connexions précédentes` et les **stocke dans une table d'état**. Cela ajoute une couche de sécurité supplémentaire en inspectant les paquets en fonction de leur historique de connexions. Les pare-feu à état fonctionnent aux couches 3 et 4 du modèle OSI. Supposons qu'un pare-feu accepte quelques paquets provenant d'une adresse source selon ses règles. Dans ce cas, il enregistre cette connexion dans sa table d'état et autorise automatiquement tous les paquets suivants pour cette connexion, sans les inspecter individuellement. De même, les pare-feu à état identifient les connexions pour lesquelles ils refusent quelques paquets et, sur la base de ces informations, refusent tous les paquets suivants provenant de la même source.

#### Pare-feu proxy (Proxy Firewall)

Le problème des pare-feu précédents résidait dans leur incapacité à inspecter le contenu d'un paquet. Les pare-feu proxy, ou passerelles applicatives, servent d'intermédiaires entre le réseau privé et Internet et fonctionnent sur la couche 7 du modèle OSI. Ils `inspectent également le contenu de tous les paquets`. Les requêtes des utilisateurs d'un réseau sont transmises par ce proxy après inspection et masquage avec leur propre adresse IP afin de garantir l'anonymat des adresses IP internes. Des politiques de filtrage de contenu peuvent être appliquées à ces pare-feu pour autoriser ou bloquer le trafic entrant et sortant en fonction de son contenu.

#### Pare-feu de nouvelle génération (NGFW) (Next-Generation Firewall (NGFW))

Il s'agit du type de pare-feu le plus avancé, opérant des couches 3 à 7 du modèle OSI. Il offre une `inspection approfondie des paquets` et d'autres fonctionnalités renforçant la sécurité du trafic réseau entrant et sortant. Doté d'un système de prévention des intrusions, il bloque les activités malveillantes en temps réel. Il propose une analyse heuristique, identifiant les schémas d'attaques et les bloquant instantanément avant qu'elles n'atteignent le réseau. Les NGFW disposent de capacités de `déchiffrement SSL/TLS`, qui inspectent les paquets après leur déchiffrement et corrèlent les données avec les flux de renseignements sur les menaces afin de prendre des décisions efficaces.

**Which type of firewall maintains the state of connections?**

**Réponse :** `stateful firewall`

**Which type of firewall offers heuristic analysis for the traffic?**

**Réponse :** `next-generation firewall`

**Which type of firewall inspects the traffic coming to an application?**

**Réponse :** `proxy firewall`

### Task 3 - Rules in Firewalls

Un pare-feu vous permet de **contrôler le trafic de votre réseau**. Bien qu'il filtre le trafic selon ses règles intégrées, des règles personnalisées peuvent être définies pour différents réseaux. Par exemple, certains réseaux peuvent bloquer tout le trafic SSH entrant. Cependant, votre réseau peut avoir besoin d'autoriser le trafic SSH provenant de certaines adresses IP spécifiques. Les règles vous permettent de configurer ces paramètres personnalisés pour le trafic entrant et sortant de votre réseau.

Les composants de base d'une règle de pare-feu sont décrits ci-dessous :

- `Adresse source` : Adresse IP de la machine émettrice du trafic.
- `Adresse de destination` : Adresse IP de la machine destinataire des données.
- `Port` : Numéro de port utilisé pour le trafic.
- `Protocole` : Protocole utilisé pour la communication.
- `Action` : Action à entreprendre lors de la détection d'un trafic de ce type.
- `Sens` : Indique si la règle s'applique au trafic entrant ou sortant.

#### Types d'actions

L'élément « Action » d'une règle indique les **étapes à suivre lorsqu'un paquet de données entre dans la catégorie de la règle définie**. Trois actions principales pouvant être appliquées à une règle sont expliquées ci-dessous.

**Allow**

L'action **Allow** d'une règle indique que le trafic spécifique défini dans la règle est autorisé.

#### Deny

L’action **Deny** d’une règle signifie que le trafic défini dans cette règle sera **bloqué et interdit**. Ces règles sont essentielles pour permettre à l’équipe de sécurité de bloquer le trafic provenant d’adresses IP malveillantes et de créer d’autres règles afin de réduire la surface d’attaque du réseau.

#### Forward

L'action **Forward** redirige le trafic vers un autre segment de réseau en utilisant les **règles de transfert configurées sur les pare-feu**. Ceci s'applique aux pare-feu assurant le routage et servant de passerelles entre différents segments de réseau.

#### Sens d’application des règles

Les pare-feu comportent différentes catégories de règles, chacune étant catégorisée selon le sens du trafic sur lequel elle repose. Examinons chacune de ces directions.

![directionality](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1725970029903.svg)

**Règles de trafic entrant**

Les règles sont dites entrantes lorsqu'elles s'appliquent uniquement au trafic entrant. Par exemple, vous pouvez autoriser le trafic HTTP entrant (port 80) sur votre serveur web.

**Règles de trafic sortant**

Ces règles concernent uniquement le trafic sortant. Par exemple, bloquer tout le trafic SMTP sortant (port 25) depuis tous les périphériques, à l'exception du serveur de messagerie.

**Règles de redirection**

Les règles de redirection permettent de rediriger un trafic spécifique au sein du réseau. Par exemple, une règle de redirection peut être créée pour rediriger le trafic HTTP entrant (port 80) vers le serveur web situé sur votre réseau.

---

**Which type of action should be defined in a rule to permit any traffic?**

**Réponse :** `allow`

**What is the direction of the rule that is created for the traffic leaving our network?**

**Réponse :** `outbound`

### Task 4 - Windows Defender Firewall

Maintenant nous allons pratiquer

#### Pare-feu Windows Defender

Windows Defender est un pare-feu intégré au système d'exploitation Windows. Il offre toutes les fonctionnalités de base pour **autoriser ou bloquer** des programmes spécifiques, ainsi que pour créer des règles personnalisées. Ce guide présente certains composants essentiels du Pare-feu Windows Defender, que vous pouvez utiliser pour **limiter le trafic réseau entrant et sortant** de votre système. Pour ouvrir ce pare-feu, effectuez une recherche Windows et saisissez « Pare-feu Windows Defender ».

La page d'accueil du Pare-feu Windows Defender affiche les « Profils réseau » et les options disponibles. Il s'agit du tableau de bord principal regroupant toutes les options du pare-feu.

![windows defender](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f9c7574e201fe31dad228fc/room-content/5f9c7574e201fe31dad228fc-1726660679211.png)

#### Profils réseau

Deux profils réseau sont disponibles. Le pare-feu Windows détermine votre réseau actuel grâce à la détection de l'emplacement réseau (NLA) et applique les paramètres de pare-feu correspondants. Vous pouvez définir des paramètres différents **pour chaque profil**.

- `Réseaux privés` : Ce profil inclut les configurations de pare-feu appliquées lorsque vous êtes connecté à votre réseau domestique.

- `Réseaux invités ou publics` : Ce profil inclut les configurations de pare-feu appliquées lorsque vous êtes connecté à un **réseau public ou non sécurisé**, comme ceux des cafés, restaurants, etc. Par exemple, lorsque vous vous connectez à un réseau public, vous pouvez configurer le pare-feu pour bloquer toutes les connexions entrantes et n'autoriser que les connexions sortantes essentielles. Ces paramètres s'appliquent au profil « réseau public » et ne sont pas utilisés sur votre réseau domestique privé.

Pour autoriser ou interdire une application dans l'un de vos profils réseau, cliquez sur l'option correspondante (indiquée par le chiffre 1 dans la capture d'écran). Vous accéderez ainsi à la page listant toutes les applications et fonctionnalités installées sur votre système. Vous pouvez cocher celles que vous souhaitez autoriser dans vos profils réseau ou décocher celles qui ne sont pas nécessaires. Le pare-feu Windows Defender est activé par défaut. Pour l'activer ou le désactiver, cliquez sur l'option correspondante (indiquée par le chiffre 2 dans la capture d'écran). Vous accéderez ainsi aux paramètres de vos deux profils réseau. Au lieu de le désactiver complètement, ce que Microsoft déconseille, vous pouvez bloquer toutes les connexions entrantes. Vous pouvez également cliquer à tout moment sur « Restaurer les paramètres par défaut » (indiqué par le chiffre 3 dans la capture d'écran) depuis le tableau de bord principal pour rétablir les paramètres par défaut du pare-feu.

![first](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f9c7574e201fe31dad228fc/room-content/5f9c7574e201fe31dad228fc-1726665055716.png)

#### Règles personnalisées

Le pare-feu Windows Defender vous permet également de créer des **règles personnalisées** pour votre réseau afin d'**autoriser ou d'interdire un trafic spécifique** selon vos besoins. Créons une règle personnalisée pour bloquer tout le trafic sortant sur HTTP (port 80) ou HTTPS (port 443). Après avoir créé cette règle, nous ne pourrons plus naviguer sur Internet, car les sites web fonctionnent sur le port 80 ou 443, que nous bloquerons.

Avant de créer cette règle, testons si nous pouvons accéder à un site web. Pour ce test, visitons `http://10.10.10.10/`. Comme le montre la capture d'écran ci-dessous, nous pouvons accéder à ce site web.

![second](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1726644402513.png)

Pour créer une règle personnalisée, sélectionnez « **Paramètres avancés** » parmi les options disponibles dans le tableau de bord principal. Un nouvel onglet s'ouvrira pour vous permettre de créer vos propres règles.

![third](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f9c7574e201fe31dad228fc/room-content/5f9c7574e201fe31dad228fc-1726665941622.png)

Vous pouvez consulter les options disponibles pour créer des règles entrantes et sortantes.

![fourth](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f9c7574e201fe31dad228fc/room-content/5f9c7574e201fe31dad228fc-1726665941554.png)

Créons une règle sortante pour **bloquer** tout notre trafic HTTP et HTTPS sortant. Pour cela, cliquez sur l'option Règles sortantes à gauche, puis sur Nouvelle règle à droite. L'assistant de création de règles s'ouvrira. À la première étape, sélectionnez l'option **Personnalisée** et cliquez sur **Suivant**.

![blocked](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f9c7574e201fe31dad228fc/room-content/5f9c7574e201fe31dad228fc-1726665941601.png)

À la deuxième étape, sélectionnez « **Tous les programmes** » dans le menu déroulant, puis cliquez sur « **Suivant** ». À la troisième étape, vous devrez sélectionner le type de protocole. Choisissez « **TCP** », conservez le port local par défaut et sélectionnez « **Ports spécifiques** » dans le menu déroulant « **Port distant** ». Saisissez les numéros de port dans le champ ci-dessous (dans notre exemple, `80` et `443`). Cliquez ensuite sur « `Suivant` ».

> Séparez les numéros de port par des virgules, sans espaces.
{: .prompt-info}

![custom rules](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f9c7574e201fe31dad228fc/room-content/5f9c7574e201fe31dad228fc-1726665941608.png)

Dans l'onglet **scope**, conservez les adresses IP locales et distantes telles quelles, puis cliquez sur **Suivant**. Dans l'onglet Action, activez l'option **Bloquer** la connexion, puis cliquez sur **Suivant**.

![scope](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f9c7574e201fe31dad228fc/room-content/5f9c7574e201fe31dad228fc-1726665941604.png)

Dans l'onglet **Profil**, cochez tous les profils réseau. Enfin, donnez un nom à votre règle et ajoutez une description (facultative), puis cliquez sur le bouton **Terminer**.

Votre règle apparaît bien dans les règles de trafic sortant disponibles.

![final](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f9c7574e201fe31dad228fc/room-content/5f9c7574e201fe31dad228fc-1726665941608.png)

Testons maintenant notre règle en accédant à `http://10.10.10.10/`. Nous obtenons un message d'erreur indiquant que nous ne pouvons pas accéder à cette page, ce qui signifie que la règle fonctionne.

![error](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1726644747236.png)

---

**What is the name of the rule that was created to block all incoming traffic on the SSH port?**

**Réponse :** `Core Op`

**A rule was created to allow SSH from one single IP address. What is the rule name?**

**Réponse :** `Infra team`

**Which IP address is allowed under this rule?**

**Réponse :** `192.168.13.7`

### Task 5 - Linux iptables Firewall

Dans la tâche précédente, nous avons abordé le **pare-feu intégré de Windows**. Qu'en est-il des utilisateurs Linux ? Ils ont également besoin de contrôler leur trafic réseau. **Linux offre aussi un pare-feu intégré**. Plusieurs options s'offrent à eux. Passons-en brièvement la plupart et explorons-en une plus en détail.

#### Netfilter

Netfilter est le framework intégré à Linux qui fournit les fonctionnalités essentielles d'un pare-feu, notamment le **filtrage de paquets**, la NAT et le suivi des connexions. Ce framework sert de base à divers utilitaires de pare-feu disponibles sous Linux pour contrôler le trafic réseau. Voici quelques utilitaires courants qui utilisent ce framework :

- `iptables` : C'est l'utilitaire le plus répandu dans de nombreuses distributions Linux. Il utilise le **framework Netfilter** qui offre diverses fonctionnalités pour contrôler le trafic réseau.

- `nftables` : Successeur d'iptables, il offre des capacités améliorées de filtrage de paquets et de NAT. Il est également basé sur le framework Netfilter.

- `firewalld` : Cet utilitaire fonctionne également avec le framework Netfilter et propose des ensembles de règles prédéfinis. Son fonctionnement diffère des autres et il est livré avec des configurations de zones réseau prédéfinies différentes.

#### ufw

ufw (Uncomplicated Firewall), comme son nom l'indique, **simplifie la création de règles** avec la syntaxe complexe d'« iptables » (ou son successeur) grâce à une interface plus intuitive. Il est **particulièrement adapté aux débutants**. En résumé, quelles que soient les règles dont vous avez besoin dans « iptables », vous pouvez les définir facilement avec ufw, qui configurera ensuite ces règles dans « iptables ». Voici quelques commandes ufw de base.

Pour vérifier l'état du pare-feu, vous pouvez utiliser la commande suivante :

```bash
user@ubuntu:~$ sudo ufw status
Status: inactive
```

S'il semble inactif, vous pouvez l'activer à l'aide de la commande suivante :

```bash
           
user@ubuntu:~$ sudo ufw enable
Firewall is active and enabled on system startup
```

Pour désactiver le pare-feu, saisissez « **disable** » au lieu de « enable » dans la commande ci-dessus.

Voici une règle créée pour autoriser toutes les connexions sortantes d'une machine Linux. La valeur par défaut dans la commande signifie que cette politique autorise tout le trafic sortant, sauf si une restriction de trafic sortant est définie pour une application spécifique dans une règle distincte. Vous pouvez également créer une règle pour autoriser ou bloquer le trafic entrant en remplaçant « **outgoing** » par « **incoming** » dans la commande suivante :

```bash           
user@ubuntu:~$ sudo ufw default allow outgoing
Default outgoing policy changed to 'allow'
(be sure to update your rules accordingly)
```

Vous pouvez bloquer le trafic entrant sur n'importe quel port de votre système. Supposons que nous souhaitions bloquer le trafic SSH entrant. Nous pouvons y parvenir avec la commande `ufw deny 22/tcp`. Comme vous pouvez le constater, nous avons d'abord spécifié l'action, ici « deny », puis le port et le protocole de transport, à savoir le port **TCP 22**, ou simplement `22/tcp`.

```bash
user@ubuntu:~$ sudo ufw deny 22/tcp
Rule added
Rule added (v6)
```

Pour lister toutes les règles actives dans un ordre numéroté, vous pouvez utiliser la commande suivante :

```bash
user@ubuntu:~$ sudo ufw status numbered
     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     DENY IN     Anywhere                  
[ 2] 22/tcp (v6)                DENY IN     Anywhere (v6)   
```

Pour supprimer une règle, exécutez la commande suivante en indiquant le numéro de la règle à supprimer :

```bash
user@ubuntu:~$ sudo ufw delete 2
Deleting:
 deny 22/tcp
Proceed with operation (y|n)? y
Rule deleted (v6)
```

**Which Linux firewall utility is considered to be the successor of "iptables"?**

**Réponse :** `nftables`

**What rule would you issue with ufw to deny all outgoing traffic from your machine as a default policy? (answer without sudo)**

**Réponse :** `ufw default deny outgoing`

**Room Complétée**

{% include comments.html %}