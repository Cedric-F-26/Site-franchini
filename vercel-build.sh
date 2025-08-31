#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -e

# Configuration des couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCÈS]${NC} $1"; }
warning() { echo -e "${YELLOW}[ATTENTION]${NC} $1"; }
error() { echo -e "${RED}[ERREUR]${NC} $1" >&2; exit 1; }

info "=== Démarrage du build Jekyll pour Vercel ==="

# Afficher les versions des outils
info "Versions des outils :"
ruby -v
bundle -v
node -v
npm -v

# Configuration de Bundler
info "Configuration de Bundler..."
bundle config set --local path 'vendor/bundle'
bundle config set --local deployment 'true'
bundle config set --local without 'development:test'

# Installation des dépendances Node.js
info "Installation des dépendances Node.js..."
npm ci --production=false --prefer-offline --no-audit --progress=false || warning "L'installation des dépendances Node.js a rencontré des problèmes"

# Installation des dépendances Ruby
info "Installation des dépendances Ruby..."
bundle install --jobs=4 --retry=3 --quiet || error "L'installation des gems a échoué"

# Vérification des dépendances
info "Vérification des dépendances..."
bundle check || error "La vérification des dépendances (bundle check) a échoué"

# Construction du site Jekyll
info "Construction du site Jekyll en mode production..."
export JEKYLL_ENV=production
export NODE_ENV=production

# Désactiver les avertissements de dépréciation SASS
export SASS_DEPRECATION_HANDLER=quiet

# Exécution du build
bundle exec jekyll build --trace --config _config.yml,_config_sass.yml || error "La commande 'bundle exec jekyll build' a échoué"

# Vérification du répertoire de sortie
info "Vérification du répertoire de sortie..."
if [ ! -d "_site" ] || [ -z "$(ls -A _site 2>/dev/null)" ]; then
    error "Le build a échoué : le répertoire _site n'a pas été créé ou est vide."
fi

# Nettoyage
info "Nettoyage des fichiers temporaires..."
rm -rf node_modules/.cache
rm -rf .sass-cache

success "Build terminé avec succès. Le répertoire _site est prêt pour le déploiement."