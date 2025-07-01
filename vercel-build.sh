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

echo "=== Nettoyage des installations précédentes ==="
rm -rf vendor/bundle

# Mettre à jour RubyGems
echo "=== Mise à jour de RubyGems ==="
gem update --system --no-document

# Installer Bundler
echo "=== Installation de Bundler ==="
gem install bundler --no-document

# Configurer Bundler
echo "=== Configuration de Bundler ==="
bundle config set --local path "$BUNDLE_PATH"
bundle config set --local without "development:test"
bundle config set --local deployment "true"

# Installer les gems du projet
echo "=== Installation des gems du projet ==="
bundle install --jobs=4 --retry=3 --verbose

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
