#!/bin/bash

# Installer les dépendances Ruby
echo "Installation des gems Ruby..."
bundle config set --local path 'vendor/bundle'
bundle install --jobs=3 --retry=3

# Installer les dépendances Node.js
echo "Installation des dépendances Node.js..."
npm install --ignore-scripts=false

# Construire le site Jekyll
echo "Construction du site Jekyll..."
bundle exec jekyll build --trace

# Vérifier que le répertoire de sortie existe
if [ ! -d "_site" ]; then
  echo "Erreur: La construction du site a échoué (_site n'existe pas)"
  exit 1
fi

echo "Construction terminée avec succès !"
ls -la _site/
