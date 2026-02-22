const fs = require('fs');
const path = require('path');

// Nouveau contenu du pied de page
const newFooter = `    <!-- Pied de page -->
    <footer style="background-color: #1a1a1a; color: white; text-align: center; padding: 20px 0; margin-top: 40px;">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 15px;">
            <div style="margin-bottom: 15px; font-weight: bold; font-size: 18px;">FRANCHINI</div>
            <div style="margin-bottom: 10px;">111 av des monts du matin</div>
            <div style="margin-bottom: 10px;">26300 Marches</div>
            <div style="margin-bottom: 15px;">
                <a href="tel:0475474037" style="color: #4CAF50; text-decoration: none;">04 75 47 40 37</a>
            </div>
            <div style="font-size: 12px; color: #aaa; margin-top: 20px; padding-top: 15px; border-top: 1px solid #333;">
                © ${new Date().getFullYear()} Franchini SARL. Tous droits réservés. 
                <a href="pages/connexion-prive.html" style="color: #4CAF50; text-decoration: none; margin-left: 10px;">Connexion privée</a>
            </div>
        </div>
    </footer>
</body>`;

// Fonction pour mettre à jour le pied de page d'un fichier HTML
function updateFooter(filePath) {
    try {
        // Lire le contenu du fichier
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Vérifier si le fichier contient déjà le footer
        if (content.includes('FRANCHINI') && content.includes('111 av des monts du matin')) {
            console.log(`Le fichier ${filePath} a déjà le nouveau pied de page.`);
            return;
        }
        
        // Vérifier si le fichier contient une balise </body>
        if (content.includes('</body>')) {
            // Supprimer l'ancien footer s'il existe
            content = content.replace(/<footer[\s\S]*?<\/footer>\s*<\/body>/, '');
            
            // Remplacer la balise </body> par le nouveau footer
            const updatedContent = content.replace('</body>', newFooter);
            
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
            // Ne pas parcourir les dossiers admin, node_modules et sauvegarde_MP
            if (file !== 'admin' && file !== 'node_modules' && file !== 'sauvegarde_MP' && !file.startsWith('.')) {
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
