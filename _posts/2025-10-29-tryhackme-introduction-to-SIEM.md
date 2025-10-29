---
title: "TryHackMe - Introduction to SIEM"
date: 2025-10-29 00:13:00 +0200
categories: [TryHackMe, Learning]
tags: [defense, logs, security]
description: "Write-up de la room qui nous apprendra ce qu'est un SIEM"
image:
  path: /assets/img/posts/tryhackme-introduction-SIEM.png
  alt: "introduction to SIEM"
---

## Informations sur la room

Une introduction à la gestion des informations et des événements de sécurité.

**Lien :** [Introduction to SIEM](https://tryhackme.com/room/introtosiem)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Qu'est-ce qu'un SIEM et comment fonctionne-t-il ?
- Pourquoi un SIEM est-il nécessaire ?
- Qu'est-ce que la visibilité réseau ?
- Que sont les sources de journaux et comment s'effectue l'ingestion des logs ?
- Quelles sont les fonctionnalités d'un SIEM ?

---

## Solutions des tâches

### Task 1 - Introduction

SIEM (**Security Information and Event Management system**) est un outil qui **collecte** les données de différents terminaux/équipements réseau, les stocke de manière centralisée et les corrèle. Cette formation abordera les concepts de base nécessaires à la compréhension du SIEM et de son fonctionnement.

---

**What does SIEM stand for?**

**Réponse :** `Security Information and Event Management system**) est un outil qui **collecte`

### Task 2 - Network Visibility through SIEM

Avant d'expliquer l'importance du SIEM, comprenons d'abord pourquoi il est essentiel d'avoir une meilleure visibilité sur toutes les activités d'un réseau. L'image ci-dessous illustre un réseau simple comprenant plusieurs terminaux Linux/Windows, un serveur de données et un site web. Chaque composant communique avec les autres ou accède à Internet via un **routeur**.

![reseau](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e8dd9a4a45e18443162feab/room-content/41df28fd5cb0b3f4f8ee8616ed315d94.png)

Comme nous le savons, chaque composant réseau peut disposer d'**une ou plusieurs sources de log** générant des logs différents. Par exemple, configurer Sysmon avec les logs d'événements Windows pour une meilleure visibilité sur Windows Endpoint peut être une solution. Nous pouvons diviser nos sources de logs réseau en deux parties logiques :

**1) Sources de logs centrées sur l'hôte**

Il s'agit de sources de logs qui enregistrent les événements survenus sur l'hôte ou liés à celui-ci. Parmi les sources générant des logs centrés sur l'hôte, on peut citer les logs d'événements Windows, Sysmon, Osquery, etc. Voici quelques exemples de logs centrés sur l'hôte :

- Un utilisateur accédant à un fichier ;
- Un utilisateur tentant de s'authentifier ;
- Une activité d'exécution de processus ;
- Un processus ajoutant, modifiant ou supprimant une clé ou une valeur de registre ;
- Une exécution 

**2) Sources de logs réseau**

Les logs réseau sont générés lorsque les hôtes communiquent entre eux ou accèdent à Internet pour visiter un site web. Parmi les protocoles réseau, on trouve **SSH, VPN, HTTP/s, FTP, etc**. Exemples d'événements :

- Connexion SSH
- Accès à un fichier via FTP
- Trafic web
- Accès d'un utilisateur aux ressources de l'entreprise via VPN
- Partage de fichiers réseau

#### Importance du SIEM

Démontre les capacités du SOC. Maintenant que nous avons abordé les différents types de logs, il est temps de comprendre l'importance du SIEM. Comme tous ces appareils génèrent des centaines d'événements par seconde, examiner les logs d'événements de chaque appareil, un par un, en cas d'incident, peut s'avérer **fastidieux**. C'est l'un des avantages d'une `solution SIEM`. Elle collecte non seulement les logs de diverses sources en temps réel, mais permet également de corréler les événements, de les parcourir, d'enquêter sur les incidents et de réagir rapidement. Voici quelques fonctionnalités clés du SIEM :

- Ingestion des logs en temps réel
- Alertes en cas d'activités anormales
- Surveillance et visibilité 24h/24 et 7j/7
- Protection contre les menaces les plus récentes grâce à une détection précoce
- Analyse et visualisation des données
- Possibilité d'enquêter sur les incidents passés.

![SIEM](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e8dd9a4a45e18443162feab/room-content/63724f4da84dd3cfbaf2937790910e20.png)

---

**Is Registry-related activity host-centric or network-centric?**

**Réponse :** `host-centric`

**Is VPN related activity host-centric or network-centric?**

**Réponse :** `network-centric`

### Task 3 - Log Sources and Log Ingestion

**Chaque appareil** du réseau génère un logs à chaque activité, comme la visite d'un site web, la connexion SSH, la connexion à son poste de travail, etc. Voici quelques exemples d'appareils courants présents dans un environnement réseau :

#### Machine Windows

Windows enregistre chaque événement consultable via l'**Observateur d'événements**. Cet observateur attribue un `identifiant unique` à chaque type d'activité, facilitant ainsi son analyse et son suivi. Pour visualiser les événements dans un environnement Windows, saisissez « Observateur d'événements » dans la barre de recherche. Vous serez redirigé vers l'outil où sont stockés et consultables les différents logs, comme illustré ci-dessous. Ces logs, provenant de tous les terminaux Windows, sont transmis à la solution SIEM pour une surveillance et une meilleure visibilité.

![event viewer](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e8dd9a4a45e18443162feab/room-content/30beed26fc514cb7f52773b88a4510b9.gif)

#### Poste de travail Linux

Le système d'exploitation Linux stocke tous les logs (**événements, erreurs, avertissements, etc**.) qui sont ensuite intégrés au SIEM pour une **surveillance continue**. Voici quelques emplacements courants où Linux stocke les logs:

- `/var/log/httpd` : Contient les logs des **requêtes/réponses HTTP et des erreurs**.

- `/var/log/cron` : Stocke les événements liés aux tâches **cron**.

- `/var/log/auth.log` et `/var/log/secure` : Stockent les logs d'**authentification**.

- `/var/log/kern` : Ce fichier stocke les événements liés au **noyau**.

Voici un exemple simple de logs pour **cron** :

```bash
May 28 13:04:20 ebr crond[2843]: /usr/sbin/crond 4.4 dillon's cron daemon, started with loglevel notice
May 28 13:04:20 ebr crond[2843]: no timestamp found (user root job sys-hourly)
May 28 13:04:20 ebr crond[2843]: no timestamp found (user root job sys-daily)
May 28 13:04:20 ebr crond[2843]: no timestamp found (user root job sys-weekly)
May 28 13:04:20 ebr crond[2843]: no timestamp found (user root job sys-monthly)
Jun 13 07:46:22 ebr crond[3592]: unable to exec /usr/sbin/sendmail: cron output for user root job sys-daily to /dev/null
```

#### Serveur Web

Il est important de surveiller toutes les **requêtes et réponses entrantes et sortantes** du serveur web afin de détecter toute tentative d'attaque. Sous Linux, les emplacements courants pour les logs Apache sont `/var/log/apache` ou `/var/log/httpd`.

Voici un exemple de logs Apache :

```bash
192.168.21.200 - - [21/March/2022:10:17:10 -0300] "GET /cgi-bin/try/ HTTP/1.0" 200 3395
127.0.0.1 - - [21/March/2022:10:22:04 -0300] "GET / HTTP/1.0" 200 2216
```

#### Ingestion des logs:

![logs ingestion](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e8dd9a4a45e18443162feab/room-content/593abd2bfd9fb31329bd1a6a80bf5ee0.png)

Ces logs contiennent une mine d'informations et peuvent contribuer à identifier les problèmes de sécurité. Chaque solution SIEM possède **sa propre méthode d'ingestion** des logs. Voici quelques méthodes courantes utilisées par ces solutions :

1) `Agent / Forwarder` : Ces solutions SIEM fournissent un outil léger appelé agent (transmetteur chez Splunk) qui s'installe sur le poste de travail. Il est configuré pour **capturer tous les logs importants** et les envoyer au serveur SIEM.

2) `Syslog` : Syslog est un protocole largement utilisé pour **collecter les données provenant de divers systèmes**, tels que les serveurs web, les bases de données, etc., et les envoyer en temps réel vers une destination centralisée.

3) `Manual Upload` : Certaines solutions SIEM, comme Splunk et ELK, permettent aux utilisateurs d'**ingérer des données hors ligne** pour une analyse rapide. Une fois les données ingérées, elles sont normalisées et mises à disposition pour l'analyse.

4) `Port-Forwarding` : les solutions SIEM peuvent également être configurées pour **écouter sur un certain port**, puis les points de terminaison **transfèrent les données à l'instance SIEM** sur le port d'écoute.

---

**In which location within a Linux environment are HTTP logs stored?**

**Réponse :** `/var/log/httpd`

### Task 4 - Why SIEM

Le SIEM permet de **corréler les données collectées** afin de détecter les menaces. Dès qu'une menace est détectée ou qu'un seuil est franchi, une alerte est générée. Cette alerte permet aux analystes de prendre les mesures appropriées en fonction de l'enquête. Le SIEM joue un rôle important dans le domaine de la cybersécurité et permet de **détecter et de se protéger** rapidement contre les menaces les plus récentes. Il offre une bonne visibilité sur l'activité de l'infrastructure réseau.
Fonctionnalités du SIEM

Le SIEM est un composant majeur de l'écosystème d'un centre d'opérations de sécurité (SOC), comme illustré ci-dessous. Il commence par collecter les journaux et vérifier si un événement/flux correspond à la condition définie par la règle ou a franchi un certain seuil.

Parmi les fonctionnalités courantes du SIEM, on peut citer :

- Corrélation entre les événements provenant de différentes sources de logs.
- Fournir une visibilité sur les activités centrées sur l'hôte et le réseau.
- Permettre aux analystes d'enquêter sur les menaces les plus récentes et d'y répondre rapidement.
- Trouver les menaces non détectées par les règles en vigueur.

![SIEM](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e8dd9a4a45e18443162feab/room-content/aa4ad2c67e6f4a491845554b6d3bc0a1.png)

**Responsabilités d'un analyste SOC**

Les analystes SOC utilisent des solutions SIEM pour une **meilleure visibilité de l'activité du réseau**. Leurs responsabilités incluent notamment :

- Surveillance et investigation.

- Identification des faux positifs.

- Optimisation des règles générant du bruit ou des faux positifs.

- Rapports et conformité.

- Identification et correction des zones d'ombre du réseau.

### Task 5 - Analysing Logs and Alerts

#### Dashboard

Les Dashboard sont essentiels à tout SIEM. Le SIEM présente les données pour analyse après leur normalisation et leur ingestion. Le résumé de ces analyses est présenté sous forme d'informations exploitables grâce à différents dashboard. Chaque solution SIEM propose des dashboard par défaut et offre la possibilité de créer des dashboard personnalisés. Voici quelques exemples d'informations disponibles dans un tableau de bord :

- Alertes importantes

- Notifications système

- Alertes d'intégrité

- Liste des tentatives de connexion infructueuses

- Nombre d'événements ingérés

- Règles déclenchées

- Principaux domaines visités

![dashboard](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e8dd9a4a45e18443162feab/room-content/24f94de3e052afd4702440c06e81e622.png)

#### Règles de corrélation

Les règles de corrélation jouent un rôle crucial dans la détection rapide des menaces, permettant aux analystes d'agir sans délai. Il s'agit d'expressions logiques configurées pour être déclenchées. Voici quelques exemples :

- Si un utilisateur effectue 5 `tentatives de connexion` infructueuses en 10 secondes : déclencher une alerte pour tentatives de connexion infructueuses multiples.

- Si la connexion réussit `après plusieurs tentatives` infructueuses : déclencher une alerte pour connexion réussie après plusieurs tentatives.

- Une règle est configurée pour déclencher une alerte à chaque fois qu'un utilisateur `branche une clé USB` (utile si l'utilisation des clés USB est restreinte par la politique de l'entreprise).

- Si le `trafic sortant` dépasse 25 Mo : déclencher une alerte pour tentative potentielle d'**exfiltration de données** (généralement, cela dépend de la politique de l'entreprise).

#### Création d'une règle de corrélation

Pour comprendre le **fonctionnement d'une règle**, prenons l'exemple des cas d'utilisation suivants des journaux d'événements :

**Cas d'utilisation 1 :**

Après l'exploitation, les attaquants ont tendance à supprimer les journaux pour effacer leurs traces. Un ID d'événement unique, `104`, est enregistré chaque fois qu'un utilisateur tente de **supprimer ou d'effacer des logs** d'événements. Pour créer une règle basée sur cette activité, la condition peut être définie comme suit :

Règle : Si la source du journal est `WinEventLog AND que l'ID d'événement est 104`, déclencher une alerte « logs d'événements effacé ».

**Cas d'utilisation 2 :**

Après l'exploitation ou l'élévation de privilèges, les attaquants utilisent des commandes comme « `whoami` ». Les champs suivants sont utiles à inclure dans la règle :

- Source du logs : identifier la source du logs qui **capture** les logs d'événements.

- ID d'événement : quel `ID` d'événement est associé à l'exécution d'un processus ? Dans ce cas, l'ID d'événement `4688` est pertinent.

- Nom du nouveau processus : quel nom de processus est pertinent à inclure dans la règle ?

Règle : Si la source du journal est `WinEventLog AND que le code d’événement est 4688`, et que **NewProcessName** contient « `whoami` », alors déclencher une alerte : Exécution de la commande `ALERT WHOAMI DÉTECTED`.

Dans la tâche précédente, l’importance des paires champ-valeur a été abordée. Les règles de corrélation surveillent les valeurs de certains champs pour déclencher des actions. C’est pourquoi il est important d’ingérer des journaux normalisés.

#### Analyse des alertes

Lors de la surveillance d'un SIEM, les analystes passent la majeure partie de leur temps sur les dashboard, qui présentent de manière synthétique diverses informations clés sur le **réseau**. Dès qu'une alerte est déclenchée, les événements et flux associés sont examinés, et la règle est vérifiée afin de déterminer si les conditions sont remplies. L'analyste détermine ensuite s'il s'agit d'un **vrai ou d'un faux positif**. Voici quelques actions effectuées après l'analyse :

- Alerte fausse alerte. Il peut être nécessaire d'**ajuster la règle** pour éviter que des faux positifs similaires ne se reproduisent.

- Alerte vraie positive. **Poursuite de l'investigation**.

- **Contacter le propriétaire** de la ressource pour obtenir des informations sur l'activité.

- Activité suspecte confirmée. **Isoler** le système infecté.

- **Bloquer** l'adresse IP suspecte.

---

**Which Event ID is generated when event logs are removed?**

**Réponse :** `104`

**What type of alert may require tuning?**

**Réponse :** `false alarm`

### Task 6 - Lab Work

**Click on Start Suspicious Activity, which process caused the alert?**

**Réponse :** `cudominer.exe`

**Find the event that caused the alert, which user was responsible for the process execution?**

**Réponse :** `chris`

**What is the hostname of the suspect user?**

**Réponse :** `HR_02`

**Examine the rule and the suspicious process; which term matched the rule that caused the alert?**

**Réponse :** `miner`

**What is the best option that represents the event? Choose from the following:**

- False-Positive

- True-Positive

**Réponse :** `True-Positive`

**Selecting the right ACTION will display the FLAG. What is the FLAG?**

**Réponse :** `THM{000_SIEM_INTRO}`

### Task 6 - Conclusion

Dans cette room on a pu voir et comprendre ce qu'est le **SIEM**

**Room Complétée**

{% include comments.html %}