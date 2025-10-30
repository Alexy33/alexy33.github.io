---
title: "TryHackMe - CAPA - Basics"
date: 2025-10-31 00:30:00 +0200
categories: [TryHackMe, Learning]
tags: [CAPA, identify]
description: "Write-up de la room CAPA basics"
image:
  path: /assets/img/posts/tryhackme-introduction-SIEM.png
  alt: "CAPA basics"
---

## Informations sur la room

Apprenez à utiliser les CAPA pour identifier les fonctionnalités malveillantes.

**Lien :** [CAPA Basics](https://tryhackme.com/room/capabasics)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Découvrez ce qu'est une action corrective et préventive (CAPA)
- Apprenez à utiliser efficacement une CAPA
- Comprenez les champs courants et les résultats obtenus avec cet outil
- Exploitez l'outil pour identifier les activités potentielles du programme

---

## Solutions des tâches

### Task 1 - Introduction

L'un des défis liés à l'analyse de logiciels potentiellement malveillants réside dans le **risque de compromission** de notre machine ou de notre environnement lors de leur exécution, à moins de disposer d'un environnement isolé (sandbox) permettant d'effectuer tous les tests nécessaires. De manière générale, on distingue deux types d'analyse :

- l'analyse dynamique
- l'analyse statique. 

Cette présentation sera consacrée à l'analyse statique à l'aide de l'outil CAPA.

CAPA (`Common Analysis Platform for Artifacts`) est un outil développé par l'équipe FireEye Mandiant. Il est conçu pour `identifier les fonctionnalités présentes dans les fichiers exécutables` tels que les **exécutables portables** (PE), **les binaires ELF, les modules .NET, le shellcode** et même les rapports de sandbox. Pour ce faire, il analyse le fichier et applique un ensemble de règles décrivant les comportements courants, ce qui lui permet de déterminer les capacités du programme, notamment la communication réseau, la manipulation de fichiers, l'injection de processus, et bien d'autres.

L'atout majeur de CAPA réside dans sa capacité à intégrer des années d'expertise en **rétro-ingénierie dans un outil automatisé**, le rendant `accessible` même aux non-spécialistes. Ceci peut s'avérer extrêmement utile pour les analystes et les professionnels de la sécurité, leur permettant de comprendre rapidement le fonctionnement de logiciels potentiellement malveillants sans avoir à effectuer manuellement une rétro-ingénierie du code.

Notez que CAPA est installé dans cette machine virtuelle afin de vous permettre de vous familiariser avec l'outil et d'explorer ses différents paramètres. Cependant, l'utilisation de cette machine virtuelle peut prendre beaucoup de temps. C'est pourquoi nous avons prétraité les rapports suivants :

- cryptbot.txt
- cryptbot_vv.txt
- cryptbot_vv.json

Et les avons placés dans le répertoire `C:\Users\Administrator\Desktop\capa`. Presque tous les fichiers nécessaires dans ce module se trouvent dans ce répertoire.

### Task 2 - Tool Overview: How CAPA Works

Dans cet exercice, nous allons voir comment utiliser **CAPA**. Son utilisation est très simple. Commencez par ouvrir une fenêtre PowerShell (l'invite de commande peut mettre un certain temps à apparaître). Assurez-vous ensuite d'être dans le bon répertoire (`C:\Users\Administrator\Desktop\capa`). Il vous suffit ensuite d'exécuter la commande `capa` ou `capa.exe`, puis d'indiquer l'emplacement du fichier binaire. Et voilà !

Dans cet exemple, nous utiliserons `cryptbot.bin`; veuillez noter que les résultats de ce fichier seront abordés tout au long de la tâche suivante.

Après avoir exécuté la commande, patientez jusqu'à l'affichage du résultat, ce qui peut prendre plusieurs minutes. L'objectif n'est pas de terminer le traitement, mais simplement de vous familiariser avec l'outil. Nous vous suggérons donc de poursuivre votre tâche pendant l'exécution de CAPA ou d'interrompre le traitement. D'autres méthodes permettent d'analyser les résultats. Consultez la commande ci-dessous.

```bash
PS C:\Users\Administrator\Desktop\capa> capa.exe .\cryptbot.bin
loading : 100%|████████████████████| 485/485 [00:00<00:00, 1108.84     rules/s]
/ analyzing program...
```

Outre la commande `-h`, qui fournit des informations supplémentaires sur les paramètres disponibles, nous utiliserons deux options fréquemment utilisées : `-v` et `-vv`. Ces options permettent d'obtenir des résultats plus détaillés, mais augmentent le temps de traitement. Nous aborderons les résultats obtenus avec ces options dans les prochains exercices.

`-h` -> Pour optenir de un format plus simple et petit\
`-v` -> Pour afficher toute les choses qui sont en train de se passer\
`-vv` -> Pour détailler encore plus ce qu'il se passe

```bash
PS C:\Users\Administrator\Desktop\capa> capa .\cryptbot.bin
┌─────────────┬────────────────────────────────────────────────────────────────────────────────────┐
│ md5         │ 3b9d26d2e7433749f2c32edb13a2b0a2                                                   │
│ sha1        │ 969437df8f4ad08542ce8fc9831fc49a7765b7c5                                           │
│ sha256      │ ae7bc6b6f6ecb206a7b957e4bb86e0d11845c5b2d9f7a00a482bef63b567ce4c                   │
│ analysis    │ static                                                                             │
│ os          │ windows                                                                            │
│ format      │ pe                                                                                 │
│ arch        │ i386                                                                               │
│ path        │ /home/strategos/Room-CAPA/cryptbot.bin                                             │
└─────────────┴────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────┬───────────────────────────────────────────────────────────────────────────┐
│ ATT&CK Tactic        │ ATT&CK Technique                                                          │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ DEFENSE EVASION      │ Obfuscated Files or Information [T1027]                                   │
│                      │ Obfuscated Files or Information::Indicator Removal from Tools [T1027.005] │
│                      │ Virtualization/Sandbox Evasion::System Checks [T1497.001]                 │
│ DISCOVERY            │ File and Directory Discovery [T1083]                                      │
│ EXECUTION            │ Command and Scripting Interpreter::PowerShell [T1059.001]                 │
│                      │ Shared Modules [T1129]                                                    │
│ IMPACT               │ Resource Hijacking [T1496]                                                │
│ PERSISTENCE          │ Scheduled Task/Job::At [T1053.002]                                        │
│                      │ Scheduled Task/Job::Scheduled Task [T1053.005]                            │
└──────────────────────┴───────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────┬────────────────────────────────────────────────────────────────────┐
│ MAEC Category               │ MAEC Value                                                         │
├─────────────────────────────┼────────────────────────────────────────────────────────────────────┤
│ malware-category            │ launcher                                                           │
└─────────────────────────────┴────────────────────────────────────────────────────────────────────┘
┌──────────────────────────┬──────────────────────────────────────────────────────────────────────────┐
│ MBC Objective            │ MBC Behavior                                                             │
├──────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ ANTI-BEHAVIORAL ANALYSIS │ Virtual Machine Detection [B0009]                                        │
│ ANTI-STATIC ANALYSIS     │ Executable Code Obfuscation::Argument Obfuscation [B0032.020]            │
│                          │ Executable Code Obfuscation::Stack Strings [B0032.017]                   │
│ COMMUNICATION            │ HTTP Communication [C0002]                                               │
│                          │ HTTP Communication::Read Header [C0002.014]                              │
│ DATA                     │ Check String [C0019]                                                     │
│                          │ Encode Data::Base64 [C0026.001]                                          │
│                          │ Encode Data::XOR [C0026.002]                                             │
│ DEFENSE EVASION          │ Obfuscated Files or Information::Encoding-Standard Algorithm [E1027.m02] │
│ DISCOVERY                │ File and Directory Discovery [E1083]                                     │
│ EXECUTION                │ Command and Scripting Interpreter [E1059]                                │
│ FILE SYSTEM              │ Create Directory [C0046]                                                 │
│                          │ Delete File [C0047]                                                      │
│                          │ Read File [C0051]                                                        │
│                          │ Writes File [C0052]                                                      │
│ MEMORY                   │ Allocate Memory [C0007]                                                  │
│ PROCESS                  │ Create Process [C0017]                                                   │
└──────────────────────────┴──────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────┬──────────────────────────────────────────────┐
│ Capability                                           │ Namespace                                    │
├──────────────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ reference anti-VM strings                            │ anti-analysis/anti-vm/vm-detection           │
│ reference anti-VM strings targeting VMWare           │ anti-analysis/anti-vm/vm-detection           │
│ reference anti-VM strings targeting VirtualBox       │ anti-analysis/anti-vm/vm-detection           │
│ contain obfuscated stackstrings (2 matches)          │ anti-analysis/obfuscation/string/stackstring │
│ reference HTTP User-Agent string                     │ communication/http                           │
│ check HTTP status code                               │ communication/http/client                    │
│ reference Base64 string                              │ data-manipulation/encoding/base64            │
│ encode data using XOR                                │ data-manipulation/encoding/xor               │
│ contain a thread local storage (.tls) section        │ executable/pe/section/tls                    │
│ get common file path                                 │ host-interaction/file-system                 │
│ create directory                                     │ host-interaction/file-system/create          │
│ delete file                                          │ host-interaction/file-system/delete          │
│ read file on Windows (4 matches)                     │ host-interaction/file-system/read            │
│ write file on Windows (5 matches)                    │ host-interaction/file-system/write           │
│ get thread local storage value                       │ host-interaction/process                     │
│ create process on Windows                            │ host-interaction/process/create              │
│ allocate or change RWX memory                        │ host-interaction/process/inject              │
│ reference cryptocurrency strings                     │ impact/cryptocurrency                        │
│ link function at runtime on Windows (5 matches)      │ linking/runtime-linking                      │
│ parse PE header (4 matches)                          │ load-code/pe                                 │
│ resolve function by parsing PE exports (186 matches) │ load-code/pe                                 │
│ run PowerShell expression                            │ load-code/powershell/                        │
│ schedule task via at                                 │ persistence/scheduled-tasks                  │
│ schedule task via schtasks                           │ persistence/scheduled-tasks                  │
└──────────────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

Sachant que le traitement prend plusieurs minutes, nous l'avons pré-traité dans un fichier nommé `cryptbot.txt` situé dans `C:\Users\Administrator\Desktop\capa`. Ce fichier est également joint à cette tâche; cliquez simplement sur le bouton en haut à droite de celle-ci. Ouvrez une autre fenêtre PowerShell et utilisez la commande `Get-Content cryptbot.txt`

Voici ce que ça m'a donné en mettant la commande donné :

```bash
FLARE-VM 10/30/2025 15:45:39                                             PS C:\Users\Administrator\Desktop\capa > Get-Content .\cryptbot.txt       -----------------------+-------------------------------------------------------------------------------------                                    ¦ md5                    ¦ 3b9d26d2e7433749f2c32edb13a2b0a2                                                   ¦                                   ¦ sha1                   ¦ 969437df8f4ad08542ce8fc9831fc49a7765b7c5                                           ¦                                   ¦ sha256                 ¦ ae7bc6b6f6ecb206a7b957e4bb86e0d11845c5b2d9f7a00a482bef63b567ce4c                   ¦                                   ¦ analysis               ¦ static                                                                             ¦                                   ¦ os                     ¦ windows                                                                            ¦                                   ¦ format                 ¦ pe                                                                                 ¦                                   ¦ arch                   ¦ i386                                                                               ¦                                   ¦ path                   ¦ C:\Users\Administrator\Desktop\capa                                                ¦                                    ------------------------+------------------------------------------------------------------------------------                                                                                                              ------------------------+------------------------------------------------------------------------------------                                    ¦ ATT&CK Tactic          ¦ ATT&CK Technique                                                                   ¦                                    ------------------------+------------------------------------------------------------------------------------                                    ¦ DEFENSE EVASION        ¦ Obfuscated Files or Information T1027                                              ¦                                   ¦                        ¦ Obfuscated Files or Information::Indicator Removal from Tools T1027.005            ¦                                   ¦                        ¦ Virtualization/Sandbox Evasion::System Checks T1497.001                            ¦                                   +------------------------+------------------------------------------------------------------------------------¦                                   ¦ DISCOVERY              ¦ File and Directory Discovery T1083                                                 ¦                                   +------------------------+------------------------------------------------------------------------------------¦                                   ¦ EXECUTION              ¦ Command and Scripting Interpreter::PowerShell T1059.001                            ¦                                   ¦                        ¦ Shared Modules T1129                                                               ¦                                   +------------------------+------------------------------------------------------------------------------------¦                                   ¦ IMPACT                 ¦ Resource Hijacking T1496                                                           ¦                                   +------------------------+------------------------------------------------------------------------------------¦                                   ¦ PERSISTENCE            ¦ Scheduled Task/Job::At T1053.002                                                   ¦                                   ¦                        ¦ Scheduled Task/Job::Scheduled Task T1053.005                                       ¦                                    ------------------------+------------------------------------------------------------------------------------                                                                                                              ------------------------+------------------------------------------------------------------------------------                                    ¦ MAEC Category               ¦ MAEC Value                                                                    ¦                                    ------------------------+------------------------------------------------------------------------------------                                    ¦ malware-category            ¦ launcher                                                                      ¦                                    ------------------------+------------------------------------------------------------------------------------                                                                                                              ------------------------+------------------------------------------------------------------------------------                                    ¦ MBC Objective               ¦ MBC Behavior                                                                  ¦                                    ------------------------+------------------------------------------------------------------------------------                                    ¦ ANTI-BEHAVIORAL ANALYSIS    ¦ Virtual Machine Detection [B0009]                                             ¦                                   +-----------------------------+-------------------------------------------------------------------------------¦                                   ¦ ANTI-STATIC ANALYSIS        ¦ Executable Code Obfuscation::Argument Obfuscation [B0032.020]                 ¦                                   ¦                             ¦ Executable Code Obfuscation::Stack Strings [B0032.017]                        ¦                                   +-----------------------------+-------------------------------------------------------------------------------¦                                   ¦ COMMUNICATION               ¦ HTTP Communication [C0002]                                                    ¦                                   ¦                             ¦ HTTP Communication::Read Header [C0002.014]                                   ¦                                   +-----------------------------+-------------------------------------------------------------------------------¦                                   ¦ DATA                        ¦ Check String [C0019]                                                          ¦                                   ¦                             ¦ Encode Data::Base64 [C0026.001]                                               ¦                                   ¦                             ¦ Encode Data::XOR [C0026.002]                                                  ¦                                   +-----------------------------+-------------------------------------------------------------------------------¦                                   ¦ DEFENSE EVASION             ¦ Obfuscated Files or Information::Encoding-Standard Algorithm [E1027.m02]      ¦                                   +-----------------------------+-------------------------------------------------------------------------------¦                                   ¦ DISCOVERY                   ¦ File and Directory Discovery [E1083]                                          ¦                                   +-----------------------------+-------------------------------------------------------------------------------¦                                   ¦ EXECUTION                   ¦ Command and Scripting Interpreter [E1059]                                     ¦                                   +-----------------------------+-------------------------------------------------------------------------------¦                                   ¦ FILE SYSTEM                 ¦ Create Directory [C0046]                                                      ¦                                   ¦                             ¦ Delete File [C0047]                                                           ¦                                   ¦                             ¦ Read File [C0051]                                                             ¦                                   ¦                             ¦ Writes File [C0052]                                                           ¦                                   +-----------------------------+-------------------------------------------------------------------------------¦                                   ¦ MEMORY                      ¦ Allocate Memory [C0007]                                                       ¦                                   +-----------------------------+-------------------------------------------------------------------------------¦                                   ¦ PROCESS                     ¦ Create Process [C0017]                                                        ¦                                    ------------------------+------------------------------------------------------------------------------------                                                                                                              ------------------------+------------------------------------------------------------------------------------                                    ¦ Capability                                           ¦ Namespace                                            ¦                                    ------------------------+------------------------------------------------------------------------------------                                    ¦ reference anti-VM strings                            ¦ anti-analysis/anti-vm/vm-detection                   ¦                                   ¦ reference anti-VM strings targeting VMWare           ¦ anti-analysis/anti-vm/vm-detection                   ¦                                   ¦ reference anti-VM strings targeting VirtualBox       ¦ anti-analysis/anti-vm/vm-detection                   ¦                                   ¦ contain obfuscated stackstrings (2 matches)          ¦ anti-analysis/obfuscation/string/stackstring         ¦                                   ¦ reference HTTP User-Agent string                     ¦ communication/http                                   ¦                                   ¦ check HTTP status code                               ¦ communication/http/client                            ¦                                   ¦ reference Base64 string                              ¦ data-manipulation/encoding/base64                    ¦                                   ¦ encode data using XOR                                ¦ data-manipulation/encoding/xor                       ¦                                   ¦ contain a thread local storage (.tls) section        ¦ executable/pe/section/tls                            ¦                                   ¦ get common file path                                 ¦ host-interaction/file-system                         ¦                                   ¦ create directory                                     ¦ host-interaction/file-system/create                  ¦                                   ¦ delete file                                          ¦ host-interaction/file-system/delete                  ¦                                   ¦ read file on Windows (4 matches)                     ¦ host-interaction/file-system/read                    ¦                                   ¦ write file on Windows (5 matches)                    ¦ host-interaction/file-system/write                   ¦                                   ¦ get thread local storage value                       ¦ host-interaction/process                             ¦                                   ¦ create process on Windows                            ¦ host-interaction/process/create                      ¦                                   ¦ allocate or change RWX memory                        ¦ host-interaction/process/inject                      ¦                                   ¦ reference cryptocurrency strings                     ¦ impact/cryptocurrency                                ¦                                   ¦ link function at runtime on Windows (5 matches)      ¦ linking/runtime-linking                              ¦                                   ¦ parse PE header (4 matches)                          ¦ load-code/pe                                         ¦                                   ¦ resolve function by parsing PE exports (186 matches) ¦ load-code/pe                                         ¦                                   ¦ run PowerShell expression                            ¦ load-code/powershell/                                ¦                                   ¦ schedule task via at                                 ¦ persistence/scheduled-tasks                          ¦                                   ¦ schedule task via schtasks                           ¦ persistence/scheduled-tasks                          ¦                                    ------------------------+------------------------------------------------------------------------------------                                    FLARE-VM 10/30/2025 15:45:56  
```

---

**What command-line option would you use if you need to check what other parameters you can use with the tool? Use the shortest format.**

**Réponse :** `-h`

**What command-line options are used to find detailed information on the malware's capabilities? Use the shortest format.**

**Réponse :** `-v`

**What command-line options do you use to find very verbose information about the malware's capabilities? Use the shortest format.**

**Réponse :** `-vv`

**What PowerShell command will you use to read the content of a file?**

**Réponse :** `Get-Content`

### Task 3 - Dissecting CAPA Results Part 1: General Information, MITRE and MAEC

Comme indiqué dans la tâche précédente, les résultats de l'exécution de CAPA sur cryptbot.bin seront analysés dans la tâche suivante. Nous décortiquerons donc les résultats bloc par bloc et sujet par sujet.

Le premier bloc contient des informations de base sur le fichier, notamment :

- Les algorithmes cryptographiques utilisés, tels que `MD5` et `SHA-1/256`.
- Le champ `analysis` indique comment CAPA a analysé le fichier.
- Le champ `os` révèle le contexte du système d'exploitation auquel s'appliquent les capacités identifiées.
- Le champ `arch` ​​permet de déterminer s'il s'agit d'un binaire lié à l'architecture x86.
- Le `patch` (chemin) d'accès au fichier analysé.

```bash
┌─────────────┬────────────────────────────────────────────────────────────────────────────────────┐
│ md5         │ 3b9d26d2e7433749f2c32edb13a2b0a2                                                   │
│ sha1        │ 969437df8f4ad08542ce8fc9831fc49a7765b7c5                                           │
│ sha256      │ ae7bc6b6f6ecb206a7b957e4bb86e0d11845c5b2d9f7a00a482bef63b567ce4c                   │
│ analysis    │ static                                                                             │
│ os          │ windows                                                                            │
│ format      │ pe                                                                                 │
│ arch        │ i386                                                                               │
│ path        │ /home/strategos/Room-CAPA/cryptbot.bin                                             │
└─────────────┴────────────────────────────────────────────────────────────────────────────────────┘
```

#### MITRE ATT&CK

Le cadre `MITRE ATT&CK` (Tactiques, Techniques et Connaissances Communes des Adversaires) est un référentiel de connaissances mondial exhaustif qui documente avec précision les tactiques et techniques employées par les acteurs malveillants à chaque étape d'une cyberattaque. Il constitue un **guide stratégique**, fournissant des informations détaillées sur les méthodes des attaquants : obtention d'un accès initial, maintien d'une présence, élévation de privilèges, contournement des défenses, déplacement latéral au sein d'un réseau, et bien plus encore.

CAPA utilise ce format pour ses résultats. Veuillez noter que certains résultats peuvent contenir ou non l'identifiant de la technique et de la sous-technique.

| Format | Exemple | Explication |
|--------|---------|-------------|
| **ATT&CK Tactic::ATT&CK Technique::Technique Identifier** | Defense Evasion::Obfuscated Files or Information::T1027 | DEFENSE EVASION = Tactique ATT&CK<br>Obfuscated Files or Information = Technique ATT&CK<br>T1027 = Identifiant de la technique |
| **ATT&CK Tactic::ATT&CK Technique::ATT&CK Sub-Technique::Technique Identifier[.]Sub-technique Identifier** | Defense Evasion::Obfuscated Files or Information::Indicator Removal from Tools T1027.005 | DEFENSE EVASION = Tactique ATT&CK<br>Obfuscated Files or Information = Technique ATT&CK<br>Indicator Removal from Tools = Sous-technique ATT&CK<br>T1027 = Identifiant de la technique<br>005 = Identifiant de la sous-technique |

```bash
┌──────────────────────┬───────────────────────────────────────────────────────────────────────────┐
│ ATT&CK Tactic        │ ATT&CK Technique                                                          │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ DEFENSE EVASION      │ Obfuscated Files or Information [T1027]                                   │
│                      │ Obfuscated Files or Information::Indicator Removal from Tools [T1027.005] │
│                      │ Virtualization/Sandbox Evasion::System Checks [T1497.001]                 │
│ DISCOVERY            │ File and Directory Discovery [T1083]                                      │
│ EXECUTION            │ Command and Scripting Interpreter::PowerShell [T1059.001]                 │
│                      │ Shared Modules [T1129]                                                    │
│ IMPACT               │ Resource Hijacking [T1496]                                                │
│ PERSISTENCE          │ Scheduled Task/Job::At [T1053.002]                                        │
│                      │ Scheduled Task/Job::Scheduled Task [T1053.005]                            │
└──────────────────────┴───────────────────────────────────────────────────────────────────────────┘
```

#### MAEC

**MAEC** (Malware Attribute Enumeration and Characterization) est un langage spécialisé conçu pour **encoder et communiquer des informations complexes** concernant les logiciels malveillants. Il comprend un large éventail d'attributs, notamment les comportements, les artefacts et les interconnexions entre différentes instances de logiciels malveillants. Ce langage fonctionne comme un système standardisé pour le suivi et l'analyse de la complexité des logiciels malveillants.

```bash
┌─────────────────────────────┬────────────────────────────────────────────────────────────────────┐
│ MAEC Category               │ MAEC Value                                                         │
├─────────────────────────────┼────────────────────────────────────────────────────────────────────┤
│ malware-category            │ launcher                                                           │
└─────────────────────────────┴────────────────────────────────────────────────────────────────────┘
```

Examinons le tableau ci-dessous pour voir les valeurs MAEC les plus couramment utilisées par CAPA : Téléchargeur et Lanceur.

```bash
| Valeur MAEC | Description |
|-------------|-------------|
| **Launcher** | Présente des comportements qui déclenchent des actions spécifiques similaires au comportement d'un malware. |
| **Downloader** | Présente des comportements où il télécharge et exécute d'autres fichiers, généralement observé sur des malwares plus complexes. |
```

Lorsque CAPA attribue à un fichier la valeur MAEC « `lanceur` », cela indique que le fichier présente un comportement similaire, mais non limité à :

- Déposer des payloads supplémentaires
- Activer des mécanismes de persistance
- Se connecter à des serveurs de commande et de contrôle (C2)
- Exécuter des fonctions spécifiques

C’est intéressant ! Certains de ces comportements sont également présents dans le Catalogue des comportements des logiciels malveillants (MBC) et le bloc Capacités, que nous aborderons dans la prochaine tâche !

De plus, lorsque CAPA attribue à un fichier la valeur MAEC « `téléchargeur` », cela indique que le fichier présente un comportement similaire, mais non limité à :

- Récupérer des payloads ou des ressources supplémentaires sur Internet
- Récupérer des mises à jour
- Exécuter des étapes secondaires
- Récupérer des fichiers de configuration

---

**What is the sha256 of cryptbot.bin?**

**Réponse :** `ae7bc6b6f6ecb206a7b957e4bb86e0d11845c5b2d9f7a00a482bef63b567ce4c`

**What is the Technique Identifier of Obfuscated Files or Information?**

**Réponse :** `T1027`

**What is the Sub-Technique Identifier of Obfuscated Files or Information::Indicator Removal from Tools?**

**Réponse :** `T1027.005`

**When CAPA tags a file with this MAEC value, it indicates that it demonstrates behaviour similar to, but not limited to, Activating persistence mechanisms?**

**Réponse :** `launcher`

**When CAPA tags a file with this MAEC value, it indicates that the file demonstrates behaviour similar to, but not limited to, Fetching additional payloads or resources from the internet?**

**Réponse :** `Downloader`

### Task 4 - Dissecting CAPA Results Part 2: Malware Behavior Catalogue

Maintenant nous allons parler des sujets suivants:

- MBC
- Objective
- Micro-Objective
- MBC Behaviors
- Micro-Behavior
- Methods

---

**What serves as a catalogue of malware objectives and behaviours?**

**Réponse :** `Malware Behavior Catalogue`

**Which field is based on ATT&CK tactics in the context of malware behaviour?**

**Réponse :** `Objective`

**What is the Identifier of "Create Process" micro-behavior?**

**Réponse :** `C0017`

**What is the behaviour with an Identifier of B0009?**

**Réponse :** `Virtual Machine Detection`

**Malware can be used to obfuscate data using base64 and XOR. What is the related micro-behavior for this?**

**Réponse :** `Encode Data`

**Which micro-behavior refers to "Malware is capable of initiating HTTP communications"?**

**Réponse :** `HTTP Communication`

### Task 5 - Dissecting CAPA Results Part 3: Namespaces

**Which top-level Namespace contains a set of rules specifically designed to detect behaviours, including obfuscation, packing, and anti-debugging techniques exhibited by malware to evade analysis?**

**Réponse :** `anti-analysis`

**Which namespace contains rules to detect virtual machine (VM) environments? Note that this is not the TLN or Top-Level Namespace**

**Réponse :** `anti-vm/vm-detection`

**Which Top-Level Namespace contains rules related to behaviours associated with maintaining access or persistence within a compromised system? This namespace is focused on understanding how malware can establish and maintain a presence within a compromised environment, allowing it to persist and carry out malicious activities over an extended period.**

**Réponse :** `persistence`

**Which namespace addresses techniques such as String Encryption, Code Obfuscation, Packing, and Anti-Debugging Tricks, which conceal or obscure the true purpose of the code?**

**Réponse :** `obfuscation`

**Which Top-Level Namespace Is a staging ground for rules that are not quite polished?**

**Réponse :** `Nursery`

### Task 6 - Dissecting CAPA Results Part 4: Capability

**What rule yaml file was matched if the Capability or rule name is check HTTP status code?**

**Réponse :** `check-http-status-code.yml`

**What is the name of the Capability if the rule YAML file is reference-anti-vm-strings.yml?**

**Réponse :** `reference anti-VM strings`

**Which TLN or Top-Level Namespace includes the Capability or rule name run PowerShell expression?**

**Réponse :** `load-code`

**Check the conditions inside the check-for-windows-sandbox-via-registry.yml rule file from this link. What is the value of the API that ends in Ex is it looking for?**

**Réponse :** `RegOpenKeyEx`

### Task 7 - More Information, more fun!

**Which parameter allows you to output the result of CAPA into a .json file?**

**Réponse :** `-j`

**What tool allows you to interactively explore CAPA results in your web browser?**

**Réponse :** `CAPA Web Explorer`

**Which feature of this CAPA Web Explorer allows you to filter options or results?**

**Réponse :** `Global Search Box`

### Task 8 - Conclusion

> Désolé d'avoir skip toute les explications mais c'était presque toujours pareil et franchement ce cours n'était pas très intéressant, je n'ai pas pris plaisir a le faire.
{: .prompt-danger}

**Room Complétée**

{% include comments.html %}