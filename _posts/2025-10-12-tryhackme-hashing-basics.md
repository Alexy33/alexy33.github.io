---
title: "TryHackMe - Hashing Basics"
date: 2025-10-12 14:30:00 +0100
categories: [TryHackMe, Learning]
tags: [hashing, cryptography, cracking]
description: "Write-up de la room Hashing Basics - identification et cracking de hash"
image:
  path: /assets/img/posts/tryhackme-hashing.png
  alt: "TryHackMe Hashing Basics Room"
---

## 📋 Room Info

Room facile sur les bases du hashing : comprendre ce qu'est un hash, les identifier et les cracker.

**Lien :** [Hashing Basics](https://tryhackme.com/room/hashingbasics)

## 🔑 L'essentiel

Un hash = empreinte unique et irréversible de données. Les plus courants :
- **MD5** (32 chars) : obsolète mais encore croisé
- **SHA-256** (64 chars) : sécurisé
- **bcrypt** : spécial mots de passe avec salt intégré

---

## 🎯 Solutions des Tasks

### Task 1 - Introduction

Il suffit de se connecter en SSH avec les identifiants fournis :

```bash
ssh user@IP_MACHINE
```
{: file="terminal" }

Puis entrer le mot de passe donné dans la room.

---

### Task 2 - Hash Functions

**What is the SHA256 hash of the passport.jpg file in ~/Hashing-Basics/Task-2?**

On utilise la commande suivante :

```bash
sha256sum passport.jpg
```

**Réponse :** `77148c6f605a8df855f2b764bcc3be749d7db814f5f79134d2aa539a64b61f02`

---

**What is the output size in bytes of the MD5 hash function?**

> As a numeric example, if a hash function produces a 4-bit hash value, we only have 16 different hash values. The total number of possible hash values is 2^number_of_bits = 2^4 = 16
{: .prompt-info }

**Réponse :** `16`

---

**If you have an 8-bit hash output, how many possible hash values are there?**

Calcul : 2^8 = 256

**Réponse :** `256`

---

### Task 3 - Insecure Password Storage for Authentication

**What is the 20th password in rockyou.txt?**

On utilise la commande **head** pour afficher les premiers mots de la liste (il y en a plus de 14 millions !) :

```bash
head -20 rockyou.txt
```

> Le `-20` permet d'afficher seulement les 20 premières lignes
{: .prompt-tip }

---

### Task 4 - Using Hashing for Secure Password Storage

Il existe des sites pour nous simplifier la tâche :
- [CrackStation](https://crackstation.net)
- [Hashes.com](https://hashes.com/en/decrypt/hash)

**Manually check the hash "4c5923b6a6fac7b7355f53bfe2b8f8c1" using the rainbow table above.**

**Réponse :** `inS3CyourP4$$`

---

**Crack the hash "5b31f93c09ad1d065c0491b764d04933" using an online tool.**

**Réponse :** `tryhackme`

---

**Should you encrypt passwords in password-verification systems? Yea/Nay**

**Réponse :** `Nay`

---

### Task 5 - Recognising Password Hashes

**What is the hash size in yescrypt?**

```bash
man 5 crypt
```

**Réponse :** `256`

---

**What's the Hash-Mode listed for Cisco-ASA MD5?**

> Consulter la documentation : [Hashcat Example Hashes](https://hashcat.net/wiki/doku.php?id=example_hashes)
{: .prompt-tip }

**Réponse :** `2410`

---

**What hashing algorithm is used in Cisco-IOS if it starts with $9$?**

**Réponse :** `scrypt`

---

### Task 6 - Password Cracking

Nous allons utiliser ce schéma de commande pour hashcat :

```bash
hashcat -m <hash_type> -a <attack_mode> hashfile wordlist
```

#### Question 1

**Use hashcat to crack the hash, $2a$06$7yoU3Ng8dHTXphAg913cyO6Bjs3K5lBnwq5FJyA6d01pMSrddr1ZG, saved in ~/Hashing-Basics/Task-6/hash1.txt.**

```bash
hashcat -m 3200 -a 0 Hashing-Basics/Task-6/hash1.txt rockyou.txt
```

Résultat :

```bash
$2a$06$7yoU3Ng8dHTXphAg913cyO6Bjs3K5lBnwq5FJyA6d01pMSrddr1ZG:85208520
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 3200 (bcrypt $2*$, Blowfish (Unix))
Hash.Target......: $2a$06$7yoU3Ng8dHTXphAg913cyO6Bjs3K5lBnwq5FJyA6d01p...ddr1ZG
Time.Started.....: Sun Oct 12 20:21:26 2025 (42 secs)
Time.Estimated...: Sun Oct 12 20:22:08 2025 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:      353 H/s (5.25ms) @ Accel:2 Loops:32 Thr:1 Vec:1
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 14764/14344384 (0.10%)
Rejected.........: 0/14764 (0.00%)
Restore.Point....: 14760/14344384 (0.10%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:32-64
Candidate.Engine.: Device Generator
Candidates.#1....: 85208520 -> 25251325
Hardware.Mon.#1..: Util: 92%

Started: Sun Oct 12 20:21:12 2025
Stopped: Sun Oct 12 20:22:10 2025
```
{: .nolineno }

> Ce qui nous intéresse c'est la première ligne : après les `:` on trouve le mot de passe cracké
{: .prompt-tip }

**Réponse :** `85208520`

---

#### Question 2

**Use hashcat to crack the SHA2-256 hash, 9eb7ee7f551d2f0ac684981bd1f1e2fa4a37590199636753efe614d4db30e8e1, saved in ~/Hashing-Basics/Task-6/hash2.txt.**

```bash
hashcat -m 1400 -a 0 Hashing-Basics/Task-6/hash2.txt rockyou.txt
```

> J'ai utilisé le mode `1400` car sur [hashcat.net](https://hashcat.net/wiki/doku.php?id=example_hashes), c'est l'ID correspondant au SHA-256
{: .prompt-info }

Résultat :

```bash
9eb7ee7f551d2f0ac684981bd1f1e2fa4a37590199636753efe614d4db30e8e1:halloween
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 1400 (SHA2-256)
Hash.Target......: 9eb7ee7f551d2f0ac684981bd1f1e2fa4a37590199636753efe...30e8e1
Time.Started.....: Sun Oct 12 20:30:08 2025 (0 secs)
Time.Estimated...: Sun Oct 12 20:30:08 2025 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:    35079 H/s (0.19ms) @ Accel:256 Loops:1 Thr:1 Vec:8
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 3072/14344384 (0.02%)
Rejected.........: 0/3072 (0.00%)
Restore.Point....: 2560/14344384 (0.02%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:0-1
Candidate.Engine.: Device Generator
Candidates.#1....: gators -> dangerous
Hardware.Mon.#1..: Util: 49%

Started: Sun Oct 12 20:29:13 2025
Stopped: Sun Oct 12 20:30:11 2025
```
{: .nolineno }

**Réponse :** `halloween`

---

#### Question 3

**Use hashcat to crack the hash, $6$GQXVvW4EuM$ehD6jWiMsfNorxy5SINsgdlxmAEl3.yif0/c3NqzGLa0P.S7KRDYjycw5bnYkF5ZtB8wQy8KnskuWQS3Yr1wQ0, saved in ~/Hashing-Basics/Task-6/hash3.txt.**

Le type de hash n'est pas précisé, j'ai donc testé plusieurs modes. Le hash `1800` correspond à : **sha512crypt $6$, SHA512 (Unix)**

```bash
hashcat -m 1800 -a 0 Hashing-Basics/Task-6/hash3.txt rockyou.txt
```

**Réponse :** `spaceman`

---

#### Question 4

**Crack the hash, b6b0d451bbf6fed658659a9e7e5598fe, saved in ~/Hashing-Basics/Task-6/hash4.txt.**

**Réponse :** `funforyou`

---

### Task 7 - Hashing for Integrity Checking

**What is SHA256 hash of libgcrypt-1.11.0.tar.bz2 found in ~/Hashing-Basics/Task-7?**

```bash
sha256sum libgcrypt-1.11.0.tar.bz2
```

Résultat :

```bash
09120c9867ce7f2081d6aaa1775386b98c2f2f246135761aae47d81f58685b9c  libgcrypt-1.11.0.tar.bz2
```

**Réponse :** `09120c9867ce7f2081d6aaa1775386b98c2f2f246135761aae47d81f58685b9c`

---

**What's the hashcat mode number for HMAC-SHA512 (key = $pass)?**

Toujours sur [hashcat.net](https://hashcat.net/wiki/doku.php?id=example_hashes), chercher HMAC-SHA512.

**Réponse :** `1750`

---

### Task 8 - Conclusion

**Use base64 to decode RU5jb2RlREVjb2RlCg==, saved as decode-this.txt in ~/Hashing-Basics/Task-8. What is the original word?**

On utilise la commande `base64` de Linux avec l'option `-d` pour décoder :

```bash
base64 -d decode-this.txt
```

**Réponse :** `ENcodeDEcode`

---

## 💡 Ce que j'ai retenu

- Les hash MD5 et SHA-256 se crackent facilement avec des wordlists comme rockyou.txt
- Il est essentiel d'identifier le bon type de hash avant d'utiliser hashcat
- Les salts rendent le cracking beaucoup plus difficile
- Hashcat est un outil puissant avec de nombreux modes pour différents algorithmes
- Le hashing sert aussi à vérifier l'intégrité des fichiers

**Room complétée** ✅

{% include comments.html %}