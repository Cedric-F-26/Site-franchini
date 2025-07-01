#!/bin/bash

# Activer le mode verbeux pour le débogage
set -xe

# Fonction pour quitter en cas d'erreur
function fail {
  echo "ERREUR: $1" >&2
  exit 1
}

echo "=== Début du build ==="

# Vérification des commandes nécessaires
for cmd in ruby gem bundle node npm; do
  if ! command -v $cmd >/dev/null 2>&1; then
    fail "La commande $cmd n'est pas disponible"
  fi
done

# Afficher les informations de version
echo "=== Versions installées ==="
ruby --version || fail "Impossible d'exécuter ruby"
bundle --version || fail "Impossible d'exécuter bundle"
node --version || fail "Impossible d'exécuter node"
npm --version || fail "Impossible d'exécuter npm"

# Configurer l'environnement
export JEKYLL_ENV=production
export NODE_ENV=production

# Nettoyage
echo "=== Nettoyage ==="
rm -rf vendor/bundle
rm -f Gemfile.lock

# Installation des dépendances système minimales
echo "=== Installation des dépendances système ==="
if command -v apt-get >/dev/null; then
    echo "Utilisation d'apt-get"
    apt-get update -y || echo "Avertissement: échec de la mise à jour des paquets"
    apt-get install -y build-essential libffi-dev zlib1g-dev || \
      echo "Avertissement: échec de l'installation des dépendances système"
elif command -v yum >/dev/null; then
    echo "Utilisation de yum"
    yum install -y gcc make ruby-devel zlib-devel libffi-devel || \
      echo "Avertissement: échec de l'installation des dépendances système"
else
    echo "Avertissement: gestionnaire de paquets non reconnu, poursuite sans installation de dépendances système"
fi

# Mise à jour de RubyGems et Bundler
echo "=== Mise à jour de RubyGems et Bundler ==="
gem update --system --no-document || \
  fail "Échec de la mise à jour de RubyGems"

gem install bundler --no-document || \
  fail "Échec de l'installation de Bundler"

# Configuration de Bundler
echo "=== Configuration de Bundler ==="
bundle config set --local path 'vendor/bundle' || \
  echo "Avertissement: échec de la configuration du chemin de Bundler"
  
bundle config set --local without 'development:test' || \
  echo "Avertissement: échec de la configuration des groupes de Bundler"

# Installation des gems
echo "=== Installation des gems ==="
bundle install --jobs=4 --retry=3 || \
  fail "Échec de l'installation des gems"

# Vérification de Jekyll
echo "=== Vérification de Jekyll ==="
if ! bundle exec jekyll --version; then
  echo "ERREUR: Jekyll n'est pas correctement installé"
  echo "Liste des gems installées :"
  bundle list
  exit 1
fi

# Construction du site
echo "=== Construction du site ==="
bundle exec jekyll build --trace || \
  fail "Échec de la construction du site"

# Vérification du résultat
if [ ! -d "_site" ]; then
  echo "ERREUR: Le dossier _site n'a pas été généré"
  echo "Contenu du répertoire courant :"
  ls -la
  exit 1
fi

echo "=== Build réussi ! ==="
echo "Taille du dossier _site :"
du -sh _site/
echo "Contenu du répertoire de sortie :"
ls -la _site/
