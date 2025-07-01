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

# Configurer Bundler
echo "=== Configuration de Bundler ==="
gem install bundler -v "~> 2.1.4"

bundle config set --local path "$BUNDLE_PATH"
bundle config set --local without "development:test"

# Installer les gems de base d'abord
echo "=== Installation des gems de base ==="
gem install ffi -v '1.15.5' -- --disable-system-libffi
gem install sassc -v '2.4.0' -- --disable-system-libffi

# Installer les gems du projet
echo "=== Installation des gems du projet ==="
bundle _2.1.4_ install --jobs=4 --retry=3 --verbose

# Vérifier que Jekyll est installé
echo "=== Vérification de Jekyll ==="
if ! bundle _2.1.4_ exec jekyll --version; then
  echo "Erreur: Jekyll n'est pas correctement installé"
  exit 1
fi

# Construire le site
echo "=== Construction du site ==="
bundle _2.1.4_ exec jekyll build --trace --verbose

# Vérifier que le site a été construit
if [ ! -d "_site" ]; then
  echo "Erreur: Le dossier _site n'a pas été généré"
  ls -la
  exit 1
fi

echo "=== Build réussi ! ==="
echo "Contenu du répertoire de sortie:"
ls -la _site/
