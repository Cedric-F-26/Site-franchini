// Configuration Prettier pour le formatage automatique du code
module.exports = {
  // Largeur maximale d'une ligne
  printWidth: 100,
  
  // Utiliser des espaces pour l'indentation
  tabWidth: 2,
  useTabs: false,
  
  // Ajouter un point-virgule à la fin des instructions
  semi: true,
  
  // Utiliser des guillemets simples au lieu de doubles
  singleQuote: true,
  
  // Utiliser des guillemets simples dans JSX
  jsxSingleQuote: false,
  
  // Ajouter une virgule après le dernier élément d'un objet/tableau
  trailingComma: 'es5',
  
  // Ajouter des espaces autour des accolades dans les objets
  bracketSpacing: true,
  
  // Placer la flèche d'une fonction fléchée entre parenthèses
  arrowParens: 'avoid',
  
  // Respecter les sauts de ligne dans le texte
  proseWrap: 'preserve',
  
  // Sensibilité des espaces en HTML
  htmlWhitespaceSensitivity: 'css',
  
  // Utiliser les sauts de ligne du système d'exploitation
  endOfLine: 'auto',
  
  // Activer le formatage des marqueurs de commentaires
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        parser: 'babel',
      },
    },
    {
      files: '*.{json,md,yml,yaml}',
      options: {
        tabWidth: 2,
      },
    },
  ],
};
