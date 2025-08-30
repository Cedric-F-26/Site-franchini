import { db, collection, getDocs, query, orderBy } from './auth/firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Chargement du carrousel d\'accueil...');
    const carouselSlider = document.querySelector('#home-carousel .carousel-slider');
    
    if (!carouselSlider) {
        console.error('Élément du carrousel non trouvé');
        return;
    }

    try {
        // Récupérer les éléments du carrousel depuis Firestore
        const q = query(collection(db, 'carousel'), orderBy('order'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            console.log('Aucun élément dans le carrousel');
            carouselSlider.innerHTML = `
                <div class="carousel-slide active" aria-hidden="false">
                    <div class="carousel-content">
                        <h2>Bienvenue chez Franchini</h2>
                        <p>Votre concessionnaire Deutz-Fahr de confiance</p>
                    </div>
                    <div class="carousel-image" style="background-image: url('/assets/images/logo/Logo-Franchini-2.jpg')"></div>
                </div>`;
            return;
        }

        // Créer les slides du carrousel
        let slidesHTML = '';
        querySnapshot.forEach((doc, index) => {
            const item = doc.data();
            const isActive = index === 0 ? 'active' : '';
            const isHidden = index !== 0 ? 'true' : 'false';
            
            let mediaHTML = '';
            if (item.type === 'youtube') {
                const videoId = getYouTubeID(item.mediaUrl);
                mediaHTML = `
                    <div class="video-container">
                        <iframe 
                            src="https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&enablejsapi=1" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>`;
            } else {
                mediaHTML = `<div class="carousel-image" style="background-image: url('${item.mediaUrl}')"></div>`;
            }

            slidesHTML += `
                <div class="carousel-slide ${isActive}" aria-hidden="${isHidden}" data-index="${index}">
                    ${mediaHTML}
                    ${item.title ? `<div class="carousel-content">
                        <h2>${item.title}</h2>
                        ${item.description ? `<p>${item.description}</p>` : ''}
                    </div>` : ''}
                </div>`;
        });

        carouselSlider.innerHTML = slidesHTML;
        
        // Initialiser le carrousel après le chargement du DOM
        if (window.initCarousel) {
            initCarousel('home-carousel');
        } else {
            console.warn('La fonction initCarousel n\'est pas disponible');
        }

    } catch (error) {
        console.error('Erreur lors du chargement du carrousel:', error);
        carouselSlider.innerHTML = `
            <div class="carousel-slide active" aria-hidden="false">
                <div class="carousel-content">
                    <h2>Erreur de chargement</h2>
                    <p>Impossible de charger le carrousel. Veuillez réessayer plus tard.</p>
                </div>
            </div>`;
    }
});

// Fonction utilitaire pour extraire l'ID d'une vidéo YouTube
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
