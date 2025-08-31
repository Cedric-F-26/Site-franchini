/**
 * Initialise un carrousel avec navigation, autoplay et accessibilité
 * @param {Object} config - Configuration du carrousel
 * @param {string} config.selector - Sélecteur CSS de l'élément carrousel
 * @param {boolean} [config.autoplay=true] - Active/désactive l'autoplay
 * @param {number} [config.autoplayInterval=5000] - Intervalle d'autoplay en ms
 * @param {Function} [config.onSlideChange] - Callback appelé à chaque changement de slide
 */
export function initCarousel(config) {
    const { 
        selector, 
        autoplay = true, 
        autoplayInterval = 5000,
        onSlideChange = () => {}
    } = config;
    
    const carousel = document.querySelector(selector);
    if (!carousel) {
        console.warn(`Carrousel avec le sélecteur "${selector}" non trouvé.`);
        return null;
    }
    
    const container = carousel.closest('.carousel-container') || carousel;
    const slider = carousel.querySelector('.carousel-slider');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
    
    if (!slider || slides.length === 0) {
        console.warn('Structure du carrousel invalide');
        return null;
    }
    
    let currentIndex = 0;
    let autoplayTimer = null;
    let isPaused = false;
    
    /**
     * Initialise les points de navigation
     */
    function initDots() {
        if (!dots.length) return;
        
        // Vider les points existants
        dots.forEach(dot => dot.remove());
        
        // Créer un point pour chaque slide
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('type', 'button');
            dot.setAttribute('data-index', i);
            dot.setAttribute('aria-label', `Aller au slide ${i + 1} sur ${slides.length}`);
            dot.setAttribute('aria-controls', selector);
            dot.setAttribute('tabindex', '0');
            
            // Gestion des événements
            dot.addEventListener('click', () => goToSlide(i));
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(i);
                }
            });
            
            carousel.appendChild(dot);
        }
    }
    
    /**
     * Met à jour l'état des points de navigation
     */
    function updateDots() {
        if (!dots.length) return;
        
        dots.forEach((dot, index) => {
            const isActive = index === currentIndex;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-current', isActive);
            dot.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    }
    
    /**
     * Affiche le slide actif et met à jour l'état
     */
    function updateCarousel() {
        // Mettre à jour les slides
        slides.forEach((slide, index) => {
            const isActive = index === currentIndex;
            const wasActive = slide.classList.contains('active');
            
            if (isActive !== wasActive) {
                slide.classList.toggle('active', isActive);
                slide.setAttribute('aria-hidden', !isActive);
                
                // Mettre à jour l'accessibilité
                if (isActive) {
                    slide.removeAttribute('inert');
                    slide.setAttribute('tabindex', '0');
                    
                    // Appeler le callback onSlideChange avec le slide actif
                    if (typeof onSlideChange === 'function') {
                        onSlideChange(slide);
                    }
                } else {
                    slide.setAttribute('inert', '');
                    slide.removeAttribute('tabindex');
                }
            }
        });
        
        // Mettre à jour les points de navigation
        updateDots();
        
        // Mettre à jour l'accessibilité des boutons de navigation
        if (prevBtn) {
            prevBtn.setAttribute('aria-label', 'Précédent');
            prevBtn.setAttribute('aria-controls', selector);
        }
        
        if (nextBtn) {
            nextBtn.setAttribute('aria-label', 'Suivant');
            nextBtn.setAttribute('aria-controls', selector);
        }
        
        // Annoncer le changement de slide pour les lecteurs d'écran
        const activeSlide = slides[currentIndex];
        const slideLabel = activeSlide.querySelector('h2, .card-title')?.textContent || `Slide ${currentIndex + 1}`;
        
        // Créer une zone live pour les annonces
        let liveRegion = carousel.querySelector('.sr-announce');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.className = 'sr-announce';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.overflow = 'hidden';
            liveRegion.style.clip = 'rect(0 0 0 0)';
            liveRegion.style.height = '1px';
            liveRegion.style.width = '1px';
            liveRegion.style.margin = '-1px';
            liveRegion.style.padding = '0';
            liveRegion.style.border = '0';
            carousel.appendChild(liveRegion);
        }
        
        liveRegion.textContent = `Diapositive ${currentIndex + 1} sur ${slides.length}: ${slideLabel}`;
    }
    
    /**
     * Passe au slide suivant ou précédent
     * @param {number} direction - 1 pour suivant, -1 pour précédent
     */
    function moveSlide(direction) {
        currentIndex = (currentIndex + direction + slides.length) % slides.length;
        updateCarousel();
    }
    
    /**
     * Va à un slide spécifique
     * @param {number} index - Index du slide à afficher
     */
    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;
        currentIndex = index;
        updateCarousel();
    }
    
    /**
     * Démarre le défilement automatique
     */
    function startAutoplay() {
        if (autoplayTimer) return;
        
        autoplayTimer = setInterval(() => {
            if (!isPaused) {
                moveSlide(1);
            }
        }, autoplayInterval);
    }
    
    /**
     * Arrête le défilement automatique
     */
    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }
    
    /**
     * Bascule entre lecture et pause
     */
    function togglePlayPause() {
        isPaused = !isPaused;
        
        if (isPaused) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    }
    
    // Initialisation
    initDots();
    updateCarousel();
    
    // Gestionnaires d'événements
    if (prevBtn) prevBtn.addEventListener('click', () => moveSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => moveSlide(1));
    
    // Gestion du clavier
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') moveSlide(-1);
        if (e.key === 'ArrowRight') moveSlide(1);
    });
    
    // Autoplay
    if (autoplay) {
        startAutoplay();
        
        // Pause au survol
        carousel.addEventListener('mouseenter', () => {
            isPaused = true;
            stopAutoplay();
        });
        
        carousel.addEventListener('mouseleave', () => {
            isPaused = false;
            startAutoplay();
        });
        
        // Pause au focus
        carousel.addEventListener('focusin', () => {
            isPaused = true;
            stopAutoplay();
        });
        
        carousel.addEventListener('focusout', () => {
            isPaused = false;
            startAutoplay();
        });
    }
    
    // Retourner une API publique
    return {
        next: () => moveSlide(1),
        prev: () => moveSlide(-1),
        goTo: goToSlide,
        startAutoplay,
        stopAutoplay,
        togglePlayPause
    };
}

// YouTube Iframe API integration
let YT_API_REQUESTED = false;
let YT_READY = false;
const YT_API_KEY = 'AIzaSyBfZhDCtitB-Qfmkr3fcsDk7Mc9nkla7jI';
const YT_API_CALLBACKS = [];

// Fonction pour gérer le chargement de l'API YouTube
function ensureYouTubeIframeAPI() {
    if (YT_API_REQUESTED) {
        if (YT_READY) {
            return Promise.resolve();
        }
        return new Promise(resolve => YT_API_CALLBACKS.push(resolve));
    }

    YT_API_REQUESTED = true;
    
    return new Promise((resolve, reject) => {
        const tag = document.createElement('script');
        tag.src = `https://www.youtube.com/iframe_api?api_key=${YT_API_KEY}`;
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            YT_READY = true;
            while (YT_API_CALLBACKS.length) {
                YT_API_CALLBACKS.shift()();
            }
            resolve();
        };

        // Gestion des erreurs de chargement
        tag.onerror = (error) => {
            console.error('Erreur lors du chargement de l\'API YouTube:', error);
            reject(new Error('Impossible de charger l\'API YouTube'));
        };
    });
}

function enableJsApiOnIframe(iframe) {
    if (!(iframe && iframe.src)) return;
    const url = new URL(iframe.src, window.location.origin);
    if (!/youtube\.com\/embed\//.test(url.href)) return;
    if (url.searchParams.get('enablejsapi') !== '1') {
        url.searchParams.set('enablejsapi', '1');
        try { url.searchParams.set('origin', window.location.origin); } catch {}
        iframe.src = url.toString();
    }
    if (!iframe.id) {
        iframe.id = 'ytplayer_' + Math.random().toString(36).slice(2, 9);
    }
}

function setupYouTubePlayer(iframe, { onEnded, onPlaying } = {}) {
    const create = () => {
        if (!window.YT || !window.YT.Player) {
            console.warn('YouTube Player API not available');
            return null;
        }
        
        try {
            const player = new window.YT.Player(iframe, {
                playerVars: {
                    'origin': window.location.origin
                },
                events: {
                    'onStateChange': (event) => {
                        if (!window.YT) return;
                        const state = event.data;
                        if (state === window.YT.PlayerState.ENDED && typeof onEnded === 'function') {
                            onEnded();
                        } else if (state === window.YT.PlayerState.PLAYING && typeof onPlaying === 'function') {
                            onPlaying();
                        }
                    }
                }
            });
            return player;
        } catch (e) {
            console.error('Failed to create YouTube player:', e);
            return null;
        }
    };

    if (window.YT && window.YT.Player) {
        return create();
    } else {
        return new Promise((resolve) => {
            YT_API_CALLBACKS.push(() => {
                const player = create();
                resolve(player);
            });
            ensureYouTubeIframeAPI();
        });
    }
}

// Export the YouTube API functions
export const YouTubeAPI = {
    ensureYouTubeIframeAPI,
    setupYouTubePlayer,
    enableJsApiOnIframe
};
