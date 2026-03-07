const bcrypt = require('bcryptjs');

// Script pour générer un nouveau hash de mot de passe
const newPassword = process.argv[2] || 'franchini2025';

console.log('🔧 Génération du hash pour le mot de passe admin');
console.log('📝 Mot de passe:', newPassword);

const hash = bcrypt.hashSync(newPassword, 10);
console.log('🔐 Hash généré:', hash);
console.log('');
console.log('⚙️  Instructions:');
console.log('1. Copiez ce hash dans api/server.js');
console.log('2. Remplacez la ligne password dans l\'objet user');
console.log('3. Déployez sur Vercel avec le JWT_SECRET configuré');
console.log('');
console.log('🚀 Pour générer un nouveau mot de passe:');
console.log('node setup-admin.js "votre_nouveau_mot_de_passe"');
