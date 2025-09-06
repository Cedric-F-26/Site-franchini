import { db, collection, getDocs, query, orderBy } from './auth/firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const homeCarouselSection = document.getElementById('home-carousel-section');
    if (!homeCarouselSection) {
        console.error('ERREUR: Élément #home-carousel-section non trouvé');
        return;
    }

    // Add Swiper classes
    homeCarouselSection.classList.add('swiper');
    const homeCarouselWrapper = document.getElementById('home-carousel');
    homeCarouselWrapper.classList.add('swiper-wrapper');

    // Add navigation and pagination elements
    homeCarouselSection.innerHTML += `
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
    `;

    try {
        const q = query(collection(db, 'carousel'), orderBy('order'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn('Aucun document trouvé dans la collection "carousel"');
            homeCarouselWrapper.innerHTML = `
                <div class="swiper-slide">
                    <img src="/assets/images/logo/Logo-Franchini-2.jpg" alt="Bienvenue chez Franchini" style="width:100%; height:100%; object-fit:cover;">
                    <div class="swiper-caption">
                        <h2>Bienvenue chez Franchini</h2>
                        <p>Votre partenaire de confiance pour le matériel agricole.</p>
                    </div>
                </div>
            `;
        } else {
            let slidesHTML = '';
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                if (item.type === 'youtube' && item.mediaUrl) {
                    const videoId = getYouTubeID(item.mediaUrl);
                    if (videoId) {
                        slidesHTML += `
                            <div class="swiper-slide">
                                <div class="video-container">
                                    <iframe src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&rel=0&autoplay=0&mute=1"
                                            frameborder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowfullscreen></iframe>
                                </div>
                                <div class="swiper-caption">
                                    <h2>${item.title || 'Vidéo YouTube'}</h2>
                                </div>
                            </div>
                        `;
                    }
                } else if (item.type === 'image' && item.mediaUrl) {
                    slidesHTML += `
                        <div class="swiper-slide">
                            <img src="${item.mediaUrl}" alt="${item.title || ''}" style="width:100%; height:100%; object-fit:cover;">
                            <div class="swiper-caption">
                                <h2>${item.title || 'Image'}</h2>
                            </div>
                        </div>
                    `;
                }
            });
            homeCarouselWrapper.innerHTML = slidesHTML;
        }

        // Initialize Swiper
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
                    // Pause all YouTube videos when slide changes
                    document.querySelectorAll('.swiper-slide iframe').forEach(iframe => {
                        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    });

                    // Play video on active slide if it's a YouTube video
                    const activeSlide = this.slides[this.activeIndex];
                    const activeIframe = activeSlide.querySelector('iframe');
                    if (activeIframe) {
                        activeIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    }
                },
                init: function() {
                    // Play video on initial active slide if it's a YouTube video
                    const initialActiveSlide = this.slides[this.activeIndex];
                    const initialActiveIframe = initialActiveSlide.querySelector('iframe');
                    if (initialActiveIframe) {
                        initialActiveIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    }
                }
            }
        });

    } catch (error) {
        console.error('Erreur lors du chargement ou de l\'initialisation du carrousel:', error);
        homeCarouselWrapper.innerHTML = `
            <div class="swiper-slide">
                <img src="/assets/images/logo/Logo-Franchini-2.jpg" alt="Erreur de chargement" style="width:100%; height:100%; object-fit:cover;">
                <div class="swiper-caption">
                    <h2>Erreur de chargement</h2>
                    <p>Impossible de charger le carrousel. Veuillez réessayer plus tard.</p>
                </div>
            </div>
        `;
    }
});

function getYouTubeID(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
