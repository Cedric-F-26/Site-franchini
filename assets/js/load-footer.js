console.log('Script load-footer.js chargé avec succès');

// Fonction pour créer le pied de page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Événement DOMContentLoaded déclenché');
    // Vérifier si le pied de page n'existe pas déjà
    if (!document.querySelector('footer')) {
        // Créer l'élément footer
        const footer = document.createElement('footer');
        
        // Contenu HTML du footer
        footer.innerHTML = `
            <div class="footer-content">
                <div class="footer-info">
                    <div class="footer-logo">
                        <a href="index.html" class="logo-text">FRANCHINI</a>
                        <p>Votre concessionnaire agricole de confiance dans la Drôme</p>
                    </div>
                </div>
                
                <div class="footer-links">
                    <h3>Liens rapides</h3>
                    <ul>
                        <li><a href="index.html">Accueil</a></li>
                        <li><a href="pages/materiel.html">Matériel</a></li>
                        <li><a href="pages/occasion.html">Occasions</a></li>
                        <li><a href="pages/location.html">Location</a></li>
                        <li><a href="pages/magasin.html">Magasin</a></li>
                        <li><a href="pages/contact.html">Contact</a></li>
                    </ul>
                </div>
                
                <div class="footer-contact">
                    <h3>Coordonnées</h3>
                    <p><i class="fas fa-map-marker-alt"></i> 111 av des monts du matin</p>
                    <p>26300 Marches</p>
                    <p><i class="fas fa-phone"></i> <a href="tel:0475474037" class="phone-link">04 75 47 40 37</a></p>
                    <p><i class="fas fa-envelope"></i> <a href="mailto:contact@franchini.fr" class="email-link">contact@franchini.fr</a></p>
                    
                    <div class="social-links">
                        <a href="https://www.facebook.com/franchinimarches" target="_blank" rel="noopener noreferrer" class="social-icon">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.instagram.com/franchini_deutzfahr" target="_blank" rel="noopener noreferrer" class="social-icon">
                            <i class="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <div class="container">
                    <p>&copy; ${new Date().getFullYear()} Franchini. Tous droits réservés.</p>
                </div>
            </div>
        `;
        
        // Ajouter le footer à la fin du body
        document.body.appendChild(footer);
        
        // Ajouter les styles
        const style = document.createElement('style');
        style.textContent = `
            /* Footer */
            footer {
                background-color: #1a1a1a;
                color: #fff;
                padding: 60px 0 0;
                font-family: 'Roboto', sans-serif;
                margin-top: 60px;
            }
            
            .footer-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 40px;
                margin-bottom: 40px;
            }
            
            .footer-info {
                margin: 0 auto 20px;
                text-align: center;
                width: 100%;
                max-width: 300px;
            }
            
            .footer-logo {
                margin-bottom: 20px;
            }
            
            .footer-logo a {
                color: #4CAF50;
                font-size: 24px;
                font-weight: 700;
                text-decoration: none;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 15px;
                display: block;
                text-align: center;
            }
            
            .footer-logo p {
                color: #aaa;
                line-height: 1.6;
                margin: 15px 0 0;
            }
            
            .footer-links h3,
            .footer-contact h3 {
                color: #4CAF50;
                font-size: 18px;
                margin-bottom: 20px;
                position: relative;
                padding-bottom: 10px;
            }
            
            .footer-links h3::after,
            .footer-contact h3::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 40px;
                height: 2px;
                background-color: #4CAF50;
            }
            
            .footer-links ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .footer-links ul li {
                margin-bottom: 10px;
            }
            
            .footer-links ul li a {
                color: #ddd;
                text-decoration: none;
                transition: color 0.3s, padding-left 0.3s;
                display: block;
                padding: 5px 0;
            }
            
            .footer-links ul li a:hover {
                color: #4CAF50;
                padding-left: 5px;
            }
            
            .footer-contact p {
                color: #ddd;
                margin: 10px 0;
                line-height: 1.6;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .phone-link,
            .email-link {
                color: #4CAF50 !important;
                text-decoration: none;
                transition: opacity 0.3s;
            }
            
            .phone-link:hover,
            .email-link:hover {
                opacity: 0.8;
            }
            
            .social-links {
                display: flex;
                gap: 15px;
                margin-top: 20px;
            }
            
            .social-icon {
                color: #fff;
                background-color: #333;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
                text-decoration: none;
            }
            
            .social-icon:hover {
                background-color: #4CAF50;
                transform: translateY(-3px);
            }
            
            .footer-bottom {
                background-color: #111;
                padding: 20px 0;
                text-align: center;
            }
            
            .footer-bottom p {
                margin: 0;
                color: #aaa;
                font-size: 14px;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .footer-content {
                    grid-template-columns: 1fr;
                    text-align: center;
                    gap: 30px;
                }
                
                .footer-links ul,
                .footer-contact p {
                    justify-content: center;
                }
                
                .social-links {
                    justify-content: center;
                }
                
                .footer-links h3::after,
                .footer-contact h3::after {
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        `;
        
        // Ajouter les styles au document
        document.head.appendChild(style);
        
        // Charger Font Awesome si pas déjà chargé
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
            document.head.appendChild(faLink);
        }
    }
});
