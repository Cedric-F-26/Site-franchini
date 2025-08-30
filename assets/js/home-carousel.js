import { db, collection, getDocs, query, orderBy } from './auth/firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Chargement du carrousel d\'accueil...');
    const carouselSlider = document.querySelector('#home-carousel .carousel-slider');
    
    if (!carouselSlider) {
        console.error('Élément du carrousel non trouvé');
        return;
    }

    let currentIndex = 0;
    let slides = [];
    let intervalId = null;
    const IMAGE_DISPLAY_TIME = 3000; // 3 secondes pour les images
    let currentSlideTimeout = null;

    async function loadCarouselItems() {
        try {
            const q = query(collection(db, 'carousel'), orderBy('order'));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                console.log('Aucun élément dans le carrousel');
                carouselSlider.innerHTML = `
                    <div class="carousel-slide active" data-type="image">
                        <img src="/assets/images/logo/Logo-Franchini-2.jpg" class="carousel-image" alt="Bienvenue chez Franchini">
                    </div>`;
                return;
            }

            // Créer les slides du carrousel
            querySnapshot.forEach((doc, index) => {
                const item = doc.data();
                const slide = document.createElement('div');
                slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
                slide.dataset.id = doc.id;
                slide.dataset.type = item.type;
                slide.dataset.duration = item.duration || (item.type === 'image' ? IMAGE_DISPLAY_TIME : 0);
                
                if (item.type === 'youtube') {
                    const videoId = getYouTubeID(item.mediaUrl);
                    slide.innerHTML = `
                        <div class="video-container">
                            <iframe 
                                src="https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&enablejsapi=1" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        </div>`;
                } else {
                    slide.innerHTML = `
                        <img src="${item.mediaUrl}" class="carousel-image" alt="${item.title || ''}">
                        ${item.title ? `
                        <div class="carousel-content">
                            <h2>${item.title}</h2>
                            ${item.description ? `<p>${item.description}</p>` : ''}
                        </div>` : ''}`;
                }
                
                carouselSlider.appendChild(slide);
                slides.push(slide);
            });

            // Initialiser le carrousel
            initCarousel();
            
        } catch (error) {
            console.error('Erreur lors du chargement du carrousel:', error);
            carouselSlider.innerHTML = `
                <div class="carousel-slide active">
                    <div class="carousel-content">
                        <h2>Erreur de chargement</h2>
                        <p>Impossible de charger le carrousel. Veuillez réessayer plus tard.</p>
                    </div>
                </div>`;
        }
    }

    function initCarousel() {
        // Démarrer le défilement automatique
        startAutoPlay();
        
        // Gestion du clic sur les boutons de navigation
        document.querySelectorAll('.carousel-control').forEach(button => {
            button.addEventListener('click', (e) => {
                if (e.target.closest('.prev')) {
                    navigate(-1);
                } else if (e.target.closest('.next')) {
                    navigate(1);
                }
                resetAutoPlay();
            });
        });
        
        // Gestion du survol pour arrêter le défilement
        carouselSlider.addEventListener('mouseenter', pauseAutoPlay);
        carouselSlider.addEventListener('mouseleave', startAutoPlay);
        
        // Gestion du touch pour mobile
        let touchStartX = 0;
        carouselSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            pauseAutoPlay();
        }, { passive: true });
        
        carouselSlider.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) { // Seuil de glissement
                if (diff > 0) {
                    navigate(1);
                } else {
                    navigate(-1);
                }
            }
            
            startAutoPlay();
        }, { passive: true });
    }
    
    function navigate(direction) {
        // Arrêter le timer actuel
        if (currentSlideTimeout) {
            clearTimeout(currentSlideTimeout);
            currentSlideTimeout = null;
        }
        
        // Mettre à jour l'index
        currentIndex = (currentIndex + direction + slides.length) % slides.length;
        
        // Mettre à jour l'affichage
        updateActiveSlide();
        
        // Démarrer le timer pour le slide suivant
        startSlideTimer();
    }
    
    function updateActiveSlide() {
        // Mettre à jour les classes actives
        slides.forEach((slide, index) => {
            const isActive = index === currentIndex;
            slide.classList.toggle('active', isActive);
            slide.setAttribute('aria-hidden', !isActive);
            
            // Gérer l'autoplay des vidéos
            if (isActive && slide.dataset.type === 'youtube') {
                const iframe = slide.querySelector('iframe');
                if (iframe) {
                    const videoId = getYouTubeID(iframe.src);
                    if (videoId) {
                        iframe.contentWindow.postMessage(JSON.stringify({
                            event: 'command',
                            func: 'playVideo'
                        }), '*');
                    }
                }
            }
        });
    }
    
    function startSlideTimer() {
        const currentSlide = slides[currentIndex];
        if (!currentSlide) return;
        
        // Ne pas démarrer de timer pour les vidéos (elles ont leur propre durée)
        if (currentSlide.dataset.type === 'youtube') return;
        
        // Démarrer le timer pour passer au slide suivant
        currentSlideTimeout = setTimeout(() => {
            navigate(1);
        }, parseInt(currentSlide.dataset.duration) || IMAGE_DISPLAY_TIME);
    }
    
    function startAutoPlay() {
        // Arrêter tout timer existant
        pauseAutoPlay();
        
        // Démarrer le timer pour le slide actuel
        startSlideTimer();
    }
    
    function pauseAutoPlay() {
        if (currentSlideTimeout) {
            clearTimeout(currentSlideTimeout);
            currentSlideTimeout = null;
        }
    }
    
    function resetAutoPlay() {
        pauseAutoPlay();
        startAutoPlay();
    }
    
    // Fonction utilitaire pour extraire l'ID d'une vidéo YouTube
    function getYouTubeID(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    // Charger les éléments du carrousel
    await loadCarouselItems();
});
