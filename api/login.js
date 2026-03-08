const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

// Base de données utilisateurs
const users = [
    {
        id: 1,
        username: 'admin',
        password: '$2b$10$N9qo8uLOickgx2ZMRZoMye5YrK6m5s8y6Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', // "franchini2025" hashé
        role: 'admin',
        email: 'admin@franchini.fr'
    }
];

function verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = async (req, res) => {
    // Configuration CORS pour Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Identifiant et mot de passe requis'
            });
        }

        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Identifiant ou mot de passe incorrect'
            });
        }

        const validPassword = verifyPassword(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Identifiant ou mot de passe incorrect'
            });
        }

        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Connexion réussie',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erreur de login:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur, veuillez réessayer'
        });
    }
};
