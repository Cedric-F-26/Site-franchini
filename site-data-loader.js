// Chargeur de données dynamiques pour le site public
// Utilise les données de l'administration pour afficher le contenu réel

class SiteDataLoader {
    constructor() {
        this.homeVideos = [];
        this.actualites = [];
        this.init();
    }

    init() {
        // Charger les données depuis localStorage (partagé avec l'admin)
        this.loadDataFromStorage();
        
        // Mettre à jour le carrousel et les actualités
        this.updateHomeCarousel();
        this.updateActualitesCarousel();
    }

    loadDataFromStorage() {
        try {
            this.homeVideos = JSON.parse(localStorage.getItem('franchini_home_videos') || '[]');
            this.actualites = JSON.parse(localStorage.getItem('franchini_actualites') || '[]');
            console.log('Données chargées:', { videos: this.homeVideos.length, actualites: this.actualites.length });
        } catch (error) {
            console.error('Erreur de chargement des données:', error);
        }
    }

    updateHomeCarousel() {
        const carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer) return;

        if (this.homeVideos.length === 0) {
            // Afficher un message si aucune vidéo
            carouselContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 500px; background: #f8f9fa; border-radius: 10px;">
                    <div style="text-align: center; color: #666;">
                        <i class="fas fa-video" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <h3>Aucune vidéo disponible</h3>
                        <p>Les vidéos seront ajoutées via l'administration</p>
                    </div>
                </div>
            `;
            return;
        }

        // Créer les slides pour les vidéos
        carouselContainer.innerHTML = this.homeVideos.map((video, index) => `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}">
                <div class="video-container">
                    ${video.url.includes('youtube') || video.url.includes('youtu.be') ? 
                        `<iframe src="${video.url}" allow="autoplay; encrypted-media" allowfullscreen></iframe>` :
                        video.type === 'video' ?
                        `<video controls autoplay muted loop>
                            <source src="${video.dataUrl || video.url}" type="video/mp4">
                        </video>` :
                        `<img src="${video.dataUrl || video.url}" alt="${video.title}" style="width: 100%; height: 100%; object-fit: cover;">`
                    }
                </div>
            </div>
        `).join('');

        // Réinitialiser le carrousel
        this.reinitCarousel();
    }

    updateActualitesCarousel() {
        const actualitesContainer = document.querySelector('.actualites-carousel');
        if (!actualitesContainer) return;

        if (this.actualites.length === 0) {
            // Afficher un message si aucune actualité
            actualitesContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 400px; background: #f8f9fa; border-radius: 10px;">
                    <div style="text-align: center; color: #666;">
                        <i class="fas fa-newspaper" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <h3>Aucune actualité disponible</h3>
                        <p>Les actualités seront ajoutées via l'administration</p>
                    </div>
                </div>
            `;
            return;
        }

        // Créer les slides pour les actualités
        actualitesContainer.innerHTML = this.actualites.map((actualite, index) => `
            <div class="actualite-slide ${index === 0 ? 'active' : ''}">
                ${actualite.type === 'video' ?
                    `<video autoplay muted loop>
                        <source src="${actualite.dataUrl || actualite.mediaUrl}" type="video/mp4">
                    </video>` :
                    `<img src="${actualite.dataUrl || actualite.mediaUrl}" alt="${actualite.title}">`
                }
                <div class="actualite-info">
                    <h3>${actualite.title}</h3>
                    <p>${actualite.description}</p>
                </div>
            </div>
        `).join('');

        // Réinitialiser le carrousel d'actualités
        this.reinitActualitesCarousel();
    }

    reinitCarousel() {
        // Réinitialiser le carrousel de vidéos
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        
        window.changeSlide = function(direction) {
            slides.forEach(slide => slide.classList.remove('active'));
            currentSlide = (currentSlide + direction + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        // Auto-play
        setInterval(() => {
            window.changeSlide(1);
        }, 15000);
    }

    reinitActualitesCarousel() {
        // Réinitialiser le carrousel d'actualités
        const slides = document.querySelectorAll('.actualite-slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            
            // Gérer les vidéos
            const video = slides[currentSlide].querySelector('video');
            if (video) {
                video.play();
            }
        }

        // Auto-play pour les images
        setInterval(() => {
            const currentVideo = slides[currentSlide].querySelector('video');
            if (!currentVideo) {
                showSlide(currentSlide + 1);
            }
        }, 3000);
    }
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    window.siteData = new SiteDataLoader();
});
