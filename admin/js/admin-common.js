/**
 * Fonctions utilitaires communes à toutes les pages d'administration
 */

console.log('[admin-common.js] Fichier chargé avec succès - ' + new Date().toISOString());

// Vérifier si jQuery est chargé
console.log('jQuery version:', (window.jQuery ? 'jQuery ' + jQuery.fn.jquery : 'jQuery non chargé'));

// Vérifier si Bootstrap est chargé
console.log('Bootstrap version:', (window.bootstrap ? 'Bootstrap ' + bootstrap.Tooltip.VERSION : 'Bootstrap non chargé'));

/**
 * Affiche un message de notification à l'utilisateur
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de message (success, error, warning, info)
 * @param {number} [duration=5000] - Durée d'affichage en millisecondes (0 pour ne pas masquer automatiquement)
 */
function showNotification(message, type = 'info', duration = 5000) {
    // Créer le conteneur de notification s'il n'existe pas
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.padding = '15px 20px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    notification.style.animation = 'slideIn 0.3s ease-out';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'space-between';
    notification.style.alignItems = 'center';
    notification.style.minWidth = '300px';
    
    // Définir la couleur en fonction du type
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Ajouter le message
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    notification.appendChild(messageEl);
    
    // Ajouter le bouton de fermeture
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.padding = '0 0 0 15px';
    closeBtn.style.lineHeight = '1';
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    notification.appendChild(closeBtn);
    
    // Ajouter la notification au conteneur
    container.insertBefore(notification, container.firstChild);
    
    // Masquer automatiquement après la durée spécifiée
    if (duration > 0) {
        setTimeout(() => {
            hideNotification(notification);
        }, duration);
    }
    
    // Retourner un objet avec une méthode pour masquer manuellement
    return {
        hide: () => hideNotification(notification)
    };
}

/**
 * Masque une notification
 * @param {HTMLElement} notification - L'élément de notification à masquer
 */
function hideNotification(notification) {
    if (notification) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

/**
 * Formate une date au format français
 * @param {string|Date} date - La date à formater
 * @returns {string} La date formatée
 */
function formatFrenchDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return d.toLocaleDateString('fr-FR', options);
}

/**
 * Valide une adresse email
 * @param {string} email - L'email à valider
 * @returns {boolean} True si l'email est valide, false sinon
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Vérifie si un utilisateur est connecté
 * Redirige vers la page de connexion si non connecté
 */
function checkAuth() {
    // Vérifier si l'utilisateur est connecté (à implémenter selon votre système d'authentification)
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        // Rediriger vers la page de connexion
        window.location.href = '../connexion-prive.html';
    }
}

/**
 * Initialise la navigation entre les onglets
 */
function initTabs() {
    // Mettre en surbrillance l'onglet actif
    const currentPage = window.location.pathname.split('/').pop() || 'accueil.html';
    const navLinks = document.querySelectorAll('.nav-tabs a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === 'index.html' && linkHref === 'accueil.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Initialise les tooltips
 */
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        
        element.style.position = 'relative';
        element.style.display = 'inline-block';
        
        element.addEventListener('mouseenter', () => {
            element.appendChild(tooltip);
            // Positionner le tooltip
            const rect = element.getBoundingClientRect();
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.bottom = 'calc(100% + 5px)';
        });
        
        element.addEventListener('mouseleave', () => {
            if (element.contains(tooltip)) {
                element.removeChild(tooltip);
            }
        });
    });
}

/**
 * Charge un fichier HTML et l'insère dans l'élément spécifié
 * @param {string} url - L'URL du fichier à charger
 * @param {HTMLElement} element - L'élément dans lequel insérer le contenu
 * @param {Function} [callback] - Fonction de rappel après le chargement
 */
async function loadHTML(url, element, callback) {
    console.log(`[loadHTML] Tentative de chargement du fichier: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`[loadHTML] Erreur HTTP lors du chargement de ${url}: ${response.status} ${response.statusText}`);
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const html = await response.text();
        console.log(`[loadHTML] Fichier chargé avec succès: ${url} (${html.length} octets)`);
        
        element.innerHTML = html;
        console.log(`[loadHTML] Contenu inséré dans l'élément:`, element);
        
        if (typeof callback === 'function') {
            console.log(`[loadHTML] Appel du callback pour ${url}`);
            callback();
        } else {
            console.log(`[loadHTML] Aucun callback fourni pour ${url}`);
        }
        return true;       // Retourner true pour indiquer le succès
    } catch (error) {
        console.error(`Erreur lors du chargement de ${url}:`, error);
        return false;
    }
}

/**
 * Charge tous les composants avec l'attribut data-include
 */
async function loadComponents() {
    const components = document.querySelectorAll('[data-include]');
    const promises = [];
    
    components.forEach(component => {
        const url = component.getAttribute('data-include');
        if (url) {
            const promise = loadHTML(url, component, () => {
                // Réinitialiser les composants après le chargement
                initComponents();
            });
            promises.push(promise);
        }
    });
    
    return Promise.all(promises);
}

/**
 * Initialise les composants de la page
 */
function initComponents() {
    // Initialiser les onglets
    initTabs();
    
    // Initialiser les tooltips
    initTooltips();
    
    // Initialiser les tooltips personnalisés
    const tooltipTriggers = document.querySelectorAll('.custom-tooltip-trigger');
    tooltipTriggers.forEach(trigger => {
        const tooltipId = trigger.getAttribute('data-tooltip-id');
        const tooltip = document.getElementById(tooltipId);
        
        if (tooltip) {
            trigger.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block';
            });
            
            trigger.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        }
    });
    
    // Initialiser les menus déroulants
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = toggle.closest('.dropdown');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            // Fermer tous les autres menus ouverts
            document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                if (openMenu !== menu) {
                    openMenu.classList.remove('show');
                }
            });
            
            // Basculer le menu actuel
            menu.classList.toggle('show');
        });
    });
    
    // Fermer les menus déroulants lors d'un clic à l'extérieur
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// Initialiser les composants communs lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier l'authentification (décommenter si nécessaire)
    // checkAuth();
    
    // Charger les composants partagés
    await loadComponents();
    
    // Initialiser les composants
    initComponents();
    
    // Initialiser la gestion des onglets
    initTabs();
    
    // Initialiser les tooltips
    initTooltips();
    
    // Ajouter des styles pour les composants dynamiques
    addDynamicStyles();
    
    // Exécuter la fonction d'initialisation de la page si elle existe
    if (typeof initPage === 'function') {
        initPage();
    }
});

/**
 * Ajoute des styles dynamiques pour les composants
 */
function addDynamicStyles() {
    // Vérifier si les styles ont déjà été ajoutés
    if (document.getElementById('admin-dynamic-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'admin-dynamic-styles';
    style.textContent = `
        /* Styles pour les notifications */
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            to { transform: translateX(100%); opacity: 0; }
        }
        
        /* Styles pour les tooltips */
        .tooltip {
            position: absolute;
            background-color: #333;
            color: #fff;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
        }
        
        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
        }
        
        /* Styles pour les menus déroulants */
        .dropdown {
            position: relative;
            display: inline-block;
        }
        
        .dropdown-menu {
            display: none;
            position: absolute;
            background-color: #fff;
            min-width: 200px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 4px;
            z-index: 1000;
            padding: 5px 0;
            margin: 2px 0 0;
            list-style: none;
        }
        
        .dropdown-menu.show {
            display: block;
        }
        
        .dropdown-item {
            display: block;
            padding: 8px 20px;
            color: #333;
            text-decoration: none;
            transition: background-color 0.2s;
        }
        
        .dropdown-item:hover {
            background-color: #f5f5f5;
        }
        
        .dropdown-divider {
            height: 1px;
            margin: 5px 0;
            overflow: hidden;
            background-color: #e9ecef;
        }
    `;
    
    document.head.appendChild(style);
}

// Initialiser les composants communs lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier l'authentification (décommenter si nécessaire)
    // checkAuth();
    
    // Charger les composants partagés
    await loadComponents();
    
    // Initialiser les composants
    initComponents();
    
    // Ajouter des styles pour les composants dynamiques
    addDynamicStyles();
    
    // Exécuter la fonction d'initialisation de la page si elle existe
    if (typeof initPage === 'function') {
        initPage();
    }
});

// Exposer les fonctions utiles dans l'objet global AdminCommon
window.AdminCommon = {
    showNotification,
    hideNotification,
    formatFrenchDate,
    isValidEmail,
    checkAuth,
    loadHTML,
    loadComponents,
    initComponents
};
