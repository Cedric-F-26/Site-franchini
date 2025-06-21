#!/bin/bash
set -e

echo "=== Installation des dépendances système ==="
apt-get update
apt-get install -y ruby-full build-essential zlib1g-dev

# Configurer l'environnement Ruby
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Installer Bundler
echo "=== Installation de Bundler ==="
gem install bundler

# Installer les dépendances Jekyll
echo "=== Installation des dépendances Jekyll ==="
bundle config set --local path 'vendor/bundle'
bundle install

# Construire le site avec la configuration Vercel
echo "=== Construction du site avec la configuration Vercel ==="
bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace

# Vérifier que le dossier _site a été créé
if [ ! -d "_site" ]; then
    echo "Erreur: Le dossier _site n'a pas été généré"
    ls -la
    exit 1
fi

echo "=== Build terminé avec succès ==="
ls -la _site
