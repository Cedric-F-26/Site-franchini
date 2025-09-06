document.addEventListener('DOMContentLoaded', function() {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentIndex = 0;
    let players = [];
    let videoTimeout;
    
    // Initialiser le lecteur YouTube pour la première vidéo
    function initYouTubePlayers() {
        // Charger la première vidéo directement
        const firstIframe = document.getElementById('player1');
        players[0] = new YT.Player('player1', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
        
        // Configurer les autres iframes avec des données vides pour le moment
        for (let i = 1; i < videoWrappers.length; i++) {
            const iframe = document.getElementById(`player${i+1}`);
            if (iframe) {
                iframe.src = iframe.dataset.src;
            }
        }
    }
    
    // Quand un lecteur est prêt
    function onPlayerReady(event) {
        // Démarrer la lecture de la première vidéo
        event.target.playVideo();
    }
    
    // Quand l'état du lecteur change
    function onPlayerStateChange(event) {
        // Si la vidéo est terminée, passer à la suivante
        if (event.data === YT.PlayerState.ENDED) {
            goToNextVideo();
        }
    }
    
    // Aller à une vidéo spécifique
    function goToVideo(index) {
        // Mettre à jour l'interface
        videoWrappers.forEach((wrapper, i) => {
            if (i === index) {
                wrapper.classList.add('active');
                
                // Charger le lecteur YouTube si ce n'est pas déjà fait
                if (!players[index] && index > 0) {
                    const iframe = document.getElementById(`player${index+1}`);
                    if (iframe) {
                        players[index] = new YT.Player(`player${index+1}`, {
                            events: {
                                'onReady': (e) => e.target.playVideo(),
                                'onStateChange': onPlayerStateChange
                            }
                        });
                    }
                } else if (players[index]) {
                    players[index].playVideo();
                }
            } else {
                wrapper.classList.remove('active');
                if (players[i]) {
                    players[i].pauseVideo();
                }
            }
        });
        
        // Mettre à jour les points de navigation
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        currentIndex = index;
        
        // Réinitialiser le timer
        resetTimer();
    }
    
    // Aller à la vidéo suivante
    function goToNextVideo() {
        const nextIndex = (currentIndex + 1) % videoWrappers.length;
        goToVideo(nextIndex);
    }
    
    // Aller à la vidéo précédente
    function goToPrevVideo() {
        const prevIndex = (currentIndex - 1 + videoWrappers.length) % videoWrappers.length;
        goToVideo(prevIndex);
    }
    
    // Réinitialiser le timer de défilement automatique
    function resetTimer() {
        if (videoTimeout) {
            clearTimeout(videoTimeout);
        }
        
        // Si ce n'est pas la dernière vidéo, planifier la suivante
        if (currentIndex < videoWrappers.length - 1) {
            // Par défaut, attendre 30 secondes avant de passer à la suivante
            videoTimeout = setTimeout(goToNextVideo, 30000);
        }
    }
    
    // Gestionnaires d'événements
    nextBtn.addEventListener('click', goToNextVideo);
    prevBtn.addEventListener('click', goToPrevVideo);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToVideo(index));
    });
    
    // Initialisation
    if (typeof YT !== 'undefined') {
        initYouTubePlayers();
    } else {
        // Si l'API YouTube n'est pas encore chargée, attendre qu'elle le soit
        window.onYouTubeIframeAPIReady = initYouTubePlayers;
    }
    
    // Démarrer le défilement automatique
    resetTimer();
    
    // Arrêter le défilement automatique lors du survol
    const carousel = document.querySelector('.video-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            if (videoTimeout) clearTimeout(videoTimeout);
        });
        
        carousel.addEventListener('mouseleave', resetTimer);
    }
});
