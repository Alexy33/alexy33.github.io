---
title: "TryHackMe - SQL fundamentals"
date: 2025-10-21 18:56:00 +0200
categories: [TryHackMe, Learning]
tags: [sql, vulnerabilities, database]
description: "Write-up de la room SQL fundamentals qui nous apprendra a manier et comprendre le language SQL fait pour manipuler des bases de données"
image:
  path: /assets/img/posts/tryhackme-sql-fundamentals.png
  alt: "SQL fundamentals"
---

## Informations sur la room

SQL (Structured Query Language) est un langage informatique normalisé servant à exploiter des bases de données relationnelles. La partie langage de manipulation des données de SQL permet de rechercher, d'ajouter, de modifier ou de supprimer des données dans les bases de données relationnelles. 

**Lien :** [JavaScript Essentials](https://tryhackme.com/room/sqlfundamentals)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Comprendre ce que sont les bases de données, ainsi que les termes et concepts clés.
- Comprendre les différents types de bases de données. 
- Comprendre ce qu'est le langage SQL.
- Comprendre et être capable d'utiliser les opérations CRUD en SQL.
- Comprendre et être capable d'utiliser les opérations de clauses SQL.
- Comprendre et être capable d'utiliser les opérations SQL.
- Comprendre et être capable d'utiliser les opérateurs SQL.
- Comprendre et être capable d'utiliser les fonctions SQL.

---

## Solutions des tâches

### Task 1 - Introduction

La cybersécurité est un vaste sujet qui couvre un large éventail de thèmes, mais peu d'entre eux sont aussi omniprésents que les bases de données. Que vous travailliez à la sécurisation d'une application web, que vous travailliez dans un **SOC** et utilisiez un **SIEM**, que vous configuriez l'authentification des utilisateurs/le contrôle d'accès ou que vous utilisiez des outils d'analyse des logiciels malveillants/de détection des menaces (la liste est longue), vous dépendrez d'une manière ou d'une autre des bases de données. Par exemple, du côté offensif de la sécurité, elles peuvent nous aider à mieux comprendre les vulnérabilités SQL, telles que les injections SQL, et à créer des requêtes qui nous aident à altérer ou à récupérer des données au sein d'un service compromis. D'autre part, du côté défensif, elles peuvent nous aider à naviguer dans les bases de données et à trouver des activités suspectes ou des informations pertinentes ; elles peuvent également nous aider à mieux protéger un service en mettant en place des restrictions lorsque cela est nécessaire.

### Task 2 - Databases 101

Bon, on a expliqué à quel point elles sont importantes. Il est maintenant temps de comprendre ce qu'elles sont exactement. Comme mentionné dans l'introduction, les bases de données sont tellement omniprésentes que vous interagissez très probablement avec des systèmes qui les utilisent. Les bases de données sont des `collections` organisées d'informations ou de données structurées, facilement accessibles et pouvant être manipulées ou analysées. Ces données peuvent prendre plusieurs formes, telles que les données d'authentification des utilisateurs (comme les noms d'utilisateur et les mots de passe), qui sont stockées et vérifiées lors de l'authentification dans une application ou un site (comme TryHackMe, par exemple), les données générées par les utilisateurs sur les réseaux sociaux (comme Instagram et Facebook), où des données telles que les publications, les commentaires, les mentions « J'aime », etc. sont collectées et stockées, ainsi que des informations telles que l'historique de visionnage, qui sont stockées par des services de streaming tels que Netflix et utilisées pour générer des recommandations.

#### Different Types of Databases

Il est logique que quelque chose qui est utilisé par tant de personnes et depuis (relativement) si longtemps puisse faire l'objet de multiples types d'implémentations. Il existe plusieurs types de bases de données pouvant être créées, mais dans ce cours d'introduction, nous allons nous concentrer sur les deux principaux types : les bases de données `relationnelles` (alias **SQL**) et les bases de données `non relationnelles` (alias **NoSQL**).

![Database scheme](https://tryhackme-images.s3.amazonaws.com/user-uploads/66c513e4445cb5649e636a36/room-content/66c513e4445cb5649e636a36-1727686858009.png)

`Les base de données relationnelles` -> **Stocke des données structurées**, c'est-à-dire que les données insérées dans cette base de données suivent une structure. Par exemple, les données collectées sur un utilisateur comprennent le **prénom**, le **nom**, l'**adresse e-mail**, le **nom d'utilisateur** et le **mot de passe**. Lorsqu'un nouvel utilisateur s'inscrit, une entrée est créée dans la base de données selon cette structure. Ces données structurées sont stockées sous forme de lignes et de colonnes dans un tableau (qui sera présenté en détail dans quelques instants) ; des relations peuvent ensuite être établies entre deux ou plusieurs tableaux (par exemple, utilisateur et historique des commandes), d'où le terme « **bases de données relationnelles** ». 

`Les bases de données non rationnelles` -> Au lieu de stocker les données de la manière décrite ci-dessus, stockez-les dans un **format non tabulaire**. Par exemple, si des documents sont numérisés, qui peuvent contenir différents types et quantités de données, et sont stockés dans une base de données qui nécessite un format non tabulaire. Voici un exemple de ce à quoi cela pourrait ressembler : 

```sql
{
    _id: ObjectId("4556712cd2b2397ce1b47661"),
    name: { first: "Thomas", last: "Anderson" },
    date_of_birth: new Date('Sep 2, 1964'),
    occupation: [ "The One"],
    steps_taken : NumberLong(4738947387743977493)
}
```

#### Tables, Rows and Columns

Maintenant on va parler des type primaire en SQL, c'est a dire les **lignes de tableau** et les **columns** donc tout ces données sont stocké dans ce qu'on appel des `tables;` Par exemple, une collection de livres en stock dans une librairie pourrait être stockée dans une table nommée **Livres**.

![table](https://tryhackme-images.s3.amazonaws.com/user-uploads/66c513e4445cb5649e636a36/room-content/66c513e4445cb5649e636a36-1727686918382.png)

#### Primary and Foreign Keys

Une fois qu'une table a été définie et remplie, il peut être nécessaire de stocker davantage de données. Par exemple, nous voulons créer une table nommée **Auteurs** qui stocke les auteurs des livres vendus dans le magasin. Voici un exemple très clair de relation. Un livre (stocké dans la table Livres) est écrit par un auteur (stocké dans la table Auteurs). Si nous voulons rechercher un livre dans notre histoire, mais également obtenir le nom de l'auteur de ce livre, nos données doivent être reliées d'une manière ou d'une autre, pour cela, nous utilisons des `clés`. Il existe **deux types de clés**:

![keys](https://tryhackme-images.s3.amazonaws.com/user-uploads/66c513e4445cb5649e636a36/room-content/66c513e4445cb5649e636a36-1727686918373.png)

- Les `clés primaires` -> Une clé primaire est une colonne qui contient des `valeurs uniques` pour identifier chaque enregistrement d'une table de manière distincte (comme un numéro d'étudiant qui différencie les élèves ayant le même nom). Chaque table ne peut avoir qu'une seule clé primaire, et dans l'exemple donné, la colonne "id" est le meilleur choix car elle est unique pour chaque livre.

- Les `clés étrangères` -> Une clé étrangère est une colonne d'une table qui `fait référence` à une colonne d'une autre table, créant ainsi un lien entre les deux tables (par exemple, "author_id" dans la table Books qui correspond à "id" dans la table Author). Contrairement à la clé primaire, une table peut contenir plusieurs clés étrangères, ce qui permet d'établir les relations dans une base de données relationnelle.

---

**What type of database should you consider using if the data you're going to be storing will vary greatly in its format?**

On a vu qu'il y a deux type de base de données déjà, les relationnelles, et les non-relationnelles, mais il y a un type qui stocke des données qui varient et c'est le format non-relationnel.

**Réponse :** `non-relational database`

**What type of database should you consider using if the data you're going to be storing will reliably be in the same structured format?**

A l'inverse ce qui stocke des données structurés c'est bien la base de donnée relationnelle.

**Réponse :** `relational database`

**In our example, once a record of a book is inserted into our "Books" table, it would be represented as a ___ in that table?**

**Réponse :** `row`

**Which type of key provides a link from one table to another?**

Bon ok j'ai pas mis la traduction en anglais c'est bien c'est la clé étrangère qui **fait  référence** a une autre table

**Réponse :** `foreign key`

**which type of key ensures a record is unique within a table?**

Pour ce qui est des valeurs uniques, c'est bien l'autre type de clés.

**Réponse :** `primary key`

### Task 3 - SQL

On doit se connecter sur la machine avec `mysql` et la commande suivante, ce qui nous permettra de toucher et manipuler une base de donnée.

```bash        
user@tryhackme$ mysql -u root -p
```

**What serves as an interface between a database and an end user?**

ce qui sert d'interface entre la base de donnée et l'utilisateur c'est : **Database Management System** (DBMS)

**Réponse :** `DMBS`

**What query language can be used to interact with a relational database?**

**Réponse :** `SQL`

### Task 4 - Database and Table Statements

Maintenant nous allons créer notre première base de donnée avec la commande `CREATE DATABASE` dans l'interface de **mysql** 

```bash
mysql> CREATE DATABASE database_name;
```

On doit appeller notre base de donnée : `thm_bookmarket_db`

> Ne pas oublier le `;` à la fin des lignes
{: .prompt-warning}

Ensuite nous pouvons voir notre base de donnée avec la commande `SHOW DATABASES;` ce qui nous donne ceci

```sql
mysql> show databases;
+-----------------------------------------------+
| Database                                      |
+-----------------------------------------------+
| THM{575a947132312f97b30ee5aeebba629b723d30f9} |
| information_schema                            |
| mysql                                         |
| performance_schema                            |
| sys                                           |
| task_4_db                                     |
| thm_bookmarket_db                             |
| thm_books                                     |
| thm_books2                                    |
| tools_db                                      |
+-----------------------------------------------+
10 rows in set (0.01 sec)
```

Et comme on peut le voir on y voit bien notre base de donnée **thm_bookmarket_db**

Maintenant on va apprendre a **utiliser** une base de données avec la commande `USE`

```bash
mysql> USE thm_bookmarket_db;
```

Ensuite on peut utiliser la commande `DROP` pour supprimer une base de données

```bash
mysql> DROP database database_name;
```

Parfait on connait les commandes principales en SQL mais nous devons aussi apprendre a faire des tables comme ceci:

```bash
mysql> CREATE TABLE example_table_name (
    example_column1 data_type,
    example_column2 data_type,
    example_column3 data_type
);
```

Avec la commande `CREATE TABLE` on peut créer de nouveaux tableaux.

```bash
mysql> CREATE TABLE book_inventory (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    book_name VARCHAR(255) NOT NULL,
    publication_date DATE
);
```

Comme on peut le voir j'ai créer le tableau `book_inventory` qui contient 3 columns, une pour l'`id` des livres et c'est pourquoi j'ai mis cette column en **INT** car c'est un entier et le AUTO_INCREMENT c'est pour augmenter la valeur de 1 comparé a celle d'avant pour que ça soit toujours UNIQUE et à la fin de la ligne j'ai mis PRIMARY KEY car c'est une clé primaire (unique pour chaque livres)

La deuxième column c'est le nom du livre d'où `book_name` qui est un VARCHAR(255) car le varchar c'est simplement pour pouvoir ajouter des charactères et pas que des chiffres comme des INT, pour écrire correctement le nom du livre et NOT NULL car un livre a forcément un nom.

Enfin la dernière column c'est la date de publication `publication_date` et il a comme type DATE car oui en SQL c'est un type.

Ensuite nous pouvons voir nos tableaux avec la commande `show tables;` et ne pas oublier le `s` sinon ça fait juste rien

```bash
mysql> show tables;
+-----------------------------+
| Tables_in_thm_bookmarket_db |
+-----------------------------+
| book_inventory              |
+-----------------------------+
1 row in set (0.00 sec)
```

Et pour voir le contenu du tableau `book_inventory` on a besoin de la commande `DESCRIBE`

```bash
mysql> describe book_inventory;
+------------------+--------------+------+-----+---------+----------------+
| Field            | Type         | Null | Key | Default | Extra          |
+------------------+--------------+------+-----+---------+----------------+
| book_id          | int          | NO   | PRI | NULL    | auto_increment |
| book_name        | varchar(255) | NO   |     | NULL    |                |
| publication_date | date         | YES  |     | NULL    |                |
+------------------+--------------+------+-----+---------+----------------+
3 rows in set (0.01 sec)
```

Si on a besoin de faire des changements sur un tableau déjà fini on a la commande `ALTER` a disposition qui peut nous aider a ajouter des columns ou autre

```bash
mysql> ALTER TABLE book_inventory
ADD page_count INT;
```

Et de même avec la commande `DROP` on peut aussi supprimé des tableaux il suffi juste de changer ce qu'il y a après DROP 

```bash
mysql> DROP TABLE table_name;
```

---

**Using the statement you've learned to list all databases, it should reveal a database with a flag for a name; what is it?**

On l'a vu dans les exemples que j'ai donné

**Réponse :** `THM{575a947132312f97b30ee5aeebba629b723d30f9}`

**In the list of available databases, you should also see the  task_4_db database. Set this as your active database and list all tables in this database; what is the flag present here?**

```bash
mysql> use task_4_db
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables
    -> ;
+-----------------------------------------------+
| Tables_in_task_4_db                           |
+-----------------------------------------------+
| THM{692aa7eaec2a2a827f4d1a8bed1f90e5e49d2410} |
+-----------------------------------------------+
1 row in set (0.00 sec)
```

**Réponse :** `THM{692aa7eaec2a2a827f4d1a8bed1f90e5e49d2410}`

### Task 5 - CRUD Operations

**C**reate, **R**ead, **U**pdate, and **D**elete (CRUD) C'est considérer comme les opérations les plus basics pour manager de la data dans n'importe quel system.

L'opération **Create** permet de créer de nouveaux enregistrements dans une table. Dans MySQL, cela peut être réalisé à l'aide de l'instruction `INSERT INTO`, comme indiqué ci-dessous.

```bash
mysql> INSERT INTO books (id, name, published_date, description)
    VALUES (1, "Android Security Internals", "2014-10-14", "An In-Depth Guide to Android's Security Architecture");

Query OK, 1 row affected (0.01 sec)
```

Comme nous pouvons le constater, l'instruction `INSERT INTO` spécifie une table, dans ce cas books, dans laquelle nous pouvons ajouter un nouvel enregistrement ; les colonnes **id**, **name**, **published_date** et **description** sont les enregistrements de la table. Dans cet exemple, un nouvel enregistrement avec un id de  1, un nom « Android Security Internals », une published_date de « 2014-10-14 » et une description indiquant « Android Security Internals fournit une compréhension complète des mécanismes de sécurité internes des appareils Android » a été ajouté.

Comme son nom l'indique, l'opération `READ` sert à lire ou à récupérer des informations dans une table. On peut récupérer une colonne ou toutes les colonnes d'une table avec l'instruction `SELECT`, comme le montre l'exemple suivant.

```bash
mysql> SELECT * FROM books;
+----+----------------------------+----------------+------------------------------------------------------+
| id | name                       | published_date | description                                          |
+----+----------------------------+----------------+------------------------------------------------------+
|  1 | Android Security Internals | 2014-10-14     | An In-Depth Guide to Android's Security Architecture |
+----+----------------------------+----------------+------------------------------------------------------+

1 row in set (0.00 sec)
```

> L'étoile que j'ai mis après SELECT c'est pour dire **TOUT**
{: .prompt-tip}

On peut aussi faire des combinaisons de commandes comme ceci:

```bash
mysql> SELECT name, description FROM books;
+----------------------------+------------------------------------------------------+
| name                       | description                                          |
+----------------------------+------------------------------------------------------+
| Android Security Internals | An In-Depth Guide to Android's Security Architecture |
+----------------------------+------------------------------------------------------+

1 row in set (0.00 sec)  
```

L'opération Update modifie un enregistrement existant dans une table, et la même instruction, `UPDATE`, peut être utilisée à cette fin.

```bash
mysql> UPDATE books
    SET description = "An In-Depth Guide to Android's Security Architecture."
    WHERE id = 1;

Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0 
```

L'instruction `UPDATE` spécifie la table, dans ce cas books, puis nous pouvons utiliser `SET` suivi du nom de la colonne que nous allons mettre à jour. La clause `WHERE` spécifie la ligne à mettre à jour lorsque la clause est remplie, dans ce cas celle dont l'id est 1.

L'opération de suppression supprime des enregistrements d'une table. Nous pouvons y parvenir à l'aide de l'instruction `DELETE`.

> Il n'est pas nécessaire d'exécuter la requête. La suppression de cette entrée aura une incidence sur les autres exemples des tâches à venir.
{: .prompt-info}

```bash
mysql> DELETE FROM books WHERE id = 1;

Query OK, 1 row affected (0.00 sec) 
```

---

**Using the `tools_db` database, what is the name of the tool in the `hacking_tools` table that can be used to perform man-in-the-middle attacks on wireless networks?**

```bash
mysql> select * from hacking_tools;
+----+------------------+----------------------+-------------------------------------------------------------------------+--------+
| id | name             | category             | description                                                             | amount |
+----+------------------+----------------------+-------------------------------------------------------------------------+--------+
|  1 | Flipper Zero     | Multi-tool           | A portable multi-tool for pentesters and geeks in a toy-like form       |    169 |
|  2 | O.MG cables      | Cable-based attacks  | Malicious USB cables that can be used for remote attacks and testing    |    180 |
|  3 | Wi-Fi Pineapple  | Wi-Fi hacking        | A device used to perform man-in-the-middle attacks on wireless networks |    140 |
|  4 | USB Rubber Ducky | USB attacks          | A USB keystroke injection tool disguised as a flash drive               |     80 |
|  5 | iCopy-XS         | RFID cloning         | A tool used for reading and cloning RFID cards for security testing     |    375 |
|  6 | Lan Turtle       | Network intelligence | A covert tool for remote access and network intelligence gathering      |     80 |
|  7 | Bash Bunny       | USB attacks          | A multi-function USB attack device for penetration testers              |    120 |
|  8 | Proxmark 3 RDV4  | RFID cloning         | A powerful RFID tool for reading, writing, and analyzing RFID tags      |    300 |
+----+------------------+----------------------+-------------------------------------------------------------------------+--------+
8 rows in set (0.00 sec)
```

En premier bien sûr j'ai fait `use tools_db` mais dans cette liste le seul outil qui pourrait faire un **man in the middle** c'est le suivant

**Réponse :** `Wi-Fi Pineapple`

**Using the tools_db database, what is the shared category for both USB Rubber Ducky and Bash Bunny?**

**Réponse :** `USB attacks`

### Task 6 - Clauses

Une clause est une partie d'une instruction qui spécifie les critères des données manipulées, généralement par une instruction initiale. Les clauses peuvent nous aider à définir le type de données et la manière dont elles doivent être récupérées ou triées. 

Maintenant on va travailler sur les commandes suivantes : `DISTINCT`, `GROUP BY`, `ORDER BY` et `HAVING`.

La clause `DISTINCT` est utilisée pour éviter les enregistrements en double lors d'une requête, en renvoyant uniquement des valeurs uniques.

Par exemple voici ce que ça donne quand je fais un SELECT * FROM books; et après je vais mettre le DISTINCT

```bash
mysql> SELECT * FROM books;
+----+----------------------------+----------------+--------------------------------------------------------+
| id | name                       | published_date | description                                            |
+----+----------------------------+----------------+--------------------------------------------------------+
|  1 | Android Security Internals | 2014-10-14     | An In-Depth Guide to Android's Security Architecture   |
|  2 | Bug Bounty Bootcamp        | 2021-11-16     | The Guide to Finding and Reporting Web Vulnerabilities |
|  3 | Car Hacker's Handbook      | 2016-02-25     | A Guide for the Penetration Tester                     |
|  4 | Designing Secure Software  | 2021-12-21     | A Guide for Developers                                 |
|  5 | Ethical Hacking            | 2021-11-02     | A Hands-on Introduction to Breaking In                 |
|  6 | Ethical Hacking            | 2021-11-02     |                                                        |
+----+----------------------------+----------------+--------------------------------------------------------+

6 rows in set (0.00 sec)
```

Et on peut voir que c'est vite long mais si on rajoute la clause `DISTINCT`

```bash
mysql> SELECT DISTINCT name FROM books;
+----------------------------+
| name                       |
+----------------------------+
| Android Security Internals |
| Bug Bounty Bootcamp        |
| Car Hacker's Handbook      |
| Designing Secure Software  |
| Ethical Hacking            |
+----------------------------+

5 rows in set (0.00 sec)
```

C'est beaucoup plus propre comme ça !

La clause `GROUP BY` agrège les données provenant de plusieurs enregistrements et regroupe les résultats de la requête dans des colonnes. Cela peut être utile pour les fonctions d'agrégation.

```bash
mysql> SELECT name, COUNT(*)
    FROM books
    GROUP BY name;
+----------------------------+----------+
| name                       | COUNT(*) |
+----------------------------+----------+
| Android Security Internals |        1 |
| Bug Bounty Bootcamp        |        1 |
| Car Hacker's Handbook      |        1 |
| Designing Secure Software  |        1 |
| Ethical Hacking            |        2 |
+----------------------------+----------+

5 rows in set (0.00 sec)
```

La clause `ORDER BY` peut être utilisée pour trier les enregistrements renvoyés par une requête dans un ordre croissant ou décroissant. L'utilisation de fonctions telles que `ASC` et `DESC` peut nous aider à accomplir cela, comme le montrent les deux exemples suivants.

Ordre croissant :

```bash
mysql> SELECT *
    FROM books
    ORDER BY published_date ASC;
+----+----------------------------+----------------+--------------------------------------------------------+
| id | name                       | published_date | description                                            |
+----+----------------------------+----------------+--------------------------------------------------------+
|  1 | Android Security Internals | 2014-10-14     | An In-Depth Guide to Android's Security Architecture   |
|  3 | Car Hacker's Handbook      | 2016-02-25     | A Guide for the Penetration Tester                     |
|  5 | Ethical Hacking            | 2021-11-02     | A Hands-on Introduction to Breaking In                 |
|  6 | Ethical Hacking            | 2021-11-02     |                                                        |
|  2 | Bug Bounty Bootcamp        | 2021-11-16     | The Guide to Finding and Reporting Web Vulnerabilities |
|  4 | Designing Secure Software  | 2021-12-21     | A Guide for Developers                                 |
+----+----------------------------+----------------+--------------------------------------------------------+

6 rows in set (0.00 sec)
```

Et décroissant :

```bash
mysql> SELECT *
    FROM books
    ORDER BY published_date DESC;
+----+----------------------------+----------------+--------------------------------------------------------+
| id | name                       | published_date | description                                            |
+----+----------------------------+----------------+--------------------------------------------------------+
|  4 | Designing Secure Software  | 2021-12-21     | A Guide for Developers                                 |
|  2 | Bug Bounty Bootcamp        | 2021-11-16     | The Guide to Finding and Reporting Web Vulnerabilities |
|  5 | Ethical Hacking            | 2021-11-02     | A Hands-on Introduction to Breaking In                 |
|  6 | Ethical Hacking            | 2021-11-02     |                                                        |
|  3 | Car Hacker's Handbook      | 2016-02-25     | A Guide for the Penetration Tester                     |
|  1 | Android Security Internals | 2014-10-14     | An In-Depth Guide to Android's Security Architecture   |
+----+----------------------------+----------------+--------------------------------------------------------+

6 rows in set (0.00 sec)
```

La clause `HAVING` est utilisée avec d'autres clauses pour filtrer des groupes ou des résultats d'enregistrements en fonction d'une condition. Dans le cas de `GROUP BY`, elle évalue la condition à `TRUE` ou `FALSE`, contrairement à la clause `WHERE`. `HAVING` filtre les résultats après l'agrégation.

```bash
mysql> SELECT name, COUNT(*)
    FROM books
    GROUP BY name
    HAVING name LIKE '%Hack%';
+-----------------------+----------+
| name                  | COUNT(*) |
+-----------------------+----------+
| Car Hacker's Handbook |        1 |
| Ethical Hacking       |        2 |
+-----------------------+----------+

2 rows in set (0.00 sec)
```

---

**Using the `tools_db` database, what is the total number of distinct categories in the `hacking_tools` table?**

```bash
mysql> select distinct category from hacking_tools;
+----------------------+
| category             |
+----------------------+
| Multi-tool           |
| Cable-based attacks  |
| Wi-Fi hacking        |
| USB attacks          |
| RFID cloning         |
| Network intelligence |
+----------------------+
6 rows in set (0.00 sec)
```

**Using the `tools_db` database, what is the first tool (by name) in ascending order from the `hacking_tools` table?**

```bash
mysql> select *
    -> from hacking_tools
    -> order by name asc
    -> ;
+----+------------------+----------------------+-------------------------------------------------------------------------+--------+
| id | name             | category             | description                                                             | amount |
+----+------------------+----------------------+-------------------------------------------------------------------------+--------+
|  7 | Bash Bunny       | USB attacks          | A multi-function USB attack device for penetration testers              |    120 |
|  1 | Flipper Zero     | Multi-tool           | A portable multi-tool for pentesters and geeks in a toy-like form       |    169 |
|  5 | iCopy-XS         | RFID cloning         | A tool used for reading and cloning RFID cards for security testing     |    375 |
|  6 | Lan Turtle       | Network intelligence | A covert tool for remote access and network intelligence gathering      |     80 |
|  2 | O.MG cables      | Cable-based attacks  | Malicious USB cables that can be used for remote attacks and testing    |    180 |
|  8 | Proxmark 3 RDV4  | RFID cloning         | A powerful RFID tool for reading, writing, and analyzing RFID tags      |    300 |
|  4 | USB Rubber Ducky | USB attacks          | A USB keystroke injection tool disguised as a flash drive               |     80 |
|  3 | Wi-Fi Pineapple  | Wi-Fi hacking        | A device used to perform man-in-the-middle attacks on wireless networks |    140 |
+----+------------------+----------------------+-------------------------------------------------------------------------+--------+
8 rows in set (0.00 sec)
```

**Réponse :** `Bash Bunny`

**Using the tools_db database, what is the first tool (by name) in descending order from the hacking_tools table?**

```bash
mysql> select *
    -> from hacking_tools
    -> order by name desc;
+----+------------------+----------------------+-------------------------------------------------------------------------+--------+
| id | name             | category             | description                                                             | amount |
+----+------------------+----------------------+-------------------------------------------------------------------------+--------+
|  3 | Wi-Fi Pineapple  | Wi-Fi hacking        | A device used to perform man-in-the-middle attacks on wireless networks |    140 |
|  4 | USB Rubber Ducky | USB attacks          | A USB keystroke injection tool disguised as a flash drive               |     80 |
|  8 | Proxmark 3 RDV4  | RFID cloning         | A powerful RFID tool for reading, writing, and analyzing RFID tags      |    300 |
|  2 | O.MG cables      | Cable-based attacks  | Malicious USB cables that can be used for remote attacks and testing    |    180 |
|  6 | Lan Turtle       | Network intelligence | A covert tool for remote access and network intelligence gathering      |     80 |
|  5 | iCopy-XS         | RFID cloning         | A tool used for reading and cloning RFID cards for security testing     |    375 |
|  1 | Flipper Zero     | Multi-tool           | A portable multi-tool for pentesters and geeks in a toy-like form       |    169 |
|  7 | Bash Bunny       | USB attacks          | A multi-function USB attack device for penetration testers              |    120 |
+----+------------------+----------------------+-------------------------------------------------------------------------+--------+
8 rows in set (0.00 sec)
```

**Réponse :** `Wi-Fi Pineapple`

### Task 7 - Operators

Nous avons déjà vu les opérateurs logiques, comme `TRUE` ou `FALSE` mais on va aller plus loin que ça.

L'opérateur `LIKE` est couramment utilisé en conjonction avec des clauses telles que `WHERE` afin de filtrer des modèles spécifiques dans une colonne. Continuons à utiliser notre base de données pour interroger un exemple de son utilisation.

```bash
mysql> SELECT *
    FROM books
    WHERE description LIKE "%guide%";
+----+----------------------------+----------------+--------------------------------------------------------+--------------------+
| id | name                       | published_date | description                                            | category           |
+----+----------------------------+----------------+--------------------------------------------------------+--------------------+
|  1 | Android Security Internals | 2014-10-14     | An In-Depth Guide to Android's Security Architecture   | Defensive Security |
|  2 | Bug Bounty Bootcamp        | 2021-11-16     | The Guide to Finding and Reporting Web Vulnerabilities | Offensive Security |
|  3 | Car Hacker's Handbook      | 2016-02-25     | A Guide for the Penetration Tester                     | Offensive Security |
|  4 | Designing Secure Software  | 2021-12-21     | A Guide for Developers                                 | Defensive Security |
+----+----------------------------+----------------+--------------------------------------------------------+--------------------+

4 rows in set (0.00 sec)
```

L'opérateur `AND` utilise plusieurs conditions dans une requête et renvoie `TRUE` si toutes ces conditions sont vraies.

```bash
mysql> SELECT *
    FROM books
    WHERE category = "Offensive Security" AND name = "Bug Bounty Bootcamp"; 
+----+---------------------+----------------+--------------------------------------------------------+--------------------+
| id | name                | published_date | description                                            | category           |
+----+---------------------+----------------+--------------------------------------------------------+--------------------+
|  2 | Bug Bounty Bootcamp | 2021-11-16     | The Guide to Finding and Reporting Web Vulnerabilities | Offensive Security |
+----+---------------------+----------------+--------------------------------------------------------+--------------------+
    
1 row in set (0.00 sec)  
```

L'opérateur `OR` combine plusieurs conditions dans les requêtes et renvoie `TRUE` si au moins une de ces conditions est vraie.

```bash
mysql> SELECT *
    FROM books
    WHERE name LIKE "%Android%" OR name LIKE "%iOS%"; 
+----+----------------------------+----------------+------------------------------------------------------+--------------------+
| id | name                       | published_date | description                                          | category           |
+----+----------------------------+----------------+------------------------------------------------------+--------------------+
|  1 | Android Security Internals | 2014-10-14     | An In-Depth Guide to Android's Security Architecture | Defensive Security |
+----+----------------------------+----------------+------------------------------------------------------+--------------------+

1 row in set (0.00 sec)
```

L'opérateur `NOT` inverse la valeur d'un opérateur booléen, ce qui nous permet d'exclure une condition spécifique.

```bash
mysql> SELECT *
    FROM books
    WHERE NOT description LIKE "%guide%";
+----+-----------------+----------------+----------------------------------------+--------------------+
| id | name            | published_date | description                            | category           |
+----+-----------------+----------------+----------------------------------------+--------------------+
|  5 | Ethical Hacking | 2021-11-02     | A Hands-on Introduction to Breaking In | Offensive Security |
+----+-----------------+----------------+----------------------------------------+--------------------+

1 row in set (0.00 sec)
```

L'opérateur `BETWEEN` nous permet de vérifier si une valeur existe dans une plage définie.

```bash
mysql> SELECT *
    FROM books
    WHERE id BETWEEN 2 AND 4;
+----+---------------------------+----------------+--------------------------------------------------------+--------------------+
| id | name                      | published_date | description                                            | category           |
+----+---------------------------+----------------+--------------------------------------------------------+--------------------+
|  2 | Bug Bounty Bootcamp       | 2021-11-16     | The Guide to Finding and Reporting Web Vulnerabilities | Offensive Security |
|  3 | Car Hacker's Handbook     | 2016-02-25     | A Guide for the Penetration Tester                     | Offensive Security |
|  4 | Designing Secure Software | 2021-12-21     | A Guide for Developers                                 | Defensive Security |
+----+---------------------------+----------------+--------------------------------------------------------+--------------------+

3 rows in set (0.00 sec)
```

La requête ci-dessus renvoie les livres dont l'identifiant est compris entre 2 et 4.

L'opérateur `=` (égal) compare deux expressions et détermine si elles sont égales, ou il peut vérifier si une valeur correspond à une autre dans une colonne spécifique.

```bash
mysql> SELECT *
    FROM books
    WHERE name = "Designing Secure Software";
+----+---------------------------+----------------+------------------------+--------------------+
| id | name                      | published_date | description            | category           |
+----+---------------------------+----------------+------------------------+--------------------+
|  4 | Designing Secure Software | 2021-12-21     | A Guide for Developers | Defensive Security |
+----+---------------------------+----------------+------------------------+--------------------+

1 row in set (0.10 sec)
```

L'opérateur `!=` (différent de) compare des expressions et vérifie si elles sont différentes ; il vérifie également si une valeur diffère de celle contenue dans une colonne.

```bash
mysql> SELECT *
    FROM books
    WHERE category != "Offensive Security";
+----+----------------------------+----------------+------------------------------------------------------+--------------------+
| id | name                       | published_date | description                                          | category           |
+----+----------------------------+----------------+------------------------------------------------------+--------------------+
|  1 | Android Security Internals | 2014-10-14     | An In-Depth Guide to Android's Security Architecture | Defensive Security |
|  4 | Designing Secure Software  | 2021-12-21     | A Guide for Developers                               | Defensive Security |
+----+----------------------------+----------------+------------------------------------------------------+--------------------+

2 rows in set (0.00 sec)
```

L'opérateur `<` (inférieur à) compare si l'expression avec une valeur donnée est inférieure à celle fournie.

```bash
mysql> SELECT *
    FROM books
    WHERE published_date < "2020-01-01";
+----+----------------------------+----------------+------------------------------------------------------+--------------------+
| id | name                       | published_date | description                                          | category           |
+----+----------------------------+----------------+------------------------------------------------------+--------------------+
|  1 | Android Security Internals | 2014-10-14     | An In-Depth Guide to Android's Security Architecture | Defensive Security |
|  3 | Car Hacker's Handbook      | 2016-02-25     | A Guide for the Penetration Tester                   | Offensive Security |
+----+----------------------------+----------------+------------------------------------------------------+--------------------+

2 rows in set (0.00 sec)
```

L'opérateur `>` (supérieur à) compare si l'expression avec une valeur donnée est supérieure à celle fournie.

```bash
mysql> SELECT *
    FROM books
    WHERE published_date > "2020-01-01";
+----+---------------------------+----------------+--------------------------------------------------------+--------------------+
| id | name                      | published_date | description                                            | category           |
+----+---------------------------+----------------+--------------------------------------------------------+--------------------+
|  2 | Bug Bounty Bootcamp       | 2021-11-16     | The Guide to Finding and Reporting Web Vulnerabilities | Offensive Security |
|  4 | Designing Secure Software | 2021-12-21     | A Guide for Developers                                 | Defensive Security |
|  5 | Ethical Hacking           | 2021-11-02     | A Hands-on Introduction to Breaking In                 | Offensive Security |
+----+---------------------------+----------------+--------------------------------------------------------+--------------------+

3 rows in set (0.00 sec)
```

L'opérateur `<=` (inférieur ou égal) compare si l'expression avec une valeur donnée est inférieure ou égale à celle fournie. D'autre part, l'opérateur `>=` (supérieur ou égal) compare si l'expression avec une valeur donnée est supérieure ou égale à celle fournie. Observons quelques exemples des deux ci-dessous.

```bash
mysql> SELECT *
    FROM books
    WHERE published_date <= "2021-11-15";
+----+----------------------------+----------------+------------------------------------------------------+--------------------+
| id | name                       | published_date | description                                          | category           |
+----+----------------------------+----------------+------------------------------------------------------+--------------------+
|  1 | Android Security Internals | 2014-10-14     | An In-Depth Guide to Android's Security Architecture | Defensive Security |
|  3 | Car Hacker's Handbook      | 2016-02-25     | A Guide for the Penetration Tester                   | Offensive Security |
|  5 | Ethical Hacking            | 2021-11-02     | A Hands-on Introduction to Breaking In               | Offensive Security |
+----+----------------------------+----------------+------------------------------------------------------+--------------------+

3 rows in set (0.00 sec)
```

La requête ci-dessus renvoie les livres publiés au plus tard le 15 novembre 2021.

```bash
mysql> SELECT *
    FROM books
    WHERE published_date >= "2021-11-02";
+----+---------------------------+----------------+--------------------------------------------------------+--------------------+
| id | name                      | published_date | description                                            | category           |
+----+---------------------------+----------------+--------------------------------------------------------+--------------------+
|  2 | Bug Bounty Bootcamp       | 2021-11-16     | The Guide to Finding and Reporting Web Vulnerabilities | Offensive Security |
|  4 | Designing Secure Software | 2021-12-21     | A Guide for Developers                                 | Defensive Security |
|  5 | Ethical Hacking           | 2021-11-02     | A Hands-on Introduction to Breaking In                 | Offensive Security |
+----+---------------------------+----------------+--------------------------------------------------------+--------------------+

3 rows in set (0.00 sec)
```

---

**Using the tools_db database, which tool falls under the Multi-tool category and is useful for pentesters and geeks?**

```bash
mysql> SELECT * FROM hacking_tools WHERE category = 'Multi-tool' AND description LIKE '%pentester%' OR description LIKE '%geek%';
+----+--------------+------------+-------------------------------------------------------------------+--------+
| id | name         | category   | description                                                       | amount |
+----+--------------+------------+-------------------------------------------------------------------+--------+
|  1 | Flipper Zero | Multi-tool | A portable multi-tool for pentesters and geeks in a toy-like form |    169 |
+----+--------------+------------+-------------------------------------------------------------------+--------+
1 row in set (0.00 sec)
```

**Réponse :** `Flipper Zero`

**Using the tools_db database, what is the category of tools with an amount greater than or equal to 300?**

```bash
mysql> select * from hacking_tools where amount >= 300;
+----+-----------------+--------------+---------------------------------------------------------------------+--------+
| id | name            | category     | description                                                         | amount |
+----+-----------------+--------------+---------------------------------------------------------------------+--------+
|  5 | iCopy-XS        | RFID cloning | A tool used for reading and cloning RFID cards for security testing |    375 |
|  8 | Proxmark 3 RDV4 | RFID cloning | A powerful RFID tool for reading, writing, and analyzing RFID tags  |    300 |
+----+-----------------+--------------+---------------------------------------------------------------------+--------+
2 rows in set (0.00 sec)
```

**Using the tools_db database, which tool falls under the Network intelligence category with an amount less than 100?**

```bash
mysql> select * from hacking_tools where amount < 100
    -> ;
+----+------------------+----------------------+--------------------------------------------------------------------+--------+
| id | name             | category             | description                                                        | amount |
+----+------------------+----------------------+--------------------------------------------------------------------+--------+
|  4 | USB Rubber Ducky | USB attacks          | A USB keystroke injection tool disguised as a flash drive          |     80 |
|  6 | Lan Turtle       | Network intelligence | A covert tool for remote access and network intelligence gathering |     80 |
+----+------------------+----------------------+--------------------------------------------------------------------+--------+
2 rows in set (0.00 sec)
```

### Task 8 - Functions

Fonction `CONCAT()`

Cette fonction permet d'ajouter deux chaînes de caractères ou plus. Elle est utile pour combiner du texte provenant de différentes colonnes.

```bash
mysql> SELECT CONCAT(name, " is a type of ", category, " book.") AS book_info FROM books;
+------------------------------------------------------------------+
| book_info                                                         |
+------------------------------------------------------------------+
| Android Security Internals is a type of Defensive Security book. |
| Bug Bounty Bootcamp is a type of Offensive Security book.        |
| Car Hacker's Handbook is a type of Offensive Security book.      |
| Designing Secure Software is a type of Defensive Security book.  |
| Ethical Hacking is a type of Offensive Security book.            |
+------------------------------------------------------------------+

5 rows in set (0.00 sec) 
```

Fonction `GROUP_CONCAT()`

Cette fonction permet de concaténer les données de plusieurs lignes dans un seul champ. Voyons un exemple d'utilisation.

```bash
mysql> SELECT category, GROUP_CONCAT(name SEPARATOR ", ") AS books
    FROM books
    GROUP BY category;
+--------------------+-------------------------------------------------------------+
| category           | books                                                       |
+--------------------+-------------------------------------------------------------+
| Defensive Security | Android Security Internals, Designing Secure Software       |
| Offensive Security | Bug Bounty Bootcamp, Car Hacker's Handbook, Ethical Hacking |
+--------------------+-------------------------------------------------------------+

2 rows in set (0.01 sec)
```

Fonction `SUBSTRING()`

Cette fonction permet d'extraire une sous-chaîne d'une chaîne dans une requête, à partir d'une position déterminée. La longueur de cette sous-chaîne peut également être spécifiée.

```bash
mysql> SELECT SUBSTRING(published_date, 1, 4) AS published_year FROM books;
+----------------+
| published_year |
+----------------+
| 2014           |
| 2021           |
| 2016           |
| 2021           |
| 2021           |
+----------------+

5 rows in set (0.00 sec)  
```

Fonction `LENGTH()`

Cette fonction renvoie le nombre de caractères dans une chaîne. Cela inclut les espaces et les signes de ponctuation. Vous trouverez un exemple ci-dessous.

```bash
mysql> SELECT LENGTH(name) AS name_length FROM books;
+-------------+
| name_length |
+-------------+
|          26 |
|          19 |
|          21 |
|          25 |
|          15 |
+-------------+

5 rows in set (0.00 sec)
```

Fonction `COUNT()`

Cette fonction renvoie le nombre d'enregistrements dans une expression, comme le montre l'exemple ci-dessous.

```bash
mysql> SELECT COUNT(*) AS total_books FROM books;
+-------------+
| total_books |
+-------------+
|           5 |
+-------------+

1 row in set (0.01 sec)
```

Fonction `SUM()`

Cette fonction additionne toutes les valeurs (non NULL) d'une colonne déterminée.

> Il n'est pas nécessaire d'exécuter cette requête. Elle est fournie à titre d'exemple uniquement.
{: .prompt-info}

```bash
mysql> SELECT SUM(price) AS total_price FROM books;
+-------------+
| total_price |
+-------------+
|      249.95 |
+-------------+

1 row in set (0.00 sec)
```

Fonction `MAX()`

Cette fonction calcule la valeur maximale dans une colonne fournie dans une expression.

```bash
mysql> SELECT MAX(published_date) AS latest_book FROM books;
+-------------+
| latest_book |
+-------------+
| 2021-12-21  |
+-------------+

1 row in set (0.00 sec)
```

Fonction `MIN()`

Cette fonction calcule la valeur minimale dans une colonne fournie dans une expression.

```bash
mysql> SELECT MIN(published_date) AS earliest_book FROM books;
+---------------+
| earliest_book |
+---------------+
| 2014-10-14    |
+---------------+

1 row in set (0.00 sec)
```

---

**Using the tools_db database, what is the tool with the longest name based on character length?**

```bash
mysql> select name from hacking_tools order by length(name) desc limit 1;
+------------------+
| name             |
+------------------+
| USB Rubber Ducky |
+------------------+
1 row in set (0.00 sec)
```

**Réponse :** `USB Rubber Ducky`

**Using the tools_db database, what is the total sum of all tools?**

```bash
mysql> select sum(amount) as total_sum from hacking_tools;
+-----------+
| total_sum |
+-----------+
|      1444 |
+-----------+
1 row in set (0.00 sec)
```

**Réponse :** `1444`

**Using the tools_db database, what are the tool names where the amount does not end in 0, and group the tool names concatenated by " & ".**

```bash
mysql> select GROUP_CONCAT(name separator ' & ') as tools from hacking_tools where amount % 10 != 0;
+-------------------------+
| tools                   |
+-------------------------+
| Flipper Zero & iCopy-XS |
+-------------------------+
1 row in set (0.00 sec)
```

**Réponse :** `Flipper Zero & iCopy-XS`

### Task 9 - Conclusion

On a appris a manier les bases de données et comment fonctionnait mysql

**Room Complétée**

{% include comments.html %}