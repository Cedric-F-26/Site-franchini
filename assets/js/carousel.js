/**
 * Initialise un carrousel avec navigation, autoplay et accessibilité
 * @param {string} carouselId - L'ID de l'élément carrousel à initialiser
 */
function initCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) {
        console.warn(`Carrousel avec l'ID "${carouselId}" non trouvé.`);
        return;
    }
    
    const container = carousel.closest('.carousel-container');
    if (!container) {
        console.warn('Conteneur parent .carousel-container non trouvé.');
        return;
    }
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsContainer = container.querySelector('.carousel-dots');
    const prevBtn = container.querySelector('.carousel-control.prev');
    const nextBtn = container.querySelector('.carousel-control.next');
    
    if (slides.length === 0) {
        console.warn('Aucun slide trouvé dans le carrousel.');
        return;
    }
    
    // Variables d'état
    let currentIndex = 0;
    const totalSlides = slides.length;
    let slideInterval = null;
    let touchStartX = 0;
    let touchEndX = 0;
    let isPaused = false;
    let isAutoPlaying = false;
    let inactivityTimer = null;
    
    /**
     * Initialise les points de navigation
     */
    function initDots() {
        if (!dotsContainer) return;
        
        // Vider les points existants
        dotsContainer.innerHTML = '';
        
        // Créer un point pour chaque slide
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('type', 'button');
            dot.setAttribute('data-index', i);
            dot.setAttribute('aria-label', `Aller au slide ${i + 1} sur ${totalSlides}`);
            dot.setAttribute('aria-controls', carouselId);
            dot.setAttribute('tabindex', '0');
            
            // Gestion des événements
            dot.addEventListener('click', () => goToSlide(i));
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(i);
                }
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    /**
     * Met à jour l'état des points de navigation
     */
    function updateDots() {
        if (!dotsContainer) return;
        
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
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
            slide.classList.toggle('active', isActive);
            slide.setAttribute('aria-hidden', !isActive);
            
            // Mettre à jour l'accessibilité
            if (isActive) {
                slide.removeAttribute('inert');
                slide.setAttribute('tabindex', '0');
            } else {
                slide.setAttribute('inert', '');
                slide.setAttribute('tabindex', '-1');
            }
        });
        
        // Mettre à jour les points de navigation
        updateDots();
        
        // Mettre à jour l'accessibilité des boutons de navigation
        if (prevBtn) {
            prevBtn.setAttribute('aria-label', 'Précédent');
            prevBtn.setAttribute('aria-controls', carouselId);
        }
        
        if (nextBtn) {
            nextBtn.setAttribute('aria-label', 'Suivant');
            nextBtn.setAttribute('aria-controls', carouselId);
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
        
        liveRegion.textContent = `Diapositive ${currentIndex + 1} sur ${totalSlides}: ${slideLabel}`;
    }
    
    /**
     * Passe au slide suivant ou précédent
     * @param {number} direction - 1 pour suivant, -1 pour précédent
     */
    function moveSlide(direction) {
        currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
        updateCarousel();
        resetInactivityTimer();
    }
    
    /**
     * Va à un slide spécifique
     * @param {number} index - Index du slide à afficher
     */
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentIndex = index;
        updateCarousel();
        resetInactivityTimer();
    }
    
    /**
     * Démarre le défilement automatique
     */
    function startAutoPlay() {
        if (isAutoPlaying) return;
        
        // Vérifier si l'utilisateur a désactivé l'autoplay
        if (sessionStorage.getItem('carouselAutoplay') === 'disabled') {
            return;
        }
        
        // Vérifier si l'utilisateur a désactivé les animations
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return;
        }
        
        isPaused = false;
        isAutoPlaying = true;
        
        // Arrêter tout intervalle existant
        stopAutoPlay();
        
        // Démarrer un nouvel intervalle
        slideInterval = setInterval(() => {
            if (!isPaused) {
                moveSlide(1);
            }
        }, 5000); // 5 secondes entre chaque slide
        
        // Mettre à jour l'état des boutons
        updatePlayPauseButton();
    }
    
    /**
     * Arrête le défilement automatique
     */
    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
        isAutoPlaying = false;
    }
    
    /**
     * Bascule entre lecture et pause
     */
    function togglePlayPause() {
        isPaused = !isPaused;
        
        if (isPaused) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
        
        updatePlayPauseButton();
    }
    
    /**
     * Met à jour l'état du bouton lecture/pause
     */
    function updatePlayPauseButton() {
        const playPauseBtn = container.querySelector('.carousel-play');
        if (!playPauseBtn) return;
        
        if (isPaused || !isAutoPlaying) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.setAttribute('aria-label', 'Lire le diaporama');
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.setAttribute('aria-label', 'Mettre en pause');
        }
    }
    
    /**
     * Réinitialise le timer d'inactivité
     */
    function resetInactivityTimer() {
        // Arrêter le timer existant
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        
        // Démarrer un nouveau timer (10 minutes d'inactivité)
        inactivityTimer = setTimeout(() => {
            stopAutoPlay();
        }, 10 * 60 * 1000);
    }
    
    /**
     * Gestion du swipe sur mobile
     * @param {TouchEvent} e - L'événement tactile
     */
    function handleSwipe(e) {
        const swipeThreshold = 50; // Seuil minimal en pixels pour considérer un swipe
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe vers la gauche
            moveSlide(1);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe vers la droite
            moveSlide(-1);
        }
    }
    
    // Initialisation
    initDots();
    updateCarousel();
    
    // Intégration YouTube pour le carrousel d'accueil
    if (carouselId === 'home-carousel') {
        const youtubeIframes = carousel.querySelectorAll('iframe[src*="youtube.com/embed/"]');
        if (youtubeIframes.length) {
            youtubeIframes.forEach((iframe) => {
                enableJsApiOnIframe(iframe);
                setupYouTubePlayer(iframe, {
                    onEnded: () => {
                        // Avance au slide suivant à la fin de la vidéo
                        moveSlide(1);
                    },
                    onPlaying: () => {
                        // Met en pause l'autoplay du carrousel pendant la lecture
                        isPaused = true;
                        stopAutoPlay();
                        updatePlayPauseButton();
                    }
                });
            });
        }
    }
    
    // Gestion des événements
    if (prevBtn) {
        prevBtn.addEventListener('click', () => moveSlide(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => moveSlide(1));
    }
    
    // Gestion du clavier
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            moveSlide(-1);
            resetInactivityTimer();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            moveSlide(1);
            resetInactivityTimer();
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(0);
            resetInactivityTimer();
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(totalSlides - 1);
            resetInactivityTimer();
        }
    });
    
    // Gestion du swipe tactile
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(e);
        resetInactivityTimer();
    }, { passive: true });
    
    // Gestion de la souris
    carousel.addEventListener('mouseenter', () => {
        isPaused = true;
        updatePlayPauseButton();
    });
    
    carousel.addEventListener('mouseleave', () => {
        isPaused = false;
        if (isAutoPlaying) {
            resetInactivityTimer();
        }
    });
    
    // Gestion de la visibilité de la page
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // La page est en arrière-plan, mettre en pause
            isPaused = true;
        } else if (isAutoPlaying) {
            // La page est au premier plan, reprendre si nécessaire
            isPaused = false;
            resetInactivityTimer();
        }
    });
    
    // Démarrer l'autoplay pour le carrousel principal
    if (carouselId === 'home-carousel' && sessionStorage.getItem('carouselAutoplay') !== 'disabled') {
        startAutoPlay();
    }
    
    // Fonction pour réinitialiser le timer d'inactivité
    function resetInactivityTimer() {
        // Arrêter le timer existant
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        
        // Si l'autoplay est actif, redémarrer le timer
        if (isAutoPlaying && !isPaused) {
            inactivityTimer = setTimeout(() => {
                stopAutoPlay();
                // Désactiver l'autoplay pour cette session
                sessionStorage.setItem('carouselAutoplay', 'disabled');
                
                // Mettre à jour le bouton de lecture/pause
                updatePlayPauseButton();
            }, 10 * 60 * 1000); // 10 minutes d'inactivité
        }
    }
    
    // Fonction pour réinitialiser le timer d'inactivité
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        
        // Si l'autoplay est désactivé, ne pas le réactiver automatiquement
        if (sessionStorage.getItem('carouselAutoplay') === 'disabled') {
            return;
        }
        
        // Désactiver l'autoplay après 10 minutes d'inactivité
        inactivityTimer = setTimeout(() => {
            stopAutoPlay();
            sessionStorage.setItem('carouselAutoplay', 'disabled');
            
            // Mettre à jour l'état du bouton de lecture
            if (playPauseBtn) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.setAttribute('title', 'Lire le diaporama');
            }
        }, 600000); // 10 minutes
    }
    
    // Réinitialiser le timer d'inactivité lors des interactions utilisateur
    const userEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    userEvents.forEach(event => {
        document.addEventListener(event, resetInactivityTimer, { passive: true });
    });
    
    // Initialiser le timer d'inactivité
    resetInactivityTimer();
    
    // Retourner les fonctions pour une utilisation externe si nécessaire
    return {
        next: () => moveSlide(1),
        prev: () => moveSlide(-1),
        goTo: goToSlide,
        startAutoPlay,
        stopAutoPlay,
        togglePlayPause
    };
}

// ==============================
// YouTube Iframe API integration
// ==============================
let YT_API_REQUESTED = false;
let YT_API_READY = false;
const YT_PENDING_SETUPS = [];

function ensureYouTubeIframeAPI() {
    if (YT_API_REQUESTED) return;
    YT_API_REQUESTED = true;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);
}

// Appelé par l'API YouTube lorsqu'elle est prête
window.onYouTubeIframeAPIReady = function() {
    YT_API_READY = true;
    while (YT_PENDING_SETUPS.length) {
        const fn = YT_PENDING_SETUPS.shift();
        try { fn(); } catch (e) { console.error('YT setup error:', e); }
    }
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
        if (!window.YT || !YT.Player) return;
        try {
            const player = new YT.Player(iframe.id, {
                events: {
                    'onStateChange': (event) => {
                        const state = event.data;
                        if (state === YT.PlayerState.ENDED && typeof onEnded === 'function') {
                            onEnded();
                        } else if (state === YT.PlayerState.PLAYING && typeof onPlaying === 'function') {
                            onPlaying();
                        }
                    }
                }
            });
            return player;
        } catch (e) {
            console.error('YT.Player creation failed:', e);
        }
    };

    if (YT_API_READY) {
        create();
    } else {
        YT_PENDING_SETUPS.push(create);
        ensureYouTubeIframeAPI();
    }
}

// Initialiser tous les carrousels au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur a désactivé les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialiser chaque carrousel
    const carousels = document.querySelectorAll('.carousel-slider');
    carousels.forEach(carousel => {
        if (carousel.id) {
            // Ajouter des attributs d'accessibilité
            carousel.setAttribute('role', 'region');
            carousel.setAttribute('aria-roledescription', 'carousel');
            carousel.setAttribute('aria-live', 'off');
            
            // Initialiser le carrousel
            initCarousel(carousel.id);
            
            // Si l'utilisateur a désactivé les animations, arrêter l'autoplay
            if (prefersReducedMotion) {
                const container = carousel.closest('.carousel-container');
                if (container) {
                    const playPauseBtn = container.querySelector('.carousel-play');
                    if (playPauseBtn) {
                        playPauseBtn.style.display = 'none';
                    }
                }
            }
        }
    });
    
    // Gestion du bouton de lecture/pause global
    document.addEventListener('click', (e) => {
        if (e.target.closest('.carousel-play')) {
            const container = e.target.closest('.carousel-container');
            if (container) {
                const carouselId = container.querySelector('.carousel-slider')?.id;
                if (carouselId) {
                    // Trouver l'instance du carrousel et basculer l'état de lecture
                    const carousel = document.getElementById(carouselId);
                    if (carousel) {
                        const playPauseBtn = container.querySelector('.carousel-play');
                        const isPaused = playPauseBtn.innerHTML.includes('play');
                        
                        if (isPaused) {
                            sessionStorage.setItem('carouselAutoplay', 'enabled');
                        } else {
                            sessionStorage.setItem('carouselAutoplay', 'disabled');
                        }
                        
                        // Recharger le carrousel pour appliquer les changements
                        initCarousel(carouselId);
                    }
                }
            }
        }
    });
});
