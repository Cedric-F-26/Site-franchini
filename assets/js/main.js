// Gestion du menu mobile et interactions
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.main-header');
    
    // Fonction pour basculer le menu mobile
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
    
    // Gestion du header fixe avec effet de défilement
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
});
