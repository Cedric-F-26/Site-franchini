# Guide de contribution pour les développeurs

Ce guide s'adresse aux développeurs qui souhaitent contribuer au code source du projet. Pour un guide plus général, consultez le fichier [CONTRIBUTING.md](../CONTRIBUTING.md) à la racine du projet.

## 🛠 Configuration de l'environnement

### Prérequis

- Ruby 3.1.4 (recommandé)
- Node.js 16+
- Yarn ou npm
- Git

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/mon-site-web.git
   cd mon-site-web/Site-franchini
   ```

2. **Installer les dépendances Ruby**
   ```bash
   bundle install --path vendor/bundle
   ```

3. **Installer les dépendances JavaScript**
   ```bash
   npm install
   # ou
   yarn install
   ```

4. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   # Éditez le fichier .env avec vos configurations
   ```

## 🔄 Workflow de développement

1. **Créer une branche**
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   ```

2. **Faire vos modifications**
   - Écrivez du code propre et bien commenté
   - Suivez les conventions de code du projet
   - Ajoutez des tests si nécessaire

3. **Vérifier les erreurs**
   ```bash
   # Vérifier la syntaxe Ruby
   bundle exec rubocop
   
   # Vérifier la syntaxe JavaScript
   npx eslint assets/js/
   
   # Vérifier le HTML généré
   bundle exec htmlproofer ./_site --check-html --disable-external
   ```

4. **Valider vos modifications**
   ```bash
   git add .
   git commit -m "Description claire de vos modifications"
   git push origin votre-branche
   ```

5. **Ouvrir une Pull Request**
   - Allez sur la page GitHub du projet
   - Cliquez sur "Compare & pull request"
   - Remplissez le modèle de PR
   - Attendez la revue de code

## 🧪 Tests

### Exécuter les tests

```bash
# Construire le site
bundle exec jekyll build

# Exécuter les tests HTML
bundle exec htmlproofer ./_site --check-html --disable-external

# Vérifier les liens brisés
npx blc http://localhost:4000 -ro
```

### Bonnes pratiques pour les tests

- Testez sur plusieurs navigateurs (Chrome, Firefox, Safari, Edge)
- Vérifiez la réactivité sur mobile
- Testez les fonctionnalités interactives
- Vérifiez la performance avec les outils de développement

## 📝 Documentation

- Mettez à jour la documentation quand vous modifiez le code
- Utilisez des commentaires clairs et concis
- Documentez les fonctions complexes
- Mettez à jour le README si nécessaire

## 🤝 Code Review

- Soyez respectueux et constructif
- Expliquez clairement vos commentaires
- Proposez des solutions alternatives si possible
- Répondez aux commentaires de manière professionnelle

## 🚀 Déploiement

Le déploiement est automatique via GitHub Actions. Votre PR sera déployée sur un environnement de prévisualisation une fois approuvée.

## 📞 Besoin d'aide ?

- Consultez la documentation du projet
- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement à contact@franchini.fr
