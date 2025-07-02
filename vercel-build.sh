#!/bin/bash

# Activer le mode verbeux pour le débogage
set -xe

# Fonction pour quitter en cas d'erreur
function fail {
  echo "ERREUR: $1" >&2
  # Afficher les logs d'erreur si disponibles
  if [ -f "build.log" ]; then
    echo "=== Dernières lignes du journal de build ==="
    tail -n 50 build.log
  fi
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
else
    echo "Avertissement: gestionnaire de paquets non reconnu ou non fonctionnel (yum), poursuite sans installation de dépendances système"
fi


# Fonction utilitaire pour le logging
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Vérification de l'environnement
log "=== Vérification de l'environnement ==="
log "Système: $(uname -a)"
log "Répertoire courant: $(pwd)"
log "Utilisateur: $(whoami)"
log "Variables d'environnement:"
env | sort

# Vérification des dépendances système
log "=== Vérification des dépendances système ==="
log "Recherche des gestionnaires de paquets..."
for cmd in gem bundle ruby node npm; do
  if command -v $cmd >/dev/null; then
    log "✓ $cmd trouvé: $(which $cmd)"
  else
    log "⚠ $cmd non trouvé"
  fi
done

# Mise à jour de RubyGems (désactivée pour éviter les problèmes de build)
log "=== Mise à jour de RubyGems (désactivée) ==="
# RUBYGEMS_VERSION_BEFORE=$(gem --version 2>&1 || echo 'Non disponible')
# log "Version actuelle de RubyGems: $RUBYGEMS_VERSION_BEFORE"
# log "Chemin de gem: $(which gem 2>/dev/null || echo 'Non trouvé')"

# echo "[DEBUG] Début de la mise à jour de RubyGems..."
# if ! gem update --system --no-document --force 2>&1; then
#   echo "[WARN] Échec de la mise à jour de RubyGems, tentative de continuation..."
#   # Essayer de continuer même en cas d'échec
#   if ! gem --version >/dev/null 2>&1; then
#     echo "[ERROR] RubyGems n'est pas accessible après la tentative de mise à jour"
#     exit 1
#   fi
# fi
# echo "[DEBUG] Fin de la mise à jour de RubyGems"

# echo "[DEBUG] Version de RubyGems après mise à jour: $(gem --version 2>&1 || echo 'Non disponible')"

# Installation de Bundler
log "\n=== Installation de Bundler ==="
BUNDLER_VERSION_BEFORE=$(bundle --version 2>&1 || echo 'Non installé')
log "Version actuelle de Bundler: $BUNDLER_VERSION_BEFORE"
log "Chemin de bundle: $(which bundle 2>/dev/null || echo 'Non trouvé')"

# Vérification de l'accès au réseau
log "\n=== Vérification de la connectivité réseau ==="
for url in "https://rubygems.org" "https://github.com"; do
  if curl -s --head --request GET "$url" >/dev/null; then
    log "✓ Connexion réussie à $url"
  else
    log "⚠ Impossible de se connecter à $url"
  fi
done

echo "[DEBUG] Installation de Bundler..."
if ! gem install bundler --no-document --force 2>&1; then
  echo "[WARN] Échec de l'installation de Bundler, tentative de continuation..."
  if ! bundle --version >/dev/null 2>&1; then
    echo "[ERROR] Bundler n'est pas accessible après la tentative d'installation"
    exit 1
  fi
fi
echo "[DEBUG] Fin de l'installation de Bundler"

# Vérification des versions installées
log "\n=== Vérification des versions installées ==="
{
  echo "=== Environnement ==="
  echo "Système: $(uname -a)"
  echo "Répertoire: $(pwd)"
  echo "Utilisateur: $(whoami)"
  echo "Date: $(date)"
  echo "\n=== Versions des outils ==="
  echo "Ruby: $(ruby --version 2>&1 || echo 'Non disponible')"
  echo "RubyGems: $(gem --version 2>&1 || echo 'Non disponible')"
  echo "Bundler: $(bundle --version 2>&1 || echo 'Non disponible')"
  echo "Node.js: $(node --version 2>&1 || echo 'Non disponible')"
  echo "npm: $(npm --version 2>&1 || echo 'Non disponible')"
  echo "\n=== Chemins d'exécution ==="
  for cmd in ruby gem bundle node npm; do
    echo "$cmd: $(which $cmd 2>/dev/null || echo 'Non trouvé')"
  done
  echo "\n=== Variables d'environnement ==="
  env | sort
  echo "\n=== Contenu du répertoire ==="
  ls -la
} | tee debug_environment.log

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
bundle env

# Installation des gems
echo -e "\n=== Installation des gems ==="
echo "Contenu du Gemfile :"
cat Gemfile || echo "Impossible de lire le Gemfile"

# Nettoyage du cache de Bundler
echo -e "\nNettoyage du cache de Bundler..."
bundle config unset frozen 2>/dev/null || true
rm -f Gemfile.lock
rm -rf vendor/bundle

# Afficher les informations sur Ruby et Bundler
echo -e "\n=== Informations sur l'environnement ==="
ruby -v || echo "Ruby non disponible"
gem -v || echo "RubyGems non disponible"
node -v || echo "Node.js non disponible"
npm -v || echo "npm non disponible"

# Configuration de Bundler
echo -e "\n=== Configuration de Bundler ==="
bundle config set path 'vendor/bundle' || echo "Avertissement: échec de la configuration du chemin"
bundle config set without 'development:test' || echo "Avertissement: échec de la configuration des groupes"

# Installation des dépendances avec plus de verbosité
echo -e "\nInstallation des dépendances..."
if ! bundle config set force_ruby_platform true; then
  echo "Avertissement: impossible de forcer la plateforme Ruby"
fi

# Installation avec des options plus permissives
if ! bundle install --jobs=4 --retry=3 --full-index 2>&1 | tee build.log; then
  echo "Échec de l'installation des gems. Tentative avec --verbose..."
  if ! bundle install --verbose 2>&1 | tee -a build.log; then
    echo "Échec avec --verbose. Tentative avec --no-cache..."
    if ! bundle install --no-cache 2>&1 | tee -a build.log; then
      echo "Échec avec --no-cache. Affichage des logs..."
      cat build.log
      fail "Échec de l'installation des gems après plusieurs tentatives"
    fi
  fi
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

# Vérification finale du dossier généré
if [ -d "_site" ]; then
  echo "Le dossier _site a été généré avec succès."
  echo '--- Contenu du dossier _site ---'
  ls -lR _site
  echo '--- Fin du contenu du dossier _site ---'
else
  echo "Erreur : le dossier _site n'a pas été généré."
  exit 1
fi

echo "=== Build réussi ! ==="
echo "Taille du dossier _site :"
du -sh _site/
echo "Contenu du répertoire de sortie :"
ls -la _site/
