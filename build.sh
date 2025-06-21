#!/bin/bash
set -e

# Créer un fichier de log
exec > >(tee build.log) 2>&1

# Fonction pour afficher les messages avec horodatage
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Fonction pour vérifier si on est sur Windows
is_windows() {
    case "$(uname -s)" in
        *CYGWIN*|*MINGW*|*MSYS*) return 0;;
        *) return 1;;
    esac
}

log "=== Début du script de build ==="
log "Système d'exploitation: $(uname -a)"
log "Répertoire de travail: $(pwd)"
log "Utilisateur: $(whoami 2>/dev/null || echo 'Non disponible')"
log "Ruby version: $(ruby --version 2>/dev/null || echo 'Ruby non installé')"
log "Bundler version: $(bundle --version 2>/dev/null || echo 'Bundler non installé')"

# Vérifier si on est sur Windows
if is_windows; then
    log "Détection: Environnement Windows détecté"
    log "Assurez-vous que Ruby et Bundler sont installés manuellement sur Windows"
else
    log "Détection: Environnement Linux détecté"
    # Vérifier et installer Ruby si nécessaire
    if ! command -v ruby >/dev/null 2>&1; then
        log "Ruby n'est pas installé. Installation en cours..."
        apt-get update && apt-get install -y ruby-full build-essential zlib1g-dev
    fi

    # Vérifier et installer RubyGems si nécessaire
    if ! command -v gem >/dev/null 2>&1; then
        log "RubyGems n'est pas installé. Installation en cours..."
        apt-get install -y rubygems
    fi

    # Installer Bundler si nécessaire
    if ! command -v bundle >/dev/null 2>&1; then
        log "=== Installation de Bundler ==="
        gem install bundler
    fi
fi

# Configurer l'environnement Ruby
export GEM_HOME="${GEM_HOME:-$HOME/gems}"
export PATH="$GEM_HOME/bin:$PATH"
log "GEM_HOME: $GEM_HOME"
log "PATH: $PATH"

# Afficher les versions installées
log "=== Versions installées ==="
ruby --version || { log "Erreur: Ruby n'est pas correctement installé"; exit 1; }
bundle --version || { log "Erreur: Bundler n'est pas correctement installé"; exit 1; }

# Installer les dépendances Jekyll
log "=== Installation des dépendances Jekyll ==="
bundle config set --local path 'vendor/bundle'
bundle install --jobs 4 --retry 3 --verbose || { log "Erreur lors de l'installation des dépendances"; exit 1; }

# Vérifier la configuration Jekyll
log "=== Vérification de la configuration Jekyll ==="
bundle exec jekyll doctor 2>&1 || log "Avertissement: Jekyll doctor a rencontré des problèmes"

# Construire le site avec la configuration Vercel
log "=== Construction du site ==="
bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace --profile --verbose || { log "Erreur lors de la construction du site"; exit 1; }

# Vérifier que le dossier _site a été créé
if [ ! -d "_site" ]; then
    log "❌ Erreur: Le dossier _site n'a pas été généré"
    log "Contenu du répertoire :"
    ls -la
    exit 1
fi

log "✅ Build terminé avec succès"
log "📁 Contenu du dossier _site :"
ls -la _site | head -n 10

# Vérifier la taille du dossier _site
log "Taille du dossier _site :"
if command -v du >/dev/null 2>&1; then
    du -sh _site
else
    log "La commande 'du' n'est pas disponible. Impossible d'afficher la taille du dossier."
fi

log "=== Fin du script de build ==="

exit 0
