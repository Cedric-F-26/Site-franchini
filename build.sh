#!/bin/bash
set -e

echo "=== Installation des dépendances ==="

# Installation des dépendances Node.js
if [ -f "package.json" ]; then
  echo "Installation des dépendances Node.js..."
  npm install
fi

# Installation des dépendances Ruby
if [ -f "Gemfile" ]; then
  echo "Installation des dépendances Ruby..."
  bundle config set --local path 'vendor/bundle'
  bundle config set --local without 'development test'
  bundle install --jobs=4 --retry=3
fi

echo "=== Construction du site ==="

# Construction du site Jekyll
if [ -f "_config.yml" ]; then
  echo "Construction du site Jekyll..."
  bundle exec jekyll build --trace
else
  echo "Erreur: Fichier _config.yml introuvable"
  exit 1
fi

echo "=== Construction terminée avec succès ==="
