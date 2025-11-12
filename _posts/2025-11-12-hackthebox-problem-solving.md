---
title: "HackTheBox - Problem Solving"
date: 2025-11-11 22:11:00 +0200
categories: [HackTheBox, Learning]
tags: [learning]
description: "Write-up du module Problem Solving"
image:
  path: /assets/img/posts/getting-started.png
  alt: "Problem Solving"
---

## Informations sur la room

Découvrez le cours HTB sur comment résoudre des problèmes en tant que Penetration tester et éviter les pièges courants

**Lien :** [Problem Solving](https://academy.hackthebox.com/beta/module/77/section/730)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Apprendre a régler des problèmes sur HTB
- Apprendre a éviter les pièges courants

---

## Common Pitfalls

Lors de tests d'intrusion ou d'attaques sur des machines/laboratoires HTB, nous commettons fréquemment des erreurs qui **peuvent freiner notre progression**. Cette section aborde certains de ces `pièges courants` et explique comment les **éviter**.

---

### VPN Issues

Il peut arriver que nous rencontrions des problèmes de connexion VPN au réseau des laboratoires HTB. Il convient tout d'abord de vérifier que nous sommes bien connectés au réseau HTB.

#### Still Connected to VPN

La méthode la plus simple pour vérifier si nous nous sommes connectés avec succès au réseau VPN consiste à vérifier si le message `Initialization Sequence Completed` apparaît à la fin de nos messages de connexion VPN :

```bash
Arcony@htb[/htb]$ sudo openvpn ./htb.ovpn

...SNIP...

Initialization Sequence Completed
```

#### Getting VPN Address

Une autre façon de vérifier si nous sommes connectés au réseau VPN consiste à vérifier notre **adresse tun0** VPN, que nous pouvons trouver avec la commande suivante :

```bash
Arcony@htb[/htb]$ ip -4 a show tun0

6: tun0: <POINTOPOINT,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UNKNOWN group default qlen 500
    inet 10.10.10.1/23 scope global tun0
       valid_lft forever preferred_lft forever
```

Dès que nous aurons récupéré notre adresse IP, nous devrions être connectés au réseau VPN.

#### Checking Routing Table

Une autre façon de vérifier la connectivité consiste à utiliser la commande `sudo netstat -rn` pour afficher notre table de routage :

```bash
Arcony@htb[/htb]$ sudo netstat -rn

[sudo] password for user: 

Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
0.0.0.0         192.168.195.2   0.0.0.0         UG        0 0          0 eth0
10.10.14.0      0.0.0.0         255.255.254.0   U         0 0          0 tun0
10.129.0.0      10.10.14.1      255.255.0.0     UG        0 0          0 tun0
192.168.1.0   0.0.0.0         255.255.255.0   U         0 0          0 eth0
```

#### Pinging Gateway

De là, nous pouvons voir que nous sommes connectés au réseau `10.10.14.0/23` sur l'adaptateur **tun0** et que nous avons accès au réseau `10.129.0.0/16` et que nous pouvons pinguer la passerelle `10.10.14.1` pour confirmer l'accès.

```bash
Arcony@htb[/htb]$ ping -c 4 10.10.14.1
PING 10.10.14.1 (10.10.14.1) 56(84) bytes of data.
64 bytes from 10.10.14.1: icmp_seq=1 ttl=64 time=111 ms
64 bytes from 10.10.14.1: icmp_seq=2 ttl=64 time=111 ms
64 bytes from 10.10.14.1: icmp_seq=3 ttl=64 time=111 ms
64 bytes from 10.10.14.1: icmp_seq=4 ttl=64 time=111 ms

--- 10.10.14.1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3012ms
rtt min/avg/max/mdev = 110.574/110.793/111.056/0.174 ms
```

Enfin, nous pouvons soit attaquer un hôte cible assigné sur le réseau `10.129.0.0/16`, soit commencer l'énumération des hôtes actifs.

#### Working on Two Devices

Le VPN HTB ne peut être connecté `qu'à un seul appareil simultanément`. Si vous êtes connecté sur un appareil et que vous tentez de vous connecter depuis un autre, la seconde tentative échouera.

Par exemple, cela peut se produire si votre connexion VPN est établie sur votre PwnBox et que vous essayez de vous y **connecter simultanément depuis votre machine virtuelle Parrot**. De même, si vous êtes connecté sur votre machine virtuelle Parrot et que vous souhaitez ensuite passer à une machine virtuelle Windows pour effectuer un test.

#### Checking Region

Si vous constatez un décalage notable dans votre connexion VPN, comme une latence lors des pings ou des connexions SSH, assurez-vous d'être connecté à la région la plus appropriée. HackTheBox propose des serveurs VPN dans le monde entier, notamment en **Europe**, aux **États-Unis**, en **Australie** et à **Singapour**. Idéalement, il est conseillé de se connecter au serveur le plus proche de votre position afin d'obtenir **la meilleure connexion possible**.

Pour changer de serveur VPN, rendez-vous sur [HackTheBox](https://app.hackthebox.com/home), cliquez sur l'icône en haut à droite intitulée « **Accès au labo** » ou « **Hors ligne** », puis sur « **Labos** » et enfin sur « **OpenVPN** ». Vous pourrez alors choisir l'emplacement de votre serveur VPN et sélectionner un serveur parmi ceux disponibles dans cette région.

![VPN](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_vpn.jpg)

> Les utilisateurs disposant d'un abonnement gratuit peuvent se connecter à 1 à 3 serveurs gratuits par région. Les utilisateurs ayant un abonnement VPN peuvent se connecter à des serveurs VIP, offrant une connexion plus rapide et une consommation de bande passante réduite.
{: .prompt-info}

#### VPN Troubleshooting

En cas de problème technique lors de la connexion au VPN, vous trouverez des instructions détaillées pour le dépannage des connexions VPN sur cette [page d'aide de HackTheBox](https://help.hackthebox.com/troubleshooting/v2-vpn-connection-troubleshooting).

---

### Burp Suite Proxy Issues

[Burp Suite](https://portswigger.net/burp/communitydownload) est un **outil essentiel** lors des tests d'intrusion d'applications web (ainsi que pour d'autres types d'évaluation). Burp Suite est un **proxy d'application web** et peut engendrer certains problèmes sur nos systèmes.

#### Not Disabling Proxy

Lorsque nous activons le `proxy Burp` dans notre navigateur, `Burp` commence à **capturer notre trafic et à intercepter nos requêtes**. Cela bloque toute requête effectuée dans le navigateur, c'est-à-dire la consultation d'une page, jusqu'à ce que nous retournions dans Burp, examinions la requête et la redirigeions.

Une erreur fréquente consiste à **oublier de désactiver le proxy du navigateur après avoir fermé Burp**; il continue alors d'intercepter nos requêtes. Dans ce cas, notre navigateur ne charge aucune page. Il faut donc **vérifier si le proxy est toujours activé**. Pour cela, cliquez sur l'icône du plugin `Foxy Proxy` dans Firefox et assurez-vous qu'il est désactivé.

![foxy](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/30/foxyproxy_options.jpg)

Si vous n'utilisez pas d'extension comme `Foxy Proxy`, vérifiez les paramètres de connexion de votre navigateur et assurez-vous que le proxy est désactivé. Une fois cette vérification effectuée, vous devriez pouvoir naviguer sans problème.

---

### Changing SSH Key and Password

Si vous rencontrez des problèmes de connexion aux serveurs SSH ou à votre machine depuis un serveur distant, vous pouvez renouveler ou modifier votre clé et votre mot de passe SSH afin d'éviter tout dysfonctionnement. Pour ce faire, utilisez la commande `ssh-keygen`, comme suit :

```bash
Arcony@htb[/htb]$ ssh-keygen

Generating public/private rsa key pair.
Enter file in which to save the key (/home/parrot/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase):
Enter same passphrase again:

Your identification has been saved in /home/parrot/.ssh/id_rsa
Our public key has been saved in /home/parrot/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:...SNIP... parrot@parrot
The key's randomart image is:
+---[RSA 3072]----+
|            o..  |
|     ...SNIP     |
|     ...SNIP     |
|     ...SNIP     |
|     ...SNIP     |
|     ...SNIP     |
|     ...SNIP     |
|       + +oo+o   |
+----[SHA256]-----+
```

Par défaut, les clés SSH sont stockées dans le dossier `.ssh` de votre répertoire personnel (par exemple, `/home/htb-student/.ssh`). Si vous souhaitez créer une clé SSH dans un autre répertoire, vous pouvez indiquer son chemin absolu lorsque le système vous le demande. Vous pouvez chiffrer votre clé SSH avec un mot de passe lorsque le système vous le demande, ou laisser le champ vide si vous ne souhaitez pas utiliser de mot de passe.

## Getting Help

Lorsque nous commençons à travailler sur des boîtes dans **Hack The Box**, il est probable que nous soyons bloqués à certains endroits et que nous ayons besoin de demander des conseils à d'autres joueurs pour pouvoir progresser. Voici quelques domaines où nous pouvons obtenir de l'aide.

> Lors de toutes vos activités sur Hack The Box, vous devez toujours respecter les règles de HTB, que vous pouvez consulter sur [ce lien](https://app.hackthebox.com/rules).
{: .prompt-info}

---

### Forum

Le [forum Hack The Box](https://forum.hackthebox.com/) est un excellent endroit pour discuter des boîtes et des défis **Hack The Box**, qu'ils soient encore en cours de développement ou non.

![forum](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_forums.png)

Chaque boîte possède un forum de discussion officiel où l'on discute en direct de tous ses aspects, **sans divulgâcher** l'intrigue **ni donner d'indications claires sur la manière de l'exploiter**. Si l'on souhaite s'attaquer à une boîte retirée et que l'on ne veut pas suivre de tutoriel pas à pas, on peut consulter les anciens forums pour y trouver des astuces et des conseils. Ainsi, on peut se lancer des défis sur d'anciennes boîtes et consulter le forum officiel en cas de difficulté.

---

### Discord

Un autre **excellent endroit** pour discuter des boîtes et des défis de **Hack The Box**, ainsi que de divers autres aspects du jeu, est le `serveur Discord` officiel de HTB. Vous pouvez le rejoindre en cliquant sur [ce lien](https://discord.com/invite/hRXnCFA). Il vous sera demandé de télécharger l'application Discord et de créer un compte pour accéder au serveur HTB.

Le serveur Discord aborde un large éventail de sujets liés à **Hack The Box**, et vous y trouverez également les dernières actualités et les tournois. On y discute aussi des annonces générales, **des boîtes et des défis**, **des modules de l'Académie**, **de HTB Labs**, **du hacking et des tests d'intrusion**, **ainsi que du support général**.

![discord](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/77/htb_discord.jpg)

`Veillez à lire attentivement le règlement du serveur afin d'éviter toute infraction.`

---

### Asking Questions Effectively

Si nous sommes bloqués à une étape d'un exercice ou d'un défi, nous pouvons poser notre question sur l'un des canaux mentionnés ci-dessus.

Pour obtenir la meilleure aide possible, il est important de **poser nos questions clairement**.

Assurez-vous d'inclure les éléments suivants dans votre question :

1) À quelle étape de l'exercice/du défi sommes-nous bloqués (utilisateur/root) ?

2) Quelles étapes avons-nous suivies jusqu'à présent ?

3) À quelle étape rencontrons-nous des difficultés et quelles solutions avons-nous essayées pour y remédier ?

4) Essayez toujours d'être précis sur le problème dont vous avez besoin, plutôt que de demander de l'aide de **manière générale**.

En formulant notre question en suivant ces conseils, nous pouvons trouver des idées auxquelles nous n'avions pas pensé et ainsi trouver la réponse. Parfois, un commentaire peut nous éclairer et nous permettre de répondre à notre question. D'autres fois, nous trouverons quelqu'un prêt à nous aider à résoudre notre problème. Il est toujours préférable d'aborder les choses dans une optique d'apprentissage et non pas simplement de chercher des réponses pour marquer des points ou améliorer notre classement. Nous ne devons en aucun cas :

1) Révéler des éléments clés ou des indices qui pourraient gâcher le fonctionnement de la machine pour les autres joueurs.

2) Rester vagues dans nos descriptions sans fournir suffisamment de détails sur ce que nous avons fait.

---

### Answering Questions Effectively

Une fois que vous avez terminé une box ou un défi, vous pouvez aider les autres **en répondant à leurs questions**. Participer à la communauté nous permet de tisser des liens et de renforcer notre équipe, ce qui est un excellent moyen d'améliorer nos tests d'intrusion et notre niveau de sécurité informatique. Cela peut également vous aider à `enrichir votre profil` **Hack The Box** et à mieux comprendre la box ou le défi que vous venez de terminer. Lorsque vous répondez aux questions, veuillez respecter les consignes suivantes :

1) Évitez autant que possible de **dévoiler** des éléments clés de l'intrigue et ne donnez pas d'instructions directes sur la façon de terminer l'étape en cours ou la box entière.

2) Donnez des indices ou des astuces qui peuvent vous guider vers la bonne direction, mais **ne donnez pas de solutions complètes**.

3) **Partagez les ressources** qui vous ont été utiles.

4) Partagez des conseils sur les points qui vous ont posé problème.

---

### Getting Technical Help

En cas de problème technique, vous pouvez consulter la [FAQ officielle de HTB](https://help.hackthebox.com/en/), qui contient de nombreux articles détaillés et utiles. Vous y trouverez probablement la réponse à votre question. Si ce n'est pas le cas, n'hésitez pas à contacter l'assistance HTB. Assurez-vous de `désactiver vos bloqueurs de publicité` pour que la bulle de chat apparaisse en bas à droite de la page.

**Cours complété**

{% include comments.html %}