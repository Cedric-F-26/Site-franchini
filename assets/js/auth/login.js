document.addEventListener('DOMContentLoaded', function() {
    // Attend que Supabase soit initialisé
    const waitForSupabase = setInterval(() => {
        if (window.supabase) {
            clearInterval(waitForSupabase);
            initializeForm();
        }
    }, 50);

    function initializeForm() {
        const loginForm = document.getElementById('login-form');
        const errorMessage = document.getElementById('error-message');
        const supabase = window.supabase;

        if (!loginForm) {
            return; // Ne rien faire si le formulaire n'est pas sur la page
        }

        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                errorMessage.textContent = 'Erreur : ' + error.message;
                errorMessage.style.display = 'block';
            } else {
                // Redirection vers la page admin en cas de succès
                window.location.href = '/pages/administrateur.html';
            }
        });
    }
});
