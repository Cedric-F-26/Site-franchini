const fs = require('fs');
const path = require('path');

// Dossiers à ignorer
const IGNORE_DIRS = ['node_modules', '.git', 'assets', 'admin', 'includes'];

// Fonction pour nettoyer le contenu HTML
function cleanHtmlContent(content) {
    // Supprimer tous les scripts de chargement du pied de page existants
    content = content.replace(/<!--\s*Chargement du pied de page\s*-->[\s\n]*<script[^>]*load-footer\.js[^>]*><\/script>/gi, '');
    
    // Supprimer tous les pieds de page existants
    content = content.replace(/<footer[\s\S]*?<\/footer>/g, '');
    
    return content;
}

// Fonction pour mettre à jour un fichier HTML
function updateHtmlFile(filePath) {
    try {
        // Lire le contenu du fichier
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Nettoyer le contenu
        const cleanedContent = cleanHtmlContent(content);
        
        // Vérifier si le contenu a changé
        if (cleanedContent !== content) {
            content = cleanedContent;
            console.log(`Contenu nettoyé pour : ${filePath}`);
        } else {
            console.log(`Aucun nettoyage nécessaire pour : ${filePath}`);
        }
        
        // Vérifier si le fichier contient une balise </body>
        if (content.includes('</body>')) {
            // Ajouter le script avant la balise de fermeture </body>
            const updatedContent = content.replace(
                '</body>',
                '    <!-- Chargement du pied de page -->\n    <script src="/assets/js/load-footer.js"></script>\n</body>'
            );
            
            // Écrire le contenu mis à jour dans le fichier
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Fichier mis à jour : ${filePath}`);
        } else {
            console.log(`Le fichier ${filePath} ne contient pas de balise </body>.`);
        }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du fichier ${filePath}:`, error);
    }
}

// Fonction pour parcourir récursivement un dossier
function processDirectory(directory) {
    try {
        const files = fs.readdirSync(directory);
        
        files.forEach(file => {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);
            
            // Ignorer les dossiers spécifiés
            if (stat.isDirectory() && !IGNORE_DIRS.includes(file)) {
                processDirectory(fullPath);
            } else if (file.endsWith('.html')) {
                updateHtmlFile(fullPath);
            }
        });
    } catch (error) {
        console.error(`Erreur lors du traitement du répertoire ${directory}:`, error);
    }
}

// Démarrer le traitement à partir du répertoire racine du site
const rootDir = path.join(__dirname);
console.log('Début de la mise à jour des fichiers HTML...');
processDirectory(rootDir);
console.log('Mise à jour terminée.');
