document.addEventListener('DOMContentLoaded', function() {
    const actualitesForm = document.getElementById('actualites-form');
    const actualitesList = document.getElementById('actualites-list');
    const mediaPreview = document.getElementById('actualite-media-preview');
    let actualites = JSON.parse(localStorage.getItem('franchiniActualites')) || [];

    // Gérer la soumission du formulaire d'actualités
    if (actualitesForm) {
        actualitesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('actualite-id').value;
            const titre = document.getElementById('actualite-titre').value;
            const contenu = document.getElementById('actualite-contenu').value;
            
            const actualite = {
                id: id ? parseInt(id) : Date.now(),
                titre,
                contenu,
                mediaUrl: mediaPreview.querySelector('img, video') ? mediaPreview.querySelector('img, video').src : null,
                date: new Date().toISOString()
            };

            if (id) {
                // Mise à jour
                const index = actualites.findIndex(a => a.id == id);
                if (index > -1) {
                    actualites[index] = actualite;
                }
            } else {
                // Ajout
                actualites.push(actualite);
            }
            
            localStorage.setItem('franchiniActualites', JSON.stringify(actualites));
            updateActualitesList();
            actualitesForm.reset();
            document.getElementById('actualite-id').value = '';
            mediaPreview.innerHTML = '';
        });
    }

    // Mettre à jour la liste des actualités
    function updateActualitesList() {
        if (!actualitesList) return;
        actualitesList.innerHTML = '';
        actualites.sort((a, b) => new Date(b.date) - new Date(a.date)); // Trier par date
        actualites.forEach(actu => {
            const div = document.createElement('div');
            div.className = 'item-card';
            div.innerHTML = `
                <div class="item-card-content">
                    ${actu.mediaUrl ? `<img src="${actu.mediaUrl}" class="item-card-img">` : ''}
                    <h4>${actu.titre}</h4>
                    <p>${actu.contenu.substring(0, 100)}...</p>
                    <small>Publié le ${new Date(actu.date).toLocaleDateString()}</small>
                </div>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="editActualite(${actu.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteActualite(${actu.id})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            actualitesList.appendChild(div);
        });
    }

    // Rendre les fonctions globales pour les utiliser dans le HTML (onclick)
    window.editActualite = function(id) {
        const actu = actualites.find(a => a.id == id);
        if (actu) {
            document.getElementById('actualite-id').value = actu.id;
            document.getElementById('actualite-titre').value = actu.titre;
            document.getElementById('actualite-contenu').value = actu.contenu;
            mediaPreview.innerHTML = actu.mediaUrl ? `<img src="${actu.mediaUrl}" style="max-width: 100px;">` : '';
            actualitesForm.scrollIntoView({ behavior: 'smooth' });
        }
    }

    window.deleteActualite = function(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
            actualites = actualites.filter(a => a.id != id);
            localStorage.setItem('franchiniActualites', JSON.stringify(actualites));
            updateActualitesList();
        }
    }

    // Affichage initial
    updateActualitesList();
});
