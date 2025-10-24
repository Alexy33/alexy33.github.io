---
title: "TryHackMe - Gobuster - Basics"
date: 2025-10-23 18:09:00 +0200
categories: [TryHackMe, Learning]
tags: [emumeration, gobuster]
description: "Write-up de la room Gobuster Basics qui nous apprendra a manier correctement l'outil"
image:
  path: /assets/img/posts/tryhackme-hydra.png
  alt: "Gobuster Basics"
---

## Informations sur la room

Cette salle se concentre sur une introduction à Gobuster, un outil de sécurité offensif utilisé pour le dénombrement.

**Lien :** [Gobuster Basics](https://tryhackme.com/room/gobusterthebasics)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Comprendre les bases de l'énumération
- Comment utiliser Gobuster pour énumérer les répertoires et fichiers Web
- Comment utiliser Gobuster pour énumérer les sous-domaines
- Comment utiliser Gobuster pour énumérer les hôtes virtuels
- Comment utiliser une liste de mots

---

## Solutions des tâches

### Task 1 - Introduction

On a juste besoin d'être près a apprendre !

### Task 2 - Environment and Setup

On nous demande de lancer l'**attaque Box** et d'éditer ce fichier **/etc/resolv-dnsmasq** et d'y mettre l'ip de la machine cible dans ce fichier de la manière suivante : `nameserver 10.10.76.252` sur la première ligne puis de redémarrer le système de DNS avec la commande `/etc/init.d/dnsmasq restart`

### Task 3 - Gobuster: Introduction

**Gobuster** est un outil offensif open source écrit en Golang. Il **énumère les répertoires Web**, les sous-domaines DNS, les hôtes virtuels, les compartiments Amazon S3 et Google Cloud Storage par force brute, en utilisant des listes de mots spécifiques et en gérant les réponses entrantes. De nombreux professionnels de la sécurité utilisent cet outil pour les tests d'intrusion, la recherche de bug bounty et les évaluations de cybersécurité. En regardant les phases de piratage éthique, on peut placer Gobuster entre les phases de reconnaissance et de scan.

Voici le `help` de Gobuster:

```bash
root@ip-10-10-14-219:~# gobuster -h
Usage:
  gobuster [command]

Available Commands:
  completion  Generate the autocompletion script for the specified shell
  dir         Uses directory/file enumeration mode
  dns         Uses DNS subdomain enumeration mode
  fuzz        Uses fuzzing mode. Replaces the keyword FUZZ in the URL, Headers and the request body
  gcs         Uses gcs bucket enumeration mode
  help        Help about any command
  s3          Uses aws bucket enumeration mode
  tftp        Uses TFTP enumeration mode
  version     shows the current version
  vhost       Uses VHOST enumeration mode (you most probably want to use the IP address as the URL parameter)

Flags:
      --debug                 Enable debug output
      --delay duration        Time each thread waits between requests (e.g. 1500ms)
  -h, --help                  help for gobuster
      --no-color              Disable color output
      --no-error              Don't display errors
  -z, --no-progress           Don't display progress
  -o, --output string         Output file to write results to (defaults to stdout)
  -p, --pattern string        File containing replacement patterns
  -q, --quiet                 Don't print the banner and other noise
  -t, --threads int           Number of concurrent threads (default 10)
  -v, --verbose               Verbose output (errors)
  -w, --wordlist string       Path to the wordlist. Set to - to use STDIN.
      --wordlist-offset int   Resume from a given position in the wordlist (defaults to 0)

Use "gobuster [command] --help" for more information about a command.
```

Voici un exemple de commande : `gobuster dir -u "http://www.example.thm/" -w /usr/share/wordlists/dirb/small.txt -t 64`

- `gobuster dir` indique que nous utiliserons le mode d’énumération de répertoires et de fichiers en sachant qu'il existe les suivant : `dns` et `vhost` pour l'énumération...
- `-u "http://www.example.thm/"` indique le site cible
- `-w /usr/share/wordlists/dirb/small.txt` indique la liste de mots a utiliser
- `-t 64` définit le nombre de threads que Gobuster utilisera à 64. Cela améliore considérablement les performances.

---

**What flag do we use to specify the target URL?**

**Réponse :** `-u`

**What command do we use for the subdomain enumeration mode?**

**Réponse :** `dns`

### Task 4 - Use Case: Directory and File Enumeration

| Flag | Description |
|--------|--------|
| -c (cookies)   | Ce flag configure un cookie pour transmettre chaque demande, comme un identifiant de session. |
| -x (extensions) | Ce flag spécifie les extensions de fichiers que vous souhaitez rechercher. Par exemple, .php, .js |
| -H (Headers) | Ce flag configure un en-tête entier à transmettre avec chaque requête. |
| -k (no tls validation) | Ce flag ignore le processus qui vérifie le certificat lorsque https est utilisé. Il arrive souvent que pour les événements CTF ou les salles de test comme celles de THM, un certificat auto-signé soit utilisé. Cela provoque une erreur lors de la vérification TLS. |
| -n (no status) | Vous pouvez définir ce flag lorsque vous ne souhaitez pas voir les codes d'état de chaque réponse reçue. Cela permet de garder la sortie à l’écran claire. |
| -P (password) | Vous pouvez définir ce flag avec le flag `--username` pour exécuter des requêtes authentifiées. Ceci est pratique lorsque vous avez obtenu les informations d'identification d'un utilisateur. |
| -s (status codes) | Avec ce flag, vous pouvez configurer les codes d'état des réponses reçues que vous souhaitez afficher, comme 200, ou une plage comme 300-400. |
| -b (status codes blacklist) | Ce flag vous permet de configurer les codes d'état des réponses reçues que vous ne souhaitez pas afficher. La configuration de ce flag remplace l'indicateur `-s`. |
| -U (username) | Vous pouvez définir ce flag avec le flag `--password` pour exécuter des requêtes authentifiées. Ceci est pratique lorsque vous avez obtenu les informations d'identification d'un utilisateur. |
| -r (follow redirect) | Ce flag configure Gobuster pour qu'il suive la redirection qu'il a reçue en réponse à la demande envoyée. Un code d'état de redirection HTTP (par exemple, 301 ou 302) est utilisé pour rediriger le client vers une URL différente. |

Voici un exemple de commande avec le `-x` pour spécifier les type de fichiers qu'on cherche

```bash
gobuster dir -u "http://www.example.thm" -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x .php,.js
```

---

**Which flag do we have to add to our command to skip the TLS verification? Enter the long flag notation.**

La notation longue de ce flag je ne l'ai pas marché mais c'est :

**Réponse :** `--no-tls-validation`

**Enumerate the directories of www.offensivetools.thm. Which directory catches your attention?**

Voici le résultat de la commande que j'ai fait:

```bash
root@ip-10-10-14-219:~# gobuster dir -u "www.offensivetools.thm" -w /usr/share/wordlists/dirb/small.txt -t 64
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://www.offensivetools.thm
[+] Method:                  GET
[+] Threads:                 64
[+] Wordlist:                /usr/share/wordlists/dirb/small.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/administrator        (Status: 301) [Size: 340] [--> http://www.offensivetools.thm/administrator/]
/api                  (Status: 301) [Size: 330] [--> http://www.offensivetools.thm/api/]
/cache                (Status: 301) [Size: 332] [--> http://www.offensivetools.thm/cache/]
/images               (Status: 301) [Size: 333] [--> http://www.offensivetools.thm/images/]
/includes             (Status: 301) [Size: 335] [--> http://www.offensivetools.thm/includes/]
/libraries            (Status: 403) [Size: 287]
/home                 (Status: 200) [Size: 8818]
/modules              (Status: 301) [Size: 334] [--> http://www.offensivetools.thm/modules/]
Progress: 564 / 960 (58.75%)[ERROR] Get "http://www.offensivetools.thm/Statistics": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
[ERROR] Get "http://www.offensivetools.thm/aa": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
[ERROR] Get "http://www.offensivetools.thm/administrat": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
[ERROR] Get "http://www.offensivetools.thm/admin_logon": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
[ERROR] Get "http://www.offensivetools.thm/Pages": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
[ERROR] Get "http://www.offensivetools.thm/Log": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
[ERROR] Get "http://www.offensivetools.thm/Logs": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
[ERROR] Get "http://www.offensivetools.thm/active": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
/secret               (Status: 301) [Size: 333] [--> http://www.offensivetools.thm/secret/]
/templates            (Status: 301) [Size: 336] [--> http://www.offensivetools.thm/templates/]
/tmp                  (Status: 301) [Size: 330] [--> http://www.offensivetools.thm/tmp/]
Progress: 959 / 960 (99.90%)
===============================================================
Finished
===============================================================
```

En effet il y a un dossier qui attire mon attention, pourquoi il y aurait un dossier **secret** ?

**Réponse :** `secret`

**Continue enumerating the directory found in question 2. You will find an interesting file there with a .js extension. What is the flag found in this file?**

```bash
root@ip-10-10-14-219:~# gobuster dir -u "www.offensivetools.thm/secret/" -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -t 64 -x js
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://www.offensivetools.thm/secret/
[+] Method:                  GET
[+] Threads:                 64
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              js
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/content              (Status: 301) [Size: 341] [--> http://www.offensivetools.thm/secret/content/]
/uploads              (Status: 301) [Size: 341] [--> http://www.offensivetools.thm/secret/uploads/]
/flag.js              (Status: 200) [Size: 22]
Progress: 7019 / 436552 (1.61%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 7035 / 436552 (1.61%)
```

Et ensuite j'ai fait cette commande pour voir le contenu alors que je n'y avais pas accès sur le navigateur:

```bash
root@ip-10-10-14-219:~# curl www.offensivetools.thm/secret/flag.js
THM{ReconWasASuccess}
```

**Réponse :** `THM{ReconWasASuccess}`

### Task 5 - Use Case: Subdomain Enumeration

Maintenant nous allons nous concentré sur l'option `dns` de gobuster.
Ce mode permet à Gobuster de **forcer brutalement** les `sous-domaines`. Lors d’un test d’intrusion, vérifier les sous-domaines du domaine phare de votre cible est essentiel. Ce n'est pas parce que quelque chose est corrigé dans le domaine normal qu'il est également corrigé dans le sous-domaine. Une opportunité d'exploiter une vulnérabilité dans l'un de ces sous-domaines peut exister.

Voici ce qu'on a avec le help de gobuster dns `gobuster dns --help`

```bash
root@ip-10-10-201-248:~# gobuster dns -h
Uses DNS subdomain enumeration mode

Usage:
  gobuster dns [flags]

Flags:
  -d, --domain string      The target domain
  -h, --help               help for dns
      --no-fqdn            Do not automatically add a trailing dot to the domain, so the resolver uses the DNS search domain
  -r, --resolver string    Use custom DNS server (format server.com or server.com:port)
  -c, --show-cname         Show CNAME records (cannot be used with '-i' option)
  -i, --show-ips           Show IP addresses
      --timeout duration   DNS resolver timeout (default 1s)
      --wildcard           Force continued operation when wildcard found

Global Flags:
      --debug                 Enable debug output
      --delay duration        Time each thread waits between requests (e.g. 1500ms)
      --no-color              Disable color output
      --no-error              Don't display errors
  -z, --no-progress           Don't display progress
  -o, --output string         Output file to write results to (defaults to stdout)
  -p, --pattern string        File containing replacement patterns
  -q, --quiet                 Don't print the banner and other noise
  -t, --threads int           Number of concurrent threads (default 10)
  -v, --verbose               Verbose output (errors)
  -w, --wordlist string       Path to the wordlist. Set to - to use STDIN.
      --wordlist-offset int   Resume from a given position in the wordlist (defaults to 0)
```

Voici comment utiliser le mode **dns** de gobuster : `gobuster dns -d example.thm -w /path/to/wordlist`

ou encore : `gobuster dns -d example.thm -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt`

> Notez que la commande inclut requiere les flag `-d` et `-w`, en plus du mot-clé dns. Ces deux indicateurs sont **requis** pour que l'énumération du sous-domaine Gobuster fonctionne
{: .prompt-warning}

`-w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt` -> Définit la liste de mots sur `subdomains-top1million-5000.txt`. Gobuster utilise chaque entrée de cette liste pour construire une nouvelle requête DNS. Si la première entrée de cette liste est « all », la requête serait **all.example.thm**.

---

**Apart from the dns keyword and the -w flag, which shorthand flag is required for the command to work?**

**Réponse :** `-d`

**Use the commands learned in this task, how many subdomains are configured for the offensivetools.thm domain?**

```bash
root@ip-10-10-201-248:~# gobuster dns -d offensivetools.thm -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Domain:     offensivetools.thm
[+] Threads:    10
[+] Timeout:    1s
[+] Wordlist:   /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
===============================================================
Starting gobuster in DNS enumeration mode
===============================================================
[INFO] [-] Unable to validate base domain: offensivetools.thm (lookup offensivetools.thm on 127.0.0.1:53: no such host)
Found: forum.offensivetools.thm

Found: store.offensivetools.thm

Found: WWW.offensivetools.thm

Found: primary.offensivetools.thm

Progress: 4997 / 4998 (99.98%)
===============================================================
Finished
===============================================================
```

**Réponse :** `4`

### Task 6 - Use Case: Vhost Enumeration

Le dernier et dernier mode sur lequel nous nous concentrerons est le mode `vhost`. Ce mode permet à Gobuster de **forcer brutalement** les `hôtes virtuels`. Les hôtes virtuels sont différents **sites Web sur la même machine**. Parfois, ils ressemblent à des sous-domaines, mais ne vous y trompez pas ! Les hôtes virtuels **sont basés sur IP** et s'exécutent sur le même serveur. Les sous-domaines sont configurés dans DNS. La différence entre les modes vhost et DNS réside dans la manière dont Gobuster analyse :

- Le mode `vhost` naviguera vers l'URL créée en combinant le `NOM D'HÔTE` configuré (flag `-u`) avec une entrée d'une liste de mots.
- Le mode DNS effectuera une **recherche DNS** sur le **FQDN** créé en combinant le nom de domaine configuré (flag `-d`) avec une entrée d'une liste de mots.

Voici le help de gobuster vhost:

```bash
root@ip-10-10-201-248:~# gobuster vhost -h
Uses VHOST enumeration mode (you most probably want to use the IP address as the URL parameter)

Usage:
  gobuster vhost [flags]

Flags:
      --append-domain                     Append main domain from URL to words from wordlist. Otherwise the fully qualified domains need to be specified in the wordlist.
      --client-cert-p12 string            a p12 file to use for options TLS client certificates
      --client-cert-p12-password string   the password to the p12 file
      --client-cert-pem string            public key in PEM format for optional TLS client certificates
      --client-cert-pem-key string        private key in PEM format for optional TLS client certificates (this key needs to have no password)
  -c, --cookies string                    Cookies to use for the requests
      --domain string                     the domain to append when using an IP address as URL. If left empty and you specify a domain based URL the hostname from the URL is extracted
      --exclude-length string             exclude the following content lengths (completely ignores the status). You can separate multiple lengths by comma and it also supports ranges like 203-206
  -r, --follow-redirect                   Follow redirects
  -H, --headers stringArray               Specify HTTP headers, -H 'Header1: val1' -H 'Header2: val2'
  -h, --help                              help for vhost
  -m, --method string                     Use the following HTTP method (default "GET")
      --no-canonicalize-headers           Do not canonicalize HTTP header names. If set header names are sent as is.
  -k, --no-tls-validation                 Skip TLS certificate verification
  -P, --password string                   Password for Basic Auth
      --proxy string                      Proxy to use for requests [http(s)://host:port] or [socks5://host:port]
      --random-agent                      Use a random User-Agent string
      --retry                             Should retry on request timeout
      --retry-attempts int                Times to retry on request timeout (default 3)
      --timeout duration                  HTTP Timeout (default 10s)
  -u, --url string                        The target URL
  -a, --useragent string                  Set the User-Agent string (default "gobuster/3.6")
  -U, --username string                   Username for Basic Auth

Global Flags:
      --debug                 Enable debug output
      --delay duration        Time each thread waits between requests (e.g. 1500ms)
      --no-color              Disable color output
      --no-error              Don't display errors
  -z, --no-progress           Don't display progress
  -o, --output string         Output file to write results to (defaults to stdout)
  -p, --pattern string        File containing replacement patterns
  -q, --quiet                 Don't print the banner and other noise
  -t, --threads int           Number of concurrent threads (default 10)
  -v, --verbose               Verbose output (errors)
  -w, --wordlist string       Path to the wordlist. Set to - to use STDIN.
      --wordlist-offset int   Resume from a given position in the wordlist (defaults to 0)
```

Voici un exemple de commande vide : `gobuster vhost -u "http://example.thm" -w /path/to/wordlist`

> Notez que la commande inclut également les flags `-u` et `-w`, en plus du mot-clé vhost. Ces deux indicateurs sont **requis** pour que l'énumération Gobuster vhost fonctionne
{: .prompt-warning}

---

**Use the commands learned in this task to answer the following question: How many vhosts on the offensivetools.thm domain reply with a status code 200?**

```bash
root@ip-10-10-201-248:~# gobuster vhost -u "http://10.10.63.46" -w /usr/share/wordlists/SecLi --domain offensivetools.thm -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt --append-domain --exclude-length 250-500
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:              http://10.10.63.46
[+] Method:           GET
[+] Threads:          10
[+] Wordlist:         /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
[+] User Agent:       gobuster/3.6
[+] Timeout:          10s
[+] Append Domain:    true
[+] Exclude Length:   270,353,286,411,461,492,250,253,278,254,471,496,302,356,297,354,454,301,332,477,344,428,462,363,486,495,499,307,382,425,361,446,487,288,317,413,357,418,436,442,329,339,377,258,276,322,433,441,478,330,402,412,410,459,489,289,393,407,451,475,251,328,360,298,308,476,460,315,324,376,405,269,334,372,472,479,295,340,434,438,464,259,280,294,374,378,400,409,422,272,282,309,449,331,398,256,408,420,470,482,498,273,419,468,281,404,444,465,488,264,283,304,456,296,346,429,287,291,335,386,427,255,261,285,379,437,326,415,430,368,401,431,447,265,275,366,417,448,279,395,414,371,432,497,293,303,318,443,406,312,321,391,394,493,347,349,390,403,299,364,396,333,373,421,455,480,267,292,306,343,355,440,481,262,290,300,252,458,351,388,389,284,305,348,325,491,383,385,483,416,450,314,341,342,263,435,453,316,359,384,367,423,473,445,466,277,370,392,424,469,490,268,336,381,257,310,467,485,271,362,474,311,345,439,484,274,387,426,266,375,380,494,260,352,457,365,397,399,463,313,320,323,319,338,350,369,452,500,327,337,358
===============================================================
Starting gobuster in VHOST enumeration mode
===============================================================
Found: forum.offensivetools.thm Status: 200 [Size: 2635]
Found: store.offensivetools.thm Status: 200 [Size: 3014]
Found: www.offensivetools.thm Status: 200 [Size: 8806]
Found: WWW.offensivetools.thm Status: 200 [Size: 8806]
Found: secret.offensivetools.thm Status: 200 [Size: 1550]
Progress: 4997 / 4998 (99.98%)
===============================================================
Finished
===============================================================
```

Si on ne compte pas l'url de base alors ça nous fait un total de `4`

**Réponse :** `4`

### Task 7 - Conclusion

On a vu les options `dir`, `dns` et `vhost` de l'outil Gobuster !

**Room complétée**

{% include comments.html %}