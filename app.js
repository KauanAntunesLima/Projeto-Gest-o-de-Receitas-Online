import { initHome, initAllRecipes, initRecipeDetails } from './src/js/cards.js';

function abrirLogin() {
    const dialog = document.querySelector('.modal');
    if (dialog) {
        dialog.showModal();

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.close();
            }
        });

        dialog.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dialog.close();
            }
        });

        const buttons = dialog.querySelectorAll('button');
        buttons[0].addEventListener('click', () => {
            alert('Funcionalidade de criar conta em desenvolvimento');
        });

        buttons[1].addEventListener('click', async () => {
            const usuarioInput = document.getElementById('usuario-input');
            const senhaInput = document.getElementById('senha-input');

            const usuario = usuarioInput.value.trim();
            const senha = senhaInput.value.trim();

            console.log('Valores capturados:', { usuario, senha });

            if (!usuario || !senha) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            try {
                console.log('Enviando login:', { usuario, senha });

                const response = await fetch('http://localhost:8080/v1/toque_gourmet/usuario/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        usuario: usuario,
                        senha: senha
                    })
                });

                if (response.ok) {
                const responseData = await response.json();

                const userData = Array.isArray(responseData) ? responseData[0] : responseData;

                localStorage.setItem('usuarioLogado', JSON.stringify(userData));

                    window.location.href = './src/assets/pages/profile.html';
                    dialog.close();
                } else {
                    const errorData = await response.json();
                    alert('Erro no login: ' + (errorData.mensagem || 'Usuário ou senha inválidos'));
                }
            } catch (error) {
                console.error('Erro no login:', error);
                alert('Erro de conexão. Tente novamente mais tarde.');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const recipeTitle = document.getElementById('recipe-title');

    if (recipeTitle) {
        initRecipeDetails();
    }
    else if (document.getElementById('all-recipes-container')) {
        initAllRecipes();
    }
    else {
        const homeContainers = document.querySelectorAll('.recipe-cards');
        if (homeContainers.length > 0) {
            initHome();
        }
    }
});

window.abrirLogin = abrirLogin;