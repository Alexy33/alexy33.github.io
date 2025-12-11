---
title: "HackTheBox - Information Gathering - Skills Assessment"
date: 2025-12-11 15:12:00 +0200
categories: [HackTheBox, Learning]
tags: [skills-assessment, whois, robots-txt, subdomain-bruteforce, web-crawling, reconnaissance]
description: "Évaluation des compétences en reconnaissance web : whois, robots.txt, bruteforce de sous-domaines et crawling"
image:
  path: /assets/img/posts/information-gathering.png
  alt: "Skills Assessment - Information Gathering Web Edition"
---

## Informations sur le module

Ce Skills Assessment final teste ma capacité à combiner toutes les techniques de reconnaissance apprises dans le module pour résoudre des défis pratiques.

**Lien :** [Skills Assessment - Information Gathering Web Edition](https://academy.hackthebox.com/beta/module/144/section/1311)

## Objectifs d'apprentissage

Cette évaluation teste les compétences suivantes :

- Utiliser whois pour collecter des informations
- Analyser robots.txt
- Effectuer du bruteforce de sous-domaines
- Crawler et analyser les résultats
- Gérer le fichier /etc/hosts

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Skills Assessment

### Ce que l'évaluation attend de moi

Pour compléter ce Skills Assessment, je dois répondre aux questions en appliquant une variété de compétences apprises dans ce module.

> **Pour les débutants** : Un Skills Assessment est une évaluation pratique qui teste votre capacité à combiner plusieurs techniques pour résoudre des défis réels.
{: .prompt-info}

**Les techniques à utiliser :**
- Utiliser `whois`
- Analyser `robots.txt`
- Effectuer du bruteforce de sous-domaines
- Crawler et analyser les résultats

**Point crucial :** Je dois ajouter les sous-domaines découverts dans mon fichier `hosts` au fur et à mesure.

### L'importance du fichier hosts

**Pourquoi c'est mentionné explicitement :**

Dans les labs HTB, les sous-domaines ne résolvent pas toujours automatiquement via DNS. Je dois les ajouter manuellement dans `/etc/hosts`.

**Ma commande :**

```bash
sudo nano /etc/hosts
```

**Format à suivre :**

```
10.129.X.X    subdomain.target.com
```

> **Rappel** : Ajouter CHAQUE sous-domaine découvert au fichier hosts AVANT d'essayer d'y accéder.
{: .prompt-warning}

### Questions

**What is the IANA ID of the registrar of the inlanefreight.com domain?**

Bien nous allons faire un `whois` sur le nom de domaine pour en savoir plus

```bash
└──╼ [★]$ whois inlanefreight.com | grep IANA
   Registrar IANA ID: 468
Registrar IANA ID: 468
```

**Réponse :** `468`

**What http server software is powering the inlanefreight.htb site on the target system? Respond with the name of the software, not the version, e.g., Apache.**

Je suis aller directement dans la page `/robots.txt` et il y avait écris la réponse

**Réponse :** `nginx`

**What is the API key in the hidden admin directory that you have discovered on the target system?**

Pour ceci il est demandé de chercher des dossiers donc nous allons utiliser `gobuster`

```bash
└──╼ [★]$ gobuster vhost -u http://inlanefreight.htb:59120 -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt --append-domain
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:             http://inlanefreight.htb:59120
[+] Method:          GET
[+] Threads:         10
[+] Wordlist:        /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
[+] User Agent:      gobuster/3.6
[+] Timeout:         10s
[+] Append Domain:   true
===============================================================
Starting gobuster in VHOST enumeration mode
===============================================================
Found: web1337.inlanefreight.htb:59120 Status: 200 [Size: 104]
Progress: 114441 / 114442 (100.00%)
===============================================================
Finished
===============================================================
```

Après avoir longtemps testé plein de list différentes j'ai trouvé la plus longue et j'utilise **gobuster** en mode `vhosts`

Donc ensuite je refais un scan sur ce répertoire:

```bash
└──╼ [★]$ gobuster dir -u http://web1337.inlanefreight.htb:59120 -w /usr/share/seclists/Discovery/Web-Content/common.txt -t 50
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://web1337.inlanefreight.htb:59120
[+] Method:                  GET
[+] Threads:                 50
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/index.html           (Status: 200) [Size: 104]
/robots.txt           (Status: 200) [Size: 99]
Progress: 4723 / 4724 (99.98%)
===============================================================
Finished
===============================================================
```

Et je peux curl ce qu'on a trouvé

```bash
└──╼ [★]$ curl http://web1337.inlanefreight.htb:59120/robots.txt
User-agent: *
Allow: /index.html
Allow: /index-2.html
Allow: /index-3.html
Disallow: /admin_h1dd3n
```

Nous savons maintenant qu'il y a un dossier caché nommé `/admin_h1dd3n` que nous pouvons curl a nouveau

```bash
└──╼ [★]$ curl http://web1337.inlanefreight.htb:59120/admin_h1dd3n/
<!DOCTYPE html><html><head><title>web1337 admin</title></head><body><h1>Welcome to web1337 admin site</h1><h2>The admin panel is currently under maintenance, but the API is still accessible with the key e963d863ee0e82ba7080fbf558ca0d3f</h2></body></html>
```

**Réponse :** `e963d863ee0e82ba7080fbf558ca0d3f`

**After crawling the inlanefreight.htb domain on the target system, what is the email address you have found? Respond with the full email, e.g., mail@inlanefreight.htb.**

J'ai remarqué que on pouvait refaire la même commande pour décourvir si il y a d'autre sous domaines qui sont caché et voici ce que j'ai trouvé:

```bash
└──╼ [★]$ gobuster vhost -u http://web1337.inlanefreight.htb:59120 -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt --append-domain
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:             http://web1337.inlanefreight.htb:59120
[+] Method:          GET
[+] Threads:         10
[+] Wordlist:        /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
[+] User Agent:      gobuster/3.6
[+] Timeout:         10s
[+] Append Domain:   true
===============================================================
Starting gobuster in VHOST enumeration mode
===============================================================
Found: dev.web1337.inlanefreight.htb:59120 Status: 200 [Size: 123]
Progress: 114441 / 114442 (100.00%)
===============================================================
Finished
===============================================================
```

Maintenant nous allons utiliser `Scrapy` pour nous aider a faire de la reconnaissance

```bash
pip3 install scrapy
```

Et aussi `reconspider`

```bash
wget -O ReconSpider.zip https://academy.hackthebox.com/storage/modules/144/ReconSpider.v1.2.zip
```

Et pour l'utilisation :
```bash
└──╼ [★]$ python3 ReconSpider.py http://dev.web1337.inlanefreight.htb:59120
2025-12-11 09:29:58 [scrapy.utils.log] INFO: Scrapy 2.13.4 started (bot: scrapybot)
2025-12-11 09:29:58 [scrapy.utils.log] INFO: Versions:
{'lxml': '5.3.0',
 'libxml2': '2.12.9',
 'cssselect': '1.3.0',
 'parsel': '1.10.0',
 'w3lib': '2.3.1',
 'Twisted': '25.5.0',
 'Python': '3.11.2 (main, Apr 28 2025, 14:11:48) [GCC 12.2.0]',
 'pyOpenSSL': '24.0.0 (OpenSSL 3.2.2 4 Jun 2024)',
 'cryptography': '42.0.8',
 'Platform': 'Linux-6.12.32-amd64-x86_64-with-glibc2.36'}
2025-12-11 09:29:58 [scrapy.addons] INFO: Enabled addons:
[]
2025-12-11 09:29:58 [scrapy.extensions.telnet] INFO: Telnet Password: c901743e66461688
2025-12-11 09:29:58 [scrapy.middleware] INFO: Enabled extensions:
['scrapy.extensions.corestats.CoreStats',
 'scrapy.extensions.telnet.TelnetConsole',
 'scrapy.extensions.memusage.MemoryUsage',
 'scrapy.extensions.logstats.LogStats']
2025-12-11 09:29:58 [scrapy.crawler] INFO: Overridden settings:
{'LOG_LEVEL': 'INFO'}
2025-12-11 09:29:58 [py.warnings] WARNING: /home/htb-ac-1999270/.local/lib/python3.11/site-packages/scrapy/downloadermiddlewares/httpcompression.py:40: UserWarning: You have brotli installed. But 'br' encoding support now requires brotli version >= 1.2.0. Please upgrade brotli version to make Scrapy decode 'br' encoded responses.
  warnings.warn(

2025-12-11 09:29:58 [scrapy.middleware] INFO: Enabled downloader middlewares:
['scrapy.downloadermiddlewares.offsite.OffsiteMiddleware',
 'scrapy.downloadermiddlewares.httpauth.HttpAuthMiddleware',
 'scrapy.downloadermiddlewares.downloadtimeout.DownloadTimeoutMiddleware',
 'scrapy.downloadermiddlewares.defaultheaders.DefaultHeadersMiddleware',
 'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware',
 '__main__.CustomOffsiteMiddleware',
 'scrapy.downloadermiddlewares.retry.RetryMiddleware',
 'scrapy.downloadermiddlewares.redirect.MetaRefreshMiddleware',
 'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware',
 'scrapy.downloadermiddlewares.redirect.RedirectMiddleware',
 'scrapy.downloadermiddlewares.cookies.CookiesMiddleware',
 'scrapy.downloadermiddlewares.httpproxy.HttpProxyMiddleware',
 'scrapy.downloadermiddlewares.stats.DownloaderStats']
2025-12-11 09:29:58 [scrapy.middleware] INFO: Enabled spider middlewares:
['scrapy.spidermiddlewares.start.StartSpiderMiddleware',
 'scrapy.spidermiddlewares.httperror.HttpErrorMiddleware',
 'scrapy.spidermiddlewares.referer.RefererMiddleware',
 'scrapy.spidermiddlewares.urllength.UrlLengthMiddleware',
 'scrapy.spidermiddlewares.depth.DepthMiddleware']
2025-12-11 09:29:58 [scrapy.middleware] INFO: Enabled item pipelines:
[]
2025-12-11 09:29:58 [scrapy.core.engine] INFO: Spider opened
2025-12-11 09:29:58 [scrapy.extensions.logstats] INFO: Crawled 0 pages (at 0 pages/min), scraped 0 items (at 0 items/min)
2025-12-11 09:29:58 [scrapy.extensions.telnet] INFO: Telnet console listening on 127.0.0.1:6023
2025-12-11 09:29:58 [scrapy.downloadermiddlewares.retry] ERROR: Gave up retrying <GET http://dev.web1337.inlanefreight.htb:59120> (failed 3 times): DNS lookup failed: no results for hostname lookup: dev.web1337.inlanefreight.htb.
2025-12-11 09:29:58 [scrapy.core.scraper] ERROR: Error downloading <GET http://dev.web1337.inlanefreight.htb:59120>
Traceback (most recent call last):
  File "/home/htb-ac-1999270/.local/lib/python3.11/site-packages/twisted/internet/defer.py", line 1853, in _inlineCallbacks
    result = context.run(
             ^^^^^^^^^^^^
  File "/home/htb-ac-1999270/.local/lib/python3.11/site-packages/twisted/python/failure.py", line 467, in throwExceptionIntoGenerator
    return g.throw(self.value.with_traceback(self.tb))
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/htb-ac-1999270/.local/lib/python3.11/site-packages/scrapy/core/downloader/middleware.py", line 68, in process_request
    return (yield download_func(request, spider))
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/htb-ac-1999270/.local/lib/python3.11/site-packages/twisted/internet/defer.py", line 1092, in _runCallbacks
    current.result = callback(  # type: ignore[misc]
                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/htb-ac-1999270/.local/lib/python3.11/site-packages/twisted/internet/endpoints.py", line 1091, in startConnectionAttempts
    raise error.DNSLookupError(
twisted.internet.error.DNSLookupError: DNS lookup failed: no results for hostname lookup: dev.web1337.inlanefreight.htb.
2025-12-11 09:29:58 [scrapy.core.engine] INFO: Closing spider (finished)
2025-12-11 09:29:58 [scrapy.statscollectors] INFO: Dumping Scrapy stats:
{'downloader/exception_count': 3,
 'downloader/exception_type_count/twisted.internet.error.DNSLookupError': 3,
 'downloader/request_bytes': 708,
 'downloader/request_count': 3,
 'downloader/request_method_count/GET': 3,
 'elapsed_time_seconds': 0.120443,
 'finish_reason': 'finished',
 'finish_time': datetime.datetime(2025, 12, 11, 15, 29, 58, 873674, tzinfo=datetime.timezone.utc),
 'items_per_minute': None,
 'log_count/ERROR': 2,
 'log_count/INFO': 10,
 'log_count/WARNING': 1,
 'memusage/max': 70045696,
 'memusage/startup': 70045696,
 'responses_per_minute': None,
 'retry/count': 2,
 'retry/max_reached': 1,
 'retry/reason_count/twisted.internet.error.DNSLookupError': 2,
 'scheduler/dequeued': 3,
 'scheduler/dequeued/memory': 3,
 'scheduler/enqueued': 3,
 'scheduler/enqueued/memory': 3,
 'start_time': datetime.datetime(2025, 12, 11, 15, 29, 58, 753231, tzinfo=datetime.timezone.utc)}
2025-12-11 09:29:58 [scrapy.core.engine] INFO: Spider closed (finished)
```

Le résultat a été sauvegardé dans le fichier `result.json`

```bash
└──╼ [★]$ cat results.json 
{
    "emails": [
        "1337testing@inlanefreight.htb"
    ],
    "links": [
        "http://dev.web1337.inlanefreight.htb:59120/index-385.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-755.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-862.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-202.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-189.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-247.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-1000.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-626.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-165.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-384.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-727.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-785.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-933.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-350.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-463.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-988.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-77.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-748.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-553.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-938.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-760.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-300.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-895.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-292.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-248.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-574.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-939.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-224.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-329.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-555.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-799.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-204.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-769.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-964.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-226.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-918.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-114.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-437.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-567.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-641.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-807.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-332.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-403.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-24.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-728.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-379.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-687.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-459.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-513.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-134.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-525.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-817.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-220.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-458.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-105.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-531.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-166.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-504.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-925.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-947.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-660.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-561.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-80.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-203.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-798.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-909.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-335.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-585.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-581.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-431.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-733.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-714.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-408.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-577.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-291.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-815.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-789.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-615.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-795.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-643.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-635.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-465.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-631.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-342.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-888.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-244.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-949.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-326.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-734.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-944.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-302.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-989.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-948.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-334.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-254.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-737.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-472.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-977.html",
        "http://dev.web1337.inlanefreight.htb:59120/index-364.html"
    ],
    "external_files": [],
    "js_files": [],
    "form_fields": [],
    "images": [],
    "videos": [],
    "audio": [],
    "comments": [
        "<!-- Remember to change the API key to ba988b835be4aa97d068941dc852ff33 -->"
    ]
}
```

Alors ici j'ai mis beaucoup de temps car j'ai oublié de mettre le nouveau DNS à la suite de mon fichier `/etc/hosts` ce qui faisait des erreurs ce qui est normal

Nous voyons donc l'email :

**Réponse :** `1337testing@inlanefreight.htb`

**What is the API key the inlanefreight.htb developers will be changing too?**

Et à la fin nous voyons aussi la clé API :

**Réponse :** `ba988b835be4aa97d068941dc852ff33`

**Cours complété**

{% include comments.html %}