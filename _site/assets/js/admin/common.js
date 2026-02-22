document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des onglets
    initTabs();
    // Initialisation des zones de dépôt de fichiers
    initializeAllDropzones();

    // Gestion de la déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const { auth, signOut } = window.firebase;
            signOut(auth).then(() => {
                console.log('User signed out.');
                window.location.href = '/connexion.html'; 
                        }).catch((error) => {
                console.error('Sign out error', error);
            });
        });
    }
});

/**
 * Initialise le système d'onglets.
 * Gère le clic sur les boutons d'onglet pour afficher le contenu correspondant.
 * Mémorise l'onglet actif dans le localStorage.
 */
function initTabs() {
    const tabs = document.querySelectorAll('nav.tabs .tab-link');
    const contents = document.querySelectorAll('.tab-content-wrapper .tab-content');
    const activeTab = localStorage.getItem('activeAdminTab');

    // Afficher l'onglet mémorisé ou le premier par défaut
    if (activeTab) {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        const tabToShow = document.querySelector(`.tab-link[data-tab="${activeTab}"]`);
        const contentToShow = document.getElementById(activeTab);
        if (tabToShow && contentToShow) {
            tabToShow.classList.add('active');
            contentToShow.classList.add('active');
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Ne pas changer d'onglet pour les liens externes
            if (tab.tagName === 'A' && tab.getAttribute('target') === '_blank') {
                return;
            }
            e.preventDefault();

            const targetId = tab.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
                localStorage.setItem('activeAdminTab', targetId); // Mémoriser l'onglet
            }
        });
    });
}


/**
 * Empêche le comportement par défaut pour les événements (utile pour le drag and drop).
 * @param {Event} e L'événement.
 */
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

/**
 * Extrait l'ID d'une vidéo à partir d'une URL YouTube.
 * @param {string} url L'URL de la vidéo YouTube.
 * @returns {string|null} L'ID de la vidéo ou null.
 */
function extractYoutubeId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex);
    return match ? match[1] : null;
}

/**
 * Configure une zone de dépôt (dropzone) pour le téléversement de fichiers.
 * @param {string} dropzoneId ID de l'élément dropzone.
 * @param {string} fileInputId ID de l'input de type fichier associé.
 * @param {string} previewContainerId ID du conteneur pour l'aperçu des fichiers.
 */
function setupDropzone(dropzoneId, fileInputId, previewContainerId) {
    const dropzone = document.getElementById(dropzoneId);
    const fileInput = document.getElementById(fileInputId);
    const previewContainer = document.getElementById(previewContainerId);

    if (!dropzone || !fileInput || !previewContainer) {
        console.warn(`Éléments manquants pour la dropzone : ${dropzoneId}, ${fileInputId}, ${previewContainerId}`);
        return;
    }

    // Clic sur la dropzone déclenche l'input de fichier
    dropzone.addEventListener('click', () => fileInput.click());

    // Gestion des événements de drag & drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false); // Empêche l'ouverture du fichier dans le navigateur
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
    });

    // Gestion du dépôt de fichiers
    dropzone.addEventListener('drop', (e) => {
        fileInput.files = e.dataTransfer.files;
        handleFiles(fileInput.files, previewContainer);
    }, false);

    // Gestion de la sélection de fichiers via le dialogue
    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files, previewContainer);
    });
}

/**
 * Gère les fichiers sélectionnés ou déposés et affiche les aperçus.
 * @param {FileList} files La liste des fichiers.
 * @param {HTMLElement} previewContainer Le conteneur où afficher les aperçus.
 */
function handleFiles(files, previewContainer) {
    previewContainer.innerHTML = ''; // Vider les anciens aperçus
    if (!files.length) {
        return;
    }

    for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'thumbnail';
            
            let mediaPreview;
            if (file.type.startsWith('image/')) {
                mediaPreview = `<img src="${e.target.result}" title="${file.name}">`;
            } else if (file.type.startsWith('video/')) {
                mediaPreview = `<video controls src="${e.target.result}" title="${file.name}"></video>`;
            } else {
                mediaPreview = `<i class="fas fa-file-alt"></i>`;
            }
            
            div.innerHTML = `
                ${mediaPreview}
                <div class="thumbnail-name">${file.name}</div>
            `;
            previewContainer.appendChild(div);
        };
        reader.readAsDataURL(file);
    }
}


/**
 * Initialise toutes les zones de dépôt de la page.
 */
/**
 * Affiche une alerte temporaire.
 * @param {string} message Le message à afficher.
 * @param {string} type Le type d'alerte ('success', 'error', 'info').
 */
function showAlert(message, type = 'info') {
    const container = document.getElementById('alert-container');
    if (!container) return;

    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;

    container.appendChild(alertBox);

    setTimeout(() => {
        alertBox.classList.add('show');
    }, 10);

    setTimeout(() => {
        alertBox.classList.remove('show');
        setTimeout(() => {
            container.removeChild(alertBox);
        }, 500);
    }, 3000);
}

/**
 * Affiche le spinner de chargement.
 * @param {string} text Le texte à afficher sous le spinner.
 */
function showSpinner(text = 'Chargement...') {
    const overlay = document.getElementById('spinner-overlay');
    const spinnerText = document.getElementById('spinner-text');
    if (overlay) {
        if(spinnerText) spinnerText.textContent = text;
        overlay.style.display = 'flex';
    }
}

/**
 * Masque le spinner de chargement.
 */
function hideSpinner() {
    const overlay = document.getElementById('spinner-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function initializeAllDropzones() {
    if (document.getElementById('actualite-media-dropzone')) {
        setupDropzone('actualite-media-dropzone', 'actualite-media-input', 'actualite-media-preview');
    }
    if (document.getElementById('carousel-media-dropzone')) {
        setupDropzone('carousel-media-dropzone', 'carousel-media-input', 'carousel-media-preview');
    }
    // Ajoutez ici d'autres initialisations de dropzone si nécessaire
}
