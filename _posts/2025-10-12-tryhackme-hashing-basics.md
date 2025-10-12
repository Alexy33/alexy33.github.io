---
title: "TryHackMe - Hashing Basics"
date: 2025-10-12 14:30:00 +0100
categories: [TryHackMe, Learning]
tags: [hashing, cryptography, cracking]
description: "Write-up de la room Hashing Basics - identification et cracking de hash"
---

## 📋 Room Info

Room facile sur les bases du hashing : comprendre ce qu'est un hash, les identifier et les cracker.

**Lien :** [Hashing Basics](https://tryhackme.com/room/hashingbasics)

## 🔑 L'essentiel

Un hash = empreinte unique et irréversible de données. Les plus courants :
- **MD5** (32 chars) : obsolète mais encore croisé
- **SHA-256** (64 chars) : sécurisé
- **bcrypt** : spécial mots de passe avec salt intégré

## 🎯 Solutions

### Task 1 - Identifier le hash

Hash donné :
```
5f4dcc3b5aa765d61d8327deb882cf99
```

C'est un **MD5** (32 caractères hex).

```bash
# Vérifier avec hashid
hashid '5f4dcc3b5aa765d61d8327deb882cf99'
```

### Task 2 - Cracker le MD5

**Méthode rapide** : [CrackStation](https://crackstation.net/)

**Méthode locale** :
```bash
hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt
```

**Réponse :** `password`

### Task 3 - Hash avec salt

Le salt empêche les attaques par rainbow tables. Si le format est `username:hash`, utiliser john :

```bash
john --wordlist=rockyou.txt --format=raw-sha256 hash.txt
```

### Task 4 - Brute force

Pour générer tous les mots de passe possibles de 4 lettres minuscules :

```bash
hashcat -m 0 -a 3 hash.txt ?l?l?l?l
```

## 💡 Retenu

- MD5/SHA-1 se crackent facilement
- Les salts compliquent beaucoup le cracking
- Toujours identifier le type de hash avant
- Utiliser bcrypt/Argon2 pour stocker des passwords

**Room complétée** ✅