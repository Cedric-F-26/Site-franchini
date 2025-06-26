// Gestion du menu mobile et interactions
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.main-header');
    
    // Créer le bouton du menu mobile s'il n'existe pas
    if (window.innerWidth <= 768 && !menuToggle) {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'mobile-menu-toggle';
        toggleButton.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // Insérer le bouton avant la navigation
        if (mainNav) {
            mainNav.parentNode.insertBefore(toggleButton, mainNav);
        }
        
        // Gestion du clic sur le bouton du menu
        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            if (mainNav) {
                mainNav.classList.toggle('active');
            }
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Gestion du header fixe avec effet de défilement
    if (header) {
        let lastScroll = 0;
        const headerHeight = header.offsetHeight;
        
        // Ajouter un padding au body pour compenser le header fixe
        document.body.style.paddingTop = headerHeight + 'px';
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Ajouter/supprimer la classe scrolled pour le style du header
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Masquer/afficher le header au défilement (sur mobile uniquement)
            if (window.innerWidth <= 768) {
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
        });
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
    
    // Fermer le menu en cliquant sur un lien
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                const menuToggle = document.querySelector('.mobile-menu-toggle');
                const mainNav = document.querySelector('.main-nav');
                if (menuToggle) menuToggle.classList.remove('active');
                if (mainNav) mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Gestion du redimensionnement de la fenêtre
    const handleResize = () => {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        // Afficher/masquer le bouton du menu en fonction de la largeur de l'écran
        if (window.innerWidth > 768) {
            if (menuToggle) menuToggle.style.display = 'none';
            if (mainNav) mainNav.style.display = '';
            document.body.classList.remove('menu-open');
        } else {
            if (menuToggle) menuToggle.style.display = 'flex';
            if (mainNav && !mainNav.classList.contains('active')) {
                mainNav.style.display = 'none';
            }
        }
    };
    
    // Événements
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('resize', handleResize);
    
    // Initialisation
    animateOnScroll();
    handleResize();
});
