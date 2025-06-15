// Fonction pour charger le pied de page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Début du chargement du pied de page');
    
    // Vérifier si le pied de page n'existe pas déjà
    if (!document.querySelector('footer')) {
        console.log('Aucun footer trouvé, création du conteneur');
        
        // Créer un élément div pour le pied de page
        const footerDiv = document.createElement('div');
        footerDiv.id = 'footer-container';
        
        // Ajouter le div avant la fermeture du body
        document.body.appendChild(footerDiv);
        
        // Déterminer le chemin de base (racine du site)
        const basePath = window.location.origin;
        console.log('Chemin de base:', basePath);
        
        // Charger le contenu du pied de page
        const footerUrl = '../includes/footer.html';
        console.log('Tentative de chargement de:', footerUrl);
        
        fetch(footerUrl, { 
            headers: { 'Content-Type': 'text/html' },
            cache: 'no-cache'
        })
            .then(response => {
                console.log('Réponse du serveur:', response.status, response.statusText);
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                console.log('Contenu du footer chargé avec succès');
                // Insérer le contenu du footer
                footerDiv.innerHTML = html;
                
                // Charger les styles du footer
                const styles = [
                    '../assets/css/footer-style.css',
                    '../assets/css/footer-logo.css'
                ];
                
                styles.forEach(styleUrl => {
                    console.log('Chargement du style:', styleUrl);
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = styleUrl;
                    link.onload = () => console.log(`Style chargé: ${styleUrl}`);
                    link.onerror = (e) => console.error(`Erreur de chargement du style ${styleUrl}:`, e);
                    document.head.appendChild(link);
                });
                
                // Charger Font Awesome si pas déjà chargé
                if (!document.querySelector('link[href*="font-awesome"]')) {
                    console.log('Chargement de Font Awesome');
                    const faLink = document.createElement('link');
                    faLink.rel = 'stylesheet';
                    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
                    document.head.appendChild(faLink);
                }
            })
            .catch(error => {
                console.error('Erreur lors du chargement du pied de page:', error);
                // Afficher un message d'erreur en cas d'échec
                footerDiv.innerHTML = `
                    <footer style="background-color: #1a1a1a; color: white; text-align: center; padding: 20px 0; margin-top: 40px;">
                        <div class="container">
                            <p>© 2024 Franchini - 111 av des monts du matin, 26300 Marches - <a href="tel:0475474037" style="color: #4CAF50;">04 75 47 40 37</a></p>
                            <p style="color: #ff6b6b; font-size: 0.8em;">Erreur de chargement du pied de page: ${error.message}</p>
                        </div>
                    </footer>
                `;
            });
    } else {
        console.log('Un footer existe déjà dans le DOM');
    }
});
