# Script pour nettoyer et normaliser les fichiers HTML
$rootDir = "c:\Users\cedri\Documents\GitHub\mon-site-web\Site-franchini"
$pagesDir = Join-Path $rootDir "pages"
$publicDir = Join-Path $rootDir "public"
$includesDir = Join-Path $rootDir "_includes"

# Liste des fichiers à ignorer
$excludedFiles = @("connexion-prive.html")

# Fonction pour nettoyer un fichier HTML
function Clean-HTMLFile {
    param (
        [string]$filePath
    )
    
    $fileName = Split-Path $filePath -Leaf
    
    # Vérifier si le fichier est dans la liste d'exclusion
    if ($excludedFiles -contains $fileName) {
        Write-Host "Fichier ignoré (dans la liste d'exclusion): $filePath" -ForegroundColor Yellow
        return
    }
    
    Write-Host "Nettoyage du fichier: $fileName" -ForegroundColor Cyan
    
    # Lire le contenu du fichier
    $content = Get-Content -Path $filePath -Raw -Encoding UTF8
    
    # Supprimer les doublons de DOCTYPE, html, head, body
    $content = $content -replace '(?s)<!DOCTYPE[^>]*>', ''
    $content = $content -replace '(?s)<html[^>]*>', ''
    $content = $content -replace '(?s)</html>', ''
    $content = $content -replace '(?s)<head>.*?</head>', ''
    
    # Supprimer les balises body et header en double
    $content = $content -replace '(?s)<body[^>]*>', ''
    $content = $content -replace '(?s)</body>', ''
    $content = $content -replace '(?s)<!-- Header -->.*?<header', '<!-- Header -->
    <header'
    
    # Reconstruire la structure HTML
    $header = Get-Content (Join-Path $includesDir "header.html") -Raw -Encoding UTF8
    $footer = Get-Content (Join-Path $includesDir "footer.html") -Raw -Encoding UTF8
    
    $newContent = @"
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Franchini - Occasions</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
$header
$content
$footer
</body>
</html>
"@
    
    # Écrire le contenu nettoyé
    $newContent | Out-File -FilePath $filePath -Encoding UTF8 -NoNewline
    Write-Host "Fichier nettoyé: $fileName" -ForegroundColor Green
}

# Traiter tous les fichiers HTML dans le dossier pages
Get-ChildItem -Path $pagesDir -Filter "*.html" -File | ForEach-Object {
    Clean-HTMLFile -filePath $_.FullName
}

# Traiter le fichier index.html dans le dossier public
$publicIndex = Join-Path $publicDir "index.html"
if (Test-Path $publicIndex) {
    Clean-HTMLFile -filePath $publicIndex
}

Write-Host "Nettoyage terminé !" -ForegroundColor Green
