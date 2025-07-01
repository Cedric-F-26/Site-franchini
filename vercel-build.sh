#!/bin/bash

# Activer le mode verbeux pour le débogage
set -xe

# Afficher les informations de version
echo "=== Versions installées ==="
ruby --version
bundle --version
node --version
npm --version

# Configurer l'environnement
export JEKYLL_ENV=production
export NODE_ENV=production

# Nettoyage
echo "=== Nettoyage ==="
rm -rf vendor/bundle
rm -f Gemfile.lock

# Installation des dépendances système
echo "=== Installation des dépendances système ==="
if command -v apt-get >/dev/null; then
    apt-get update -y
    apt-get install -y build-essential
elif command -v yum >/dev/null; then
    yum groupinstall -y 'Development Tools'
    yum install -y ruby-devel
fi

# Mise à jour de RubyGems et Bundler
echo "=== Mise à jour de RubyGems et Bundler ==="
gem update --system --no-document
gem install bundler --no-document

# Configuration de Bundler
echo "=== Configuration de Bundler ==="
bundle config set --local path 'vendor/bundle'
bundle config set --local without 'development:test'

# Installation des gems
echo "=== Installation des gems ==="
bundle install --jobs=4 --retry=3

# Vérification de Jekyll
echo "=== Vérification de Jekyll ==="
bundle exec jekyll --version || { echo "Erreur: Jekyll n'est pas correctement installé"; exit 1; }

# Construction du site
echo "=== Construction du site ==="
bundle exec jekyll build --trace

# Vérification du résultat
if [ ! -d "_site" ]; then
    echo "Erreur: Le dossier _site n'a pas été généré"
    ls -la
    exit 1
fi

echo "=== Build réussi ! ==="
echo "Contenu du répertoire de sortie:"
ls -la _site/
