// Import initCarousel and YouTubeAPI from carousel.js
import { initCarousel, YouTubeAPI } from './carousel.js';

// Import Firebase functions
import { db, collection, getDocs, query, orderBy } from './auth/firebase-config.js';

// Function to extract YouTube ID
function getYouTubeID(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Function to initialize a YouTube player
async function initYouTubePlayer(container, videoId) {
    if (!container || !videoId) {
        console.error('Missing parameters for initYouTubePlayer');
        return null;
    }
    try {
        await YouTubeAPI.ensureYouTubeIframeAPI();
        if (!document.body.contains(container)) {
            console.warn(`Container for video ${videoId} is no longer in the DOM`);
            return null;
        }
        const iframe = container.querySelector('iframe');
        if (!iframe) {
            console.error('Iframe not found for video ID:', videoId);
            throw new Error('Iframe not found');
        }
        const player = await YouTubeAPI.setupYouTubePlayer(iframe, {
            onEnded: () => {
                const carousel = document.querySelector('#occasions-carousel');
                if (carousel) {
                    const nextBtn = carousel.querySelector('.carousel-next');
                    if (nextBtn) nextBtn.click();
                }
            },
            onPlaying: () => {
                const loadingOverlay = container.querySelector('.youtube-loading');
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
            },
            onError: (error) => {
                console.error(`YouTube player error ${videoId}:`, error);
                showError(container, 'Error loading video');
            }
        });
        if (player) {
            return player;
        } else {
            throw new Error('Failed to create YouTube player');
        }
    } catch (error) {
        console.error(`Error initializing YouTube player ${videoId}:`, error);
        showError(container, 'Could not load video');
        return null;
    }
}

// Function to show error message in container
function showError(container, message) {
    if (!container) return;
    const existingError = container.querySelector('.youtube-error');
    if (existingError) existingError.remove();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'youtube-error';
    errorDiv.style.position = 'absolute';
    errorDiv.style.top = '50%';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translate(-50%, -50%)';
    errorDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px 20px';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.zIndex = '10';
    errorDiv.textContent = message;
    container.style.position = 'relative';
    container.appendChild(errorDiv);
}

// Main async function to initialize the occasions carousel
async function initOccasionsCarousel() {
    console.log('Initializing occasions carousel...');

    const carouselElement = document.querySelector('#occasions-carousel');
    if (!carouselElement) {
        console.error('ERROR: #occasions-carousel element not found');
        return;
    }

    const slider = carouselElement.querySelector('.carousel-slider');
    if (slider) {
        slider.innerHTML = '<div class="loading">Loading occasions...</div>';
    }

    try {
        const q = query(collection(db, 'Occasions'), orderBy('order')); // Assuming 'order' field for sorting
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn('No documents found in "Occasions" collection');
            if (slider) {
                slider.innerHTML = `<div class="carousel-slide active" data-type="image">
                                        <img src="/assets/images/placeholder-occasion.jpg" class="carousel-image" alt="No occasions available">
                                        <div class="carousel-caption">
                                            <h3>Aucune occasion disponible pour le moment.</h3>
                                        </div>
                                    </div>`;
            }
            return;
        }

        let slidesHTML = '';
        let slideIndex = 0;
        const videoIds = [];

        querySnapshot.forEach((doc) => {
            const item = doc.data();
            const isActive = slideIndex === 0 ? 'active' : '';

            if (item.type === 'youtube' && item.mediaUrl) {
                const videoId = getYouTubeID(item.mediaUrl);
                if (videoId) {
                    videoIds.push(videoId);
                    slidesHTML += `
                        <div class="carousel-slide ${isActive}" data-type="youtube">
                            <div class="video-container" data-video-id="${videoId}" style="position: relative; width: 100%; height: 100%;">
                                <div class="youtube-loading">Loading video...</div>
                                <iframe 
                                    src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&rel=0&autoplay=0&mute=1"
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen
                                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                                </iframe>
                            </div>
                            <div class="carousel-caption">
                                <h3>${item.title || ''}</h3>
                                <p>${item.description || ''}</p>
                            </div>
                        </div>`;
                    slideIndex++;
                }
            } else if (item.type === 'image' && item.mediaUrl) {
                slidesHTML += `
                    <div class="carousel-slide ${isActive}" data-type="image">
                        <img src="${item.mediaUrl}" class="carousel-image" alt="${item.title || ''}">
                        <div class="carousel-caption">
                            <h3>${item.title || ''}</h3>
                            <p>${item.description || ''}</p>
                        </div>
                    </div>`;
                slideIndex++;
            }
        });

        if (slider) {
            slider.innerHTML = slidesHTML;

            const carousel = initCarousel({
                selector: '#occasions-carousel',
                autoplay: true,
                autoplayInterval: 5000,
                onSlideChange: (slide) => {
                    // Pause/play YouTube videos on slide change
                    const videoSlide = slide.querySelector('.carousel-slide[data-type="youtube"]');
                    const videoContainer = videoSlide?.querySelector('.video-container');
                    const videoId = videoContainer?.getAttribute('data-video-id');
                    
                    // Stop all other videos
                    videoIds.forEach(id => {
                        if (id !== videoId && window.youtubePlayers && window.youtubePlayers.has(id)) {
                            try {
                                const player = window.youtubePlayers.get(id);
                                if (player.pauseVideo) player.pauseVideo();
                            } catch (e) {
                                console.error('Error pausing video:', e);
                            }
                        }
                    });

                    // Play current video
                    if (videoId && window.youtubePlayers && window.youtubePlayers.has(videoId)) {
                        try {
                            const player = window.youtubePlayers.get(videoId);
                            if (player.playVideo) player.playVideo();
                        } catch (e) {
                            console.error('Error playing video:', e);
                        }
                    }
                }
            });

            // Initialize YouTube players after a short delay
            setTimeout(async () => {
                try {
                    if (videoIds.length > 0) {
                        await YouTubeAPI.ensureYouTubeIframeAPI();
                        const videoContainers = carouselElement.querySelectorAll('.video-container');
                        // Store players globally for easy access in onSlideChange
                        window.youtubePlayers = window.youtubePlayers || new Map(); 
                        for (const container of videoContainers) {
                            const videoId = container.getAttribute('data-video-id');
                            if (videoId) {
                                const player = await initYouTubePlayer(container, videoId);
                                if (player) {
                                    window.youtubePlayers.set(videoId, player);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error initializing YouTube videos:', error);
                }
            }, 500);
        }
        console.log('Occasions carousel initialized successfully');

    } catch (error) {
        console.error('Error initializing occasions carousel:', error);
        if (slider) {
            slider.innerHTML = `<div class="carousel-slide active" data-type="image">
                                    <img src="/assets/images/placeholder-occasion.jpg" class="carousel-image" alt="Error loading occasions">
                                    <div class="carousel-caption">
                                        <h3>Une erreur est survenue lors du chargement des occasions.</h3>
                                    </div>
                                </div>`;
        }
    }
}

// Export for global access if needed (e.g., for debugging)
window.initOccasionsCarousel = initOccasionsCarousel;

// Call the initialization function when the DOM is ready
document.addEventListener('DOMContentLoaded', initOccasionsCarousel);
