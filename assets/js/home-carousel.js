// Vérifier si le navigateur supporte les modules ES
console.log('Démarrage du chargement du script home-carousel.js');

// Importer initCarousel depuis carousel.js
import { initCarousel, YouTubeAPI } from './carousel.js';

// Variables globales pour la gestion des vidéos
let youtubePlayers = {};
let currentVideoId = null;

// Fonction utilitaire pour extraire l'ID d'une vidéo YouTube
function getYouTubeID(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Charger l'API YouTube
function loadYouTubeAPI() {
    return new Promise((resolve) => {
        YouTubeAPI.ensureYouTubeIframeAPI();
        if (window.YT && window.YT.Player) {
            resolve();
        } else {
            window.onYouTubeIframeAPIReady = resolve;
        }
    });
}

// Gérer le changement de slide
function onSlideChange(slide) {
    const videoSlide = slide.querySelector('.carousel-slide[data-type="youtube"]');
    
    // Arrêter la vidéo en cours
    if (currentVideoId && youtubePlayers[currentVideoId]) {
        youtubePlayers[currentVideoId].pauseVideo();
    }
    
    // Lancer la nouvelle vidéo
    if (videoSlide) {
        const videoId = videoSlide.getAttribute('data-video-id');
        if (videoId && youtubePlayers[videoId]) {
            currentVideoId = videoId;
            youtubePlayers[videoId].playVideo().catch(console.error);
        }
    } else {
        currentVideoId = null;
    }
}

// Fonction principale asynchrone
async function initHomeCarousel() {
    console.log('Initialisation du carrousel d\'accueil...');
    
    // Charger l'API YouTube
    try {
        await loadYouTubeAPI();
    } catch (error) {
        console.error('Erreur API YouTube:', error);
    }
    
    const carouselSlider = document.querySelector('#home-carousel .carousel-slider');
    if (!carouselSlider) {
        console.error('ERREUR: Élément .carousel-slider non trouvé dans #home-carousel');
        return;
    }

    // Afficher un indicateur de chargement
    carouselSlider.innerHTML = '<div class="loading">Chargement du carrousel en cours...</div>';

    try {
        // Importer les fonctions Firestore depuis le fichier de configuration
        const { db, collection, getDocs, query, orderBy } = await import('./auth/firebase-config.js');
        
        console.log('Connexion à Firestore...');
        const q = query(collection(db, 'carousel'), orderBy('order'));
        const querySnapshot = await getDocs(q);
        
        console.log('Documents reçus:', querySnapshot.size);
        
        if (querySnapshot.empty) {
            console.warn('Aucun document trouvé dans la collection "carousel"');
            carouselSlider.innerHTML = `
                <div class="carousel-slide active" data-type="image">
                    <img src="/assets/images/logo/Logo-Franchini-2.jpg" class="carousel-image" alt="Bienvenue chez Franchini">
                </div>`;
            return;
        }

        let slidesHTML = '';
        let slideIndex = 0;
        
        querySnapshot.forEach((doc, index) => {
            const item = doc.data();
            const isActive = slideIndex === 0 ? 'active' : '';
            
            if (item.type === 'youtube' && item.videoUrl) {
                const videoId = getYouTubeID(item.videoUrl);
                if (videoId) {
                    slidesHTML += `
                        <div class="carousel-slide ${isActive}" data-type="youtube" data-video-id="${videoId}">
                            <div class="youtube-player" data-video-id="${videoId}"></div>
                        </div>`;
                    slideIndex++;
                }
            } else if (item.imageUrl) {
                slidesHTML += `
                    <div class="carousel-slide ${isActive}" data-type="image">
                        <img src="${item.imageUrl}" class="carousel-image" alt="${item.alt || ''}">
                    </div>`;
                slideIndex++;
            }
        });

        // Mettre à jour le HTML du carrousel
        carouselSlider.innerHTML = slidesHTML;
        
        // Initialiser les lecteurs YouTube
        const youtubePlayersEls = document.querySelectorAll('.youtube-player');
        youtubePlayersEls.forEach(playerEl => {
            const videoId = playerEl.getAttribute('data-video-id');
            if (videoId && window.YT && window.YT.Player) {
                const player = new window.YT.Player(playerEl, {
                    videoId: videoId,
                    playerVars: {
                        'autoplay': 0,
                        'controls': 1,
                        'rel': 0,
                        'showinfo': 0,
                        'modestbranding': 1,
                        'playsinline': 1
                    },
                    events: {
                        'onReady': (event) => {
                            youtubePlayers[videoId] = event.target;
                        }
                    }
                });
            }
        });
        
        // Initialiser le carrousel
        initCarousel('home-carousel', {
            autoplay: true,
            autoplayInterval: 5000,
            onSlideChange: onSlideChange
        });
        
    } catch (error) {
        console.error('ERREUR lors du chargement du carrousel:', error);
        carouselSlider.innerHTML = `
            <div class="carousel-slide active" data-type="image">
                <img src="/assets/images/logo/Logo-Franchini-2.jpg" class="carousel-image" alt="Bienvenue chez Franchini">
                <div class="error-message">
                    <p>Erreur de chargement du carrousel. Veuillez rafraîchir la page.</p>
                </div>
            </div>`;
    }
}

// Démarrer l'initialisation lorsque le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeCarousel);
} else {
    initHomeCarousel();
}
