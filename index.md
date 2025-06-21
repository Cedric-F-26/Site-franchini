---
layout: default
title: Accueil
carousels:
  - id: home-carousel
    title: ""
    items:
      - image: /assets/images/carousel/slide1.jpg
        title: "Bienvenue chez Franchini"
        description: "Votre concessionnaire agricole de confiance"
        button_text: "Découvrir"
        button_url: "/pages/concession.html"
      - image: /assets/images/carousel/slide2.jpg
        title: "Matériel neuf"
        description: "Découvrez nos dernières machines agricoles"
        button_text: "Voir les offres"
        button_url: "/pages/materiel.html"
      - image: /assets/images/carousel/slide3.jpg
        title: "Occasions"
        description: "Des machines d'occasion vérifiées et garanties"
        button_text: "Voir les occasions"
        button_url: "/pages/occasion.html"
  - id: news-carousel
    title: "Actualités"
    items:
      - image: /assets/images/news/news1.jpg
        title: "Nouveautés 2023"
        description: "Découvrez nos nouveaux modèles"
        button_text: "En savoir plus"
        button_url: "#"
      - image: /assets/images/news/news2.jpg
        title: "Promotions été"
        description: "Profitez de nos offres spéciales"
        button_text: "Voir les offres"
        button_url: "#"
  - id: occasions-carousel
    title: "Nos occasions"
    items:
      - image: "/assets/images/occasions/tracteur1.jpg"
        title: "Tracteur Deutz-Fahr 5120 C"
        description: "Année 2020 - 500h - 120ch"
        price: "45 500 €"
        button_text: "Voir l'annonce"
        button_url: "#"
      - image: "/assets/images/occasions/moissonneuse1.jpg"
        title: "Moissonneuse-batteuse"
        description: "Année 2019 - 800h - Excellente état"
        price: "125 000 €"
        button_text: "Voir l'annonce"
        button_url: "#"
---

<!-- Carrousel principal pleine largeur -->
<div class="carousel-wrapper">
    <div class="carousel-container full-width">
        <div id="home-carousel" class="carousel-slider">
            {% for item in page.carousels[0].items %}
            <div class="carousel-slide">
                <div class="slide-content" style="background-image: url('{{ item.image | relative_url }}');">
                    <div class="carousel-caption">
                        <h2>{{ item.title }}</h2>
                        <p>{{ item.description }}</p>
                        <a href="{{ item.button_url | relative_url }}" class="btn btn-primary">{{ item.button_text }}</a>
                    </div>
                </div>
            </div>
            {% endfor %}
        </div>
        <button class="carousel-control prev" aria-label="Précédent">&#10094;</button>
        <button class="carousel-control next" aria-label="Suivant">&#10095;</button>
        <div class="carousel-dots"></div>
    </div>
</div>

<!-- Conteneur pour les deux carrousels côte à côte -->
<div class="container mt-5">
    <div class="row">
        <!-- Carrousel d'actualités -->
        <div class="col-md-6 mb-4">
            <div class="carousel-wrapper">
                <h2 class="section-title">{{ page.carousels[1].title }}</h2>
                <div class="carousel-container">
                    <div id="news-carousel" class="carousel-slider">
                        {% for item in page.carousels[1].items %}
                        <div class="carousel-slide">
                            <div class="card h-100">
                                <img src="{{ item.image | relative_url }}" class="card-img-top" alt="{{ item.title }}">
                                <div class="card-body">
                                    <h5 class="card-title">{{ item.title }}</h5>
                                    <p class="card-text">{{ item.description }}</p>
                                    <a href="{{ item.button_url | relative_url }}" class="btn btn-outline-primary">{{ item.button_text }}</a>
                                </div>
                            </div>
                        </div>
                        {% endfor %}
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
                <h2 class="section-title">{{ page.carousels[2].title }}</h2>
                <div class="carousel-container">
                    <div id="occasions-carousel" class="carousel-slider">
                        {% for item in page.carousels[2].items %}
                        <div class="carousel-slide">
                            <div class="card h-100">
                                <img src="{{ item.image | relative_url }}" class="card-img-top" alt="{{ item.title }}">
                                <div class="card-body">
                                    <h5 class="card-title">{{ item.title }}</h5>
                                    <p class="card-text">{{ item.description }}</p>
                                    {% if item.price %}<p class="price">{{ item.price }}</p>{% endif %}
                                    <a href="{{ item.button_url | relative_url }}" class="btn btn-outline-primary">{{ item.button_text }}</a>
                                </div>
                            </div>
                        </div>
                        {% endfor %}
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
    // Initialisation des carrousels
    initCarousel('home-carousel');
    initCarousel('news-carousel');
    initCarousel('occasions-carousel');
});
</script>
