---
title: "TryHackMe - Cyber Chef Basics"
date: 2025-10-30 15:12:00 +0200
categories: [TryHackMe, Learning]
tags: [cyber-chef]
description: "Write-up de la room CyberChef Basics qui nous apprendra a manier l'outil CyberChef"
image:
  path: /assets/img/posts/tryhackme-cyberchef.png
  alt: "cyberchef"
---

## Informations sur la room

Cette salle sert d'introduction à CyberChef, le couteau suisse des professionnels de la cybersécurité.

**Lien :** [CyberChef](https://tryhackme.com/room/cyberchefbasics)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Découvrez CyberChef
- Apprenez à utiliser l'interface
- Maîtrisez les opérations courantes
- Apprenez à créer des recettes et à traiter les données

---

## Solutions des tâches

### Task 1 - Introduction

CyberChef est une **application web** simple et intuitive conçue pour **faciliter diverses opérations** de cybersécurité directement dans votre navigateur. Imaginez-la comme un couteau suisse des données : une boîte à outils contenant différents outils adaptés à chaque tâche. Ces tâches vont des **encodages simples** comme XOR ou Base64 aux **opérations complexes** comme le `chiffrement AES` ou le `déchiffrement RSA`. CyberChef fonctionne par recettes, c’est-à-dire une série d’opérations exécutées dans un ordre précis.

### Task 2 - Accessing the Tool

Il existe différentes manières d'accéder à CyberChef et de l'utiliser. Découvrons les deux méthodes les plus pratiques !

#### Accès en ligne

Il vous suffit d'un navigateur web et d'une connexion internet. Cliquez ensuite sur [ce lien](https://gchq.github.io/CyberChef/) pour ouvrir CyberChef directement dans votre navigateur.

#### Accès hors ligne ou installation locale

Vous pouvez exécuter le logiciel hors ligne ou localement sur votre ordinateur en téléchargeant le fichier de la dernière version à partir de [ce lien](https://github.com/gchq/CyberChef/releases). Cette version est compatible avec les plateformes Windows et Linux. Il est recommandé de télécharger la version la plus stable.

Personnellement pour ce cours je vais utiliser la méthode en ligne

### Task 3 - Navigating the Interface

Voici les différentes parties de l'outil en ligne **cyberchef**

1) Operations
2) Recipe
3) Input
4) Output

![cyberchef](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1728731934241.png)

#### Espace "Operations"

Il s'agit d'un répertoire pratique et complet de toutes les opérations que CyberChef est capable d'effectuer. Ces opérations sont **méticuleusement catégorisées**, offrant aux utilisateurs un accès facile à leurs différentes fonctionnalités. Grâce à la fonction de recherche, les utilisateurs peuvent trouver rapidement des opérations spécifiques, ce qui améliore leur efficacité et leur productivité.

Vous trouverez ci-dessous quelques exemples d'opérations que vous pourriez utiliser tout au long de votre parcours en cybersécurité.

| Opération | Description | Exemples |
|-----------|-------------|----------|
| **From Morse Code** | Traduit le code Morse en caractères alphanumériques (majuscules). | `- .... .-. . .- - ...` devient `THREATS` avec les paramètres par défaut |
| **URL Encode** | Encode les caractères problématiques en pourcentage d'encodage, un format supporté par les URIs/URLs. | `https://tryhackme.com/r/room/cyberchefbasics` devient `https%3A%2F%2Ftryhackme%2Ecom%2Fr%2Froom%2Fcyberchefbasics` avec le paramètre "Encode all special chars" |
| **To Base64** | Cette opération encode les données brutes en une chaîne ASCII Base64. | `This is fun!` devient `VGhpcyBpcyBmdW4h` |
| **To Hex** | Convertit la chaîne d'entrée en octets hexadécimaux séparés par le délimiteur spécifié. | `This Hex conversion is awesome!` devient `54 68 69 73 20 48 65 78 20 63 6f 6e 76 65 72 73 69 6f 6e 20 69 73 20 61 77 65 73 6f 6d 65 21` |
| **To Decimal** | Convertit les données d'entrée en un tableau d'entiers ordinaux. | `This Decimal conversion is awesome!` devient `84 104 105 115 32 68 101 99 105 109 97 108 32 99 111 110 118 101 114 115 105 111 110 32 105 115 32 97 119 101 115 111 109 101 33` |
| **ROT13** | Un simple chiffrement de substitution Caesar qui fait tourner les caractères alphabétiques du montant spécifié (par défaut 13). | `Digital Forensics and Incident Response` devient `Qvtvgny Sberafvpf naq Vapvqrag Erfcbafr` |

Vous pouvez également vérifier directement le fonctionnement des opérations en survolant l'opération concernée. Vous devriez alors obtenir un exemple ou une description ainsi qu'un lien vers Wikipédia.

![operations](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1729081368672.png)

#### Espace "Recipe"

Considérée comme le **cœur de l'outil**, cette zone vous permet de sélectionner, d'organiser et d'affiner facilement les opérations selon vos besoins. Vous y prenez le contrôle, en définissant précisément les arguments et options de chaque opération. La zone de recettes est un espace dédié à la sélection et à l'organisation d'opérations spécifiques, puis à la définition de leurs arguments et options respectifs afin de personnaliser leur comportement. Dans cette zone, vous pouvez glisser-déposer les opérations souhaitées et spécifier leurs arguments et options.

Fonctionnalités :

- Enregistrer une recette : Permet d'enregistrer les opérations sélectionnées.
- Charger une recette : Permet de charger des recettes précédemment enregistrées.
- Effacer une recette : Permet d'effacer la recette sélectionnée pendant son utilisation.
- Ces fonctionnalités sont accessibles via les icônes ci-dessous.

![recipe](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1728731934220.png)

La partie inférieure de l'image ci-dessus correspond au bouton `BAKE!`. Ce bouton traite les données de la recette sélectionnée.

Vous pouvez également cocher la case `Auto Bake`. Cette fonction permet de lancer la cuisson automatiquement avec la recette choisie, sans avoir à cliquer manuellement sur `BAKE!` à chaque fois.

#### Espace "Input"

La zone de saisie offre un espace convivial où vous pouvez facilement insérer du texte ou des fichiers en les collant, en les saisissant ou en les faisant glisser.

![input](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1729081714973.png)

De plus, il possède les caractéristiques suivantes :

- `Add a new input tab` C'est ici qu'un onglet supplémentaire est créé pour permettre à l'utilisateur d'utiliser des valeurs différentes de celles de l'onglet précédent.

![add](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1728731934218.png)

- `Open folder as input` Cette fonctionnalité permet aux utilisateurs de télécharger un dossier entier comme valeur d'entrée.

![folder](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1728731934186.png)

- `Open file as input` Cette fonctionnalité permet à l'utilisateur de télécharger un fichier comme valeur d'entrée.

![File](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1728731934210.png)

- `Clear input and output` Cette fonctionnalité permet à l'utilisateur d'effacer toutes les valeurs saisies et la valeur de sortie correspondante.

- `Reset pane layout` Cette fonctionnalité permet d'adapter l'interface de l'outil à ses dimensions de fenêtre par défaut.

#### Espace "Output"

La zone de sortie est un espace visuel affichant les **résultats du traitement** des données. Elle présente clairement les résultats des manipulations ou transformations appliquées aux données d'entrée, offrant ainsi un affichage limpide et intuitif des informations traitées.

![output](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1729081715061.png)

---

**In which area can you find "From Base64"?**

**Réponse :** `operations`

**Which area is considered the heart of the tool?**

**Réponse :** `Recipe`

### Task 4 - Before Anything Else

Avant même d'aborder le sujet proprement dit, voici un bref aperçu du processus de réflexion lors de l'utilisation de CyberChef ! Ce processus se compose de quatre étapes :

![stapes](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1726735685403.png)

---

**At which step would you determine, "What do I want to accomplish?**

**Réponse :** `1`

### Task 5 - Practice, Practice, Practice

On nous a mis un fichier a disposition qu'on doit ouvrir sur le site web de cyberchef dans l'input

**What is the hidden email address?**

Alors pour cette question je me suis rendu dans la column `extractor` puis dans `extract email addresses` et je l'ai glissé déposé dans la section **Recipe** et j'ai cliqué sur `BAKE!`

**Réponse :** `hidden@hotmail.com`

**What is the hidden IP address that ends in .232?**

De même mais avec `Extract IP addresses` voici le résultat

```bash
102.20.11.232
10.10.2.10
```

**Réponse :** `102.20.11.232`

**Which domain address starts with the letter "T"?**

De même mais avec `Extract domains`

**Réponse :** `TryHackMe.com`

**What is the binary value of the decimal number 78?**

Pour cette question j'ai selectionné deux choses, en premier on voulait passer le texte en décimale puis en binaire pour savoir la 78eme valeur, alors on sélectionne `From decimale` on le pose dans **Récipe** puis `To binary` et on le pose dans **Recipe** aussi ce qui nous donne ceci

```binary
00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 01100110 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
```

Et si on regarde la 78eme valeur on obtien ceci

**Réponse :** `01001110`

**What is the URL encoded value of `https://tryhackme.com/r/careers`?**

J'ai mis la balise `URL encode` et j'ai coché la case pour encoder les carctères spéciaux avec l'url donné en input : `https://tryhackme.com/r/careers`

**Réponse :** `https%3A%2F%2Ftryhackme%2Ecom%2Fr%2Fcareers`

### Task 6 - Your First Official Cook

Cette tâche nous permet de mettre en pratique ce que nous avons appris lors des tâches précédentes. Nous utiliserons les différents espaces et fonctionnalités de CyberChef pour répondre aux questions posées.

Et maintenant, c'est le moment de briller ! Vous allez réaliser votre tout premier défi culinaire !

![cook](https://tryhackme-images.s3.amazonaws.com/user-uploads/5e6bbe59a46ee9407fd65bbe/room-content/5e6bbe59a46ee9407fd65bbe-1726735340521.png)

---

**Using the file you downloaded in Task 5, which IP starts and ends with "10"?**

**Réponse :** `10.10.2.10`

**What is the base64 encoded value of the string "Nice Room!"?**

**Réponse :** `TmljZSBSb29tIQ==`

**What is the URL decoded value for https%3A%2F%2Ftryhackme%2Ecom%2Fr%2Froom%2Fcyberchefbasics?**

**Réponse :** `https://tryhackme.com/r/room/cyberchefbasics`

**What is the datetime string for the Unix timestamp 1725151258?**

**Réponse :** `Sun 1 September 2024 00:40:58 UTC`

**What is the Base85 decoded string of the value <+oue+DGm>Ap%u7?**

**Réponse :** `This is fun!`

### Task 7 - Conclusion

Dans cette salle, nous avons discuté de la **puissance de CyberChef** pour la gestion de diverses transformations et décodages de données. Que vous travailliez avec Base64, le binaire ou les URL, cet outil performant offre une interface visuelle intuitive et simple d'utilisation. Grâce à sa bibliothèque de recettes variée, vous pouvez extraire en toute confiance des adresses e-mail, des adresses IP et des noms de domaine. Nous avons pu explorer son interface et aborder les principales fonctionnalités et paramètres. Toutefois, pour les traitements à grande échelle, il est essentiel de recourir à d'autres outils.

**Room Complétée**

{% include comments.html %}