let timeout;

function isAllrecipesPage() {
    return window.location.pathname.includes('allrecipes.html') ||
           window.location.pathname.endsWith('/assets/pages/allrecipes');
}

function redirectToAllrecipes(filtros = {}) {
    const params = new URLSearchParams();

    if (filtros.nome) params.set('nome', filtros.nome);
    if (filtros.tempo_max) params.set('tempo_max', filtros.tempo_max);
    if (filtros.dificuldade) params.set('dificuldade', filtros.dificuldade);
    if (filtros.tipo && filtros.tipo.length > 0) {
        params.set('tipo', filtros.tipo.join(','));
    }
    if (filtros.categoria && filtros.categoria.length > 0) {
        params.set('categoria', filtros.categoria.join(','));
    }
    if (filtros.alergenos && filtros.alergenos.length > 0) {
        params.set('alergenos', filtros.alergenos.join(','));
    }

    const queryString = params.toString();
    const url = queryString ?
        `allrecipes.html?${queryString}` :
        'allrecipes.html';

    window.location.href = url;
}

async function buscarPorNome(nome) {
    const response = await fetch(`http://localhost:8080/v1/toque_gourmet/receita/nome/${encodeURIComponent(nome)}`);
    const data = await response.json();

    if (data.status_code === 200) {
        return data.response.receitas || [];
    }
    return [];
}

async function buscarPorFiltros(filtros) {
    const response = await fetch('http://localhost:8080/v1/toque_gourmet/receita/filtro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filtros)
    });

    const data = await response.json();

    if (data.status_code === 200) {
        return data.response.receitas || [];
    }
    return [];
}

async function executarBusca() {
    const searchInput = document.querySelector('.search-bar input');
    const termo = searchInput.value.trim();

    if (!termo) {
        return;
    }

    if (!isAllrecipesPage()) {
        redirectToAllrecipes({ nome: termo });
        return;
    }

    const receitas = await buscarPorNome(termo);
    exibirResultados(receitas, termo);
}

async function capturarFiltros() {
    const filtros = {
        tempo: Array.from(document.querySelectorAll('input[name="tempo"]:checked')).map(cb => cb.value),
        dificuldade: Array.from(document.querySelectorAll('input[name="dificuldade"]:checked')).map(cb => cb.value)[0] || null,
        tipo: Array.from(document.querySelectorAll('input[name="tipo"]:checked')).map(cb => cb.value),
        categoria: Array.from(document.querySelectorAll('input[name="categoria"]:checked')).map(cb => cb.value),
        alergenos: Array.from(document.querySelectorAll('input[name="alergenos"]:checked')).map(cb => cb.value)
    };

    Object.keys(filtros).forEach(key => {
        if (!filtros[key] || (Array.isArray(filtros[key]) && filtros[key].length === 0)) {
            delete filtros[key];
        }
    });

    localStorage.setItem('recipeFilters', JSON.stringify(filtros));

    if (!isAllrecipesPage()) {
        redirectToAllrecipes(filtros);
    } else {
        const receitas = await buscarPorFiltros(filtros);
        exibirResultados(receitas, 'filtros aplicados');
    }
}

function carregarFiltrosSalvos() {
    const salvos = localStorage.getItem('recipeFilters');
    if (salvos) {
        const filtros = JSON.parse(salvos);
        Object.keys(filtros).forEach(tipo => {
            if (tipo === 'dificuldade' && filtros[tipo]) {
                const cb = document.querySelector(`input[name="${tipo}"][value="${filtros[tipo]}"]`);
                if (cb) cb.checked = true;
            } else if (Array.isArray(filtros[tipo])) {
                filtros[tipo].forEach(valor => {
                    const cb = document.querySelector(`input[name="${tipo}"][value="${valor}"]`);
                    if (cb) cb.checked = true;
                });
            }
        });
    }
}

function exibirResultados(receitas, termo) {
    const container = document.getElementById('all-recipes-container');

    if (!container) return;

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    if (receitas.length === 0) {
        const recipeCardsDiv = document.createElement('div');
        recipeCardsDiv.className = 'recipe-cards';
        recipeCardsDiv.style.justifyContent = 'center';
        recipeCardsDiv.style.alignItems = 'center';

        const mensagem = document.createElement('p');
        mensagem.textContent = `Nenhuma receita encontrada para "${termo}"`;
        mensagem.style.color = '#666';
        mensagem.style.padding = '40px';

        recipeCardsDiv.appendChild(mensagem);
        container.appendChild(recipeCardsDiv);
        return;
    }

    const recipeCardsDiv = document.createElement('div');
    recipeCardsDiv.className = 'recipe-cards';

    receitas.forEach(receita => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'pointer';
        card.onclick = () => abrirReceita(receita.id_receita);

        const cardPreview = document.createElement('div');
        cardPreview.className = 'card-preview';

        const img = document.createElement('img');
        img.src = `../assets/img/${receita.imagem}`;
        img.alt = receita.titulo;
        img.className = 'recipe-preview';

        const cardTitleRatio = document.createElement('div');
        cardTitleRatio.className = 'card-title-ratio';

        const titulo = document.createElement('span');
        titulo.textContent = receita.titulo;

        const ratio = document.createElement('div');
        ratio.className = 'ratio';

        for (let i = 0; i < 5; i++) {
            const star = document.createElement('img');
            star.src = '../img/Star 5.svg';
            star.alt = '5 estrelas';
            star.className = 'star';
            ratio.appendChild(star);
        }

        cardTitleRatio.appendChild(titulo);
        cardTitleRatio.appendChild(ratio);
        cardPreview.appendChild(img);
        cardPreview.appendChild(cardTitleRatio);

        const cardDescription = document.createElement('div');
        cardDescription.className = 'card-description';

        const descricao = document.createElement('p');
        descricao.textContent = receita.descricao;

        const recipeMeta = document.createElement('div');
        recipeMeta.className = 'recipe-meta';

        const tempo = document.createElement('span');
        tempo.className = 'tempo';
        tempo.textContent = `⏱ ${receita.tempo_preparo}min`;

        const dificuldade = document.createElement('span');
        dificuldade.className = 'dificuldade';
        dificuldade.textContent = `📊 ${receita.dificuldade}`;

        recipeMeta.appendChild(tempo);
        recipeMeta.appendChild(dificuldade);
        cardDescription.appendChild(descricao);
        cardDescription.appendChild(recipeMeta);

        card.appendChild(cardPreview);
        card.appendChild(cardDescription);

        recipeCardsDiv.appendChild(card);
    });

    container.appendChild(recipeCardsDiv);
}

function abrirReceita(idReceita) {
    window.location.href = `recipe.html?id=${idReceita}`;
}

window.toggleSelect = function() {
    const dropdown = document.getElementById('alergenos-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
};

document.addEventListener('click', function(e) {
    const container = document.querySelector('.multi-select-container');
    if (container && !container.contains(e.target)) {
        const dropdown = document.getElementById('alergenos-dropdown');
        if (dropdown) dropdown.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    carregarFiltrosSalvos();

    document.querySelectorAll('.filter-choices input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', async () => {
            await capturarFiltros();
        });
    });

    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executarBusca();
            }
        });

        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (searchInput.value.trim()) {
                    executarBusca();
                }
            }, 500);
        });
    }
});

window.filtrarSistema = {
    executarBusca,
    capturarFiltros,
    redirectToAllrecipes
};