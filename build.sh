#!/bin/bash
set -e

echo "=== Vérification des prérequis ==="
command -v ruby >/dev/null 2>&1 || { echo "Ruby n'est pas installé. Installation en cours..."; apt-get update && apt-get install -y ruby-full build-essential zlib1g-dev; }
command -v gem >/dev/null 2>&1 || { echo "RubyGems n'est pas installé. Installation en cours..."; apt-get install -y rubygems; }

# Configurer l'environnement Ruby
export GEM_HOME="$HOME/gems"
export PATH="$HOME/gems/bin:$PATH"

# Installer Bundler si nécessaire
if ! command -v bundle >/dev/null 2>&1; then
    echo "=== Installation de Bundler ==="
    gem install bundler
fi

# Installer les dépendances Jekyll
echo "=== Installation des dépendances Jekyll ==="
bundle config set --local path 'vendor/bundle'
bundle install --jobs 4 --retry 3

# Construire le site avec la configuration Vercel
echo "=== Construction du site ==="
bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace --profile

# Vérifier que le dossier _site a été créé
if [ ! -d "_site" ]; then
    echo "❌ Erreur: Le dossier _site n'a pas été généré"
    ls -la
    exit 1
fi

echo "✅ Build terminé avec succès"
echo "📁 Contenu du dossier _site :"
ls -la _site | head -n 10

# Vérifier la taille du dossier _site
du -sh _site
