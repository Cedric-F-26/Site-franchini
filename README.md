# Franchini - Concessionnaire Deutz-Fahr

[![Build Status](https://img.shields.io/github/actions/workflow/status/votre-utilisateur/mon-site-web/jekyll.yml?branch=main)](https://github.com/votre-utilisateur/mon-site-web/actions)
[![GitHub license](https://img.shields.io/github/license/votre-utilisateur/mon-site-web)](https://github.com/votre-utilisateur/mon-site-web/blob/main/LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvotre-utilisateur%2Fmon-site-web)

Site web officiel de Franchini, concessionnaire agréé Deutz-Fahr, spécialisé dans la vente et la location de matériel agricole neuf et d'occasion. Construit avec [Jekyll](https://jekyllrb.com/), déployé sur Vercel avec intégration Supabase pour une gestion avancée des utilisateurs et du contenu.

## 🌟 Fonctionnalités

- **Site vitrine moderne et réactif**
- **Gestion de contenu sans tête** avec Supabase
- **Optimisé pour le référencement** (SEO)
- **Temps de chargement ultra-rapide**
- **Multilingue** (Français/Anglais)
- **Formulaire de contact sécurisé**
- **Blog intégré** pour les actualités et conseils

## 🚀 Démarrage rapide

### Prérequis

- Ruby 3.1.4 (recommandé)
- RubyGems (dernière version)
- GCC 10+ et Make (pour les extensions natives)
- Node.js 16+ (pour les assets frontend)
- Bundler 2.3+
- Git

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/mon-site-web.git
   cd mon-site-web/Site-franchini
   ```

2. **Configurer l'environnement**
   ```bash
   # Copier le fichier d'environnement d'exemple
   cp .env.example .env
   ```
   
   Puis éditez le fichier `.env` avec vos configurations personnalisées.

3. **Installer les dépendances**
   ```bash
   # Installer les gems Ruby
   bundle install --path vendor/bundle
   
   # Installer les dépendances Node (si nécessaire)
   npm install
   ```

4. **Démarrer le serveur de développement**
   ```bash
   bundle exec jekyll serve --livereload --incremental
   ```
   Le site sera disponible à l'adresse : http://localhost:4000

## 🏗 Structure du projet

```
.
├── _config.yml          # Configuration principale de Jekyll
├── _data/               # Données structurées du site (YAML/JSON)
│   └── supabase.yml     # Configuration Supabase
├── _includes/           # Partiels HTML réutilisables
│   ├── footer.html      # Pied de page
│   └── header.html      # En-tête du site
├── _layouts/            # Modèles de mise en page
│   └── default.html     # Modèle par défaut
├── _site/              # Dossier de sortie (généré automatiquement)
├── assets/             # Fichiers statiques (CSS, JS, images)
│   ├── css/            # Feuilles de style
│   ├── js/             # Scripts JavaScript
│   └── images/         # Images du site
├── pages/              # Pages du site (HTML/Markdown)
├── .env.example        # Exemple de configuration d'environnement
├── .gitignore          # Fichiers à ignorer par Git
├── Gemfile             # Dépendances Ruby
├── Gemfile.lock        # Verrouillage des versions des gems
├── package.json        # Dépendances Node.js
├── vercel.json         # Configuration Vercel
└── netlify.toml        # Configuration Netlify

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration Jekyll
JEKYLL_ENV=development

# Configuration du site
SITE_TITLE="Franchini - Concessionnaire Deutz-Fahr"
SITE_DESCRIPTION="Concessionnaire officiel Deutz-Fahr - Matériel agricole neuf et d'occasion"
SITE_URL="https://franchini.fr"
SITE_EMAIL="contact@franchini.fr"

# Configuration Supabase
NEXT_PUBLIC_SUPABASE_URL="https://votre-projet-supabase.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-cle-anon-supabase"

# Configuration Google Analytics
NEXT_PUBLIC_GA_TRACKING_ID="UA-XXXXXXXXX-X"
```

## 🚀 Déploiement

### Vercel (Recommandé)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvotre-utilisateur%2Fmon-site-web)

1. Cliquez sur le bouton "Deploy" ci-dessus
2. Connectez votre compte GitHub
3. Sélectionnez le dépôt
4. Configurez les variables d'environnement dans les paramètres du projet Vercel
5. Cliquez sur "Deploy"

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/votre-utilisateur/mon-site-web)

1. Cliquez sur le bouton "Deploy to Netlify" ci-dessus
2. Connectez votre compte GitHub
3. Configurez les paramètres de build :
   - Build command: `bundle exec jekyll build`
   - Publish directory: `_site`
4. Ajoutez les variables d'environnement nécessaires
5. Cliquez sur "Deploy site"

## 🔍 Référencement (SEO)

Le site est optimisé pour le référencement avec :

- Sitemap XML généré automatiquement
- Fichier robots.txt configuré
- Balises meta optimisées
- Données structurées Schema.org
- URLs propres et lisibles
- Redirections 301 pour les anciennes URLs
- Balises canoniques
- Optimisation des images
- Temps de chargement optimisé

## 📊 Analytics

Le site est configuré pour fonctionner avec :

- Google Analytics 4 (GA4)
- Google Tag Manager
- Facebook Pixel

## 🔒 Sécurité

- En-têtes de sécurité HTTP stricts
- Protection contre le clickjacking
- Protection XSS
- HSTS activé
- CSP (Content Security Policy) configuré
- Référent Policy
- Feature Policy
- Permissions Policy

## 📝 Licence

Ce projet est sous licence [MIT](LICENSE).

## 📝 Notes pour les développeurs

### Structure du carrousel
Le carrousel principal utilise la classe `.custom-carousel` et est configuré dans `assets/js/carousel.js`. Les styles associés se trouvent dans `assets/css/carousel.css`.

### Personnalisation
- Pour modifier les couleurs principales, éditez les variables CSS dans `assets/css/header.css`
- Pour ajouter des slides au carrousel, modifiez le tableau `carouselItems` dans `assets/js/carousel.js`
- Les images doivent être placées dans `assets/images/`

### Bonnes pratiques
- Toujours tester sur mobile après chaque modification
- Utiliser les outils de développement du navigateur pour le débogage
- Vérifier la console pour les erreurs JavaScript

## 🛠 Commandes utiles

### Développement

```bash
# Démarrer le serveur de développement avec rechargement automatique
bundle exec jekyll serve --livereload --incremental

# Construire le site pour la production
bundle exec jekyll build

# Nettoyer le dossier de build
bundle exec jekyll clean

# Vérifier les problèmes potentiels
bundle exec jekyll doctor
```

### Gestion des dépendances

```bash
# Mettre à jour les gems
bundle update

# Mettre à jour une gem spécifique
bundle update gem-name

# Vérifier les vulnérabilités de sécurité
bundle audit
```

### Tests et validation

```bash
# Tester le site localement
bundle exec htmlproofer ./_site --check-html --disable-external

# Valider le HTML
npx html-validate _site

# Vérifier les liens brisés
npx blc http://localhost:4000 -ro
```

### Optimisation

```bash
# Optimiser les images
npx imagemin 'assets/images/*' --out-dir=assets/images/optimized

# Minifier le CSS
npx cssnano assets/css/style.css assets/css/style.min.css

# Minifier le JavaScript
npx uglify-js assets/js/main.js -o assets/js/main.min.js
```

## 📦 Déploiement

### GitHub Pages

Le site est configuré pour être déployé sur GitHub Pages. Poussez simplement vos modifications sur la branche `main` ou `gh-pages`.

### Autres options d'hébergement

- **Netlify** : Configuration automatique avec le fichier `netlify.toml`
- **Vercel** : Configuration pour le déploiement continu
- **Hébergement partagé** : Utilisez `bundle exec jekyll build` et déployez le contenu du dossier `_site/`

## 🔒 Sécurité

- Ne stockez jamais d'informations sensibles dans `_config.yml`
- Utilisez des variables d'environnement pour les clés API et autres secrets

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos modifications (`git commit -m 'Ajouter une fonctionnalité incroyable'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence [MIT](LICENSE). Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter :

- Email : [contact@franchini.fr](mailto:contact@franchini.fr)
- Site web : [https://franchini.fr](https://franchini.fr)

---

Développé avec ❤️ par [Votre Nom] - [@votrepseudo](https://github.com/votrepseudo)
