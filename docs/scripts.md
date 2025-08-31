# Documentation des Scripts

## Structure des dossiers

```
assets/js/
├── admin/            # Scripts pour l'administration
│   ├── actualites-firebase.js
│   ├── actualites.js
│   ├── carousel.js
│   ├── common.js
│   ├── contacts.js
│   ├── occasions.js
│   └── promotions.js
├── auth/             # Authentification
│   ├── firebase-config.js
│   ├── login.js
│   └── update-password.js
├── carousel.js       # Fonctionnalités du carrousel principal
├── contact.js        # Gestion du formulaire de contact
├── home-carousel.js  # Initialisation du carrousel d'accueil
├── includes.js       # Fonctions utilitaires
├── init-firebase.js  # Initialisation de Firebase
├── main.js           # Script principal
└── README.md         # Documentation
```

## Scripts principaux

### 1. `main.js`
Point d'entrée principal de l'application. Initialise les composants communs.

### 2. `carousel.js`
Gère le carrousel principal avec les fonctionnalités :
- Navigation entre les slides
- Autoplay
- Gestion des événements tactiles
- Intégration avec l'API YouTube

### 3. `home-carousel.js`
Initialise et configure le carrousel de la page d'accueil avec chargement des données depuis Firestore.

### 4. `init-firebase.js`
Initialise Firebase avec la configuration appropriée et gère l'état d'authentification.

## Scripts d'administration

### 1. `admin/common.js`
Fonctions utilitaires partagées entre les pages d'administration.

### 2. `admin/carousel.js`
Gestion du carrousel dans l'interface d'administration.

### 3. `admin/actualites.js`
Gestion des actualités dans l'interface d'administration.

## Bonnes pratiques

1. Toujours utiliser `DOMContentLoaded` pour s'assurer que le DOM est chargé
2. Utiliser des fonctions nommées pour une meilleure lisibilité
3. Documenter les fonctions avec des commentaires JSDoc
4. Gérer les erreurs de manière appropriée
5. Utiliser des constantes pour les sélecteurs CSS fréquemment utilisés

## Dépendances

- Firebase (Firestore, Authentication, Storage)
- YouTube Iframe API
- Font Awesome (chargé via CDN)

## Développement

Pour ajouter un nouveau script :

1. Créer un nouveau fichier dans le dossier approprié
2. Importer les dépendances nécessaires
3. Exporter les fonctions nécessaires
4. Importer le script dans la page HTML correspondante
5. Tester sur plusieurs navigateurs
