#!/bin/bash
set -e  # Arrêter le script en cas d'erreur

echo "=== Vérification des versions ==="
ruby -v
bundle -v
gem -v
node -v
npm -v

echo "\n=== Installation des gems Ruby ==="
bundle config set path 'vendor/bundle'
bundle install --jobs=3 --retry=3 --verbose

# Afficher les gems installées
echo "\n=== Gems installées ==="
bundle list

echo "\n=== Installation des dépendances Node.js ==="
npm install --ignore-scripts=false

echo "\n=== Construction du site Jekyll ==="
bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace

# Vérifier que le répertoire de sortie existe
if [ ! -d "_site" ]; then
  echo "\n❌ Erreur: Le répertoire _site n'a pas été généré"
  echo "Contenu du répertoire :"
  ls -la
  exit 1
fi

echo "\n✅ Construction terminée avec succès !"
echo "\n=== Contenu du répertoire _site ==="
ls -la _site/
