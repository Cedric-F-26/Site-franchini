#!/bin/bash
set -e

# Fonctions d'affichage
info() { echo -e "\033[1;34m[INFO]\033[0m $1"; }
success() { echo -e "\033[1;32m[SUCCÈS]\033[0m $1"; }
error() { echo -e "\033[1;31m[ERREUR]\033[0m $1" >&2; exit 1; }

# Configuration de l'environnement
export LANG=C.UTF-8
export LC_ALL=C.UTF-8

info "=== Vérification des prérequis ==="

# Vérification de Ruby
RUBY_VERSION=$(ruby -v 2>/dev/null | awk '{print $2}' | cut -d'p' -f1)
if [ -z "$RUBY_VERSION" ]; then
    error "Ruby n'est pas installé"
else
    info "Ruby version: $RUBY_VERSION"
fi

# Vérification de Bundler
if ! command -v bundle &> /dev/null; then
    info "Installation de Bundler..."
    gem install bundler || error "Échec de l'installation de Bundler"
fi

info "=== Installation des dépendances ==="

# Configuration de Bundler
bundle config set --local path 'vendor/bundle' || error "Échec de la configuration du chemin des gems"
bundle config set --local without 'development test' || error "Échec de la configuration des groupes de gems"

# Installation des gems
info "Installation des gems..."
bundle install --jobs=4 --retry=3 || error "Échec de l'installation des gems"

info "=== Construction du site ==="

# Nettoyage du répertoire de sortie
[ -d "_site" ] && rm -rf _site

# Construction du site
info "Construction du site avec Jekyll..."
bundle exec jekyll build --trace --verbose || error "Échec de la construction du site"

# Vérification de la construction
if [ ! -d "_site" ]; then
    error "Le répertoire _site n'a pas été généré"
fi

# Affichage des informations de construction
SITE_SIZE=$(du -sh _site 2>/dev/null | cut -f1) || SITE_SIZE="inconnue"
FILE_COUNT=$(find _site -type f | wc -l)

success "Construction réussie !"
info "Taille du site: $SITE_SIZE"
info "Nombre de fichiers: $FILE_COUNT"

# Liste les fichiers générés (pour le débogage)
if [ "$VERCEL_DEBUG" = "true" ]; then
    info "Fichiers générés dans _site/ :"
    find _site -type f | sort
fi

exit 0
