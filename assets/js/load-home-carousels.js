document.addEventListener('DOMContentLoaded', function() {
    const CONFIG = window.AppConfig?.config || {
        storageKeys: { accueil: 'franchiniCarousel' },
        baseUrl: ''
    };

    /**
     * Charge les éléments du carrousel depuis le stockage local
     * @returns {Array} Tableau des éléments du carrousel chargés
     */
    function loadCarouselItems() {
        try {
            const storageKey = CONFIG.storageKeys.accueil || 'franchiniCarousel';
            const savedItems = localStorage.getItem(storageKey);

            if (!savedItems) {
                console.warn('Aucun élément trouvé dans le stockage local pour le carrousel. Utilisation des valeurs par défaut.');
                return setDefaultCarouselItems();
            }

            let parsedItems = JSON.parse(savedItems);

            // Corriger les chemins des médias pour qu'ils fonctionnent
            const itemsWithCorrectedPaths = parsedItems.map(item => {
                if (item.url && !item.url.startsWith('http') && !item.url.startsWith('data:')) {
                    if (item.url.startsWith('/assets')) {
                        return { ...item, url: CONFIG.baseUrl + item.url };
                    }
                    return { ...item, url: `${CONFIG.baseUrl}/assets/images/carousel${item.url.startsWith('/') ? '' : '/'}${item.url}` };
                }
                return item;
            });

            return itemsWithCorrectedPaths.sort((a, b) => a.order - b.order);
        } catch (error) {
            console.error('Erreur lors du chargement des éléments du carrousel depuis le stockage local:', error);
            return setDefaultCarouselItems();
        }
    }

    /**
     * Définit les valeurs par défaut pour le carrousel si rien n'est trouvé
     * @returns {Array} Tableau des éléments par défaut
     */
    function setDefaultCarouselItems() {
        const defaultItems = [
            {
                id: `default-${Date.now()}`,
                type: 'image',
                title: 'Bienvenue chez Franchini',
                description: 'Votre concessionnaire Deutz-Fahr en Drôme.',
                imageUrl: `${CONFIG.baseUrl}/assets/images/hero-bg.jpg`, // Utiliser une image par défaut
                buttonText: 'Découvrir',
                buttonUrl: '#',
                isActive: true,
                order: 0,
                createdAt: new Date().toISOString()
            }
        ];
        // Sauvegarder les valeurs par défaut pour les prochaines visites
        try {
            const storageKey = CONFIG.storageKeys.accueil || 'franchiniCarousel';
            localStorage.setItem(storageKey, JSON.stringify(defaultItems));
        } catch (e) {
            console.error('Erreur lors de la sauvegarde des éléments par défaut:', e);
        }
        return defaultItems;
    }

    /**
     * Rend les slides du carrousel dans le DOM
     * @param {string} containerId - L'ID du conteneur du carrousel (ex: 'home-carousel')
     * @param {Array} items - Les données des slides
     */
    function renderCarouselSlides(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Conteneur de carrousel avec l'ID "${containerId}" non trouvé.`);
            return;
        }

        container.innerHTML = ''; // Vider le conteneur existant
        const fragment = document.createDocumentFragment();

        items.filter(item => item.isActive).forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide'; // Classe attendue par carousel.js

            let mediaHtml = '';
            if (item.type === 'image' && item.imageUrl) {
                mediaHtml = `<img src="${item.imageUrl}" alt="${item.title || ''}">`;
            } else if (item.type === 'video' && item.videoUrl) {
                // Pour les vidéos, on peut intégrer un iframe YouTube ou une balise video
                if (item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be')) {
                    const videoId = item.videoUrl.split('v=')[1] || item.videoUrl.split('/').pop();
                    mediaHtml = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                } else {
                    mediaHtml = `<video src="${item.videoUrl}" autoplay muted loop playsinline></video>`;
                }
            }

            slide.innerHTML = `
                ${mediaHtml}
                <div class="hero-content">
                    <h1>${item.title || ''}</h1>
                    <p>${item.description || ''}</p>
                    ${item.buttonText && item.buttonUrl ? `<a href="${item.buttonUrl}" class="btn">${item.buttonText}</a>` : ''}
                </div>
            `;
            fragment.appendChild(slide);
        });

        container.appendChild(fragment);
    }

    // Initialisation des carrousels sur la page d'accueil
    const homeCarouselItems = loadCarouselItems();
    renderCarouselSlides('home-carousel', homeCarouselItems);

    // Assurez-vous que initCarousel est disponible (il vient de assets/js/carousel.js)
    if (typeof initCarousel === 'function') {
        initCarousel('home-carousel');
    } else {
        console.error('La fonction initCarousel n'est pas disponible. Assurez-vous que assets/js/carousel.js est chargé avant.');
    }
});
