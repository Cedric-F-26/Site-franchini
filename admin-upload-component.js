// Composant d'upload avec glisser-déposer
class FileUploadComponent {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            multiple: options.multiple || false,
            acceptedTypes: options.acceptedTypes || 'image/*,video/*',
            maxSize: options.maxSize || 10 * 1024 * 1024, // 10MB
            onUpload: options.onUpload || this.defaultOnUpload,
            onProgress: options.onProgress || (() => {}),
            onError: options.onError || this.defaultOnError,
            ...options
        };
        
        this.init();
    }

    init() {
        this.createUploadArea();
        this.setupEventListeners();
    }

    createUploadArea() {
        this.container.innerHTML = `
            <div class="upload-area" style="
                border: 3px dashed #ccc;
                border-radius: 10px;
                padding: 40px;
                text-align: center;
                background: #f9f9f9;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            ">
                <div class="upload-content">
                    <i class="fas fa-cloud-upload-alt" style="font-size: 3rem; color: #4CAF50; margin-bottom: 15px;"></i>
                    <h3 style="margin: 10px 0; color: #333;">Glissez-déposez vos fichiers ici</h3>
                    <p style="margin: 5px 0; color: #666;">ou</p>
                    <button type="button" class="browse-btn" style="
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 10px;
                    ">Parcourir vos fichiers</button>
                    <p style="margin: 15px 0 0 0; font-size: 0.9rem; color: #999;">
                        Images (JPG, PNG, GIF) et vidéos (MP4, WebM) - Max 10MB
                    </p>
                </div>
                <input type="file" class="file-input" style="display: none;" 
                    accept="${this.options.acceptedTypes}" 
                    ${this.options.multiple ? 'multiple' : ''}>
                
                <div class="upload-progress" style="display: none; margin-top: 20px;">
                    <div style="background: #e0e0e0; border-radius: 5px; overflow: hidden;">
                        <div class="progress-bar" style="
                            background: #4CAF50;
                            height: 10px;
                            width: 0%;
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                    <p class="progress-text" style="margin: 10px 0 0 0; font-size: 0.9rem; color: #666;">0%</p>
                </div>
                
                <div class="upload-preview" style="display: none; margin-top: 20px;"></div>
            </div>
        `;

        this.uploadArea = this.container.querySelector('.upload-area');
        this.fileInput = this.container.querySelector('.file-input');
        this.browseBtn = this.container.querySelector('.browse-btn');
        this.progressContainer = this.container.querySelector('.upload-progress');
        this.progressBar = this.container.querySelector('.progress-bar');
        this.progressText = this.container.querySelector('.progress-text');
        this.previewContainer = this.container.querySelector('.upload-preview');
    }

    setupEventListeners() {
        // Clic sur la zone
        this.uploadArea.addEventListener('click', () => {
            this.fileInput.click();
        });

        // Clic sur le bouton parcourir
        this.browseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fileInput.click();
        });

        // Sélection de fichiers
        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Glisser-déposer
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.style.borderColor = '#4CAF50';
            this.uploadArea.style.background = '#e8f5e8';
        });

        this.uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.uploadArea.style.borderColor = '#ccc';
            this.uploadArea.style.background = '#f9f9f9';
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.style.borderColor = '#ccc';
            this.uploadArea.style.background = '#f9f9f9';
            this.handleFiles(e.dataTransfer.files);
        });
    }

    handleFiles(files) {
        const filesArray = Array.from(files);
        
        if (!this.options.multiple && filesArray.length > 1) {
            this.options.onError('Veuillez sélectionner un seul fichier');
            return;
        }

        filesArray.forEach(file => {
            if (!this.validateFile(file)) {
                return;
            }
            this.uploadFile(file);
        });
    }

    validateFile(file) {
        // Vérifier le type
        const acceptedTypes = this.options.acceptedTypes.split(',').map(type => type.trim());
        const isAccepted = acceptedTypes.some(type => {
            if (type.endsWith('/*')) {
                return file.type.startsWith(type.slice(0, -1));
            }
            return file.type === type;
        });

        if (!isAccepted) {
            this.options.onError(`Type de fichier non accepté: ${file.type}`);
            return false;
        }

        // Vérifier la taille
        if (file.size > this.options.maxSize) {
            this.options.onError(`Fichier trop volumineux: ${this.formatFileSize(file.size)} (max: ${this.formatFileSize(this.options.maxSize)})`);
            return false;
        }

        return true;
    }

    async uploadFile(file) {
        this.showProgress();
        this.showPreview(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                this.hideProgress();
                this.options.onUpload(result.data, file);
            } else {
                throw new Error(result.message || 'Erreur lors de l\'upload');
            }

        } catch (error) {
            this.hideProgress();
            this.options.onError(error.message);
        }
    }

    showProgress() {
        this.progressContainer.style.display = 'block';
        this.progressBar.style.width = '0%';
        this.progressText.textContent = '0%';
    }

    hideProgress() {
        this.progressContainer.style.display = 'none';
    }

    showPreview(file) {
        this.previewContainer.style.display = 'block';
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const isVideo = file.type.startsWith('video/');
            
            this.previewContainer.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <strong>${file.name}</strong> (${this.formatFileSize(file.size)})
                </div>
                ${isVideo ? 
                    `<video controls style="max-width: 100%; max-height: 200px; border-radius: 5px;">
                        <source src="${e.target.result}" type="${file.type}">
                    </video>` :
                    `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 5px;">`
                }
            `;
        };
        
        reader.readAsDataURL(file);
    }

    updateProgress(percent) {
        this.progressBar.style.width = `${percent}%`;
        this.progressText.textContent = `${percent}%`;
        this.options.onProgress(percent);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    defaultOnUpload(data, file) {
        console.log('Fichier uploadé:', data);
        alert(`Fichier "${file.name}" uploadé avec succès!`);
    }

    defaultOnError(error) {
        console.error('Erreur upload:', error);
        alert(`Erreur: ${error}`);
    }

    reset() {
        this.fileInput.value = '';
        this.hideProgress();
        this.previewContainer.style.display = 'none';
    }
}

// Export pour utilisation globale
window.FileUploadComponent = FileUploadComponent;
