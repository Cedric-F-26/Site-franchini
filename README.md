# Site Franchini - Concessionnaire Deutz-Fahr

[![Déploiement Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvotre-utilisateur%2Fmon-site-web)

Site vitrine officiel de Franchini, concessionnaire agréé Deutz-Fahr. Site statique simple déployé sur Vercel.

## 🚀 Fonctionnalités

- Site vitrine responsive
- Page d'accueil avec coordonnées
- Page d'erreur 404 personnalisée
- Déploiement continu avec Vercel

## 🛠 Configuration requise

- Aucune installation requise localement
- Un compte Vercel pour le déploiement

## 🚀 Démarrage local

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/mon-site-web.git
   cd mon-site-web/Site-franchini
   ```

2. **Ouvrir le site**
   - Double-cliquez simplement sur le fichier `public/index.html` pour l'ouvrir dans votre navigateur
   - Ou utilisez un serveur local comme `live-server` si vous en avez un installé

## 🚀 Déploiement sur Vercel

1. Poussez votre code sur GitHub, GitLab ou Bitbucket
2. Connectez-vous à [Vercel](https://vercel.com)
3. Cliquez sur "New Project"
4. Importez votre dépôt
5. Laissez les paramètres par défaut (Vercel détectera automatiquement la configuration)
6. Cliquez sur "Deploy"

Votre site sera déployé et accessible immédiatement !

## 🏗 Déploiement

### Vercel (Recommandé)

1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez votre dépôt GitHub
3. Configurez les variables d'environnement dans les paramètres du projet Vercel
4. Définissez les paramètres de build :
   - Build Command: `bundle exec jekyll build`
   - Output Directory: `_site`
5. Déployez !

### GitHub Pages

1. Activez GitHub Pages pour ce dépôt dans les paramètres GitHub
2. Configurez l'action de déploiement dans `.github/workflows/gh-pages.yml`
3. Poussez vos modifications sur la branche `main`

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
# Configuration Supabase
NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-supabase
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Configuration du site
SITE_TITLE="Franchini - Concessionnaire Deutz-Fahr"
SITE_URL=https://votre-domaine.vercel.app
SITE_DESCRIPTION="Concessionnaire officiel Deutz-Fahr - Matériel agricole neuf et d'occasion"
SITE_EMAIL="contact@franchini.fr"

# Configuration Google Analytics (optionnel)
NEXT_PUBLIC_GA_TRACKING_ID="UA-XXXXXXXXX-X"
```

## 📁 Structure du projet

```
Site-franchini/
├── _data/               # Données du site (YAML/JSON)
│   └── supabase.yml     # Configuration Supabase
├── _includes/           # Partiels HTML réutilisables
│   ├── footer.html      # Pied de page
│   └── header.html      # En-tête du site
├── _layouts/            # Modèles de page
│   └── default.html     # Modèle par défaut
├── assets/              # Fichiers statiques (CSS, JS, images)
│   ├── css/            # Feuilles de style
│   ├── js/             # Scripts JavaScript
│   └── images/         # Images du site
├── admin/               # Interface d'administration Netlify CMS
├── pages/               # Pages du site (HTML/Markdown)
├── .env.example        # Exemple de configuration d'environnement
├── .gitignore          # Fichiers à ignorer par Git
├── _config.yml         # Configuration Jekyll
├── package.json        # Dépendances Node.js
└── vercel.json         # Configuration Vercel
```

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos modifications (`git commit -m 'Ajouter une fonctionnalité incroyable'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Jekyll](https://jekyllrb.com/)
- [Vercel](https://vercel.com/)
- [Supabase](https://supabase.com/)
- [Deutz-Fahr](https://www.deutz-fahr.com/)

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

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter :

- Email : [contact@franchini.fr](mailto:contact@franchini.fr)
- Site web : [https://franchini.fr](https://franchini.fr)

---

Développé avec ❤️ par l'équipe Franchini
