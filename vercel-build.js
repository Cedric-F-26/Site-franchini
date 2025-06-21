const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Installation de Ruby et Jekyll ===');

// Installer Jekyll et Bundler globalement
try {
  console.log('Installation de Jekyll et Bundler...');
  execSync('gem install bundler jekyll', { stdio: 'inherit' });
  
  console.log('Configuration de Bundler...');
  execSync('bundle config set path vendor/bundle', { stdio: 'inherit' });
  
  console.log('Installation des gems...');
  execSync('bundle install', { stdio: 'inherit' });
  
  console.log('Construction du site Jekyll...');
  execSync('bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace', { stdio: 'inherit' });
  
  // Vérifier que le dossier _site a été créé
  if (!fs.existsSync('_site')) {
    console.error('❌ ERREUR: Le dossier _site n\'a pas été généré');
    console.log('Contenu du répertoire :');
    console.log(fs.readdirSync('.').join('\n'));
    process.exit(1);
  }
  
  console.log('✅ Construction terminée avec succès !');
  console.log('Contenu du répertoire _site :');
  console.log(fs.readdirSync('_site').join('\n'));
  
} catch (error) {
  console.error('❌ Erreur lors de la construction :', error);
  process.exit(1);
}
