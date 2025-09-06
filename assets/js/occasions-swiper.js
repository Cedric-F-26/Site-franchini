import { db, collection, getDocs, query, orderBy } from './auth/firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('occasions-swiper.js: DOMContentLoaded event fired.');
    const occasionsCarouselElement = document.getElementById('occasions-carousel');
    if (!occasionsCarouselElement) {
        console.error('occasions-swiper.js: ERREUR: Élément #occasions-carousel non trouvé');
        return;
    }
    console.log('occasions-swiper.js: #occasions-carousel found.');

    // Add Swiper classes
    occasionsCarouselElement.classList.add('swiper');
    const occasionsCarouselWrapper = occasionsCarouselElement.querySelector('.swiper-wrapper');
    console.log('occasions-swiper.js: Swiper classes added to elements.');

    // Add navigation and pagination elements
    occasionsCarouselElement.innerHTML += `
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
    `;
    console.log('occasions-swiper.js: Swiper navigation and pagination elements added.');

    try {
        console.log('occasions-swiper.js: Attempting to fetch occasions data from Firestore...');
        const q = query(collection(db, 'occasions'), orderBy('order')); // Assuming 'occasions' collection
        const querySnapshot = await getDocs(q);
        console.log('occasions-swiper.js: Firestore query executed. Number of documents:', querySnapshot.size);

        if (querySnapshot.empty) {
            console.warn('occasions-swiper.js: Aucun document trouvé dans la collection "occasions"');
            occasionsCarouselWrapper.innerHTML = `
                <div class="swiper-slide">
                    <img src="/assets/images/placeholder-occasion.jpg" alt="Aucune occasion disponible" style="width:100%; height:100%; object-fit:cover;">
                    <div class="swiper-caption">
                        <h2>Aucune occasion disponible</h2>
                        <p>Revenez plus tard pour découvrir nos nouvelles offres.</p>
                    </div>
                </div>
            `;
            console.log('occasions-swiper.js: Default slide added due to empty collection.');
        } else {
            let slidesHTML = '';
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                console.log('occasions-swiper.js: Processing occasion item:', item);
                // Assuming 'occasions' items have 'imageUrl', 'title', 'description', 'price'
                slidesHTML += `
                    <div class="swiper-slide">
                        <img src="${item.imageUrl}" alt="${item.title || ''}" style="width:100%; height:100%; object-fit:cover;">
                        <div class="swiper-caption">
                            <h2>${item.title || ''}</h2>
                            <p>${item.description || ''}</p>
                            <p class="price">${item.price || ''} €</p>
                        </div>
                    </div>
                `;
            });
            occasionsCarouselWrapper.innerHTML = slidesHTML;
            console.log('occasions-swiper.js: Slides HTML populated.');
        }

        // Initialize Swiper for occasions
        console.log('occasions-swiper.js: Initializing Swiper for occasions...');
        const swiper = new Swiper(occasionsCarouselElement, {
            loop: true,
            autoplay: {
                delay: 7000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
        console.log('occasions-swiper.js: Swiper initialization complete for occasions.');

    } catch (error) {
        console.error('occasions-swiper.js: Erreur lors du chargement ou de l\'initialisation du carrousel des occasions:', error);
        occasionsCarouselWrapper.innerHTML = `
            <div class="swiper-slide">
                <img src="/assets/images/placeholder-occasion.jpg" alt="Erreur de chargement" style="width:100%; height:100%; object-fit:cover;">
                <div class="swiper-caption">
                    <h2>Erreur de chargement</h2>
                    <p>Impossible de charger les occasions. Veuillez réessayer plus tard.</p>
                </div>
            </div>
        `;
        console.log('occasions-swiper.js: Error fallback content added.');
    }
});
