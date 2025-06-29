#!/bin/bash
set -e

echo "=== Installation des dépendances Ruby ==="
if ! command -v ruby &> /dev/null; then
    echo "Ruby n'est pas installé"
    exit 1
fi

ruby -v
bundle --version || gem install bundler
bundle install --path vendor/bundle

# Construire le site
echo "=== Construction du site ==="
bundle exec jekyll build --trace --verbose

# Vérifier le dossier de sortie
echo "=== Vérification du dossier _site ==="
ls -la _site/ || echo "Le dossier _site n'existe pas"
