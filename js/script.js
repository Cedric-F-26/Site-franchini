// Navigation fluide vers les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Compenser la hauteur du header fixe
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Fermer le menu mobile s'il est ouvert
            const nav = document.querySelector('nav');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        }
    });
});

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
        console.log('Formulaire soumis :', formObject);
        
        // Message de confirmation
        alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
        this.reset();
    });
}

// Header fixe avec effet de défilement
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Masquer/afficher le header au scroll
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Défilement vers le bas
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Défilement vers le haut
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Menu mobile
const menuToggle = document.createElement('button');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '<span></span><span></span><span></span>';
menuToggle.setAttribute('aria-label', 'Menu');

document.querySelector('header .container').appendChild(menuToggle);

menuToggle.addEventListener('click', function() {
    document.querySelector('nav').classList.toggle('active');
    this.classList.toggle('active');
});

// Animation au chargement de la page
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Chargement paresseux des images
const lazyImages = document.querySelectorAll('img[data-src]');
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

// YouTube Carousel
let players = [];
const videoIds = ['j_EeGikCEt8', 'H3gApB9cgoo'];
let currentSlide = 0;

function onYouTubeIframeAPIReady() {
    for (let i = 0; i < videoIds.length; i++) {
        players[i] = new YT.Player('player' + (i + 1), {
            height: '100%',
            width: '100%',
            videoId: videoIds[i],
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'showinfo': 0,
                'rel': 0,
                'loop': 1,
                'mute': 1,
                'playlist': videoIds[i] // Important for looping
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        nextSlide();
    }
}

const carouselContainer = document.querySelector('.carousel-container');
const slides = document.querySelectorAll('.carousel-slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

function goToSlide(slideIndex) {
    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    } else if (slideIndex >= slides.length) {
        slideIndex = 0;
    }

    carouselContainer.style.transform = 'translateX(' + (-slideIndex * (100 / slides.length)) + '%);
    
    // Pause all players except the current one
    for (let i = 0; i < players.length; i++) {
        if (i !== slideIndex) {
            if (players[i] && typeof players[i].pauseVideo === 'function') {
                players[i].pauseVideo();
            }
        }
    }
    
    // Play the current video
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

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Initial setup
goToSlide(0);