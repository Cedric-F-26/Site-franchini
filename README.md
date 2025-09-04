# Site Web Franchini

Site web officiel de Franchini, concessionnaire de matériel agricole.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Développement](#développement)
- [Construction](#construction)
- [Déploiement](#déploiement)
- [Structure du projet](#structure-du-projet)
- [Contribuer](#contribuer)
- [Licence](#licence)

## 🚀 Prérequis

- Node.js 16.x ou supérieur
- Ruby 2.7.x ou supérieur
- Bundler 2.x
- Git

## ⚙️ Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/site-franchini.git
   cd site-franchini
   ```

2. Installer les dépendances Ruby :
   ```bash
   bundle install
   ```

3. Installer les dépendances Node.js :
   ```bash
   npm install
   ```

## 🛠 Développement

Pour lancer le serveur de développement :

```bash
bundle exec jekyll serve --livereload
```

Le site sera disponible à l'adresse : [http://localhost:4000](http://localhost:4000)

## 🏗 Construction

Pour construire le site pour la production :

```bash
bundle exec jekyll build
```

Les fichiers générés seront disponibles dans le dossier `_site`.

## 🚀 Déploiement

Le site peut être déployé sur Vercel, Netlify ou tout autre service d'hébergement prenant en charge Jekyll.

### Déploiement sur Vercel

1. Installer l'interface en ligne de commande Vercel :
   ```bash
   npm install -g vercel
   ```

2. Déployer :
   ```bash
   vercel
   ```

## 📂 Structure du projet

```
.
├── _config.yml       # Configuration Jekyll
├── _data/            # Données du site
├── _includes/        # Partiels HTML réutilisables
├── _layouts/         # Modèles de mise en page
├── _posts/           # Articles de blog
├── _sass/            # Fichiers SCSS
├── assets/           # Fichiers statiques (CSS, JS, images)
│   ├── css/          # Feuilles de style
│   ├── js/           # Scripts JavaScript
│   └── images/       # Images
├── pages/            # Pages du site
└── index.md          # Page d'accueil
```

## 🛠 Technologies utilisées

- [Jekyll](https://jekyllrb.com/) - Générateur de site statique
- [Sass](https://sass-lang.com/) - Préprocesseur CSS
- [JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript) - Langage de programmation
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [GitHub Pages](https://pages.github.com/) - Hébergement

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Fork le projet
2. Crée une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committe vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter à [contact@franchini.fr](mailto:contact@franchini.fr)

---

<p align="center">
  <a href="https://franchini.fr" target="_blank">
    <img src="assets/images/logo/logo.png" alt="Logo Franchini" width="200">
  </a>
</p>

<p align="center">
  <a href="https://franchini.fr">Site Web</a> ·
  <a href="https://facebook.com/franchini">Facebook</a> ·
  <a href="https://twitter.com/franchini">Twitter</a> ·
  <a href="https://linkedin.com/company/franchini">LinkedIn</a>
</p>

<!-- Trigger Vercel build -->