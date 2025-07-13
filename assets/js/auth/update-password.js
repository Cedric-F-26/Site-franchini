document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const resetForm = document.getElementById('reset-password-form');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const successMessage = document.getElementById('success-message');

    // Gestion de l'affichage/masquage du mot de passe
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
            confirmPasswordInput.type = type;
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Gestion de la soumission du formulaire
    if (resetForm) {
        resetForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            // Validation
            if (password.length < 6) {
                showError('Le mot de passe doit contenir au moins 6 caractères');
                return;
            }

            if (password !== confirmPassword) {
                showError('Les mots de passe ne correspondent pas');
                return;
            }

            try {
                // Récupère le token de réinitialisation depuis l'URL
                const urlParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = urlParams.get('access_token');
                const type = urlParams.get('type');

                if (type === 'recovery' && accessToken) {
                    // Met à jour le mot de passe avec Supabase
                    // Vous devrez remplacer cette logique par Firebase si vous migrez
                    const { data, error } = await supabase.auth.updateUser({
                        password: password
                    });

                    if (error) throw error;

                    // Affiche le message de succès
                    successMessage.style.display = 'flex';
                    resetForm.style.display = 'none';

                    // Redirige vers la page de connexion après 3 secondes
                    setTimeout(() => {
                        window.location.href = 'connexion-prive.html';
                    }, 3000);
                } else {
                    throw new Error('Lien de réinitialisation invalide ou expiré');
                }
            } catch (error) {
                console.error('Erreur lors de la réinitialisation du mot de passe:', error);
                showError(error.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe');
            }
        });
    }

    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
        successMessage.style.display = 'none';
    }
});
