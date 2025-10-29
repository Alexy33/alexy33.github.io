---
title: "TryHackMe - IDS fundamentals"
date: 2025-10-30 01:01:00 +0200
categories: [TryHackMe, Learning]
tags: [defense, security]
description: "Write-up de la room IDS fundamentals qui nous apprendra ce qu'est un IDS"
image:
  path: /assets/img/posts/tryhackme-introduction-SIEM.png
  alt: "ISD fundamentals"
---

## Informations sur la room

Apprenez les fondamentaux de l'IDS, ainsi que l'expérience pratique de Snort.

**Lien :** [IDS fundamentals](https://tryhackme.com/room/idsfundamentals)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Types de systèmes de détection d'intrusion (IDS) et leurs capacités de détection
- Fonctionnement de Snort IDS
- Règles par défaut et personnalisées dans Snort IDS
- Création d'une règle personnalisée dans Snort IDS

---

## Solutions des tâches

### Task 1 - What Is an IDS

Comme nous le savons, les pare-feu sont la solution de sécurité généralement déployée à la périphérie d'un réseau pour **protéger son trafic entrant et sortant**. Le pare-feu vérifie le trafic lors de l'établissement d'une connexion et la bloque si elle enfreint ses règles. Cependant, un système de sécurité est nécessaire pour **détecter les activités des connexions ayant déjà franchi le pare-feu**. Ainsi, si un attaquant parvient à contourner un pare-feu via une connexion d'apparence légitime et à commettre des actes malveillants au sein du réseau, un mécanisme de détection rapide est indispensable. C'est pourquoi nous utilisons une solution de sécurité interne au réseau : `Intrusion Detection System` (IDS).

---

**Can an intrusion detection system (IDS) prevent the threat after it detects it? Yea/Nay**

**Réponse :** `Nay`

### Task 2 - Types of IDS

Les IDS peuvent être classés différemment selon certains facteurs. Leur principale classification dépend de leurs **modes de déploiement et de détection**.

#### Modes de déploiement

Les IDS peuvent être déployés de la manière suivante :

- `Système de détection d'intrusions` (HIDS) : Les solutions IDS sont installées individuellement sur chaque hôte et détectent uniquement les menaces de sécurité potentielles associées à cet hôte. Elles offrent une visibilité détaillée des activités de l'hôte. Cependant, leur gestion peut s'avérer complexe sur les grands réseaux, car elles sont gourmandes en ressources et nécessitent une gestion sur chaque hôte.

- `Système de détection d'intrusions réseau` (NIDS) : Les solutions IDS sont essentielles pour détecter les activités potentiellement malveillantes sur l'ensemble du réseau, quel que soit l'hôte concerné. Elles surveillent le trafic réseau de tous les hôtes concernés afin de détecter les activités suspectes. Elles offrent une vue centralisée de toutes les détections sur l'ensemble du réseau.

![NIDS](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1723026309300.png)

#### Modes de détection

- `Systèmes de détection d'intrusions` (IDS) `basés sur les signatures` : De nombreuses attaques se produisent chaque jour. Chaque attaque possède un modèle unique, appelé signature. Ces signatures sont conservées par l'IDS dans ses bases de données. Ainsi, si une attaque similaire se reproduit, elle est détectée grâce à sa signature et signalée aux administrateurs de sécurité pour action. Plus la base de données de signatures de l'IDS est robuste, plus il détecte efficacement les menaces connues. Cependant, l'IDS basé sur les signatures est incapable de détecter les attaques zero-day. Ces attaques n'ont pas de signatures antérieures (modèles) et ne sont pas enregistrées dans les bases de données de l'IDS. Par conséquent, l'IDS basé sur les signatures ne peut détecter que les attaques précédentes, et leurs signatures (modèles) sont enregistrées dans la base de données. Dans les tâches suivantes, nous explorerons un IDS basé sur les signatures appelé Snort.

- `Système de détection d'intrusions` (IDS) `basé sur les anomalies` : Ce type d'IDS apprend d'abord le comportement normal (de base) du réseau ou du système et détecte tout écart par rapport à ce comportement. Les systèmes de détection d'intrusion (IDS) basés sur les anomalies peuvent également détecter les attaques zero-day, car ils ne s'appuient pas sur les signatures disponibles. Ils détectent les anomalies au sein du réseau ou du système en comparant l'état actuel au comportement normal (référence). Cependant, ce type d'IDS peut générer de nombreux faux positifs (en identifiant des activités bénignes comme malveillantes), car la nature de la plupart des programmes légitimes est similaire à celle des programmes malveillants. Un IDS basé sur les anomalies les identifierait comme malveillants et considérerait tout comportement inhabituel comme malveillant. Il est possible de réduire les faux positifs générés par un IDS basé sur les anomalies en l'affinant (en définissant manuellement le comportement normal).

- `IDS hybride` : Un IDS hybride combine les méthodes de détection des IDS basés sur les signatures et des IDS basés sur les anomalies afin de tirer parti des atouts de chaque approche. Certaines menaces connues peuvent déjà avoir des signatures dans la base de données de l'IDS ; dans ce cas, l'IDS hybride utilisera la technique de détection de l'IDS basé sur les signatures. S'il rencontre une nouvelle menace, il peut utiliser la méthode de détection de l'IDS basé sur les anomalies.

---

**Which type of IDS is deployed to detect threats throughout the network?**

**Réponse :** `Network Intrusion Detection System`

**Which IDS leverages both signature-based and anomaly-based detection techniques?**

**Réponse :** `Hybrid IDS`

### Task 3 - IDS Example: Snort

Snort est l'une des solutions **IDS open source les plus utilisées**, développée en 1998. Elle utilise la **détection par signature et la détection d'anomalies** pour identifier les menaces connues. Ces dernières sont définies dans les fichiers de règles de l'outil Snort. Plusieurs fichiers de règles intégrés sont préinstallés dans le package. Ces fichiers contiennent divers schémas d'attaque connus. Les règles intégrées de Snort peuvent détecter une grande partie du trafic malveillant. Cependant, vous pouvez configurer Snort pour détecter des types de trafic réseau spécifiques non couverts par les fichiers de règles par défaut. Vous pouvez créer des règles personnalisées en fonction de vos besoins pour détecter un trafic spécifique. Vous pouvez également désactiver les règles de détection intégrées qui ne ciblent pas de trafic dangereux pour votre système ou réseau et définir des règles personnalisées à la place. Dans la tâche suivante, nous explorerons les règles intégrées et créerons des règles personnalisées pour détecter un trafic spécifique.

#### Mode de renifflement

![detection](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1722881168080.png)

| Mode | Description | Cas d'usage |
|------|-------------|-------------|
| **Mode packet sniffer** | Ce mode lit et affiche les paquets réseau sans effectuer d'analyse sur ceux-ci. Le mode packet sniffer de Snort n'est pas directement lié aux capacités IDS, mais il peut être utile pour la surveillance et le dépannage réseau. Dans certains cas, les administrateurs système peuvent avoir besoin de lire le flux de trafic sans effectuer de détection pour diagnostiquer des problèmes spécifiques. Dans ce cas, ils peuvent utiliser le mode packet sniffer de Snort. Ce mode permet d'afficher le trafic réseau sur la console ou même de l'exporter dans un fichier. | L'équipe réseau observe des problèmes de performance réseau. Pour diagnostiquer le problème, elle a besoin d'informations détaillées sur le trafic réseau. À cette fin, elle peut utiliser le mode packet sniffer de Snort. |
| **Mode packet logging** | Snort effectue la détection sur le trafic réseau en temps réel et affiche les détections sous forme d'alertes sur la console pour que les administrateurs de sécurité puissent agir. Cependant, dans certains cas, le trafic réseau doit être enregistré pour une analyse ultérieure. Le mode packet logging de Snort permet d'enregistrer le trafic réseau sous forme de fichier PCAP (format de capture de paquets standard). Cela inclut tout le trafic réseau et toutes les détections associées. Les enquêteurs forensiques peuvent utiliser ces fichiers de logs Snort pour effectuer l'analyse des causes profondes des attaques précédentes. | L'équipe de sécurité doit initier une enquête forensique sur une attaque réseau. Elle aurait besoin des logs de trafic pour effectuer l'analyse des causes profondes. Le trafic réseau enregistré via le mode packet logging de Snort peut les aider. |
| **Mode Network Intrusion Detection System** | Le mode NIDS de Snort est le mode principal qui surveille le trafic réseau en temps réel et applique ses fichiers de règles pour identifier toute correspondance avec les modèles d'attaque connus stockés sous forme de signatures. En cas de correspondance, il génère une alerte. Ce mode fournit la fonctionnalité principale d'une solution IDS. | L'équipe de sécurité doit surveiller de manière proactive son réseau ou ses systèmes pour détecter les menaces potentielles. Elle peut exploiter le mode NIDS de Snort pour y parvenir. |

---

**Which mode of Snort helps us to log the network traffic in a PCAP file?**

**Réponse :** `Packet Logging Mode`

**What is the primary mode of Snort called?**

**Réponse :** `Network Intrusion Detection System Mode`

### Task 4 - Snort Usage

Snort intègre des fichiers de règles, un fichier de configuration et d'autres fichiers. Ces fichiers sont stockés dans le répertoire `/etc/snort`. Le fichier clé de Snort est son fichier de configuration `snort.conf`, où vous pouvez spécifier les fichiers de règles à activer, la plage réseau à surveiller et autoriser d'autres paramètres. Les fichiers de règles sont stockés dans le dossier rules. Utilisons la commande **ls** pour lister tous les fichiers et dossiers présents dans le répertoire principal de Snort :

```bash
ubuntu@tryhackme:~$ ls /etc/snort
classification.config  reference.config  snort.debian.conf
community-sid-msg.map  rules             threshold.conf
gen-msg.map            snort.conf        unicode.map
```

#### Format des règles

Voyons maintenant comment créer des règles dans Snort. Il existe une méthode spécifique pour les écrire. Un exemple de règle détecterait les paquets `ICMP` (généralement utilisés lors du ping d'un hôte) provenant de n'importe quelle adresse IP et port et atteignant le réseau domestique (la plage réseau est définie dans le fichier de configuration de Snort) vers n'importe quel port. Une fois ce trafic détecté, Snort génère des alertes « **Ping détecté** ».

![detected](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1725532438800.png)

#### Création d'une règle

Copions la règle d'exemple expliquée ci-dessus dans le fichier personnalisé « **local.rules** » du répertoire des règles Snort.

Pour commencer, ouvrez le fichier « **local.rules** » dans un éditeur de texte :

```bash
ubuntu@tryhackme:~$ sudo nano /etc/snort/rules/local.rules
```

Ajoutez maintenant la règle suivante après les règles déjà présentes dans le fichier : `alert icmp any any -> 127.0.0.1 any (msg:"Loopback Ping Detected"; sid:10003; rev:1;)`

#### Test des règles

Commençons par lancer Snort pour détecter toute intrusion définie dans le fichier de règles. Pour cela, exécutez la commande suivante avec les privilèges sudo dans votre console :

```bash
ubuntu@tryhackme:~$ sudo snort -q -l /var/log/snort -i lo -A console -c /etc/snort/snort.conf
```

> Si votre interface de bouclage ne s'appelle pas « **lo** », remplacez-la par le nom d'interface correct.
{: .prompt-info}

Cette règle étant conçue pour nous alerter de tout paquet ICMP destiné à notre adresse de bouclage, essayons d'envoyer une requête ping à notre adresse de bouclage pour vérifier si notre règle fonctionne :

```bash
ubuntu@tryhackme:~$ ping 127.0.0.1
```

La capture d'écran ci-dessous montre l'alerte « Ping de bouclage détecté » générée par Snort lorsque nous envoyons un ping à l'adresse IP de bouclage de notre hôte. Cela signifie que notre règle fonctionne correctement.

```bash
ubuntu@tryhackme:~$ sudo snort -q -l /var/log/snort -i lo -A console -c /etc/snort/snort.conf
07/24-10:46:52.401504  [**] [1:1000001:1] Loopback Ping Detected [**] [Priority: 0] {ICMP} 127.0.0.1 -> 127.0.0.1
07/24-10:46:53.406552  [**] [1:1000001:1] Loopback Ping Detected [**] [Priority: 0] {ICMP} 127.0.0.1 -> 127.0.0.1
07/24-10:46:54.410544  [**] [1:1000001:1] Loopback Ping Detected [**] [Priority: 0] {ICMP} 127.0.0.1 -> 127.0.0.1
```

#### Exécution de Snort sur des fichiers PCAP

Nous avons vu comment Snort peut être utilisé pour détecter les intrusions sur le trafic en temps réel. Cependant, il arrive parfois que l'historique du trafic réseau soit enregistré dans un fichier et qu'une investigation forensique soit nécessaire pour identifier tout signe d'intrusion dans ce trafic. Ce trafic est généralement enregistré au format standard de capture de paquets « PCAP ». Snort est également capable d'effectuer des détections sur ces fichiers PCAP contenant l'historique du trafic réseau.

![Snort](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1723014181865.png)

```bash
ubuntu@tryhackme:~$ sudo snort -q -l /var/log/snort -r Task.pcap -A console -c /etc/snort/snort.conf
```

> Remplacez « **Task.pcap** » par le chemin d'accès à votre fichier PCAP pour analyse.
{: .prompt-info}

---

**Where is the main directory of Snort that stores its files?**

**Réponse :** `/etc/snort`

**Which field in the Snort rule indicates the revision number of the rule?**

**Réponse :** `rev`

**Which protocol is defined in the sample rule created in the task?**

**Réponse :** `ICMP`

**What is the file name that contains custom rules for Snort?**

**Réponse :** `local.rules`

---

### Task 5 - Practical Lab

**Scénario** : Vous êtes un expert en cybersécurité externe. Une entreprise vous contacte pour enquêter sur une récente attaque contre son réseau. Elle vous a fourni un fichier PCAP nommé « **Intro_to_IDS.pcap** », contenant le **trafic réseau capturé** pendant l’attaque. Votre tâche consiste à exécuter Snort sur ce fichier PCAP et à répondre aux questions posées.

> Le fichier PCAP « **Intro_to_IDS.pcap** » se trouve dans le répertoire « **/etc/snort/** ». Vous devez vous déplacer dans ce répertoire et exécuter la commande d’analyse PCAP sur ce fichier, de la même manière que dans la tâche 4.
{: .prompt-info}

**What is the IP address of the machine that tried to connect to the subject machine using SSH?**

**Réponse :** `10.11.90.211`

**What other rule message besides the SSH message is detected in the PCAP file?**

**Réponse :** `Ping Detected`

**What is the sid of the rule that detects SSH?**

**Réponse :** `1000002`

**Room Complétée**

{% include comments.html %}