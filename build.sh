#!/bin/bash
set -e

# Fonction pour afficher les messages d'information
info() {
  echo "[INFO] $1"
}

# Fonction pour afficher les messages d'erreur et quitter
error() {
  echo "[ERREUR] $1" >&2
  exit 1
}

info "=== Vérification des prérequis ==="

# Vérifier que Ruby est installé
if ! command -v ruby &> /dev/null; then
  error "Ruby n'est pas installé. Version requise: 3.3.0"
fi

# Vérifier que Bundler est installé
if ! command -v bundle &> /dev/null; then
  error "Bundler n'est pas installé. Veuillez exécuter 'gem install bundler'"
fi

info "=== Installation des dépendances Ruby ==="

# Installation des dépendances Ruby
if [ -f "Gemfile" ]; then
  info "Installation des dépendances Ruby..."
  bundle config set --local path 'vendor/bundle' || error "Échec de la configuration du chemin des gems"
  bundle config set --local without 'development test' || error "Échec de la configuration des groupes de gems"
  bundle install --jobs=4 --retry=3 || error "Échec de l'installation des gems"
else
  error "Fichier Gemfile introuvable"
fi

info "=== Construction du site Jekyll ==="

# Vérifier que le fichier de configuration Jekyll existe
if [ ! -f "_config.yml" ]; then
  error "Fichier _config.yml introuvable"
fi

# Nettoyer le répertoire de sortie
if [ -d "_site" ]; then
  info "Nettoyage du répertoire _site..."
  rm -rf _site
fi

# Construire le site Jekyll
info "Construction du site avec Jekyll..."
bundle exec jekyll build --trace || error "Échec de la construction du site"

# Vérifier que le site a été construit
if [ ! -d "_site" ]; then
  error "Le répertoire _site n'a pas été généré"
fi

info "=== Construction terminée avec succès ==="
info "Le site a été construit dans le répertoire _site/"

# Afficher la taille du répertoire de sortie
if command -v du &> /dev/null; then
  info "Taille du répertoire _site: $(du -sh _site | cut -f1)"
fi

exit 0
