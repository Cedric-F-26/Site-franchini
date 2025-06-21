---
layout: default
title: Accueil
---

<!-- Carrousel principal -->
<div class="carousel-container">
    <div id="home-carousel" class="carousel-slider">
        <!-- Le contenu est chargé dynamiquement par le script de l'administration -->
    </div>
    <button class="carousel-control prev" aria-label="Précédent">&#10094;</button>
    <button class="carousel-control next" aria-label="Suivant">&#10095;</button>
    <div class="carousel-dots"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du carrousel principal
    if (typeof initCarousel === 'function') {
        initCarousel('home-carousel');
    }
});
</script>
