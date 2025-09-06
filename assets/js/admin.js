import { auth } from './auth/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- AUTHENTIFICATION ---
    const adminContent = document.getElementById('admin-content');
    const loginContainer = document.getElementById('login-container');

    onAuthStateChanged(auth, user => {
        if (user) {
            if (adminContent) adminContent.style.display = 'block';
            if (loginContainer) loginContainer.style.display = 'none';
        } else {
            if (adminContent) adminContent.style.display = 'none';
            if (loginContainer) loginContainer.style.display = 'block';
        }
    });

    

    // --- GESTION DES ONGLETS ---
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Ignorer les liens externes (comme Utilisateurs)
            if (tab.tagName === 'A' && tab.hasAttribute('href')) {
                return; // Laisser le comportement par défaut
            }

            const target = document.getElementById(tab.dataset.tab);

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(tc => tc.classList.remove('active'));
            if(target) target.classList.add('active');
        });
    });

    // --- GESTION DU CARROUSEL D'ACCUEIL (désactivé, remplacé par admin/carousel.js) ---
    const addMediaBtn = document.getElementById('add-media-btn');
    const mediaTypeSelect = document.getElementById('media-type-select');
    const imageUploadSection = document.getElementById('image-section');
    const youtubeSection = document.getElementById('youtube-section'); 
    const mediaUploadInput = document.getElementById('media-upload');
    const youtubeUrlInput = document.getElementById('youtube-url');
    const mediaTitleInput = document.getElementById('media-title');
    const carouselItemsList = document.getElementById('carousel-items-list');

    if (mediaTypeSelect) {
        mediaTypeSelect.addEventListener('change', () => {
            const isImage = mediaTypeSelect.value === 'image';
            imageUploadSection.style.display = isImage ? 'block' : 'none';
            youtubeSection.style.display = isImage ? 'none' : 'block';
        });
    }

    

    
// Initialisation des autres composants
    
    /* disabled legacy carousel list
if (false && carouselItemsList) {
        loadCarouselItems();

        carouselItemsList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-carousel-item')) {
                const button = e.target;
                if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
                    try {
                        const id = button.dataset.id;
                        const type = button.dataset.type;
                        const url = button.dataset.url;

                        await deleteDoc(doc(db, 'carousel', id));

                        if (type === 'image' && url) {
                            const imageRef = ref(storage, url);
                            await deleteObject(imageRef);
                        }

                        alert('Élément supprimé avec succès.');
                        loadCarouselItems();
                    } catch (error) {
                        console.error('Erreur lors de la suppression :', error);
                        alert('Une erreur est survenue lors de la suppression.');
                    }
                }
            }
        });
    }
*/
});