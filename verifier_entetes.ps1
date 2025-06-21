# Script pour vérifier et corriger les entêtes et pieds de page
$rootDir = "c:\Users\cedri\Documents\GitHub\mon-site-web\Site-franchini"
$pagesDir = Join-Path $rootDir "pages"
$publicDir = Join-Path $rootDir "public"
$includesDir = Join-Path $rootDir "_includes"

# Liste des fichiers à ignorer (comme la page de connexion)
$excludedFiles = @("connexion-prive.html")

# Fonction pour vérifier et corriger un fichier HTML
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
    
    $content = Get-Content -Path $filePath -Raw -Encoding UTF8
    
    # Vérifier si le fichier contient déjà le header et le footer
    $hasHeader = $content -match '<!-- Header -->'
    $hasFooter = $content -match '<!-- Footer -->'
    
    if ($hasHeader -and $hasFooter) {
        Write-Host "Le fichier $fileName a déjà un header et un footer" -ForegroundColor Green
        return
    }
    
    Write-Host "Mise à jour du fichier: $fileName" -ForegroundColor Cyan
    
    # Lire le contenu du header et du footer
    $headerContent = Get-Content (Join-Path $includesDir "header.html") -Raw -Encoding UTF8
    $footerContent = Get-Content (Join-Path $includesDir "footer.html") -Raw -Encoding UTF8
    
    # Si le fichier n'a pas de header, l'ajouter
    if (-not $hasHeader) {
        # Trouver la balise <body> et insérer le header après
        $content = $content -replace '<body[^>]*>', "`$0`n<!-- Header -->`n$headerContent"
    }
    
    # Si le fichier n'a pas de footer, l'ajouter avant </body>
    if (-not $hasFooter) {
        $content = $content -replace '</body>', "<!-- Footer -->`n$footerContent`n</body>"
    }
    
    # Écrire le contenu mis à jour
    $content | Out-File -FilePath $filePath -Encoding UTF8 -NoNewline
    Write-Host "Fichier mis à jour: $fileName" -ForegroundColor Green
}

# Traiter tous les fichiers HTML dans le dossier pages
Get-ChildItem -Path $pagesDir -Filter "*.html" -File | ForEach-Object {
    Update-HTMLFile -filePath $_.FullName
}

# Traiter le fichier index.html dans le dossier public
$publicIndex = Join-Path $publicDir "index.html"
if (Test-Path $publicIndex) {
    Update-HTMLFile -filePath $publicIndex
}

Write-Host "Vérification terminée !" -ForegroundColor Green
