/**
 * Script spécifique à la page d'accueil de l'administration
 * Gère le carrousel et ses fonctionnalités (ajout, édition, suppression, réorganisation)
 */

// Utilisation de la configuration globale
const CONFIG = window.AppConfig?.config || {
    storageKeys: { accueil: 'franchiniCarousel' },
    baseUrl: ''
};

// Vérifier si le fichier est chargé correctement
console.log(`[accueil.js] Fichier chargé avec succès - ${new Date().toISOString()}`);
console.log('[accueil.js] Configuration:', CONFIG);

// Vérifier les dépendances
console.log('[accueil.js] Vérification des dépendances:');
console.log('- jQuery:', typeof $ !== 'undefined' ? `v${$.fn.jquery}` : 'Non chargé');
console.log('- Bootstrap:', typeof bootstrap !== 'undefined' ? 'Disponible' : 'Non chargé');
console.log('- AdminCommon:', typeof AdminCommon !== 'undefined' ? 'Disponible' : 'Non chargé');

// Gestion des erreurs non capturées
window.addEventListener('error', function(event) {
    console.error('[accueil.js] ERREUR NON CAPTURÉE:', event.error || event.message, 'dans', event.filename, 'ligne', event.lineno);
    
    // Essayer d'afficher l'erreur à l'utilisateur si possible
    try {
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Une erreur est survenue: ' + (event.message || 'Erreur inconnue'),
                'error'
            );
        }
    } catch (e) {
        console.error('Impossible d\'afficher la notification d\'erreur:', e);
    }
    
    // Empêcher la propagation de l'événement d'erreur
    event.preventDefault();
});

// Gestion des promesses non gérées
window.addEventListener('unhandledrejection', function(event) {
    console.error('[accueil.js] PROMESSE NON GÉRÉE:', event.reason);
    
    // Essayer d'afficher l'erreur à l'utilisateur si possible
    try {
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Une erreur asynchrone est survenue: ' + (event.reason?.message || 'Erreur inconnue'),
                'error'
            );
        }
    } catch (e) {
        console.error('Impossible d\'afficher la notification d\'erreur:', e);
    }
    
    // Empêcher la propagation de l'événement d'erreur
    event.preventDefault();
});

// Variables globales
let carouselItems = [];
let draggedItem = null;
let dragStartX = 0;
let dragStartY = 0;

// Chemins des ressources
const PATHS = {
    images: `${CONFIG.baseUrl}/assets/images`,
    defaultImage: `${CONFIG.baseUrl}/assets/images/logo/FRANCHINI-logo.svg`
};

/**
 * Gère l'aperçu des médias téléversés
 * @returns {void}
 */
function handleMediaPreview() {
    console.log('[handleMediaPreview] Traitement de l\'aperçu du média');
    
    const imageUploadInput = document.getElementById('image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const mediaTypeSelect = document.getElementById('media-type');
    
    console.log('[handleMediaPreview] Éléments trouvés:', {
        imageUploadInput: !!imageUploadInput,
        imagePreviewContainer: !!imagePreviewContainer,
        imagePreview: !!imagePreview,
        mediaTypeSelect: !!mediaTypeSelect
    });

    // Cacher le conteneur d'aperçu par défaut
    if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';

    // Vérifier si un fichier a été sélectionné
    if (imageUploadInput && imageUploadInput.files && imageUploadInput.files.length > 0) {
        const file = imageUploadInput.files[0];
        const fileType = file.type;
        console.log(`[handleMediaPreview] Fichier sélectionné:`, file);
        console.log(`[handleMediaPreview] Type de fichier détecté: ${fileType}`);

        // Vérifier que c'est bien une image
        if (!fileType.startsWith('image/')) {
            console.warn(`[handleMediaPreview] Type de fichier non supporté: ${fileType}`);
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification('Veuillez sélectionner un fichier image valide (JPEG, PNG, etc.)', 'warning');
            }
            return;
        }

        // Mettre à jour le type de média à 'image' si ce n'est pas déjà le cas
        if (mediaTypeSelect && mediaTypeSelect.value !== 'image') {
            mediaTypeSelect.value = 'image';
            // Déclencher l'événement change pour mettre à jour l'interface
            const event = new Event('change');
            mediaTypeSelect.dispatchEvent(event);
        }

        // Lire le fichier et afficher l'aperçu
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('[handleMediaPreview] Affichage de l\'aperçu de l\'image');
            if (imagePreview) {
                imagePreview.src = e.target.result;
                imagePreview.alt = 'Aperçu de l\'image téléversée';
            }
            if (imagePreviewContainer) {
                imagePreviewContainer.style.display = 'block';
                console.log('[handleMediaPreview] Aperçu de l\'image affiché');
            }
        };
        
        reader.onerror = function(error) {
            console.error('[handleMediaPreview] Erreur lors de la lecture du fichier:', error);
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification('Erreur lors de la lecture du fichier', 'error');
            }
        };
        
        reader.readAsDataURL(file);
    } else {
        console.log('[handleMediaPreview] Aucun fichier sélectionné');
    }
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Accueil] DOM chargé, initialisation de la page...');
    
    try {
        console.log('[Accueil] Chargement des éléments du carrousel...');
        loadCarouselItems();
        console.log('[Accueil] Initialisation des écouteurs d\'événements...');
        initEventListeners();
        console.log('[Accueil] Écouteurs d\'événements initialisés');
        
        console.log('[Accueil] Charger les éléments du carrousel');
        try {
            carouselItems = loadCarouselItems();
            console.log('[Accueil] Éléments chargés:', carouselItems);
            
            // Afficher les éléments
            renderCarouselItems();
            
            // Initialiser les tooltips
            initTooltips();
            
            // Mettre à jour les attributs ARIA pour l'accessibilité
            updateAriaAttributes();
            
        } catch (error) {
            console.error('[Accueil] Erreur lors du chargement du carrousel:', error);
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification(
                    'Une erreur est survenue lors du chargement du carrousel',
                    'error'
                );
            }
        }
        
        console.log('[Accueil] Initialisation des écouteurs de glisser-déposer...');
        initDragAndDropListeners();
        console.log('[Accueil] Écouteurs de glisser-déposer initialisés');
    } catch (error) {
        console.error('[Accueil] Erreur lors de l\'initialisation de la page:', error);
        
        // Afficher une notification d'erreur si disponible
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Une erreur est survenue lors du chargement de la page',
                'error'
            );
        } else {
            console.error('Impossible d\'afficher la notification d\'erreur: AdminCommon non disponible');
        }
    }
});

/**
 * Initialise les écouteurs d'événements pour le glisser-déposer
 * @returns {void}
 */
function initDragAndDropListeners() {
    console.log('[initDragAndDropListeners] Initialisation des écouteurs de glisser-déposer...');
    
    const container = document.getElementById('carousel-items-container');
    if (!container) {
        console.error('[initDragAndDropListeners] ERREUR: Conteneur d\'éléments non trouvé');
        return;
    }
    
    // Récupérer tous les éléments draggables
    const draggableItems = Array.from(document.querySelectorAll('.draggable-item'));
    console.log(`[initDragAndDropListeners] ${draggableItems.length} éléments draggables trouvés`);
    
    // Fonction utilitaire pour supprimer tous les écouteurs d'un élément
    const removeAllListeners = (element) => {
        if (!element) return;
        
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        return newElement;
    };
    
    // Supprimer et réattacher les écouteurs pour éviter les doublons
    draggableItems.forEach((item, index) => {
        try {
            // Cloner l'élément pour supprimer tous les écouteurs existants
            const cleanItem = removeAllListeners(item);
            
            if (!cleanItem) {
                console.warn(`[initDragAndDropListeners] Impossible de nettoyer l'élément à l'index ${index}`);
                return;
            }
            
            const itemId = cleanItem.dataset.id || `index-${index}`;
            console.log(`[initDragAndDropListeners] Configuration de l'élément ${itemId}`);
            
            // Ajouter les attributs nécessaires
            cleanItem.setAttribute('draggable', 'true');
            cleanItem.setAttribute('aria-grabbed', 'false');
            cleanItem.setAttribute('role', 'option');
            
            // Ajouter les écouteurs d'événements
            cleanItem.addEventListener('dragstart', handleDragStart);
            cleanItem.addEventListener('dragover', handleDragOver);
            cleanItem.addEventListener('drop', handleDrop);
            cleanItem.addEventListener('dragend', handleDragEnd);
            cleanItem.addEventListener('dragleave', handleDragLeave);
            
            // Ajouter des styles pour le feedback visuel
            cleanItem.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
            
            console.log(`[initDragAndDropListeners] Écouteurs configurés pour l'élément ${itemId}`);
        } catch (error) {
            console.error(`[initDragAndDropListeners] Erreur lors de la configuration de l'élément ${index}:`, error);
        }
    });
    
    // Configurer les écouteurs du conteneur
    console.log('[initDragAndDropListeners] Configuration des écouteurs du conteneur...');
    
    // Supprimer les anciens écouteurs du conteneur
    const newContainer = removeAllListeners(container);
    
    if (newContainer) {
        // Ajouter les écouteurs au nouveau conteneur
        newContainer.addEventListener('dragover', handleContainerDragOver);
        newContainer.addEventListener('dragleave', handleContainerDragLeave);
        newContainer.addEventListener('drop', handleContainerDrop);
        
        // Ajouter des styles pour le feedback visuel
        newContainer.style.minHeight = '100px';
        newContainer.style.transition = 'background-color 0.2s ease';
        
        console.log('[initDragAndDropListeners] Écouteurs du conteneur configurés');
    } else {
        console.error('[initDragAndDropListeners] Impossible de configurer les écouteurs du conteneur');
    }
    
    console.log('[initDragAndDropListeners] Initialisation des écouteurs de glisser-déposer terminée');
}

/**
 * Gère le début du glisser d'un élément
 * @param {DragEvent} e - L'événement de début de glisser
 * @returns {void}
 */
function handleDragStart(e) {
    console.log('[handleDragStart] Début du glisser-déposer');
    
    // Vérifier que l'élément a un ID
    if (!this.dataset.id) {
        console.error('[handleDragStart] ERREUR: L\'élément n\'a pas d\'ID');
        e.preventDefault();
        return;
    }
    
    // Mettre à jour l'élément en cours de déplacement
    draggedItem = this;
    
    // Ajouter des classes pour le style
    this.classList.add('dragging');
    this.setAttribute('aria-grabbed', 'true');
    document.body.classList.add('dragging-active');
    
    // Stocker la position de départ pour le calcul du déplacement
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    
    // Définir les données de transfert
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.id);
    e.dataTransfer.setData('text/html', this.outerHTML);
    
    // Pour le support mobile, définir également dans un attribut
    this.setAttribute('data-dragged-id', this.dataset.id);
    
    // Créer un élément de prévisualisation personnalisé
    const preview = this.cloneNode(true);
    preview.id = 'drag-preview';
    preview.classList.add('sortable-ghost');
    preview.style.width = `${this.offsetWidth}px`;
    preview.style.opacity = '0.8';
    preview.style.position = 'fixed';
    preview.style.pointerEvents = 'none';
    preview.style.zIndex = '9999';
    preview.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    preview.style.transform = 'rotate(2deg)';
    document.body.appendChild(preview);
    
    // Positionner la prévisualisation sous le curseur
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Utiliser setDragImage avec un élément invisible pour éviter l'image par défaut
    const dragImage = document.createElement('div');
    dragImage.style.width = '1px';
    dragImage.style.height = '1px';
    dragImage.style.opacity = '0';
    document.body.appendChild(dragImage);
    
    if (e.dataTransfer.setDragImage) {
        e.dataTransfer.setDragImage(dragImage, 0, 0);
    }
    
    // Mettre à jour la position de la prévisualisation pendant le glisser
    const movePreview = (e) => {
        if (!preview.parentNode) return;
        preview.style.left = `${e.clientX - x}px`;
        preview.style.top = `${e.clientY - y}px`;
    };
    
    // Nettoyer après le glisser
    const cleanup = () => {
        document.removeEventListener('dragover', movePreview);
        document.removeEventListener('dragend', cleanup);
        if (preview.parentNode) {
            document.body.removeChild(preview);
        }
        if (dragImage.parentNode) {
            document.body.removeChild(dragImage);
        }
        this.style.opacity = '';
        this.classList.remove('dragging');
        this.setAttribute('aria-grabbed', 'false');
    };
    
    document.addEventListener('dragover', movePreview);
    document.addEventListener('dragend', cleanup, { once: true });
    
    // Utiliser un timeout pour éviter les problèmes de rendu
    setTimeout(() => {
        this.style.opacity = '0.4';
    }, 0);
    
    console.log(`[handleDragStart] Début du glisser pour l'élément ${this.dataset.id}`);
}

/**
 * Gère le survol d'un élément pendant le glisser-déposer
 * @param {DragEvent} e - L'événement de survol
 * @returns {boolean} false pour empêcher le comportement par défaut
 */
function handleDragOver(e) {
    // Empêcher le comportement par défaut pour permettre le dépôt
    e.preventDefault();
    e.stopPropagation();
    
    // Ne rien faire si c'est l'élément en cours de déplacement
    if (this === draggedItem) {
        return false;
    }
    
    // Vérifier que l'élément a un ID
    if (!this.dataset.id) {
        console.warn('[handleDragOver] Avertissement: L\'élément survolé n\'a pas d\'ID');
        return false;
    }
    
    // Calculer la position relative pour déterminer où insérer
    const rect = this.getBoundingClientRect();
    const midY = rect.top + (rect.height / 2);
    
    // Déterminer si on est au-dessus ou en dessous du milieu
    const isBefore = e.clientY < midY;
    
    // Ajouter des classes pour le style
    this.classList.add('drag-over');
    
    // Supprimer les classes de tous les autres éléments
    document.querySelectorAll('.carousel-item-draggable').forEach(item => {
        if (item !== this && item !== draggedItem) {
            item.classList.remove('drag-over', 'sortable-ghost');
        }
    });
    
    // Ajouter la classe de feedback visuel
    if (isBefore) {
        this.classList.add('drag-over-top');
        this.classList.remove('drag-over-bottom');
        
        // Ajouter un indicateur visuel avant l'élément
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator drop-indicator-top';
        this.before(indicator);
        
        // Supprimer les anciens indicateurs
        const oldIndicators = document.querySelectorAll('.drop-indicator');
        oldIndicators.forEach(ind => {
            if (ind !== indicator) {
                ind.remove();
            }
        });
    } else {
        this.classList.add('drag-over-bottom');
        this.classList.remove('drag-over-top');
        
        // Ajouter un indicateur visuel après l'élément
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator drop-indicator-bottom';
        this.after(indicator);
        
        // Supprimer les anciens indicateurs
        const oldIndicators = document.querySelectorAll('.drop-indicator');
        oldIndicators.forEach(ind => {
            if (ind !== indicator) {
                ind.remove();
            }
        });
    }
    
    // Définir l'effet de déplacement
    e.dataTransfer.dropEffect = 'move';
    
    // Pour le support mobile, ajouter une classe au body
    document.body.classList.add('drag-in-progress');
    
    console.log(`[handleDragOver] Survol de l'élément ${this.dataset.id} (${isBefore ? 'haut' : 'bas'})`);
    
    return false;
}

/**
 * Gère le dépôt d'un élément lors d'un glisser-déposer
 * @param {DragEvent} e - L'événement de dépôt
 * @returns {boolean} false pour empêcher le comportement par défaut
 */
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Nettoyer les indicateurs de dépôt
    document.querySelectorAll('.drop-indicator').forEach(ind => ind.remove());
    
    if (!draggedItem) {
        console.warn('[handleDrop] Aucun élément en cours de déplacement');
        return false;
    }
    
    // Supprimer les classes de style de tous les éléments
    document.querySelectorAll('.carousel-item-draggable').forEach(item => {
        item.classList.remove('drag-over', 'drag-over-top', 'drag-over-bottom', 'sortable-ghost');
    });
    
    // Ne rien faire si on dépose sur le même élément
    if (this === draggedItem) {
        return false;
    }
    
    // Récupérer le conteneur parent
    const container = document.getElementById('carousel-items-list');
    if (!container) {
        console.error('[handleDrop] ERREUR: Conteneur d\'éléments non trouvé');
        return false;
    }
    
    // Récupérer tous les éléments
    const itemElements = Array.from(container.querySelectorAll('.carousel-item-draggable'));
    const fromIndex = itemElements.indexOf(draggedItem);
    let toIndex = itemElements.indexOf(this);
    
    // Si on dépose sur un élément, déterminer si c'est avant ou après
    if (this.classList.contains('drag-over-top')) {
        // Insérer avant cet élément
        toIndex = Math.max(0, toIndex - 1);
    } else if (this.classList.contains('drag-over-bottom')) {
        // Insérer après cet élément
        toIndex = Math.min(itemElements.length - 1, toIndex + 1);
    }
    
    // Vérifier que les indices sont valides
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        console.log('[handleDrop] Aucun déplacement nécessaire');
        return false;
    }
    
    try {
        // Mettre à jour l'ordre des éléments dans le DOM
        if (fromIndex < toIndex) {
            // Déplacement vers le bas
            if (toIndex < itemElements.length - 1) {
                container.insertBefore(draggedItem, itemElements[toIndex + 1]);
            } else {
                container.appendChild(draggedItem);
            }
        } else {
            // Déplacement vers le haut
            container.insertBefore(draggedItem, itemElements[toIndex]);
        }

        // Mettre à jour l'ordre dans le tableau carouselItems
        updateItemsOrder();

        // Sauvegarder l'ordre mis à jour
        saveCarouselItems();

        // Mettre à jour les attributs ARIA
        updateAriaAttributes();
        
        // Mettre à jour l'interface utilisateur
        renderCarouselItems();
        
        console.log(`[handleDrop] Élément déplacé de la position ${fromIndex} à ${toIndex}`);
        
        // Afficher une notification de succès
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'L\'ordre des éléments a été mis à jour',
                'success'
            );
        }
        
        console.log('[handleDrop] Dépôt traité avec succès');
    } catch (error) {
        console.error('[handleDrop] ERREUR lors du traitement du dépôt:', error);
        
        // En cas d'erreur, recharger les éléments pour éviter un état incohérent
        renderCarouselItems();
        
        // Afficher une notification d'erreur
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Une erreur est survenue lors du déplacement de l\'élément',
                'error'
            );
        }
    } finally {
        // Réinitialiser l'élément en cours de déplacement
        draggedItem = null;
    }
    
    return false;
}

/**
 * Gère la fin du glisser-déposer
 * @returns {void}
 */
function handleDragEnd() {
    console.log('[handleDragEnd] Fin du glisser-déposer');
    
    try {
        // Réinitialiser l'élément en cours de déplacement
        if (this) {
            this.classList.remove('dragging');
            this.style.opacity = '';
            this.style.transform = '';
            this.style.transition = '';
            this.removeAttribute('aria-grabbed');
            
            // Supprimer les attributs temporaires
            this.removeAttribute('data-dragged-id');
        }
        
        // Supprimer les classes de style du body
        document.body.classList.remove('dragging-active', 'drag-in-progress');
        
        // Nettoyer les classes de tous les éléments
        document.querySelectorAll('.draggable-item').forEach(item => {
            item.classList.remove(
                'drag-over', 
                'drag-over-top', 
                'drag-over-bottom',
                'drag-over-left',
                'drag-over-right'
            );
            item.style.borderColor = '';
            item.style.borderStyle = '';
        });
        
        // Réinitialiser la référence à l'élément déplacé
        draggedItem = null;
        
        console.log('[handleDragEnd] Glisser-déposer terminé avec succès');
    } catch (error) {
        console.error('[handleDragEnd] ERREUR lors du nettoyage après le glisser-déposer:', error);
        
        // En cas d'erreur, forcer un rechargement de l'interface
        renderCarouselItems();
        
        // Afficher une notification d'erreur
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Une erreur est survenue lors du glisser-déposer',
                'error'
            );
        }
    }
    
    // Mettre à jour l'ordre dans le stockage local
    updateItemsOrder();
    
    draggedItem = null;
}

// Gestion de la sortie de la zone de dépôt
function handleDragLeave() {
    // Ne rien faire si c'est l'élément en cours de déplacement
    if (this === draggedItem) {
        return;
    }
    
    try {
        // Supprimer toutes les classes de style
        this.classList.remove(
            'drag-over', 
            'drag-over-top', 
            'drag-over-bottom',
            'drag-over-left',
            'drag-over-right'
        );
        
        // Réinitialiser les styles
        this.style.borderColor = '';
        this.style.borderStyle = '';
        this.style.backgroundColor = '';
        
        console.log(`[handleDragLeave] Sortie de l'élément ${this.dataset.id || 'inconnu'} pendant le glisser`);
    } catch (error) {
        console.error('[handleDragLeave] ERREUR lors du traitement de la sortie de l\'élément:', error);
    }
}

/**
 * Gère le survol du conteneur pendant le glisser-déposer
 * @param {DragEvent} e - L'événement de survol
 * @returns {void}
 */
function handleContainerDragOver(e) {
    // Empêcher le comportement par défaut pour permettre le dépôt
    e.preventDefault();
    e.stopPropagation();
    
    try {
        // Vérifier si un élément est en cours de déplacement
        if (!draggedItem) {
            console.log('[handleContainerDragOver] Aucun élément en cours de déplacement');
            return;
        }
        
        // Définir l'effet de déplacement
        e.dataTransfer.dropEffect = 'move';
        
        // Ajouter une classe pour le style
        this.classList.add('drag-over-container');
        
        // Vérifier si le conteneur est vide ou ne contient qu'un message
        const isEmpty = this.children.length === 0 || 
                      (this.children.length === 1 && 
                       (this.children[0].classList.contains('empty-message') ||
                        this.children[0].classList.contains('drop-here-message')));
        
        if (isEmpty) {
            // Si le conteneur est vide, afficher un message d'aide
            const existingMessage = this.querySelector('.drop-here-message');
            
            if (!existingMessage) {
                const message = document.createElement('div');
                message.className = 'drop-here-message alert alert-info';
                message.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="fas fa-arrow-circle-down me-2"></i>
                        <span>Déposez ici pour ajouter l'élément</span>
                    </div>
                    <div class="small text-muted mt-1">Relâchez pour insérer à la fin de la liste</div>
                `;
                
                // Vider le conteneur et ajouter le message
                this.innerHTML = '';
                this.appendChild(message);
                
                // Ajouter une animation
                message.style.animation = 'fadeIn 0.3s ease-in-out';
                
                console.log('[handleContainerDragOver] Message de dépôt affiché');
            }
        } else {
            // Si le conteneur n'est pas vide, ajouter une classe pour le style
            this.classList.add('drag-over-non-empty');
            
            // Ajouter un indicateur visuel à la fin
            const existingIndicator = this.querySelector('.drop-indicator-bottom');
            if (!existingIndicator) {
                const indicator = document.createElement('div');
                indicator.className = 'drop-indicator-bottom';
                this.appendChild(indicator);
                
                // Ajouter une animation
                indicator.style.animation = 'fadeIn 0.2s ease-in-out';
            }
        }
        
        // Ajouter une classe au body pour le style
        document.body.classList.add('dragging-over-container');
        
    } catch (error) {
        console.error('[handleContainerDragOver] ERREUR lors du traitement du survol du conteneur:', error);
    }
}    

/**
 * Gère la sortie du conteneur pendant le glisser-déposer
 * @param {DragEvent} e - L'événement de sortie
 * @returns {void}
 */
/**
 * Gère la sortie du conteneur pendant le glisser-déposer
 * @param {DragEvent} e - L'événement de sortie
 * @returns {void}
 */
function handleContainerDragLeave(e) {
    // Empêcher le comportement par défaut
    e.preventDefault();
    e.stopPropagation();
    
    try {
        const container = this;
        
        // Vérifier si la souris quitte réellement le conteneur
        // et ne passe pas simplement sur un enfant
        const relatedTarget = e.relatedTarget || e.toElement;
        
        // Si relatedTarget est null, c'est que la souris est sortie de la fenêtre
        // ou passe sur un élément qui n'est pas un enfant du conteneur
        if (!relatedTarget || !container.contains(relatedTarget)) {
            console.log('[handleContainerDragLeave] Sortie du conteneur détectée');
            
            // Supprimer les classes de style
            container.classList.remove(
                'drag-over-container', 
                'drag-over-non-empty',
                'drag-active'
            );
            
            // Supprimer les indicateurs de dépôt avec une animation de fondu
            const indicators = container.querySelectorAll(
                '.drop-here-message, .drop-indicator-bottom, .drop-indicator-top'
            );
            
            if (indicators.length > 0) {
                indicators.forEach(indicator => {
                    // Ajouter une animation de sortie
                    indicator.style.animation = 'fadeOut 0.2s ease-in-out';
                    
                    // Supprimer après l'animation
                    setTimeout(() => {
                        try {
                            if (indicator && indicator.parentNode) {
                                indicator.remove();
                            }
                        } catch (err) {
                            console.error('[handleContainerDragLeave] Erreur lors de la suppression d\'un indicateur:', err);
                        }
                    }, 200);
                });
                
                console.log(`[handleContainerDragLeave] ${indicators.length} indicateurs supprimés`);
            }
            
            // Supprimer la classe du body
            document.body.classList.remove('dragging-over-container');
            
            // Si le conteneur est vide, réafficher le message approprié
            if (container.children.length === 0 || 
                (container.children.length === 1 && 
                 (container.children[0].classList.contains('drop-here-message') || 
                  container.children[0].classList.contains('drop-indicator-bottom') ||
                  container.children[0].classList.contains('drop-indicator-top')))) {
                renderEmptyState(container);
            }
        } else {
            console.log('[handleContainerDragLeave] La souris est toujours dans le conteneur, sur un enfant');
        }
    } catch (error) {
        console.error('[handleContainerDragLeave] ERREUR lors du traitement de la sortie du conteneur:', error);
        
        // En cas d'erreur, essayer de nettoyer au maximum
        this.classList.remove('drag-over-container', 'drag-over-non-empty', 'drag-active');
        document.body.classList.remove('dragging-over-container');
    }
}

/**
 * Affiche un message lorsque le conteneur est vide
 * @param {HTMLElement} container - L'élément conteneur
 * @returns {void}
 */
function renderEmptyState(container) {
    if (!container) return;
    
    // Vérifier si le conteneur est déjà vide ou ne contient que des éléments temporaires
    const isEmpty = container.children.length === 0 || 
                  (container.children.length === 1 && 
                   (container.children[0].classList.contains('drop-here-message') || 
                    container.children[0].classList.contains('drop-indicator-bottom') ||
                    container.children[0].classList.contains('drop-indicator-top')));
    
    if (isEmpty) {
        // Vider le conteneur
        container.innerHTML = '';
        
        // Créer et ajouter le message d'état vide
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message alert alert-light text-center';
        emptyMessage.innerHTML = `
            <i class="fas fa-inbox fa-2x mb-2 text-muted"></i>
            <p class="mb-0">Aucun élément dans le carrousel</p>
            <small class="text-muted">Glissez-déposez des images ici ou utilisez le bouton "Ajouter un élément"</small>
        `;
        
        // Ajouter une animation
        emptyMessage.style.animation = 'fadeIn 0.3s ease-in-out';
        
        container.appendChild(emptyMessage);
        console.log('[renderEmptyState] État vide affiché');
    }
}

// Gestion du dépôt dans le conteneur
function handleContainerDrop(e) {
    // Empêcher le comportement par défaut
    e.preventDefault();
    e.stopPropagation();
    
    try {
        const container = this;
        
        console.log('[handleContainerDrop] Dépôt dans le conteneur détecté');
        
        // Vérifier si un élément est en cours de déplacement
        if (!draggedItem) {
            console.warn('[handleContainerDrop] Aucun élément en cours de déplacement');
            return;
        }
        
        // Supprimer les classes de style
        container.classList.remove(
            'drag-over-container', 
            'drag-over-non-empty',
            'drag-active'
        );
        
        // Supprimer les indicateurs de dépôt
        const indicators = container.querySelectorAll(
            '.drop-here-message, .drop-indicator-bottom, .drop-indicator-top'
        );
        
        indicators.forEach(indicator => {
            try {
                if (indicator && indicator.parentNode) {
                    indicator.remove();
                }
            } catch (err) {
                console.error('[handleContainerDrop] Erreur lors de la suppression d\'un indicateur:', err);
            }
        });
        
        // Si le conteneur est vide ou ne contient que des messages, vider le conteneur
        const isEmpty = container.children.length === 0 || 
                      (container.children.length === 1 && 
                       (container.children[0].classList.contains('empty-message') || 
                        container.children[0].classList.contains('drop-here-message')));
        
        if (isEmpty) {
            container.innerHTML = '';
        }
        
        // Ajouter l'élément déplacé à la fin du conteneur
        container.appendChild(draggedItem);
        
        // Mettre à jour l'ordre des éléments
        updateItemsOrder();
        
        // Supprimer la classe du body
        document.body.classList.remove('dragging-over-container');
        
        console.log(`[handleContainerDrop] Élément ${draggedItem.dataset.id || 'inconnu'} déposé dans le conteneur`);
        
    } catch (error) {
        console.error('[handleContainerDrop] ERREUR lors du traitement du dépôt dans le conteneur:', error);
        
        // En cas d'erreur, essayer de nettoyer au maximum
        this.classList.remove('drag-over-container', 'drag-over-non-empty', 'drag-active');
        document.body.classList.remove('dragging-over-container');
        
        // Afficher une notification d'erreur
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Une erreur est survenue lors du dépôt de l\'élément',
                'error'
            );
        }
    }
}

/**
 * Met à jour l'ordre des éléments dans le tableau carouselItems
 * @param {boolean} [updateUI=true] - Si vrai, met à jour l'interface utilisateur
 * @returns {Array} Le tableau des éléments mis à jour
 */
function updateItemsOrder(updateUI = true) {
    console.log('[updateItemsOrder] Mise à jour de l\'ordre des éléments...');
    
    try {
        const container = document.getElementById('carousel-items-container');
        if (!container) {
            console.error('[updateItemsOrder] ERREUR: Conteneur d\'éléments non trouvé');
            return [];
        }
        
        // Récupérer tous les éléments draggables actuels
        const items = Array.from(container.querySelectorAll('.draggable-item'));
        console.log(`[updateItemsOrder] ${items.length} éléments trouvés dans le DOM`);
        
        // Si aucun élément n'est présent, réinitialiser le tableau
        if (items.length === 0) {
            console.log('[updateItemsOrder] Aucun élément trouvé, réinitialisation du tableau');
            carouselItems = [];
            saveCarouselItems();
            return [];
        }
        
        console.log(`[updateItemsOrder] Traitement de ${items.length} éléments...`);
        
        // Parcourir tous les éléments dans l'ordre du DOM
        const newItems = [];
        const updatedIndices = [];
        const startTime = performance.now();
        
        items.forEach((item, newIndex) => {
            const itemId = item.dataset.id;
            if (!itemId) {
                console.warn(`[updateItemsOrder] Élément sans ID à l'index ${newIndex}, ignoré`);
                return;
            }
            
            // Trouver l'élément correspondant dans le tableau carouselItems
            const existingItemIndex = carouselItems.findIndex(i => i && i.id === itemId);
            
            if (existingItemIndex !== -1) {
                // Si l'élément existe déjà, le mettre à jour
                const existingItem = carouselItems[existingItemIndex];
                existingItem.order = newIndex;
                newItems.push(existingItem);
                
                // Enregistrer l'ancien et le nouvel index si différent
                if (existingItemIndex !== newIndex) {
                    updatedIndices.push({
                        id: existingItem.id,
                        oldIndex: existingItemIndex,
                        newIndex: newIndex
                    });
                }
            } else {
                console.warn(`[updateItemsOrder] Élément avec ID ${itemId} non trouvé dans carouselItems`);
                
                // Créer un nouvel élément avec les données de base
                const newItem = {
                    id: itemId,
                    order: newIndex,
                    title: item.querySelector('.card-title')?.textContent || 'Nouvel élément',
                    isActive: true,
                    // Ajouter d'autres propriétés par défaut si nécessaire
                    imageUrl: item.querySelector('img')?.src || '',
                    description: item.querySelector('.card-text')?.textContent || '',
                    buttonText: item.querySelector('.btn')?.textContent || 'En savoir plus',
                    buttonUrl: item.querySelector('.btn')?.href || '#'
                };
                
                newItems.push(newItem);
                updatedIndices.push({
                    id: newItem.id,
                    oldIndex: -1,
                    newIndex: newIndex
                });
                
                console.log(`[updateItemsOrder] Nouvel élément créé avec l'ID ${itemId}`);
            }
        });
        
        // Mettre à jour le tableau carouselItems avec le nouvel ordre
        carouselItems = newItems;
        
        // Sauvegarder les modifications
        saveCarouselItems();
        
        // Mettre à jour l'interface utilisateur si demandé
        if (updateUI) {
            updatedIndices.forEach(({ id, oldIndex, newIndex }) => {
                const itemElement = document.querySelector(`.draggable-item[data-id="${id}"]`);
                if (itemElement) {
                    const orderBadge = itemElement.querySelector('.order-badge');
                    if (orderBadge) {
                        orderBadge.textContent = `Ordre: ${newIndex + 1}`;
                    }
                    
                    // Mettre à jour l'attribut data-order pour le tri CSS
                    itemElement.dataset.order = newIndex;
                    
                    console.log(`[updateItemsOrder] Mise à jour de l'élément ${id}: position ${oldIndex} -> ${newIndex}`);
                }
            });
        }
        
        const endTime = performance.now();
        console.log(`[updateItemsOrder] Mise à jour terminée en ${(endTime - startTime).toFixed(2)}ms`);
        
        return newItems;
    } catch (error) {
        console.error('[updateItemsOrder] ERREUR lors de la mise à jour de l\'ordre des éléments:', error);
        
        // En cas d'erreur, essayer de sauvegarder l'état actuel
        try {
            saveCarouselItems();
        } catch (saveError) {
            console.error('[updateItemsOrder] ERREUR lors de la sauvegarde d\'urgence:', saveError);
        }
        
        // Afficher une notification d'erreur
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Une erreur est survenue lors de la mise à jour de l\'ordre des éléments',
                'error'
            );
        }
        
        return [];
    }
}

/**
 * Charge les éléments du carrousel depuis le stockage local
 * @returns {Array} Tableau des éléments du carrousel chargés
 */
function loadCarouselItems() {
    console.log('[loadCarouselItems] Début du chargement des éléments du carrousel');
    
    try {
        // Vérifier si le stockage local est disponible
        if (typeof localStorage === 'undefined') {
            const errorMsg = 'Le stockage local n\'est pas disponible dans cet environnement';
            console.error(`[loadCarouselItems] ERREUR: ${errorMsg}`);
            throw new Error(errorMsg);
        }
        
        // Utiliser la clé de stockage depuis la configuration
        const storageKey = CONFIG.storageKeys.accueil || 'franchiniCarousel';
        const savedItems = localStorage.getItem(storageKey);
        console.log('[loadCarouselItems] Données brutes récupérées du stockage local:', savedItems);
        
        if (!savedItems) {
            console.log('[loadCarouselItems] Aucun élément trouvé dans le stockage local, utilisation des valeurs par défaut');
            return setDefaultCarouselItems();
        }
        
        // Parser les données JSON
        let parsedItems;
        try {
            parsedItems = JSON.parse(savedItems);
            console.log('[loadCarouselItems] Données parsées avec succès:', parsedItems);
            
            // Vérifier que les données parsées sont un tableau
            if (!Array.isArray(parsedItems)) {
                throw new Error('Les données sauvegardées ne sont pas un tableau valide');
            }
            
            // Corriger les chemins des médias pour qu'ils fonctionnent à la fois en local et sur GitHub Pages
            const itemsWithCorrectedPaths = parsedItems.map(item => {
                // Pour les vidéos YouTube, ne pas modifier l'URL
                if (item.type === 'video' && (item.url.includes('youtube.com') || item.url.includes('youtu.be'))) {
                    return item;
                }
                
                // Pour les images, s'assurer que le chemin est correct
                if (item.url && !item.url.startsWith('http') && !item.url.startsWith('data:')) {
                    // Si le chemin commence déjà par /assets, ajouter le baseUrl si nécessaire
                    if (item.url.startsWith('/assets')) {
                        return {
                            ...item,
                            url: CONFIG.baseUrl + item.url
                        };
                    }
                    // Si c'est un chemin relatif, ajouter le préfixe approprié
                    return {
                        ...item,
                        url: `${CONFIG.baseUrl}/assets/images/carousel${item.url.startsWith('/') ? '' : '/'}${item.url}`
                    };
                }
                
                return item;
            });
            
            // Valider et corriger les éléments
            const validatedItems = itemsWithCorrectedPaths.map((item, index) => {
                // Créer une copie de l'élément pour éviter de modifier l'original
                const newItem = { ...item };
                
                // S'assurer que chaque élément a un ID et un ordre valides
                if (!newItem.id) {
                    newItem.id = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                }
                
                if (typeof newItem.order !== 'number' || isNaN(newItem.order)) {
                    newItem.order = index;
                }
                
                return newItem;
            });
            
            // Trier les éléments par ordre
            const sortedItems = [...validatedItems].sort((a, b) => a.order - b.order);
            console.log('[loadCarouselItems] Éléments chargés et triés:', sortedItems);
            
            return sortedItems;
        } catch (parseError) {
            console.error('[loadCarouselItems] Erreur lors du parsing des données:', parseError);
            throw new Error('Format de données invalide dans le stockage local');
        }
    } catch (error) {
        console.error('[loadCarouselItems] Erreur lors du chargement des éléments:', error);
        
        // En cas d'erreur, essayer de récupérer les éléments avec des clés alternatives
        try {
            const fallbackKeys = ['carouselItems', 'homeCarousel', 'carouselData'];
            
            for (const key of fallbackKeys) {
                const fallbackItems = localStorage.getItem(key);
                if (fallbackItems) {
                    console.log(`[loadCarouselItems] Éléments chargés depuis la clé de secours: ${key}`);
                    return JSON.parse(fallbackItems);
                }
            }
        } catch (e) {
            console.error('[loadCarouselItems] Échec du chargement avec les clés de secours:', e);
        }
        
        // Si tout échoue, retourner un tableau vide
        return [];
    }
}

/**
 * Définit les valeurs par défaut pour le carrousel
 * @returns {Array} Tableau des éléments par défaut
 */
function setDefaultCarouselItems() {
    console.log('[setDefaultCarouselItems] Création des valeurs par défaut pour le carrousel');
    
    const defaultItems = [
        {
            id: `default-${Date.now()}`,
            type: 'image',
            title: 'Bienvenue sur mon site',
            description: 'Découvrez mes réalisations et services',
            imageUrl: 'https://via.placeholder.com/1200x400',
            buttonText: 'En savoir plus',
            buttonUrl: '#services',
            isActive: true,
            order: 0,
            createdAt: new Date().toISOString()
        }
    ];
    
    console.log('[setDefaultCarouselItems] Valeurs par défaut créées:', defaultItems);
    
    // Mettre à jour la variable globale
    carouselItems = defaultItems;
    
    // Sauvegarder les valeurs par défaut
    try {
        saveCarouselItems();
        console.log('[setDefaultCarouselItems] Valeurs par défaut sauvegardées avec succès');
    } catch (saveError) {
        console.error('[setDefaultCarouselItems] Erreur lors de la sauvegarde des valeurs par défaut:', saveError);
    }
    
    return defaultItems;
}

/**
 * Sauvegarde les éléments du carrousel dans le stockage local
 */
function saveCarouselItems() {
    console.log('[saveCarouselItems] Début de la sauvegarde des éléments du carrousel');
    console.log('[saveCarouselItems] Éléments à sauvegarder:', carouselItems);
    
    try {
        // Vérifier que carouselItems est un tableau
        if (!Array.isArray(carouselItems)) {
            const errorMsg = 'Les éléments du carrousel ne sont pas un tableau valide';
            console.error(`[saveCarouselItems] ERREUR: ${errorMsg}`, carouselItems);
            throw new Error(errorMsg);
        }
        
        // Vérifier que chaque élément a un ID et un ordre valide
        const invalidItems = carouselItems.filter(item => 
            !item.id || typeof item.id === 'undefined' || item.id === null ||
            typeof item.order === 'undefined' || item.order === null
        );
        
        if (invalidItems.length > 0) {
            console.warn('[saveCarouselItems] Certains éléments ont des ID ou ordres invalides:', invalidItems);
        }
        
        // Mettre à jour l'ordre des éléments avant la sauvegarde
        const itemsToSave = updateItemsOrder(false);
        
        // Nettoyer les données avant la sauvegarde (enlever les chemins complets pour économiser de l'espace)
        const cleanedItems = itemsToSave.map(item => {
            const cleanedItem = { ...item };
            
            // Pour les chemins d'images locaux, ne conserver que le nom du fichier
            if (cleanedItem.url && !cleanedItem.url.startsWith('http') && !cleanedItem.url.startsWith('data:')) {
                // Si c'est une URL relative avec le chemin de base, ne garder que la partie relative
                if (CONFIG.baseUrl && cleanedItem.url.startsWith(CONFIG.baseUrl)) {
                    cleanedItem.url = cleanedItem.url.substring(CONFIG.baseUrl.length);
                }
                // Si c'est un chemin absolu commençant par /assets, le laisser tel quel
                else if (!cleanedItem.url.startsWith('/assets')) {
                    // Sinon, extraire uniquement le nom du fichier
                    const fileName = cleanedItem.url.split('/').pop();
                    cleanedItem.url = fileName;
                }
            }
            
            return cleanedItem;
        });
        
        // Utiliser la clé de stockage depuis la configuration
        const storageKey = CONFIG.storageKeys.accueil || 'franchiniCarousel';
        
        // Sauvegarder dans le stockage local
        localStorage.setItem(storageKey, JSON.stringify(cleanedItems));
        console.log('[saveCarouselItems] Éléments nettoyés et sauvegardés avec succès:', cleanedItems);
        
        // Mettre à jour la variable globale avec les données nettoyées
        carouselItems = [...itemsToSave];
        
        return true;
        
    } catch (error) {
        console.error('[saveCarouselItems] Erreur lors de la sauvegarde des éléments:', error);
        
        // Afficher une notification d'erreur si disponible
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Une erreur est survenue lors de la sauvegarde du carrousel',
                'error'
            );
        }
        
        throw error; // Propager l'erreur pour une éventuelle gestion ultérieure
    }
}

/**
 * Initialise les écouteurs d'événements
 */
function initEventListeners() {
    console.log('[initEventListeners] Initialisation des écouteurs d\'événements...');
    
    try {
        // Formulaire d'ajout/modification
        const carouselForm = document.getElementById('carousel-form');
        if (carouselForm) {
            console.log('[initEventListeners] Formulaire trouvé, ajout de l\'écouteur de soumission');
            carouselForm.removeEventListener('submit', handleFormSubmit);
            carouselForm.addEventListener('submit', handleFormSubmit);
        } else {
            console.warn('[initEventListeners] Formulaire non trouvé');
        }
        
        // Gestion de l'aperçu des médias
        const carouselMediaInput = document.getElementById('carousel-media');
        const imageInputGroup = document.getElementById('image-input-group');
        const imagePreviewContainer = document.getElementById('image-preview-container');
        const imagePreview = document.getElementById('image-preview');
        const videoPreviewContainer = document.getElementById('video-preview-container');
        const videoPreview = document.getElementById('video-preview');
        
        if (carouselMediaInput && imageInputGroup) {
            console.log('[initEventListeners] Configuration du téléversement de fichiers');
            
            // Supprimer les anciens écouteurs pour éviter les doublons
            const newInput = carouselMediaInput.cloneNode(true);
            carouselMediaInput.parentNode.replaceChild(newInput, carouselMediaInput);
            
            // Ajouter l'écouteur pour la sélection de fichier
            newInput.addEventListener('change', handleMediaPreview);
            
            // Configurer la zone de dépôt
            const dropZone = newInput.closest('.drop-zone') || newInput.parentElement;
            
            // Fonction pour gérer le survol de la zone de dépôt
            const handleDragOver = (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('drag-over');
                console.log('[initEventListeners] Fichier survolé');
            };
            
            // Fonction pour gérer la sortie de la zone de dépôt
            const handleDragLeave = (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('drag-over');
                console.log('[initEventListeners] Fin du survol');
            };
            
            // Fonction pour gérer le dépôt de fichier
            const handleDrop = (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('drag-over');
                console.log('[initEventListeners] Fichier déposé');

                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const file = e.dataTransfer.files[0];
                    const mediaType = document.getElementById('media-type').value;
                    
                    // Vérifier le type de fichier en fonction du type de média sélectionné
                    if (mediaType === 'image' && !file.type.startsWith('image/')) {
                        console.warn('[initEventListeners] Type de fichier non supporté:', file.type);
                        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                            AdminCommon.showNotification('Veuvez sélectionner un fichier image valide (JPEG, PNG, etc.)', 'warning');
                        }
                        return;
                    } else if (mediaType === 'video' && !file.type.startsWith('video/')) {
                        console.warn('[initEventListeners] Type de fichier non supporté:', file.type);
                        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                            AdminCommon.showNotification('Veuvez sélectionner un fichier vidéo valide (MP4, WebM, etc.)', 'warning');
                        }
                        return;
                    }
                    
                    // Mettre à jour l'input file avec le fichier déposé
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    newInput.files = dataTransfer.files;
                    
                    // Déclencher l'événement change manuellement
                    const event = new Event('change');
                    newInput.dispatchEvent(event);
                    
                    console.log(`[initEventListeners] Fichier déposé:`, file.name);
                }
            };
            
            // Ajouter les écouteurs d'événements
            dropZone.addEventListener('dragover', handleDragOver);
            dropZone.addEventListener('dragleave', handleDragLeave);
            dropZone.addEventListener('drop', handleDrop);
            
            // Nettoyer les écouteurs si nécessaire
            newInput.cleanupDragEvents = () => {
                dropZone.removeEventListener('dragover', handleDragOver);
                dropZone.removeEventListener('dragleave', handleDragLeave);
                dropZone.removeEventListener('drop', handleDrop);
            };
            
            // Gestion du changement de type de média
            const mediaTypeSelect = document.getElementById('media-type');
            const imageInputGroup = document.getElementById('image-input-group');
            const videoInputGroup = document.getElementById('video-input-group');
            
            if (mediaTypeSelect && imageInputGroup && videoInputGroup) {
                console.log('[initEventListeners] Configuration du sélecteur de type de média');
                
                const updateMediaType = () => {
                    const mediaType = mediaTypeSelect.value;
                    console.log(`[initEventListeners] Type de média changé: ${mediaType}`);
                    
                    // Afficher/masquer les groupes d'entrée appropriés
                    if (mediaType === 'image') {
                        imageInputGroup.style.display = 'block';
                        videoInputGroup.style.display = 'none';
                    } else if (mediaType === 'video') {
                        imageInputGroup.style.display = 'none';
                        videoInputGroup.style.display = 'block';
                    }
                    
                    // Mettre à jour l'aperçu
                    handleMediaPreview();
                };
                
                // Ajouter l'écouteur d'événements
                mediaTypeSelect.removeEventListener('change', updateMediaType); // Éviter les doublons
                mediaTypeSelect.addEventListener('change', updateMediaType);
                
                // Déclencher l'événement change pour l'état initial
                updateMediaType();
            }
        } else {
            console.warn("[initEventListeners] Éléments pour le téléversement d'image introuvables.");
        }
        
        // Bouton d'ajout d'élément
        const addCarouselBtn = document.getElementById('add-carousel-btn');
        if (addCarouselBtn) {
            console.log('[initEventListeners] Bouton d\'ajout trouvé, ajout de l\'écouteur de clic');
            addCarouselBtn.removeEventListener('click', showCarouselModal);
            addCarouselBtn.addEventListener('click', showCarouselModal);
        } else {
            console.warn('[initEventListeners] Bouton d\'ajout non trouvé');
        }
        
        // Sélecteur de type de média
        const mediaTypeSelect = document.getElementById('media-type');
        if (mediaTypeSelect) {
            console.log('[initEventListeners] Sélecteur de type de média trouvé, ajout de l\'écouteur de changement');
            mediaTypeSelect.removeEventListener('change', toggleMediaInput);
            mediaTypeSelect.addEventListener('change', toggleMediaInput);
        } else {
            console.warn('[initEventListeners] Sélecteur de type de média non trouvé');
        }
        
        // Gestionnaire de téléchargement d'image
        const imageUpload = document.getElementById('image-upload');
        if (imageUpload) {
            console.log('[initEventListeners] Champ de téléchargement d\'image trouvé, ajout de l\'écouteur de changement');
            imageUpload.removeEventListener('change', handleImageUpload);
            imageUpload.addEventListener('change', handleImageUpload);
        } else {
            console.warn('[initEventListeners] Champ de téléchargement d\'image non trouvé');
        }
        
        console.log('[initEventListeners] Initialisation des écouteurs d\'événements terminée');
    } catch (error) {
        console.error('[initEventListeners] Erreur lors de l\'initialisation des écouteurs:', error);
        throw error; // Propager l'erreur
    }
}

/**
 * Affiche les éléments du carrousel dans l'interface
 * @returns {boolean} True si le rendu s'est bien passé, false sinon
 */
function renderCarouselItems() {
    console.log('[renderCarouselItems] === DÉBUT DU RENDU DES ÉLÉMENTS ===');
    
    try {
        // Vérifier que carouselItems est défini et est un tableau
        if (!Array.isArray(carouselItems)) {
            console.error('[renderCarouselItems] ERREUR: carouselItems n\'est pas un tableau:', carouselItems);
            throw new Error('Les éléments du carrousel ne sont pas valides');
        }
        
        console.log(`[renderCarouselItems] Nombre d'éléments à afficher: ${carouselItems.length}`);
        
        // Récupérer le conteneur parent
        const container = document.getElementById('carousel-items-container');
        if (!container) {
            console.error('[renderCarouselItems] ERREUR: Conteneur d\'éléments non trouvé dans le DOM');
            throw new Error('Impossible de trouver le conteneur des éléments du carrousel');
        }
        
        console.log('[renderCarouselItems] Conteneur trouvé avec succès');
        
        // Trier les éléments par ordre
        const sortedItems = [...carouselItems].sort((a, b) => {
            const orderA = typeof a.order === 'number' ? a.order : 0;
            const orderB = typeof b.order === 'number' ? b.order : 0;
            return orderA - orderB;
        });
        
        console.log('[renderCarouselItems] Éléments triés par ordre:', sortedItems);
        
        // Créer un fragment de document pour améliorer les performances
        const fragment = document.createDocumentFragment();
        console.log('[renderCarouselItems] Fragment de document créé');
        
        // Vérifier s'il y a des éléments à afficher
        if (sortedItems.length === 0) {
            console.log('[renderCarouselItems] Aucun élément à afficher, création du message d\'information');
            
            const infoMessage = document.createElement('div');
            infoMessage.className = 'alert alert-info';
            infoMessage.textContent = 'Aucun élément dans le carrousel. Cliquez sur "Ajouter un élément" pour commencer.';
            
            fragment.appendChild(infoMessage);
            console.log('[renderCarouselItems] Message d\'information créé');
            
        } else {
            console.log(`[renderCarouselItems] Création de ${sortedItems.length} éléments...`);
            
            // Créer les éléments du carrousel
            sortedItems.forEach((item, index) => {
                try {
                    console.log(`[renderCarouselItems] Traitement de l'élément ${index + 1}/${sortedItems.length}:`, item);
                    
                    // Vérifier que l'élément a un ID
                    if (!item.id) {
                        console.warn(`[renderCarouselItems] Élément sans ID détecté à l'index ${index}, génération d'un ID`);
                        item.id = `item-${Date.now()}-${index}`;
                    }
                    
                    // Créer l'élément de la carte
                    const itemElement = document.createElement('li');
                    itemElement.className = 'carousel-item-draggable';
                    itemElement.draggable = true;
                    itemElement.dataset.id = item.id;
                    itemElement.setAttribute('role', 'option');
                    itemElement.setAttribute('aria-grabbed', 'false');
                    
                    // Ajouter des attributs ARIA pour l'accessibilité
                    itemElement.setAttribute('aria-label', `Élément: ${item.title || 'Sans titre'}`);
                    itemElement.setAttribute('aria-describedby', `item-desc-${item.id}`);
                    
                    // Stocker l'ordre actuel comme attribut pour le suivi
                    itemElement.dataset.order = index;
                    
                    console.log(`[renderCarouselItems] Création de l'élément avec l'ID: ${item.id}`);
                    
                    // Définir le contenu HTML de l'élément
                    itemElement.innerHTML = `
                        <div class="card-body d-flex align-items-center">
                            <div class="drag-handle me-3" style="cursor: move;">
                                <i class="fas fa-arrows-alt-v"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h5 class="card-title mb-1">${item.title || 'Sans titre'}</h5>
                                <p class="card-text text-muted small mb-0">
                                    ${item.description || 'Aucune description'}
                                </p>
                            </div>
                            <div class="ms-3">
                                <div class="form-check form-switch mb-0 me-3">
                                    <input class="form-check-input toggle-item" type="checkbox" 
                                           ${item.isActive ? 'checked' : ''} 
                                           data-id="${item.id}">
                                </div>
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-primary edit-item" data-id="${item.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger delete-item" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    
                    // Ajouter l'élément au fragment
                    fragment.appendChild(itemElement);
                    console.log(`[renderCarouselItems] Élément ${item.id} ajouté au fragment`);
                    
                } catch (itemError) {
                    console.error(`[renderCarouselItems] Erreur lors du traitement de l'élément ${index}:`, itemError, item);
                    // Continuer avec les éléments suivants même en cas d'erreur
                }
            });
        }
        
        // Vider le conteneur et ajouter le fragment
        console.log('[renderCarouselItems] Vidage du conteneur...');
        container.innerHTML = '';
        console.log('[renderCarouselItems] Ajout du fragment au conteneur...');
        container.appendChild(fragment);
        
        console.log('[renderCarouselItems] Initialisation des écouteurs d\'événements...');
        
        // Initialiser les écouteurs d'événements
        initDragAndDropListeners();
        
        // Ajouter les écouteurs pour les boutons d'édition et de suppression
        document.querySelectorAll('.edit-item').forEach(btn => {
            const itemId = btn.dataset.id;
            if (itemId) {
                btn.addEventListener('click', () => editCarouselItem(itemId));
                console.log(`[renderCarouselItems] Écouteur d'édition ajouté pour l'élément ${itemId}`);
            }
        });
        
        document.querySelectorAll('.delete-item').forEach(btn => {
            const itemId = btn.dataset.id;
            if (itemId) {
                btn.addEventListener('click', () => confirmDeleteItem(itemId));
                console.log(`[renderCarouselItems] Écouteur de suppression ajouté pour l'élément ${itemId}`);
            }
        });
        
        // Ajouter les écouteurs pour les interrupteurs d'activation/désactivation
        document.querySelectorAll('.toggle-item').forEach(toggle => {
            const itemId = toggle.dataset.id;
            if (itemId) {
                toggle.addEventListener('change', (e) => toggleCarouselItem(itemId, e.target.checked));
                console.log(`[renderCarouselItems] Écouteur de bascule ajouté pour l'élément ${itemId}`);
            }
        });
        
        console.log('[renderCarouselItems] === FIN DU RENDU AVEC SUCCÈS ===');
        return true;
        
    } catch (error) {
        console.error('[renderCarouselItems] ERREUR CRITIQUE lors du rendu des éléments:', error);
        
        // Afficher un message d'erreur dans l'interface
        const container = document.getElementById('carousel-items-container');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <h5 class="alert-heading">Erreur lors du chargement du carrousel</h5>
                    <p class="mb-0">Une erreur est survenue lors de l'affichage des éléments du carrousel.</p>
                    <hr>
                    <p class="small mb-0">${error.message || 'Détails non disponibles'}</p>
                </div>
            `;
        }
        
        // Afficher une notification d'erreur si possible
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Une erreur est survenue lors de l\'affichage du carrousel',
                'error'
            );
        }
        
        return false;
    }
}

/**
 * Gère l'aperçu des médias (images et vidéos) lors de la sélection d'un fichier
 * @param {Event} e - L'événement de changement de fichier
 */
function handleMediaPreview(e) {
    console.log('[handleMediaPreview] Début de la gestion de l\'aperçu du média');
    
    const fileInput = e.target;
    const file = fileInput.files[0];
    const mediaType = document.getElementById('media-type').value;
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const videoPreviewContainer = document.getElementById('video-preview-container');
    const videoPreview = document.getElementById('video-preview');
    
    // Masquer tous les conteneurs d'aperçu par défaut
    if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
    if (videoPreviewContainer) videoPreviewContainer.style.display = 'none';
    
    // Vérifier si un fichier a été sélectionné
    if (!file) {
        console.log('[handleMediaPreview] Aucun fichier sélectionné');
        return;
    }
    
    console.log(`[handleMediaPreview] Fichier sélectionné: ${file.name}, Type: ${file.type}`);
    
    // Vérifier le type de média
    if (mediaType === 'image') {
        // Vérifier si le fichier est une image
        if (!file.type.startsWith('image/')) {
            console.warn('[handleMediaPreview] Le fichier sélectionné n\'est pas une image valide');
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification('Veuvez sélectionner un fichier image valide (JPEG, PNG, etc.)', 'warning');
            }
            fileInput.value = ''; // Réinitialiser l'input
            return;
        }
        
        // Créer un aperçu de l'image
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('[handleMediaPreview] Aperçu de l\'image généré avec succès');
            if (imagePreview) {
                imagePreview.src = e.target.result;
                if (imagePreviewContainer) {
                    imagePreviewContainer.style.display = 'block';
                }
            }
        };
        reader.onerror = function() {
            console.error('[handleMediaPreview] Erreur lors de la lecture du fichier image');
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification('Erreur lors de la lecture du fichier image', 'error');
            }
        };
        reader.readAsDataURL(file);
    } else if (mediaType === 'video') {
        // Pour les vidéos, on peut créer un aperçu vidéo
        if (!file.type.startsWith('video/')) {
            console.warn('[handleMediaPreview] Le fichier sélectionné n\'est pas une vidéo valide');
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification('Veuvez sélectionner un fichier vidéo valide (MP4, WebM, etc.)', 'warning');
            }
            fileInput.value = ''; // Réinitialiser l'input
            return;
        }
        
        // Créer un aperçu de la vidéo
        const videoURL = URL.createObjectURL(file);
        
        if (videoPreview) {
            // Vider le conteneur vidéo
            videoPreview.innerHTML = '';
            
            // Créer un élément vidéo
            const videoElement = document.createElement('video');
            videoElement.controls = true;
            videoElement.src = videoURL;
            videoElement.style.maxWidth = '100%';
            videoElement.style.maxHeight = '300px';
            
            videoPreview.appendChild(videoElement);
            videoPreviewContainer.style.display = 'block';
            
            console.log('[handleMediaPreview] Aperçu de la vidéo généré avec succès');
        }
    }
}

/**
 * Gère la soumission du formulaire
 * @param {Event} e - L'événement de soumission
 */
async function handleFormSubmit(e) {
    console.log('[handleFormSubmit] Début de la fonction handleFormSubmit');
    
    let form;
    let submitButton;
    let originalButtonText;
    
    try {
        console.log('[handleFormSubmit] Événement reçu:', e);
        
        // Vérifier que l'événement est valide
        if (!e) {
            console.error('[handleFormSubmit] ERREUR: L\'événement est null ou non défini');
            throw new Error('Événement de formulaire invalide');
        }
        
        // Empêcher le comportement par défaut du formulaire
        if (e.preventDefault) {
            e.preventDefault();
            console.log('[handleFormSubmit] Comportement par défaut du formulaire empêché');
        } else {
            console.warn('[handleFormSubmit] Impossible d\'empêcher le comportement par défaut - méthode preventDisplay non disponible');
        }
        
        // Récupérer le formulaire
        form = e.target || document.getElementById('carousel-form');
        console.log('[handleFormSubmit] Formulaire trouvé:', form);
        
        if (!form) {
            const errorMsg = 'Impossible de trouver le formulaire';
            console.error(`[handleFormSubmit] ERREUR: ${errorMsg}`);
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification(errorMsg, 'error');
            }
            throw new Error(errorMsg);
        }
        
        // Récupérer le bouton de soumission
        submitButton = form.querySelector('button[type="submit"]');
        console.log('[handleFormSubmit] Bouton de soumission (première tentative):', submitButton);
        
        // Essayer d'autres sélecteurs si nécessaire
        const buttonSelectors = [
            'button[type="submit"]',
            '.btn-primary[type="submit"]',
            'button[type="submit"], .btn-primary',
            'button:not([type]), button[type="button"]',
            '.btn',
            'button'
        ];
        
        let selectorIndex = 1;
        while (!submitButton && selectorIndex < buttonSelectors.length) {
            console.log(`[handleFormSubmit] Tentative de sélection du bouton avec le sélecteur: ${buttonSelectors[selectorIndex]}`);
            submitButton = form.querySelector(buttonSelectors[selectorIndex]);
            if (submitButton) {
                console.log(`[handleFormSubmit] Bouton trouvé avec le sélecteur ${buttonSelectors[selectorIndex]}:`, submitButton);
            }
            selectorIndex++;
        }
        
        // Si on n'a toujours pas trouvé de bouton, essayer de chercher dans le document
        if (!submitButton) {
            console.log('[handleFormSubmit] Aucun bouton trouvé dans le formulaire, recherche dans le document...');
            
            for (const selector of buttonSelectors) {
                const buttons = Array.from(document.querySelectorAll(selector));
                const formButtons = buttons.filter(btn => form.contains(btn));
                
                if (formButtons.length > 0) {
                    submitButton = formButtons[0];
                    console.log(`[handleFormSubmit] Bouton trouvé dans le document avec le sélecteur ${selector}:`, submitButton);
                    break;
                }
            }
        }
        
        // Si on n'a toujours pas trouvé de bouton, lever une erreur
        if (!submitButton) {
            const errorMsg = 'Impossible de trouver le bouton de soumission';
            console.error(`[handleFormSubmit] ERREUR: ${errorMsg}`);
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification(errorMsg, 'error');
            }
            throw new Error(errorMsg);
        }
        
        // Sauvegarder le texte original du bouton
        originalButtonText = submitButton.innerHTML;
        console.log('[handleFormSubmit] Texte original du bouton:', originalButtonText);
        
        // Sauvegarder l'état du bouton
        submitButton.setAttribute('data-original-html', originalButtonText);
        
        // Désactiver le bouton et afficher un indicateur de chargement
        try {
            console.log('[handleFormSubmit] Désactivation du bouton et affichage du spinner...');
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Traitement en cours...';
            console.log('[handleFormSubmit] Bouton désactivé avec succès');
        } catch (buttonError) {
            console.error('[handleFormSubmit] Erreur lors de la désactivation du bouton:', buttonError);
            // Ne pas bloquer le processus si la désactivation du bouton échoue
        }
        
        console.log('[handleFormSubmit] Bouton désactivé et indicateur de chargement affiché');
        
        // Vérifier que le bouton est bien désactivé
        console.log('[handleFormSubmit] État du bouton après désactivation:', {
            disabled: submitButton.disabled,
            innerHTML: submitButton.innerHTML,
            classList: submitButton.classList.toString()
        });
        
        // Préparer les données du formulaire
        console.log('[handleFormSubmit] Préparation des données du formulaire');
        const formData = new FormData(form);
        const itemId = form.dataset.itemId || Date.now().toString();
        const mediaType = formData.get('media-type');
        
        console.log('[handleFormSubmit] ID de l\'élément:', itemId);
        console.log('[handleFormSubmit] Type de média:', mediaType);
        
        // Vérifier si une URL ou un fichier a été fourni
        const imageUrl = formData.get('image-url');
        const imageUpload = document.getElementById('image-upload');
        const imageFile = imageUpload ? imageUpload.files[0] : null;
        
        console.log('[handleFormSubmit] URL de l\'image:', imageUrl);
        console.log('[handleFormSubmit] Fichier image:', imageFile);
        
        if (mediaType === 'image' && !imageUrl && !imageFile) {
            console.error('[handleFormSubmit] Aucune image fournie');
            throw new Error('Veuillez sélectionner une image ou fournir une URL');
        }
        
        // Gérer l'upload du fichier si nécessaire
        let finalImageUrl = imageUrl;
        if (imageFile) {
            // Ici, vous devriez implémenter la logique d'upload réelle
            // Pour l'instant, on utilise un faux délai pour simuler l'upload
            await new Promise(resolve => setTimeout(resolve, 1000));
            // En production, utilisez votre API d'upload ici
            // finalImageUrl = await uploadImage(imageFile);
        }
        
        // Créer ou mettre à jour l'élément
        const itemIndex = carouselItems.findIndex(item => item.id.toString() === itemId);
        const newItem = {
            id: itemId,
            type: mediaType,
            title: formData.get('title') || 'Sans titre',
            description: formData.get('description') || '',
            buttonText: formData.get('button-text') || 'En savoir plus',
            buttonUrl: formData.get('button-url') || '#',
            isActive: formData.get('is-active') === 'on',
            order: itemIndex >= 0 ? carouselItems[itemIndex].order : carouselItems.length,
            // Gérer l'URL du média en fonction du type
            ...(mediaType === 'image' 
                ? { imageUrl: finalImageUrl || '' }
                : { videoUrl: formData.get('video-url') || '' })
        };
        
        // Mettre à jour ou ajouter l'élément
        if (itemIndex >= 0) {
            console.log('[handleFormSubmit] Mise à jour de l\'élément existant à l\'index', itemIndex);
            carouselItems[itemIndex] = newItem;
        } else {
            console.log('[handleFormSubmit] Ajout d\'un nouvel élément');
            carouselItems.push(newItem);
        }
        
        console.log('Sauvegarde des modifications...');
        
        // Sauvegarder et rafraîchir l'affichage
        saveCarouselItems();
        console.log('Éléments sauvegardés:', carouselItems);
        
        renderCarouselItems();
        console.log('Affichage mis à jour');
        
        // Fermer la modal
        const modalElement = document.getElementById('carousel-modal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            console.log('Fermeture de la modal');
            modal.hide();
        } else {
            console.warn('Impossible de trouver l\'instance de la modal');
        }
        
        // Afficher une notification
        const message = `Élément ${itemIndex >= 0 ? 'mis à jour' : 'ajouté'} avec succès`;
        console.log('Affichage de la notification:', message);
        AdminCommon.showNotification(message, 'success');
        
        // Réinitialiser le formulaire
        console.log('Réinitialisation du formulaire');
        resetForm();
        
        console.log('Traitement terminé avec succès');
        
    } catch (error) {
        console.error('[handleFormSubmit] Erreur lors de la soumission du formulaire :', error);
        
        // Afficher l'erreur dans la console pour le débogage
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        
        // Afficher une notification d'erreur
        AdminCommon.showNotification(
            error.message || 'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.',
            'error'
        );
    } finally {
        console.log('[handleFormSubmit] Nettoyage final');
        
        // Réactiver le bouton dans tous les cas
        if (submitButton) {
            console.log('[handleFormSubmit] Réactivation du bouton');
            submitButton.disabled = false;
            
            // Restaurer le texte original du bouton ou utiliser une valeur par défaut
            const originalHtml = submitButton.getAttribute('data-original-html') || 'Enregistrer';
            submitButton.innerHTML = originalHtml;
            
            // Nettoyer l'attribut personnalisé
            submitButton.removeAttribute('data-original-html');
        } else {
            console.warn('[handleFormSubmit] Impossible de trouver le bouton de soumission pour le réactiver');
        }
    }
}

/**
 * Réinitialise le formulaire
 */
function resetForm() {
    console.log('[resetForm] Réinitialisation du formulaire');
    
    const form = document.getElementById('carousel-form');
    
    // Réinitialiser les aperçus
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const videoPreviewContainer = document.getElementById('video-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const videoPreview = document.getElementById('video-preview');
    
    if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
    if (videoPreviewContainer) videoPreviewContainer.style.display = 'none';
    if (imagePreview) imagePreview.src = '#';
    if (videoPreview) videoPreview.src = '';
    
    // Réinitialiser l'input de fichier
    const carouselMediaInput = document.getElementById('carousel-media');
    if (carouselMediaInput) {
        carouselMediaInput.value = '';
    }
    if (!form) {
        console.warn('[resetForm] Formulaire introuvable');
        return;
    }
    
    try {
        console.log('[resetForm] Réinitialisation des champs du formulaire');
        form.reset();
        form.removeAttribute('data-item-id');
        
        // Réinitialiser la prévisualisation de l'image
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
            console.log('[resetForm] Réinitialisation de l\'aperçu de l\'image');
            imagePreview.style.display = 'none';
            imagePreview.src = '';
        } else {
            console.warn('[resetForm] Aperçu de l\'image introuvable');
        }
        
        // Réinitialiser le type de média
        const mediaType = document.getElementById('media-type');
        if (mediaType) {
            console.log('[resetForm] Réinitialisation du type de média');
            mediaType.value = 'image';
            toggleMediaInput();
        } else {
            console.warn('[resetForm] Sélecteur de type de média introuvable');
        }
        
        console.log('[resetForm] Formulaire réinitialisé avec succès');
    } catch (error) {
        console.error('[resetForm] Erreur lors de la réinitialisation du formulaire:', error);
    }
}

/**
 * Bascule entre les champs d'entrée d'image et de vidéo
 */
function toggleMediaInput() {
    const mediaType = document.getElementById('media-type').value;
    const imageInputGroup = document.getElementById('image-input-group');
    const videoInputGroup = document.getElementById('video-input-group');
    
    if (mediaType === 'image') {
        if (imageInputGroup) imageInputGroup.style.display = 'block';
        if (videoInputGroup) videoInputGroup.style.display = 'none';
    } else {
        if (imageInputGroup) imageInputGroup.style.display = 'none';
        if (videoInputGroup) videoInputGroup.style.display = 'block';
    }
}

/**
 * Gère le téléchargement d'image
 * @param {Event} e - L'événement de changement de fichier
 * @returns {void}
 */
function handleImageUpload(e) {
    try {
        // Vérifier que l'événement et la cible existent
        if (!e || !e.target) {
            console.error('[handleImageUpload] Événement ou cible non défini');
            return;
        }
        
        // Récupérer le fichier sélectionné
        const file = e.target.files && e.target.files[0];
        if (!file) {
            console.log('[handleImageUpload] Aucun fichier sélectionné');
            return;
        }
        
        // Vérifier le type de fichier (images uniquement)
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            console.warn(`[handleImageUpload] Type de fichier non pris en charge: ${file.type}`);
            
            // Afficher un message d'erreur à l'utilisateur
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification(
                    'Veuillez sélectionner une image valide (JPEG, PNG, GIF, WebP)',
                    'error'
                );
            } else {
                alert('Veuillez sélectionner une image valide (JPEG, PNG, GIF, WebP)');
            }
            
            // Réinitialiser le champ de fichier
            e.target.value = '';
            return;
        }
        
        // Vérifier la taille du fichier (max 5 Mo)
        const maxSize = 5 * 1024 * 1024; // 5 Mo en octets
        if (file.size > maxSize) {
            console.warn(`[handleImageUpload] Fichier trop volumineux: ${(file.size / (1024 * 1024)).toFixed(2)} Mo`);
            
            // Afficher un message d'erreur à l'utilisateur
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification(
                    'L\'image est trop volumineuse (max 5 Mo)',
                    'error'
                );
            } else {
                alert('L\'image est trop volumineuse (max 5 Mo)');
            }
            
            // Réinitialiser le champ de fichier
            e.target.value = '';
            return;
        }
        
        console.log(`[handleImageUpload] Traitement de l'image: ${file.name} (${(file.size / 1024).toFixed(2)} Ko)`);
        
        // Lire et afficher l'aperçu de l'image
        const reader = new FileReader();
        
        // Gérer le chargement réussi
        reader.onload = (event) => {
            try {
                const imagePreview = document.getElementById('image-preview');
                if (imagePreview) {
                    imagePreview.src = event.target.result;
                    imagePreview.style.display = 'block';
                    console.log('[handleImageUpload] Aperçu de l\'image mis à jour');
                }
                
                // Mettre à jour le champ URL de l'image avec l'image encodée en base64
                // Note: En production, vous devriez uploader le fichier sur un serveur
                // et utiliser l'URL retournée plutôt que l'image encodée en base64
                const imageUrlInput = document.querySelector('[name="image-url"]');
                if (imageUrlInput) {
                    imageUrlInput.value = event.target.result;
                    console.log('[handleImageUpload] Champ URL de l\'image mis à jour avec les données base64');
                }
                
            } catch (previewError) {
                console.error('[handleImageUpload] Erreur lors de l\'affichage de l\'aperçu:', previewError);
                
                // Afficher un message d'erreur à l'utilisateur
                if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                    AdminCommon.showNotification(
                        'Erreur lors de l\'affichage de l\'aperçu de l\'image',
                        'error'
                    );
                }
            }
        };
        
        // Gérer les erreurs de lecture
        reader.onerror = (error) => {
            console.error('[handleImageUpload] Erreur lors de la lecture du fichier:', error);
            
            // Afficher un message d'erreur à l'utilisateur
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification(
                    'Erreur lors de la lecture du fichier',
                    'error'
                );
            } else {
                alert('Erreur lors de la lecture du fichier');
            }
            
            // Réinitialiser le champ de fichier
            e.target.value = '';
        };
        
        // Démarrer la lecture du fichier
        reader.readAsDataURL(file);
        
    } catch (error) {
        console.error('[handleImageUpload] Erreur inattendue lors du traitement de l\'image:', error);
        
        // Afficher un message d'erreur à l'utilisateur
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Une erreur est survenue lors du traitement de l\'image',
                'error'
            );
        } else {
            alert('Une erreur est survenue lors du traitement de l\'image');
        }
        
        // Réinitialiser le champ de fichier en cas d'erreur
        if (e && e.target) {
            e.target.value = '';
        }
    }
}

/**
 * Édite un élément du carrousel
 * @param {string} itemId - L'ID de l'élément à éditer
 * @returns {boolean} True si l'édition a pu être initialisée, false sinon
 */
function editCarouselItem(itemId) {
    try {
        // Vérifier que l'ID est valide
        if (!itemId) {
            console.error('[editCarouselItem] ID d\'élément non fourni');
            return false;
        }
        
        // Trouver l'élément à éditer
        const item = carouselItems.find(item => item && item.id && item.id.toString() === itemId.toString());
        if (!item) {
            console.error(`[editCarouselItem] Aucun élément trouvé avec l'ID: ${itemId}`);
            
            // Afficher une notification d'erreur si disponible
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification(
                    'Erreur: élément introuvable',
                    'error'
                );
            }
            return false;
        }
        
        // Récupérer le formulaire
        const form = document.getElementById('carousel-form');
        if (!form) {
            console.error('[editCarouselItem] Formulaire non trouvé');
            return false;
        }
        
        // Remplir le formulaire avec les données de l'élément
        try {
            // Définir l'ID de l'élément comme attribut de données
            form.dataset.itemId = item.id;
            
            // Remplir les champs du formulaire avec des valeurs par défaut sécurisées
            const safeValue = (value, defaultValue = '') => {
                return (value !== null && value !== undefined) ? value : defaultValue;
            };
            
            // Remplir les champs du formulaire
            const titleInput = form.querySelector('[name="title"]');
            const descriptionInput = form.querySelector('[name="description"]');
            const buttonTextInput = form.querySelector('[name="button-text"]');
            const buttonUrlInput = form.querySelector('[name="button-url"]');
            const isActiveInput = form.querySelector('[name="is-active"]');
            const mediaTypeInput = form.querySelector('[name="media-type"]');
            
            if (titleInput) titleInput.value = safeValue(item.title);
            if (descriptionInput) descriptionInput.value = safeValue(item.description);
            if (buttonTextInput) buttonTextInput.value = safeValue(item.buttonText, 'En savoir plus');
            if (buttonUrlInput) buttonUrlInput.value = safeValue(item.buttonUrl, '#');
            if (isActiveInput) isActiveInput.checked = Boolean(item.isActive);
            if (mediaTypeInput) mediaTypeInput.value = safeValue(item.type, 'image');
            
            // Gérer le type de média
            toggleMediaInput();
            
            // Remplir l'URL du média approprié
            const mediaType = item.type || 'image';
            
            if (mediaType === 'image' && item.imageUrl) {
                const imageUrlInput = form.querySelector('[name="image-url"]');
                if (imageUrlInput) imageUrlInput.value = safeValue(item.imageUrl);
                
                const imagePreview = document.getElementById('image-preview');
                if (imagePreview) {
                    imagePreview.src = item.imageUrl;
                    imagePreview.style.display = 'block';
                }
            } else if (mediaType === 'video' && item.videoUrl) {
                const videoUrlInput = form.querySelector('[name="video-url"]');
                if (videoUrlInput) videoUrlInput.value = safeValue(item.videoUrl);
            }
            
            // Mettre à jour le texte du titre de la modale
            const modalTitle = document.getElementById('carousel-modal-label');
            if (modalTitle) {
                modalTitle.textContent = 'Modifier l\'élément du carrousel';
            }
            
            // Afficher la modale
            const modalElement = document.getElementById('carousel-modal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                return true;
            } else {
                console.error('[editCarouselItem] Élément modal non trouvé');
                return false;
            }
            
        } catch (formError) {
            console.error('[editCarouselItem] Erreur lors du remplissage du formulaire:', formError);
            
            // Afficher une notification d'erreur si disponible
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification(
                    'Erreur lors du chargement du formulaire',
                    'error'
                );
            }
            return false;
        }
        
    } catch (error) {
        console.error('[editCarouselItem] Erreur inattendue:', error);
        
        // Afficher une notification d'erreur si disponible
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Une erreur est survenue lors de l\'édition de l\'élément',
                'error'
            );
        }
        return false;
    }
}

/**
 * Demande une confirmation avant de supprimer un élément
 * @param {string} itemId - L'ID de l'élément à supprimer
 * @returns {void}
 */
function confirmDeleteItem(itemId) {
    // Vérifier que l'ID est valide
    if (!itemId) {
        console.error('[confirmDeleteItem] ID d\'élément non fourni');
        
        // Afficher une notification d'erreur si disponible
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Erreur: impossible de supprimer l\'élément (ID manquant)',
                'error'
            );
        } else {
            alert('Erreur: impossible de supprimer l\'élément (ID manquant)');
        }
        return;
    }
    
    // Demander confirmation à l'utilisateur
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.');
    
    if (confirmation) {
        // Tenter de supprimer l'élément
        const success = deleteCarouselItem(itemId);
        
        // Si la suppression a échoué (retourné false), afficher un message d'erreur
        if (!success) {
            if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
                AdminCommon.showNotification(
                    'Erreur lors de la suppression de l\'élément',
                    'error'
                );
            } else {
                alert('Une erreur est survenue lors de la suppression de l\'élément');
            }
        }
    } else {
        console.log(`[confirmDeleteItem] Suppression de l'élément ${itemId} annulée par l'utilisateur`);
    }
}

/**
 * Supprime un élément du carrousel
 * @param {string} itemId - L'ID de l'élément à supprimer
 * @returns {boolean} True si la suppression a réussi, false sinon
 */
function deleteCarouselItem(itemId) {
    try {
        // Vérifier que l'ID est valide
        if (!itemId) {
            console.error('[deleteCarouselItem] ID d\'élément non fourni');
            return false;
        }
        
        // Sauvegarder l'ancienne longueur pour vérifier si un élément a été supprimé
        const oldLength = carouselItems.length;
        
        // Filtrer les éléments pour supprimer celui avec l'ID correspondant
        carouselItems = carouselItems.filter(item => {
            // Vérifier que l'élément et son ID existent avant de comparer
            return !(item && item.id && item.id.toString() === itemId.toString());
        });
        
        // Vérifier si un élément a été supprimé
        if (carouselItems.length === oldLength) {
            console.warn(`[deleteCarouselItem] Aucun élément trouvé avec l'ID: ${itemId}`);
            return false;
        }
        
        // Sauvegarder les modifications
        saveCarouselItems();
        
        // Mettre à jour l'interface utilisateur
        renderCarouselItems();
        
        // Afficher une notification de succès si disponible
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification('Élément supprimé avec succès', 'success');
        }
        
        return true;
        
    } catch (error) {
        console.error('[deleteCarouselItem] Erreur lors de la suppression de l\'élément:', error);
        
        // Afficher une notification d'erreur si disponible
        if (typeof AdminCommon !== 'undefined' && typeof AdminCommon.showNotification === 'function') {
            AdminCommon.showNotification(
                'Une erreur est survenue lors de la suppression de l\'élément',
                'error'
            );
        }
        
        return false;
    }
}

// Les fonctions de gestion du glisser-déposer sont déjà définies plus haut dans le fichier

/**
 * Affiche la modale d'ajout d'élément
 * @returns {void}
 */
function showCarouselModal() {
    const modalElement = document.getElementById('carousel-modal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } else {
        console.error('[showCarouselModal] Élément modal non trouvé');
    }
}

/**
 * Met à jour les attributs ARIA pour les éléments du carrousel
 * @returns {void}
 */
function updateAriaAttributes() {
    const container = document.getElementById('carousel-items-container');
    if (!container) return;

    // Mettre à jour les attributs du conteneur
    container.setAttribute('role', 'listbox');
    container.setAttribute('aria-label', 'Éléments du carrousel');
    container.setAttribute('aria-multiselectable', 'false');

    const items = container.querySelectorAll('.carousel-item');
    const total = items.length;

    items.forEach((item, index) => {
        // Mettre à jour les attributs ARIA
        item.setAttribute('aria-posinset', index + 1);
        item.setAttribute('aria-setsize', total);
        
        // Mettre à jour le texte de l'étiquette pour l'accessibilité
        const positionText = `Élément ${index + 1} sur ${total}`;
        const positionElement = item.querySelector('.position-badge');
        if (positionElement) {
            positionElement.textContent = positionText;
        }
        
        // Ajouter une étiquette ARIA si elle n'existe pas
        if (!item.hasAttribute('aria-label')) {
            const title = item.querySelector('.carousel-item-title');
            if (title) {
                const titleText = title.textContent || 'Élément sans titre';
                item.setAttribute('aria-label', `${titleText}, ${positionText}`);
            } else {
                item.setAttribute('aria-label', `${positionText}`);
            }
        }
    });
}
