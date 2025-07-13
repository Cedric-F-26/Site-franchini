document.addEventListener('DOMContentLoaded', function() {
    const CONFIG = window.AppConfig?.config || {
        storageKeys: { accueil: 'franchiniCarousel' },
        baseUrl: ''
    };

    /**
     * Charge les éléments du carrousel depuis le backend
     * @returns {Array} Tableau des éléments du carrousel chargés
     */
    async function loadCarouselItems() {
        try {
            const response = await fetch('http://localhost:3000/api/accueil-carousels'); // URL de votre API backend
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Assurez-vous que les chemins des médias sont corrects si nécessaire
            const itemsWithCorrectedPaths = data.map(item => {
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
            console.error('Erreur lors du chargement des éléments du carrousel depuis le backend:', error);
            return []; // Retourne un tableau vide en cas d'erreur
        }
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
    async function initHomeCarousel() {
        const homeCarouselItems = await loadCarouselItems();
        renderCarouselSlides('home-carousel', homeCarouselItems);

        // Assurez-vous que initCarousel est disponible (il vient de assets/js/carousel.js)
        if (typeof initCarousel === 'function') {
            initCarousel('home-carousel');
        } else {
            console.error('La fonction initCarousel n'est pas disponible. Assurez-vous que assets/js/carousel.js est chargé avant.');
        }
    }

    initHomeCarousel();
