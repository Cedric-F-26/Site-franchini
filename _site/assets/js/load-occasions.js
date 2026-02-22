document.addEventListener('DOMContentLoaded', function() {
    const occasionsGrid = document.getElementById('occasions-grid');
    const noOccasions = document.getElementById('no-occasions');
    const typeFilterEl = document.getElementById('type-filter');
    const sortFilterEl = document.getElementById('sort-filter');

    // Charger les occasions depuis le localStorage
    const allOccasions = JSON.parse(localStorage.getItem('franchiniMateriels')) || [];

    function renderOccasions() {
        const typeFilter = typeFilterEl.value;
        const sortFilter = sortFilterEl.value;

        let filteredOccasions = allOccasions;

        // Filtrage par type
        if (typeFilter !== 'all') {
            // Le type dans l'admin est 'tracteur' ou 'autre', on mappe 'autre' vers 'materiel'
            const mappedType = typeFilter === 'materiel' ? 'autre' : 'tracteur';
            filteredOccasions = filteredOccasions.filter(item => item.type === mappedType);
        }

        // Tri
        if (sortFilter === 'price-asc') {
            filteredOccasions.sort((a, b) => parseFloat(a.prix) - parseFloat(b.prix));
        } else if (sortFilter === 'price-desc') {
            filteredOccasions.sort((a, b) => parseFloat(b.prix) - parseFloat(a.prix));
        } else if (sortFilter === 'recent') {
            filteredOccasions.sort((a, b) => b.id - a.id); // Tri par ID (similaire à la date d'ajout)
        }

        occasionsGrid.innerHTML = ''; // Vider la grille

        if (filteredOccasions.length === 0) {
            noOccasions.style.display = 'block';
        } else {
            noOccasions.style.display = 'none';
            filteredOccasions.forEach(item => {
                const card = document.createElement('div');
                card.className = 'occasion-card';
                
                // L'admin ne gère pas les images pour les occasions, on utilise un placeholder
                const imageUrl = '/assets/images/placeholder-occasion.jpg';
                const title = `${item.marque} ${item.modele}`;
                const typeLabel = item.type === 'tracteur' ? 'Tracteur' : 'Matériel';

                card.innerHTML = `
                    <div class="occasion-image">
                        <img src="${imageUrl}" alt="${title}">
                    </div>
                    <div class="occasion-details">
                        <span class="occasion-type">${typeLabel}</span>
                        <h3 class="occasion-title">${title}</h3>
                        <div class="occasion-info">
                            <span class="occasion-info-item"><i class="fas fa-calendar-alt"></i> ${item.annee}</span>
                            <span class="occasion-info-item"><i class="fas fa-clock"></i> ${item.heures || 'N/A'} h</span>
                        </div>
                        <div class="occasion-price">${item.prix} € HT</div>
                        <div class="occasion-location"><i class="fas fa-map-marker-alt"></i> Marches (26)</div>
                        <a href="/pages/contact.html" class="occasion-contact">Contacter pour cette occasion</a>
                    </div>
                `;
                occasionsGrid.appendChild(card);
            });
        }
    }

    // Afficher les occasions au chargement
    renderOccasions();

    // Événements de filtrage
    typeFilterEl.addEventListener('change', renderOccasions);
    sortFilterEl.addEventListener('change', renderOccasions);
});
