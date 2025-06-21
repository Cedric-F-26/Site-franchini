const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Fonction pour exécuter une commande et afficher la sortie
function runCommand(command, cwd = process.cwd()) {
  console.log(`🚀 Exécution: ${command}`);
  try {
    console.log(`📂 Répertoire: ${cwd}`);
    const output = execSync(command, { 
      stdio: 'inherit',
      cwd,
      env: { 
        ...process.env, 
        NODE_ENV: 'production',
        LANG: 'en_US.UTF-8',
        LC_ALL: 'en_US.UTF-8'
      },
      shell: '/bin/bash'
    });
    console.log(`✅ Commande exécutée avec succès: ${command}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de l'exécution de la commande: ${command}`);
    console.error(`💥 Erreur: ${error.message}`);
    console.error(`📌 Code de sortie: ${error.status}`);
    console.error(`📋 Sortie d'erreur: ${error.stderr ? error.stderr.toString() : 'Aucune sortie d\'erreur'}`);
    return false;
  }
}

// Fonction pour afficher des informations sur l'environnement
function logEnvironmentInfo() {
  console.log('\n=== Informations sur l\'environnement ===');
  console.log(`Répertoire de travail: ${process.cwd()}`);
  console.log(`Utilisateur: ${process.env.USER || process.env.USERNAME || 'Inconnu'}`);
  console.log(`Système: ${process.platform} ${process.arch}`);
  console.log(`Node.js: ${process.version}`);
  console.log(`NPM: ${execSync('npm --version').toString().trim()}`);
  
  try {
    console.log(`Ruby: ${execSync('ruby --version').toString().trim()}`);
  } catch (e) {
    console.log('Ruby: Non installé');
  }
  
  try {
    console.log(`Bundler: ${execSync('bundle --version').toString().trim()}`);
  } catch (e) {
    console.log('Bundler: Non installé');
  }
  
  console.log('=== Fin des informations sur l\'environnement ===\n');
}

// Fonction principale
async function main() {
  console.log('🚀 === Début du processus de build Vercel ===');
  
  // Afficher les informations sur l'environnement
  logEnvironmentInfo();
  
  console.log('📂 Contenu du répertoire avant installation:');
  console.log(fs.readdirSync('.').join('\n'));
  
  // Vérifier si Ruby est installé
  console.log('🔍 Vérification de Ruby...');
  try {
    const rubyVersion = execSync('ruby --version').toString().trim();
    console.log(`✅ ${rubyVersion}`);
  } catch (error) {
    console.error('❌ Erreur: Ruby n\'est pas installé ou n\'est pas dans le PATH');
    console.error('💡 Solution: Installez Ruby ou assurez-vous qu\'il est dans le PATH');
    process.exit(1);
  }

  // Installer Bundler
  console.log('\n📦 Installation de Bundler...');
  if (!runCommand('gem install bundler --no-document')) {
    console.error('❌ Échec de l\'installation de Bundler');
    process.exit(1);
  }

  // Installer les dépendances du projet
  console.log('\n📦 Installation des dépendances du projet...');
  if (!runCommand('bundle install --jobs 4 --retry 3 --verbose')) {
    console.error('❌ Échec de l\'installation des dépendances du projet');
    process.exit(1);
  }

  // Vérifier la configuration Jekyll
  console.log('\n🔍 Vérification de la configuration Jekyll...');
  if (!runCommand('bundle exec jekyll doctor')) {
    console.warn('⚠️ Des avertissements ont été détectés dans la configuration Jekyll');
  }

  // Construire le site Jekyll
  console.log('\n🏗️  Construction du site Jekyll...');
  if (!runCommand('bundle exec jekyll build --config _config.yml,_config_vercel.yml --trace --verbose')) {
    console.error('❌ Échec de la construction du site Jekyll');
    process.exit(1);
  }

  // Vérifier que le dossier _site a été créé
  console.log('\n🔍 Vérification du dossier _site...');
  if (!fs.existsSync('_site')) {
    console.error('❌ Erreur: Le dossier _site n\'a pas été généré');
    console.log('📂 Contenu du répertoire actuel:');
    console.log(fs.readdirSync('.').join('\n'));
    process.exit(1);
  }
  
  // Afficher la taille du dossier _site
  try {
    const size = require('child_process').execSync('du -sh _site').toString().trim();
    console.log(`📊 Taille du dossier _site: ${size}`);
  } catch (e) {
    console.log('ℹ️ Impossible de déterminer la taille du dossier _site');
  }
  
  console.log('\n✅ === Build terminé avec succès ===');
  console.log('🚀 Le site est prêt à être déployé !');
  process.exit(0);
}

// Démarrer le processus
main().catch(error => {
  console.error('Erreur inattendue:', error);
  process.exit(1);
});
