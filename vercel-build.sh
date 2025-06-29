#!/bin/bash
set -e  # Arrêter en cas d'erreur

# Fonction pour afficher des messages d'information
info() {
  echo -e "\033[1;34m[INFO] $1\033[0m"
}

# Fonction pour afficher des messages de succès
success() {
  echo -e "\033[1;32m[SUCCÈS] $1\033[0m"
}

# Fonction pour afficher des messages d'erreur et quitter
error() {
  echo -e "\033[1;31m[ERREUR] $1\033[0m"
  exit 1
}

# Vérifier si nous sommes sur Vercel
if [ -n "$VERCEL" ]; then
  info "Exécution sur Vercel"
  export JEKYLL_ENV="production"
  export NODE_ENV="production"
  export LANG="en_US.UTF-8"
  export LC_ALL="en_US.UTF-8"
  export BUNDLE_WITHOUT="development:test"
  export BUNDLE_PATH="/tmp/vendor/bundle"
  export BUNDLE_GEMFILE="Gemfile"
  
  # Configurer Ruby
  echo "gem: --no-document" > ~/.gemrc
  
  # Nettoyer le cache
  rm -rf ~/.bundle/cache
  rm -rf ~/.gem/ruby/*/cache
  rm -rf vendor/bundle
  
  # Créer le dossier pour les gems
  mkdir -p $BUNDLE_PATH
  
  # Ajouter les binaires au PATH
  export PATH="$BUNDLE_PATH/ruby/2.7.0/bin:$PATH"
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
    gem install bundler:2.2.0 || error "Échec de l'installation de Bundler"
  fi
  
  # Installer les dépendances Ruby
  info "=== Installation des dépendances Ruby ==="
  bundle config set --local path $BUNDLE_PATH
  bundle config set --local deployment true
  bundle config set --local without "development test"
  bundle install || error "Échec de l'installation des dépendances Ruby"
  
  # Installer les dépendances Node.js
  info "=== Installation des dépendances Node.js ==="
  npm ci --prefer-offline --no-audit --progress=false || error "Échec de l'installation des dépendances Node.js"
  
  # Nettoyer le cache npm
  npm cache clean --force
  
  # Construire le site
  info "=== Construction du site ==="
  bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace --verbose || error "Échec de la construction du site"
  
  # Vérifier le contenu du dossier de sortie
  info "=== Vérification du dossier _site ==="
  if [ -d "_site" ]; then
    success "Le site a été construit avec succès"
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
  
  success "=== Script de build terminé avec succès ==="
else
  # Mode développement local
  info "Exécution en mode développement local"
  
  # Installer les dépendances Ruby
  info "=== Installation des dépendances Ruby ==="
  bundle install || error "Échec de l'installation des dépendances Ruby"
  
  # Installer les dépendances Node.js
  info "=== Installation des dépendances Node.js ==="
  npm install || error "Échec de l'installation des dépendances Node.js"
  
  # Construire le site
  info "=== Construction du site ==="
  bundle exec jekyll build --trace --verbose || error "Échec de la construction du site"
  
  success "=== Construction terminée avec succès ==="
fi
