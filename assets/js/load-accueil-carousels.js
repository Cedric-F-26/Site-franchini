document.addEventListener('DOMContentLoaded', function() {

    const renderCarouselSlides = (sliderContainer, items) => {
        sliderContainer.innerHTML = items.map((item, index) => {
            const isActive = index === 0 ? 'active' : '';
            let mediaHtml = '';

            if (item.type === 'youtube' && item.mediaUrl) {
                const videoIdMatch = item.mediaUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                const videoId = videoIdMatch ? videoIdMatch[1] : null;
                if (videoId) {
                    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&autohide=1`;
                    mediaHtml = `<iframe class="carousel-media" src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
                }
            } else if (item.imageUrl) {
                mediaHtml = `<img src="${item.imageUrl}" class="carousel-media" alt="${item.title || 'Image du carrousel'}">`;
            }

            // Si aucun média n'est disponible, le contenu textuel sera quand même affiché.
            return `
                <div class="carousel-slide ${isActive}">
                    ${mediaHtml}
                    <div class="hero-content">
                        ${item.title ? `<h2>${item.title}</h2>` : ''}
                        ${item.contenu ? `<p>${item.contenu}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    };

    const initCarouselLogic = (carouselElement) => {
        const slides = carouselElement.querySelectorAll('.carousel-slide');
        const prevBtn = carouselElement.querySelector('.carousel-control.prev');
        const nextBtn = carouselElement.querySelector('.carousel-control.next');
        const dotsContainer = carouselElement.querySelector('.carousel-dots');

        if (slides.length <= 1) {
            if(prevBtn) prevBtn.style.display = 'none';
            if(nextBtn) nextBtn.style.display = 'none';
            if(dotsContainer) dotsContainer.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        let slideInterval;

        // Créer les points de navigation
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Aller à la diapositive ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    showSlide(i);
                    stopAutoplay();
                });
                dotsContainer.appendChild(dot);
            });
        }
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            if (dots.length > 0) {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
            currentIndex = index;
        };

        const nextSlide = () => showSlide((currentIndex + 1) % slides.length);
        const prevSlide = () => showSlide((currentIndex - 1 + slides.length) % slides.length);

        const startAutoplay = () => {
            stopAutoplay();
            slideInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoplay = () => clearInterval(slideInterval);

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAutoplay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAutoplay(); });

        carouselElement.addEventListener('mouseenter', stopAutoplay);
        carouselElement.addEventListener('mouseleave', startAutoplay);

        showSlide(0);
        startAutoplay();
    };

    const loadCarouselData = async (collectionName, carouselId) => {
        const carouselElement = document.getElementById(carouselId);
        if (!carouselElement) {
            console.error(`Carousel element with ID #${carouselId} not found.`);
            return;
        }

        const sliderContainer = carouselElement.querySelector('.carousel-slider');
        if (!sliderContainer) {
            console.error(`Container .carousel-slider not found for #${carouselId}`);
            carouselElement.innerHTML = `<p style="color: red; padding: 2rem; text-align: center;">Erreur: Structure HTML incorrecte.</p>`;
            return;
        }

        const { collection, query, orderBy, getDocs } = window.firebase;
        const db = window.firebase.db;

        try {
            const q = query(collection(db, collectionName), orderBy('order'));
            const snapshot = await getDocs(q);
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (items.length > 0) {
                renderCarouselSlides(sliderContainer, items);
                initCarouselLogic(carouselElement);
            } else {
                carouselElement.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: black;">Aucun élément à afficher.</div>`;
            }
        } catch (error) {
            console.error(`Erreur de chargement pour ${collectionName}: `, error);
            carouselElement.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: red;">Erreur de chargement.</div>`;
        }
    };

    const waitForFirebase = setInterval(() => {
        if (window.firebase && window.firebase.db) {
            clearInterval(waitForFirebase);
            loadCarouselData('carousel', 'home-carousel');
            loadCarouselData('Actualités', 'news-carousel');
            loadCarouselData('occasions', 'occasions-carousel');
        }
    }, 100);
});
