const bcrypt = require('bcryptjs');

// Créer un hash pour le mot de passe "franchini2025"
const password = 'franchini2025';
const hash = bcrypt.hashSync(password, 10);

console.log('Identifiant: admin');
console.log('Mot de passe: franchini2025');
console.log('Hash généré:', hash);
console.log('');
console.log('Copiez ce hash dans le fichier server.js à la ligne password');
