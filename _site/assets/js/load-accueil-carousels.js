// assets/js/load-accueil-carousels.js
import { db } from './auth/firebase-config.js';
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

/**
 * Charge les données depuis Firestore et peuple le carrousel des actualités.
 */
async function loadNewsCarousel() {
    // Cible le conteneur spécifique où les slides doivent être injectées
    const newsSlider = document.querySelector('#news-carousel .carousel-slider');

    // S'assure que le conteneur existe avant de continuer
    if (!newsSlider) {
        console.error('Le conteneur du carrousel d\'actualités (#news-carousel .carousel-slider) est introuvable.');
        return;
    }

    try {
        // Crée une requête pour récupérer les 5 dernières actualités, triées par date
        const q = query(collection(db, 'Actualités'), orderBy('date', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            newsSlider.innerHTML = '<p>Aucune actualité à afficher pour le moment.</p>';
            return;
        }

        // Construit le HTML pour chaque actualité
        const slidesHtml = querySnapshot.docs.map(doc => {
            const item = doc.data();
            let mediaHtml = '';

            // Gère l'affichage de l'image ou de la vidéo YouTube
            if (item.type === 'image' && item.mediaUrl) {
                mediaHtml = `<img src="${item.mediaUrl}" alt="${item.titre}" class="carousel-item-image">`;
            } else if (item.type === 'video' && item.mediaUrl) {
                const videoIdMatch = item.mediaUrl.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
                if (videoIdMatch && videoIdMatch[1]) {
                    mediaHtml = `<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${videoIdMatch[1]}" allowfullscreen></iframe></div>`;
                }
            }

            // Retourne la structure HTML complète pour un slide
            return `
                <div class="carousel-item">
                    ${mediaHtml}
                    <div class="carousel-caption">
                        <h3>${item.titre}</h3>
                        <p>${item.contenu.substring(0, 100)}...</p>
                    </div>
                </div>
            `;
        }).join('');

        // Injecte les slides dans le carrousel
        newsSlider.innerHTML = slidesHtml;

        // Appelle la fonction d'initialisation globale du carrousel (présente dans vos autres scripts)
        if (typeof initCarousel === 'function') {
            initCarousel('news-carousel');
        } else {
            console.error('La fonction initCarousel() n\'est pas disponible.');
        }

    } catch (error) {
        console.error("Erreur lors du chargement des actualités pour le carrousel :", error);
        newsSlider.innerHTML = '<p>Impossible de charger les actualités. Veuillez vérifier la console pour les erreurs.</p>';
    }
}

// Lance le chargement une fois que le DOM est prêt
document.addEventListener('DOMContentLoaded', loadNewsCarousel);