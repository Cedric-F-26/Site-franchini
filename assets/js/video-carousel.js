document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.video-carousel-container');
    const slides = document.querySelectorAll('.video-wrapper');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;
    
    // Initialisation du carrousel
    function initCarousel() {
        // Mettre à jour l'affichage initial
        updateCarousel();
        
        // Démarrer le défilement automatique
        startAutoSlide();
        
        // Ajouter les écouteurs d'événements
        setupEventListeners();
    }
    
    // Mettre à jour la position du carrousel
    function updateCarousel() {
        // Mettre à jour la position du conteneur
        container.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        
        // Mettre à jour les points indicateurs
        updateDots();
    }
    
    // Mettre à jour les points indicateurs
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Aller à une diapositive spécifique
    function goToSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    // Aller à la diapositive suivante
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Aller à la diapositive précédente
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Démarrer le défilement automatique
    function startAutoSlide() {
        // Arrêter l'intervalle existant pour éviter les doublons
        stopAutoSlide();
        // Démarrer un nouvel intervalle (toutes les 5 secondes)
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Arrêter le défilement automatique
    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }
    
    // Configurer les écouteurs d'événements
    function setupEventListeners() {
        // Boutons de navigation
        nextBtn.addEventListener('click', () => {
            nextSlide();
            // Redémarrer le défilement automatique après une interaction utilisateur
            startAutoSlide();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            // Redémarrer le défilement automatique après une interaction utilisateur
            startAutoSlide();
        });
        
        // Points indicateurs
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                // Redémarrer le défilement automatique après une interaction utilisateur
                startAutoSlide();
            });
        });
        
        // Arrêter le défilement automatique lors du survol
        container.addEventListener('mouseenter', stopAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);
        
        // Gestion du redimensionnement de la fenêtre
        window.addEventListener('resize', updateCarousel);
    }
    
    // Initialiser le carrousel
    initCarousel();
});
