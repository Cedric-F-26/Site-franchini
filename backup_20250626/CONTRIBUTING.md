# Guide de contribution

Merci de votre intérêt pour contribuer à notre projet ! Ce document vous guidera à travers le processus de contribution.

## 📋 Table des matières

- [Code de conduite](#-code-de-conduite)
- [Comment contribuer](#-comment-contribuer)
  - [Signaler un bug](#-signaler-un-bug)
  - [Proposer une amélioration](#-proposer-une-amélioration)
  - [Soumettre une pull request](#-soumettre-une-pull-request)
- [Structure du projet](#-structure-du-projet)
- [Conventions de code](#-conventions-de-code)
- [Tests](#-tests)
- [Questions](#-questions)

## ✨ Code de conduite

Ce projet et toute la communauté qui l'entoure sont régis par notre [Code de Conduite](CODE_OF_CONDUCT.md). En participant, vous êtes tenu de respecter ce code.

## 🚀 Comment contribuer

### 🐛 Signaler un bug

1. **Vérifiez les problèmes existants** - Assurez-vous que le bug n'a pas déjà été signalé.
2. **Créez un nouveau ticket** - Si le bug n'existe pas encore, créez un nouveau ticket avec une description claire et détaillée.
3. **Incluez des détails** :
   - Étapes pour reproduire le bug
   - Comportement attendu vs. comportement actuel
   - Captures d'écran si possible
   - Version du navigateur/système d'exploitation

### 💡 Proposer une amélioration

1. **Vérifiez les suggestions existantes** - Vérifiez si une amélioration similaire n'a pas déjà été proposée.
2. **Ouvrez une issue** - Décrivez votre proposition en détail, en expliquant pourquoi elle serait utile.
3. **Attendez la validation** - L'équipe examinera votre suggestion et vous donnera son avis.

### 🔄 Soumettre une pull request

1. **Créez une branche** - Utilisez une branche descriptive : `git checkout -b feature/nouvelle-fonctionnalité`
2. **Commitez vos modifications** - Utilisez des messages de commit clairs et descriptifs
3. **Poussez vos modifications** - `git push origin votre-branche`
4. **Ouvrez une pull request** - Remplissez le modèle de PR et décrivez vos modifications
5. **Répondez aux commentaires** - Soyez prêt à apporter des modifications si nécessaire

## 🏗 Structure du projet

```
.
├── _config.yml          # Configuration principale
├── _data/               # Données structurées
├── _includes/           # Partiels HTML
├── _layouts/            # Modèles de mise en page
├── _sass/               # Styles SCSS
├── assets/              # Fichiers statiques
│   ├── css/            # Feuilles de style
│   ├── js/             # Scripts JavaScript
│   └── images/         # Images
├── pages/               # Pages du site
└── _site/              # Dossier de sortie (généré)
```

## 📝 Conventions de code

### HTML

- Utilisez une indentation de 2 espaces
- Incluez des attributs alt pour toutes les images
- Utilisez des balises sémantiques (header, nav, main, section, article, footer)

### CSS/SCSS

- Suivez la méthodologie BEM pour les noms de classe
- Utilisez des variables pour les couleurs, les polices et les espacements
- Groupez les propriétés par catégorie (positionnement, dimensions, typographie, etc.)

### JavaScript

- Utilisez des noms de variables et de fonctions descriptifs
- Commentez le code complexe
- Suivez les bonnes pratiques ES6+

## 🧪 Tests

Avant de soumettre une pull request, assurez-vous que :

1. Tous les tests passent : `bundle exec jekyll build`
2. Le code est bien formaté
3. Les fonctionnalités existantes n'ont pas été cassées

## ❓ Questions

Pour toute question, vous pouvez :
- Ouvrir une issue sur GitHub
- Nous contacter à contact@franchini.fr

Merci de votre contribution ! 🙌
