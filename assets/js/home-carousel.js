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
    if (!container || !videoId) {
        console.error('Paramètres manquants pour initYouTubePlayer');
        return null;
    }
    
    try {
        console.log(`Initialisation du lecteur YouTube pour la vidéo: ${videoId}`);
        
        // S'assurer que l'API YouTube est chargée
        try {
            await YouTubeAPI.ensureYouTubeIframeAPI();
            console.log(`API YouTube chargée pour la vidéo: ${videoId}`);
        } catch (error) {
            console.error(`Erreur lors du chargement de l'API YouTube pour ${videoId}:`, error);
            throw error;
        }
        
        // Vérifier si le conteneur est toujours dans le DOM
        if (!document.body.contains(container)) {
            console.warn(`Le conteneur pour la vidéo ${videoId} n'est plus dans le DOM`);
            return null;
        }
        
        const iframe = container.querySelector('iframe');
        if (!iframe) {
            console.error('Iframe non trouvée pour la vidéo ID:', videoId);
            throw new Error('Iframe non trouvée');
        }

        // Configurer le lecteur YouTube
        const player = await YouTubeAPI.setupYouTubePlayer(iframe, {
            onEnded: () => {
                console.log(`Vidéo ${videoId} terminée`);
                // Passer à la vidéo suivante si nécessaire
                const carousel = document.querySelector('#home-carousel');
                if (carousel) {
                    const nextBtn = carousel.querySelector('.carousel-next');
                    if (nextBtn) nextBtn.click();
                }
            },
            onPlaying: () => {
                console.log(`Lecture de la vidéo ${videoId} démarrée`);
                // Cacher l'overlay de chargement si présent
                const loadingOverlay = container.querySelector('.youtube-loading');
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
            },
            onError: (error) => {
                console.error(`Erreur du lecteur YouTube ${videoId}:`, error);
                showError(container, 'Erreur lors du chargement de la vidéo');
            }
        });
        
        if (player) {
            youtubePlayers.set(videoId, player);
            console.log(`Lecteur YouTube ${videoId} initialisé avec succès`);
            return player;
        } else {
            throw new Error('Échec de la création du lecteur YouTube');
        }
    } catch (error) {
        console.error(`Erreur lors de l'initialisation du lecteur YouTube ${videoId}:`, error);
        showError(container, 'Impossible de charger la vidéo');
        return null;
    }
}

// Afficher un message d'erreur dans le conteneur
function showError(container, message) {
    if (!container) return;
    
    // Supprimer les messages d'erreur existants
    const existingError = container.querySelector('.youtube-error');
    if (existingError) existingError.remove();
    
    // Créer et ajouter le message d'erreur
    const errorDiv = document.createElement('div');
    errorDiv.className = 'youtube-error';
    errorDiv.style.position = 'absolute';
    errorDiv.style.top = '50%';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translate(-50%, -50%)';
    errorDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px 20px';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.zIndex = '10';
    errorDiv.textContent = message;
    
    container.style.position = 'relative';
    container.appendChild(errorDiv);
}

// Fonction principale asynchrone
async function initHomeCarousel() {
    console.log('Initialisation du carrousel d\'accueil...');
    
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
        const videoIds = [];
        
        // Créer les slides
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            const isActive = slideIndex === 0 ? 'active' : '';
            
            if (item.type === 'youtube' && item.mediaUrl) {
                const videoId = getYouTubeID(item.mediaUrl);
                if (videoId) {
                    videoIds.push(videoId);
                    slidesHTML += `
                        <div class="carousel-slide ${isActive}" data-type="youtube">
                            <div class="video-container" data-video-id="${videoId}" style="position: relative; width: 100%; height: 100%;">
                                <div class="youtube-loading">Chargement de la vidéo...</div>
                                <iframe 
                                    src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&rel=0&autoplay=0&mute=1"
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen
                                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                                </iframe>
                            </div>
                        </div>`;
                    slideIndex++;
                }
            } else if (item.type === 'image' && item.mediaUrl) {
                slidesHTML += `
                    <div class="carousel-slide ${isActive}" data-type="image">
                        <img src="${item.mediaUrl}" class="carousel-image" alt="${item.title || ''}">
                    </div>`;
                slideIndex++;
            }
        });

        // Mettre à jour le DOM
        if (slider) {
            slider.innerHTML = slidesHTML;
            
            // Initialiser le carrousel
            const carousel = initCarousel({
                selector: '#home-carousel',
                autoplay: true,
                autoplayInterval: 5000,
                onSlideChange: onSlideChange
            });
            
            // Initialiser les lecteurs YouTube avec un délai pour s'assurer que le DOM est prêt
            setTimeout(async () => {
                try {
                    // Charger l'API YouTube si nécessaire
                    if (videoIds.length > 0) {
                        console.log('Préchargement de l\'API YouTube...');
                        await YouTubeAPI.ensureYouTubeIframeAPI();
                        
                        // Initialiser les lecteurs YouTube
                        const videoContainers = carouselElement.querySelectorAll('.video-container');
                        for (const container of videoContainers) {
                            const videoId = container.getAttribute('data-video-id');
                            if (videoId) {
                                await initYouTubePlayer(container, videoId);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'initialisation des vidéos YouTube:', error);
                }
            }, 500);
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
