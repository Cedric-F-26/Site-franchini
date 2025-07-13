---
---

document.addEventListener('DOMContentLoaded', function() {
    const actualitesContainer = document.getElementById('actualites-container');
    if (!actualitesContainer) {
        return; // No container, do nothing.
    }

    // Les actualités seront chargées depuis le backend

    // Fonction pour charger les actualités depuis le backend
    async function loadNewsItems() {
        try {
            const response = await fetch('http://localhost:3000/api/news-carousels'); // URL de votre API backend
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur lors du chargement des actualités depuis le backend:', error);
            return []; // Retourne un tableau vide en cas d'erreur
        }
    }

    // Function to display a message when no news is available
    function showNoNewsMessage(container, message = 'Aucune actualité à afficher pour le moment.') {
        if (!container) return;
        container.innerHTML = `
            <div class="no-news" style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-newspaper" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem; display: block;"></i>
                <p>${message}</p>
            </div>`;
    }

    // Function to initialize the news carousel
    function initNewsCarousel(newsItems) {
        if (!newsItems || newsItems.length === 0) {
            showNoNewsMessage(actualitesContainer);
            return;
        }

        // Create the carousel HTML structure
        const carouselHTML = `
            <div class="carousel-container" role="region" aria-label="Actualités">
                <div class="carousel-track">
                    ${newsItems.map((item, index) => `
                        <div class="carousel-item" role="group" aria-label="Article ${index + 1} sur ${newsItems.length}">
                            <div class="actualite-item">
                                <img src="${item.image_url || 'assets/images/placeholder.jpg'}" alt="${item.titre || "Image d'actualité"}" class="actualite-image" onerror="this.onerror=null;this.src='assets/images/placeholder.jpg';">
                                <div class="actualite-content">
                                    ${item.date ? `<div class="actualite-date">${new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>` : ''}
                                    <h3 class="actualite-title">${item.titre || 'Sans titre'}</h3>
                                    <p class="actualite-desc">${item.contenu ? item.contenu.substring(0, 120) + (item.contenu.length > 120 ? '...' : '') : 'Pas de description.'}</p>
                                    ${item.lien ? `<a href="${item.lien}" class="actualite-link" target="_blank" rel="noopener noreferrer">Lire la suite</a>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${newsItems.length > 1 ? `
                    <button class="carousel-arrow prev" aria-label="Article précédent">❮</button>
                    <button class="carousel-arrow next" aria-label="Article suivant">❯</button>
                    <div class="carousel-nav">
                        ${newsItems.map((_, index) => `
                            <button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Aller à l'article ${index + 1}"></button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        actualitesContainer.innerHTML = carouselHTML;

        // Carousel logic
        const track = actualitesContainer.querySelector('.carousel-track');
        const items = actualitesContainer.querySelectorAll('.carousel-item');
        const dots = actualitesContainer.querySelectorAll('.carousel-dot');
        const prevBtn = actualitesContainer.querySelector('.carousel-arrow.prev');
        const nextBtn = actualitesContainer.querySelector('.carousel-arrow.next');
        
        if (!track || items.length <= 1) return;

        let currentIndex = 0;
        const totalItems = items.length;
        let autoPlayInterval;

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex === totalItems - 1;
        }

        function moveToNext() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        function startAutoPlay() {
            stopAutoPlay(); // Prevent multiple intervals
            autoPlayInterval = setInterval(moveToNext, 5000);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < totalItems - 1) {
                    currentIndex++;
                    updateCarousel();
                    stopAutoPlay();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                    stopAutoPlay();
                }
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                currentIndex = parseInt(e.target.dataset.index);
                updateCarousel();
                stopAutoPlay();
            });
        });
        
        actualitesContainer.addEventListener('mouseenter', stopAutoPlay);
        actualitesContainer.addEventListener('mouseleave', startAutoPlay);

        updateCarousel();
        startAutoPlay();
    }

    // Initialisation du carrousel d'actualités
    async function initializeNewsCarousel() {
        const actualites = await loadNewsItems();
        if (actualites && Array.isArray(actualites) && actualites.length > 0) {
            initNewsCarousel(actualites);
        } else {
            showNoNewsMessage(actualitesContainer);
        }
    }

    initializeNewsCarousel();
