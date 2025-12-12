// Arquivo principal responsável por inicializar as funcionalidades básicas
import { initHome, initAllRecipes, initRecipeDetails } from './src/js/cards.js';

// Função simples para abrir o dialog de login
function abrirLogin() {
    const dialog = document.querySelector('.modal');
    if (dialog) {
        dialog.showModal();

        // Fecha o dialog quando clicar fora
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.close();
            }
        });

        // Fecha o dialog com ESC
        dialog.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dialog.close();
            }
        });

        // Adiciona funcionalidade aos botões
        const buttons = dialog.querySelectorAll('button');
        buttons[0].addEventListener('click', () => {
            // Botão "Criar Conta"
            alert('Funcionalidade de criar conta em desenvolvimento');
        });

        buttons[1].addEventListener('click', async () => {
            // Botão "Confirmar" - Login real com API
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
                // Debug para verificar os valores
                console.log('Enviando login:', { usuario, senha });

                // Fazer login na API
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

                // Pega o primeiro usuário do array de resposta
                const userData = Array.isArray(responseData) ? responseData[0] : responseData;

                // Salva dados do usuário no localStorage
                localStorage.setItem('usuarioLogado', JSON.stringify(userData));

                    // Redireciona para a página de perfil
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

// Inicializa a página
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

// Torna a função global para o onclick no HTML
window.abrirLogin = abrirLogin;