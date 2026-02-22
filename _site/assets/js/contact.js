// contact.js - Gestion du formulaire de contact et de la carte

document.addEventListener('DOMContentLoaded', function() {
    console.log('Script contact.js chargé avec succès');
    
    // --- Logique du formulaire de contact ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Afficher/masquer le champ de fichiers pour les candidatures
        const serviceSelect = document.getElementById('service');
        const fichiersCandidature = document.getElementById('fichiers-candidature');
        
        if (serviceSelect && fichiersCandidature) {
            serviceSelect.addEventListener('change', function() {
                if (this.value === 'candidature') {
                    fichiersCandidature.style.display = 'block';
                } else {
                    fichiersCandidature.style.display = 'none';
                }
            });
        }

        // Gérer la soumission du formulaire
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Valider les champs requis
            if (!formValues.service || !formValues.name || !formValues.email || !formValues.message) {
                alert('Veuillez remplir tous les champs obligatoires marqués d\'un *');
                return;
            }
            
            // Valider l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formValues.email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }
            
            // Envoyer les données au backend
            try {
                const response = await fetch('http://localhost:3000/send-email', { // Assurez-vous que l'URL correspond à votre serveur Node.js
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formValues),
                });

                const result = await response.json();

                if (response.ok) {
                    let confirmationMessage = 'Votre message a été envoyé avec succès. ';
                    if (formValues.service === 'candidature') {
                        confirmationMessage += 'Nous examinerons votre candidature et vous recontacterons rapidement.';
                    } else {
                        confirmationMessage += 'Nous vous contacterons bientôt !';
                    }
                    alert(confirmationMessage);
                    contactForm.reset();
                    if (fichiersCandidature) {
                        fichiersCandidature.style.display = 'none';
                    }
                } else {
                    alert(`Erreur lors de l'envoi: ${result.error || 'Une erreur inconnue est survenue.'}`);
                }
            } catch (error) {
                console.error('Erreur réseau ou serveur:', error);
                alert('Impossible de contacter le serveur. Veuillez réessayer plus tard.');
            }
        });
    }

    // --- Logique de la carte Leaflet ---
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Coordonnées de la concession
        const destinationCoords = [44.988699190507205, 5.1035036237241105];

        // Initialisation de la carte
        const map = L.map('map').setView(destinationCoords, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Marqueur de la concession
        const marker = L.marker(destinationCoords).addTo(map);
        marker.bindPopup(`
            <b>Franchini SARL</b><br>
            111 av des monts du matin<br>
            26300 Marches<br>
            <a href="https://maps.app.goo.gl/FtHrDhjkSmq5tMdg6" target="_blank">Voir sur Google Maps</a>
        `).openPopup();
    }

    // --- Logique de limitation de taille des fichiers (pour candidature) ---
    const candidatureFichiersInput = document.getElementById('candidature-fichiers');
    if (candidatureFichiersInput) {
        candidatureFichiersInput.addEventListener('change', function() {
            const maxSize = 10 * 1024 * 1024; // 10 Mo en octets
            let totalSize = 0;
            
            for (let i = 0; i < this.files.length; i++) {
                totalSize += this.files[i].size;
            }
            
            if (totalSize > maxSize) {
                alert('La taille totale des fichiers ne doit pas dépasser 10 Mo.');
                this.value = ''; // Réinitialiser le champ de fichier
            }
        });
    }
});