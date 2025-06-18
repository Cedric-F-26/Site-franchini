// Fonction pour afficher un message lorsqu'aucune actualité n'est disponible
function showNoNewsMessage(container, message = 'Aucune actualité à afficher pour le moment.') {
    if (!container) return;
    
    container.innerHTML = `
        <div class="no-news" style="text-align: center; padding: 2rem;">
            <i class="fas fa-newspaper" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
            <p>${message}</p>
        </div>`;
}

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
        
        // Tenter de charger les actualités depuis l'API
        fetch('/api/actualites')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! statut: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success && data.actualites && data.actualites.length > 0) {
                    initNewsCarousel(data.actualites);
                } else {
                    // Si l'API ne renvoie pas de données, utiliser les données statiques
                    const actualites = typeof actualitesStatiques !== 'undefined' ? actualitesStatiques : [];
                    if (actualites && actualites.length > 0) {
                        initNewsCarousel(actualites);
                    } else {
                        showNoNewsMessage(actualitesContainer, data?.message);
                    }
                }
            })
            .catch(apiError => {
                console.error('Erreur API, utilisation des données statiques:', apiError);
                // En cas d'erreur API, utiliser les données statiques
                const actualites = typeof actualitesStatiques !== 'undefined' ? actualitesStatiques : [];
                if (actualites && actualites.length > 0) {
                    initNewsCarousel(actualites);
                } else {
                    showNoNewsMessage(actualitesContainer, 'Impossible de charger les actualités.');
                }
            });
    } catch (error) {
        console.error('Erreur lors du chargement des actualités:', error);
        actualitesContainer.innerHTML = `
            <div class="error-message" style="color: #e74c3c; text-align: center; padding: 1rem; background: #fde8e8; border-radius: 4px; margin: 1rem 0;">
                <i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem;"></i>
                Une erreur est survenue lors du chargement des actualités.
                <button onclick="window.location.reload()" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Réessayer</button>
            </div>`;
    }
});
