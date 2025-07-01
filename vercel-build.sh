#!/bin/bash
set -e  # Arrêter en cas d'erreur

# Fonctions utilitaires pour les logs
info() {
  echo -e "\033[1;34m[INFO] $1\033[0m"
}

success() {
  echo -e "\033[1;32m[SUCCÈS] $1\033[0m"
}

error() {
  echo -e "\033[1;31m[ERREUR] $1\033[0m" >&2
  exit 1
}

# Configuration de l'environnement
export LANG=C.UTF-8
export LC_ALL=C.UTF-8
export JEKYLL_ENV="production"
export NODE_ENV="production"
export BUNDLE_WITHOUT="development:test"
export BUNDLE_PATH="vendor/bundle"
export BUNDLE_APP_CONFIG=".bundle"

# Fonction pour installer les dépendances
install_dependencies() {
  info "=== Installation des dépendances ==="
  
  # Afficher les informations système
  info "--- Informations système ---"
  uname -a
  ruby -v
  gem -v
  bundle -v
  
  # Configurer RubyGems pour éviter les avertissements
  echo "gem: --no-document" > ~/.gemrc
  
  # Mettre à jour RubyGems et installer Bundler
  gem update --system --no-document || info "Mise à jour de RubyGems non critique"
  gem install bundler -v 2.4.22 --no-document || error "Échec de l'installation de Bundler"
  
  # Configurer Bundler
  bundle config set --local path 'vendor/bundle'
  bundle config set --local without 'development:test'
  bundle config set --local deployment 'false'
  bundle config set --local frozen 'false'
  
  # Installer les gems
  info "Installation des gems..."
  bundle _2.4.22_ install --jobs=4 --retry=3 || error "Échec de l'installation des gems"
  
  # Vérifier l'installation
  if ! bundle check; then
    error "Erreur de vérification des gems. Vérifiez le Gemfile et Gemfile.lock"
  fi
  
  success "Dépendances installées avec succès."
}

# Fonction pour construire le site
build_site() {
  info "=== Construction du site Jekyll ==="
  
  # Nettoyer le dossier de sortie
  [ -d "_site" ] && rm -rf _site
  
  # Construire le site
  info "Construction en cours..."
  bundle exec jekyll build --trace --verbose || error "Échec de la construction du site"
  
  # Vérifier que le site a été construit
  if [ ! -d "_site" ]; then
    error "Le dossier _site n'a pas été généré"
  fi
  
  # Afficher des informations sur les fichiers générés
  SITE_SIZE=$(du -sh _site 2>/dev/null | cut -f1) || SITE_SIZE="inconnue"
  FILE_COUNT=$(find _site -type f 2>/dev/null | wc -l || echo 0)
  
  if [ $FILE_COUNT -eq 0 ]; then
    error "Aucun fichier généré dans le répertoire _site/"
  fi
  
  success "Construction réussie !"
  info "Taille du site: $SITE_SIZE"
  info "Nombre de fichiers: $FILE_COUNT"
  
  # Pour le débogage
  if [ "$VERCEL_DEBUG" = "true" ]; then
    info "Fichiers générés dans _site/ :"
    find _site -type f | sort | head -n 20
  fi
}

# Point d'entrée principal
main() {
  local cmd="$1"
  
  case "$cmd" in
    install)
      install_dependencies
      ;;
    build)
      build_site
      ;;
    *)
      # Si aucun argument n'est fourni, exécuter les deux étapes
      install_dependencies
      build_site
      ;;
  esac
}

# Exécuter le script
main "$@"
