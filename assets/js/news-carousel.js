// Fonction pour initialiser le carrousel d'actualités
function initNewsCarousel(actualites) {
    const container = document.getElementById('actualites-container');
    if (!container) return;
    
    // Vider le conteneur
    container.innerHTML = '';
    
    // Créer la structure du carrousel
    const carouselHTML = `
        <div class="carousel-container">
            <div class="carousel-track">
                ${actualites.map((actualite, index) => `
                    <div class="carousel-item" data-index="${index}">
                        <div class="actualite-item">
                            <img src="${actualite.image_url}" alt="${actualite.titre || 'Actualité'}" class="actualite-image" onerror="this.src='assets/images/placeholder.jpg'">
                            <div class="actualite-content">
                                ${actualite.date ? `<div class="actualite-date">${new Date(actualite.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>` : ''}
                                <h3 class="actualite-title">${actualite.titre || 'Sans titre'}</h3>
                                <p class="actualite-desc">${actualite.contenu ? actualite.contenu.substring(0, 150) + (actualite.contenu.length > 150 ? '...' : '') : ''}</p>
                                ${actualite.lien ? `<a href="${actualite.lien}" class="actualite-link">Lire la suite</a>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${actualites.length > 1 ? `
                <button class="carousel-arrow prev" aria-label="Article précédent">❮</button>
                <button class="carousel-arrow next" aria-label="Article suivant">❯</button>
                <div class="carousel-nav">
                    ${actualites.map((_, index) => `
                        <button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Aller à l'article ${index + 1}"></button>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    container.innerHTML = carouselHTML;
    
    // Initialiser les variables du carrousel
    const track = container.querySelector('.carousel-track');
    const items = container.querySelectorAll('.carousel-item');
    const dots = container.querySelectorAll('.carousel-dot');
    const prevBtn = container.querySelector('.carousel-arrow.prev');
    const nextBtn = container.querySelector('.carousel-arrow.next');
    let currentIndex = 0;
    const itemsToShow = Math.min(3, items.length);
    const itemWidth = 100 / itemsToShow;
    
    // Mettre à jour la position du carrousel
    function updateCarousel() {
        if (track) {
            track.style.transform = `translateX(-${currentIndex * itemWidth}%`;
        }
        
        // Mettre à jour les points de navigation
        if (dots && dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Gérer la visibilité des flèches
        if (prevBtn) prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex';
        if (nextBtn) nextBtn.style.display = currentIndex >= items.length - itemsToShow ? 'none' : 'flex';
    }
    
    // Événements
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (items.length > 0 && currentIndex < items.length - itemsToShow) {
                currentIndex++;
                updateCarousel();
            }
        });
    }
    
    // Navigation par points
    if (dots && dots.length > 0) {
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentIndex = parseInt(dot.dataset.index);
                updateCarousel();
            });
        });
    }
    
    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        } else if (e.key === 'ArrowRight' && items.length > 0 && currentIndex < items.length - itemsToShow) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Initialisation
    updateCarousel();
    
    // Faire défiler automatiquement toutes les 5 secondes si plus d'un élément
    if (items.length > 1) {
        let autoScroll = setInterval(() => {
            if (currentIndex < items.length - itemsToShow) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        }, 5000);
        
        // Arrêter le défilement automatique au survol
        container.addEventListener('mouseenter', () => {
            clearInterval(autoScroll);
        });
        
        container.addEventListener('mouseleave', () => {
            autoScroll = setInterval(() => {
                if (currentIndex < items.length - itemsToShow) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            }, 5000);
        });
    }
}

// Charger et afficher les actualités
document.addEventListener('DOMContentLoaded', function() {
    const actualitesContainer = document.getElementById('actualites-container');
    if (!actualitesContainer) return;

    try {
        // Afficher un indicateur de chargement
        actualitesContainer.innerHTML = '<div class="loading">Chargement des actualités...</div>';
        
        // Utiliser les données statiques
        const actualites = typeof actualitesStatiques !== 'undefined' ? actualitesStatiques : [];
        
        // Si aucune actualité n'est trouvée
        if (!actualites || actualites.length === 0) {
            actualitesContainer.innerHTML = `
                <div class="no-news">
                    <p>Aucune actualité pour le moment.</p>
                </div>`;
            return;
        }
        
        // Initialiser le carrousel avec les actualités
        initNewsCarousel(actualites);
        
    } catch (error) {
        console.error('Erreur:', error);
        actualitesContainer.innerHTML = `
            <div class="error-message">
                <p>Une erreur est survenue lors du chargement des actualités.</p>
                <button onclick="window.location.reload()">Réessayer</button>
            </div>`;
    }
});
