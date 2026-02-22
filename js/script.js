// Navigation fluide vers les ancres
(function() {
    'use strict';

    const anchors = document.querySelectorAll('a[href^="#"]');
    if (anchors && anchors.length) {
        anchors.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;

                if (targetElement) {
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Fermer le menu mobile s'il est ouvert
                    const nav = document.querySelector('nav');
                    if (nav && nav.classList.contains('active')) {
                        nav.classList.remove('active');
                    }
                }
            });
        });
    }

    // Gestion du formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Récupérer les valeurs du formulaire
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Ici, vous pourriez ajouter le code pour envoyer les données à un serveur
            // console.log('Formulaire soumis :', formObject);

            // Message de confirmation (à remplacer par un feedback non intrusif en production)
            alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
            this.reset();
        });
    }

    // Header fixe avec effet de défilement
    let lastScroll = 0;
    const headerEl = document.querySelector('header');
    if (headerEl) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Masquer/afficher le header au scroll
            if (currentScroll <= 0) {
                headerEl.classList.remove('scroll-up');
                return;
            }

            if (currentScroll > lastScroll && !headerEl.classList.contains('scroll-down')) {
                // Défilement vers le bas
                headerEl.classList.remove('scroll-up');
                headerEl.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && headerEl.classList.contains('scroll-down')) {
                // Défilement vers le haut
                headerEl.classList.remove('scroll-down');
                headerEl.classList.add('scroll-up');
            }

            lastScroll = currentScroll;
        });
    }

    // Menu mobile (éviter duplication si le bouton existe déjà)
    if (!document.querySelector('.menu-toggle')) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<span></span><span></span><span></span>';
        menuToggle.setAttribute('aria-label', 'Menu');
        menuToggle.setAttribute('aria-expanded', 'false');

        const headerContainer = document.querySelector('header .container');
        if (headerContainer) {
            headerContainer.appendChild(menuToggle);

            menuToggle.addEventListener('click', function() {
                const nav = document.querySelector('nav');
                if (!nav) return;

                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', String(!expanded));
                nav.classList.toggle('active');
                this.classList.toggle('active');
            });
        }
    }

    // Animation au chargement de la page
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Chargement paresseux des images (si IntersectionObserver supporté)
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window && lazyImages && lazyImages.length) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    } else if (lazyImages && lazyImages.length) {
        // Fallback: charger toutes les images immédiatement
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    // YouTube Carousel - création des players uniquement quand l'API est prête
    let players = [];
    const videoIds = ['j_EeGikCEt8', 'H3gApB9cgoo'];
    let currentSlide = 0;

    // Référence aux éléments du carousel
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    function goToSlide(slideIndex) {
        if (!carouselContainer || !slides || slides.length === 0) return;

        if (typeof slideIndex !== 'number') slideIndex = 0;

        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        } else if (slideIndex >= slides.length) {
            slideIndex = 0;
        }

        // Calculer translation en pourcentage
        const translatePercent = (-slideIndex * (100 / slides.length));
        carouselContainer.style.transform = 'translateX(' + translatePercent + '%)';

        // Pause all players except the current one
        for (let i = 0; i < players.length; i++) {
            if (i !== slideIndex) {
                if (players[i] && typeof players[i].pauseVideo === 'function') {
                    players[i].pauseVideo();
                }
            }
        }

        // Play the current video (si player prêt)
        if (players[slideIndex] && typeof players[slideIndex].playVideo === 'function') {
            players[slideIndex].playVideo();
        }

        currentSlide = slideIndex;
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Déclarer la fonction globale attendue par l'API YouTube
    window.onYouTubeIframeAPIReady = function() {
        // Créer les players uniquement si les conteneurs existent
        for (let i = 0; i < videoIds.length; i++) {
            const playerContainer = document.getElementById('player' + (i + 1));
            if (!playerContainer) continue;

            players[i] = new YT.Player('player' + (i + 1), {
                height: '100%',
                width: '100%',
                videoId: videoIds[i],
                playerVars: {
                    'autoplay': 1,
                    'controls': 0,
                    'rel': 0,
                    'loop': 1,
                    'mute': 1,
                    'playlist': videoIds[i]
                },
                events: {
                    'onReady': function(event) {
                        // Ne pas forcer le play si ce n'est pas le slide courant
                        if (i === currentSlide) {
                            try { event.target.playVideo(); } catch (e) { /* ignore */ }
                        }
                    },
                    'onStateChange': function(event) {
                        if (event.data === YT.PlayerState.ENDED) {
                            nextSlide();
                        }
                    }
                }
            });
        }

        // Initial setup après création des players
        goToSlide(0);
    };

    // Si l'API YouTube n'est pas chargée et qu'il n'y a pas de players, on appelle goToSlide défensivement
    if (!window.YT) {
        // goToSlide(0) sera appelé depuis onYouTubeIframeAPIReady une fois l'API chargée
        if (carouselContainer && slides && slides.length) {
            // Positionner le carousel sans vidéo
            const translatePercent = (-0 * (100 / slides.length));
            carouselContainer.style.transform = 'translateX(' + translatePercent + '%)';
        }
    }

})();