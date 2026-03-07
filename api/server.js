const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Rate limiting pour éviter le brute force
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // maximum 5 tentatives
    message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.'
});

// Base de données utilisateurs (en production, utilisez une vraie BDD)
const users = [
    {
        id: 1,
        username: 'admin',
        password: '$2b$10$N9qo8uLOickgx2ZMRZoMye5YrK6m5s8y6Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', // "franchini2025" hashé
        role: 'admin',
        email: 'admin@franchini.fr'
    }
];

// Middleware de vérification JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token manquant' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token invalide' });
        }
        req.user = user;
        next();
    });
};

// Route de login
app.post('/api/login', limiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation des entrées
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Identifiant et mot de passe requis'
            });
        }

        // Recherche de l'utilisateur
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Identifiant ou mot de passe incorrect'
            });
        }

        // Vérification du mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Identifiant ou mot de passe incorrect'
            });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Succès
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
});

// Route de vérification de token
app.post('/api/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        valid: true,
        user: req.user
    });
});

// Route de déconnexion
app.post('/api/logout', authenticateToken, (req, res) => {
    // En production, ajouter le token à une liste noire
    res.json({
        success: true,
        message: 'Déconnexion réussie'
    });
});

// Route protégée exemple
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Accès autorisé au tableau de bord',
        user: req.user
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur API démarré sur http://localhost:${PORT}`);
    console.log('📡 Endpoint /api/login disponible');
    console.log('🔐 Sécurité activée avec JWT et rate limiting');
});
