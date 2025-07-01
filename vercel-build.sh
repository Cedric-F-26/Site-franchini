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
# Force la mise à jour même en cas d'avertissements
echo "[DEBUG] Avant gem update"
gem update --system --no-document --force 2>&1 | tee gem_update.log || \
  echo "[WARN] Échec partiel de la mise à jour de RubyGems, continuation..."
echo "[DEBUG] Après gem update"

# Vérification de l'installation de RubyGems
echo "[DEBUG] Vérification de RubyGems"
if ! gem --version; then
  echo "[ERROR] RubyGems n'est pas accessible"
  exit 1
fi

echo "=== Installation de Bundler ==="
echo "[DEBUG] Avant installation de Bundler"
gem install bundler --no-document --force 2>&1 | tee bundler_install.log || \
  echo "[WARN] Échec partiel de l'installation de Bundler, continuation..."
echo "[DEBUG] Après installation de Bundler"

# Vérification des versions installées
echo "=== Vérification des versions installées ==="
echo "[DEBUG] Vérification des versions"
echo "Ruby version: $(ruby --version 2>&1 || echo 'Non disponible')"
echo "Gem version: $(gem --version 2>&1 || echo 'Non disponible')"
echo "Bundler version: $(bundle --version 2>&1 || echo 'Non disponible')"

# Configuration de Bundler
echo "=== Configuration de Bundler ==="
echo "Configuration du chemin des gems..."
if ! bundle config set --local path 'vendor/bundle'; then
  echo "Avertissement: échec de la configuration du chemin de Bundler"
  echo "Tentative avec la variable d'environnement..."
  export BUNDLE_PATH=vendor/bundle
fi

echo "Configuration des groupes à exclure..."
if ! bundle config set --local without 'development:test'; then
  echo "Avertissement: échec de la configuration des groupes de Bundler"
  export BUNDLE_WITHOUT=development:test
fi

# Afficher la configuration finale
echo "Configuration Bundler finale :"
bundle env | grep -E 'BUNDLE|RUBY|GEM'

# Installation des gems
echo -e "\n=== Installation des gems ==="
echo "Contenu du Gemfile :"
cat Gemfile || echo "Impossible de lire le Gemfile"

echo -e "\nInstallation des dépendances..."
if ! bundle install --jobs=4 --retry=3; then
  echo "Échec de l'installation des gems. Tentative avec --verbose..."
  bundle install --verbose || fail "Échec de l'installation des gems après nouvelle tentative"
fi

echo -e "\nListe des gems installés :"
bundle list || echo "Impossible de lister les gems"

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
