// contact.js - Gestion du formulaire de contact

document.addEventListener('DOMContentLoaded', function() {
    console.log('Script contact.js chargé avec succès');
    
    // Vérifier si le formulaire de contact existe
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.log('Formulaire de contact non trouvé');
        return;
    }

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
    contactForm.addEventListener('submit', function(e) {
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
        
        // Afficher un message de succès (à remplacer par un envoi réel)
        console.log('Formulaire soumis avec succès :', formValues);
        
        // Préparer le message de confirmation
        let confirmationMessage = 'Votre message a été envoyé avec succès. ';
        if (formValues.service === 'candidature') {
            confirmationMessage += 'Nous examinerons votre candidature et vous recontacterons rapidement.';
        } else {
            confirmationMessage += 'Nous vous contacterons bientôt !';
        }
        
        alert(confirmationMessage);
        
        // Réinitialiser le formulaire
        contactForm.reset();
        
        // Cacher à nouveau le champ de fichiers si visible
        if (fichiersCandidature) {
            fichiersCandidature.style.display = 'none';
        }
    });
});
