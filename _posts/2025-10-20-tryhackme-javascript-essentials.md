---
title: "TryHackMe - JavaScript Essentials"
date: 2025-10-20 15:20:00 +0200
categories: [TryHackMe, Learning]
tags: [javascript, vulnerabilities, web, xss, obfuscation]
description: "Write-up de la room JavaScript Essentials qui nous apprend les vulnérabilités dans l'un des piliers des langages web"
image:
  path: /assets/img/posts/tryhackme-javascript.png
  alt: "JavaScript Essentials"
---

## Informations sur la room

JavaScript (JS) est un langage de script populaire qui permet aux développeurs web d'ajouter des fonctionnalités interactives aux sites web contenant du HTML et du CSS. Une fois les éléments HTML créés, vous pouvez ajouter des fonctionnalités dynamiques telles que la validation de formulaires, les actions onClick, les animations et bien plus encore grâce à JavaScript.

L'apprentissage de ce langage est tout aussi important que celui du HTML et du CSS, car il constitue le troisième pilier fondamental du développement web. Les scripts JS sont principalement utilisés avec le HTML pour créer des expériences utilisateur riches et interactives.

**Lien :** [JavaScript Essentials](https://tryhackme.com/room/javascriptessentials)

## Objectifs d'apprentissage

Cette room couvre les compétences suivantes :

- Comprendre les bases de JavaScript et sa syntaxe
- Intégrer JavaScript dans des pages HTML
- Identifier et exploiter les vulnérabilités des fonctions de dialogue
- Contourner les instructions de contrôle de flux
- Analyser et déobfusquer des fichiers JavaScript minifiés
- Adopter les meilleures pratiques de sécurité

---

## Solutions des tâches

### Task 1 - Introduction

Lancez la machine virtuelle pour commencer l'apprentissage de JavaScript et de ses vulnérabilités potentielles.

---

### Task 2 - Essential Concepts

#### Variables en JavaScript

Les variables sont des conteneurs permettant de stocker des valeurs de données. En JavaScript, elles fonctionnent comme des boîtes étiquetées : vous y placez des données et vous leur donnez un nom pour pouvoir les retrouver facilement.

**Trois façons de déclarer des variables :**

- **`var`** : Portée fonctionnelle (ancienne méthode, moins recommandée)
- **`let`** : Portée de bloc (moderne, recommandée)
- **`const`** : Portée de bloc, valeur constante (ne peut pas être réassignée)

> La principale différence entre `var` et `let`/`const` réside dans leur portée. `var` a une portée fonctionnelle, ce qui peut causer des bugs subtils, tandis que `let` et `const` ont une portée de bloc, offrant un meilleur contrôle.
{: .prompt-info }

**Exemple de déclaration :**

```javascript
let userName = "Alice";      // Variable modifiable
const maxAttempts = 3;       // Constante immuable
var legacyVar = "old style"; // Ancienne méthode
```

#### Types de données en JavaScript

JavaScript supporte plusieurs types de données primitifs :

- **`string`** : Chaînes de caractères (`"Hello"`, `'World'`)
- **`number`** : Nombres entiers et décimaux (`42`, `3.14`)
- **`boolean`** : Valeurs booléennes (`true`, `false`)
- **`null`** : Absence intentionnelle de valeur
- **`undefined`** : Variable déclarée mais non initialisée
- **`object`** : Structures de données complexes (objets, tableaux)

#### Fonctions en JavaScript

Les fonctions permettent de regrouper du code réutilisable. Voici un exemple de fonction qui affiche un résultat :

```javascript
<script>
    function PrintResult(rollNum) {
        alert("Username with roll number " + rollNum + " has passed the exam");
        // Logique supplémentaire pour afficher le résultat
    }
    
    // Appel de la fonction
    for (let i = 0; i < 100; i++) {
        PrintResult(rollNumbers[i]);
    }
</script>
```

**Composants d'une fonction :**

- **Nom de la fonction** : `PrintResult`
- **Paramètres** : `rollNum` (données d'entrée)
- **Corps de la fonction** : Code entre les accolades `{}`
- **Appel de fonction** : `PrintResult(value)`

#### Boucles en JavaScript

Les boucles permettent d'exécuter du code de manière répétée tant qu'une condition est vraie.

**Exemple de boucle `for` :**

```javascript
// Fonction pour afficher le résultat d'un étudiant
function PrintResult(rollNum) {
    alert("Username with roll number " + rollNum + " has passed the exam");
    // Logique supplémentaire pour afficher le résultat
}

// Boucle appelant la fonction 100 fois
for (let i = 0; i < 100; i++) {
    PrintResult(rollNumbers[i]); // Appelée 100 fois
}
```

> Les boucles sont essentielles en programmation pour automatiser les tâches répétitives et traiter des collections de données efficacement.
{: .prompt-tip }

---

#### Question et résolution

**Question : What term allows you to run a code block multiple times as long as it is a condition?**

Le terme qui permet d'exécuter un bloc de code plusieurs fois tant qu'une condition est vraie est une boucle.

**Réponse :** `loop`

---

### Task 3 - JavaScript Overview

#### Comprendre l'exécution JavaScript

JavaScript est un langage interprété, ce qui signifie que le code est exécuté ligne par ligne par le navigateur, sans nécessiter de compilation préalable.

**Exemple de code JavaScript :**

![Exemple JavaScript](https://tryhackme-images.s3.amazonaws.com/user-uploads/62a7685ca6e7ce005d3f3afe/room-content/62a7685ca6e7ce005d3f3afe-1728735438271.png)

**Analyse du code :**

```javascript
let x = 5;
let y = x * 2;
let result = "The result is: " + y;
document.write(result);
```

Si `x = 5`, alors `y = 5 * 2 = 10`, donc le résultat affiché sera "The result is: 10".

---

#### Questions et résolutions

**Question 1 : What is the code output if the value of x is changed to 10?**

Si nous changeons la valeur de `x` de 5 à 10 :

```javascript
let x = 10;
let y = x * 2;  // y = 10 * 2 = 20
let result = "The result is: " + y;
```

Le résultat sera : "The result is: 20"

**Réponse :** `The result is: 20`

---

**Question 2 : Is JavaScript a compiled or interpreted language?**

JavaScript est exécuté directement par le navigateur sans compilation préalable, ligne par ligne.

**Réponse :** `interpreted`

---

### Task 4 - Integrating JavaScript in HTML

#### Méthodes d'intégration JavaScript

Il existe deux principales méthodes pour intégrer JavaScript dans HTML :

**1. JavaScript interne (Internal)**

Le code JavaScript est placé directement dans le fichier HTML à l'aide de la balise `<script>`.

**Exercice pratique :**

Créez un fichier `internal.html` avec le contenu suivant :

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Internal JS</title>
</head>
<body>
    <h1>Addition of Two Numbers</h1>
    <p id="result"></p>

    <script>
        let x = 5;
        let y = 10;
        let result = x + y;
        document.getElementById("result").innerHTML = "The result is: " + result;
    </script>
</body>
</html>
```

**Accès au fichier :**

Ouvrez le fichier dans un navigateur avec l'URL : `file:///home/ubuntu/Desktop/internal.html`

> Le JavaScript interne est pratique pour de petits scripts, mais peut rendre le HTML difficile à maintenir pour les projets importants.
{: .prompt-info }

**2. JavaScript externe (External)**

Le code JavaScript est placé dans un fichier séparé `.js` et lié au HTML via l'attribut `src`.

**Exemple :**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>External JS</title>
    <script src="script.js"></script>
</head>
<body>
    <h1>External JavaScript Example</h1>
</body>
</html>
```

**Avantages du JavaScript externe :**

- Réutilisabilité du code sur plusieurs pages
- Séparation claire entre structure (HTML) et comportement (JS)
- Meilleure mise en cache par le navigateur
- Code plus maintenable et organisé

---

#### Questions et résolutions

**Question 1 : Which type of JavaScript integration places the code directly within the HTML document?**

La méthode qui place le code directement dans le document HTML est l'intégration interne.

**Réponse :** `internal`

---

**Question 2 : Which method is better for reusing JS across multiple web pages?**

Pour réutiliser du code JavaScript sur plusieurs pages, la méthode externe est préférable.

**Réponse :** `external`

---

**Question 3 : What is the name of the external JS file that is being called by external_test.html?**

En analysant le fichier `external_test.html`, on peut identifier le fichier JavaScript externe appelé.

**Réponse :** `thm_external.js`

---

**Question 4 : What attribute links an external JS file in the "script" tag?**

L'attribut qui lie un fichier JavaScript externe dans la balise `<script>` est `src`.

**Réponse :** `src`

---

### Task 5 - Abusing Dialogue Functions

#### Fonctions de dialogue JavaScript

JavaScript fournit des fonctions intégrées pour interagir avec les utilisateurs via des boîtes de dialogue. Bien qu'utiles, ces fonctions peuvent être exploitées pour créer des expériences utilisateur désagréables ou malveillantes.

#### Alert - Affichage de messages

La fonction `alert()` affiche un message dans une boîte de dialogue modale.

**Exemple :**

```javascript
alert("Bienvenue sur notre site !");
```

#### Prompt - Collecte de données

La fonction `prompt()` affiche une boîte de dialogue avec un champ de saisie et retourne la valeur entrée par l'utilisateur.

**Exemple :**

```javascript
let name = prompt("What is your name?");
alert("Hello " + name);
```

> La fonction `prompt()` retourne `null` si l'utilisateur clique sur "Annuler", il est donc important de gérer ce cas dans votre code.
{: .prompt-tip }

#### Confirm - Obtenir une confirmation

La fonction `confirm()` affiche une boîte de dialogue avec deux boutons : "OK" et "Annuler". Elle retourne `true` si l'utilisateur clique sur "OK" et `false` s'il clique sur "Annuler".

**Exemple :**

```javascript
let userChoice = confirm("Voulez-vous continuer ?");
if (userChoice) {
    alert("Vous avez choisi de continuer");
} else {
    alert("Vous avez annulé");
}
```

![Exemple Confirm](https://tryhackme-images.s3.amazonaws.com/user-uploads/62a7685ca6e7ce005d3f3afe/room-content/62a7685ca6e7ce005d3f3afe-1728802070358.png)

#### Comment les pirates exploitent ces fonctionnalités

Les attaquants peuvent abuser des fonctions de dialogue pour créer des expériences désagréables ou malveillantes.

**Exemple d'exploitation :**

Créez un fichier `invoice.html` avec le code suivant :

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Hacked</title>
</head>
<body>
    <script>
        for (let i = 0; i < 3; i++) {
            alert("Hacked");
        }
    </script>
</body>
</html>
```

Lorsque vous ouvrez ce fichier, le message "Hacked" s'affiche trois fois de suite, créant une expérience utilisateur désagréable.

![Message Hacked](https://tryhackme-images.s3.amazonaws.com/user-uploads/62a7685ca6e7ce005d3f3afe/room-content/62a7685ca6e7ce005d3f3afe-1728802312967.png)

> Ce type d'attaque, bien que simple, peut être utilisé dans des scénarios de phishing ou pour perturber l'expérience utilisateur. Dans des cas extrêmes, des boucles infinies peuvent bloquer complètement le navigateur.
{: .prompt-warning }

**Vecteurs d'attaque possibles :**

- **Boucles infinies d'alertes** : Bloquer le navigateur de la victime
- **Phishing via prompt** : Collecter des informations sensibles
- **Redirection malveillante** : Combiner `confirm()` avec des redirections
- **Déni de service** : Épuiser les ressources du navigateur

---

#### Questions et résolutions

**Question 1 : In the file invoice.html, how many times does the code show the alert Hacked?**

En analysant le code de `invoice.html`, la boucle `for` s'exécute 3 fois, donc l'alerte s'affiche 3 fois.

**Réponse :** `3`

---

**Question 2 : Which function is used to get input from the user in the form of a dialogue box?**

La fonction qui permet d'obtenir une saisie de l'utilisateur via une boîte de dialogue est `prompt()`.

**Réponse :** `prompt`

---

**Question 3 : If the user enters Tesla, what value is stored in the carName variable in carName= prompt("What is your car name?")?**

Lorsque l'utilisateur entre "Tesla" dans le prompt, cette valeur est directement stockée dans la variable `carName`.

**Réponse :** `Tesla`

---

### Task 6 - Bypassing Control Flow Statements

#### Comprendre le flux de contrôle

Le flux de contrôle en JavaScript détermine l'ordre dans lequel les instructions sont exécutées en fonction de certaines conditions. JavaScript fournit plusieurs structures de contrôle :

**Instructions conditionnelles :**
- `if...else` : Exécuter du code selon une condition
- `switch` : Sélection parmi plusieurs options

**Boucles :**
- `for` : Répétition avec compteur
- `while` : Répétition tant qu'une condition est vraie
- `do...while` : Exécution d'au moins une itération

#### Instructions conditionnelles en action

**Exemple de vérification d'âge :**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Age Verification</title>
</head>
<body>
    <h1>Age Verification</h1>
    <p id="message"></p>

    <script>
        let age = prompt("What is your age?");
        if (age >= 18) {
            document.getElementById("message").innerHTML = "You are an adult.";
        } else {
            document.getElementById("message").innerHTML = "You are a minor.";
        }
    </script>
</body>
</html>
```

![Vérification d'âge](https://tryhackme-images.s3.amazonaws.com/user-uploads/62a7685ca6e7ce005d3f3afe/room-content/62a7685ca6e7ce005d3f3afe-1728803417509.png)

**Fonctionnement :**

1. L'utilisateur saisit son âge via `prompt()`
2. Le code vérifie si `age >= 18`
3. Affiche le message approprié selon la condition

#### Contournement des formulaires de connexion

Les formulaires de connexion JavaScript côté client peuvent être facilement contournés car tout le code est visible dans le navigateur.

**Exemple de formulaire vulnérable :**

Fichier `login.html` :

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Login Page</title>
</head>
<body>
    <h2>Login Authentication</h2>

    <script>
        let username = prompt("Enter your username:");
        let password = prompt("Enter your password:");

        if (username === "admin" && password === "ComplexPassword") {
            document.write("You are successfully authenticated!");
        } else {
            document.write("Authentication failed. Incorrect username or password.");
        }
    </script>
</body>
</html>
```

**Vulnérabilités identifiées :**

1. **Code visible** : Les credentials sont stockés en clair dans le code source
2. **Validation côté client uniquement** : Peut être contournée via la console développeur
3. **Pas de protection serveur** : Aucune vérification backend

> Ne jamais se fier uniquement à la validation JavaScript côté client pour la sécurité. Les credentials doivent toujours être vérifiés côté serveur.
{: .prompt-danger }

**Méthodes de contournement :**

1. **Lecture du code source** : Ouvrir l'inspecteur et lire les credentials
2. **Console développeur** : Modifier les variables directement
3. **Désactiver JavaScript** : Contourner complètement la validation
4. **Interception réseau** : Analyser les requêtes avec les outils développeur

---

#### Questions et résolutions

**Question 1 : What is the message displayed if you enter the age less than 18?**

D'après le code de vérification d'âge, si l'utilisateur entre un âge inférieur à 18, le message affiché est "You are a minor."

**Réponse :** `You are a minor.`

---

**Question 2 : What is the password for the user admin?**

En analysant le code source de `login.html`, nous pouvons voir directement les credentials :

```javascript
if (username === "admin" && password === "ComplexPassword") {
```

Le mot de passe pour l'utilisateur "admin" est visible en clair dans le code.

**Réponse :** `ComplexPassword`

---

### Task 7 - Exploring Minified Files

#### Qu'est-ce que la minification ?

La minification en JavaScript est le processus de compression des fichiers JS en supprimant tous les caractères inutiles pour réduire la taille du fichier et améliorer les performances.

**Éléments supprimés lors de la minification :**

- Espaces et indentations
- Sauts de ligne
- Commentaires
- Noms de variables raccourcis

**Avantages de la minification :**

- Réduction de la taille des fichiers (jusqu'à 50-70%)
- Temps de chargement des pages plus rapides
- Moins de bande passante consommée

#### Obfuscation JavaScript

L'obfuscation va plus loin que la minification en rendant le code intentionnellement difficile à comprendre.

**Techniques d'obfuscation :**

- Renommage des variables avec des noms dénués de sens
- Insertion de code factice
- Transformation des chaînes de caractères
- Encodage des valeurs

> La minification est destinée à l'optimisation des performances, tandis que l'obfuscation vise à protéger le code contre la rétro-ingénierie.
{: .prompt-info }

#### Exercice pratique

**Étape 1 : Créer le fichier HTML**

Créez un fichier `hello.html` :

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Obfuscated JS Code</title>
</head>
<body>
    <h1>Obfuscated JS Code</h1>
    <script src="hello.js"></script>
</body>
</html>
```

**Étape 2 : Créer le fichier JavaScript**

Créez un fichier `hello.js` :

```javascript
function hi() {
  alert("Welcome to THM");
}
hi();
```

**Étape 3 : Tester le code**

Double-cliquez sur `hello.html` pour l'ouvrir dans Google Chrome. Une alerte affiche "Welcome to THM".

**Étape 4 : Inspecter le code source**

Ouvrez les outils développeur (F12), allez dans l'onglet "Sources" et localisez `hello.js`.

![Code source](https://tryhackme-images.s3.amazonaws.com/user-uploads/62a7685ca6e7ce005d3f3afe/room-content/62a7685ca6e7ce005d3f3afe-1728811321758.png)

#### Obfuscation du code

**Étape 5 : Obfusquer le code**

Utilisez le site [javascript-obfuscator.com](https://obfuscator.io/) pour obfusquer votre code.

![Outil d'obfuscation](https://tryhackme-images.s3.amazonaws.com/user-uploads/62a7685ca6e7ce005d3f3afe/room-content/62a7685ca6e7ce005d3f3afe-1728812285853.png)

**Code obfusqué résultant :**

```javascript
(function(_0x114713,_0x2246f2){var _0x51a830=_0x33bf,_0x4ce60b=_0x114713();while(!![]){try
{var _0x51ecd3=-parseInt(_0x51a830(0x88))/(-0x1bd3+-0x9a+0x2*0xe37)*(parseInt(_0x51a830(0x94))/
(-0x15c1+-0x2*-0x3b3+0xe5d))+parseInt(_0x51a830(0x8d))/(0x961*0x1+0x2*0x4cb+0x4bd*-0x4)*
(-parseInt(_0x51a830(0x97))/(-0x22b3+0x16e9+0x1*0xbce))+parseInt(_0x51a830(0x89))/
(-0x631+0x20cd+0x8dd*-0x3)*(-parseInt(_0x51a830(0x95))/(-0x8fc+0x161+0x7a1))+-
parseInt(_0x51a830(0x93))/(-0x1c38+0x193+0x1aac)*(parseInt(_0x51a830(0x8e))/
(-0x1*-0x17a6+-0x167e+-0x3*0x60))+-parseInt(_0x51a830(0x91))/(-0x2*-0x1362+-0x4a8*0x5+-0xf73)*
(parseInt(_0x51a830(0x8b))/(-0xb31*0x2+0x493*0x5+0x1*-0x73))+parseInt(_0x51a830(0x8f))/
(-0x257a+-0x1752+0x3cd7)+parseInt(_0x51a830(0x90))/(-0x2244+-0x15f9+0x3849);if(_0x51ecd3
===_0x2246f2)break;else _0x4ce60b['push'](_0x4ce60b['shift']());}catch(_0x38d15c)
{_0x4ce60b['push'](_0x4ce60b['shift']());}}}(_0x11ed,-0x17d11*-0x1+0x2*0x2e27+0x100f*0x17));
function hi(){var _0x48257e=_0x33bf,_0xab1127={'xMVHQ':function(_0x4eefa0,_0x4e5f74)
{return _0x4eefa0(_0x4e5f74);},'FvtWc':_0x48257e(0x96)+_0x48257e(0x92)};_0xab1127[_0x48257e(0x8c)
](alert,_0xab1127[_0x48257e(0x8a)]);}function _0x33bf(_0xb07259,_0x5949fe){var _0x3a386b
=_0x11ed();return _0x33bf=function(_0x4348ee,_0x1bbf73){_0x4348ee=_0x4348ee-(0x11f7+-
0x1*0x680+-0x3a5*0x3);var _0x423ccd=_0x3a386b[_0x4348ee];return _0x423ccd;},_0x33bf
(_0xb07259,_0x5949fe);}function _0x11ed(){var _0x4c8fa8=['7407EbJESQ','\x20THM',
'2700698TTmqXC','10ILFtfZ','190500QONgph','Welcome\x20to',
'4492QOmepo','21623eEAyaP','65XMlsxw','FvtWc','2410qfnGAy','xMVHQ','321PfYXZg',
'8XBaIAe','1946483GviJfa','15167592PYYhTN'];_0x11ed=function(){return _0x4c8fa8;};return _0x11ed();}hi();
```

Le code est maintenant complètement illisible mais fonctionne exactement de la même manière.

#### Déobfuscation

**Étape 6 : Déobfusquer le code**

Utilisez le site [deobfuscate.io](https://deobfuscate.io/) pour analyser le code obfusqué.

![Outil de déobfuscation](https://tryhackme-images.s3.amazonaws.com/user-uploads/62a7685ca6e7ce005d3f3afe/room-content/62a7685ca6e7ce005d3f3afe-1728813246997.png)

> Bien que l'obfuscation rende le code plus difficile à lire, elle ne fournit pas une sécurité absolue. Des outils de déobfuscation peuvent souvent recréer une version lisible du code.
{: .prompt-warning }

---

#### Questions et résolutions

**Question 1 : What is the alert message shown after running the file hello.html?**

D'après le code JavaScript dans `hello.js`, l'alerte affiche "Welcome to THM".

**Réponse :** `Welcome to THM`

---

**Question 2 : What is the value of the age variable in the following obfuscated code snippet?**

Code obfusqué : `age=0x1*0x247e+0x35*-0x2e+-0x1ae3;`

En utilisant un outil de déobfuscation ou en calculant manuellement :

- `0x247e` = 9342 (hexadécimal vers décimal)
- `0x35` = 53
- `0x2e` = 46
- `0x1ae3` = 6883

Calcul : `1 * 9342 + 53 * (-46) + (-6883) = 9342 - 2438 - 6883 = 21`

Ou plus simplement, en collant le code dans la console développeur ou sur deobfuscate.io :

```javascript
age = 21;
```

**Réponse :** `21`

---

### Task 8 - Best Practices

#### Principes de sécurité JavaScript

Pour développer des applications web sécurisées, il est essentiel de suivre certaines meilleures pratiques.

**1. Ne jamais se fier uniquement à la validation côté client**

La validation JavaScript peut être facilement contournée. Toute donnée importante doit être validée côté serveur.

**Mauvaise pratique :**
```javascript
// Validation uniquement côté client
if (password === "admin123") {
    grantAccess();
}
```

**Bonne pratique :**
```javascript
// Envoi des credentials au serveur pour validation
fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
})
.then(response => response.json())
.then(data => {
    if (data.authenticated) {
        grantAccess();
    }
});
```

**2. Éviter d'inclure des bibliothèques non fiables**

N'incluez que des bibliothèques provenant de sources réputées et vérifiées.

**Risques :**
- Code malveillant caché
- Vol de données utilisateur
- Injection de scripts malveillants

> Utilisez toujours des CDN officiels et vérifiez l'intégrité des fichiers avec SRI (Subresource Integrity).
{: .prompt-warning }

**3. Ne jamais coder en dur des secrets**

Les clés API, tokens d'authentification et autres secrets ne doivent jamais être stockés dans le code JavaScript.

**Mauvaise pratique :**
```javascript
const API_KEY = "sk_live_51Hxyz..."; // Visible par tous !
```

**Bonne pratique :**
- Utiliser des variables d'environnement côté serveur
- Implémenter un proxy backend pour les appels API
- Ne jamais exposer de credentials dans le code front-end

**4. Sanitiser les entrées utilisateur**

Toujours nettoyer et valider les données entrées par les utilisateurs pour prévenir les attaques XSS.

**5. Utiliser HTTPS**

Toujours servir les applications JavaScript via HTTPS pour protéger les données en transit.

**6. Implémenter une Content Security Policy (CSP)**

Définir une CSP stricte pour limiter les sources de scripts autorisées.

---

#### Question et résolution

**Question : Is it a good practice to blindly include JS in your code from any source (yea/nay)?**

Il n'est absolument pas recommandé d'inclure aveuglément du JavaScript provenant de sources non vérifiées, car cela peut introduire des vulnérabilités de sécurité critiques.

**Réponse :** `nay`

---

### Task 9 - Conclusion

Les points clés à retenir : ne jamais faire confiance à la validation JavaScript côté client, toujours vérifier les sources des bibliothèques tierces, et ne jamais stocker de secrets dans le code front-end. JavaScript est un outil puissant pour créer des expériences interactives, mais il doit être utilisé avec prudence et toujours complété par des contrôles côté serveur.

**Room complétée**

{% include comments.html %}