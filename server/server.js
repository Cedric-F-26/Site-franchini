require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permet les requêtes cross-origin
app.use(express.json()); // Pour parser les requêtes JSON

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Définition des adresses e-mail des services
const serviceEmails = {
    commercial: 'commercial@franchini-agri.fr',
    magasin: 'magasin@franchini-agri.fr',
    sav: 'sav@franchini-agri.fr',
    comptabilite: 'comptabilite@franchini-agri.fr',
    candidature: 'cedric.franchini@franchini-agri.fr',
};

// Route pour l'envoi d'e-mails
app.post('/send-email', async (req, res) => {
    const { service, name, email, message } = req.body;

    if (!service || !name || !email || !message) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    const recipientEmail = serviceEmails[service];

    if (!recipientEmail) {
        return res.status(400).json({ error: 'Service non valide.' });
    }

    try {
        await transporter.sendMail({
            from: `"${name}" <${email}>`, // Expéditeur
            to: recipientEmail, // Destinataire basé sur le service
            subject: `Nouveau message de contact - Service ${service}`, // Sujet
            html: `<p><strong>Nom:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Service:</strong> ${service}</p>
                   <p><strong>Message:</strong></p>
                   <p>${message}</p>`, // Contenu HTML
        });
        res.status(200).json({ message: 'E-mail envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l'envoi de l'e-mail:', error);
        res.status(500).json({ error: 'Erreur lors de l'envoi de l'e-mail.' });
    }
});

// Route pour les carrousels d'accueil
app.get('/api/accueil-carousels', (req, res) => {
    const mockAccueilCarousels = [
        {
            id: 'accueil-1',
            type: 'image',
            title: 'Bienvenue chez Franchini',
            description: 'Votre concessionnaire Deutz-Fahr en Drôme.',
            imageUrl: '/assets/images/hero-bg.jpg',
            buttonText: 'Découvrir',
            buttonUrl: '#',
            isActive: true,
            order: 0,
        },
        {
            id: 'accueil-2',
            type: 'image',
            title: 'Nouvelle Gamme 2025',
            description: 'Découvrez les dernières innovations Deutz-Fahr.',
            imageUrl: '/assets/images/carousel/new-range.jpg',
            buttonText: 'Voir les modèles',
            buttonUrl: '/pages/neuf.html',
            isActive: true,
            order: 1,
        }
    ];
    res.json(mockAccueilCarousels);
});

// Route pour les carrousels d'actualités
app.get('/api/news-carousels', (req, res) => {
    const mockNewsCarousels = [
        {
            id: 1,
            titre: "Nouveaux équipements disponibles",
            contenu: "Découvrez notre nouvelle gamme d'équipements agricoles de haute qualité pour améliorer votre productivité.",
            image_url: "/assets/images/news/equipement.jpg",
            date: "2025-06-15",
            lien: "/pages/actualites.html"
        },
        {
            id: 2,
            titre: "Promotions spéciales",
            contenu: "Profitez de nos offres exceptionnelles sur une sélection de matériel agricole.",
            image_url: "/assets/images/news/promotion.jpg",
            date: "2025-06-10",
            lien: "/pages/promotions.html"
        }
    ];
    res.json(mockNewsCarousels);
});

// Route pour les carrousels d'occasion (exemple)
app.get('/api/occasion-carousels', (req, res) => {
    const mockOccasionCarousels = [
        {
            id: 'occasion-1',
            titre: 'Tracteur Deutz-Fahr 6185 RCshift',
            contenu: 'Excellent état, peu d\'heures, disponible immédiatement.',
            image_url: '/assets/images/occasion/tracteur-occasion-1.jpg',
            date: '2025-07-01',
            lien: '/pages/occasion.html#6185',
        },
        {
            id: 'occasion-2',
            titre: 'Moissonneuse-batteuse C9206 TS',
            contenu: 'Révisée, prête pour la saison, faible consommation.',
            image_url: '/assets/images/occasion/moissonneuse-occasion-1.jpg',
            date: '2025-06-25',
            lien: '/pages/occasion.html#c9206',
        }
    ];
    res.json(mockOccasionCarousels);
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
