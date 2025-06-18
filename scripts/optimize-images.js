const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Vérifier si sharp est installé, sinon l'installer
try {
  require('sharp');
} catch (e) {
  console.log('Installation de sharp...');
  execSync('npm install sharp --save-dev', { stdio: 'inherit' });
}

const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminWebp = require('imagemin-webp');

// Dossiers à traiter
const imageDirs = [
  'assets/images',
  'assets/img',
  'images',
  'img'
].filter(dir => fs.existsSync(dir));

// Formats supportés
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

async function optimizeImages() {
  console.log('Début de l\'optimisation des images...');
  
  for (const dir of imageDirs) {
    console.log(`\nTraitement du dossier: ${dir}`);
    
    // Créer un dossier pour les images optimisées
    const optimizedDir = path.join(dir, 'optimized');
    if (!fs.existsSync(optimizedDir)) {
      fs.mkdirSync(optimizedDir, { recursive: true });
    }

    // Lire les fichiers du dossier
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      
      // Vérifier si c'est un fichier image supporté
      if (SUPPORTED_FORMATS.includes(ext)) {
        const inputPath = path.join(dir, file);
        const outputPath = path.join(optimizedDir, file);
        
        try {
          console.log(`Optimisation de: ${file}`);
          
          // Optimiser avec sharp
          await sharp(inputPath)
            .withMetadata()
            .toFile(outputPath);
            
          // Optimisation supplémentaire avec imagemin
          await imagemin([outputPath], {
            destination: optimizedDir,
            plugins: [
              imageminJpegtran(),
              imageminPngquant({
                quality: [0.6, 0.8]
              }),
              imageminSvgo(),
              imageminWebp({ quality: 80 })
            ]
          });
          
          console.log(`✓ ${file} optimisé avec succès`);
        } catch (error) {
          console.error(`Erreur lors de l'optimisation de ${file}:`, error.message);
        }
      }
    }
  }
  
  console.log('\nOptimisation des images terminée !');
}

// Exécuter la fonction
optimizeImages().catch(console.error);
