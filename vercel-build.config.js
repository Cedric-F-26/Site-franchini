/**
 * Configuration pour le build Vercel
 * Ce fichier contient les paramètres de configuration pour le processus de build
 */

module.exports = {
  // Configuration des versions des outils
  versions: {
    node: '>=18.0.0',
    npm: '>=9.0.0',
    ruby: '>= 3.2.0 < 3.3.0',
    bundler: '>= 2.0.0'
  },

  // Configuration de Bundler
  bundler: {
    path: 'vendor/bundle',
    deployment: true,
    without: 'development:test',
    clean: true,
    noPrune: true,
    retry: 3,
    jobs: 4
  },

  // Configuration de Jekyll
  jekyll: {
    env: 'production',
    buildCommand: 'bundle exec jekyll build',
    buildOptions: [
      '--trace',
      '--verbose',
      '--incremental',
      '--profile'
    ],
    safeBuildOptions: [
      '--safe',
      '--trace',
      '--verbose'
    ]
  },

  // Fichiers critiques à vérifier après le build
  criticalFiles: [
    'index.html',
    'assets/',
    'css/',
    'js/'
  ],

  // Dossiers à inclure dans le cache
  cacheDirectories: [
    'node_modules',
    'vendor/bundle',
    '.jekyll-cache'
  ],

  // Commandes d'installation
  installCommands: {
    node: 'npm install --prefer-offline --no-audit --progress=false',
    ruby: 'bundle install --jobs=4 --retry=3',
    rubyClean: 'bundle install --jobs=4 --retry=3 --clean'
  }
};
