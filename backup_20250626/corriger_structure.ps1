# Script pour corriger la structure des pages HTML
$pagesDir = "c:\Users\cedri\Documents\GitHub\mon-site-web\Site-franchini\pages"
$template = @"
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Franchini</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <!--#include file="../_includes/header.html" -->
    
    <!-- Contenu principal -->
    <main class="main-content">
        <!-- Le contenu de la page sera inséré ici -->
    </main>
    
    <!--#include file="../_includes/footer.html" -->
</body>
</html>
"@

# Liste des fichiers à ignorer
$excludedFiles = @("connexion-prive.html")

# Fonction pour nettoyer un fichier HTML
function Update-HTMLFile {
    param (
        [string]$filePath
    )
    
    $fileName = Split-Path $filePath -Leaf
    
    # Vérifier si le fichier est dans la liste d'exclusion
    if ($excludedFiles -contains $fileName) {
        Write-Host "Fichier ignoré (dans la liste d'exclusion): $filePath" -ForegroundColor Yellow
        return
    }
    
    Write-Host "Mise à jour du fichier: $filePath" -ForegroundColor Cyan
    
    # Lire le contenu du fichier
    $content = Get-Content -Path $filePath -Raw -Encoding UTF8
    
    # Extraire le contenu entre les balises main s'il existe
    $mainContent = ""
    if ($content -match '<main[^>]*>(.*?)</main>') {
        $mainContent = $matches[1]
    }
    
    # Créer le nouveau contenu avec la structure correcte
    $newContent = $template -replace '<!-- Le contenu de la page sera inséré ici -->', $mainContent
    
    # Mettre à jour le titre de la page
    $pageTitle = $fileName -replace '\.html$', ''
    $pageTitle = $pageTitle -replace '-', ' '
    $pageTitle = (Get-Culture).TextInfo.ToTitleCase($pageTitle)
    $newContent = $newContent -replace '<title>.*?</title>', "<title>Franchini - $pageTitle</title>"
    
    # Écrire le contenu mis à jour
    $newContent | Out-File -FilePath $filePath -Encoding UTF8 -NoNewline
    Write-Host "Fichier mis à jour: $filePath" -ForegroundColor Green
}

# Traiter tous les fichiers HTML dans le dossier pages
Get-ChildItem -Path $pagesDir -Filter "*.html" -File | ForEach-Object {
    Update-HTMLFile -filePath $_.FullName
}

Write-Host "Mise à jour terminée !" -ForegroundColor Green
