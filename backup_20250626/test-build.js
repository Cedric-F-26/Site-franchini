const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Test de la construction du site...');

// Vérifier si le dossier _site existe, sinon le créer
if (!fs.existsSync('_site')) {
  fs.mkdirSync('_site');
}

// Vérifier si le fichier index.html existe dans _site
const indexPath = path.join('_site', 'index.html');
if (fs.existsSync(indexPath)) {
  console.log(`✅ Fichier index.html trouvé dans _site`);
  console.log('📂 Contenu du dossier _site:');
  console.log(fs.readdirSync('_site').join('\n'));
} else {
  console.error('❌ Erreur: index.html introuvable dans _site');
  console.log('Essayez de construire le site manuellement avec:');
  console.log('   bundle exec jekyll build --trace');
  process.exit(1);
}

// Vérifier si le fichier 404.html existe
const notFoundPath = path.join('_site', '404.html');
if (!fs.existsSync(notFoundPath)) {
  console.warn('⚠️  Attention: 404.html non trouvé dans _site');
  console.log('Création d\'une page 404 par défaut...');
  
  const default404 = `<!DOCTYPE html>
<html>
<head>
  <title>404 - Page non trouvée</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
    h1 { font-size: 50px; }
  </style>
</head>
<body>
  <h1>404</h1>
  <p>Désolé, la page que vous recherchez n'existe pas.</p>
  <p><a href="/">Retour à l'accueil</a></p>
</body>
</html>`;
  
  fs.writeFileSync(notFoundPath, default404);
  console.log('✅ Page 404 par défaut créée');
}

console.log('\n✅ Test de construction terminé avec succès');
console.log('Pour tester localement, exécutez:');
console.log('   bundle exec jekyll serve --watch');
console.log('puis ouvrez http://localhost:4000 dans votre navigateur');
