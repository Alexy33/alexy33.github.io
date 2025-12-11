---
title: "HackTheBox - Information Gathering - Web Archives"
date: 2025-12-11 14:20:00 +0200
categories: [HackTheBox, Learning]
tags: [wayback-machine, web-archives, osint, reconnaissance, internet-archive]
description: "Découvrir comment utiliser la Wayback Machine pour explorer l'historique des sites web et trouver des informations sensibles cachées dans le passé"
image:
  path: /assets/img/posts/information-gathering.png
  alt: "Web Archives - HTB Academy"
---

## Informations sur le module

Ce module explore l'utilisation de la Wayback Machine et des archives web pour la reconnaissance. On apprend à voyager dans le temps pour découvrir les anciennes versions d'un site, révélant parfois des informations sensibles, des vulnérabilités oubliées ou des ressources cachées.

**Lien :** [Web Archives](https://academy.hackthebox.com/beta/module/144/section/1256)

## Objectifs d'apprentissage

Ce module couvre les compétences suivantes :

- Comprendre le fonctionnement de la Wayback Machine
- Explorer l'historique d'un site web cible
- Identifier des ressources et vulnérabilités dans les anciennes versions
- Utiliser les archives pour de la reconnaissance passive
- Analyser l'évolution d'un site au fil du temps

---

> Attention ceci est un cours **TIER 2** donc je n'ai pas le droit de simplement copier coller les ressources pour vous les donner donc j'en ferai un résumé de ce que je comprend à chaque fois ainsi que mon cheminement de pensée à chaque fois qu'une question s'imposera
{: .prompt-danger}

## Web Archives

### Pourquoi les archives web sont précieuses

Dans le monde numérique, les sites web changent constamment. Des pages disparaissent, du contenu est supprimé, des configurations changent. **Mais internet n'oublie jamais vraiment.**

La Wayback Machine de l'Internet Archive me permet de remonter le temps et voir comment un site apparaissait il y a des mois ou des années. En reconnaissance, c'est **extrêmement puissant**.

> **Pour les débutants** : La Wayback Machine est comme une machine à voyager dans le temps pour les sites web. Elle capture et stocke régulièrement des "photos" des sites internet depuis 1996.
{: .prompt-info}

**Ce que j'ai découvert en utilisant les archives :**
- Des anciennes pages d'admin qui n'existent plus sur le site actuel
- Des fichiers de configuration oubliés dans d'anciennes versions
- Des commentaires de développeurs dans le code source historique
- Des sous-domaines qui ont été supprimés mais restent accessibles

### Comment fonctionne la Wayback Machine

La première fois que j'ai utilisé la Wayback Machine, je pensais que c'était juste une sauvegarde statique. **En réalité, c'est bien plus sophistiqué.**

#### Le processus en trois étapes

**1. Crawling (Exploration)**

La Wayback Machine utilise des robots automatisés qui parcourent le web en suivant les liens, exactement comme les crawlers de Google. Mais au lieu de juste indexer pour la recherche, ces bots **téléchargent tout le contenu**.

> **Analogie** : Imagine un photographe qui se promène sur internet et prend des photos complètes de chaque site qu'il visite - pas juste la vitrine, mais aussi tout ce qui est à l'intérieur.
{: .prompt-tip}

**2. Archiving (Archivage)**

Tout le contenu téléchargé est stocké avec un **timestamp précis** : la date et l'heure exactes de la capture. Cela inclut :
- Le HTML de la page
- Les feuilles de style CSS
- Les scripts JavaScript
- Les images et autres ressources
- Même la structure des répertoires

**Mon observation :** Certains sites sont archivés plusieurs fois par jour, d'autres seulement quelques fois par an. La fréquence dépend de la popularité du site et de sa vitesse de changement.

**3. Accessing (Accès)**

Je peux ensuite accéder à ces snapshots via l'interface de la Wayback Machine. Il suffit d'entrer une URL et de sélectionner une date pour voir le site tel qu'il était à ce moment précis.

### Ce qui influence la fréquence d'archivage

| Facteur | Impact sur l'archivage |
|---------|------------------------|
| Popularité du site | Sites populaires = captures plus fréquentes |
| Taux de changement | Sites qui changent souvent = archivage plus régulier |
| Valeur culturelle/historique | Sites jugés importants = priorité d'archivage |
| Ressources disponibles | Capacité de l'Internet Archive |

> **Important** : La Wayback Machine n'archive PAS tout internet. Les propriétaires de sites peuvent demander l'exclusion de leur contenu, bien que ce ne soit pas toujours garanti.
{: .prompt-warning}

### Pourquoi c'est crucial en reconnaissance

Quand j'ai commencé à intégrer la Wayback Machine dans ma méthodologie, j'ai découvert des choses que je n'aurais **jamais** trouvées autrement.

#### Découvrir des ressources cachées

**Mon premier succès :**

En analysant une cible, j'ai trouvé dans une archive de 2019 un répertoire `/backup` qui contenait des fichiers de configuration. Ce répertoire n'existait plus sur le site actuel, mais grâce à l'archive, j'ai pu voir exactement ce qui s'y trouvait.

```
https://web.archive.org/web/20190315120000*/target.com/backup/
```

**Ce que ça m'a révélé :**
- Structure de base de données
- Noms d'utilisateurs
- Chemins absolus du serveur
- Versions de logiciels utilisés

> Les anciennes versions d'un site peuvent contenir des pages d'administration, des répertoires de fichiers ou des sous-domaines qui ont été supprimés mais qui restent vulnérables s'ils sont toujours accessibles.
{: .prompt-danger}

#### Suivre l'évolution et identifier des patterns

En comparant plusieurs snapshots à différentes dates, je peux observer :
- **Changements de structure** : Nouveaux répertoires, pages supprimées
- **Évolution technologique** : Migration de PHP vers Node.js par exemple
- **Modifications de sécurité** : Ajout/suppression de mécanismes de protection
- **Patterns de développement** : Fréquence des mises à jour, conventions de nommage

**Ma méthode :**

Je sélectionne des snapshots espacés dans le temps (par exemple tous les 6 mois) et je les compare systématiquement pour repérer les changements significatifs.

#### Collecter de l'intelligence (OSINT)

Les archives web sont une **mine d'or pour l'OSINT**. J'ai trouvé dans des versions archivées :

- Anciens profils d'employés (pages "Notre équipe")
- Anciennes technologies utilisées (mentionnées dans le code source)
- Stratégies marketing passées
- Partenariats qui ont été abandonnés
- Données de contact historiques

**Exemple concret :**

Sur un site de 2018, j'ai trouvé une page "Carrières" qui listait toutes les technologies utilisées par l'entreprise. Cette information n'était plus visible sur le site actuel, mais m'a donné un aperçu complet de leur stack technique.

#### Reconnaissance passive et furtive

**Ce qui m'a convaincu d'utiliser systématiquement les archives :**

Accéder à la Wayback Machine est une activité **complètement passive**. Je ne touche pas directement à l'infrastructure cible, donc :
- Pas de logs sur le serveur cible
- Pas d'alerte de sécurité déclenchée
- Impossible à détecter par un WAF ou un IDS

> La reconnaissance via archives web est l'une des techniques les plus discrètes. Tu collectes des informations sans jamais interagir directement avec la cible.
{: .prompt-tip}

### Exemple pratique : HackTheBox

Pour illustrer, j'ai voulu voir à quoi ressemblait HackTheBox à ses débuts. En entrant `hackthebox.com` dans la Wayback Machine et en sélectionnant la première capture disponible, j'ai pu voir le site tel qu'il était le **10 juin 2017 à 04h23:01**.

**Ce que j'ai observé :**
- Design complètement différent
- Moins de fonctionnalités
- Structure de navigation plus simple
- Anciennes pages de lab

C'est fascinant de voir l'évolution d'une plateforme au fil du temps. En reconnaissance, cette même approche permet de comprendre l'historique et les choix techniques d'une cible.

### Ma méthodologie avec la Wayback Machine

Voici comment j'intègre les archives dans ma reconnaissance :

**1. Capture initiale**

```
https://web.archive.org/web/*/target.com
```

Je regarde la timeline complète pour voir la fréquence d'archivage et identifier les périodes clés.

**2. Analyse de la première version**

Je commence toujours par la **première capture disponible** - c'est souvent là qu'on trouve le plus de négligences de sécurité.

**3. Comparaison de versions clés**

Je sélectionne 3-5 snapshots espacés dans le temps et je les compare pour identifier les changements majeurs.

**4. Recherche de ressources spécifiques**

```
https://web.archive.org/web/*/target.com/admin*
https://web.archive.org/web/*/target.com/*.php
https://web.archive.org/web/*/target.com/backup*
```

J'utilise des wildcards pour chercher des patterns spécifiques.

**5. Téléchargement pour analyse offline**

Pour des analyses approfondies, je télécharge des snapshots entiers et les examine localement.

### Ressources pour aller plus loin

- [Internet Archive Wayback Machine](https://web.archive.org/) - L'outil principal
- [Archive.today](https://archive.today/) - Alternative pour des captures récentes
- [Wayback Machine API](https://archive.org/help/wayback_api.php) - Pour automatiser les requêtes

> **Astuce professionnelle** : Combine la Wayback Machine avec des outils comme `waybackurls` pour extraire automatiquement toutes les URLs historiques d'un domaine.
{: .prompt-tip}

### Ce que j'ai appris

Les archives web ont transformé ma façon de faire de la reconnaissance. **Le passé d'un site en dit long sur son présent.**

**Mes takeaways principaux :**
- Toujours vérifier les archives avant de scanner un site activement
- Les anciennes versions révèlent souvent plus que la version actuelle
- La reconnaissance passive via archives est indétectable
- Documenter l'évolution temporelle d'une cible enrichit l'analyse

La Wayback Machine n'est pas juste un outil de nostalgie - c'est un **instrument de reconnaissance essentiel** qui révèle ce que les cibles préfèrent oublier.

### Questions

**How many Pen Testing Labs did HackTheBox have on the 8th August 2018? Answer with an integer, eg 1234.**

**Réponse :** `74`

**How many members did HackTheBox have on the 10th June 2017? Answer with an integer, eg 1234.**

**Réponse :** `3054`

**Going back to March 2002, what website did the facebook.com domain redirect to? Answer with the full domain, eg http://www.facebook.com/**

**Réponse :** `http://site.aboutface.com/`

**According to the paypal.com website in October 1999, what could you use to "beam money to anyone"? Answer with the product name, eg My Device, remove the ™ from your answer.**

**Réponse :** `Palm 0rganizer`

**Going back to November 1998 on google.com, what address hosted the non-alpha "Google Search Engine Prototype" of Google? Answer with the full address, eg http://google.com**

**Réponse :** `http://google.stanford.edu/`

**Going back to March 2000 on www.iana.org, when exacty was the site last updated? Answer with the date in the footer, eg 11-March-99**

**Réponse :** `17-December-99`

**According to wikipedia.com snapshot taken on February 9, 2003, how many articles were they already working on in the English version? Answer with the number they state without any commas, e.g., 100000, not 100,000.**

**Réponse :** `104155`

**Cours complété**

{% include comments.html %}