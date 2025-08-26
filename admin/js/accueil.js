/**
 * Script pour la gestion du carrousel d'accueil avec Firebase et Cloudinary.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Attendre que Firebase soit initialisé
    const firebaseCheckInterval = setInterval(async () => {
        if (window.firebase && window.firebase.db) {
            clearInterval(firebaseCheckInterval);
            console.log('Firebase est prêt.');
            await initializeAccueilPage();
        }
    }, 100);
});

async function initializeAccueilPage() {
    const { db, collection, getDocs, query, orderBy, doc, writeBatch, deleteDoc } = window.firebase;

    const carouselCollection = collection(db, 'carousel');
    let carouselItems = [];

    const elements = {
        loader: document.getElementById('loader'),
        itemsContainer: document.getElementById('carousel-items-container'),
        addItemBtn: document.getElementById('add-carousel-btn'),
        modal: new bootstrap.Modal(document.getElementById('carousel-modal')),
        form: document.getElementById('carousel-form'),
        mediaType: document.getElementById('media-type'),
        imageInputGroup: document.getElementById('image-input-group'),
        videoInputGroup: document.getElementById('video-input-group'),
        imageUpload: document.getElementById('image-upload'),
        imageUrl: document.getElementById('image-url'),
        videoUrl: document.getElementById('video-url'),
        imagePreview: document.getElementById('image-preview'),
        imagePreviewContainer: document.getElementById('image-preview-container'),
        hiddenId: document.getElementById('hidden-id'),
        title: document.getElementById('title'),
        contenu: document.getElementById('contenu'),
    };

    function showLoader(show) {
        elements.loader.style.display = show ? 'flex' : 'none';
    }

    function toggleMediaInput() {
        if (elements.mediaType.value === 'image' || elements.mediaType.value === 'cloudinary') {
            elements.imageInputGroup.style.display = 'block';
            elements.videoInputGroup.style.display = 'none';
        } else { // youtube
            elements.imageInputGroup.style.display = 'none';
            elements.videoInputGroup.style.display = 'block';
        }
    }

    async function loadCarouselItems() {
        showLoader(true);
        try {
            const q = query(carouselCollection, orderBy('order'));
            const snapshot = await getDocs(q);
            carouselItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderCarouselItems();
        } catch (error) {
            console.error('Erreur de chargement des éléments du carrousel:', error);
            alert('Erreur de chargement des données.');
        } finally {
            showLoader(false);
        }
    }

    function renderCarouselItems() {
        elements.itemsContainer.innerHTML = '';
        if (carouselItems.length === 0) {
            elements.itemsContainer.innerHTML = '<p>Aucun élément dans le carrousel.</p>';
            return;
        }
        carouselItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'list-group-item';
            itemElement.dataset.id = item.id;
            itemElement.innerHTML = `
                <span>${item.title} (${item.type})</span>
                <div>
                    <button class="btn btn-sm btn-primary edit-btn">Modifier</button>
                    <button class="btn btn-sm btn-danger delete-btn">Supprimer</button>
                </div>
            `;
            elements.itemsContainer.appendChild(itemElement);
        });
    }

    async function uploadToCloudinary(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // REMPLACEZ PAR VOTRE UPLOAD PRESET
        formData.append('cloud_name', 'YOUR_CLOUD_NAME'); // REMPLACEZ PAR VOTRE CLOUD NAME

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', { // REMPLACEZ PAR VOTRE CLOUD NAME
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.secure_url) {
                return data.secure_url;
            } else {
                throw new Error('Échec de l\'upload Cloudinary');
            }
        } catch (error) {
            console.error('Erreur d\'upload sur Cloudinary:', error);
            throw error;
        }
    }

    elements.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoader(true);

        const id = elements.hiddenId.value;
        const type = elements.mediaType.value;
        let imageUrl = elements.imageUrl.value;
        let mediaUrl = type === 'youtube' ? elements.videoUrl.value : '';

        try {
            if (type === 'cloudinary' && elements.imageUpload.files[0]) {
                imageUrl = await uploadToCloudinary(elements.imageUpload.files[0]);
            }

            const data = {
                title: elements.title.value,
                contenu: elements.contenu.value,
                type: type,
                imageUrl: imageUrl,
                mediaUrl: mediaUrl,
                order: id ? carouselItems.find(item => item.id === id).order : carouselItems.length,
            };

            const batch = writeBatch(db);
            if (id) {
                batch.update(doc(db, 'carousel', id), data);
            } else {
                batch.set(doc(collection(db, 'carousel')), data);
            }
            await batch.commit();

            elements.modal.hide();
            await loadCarouselItems();
        } catch (error) {
            console.error('Erreur de sauvegarde:', error);
            alert('Erreur de sauvegarde.');
        } finally {
            showLoader(false);
        }
    });

    elements.itemsContainer.addEventListener('click', (e) => {
        const id = e.target.closest('.list-group-item').dataset.id;
        if (e.target.classList.contains('edit-btn')) {
            const item = carouselItems.find(item => item.id === id);
            elements.hiddenId.value = id;
            elements.title.value = item.title;
            elements.contenu.value = item.contenu;
            elements.mediaType.value = item.type;
            elements.imageUrl.value = item.imageUrl || '';
            elements.videoUrl.value = item.mediaUrl || '';
            elements.imagePreview.src = item.imageUrl || '';
            elements.imagePreviewContainer.style.display = item.imageUrl ? 'block' : 'none';
            toggleMediaInput();
            elements.modal.show();
        } else if (e.target.classList.contains('delete-btn')) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
                deleteItem(id);
            }
        }
    });

    async function deleteItem(id) {
        showLoader(true);
        try {
            await deleteDoc(doc(db, 'carousel', id));
            await loadCarouselItems();
        } catch (error) {
            console.error('Erreur de suppression:', error);
            alert('Erreur de suppression.');
        } finally {
            showLoader(false);
        }
    }

    elements.addItemBtn.addEventListener('click', () => {
        elements.form.reset();
        elements.hiddenId.value = '';
        elements.imagePreviewContainer.style.display = 'none';
        toggleMediaInput();
        elements.modal.show();
    });

    elements.mediaType.addEventListener('change', toggleMediaInput);
    elements.imageUpload.addEventListener('change', () => {
        const file = elements.imageUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                elements.imagePreview.src = e.target.result;
                elements.imagePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    await loadCarouselItems();
}