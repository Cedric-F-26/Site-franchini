#!/bin/bash
set -e  # Arrêter le script en cas d'erreur

# Charger la configuration
CONFIG_FILE="$(dirname "$0")/vercel-build.config.js"

# Vérifier si le fichier de configuration existe
if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Erreur: Fichier de configuration $CONFIG_FILE introuvable" >&2
  exit 1
fi

# Extraire les valeurs de configuration
NODE_CMD=$(node -p "require('$CONFIG_FILE').versions.node")
RUBY_CMD=$(node -p "require('$CONFIG_FILE').versions.ruby")
BUNDLER_CMD=$(node -p "require('$CONFIG_FILE').versions.bundler")
NPM_CMD=$(node -p "require('$CONFIG_FILE').versions.npm")

# Fonction pour afficher des messages formatés
log() {
  echo -e "\n\033[1;34m==> $1\033[0m"
}

# Vérification des versions des outils
check_version() {
  local name=$1
  local current_version=$2
  local required_version=$3
  
  # Extraire la version numérique pour la comparaison
  local current_num=$(echo "$current_version" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
  
  if [ -z "$current_num" ]; then
    echo "⚠️  Impossible de détecter la version de $name"
    return 1
  fi
  
  # Comparaison de version simplifiée
  if [ "$(printf '%s\n' "$required_version" "$current_num" | sort -V | head -n1)" = "$required_version" ]; then
    echo "✅ $name: $current_version (requis: $required_version)"
    return 0
  else
    echo "❌ $name: $current_version (version requise: $required_version)" >&2
    return 1
  fi
}

# Afficher les versions des outils
log "Vérification des versions des outils :"
check_version "Node.js" "$(node --version)" "$(echo $NODE_CMD | sed 's/[^0-9.]//g')" || exit 1
check_version "npm" "$(npm --version)" "$(echo $NPM_CMD | sed 's/[^0-9.]//g')" || exit 1
check_version "Ruby" "$(ruby --version)" "$(echo $RUBY_CMD | sed 's/[^0-9.]//g')" || exit 1

# Vérification de Bundler
if ! command -v bundle &> /dev/null; then
  log "⚠️  Bundler n'est pas installé. Installation en cours..."
  gem install bundler || { echo "❌ Impossible d'installer Bundler"; exit 1; }
fi

# Récupération de la version de Bundler
BUNDLER_VERSION=$(bundle --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
if [ -z "$BUNDLER_VERSION" ]; then
  log "⚠️  Impossible de détecter la version de Bundler, continuation avec la version par défaut"
  echo "ℹ️  Bundler sera installé avec la version requise si nécessaire"
else
  REQUIRED_BUNDLER=$(echo $BUNDLER_CMD | sed 's/[^0-9.]//g')
  log "✅ Bundler version détectée: $BUNDLER_VERSION (requise: $REQUIRED_BUNDLER)"
  
  # Vérification de la version minimale requise
  if [ "$(printf '%s\n' "$REQUIRED_BUNDLER" "$BUNDLER_VERSION" | sort -V | head -n1)" != "$REQUIRED_BUNDLER" ]; then
    log "⚠️  Mise à jour de Bundler vers la version requise ($REQUIRED_BUNDLER)..."
    gem install bundler:$REQUIRED_BUNDLER || {
      echo "❌ Impossible de mettre à jour Bundler"; 
      exit 1;
    }
  fi
fi

# Configuration de l'environnement
export JEKYLL_ENV=$(node -p "require('$CONFIG_FILE').jekyll.env")

# Installation des dépendances Node.js
log "Installation des dépendances Node.js..."
NODE_INSTALL_CMD=$(node -p "require('$CONFIG_FILE').installCommands.node")
eval "$NODE_INSTALL_CMD"

# Configuration de Bundler
log "Configuration de Bundler..."
BUNDLER_PATH=$(node -p "require('$CONFIG_FILE').bundler.path")
BUNDLER_JOBS=$(node -p "require('$CONFIG_FILE').bundler.jobs")
BUNDLER_RETRY=$(node -p "require('$CONFIG_FILE').bundler.retry")

bundle config set --local path "$BUNDLER_PATH"
bundle config set --local deployment $(node -p "require('$CONFIG_FILE').bundler.deployment")
bundle config set --local without $(node -p "require('$CONFIG_FILE').bundler.without")
bundle config set --local clean $(node -p "require('$CONFIG_FILE').bundler.clean")
bundle config set --local no-prune $(node -p "require('$CONFIG_FILE').bundler.noPrune")

# Installation des dépendances Ruby
log "Installation des dépendances Ruby..."
RUBY_INSTALL_CMD=$(node -p "require('$CONFIG_FILE').installCommands.ruby")
RUBY_CLEAN_CMD=$(node -p "require('$CONFIG_FILE').installCommands.rubyClean")

if ! eval "$RUBY_INSTALL_CMD"; then
  log "⚠️  Échec de l'installation, tentative avec --clean..."
  if ! eval "$RUBY_CLEAN_CMD"; then
    log "❌ Échec de l'installation des dépendances Ruby"
    exit 1
  fi
fi

# Nettoyage du cache Jekyll
log "Nettoyage du cache Jekyll..."
bundle exec jekyll clean || true

# Construction du site Jekyll
log "Construction du site Jekyll..."
JEKYLL_BUILD_CMD="bundle exec jekyll build"
BUILD_OPTIONS=($(node -p "require('$CONFIG_FILE').jekyll.buildOptions.join(' ')"))

if ! eval "$JEKYLL_BUILD_CMD ${BUILD_OPTIONS[@]}"; then
  log "⚠️  Construction échouée, tentative avec les options de secours..."
  SAFE_OPTIONS=($(node -p "require('$CONFIG_FILE').jekyll.safeBuildOptions.join(' ')"))
  if ! eval "$JEKYLL_BUILD_CMD ${SAFE_OPTIONS[@]}"; then
    log "❌ Échec de la construction du site Jekyll"
    exit 1
  fi
fi

# Vérification du répertoire de sortie
log "Vérification du répertoire de sortie..."
if [ -d "_site" ] && [ -n "$(ls -A _site 2>/dev/null)" ]; then
  # Vérification des fichiers critiques
  CRITICAL_FILES=($(node -p "require('$CONFIG_FILE').criticalFiles.join('\n')"))
  MISSING_FILES=()
  
  for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -e "_site/$file" ] && [ ! -e "_site/${file%/}" ]; then
      MISSING_FILES+=("$file")
    fi
  done
  
  if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    log "⚠️  Fichiers critiques manquants :"
    for file in "${MISSING_FILES[@]}"; do
      echo "   - $file"
    done
    log "ℹ️  Le site a été construit mais certains fichiers critiques sont manquants."
  fi
  
  echo "✅ Répertoire _site/ généré avec succès"
  echo "📦 Taille du répertoire: $(du -sh _site | cut -f1)"
  echo "📂 Contenu du répertoire:"
  ls -la _site/
  
  log "✅ Build terminé avec succès !"
  exit 0
else
  log "❌ Erreur: Le répertoire _site/ n'a pas été généré ou est vide !"
  exit 1
fi