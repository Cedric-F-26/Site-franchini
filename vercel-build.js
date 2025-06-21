const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Fonction pour exécuter une commande et afficher la sortie
function runCommand(command, cwd = process.cwd()) {
  console.log(`Exécution: ${command}`);
  try {
    const output = execSync(command, { 
      stdio: 'inherit',
      cwd,
      env: { ...process.env, NODE_ENV: 'production' }
    });
    return true;
  } catch (error) {
    console.error(`Erreur lors de l'exécution de la commande: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('=== Début du processus de build Vercel ===');
  
  // Vérifier si Ruby est installé
  try {
    const rubyVersion = execSync('ruby --version').toString().trim();
    console.log(`Ruby version: ${rubyVersion}`);
  } catch (error) {
    console.error('Erreur: Ruby n\'est pas installé ou n\'est pas dans le PATH');
    process.exit(1);
  }

  // Installer les dépendances Ruby
  if (!runCommand('gem install bundler')) {
    process.exit(1);
  }

  // Installer les dépendances du projet
  if (!runCommand('bundle install --jobs 4 --retry 3')) {
    process.exit(1);
  }

  // Construire le site Jekyll
  if (!runCommand('bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace')) {
    process.exit(1);
  }

  // Vérifier que le dossier _site a été créé
  if (!fs.existsSync('_site')) {
    console.error('Erreur: Le dossier _site n\'a pas été généré');
    process.exit(1);
  }

  console.log('=== Build terminé avec succès ===');
  process.exit(0);
}

// Démarrer le processus
main().catch(error => {
  console.error('Erreur inattendue:', error);
  process.exit(1);
});
