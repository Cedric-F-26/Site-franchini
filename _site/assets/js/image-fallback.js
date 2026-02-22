// Gestion des erreurs de chargement d'images
document.addEventListener('DOMContentLoaded', function() {
    // URL de l'image de secours par défaut
    const defaultFallbackImage = '/assets/images/logo/Logo%20Franchini%202.jpg';
    
    // Fonction pour gérer les erreurs de chargement d'images
    function handleImageError(image) {
        // Ne rien faire si l'image a déjà été remplacée
        if (image.dataset.fallbackHandled) return;
        
        // Marquer l'image comme traitée
        image.dataset.fallbackHandled = true;
        
        // Récupérer l'URL de remplacement depuis l'attribut data-fallback
        // ou utiliser l'URL par défaut si non spécifiée
        let fallbackUrl = image.dataset.fallback || defaultFallbackImage;
        
        // S'assurer que l'URL est absolue
        if (!fallbackUrl.startsWith('http') && !fallbackUrl.startsWith('/')) {
            fallbackUrl = '/' + fallbackUrl;
        }
        
        // Remplacer l'image par l'image de secours
        image.src = fallbackUrl;
        
        // Ajouter une classe pour le style si nécessaire
        image.classList.add('image-fallback');
    }
    
    // Écouter les erreurs de chargement d'images
    document.addEventListener('error', function(event) {
        if (event.target.tagName === 'IMG') {
            handleImageError(event.target);
        }
    }, true);
    
    // Vérifier les images déjà chargées
    document.querySelectorAll('img').forEach(function(img) {
        // Si l'image est déjà en erreur
        if (img.complete && img.naturalWidth === 0) {
            handleImageError(img);
        }
    });
});
