// Fonction d'initialisation de l'interface d'administration
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des onglets
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Masquer tous les contenus d'onglets
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Désactiver tous les boutons d'onglets
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Activer l'onglet sélectionné
            document.getElementById(tabId).classList.add('active');
            button.classList.add('active');
        });
    });

    // Initialisation des tooltips
    const tooltipTriggers = document.querySelectorAll('[data-toggle="tooltip"]');
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', showTooltip);
        trigger.addEventListener('mouseleave', hideTooltip);
    });

    // Fonction pour afficher les tooltips
    function showTooltip(event) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.getAttribute('title');
        
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
        tooltip.style.left = `${rect.left + (this.offsetWidth - tooltip.offsetWidth) / 2}px`;
        
        this.tooltip = tooltip;
    }

    // Fonction pour masquer les tooltips
    function hideTooltip() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }

    // Gestion de la déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                window.location.href = 'connexion-prive.html';
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error.message);
                alert('Une erreur est survenue lors de la déconnexion.');
            }
        });
    }

    // Initialisation des zones de dépôt de fichiers
    initDropzones();

    // Fonction pour initialiser les zones de dépôt
    function initDropzones() {
        const dropzones = document.querySelectorAll('.dropzone');
        
        dropzones.forEach(dropzone => {
            const input = dropzone.querySelector('input[type="file"]');
            const preview = dropzone.querySelector('.preview');
            
            // Gestion du survol
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('dragover');
            });
            
            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('dragover');
            });
            
            // Gestion du dépôt de fichier
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
                
                if (e.dataTransfer.files.length) {
                    input.files = e.dataTransfer.files;
                    updatePreview(preview, e.dataTransfer.files[0]);
                }
            });
            
            // Gestion du clic sur la zone de dépôt
            dropzone.addEventListener('click', () => {
                input.click();
            });
            
            // Mise à jour de l'aperçu lors de la sélection d'un fichier
            input.addEventListener('change', () => {
                if (input.files.length) {
                    updatePreview(preview, input.files[0]);
                }
            });
        });
    }
    
    // Fonction pour mettre à jour l'aperçu de l'image
    function updatePreview(previewElement, file) {
        if (!previewElement) return;
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewElement.innerHTML = `<img src="${e.target.result}" alt="Aperçu" class="img-preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            previewElement.textContent = `Fichier: ${file.name}`;
        }
    }

    // Initialisation des sélecteurs de date
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Si la valeur est vide, définir la date d'aujourd'hui comme valeur par défaut
        if (!input.value) {
            const today = new Date().toISOString().split('T')[0];
            input.value = today;
        }
    });

    // Initialisation des sélecteurs avec recherche
    const selectWithSearch = document.querySelectorAll('select[data-search]');
    selectWithSearch.forEach(select => {
        const wrapper = document.createElement('div');
        wrapper.className = 'select-search-wrapper';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Rechercher...';
        searchInput.className = 'search-input';
        
        const optionsList = document.createElement('div');
        optionsList.className = 'select-options';
        
        // Cloner et cacher le select original
        const originalSelect = select.cloneNode(true);
        originalSelect.style.display = 'none';
        
        // Remplacer le select par notre interface personnalisée
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(originalSelect);
        wrapper.appendChild(searchInput);
        wrapper.appendChild(optionsList);
        
        // Mettre à jour les options
        function updateOptions() {
            const searchTerm = searchInput.value.toLowerCase();
            const options = Array.from(originalSelect.options);
            
            optionsList.innerHTML = '';
            
            options.forEach(option => {
                if (option.value === '') return;
                
                if (option.text.toLowerCase().includes(searchTerm)) {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'select-option';
                    optionElement.textContent = option.text;
                    optionElement.dataset.value = option.value;
                    
                    if (option.selected) {
                        optionElement.classList.add('selected');
                    }
                    
                    optionElement.addEventListener('click', () => {
                        // Mettre à jour le select original
                        originalSelect.value = option.value;
                        
                        // Mettre à jour l'affichage
                        searchInput.value = option.text;
                        
                        // Mettre en surbrillance l'option sélectionnée
                        document.querySelectorAll('.select-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        optionElement.classList.add('selected');
                        
                        // Déclencher l'événement change
                        const event = new Event('change');
                        originalSelect.dispatchEvent(event);
                    });
                    
                    optionsList.appendChild(optionElement);
                }
            });
        }
        
        // Écouter les changements dans le champ de recherche
        searchInput.addEventListener('input', updateOptions);
        
        // Initialiser l'affichage
        updateOptions();
        
        // Afficher/masquer la liste des options
        searchInput.addEventListener('click', (e) => {
            e.stopPropagation();
            optionsList.style.display = optionsList.style.display === 'none' ? 'block' : 'none';
        });
        
        // Masquer la liste quand on clique ailleurs
        document.addEventListener('click', () => {
            optionsList.style.display = 'none';
        });
        
        // Empêcher la propagation du clic sur la liste
        optionsList.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Gestion des formulaires
    const forms = document.querySelectorAll('form[data-ajax]');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            try {
                // Désactiver le bouton et afficher un indicateur de chargement
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
                
                // Récupérer les données du formulaire
                const formData = new FormData(form);
                
                // Convertir FormData en objet JavaScript
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });
                
                // Envoyer les données au serveur
                const response = await fetch(form.action || window.location.href, {
                    method: form.method || 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Afficher un message de succès
                    showAlert('success', result.message || 'Opération réussie !');
                    
                    // Réinitialiser le formulaire si nécessaire
                    if (form.hasAttribute('data-reset-on-success')) {
                        form.reset();
                    }
                    
                    // Recharger la page si nécessaire
                    if (form.hasAttribute('data-reload-on-success')) {
                        setTimeout(() => window.location.reload(), 1500);
                    }
                } else {
                    throw new Error(result.message || 'Une erreur est survenue');
                }
            } catch (error) {
                // Afficher un message d'erreur
                showAlert('error', error.message || 'Une erreur est survenue lors de l\'envoi du formulaire');
                console.error('Erreur:', error);
            } finally {
                // Réactiver le bouton et restaurer le texte d'origine
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    });
    
    // Fonction pour afficher des messages d'alerte
    function showAlert(type, message) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        // Positionner l'alerte en haut de la page
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.zIndex = '9999';
        alert.style.padding = '15px 25px';
        alert.style.borderRadius = '4px';
        alert.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        alert.style.animation = 'slideIn 0.3s ease-out';
        
        document.body.appendChild(alert);
        
        // Supprimer l'alerte après 5 secondes
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 5000);
    }
    
    // Ajouter les animations CSS pour les alertes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
