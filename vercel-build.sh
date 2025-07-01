#!/bin/bash

# Activer le mode verbeux pour le débogage
set -x

# Afficher les informations de version
echo "=== Versions installées ==="
ruby --version
bundle --version
node --version
npm --version

# Configurer l'environnement
export JEKYLL_ENV=production
export NODE_ENV=production

# Configurer le chemin du bundle
export BUNDLE_PATH="$PWD/vendor/bundle"

# Configurer Bundler
echo "=== Configuration de Bundler ==="
bundle config set --local path "$BUNDLE_PATH"
bundle config set --local without "development:test"

# Mettre à jour Bundler si nécessaire
echo "=== Mise à jour de Bundler ==="
gem install bundler -v "~> 2.4.22"

# Installer les gems
echo "=== Installation des gems ==="
bundle install --jobs=4 --retry=3

# Mettre à jour les gems si nécessaire
echo "=== Mise à jour des gems ==="
bundle update

# Vérifier que Jekyll est installé
echo "=== Vérification de Jekyll ==="
if ! bundle exec jekyll --version; then
  echo "Erreur: Jekyll n'est pas correctement installé"
  exit 1
fi

# Construire le site
echo "=== Construction du site ==="
bundle exec jekyll build --trace --verbose

# Vérifier que le site a été construit
if [ ! -d "_site" ]; then
  echo "Erreur: Le dossier _site n'a pas été généré"
  ls -la
  exit 1
fi

echo "=== Build réussi ! ==="
echo "Contenu du répertoire de sortie:"
ls -la _site/
