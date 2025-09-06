import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const emailInput = document.getElementById('email');
    const rememberMeCheckbox = document.getElementById('remember-me');

    if (!loginForm) {
        return; // Ne rien faire si le formulaire n'est pas sur la page
    }

    // Pré-remplir l'email si "Se souvenir de moi" était coché
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = emailInput.value;
        const password = document.getElementById('password').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Connexion réussie pour :', userCredential.user.email);

            // Gérer "Se souvenir de moi"
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Redirection vers la page d'accueil après connexion
            window.location.href = '/';
        } catch (error) {
            console.error('Erreur de connexion:', error.code, error.message);
            let displayMessage = 'Erreur de connexion. Veuillez vérifier vos identifiants.';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                displayMessage = 'Identifiant ou mot de passe incorrect.';
            } else if (error.code === 'auth/invalid-email') {
                displayMessage = 'Adresse email invalide.';
            }
            if (errorMessage) {
                errorMessage.textContent = displayMessage;
                errorMessage.style.display = 'block';
            } else {
                // Fallback si l'élément n'est pas trouvé
                alert(displayMessage);
            }
        }
    });
});
