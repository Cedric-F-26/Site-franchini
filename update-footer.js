const fs = require('fs');
const path = require('path');

// Fonction pour mettre à jour le pied de page d'un fichier HTML
function updateFooter(filePath) {
    try {
        // Lire le contenu du fichier
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Vérifier si le fichier contient déjà le script de chargement du pied de page
        if (content.includes('load-footer.js')) {
            console.log(`Le fichier ${filePath} a déjà été mis à jour.`);
            return;
        }
        
        // Vérifier si le fichier contient une balise </body>
        if (content.includes('</body>')) {
            // Ajouter le script de chargement du pied de page avant la balise </body>
            const updatedContent = content.replace(
                '</body>',
                '    <!-- Chargement du pied de page -->\n    <script src="assets/js/load-footer.js"></script>\n</body>'
            );
            
            // Écrire le contenu mis à jour dans le fichier
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Le fichier ${filePath} a été mis à jour avec succès.`);
        } else {
            console.warn(`Le fichier ${filePath} ne contient pas de balise </body> et ne peut pas être mis à jour.`);
        }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du fichier ${filePath}:`, error);
    }
}

// Fonction pour parcourir récursivement un répertoire et mettre à jour tous les fichiers HTML
function updateAllHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Ne pas parcourir les dossiers admin et node_modules
            if (file !== 'admin' && file !== 'node_modules' && !file.includes('sauvegarde')) {
                updateAllHtmlFiles(filePath);
            }
        } else if (path.extname(file).toLowerCase() === '.html') {
            // Mettre à jour le fichier HTML
            updateFooter(filePath);
        }
    });
}

// Démarrer la mise à jour à partir du répertoire racine
const rootDir = path.join(__dirname);
console.log('Début de la mise à jour des pieds de page...');
updateAllHtmlFiles(rootDir);
console.log('Mise à jour des pieds de page terminée.');
