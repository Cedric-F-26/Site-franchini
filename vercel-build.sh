#!/bin/bash
set -ex # Arrêter en cas d'erreur et afficher les commandes exécutées

info "Démarrage du script vercel-build.sh"
pwd
ls -la


# Fonctions utilitaires pour les logs
info() {
  echo -e "\033[1;34m[INFO] $1\033[0m"
}

success() {
  echo -e "\033[1;32m[SUCCÈS] $1\033[0m"
}

error() {
  echo -e "\033[1;31m[ERREUR] $1\033[0m"
  exit 1
}

# Fonction pour installer les dépendances
install_dependencies() {
  info "=== Installation des dépendances ==="
  
  # Configurer l'environnement
  export LC_ALL=C.UTF-8
  export LANG=C.UTF-8
  export JEKYLL_ENV="production"
  export NODE_ENV="production"
  export BUNDLE_WITHOUT="development:test"
  export BUNDLE_PATH="vendor/bundle"
  export BUNDLE_GEMFILE="Gemfile"
  
  # Configurer Ruby pour éviter les avertissements
  echo "gem: --no-document" > ~/.gemrc
  
  # Nettoyer les anciens caches
  rm -rf vendor/bundle
  
  # Afficher les informations système pour le débogage
  info "--- Informations système ---"
  uname -a
  ruby -v
  gem -v
  bundle -v
  
  # Mettre à jour RubyGems et Bundler
  gem update --system --no-document || error "Échec de la mise à jour de RubyGems"
  gem install bundler --no-document || error "Échec de l'installation de Bundler"
  
  # Configurer Bundler
  bundle config set --local path 'vendor/bundle'
  bundle config set --local without 'development:test'
  
  # Assurer que le Gemfile.lock est compatible avec l'environnement Vercel
  bundle lock --add-platform ruby
  bundle lock --add-platform x86_64-linux
  
  info "Mise à jour de la gem ffi pour assurer la compatibilité"
  bundle update ffi || error "Échec de la mise à jour de la gem ffi"

  info "--- Plateformes Bundler ---"
  bundle platform
  
  # Installer les gems
  bundle install --jobs=4 --retry=3 || error "Échec de l'installation des dépendances Ruby"
  
  info "Nettoyage des gems inutilisées..."
  bundle clean --force || error "Échec du nettoyage des gems"
  
  success "Dépendances installées avec succès."
}

# Fonction pour construire le site
build_site() {
  info "=== Construction du site Jekyll ==="
  
  # Nettoyer le dossier _site existant
  info "Nettoyage du dossier _site..."
  rm -rf _site
  
  # Exporter les variables d'environnement nécessaires pour la construction
  export JEKYLL_ENV="production"
  export LC_ALL=C.UTF-8
  export LANG=C.UTF-8
  
  # Construire le site
  bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace --verbose || error "Échec de la construction du site"
  
  # Vérifier que le site a été construit
  if [ -d "_site" ]; then
    success "Le site a été construit avec succès dans le dossier _site."
    ls -la _site/
  else
    error "Le dossier _site n'a pas été créé."
  fi
}

# Logique principale du script
# Vérifie l'argument passé au script

case "$1" in
  install)
    install_dependencies
    ;;
  build)
    build_site
    ;;
  *)
    error "Argument non valide. Utilisez 'install' ou 'build'."
    exit 1
    ;;
esac
