const fs = require('fs');
const path = require('path');

// Dossier racine du site
const rootDir = __dirname;

// Chemin vers le fichier footer.html
const footerPath = path.join(rootDir, 'includes', 'footer.html');
const footerContent = fs.readFileSync(footerPath, 'utf8');

// Fonction pour mettre à jour le pied de page dans un fichier
function updateFooterInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Vérifier si le fichier contient déjà un footer
        const footerRegex = /<footer[\s\S]*?<\/footer>/i;
        const hasFooter = footerRegex.test(content);
        
        if (hasFooter) {
            // Remplacer le footer existant
            content = content.replace(footerRegex, '<!--#include virtual="/includes/footer.html" -->');
        } else {
            // Ajouter le footer avant la fermeture du body
            content = content.replace(/<\/body>/i, '<!--#include virtual="/includes/footer.html" -->\n</body>');
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Mise à jour effectuée dans : ${filePath}`);
        return true;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du fichier ${filePath}:`, error);
        return false;
    }
}

// Parcourir tous les fichiers HTML
function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Ignorer les dossiers node_modules et .git
            if (!['node_modules', '.git', '.github', 'admin', 'includes', 'assets'].includes(file)) {
                processDirectory(fullPath);
            }
        } else if (file.endsWith('.html') && file !== 'footer.html') {
            updateFooterInFile(fullPath);
        }
    });
}

// Démarrer le traitement
console.log('Début de la mise à jour des pieds de page...');
processDirectory(rootDir);
console.log('Mise à jour terminée !');
