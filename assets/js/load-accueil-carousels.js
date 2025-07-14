document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.getElementById('home-carousel');
    if (!carouselContainer) return; // Ne rien faire si le carrousel n'est pas sur la page

    // Attend que Firebase soit chargé par le script module
    const waitForFirebase = setInterval(async () => {
        if (window.firebase && window.firebase.db) {
            clearInterval(waitForFirebase);
            const { db, collection, query, orderBy, getDocs } = window.firebase;

            try {
                const q = query(collection(db, 'carousel'), orderBy('order'));
                const snapshot = await getDocs(q);
                const items = snapshot.docs.map(doc => doc.data());
                
                if (items.length > 0) {
                    renderCarouselSlides(items);
                    initCarouselLogic();
                } else {
                    carouselContainer.innerHTML = '<p>Aucun élément à afficher dans le carrousel.</p>';
                }
            } catch (error) {
                console.error("Erreur de chargement du carrousel depuis Firebase: ", error);
                carouselContainer.innerHTML = '<p>Erreur de chargement du carrousel.</p>';
            }
        }
    }, 100); // Vérifie toutes les 100ms

    function getYouTubeEmbedUrl(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const videoId = (url.match(regex) || [])[1] || null;
        if (!videoId) return null;
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&autohide=1&modestbranding=1&iv_load_policy=3`;
    }

    function renderCarouselSlides(items) {
        carouselContainer.innerHTML = ''; // Vider le conteneur
        const fragment = document.createDocumentFragment();

        items.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';

            let mediaHtml = '';
            if (item.type === 'image' && item.mediaUrl) {
                mediaHtml = `<img src="${item.mediaUrl}" alt="${item.title || ''}" class="carousel-media">`;
            } else if (item.type === 'youtube' && item.mediaUrl) {
                const embedUrl = getYouTubeEmbedUrl(item.mediaUrl);
                if (embedUrl) {
                    mediaHtml = `<iframe src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="carousel-media"></iframe>`;
                }
            }

            slide.innerHTML = `
                ${mediaHtml}
                <div class="hero-content">
                    <h1>${item.title || ''}</h1>
                </div>
            `;
            fragment.appendChild(slide);
        });

        carouselContainer.appendChild(fragment);
    }

    function initCarouselLogic() {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        if (slides.length <= 1) return;

        const prevBtn = document.querySelector('.carousel-control.prev');
        const nextBtn = document.querySelector('.carousel-control.next');
        let currentIndex = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            currentIndex = index;
        }

        function nextSlide() {
            const newIndex = (currentIndex + 1) % slides.length;
            showSlide(newIndex);
        }

        function prevSlide() {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(newIndex);
        }

        function startAutoplay() {
            stopAutoplay();
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoplay() {
            clearInterval(slideInterval);
        }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAutoplay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAutoplay(); });

        carouselContainer.addEventListener('mouseenter', stopAutoplay);
        carouselContainer.addEventListener('mouseleave', startAutoplay);

        if (slides.length > 0) {
            showSlide(0);
            startAutoplay();
        }
    }
});
