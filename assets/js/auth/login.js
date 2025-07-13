import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (!loginForm) {
        return; // Ne rien faire si le formulaire n'est pas sur la page
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Connexion réussie
            window.location.href = '/pages/administrateur.html'; // Redirection vers la page administrateur
        } catch (error) {
            console.error('Erreur de connexion:', error.code, error.message);
            let displayMessage = 'Erreur de connexion. Veuillez vérifier vos identifiants.';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                displayMessage = 'Identifiant ou mot de passe incorrect.';
            } else if (error.code === 'auth/invalid-email') {
                displayMessage = 'Adresse email invalide.';
            }
            errorMessage.textContent = 'Erreur : ' + displayMessage;
            errorMessage.style.display = 'block';
        }
    });
});
