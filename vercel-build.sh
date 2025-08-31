#!/bin/bash
set -e  # Arrêter le script en cas d'erreur

# Fonction pour afficher des messages formatés
log() {
  echo -e "\n\033[1;34m==> $1\033[0m"
}

# Afficher les versions des outils
echo -e "\n=== VERSIONS DES OUTILS ==="
echo "- Node.js: $(node --version || echo 'Non disponible')"
echo "- npm: $(npm --version || echo 'Non disponible')"
echo "- Ruby: $(ruby --version || echo 'Non disponible')"

# Installation de Bundler
echo -e "\n=== INSTALLATION DE BUNDLER ==="
if ! command -v bundle &> /dev/null; then
  echo "Bundler n'est pas installé. Installation en cours..."
  gem install bundler:2.4.22 || {
    echo "⚠️  Impossible d'installer Bundler 2.4.22, tentative avec la dernière version..."
    gem install bundler || {
      echo "❌ Échec de l'installation de Bundler"
      exit 1
    }
  }
fi

echo "✅ Bundler installé: $(bundle --version || echo 'Version inconnue')"

# Configuration de l'environnement
export JEKYLL_ENV=production

# Installation des dépendances Node.js
echo -e "\n=== INSTALLATION DES DÉPENDANCES NODE.JS ==="
npm install --prefer-offline --no-audit --progress=false || {
  echo "⚠️  Échec de l'installation des dépendances Node.js"
  exit 1
}

# Configuration de Bundler
echo -e "\n=== CONFIGURATION DE BUNDLER ==="
echo "Configuration du chemin des gems..."
bundle config set --local path 'vendor/bundle' || echo "⚠️  Impossible de configurer le chemin des gems"

# Installation des dépendances Ruby
echo -e "\n=== INSTALLATION DES DÉPENDANCES RUBY ==="
if ! bundle install --jobs=4 --retry=3; then
  echo "⚠️  Échec de l'installation, tentative avec --clean..."
  if ! bundle install --jobs=4 --retry=3 --clean; then
    echo "❌ Échec de l'installation des dépendances Ruby"
    exit 1
  fi
fi

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