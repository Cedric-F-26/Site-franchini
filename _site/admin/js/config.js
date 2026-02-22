// Configuration des chemins pour les environnements local et production
const config = {
    // URL de base pour les requêtes API
    baseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? '' 
        : '/Site-franchini',
        
    // Clés de stockage local
    storageKeys: {
        accueil: 'franchiniCarousel',
        actualites: 'actualitesCarousel',
        occasions: 'occasionsCarousel'
    },
    
    // Chemins des fichiers de données (pour une future implémentation avec backend)
    dataPaths: {
        accueil: '/data/accueil.json',
        actualites: '/data/actualites.json',
        occasions: '/data/occasions.json'
    }
};

// Fonction utilitaire pour construire les chemins
function getAssetPath(path) {
    return config.baseUrl + path;
}

// Exporter la configuration
if (typeof module !== 'undefined' && module.exports) {
    // Pour Node.js
    module.exports = { config, getAssetPath };
} else {
    // Pour le navigateur
    window.AppConfig = { config, getAssetPath };
}
