#!/bin/bash
set -e  # Arrêter en cas d'erreur

# Fonction pour afficher des messages d'information
info() {
  echo -e "\033[1;34m[INFO] $1\033[0m"
}

# Fonction pour afficher des messages de succès
succees() {
  echo -e "\033[1;32m[SUCCÈS] $1\033[0m"
}

# Fonction pour afficher des messages d'erreur et quitter
error() {
  echo -e "\033[1;31m[ERREUR] $1\033[0m"
  exit 1
}

# Configurer la locale (solution de repli si en_US.UTF-8 n'est pas disponible)
export LC_ALL=C.UTF-8
export LANG=C.UTF-8

# Vérifier si nous sommes sur Vercel
if [ -n "$VERCEL" ]; then
  info "Exécution sur Vercel"
  export JEKYLL_ENV="production"
  export NODE_ENV="production"
  export BUNDLE_WITHOUT="development:test"
  export BUNDLE_PATH="/tmp/vendor/bundle"
  export BUNDLE_GEMFILE="Gemfile"
  
  # Configurer Ruby pour éviter les avertissements
  echo "gem: --no-document" > ~/.gemrc
  
  # Nettoyer le cache
  rm -rf ~/.bundle/cache
  rm -rf ~/.gem/ruby/*/cache
  rm -rf vendor/bundle
  
  # Créer le dossier pour les gems
  mkdir -p $BUNDLE_PATH
  
  # Ajouter les binaires au PATH
  export PATH="$BUNDLE_PATH/ruby/3.3.0/bin:$PATH"
  export PATH="$BUNDLE_PATH/bin:$PATH"
  
  # Activer les sorties détaillées
  export BUNDLE_VERBOSE=1
  export BUNDLE_JOBS=4
  export BUNDLE_RETRY=3
  
  # Afficher les informations système
  info "=== Informations système ==="
  uname -a
  ruby -v
  gem -v
  bundle -v
  node -v
  npm -v
  
  # Installer Bundler 2.2.0 si nécessaire
  if ! gem list -i bundler -v 2.2.0; then
    info "Installation de Bundler 2.2.0..."
    gem install bundler:2.2.0 --user-install || error "Échec de l'installation de Bundler"
  fi
  
  # Installer les dépendances Ruby
  info "=== Installation des dépendances Ruby ==="
  
  # Mettre à jour RubyGems et Bundler
  gem update --system --no-document
  gem install bundler:2.4.22 --no-document
  
  # Générer le Gemfile.lock s'il n'existe pas
  if [ ! -f "Gemfile.lock" ]; then
    info "Génération du fichier Gemfile.lock..."
    bundle lock --add-platform x86_64-linux
  fi
  
  # Installer les gems
  bundle config set --local path $BUNDLE_PATH
  bundle config set --local deployment 'true'
  bundle config set --local without 'development:test'
  bundle config set --local force_ruby_platform true
  bundle install --jobs=4 --retry=3 || error "Échec de l'installation des dépendances Ruby"
  
  # Construire le site
  info "=== Construction du site ==="
  bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace --verbose || error "Échec de la construction du site"
  
  # Vérifier le contenu du dossier de sortie
  info "=== Vérification du dossier _site ==="
  if [ -d "_site" ]; then
    succees "Le site a été construit avec succès"
    du -sh _site
    ls -la _site/
  else
    error "Le dossier _site n'a pas été créé"
  fi
  
  # Nettoyer les fichiers temporaires
  info "=== Nettoyage ==="
  rm -rf node_modules
  rm -rf $BUNDLE_PATH/cache
  rm -rf ~/.bundle/cache
  rm -rf ~/.gem/ruby/*/cache
  
  succees "=== Script de build terminé avec succès ==="
else
  # Mode développement local
  info "Exécution en mode développement local"
  
  # Installer les dépendances Ruby
  info "=== Installation des dépendances Ruby ==="
  bundle config set --local path 'vendor/bundle'
  bundle install --jobs=4 --retry=3 || error "Échec de l'installation des dépendances Ruby"
  
  # Installer les dépendances Node.js
  info "=== Installation des dépendances Node.js ==="
  npm install || error "Échec de l'installation des dépendances Node.js"
  
  # Construire le site
  info "=== Construction du site ==="
  bundle exec jekyll serve --livereload --trace || error "Échec de la construction du site"
  
  succees "=== Construction terminée avec succès ==="
fi