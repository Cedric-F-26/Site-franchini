document.addEventListener('DOMContentLoaded', function() {
    const actualitesContainer = document.getElementById('actualites-list');
    if (!actualitesContainer) return;

    const allActualites = JSON.parse(localStorage.getItem('franchiniActualites')) || [];
    allActualites.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (allActualites.length === 0) {
        actualitesContainer.innerHTML = '<div class="no-news"><p>Aucune actualité disponible pour le moment.</p></div>';
        return;
    }

    const actualitesAvecMedia = allActualites.filter(actu => actu.mediaUrl && actu.mediaUrl.trim() !== '');
    const actualitesSansMedia = allActualites.filter(actu => !actu.mediaUrl || actu.mediaUrl.trim() === '');

    let carouselHTML = '';
    if (actualitesAvecMedia.length > 0) {
        const slides = actualitesAvecMedia.map((actu, index) => {
            const videoId = extractYoutubeId(actu.mediaUrl);
            const mediaElement = videoId
                ? `<div class="carousel-video-thumb" onclick="openVideoModal('${actu.mediaUrl}')"><img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="${actu.titre}"><div class="play-icon"></div></div>`
                : `<img src="${actu.mediaUrl}" alt="${actu.titre}" onclick="openImageModal('${actu.mediaUrl}')">`;

            return `
                <div class="carousel-slide ${index === 0 ? 'active' : ''}">
                    ${mediaElement}
                    <div class="carousel-caption">
                        <h3>${actu.titre}</h3>
                        <p>${actu.contenu.substring(0, 100)}...</p>
                    </div>
                </div>
            `;
        }).join('');

        const indicators = actualitesAvecMedia.map((_, index) => 
            `<button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide-to="${index}"></button>`
        ).join('');

        carouselHTML = `
            <div class="carousel-container">
                <div class="carousel-track">${slides}</div>
                <button class="carousel-control prev"><i class="fas fa-chevron-left"></i></button>
                <button class="carousel-control next"><i class="fas fa-chevron-right"></i></button>
                <div class="carousel-indicators">${indicators}</div>
            </div>
        `;
    }

    const gridHTML = actualitesSansMedia.map(actu => `
        <div class="news-card-grid">
            <div class="news-content">
                <h3>${actu.titre}</h3>
                <p class="news-date">Publié le ${formatDate(actu.date)}</p>
                <p>${actu.contenu}</p>
            </div>
        </div>
    `).join('');

    actualitesContainer.innerHTML = `
        ${actualitesAvecMedia.length > 0 ? `
            <h2 class="section-subtitle">Dernières actualités en images</h2>
            ${carouselHTML}
        ` : ''}
        <h2 class="section-subtitle">Toutes les actualités</h2>
        <div class="news-grid">${gridHTML}</div>
    `;

    if (actualitesAvecMedia.length > 1) {
        initCarousel();
    }
});

function extractYoutubeId(url) {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function openVideoModal(videoUrl) {
    const videoId = extractYoutubeId(videoUrl);
    if (!videoId) return;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    modal.querySelector('.modal-content').onclick = (e) => e.stopPropagation();
}

function openImageModal(imageUrl) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="${imageUrl}" alt="Agrandissement">
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    modal.querySelector('img').onclick = (e) => e.stopPropagation();
}

function initCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-control.next');
    const prevButton = document.querySelector('.carousel-control.prev');
    const indicators = document.querySelectorAll('.carousel-indicator');
    if (slides.length <= 1) {
        if(nextButton) nextButton.style.display = 'none';
        if(prevButton) prevButton.style.display = 'none';
        return;
    }

    let currentSlide = 0;

    function moveToSlide(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
        indicators.forEach((indicator, i) => indicator.classList.toggle('active', i === index));
        currentSlide = index;
    }

    nextButton.addEventListener('click', () => {
        moveToSlide((currentSlide + 1) % slides.length);
    });

    prevButton.addEventListener('click', () => {
        moveToSlide((currentSlide - 1 + slides.length) % slides.length);
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => moveToSlide(index));
    });
}
