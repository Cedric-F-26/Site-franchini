document.addEventListener('DOMContentLoaded', function() {
    // Note: Le HTML pour cette section est peut-être un placeholder.
    // Ce script est extrait de l'ancienne version pour une future intégration.

    const promoForm = document.getElementById('promo-form');
    const addPromoBtn = document.getElementById('add-promo-btn');
    const promosTableBody = document.getElementById('promos-table-body');
    let promos = JSON.parse(localStorage.getItem('franchiniPromos')) || [];

    if (promoForm) {
        promoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const promo = {
                id: document.getElementById('promo-id').value || Date.now(),
                nom: document.getElementById('promo-nom').value,
                description: document.getElementById('promo-description').value,
                date_debut: document.getElementById('promo-date-debut').value,
                date_fin: document.getElementById('promo-date-fin').value
            };
            
            const index = promos.findIndex(p => p.id == promo.id);
            if (index > -1) {
                promos[index] = promo;
            } else {
                promos.push(promo);
            }
            
            localStorage.setItem('franchiniPromos', JSON.stringify(promos));
            updatePromosTable();
            resetPromoForm();
        });
    }

    function updatePromosTable() {
        if (!promosTableBody) return;
        promosTableBody.innerHTML = '';
        promos.forEach(promo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${promo.nom}</td>
                <td>${promo.description}</td>
                <td>${new Date(promo.date_debut).toLocaleDateString()}</td>
                <td>${new Date(promo.date_fin).toLocaleDateString()}</td>
                <td class="action-btns">
                    <button class="action-btn edit" onclick="editPromo(${promo.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deletePromo(${promo.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            promosTableBody.appendChild(row);
        });
    }

    window.editPromo = function(id) {
        const promo = promos.find(p => p.id == id);
        if (promo) {
            document.getElementById('promo-id').value = promo.id;
            document.getElementById('promo-nom').value = promo.nom;
            document.getElementById('promo-description').value = promo.description;
            document.getElementById('promo-date-debut').value = promo.date_debut;
            document.getElementById('promo-date-fin').value = promo.date_fin;
            if(promoForm) promoForm.scrollIntoView({ behavior: 'smooth' });
        }
    }

    window.deletePromo = function(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
            promos = promos.filter(p => p.id != id);
            localStorage.setItem('franchiniPromos', JSON.stringify(promos));
            updatePromosTable();
        }
    }

    function resetPromoForm() {
        if (promoForm) promoForm.reset();
        const idInput = document.getElementById('promo-id');
        if (idInput) idInput.value = '';
    }

    updatePromosTable();
});
