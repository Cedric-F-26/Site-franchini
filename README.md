# Site Franchini - Concessionnaire Deutz-Fahr

## Développement Local

Ce projet utilise Jekyll, un générateur de site statique. Pour lancer le site en local, suivez ces étapes :

### Prérequis

1.  **Ruby** : Assurez-vous que Ruby est installé sur votre machine. Vous pouvez vérifier avec la commande `ruby -v`.
2.  **Bundler** : Installez Bundler, qui gère les dépendances du projet (les "gems").
    ```bash
    gem install bundler
    ```

### Installation

1.  Clonez le dépôt sur votre machine.
2.  Naviguez jusqu'au dossier du projet (`Site-franchini`).
3.  Installez les dépendances du projet avec Bundler :
    ```bash
    bundle install
    ```

### Lancer le serveur

Une fois les dépendances installées, vous pouvez lancer le serveur de développement Jekyll :

```bash
bundle exec jekyll serve
```

Le site sera alors accessible à l'adresse [http://127.0.0.1:4000/](http://127.0.0.1:4000/). Le serveur se rechargera automatiquement à chaque modification des fichiers.

**Note pour Windows :** Si vous rencontrez des problèmes avec certaines gems (comme `nokogiri`) lors du `bundle install`, consultez le `Gemfile` pour voir les dépendances spécifiques à Windows qui ont été ajoutées pour assurer la compatibilité.


[![Déploiement Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCedric-F-26%2FSite-franchini)

Site vitrine officiel de Franchini, concessionnaire agréé Deutz-Fahr. Site statique moderne avec des fonctionnalités avancées et une interface utilisateur réactive.

## 🎯 Améliorations récentes

- **Optimisation des performances** : Minification des fichiers CSS et JavaScript
- **Sécurité renforcée** : Gestion sécurisée des fichiers sensibles
- **Meilleur référencement** : Sitemap mis à jour avec toutes les pages importantes
- **Code plus propre** : Suppression des fichiers redondants et standardisation des chemins
- **Maintenance facilitée** : Scripts de build automatisés avec Gulp

## 🚀 Fonctionnalités

- Site vitrine responsive et moderne
- Carrousels interactifs pour mettre en avant les produits et actualités
- Navigation intuitive avec menu déroulant
- Pages dédiées pour chaque section (Matériel neuf, Occasions, etc.)
- Formulaire de contact fonctionnel
- Optimisé pour le référencement (SEO)
- Compatible avec tous les appareils (mobile, tablette, ordinateur)
- Chargement rapide grâce à l'optimisation des ressources

## 🔌 Intégration Firebase & Cloudinary
Le carrousel d'accueil, la section « Actualités » ainsi que l'ensemble de l'interface d'administration reposent sur **Firebase** (Firestore, Authentication, Storage) et **Cloudinary** pour l'hébergement des images.  
Pour un fonctionnement optimal :

1. Créez un projet Firebase puis remplacez les clés présentes dans `assets/js/auth/firebase-config.js` par les vôtres **ou** renseignez-les via des variables d'environnement et chargez-les dynamiquement lors du build.
2. Activez les services **Authentication** (email / mot de passe) et **Firestore** en mode production.
3. Créez les règles Firestore suivantes :
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
4. Dans Cloudinary, créez un *upload preset* nommé `Site Web` (non-signé) et notez votre `cloud_name`.  
   Ces valeurs sont utilisées dans `assets/js/admin/carousel.js` pour l'upload d'images.
5. Déployez le site sur un domaine HTTPS – Firebase impose HTTPS pour ses SDK.

Une fois ces étapes terminées :
- L’interface `/pages/administrateur.html` permet d’ajouter, réordonner ou supprimer les éléments du carrousel.
- Les changements sont visibles immédiatement sur la page d’accueil grâce au chargement dynamique depuis Firestore.

## 🛠 Configuration requise

- Node.js (version 14 ou supérieure)
- npm (gestionnaire de paquets Node.js)
- Un serveur web local (comme Apache avec mod_include pour les SSI)
- Un compte Vercel pour le déploiement (optionnel)

## 🚀 Installation et démarrage local

### Prérequis

1. Assurez-vous d'avoir Node.js et npm installés sur votre machine.
2. Clonez ce dépôt sur votre machine locale :
   ```bash
   git clone https://github.com/votre-utilisateur/mon-site-web.git
   cd mon-site-web/Site-franchini
   ```

### Installation avec Docker (Recommandé)

1. Assurez-vous d'avoir Docker installé sur votre machine.
2. Exécutez la commande suivante pour construire l'image et démarrer le conteneur :
   ```bash
   docker-compose up --build
   ```
3. Ouvrez votre navigateur à l'adresse : http://localhost:8080

### Installation manuelle

1. Installez les dépendances :
   ```bash
   npm install -g http-server
   ```

2. Pour le développement local avec support SSI (Server Side Includes) :
   - Utilisez un serveur Apache local avec le module mod_include activé
   - Ou utilisez la commande suivante pour un serveur de développement simple (sans SSI) :
     ```bash
     npx http-server -p 3000
     ```
   - Ouvrez votre navigateur à l'adresse : http://localhost:3000

## 🏗 Structure du projet

```
Site-franchini/
├── public/                    # Fichiers statiques
│   ├── assets/                # Ressources (images, CSS, JS)
│   │   ├── css/              # Feuilles de style
│   │   ├── js/                # Fichiers JavaScript
│   │   └── images/            # Images du site
│   ├── pages/                 # Pages HTML du site
│   ├── _includes/             # Fichiers inclus (header, footer)
│   ├── index.html             # Page d'accueil
│   └── .htaccess             # Configuration Apache
├── .docker/                  # Fichiers de configuration Docker
├── .github/                  # Fichiers de configuration GitHub
├── .vscode/                  # Configuration VS Code
├── docker-compose.yml        # Configuration Docker Compose
├── Dockerfile               # Fichier de build Docker
└── README.md                # Ce fichier
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000
```

### Configuration Apache pour SSI

Pour que les includes côté serveur (SSI) fonctionnent, assurez-vous que votre serveur Apache est configuré avec :

```apache
<Directory "/chemin/vers/votre/site">
    Options +Includes
    AddType text/html .shtml .html .htm
    AddOutputFilter INCLUDES .shtml .html .htm
</Directory>
```

## 🚀 Déploiement

### Vercel

1. Installez l'outil en ligne de commande Vercel :
   ```bash
   npm install -g vercel
   ```

2. Connectez-vous à votre compte Vercel :
   ```bash
   vercel login
   ```

3. Déployez l'application :
   ```bash
   vercel
   ```

### Autres plateformes

Le site peut être déployé sur n'importe quel hébergement prenant en charge les fichiers statiques. Pour les fonctionnalités avancées comme les SSI, un serveur web comme Apache ou Nginx est recommandé.

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

## Administration et Gestion de Contenu

L'administration du site se fait via une interface privée accessible à l'adresse `/pages/administrateur.html`.

### Accès et Authentification

L'accès à cette section est protégé par une authentification Firebase. Seuls les utilisateurs enregistrés peuvent se connecter et modifier le contenu.

### Gestion du Carrousel d'Accueil

Le carrousel de la page d'accueil est entièrement dynamique et géré depuis l'onglet "Carrousel d'accueil" de l'interface d'administration.

#### Fonctionnalités

1.  **Liste des médias** : Un aperçu de tous les éléments (images et vidéos YouTube) actuellement dans le carrousel est affiché, avec une miniature visuelle pour une identification facile.

2.  **Ajout d'un média** :
    *   **Image** : Sélectionnez "Image" dans le menu déroulant. Choisissez un titre (optionnel) et sélectionnez un fichier image. Le système va **automatiquement compresser et optimiser l'image** avant de l'envoyer sur le serveur pour garantir des temps de chargement rapides. Les images trop grandes (plus de 1920px de large ou de haut) seront redimensionnées tout en conservant leurs proportions.
    *   **Vidéo YouTube** : Sélectionnez "Vidéo YouTube", donnez un titre (optionnel) et collez simplement l'URL de la vidéo YouTube.

3.  **Suppression d'un média** : Cliquez sur le bouton "Supprimer" à côté d'un élément pour le retirer définitivement du carrousel. L'opération supprime à la fois la référence dans la base de données et le fichier image du stockage si applicable.

#### Technologies utilisées

*   **Firebase Firestore** : Pour stocker les informations des médias (type, URL, titre, ordre).
*   **Firebase Storage** : Pour héberger les fichiers images.
*   **Browser-Image-Compression** : Bibliothèque JavaScript utilisée pour optimiser les images côté client avant l'envoi.

---

Développé avec ❤️ par l'équipe Franchini
