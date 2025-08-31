#!/bin/bash
set -e

echo "=== Démarrage du build Jekyll pour Vercel ==="

# Afficher les versions des outils
echo "Versions des outils :"
ruby -v
bundle -v
node -v
npm -v

# Installation des dépendances
echo "Installation des dépendances..."
npm install --production=false
bundle install --jobs=4 --retry=3

# Construction du site
echo "Construction du site Jekyll..."
JEKYLL_ENV=production bundle exec jekyll build --trace

# Vérification du répertoire de sortie
if [ ! -d "_site" ] || [ -z "$(ls -A _site 2>/dev/null)" ]; then
    echo "Erreur: Le répertoire _site n'a pas été créé ou est vide." >&2
    exit 1
fi

echo "Build terminé avec succès !"