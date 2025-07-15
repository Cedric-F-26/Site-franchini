document.addEventListener('DOMContentLoaded', async () => {
    // Attendre que la configuration Firebase soit chargée
    if (!window.firebase || !window.imageCompression) {
        console.error("Firebase ou la bibliothèque de compression d'image n'est pas initialisé.");
        return;
    }

    const { 
        auth, onAuthStateChanged, 
        db, collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, 
        storage, ref, uploadBytes, getDownloadURL, deleteObject 
    } = window.firebase;

    // --- AUTHENTIFICATION ---
    const adminContent = document.getElementById('admin-content');
    const loginContainer = document.getElementById('login-container');

    onAuthStateChanged(auth, user => {
        if (user) {
            if (adminContent) adminContent.style.display = 'block';
            if (loginContainer) loginContainer.style.display = 'none';
        } else {
            if (adminContent) adminContent.style.display = 'none';
            if (loginContainer) loginContainer.style.display = 'block';
        }
    });

    // --- FONCTIONS UTILITAIRES (DROPZONE) ---
    function initDropzones() {
        const dropzone = document.getElementById('image-dropzone');
        const input = document.getElementById('media-upload');
        const preview = document.getElementById('image-preview');

        if (!dropzone || !input || !preview) return;

        dropzone.addEventListener('click', () => input.click());
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
                updatePreview(preview, input.files[0]);
            }
        });
        input.addEventListener('change', () => {
            if (input.files.length) {
                updatePreview(preview, input.files[0]);
            }
        });
    }

    function updatePreview(previewElement, file) {
        if (!file.type.startsWith('image/')) {
            previewElement.innerHTML = `<p>Le fichier n'est pas une image.</p>`;
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            previewElement.innerHTML = `<img src="${e.target.result}" alt="Aperçu" class="img-preview">`;
        };
        reader.readAsDataURL(file);
    }

    // --- GESTION DES ONGLETS ---
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.getElementById(tab.dataset.tab);

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(tc => tc.classList.remove('active'));
            if(target) target.classList.add('active');
        });
    });

    // --- GESTION DU CARROUSEL D'ACCUEIL ---
    const addMediaBtn = document.getElementById('add-media-btn');
    const mediaTypeSelect = document.getElementById('media-type-select');
    const imageUploadSection = document.getElementById('image-upload-section');
    const youtubeSection = document.getElementById('youtube-section');
    const mediaUploadInput = document.getElementById('media-upload');
    const youtubeUrlInput = document.getElementById('youtube-url');
    const mediaTitleInput = document.getElementById('media-title');
    const carouselItemsList = document.getElementById('carousel-items-list');

    if (mediaTypeSelect) {
        mediaTypeSelect.addEventListener('change', () => {
            const isImage = mediaTypeSelect.value === 'image';
            imageUploadSection.style.display = isImage ? 'block' : 'none';
            youtubeSection.style.display = isImage ? 'none' : 'block';
        });
    }

    async function loadCarouselItems() {
        if (!carouselItemsList) return;
        const q = query(collection(db, 'carousel'), orderBy('order', 'desc'));
        const querySnapshot = await getDocs(q);
        carouselItemsList.innerHTML = '';
        querySnapshot.forEach((docSnap) => {
            const item = docSnap.data();
            const listItem = document.createElement('div');
            listItem.className = 'list-item';

            let previewHtml = '';
            if (item.type === 'image' && item.imageUrl) {
                previewHtml = `<img src="${item.imageUrl}" alt="Aperçu" class="item-preview">`;
            } else if (item.type === 'youtube' && item.mediaUrl) {
                const videoIdMatch = item.mediaUrl.match(/(?:https?):\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
                if (videoIdMatch && videoIdMatch[1]) {
                    previewHtml = `<img src="https://img.youtube.com/vi/${videoIdMatch[1]}/mqdefault.jpg" alt="Aperçu YouTube" class="item-preview">`;
                }
            }

            listItem.innerHTML = `
                ${previewHtml}
                <span class="item-title">${item.title || (item.type === 'image' ? 'Image' : 'Vidéo')}</span>
                <div class="item-actions">
                    <button class="btn btn-danger btn-sm delete-carousel-item" data-id="${docSnap.id}" data-type="${item.type}" data-url="${item.imageUrl || ''}">Supprimer</button>
                </div>
            `;
            carouselItemsList.appendChild(listItem);
        });
    }

    if (addMediaBtn) {
        addMediaBtn.addEventListener('click', async () => {
            const originalBtnText = addMediaBtn.textContent;
            addMediaBtn.disabled = true;

            try {
                const type = mediaTypeSelect.value;
                const title = mediaTitleInput.value;
                let imageUrl = '';
                let mediaUrl = '';

                if (type === 'image') {
                    const file = mediaUploadInput.files[0];
                    if (!file) {
                        alert('Veuillez sélectionner une image.');
                        throw new Error('No file selected');
                    }

                    addMediaBtn.textContent = 'Compression...';
                    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
                    const compressedFile = await imageCompression(file, options);
                    
                    addMediaBtn.textContent = 'Envoi...';
                    const storageRef = ref(storage, `carousel-images/${Date.now()}_${compressedFile.name}`);
                    const snapshot = await uploadBytes(storageRef, compressedFile);
                    imageUrl = await getDownloadURL(snapshot.ref);
                    mediaUrl = imageUrl;

                } else if (type === 'youtube') {
                    mediaUrl = youtubeUrlInput.value;
                    if (!mediaUrl || !mediaUrl.includes('youtu')) {
                        alert('Veuillez entrer une URL YouTube valide.');
                        throw new Error('Invalid YouTube URL');
                    }
                }

                await addDoc(collection(db, 'carousel'), {
                    title: title,
                    type: type,
                    imageUrl: imageUrl,
                    mediaUrl: mediaUrl,
                    order: Date.now()
                });

                alert('Média ajouté avec succès !');
                mediaTitleInput.value = '';
                mediaUploadInput.value = '';
                youtubeUrlInput.value = '';
                loadCarouselItems();

            } catch (error) {
                console.error("Erreur lors de l'ajout du média: ", error);
                if (error.message !== 'No file selected' && error.message !== 'Invalid YouTube URL') {
                    alert("Une erreur est survenue lors de l'ajout du média.");
                }
            } finally {
                addMediaBtn.disabled = false;
                addMediaBtn.textContent = originalBtnText;
            }
        });
    }

    // Initialisation des composants
    initDropzones();
    if (carouselItemsList) {
        loadCarouselItems();

        carouselItemsList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-carousel-item')) {
                const button = e.target;
                if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
                    try {
                        const id = button.dataset.id;
                        const type = button.dataset.type;
                        const url = button.dataset.url;

                        await deleteDoc(doc(db, 'carousel', id));

                        if (type === 'image' && url) {
                            const imageRef = ref(storage, url);
                            await deleteObject(imageRef);
                        }

                        alert('Élément supprimé avec succès.');
                        loadCarouselItems();
                    } catch (error) {
                        console.error('Erreur lors de la suppression :', error);
                        alert('Une erreur est survenue lors de la suppression.');
                    }
                }
            }
        });
    }
});