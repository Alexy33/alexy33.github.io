---
title: "TryHackMe - Digital Foresics Fundamentals"
date: 2025-10-28 15:12:00 +0200
categories: [TryHackMe, Learning]
tags: [forensics, security]
description: "Write-up de la room Digital Foresics Fundamentals qui nous apprendra ce qu'est cette team"
image:
  path: /assets/img/posts/tryhackme-soc-fundamentals.png
  alt: "digital forensics"
---

## Informations sur la room

Découvrez la criminalistique numérique et les processus associés et expérimentez avec un exemple pratique.

**Lien :** [Digital Forensics Fundamentals](https://tryhackme.com/room/digitalforensicsfundamentals)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Phases de la forensics numérique
- Types de forensics numérique
- Procédure d'acquisition de preuves
- Analyse médico-légale de Windows
- Résoudre une affaire médico-légale
---

## Solutions des tâches

### Task 1 - Introduction to Digital Forensics

La méthode "`Forensics`" (**médecine légale**) est l'application de méthodes et de procédures pour enquêter et résoudre des crimes. La branche de la médecine légale qui enquête sur les cybercrimes est connue sous le nom de `médecine légale numérique` (forensics team). La cybercriminalité désigne toute activité criminelle menée sur ou utilisant un appareil numérique. Plusieurs outils et techniques sont utilisés pour enquêter de manière approfondie sur les appareils numériques après tout crime afin de trouver et d'analyser les preuves en vue des poursuites judiciaires nécessaires.

---

**Which team was handed the case by law enforcement?**

**Réponse :** `Digital Forensics`

### Task 2 - Digital Forensics Methodology

L’équipe d’investigation numérique est confrontée à divers cas nécessitant `différents outils et techniques`. Cependant, le **National Institute of Standards and Technology** (NIST) définit un processus général pour chaque cas. Le NIST travaille à la définition de cadres pour différents domaines technologiques, y compris la cybersécurité, où il introduit le processus de criminalistique numérique en quatre phases.

![NIST](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1721898813933.png)

- `Collection` : La première phase de l’investigation numérique est la collecte des données. Il est essentiel d’identifier tous les appareils sur lesquels les données peuvent être collectées. Généralement, un enquêteur trouve des ordinateurs personnels, des ordinateurs portables, des appareils photo numériques, des clés USB, etc., sur la scène de crime. Il est également nécessaire de s’assurer que les données originales ne sont pas altérées lors de la collecte des preuves et de conserver un document approprié contenant les détails des éléments collectés. Nous aborderons également les procédures d’acquisition des preuves dans les tâches suivantes.

- `Examination` : Les données collectées peuvent submerger les enquêteurs en raison de leur volume. Ces données doivent généralement être filtrées et les données d’intérêt doivent être extraites. Par exemple, en tant qu’enquêteur, vous avez collecté tous les fichiers multimédias d’un appareil photo numérique sur la scène de crime. Vous pourriez n’en avoir besoin que d’une partie, car vous vous intéressez aux fichiers enregistrés à une date et une heure précises. Ainsi, lors de la phase d’examen, vous filtrerez les fichiers multimédias de la période requise et les transférerez à la phase suivante. De même, vous pourriez n’avoir besoin que des données d’un utilisateur spécifique dans un système contenant de nombreux comptes utilisateurs. La phase d'examen permet de filtrer ces données spécifiques en vue de leur analyse.

- `Analysis` : Il s'agit d'une phase cruciale. Les enquêteurs doivent ensuite analyser les données en les corrélant avec de multiples éléments de preuve afin de tirer des conclusions. L'analyse dépend du scénario de l'affaire et des données disponibles. Elle vise à extraire les activités pertinentes pour l'affaire, par ordre chronologique.

- `Reporting` : Lors de la dernière phase de l'investigation numérique, un rapport détaillé est rédigé. Ce rapport présente la méthodologie de l'enquête et les conclusions détaillées des preuves recueillies. Il peut également contenir des recommandations. Il est présenté aux forces de l'ordre et à la direction. Il est important d'inclure des résumés analytiques dans le rapport, compte tenu du niveau de compréhension de toutes les parties concernées.

Lors de la phase de **collecte**, nous avons constaté que divers éléments de preuve peuvent être trouvés sur la scène de crime. L'analyse de ces multiples catégories de preuves nécessite divers outils et techniques. Il existe différents types d'investigation numérique, chacun ayant ses propres méthodologies de collecte et d'analyse. Les plus courants sont listés ci-dessous.

![collect](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1719849921657.png)

- `Computer forensics` : La forme la plus courante d'informatique légale est l'informatique légale, qui consiste à analyser les ordinateurs, les appareils les plus fréquemment utilisés dans les affaires criminelles.

- `Mobile forensics` : L'informatique légale mobile consiste à analyser les appareils mobiles et à extraire des preuves telles que les enregistrements d'appels, les SMS, les positions GPS, etc.

- `Network forensics` : Ce domaine de l'informatique légale couvre les investigations au-delà des appareils individuels. Il inclut l'ensemble du réseau. La majorité des preuves trouvées sur les réseaux sont les journaux de trafic réseau.

- `Database forensics` : De nombreuses données critiques sont stockées dans des bases de données dédiées. L'informatique légale des bases de données enquête sur toute intrusion dans ces bases de données entraînant une modification ou une exfiltration de données.

- `Cloud forensics` : L'informatique légale cloud consiste à analyser les données stockées sur une infrastructure cloud. Ce type d'informatique légale peut s'avérer complexe pour les enquêteurs, car les preuves sur les infrastructures cloud sont rares.

- `Email forensics` : Le courrier électronique, moyen de communication le plus courant entre professionnels, est devenu un élément important de l'informatique légale. Les e-mails sont examinés pour déterminer s’ils font partie de campagnes de phishing ou frauduleuses.

---

**Which phase of digital forensics is concerned with correlating the collected data to draw any conclusions from it?**

**Réponse :** `Analysis`

**Which phase of digital forensics is concerned with extracting the data of interest from the collected evidence?**

**Réponse :** `Examination`

### Task 3 - Evidence Acquisition

L'acquisition de preuves est une **tâche cruciale**. L'équipe d'investigation doit collecter toutes les preuves de manière sécurisée, `sans altérer les données originales`. Les méthodes d'acquisition de preuves pour les appareils numériques dépendent du type d'appareil. Cependant, certaines pratiques générales doivent être respectées lors de l'acquisition des preuves. Examinons quelques-unes des plus importantes.

#### Autorisation appropriée

L'équipe d'investigation doit obtenir l'**autorisation des autorités compétentes** avant de collecter des données. Toute preuve recueillie sans autorisation préalable peut être **jugée irrecevable** devant un tribunal. Les preuves d'investigation contiennent des données privées et sensibles concernant une organisation ou un individu. Une autorisation appropriée avant la collecte de ces données est essentielle pour mener une enquête dans les limites de la loi.

![warrant](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1719850052883.png)

#### Chaîne de traçabilité (chain of custody)

Imaginez qu'une équipe d'enquêteurs collecte tous les éléments de preuve sur la scène de crime, et que certains disparaissent après quelques jours, ou qu'ils soient modifiés. Dans ce scénario, personne ne peut être tenu responsable, car il n'existe pas de procédure adéquate pour identifier les propriétaires des éléments de preuve. Ce problème peut être résolu en **conservant un document de chaîne de traçabilité**. Il s'agit d'un **document officiel** contenant tous les détails des éléments de preuve. Voici quelques informations clés :

- Description des éléments de preuve (nom, type)
- Nom des personnes qui les ont collectés
- Date et heure de collecte des éléments de preuve
- Lieu de stockage de chaque élément de preuve
- Heures d'accès et dossier individuel de la personne ayant accédé aux éléments de preuve

Cela permet de constituer une piste de preuves **fiable** et de la préserver. Le document de chaîne de possession peut servir à prouver l'intégrité et la fiabilité des preuves admises au tribunal.

#### Utilisation de bloqueurs d'écriture

Les bloqueurs d'écriture sont un élément essentiel de la panoplie d'outils de l'équipe d'investigation numérique. Imaginons que vous collectiez des preuves sur le disque dur d'un suspect et que vous connectiez ce disque dur à la **station de travail d'investigation**. Pendant la collecte, certaines tâches en arrière-plan de la station de travail peuvent **altérer l'horodatage des fichiers** sur le disque dur. Cela peut gêner l'analyse et produire des résultats erronés. Supposons que, dans le même scénario, les données aient été collectées sur le disque dur à l'aide d'un `bloqueur d'écriture`. Cette fois, le disque dur du suspect conserverait son état d'origine, car le bloqueur d'écriture peut bloquer toute action de modification des preuves.

![write blockers](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1719477004541)

---

**Which tool is used to ensure data integrity during the collection?**

**Réponse :** `write blocker`

**What is the name of the document that has all the details of the collected digital evidence?**

**Réponse :** `chain of custody`

### Task 4 - Windows Forensics

Les preuves les plus fréquemment recueillies sur les scènes de crime sont les **ordinateurs de bureau** et les **ordinateurs portables**, car la plupart des activités criminelles impliquent un système personnel. Ces appareils sont équipés de différents systèmes d'exploitation. Dans cette tâche, nous aborderons l'acquisition et l'analyse des preuves sous `Windows`, un système d'exploitation très répandu ayant fait l'objet de plusieurs enquêtes.

Lors de la phase de collecte de données, des images forensiques du système d'exploitation Windows sont prises. Ces images forensiques sont **des copies bit à bit de l'ensemble du système d'exploitation**. Deux catégories d'images forensiques sont prises à partir d'un système d'exploitation Windows.

- `Image disque` : L'image disque contient toutes les données présentes sur le périphérique de stockage du système (disque dur, SSD, etc.). Ces données sont non volatiles, ce qui signifie qu'elles sont conservées même après un redémarrage du système d'exploitation. Par exemple, tous les fichiers tels que `les médias, les documents, l'historique de navigation Internet, etc`.

- `Image mémoire` : L'image mémoire contient les données stockées dans la RAM du système d'exploitation. Cette mémoire est volatile, ce qui signifie que les données sont perdues après l'arrêt ou le redémarrage du système. Par exemple, pour capturer les fichiers ouverts, les processus en cours d'exécution, les connexions réseau actuelles, etc., l'image mémoire doit être prioritaire et extraite en premier du système d'exploitation du suspect ; sinon, tout redémarrage ou arrêt du système entraînerait la suppression de toutes les données volatiles. Lors d'une analyse numérique sur un système d'exploitation Windows, la collecte d'images de disque et de mémoire est essentielle.

Examinons quelques outils populaires utilisés pour l'acquisition et l'analyse d'images de disque et de mémoire sous Windows.

`FTK Imager` : FTK Imager est un outil largement utilisé pour **capturer des images de disque des systèmes d'exploitation Windows**. Il offre une interface graphique conviviale permettant de créer des images dans différents formats. Cet outil permet également d'analyser le contenu d'une image disque. Il peut être utilisé à des fins d'acquisition et d'analyse.

![FTK](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1719850244263.png)

`Autopsy` : [Autopsy](https://www.autopsy.com/) est une plateforme d'investigation numérique **open source** populaire. Un enquêteur peut importer une image disque acquise dans cet outil, qui effectuera une analyse approfondie de l'image. L'analyse d'image offre diverses fonctionnalités, notamment la recherche par mot-clé, la récupération de fichiers supprimés, la gestion des métadonnées, la détection des incompatibilités d'extension, et bien plus encore.

![Autopsy](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1719850243926.png)

`Volatility` : [Volatility](https://volatilityfoundation.org/) est un puissant outil **open source d'analyse d'images mémoire**. Il propose des plugins extrêmement utiles. Chaque artefact peut être analysé à l'aide d'un plugin spécifique. Cet outil est **compatible avec différents systèmes d'exploitation**, notamment Windows, Linux, macOS et Android.

![Volatility](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1719850244224.png)

---

**Which type of forensic image is taken to collect the volatile data from the operating system?**

**Réponse :** `memory image`

### Task 5 - Practical Example of Digital Forensics

Tout ce que nous faisons sur nos appareils numériques, des smartphones aux ordinateurs, `laisse des traces`. Voyons comment exploiter ces données dans le cadre de l'enquête.

Notre chat, Gado, a été kidnappé. Le ravisseur nous a envoyé un document contenant ses demandes au format MS Word. Nous avons converti ce document au format PDF et extrait l'image du fichier MS Word pour faciliter la tâche.

Pour nous le fichier est dans `/root/Rooms/introdigitalforensics`

Lorsque vous créez un fichier texte (`TXT`), certaines métadonnées sont enregistrées par le système d'exploitation, comme la **date de création et la date de dernière modification**. Cependant, de nombreuses informations sont conservées dans les métadonnées du fichier lorsque vous utilisez un éditeur plus avancé, comme `MS Word`. Il existe plusieurs façons de lire les métadonnées du fichier : vous pouvez les ouvrir avec leur lecteur/éditeur officiel ou utiliser un outil d'analyse approprié. Notez que l'exportation du fichier vers d'autres formats, comme le `PDF`, **conservera la plupart des métadonnées du document d'origine**, selon le logiciel d'édition PDF utilisé.

Voyons ce que nous pouvons apprendre du fichier `PDF`. Nous pouvons essayer de lire les métadonnées avec le programme `pdfinfo`. Pdfinfo affiche diverses métadonnées relatives à un fichier PDF, telles que **le titre, le sujet, l'auteur, le créateur et la date de création**.

On peut utiliser la commande `pdfinfo` avec l'exemple suivant : `pdfinfo DOCUMENT.pdf`

```bash
root@tryhackme:~# pdfinfo DOCUMENT.pdf 
Creator:        Microsoft® Word for Office 365
Producer:       Microsoft® Word for Office 365
CreationDate:   Wed Oct 10 21:47:53 2018 EEST
ModDate:        Wed Oct 10 21:47:53 2018 EEST
Tagged:         yes
UserProperties: no
Suspects:       no
Form:           none
JavaScript:     no
Pages:          20
Encrypted:      no
Page size:      595.32 x 841.92 pts (A4)
Page rot:       0
File size:      560362 bytes
Optimized:      no
PDF version:    1.7
```

Les métadonnées du PDF montrent clairement qu’il a été créé à l’aide de **MS Word** pour **Office 365** le **10 octobre 2018**.

Données EXIF ​​des photos

`EXIF` signifie Exchangeable Image File Format -> il s'agit d'une **norme d'enregistrement des métadonnées des fichiers image**. Lorsque vous prenez une photo avec votre smartphone ou votre appareil photo numérique, de nombreuses informations sont intégrées à l'image. Voici quelques exemples de métadonnées que l'on retrouve dans les images numériques originales :

- Modèle d'appareil photo/Modèle de smartphone
- Date et heure de prise de vue
- Paramètres photo tels que la focale, l'ouverture, la vitesse d'obturation et la sensibilité ISO

Les smartphones étant équipés d'un capteur GPS, il est très probable que les **coordonnées GPS** intégrées à l'image soient retrouvées. Les coordonnées GPS, c'est-à-dire la latitude et la longitude, indiquent généralement le lieu où la photo a été prise.

Il existe de nombreux outils, en ligne et hors ligne, permettant de **lire les données EXIF ​​des images**. L'un d'eux est `exiftool`, un outil en ligne de commande. Exiftool permet de lire et d'écrire des métadonnées dans différents types de fichiers, comme les images **JPEG**.On peut suivre l'exemple de commande suivante : `exiftool IMAGE.jpg` pour lire toutes les données **EXIF** ​​intégrées à cette image.

```bash   
root@tryhackme:~# exiftool IMAGE.jpg
[...]
GPS Position : 51 deg 31' 4.00" N, 0 deg 5' 48.30" W
[...]
```

Si vous utilisez les coordonnées ci-dessus et effectuez une recherche sur une carte en ligne, vous en apprendrez davantage sur ce lieu. Une recherche sur Microsoft Bing Maps ou Google Maps avec `51° 30' 51.90" N, 0° 5' 38.73" O` révèle la rue où la photo a été prise. Notez que pour que la recherche fonctionne, nous avons dû remplacer deg par ° et supprimer l'espace blanc superflu. Autrement dit, nous avons saisi `51° 30' 51.9" N 0° 05' 38.7" O` dans la barre de recherche de la carte.

---

**Using pdfinfo, find out the author of the attached PDF file, ransom-letter.pdf.**

```bash
root@ip-10-10-7-48:~/Rooms/introdigitalforensics# pdfinfo ransom-letter.pdf 
Title:          Pay NOW
Subject:        We Have Gato
Author:         Ann Gree Shepherd
Creator:        Microsoft® Word 2016
Producer:       Microsoft® Word 2016
CreationDate:   Wed Feb 23 09:10:36 2022 GMT
ModDate:        Wed Feb 23 09:10:36 2022 GMT
Tagged:         yes
UserProperties: no
Suspects:       no
Form:           none
JavaScript:     no
Pages:          1
Encrypted:      no
Page size:      595.44 x 842.04 pts (A4)
Page rot:       0
File size:      71371 bytes
Optimized:      no
PDF version:    1.7
```

**Réponse :** `Ann Gree Shepherd`

**Using exiftool or any similar tool, try to find where the kidnappers took the image they attached to their document. What is the name of the street?**

```bash
root@ip-10-10-7-48:~/Rooms/introdigitalforensics# exiftool letter-image.jpg 
ExifTool Version Number         : 11.88
File Name                       : letter-image.jpg
Directory                       : .
File Size                       : 124 kB
File Modification Date/Time     : 2022:02:23 08:53:33+00:00
File Access Date/Time           : 2022:02:23 09:12:00+00:00
File Inode Change Date/Time     : 2022:03:04 12:15:19+00:00
File Permissions                : rwxr-xr-x
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Exif Byte Order                 : Little-endian (Intel, II)
Compression                     : JPEG (old-style)
Make                            : Canon
Camera Model Name               : Canon EOS R6
Orientation                     : Horizontal (normal)
X Resolution                    : 300
Y Resolution                    : 300
Resolution Unit                 : inches
Software                        : GIMP 2.10.28
Modify Date                     : 2022:02:15 17:23:40
Exposure Time                   : 1/200
F Number                        : 2.8
Exposure Program                : Manual
ISO                             : 640
Sensitivity Type                : Recommended Exposure Index
Recommended Exposure Index      : 640
Exif Version                    : 0231
Date/Time Original              : 2022:02:25 13:37:33
Create Date                     : 2022:02:25 13:37:33
Offset Time                     : +01:00
Offset Time Original            : +03:00
Offset Time Digitized           : +03:00
Shutter Speed Value             : 1/200
Aperture Value                  : 2.8
Exposure Compensation           : 0
Max Aperture Value              : 1.8
Metering Mode                   : Multi-segment
Flash                           : No Flash
Focal Length                    : 50.0 mm
User Comment                    : THM{238956}
Sub Sec Time Original           : 42
Sub Sec Time Digitized          : 42
Color Space                     : sRGB
Exif Image Width                : 7900
Exif Image Height               : 5267
Focal Plane X Resolution        : 1520
Focal Plane Y Resolution        : 1520
Focal Plane Resolution Unit     : cm
Custom Rendered                 : Normal
Exposure Mode                   : Manual
White Balance                   : Auto
Scene Capture Type              : Standard
Serial Number                   : 083021002010
Lens Info                       : 50mm f/?
Lens Model                      : EF50mm f/1.8 STM
Lens Serial Number              : 000029720b
GPS Latitude Ref                : North
GPS Longitude Ref               : West
GPS Time Stamp                  : 13:37:33
Subfile Type                    : Reduced-resolution image
Photometric Interpretation      : YCbCr
Samples Per Pixel               : 3
Thumbnail Offset                : 1214
Thumbnail Length                : 4941
XMP Toolkit                     : XMP Core 4.4.0-Exiv2
Api                             : 2.0
Platform                        : Linux
Time Stamp                      : 1644938627130718
Approximate Focus Distance      : 0.79
Distortion Correction Already Applied: True
Firmware                        : 1.2.0
Flash Compensation              : 0
Image Number                    : 0
Lateral Chromatic Aberration Correction Already Applied: True
Lens                            : EF50mm f/1.8 STM
Vignette Correction Already Applied: True
Color Mode                      : RGB
ICC Profile Name                : Adobe RGB (1998)
Creator Tool                    : GIMP 2.10
Metadata Date                   : 2021:12:02 13:32:48+01:00
Rating                          : 2
Document ID                     : adobe:docid:photoshop:de96cdf3-afbf-664d-9d4c-d5c1d0fdb4e1
Instance ID                     : xmp.iid:b80f5656-424a-4d4d-9cd0-5a36706d26d6
Original Document ID            : D3825C53382EED70DB7435B0CCF756F5
Preserved File Name             : 5L0A2971.CR3
Already Applied                 : True
Auto Lateral CA                 : 1
Blacks 2012                     : 0
Blue Hue                        : 0
Blue Saturation                 : 0
Camera Profile                  : Adobe Standard
Camera Profile Digest           : 441F68BD6BC3369B59256B103CE2CD5C
Clarity 2012                    : 0
Color Grade Blending            : 50
Color Grade Global Hue          : 0
Color Grade Global Lum          : 0
Color Grade Global Sat          : 0
Color Grade Highlight Lum       : 0
Color Grade Midtone Hue         : 0
Color Grade Midtone Lum         : 0
Color Grade Midtone Sat         : 0
Color Grade Shadow Lum          : 0
Color Noise Reduction           : 25
Color Noise Reduction Detail    : 50
Color Noise Reduction Smoothness: 50
Contrast 2012                   : 0
Crop Angle                      : 0
Crop Bottom                     : 1
Crop Constrain To Warp          : 0
Crop Left                       : 0
Crop Right                      : 1
Crop Top                        : 0
Defringe Green Amount           : 0
Defringe Green Hue Hi           : 60
Defringe Green Hue Lo           : 40
Defringe Purple Amount          : 0
Defringe Purple Hue Hi          : 70
Defringe Purple Hue Lo          : 30
Dehaze                          : 0
Exposure 2012                   : -0.40
Grain Amount                    : 0
Green Hue                       : 0
Green Saturation                : 0
Has Crop                        : False
Has Settings                    : True
Highlights 2012                 : -32
Hue Adjustment Aqua             : 0
Hue Adjustment Blue             : 0
Hue Adjustment Green            : 0
Hue Adjustment Magenta          : 0
Hue Adjustment Orange           : 0
Hue Adjustment Purple           : 0
Hue Adjustment Red              : 0
Hue Adjustment Yellow           : 0
Lens Manual Distortion Amount   : 0
Lens Profile Digest             : B23331240701D3B28825B46A4802290C
Lens Profile Distortion Scale   : 100
Lens Profile Enable             : 1
Lens Profile Filename           : Canon EOS-1Ds Mark III (Canon EF 50mm f1.8 STM) - RAW.lcp
Lens Profile Is Embedded        : False
Lens Profile Name               : Adobe (Canon EF 50mm f/1.8 STM)
Lens Profile Setup              : LensDefaults
Lens Profile Vignetting Scale   : 100
Luminance Adjustment Aqua       : 0
Luminance Adjustment Blue       : 0
Luminance Adjustment Green      : 0
Luminance Adjustment Magenta    : 0
Luminance Adjustment Orange     : 0
Luminance Adjustment Purple     : 0
Luminance Adjustment Red        : 0
Luminance Adjustment Yellow     : 0
Luminance Smoothing             : 0
Override Look Vignette          : False
Parametric Darks                : 0
Parametric Highlight Split      : 75
Parametric Highlights           : 0
Parametric Lights               : 0
Parametric Midtone Split        : 50
Parametric Shadow Split         : 25
Parametric Shadows              : 0
Perspective Aspect              : 0
Perspective Horizontal          : 0
Perspective Rotate              : 0.0
Perspective Scale               : 100
Perspective Upright             : 0
Perspective Vertical            : 0
Perspective X                   : 0.00
Perspective Y                   : 0.00
Post Crop Vignette Amount       : 0
Process Version                 : 11.0
Raw File Name                   : 5L0A2971.dng
Red Hue                         : 0
Red Saturation                  : 0
Saturation                      : 0
Saturation Adjustment Aqua      : 0
Saturation Adjustment Blue      : 0
Saturation Adjustment Green     : 0
Saturation Adjustment Magenta   : 0
Saturation Adjustment Orange    : 0
Saturation Adjustment Purple    : 0
Saturation Adjustment Red       : 0
Saturation Adjustment Yellow    : 0
Shadow Tint                     : 0
Shadows 2012                    : 0
Sharpen Detail                  : 25
Sharpen Edge Masking            : 60
Sharpen Radius                  : +1.0
Sharpness                       : 45
Split Toning Balance            : 0
Split Toning Highlight Hue      : 0
Split Toning Highlight Saturation: 0
Split Toning Shadow Hue         : 0
Split Toning Shadow Saturation  : 0
Color Temperature               : 6650
Texture                         : 0
Tint                            : -7
Tone Curve Name 2012            : Linear
Tone Curve PV2012               : 0, 0, 255, 255
Tone Curve PV2012 Blue          : 0, 0, 255, 255
Tone Curve PV2012 Green         : 0, 0, 255, 255
Tone Curve PV2012 Red           : 0, 0, 255, 255
Version                         : 14.0.1
Vibrance                        : 0
Vignette Amount                 : 0
Whites 2012                     : 0
Format                          : image/jpeg
Document Ancestors              : xmp.did:2ec1b1a6-ffae-0a44-90f9-3b6998456cdf, xmp.did:780a63d9-6024-e942-baf4-cae80b62a8c5
Derived From Document ID        : xmp.did:c3f1ef49-6aa6-4441-8800-6afa19131d22
Derived From Instance ID        : xmp.iid:fd37b6b6-4a37-d44a-89e0-3710c289a8db
Derived From Original Document ID: D3825C53382EED70DB7435B0CCF756F5
History Action                  : derived, saved, saved, saved, derived, saved, converted, saved, saved, converted, derived, saved, saved
History Parameters              : converted from image/x-canon-cr3 to image/dng, saved to new location, converted from image/dng to image/vnd.adobe.photoshop, saved to new location, from image/vnd.adobe.photoshop to application/vnd.adobe.photoshop, from application/vnd.adobe.photoshop to image/jpeg, converted from application/vnd.adobe.photoshop to image/jpeg
History Changed                 : /, /metadata, /metadata, /, /, /, /, /
History Instance ID             : xmp.iid:68afaab8-00f8-4a17-880d-04362acf7f59, xmp.iid:a415f140-19e3-dd4f-a523-2a91fd837241, xmp.iid:a732c1b4-c918-d649-91df-a08fd30a3b28, xmp.iid:c3f1ef49-6aa6-4441-8800-6afa19131d22, xmp.iid:e03136da-36b8-4a4f-a00f-4e953a46cb21, xmp.iid:fd37b6b6-4a37-d44a-89e0-3710c289a8db, xmp.iid:b0dfac61-4499-6b47-b061-c79f9c8868d9, xmp.iid:defc8f04-ab7b-4648-b9d4-1da9f1aa9bf9
History Software Agent          : Adobe Photoshop Lightroom Classic 10.2 (Macintosh), Adobe Photoshop Camera Raw 14.0, Adobe Photoshop Camera Raw 14.0.1 (Windows), Adobe Photoshop Camera Raw 14.0.1 (Windows), Adobe Photoshop 22.4 (Windows), Adobe Photoshop 22.4 (Windows), Adobe Photoshop 22.4 (Windows), Gimp 2.10 (Linux)
History When                    : 2021:11:15 15:50:41+03:00, 2021:12:01 11:25:22+01:00, 2021:12:01 12:34:12+01:00, 2021:12:02 10:19:47+01:00, 2021:12:02 12:53:12+01:00, 2021:12:02 13:32:48+01:00, 2021:12:02 13:32:48+01:00, 2022:02:15 17:23:47+02:00
Look Amount                     : 1
Look Copyright                  : © 2018 Adobe Systems, Inc.
Look Group                      : lang="x-default" Profiles
Look Name                       : Adobe Color
Look Supports Amount            : false
Look Supports Monochrome        : false
Look Supports Output Referred   : false
Look Uuid                       : B952C231111CD8E0ECCF14B86BAA7077
Look Parameters Camera Profile  : Adobe Standard
Look Parameters Convert To Grayscale: False
Look Parameters Look Table      : E1095149FDB39D7A057BAB208837E2E1
Look Parameters Process Version : 11.0
Look Parameters Tone Curve PV2012: 0, 0, 22, 16, 40, 35, 127, 127, 224, 230, 240, 246, 255, 255
Look Parameters Tone Curve PV2012 Blue: 0, 0, 255, 255
Look Parameters Tone Curve PV2012 Green: 0, 0, 255, 255
Look Parameters Tone Curve PV2012 Red: 0, 0, 255, 255
Look Parameters Version         : 14.0.1
Profile CMM Type                : Little CMS
Profile Version                 : 4.3.0
Profile Class                   : Display Device Profile
Color Space Data                : RGB
Profile Connection Space        : XYZ
Profile Date Time               : 2022:02:15 14:53:19
Profile File Signature          : acsp
Primary Platform                : Apple Computer Inc.
CMM Flags                       : Not Embedded, Independent
Device Manufacturer             : 
Device Model                    : 
Device Attributes               : Reflective, Glossy, Positive, Color
Rendering Intent                : Perceptual
Connection Space Illuminant     : 0.9642 1 0.82491
Profile Creator                 : Little CMS
Profile ID                      : 0
Profile Description             : GIMP built-in sRGB
Profile Copyright               : Public Domain
Media White Point               : 0.9642 1 0.82491
Chromatic Adaptation            : 1.04788 0.02292 -0.05022 0.02959 0.99048 -0.01707 -0.00925 0.01508 0.75168
Red Matrix Column               : 0.43604 0.22249 0.01392
Blue Matrix Column              : 0.14305 0.06061 0.71393
Green Matrix Column             : 0.38512 0.7169 0.09706
Red Tone Reproduction Curve     : (Binary data 32 bytes, use -b option to extract)
Green Tone Reproduction Curve   : (Binary data 32 bytes, use -b option to extract)
Blue Tone Reproduction Curve    : (Binary data 32 bytes, use -b option to extract)
Chromaticity Channels           : 3
Chromaticity Colorant           : Unknown (0)
Chromaticity Channel 1          : 0.64 0.33002
Chromaticity Channel 2          : 0.3 0.60001
Chromaticity Channel 3          : 0.15001 0.06
Device Mfg Desc                 : GIMP
Device Model Desc               : sRGB
Current IPTC Digest             : b417d6571f8aba97a1e64afbdedafbdb
Coded Character Set             : UTF8
Envelope Record Version         : 4
Date Created                    : 2022:02:15
Digital Creation Date           : 2021:11:05
Digital Creation Time           : 14:06:13+03:00
Application Record Version      : 4
Time Created                    : 17:23:40-17:23
Image Width                     : 1200
Image Height                    : 800
Encoding Process                : Progressive DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:4:4 (1 1)
Aperture                        : 2.8
Image Size                      : 1200x800
Megapixels                      : 0.960
Scale Factor To 35 mm Equivalent: 0.7
Shutter Speed                   : 1/200
Create Date                     : 2022:02:25 13:37:33.42+03:00
Date/Time Original              : 2022:02:25 13:37:33.42+03:00
Modify Date                     : 2022:02:15 17:23:40+01:00
Thumbnail Image                 : (Binary data 4941 bytes, use -b option to extract)
GPS Latitude                    : 51 deg 30' 51.90" N
GPS Longitude                   : 0 deg 5' 38.73" W
Date/Time Created               : 2022:02:15 17:23:40-17:23
Digital Creation Date/Time      : 2021:11:05 14:06:13+03:00
Circle Of Confusion             : 0.043 mm
Depth Of Field                  : 0.06 m (0.76 - 0.82 m)
Field Of View                   : 54.9 deg
Focal Length                    : 50.0 mm (35 mm equivalent: 34.6 mm)
GPS Position                    : 51 deg 30' 51.90" N, 0 deg 5' 38.73" W
Hyperfocal Distance             : 20.58 m
Light Value                     : 7.9
Lens ID                         : Canon EF 50mm f/1.8 STM
```

Il y avait trop d'info et nous ce qu'on cherche c'est juste le nom de la rue et pour ça il nous faut des coordonnées GPS donc j'ai utilisé `grep` pour trié l'output :

```bash
root@ip-10-10-7-48:~/Rooms/introdigitalforensics# exiftool letter-image.jpg | grep GPS
GPS Latitude Ref                : North
GPS Longitude Ref               : West
GPS Time Stamp                  : 13:37:33
GPS Latitude                    : 51 deg 30' 51.90" N
GPS Longitude                   : 0 deg 5' 38.73" W
GPS Position                    : 51 deg 30' 51.90" N, 0 deg 5' 38.73" W
```

> On oublie pas de remplacer « `deg` » par « `°` » et de **supprimer l'espace** entre le chiffre et le symbole « ° » avant de lancer la recherche. Ce qui nous donne `51°30'51.90"N,0°5'38.73"W`
{: .prompt-tip}

Et nous tombons sur la rue `Milk St` mais St est un diminnutif de `Street`

**Réponse :** `Milk Street`

**What is the model name of the camera used to take this photo?**

Vu que la question parle de `Camera` j'ai grep sur le mot `Camera`

```bash
root@ip-10-10-7-48:~/Rooms/introdigitalforensics# exiftool letter-image.jpg | grep Camera
Camera Model Name               : Canon EOS R6
Camera Profile                  : Adobe Standard
Camera Profile Digest           : 441F68BD6BC3369B59256B103CE2CD5C
History Software Agent          : Adobe Photoshop Lightroom Classic 10.2 (Macintosh), Adobe Photoshop Camera Raw 14.0, Adobe Photoshop Camera Raw 14.0.1 (Windows), Adobe Photoshop Camera Raw 14.0.1 (Windows), Adobe Photoshop 22.4 (Windows), Adobe Photoshop 22.4 (Windows), Adobe Photoshop 22.4 (Windows), Gimp 2.10 (Linux)
Look Parameters Camera Profile  : Adobe Standard
```

**Réponse :** `Canon EOS R6`

**Room Complétée**

{% include comments.html %}