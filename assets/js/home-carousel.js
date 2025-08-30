// Vérifier si le navigateur supporte les modules ES
console.log('Démarrage du chargement du script home-carousel.js');

// Fonction utilitaire pour extraire l'ID d'une vidéo YouTube
function getYouTubeID(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Fonction principale asynchrone
async function initHomeCarousel() {
    console.log('Initialisation du carrousel d\'accueil...');
    
    const carouselSlider = document.querySelector('#home-carousel .carousel-slider');
    if (!carouselSlider) {
        console.error('ERREUR: Élément .carousel-slider non trouvé dans #home-carousel');
        return;
    }

    // Afficher un indicateur de chargement
    carouselSlider.innerHTML = '<div class="loading">Chargement du carrousel en cours...</div>';

    try {
        // Charger dynamiquement Firebase uniquement si nécessaire
        const { db, collection, getDocs, query, orderBy } = await import('./auth/firebase-config.js');
        
        console.log('Connexion à Firestore...');
        const q = query(collection(db, 'carousel'), orderBy('order'));
        const querySnapshot = await getDocs(q);
        
        console.log('Documents reçus:', querySnapshot.size);
        
        if (querySnapshot.empty) {
            console.warn('Aucun document trouvé dans la collection "carousel"');
            carouselSlider.innerHTML = `
                <div class="carousel-slide active" data-type="image">
                    <img src="/assets/images/logo/Logo-Franchini-2.jpg" class="carousel-image" alt="Bienvenue chez Franchini">
                </div>`;
            return;
        }

        // Créer les slides du carrousel
        let slidesHTML = '';
        querySnapshot.forEach((doc, index) => {
            const item = doc.data();
            const isActive = index === 0 ? 'active' : '';
            
            if (item.type === 'youtube') {
                const videoId = getYouTubeID(item.mediaUrl);
                if (videoId) {
                    slidesHTML += `
                        <div class="carousel-slide ${isActive}" data-type="youtube">
                            <div class="video-container">
                                <iframe 
                                    src="https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&enablejsapi=1" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen
                                    loading="lazy"
                                    title="Vidéo ${index + 1}">
                                </iframe>
                            </div>
                        </div>`;
                }
            } else {
                slidesHTML += `
                    <div class="carousel-slide ${isActive}" data-type="image">
                        <img src="${item.mediaUrl}" 
                             class="carousel-image" 
                             alt="${item.title || 'Image du carrousel'}" 
                             loading="lazy"
                             onerror="this.onerror=null;this.src='/assets/images/logo/Logo-Franchini-2.jpg';">
                        ${item.title ? `
                        <div class="carousel-content">
                            <h2>${item.title}</h2>
                            ${item.description ? `<p>${item.description}</p>` : ''}
                        </div>` : ''}
                    </div>`;
            }
        });

        // Mettre à jour le DOM
        carouselSlider.innerHTML = slidesHTML;
        
        // Initialiser le carrousel
        if (window.initCarousel) {
            initCarousel('home-carousel');
            console.log('Carrousel initialisé avec succès');
        } else {
            console.error('ERREUR: La fonction initCarousel n\'est pas disponible');
        }
        
    } catch (error) {
        console.error('ERREUR lors du chargement du carrousel:', error);
        carouselSlider.innerHTML = `
            <div class="error-message">
                <p>Impossible de charger le carrousel. Veuillez réessayer plus tard.</p>
            </div>`;
    }
}

// Démarrer l'initialisation lorsque le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeCarousel);
} else {
    initHomeCarousel();
}
