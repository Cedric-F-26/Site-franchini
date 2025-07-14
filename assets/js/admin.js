import * as firebase from './auth/firebase-config.js';

// Exposer toutes les fonctions et services Firebase à la portée globale
// pour les rendre accessibles aux scripts non-modulaires comme carousel.js
window.firebase = firebase;

// --- FONCTIONS UTILITAIRES ---

/**
 * Initialise toutes les zones de dépôt de fichiers sur la page.
 */
function initDropzones() {
    const dropzones = document.querySelectorAll('.dropzone');
    dropzones.forEach(dropzone => {
        const input = dropzone.querySelector('input[type="file"]');
        const preview = dropzone.querySelector('.preview');
        
        if (!input) return; // Sécurité pour éviter les erreurs si l'input n'est pas trouvé

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
        
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                input.files = e.dataTransfer.files;
                updatePreview(preview, e.dataTransfer.files[0]);
            }
        });
        
        dropzone.addEventListener('click', () => input.click());
        
        input.addEventListener('change', () => {
            if (input.files.length) {
                updatePreview(preview, input.files[0]);
            }
        });
    });
}

/**
 * Met à jour l'aperçu de l'image pour une zone de dépôt.
 * @param {HTMLElement} previewElement - L'élément où afficher l'aperçu.
 * @param {File} file - Le fichier à prévisualiser.
 */
function updatePreview(previewElement, file) {
    if (!previewElement || !file) return;
    
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

// --- POINT D'ENTRÉE PRINCIPAL ---

document.addEventListener('DOMContentLoaded', () => {
    // --- AUTHENTIFICATION & SESSION ---
    const userEmailElement = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const adminBody = document.querySelector('body');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Utilisateur connecté:", user.email);
            if (userEmailElement) userEmailElement.textContent = user.email;
            if (adminBody) adminBody.style.display = 'block';
        } else {
            console.log("Aucun utilisateur connecté, redirection...");
            window.location.href = '/pages/connexion-prive.html';
        }
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            signOut(auth).then(() => {
                console.log('Déconnexion réussie.');
                window.location.href = '/';
            }).catch((error) => {
                console.error('Erreur lors de la déconnexion:', error);
            });
        });
    }

    // --- GESTION DES ONGLETS ---
    const tabs = document.querySelectorAll('.tab-link, .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            if (!targetId) return;

            const targetContent = document.getElementById(targetId);
            if (!targetContent) return;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            targetContent.classList.add('active');
        });
    });

    // --- INITIALISATION DES COMPOSANTS UI ---

    // Initialisation des tooltips
    const tooltipTriggers = document.querySelectorAll('[data-toggle="tooltip"]');
    tooltipTriggers.forEach(trigger => {
        let tooltip = null;
        trigger.addEventListener('mouseenter', function() {
            if (this.getAttribute('title')) {
                tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.getAttribute('title');
                document.body.appendChild(tooltip);
                const rect = this.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                tooltip.style.left = `${rect.left + (this.offsetWidth - tooltip.offsetWidth) / 2}px`;
            }
        });
        trigger.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        });
    });

    // Initialisation des zones de dépôt de fichiers
    initDropzones();
});
