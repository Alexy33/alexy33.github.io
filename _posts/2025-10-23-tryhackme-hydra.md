---
title: "TryHackMe - Hydra"
date: 2025-10-23 00:37:00 +0200
categories: [TryHackMe, Learning]
tags: [brute-force, hydra, cracking]
description: "Write-up de la room Hydra qui nous apprendra à manier cet outil de brute force de mots de passe"
image:
  path: /assets/img/posts/tryhackme-hydra.png
  alt: "Hydra"
---

## Informations sur la room

Découvrez et utilisez Hydra, un pirate de connexion réseau rapide, pour forcer brutalement et obtenir les informations d'identification d'un site Web.

**Lien :** [Hydra](https://tryhackme.com/room/hydra)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Utilisation de l'outil Hydra pour les attaques par force brute

---

## Solutions des tâches

### Task 1 - Hydra Introduction

Hydra est un programme de **piratage de mot de passe en ligne** par force brute, un outil de craquage rapide de mots de passe pour les systèmes de connexion.

Hydra peut parcourir une liste de mots de passe et **forcer brutalement** certains services d'authentification. Imaginez devoir essayer manuellement de deviner le mot de passe de quelqu'un sur un service particulier (SSH, formulaire web, FTP ou SNMP). Nous pouvons utiliser Hydra pour **parcourir automatiquement une liste de mots de passe** et accélérer considérablement ce processus, en déterminant le mot de passe correct.

Selon son [référentiel officiel](https://github.com/vanhauser-thc/thc-hydra), Hydra prend en charge, c'est-à-dire a la capacité de forcer brutalement les protocoles suivants :

Asterisk, AFP, Cisco AAA, Cisco auth, Cisco activate, CVS, Firebird, FTP, HTTP-FORM-GET, HTTP-FORM-POST, HTTP-GET, HTTP-HEAD, HTTP-POST, HTTP-PROXY, HTTPS-FORM-GET, HTTPS-FORM-POST, HTTPS-GET, HTTPS-HEAD, HTTPS-POST, Proxy HTTP, ICQ, IMAP, IRC, LDAP, MEMCACHED, MONGODB, MS-SQL, MYSQL, NCP, NNTP, Oracle Listener, Oracle SID, Oracle, PC-Anywhere, PCNFS, POP3, POSTGRES, Radmin, RDP, Rexec, Rlogin, Rsh, RTSP, SAP/R3, SIP, SMB, SMTP, SMTP Enum, SNMP v1+v2+v3, SOCKS5, SSH (v1 et v2), SSHKEY, Subversion, TeamSpeak (TS2), Telnet, VMware-Auth, VNC et XMPP.

Cela montre l'importance d'utiliser un mot de passe fort. Si votre mot de passe est commun, ne contient pas de caractères spéciaux et ne dépasse pas huit caractères, il sera facilement deviné. Des listes de mots de passe contenant des centaines de millions d'entrées existent et contiennent les mots de passe les plus courants. Ainsi, lorsqu'une application utilise un mot de passe simple par défaut pour se connecter, il est crucial de le modifier ! Les caméras de vidéosurveillance et les frameworks Web utilisent souvent `admin:password` comme identifiants de connexion par défaut, ce qui n'est évidemment pas assez fort.

### Task 2 - Using Hydra

**Les commandes principales d'Hydra**

Les options que nous transmettons à Hydra dépendent du service (protocole) que nous attaquons. Par exemple, si nous voulions forcer brutalement **FTP** avec le nom d'utilisateur `user` et une liste de mots de passe `passlist.txt`, nous utiliserions la commande suivante :

```bash
hydra -l user -P passlist.txt ftp://10.10.170.146
```

#### SSH

Pour attaquer un service SSH, voici la syntaxe de base :

```bash
hydra -l <username> -P <full path to pass> 10.10.170.146 -t 4 ssh
```

**Explication des options :**

- `-l` spécifie le nom d'utilisateur pour la connexion SSH
- `-P` indique le chemin vers la liste de mots de passe
- `-t` définit le nombre de threads à générer (connexions parallèles)

Voici un exemple complet :

```bash
hydra -l root -P passwords.txt 10.10.170.146 -t 4 ssh
```

Dans cet exemple :
- Hydra utilisera `root` comme nom d'utilisateur pour SSH
- Il essaiera les mots de passe dans le fichier `passwords.txt`
- Il y aura quatre threads exécutés en parallèle comme indiqué par `-t 4`

#### Formulaire Web POST

Nous pouvons également utiliser Hydra pour **forcer brutalement** les formulaires Web. Vous devez savoir quel type de requête il effectue : les méthodes GET ou POST sont couramment utilisées. Vous pouvez utiliser l'onglet réseau de votre navigateur (dans les outils de développement) pour voir les types de requêtes ou consulter le code source.

Voici comment utiliser Hydra pour le web :

```bash
sudo hydra <username> <wordlist> 10.10.170.146 http-post-form "<path>:<login_credentials>:<invalid_response>"
```

**Explication des paramètres :**

- `-l` le nom d'utilisateur pour la page web
- `-P` la liste de mots de passe
- `http-post-form` indique que le type du formulaire est **POST**
- `<path>` l'URL de login, par exemple `login.php`
- `<login_credentials>` le format des paramètres de connexion, par exemple `username=^USER^&password=^PASS^`
- `<invalid_response>` une partie de la réponse lorsque la connexion échoue
- `-V` active la sortie détaillée pour chaque tentative

Voici un exemple plus concret de commande Hydra pour forcer brutalement un formulaire de connexion POST :

```bash
hydra -l <username> -P <wordlist> 10.10.170.146 http-post-form "/:username=^USER^&password=^PASS^:F=incorrect" -V
```

**Détail de la commande :**

- La page de connexion est uniquement `/`, c'est-à-dire l'adresse IP principale
- Le `username` est le nom du champ du formulaire dans lequel le nom d'utilisateur est saisi
- Le ou les noms d'utilisateur spécifiés remplaceront `^USER^`
- Le `password` est le nom du champ du formulaire dans lequel le mot de passe est saisi
- Les mots de passe fournis remplaceront `^PASS^`
- Enfin, `F=incorrect` est une chaîne qui apparaît dans la réponse du serveur lorsque la connexion échoue

---

**Use Hydra to bruteforce molly's web password. What is flag 1?**

Voici la commande Hydra que j'ai adaptée pour cette machine :

```bash
hydra -l molly -P /usr/share/wordlists/rockyou.txt 10.10.170.146 http-post-form "/login:username=^USER^&password=^PASS^:F=incorrect" -V
```

J'ai mis `/login` car le formulaire de connexion se trouve à cette adresse.

La commande nous révèle que le mot de passe de molly est : `sunshine`

Ensuite, on se connecte sur le site web avec ces identifiants pour récupérer le flag.

**Réponse :** `THM{2673a7dd116de68e85c48ec0b1f2612e}`

**Use Hydra to bruteforce molly's SSH password. What is flag 2?**

On fait la même chose mais avec la méthode **SSH** :

```bash
hydra -l molly -P /usr/share/wordlists/rockyou.txt 10.10.170.146 -t 4 ssh
```

Le mot de passe trouvé est : `butterfly`

Ensuite on se connecte en SSH avec ces identifiants et on lit le contenu du fichier `flag.txt` :

```bash
ssh molly@10.10.170.146
cat flag.txt
```

**Réponse :** `THM{c8eeb0468febbadea859baeb33b2541b}`

**Room Complétée**

{% include comments.html %}