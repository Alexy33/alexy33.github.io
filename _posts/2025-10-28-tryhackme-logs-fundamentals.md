---
title: "TryHackMe - Logs Fundamentals"
date: 2025-10-28 19:11:00 +0200
categories: [TryHackMe, Learning]
tags: [defense, logs, security]
description: "Write-up de la room qui nous apprendra a comprendre / lire et utiliser ou exploiter les logs pour comprendre ce qu'il s'est passé"
image:
  path: /assets/img/posts/tryhackme-soc-fundamentals.png
  alt: "Logs Fundamentals"
---

## Informations sur la room

Découvrez ce que sont les logs et comment les analyser pour une enquête efficace.

**Lien :** [Logs Fundamentals](https://tryhackme.com/room/logsfundamentals)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Les différents types de logs (journaux)
- Comment analyser les logs
- Analyse des logs d'événements Windows
- Analyse des logs d'accès Web

---

## Solutions des tâches

### Task 1 - Introduction to logs

Les attaquants sont astucieux. Ils évitent de **laisser le maximum de traces** du côté de la victime pour **éviter d'être repérés**. Pourtant, l'équipe de sécurité parvient à déterminer le mode d'exécution de l'attaque et parvient même parfois à en identifier le commanditaire.

| Use Case | Description |
|----------|-------------|
| **Security Events Monitoring** | Logs help us detect anomalous behavior when real-time monitoring is used. |
| **Incident Investigation and Forensics** | Logs are the traces of every kind of activity. It offers detailed information on what happened during the incident. The security team utilizes the logs to perform root cause analysis of incidents. |
| **Troubleshooting** | As the logs also record the errors in systems or applications, they can be used to diagnose issues and helpful in fixing them. |
| **Performance Monitoring** | Logs can also provide valuable insights into the performance of applications. |
| **Auditing and Compliance** | Logs play a major role in Auditing and Compliance, making it easier with its capability to establish a trail of different kinds of activities. |

---

**Where can we find the majority of attack traces in a digital system?**

**Réponse :** `Logs`

### Task 2 - Types of Logs

Dans la tâche précédente, nous avons vu différents cas d'utilisation des logs. Mais un défi se présente. Imaginez que vous deviez analyser un problème dans un système à travers les logs; vous ouvrez le fichier log de ce système et vous êtes perdu face à de nombreux événements de différentes catégories.

Voici la solution : les logs sont **classés en plusieurs catégories** selon le type d'informations qu'ils fournissent. Il vous suffit maintenant d'examiner le fichier log spécifique auquel le problème se rapporte.

| Log Type | Usage | Example |
|----------|-------|---------|
| **System Logs** | The system logs can be helpful in troubleshooting running issues in the OS. These logs provide information on various operating system activities. | - System Startup and shutdown events<br>- Driver Loading events<br>- System Error events<br>- Hardware events |
| **Security Logs** | The security logs help detect and investigate incidents. These logs provide information on the security-related activities in the system. | - Authentication events<br>- Authorization events<br>- Security Policy changes events<br>- User Account changes events<br>- Abnormal Activity events |
| **Application Logs** | The application logs contain specific events related to the application. Any interactive or non-interactive activity happening inside the application will be logged here. | - User Interaction events<br>- Application Changes events<br>- Application Update events<br>- Application Error events |
| **Audit Logs** | The Audit logs provide detailed information on the system changes and user events. These logs are helpful for compliance requirements and can play a vital role in security monitoring as well. | - Data Access events<br>- System Change events<br>- User Activity events<br>- Policy Enforcement events |
| **Network Logs** | Network logs provide information on the network's outgoing and incoming traffic. They play crucial roles in troubleshooting network issues and can also be handy during incident investigations. | - Incoming Network Traffic events<br>- Outgoing Network Traffic events<br>- Network Connection Logs<br>- Network Firewall Logs |
| **Access Logs** | The Access logs provide detailed information about the access to different resources. These resources can be of different types, providing us with information on their access. | - Webserver Access Logs<br>- Database Access Logs<br>- Application Access Logs<br>- API Access Logs |

> Il peut y avoir différents autres types de logs en fonction des différentes applications et des services qu'elles fournissent.
{: .prompt-info}

---

**Which type of logs contain information regarding the incoming and outgoing traffic in the network?**

**Réponse :** `Network logs`

**Which type of logs contain the authentication and authorization events?**

**Réponse :** `security logs`

### Task 3 - Windows Event Logs Analysis

Comme d'autres systèmes d'exploitation, Windows enregistre de nombreuses activités. Celles-ci sont **stockées dans des fichiers logs distincts**, chacun associé à une catégorie spécifique. Voici quelques-uns des types de logs les plus importants stockés dans un système d'exploitation Windows :

- `Application` : De nombreuses applications sont exécutées sur le système d'exploitation. Toutes les informations relatives à ces applications sont enregistrées dans ce fichier, notamment **les erreurs, les avertissements, les problèmes de compatibilité, etc.**

- `Système` : Le système d'exploitation lui-même exécute différentes opérations. Toutes les informations relatives à ces opérations sont enregistrées dans le fichier journal système. Ces informations incluent les problèmes de pilotes, les problèmes matériels, les informations de démarrage et d'arrêt du système, les informations sur les services, etc.

- `Sécurité` : Il s'agit du fichier journal **le plus important de Windows** en matière de sécurité. Il enregistre toutes les activités liées à la sécurité, notamment l'authentification des utilisateurs, les modifications des comptes utilisateurs et des politiques de sécurité, etc.

Outre ces fichiers, plusieurs autres fichiers logs du système d'exploitation Windows sont conçus pour consigner les activités liées à des **actions et applications spécifiques**.

Contrairement aux autres fichiers logs étudiés précédemment, qui ne disposaient d'aucune application intégrée pour les consulter, Windows dispose d'un utilitaire appelé `Observateur d'événements` (**Event Viewer**), qui offre une interface utilisateur conviviale pour consulter et rechercher des informations dans ces logs.

Pour ouvrir l'**Observateur d'événements**, cliquez sur le bouton Démarrer de Windows et saisissez **Event Viewer**. L'Observateur d'événements s'ouvrira, comme illustré ci-dessous. La zone en surbrillance dans la capture d'écran ci-dessous présente les différents logs disponibles.

![logs](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1719215860668)

Vous pouvez cliquer sur "**Windows Logs**" dans la section en surbrillance pour afficher les différents types de logs abordés au début de cette tâche.

La première partie en surbrillance présente les différents fichiers logs. En cliquant sur l'un d'eux, vous verrez les différents logs, comme illustré dans la deuxième partie en surbrillance. Enfin, la troisième partie en surbrillance propose différentes options d'analyse des logs.

![next logs](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1719215860882)

Double-cliquons sur l’un de ces log pour voir son contenu.

![log content](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1719215860911)

Voici à quoi ressemble un journal des événements Windows. Il comporte différents champs. Les principaux sont présentés ci-dessous :

- Description : Ce champ contient des informations détaillées sur l'activité.
- Nom du journal : Le nom du fichier journal indique le nom de l'activité.
- Enregistré : Ce champ indique l'heure de l'activité.
- ID d'événement : Les ID d'événement sont des identifiants uniques pour une activité spécifique.

De nombreux identifiants d'événements sont disponibles dans les logs d'événements Windows. Ils permettent de rechercher une **activité spécifique**. Par exemple, l'identifiant d'événement 4624 identifie de manière unique l'activité d'une connexion réussie ; il suffit donc de rechercher cet identifiant lors de l'analyse des connexions réussies.

Voici un tableau répertoriant quelques identifiants d'événements importants dans le système d'exploitation Windows.

| Event ID | Description |
|----------|-------------|
| **4624** | A user account successfully logged in |
| **4625** | A user account failed to login |
| **4634** | A user account successfully logged off |
| **4720** | A user account was created |
| **4724** | An attempt was made to reset an account's password |
| **4722** | A user account was enabled |
| **4725** | A user account was disabled |
| **4726** | A user account was deleted |

Il existe de nombreux autres identifiants d'événement. Il n'est pas nécessaire de tous les mémoriser, mais il est important de mémoriser les **identifiants essentiels**.

L'**Observateur d'événements** permet de rechercher les logs associés à un identifiant d'événement spécifique grâce à la fonctionnalité « **Filtrer le journal actuel** ». Cliquez sur cette fonctionnalité pour appliquer un filtre.

![filter logs](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1719215860856)

Lorsque nous cliquons sur l'option « **Filtrer le journal actuel** », nous sommes invités à saisir les identifiants d'événement à filtrer. Dans la capture d'écran ci-dessous, j'ai filtré l'identifiant d'événement 4624.

![id](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1719215860786)

Une fois que j'ai appuyé sur le bouton « OK », je peux voir tous les journaux avec l'ID d'événement : 4624. Je peux maintenant afficher n'importe lequel de ces journaux en double-cliquant dessus.

![event](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1719215860652)

---

Vendredi, une organisation critique a signalé avoir été victime d'une cyberattaque. Après enquête, des données critiques ont été exfiltrées d'un serveur de fichiers du réseau de l'organisation. L'équipe de sécurité a réussi à déterminer le nom d'utilisateur et l'adresse IP du système compromis sur le réseau, qui avait accès au serveur de fichiers au moment de l'attaque.

**What is the name of the last user account created on this system?**

Quand on va dans l'application **Event Viewer** on entre dans les logs de sécurité et on met le code `4720` pour filtrer tout les changement avec des créations de compte ou autre et quand on double clique sur la dernière on obtient le résultat comme nouveau nom de compte

**Réponse :** `hacked`

**Which user account created the above account?**

Quand on avait double cliqué sur le dernier utilisateur dans la tâche d'avant tout en haut du message qui apparaissait il y avait l'ancient nom de compte

**Réponse :** `Administrator`

**On what date was this user account enabled? Format: M/D/YYYY**

**Réponse :** `6/7/2024`

**Did this account undergo a password reset as well? Format: Yes/No**

**Réponse :** `yes`

### Task 4 - Web Server Access Logs Analysis

Nous interagissons quotidiennement avec de nombreux sites web. Parfois, nous souhaitons simplement consulter le site, parfois nous connecter ou télécharger un fichier dans un champ de saisie disponible. Il s'agit de différents types de requêtes adressées à un site web. Toutes ces requêtes sont enregistrées par le site web et stockées dans un fichier log sur le serveur web qui l'exécute.

Ce fichier log contient toutes les requêtes adressées au site web, ainsi que des informations sur la **période, l'adresse IP demandée, le type de requête et l'URL**. Voici les champs extraits d'un exemple de journal d'accès au serveur web Apache, disponible dans le répertoire : `/var/log/apache2/access.log`

- Adresse IP : « 172.16.0.1 » - Adresse IP de l'utilisateur ayant effectué la requête.

- Horodatage : « [06/Jun/2024:13:58:44] » - Heure à laquelle la requête a été envoyée au site web.

- Requête : Détails de la requête.
    - Méthode HTTP : « `GET` » - Indique au site web l'action à exécuter sur la requête.
    - URL : « / » - Ressource demandée.

- Code d'état : « 200 » - Réponse du serveur. Des nombres différents indiquent des résultats de réponse différents.

- Agent utilisateur : « Mozilla/5.0 (Macintosh ; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, comme Gecko) Chrome/58.0.3029.110 Safari/537.36 » - Informations sur le système d'exploitation, le navigateur, etc. de l'utilisateur lors de la requête.

---

**What is the IP which made the last GET request to URL: “/contact”?**

```bash
root@ip-10-10-54-51:~/Rooms/logs# cat access.log | grep /contact | grep GET
10.0.0.1 - - [06/Jun/2024:13:54:44] "GET /contact HTTP/1.1" 500 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
172.16.0.1 - - [06/Jun/2024:13:53:44] "GET /contact HTTP/1.1" 500 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
192.168.1.1 - - [05/Jun/2024:16:51:44] "GET /contact HTTP/1.1" 200 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
10.0.0.1 - - [05/Jun/2024:16:50:44] "GET /contact HTTP/1.1" 500 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
10.0.0.1 - - [05/Jun/2024:15:33:44] "GET /contact HTTP/1.1" 200 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
10.0.0.1 - - [04/Jun/2024:13:56:44] "GET /contact HTTP/1.1" 404 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
10.0.0.1 - - [04/Jun/2024:13:48:44] "GET /contact HTTP/1.1" 200 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
10.0.0.1 - - [04/Jun/2024:12:54:44] "GET /contact HTTP/1.1" 500 "-" "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
192.168.1.1 - - [04/Jun/2024:11:53:44] "GET /contact HTTP/1.1" 500 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
```

**When was the last POST request made by IP: “172.16.0.1”?**

```bash
root@ip-10-10-54-51:~/Rooms/logs# cat access.log | grep POST | grep 172.16.0.1
172.16.0.1 - - [06/Jun/2024:13:55:44] "POST /contact HTTP/1.1" 500 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
172.16.0.1 - - [06/Jun/2024:13:44:44] "POST / HTTP/1.1" 404 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
172.16.0.1 - - [06/Jun/2024:13:38:44] "POST /about HTTP/1.1" 200 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
172.16.0.1 - - [05/Jun/2024:18:55:44] "POST /contact HTTP/1.1" 200 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
172.16.0.1 - - [05/Jun/2024:16:45:44] "POST /about HTTP/1.1" 500 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
172.16.0.1 - - [05/Jun/2024:15:52:44] "POST /contact HTTP/1.1" 500 "-" "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
172.16.0.1 - - [04/Jun/2024:11:55:44] "POST /contact HTTP/1.1" 404 "-" "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
172.16.0.1 - - [04/Jun/2024:11:52:44] "POST /contact HTTP/1.1" 200 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
172.16.0.1 - - [04/Jun/2024:10:56:44] "POST /products HTTP/1.1" 500 "-" "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
172.16.0.1 - - [04/Jun/2024:10:51:44] "POST /about HTTP/1.1" 500 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
```

**Réponse :** `06/Jun/2024:13:55:44`

**Based on the answer from question number 2, to which URL was the POST request made?**

**Réponse :** `/contact`

### Task 5 - Conclusion

On a appris a analyser et comprendre le fonctionnement des logs dans un system comme Windows ou autre

**Room Complétée**

{% include comments.html %}