import { db, collection, getDocs, query, orderBy } from './auth/firebase-config.js';

import { db, collection, getDocs, query, orderBy } from './auth/firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('main-carousel.js: DOMContentLoaded event fired.');
    const homeCarouselSection = document.getElementById('home-carousel-section');
    if (!homeCarouselSection) {
        console.error('main-carousel.js: ERREUR: Élément #home-carousel-section non trouvé');
        return;
    }
    console.log('main-carousel.js: #home-carousel-section found.');

    // Add Swiper classes
    homeCarouselSection.classList.add('swiper');
    const homeCarouselWrapper = document.getElementById('home-carousel');
    homeCarouselWrapper.classList.add('swiper-wrapper');
    console.log('main-carousel.js: Swiper classes added to elements.');

    // Add navigation and pagination elements
    homeCarouselSection.innerHTML += `
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
    `;
    console.log('main-carousel.js: Swiper navigation and pagination elements added.');

    try {
        console.log('main-carousel.js: Attempting to fetch carousel data from Firestore...');
        const q = query(collection(db, 'carousel'), orderBy('order'));
        const querySnapshot = await getDocs(q);
        console.log('main-carousel.js: Firestore query executed. Number of documents:', querySnapshot.size);

        if (querySnapshot.empty) {
            console.warn('main-carousel.js: Aucun document trouvé dans la collection "carousel"');
            homeCarouselWrapper.innerHTML = "
                <div class=\"swiper-slide\">
                    <img src=\"/assets/images/logo/Logo-Franchini-2.jpg\" alt=\"Bienvenue chez Franchini\" style=\"width:100%; height:100%; object-fit:cover;\">
                    <div class=\"swiper-caption\">
                        <h2>Bienvenue chez Franchini</h2>
                        <p>Votre partenaire de confiance pour le matériel agricole.</p>
                    </div>
                </div>
            ";
            console.log('main-carousel.js: Default slide added due to empty collection.');
        } else {
            let slidesHTML = '';
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                console.log('main-carousel.js: Processing carousel item:', item);
                if (item.type === 'youtube' && item.mediaUrl) {
                    const videoId = getYouTubeID(item.mediaUrl);
                    if (videoId) {
                        slidesHTML += "
                            <div class=\"swiper-slide\">
                                <div class=\"video-container\">
                                    <iframe src=\"https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&rel=0&autoplay=0&mute=1\"
                                            frameborder=\"0\"
                                            allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\"
                                            allowfullscreen></iframe>
                                </div>
                                <div class=\"swiper-caption\">
                                    <h2>${item.title || 'Vidéo YouTube'}</h2>
                                </div>
                            </div>
                        ";
                    } else {
                        console.warn('main-carousel.js: Invalid YouTube URL for item:', item);
                    }
                } else if (item.type === 'image' && item.mediaUrl) {
                    slidesHTML += "
                        <div class=\"swiper-slide\">
                            <img src=\"${item.mediaUrl}\" alt=\"${item.title || ''}\" style=\"width:100%; height:100%; object-fit:cover;\">
                            <div class=\"swiper-caption\">
                                <h2>${item.title || 'Image'}</h2>
                            </div>
                        </div>
                    ";
                } else {
                    console.warn('main-carousel.js: Invalid item type or missing mediaUrl for item:', item);
                }
            });
            homeCarouselWrapper.innerHTML = slidesHTML;
            console.log('main-carousel.js: Slides HTML populated.');
        }

        // Initialize Swiper
        console.log('main-carousel.js: Initializing Swiper...');
        const swiper = new Swiper(homeCarouselSection, {
            loop: true,
            autoplay: {
                delay: 5000,
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
            on: {
                slideChangeTransitionEnd: function () {
                    console.log('main-carousel.js: Swiper slide change detected.');
                    // Pause all YouTube videos when slide changes
                    document.querySelectorAll('.swiper-slide iframe').forEach(iframe => {
                        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    });

                    // Play video on active slide if it's a YouTube video
                    const activeSlide = this.slides[this.activeIndex];
                    const activeIframe = activeSlide.querySelector('iframe');
                    if (activeIframe) {
                        console.log('main-carousel.js: Playing video on active slide.');
                        activeIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    }
                },
                init: function() {
                    console.log('main-carousel.js: Swiper initialized.');
                    // Play video on initial active slide if it's a YouTube video
                    const initialActiveSlide = this.slides[this.activeIndex];
                    const initialActiveIframe = initialActiveSlide.querySelector('iframe');
                    if (initialActiveIframe) {
                        console.log('main-carousel.js: Playing video on initial active slide.');
                        initialActiveIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    }
                }
            }
        });
        console.log('main-carousel.js: Swiper initialization complete.');

    } catch (error) {
        console.error('main-carousel.js: Erreur lors du chargement ou de l\'initialisation du carrousel:', error);
        homeCarouselWrapper.innerHTML = "
            <div class=\"swiper-slide\">
                <img src=\"/assets/images/logo/Logo-Franchini-2.jpg\" alt=\"Erreur de chargement\" style=\"width:100%; height:100%; object-fit:cover;\">
                <div class=\"swiper-caption\">
                    <h2>Erreur de chargement</h2>
                    <p>Impossible de charger le carrousel. Veuillez réessayer plus tard.</p>
                </div>
            </div>
        ";
        console.log('main-carousel.js: Error fallback content added.');
    }
});


function getYouTubeID(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
