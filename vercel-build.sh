#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -e

info() { echo -e "\033[1;34m[INFO]\033[0m $1"; }
success() { echo -e "\033[1;32m[SUCCÈS]\033[0m $1"; }
error() { echo -e "\033[1;31m[ERREUR]\033[0m $1" >&2; exit 1; }

info "=== Démarrage du build Jekyll pour Vercel ==="

info "Affichage des versions logicielles"
ruby -v
bundle -v
node -v

info "Configuration de Bundler pour l'isolation des gems dans ./vendor/bundle"
bundle config set --local path 'vendor/bundle'

info "Installation des dépendances Ruby (gems) via Gemfile.lock"
# L'utilisation de Gemfile.lock garantit un build déterministe
bundle install --jobs=4 --retry=3 || error "L'installation des gems a échoué"

info "Vérification de la consistance des dépendances"
bundle check || error "La vérification des dépendances (bundle check) a échoué"

info "Construction du site Jekyll en mode production"
JEKYLL_ENV=production bundle exec jekyll build --trace || error "La commande 'bundle exec jekyll build' a échoué"

info "Vérification du répertoire de sortie _site"
if [ ! -d "_site" ] || [ -z "$(ls -A _site)" ]; then
    error "Le build a échoué : le répertoire _site n'a pas été créé ou est vide."
fi

success "Build terminé avec succès. Le répertoire _site est prêt pour le déploiement."