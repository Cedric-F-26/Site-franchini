const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Fonction pour exécuter une commande de manière synchrone avec affichage en temps réel
function runCommand(command, cwd = process.cwd()) {
  console.log(`\n$ ${command}`);
  try {
    execSync(command, { stdio: 'inherit', cwd, env: { ...process.env, FORCE_COLOR: '1' } });
    return true;
  } catch (error) {
    console.error(`\n❌ Erreur lors de l'exécution de la commande: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Fonction principale de build
async function build() {
  console.log('🚀 Démarrage du processus de build pour Vercel\n');
  
  // Vérification des versions
  console.log('📦 Vérification des versions des outils :');
  console.log(`- Node.js: ${process.version}`);
  console.log(`- npm: ${execSync('npm --version', { encoding: 'utf-8' }).trim()}`);
  console.log(`- Ruby: ${execSync('ruby --version', { encoding: 'utf-8' }).trim()}`);
  console.log(`- Bundler: ${execSync('bundle --version', { encoding: 'utf-8' }).trim()}\n`);

  // Installation des dépendances Node.js
  console.log('🔧 Installation des dépendances Node.js...');
  if (!runCommand('npm install --prefer-offline --no-audit --progress=false')) {
    process.exit(1);
  }

  // Configuration de Bundler
  console.log('\n🔄 Configuration de Bundler...');
  if (!runCommand('bundle config set --local path vendor/bundle') ||
      !runCommand('bundle config set --local deployment true') ||
      !runCommand('bundle config set --local without development:test') ||
      !runCommand('bundle config set --local clean true') ||
      !runCommand('bundle config set --local no-prune true')) {
    process.exit(1);
  }

  // Installation des dépendances Ruby
  console.log('\n💎 Installation des dépendances Ruby...');
  if (!runCommand('bundle install --jobs=4 --retry=3')) {
    console.log('\n⚠️  Tentative de récupération du cache...');
    if (!runCommand('bundle install --jobs=4 --retry=3 --redownload')) {
      process.exit(1);
    }
  }

  // Nettoyage du cache Jekyll
  console.log('\n🧹 Nettoyage du cache Jekyll...');
  runCommand('bundle exec jekyll clean');

  // Construction du site Jekyll
  console.log('\n🔨 Construction du site Jekyll...');
  if (!runCommand('bundle exec jekyll build --trace --verbose')) {
    console.log('\n⚠️  Construction échouée, tentative avec l\'option --safe...');
    if (!runCommand('bundle exec jekyll build --trace --verbose --safe')) {
      process.exit(1);
    }
  }

  // Vérification du répertoire de sortie
  console.log('\n📂 Vérification du répertoire de sortie :');
  const outputDir = path.join(process.cwd(), '_site');
  if (fs.existsSync(outputDir)) {
    const files = fs.readdirSync(outputDir);
    console.log(`Contenu du répertoire _site/ :\n${files.join('\n')}`);
    
    // Vérification de l'existence des fichiers critiques
    const criticalFiles = ['index.html', 'assets/', 'css/'];
    const missingFiles = criticalFiles.filter(file => !files.some(f => f.startsWith(file.replace(/[\/\\]*$/, ''))));
    
    if (missingFiles.length > 0) {
      console.error(`\n❌ Fichiers critiques manquants : ${missingFiles.join(', ')}`);
      process.exit(1);
    }
  } else {
    console.error('\n❌ Le répertoire _site/ n\'a pas été généré !');
    process.exit(1);
  }

  console.log('\n✅ Build terminé avec succès !');
}

// Exécution du build
build().catch(error => {
  console.error('\n❌ Erreur inattendue :', error);
  process.exit(1);
});
