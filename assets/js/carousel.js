// Gestion du carrousel
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.getElementById('home-carousel');
    if (!carouselContainer) return;
    
    // Configuration du carrousel
    const carouselItems = [
        {
            type: 'image',
            src: 'assets/images/slide1.jpg',
            alt: 'Tracteur Franchini',
            title: 'Bienvenue chez Franchini',
            description: 'Votre partenaire agricole de confiance',
            buttonText: 'Découvrir',
            buttonLink: 'pages/neuf.html'
        },
        {
            type: 'youtube',
            videoId: 'votre_video_id',
            title: 'Découvrez notre gamme',
            description: 'Vidéo de présentation de nos produits'
        },
        {
            type: 'image',
            src: 'assets/images/slide2.jpg',
            alt: 'Matériel agricole',
            title: 'Matériel de qualité',
            description: 'Des équipements adaptés à vos besoins',
            buttonText: 'Voir nos produits',
            buttonLink: 'pages/occasion.html'
        }
    ];

    // Fonction pour extraire l'ID d'une vidéo YouTube depuis une URL
    function extractYoutubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    // Créer le carrousel s'il y a des éléments
    if (carouselItems.length > 0) {
        // Créer les slides
        carouselItems.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide' + (index === 0 ? ' active' : '');
            
            if (item.type === 'youtube') {
                const videoId = item.videoId || extractYoutubeId(item.src);
                if (videoId) {
                    slide.innerHTML = `
                        <div class="video-container">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src="https://www.youtube.com/embed/${videoId}?controls=0&showinfo=0&rel=0&autoplay=0" 
                                frameborder="0" 
                                allowfullscreen>
                            </iframe>
                            <div class="video-overlay">
                                <h2>${item.title || ''}</h2>
                                <p>${item.description || ''}</p>
                            </div>
                        </div>`;
                }
            } else {
                slide.innerHTML = `
                    <div class="slide-content" style="background-image: url('${item.src}');">
                        <div class="slide-overlay">
                            <h2>${item.title || ''}</h2>
                            <p>${item.description || ''}</p>
                            ${item.buttonText ? `<a href="${item.buttonLink || '#'}" class="btn">${item.buttonText}</a>` : ''}
                        </div>
                    </div>`;
            }
            
            carouselContainer.appendChild(slide);
        });
        
        // Ajouter la navigation
        const nav = document.createElement('div');
        nav.className = 'carousel-nav';
        nav.innerHTML = `
            <button class="carousel-prev">❮</button>
            <button class="carousel-next">❯</button>`;
        carouselContainer.appendChild(nav);
        
        // Ajouter les points de navigation
        const dots = document.createElement('div');
        dots.className = 'carousel-dots';
        carouselItems.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('data-index', index);
            dots.appendChild(dot);
        });
        carouselContainer.appendChild(dots);
        
        // Variables de contrôle
        let currentSlide = 0;
        let slideInterval;
        const slides = document.querySelectorAll('.carousel-slide');
        const dotsList = document.querySelectorAll('.carousel-dot');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
        // Fonction pour changer de slide
        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            // Masquer toutes les slides
            slides.forEach(slide => slide.classList.remove('active'));
            dotsList.forEach(dot => dot.classList.remove('active'));
            
            // Afficher la slide courante
            slides[index].classList.add('active');
            dotsList[index].classList.add('active');
            
            currentSlide = index;
            
            // Redémarrer le timer
            resetInterval();
        }
        
        // Événements des boutons de navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = (currentSlide - 1 + carouselItems.length) % carouselItems.length;
                goToSlide(newIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = (currentSlide + 1) % carouselItems.length;
                goToSlide(newIndex);
            });
        }
        
        // Navigation par les points
        dotsList.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                const newIndex = (currentSlide - 1 + carouselItems.length) % carouselItems.length;
                goToSlide(newIndex);
            } else if (e.key === 'ArrowRight') {
                const newIndex = (currentSlide + 1) % carouselItems.length;
                goToSlide(newIndex);
            }
        });
        
        // Fonction pour démarrer le timer avec une durée spécifique
        function startSlideTimer(duration) {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                const newIndex = (currentSlide + 1) % carouselItems.length;
                goToSlide(newIndex);
            }, duration || 5000);
        }
        
        // Démarrer le défilement automatique
        function startCarousel() {
            // Ne pas démarrer le carrousel s'il n'y a qu'une seule slide
            if (carouselItems.length <= 1) return;
            
            // Vérifier si l'utilisateur préfère les animations réduites
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (!prefersReducedMotion) {
                startSlideTimer(5000);
            }
            
            // Gestion du mode picture-in-picture pour les vidéos
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopCarousel();
                } else {
                    startCarousel();
                }
            });
            
            // Gestion de la visibilité de l'onglet
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopCarousel();
                } else {
                    startCarousel();
                }
            });
            
            // Gestion de la mise en veille de l'écran
            document.addEventListener('resume', startCarousel);
            window.addEventListener('focus', startCarousel);
            
            // Gestion de la suspension de l'onglet
            document.addEventListener('freeze', stopCarousel);
            window.addEventListener('blur', stopCarousel);
        }
        
        // Arrêter le défilement automatique
        function stopCarousel() {
            clearInterval(slideInterval);
        }
        
        // Réinitialiser l'intervalle
        function resetInterval() {
            stopCarousel();
            startCarousel();
        }
        
        // Gérer le clic sur le bouton de lecture des vidéos
        document.addEventListener('click', function(e) {
            const playButton = e.target.closest('.play-button');
            if (playButton) {
                const video = playButton.closest('.slide-content').querySelector('video');
                if (video) {
                    video.play();
                    playButton.style.display = 'none';
                }
            }
        });
        
        // Gestion du swipe sur mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        function handleSwipe() {
            if (touchEndX < touchStartX) {
                // Swipe vers la gauche
                const newIndex = (currentSlide + 1) % carouselItems.length;
                goToSlide(newIndex);
            } else if (touchEndX > touchStartX) {
                // Swipe vers la droite
                const newIndex = (currentSlide - 1 + carouselItems.length) % carouselItems.length;
                goToSlide(newIndex);
            }
        }
        
        // Événements tactiles pour le swipe
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        // Démarrer le carrousel
        startCarousel();
        
        // Arrêter le défilement automatique au survol
        carouselContainer.addEventListener('mouseenter', stopCarousel);
        carouselContainer.addEventListener('mouseleave', startCarousel);
        
        // Gestion du redimensionnement de la fenêtre
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Réinitialiser le carrousel après le redimensionnement
                goToSlide(currentSlide);
            }, 250);
        });
    } else {
        // Afficher un message si aucun élément n'est configuré
        carouselContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3>Aucun contenu à afficher pour le moment</h3>
                <p>Veuillez configurer les éléments du carrousel dans le fichier de configuration.</p>
            </div>`;
    }
});
