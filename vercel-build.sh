#!/bin/bash
set -e  # Arrêter le script en cas d'erreur

# Fonction pour afficher des messages formatés
log() {
  echo -e "\n\033[1;34m==> $1\033[0m"
}

# Afficher les versions des outils
log "Vérification des versions des outils :"
echo "- Ruby: $(ruby --version)"
echo "- Bundler: $(bundle --version)"
echo "- Node.js: $(node --version)"
echo "- npm: $(npm --version)"

# Configuration de l'environnement
export JEKYLL_ENV=production

# Installation des dépendances Node.js
log "Installation des dépendances Node.js..."
npm install --prefer-offline --no-audit --progress=false

# Configuration de Bundler
log "Configuration de Bundler..."
bundle config set --local path 'vendor/bundle'
bundle config set --local deployment 'true'
bundle config set --local without 'development:test'
bundle config set --local clean 'true'
bundle config set --local no-prune 'true'

# Installation des dépendances Ruby
log "Installation des dépendances Ruby..."
if ! bundle install --jobs=4 --retry=3; then
  log "⚠️  Échec de l'installation, tentative avec --clean..."
  bundle install --jobs=4 --retry=3 --clean
fi

# Nettoyage du cache Jekyll
log "Nettoyage du cache Jekyll..."
bundle exec jekyll clean || true

# Construction du site Jekyll
log "Construction du site Jekyll..."
if ! bundle exec jekyll build --trace --verbose; then
  log "⚠️  Construction échouée, tentative avec --safe..."
  bundle exec jekyll build --trace --verbose --safe
fi

# Vérification du répertoire de sortie
log "Vérification du répertoire de sortie..."
if [ -d "_site" ] && [ -n "$(ls -A _site 2>/dev/null)" ]; then
  echo "✅ Répertoire _site/ généré avec succès"
  echo "📦 Taille du répertoire: $(du -sh _site | cut -f1)"
  echo "📂 Contenu du répertoire:"
  ls -la _site/
  log "✅ Build terminé avec succès !"
  exit 0
else
  echo "❌ Erreur: Le répertoire _site/ n'a pas été généré ou est vide !" >&2
  exit 1
fi