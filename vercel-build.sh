#!/bin/bash
set -e  # Arrêter en cas d'erreur

echo "=== Début du script de build ==="
echo "Date: $(date)"
echo "Répertoire de travail: $(pwd)"

# Afficher les versions des outils
echo "\n=== Versions des outils ==="
ruby -v || echo "Ruby n'est pas installé"
bundle -v || echo "Bundler n'est pas installé"
node -v || echo "Node.js n'est pas installé"
npm -v || echo "npm n'est pas installé"

# Afficher la structure des fichiers
echo "\n=== Structure des fichiers ==="
ls -la

# Installer les dépendances
echo "\n=== Installation des dépendances Ruby ==="
bundle install --path vendor/bundle || echo "Échec de l'installation des dépendances Ruby"

echo "\n=== Installation des dépendances Node.js ==="
npm install || echo "Échec de l'installation des dépendances Node.js"

# Construire le site
echo "\n=== Construction du site ==="
bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace --verbose || echo "Échec de la construction du site"

# Vérifier le contenu du dossier de sortie
echo "\n=== Contenu du dossier _site ==="
if [ -d "_site" ]; then
  ls -la _site/
else
  echo "Le dossier _site n'a pas été créé"
fi

echo "\n=== Fin du script de build ==="
