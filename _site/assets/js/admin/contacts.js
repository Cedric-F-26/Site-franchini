document.addEventListener('DOMContentLoaded', function() {
    // Note: Le HTML pour cette section est peut-être un placeholder.
    // Ce script est extrait de l'ancienne version pour une future intégration.

    const contactForm = document.getElementById('contact-form');
    const contactsTableBody = document.getElementById('contacts-table-body');
    let contacts = JSON.parse(localStorage.getItem('franchiniContacts')) || [];

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const contact = {
                id: document.getElementById('contact-id').value || Date.now(),
                nom: document.getElementById('contact-nom').value,
                email: document.getElementById('contact-email').value,
                telephone: document.getElementById('contact-telephone').value,
                role: document.getElementById('contact-role').value
            };
            
            const index = contacts.findIndex(c => c.id == contact.id);
            if (index > -1) {
                contacts[index] = contact;
            } else {
                contacts.push(contact);
            }
            
            localStorage.setItem('franchiniContacts', JSON.stringify(contacts));
            updateContactsTable();
            resetContactForm();
        });
    }

    function updateContactsTable() {
        if (!contactsTableBody) return;
        contactsTableBody.innerHTML = '';
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.nom}</td>
                <td>${contact.email}</td>
                <td>${contact.telephone}</td>
                <td>${contact.role}</td>
                <td class="action-btns">
                    <button class="action-btn edit" onclick="editContact(${contact.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteContact(${contact.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            contactsTableBody.appendChild(row);
        });
    }

    window.editContact = function(id) {
        const contact = contacts.find(c => c.id == id);
        if (contact) {
            document.getElementById('contact-id').value = contact.id;
            document.getElementById('contact-nom').value = contact.nom;
            document.getElementById('contact-email').value = contact.email;
            document.getElementById('contact-role').value = contact.role;
            if(contactForm) contactForm.scrollIntoView({ behavior: 'smooth' });
        }
    }

    window.deleteContact = function(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
            contacts = contacts.filter(c => c.id != id);
            localStorage.setItem('franchiniContacts', JSON.stringify(contacts));
            updateContactsTable();
        }
    }

    function resetContactForm() {
        if(contactForm) contactForm.reset();
        const idInput = document.getElementById('contact-id');
        if(idInput) idInput.value = '';
    }

    updateContactsTable();
});
