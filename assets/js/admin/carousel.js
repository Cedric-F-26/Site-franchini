console.log("AUDIT: Fichier carousel.js chargé.");
document.addEventListener('DOMContentLoaded', async function() {
    console.log('AUDIT: Événement DOMContentLoaded déclenché.');
    console.log('Démarrage du script carousel.js');
    
    // Vérifier si les éléments du DOM existent
    const carouselItemsList = document.getElementById('carousel-items-list');
    const mediaTypeSelect = document.getElementById('media-type');
    
    if (!carouselItemsList || !mediaTypeSelect) {
        console.error('AUDIT - ERREUR: Éléments du DOM manquants. carouselItemsList:', carouselItemsList, 'mediaTypeSelect:', mediaTypeSelect);
        return;
    }
    console.log("AUDIT: Éléments du DOM principaux trouvés.");

    // Importer les fonctions Firebase nécessaires
    try {
        const { 
            db, collection, getDocs, query, orderBy, addDoc, deleteDoc, doc, writeBatch, updateDoc,
            storage, ref, uploadBytes, getDownloadURL
        } = await import('../auth/firebase-config.js');
        
        console.log('AUDIT: Modules Firebase importés avec succès.');
        console.log('Firebase configuré avec succès');
        
        // --- Configuration Cloudinary ---
        const CLOUDINARY_CLOUD_NAME = 'dokuchvas';
        const CLOUDINARY_UPLOAD_PRESET = 'Site Web';
        const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

        // --- Éléments du DOM ---
        const imageUploadSection = document.getElementById('image-section');
        const youtubeSection = document.getElementById('youtube-section');
        const addMediaBtn = document.getElementById('add-media-btn');
        const mediaTitleInput = document.getElementById('media-title');
        const youtubeUrlInput = document.getElementById('youtube-url');
        const mediaDropzone = document.getElementById('image-dropzone');
        const mediaUploadInput = document.getElementById('media-upload');
        const mediaPreview = document.getElementById('image-preview');

        let uploadedFile = null;
        let carouselItems = [];

        // --- Fonctions Métier ---
        async function loadCarouselItems() {
            console.log('AUDIT: Début de loadCarouselItems.');
            console.log('Chargement des éléments du carrousel...');
            try {
                const q = query(collection(db, 'carousel'), orderBy('order'));
                const snapshot = await getDocs(q);
                carouselItems = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log(`AUDIT: Firestore a retourné ${snapshot.docs.length} documents.`);
                console.log(`${carouselItems.length} éléments chargés`);
                renderCarouselItems();
            } catch (error) {
                console.error("Erreur de chargement du carrousel: ", error);
                showAlert(`Erreur de chargement: ${error.message}`, 'error');
            }
        }

        function renderCarouselItems() {
            console.log("AUDIT: Début de renderCarouselItems.");
            if (!carouselItemsList) return;
            
            carouselItemsList.innerHTML = '';
            
            carouselItems.forEach(item => {
                const div = document.createElement('div');
                div.className = 'carousel-item';
                div.dataset.id = item.id;
                
                const mediaContent = item.type === 'youtube'
                    ? `<img src="https://img.youtube.com/vi/${getYouTubeID(item.mediaUrl)}/0.jpg" class="item-card-img" alt="Miniature YouTube">`
                    : `<img src="${item.mediaUrl}" class="item-card-img" alt="${item.title}">`;

                div.innerHTML = `
                    <div class="item-card-content">
                        ${mediaContent}
                        <div class="item-details">
                            <h4>${item.title || 'Sans titre'}</h4>
                            <small>Type: ${item.type}</small>
                        </div>
                    </div>
                    <div class="action-btns">
                        <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                        <span class="drag-handle"><i class="fas fa-grip-vertical"></i></span>
                    </div>
                `;
                
                // Ajouter l'écouteur de suppression
                div.querySelector('.delete').addEventListener('click', () => deleteCarouselItem(item.id, item.type, item.mediaUrl));
                carouselItemsList.appendChild(div);
            });
            
            // Initialiser le glisser-déposer
            console.log(`AUDIT: ${carouselItems.length} éléments rendus dans le DOM.`);
            
            initializeSortable();
        }

        async function uploadToCloudinary(file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur Cloudinary: ${errorData.error.message}`);
            }

            const data = await response.json();
            return data.secure_url;
        }

        async function addCarouselItem() {
            const type = mediaTypeSelect.value;
            const title = mediaTitleInput.value.trim();
            let mediaUrl = '';

            showSpinner('Ajout en cours...');

            try {
                if (type === 'image') {
                    if (!uploadedFile) throw new Error('Veuillez sélectionner une image.');
                    mediaUrl = await uploadToCloudinary(uploadedFile);

                } else if (type === 'youtube') {
                    const url = youtubeUrlInput.value.trim();
                    if (!url || !getYouTubeID(url)) throw new Error('Veuillez entrer une URL YouTube valide.');
                    mediaUrl = url;
                }

                const newItem = {
                    title: title,
                    type: type,
                    mediaUrl: mediaUrl,
                    order: carouselItems.length
                };

                const docRef = await addDoc(collection(db, 'carousel'), newItem);
                carouselItems.push({ id: docRef.id, ...newItem });
                renderCarouselItems();
                resetForm();
                showAlert('Élément ajouté avec succès !', 'success');
            } catch (error) {
                console.error("Erreur lors de l'ajout : ", error);
                showAlert(`Erreur lors de l'ajout : ${error.message}`, 'error');
            } finally {
                hideSpinner();
            }
        }

        async function deleteCarouselItem(id, type, mediaUrl) {
            if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
            
            showSpinner('Suppression en cours...');
            try {
                // Supprimer le document de Firestore
                await deleteDoc(doc(db, 'carousel', id));

                // La suppression de l'image sur Cloudinary n'est pas gérée côté client pour des raisons de sécurité.
                // L'image restera sur Cloudinary mais ne sera plus affichée dans le carrousel.

                // Mettre à jour l'état local et ré-ordonner
                carouselItems = carouselItems.filter(item => item.id !== id);
                await updateOrder();
                showAlert('Élément supprimé avec succès.', 'success');
            } catch (error) {
                console.error("Erreur de suppression : ", error);
                showAlert(`Erreur de suppression : ${error.message}`, 'error');
            } finally {
                hideSpinner();
            }
        }

        async function updateOrder() {
            const batch = writeBatch(db);
            carouselItems.forEach((item, index) => {
                item.order = index;
                const docRef = doc(db, 'carousel', item.id);
                batch.update(docRef, { order: index });
            });
            await batch.commit();
            loadCarouselItems(); // Recharger pour s'assurer de la cohérence
        }

        // --- Logique de Glisser-Déposer ---
        function initializeSortable() {
            console.log('AUDIT: Début de initializeSortable.');
            console.log('Initialisation de Sortable...');
            const el = document.getElementById('carousel-items-list');
            if (!el) {
                console.error('Élément #carousel-items-list non trouvé');
                return;
            }

            try {
                if (typeof Sortable === 'undefined') {
                    console.error('AUDIT - ERREUR: La librairie SortableJS n\'est pas chargée.');
                    return;
                }
                new Sortable(el, {
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    dragClass: 'sortable-drag',
                    handle: '.drag-handle',
                    onEnd: async function() {
                        const items = Array.from(el.children);
                        const newOrder = items.map((item, index) => ({
                            id: item.dataset.id,
                            order: index
                        }));
                        
                        console.log('Nouvel ordre:', newOrder);
                        
                        try {
                            const batch = writeBatch(db);
                            newOrder.forEach(item => {
                                const docRef = doc(db, 'carousel', item.id);
                                batch.update(docRef, { order: item.order });
                            });
                            await batch.commit();
                            console.log('Ordre mis à jour avec succès');
                        } catch (error) {
                            console.error('Erreur lors de la mise à jour de l\'ordre:', error);
                            showAlert('Erreur lors de la mise à jour de l\'ordre', 'error');
                        }
                    }
                });
                console.log('AUDIT: Sortable initialisé avec succès');
            } catch (error) {
                console.error('Erreur lors de l\'initialisation de Sortable:', error);
            }
        }

        // --- Initialisation des Écouteurs ---
        function initializeEventListeners() {
            mediaTypeSelect.addEventListener('change', () => {
                const isImage = mediaTypeSelect.value === 'image';
                imageUploadSection.style.display = isImage ? 'block' : 'none';
                youtubeSection.style.display = isImage ? 'none' : 'block';
            });

            addMediaBtn.addEventListener('click', addCarouselItem);

            mediaDropzone.addEventListener('click', () => mediaUploadInput.click());
            mediaDropzone.addEventListener('dragover', e => { e.preventDefault(); mediaDropzone.classList.add('dragover'); });
            mediaDropzone.addEventListener('dragleave', () => mediaDropzone.classList.remove('dragover'));
            mediaDropzone.addEventListener('drop', e => {
                e.preventDefault();
                mediaDropzone.classList.remove('dragover');
                if (e.dataTransfer.files.length && e.dataTransfer.files[0].type.startsWith('image/')) {
                    handleFile(e.dataTransfer.files[0]);
                }
            });
            mediaUploadInput.addEventListener('change', e => {
                if (e.target.files.length) handleFile(e.target.files[0]);
            });
        }

        // --- Fonctions Utilitaires ---
        function handleFile(file) {
            uploadedFile = file;
            mediaPreview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Aperçu">`;
        }

        function resetForm() {
            mediaTitleInput.value = '';
            youtubeUrlInput.value = '';
            mediaUploadInput.value = '';
            mediaPreview.innerHTML = '';
            uploadedFile = null;
        }

        function getYouTubeID(url) {
            const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            return (url.match(regex) || [])[1] || null;
        }

        // --- Initialisation ---
        initializeEventListeners();
        mediaTypeSelect.dispatchEvent(new Event('change')); // Simule un changement pour afficher la bonne section
        await loadCarouselItems();
        initializeSortable();
        
    } catch (error) {
        console.error('Erreur lors du chargement des dépendances Firebase:', error);
        showAlert('Erreur de configuration. Veuillez recharger la page.', 'error');
    }
});

// Fonction utilitaire pour afficher les alertes
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alertContainer.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
    console[type === 'error' ? 'error' : 'log'](message);
}
