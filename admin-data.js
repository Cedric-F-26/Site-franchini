// 🗄️ Système de gestion des données administrateur
// Stockage local partagé entre admin et site public

class AdminDataManager {
    constructor() {
        this.initializeData();
        this.addTestDataIfEmpty(); // Ajouter des données de test pour le développement
    }

    // Initialisation des données par défaut (vides pour données réelles)
    initializeData() {
        // Utiliser les mêmes clés que le site public pour partage
        if (!localStorage.getItem('franchini_home_videos')) {
            const defaultVideos = [];
            localStorage.setItem('franchini_home_videos', JSON.stringify(defaultVideos));
        }

        if (!localStorage.getItem('franchini_actualites')) {
            const defaultActualites = [];
            localStorage.setItem('franchini_actualites', JSON.stringify(defaultActualites));
        }

        if (!localStorage.getItem('franchini_settings')) {
            const defaultSettings = {
                carousel: {
                    autoPlay: true,
                    interval: 5000,
                    showControls: true,
                    muted: true
                },
                actualites: {
                    autoPlay: true,
                    interval: 5000,
                    showDescriptions: true,
                    showDates: true
                }
            };
            localStorage.setItem('franchini_settings', JSON.stringify(defaultSettings));
        }

        // Initialiser le matériel d'occasion
        if (!localStorage.getItem('franchini_equipment')) {
            const defaultEquipment = [];
            localStorage.setItem('franchini_equipment', JSON.stringify(defaultEquipment));
        }
    }

    // Ajouter des données de test si vide (pour développement)
    addTestDataIfEmpty() {
        const videos = this.getHomeVideos();
        if (videos.length === 0) {
            console.log('🎥 Ajout de vidéos de test pour le développement');
            const testVideos = [
                {
                    id: Date.now() + 1,
                    title: 'Deutz-Fahr Série 6 - Présentation',
                    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    description: 'Découvrez la nouvelle série 6 Deutz-Fahr',
                    type: 'youtube',
                    position: 1,
                    active: true
                },
                {
                    id: Date.now() + 2,
                    title: 'Matériel Agricole - Démonstration',
                    url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
                    description: 'Voir notre matériel en action',
                    type: 'youtube',
                    position: 2,
                    active: true
                }
            ];
            localStorage.setItem('franchini_home_videos', JSON.stringify(testVideos));
            return testVideos;
        }
        return videos;
    }

    // Gestion des vidéos d'accueil
    getHomeVideos() {
        return JSON.parse(localStorage.getItem('franchini_home_videos') || '[]');
    }

    addHomeVideo(video) {
        const videos = this.getHomeVideos();
        const newVideo = {
            id: Date.now(),
            ...video,
            position: videos.length + 1,
            active: true
        };
        videos.push(newVideo);
        localStorage.setItem('franchini_home_videos', JSON.stringify(videos));
        return newVideo;
    }

    updateHomeVideo(id, updates) {
        const videos = this.getHomeVideos();
        const index = videos.findIndex(v => v.id === id);
        if (index !== -1) {
            videos[index] = { ...videos[index], ...updates };
            localStorage.setItem('franchini_home_videos', JSON.stringify(videos));
            return videos[index];
        }
        return null;
    }

    deleteHomeVideo(id) {
        const videos = this.getHomeVideos();
        const filtered = videos.filter(v => v.id !== id);
        localStorage.setItem('franchini_home_videos', JSON.stringify(filtered));
        return true;
    }

    reorderHomeVideos(newOrder) {
        const videos = this.getHomeVideos();
        newOrder.forEach((id, index) => {
            const video = videos.find(v => v.id === id);
            if (video) {
                video.position = index + 1;
            }
        });
        localStorage.setItem('franchini_home_videos', JSON.stringify(videos));
        return true;
    }

    // Gestion des actualités
    getActualites() {
        return JSON.parse(localStorage.getItem('franchini_actualites') || '[]');
    }

    addActualite(actualite) {
        const actualites = this.getActualites();
        const newActualite = {
            id: Date.now(),
            ...actualite,
            date: new Date().toLocaleDateString('fr-FR'),
            position: actualites.length + 1,
            active: true
        };
        actualites.push(newActualite);
        localStorage.setItem('franchini_actualites', JSON.stringify(actualites));
        return newActualite;
    }

    updateActualite(id, updates) {
        const actualites = this.getActualites();
        const index = actualites.findIndex(a => a.id === id);
        if (index !== -1) {
            actualites[index] = { ...actualites[index], ...updates };
            localStorage.setItem('franchini_actualites', JSON.stringify(actualites));
            return actualites[index];
        }
        return null;
    }

    deleteActualite(id) {
        const actualites = this.getActualites();
        const filtered = actualites.filter(a => a.id !== id);
        localStorage.setItem('franchini_actualites', JSON.stringify(filtered));
        return true;
    }

    reorderActualites(newOrder) {
        const actualites = this.getActualites();
        newOrder.forEach((id, index) => {
            const actualite = actualites.find(a => a.id === id);
            if (actualite) {
                actualite.position = index + 1;
            }
        });
        localStorage.setItem('franchini_actualites', JSON.stringify(actualites));
        return true;
    }

    // Gestion des paramètres
    getSettings() {
        return JSON.parse(localStorage.getItem('franchini_settings') || '{}');
    }

    updateSettings(section, settings) {
        const currentSettings = this.getSettings();
        currentSettings[section] = { ...currentSettings[section], ...settings };
        localStorage.setItem('franchini_settings', JSON.stringify(currentSettings));
        return currentSettings;
    }

    // Export des données
    exportData() {
        return {
            videos: this.getHomeVideos(),
            actualites: this.getActualites(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
    }

    // Import des données
    importData(data) {
        if (data.videos) {
            localStorage.setItem('franchini_home_videos', JSON.stringify(data.videos));
        }
        if (data.actualites) {
            localStorage.setItem('franchini_actualites', JSON.stringify(data.actualites));
        }
        if (data.settings) {
            localStorage.setItem('franchini_settings', JSON.stringify(data.settings));
        }
        return true;
    }

    // Réinitialisation
    resetData() {
        localStorage.removeItem('franchini_home_videos');
        localStorage.removeItem('franchini_actualites');
        localStorage.removeItem('franchini_settings');
        this.initializeData();
        return true;
    }

    // Gestion du matériel d'occasion
    getEquipment() {
        return JSON.parse(localStorage.getItem('franchini_equipment') || '[]');
    }

    addEquipment(equipment) {
        const equipmentList = this.getEquipment();
        const newEquipment = {
            id: Date.now(),
            ...equipment,
            dateAdded: new Date().toLocaleDateString('fr-FR'),
            status: equipment.status || 'available',
            reference: this.generateReference()
        };
        equipmentList.push(newEquipment);
        localStorage.setItem('franchini_equipment', JSON.stringify(equipmentList));
        return newEquipment;
    }

    updateEquipment(id, updates) {
        const equipmentList = this.getEquipment();
        const index = equipmentList.findIndex(e => e.id === id);
        if (index !== -1) {
            equipmentList[index] = { ...equipmentList[index], ...updates };
            localStorage.setItem('franchini_equipment', JSON.stringify(equipmentList));
            return equipmentList[index];
        }
        return null;
    }

    deleteEquipment(id) {
        const equipmentList = this.getEquipment();
        const filtered = equipmentList.filter(e => e.id !== id);
        localStorage.setItem('franchini_equipment', JSON.stringify(filtered));
        return filtered.length < equipmentList.length;
    }

    generateReference() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000);
        return `FR-${year}-${random}`;
    }

    // Les données seront ajoutées manuellement via l'interface administrateur
    // Plus de données démo automatiques
}

// Instance globale
window.adminData = new AdminDataManager();
