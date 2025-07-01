#!/bin/bash

# Activer le mode verbeux pour le débogage
set -x

# Afficher les informations de version
ruby --version
bundle --version
node --version
npm --version

# Configurer le chemin du bundle
export BUNDLE_PATH=$PWD/vendor/bundle

# Installer les gems
bundle config set --local path 'vendor/bundle'
bundle config set --local without 'development:test'
bundle install --jobs=4 --retry=3

# Construire le site
bundle exec jekyll build --trace

# Vérifier que le site a été construit
if [ ! -d "_site" ]; then
  echo "Erreur: Le dossier _site n'a pas été généré"
  exit 1
fi

echo "Build réussi !"
