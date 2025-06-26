# Script de construction pour Windows

# Fonction pour afficher les messages avec horodatage
function Write-Log {
    param([string]$message)
    Write-Output "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $message"
}

Write-Log "=== Début du script de build Windows ==="
Write-Log "Répertoire de travail: $(Get-Location)"
Write-Log "Utilisateur: $env:USERNAME"

# Vérifier si Ruby est installé
$rubyVersion = ruby --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Log "❌ Erreur: Ruby n'est pas installé ou n'est pas dans le PATH"
    Write-Log "Veuillez installer Ruby depuis https://rubyinstaller.org/"
    exit 1
}
Write-Log "Ruby version: $rubyVersion"

# Vérifier si Bundler est installé
$bundleVersion = bundle --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Log "Installation de Bundler..."
    gem install bundler
    if ($LASTEXITCODE -ne 0) {
        Write-Log "❌ Erreur lors de l'installation de Bundler"
        exit 1
    }
}
Write-Log "Bundler version: $(bundle --version)"

# Installer les dépendances
Write-Log "=== Installation des dépendances Jekyll ==="
bundle config set --local path 'vendor/bundle'
bundle install --jobs 4 --retry 3 --verbose
if ($LASTEXITCODE -ne 0) {
    Write-Log "❌ Erreur lors de l'installation des dépendances"
    exit 1
}

# Vérifier la configuration Jekyll
Write-Log "=== Vérification de la configuration Jekyll ==="
bundle exec jekyll doctor 2>&1 | ForEach-Object { Write-Log $_ }

# Construire le site
Write-Log "=== Construction du site ==="
$env:JEKYLL_ENV = "production"
bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace --profile --verbose
if ($LASTEXITCODE -ne 0) {
    Write-Log "❌ Erreur lors de la construction du site"
    exit 1
}

# Vérifier que le dossier _site a été créé
if (-not (Test-Path "_site")) {
    Write-Log "❌ Erreur: Le dossier _site n'a pas été généré"
    Write-Log "Contenu du répertoire :"
    Get-ChildItem -Force | Format-Table Name, Length, LastWriteTime
    exit 1
}

Write-Log "✅ Build terminé avec succès"
Write-Log "📁 Contenu du dossier _site :"
Get-ChildItem -Path "_site" -Force | Select-Object -First 10 | Format-Table Name, Length, LastWriteTime

# Vérifier la taille du dossier _site
$size = (Get-ChildItem -Path "_site" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Log "Taille du dossier _site : $([math]::Round($size, 2)) Mo"

Write-Log "=== Fin du script de build Windows ==="

exit 0
