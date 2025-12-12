import { initHome, initAllRecipes, initRecipeDetails, criarCard } from './src/js/cards.js';
let receitasUsuario = [];
function buscarReceitasLocal(termo) {
    termo = termo.toLowerCase();
    const receitasFiltradas = receitasUsuario.filter(receita => {
        return receita.titulo.toLowerCase().includes(termo) ||
            receita.descricao.toLowerCase().includes(termo);
    });
    exibirReceitasEmGrid(receitasFiltradas);
    const receitasCount = document.querySelector('.info-filter span span');
    if (receitasCount) {
        receitasCount.textContent = receitasFiltradas.length;
    }
}
function abrirLogin() {
    const loginDialog = document.createElement('dialog');
    loginDialog.className = 'modal';
    const title = document.createElement('h1');
    title.textContent = 'Login';
    const usuarioInput = document.createElement('input');
    usuarioInput.type = 'text';
    usuarioInput.id = 'usuario-input';
    usuarioInput.placeholder = 'Usuário';
    usuarioInput.required = true;
    const senhaInput = document.createElement('input');
    senhaInput.type = 'password';
    senhaInput.id = 'senha-input';
    senhaInput.placeholder = 'Senha';
    senhaInput.required = true;
    const responseDiv = document.createElement('div');
    responseDiv.className = 'response';
    const criarContaBtn = document.createElement('button');
    criarContaBtn.textContent = 'Criar Conta';
    criarContaBtn.onclick = () => {
        loginDialog.close();
        loginDialog.remove();
        abrirCadastro();
    };
    const confirmarBtn = document.createElement('button');
    confirmarBtn.textContent = 'Confirmar';
    responseDiv.appendChild(criarContaBtn);
    responseDiv.appendChild(confirmarBtn);
    loginDialog.appendChild(title);
    loginDialog.appendChild(usuarioInput);
    loginDialog.appendChild(senhaInput);
    loginDialog.appendChild(responseDiv);
    document.body.appendChild(loginDialog);
    loginDialog.showModal();
    loginDialog.addEventListener('click', (e) => {
        if (e.target === loginDialog) {
            loginDialog.close();
            loginDialog.remove();
        }
    });
    loginDialog.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            loginDialog.close();
            loginDialog.remove();
        }
    });
    confirmarBtn.addEventListener('click', async () => {
        const usuario = usuarioInput.value.trim();
        const senha = senhaInput.value.trim();
        if (!usuario || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        try {
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
                loginDialog.close();
                loginDialog.remove();
                window.location.href = './src/assets/pages/profile.html';
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
function carregarPerfil() {
    const userInfo = document.querySelector('.user-info span span');
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        const userData = JSON.parse(usuarioLogado);
        const usuario = userData.response.usuario;
        if (userInfo && usuario.nome) {
            userInfo.textContent = usuario.nome;
        }
        if (usuario.id_usuario) {
            buscarReceitasUsuario(usuario.id_usuario);
            configurarBuscaPerfil();
            const newRecipeBtn = document.querySelector('.new-recipe');
            if (newRecipeBtn) {
                newRecipeBtn.addEventListener('click', () => {
                    window.location.href = `formrecipe.html?usuario_id=${usuario.id_usuario}`;
                });
            }
        }
    } else {
    }
}
function configurarBuscaPerfil() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        // Limpar event listeners anteriores
        searchInput.removeEventListener('keypress', null);
        searchInput.removeEventListener('input', null);
        // Event listener para Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const termo = searchInput.value.trim();
                if (termo) {
                    buscarReceitasLocal(termo);
                } else {
                    // Se buscar com campo vazio, mostrar todas as receitas
                    exibirReceitasEmGrid(receitasUsuario);
                    const receitasCount = document.querySelector('.info-filter span span');
                    if (receitasCount) {
                        receitasCount.textContent = receitasUsuario.length;
                    }
                }
            }
        });
        // Event listener para input com debounce
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const termo = searchInput.value.trim();
                if (termo) {
                    buscarReceitasLocal(termo);
                } else {
                    // Se campo ficar vazio, mostrar todas as receitas
                    exibirReceitasEmGrid(receitasUsuario);
                    const receitasCount = document.querySelector('.info-filter span span');
                    if (receitasCount) {
                        receitasCount.textContent = receitasUsuario.length;
                    }
                }
            }, 500);
        });
    }
}
async function buscarReceitasUsuario(usuarioId) {
    try {
        const url = `http://localhost:8080/v1/toque_gourmet/receita/usuario/${usuarioId}`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            const receitas = data.response.receitas || [];
            // Armazenar receitas para busca local
            receitasUsuario = receitas;
            const receitasCount = document.querySelector('.info-filter span span');
            if (receitasCount) {
                receitasCount.textContent = receitas.length;
            }
            exibirReceitasEmGrid(receitas);
        } else {
            console.error('Resposta não OK. Status:', response.status);
            const errorData = await response.text();
            console.error('Resposta de erro:', errorData);
        }
    } catch (error) {
        console.error('Erro ao buscar receitas do usuário:', error);
    }
}
function limparCardsReceitas() {
    // Limpa apenas os cards criados dinamicamente na página profile
    const mainElement = document.querySelector('main');
    if (mainElement) {
        const recipeCards = mainElement.querySelectorAll('.recipe-cards');
        recipeCards.forEach(container => {
            container.remove();
        });
    }
}

function exibirReceitasEmGrid(receitas) {
    limparCardsReceitas();
    const mainElement = document.querySelector('main');
    let receitaIndex = 0;

    while (receitaIndex < receitas.length) {
        const recipeCards = document.createElement('div');
        recipeCards.classList.add('recipe-cards');

        for (let i = 0; i < 4; i++) {
            if (receitaIndex < receitas.length) {
                const receitaAtual = receitas[receitaIndex];
                const card = criarCard(receitaAtual);
                // Remover o event listener padrão e adicionar o do perfil
                card.removeEventListener('click', card._clickHandler);
                card.addEventListener('click', () => {
                    const encodedData = encodeURIComponent(JSON.stringify(receitaAtual));
                    window.location.href = `formrecipe.html?recipe=${encodedData}`;
                });
                recipeCards.appendChild(card);
                receitaIndex++;
            }
        }
        mainElement.appendChild(recipeCards);
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
    else if (document.querySelector('.user-info')) {
        carregarPerfil();
    }
    else {
        const homeContainers = document.querySelectorAll('.recipe-cards');
        if (homeContainers.length > 0) {
            initHome();
        }
    }

    // Adicionar botões de navegação em todas as páginas
    addReloadButton();
    addBackButton();
});
function abrirCadastro() {
    const dialog = document.querySelector('.modal');
    if (dialog) {
        dialog.close();
    }
    const cadastroDialog = document.createElement('dialog');
    cadastroDialog.className = 'modal';
    const title = document.createElement('h1');
    title.textContent = 'Cadastro';
    const nomeInput = document.createElement('input');
    nomeInput.type = 'text';
    nomeInput.id = 'cadastro-nome';
    nomeInput.placeholder = 'Nome';
    nomeInput.required = true;
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.id = 'cadastro-email';
    emailInput.placeholder = 'Email';
    emailInput.required = true;
    const senhaInput = document.createElement('input');
    senhaInput.type = 'password';
    senhaInput.id = 'cadastro-senha';
    senhaInput.placeholder = 'Senha';
    senhaInput.required = true;
    const responseDiv = document.createElement('div');
    responseDiv.className = 'response';
    const cancelarBtn = document.createElement('button');
    cancelarBtn.textContent = 'Cancelar';
    cancelarBtn.onclick = fecharCadastro;
    const cadastrarBtn = document.createElement('button');
    cadastrarBtn.textContent = 'Cadastrar';
    cadastrarBtn.onclick = cadastrarUsuario;
    responseDiv.appendChild(cancelarBtn);
    responseDiv.appendChild(cadastrarBtn);
    cadastroDialog.appendChild(title);
    cadastroDialog.appendChild(nomeInput);
    cadastroDialog.appendChild(emailInput);
    cadastroDialog.appendChild(senhaInput);
    cadastroDialog.appendChild(responseDiv);
    document.body.appendChild(cadastroDialog);
    cadastroDialog.showModal();
    cadastroDialog.addEventListener('click', (e) => {
        if (e.target === cadastroDialog) {
            fecharCadastro();
        }
    });
    cadastroDialog.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharCadastro();
        }
    });
}
function fecharCadastro() {
    const cadastroDialog = document.querySelector('dialog.modal');
    if (cadastroDialog) {
        cadastroDialog.close();
        cadastroDialog.remove();
        abrirLogin();
    }
}
async function cadastrarUsuario() {
    const nomeInput = document.getElementById('cadastro-nome');
    const emailInput = document.getElementById('cadastro-email');
    const senhaInput = document.getElementById('cadastro-senha');
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    if (!nome || !email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    try {
        const response = await fetch('http://localhost:8080/v1/toque_gourmet/usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                senha: senha,
                email: email,
                imagem: null
            })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            fecharCadastro();
            abrirLogin();
        } else {
            alert(`Erro no cadastro: ${data.message || 'Tente novamente.'}`);
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
}

function addReloadButton() {
    if (document.querySelector('.reload-button')) return;

    const button = document.createElement('button');
    button.className = 'nav-button reload-button';

    const img = document.createElement('img');
    img.src = '/src/assets/img/reload-svgrepo-com.svg';
    img.alt = 'Reload';
    img.style.width = '24px';
    img.style.height = '24px';

    button.appendChild(img);
    button.addEventListener('click', () => {
        window.location.reload();
    });
    document.body.appendChild(button);
}

function addBackButton() {
    if (document.querySelector('.back-button')) return;

    const button = document.createElement('button');
    button.className = 'nav-button back-button';
    button.style.left = '80px';

    const img = document.createElement('img');
    img.src = '/src/assets/img/back-2-svgrepo-com.svg';
    img.alt = 'Back';
    img.style.width = '24px';
    img.style.height = '24px';

    button.appendChild(img);
    button.addEventListener('click', () => {
        window.history.back();
    });
    document.body.appendChild(button);
}

window.abrirLogin = abrirLogin;
window.abrirCadastro = abrirCadastro;
window.fecharCadastro = fecharCadastro;
window.addReloadButton = addReloadButton;
window.addBackButton = addBackButton;
