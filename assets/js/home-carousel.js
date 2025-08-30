console.log('Démarrage du chargement du script home-carousel.js');

import { db, collection, getDocs, query, orderBy } from './auth/firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Événement DOMContentLoaded déclenché');
    
    const carouselSlider = document.querySelector('#home-carousel .carousel-slider');
    
    if (!carouselSlider) {
        console.error('ERREUR: Élément .carousel-slider non trouvé dans #home-carousel');
        return;
    }

    try {
        console.log('Tentative de connexion à Firestore...');
        
        // Afficher un indicateur de chargement
        carouselSlider.innerHTML = '<div class="loading">Chargement du carrousel en cours...</div>';
        
        const q = query(collection(db, 'carousel'), orderBy('order'));
        console.log('Requête Firestore créée:', q);
        
        const querySnapshot = await getDocs(q);
        console.log('Réponse Firestore reçue, nombre de documents:', querySnapshot.size);
        
        if (querySnapshot.empty) {
            console.warn('Aucun document trouvé dans la collection "carousel"');
            carouselSlider.innerHTML = `
                <div class="carousel-slide active" data-type="image">
                    <img src="/assets/images/logo/Logo-Franchini-2.jpg" class="carousel-image" alt="Bienvenue chez Franchini">
                </div>`;
            return;
        }

        // Créer les slides du carrousel
        let slidesHTML = '';
        querySnapshot.forEach((doc, index) => {
            const item = doc.data();
            const isActive = index === 0 ? 'active' : '';
            console.log(`Traitement de l'élément ${index}:`, item);
            
            if (item.type === 'youtube') {
                const videoId = getYouTubeID(item.mediaUrl);
                console.log('ID vidéo YouTube extrait:', videoId);
                
                slidesHTML += `
                    <div class="carousel-slide ${isActive}" data-type="youtube">
                        <div class="video-container">
                            <iframe 
                                src="https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&enablejsapi=1" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>`;
            } else {
                console.log('Image détectée, URL:', item.mediaUrl);
                slidesHTML += `
                    <div class="carousel-slide ${isActive}" data-type="image">
                        <img src="${item.mediaUrl}" class="carousel-image" alt="${item.title || ''}" onerror="this.onerror=null;this.src='/assets/images/logo/Logo-Franchini-2.jpg';">
                        ${item.title ? `
                        <div class="carousel-content">
                            <h2>${item.title}</h2>
                            ${item.description ? `<p>${item.description}</p>` : ''}
                        </div>` : ''}
                    </div>`;
            }
        });

        // Mettre à jour le DOM
        console.log('Mise à jour du DOM avec les slides');
        carouselSlider.innerHTML = slidesHTML;
        
        // Initialiser le carrousel
        console.log('Tentative d\'initialisation du carrousel...');
        if (window.initCarousel) {
            initCarousel('home-carousel');
            console.log('Carrousel initialisé avec succès');
        } else {
            console.error('ERREUR: La fonction initCarousel n\'est pas disponible');
        }
        
    } catch (error) {
        console.error('ERREUR lors du chargement du carrousel:', error);
        carouselSlider.innerHTML = `
            <div class="error-message">
                <p>Impossible de charger le carrousel. Veuillez réessayer plus tard.</p>
                <p>${error.message}</p>
            </div>`;
    }
});

// Fonction utilitaire pour extraire l'ID d'une vidéo YouTube
function getYouTubeID(url) {
    if (!url) {
        console.warn('URL YouTube non fournie');
        return null;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    console.log(`Extraction de l'ID YouTube: ${url} -> ${videoId}`);
    return videoId;
}

// Vérifier que le module est bien chargé
console.log('Script home-carousel.js chargé avec succès');
