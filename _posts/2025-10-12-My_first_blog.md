---
title: "TryHackMe - Hashing Basics"
date: 2025-10-12 14:30:00 +0100
categories: [TryHackMe, Learning]
tags: [hashing, cryptography, cracking]
description: "Write-up de la room Hashing Basics sur TryHackMe"
---

## 📋 Info Room

**Difficulté :** Easy  
**Lien :** [Hashing Basics](https://tryhackme.com/room/hashingbasics)

Cette room couvre les bases du hashing : c'est quoi un hash, comment les identifier, et comment les cracker avec des outils comme hashcat et john.

## 🔑 Concepts Clés

Un hash transforme des données en une empreinte unique et irréversible. Les plus courants :
- **MD5** : 32 caractères (obsolète, non sécurisé)
- **SHA-256** : 64 caractères (sécurisé)
- **bcrypt** : spécialement conçu pour les mots de passe

## 🎯 Solutions des Tasks

### Task 1 - What is a hash?

Questions théoriques sur le fonctionnement des hash. Points importants :
- Un hash est à sens unique (irréversible)
- Même entrée = toujours le même hash
- Utilisé pour vérifier l'intégrité et stocker les mots de passe

### Task 2 - Identifier le type de hash

**Hash fourni :**
```
5f4dcc3b5aa765d61d8327deb882cf99
```

**Solution :**
```bash
# Avec hashid
hashid '5f4dcc3b5aa765d61d8327deb882cf99'
```

C'est un **MD5** (32 caractères hex).

### Task 3 - Cracker un hash MD5

**Méthode 1 - Online (rapide) :**
- Utiliser [CrackStation](https://crackstation.net/)
- Coller le hash et lancer

**Méthode 2 - Hashcat (local) :**
```bash
echo "5f4dcc3b5aa765d61d8327deb882cf99" > hash.txt
hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt
```

**Résultat :** `password`

### Task 4 - Hash avec Salt

Ici on apprend que les salts empêchent les attaques par rainbow tables. Le hash fourni :
```
[hash_example]
```

**Solution :**
```bash
# Si le format est connu (ex: username:salt:hash)
# Utiliser john avec le bon format
john --format=raw-sha256 --wordlist=rockyou.txt hash.txt
```

### Task 5 - Cracker un SHA-256

Même principe qu'avant mais avec un algorithme différent :
```bash
# -m 1400 = SHA-256
hashcat -m 1400 -a 0 hash.txt rockyou.txt
```

## 🛠️ Commandes Utiles

```bash
# Identifier un hash
hashid <hash>

# Hashcat modes courants
-m 0    # MD5
-m 100  # SHA-1
-m 1400 # SHA-256
-m 3200 # bcrypt

# John formats courants
--format=raw-md5
--format=raw-sha256
```

## 💡 Ce que j'ai retenu

- Les hash MD5/SHA-1 se crackent facilement avec des wordlists
- Toujours vérifier le type de hash avant de cracker
- Les salts rendent le cracking beaucoup plus difficile
- Utiliser bcrypt pour stocker des mots de passe, jamais MD5

**Room complétée** ✅