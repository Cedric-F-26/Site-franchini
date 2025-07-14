document.addEventListener('DOMContentLoaded', function() {
    // Note: Le HTML pour cette section est peut-être un placeholder.
    // Ce script est extrait de l'ancienne version pour une future intégration.

    const materielTypeSelector = document.getElementById('materiel-type-selector');
    const tracteurDetails = document.getElementById('tracteur-details');
    const materielDetails = document.getElementById('materiel-details');
    const materielsTableBody = document.getElementById('materiels-table-body');
    const addTracteurBtn = document.getElementById('add-tracteur-btn');
    const addMaterielBtn = document.getElementById('add-materiel-btn');
    const tracteurForm = document.getElementById('tracteur-form');
    const materielForm = document.getElementById('materiel-form');

    let materiels = JSON.parse(localStorage.getItem('franchiniMateriels')) || [];

    if (materielTypeSelector) {
        materielTypeSelector.addEventListener('change', function(e) {
            if (e.target.value === 'tracteur') {
                tracteurDetails.style.display = 'block';
                materielDetails.style.display = 'none';
            } else {
                tracteurDetails.style.display = 'none';
                materielDetails.style.display = 'block';
            }
        });
    }

    if(addTracteurBtn) {
        addTracteurBtn.addEventListener('click', function() {
            const tracteur = {
                id: document.getElementById('tracteur-id').value || Date.now(),
                type: 'tracteur',
                marque: document.getElementById('tracteur-marque').value,
                modele: document.getElementById('tracteur-modele').value,
                heures: document.getElementById('tracteur-heures').value,
                annee: document.getElementById('tracteur-annee').value,
                prix: document.getElementById('tracteur-prix').value,
                description: document.getElementById('tracteur-description').value,
                etat: document.querySelector('input[name="tracteur-etat"]:checked').value,
                location: document.getElementById('tracteur-location').checked
            };
            saveMateriel(tracteur);
            resetTracteurForm();
        });
    }

    if(addMaterielBtn) {
        addMaterielBtn.addEventListener('click', function() {
            const materiel = {
                id: document.getElementById('materiel-id').value || Date.now(),
                type: 'autre',
                marque: document.getElementById('materiel-marque').value,
                modele: document.getElementById('materiel-modele').value,
                annee: document.getElementById('materiel-annee').value,
                prix: document.getElementById('materiel-prix').value,
                description: document.getElementById('materiel-description').value,
                etat: document.querySelector('input[name="materiel-etat-autre"]:checked').value,
                location: document.getElementById('materiel-location').checked
            };
            saveMateriel(materiel);
            resetMaterielForm();
        });
    }

    function saveMateriel(item) {
        const index = materiels.findIndex(m => m.id == item.id);
        if (index > -1) {
            materiels[index] = item; // Mise à jour
        } else {
            materiels.push(item); // Ajout
        }
        localStorage.setItem('franchiniMateriels', JSON.stringify(materiels));
        updateMaterielsTable();
    }

    function updateMaterielsTable() {
        if (!materielsTableBody) return;
        materielsTableBody.innerHTML = '';
        materiels.forEach(m => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${m.marque}</td>
                <td>${m.modele}</td>
                <td>${m.type === 'tracteur' ? m.heures : 'N/A'}</td>
                <td>${m.annee}</td>
                <td>${m.prix} €</td>
                <td>${m.etat}</td>
                <td>${m.location ? 'Oui' : 'Non'}</td>
                <td class="action-btns">
                    <button class="action-btn edit" onclick="editMateriel(${m.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteMateriel(${m.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            materielsTableBody.appendChild(row);
        });
    }

    window.editMateriel = function(id) {
        const materiel = materiels.find(m => m.id == id);
        if (!materiel) return;

        if (materiel.type === 'tracteur') {
            document.querySelector('input[name="materiel-type"][value="tracteur"]').checked = true;
            tracteurDetails.style.display = 'block';
            materielDetails.style.display = 'none';
            document.getElementById('tracteur-id').value = materiel.id;
            // ... (remplissage des autres champs)
        } else {
            document.querySelector('input[name="materiel-type"][value="autre"]').checked = true;
            tracteurDetails.style.display = 'none';
            materielDetails.style.display = 'block';
            document.getElementById('materiel-id').value = materiel.id;
            // ... (remplissage des autres champs)
        }
        if(materielTypeSelector) materielTypeSelector.scrollIntoView({ behavior: 'smooth' });
    }

    window.deleteMateriel = function(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
            materiels = materiels.filter(m => m.id != id);
            localStorage.setItem('franchiniMateriels', JSON.stringify(materiels));
            updateMaterielsTable();
        }
    }

    function resetTracteurForm() {
        if(tracteurForm) tracteurForm.reset();
        const idInput = document.getElementById('tracteur-id');
        if(idInput) idInput.value = '';
    }

    function resetMaterielForm() {
        if(materielForm) materielForm.reset();
        const idInput = document.getElementById('materiel-id');
        if(idInput) idInput.value = '';
    }

    // Chargement initial
    updateMaterielsTable();
});
