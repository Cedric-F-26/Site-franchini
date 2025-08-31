/**
 * Point d'entrée principal de l'application
 * Initialise les composants communs et gère le chargement des ressources
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialisée');
    
    // Initialisation des composants communs
    initNavigation();
    initMobileMenu();
    initBackToTop();
    initLazyLoading();
    
    // Initialisation des composants spécifiques aux pages
    initPageComponents();
});

/**
 * Initialise la navigation principale
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
        
        // Amélioration de l'accessibilité
        link.setAttribute('tabindex', '0');
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });
}

/**
 * Initialise le menu mobile
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
    
    // Fermer le menu lors du clic sur un lien
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 767) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Ajouter le bouton de menu mobile s'il n'existe pas déjà
    if (window.innerWidth <= 767 && !menuToggle) {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'mobile-menu-toggle';
        toggleButton.setAttribute('aria-label', 'Menu');
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // Insérer le bouton avant la navigation
        if (mainNav) {
            mainNav.parentNode.insertBefore(toggleButton, mainNav);
            
            // Gestion du clic sur le bouton du menu
            toggleButton.addEventListener('click', function(e) {
                e.preventDefault();
                toggleMobileMenu();
                this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
            });
        }
    }
    
    function toggleMobileMenu() {
        if (menuToggle && mainNav) {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Empêcher le défilement du corps lorsque le menu est ouvert
            if (document.body.classList.contains('menu-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }
}

/**
 * Initialise le bouton de retour en haut de page
 */
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Retour en haut de la page');
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialise le chargement paresseux des images
 */
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback pour les navigateurs qui ne supportent pas loading="lazy"
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/17.3.0/lazyload.min.js';
        document.body.appendChild(script);
        
        script.onload = () => {
            const lazyLoadInstance = new LazyLoad({
                elements_selector: '.lazy'
            });
        };
    }
}

/**
 * Initialise les composants spécifiques aux pages
 */
function initPageComponents() {
    const page = document.body.dataset.page;
    
    if (!page) return;
    
    switch (page) {
        case 'home':
            initHomePage();
            break;
        case 'contact':
            initContactPage();
            break;
        case 'admin':
            initAdminPage();
            break;
        // Ajouter d'autres cas selon les besoins
    }
}

// Fonctions d'initialisation des pages
function initHomePage() {
    // Initialisation spécifique à la page d'accueil
    console.log('Initialisation de la page d\'accueil');
}

function initContactPage() {
    // Initialisation spécifique à la page de contact
    console.log('Initialisation de la page de contact');
}

function initAdminPage() {
    // Initialisation spécifique à la page d'administration
    console.log('Initialisation de la page d\'administration');
}

// Gestion des erreurs non capturées
window.addEventListener('error', (event) => {
    console.error('Erreur non capturée :', event.error);
    
    // Afficher un message d'erreur convivial si nécessaire
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.innerHTML = `
            <div class="error-message">
                <h3>Oups ! Une erreur est survenue</h3>
                <p>Veuillez actualiser la page ou réessayer plus tard.</p>
                <button onclick="location.reload()">Actualiser la page</button>
            </div>
        `;
        errorContainer.style.display = 'block';
    }
    
    // Empêcher la propagation de l'événement
    event.preventDefault();
    return false;
});

// Exporter les fonctions si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initMobileMenu,
        initBackToTop,
        initLazyLoading,
        initPageComponents
    };
}

// Gestion du header fixe avec effet de défilement
const header = document.querySelector('.main-header');
if (header) {
    const headerHeight = header.offsetHeight;
    let lastScroll = 0;
    
    // Ajouter un padding au body pour compenser le header fixe
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    document.body.style.paddingTop = `${headerHeight}px`;
    
    // Fonction de gestion du défilement
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Ajouter/supprimer la classe scrolled pour le style du header
        if (currentScroll > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Masquer/afficher le header au défilement (sur mobile uniquement)
        if (window.innerWidth <= 767) {
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
        }
    }
    
    // Ajouter l'écouteur d'événement de défilement
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Appeler une première fois pour définir l'état initial
    handleScroll();
}

// Animation au chargement de la page
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('visible');
        }
    });
};

// Fermer le menu en cliquant sur un lien (pour mobile)
const navLinks = document.querySelectorAll('.main-nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 767) {
            toggleMobileMenu();
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Gestion du redimensionnement de la fenêtre
function handleResize() {
    // Afficher/masquer le bouton du menu en fonction de la largeur de l'écran
    if (window.innerWidth > 767) {
        // Sur les grands écrans, réinitialiser les états du menu
        if (menuToggle) {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        if (mainNav) {
            mainNav.classList.remove('active');
            mainNav.style.display = '';
        }
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
    } else {
        // Sur mobile, s'assurer que le bouton est visible
        if (menuToggle) {
            menuToggle.style.display = 'flex';
        }
        // Cacher le menu s'il n'est pas actif
        if (mainNav && !mainNav.classList.contains('active')) {
            mainNav.style.display = 'none';
        }
    }
    
    // Mettre à jour la hauteur du header
    if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
        document.body.style.paddingTop = `${headerHeight}px`;
    }
}

// Événements
window.addEventListener('scroll', animateOnScroll, { passive: true });
window.addEventListener('resize', handleResize, { passive: true });

// Initialisation
animateOnScroll();
handleResize();

// Ajouter la classe loaded au body une fois que tout est chargé
document.body.classList.add('loaded');
