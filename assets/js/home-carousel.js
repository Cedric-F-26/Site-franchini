// Vérifier si le navigateur supporte les modules ES
console.log('Démarrage du chargement du script home-carousel.js');

// Importer initCarousel depuis carousel.js
import { initCarousel, YouTubeAPI } from './carousel.js';

// Variables globales pour la gestion des vidéos
const youtubePlayers = new Map();
let currentVideoId = null;

// Fonction utilitaire pour extraire l'ID d'une vidéo YouTube
function getYouTubeID(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Charger et initialiser l'API YouTube
async function loadYouTubeAPI() {
    try {
        YouTubeAPI.ensureYouTubeIframeAPI();
        // Vérifier si l'API est déjà chargée
        if (window.YT && window.YT.Player) {
            return true;
        }
        // Attendre que l'API soit chargée
        await new Promise((resolve) => {
            const checkYT = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    clearInterval(checkYT);
                    resolve();
                }
            }, 100);
            // Timeout après 5 secondes
            setTimeout(() => {
                clearInterval(checkYT);
                resolve();
            }, 5000);
        });
        return !!window.YT?.Player;
    } catch (error) {
        console.error('Erreur lors du chargement de l\'API YouTube:', error);
        return false;
    }
}

// Gérer le changement de slide
async function onSlideChange(slide) {
    const videoSlide = slide.querySelector('.carousel-slide[data-type="youtube"]');
    const videoContainer = videoSlide?.querySelector('.video-container');
    const videoId = videoContainer?.getAttribute('data-video-id');
    
    // Arrêter la vidéo en cours
    if (currentVideoId && youtubePlayers.has(currentVideoId)) {
        try {
            const player = youtubePlayers.get(currentVideoId);
            if (player.pauseVideo) {
                player.pauseVideo();
            }
        } catch (e) {
            console.error('Erreur lors de l\'arrêt de la vidéo:', e);
        }
    }
    
    // Lancer la nouvelle vidéo
    if (videoId && youtubePlayers.has(videoId)) {
        try {
            const player = youtubePlayers.get(videoId);
            if (player.playVideo) {
                await player.playVideo();
                currentVideoId = videoId;
            }
        } catch (e) {
            console.error('Erreur lors du démarrage de la vidéo:', e);
        }
    } else {
        currentVideoId = null;
    }
}

// Initialiser un lecteur YouTube
async function initYouTubePlayer(container, videoId) {
    if (!container || !videoId) return null;
    
    try {
        const player = await YouTubeAPI.setupYouTubePlayer(container, {
            onEnded: () => console.log(`Vidéo ${videoId} terminée`),
            onPlaying: () => console.log(`Lecture de la vidéo ${videoId} démarrée`)
        });
        
        if (player) {
            youtubePlayers.set(videoId, player);
            return player;
        }
    } catch (error) {
        console.error(`Erreur lors de l'initialisation du lecteur YouTube ${videoId}:`, error);
    }
    return null;
}

// Fonction principale asynchrone
async function initHomeCarousel() {
    console.log('Initialisation du carrousel d\'accueil...');
    
    // Charger l'API YouTube
    const youtubeAPILoaded = await loadYouTubeAPI();
    
    const carouselElement = document.querySelector('#home-carousel');
    if (!carouselElement) {
        console.error('ERREUR: Élément #home-carousel non trouvé');
        return;
    }

    // Afficher un indicateur de chargement
    const slider = carouselElement.querySelector('.carousel-slider');
    if (slider) {
        slider.innerHTML = '<div class="loading">Chargement du carrousel en cours...</div>';
    }

    try {
        // Importer les fonctions Firestore
        const { db, collection, getDocs, query, orderBy } = await import('./auth/firebase-config.js');
        
        console.log('Connexion à Firestore...');
        const q = query(collection(db, 'carousel'), orderBy('order'));
        const querySnapshot = await getDocs(q);
        
        console.log('Documents reçus:', querySnapshot.size);
        
        if (querySnapshot.empty) {
            console.warn('Aucun document trouvé dans la collection "carousel"');
            if (slider) {
                slider.innerHTML = `
                    <div class="carousel-slide active" data-type="image">
                        <img src="/assets/images/logo/Logo-Franchini-2.jpg" class="carousel-image" alt="Bienvenue chez Franchini">
                    </div>`;
            }
            return;
        }

        let slidesHTML = '';
        let slideIndex = 0;
        
        // Créer les slides
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            const isActive = slideIndex === 0 ? 'active' : '';
            
            if (item.type === 'youtube' && item.videoUrl) {
                const videoId = getYouTubeID(item.videoUrl);
                if (videoId) {
                    slidesHTML += `
                        <div class="carousel-slide ${isActive}" data-type="youtube">
                            <div class="video-container" data-video-id="${videoId}" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                                <iframe 
                                    src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&rel=0"
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen
                                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                                </iframe>
                            </div>
                        </div>`;
                    slideIndex++;
                }
            } else if (item.type === 'image' && item.imageUrl) {
                slidesHTML += `
                    <div class="carousel-slide ${isActive}" data-type="image">
                        <img src="${item.imageUrl}" class="carousel-image" alt="${item.altText || ''}">
                    </div>`;
                slideIndex++;
            }
        });

        // Mettre à jour le DOM
        if (slider) {
            console.log('--- Début Debug Carrousel ---');
            console.log('HTML généré pour les slides:', slidesHTML);
            slider.innerHTML = slidesHTML;
            console.log('Contenu du slider APRES innerHTML:', slider.innerHTML);
            
            // Attendre le prochain "frame" pour que le DOM soit bien à jour
            requestAnimationFrame(async () => {
                const foundSlides = carouselElement.querySelectorAll('.carousel-slide');
                console.log('Slides trouvés dans requestAnimationFrame:', foundSlides.length);

                // Initialiser le carrousel
                const carousel = initCarousel({
                    selector: '#home-carousel',
                    autoplay: true,
                    autoplayInterval: 5000,
                    onSlideChange: onSlideChange
                });
                
                // Initialiser les lecteurs YouTube
                if (youtubeAPILoaded) {
                    const videoContainers = carouselElement.querySelectorAll('.video-container');
                    for (const container of videoContainers) {
                        const videoId = container.getAttribute('data-video-id');
                        if (videoId) {
                            await initYouTubePlayer(container, videoId);
                        }
                    }
                }
                console.log('--- Fin Debug Carrousel ---');
            });
        }
        
        console.log('Carrousel initialisé avec succès');
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation du carrousel:', error);
        if (slider) {
            slider.innerHTML = `
                <div class="carousel-slide active" data-type="image">
                    <img src="/assets/images/logo/Logo-Franchini-2.jpg" class="carousel-image" alt="Bienvenue chez Franchini">
                    <div class="error-message">
                        Une erreur est survenue lors du chargement du carrousel.
                    </div>
                </div>`;
        }
    }
}



// Exporter pour le débogage
window.initHomeCarousel = initHomeCarousel;

export { initHomeCarousel };
