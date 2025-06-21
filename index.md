---
layout: default
title: Accueil
---

<!-- Carrousel principal géré par l'administration -->
<div id="home-carousel-container" class="carousel-container full-width mb-5">
    <div id="home-carousel" class="carousel-slider">
        <!-- Le contenu sera chargé dynamiquement par le script -->
    </div>
    <button class="carousel-control prev" aria-label="Précédent">&#10094;</button>
    <button class="carousel-control next" aria-label="Suivant">&#10095;</button>
    <div class="carousel-dots"></div>
</div>

<div class="container mt-4">
    <div class="row">
        <!-- Carrousel d'actualités -->
        <div class="col-md-6 mb-4">
            <div class="carousel-wrapper">
                <h2 class="section-title">Actualités</h2>
                <div class="carousel-container">
                    <div id="news-carousel" class="carousel-slider">
                        <div class="carousel-slide">
                            <div class="card h-100">
                                <img src="/assets/images/news/news1.jpg" class="card-img-top" alt="Nouveautés 2023">
                                <div class="card-body">
                                    <h5 class="card-title">Nouveautés 2023</h5>
                                    <p class="card-text">Découvrez nos nouveaux modèles</p>
                                    <a href="#" class="btn btn-outline-primary">En savoir plus</a>
                                </div>
                            </div>
                        </div>
                        <div class="carousel-slide">
                            <div class="card h-100">
                                <img src="/assets/images/news/news2.jpg" class="card-img-top" alt="Promotions été">
                                <div class="card-body">
                                    <h5 class="card-title">Promotions été</h5>
                                    <p class="card-text">Profitez de nos offres spéciales</p>
                                    <a href="#" class="btn btn-outline-primary">Voir les offres</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="carousel-control prev" aria-label="Précédent">&#10094;</button>
                    <button class="carousel-control next" aria-label="Suivant">&#10095;</button>
                    <div class="carousel-dots"></div>
                </div>
            </div>
        </div>

        <!-- Carrousel d'occasions -->
        <div class="col-md-6 mb-4">
            <div class="carousel-wrapper">
                <h2 class="section-title">Nos occasions</h2>
                <div class="carousel-container">
                    <div id="occasions-carousel" class="carousel-slider">
                        <div class="carousel-slide">
                            <div class="card h-100">
                                <img src="/assets/images/occasions/tracteur1.jpg" class="card-img-top" alt="Tracteur Deutz-Fahr 5120 C">
                                <div class="card-body">
                                    <h5 class="card-title">Tracteur Deutz-Fahr 5120 C</h5>
                                    <p class="card-text">Année 2020 - 500h - 120ch</p>
                                    <p class="price">45 500 €</p>
                                    <a href="#" class="btn btn-outline-primary">Voir l'annonce</a>
                                </div>
                            </div>
                        </div>
                        <div class="carousel-slide">
                            <div class="card h-100">
                                <img src="/assets/images/occasions/moissonneuse1.jpg" class="card-img-top" alt="Moissonneuse-batteuse">
                                <div class="card-body">
                                    <h5 class="card-title">Moissonneuse-batteuse</h5>
                                    <p class="card-text">Année 2019 - 800h - Excellente état</p>
                                    <p class="price">125 000 €</p>
                                    <a href="#" class="btn btn-outline-primary">Voir l'annonce</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="carousel-control prev" aria-label="Précédent">&#10094;</button>
                    <button class="carousel-control next" aria-label="Suivant">&#10095;</button>
                    <div class="carousel-dots"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Initialisation des carrousels -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour charger le carrousel depuis le localStorage
    function loadCarouselFromStorage() {
        try {
            const carouselData = JSON.parse(localStorage.getItem('franchiniCarousel')) || [];
            const carouselContainer = document.getElementById('home-carousel');
            
            if (!carouselContainer || carouselData.length === 0) {
                // Afficher un message ou un carrousel par défaut si aucun contenu n'est trouvé
                carouselContainer.innerHTML = `
                    <div class="carousel-slide">
                        <div class="slide-content" style="background-image: url('/assets/images/default-banner.jpg');">
                            <div class="carousel-caption">
                                <h2>Bienvenue chez Franchini</h2>
                                <p>Votre concessionnaire agricole de confiance</p>
                                <a href="/pages/concession.html" class="btn btn-primary">Découvrir</a>
                            </div>
                        </div>
                    </div>`;
                return;
            }

            // Générer le HTML pour chaque élément du carrousel
            carouselContainer.innerHTML = carouselData.map(item => {
                if (item.type === 'image') {
                    return `
                        <div class="carousel-slide">
                            <div class="slide-content" style="background-image: url('${item.mediaUrl}');">
                                <div class="carousel-caption">
                                    ${item.title ? `<h2>${item.title}</h2>` : ''}
                                    ${item.description ? `<p>${item.description}</p>` : ''}
                                    ${item.buttonText ? `<a href="${item.buttonUrl || '#'}" class="btn btn-primary">${item.buttonText}</a>` : ''}
                                </div>
                            </div>
                        </div>`;
                } else if (item.type === 'youtube') {
                    const videoId = item.mediaUrl.split('v=')[1] || '';
                    return `
                        <div class="carousel-slide">
                            <div class="video-container">
                                <iframe width="100%" height="100%" 
                                    src="https://www.youtube.com/embed/${videoId}?autoplay=0&controls=0&showinfo=0&rel=0" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                                </iframe>
                            </div>
                        </div>`;
                }
                return '';
            }).join('');

            // Initialiser le carrousel
            initCarousel('home-carousel');

        } catch (error) {
            console.error('Erreur lors du chargement du carrousel:', error);
        }
    }

    // Charger le carrousel au chargement de la page
    loadCarouselFromStorage();
    
    // Initialiser les autres carrousels
    initCarousel('news-carousel');
    initCarousel('occasions-carousel');
});
</script>

<!-- Styles pour le carrousel principal -->
<style>
#home-carousel-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
}

#home-carousel .slide-content {
    position: relative;
    width: 100%;
    height: 500px; /* Ajustez la hauteur selon vos besoins */
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
}

#home-carousel .carousel-caption {
    background-color: rgba(0, 0, 0, 0.5);
    padding: 2rem;
    border-radius: 5px;
    max-width: 800px;
    margin: 0 auto;
}

#home-carousel .carousel-caption h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

#home-carousel .carousel-caption p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
}

#home-carousel .carousel-caption .btn {
    font-size: 1.1rem;
    padding: 0.5rem 2rem;
}

.video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
    height: 0;
    overflow: hidden;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* Styles responsifs */
@media (max-width: 768px) {
    #home-carousel .slide-content {
        height: 350px;
    }
    
    #home-carousel .carousel-caption h2 {
        font-size: 1.8rem;
    }
    
    #home-carousel .carousel-caption p {
        font-size: 1rem;
    }
}
</style>
