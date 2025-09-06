---
layout: default
title: Accueil
---

<section class="welcome-section">
    <h1>Bienvenue chez Franchini</h1>
    <p>Découvrez notre sélection de matériels et services de qualité.</p>
</section>

<!-- Carrousel de vidéos YouTube -->
<section class="video-carousel">
    <div class="video-carousel-container">
        <div class="video-wrapper active">
            <iframe id="player1" src="https://www.youtube.com/embed/j_EeGikCEt8?enablejsapi=1&origin=https://site-franchini.vercel.app" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="video-wrapper">
            <iframe id="player2" src="about:blank" data-src="https://www.youtube.com/embed/sC4AXwDOFew?enablejsapi=1&origin=https://site-franchini.vercel.app" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="video-wrapper">
            <iframe id="player3" src="about:blank" data-src="https://www.youtube.com/embed/H3gApB9cgoo?enablejsapi=1&origin=https://site-franchini.vercel.app" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    </div>
    <div class="carousel-controls">
        <button class="carousel-prev" aria-label="Vidéo précédente">❮</button>
        <div class="carousel-dots">
            <span class="dot active" data-video="0"></span>
            <span class="dot" data-video="1"></span>
            <span class="dot" data-video="2"></span>
        </div>
        <button class="carousel-next" aria-label="Vidéo suivante">❯</button>
    </div>
</section>

<!-- API YouTube -->
<script>
  // Charger l'API YouTube de manière asynchrone
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
</script>

<div class="content-sections">
    <section class="news-section">
        <h2>Actualités</h2>
        <div class="fb-page" 
             data-href="https://www.facebook.com/profile.php?id=61573705277749" 
             data-tabs="timeline" 
             data-width="" 
             data-height="400" 
             data-small-header="false" 
             data-adapt-container-width="true" 
             data-hide-cover="false" 
             data-show-facepile="false">
            <blockquote cite="https://www.facebook.com/profile.php?id=61573705277749" class="fb-xfbml-parse-ignore">
                <a href="https://www.facebook.com/profile.php?id=61573705277749">Suivez-nous sur Facebook</a>
            </blockquote>
        </div>
    </section>

    <section class="products-section">
        <h2>Nos Produits</h2>
        <div class="products-grid">
            <a href="/neuf" class="product-card">
                <h3>Matériel Neuf</h3>
                <p>Découvrez nos dernières arrivées</p>
            </a>
            <a href="/occasion" class="product-card">
                <h3>Occasions</h3>
                <p>Des opportunités à ne pas manquer</p>
            </a>
        </div>
    </section>
</div>
