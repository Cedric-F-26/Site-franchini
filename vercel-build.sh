#!/bin/bash
set -e  # Arrêter le script en cas d'erreur

echo "=== Vérification des versions ==="
ruby -v
bundle -v
node -v
npm -v

echo "\n=== Installation de Ruby et Jekyll ==="
gem install bundler
bundle config set path 'vendor/bundle'

# Créer un Gemfile minimal si nécessaire
if [ ! -f "Gemfile" ]; then
  cat > Gemfile <<EOL
source 'https://rubygems.org'
gem 'jekyll'
gem 'webrick'
EOL
fi

# Installer les gems
echo "\n=== Installation des gems ==="
bundle install

# Construire le site
echo "\n=== Construction du site ==="
bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace

# Vérifier la sortie
if [ ! -d "_site" ]; then
  echo "\n❌ ERREUR: Le répertoire _site n'a pas été généré"
  echo "Contenu du répertoire :"
  ls -la
  exit 1
fi

echo "\n✅ Construction terminée avec succès !"
echo "\n=== Contenu du répertoire _site ==="
ls -la _site/
