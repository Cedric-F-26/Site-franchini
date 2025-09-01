#!/bin/bash
set -e  # Arrêter le script en cas d'erreur

# Fonction pour afficher des messages formatés
log() {
  echo -e "\n\033[1;34m==> $1\033[0m"
}

# Afficher les informations du système
echo -e "\n=== INFORMATIONS SYSTÈME ==="
echo "- Système: $(uname -a)"
echo "- Node.js: $(node --version || echo 'Non disponible')"
echo "- npm: $(npm --version || echo 'Non disponible')"
echo "- Ruby: $(ruby --version || echo 'Non disponible')"

# Configurer les chemins Ruby
echo -e "\n=== CONFIGURATION RUBY ==="
RUBY_PATH=$(which ruby)
echo "Ruby trouvé à: $RUBY_PATH"

# Configuration des chemins
export GEM_HOME="$PWD/vendor/bundle"
export BUNDLE_PATH="$GEM_HOME"
export BUNDLE_APP_CONFIG="$PWD/.bundle"
export PATH="$GEM_HOME/bin:$PATH"
mkdir -p "$GEM_HOME"
mkdir -p "$BUNDLE_APP_CONFIG"

# Créer un fichier de configuration Bundler
echo "---" > "$BUNDLE_APP_CONFIG/config"
echo "BUNDLE_PATH: '$BUNDLE_PATH'" >> "$BUNDLE_APP_CONFIG/config"
echo "BUNDLE_DISABLE_SHARED_GEMS: '1'" >> "$BUNDLE_APP_CONFIG/config"
echo "BUNDLE_WITHOUT: 'development:test'" >> "$BUNDLE_APP_CONFIG/config"

echo -e "\n=== INSTALLATION DES DÉPENDANCES ==="

# Mettre à jour RubyGems
echo "Mise à jour de RubyGems..."
gem update --system --no-document || echo "⚠️ Impossible de mettre à jour RubyGems"

# Installation de Bundler
echo -e "\nInstallation de Bundler..."
if ! gem install bundler --version '~> 2.4.0' --no-document; then
  echo "⚠️  Impossible d'installer Bundler 2.4.0, tentative avec une version différente..."
  if ! gem install bundler --no-document; then
    echo "❌ Échec critique de l'installation de Bundler"
    exit 1
  fi
fi

# Vérification de l'installation de Bundler
echo -e "\nVérification de l'installation de Bundler..."
BUNDLER_PATH=$(which bundle 2>/dev/null || gem which bundler 2>/dev/null || echo "")
if [ -z "$BUNDLER_PATH" ]; then
  echo "❌ Bundler n'est pas dans le PATH"
  exit 1
else
  echo "✅ Bundler trouvé à: $BUNDLER_PATH"
  echo "Version de Bundler: $(bundle --version || echo 'Inconnue')"
  # Ajouter au PATH si nécessaire
  export PATH="$(dirname "$BUNDLER_PATH"):$PATH"
fi

# Configuration de l'environnement
export JEKYLL_ENV=production

# Installation des dépendances Node.js
echo -e "\n=== INSTALLATION DES DÉPENDANCES NODE.JS ==="
npm install --production=false --prefer-offline --no-audit --progress=false || {
  echo "⚠️  Échec de l'installation des dépendances Node.js"
  exit 1
}

# Installation des dépendances Ruby
echo -e "\n=== INSTALLATION DES DÉPENDANCES RUBY ==="
echo "Installation des gems..."
bundle config set --local path 'vendor/bundle'
bundle config set --local deployment 'true'
bundle config set --local without 'development test'

# Nettoyer le cache de Bundler
echo "Nettoyage du cache Bundler..."
bundle clean --force || true

# Installation des gems
echo "Installation des gems avec Bundler..."
if ! bundle install --jobs 4 --retry 3; then
  echo "⚠️  Échec de l'installation, tentative avec --clean..."
  if ! bundle install --jobs 4 --retry 3 --clean; then
    echo "❌ Échec de l'installation des gems Ruby"
    exit 1
  fi
fi

# Construction du site Jekyll
echo -e "\n=== CONSTRUCTION DU SITE JEKYLL ==="
echo "Construction du site avec Jekyll..."
if ! bundle exec jekyll build --trace; then
  echo "❌ Échec de la construction du site Jekyll"
  exit 1
fi

echo -e "\n✅ Construction terminée avec succès !"

# Nettoyage et construction
echo -e "\n=== NETTOYAGE ET CONSTRUCTION ==="

# Nettoyage du cache Jekyll
echo "Nettoyage du cache Jekyll..."
bundle exec jekyll clean 2>/dev/null || true

# Construction du site Jekyll
echo -e "\nConstruction du site Jekyll..."
if ! bundle exec jekyll build --trace; then
  echo "⚠️  Construction échouée, tentative avec --safe..."
  if ! bundle exec jekyll build --trace --safe; then
    echo "❌ Échec de la construction du site Jekyll"
    exit 1
  fi
fi

# Vérification du répertoire de sortie
echo -e "\n=== VÉRIFICATION DU SITE ==="
if [ -d "_site" ] && [ -n "$(ls -A _site 2>/dev/null)" ]; then
  # Vérification des fichiers critiques
  echo "Vérification des fichiers critiques..."
  FILES_TO_CHECK=("index.html" "assets/" "css/" "js/")
  MISSING_FILES=()
  
  for file in "${FILES_TO_CHECK[@]}"; do
    if [ ! -e "_site/$file" ] && [ ! -e "_site/${file%/}" ]; then
      MISSING_FILES+=("$file")
    fi
  done
  
  if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo "⚠️  Fichiers critiques manquants :"
    for file in "${MISSING_FILES[@]}"; do
      echo "   - $file"
    done
    echo "ℹ️  Le site a été construit mais certains fichiers critiques sont manquants."
  fi
  
  echo -e "\n✅ Construction réussie !"
  echo "📦 Taille du répertoire: $(du -sh _site | cut -f1 || echo 'inconnue')"
  echo -e "\n📂 Contenu du répertoire _site/ :"
  ls -la _site/
  
  echo -e "\n✅ Build terminé avec succès !"
  exit 0
else
  echo "❌ Erreur: Le répertoire _site/ n'a pas été généré ou est vide !"
  echo "Contenu du répertoire courant :"
  ls -la
  exit 1
fi