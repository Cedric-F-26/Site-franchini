// 🗄️ Système de gestion des données administrateur
// Stockage local pour les actualités et carrousels

class AdminDataManager {
    constructor() {
        this.initializeData();
    }

    // Initialisation des données par défaut
    initializeData() {
        if (!localStorage.getItem('franchini_home_videos')) {
            const defaultVideos = [
                {
                    id: 1,
                    title: "Deutz-Fahr Série 6",
                    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    description: "Découvrez la nouvelle série 6 Deutz-Fahr",
                    position: 1,
                    active: true
                },
                {
                    id: 2,
                    title: "Démonstration Matériel",
                    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    description: "Voir nos matériels en action",
                    position: 2,
                    active: true
                },
                {
                    id: 3,
                    title: "Promotion Printemps",
                    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    description: "Offres spéciales sur le matériel neuf",
                    position: 3,
                    active: true
                }
            ];
            localStorage.setItem('franchini_home_videos', JSON.stringify(defaultVideos));
        }

        if (!localStorage.getItem('franchini_actualites')) {
            const defaultActualites = [
                {
                    id: 1,
                    title: "Nouveau Tracteur Deutz-Fahr",
                    description: "Découvrez notre dernier modèle de tracteur",
                    type: "video",
                    mediaUrl: "https://picsum.photos/seed/tracteur1/600/400.jpg",
                    date: "07/03/2024",
                    position: 1,
                    active: true
                },
                {
                    id: 2,
                    title: "Promotion Printemps",
                    description: "Offres spéciales sur le matériel neuf",
                    type: "image",
                    mediaUrl: "https://picsum.photos/seed/promo1/600/400.jpg",
                    date: "05/03/2024",
                    position: 2,
                    active: true
                },
                {
                    id: 3,
                    title: "Nouveau Service",
                    description: "Maintenance 24/7 disponible",
                    type: "image",
                    mediaUrl: "https://picsum.photos/seed/service1/600/400.jpg",
                    date: "01/03/2024",
                    position: 3,
                    active: false
                }
            ];
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
}

// Instance globale
window.adminData = new AdminDataManager();
