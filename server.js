const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir les fichiers statiques depuis les dossiers public et assets
app.use(express.static('public'));
app.use(express.static('assets'));
app.use(express.static('.'));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
