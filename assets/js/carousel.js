// Fonction pour initialiser un carrousel
function initCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const container = carousel.closest('.carousel-container');
    const items = carousel.querySelectorAll('.carousel-item');
    const dotsContainer = container.querySelector('.carousel-dots');
    
    if (items.length === 0) return;
    
    let currentIndex = 0;
    const totalItems = items.length;
    let slideInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    let inactivityTimer;
    
    // Créer les points de navigation si nécessaire
    if (dotsContainer) {
        // Vider les points existants
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('data-index', i);
            dot.setAttribute('aria-label', 'Aller au slide ' + (i + 1));
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Afficher le premier slide
    updateCarousel();
    
    // Gestion des événements
    const prevBtn = container.querySelector('.carousel-control.prev');
    const nextBtn = container.querySelector('.carousel-control.next');
    const playPauseBtn = container.querySelector('.carousel-play');
    
    if (prevBtn) prevBtn.addEventListener('click', () => moveSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => moveSlide(1));
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    // Activer le défilement automatique pour le carrousel principal
    if (carouselId === 'home-carousel' && sessionStorage.getItem('carouselAutoplay') !== 'disabled') {
        startAutoPlay();
        
        // Arrêter le défilement automatique au survol
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', () => {
            if (sessionStorage.getItem('carouselAutoplay') !== 'disabled') {
                startAutoPlay();
            }
        });
    }
    
    // Fonction pour basculer entre lecture et pause
    function togglePlayPause() {
        if (slideInterval) {
            stopAutoPlay();
            if (playPauseBtn) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.setAttribute('title', 'Lire le diaporama');
            }
        } else {
            startAutoPlay();
            if (playPauseBtn) {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playPauseBtn.setAttribute('title', 'Mettre en pause');
            }
        }
    }
    
    // Fonction pour démarrer le défilement automatique
    function startAutoPlay() {
        stopAutoPlay();
        
        // Ne pas démarrer l'autoplay si désactivé par l'utilisateur
        if (sessionStorage.getItem('carouselAutoplay') === 'disabled') {
            return;
        }
        
        slideInterval = setInterval(() => moveSlide(1), 5000); // Change de slide toutes les 5 secondes
        
        // Mettre à jour l'état du bouton de lecture
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.setAttribute('title', 'Mettre en pause');
        }
        
        // Réinitialiser le timer d'inactivité
        resetInactivityTimer();
    }
    
    // Fonction pour arrêter le défilement automatique
    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    // Fonction pour déplacer le carrousel
    function moveSlide(direction) {
        currentIndex = (currentIndex + direction + totalItems) % totalItems;
        updateCarousel();
        resetInactivityTimer();
    }
    
    // Fonction pour aller à un slide spécifique
    function goToSlide(index) {
        currentIndex = (index + totalItems) % totalItems;
        updateCarousel();
        resetInactivityTimer();
    }
    
    // Mettre à jour l'affichage du carrousel
    function updateCarousel() {
        // Masquer tous les slides
        items.forEach((item, index) => {
            item.style.display = index === currentIndex ? 'block' : 'none';
            item.setAttribute('aria-hidden', index !== currentIndex);
        });
        
        // Mettre à jour les points de navigation
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                const isActive = index === currentIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-current', isActive);
            });
        }
        
        // Mettre à jour l'accessibilité
        carousel.setAttribute('aria-live', 'polite');
        carousel.setAttribute('aria-atomic', 'true');
    }
    
    // Gestion du swipe sur mobile
    function handleSwipe() {
        const swipeThreshold = 50; // Seuil minimal en pixels pour considérer un swipe
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe vers la gauche
            moveSlide(1);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe vers la droite
            moveSlide(-1);
        }
    }
    
    // Événements tactiles pour le swipe
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    // Navigation au clavier
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            moveSlide(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            moveSlide(1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(totalItems - 1);
        } else if (e.key === ' ' || e.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.classList.contains('carousel-dot')) {
                e.preventDefault();
                const index = parseInt(focusedElement.getAttribute('data-index'), 10);
                goToSlide(index);
            }
        }
    });
    
    // Gestion de la visibilité de la page (API Page Visibility)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // La page est en arrière-plan, arrêter le carrousel
            stopAutoPlay();
        } else if (sessionStorage.getItem('carouselAutoplay') !== 'disabled') {
            // La page est au premier plan, redémarrer le carrousel si l'autoplay n'est pas désactivé
            startAutoPlay();
        }
    });
    
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

// Initialiser tous les carrousels au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        initCarousel(carousel.id);
    });
});
