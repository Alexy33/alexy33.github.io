---
title: "TryHackMe - FlareVM: Arsenal of Tools"
date: 2025-10-31 17:27:00 +0200
categories: [TryHackMe, Learning]
tags: [FlareVM, reverse-engineering]
description: "Write-up de la room FlareVM qui nous apprendre ce qu'est REnux ainsi qui les outils qui le composent"
image:
  path: /assets/img/posts/tryhackme-introduction-SIEM.png
  alt: "FlareVM"
---

## Informations sur la room

Découvrez comment utiliser les outils à l'intérieur de la machine virtuelle REMnux.

**Lien :** [FlareVM Arsenal of Tools](https://tryhackme.com/room/flarevmarsenaloftools)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Explorez les outils de FlareVM.
- Apprenez à utiliser ces outils pour analyser efficacement les processus potentiellement malveillants.
- Familiarisez-vous avec les outils d'analyse statique des documents et fichiers binaires malveillants.

---

## Solutions des tâches

### Task 1 - Introduction

**FlareVM**, ou « **Forensics, Logic Analysis, and Reverse Engineering** », est une `suite d'outils spécialisés`, complète et soigneusement sélectionnée, conçue pour répondre aux besoins spécifiques des ingénieurs en `rétro-ingénierie`, des analystes de logiciels malveillants, des intervenants en cas d'incident, des enquêteurs en criminalistique numérique et des testeurs d'intrusion. Développée avec expertise par l'équipe FLARE de FireEye, cette suite d'outils est un atout précieux pour résoudre les mystères numériques, **comprendre le comportement des logiciels malveillants** et explorer les détails complexes des fichiers exécutables.

### Task 2 - Arsenal of Tools

#### Rétro-ingénierie et débogage

La rétro-ingénierie consiste à **résoudre un problème à l'envers** : on décompose un produit fini pour comprendre son fonctionnement. Le débogage consiste à **identifier les erreurs, à comprendre leurs causes et à corriger** le code pour les éviter.

- `Ghidra` : suite logicielle de rétro-ingénierie open source développée par la NSA.

- `x64dbg` : débogueur open source pour les binaires aux formats x64 et x32.

- `OllyDbg` : débogueur pour la rétro-ingénierie au niveau assembleur.

- `Radare2` : plateforme open source sophistiquée pour la rétro-ingénierie.

- `Binary Ninja` : outil de désassemblage et de décompilation de binaires.

- `PEiD` : outil de détection des packers, des cryptor et des compilateurs.

#### Désassembleurs et décompilateurs

Les **désassembleurs et les décompilateurs** sont des outils essentiels à l'analyse des logiciels malveillants. Ils permettent aux analystes de **comprendre le comportement**, la logique et le flux de contrôle des logiciels malveillants en les **décomposant en un format plus compréhensible**. Les outils mentionnés ci-dessous sont couramment utilisés dans ce domaine.

- `CFF Explorer` : un éditeur PE conçu pour analyser et modifier les fichiers exécutables portables (PE).

- `Hopper Disassembler` : un débogueur, désassembleur et décompilateur.

- `RetDec` : un décompilateur open source pour le code machine.

#### Analyse statique et dynamique

L'analyse statique et l'analyse dynamique sont deux méthodes essentielles en cybersécurité pour **l'examen des logiciels malveillants**. L'analyse statique consiste à **inspecter le code sans l'exécuter**, tandis que l'analyse dynamique **consiste à observer son comportement lors de son exécution**. Les outils mentionnés ci-dessous sont couramment utilisés dans ce domaine.

- `Process Hacker` : Éditeur de mémoire et observateur de processus avancés.

- `PEview` : Visualiseur de fichiers exécutables portables (PE) pour l'analyse.

- `Dependency Walker` : Outil permettant d'afficher les dépendances DLL d'un exécutable.

- `DIE (Detect It Easy)` : Outil de détection des packers, compilateurs et logiciels de chiffrement.

#### Analyse forensique et réponse aux incidents

L'analyse forensique numérique englobe **la collecte, l'analyse et la préservation des preuves numériques** provenant de diverses sources telles que les ordinateurs, les réseaux et les périphériques de stockage. La réponse aux incidents, quant à elle, se concentre sur la **détection, le confinement, l'éradication et la récupération** suite à des cyberattaques. Les outils mentionnés ci-dessous sont couramment utilisés dans ce domaine.

- `Volatility` : Framework d'analyse de vidages RAM pour l'analyse forensique de la mémoire.

- `Rekall` : Framework d'analyse forensique de la mémoire pour la réponse aux incidents.

- `FTK Imager` : Outils d'acquisition et d'analyse d'images disque à usage forensique.

#### Analyse de réseau

L'analyse de réseau regroupe différentes méthodes et techniques d'étude et d'analyse des réseaux afin d'en **identifier les tendances**, d'optimiser leurs performances et de comprendre leur structure et leur comportement sous-jacents.

- `Wireshark` : analyseur de protocole réseau permettant l'enregistrement et l'examen du trafic.

- `Nmap` : outil de détection des vulnérabilités et de cartographie réseau.

- `Netcat` : permet de lire et d'écrire des données sur les connexions réseau grâce à cet outil performant.

#### Analyse de fichiers

L'analyse de fichiers est une technique permettant d'examiner les fichiers afin **d'identifier les menaces de sécurité** potentielles et de **vérifier** que les permissions d'accès sont correctes.

- `FileInsight` : Programme de consultation et de modification de fichiers binaires.

- `Hex Fiend` : Éditeur hexadécimal léger et rapide.

- `HxD` : ​​Visualisation et modification de fichiers binaires avec un éditeur hexadécimal.

#### Scripting et automatisation

Le scripting et l'automatisation consistent à utiliser des scripts tels que PowerShell et Python pour **automatiser les tâches et processus répétitifs**, les rendant ainsi plus efficaces et moins sujets aux erreurs humaines.

- `Python` : Principalement axé sur l'automatisation grâce aux modules et outils Python.

- `PowerShell Empire` : Framework pour l'analyse post-exploitation de vulnérabilités PowerShell.

#### Suite Sysinternals

La suite Sysinternals est un **ensemble d'utilitaires système avancés** conçus pour aider les professionnels de l'informatique et les développeurs à **gérer, dépanner et diagnostiquer les systèmes Windows**.

- `Autoruns` : affiche les exécutables configurés pour se lancer au démarrage du système.

- `Process Explorer` : fournit des informations sur les processus en cours d'exécution.

- `Process Monitor` : surveille et enregistre l'activité des processus et des threads en temps réel.

---

**Which tool is an Open-source debugger for binaries in x64 and x32 formats?**

**Réponse :** `x64dbg`

**What tool is designed to analyze and edit Portable Executable (PE) files?**

**Réponse :** `CFF Explorer`

**Which tool is considered a sophisticated memory editor and process watcher?**

**Réponse :** `Process Hacker`

**Which tool is used for Disc image acquisition and analysis for forensic use?**

**Réponse :** `FTK Imager`

**What tool can be used to view and edit a binary file?**

**Réponse :** `HxD`

### Task 3 - Commonly Used Tools for Investigation: Overview

Dans cette room nous nous concentrerons seulement sur ces outils mentionné précédemment: 

- Procmon
- Process Explorer
- HxD
- Wireshark
- CFF Explorer
- PEStudio
- FLOSS

#### Process Monitor (Procmon)

Un outil Windows puissant conçu pour vous aider à enregistrer les problèmes liés aux **applications de votre système**. Il vous permet de **visualiser, d'enregistrer et de suivre en temps réel l'activité du système et des fichiers Windows**. Process Monitor est particulièrement utile pour le suivi de l'activité système, notamment dans le cadre de la recherche de logiciels malveillants, du dépannage et des enquêtes numériques. Il surveille en temps réel l'activité du système de fichiers, du registre et des processus.

Voici comment l'utiliser efficacement pour vos investigations.

![procmon](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727302306550.png)

D'après cette entrée de journal, le processus `lsass.exe`, lié au service LSASS (**Local Security Authority Subsystem Service**), a lu un fichier avec succès. LSASS gère l'authentification et communique fréquemment avec des fichiers système critiques tels que `lsasrv.dll` (Local Security Authority Server Service).

Bien qu'il s'agisse d'un processus système standard, LSASS peut être la cible d'attaques de type « `crâne-dump` » si vous examinez les logs à la recherche d'activités malveillantes. `Mimikatz` et d'autres outils tentent fréquemment d'accéder à la mémoire de **LSASS**. Dans ce cas, surveillez toute activité suspecte supplémentaire liée à LSASS, comme des schémas d'accès inhabituels ou des processus lisant ou écrivant dans **lsass.exe**.

Rassurez-vous, l'exemple ci-dessus ne présente aucun signe de logiciel malveillant !

#### Process Explorer (Procexp)

Process Explorer offre une **analyse approfondie des processus actifs** sur votre ordinateur. Il vous permet d'explorer le fonctionnement interne de votre système, en fournissant une liste complète des processus en cours d'exécution et de leurs comptes utilisateurs associés. Si vous vous êtes déjà demandé quel programme accédait à un fichier ou un dossier spécifique, **Process Explorer** peut vous fournir cette information.

![process explorer](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727171765939.png)

Comme vous pouvez le constater sur l'image ci-dessus, l'application `CFF Explorer` est ouverte. À l'aide de Process Explorer (procexp), situé sur le bureau, nous avons identifié le processus et son processus parent. Cette méthode s'avère généralement très utile pour surveiller les autres processus lancés, par exemple par un document Word, un fichier LNK ou même un fichier ISO, car les acteurs malveillants exploitent souvent ces vulnérabilités.

#### HxD

HxD est un **éditeur hexadécimal rapide et flexible** permettant de modifier des fichiers, de la mémoire et des disques de toute capacité. Il peut être utilisé pour les investigations numériques, la récupération de données, le débogage et la manipulation précise de données binaires. Ses principales fonctionnalités incluent la visualisation du contenu des fichiers et de la mémoire, l'édition, la recherche et la comparaison de données hexadécimales. Découvrons comment cet outil fonctionne.

![HxD](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727170785692.png)

Cette capture d'écran de l'éditeur hexadécimal `HxD` affiche le fichier binaire `possible_medusa.txt`. Les données hexadécimales à gauche indiquent le contenu du fichier en hexadécimal, et leur interprétation ASCII apparaît à droite. Le fichier commence par **4D 5A** (Little Endian), ce qui indique qu'il est exécutable.

L'inspecteur de données à droite permet d'examiner chaque octet individuellement en affichant ses valeurs dans différents types de données (entier, flottant, etc.), facilitant ainsi l'analyse des données.

En permettant un examen approfondi des données hexadécimales brutes d'un fichier, HxD facilite la **recherche en identifiant les types de fichiers**, leurs structures et les éventuelles corruptions. Sa fonction d'inspecteur de données fournit des informations précieuses sur les valeurs d'octets spécifiques.

#### CFF Explorer

Grâce aux informations complètes fournies par **CFF Explorer** sur les fichiers, les enquêteurs peuvent `générer des empreintes numériques` (hachages) pour vérifier leur intégrité, authentifier la source des fichiers système et valider leur authenticité (par exemple, en recherchant des modifications inhabituelles). Ces informations sont essentielles lors de l'analyse de logiciels malveillants, car du code dangereux peut être dissimulé dans des fichiers système altérés.

![CFF](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727170785706.png)

Les détails du fichier `cryptominer.bin` sont affichés dans l'exemple. Un fichier exécutable portable **64 bits** a été généré le **23 septembre 2024**. Les informations du fichier peuvent être vérifiées par ses empreintes numériques (SHA-1 et MD5). Cet outil facilite la vérification des informations du fichier et la localisation d'éventuels problèmes lors des investigations.

#### Wireshark

En matière d'**analyse du trafic réseau**, Wireshark est un outil puissant permettant aux enquêteurs de **traquer les connexions suspectes**, d'examiner les protocoles et de repérer d'éventuelles attaques ou exfiltrations de données. Dans ce contexte, `TLSv1.2` indique une connexion sécurisée et chiffrée, capable de masquer les activités malveillantes ou de protéger le trafic légitime.

![wireshark](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727170785704.png)

Ceci affiche les paquets capturés, avec des détails sur le protocole, la source, la destination et d'autres informations. La plupart des paquets indiquent l'utilisation de `TLSv1.2` et `TCP` pour la transmission chiffrée. Les données brutes des paquets sont affichées aux formats **ASCII et hexadécimal**, une partie importante étant chiffrée à l'aide de TLSv1.2.

Pour explorer plus en détail cet outil, vous pouvez consulter notre module Wireshark [ici](https://tryhackme.com/module/wireshark).

#### PEstudio

L'**analyse statique, ou l'étude des propriétés des fichiers exécutables sans les lancer**, s'effectue avec PEstudio. Cette fonctionnalité est utile dans de nombreuses situations. PEstudio fournit diverses informations sur un fichier sans exposer l'utilisateur au risque de l'exécuter, ce qui facilite l'identification des exécutables suspects ou potentiellement dangereux.

Alors, comment ça marche ? Regardons l'image ci-dessous.

![PEstudio](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727170785666.png)

Cet exemple illustre l'analyse du fichier exécutable `PSexec.exe` (non présent dans la machine virtuelle; il s'agit d'un exemple purement illustratif) à l'aide de PEstudio 9.22, un **outil d'analyse statique de logiciels malveillants**. Ce fichier a une double fonction : légitime pour les administrateurs système, il peut également être exploité par des pirates informatiques pour un accès à distance.

Sa valeur d'entropie de 6,596 **indique une faible probabilité de compression ou de chiffrement**, caractéristique des logiciels dangereux. La version 2.34 de cette application console 32 bits **permet l'exécution de programmes à distance**, une fonctionnalité fréquemment utilisée pour la migration latérale lors d'attaques. Le fichier est compilé avec Visual C++ 8.

La double fonction de PsExec, généralement légitime mais suspecte dans les environnements compromis, combinée à des indicateurs faibles à moyens et à une entropie modérément élevée, rend sa présence sur un système préoccupante, surtout si l'exécution de code à distance n'est pas attendue. Son utilisation après une exploitation justifie une investigation plus approfondie afin de déterminer s'il est utilisé à des fins malveillantes.

#### FLOSS

Utilisant des techniques **d'analyse statique avancées**, FLOSS (FLARE Obfuscated String Solver, anciennement FireEye Labs Obfuscated String Solver) **extrait et désobfusque automatiquement** toutes les chaînes de caractères des programmes malveillants. À l'instar de `strings.exe`, il améliore l'analyse statique de base des binaires inconnus. FLOSS inclut également des scripts Python supplémentaires dans son répertoire, permettant d'importer leurs résultats dans des logiciels tels que `IDA Pro` ou `Binary Ninja`.

```bash
PS C:\Users\Administrator\Desktop\Sample > floss .\cobaltstrike.exe
INFO: floss: extracting static strings
finding decoding function features: 100%|█████████████████████████████████████████████| 74/74 [00:00<00:00, 2370.15 functions/s, skipped 0 library functions]
INFO: floss.stackstrings: extracting stackstrings from 50 functions
extracting stackstrings: 100%|██████████████████████████████████████████████████████████████████████████████████████| 50/50 [00:00<00:00, 128.00 functions/s]
INFO: floss.tightstrings: extracting tightstrings from 4 functions...
extracting tightstrings from function 0x402e80: 100%|██████████████████████████████████████████████████████████████████| 4/4 [00:00<00:00, 31.99 functions/s]
INFO: floss.string_decoder: decoding strings
emulating function 0x402e80 (call 1/1): 100%|████████████████████████████████████████████████████████████████████████| 21/21 [00:09<00:00,  2.21 functions/s]
INFO: floss: finished execution after 265.61 seconds
INFO: floss: rendering results 
```

Résultat:
```bash
FLARE FLOSS RESULTS (version v3.1.0-0-gdb9af41)

+------------------------+------------------------------------------------------------------------------------+
| file path              | cobaltstrike.exe                                                                   |
| identified language    | unknown                                                                            |
| extracted strings      |                                                                                    |
|  static strings        | 189 (2050 characters)                                                              |
|   language strings     |   0 (   0 characters)                                                              |
|  stack strings         | 0                                                                                  |
|  tight strings         | 0                                                                                  |
|  decoded strings       | 0                                                                                  |
+------------------------+------------------------------------------------------------------------------------+


 ────────────────────────────
  FLOSS STATIC STRINGS (189)
 ────────────────────────────

+-----------------------------------+
| FLOSS STATIC STRINGS: ASCII (188) |
+-----------------------------------+

!This program cannot be run in DOS mode.
.text
P`.data
.rdata
P@.pdata
0@.xdata
0@.bss
.idata
.CRT
.tls
ffffff.
ATUWVSH
T$ E
t6H9
[^_]A\
ATUWVSH
L$ < H
@[^_]A\
UWVSH
L$LA
X[^_]
UWVSH
L$LA
X[^_]
D$P\
D$He
D$@p
D$8i
D$0p
D$(\
D$ .
T$XH
fff.
D$ tv
D$(H
T$ H
L$ H
L$(H
ATUWVSH
 [^_]A\
ffff.
CCG
8[^H
T$(H
\$8H
L$ H
ATUWVSH
d$0H
l$(H
@[^_]A\
D$XH
T$XL
D$`L
L$hH
ffffff.
AUATUWVSH
[^_]A\A]
T$PH
T$ H
[^_]A\A]
T$hH
L$PM
T$8H
L$ H
T$8L
[^_]A\A]
ATWVSH
[^_A\]
D$ H
tXw!
9MZt
HcQ<H
HcA<H
WVSH
tWHc
 [^_
 [^_
tPHc
B' t\tH
ffff.
UWVSH
tSHc
([^_]
([^_]
ATUWVSH
@[^_]A\
L3d$0H
@[^_]A\
D$0H
D$(H
UWVSH
([^_]H
UWVSH
([^_]
([^_]
QPH=
mNAj
+5:
mNAj
=E,z
mUDj
mN[3\
z(8(
R^~4
?\t{\
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAp
_set_invalid_parameter_handler
%c%c%c%c%c%c%c%c%cMSSE-%d-server
.pdata
Argument domain error (DOMAIN)
Argument singularity (SIGN)
Overflow range error (OVERFLOW)
Partial loss of significance (PLOSS)
Total loss of significance (TLOSS)
The result is too small to be represented (UNDERFLOW)
Unknown error
_matherr(): %s in %s(%g, %g)  (retval=%g)
Mingw-w64 runtime failure:
Address %p has no image-section
  VirtualQuery failed for %d bytes at address %p
  VirtualProtect failed with code 0x%x
  Unknown pseudo relocation protocol version %d.
  Unknown pseudo relocation bit size %d.
CloseHandle
ConnectNamedPipe
CreateFileA
CreateNamedPipeA
CreateThread
DeleteCriticalSection
EnterCriticalSection
GetCurrentProcess
GetCurrentProcessId
GetCurrentThreadId
GetLastError
GetModuleHandleA
GetProcAddress
GetStartupInfoA
GetSystemTimeAsFileTime
GetTickCount
InitializeCriticalSection
LeaveCriticalSection
LoadLibraryW
QueryPerformanceCounter
ReadFile
RtlAddFunctionTable
RtlCaptureContext
RtlLookupFunctionEntry
RtlVirtualUnwind
SetUnhandledExceptionFilter
Sleep
TerminateProcess
TlsGetValue
UnhandledExceptionFilter
VirtualAlloc
VirtualProtect
VirtualQuery
WriteFile
__C_specific_handler
__dllonexit
__getmainargs
__initenv
__iob_func
__lconv_init
__set_app_type
__setusermatherr
_acmdln
_cexit
_initterm
_onexit
abort
exit
fprintf
free
fwrite
malloc
memcpy
signal
sprintf
strlen
strncmp
vfprintf
KERNEL32.dll
msvcrt.dll


+------------------------------------+
| FLOSS STATIC STRINGS: UTF-16LE (1) |
+------------------------------------+

msvcrt.dll


 ─────────────────────────
  FLOSS STACK STRINGS (0)
 ─────────────────────────



 ─────────────────────────
  FLOSS TIGHT STRINGS (0)
 ─────────────────────────



 ───────────────────────────
  FLOSS DECODED STRINGS (0)
 ───────────────────────────
```

Dans l'exemple ci-dessus, **FLOSS** a extrait 189 chaînes statiques du fichier binaire, susceptibles de contenir des informations codées en dur telles que des chemins de fichiers, des URL (probablement pour des serveurs de commande et de contrôle), des adresses IP, des appels d'API, des messages d'erreur, des entrées de registre, des clés de chiffrement et des données de configuration. Cependant, aucune chaîne décodée n'a été identifiée, ce qui suggère que FLOSS **n'a pas détecté ni décodé les chaînes générées dynamiquement ou obfusquées** lors de cette analyse. Les logiciels malveillants utilisent fréquemment des chaînes obfusquées pour dissimuler leur comportement malveillant.

---

**Which tool was formerly known as FireEye Labs Obfuscated String Solver?**

**Réponse :** `FLOSS`

**Which tool offers in-depth insights into the active processes running on your computer?**

**Réponse :** `Process Explorer`

**By using the Process Explorer (procexp) tool, under what process can we find smss.exe?**

J'ai ouvert l'application `procexp` sur windows et j'ai regardé ce que contenait `smss.exe`

**Réponse :** `System`

**Which powerful Windows tool is designed to help you record issues with your system's apps?**

**Réponse :** `Procmon`

**Which tool can be used for Static analysis or studying executable file properties without running the files?**

**Réponse :** `PEStudio`

**Using the tool PEStudio to open the file cryptominer.bin in the Desktop\Sample folder, what is the sha256 value of the file?**

**Réponse :** `E9627EBAAC562067759681DCEBA8DDE8D83B1D813AF8181948C549E342F67C0E`

**Using the tool PEStudio to open the file cryptominer.bin in the Desktop\Sample folder, how many functions does it have?**

**Réponse :** `102`

**What tool can generate file hashes for integrity verification, authenticate the source of system files, and validate their validity?**

**Réponse :** `CFF Explorer`

**Using the tool CFF Explorer to open the file possible_medusa.txt in the Desktop\Sample folder, what is the MD5 of the file?**

**Réponse :** `646698572AFBBF24F50EC5681FEB2DB7`

**Use the CFF Explorer tool to open the file possible_medusa.txt in the Desktop\Sample folder. Then, go to the DOS Header Section. What is the e_magic value of the file?**

**Réponse :** `5A4D`

### Task 4 - Analyzing Malicious Files!

À l'aide des outils de notre machine virtuelle **Flare**, nous allons analyser différents fichiers exécutables, les exécuter et observer leur comportement sur une machine spécifique.

Un fichier **windows.exe** suspect a été téléchargé par un utilisateur le **24/09/2024** à **3h43**. Ce téléchargement a été signalé comme une menace potentielle. L'équipe de surveillance vous a envoyé un courriel vous demandant d'analyser ce fichier. Elle vous l'a transmis et il se trouve actuellement dans le dossier `C:\Users\Administrator\Desktop\Sample`.

![analyse](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727170544603.png)

Notre approche initiale pour cette enquête consiste à effectuer une analyse statique afin d'obtenir des informations initiales à partir du fichier binaire.

#### Analyse avec PEStudio

Commençons par PEStudio. Ouvrez le fichier avec cet outil. Quelles informations pouvons-nous exploiter ?

![PEStudio](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727174706257.png)

Pour les hachages MD5 (`9FDD4767DE5AEC8E577C1916ECC3E1D6`) et SHA-1 (`A1BC55A7931BFCD24651357829C460FD3DC4828F`) calculés, il est recommandé de les **comparer** à des bases de données reconnues comme [VirusTotal](https://www.virustotal.com/gui/home/upload). En l'absence de détection connue, il est fort probable qu'il s'agisse d'une campagne de logiciels malveillants récente ou non encore découverte.

Bien que le fichier prétende être lié à l'**Éditeur du Registre Windows** (REGEDIT), comme l'indique sa description, il s'agit probablement d'une tentative de tromperie pour échapper à la détection.

Les outils **REGEDIT** légitimes se trouvent généralement dans le répertoire `C:\Windows\System32` et non dans le dossier de téléchargements de l'utilisateur.

Et ensuite ?

![REGEDIT](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727175229441.png)

La présence de « **Editor** », « Операционная система Microsoft® Windows® ») dans les métadonnées du fichier est suspecte, surtout si l'utilisateur ou l'organisation n'évolue pas dans un **environnement russophone**. Cela pourrait avoir des conséquences importantes pour notre organisation.

L'absence d'un en-tête complet indique que le fichier est potentiellement compressé ou obfusqué afin d'échapper à la détection par les outils d'analyse statique. Ce comportement est typique des logiciels malveillants sophistiqués qui tentent de se dissimuler en modifiant des sections critiques de leur fichier PE.

L'onglet « **Fonctions** » liste les appels d'API importés par le fichier. Il s'agit également de la table d'adresses d'importation (**IAT**). En cliquant sur l'onglet « **Liste noire** », PeStudio trie les API en plaçant les fonctions interdites en haut de la liste. Cette fonctionnalité est utile car elle permet de comprendre le comportement potentiel d'un logiciel malveillant une fois qu'il a compromis un système hôte. L'image ci-dessous illustre les API importées.

![black list](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727178234246.png)

Voici les fonctions importantes que nous avons relevées.

- `set_UseShellExecute` : Cette fonction permet au processus d'utiliser l'interpréteur de commandes du système d'exploitation pour exécuter d'autres processus. On observe fréquemment ce type de comportement dans les logiciels malveillants qui créent des processus supplémentaires pour mener des actions malveillantes.

- `CryptoStream, RijndaelManaged, CipherMode, CreateDecryptor` : Ces API indiquent que l'exécutable utilise des fonctions cryptographiques, notamment Rijndael (chiffrement AES). Les logiciels malveillants peuvent utiliser la cryptographie pour chiffrer les communications et les fichiers, voire implémenter des fonctionnalités de **rançongiciel**.

#### Analyse avec FLOSS

Ouvrez PowerShell et accédez au répertoire contenant notre fichier : `C:\Users\Administrator\Desktop\Sample`. L’invite **PowerShell** peut mettre un certain temps à s’afficher. Exécutez la commande `FLOSS.exe .\windows.exe > windows.txt`. L’outil **floss.exe** sera alors exécuté et son résultat sera enregistré dans un fichier nommé windows.txt, situé dans le même répertoire.

```bash
PS C:\Users\Administrator\Desktop\Sample > FLOSS.exe .\windows.exe > windows.txt
WARNING: floss: .NET language-specific string extraction is not supported yet
WARNING: floss: FLOSS does NOT attempt to deobfuscate any strings from .NET binaries
INFO: floss: disabled string deobfuscation
INFO: floss: extracting static strings
INFO: floss: finished execution after 0.34 seconds
INFO: floss: rendering results
```

Ouvrez le fichier et accédez à la partie inférieure du résultat.

![note](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727179931028.png)

Cela ne vous semble-t-il pas familier ? Ce sont les fonctions que nous avons vues précédemment à l'aide de l'outil PEStudio !

#### Analyse avec Process Explorer et Process Monitor

Dans cet exemple, nous allons analyser la connectivité réseau du fichier `cobaltstrike.exe` situé dans `C:\Users\Administrator\Desktop\Sample`.

Nous allons déterminer si ce fichier établit une connexion réseau avec un éventuel serveur C2. Commençons ! Exécutez le fichier **cobaltstrike.exe** et ouvrez `Process Explorer` depuis le bureau ou la barre des tâches. Vous pouvez également le rechercher dans la barre de recherche Windows. Si vous cliquez manuellement sur le fichier binaire, **Explorer.exe** sera le processus parent et **cobaltstrike.exe** le processus enfant. Vérifions si c'est bien le cas.

![Process](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727191613610.png)

Comme vous pouvez le constater sur la capture d'écran ci-dessus, c'est bien le cas ! N'oubliez pas que cette information est cruciale, mais concentrons-nous sur notre objectif : déterminer si ce processus établit une connexion réseau et, **le cas échéant**, vers **quelle destination**. L'identifiant du processus est `4756`. Notez que cet identifiant peut différer sur votre machine. Faites un clic droit sur le processus, sélectionnez « **Propriétés** » et accédez à l'onglet `TCP/IP`. Nous devrions ainsi pouvoir déterminer la destination de la connexion et l'état du réseau.

![properties](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727191613592.png)

Voilà ! Par ailleurs, lors d'une analyse, il est essentiel que les résultats soient vérifiés et précis. C'est pourquoi nous n'utiliserons pas un seul outil. Nous en utiliserons un autre pour vérifier **l'exactitude des informations**. Arrêtez le processus et relancez-le. Cette fois-ci, nous utiliserons `Procmon` (ou Process Monitor). Vous le trouverez également sur le bureau ou dans la barre des tâches.

Lorsque vous ouvrez Procmon, la recherche du fichier binaire peut s'avérer complexe, car la liste de tous les processus actifs s'affiche. Nous allons donc appliquer un `filtre`. L'image ci-dessous indique l'icône de filtre. Vous pouvez également utiliser le raccourci clavier `Ctrl+L`.

![procmon](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727192184037.png)

L'utilisation de ce filtre se fait en plusieurs étapes :

- Sélectionnez le nom du processus.
- Sélectionnez « Contient ».
- Saisissez une valeur contenant un mot lié au processus, par exemple « cobalt ».
- Cliquez sur « Inclure ».
- Cliquez ensuite sur « Ajouter » et enfin sur « Appliquer ».
- Les conditions ajoutées devraient s'afficher.

![filtre](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727193011175.png)

Cela devrait nous donner un résultat plus détaillé.

![details](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727193407393.png)

Cela confirme que le fichier binaire établissait bien une connexion avec une adresse IP inconnue, à savoir `47.120.46.210`.

---

**Using PEStudio, open the file windows.exe. What is the entropy value of the file windows.exe?**

**Réponse :** `7.999`

**Using PEStudio, open the file windows.exe, then go to manifest (administrator section). What is the value under requestedExecutionLevel?**

**Réponse :** `requireAdministrator`

**Which function allows the process to use the operating system's shell to execute other processes?**

**Réponse :** `set_UseShellExecute`

**Which API starts with R and indicates that the executable uses cryptographic functions?**

Comme dit précédemment voici les API qui permettent de faire ça : `CryptoStream, RijndaelManaged, CipherMode, CreateDecryptor` et celle qui commence avec un `R` est la suivante:

**Réponse :** `RijndaelManaged`

**What is the Imphash of cobaltstrike.exe?**

**Réponse :** `92EEF189FB188C541CBD83AC8BA4ACF5`

**What is the defanged IP address to which the process cobaltstrike.exe is connecting?**

**Réponse :** `47[.]120[.]46[.]210`

**What is the destination port number used by cobaltstrike.exe when connecting to its C2 IP Address?**

**Réponse :** `81`

**During our analysis, we found a process called cobaltstrike.exe. What is the parent process of cobaltstrike.exe?**

**Réponse :** `Explorer.exe`

### Task 5 - Conclusion

Nous avons pu voir énormément d'outils / techniques pour reconnaitre et analyser en profondeur des fichiers potentiellement dangeureux

**Room Complétée**

{% include comments.html %}