---
title: "TryHackMe - John the reaper - Basics"
date: 2025-10-14 14:30:00 +0100
categories: [TryHackMe, Learning]
tags: [john-the-ripper, cracking, passwords, hash, bruteforce]
description: "Write-up de la room de John the reaper Basics - compréhension et utilisation de l'outil john"
image:
  path: /assets/img/posts/tryhackme-john.png
  alt: "TryHackMe John The Reaper Basics Room"
---

## 📋 Room Info

Room facile sur les bases du crackage / bruteforce.

**Lien :** [John The Reaper](https://tryhackme.com/room/johntheripperbasics)

## 🔑 L'essentiel

Ce que je vais apprendre :
- Cracking Windows authentication hashes
- Crack **/etc/shadow** hashes
- Cracking password-protected Zip files
- Cracking password-protected RAR files
- Cracking SSH keys

---

## 🎯 Solutions des Tasks

### Task 1 - Introduction

Se connecter avec openvpn ou avec la box fournie

### Task 2 - Basic Terms

**What is the most popular extended version of John the Ripper?**

Juste avant il était écris que la version la plus utilisé de john était la version jumbo john.

**Réponse :** `Jumbo john`

### Task 3 - Setting Up Your System

**Which website’s breach was the rockyou.txt wordlist created from?**

J'ai cherché un peu sur le web et j'ai trouvé rockyou.com simplement.

**Réponse :** `rockyou.com`

### Task 4 - Cracking Basic Hashes

```bash
john [options] [file path]
```
ça c'est l'utilisation de john et nous pouvons aussi remplacer les options par ceci :

```bash
john --wordlist=[path to wordlist] [path to file]
```
Le `--wordlist=` c'est pour spécifier une list de mots que va tester john sur le fichier qu'on spécifie après dans **[file to path]**

Donc ça peut donner des choses dans ce genre d'utilisation : 
```bash
john --wordlist=/usr/share/wordlists/rockyou.txt hash_to_crack.txt
```

Parfois John peut avoir du mal a détecter les type de hash utilisé et c'est pour ça qu'on peut encore et toujours utiliser le site [Hash.com](https://hashes.com/en/tools/hash_identifier) pour nous faciliter la tâche

Mais on peut aussi utiliser un outil nommé [hash-id](https://gitlab.com/kalilinux/packages/hash-identifier/-/tree/kali/master) 

On peut récupérer ce fichier python simplement en utilisant **curl** ou **wget**

```bash
wget https://gitlab.com/kalilinux/packages/hash-identifier/-/tree/kali/master/hash-id.py
```
et le lancer comme un autre script avec `./` avant le nom du fichier

Mais on peut aussi dire a john la chose suivante pour qu'il soit encore plus rapide, car oui une attaque par bruteforce c'est jamais bien rapide :

```bash
john --format=[format] --wordlist=[path to wordlist] [path to file]
```
Et ça ça nous permet de spécifier le type de hash a l'avance si on le connait ce qui rendra la commande bien plus rapide.

```bash
john --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt hash_to_crack.txt
```

---

**What type of hash is hash1.txt?**

Voici le premier hash : 2e728dd31fb5949bc39cac5a9f066498

J'ai copier coller celui ci dans le site de [Hash.com](https://hashes.com/en/tools/hash_identifier) et ça m'a dit tout ça :

```
2e728dd31fb5949bc39cac5a9f066498 - Possible algorithms: MD5, SHA1.Substr(0, 32), MD4, NTLM, md5(md5($plaintext)), md5(md5($plaintext).:.$plaintext), md5(md5(md5($plaintext))), md5(md5(md5(md5($plaintext)))), md5(md5(md5(md5(md5($plaintext))))), md5($salt.md5($plaintext.$salt)), md5(strtoupper(md5($plaintext))), md5(sha1($plaintext)), md5(sha1(sha1($plaintext))), md5(sha256($plaintext)), Radmin2, md5(sha1($plaintext).md5($plaintext).sha1($plaintext)) , md5(md5($plaintext).substr(8,16)), Filezilla Server.xml
```
Donc je pense que c'est bien du md5 vu que c'est écris partout.

**Réponse :** `md5`

**What is the cracked value of hash1.txt?**

Maintenant qu'on connait le type de hash je me dis qu'on peut mettre le **--format=raw-...** ce qui nous donne :

```bash
user@ip-10-10-39-185:~/John-the-Ripper-The-Basics$ john --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt Task04/hash1.txt 
Using default input encoding: UTF-8
Loaded 1 password hash (Raw-MD5 [MD5 256/256 AVX2 8x3])
Warning: no OpenMP support for this hash type, consider --fork=2
Note: Passwords longer than 18 [worst case UTF-8] to 55 [ASCII] rejected
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status
biscuit          (?)     
1g 0:00:00:00 DONE (2025-10-14 10:54) 50.00g/s 134400p/s 134400c/s 134400C/s skyblue..nugget
Use the "--show --format=Raw-MD5" options to display all of the cracked passwords reliably
Session completed. 
```
Et comme nous pouvons le voir john a trouvé directement le mot de passe qui est le suivant : `biscuit`

**Réponse :** `biscuit`

**What type of hash is hash2.txt?**

Le hash est le suivant : 1A732667F3917C0F4AA98BB13011B9090C6F8065

Et de même si on le passe dans le site ça nous dis que c'est du ***SHA1***

**Réponse :** `SHA1`

**What is the cracked value of hash2.txt?**

On connait le type du hash donc de même nous allons faire la même commande mais en changant le **--format=raw-...**

> Si je met après le format le **raw-** c'est pour spécifier a john que il peut chercher dans toute les version de SHA1 ou autre celon ce qu'on met après {. :prompt-tip}

```bash
~/John-the-Ripper-The-Basics/Task04$ john --format=raw-SHA1 --wordlist=/usr/share/wordlists
/rockyou.txt hash2.txt 
Using default input encoding: UTF-8
Loaded 1 password hash (Raw-SHA1 [SHA1 256/256 AVX2 8x])
Warning: no OpenMP support for this hash type, consider --fork=2
Note: Passwords longer than 18 [worst case UTF-8] to 55 [ASCII] rejected
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status
kangeroo         (?)     
1g 0:00:00:00 DONE (2025-10-14 11:02) 33.33g/s 3904Kp/s 3904Kc/s 3904KC/s karakara..kalinda
Use the "--show --format=Raw-SHA1" options to display all of the cracked passwords reliably
Session completed. 
```

Et si on regarde bien on y voit le mot de passe !

**Réponse :** `kangeroo`

**What type of hash is hash3.txt?**

Voici le hash : D7F4D3CCEE7ACD3DD7FAD3AC2BE2AAE9C44F4E9B7FB802D73136D4C53920140A

**Réponse :** `SHA256`

**What is the cracked value of hash3.txt?**

On fait la même chose que les deux dernière fois, plus besoin de vous montrer.

**Réponse :** `microphone`

**What type of hash is hash4.txt?**

Voici le hash : c5a60cc6bbba781c601c5402755ae1044bbf45b78d1183cbf2ca1c865b6c792cf3c6b87791344986c8a832a0f9ca8d0b4afd3d9421a149d57075e1b4e93f90bf

Et sur le site ça dit que c'est du **Whirlpool**

**Réponse :** `Whirlpool`

**What is the cracked value of hash4.txt?**

Mais là pour le **format=raw-whirlpool** ou **format=raw-WHIRLPOOL** ça ne marchait pas donc j'ai cherché et enfaite il fallait juste pas mettre le **raw-** car il n'y a pas plusieurs type de whirlpool

**Réponse :** `colossal`

### Task 5 - Cracking Windows Authentication Hashes

**What do we need to set the --format flag to in order to crack this hash?**

Alors en premier j'ai regardé le type du hash utilisé est le suivant **NTLM** puis j'ai regardé le flag en question sur des doc sur john the reaper sur ce site [PentestMonkey.net](https://pentestmonkey.net/cheat-sheet/john-the-ripper-hash-formats) et j'ai trouvé que c'était nt

**Réponse :** `nt`

**What is the cracked value of this password?**

J'ai donc changé tout les paramêtres dont on avait besoin pour cette question et voilà :

```bash
~/John-the-Ripper-The-Basics/Task05$ john --format=nt --wordlist=/usr/share/wordlists/rockyou.txt ntlm.txt     
Using default input encoding: UTF-8
Loaded 1 password hash (NT [MD4 256/256 AVX2 8x3])
Warning: no OpenMP support for this hash type, consider --fork=2
Note: Passwords longer than 27 rejected
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status
mushroom         (?)     
1g 0:00:00:00 DONE (2025-10-14 11:29) 50.00g/s 153600p/s 153600c/s 153600C/s skater1..dangerous
Use the "--show --format=NT" options to display all of the cracked passwords reliably
Session completed. 
```

**Réponse :** `mushroom`

### Task 6 - Cracking /etc/shadow Hashes

> **/etc/shadow** est un fichier Linux qui stocke les mots de passe chiffrés des utilisateurs ainsi que les informations de politique de mots de passe (expiration, etc.), accessible uniquement par root pour des raisons de sécurité. {. :prompt-tip}

Mais pour décrypter des données dans **/etc/shadow** nous ne pouvons pas passer directement par John, en premier nous devons utiliser la commande suivante :

```bash
unshadow PASSWORD-FILE SHADOW-FILE
```
Et après on aura des hash utilisable par John mais si on veut les stocker les hash dans un autre fichier pour pouvoir les utiliser après avec John on peut utiliser les **redirections** qui permettent de rediriger tout le résultat de la commande dans un fichier comme ceci :

```bash
unshadow local_passwd local_shadow > unshadowed.txt
```

Une fois que la commande **unshadow** a fait son travail on aura plus qu'a spécifier le format pour John qui est du **sha512crypt** car le /etc/shadow est toujours crypter en sha512crypt

```bash
~/John-the-Ripper-The-Basics/Task06$ unshadow local_passwd local_shadow > unshadowed.txt
```

J'ai d'abors mis le résultat de la commande de unshadow dans **unshadow.txt**

```bash
~/John-the-Ripper-The-Basics/Task06$ john --format=sha512crypt --wordlist=/usr/share/wordlists/rockyou.txt unshadowed.txt 
Using default input encoding: UTF-8
Loaded 1 password hash (sha512crypt, crypt(3) $6$ [SHA512 256/256 AVX2 4x])
Cost 1 (iteration count) is 5000 for all loaded hashes
Will run 2 OpenMP threads
Note: Passwords longer than 26 [worst case UTF-8] to 79 [ASCII] rejected
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status
1234             (root)     
1g 0:00:00:02 DONE (2025-10-14 11:42) 0.4274g/s 547.0p/s 547.0c/s 547.0C/s kucing..poohbear1
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```

Puis j'ai décrypter le mot de passe qui est donc `1234`

**Réponse :** `1234`

### Task 7 - Single Crack Mode

Depuis tout à l'heure nous avons testé un seul mode de John mais il y en a un autre : le mode **Single Crack** 

Ce mode permet de faire du Word Mangling :

La meilleure façon d'expliquer le mode Single Crack et le mangling des mots est de prendre un exemple :

Prenons le nom d'utilisateur « Markus ».
Voici quelques mots de passe possibles :

    Markus1, Markus2, Markus3 (etc.)
    MArkus, MARkus, MARKus (etc.)
    Markus!, Markus$, Markus* (etc.)

Pour pouvoir utiliser ce mode voici le flag a rajouter a John :

```bash
john --single --format=[format] [path to file]
```

**What is Joker’s password?**

Déjà nous avons un indice qui est le nom de l'utilisateur : **Jocker** donc on va essayer avec le single mode pour voir

Mais d'abors passons le hash donné dans le site pour voir quel hash a été utilisé. Et en effet c'est du **md5** donc on fait la commande suivante :

```bash
~/John-the-Ripper-The-Basics/Task07$ john --format=raw-md5 hash07.t
xt 
Using default input encoding: UTF-8
Loaded 1 password hash (Raw-MD5 [MD5 256/256 AVX2 8x3])
Warning: no OpenMP support for this hash type, consider --fork=2
Note: Passwords longer than 18 [worst case UTF-8] to 55 [ASCII] rejected
Proceeding with single, rules:Single
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status
Almost done: Processing the remaining buffered candidate passwords, if any.
Proceeding with wordlist:/home/user/src/john/run/password.lst
Enabling duplicate candidate password suppressor
Jok3r            (?)     
1g 0:00:00:01 DONE 2/3 (2025-10-14 11:58) 0.5650g/s 2635Kp/s 2635Kc/s 2635KC/s Aiocaralho..Topshape
Use the "--show --format=Raw-MD5" options to display all of the cracked passwords reliably
Session completed. 
```
Bizarrement quand je mettais le **--single** ça ne fonctionnait pas du coup je l'ai enlevé et ça a marché.

**Réponse :** `Jok3r`

### Task 8 - Custom Rules

Maintenant nous apprenons que nous pouvons rajouter des rêgles pour john dans le fichier **john.conf** et nous avons toute les spécificitées ici [Openwall](https://www.openwall.com/john/doc/RULES.shtml)

Et on peut le faire avec un exemple de commande suivant :

```bash
john --wordlist=[path to wordlist] --rule=PoloPassword [path to file]
```

**What do custom rules allow us to exploit?**

**Réponse :** `Password complexity predictability`

**What rule would we use to add all capital letters to the end of the word?**

Alors pour ajouter des lettres à la fin du mot déjà c'est `Az` qu'il faut mettre, ensuite pour spécifier des lettre capitales il faut rajouter `[A-Z]` pour dire que c'est des lettre de A à Z qui sont en majuscule. 

**Réponse :** `Az"[A-Z]"`

**What flag would we use to call a custom rule called THMRules?**

C'est simple c'est le flag qui permet de créer des nouvelles rêgles avec john qui est donc : `--rule=` et on a plus qu'a rajouter le nom qui est dit donc **THMRules**

**Réponse :** `THMRules`

### Task 9 - Cracking Password Protected Zip Files

Tout comme l'outil **unshadow** il existe un autre outil appellé **zip2john** et il s'utilise de cette façon : 

```bash
zip2john zipfile.zip > zip_hash.txt
```

**What is the password for the secure.zip file?**

Je procède donc au décryptage en suivant la manière de faire donnée :

```bash
~/John-the-Ripper-The-Basics/Task09$ zip2john secure.zip > zip_hash.txt
ver 1.0 efh 5455 efh 7875 secure.zip/zippy/flag.txt PKZIP Encr: 2b chk, TS_chk, cmplen=38, decmplen=26, crc=849AB5A6 ts=B689 cs=b689 type=0

~/John-the-Ripper-The-Basics/Task09$ john --wordlist=/usr/share/wordlists/rockyou.txt zip_hash.txt 
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
Will run 2 OpenMP threads
Note: Passwords longer than 21 [worst case UTF-8] to 63 [ASCII] rejected
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status
pass123          (secure.zip/zippy/flag.txt)     
1g 0:00:00:00 DONE (2025-10-14 12:33) 50.00g/s 409600p/s 409600c/s 409600C/s newzealand..total90
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```
Donc dans un premier temps je procède au **zip2john** pour avoir un hash potable que j'utilise ensuite avec john et la liste de mots rockyou.txt

**Réponse :** `pass123`

**What is the contents of the flag inside the zip file?**

Donc pour savoir ce que contient le fichier zip je fait la commande `unzip` suivi du fichier protégé par mot de passe et ça me demande le mot de passe comme prévu.

Maintenant nous avons le dossier qui s'appel **zippy** et dedans il y a un fichier **flag.txt**, je fait donc un cat dessu pour afficher son contenu et avoir le flag demandé.

**Réponse :** `THM{w3ll_d0n3_h4sh_r0y4l}`

### Task 9 - Cracking Password-Protected RAR Archives

De même avec des fichier **.rar** il existe une version pour ça qui s'applique de cette façon : 

```bash
rar2john rarfile.rar > rar_hash.txt
```
Et après si on décrypt le .rar avec **rar2john** il est possible qu'on est besoin de re décrypter un autre dossier securisé avec **zip2john** et ainsi de suite.

**What is the password for the secure.rar file?**

Je fais d'abors un fichier pour l'utiliser ensuite avec john
```bash
/opt/john/rar2john secure.rar > rar_hash.txt
```
Puis je peux faire la commande John
```bash
~/John-the-Ripper-The-Basics/Task10$ john --wordlist=/usr/share/wordlists/rockyou.txt rar_hash.txt 
Using default input encoding: UTF-8
Loaded 1 password hash (RAR5 [PBKDF2-SHA256 256/256 AVX2 8x])
Cost 1 (iteration count) is 32768 for all loaded hashes
Will run 2 OpenMP threads
Note: Passwords longer than 10 [worst case UTF-8] to 32 [ASCII] rejected
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status
password         (secure.rar)     
1g 0:00:00:00 DONE (2025-10-14 12:44) 1.667g/s 106.7p/s 106.7c/s 106.7C/s 123456..charlie
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```

**Réponse :** `password`

**What are the contents of the flag inside the zip file?**

Ok bon là j'ai mis un peu de temps a trouvé mais en gros quand on fait la commande simple :

```bash
unrar secure.rar
```
ça ne marche pas parce que il faut rajouter un `x` pour extraire les fichier et ensuite mettre le mot de passe trouvé, j'ai vu ça dans leur **man**.

```bash
unrar x secure.rar
```
et ensuite on a le flag.txt

**Réponse :** `THM{r4r_4rch1ve5_th15_t1m3}`

### Task 11 - Cracking SSH Keys with John

Même chose que pour les deux outils précédent, maintenant nous avons un outil pour SSH qui s'utilise de la façon suivante : 

```bash
ssh2john.py id_rsa > id_rsa_hash.txt
```

**What is the SSH private key password?**

Je fais la même chose que dans l'exemple : 

```bash
~/John-the-Ripper-The-Basics/Task11$ /opt/john/ssh2john.py id_rsa > ssh_hash.txt
```

Maintenant nous avons un fichier txt pour John

```bash
~/John-the-Ripper-The-Basics/Task11$ john --wordlist=/usr/share/wordlists/rockyou.txt ssh_hash.txt 
Using default input encoding: UTF-8
Loaded 1 password hash (SSH, SSH private key [RSA/DSA/EC/OPENSSH 32/64])
Cost 1 (KDF/cipher [0=MD5/AES 1=MD5/3DES 2=Bcrypt/AES]) is 0 for all loaded hashes
Cost 2 (iteration count) is 1 for all loaded hashes
Will run 2 OpenMP threads
Note: Passwords longer than 10 [worst case UTF-8] to 32 [ASCII] rejected
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status
mango            (id_rsa)     
1g 0:00:00:00 DONE (2025-10-14 12:58) 50.00g/s 214400p/s 214400c/s 214400C/s praise..mango
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```

Et si nous regardons bien on y voit le mot de passe : `mango`

**Réponse :** `mango`

### Task 12 - Further Reading

On nous donne juste le wiki pour en savoir plus et c'est tout, la room est fini

Le wiki : [OpenWall](https://www.openwall.com/john/)

**Room complétée** ✅

{% include comments.html %}