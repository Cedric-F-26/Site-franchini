// Tableau des vidéos avec leurs IDs et durées (en secondes)
const videos = [
    { id: 'j_EeGikCEt8', duration: 0 }, // Durée sera mise à jour après le chargement
    { id: 'sC4AXwDOFew', duration: 0 },
    { id: 'H3gApB9cgoo', duration: 0 }
];

let players = [];
let currentVideoIndex = 0;
let videoTimeout;

// Fonction appelée par l'API YouTube
function onYouTubeIframeAPIReady() {
    // Créer les lecteurs pour chaque vidéo
    videos.forEach((video, index) => {
        players[index] = new YT.Player(`player${index + 1}`, {
            videoId: video.id,
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'rel': 0,
                'showinfo': 0,
                'modestbranding': 1,
                'playsinline': 1,
                'origin': window.location.origin
            },
            events: {
                'onReady': (event) => onPlayerReady(event, index),
                'onStateChange': (event) => onPlayerStateChange(event, index)
            }
        });
    });
}

// Quand un lecteur est prêt
function onPlayerReady(event, index) {
    // Récupérer la durée de la vidéo
    const duration = event.target.getDuration();
    videos[index].duration = duration * 1000; // Convertir en millisecondes
    
    // Si c'est la première vidéo, on la lance
    if (index === 0) {
        event.target.playVideo();
        showVideo(0);
    }
}

// Quand l'état du lecteur change
function onPlayerStateChange(event, index) {
    // Si la vidéo est terminée
    if (event.data === YT.PlayerState.ENDED) {
        playNextVideo();
    }
}

// Afficher une vidéo spécifique
function showVideo(index) {
    // Mettre à jour l'interface
    document.querySelectorAll('.video-wrapper').forEach((wrapper, i) => {
        if (i === index) {
            wrapper.classList.add('active');
        } else {
            wrapper.classList.remove('active');
        }
    });
    
    // Mettre à jour les points de navigation
    document.querySelectorAll('.dot').forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Mettre à jour l'index de la vidéo courante
    currentVideoIndex = index;
    
    // Arrêter le timer précédent s'il existe
    if (videoTimeout) {
        clearTimeout(videoTimeout);
    }
}

// Lire la vidéo suivante
function playNextVideo() {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    showVideo(nextIndex);
    
    // Démarrer la lecture de la vidéo suivante
    if (players[nextIndex]) {
        players[nextIndex].playVideo();
    }
    
    // Planifier la lecture de la vidéo suivante après la durée de la vidéo actuelle
    videoTimeout = setTimeout(() => {
        if (players[nextIndex] && players[nextIndex].getPlayerState() !== YT.PlayerState.ENDED) {
            players[nextIndex].stopVideo();
            playNextVideo();
        }
    }, videos[nextIndex].duration || 60000); // Par défaut 60 secondes si la durée n'est pas disponible
}

// Gestion des contrôles de navigation
document.addEventListener('DOMContentLoaded', function() {
    // Bouton suivant
    document.querySelector('.carousel-next').addEventListener('click', () => {
        if (players[currentVideoIndex]) {
            players[currentVideoIndex].stopVideo();
        }
        playNextVideo();
    });
    
    // Bouton précédent
    document.querySelector('.carousel-prev').addEventListener('click', () => {
        if (players[currentVideoIndex]) {
            players[currentVideoIndex].stopVideo();
        }
        
        let prevIndex = currentVideoIndex - 1;
        if (prevIndex < 0) prevIndex = videos.length - 1;
        
        showVideo(prevIndex);
        if (players[prevIndex]) {
            players[prevIndex].playVideo();
        }
    });
    
    // Points de navigation
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (players[currentVideoIndex]) {
                players[currentVideoIndex].stopVideo();
            }
            
            showVideo(index);
            if (players[index]) {
                players[index].playVideo();
            }
        });
    });
});
