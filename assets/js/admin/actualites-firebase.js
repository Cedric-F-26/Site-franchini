// Gestion des actualités avec Firestore + Storage (Version corrigée et modernisée)
import { db, storage } from '../auth/firebase-config.js';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import imageCompression from 'https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/dist/browser-image-compression.mjs';

// Assurez-vous que cette fonction est disponible, soit globalement, soit importée.
// Si elle vient de common.js, assurez-vous que common.js est chargé avant ce script.
// Pour plus de robustesse, on peut la redéfinir ici si elle n'est pas globale.
function setupDropzone(dropzoneId, inputId, previewId, onFileSelected) {
    const dropzone = document.getElementById(dropzoneId);
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!dropzone || !input || !preview) return;

    const handleFiles = (file) => {
        if (!file.type.startsWith('image/')) {
            preview.innerHTML = "<p>Le fichier n'est pas une image.</p>";
            return;
        }
        onFileSelected(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px;" alt="Aperçu">`;
        };
        reader.readAsDataURL(file);
    };

    dropzone.addEventListener('click', (e) => { e.stopPropagation(); input.click(); });
    ['dragenter', 'dragover'].forEach(eventName => dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    }));
    ['dragleave', 'drop'].forEach(eventName => dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
    }));
    dropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files[0]);
        }
    });
    input.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFiles(e.target.files[0]);
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('actualites-form');
    const listContainer = document.getElementById('actualites-list');
    let selectedFile = null;

    // Initialisation de la dropzone
    setupDropzone('actualite-media-dropzone', 'actualite-media-input', 'actualite-media-preview', (file) => {
        selectedFile = file;
    });

    // Récupère et affiche les actualités
    async function fetchActualites() {
        if (!listContainer) return;
        try {
            const q = query(collection(db, 'Actualités'), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            renderList(items);
        } catch (err) {
            console.error("Erreur lors de la récupération des actualités:", err);
        }
    }

    // Affiche la liste des actualités dans le DOM
    function renderList(items) {
        listContainer.innerHTML = '';
        items.forEach(item => {
            let mediaHtml = '';
            if (item.type === 'image' && item.mediaUrl) {
                mediaHtml = `<img src="${item.mediaUrl}" class="card-img-top" alt="Image pour ${item.titre}">`;
            } else if (item.type === 'video' && item.mediaUrl) {
                const videoIdMatch = item.mediaUrl.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
                if (videoIdMatch) {
                    mediaHtml = `<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${videoIdMatch[1]}" allowfullscreen></iframe></div>`;
                }
            }

            const el = document.createElement('div');
            el.className = 'col-md-4 mb-4';
            el.innerHTML = `
                <div class="card h-100">
                    ${mediaHtml}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${item.titre}</h5>
                        <p class="card-text">${item.contenu}</p>
                        <button class="btn btn-danger btn-sm mt-auto" data-id="${item.id}" data-type="${item.type}" data-url="${item.mediaUrl || ''}">Supprimer</button>
                    </div>
                </div>
            `;
            listContainer.appendChild(el);
        });
    }

    // Gère la soumission du formulaire
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titre = document.getElementById('actualite-titre').value;
            const contenu = document.getElementById('actualite-contenu').value;
            let mediaUrl = '';
            let type = 'text';

            try {
                if (selectedFile) {
                    type = 'image';
                    const compressedFile = await imageCompression(selectedFile, { maxSizeMB: 1, maxWidthOrHeight: 1920 });

                    const formData = new FormData();
                    formData.append('file', compressedFile);
                    formData.append('upload_preset', 'Site Web');
                    formData.append('cloud_name', 'dokuchvas');

                    try {
                        const response = await fetch('https://api.cloudinary.com/v1_1/dokuchvas/image/upload', {
                            method: 'POST',
                            body: formData
                        });
                        const data = await response.json();
                        if (data.secure_url) {
                            mediaUrl = data.secure_url;
                        } else {
                            throw new Error('Cloudinary upload failed: ' + (data.error ? data.error.message : 'Unknown error'));
                        }
                    } catch (uploadError) {
                        console.error("Erreur lors de l'envoi à Cloudinary:", uploadError);
                        alert("L'envoi de l'image a échoué.");
                        return; // Arrêter le processus si l'upload échoue
                    }
                } else {
                    const youtubeIdMatch = contenu.match(/(?:https?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?|\?)?/);
                    if (youtubeIdMatch && youtubeIdMatch[1]) {
                        type = 'video';
                        mediaUrl = `https://www.youtube.com/watch?v=${youtubeIdMatch[1]}`;
                    }
                }

                await addDoc(collection(db, 'Actualités'), {
                    titre,
                    contenu,
                    mediaUrl,
                    type,
                    date: Date.now()
                });

                form.reset();
                const preview = document.getElementById('actualite-media-preview');
                if (preview) preview.innerHTML = '';
                selectedFile = null;
                fetchActualites();
            } catch (err) {
                console.error("Erreur lors de l'ajout de l'actualité:", err);
                alert("Erreur lors de l'ajout de l'actualité.");
            }
        });
    }

    // Gère la suppression d'une actualité
    if (listContainer) {
        listContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-danger')) {
                const btn = e.target;
                const { id, type, url } = btn.dataset;

                if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
                    try {
                        await deleteDoc(doc(db, 'Actualités', id));
                        // La suppression des images sur Cloudinary depuis le client n'est pas sécurisée
                        // et nécessiterait une API côté serveur. Pour l'instant, la suppression
                        // ne supprime que l'entrée dans Firestore.
                        fetchActualites();
                    } catch (err) {
                        console.error("Erreur lors de la suppression:", err);
                        alert("Erreur lors de la suppression.");
                    }
                }
            }
        });
    }

    // Premier chargement des données
    fetchActualites();
});