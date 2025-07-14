document.addEventListener('DOMContentLoaded', function() {
    // Vérifie si Firebase est bien chargé
    if (!window.firebase || !window.firebase.db) {
        console.error("Firebase n'est pas initialisé. Assurez-vous que admin.js est chargé correctement.");
        showAlert('Erreur critique: Impossible de se connecter à la base de données.', 'error');
        return;
    }

    // --- Services Firebase (depuis l'objet global) ---
    const {
        db, collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, 
        writeBatch, updateDoc
    } = window.firebase;

    // --- Configuration Cloudinary ---
    const CLOUDINARY_CLOUD_NAME = 'dokuchvas';
    const CLOUDINARY_UPLOAD_PRESET = 'Site Web'; // Assurez-vous que ce nom est correct
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    // --- Éléments du DOM ---
    const mediaTypeSelect = document.getElementById('media-type-select');
    const imageUploadSection = document.getElementById('image-upload-section');
    const youtubeSection = document.getElementById('youtube-section');
    const addMediaBtn = document.getElementById('add-media-btn');
    const carouselItemsList = document.getElementById('carousel-items-list');
    const mediaTitleInput = document.getElementById('media-title');
    const youtubeUrlInput = document.getElementById('youtube-url');
    const mediaDropzone = document.getElementById('media-dropzone');
    const mediaUploadInput = document.getElementById('media-upload');
    const mediaPreview = document.getElementById('media-preview');

    let uploadedFile = null;
    let carouselItems = [];

    // --- Fonctions Métier ---

    async function loadCarouselItems() {
        try {
            const q = query(collection(db, 'carousel'), orderBy('order'));
            const snapshot = await getDocs(q);
            carouselItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderCarouselItems();
        } catch (error) {
            console.error("Erreur de chargement du carrousel: ", error);
            showAlert(`Erreur de chargement: ${error.message}`, 'error');
        }
    }

    function renderCarouselItems() {
        if (!carouselItemsList) return;
        carouselItemsList.innerHTML = '';
        carouselItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item-card carousel-item';
            div.setAttribute('draggable', 'true');
            div.dataset.id = item.id;

            const mediaContent = item.type === 'youtube'
                ? `<img src="https://img.youtube.com/vi/${getYouTubeID(item.mediaUrl)}/0.jpg" class="item-card-img" alt="Miniature YouTube">`
                : `<img src="${item.mediaUrl}" class="item-card-img" alt="${item.title}">`;

            div.innerHTML = `
                <div class="item-card-content">
                    ${mediaContent}
                    <h4>${item.title || 'Sans titre'}</h4>
                    <small>Type: ${item.type}</small>
                </div>
                <div class="action-btns">
                    <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                </div>
            `;
            div.querySelector('.delete').addEventListener('click', () => deleteCarouselItem(item.id, item.type, item.mediaUrl));
            carouselItemsList.appendChild(div);
        });
        addDragAndDropListeners();
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

    // --- Logique de Glisser-Déposer ---
    let draggedItem = null;
    function addDragAndDropListeners() {
        document.querySelectorAll('#carousel-items-list .carousel-item').forEach(item => {
            item.addEventListener('dragstart', e => {
                draggedItem = e.currentTarget;
                setTimeout(() => draggedItem.classList.add('dragging'), 0);
            });
            item.addEventListener('dragend', async () => {
                if (!draggedItem) return;
                draggedItem.classList.remove('dragging');
                draggedItem = null;
                const newOrderIds = [...carouselItemsList.querySelectorAll('.carousel-item')].map(item => item.dataset.id);
                carouselItems.sort((a, b) => newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id));
                showSpinner('Mise à jour de l\'ordre...');
                try {
                    await updateOrder();
                } catch (error) {
                    showAlert(`Erreur de mise à jour: ${error.message}`, 'error');
                } finally {
                    hideSpinner();
                }
            });
            item.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = getDragAfterElement(carouselItemsList, e.clientY);
                if (afterElement == null) {
                    carouselItemsList.appendChild(draggedItem);
                } else {
                    carouselItemsList.insertBefore(draggedItem, afterElement);
                }
            });
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.carousel-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- Initialisation ---
    initializeEventListeners();
    mediaTypeSelect.dispatchEvent(new Event('change')); // Simule un changement pour afficher la bonne section
    loadCarouselItems();
});
