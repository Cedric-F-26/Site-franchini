const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Démarrage du build Vercel ===');

// Fonction pour exécuter une commande
function run(command) {
  console.log(`$ ${command}`);
  try {
    const output = execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    process.exit(1);
  }
}

// Installation de Jekyll et construction du site
console.log('\n=== Installation de Jekyll ===');
run('gem install jekyll bundler');
run('bundle config set path vendor/bundle');
run('bundle install');

// Construction du site
console.log('\n=== Construction du site Jekyll ===');
run('bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace');

// Vérification du répertoire de sortie
if (!fs.existsSync('_site')) {
  console.error('Erreur: Le répertoire _site n\'a pas été généré');
  console.log('Contenu du répertoire:');
  console.log(fs.readdirSync('.').join('\n'));
  process.exit(1);
}

console.log('\n✅ Construction terminée avec succès !');
console.log('Contenu du répertoire _site:');
console.log(fs.readdirSync('_site').join('\n'));
