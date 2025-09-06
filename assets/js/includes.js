/**
 * Gestion du chargement dynamique du header et du footer
 */

// Configuration des chemins
const PATHS = {
    header: 'includes/header.html',
    footer: 'includes/footer.html'
};

/**
 * Fonction de compatibilité maintenue pour les anciennes références
 * @returns {boolean} Retourne toujours false car la page d'administration n'existe plus
 */
function isAdminPage() {
    return false;
}

/**
 * Initialise le menu mobile
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    if (!menuToggle || !mainNav) return;
    
    // Gestion du clic sur le bouton du menu mobile
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = this.classList.contains('active') ? 'hidden' : '';
    });
    
    // Gestion des menus déroulants sur mobile
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) { // Seulement sur mobile
                e.preventDefault();
                const dropdown = this.closest('.dropdown');
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Fermer le menu en cliquant sur un lien
    document.querySelectorAll('.main-nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        if (!mainNav.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Gestion du redimensionnement de la fenêtre
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 992) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
                
                // Fermer tous les menus déroulants
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }, 250);
    });
}

/**
 * Charge un fichier HTML et l'insère dans l'élément spécifié
 * @param {string} elementId - ID de l'élément cible
 * @param {string} filePath - Chemin vers le fichier à charger
 * @returns {Promise<string>} JSON stringifié avec le statut et les données
 */
async function loadInclude(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(JSON.stringify({
                error: `Erreur de chargement: ${response.status} ${response.statusText}`,
                status: response.status,
                file: filePath
            }));
        }
        
        const html = await response.text();
        const element = document.getElementById(elementId);
        
        if (element) {
            element.outerHTML = html;
            return JSON.stringify({ 
                success: true, 
                elementId,
                filePath
            });
        }
        
        return JSON.stringify({ 
            success: false, 
            error: 'Élément cible non trouvé',
            elementId,
            filePath
        });
        
    } catch (error) {
        console.error(`Erreur lors du chargement de ${filePath}:`, error);
        
        // Essayer avec un chemin relatif différent
        if (filePath.startsWith('includes/')) {
            const altPath = '../' + filePath;
            console.log(`Tentative de chargement avec le chemin alternatif: ${altPath}`);
            return loadInclude(elementId, altPath);
        }
        
        // Gérer l'erreur et retourner un message d'erreur structuré
        let errorMessage = 'Erreur inconnue';
        try {
            const errorData = JSON.parse(error.message);
            errorMessage = errorData.error || error.message;
        } catch (e) {
            errorMessage = error.message || 'Erreur inconnue';
        }
        
        return JSON.stringify({
            success: false,
            error: errorMessage,
            elementId,
            filePath
        });
    }
}

/**
 * Initialise les fonctionnalités du header après son chargement
 */
function initHeaderFeatures() {
    initMobileMenu();
    
    // Gestion du header qui se réduit au scroll
    const header = document.querySelector('.site-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scroll vers le bas
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scroll vers le haut
            header.style.transform = 'translateY(0)';
            
            // Ajouter la classe scrolled après un certain défilement
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Charge tous les includes nécessaires
 */
async function loadAllIncludes() {
    // Ne pas charger sur les pages d'administration
    if (isAdminPage()) {
        console.log('Page d\'administration détectée, chargement des includes ignoré.');
        return;
    }
    
    try {
        // Charger le header
        const headerLoaded = await loadInclude('header-placeholder', PATHS.header);
        if (headerLoaded) {
            initHeaderFeatures();
        } else {
            console.error('Échec du chargement du header');
        }
        
        // Charger le footer
        const footerLoaded = await loadInclude('footer-placeholder', PATHS.footer);
        if (!footerLoaded) {
            console.error('Échec du chargement du footer');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des includes:', error);
    }
}

// Démarrer le chargement des includes
document.addEventListener('DOMContentLoaded', loadAllIncludes);

// Si le DOM est déjà chargé
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadAllIncludes();
}
