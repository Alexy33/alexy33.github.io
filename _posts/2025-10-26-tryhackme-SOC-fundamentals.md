---
title: "TryHackMe - SOC fundamentals"
date: 2025-10-26 0:57:00 +0200
categories: [TryHackMe, Learning]
tags: [SOC, security]
description: "Write-up de la room SOC fundamentals qui nous apprendra la défense, avec la SOC team"
image:
  path: /assets/img/posts/tryhackme-soc-fundamentals.png
  alt: "SOC fundamentals"
---

## Informations sur la room

Découvrez l’équipe SOC et ses processus.

**Lien :** [SOC fundamentals](https://tryhackme.com/room/socfundamentals)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Construire une base de référence pour le SOC (Security Operations Center)
- Détection et réponse dans SOC
- Le rôle des personnes, des processus et de la technologie

---

## Solutions des tâches

### Task 1 - Introduction to SOC

La technologie a rendu nos vies **plus efficaces**, mais cette efficacité s’accompagne de plus de **responsabilités**. Les craintes des temps modernes ont parcouru un long chemin depuis l’exploitation des actifs physiques. Les données critiques, appelées secrètes, ne sont plus stockées dans des fichiers physiques. Les organisations transportent des tonnes de données confidentielles dans leur réseau et leurs systèmes. Toute perturbation, perte ou modification non autorisée de ces données peut leur causer d'énormes dommages. Les acteurs malveillants découvrent et exploitent quotidiennement de nouvelles vulnérabilités dans ces réseaux et systèmes, devenant ainsi une préoccupation majeure en matière de cybersécurité. Les pratiques de sécurité traditionnelles ne suffisent peut-être pas à prévenir bon nombre de ces menaces. Il est important de consacrer toute une équipe à la gestion de la sécurité de votre organisation.

---

**What does the term SOC stand for?**

**Réponse :** `Security Operations Center`

### Task 2 - Purpose and Components

L'objectif principal de l'équipe SOC est de maintenir la `détection` et la `réponse` intactes. 

![SOC team](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1718872534719)

#### Detection

- **Détecter des vulnérabilitées**
- **Détecter des activités non authorisés**
- **Détecter des violation de règles**
- **Détecter des intrusions**

#### Réponse

`Assistance à la réponse aux incidents` : Une fois qu'un incident est détecté, certaines mesures sont prises pour y répondre. Cette réponse consiste notamment à minimiser son impact et à effectuer une analyse des causes profondes de l'incident. L’équipe SOC aide également l’équipe de réponse aux incidents à réaliser ces étapes.

Il existe **trois piliers** d’un SOC. Avec tous ces piliers, une équipe SOC devient mature et détecte et répond efficacement aux différents incidents. Ces piliers sont `les personnes`, `les processus` et `la technologie`.

![SOC incident](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1718954786769)

---

**The SOC team discovers an unauthorized user is trying to log in to an account. Which capability of SOC is this?**

**Réponse :** `Detection`

**What are the three pillars of a SOC?**

**Réponse :** `People, Process, Technology`

### Task 3 - People

Quelle que soit l’évolution de l’automatisation de la majorité des tâches de sécurité, les personnes d’un SOC seront **toujours importantes**. Une solution de sécurité peut générer de nombreux signaux d'alarme dans un environnement SOC, ce qui peut provoquer **un bruit énorme**.

Imaginez que vous faites partie d’une équipe de pompiers et que vous disposez d’un logiciel centralisé où sont intégrées toutes les alarmes incendie de la ville. Supposons que vous receviez plusieurs notifications d'incendie en même temps, toutes pour des endroits différents. Lorsque vous arrivez dans ces endroits, votre équipe découvre que la plupart d’entre eux n’ont été déclenchés que par une fumée excessive provenant de la cuisson. En fin de compte, tous les efforts seront `une perte de temps et de ressources`.

Dans un SOC, avec des solutions de sécurité en place sans intervention humaine, vous finirez par vous concentrer sur des problèmes moins pertinents. Il y a toujours des personnes qui aident la solution de sécurité à identifier les activités véritablement nuisibles et à permettre une réponse rapide.

![People](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1718872774537)

- Analyste SOC (`niveau 1`) : tout ce qui est détecté par la solution de sécurité passera d'abord par ces **analystes**. Ce sont les premiers intervenants en cas de détection. Les analystes SOC niveau 1 effectuent un tri des alertes de base pour déterminer si une détection spécifique est dangereuse. Ils signalent également ces détections par les canaux appropriés.

- Analyste SOC (`niveau 2`) : bien que le niveau 1 effectue l'analyse de premier niveau, certaines détections peuvent nécessiter une enquête plus approfondie. Les analystes de niveau 2 les aident à approfondir les enquêtes et à corréler les données provenant de plusieurs sources de données pour effectuer une analyse appropriée.

-Analyste SOC (`niveau 3`) : les analystes de niveau 3 sont des professionnels expérimentés qui recherchent de manière proactive tout indicateur de menace et soutiennent les activités de réponse aux incidents. Les détections de gravité critique signalées par les analystes de niveau 1 et 2 sont souvent des incidents de sécurité qui nécessitent des réponses détaillées, notamment le **confinement**, l'**éradication** et la **récupération**. C’est là que l’expérience des analystes de niveau 3 s’avère utile.

- `Ingénieur de sécurité` : tous les analystes travaillent sur des solutions de sécurité. Ces solutions nécessitent un déploiement et une configuration. Les ingénieurs en sécurité déploient et configurent ces solutions de sécurité pour garantir leur bon fonctionnement.

- `Ingénieur de détection` : les règles de sécurité sont la logique construite derrière les solutions de sécurité pour détecter les activités nuisibles. Les analystes de niveaux 2 et 3 créent souvent ces règles, tandis que l'équipe SOC peut parfois également utiliser le rôle d'ingénieur de détection de manière indépendante pour cette responsabilité.

- `Responsable SOC` : le responsable SOC gère les processus suivis par l'équipe SOC et fournit un support. Le responsable SOC reste également en contact avec le RSSI (Chief Information Security Officer) de l’organisation pour lui fournir des mises à jour sur la posture et les efforts de sécurité actuels de l’équipe SOC.

---

**Alert triage and reporting is the responsibility of?**

**Réponse :** `SOC Analyst (Level 1)`

**Which role in the SOC team allows you to work dedicatedly on establishing rules for alerting security solutions?**

**Réponse :** `Detection Engineer`

### Task 4 - Process

#### Alert Triage

Le tri des alertes est la base de l’équipe SOC. La première réponse à toute alerte est **d’effectuer le tri**. Le triage se concentre sur l’analyse de **l’alerte spécifique**. Cela détermine la gravité de l’alerte et nous aide à la hiérarchiser. Le triage des alertes consiste à répondre aux `5 W`. Quels sont ces 5 W ?

![Process](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1718872960352)

Si on prend l'exemple sur l'alerte d'exemple : 

> Alert: Malware detected on Host: GEORGE PC

- `What ?` -> A malicious file was detected on one of the hosts inside the organization’s network.

- `When ?` -> The file was detected at 13:20 on June 5, 2024.

- `Where ?` -> The file was detected in the directory of the host: "GEORGE PC".

- `Who ?` -> The file was detected for the user George.

- `Why ?` -> After the investigation, it was found that the file was downloaded from a pirated software-selling website. The investigation with the user revealed that they downloaded the file as they wanted to use a software for free.

#### Reporting

Les alertes nuisibles détectées doivent être transmises à des analystes de niveau supérieur pour une réponse et une **résolution rapides**. Ces alertes sont remontées sous forme de `tickets` et attribuées aux personnes concernées. Le rapport doit discuter de tous les **5 W** ainsi qu'une analyse approfondie, et des captures d'écran doivent être utilisées comme preuve de l'activité.

#### Incident Response and Forensics

Parfois, les détections signalées pointent vers des activités **hautement malveillantes et critiques**. Dans ces scénarios, les équipes de haut niveau lancent une réponse aux incidents. Le processus de réponse aux incidents est discuté en détail dans la salle de réponse aux incidents. Parfois, une activité médico-légale détaillée doit également être réalisée. Cette activité médico-légale vise à déterminer la cause profonde de l’incident en analysant les **artefacts** d’un système ou d’un réseau.

---

**At the end of the investigation, the SOC team found that John had attempted to steal the system's data. Which 'W' from the 5 Ws does this answer?**

**Réponse :** `Who`

**The SOC team detected a large amount of data exfiltration. Which 'W' from the 5 Ws does this answer?**

**Réponse :** `What`

### Task 5 - Technology

Le réseau d’une organisation se compose de nombreux appareils et applications. En tant qu'équipe de sécurité, détecter et répondre individuellement aux menaces sur chaque appareil ou application nécessiterait des efforts et des ressources importants. Les solutions de sécurité centralisent toutes les informations des appareils ou applications présents sur le réseau et automatisent les capacités de détection et de réponse.

- `SIEM` : SIEM (Security Information and Event Management) est un outil populaire utilisé dans presque tous les **environnements SOC**. Cet outil **collecte les journaux** de divers périphériques réseau, appelés sources de journaux. Les règles de détection sont configurées dans la solution SIEM, qui contient une logique pour identifier les activités suspectes. La solution SIEM nous **fournit les détections** après les avoir corrélées avec plusieurs sources de **logs** et nous alerte en cas de correspondance avec l'une des règles. Les solutions SIEM modernes surpassent cette analyse de détection basée sur des règles, en nous fournissant des capacités d'analyse du comportement des utilisateurs et de renseignement sur les menaces. Les algorithmes d’apprentissage automatique prennent en charge cela pour améliorer les capacités de détection.

> La solution SIEM fournit uniquement les capacités de détection dans un environnement SOC
{: .prompt-info}

- `EDR` : Endpoint Detection and Response (EDR) fournit à l’équipe SOC une **visibilité détaillée en temps réel et historique** des activités des appareils. Il fonctionne au niveau du point final et peut effectuer des réponses automatisées. **EDR** dispose de capacités de **détection étendues** pour les points finaux, vous permettant de les étudier en détail et de répondre en quelques clics.

- `Pare-feu` : un pare-feu fonctionne **uniquement pour la sécurité du réseau** et agit comme une barrière entre vos **réseaux internes et externes** (comme Internet). Il surveille le trafic réseau entrant et sortant et filtre tout trafic non autorisé. Le pare-feu dispose également de certaines règles de détection déployées, qui nous aident à identifier et à **bloquer le trafic suspect** avant qu'il n'atteigne le **réseau interne**.

---

**Which security solution monitors the incoming and outgoing traffic of the network?**

**Réponse :** `Firewall`

**Do SIEM solutions primarily focus on detecting and alerting about security incidents? (yea/nay)**

**Réponse :** `yea`

### Task 6 - Practical Exercise of SOC

Maintenant que nous connaissons les bases pratiquons, tryhackme nous met un site a disposition

---

**What: Activity that triggered the alert?**

**Réponse :** `Port Scan`

![port scan](https://miro.medium.com/v2/resize:fit:720/format:webp/1*wgLyeHZArPSjsuBmBicW4w.png)

**When: Time of the activity?**

**Réponse :** `June 12, 2024 17:24`

![date](https://miro.medium.com/v2/resize:fit:720/format:webp/1*_pQSjhp8XG9RpTAl7WfdXw.png)

**Where: Destination host IP?**

**Réponse :** `10.0.0.3`

**Who: Source host name?**

**Réponse :** `Nessus`

**Why: Reason for the activity? Intended/Malicious**

**Réponse :** `intended`

![intended](https://miro.medium.com/v2/resize:fit:640/format:webp/1*YRx3gHI8iajclaxSvfRL5Q.png)

**Additional Investigation Notes: Has any response been sent back to the port scanner IP? (yea/nay)**

**Réponse :** `yea`

**What is the flag found after closing the alert?**

**Réponse :** `THM{000_INTRO_TO_SOC}`

### Task 7 - Conclusion

On a appris comment fonctionnait un SOC ainsi que la team qui est derrière

**Room Complétée**

{% include comments.html %}