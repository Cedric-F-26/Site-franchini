# Script pour corriger l'encodage des fichiers HTML
$baseDir = "c:\Users\cedri\Documents\GitHub\mon-site-web\Site-franchini"

# Fonction pour corriger les caractères mal encodés
function Fix-Encoding {
    param (
        [string]$content
    )
    
    # Remplacer les caractères mal encodés
    $replacements = @{
        'Ãé' = 'é'
        'Ã¨' = 'è'
        'Ãª' = 'ê'
        'Ã«' = 'ë'
        'Ã ' = 'à'
        'Ã´' = 'ô'
        'Ã¹' = 'ù'
        'Ã»' = 'û'
        'Ã§' = 'ç'
        'Ã®' = 'î'
        'Ã¯' = 'ï'
        'Ã‰' = 'É'
        'Ãˆ' = 'È'
        'ÃŠ' = 'Ê'
        'Ã‹' = 'Ë'
        'Ã€' = 'À'
        'Ã'' = 'Ò'
        'Ã™' = 'Ù'
        'Ã›' = 'Û'
        'Ã‡' = 'Ç'
        'ÃŽ' = 'Î'
        'Ã' = 'Ï'
        'â€™' = "'"
        'â€œ' = '"'
        'â€' = '"'
    }
    
    foreach ($key in $replacements.Keys) {
        $content = $content -replace [regex]::Escape($key), $replacements[$key]
    }
    
    return $content
}

# Liste des fichiers HTML à traiter
$htmlFiles = Get-ChildItem -Path $baseDir -Recurse -Include *.html -Exclude *node_modules* | Where-Object { $_.FullName -notlike '*\node_modules\*' }

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Vérifier si le fichier contient des caractères mal encodés
    if ($content -match 'Ãé|Ã¨|Ãª|Ã«|Ã |Ã´|Ã¹|Ã»|Ã§|Ã®|Ã¯|Ã‰|Ãˆ|ÃŠ|Ã‹|Ã€|Ã''|Ã™|Ã›|Ã‡|ÃŽ|Ã|â€|â€™|â€œ') {
        Write-Host "Correction de l'encodage pour : $($file.FullName)"
        
        # Corriger l'encodage
        $content = Fix-Encoding -content $content
        
        # S'assurer que la balise meta charset est présente
        if ($content -notmatch '<meta\s+charset=[\'\"]?utf-8[\'\"]?') {
            $content = $content -replace '<head>', "<head>`n    <meta charset=`"UTF-8`">"
        }
        
        # Écrire le contenu corrigé seulement s'il a changé
        if ($content -ne $originalContent) {
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        }
    }
}

Write-Host "Correction de l'encodage terminée."
