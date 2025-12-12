let timeout;

function isAllrecipesPage() {
    return window.location.pathname.includes('allrecipes.html') ||
           window.location.pathname.endsWith('/assets/pages/allrecipes');
}

async function buscarCategoriasAPI() {
    try {
        const response = await fetch('http://localhost:8080/v1/toque_gourmet/categoria');
        const data = await response.json();

        if (data.status && data.response && data.response.categoria) {
            return data.response.categoria;
        }
        return [];
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return [];
    }
}

async function buscarAlergenosAPI() {
    try {
        const response = await fetch('http://localhost:8080/v1/toque_gourmet/alergenos');
        const data = await response.json();

        if (data.status && data.response) {
            if (data.response.alergenos) {
                return data.response.alergenos;
            } else if (data.response.alergeno) {
                return data.response.alergeno;
            }
        }
        return [];
    } catch (error) {
        console.error('Erro ao buscar alergenos:', error);
        return [];
    }
}

function criarFiltroCategorias(categorias) {
    const filterChoices = document.querySelector('.filter-choices');
    if (!filterChoices) return;

    let filtroCategorias = document.getElementById('filtro-categorias');
    if (filtroCategorias) {
        filtroCategorias.remove();
    }

    filtroCategorias = document.createElement('div');
    filtroCategorias.className = 'filtro-group';
    filtroCategorias.id = 'filtro-categorias';

    const titulo = document.createElement('h3');
    titulo.textContent = 'Categoria';
    filtroCategorias.appendChild(titulo);

    categorias.forEach(categoria => {
        const label = document.createElement('label');

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'categoria';

  
        // Usar o campo correto de ID baseado na estrutura da API
        input.value = categoria.id_categoria || categoria.id || categoria.codigo;

        const span = document.createElement('span');
        span.textContent = categoria.nome;

        // Adicionar event listener para o checkbox
        input.addEventListener('change', async () => {
            await capturarFiltros();
        });

        label.appendChild(input);
        label.appendChild(span);
        filtroCategorias.appendChild(label);
    });

    const filtroDificuldade = document.querySelector('.filtro-group h3');
    if (filtroDificuldade && filtroDificuldade.textContent === 'Dificuldade') {
        const dificuldadeGroup = filtroDificuldade.parentElement;
        dificuldadeGroup.parentNode.insertBefore(filtroCategorias, dificuldadeGroup.nextSibling);
    } else {
        filterChoices.appendChild(filtroCategorias);
    }
}

function criarFiltroAlergenos(alergenos) {
    const alergenosDropdown = document.getElementById('alergenos-dropdown');
    if (!alergenosDropdown) return;

    alergenosDropdown.innerHTML = '';

    alergenos.forEach(alergeno => {
        const label = document.createElement('label');
        label.className = 'multi-select-option';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'alergenos';
        input.value = alergeno.nome.toLowerCase();

        const span = document.createElement('span');
        span.textContent = alergeno.nome;

        input.addEventListener('change', () => {
            atualizarAlergenosBadge();
            capturarFiltros();
        });

        label.appendChild(input);
        label.appendChild(span);
        alergenosDropdown.appendChild(label);
    });
}

async function inicializarFiltrosDinamicos() {
    if (!isAllrecipesPage()) return;

    const categorias = await buscarCategoriasAPI();
    if (categorias.length > 0) {
        criarFiltroCategorias(categorias);
    }

    const alergenos = await buscarAlergenosAPI();
    if (alergenos.length > 0) {
        criarFiltroAlergenos(alergenos);
    }

    document.querySelectorAll('.filter-choices input[type="checkbox"]:not([name="alergenos"])').forEach(cb => {
        cb.addEventListener('change', async () => {
            await capturarFiltros();
        });
    });

    // Atualizar badges de alergenos após carregar
    setTimeout(() => {
        atualizarAlergenosBadge();
    }, 50);
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
    const tempoSelecionado = Array.from(document.querySelectorAll('input[name="tempo"]:checked')).map(cb => cb.value);

    const filtros = {
        dificuldade: Array.from(document.querySelectorAll('input[name="dificuldade"]:checked')).map(cb => cb.value)[0] || null,
        tipo: Array.from(document.querySelectorAll('input[name="tipo"]:checked')).map(cb => cb.value),
        categoria: Array.from(document.querySelectorAll('input[name="categoria"]:checked'))
            .map(cb => {
                const value = cb.value;
                const numValue = Number(value);
                return isNaN(numValue) || value === 'null' || value === 'undefined' || value === '' ? null : numValue;
            })
            .filter(val => val !== null),
        alergenos: Array.from(document.querySelectorAll('input[name="alergenos"]:checked')).map(cb => cb.value)
    };

    if (tempoSelecionado.length > 0) {
        const menorTempo = Math.min(...tempoSelecionado.map(Number));
        filtros.tempo_max = menorTempo;
    }

    Object.keys(filtros).forEach(key => {
        if (filtros[key] === null || filtros[key] === undefined ||
            (Array.isArray(filtros[key]) && filtros[key].length === 0)) {
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
                    // Converter IDs de categoria para string para comparação
                    const valorString = tipo === 'categoria' ? valor.toString() : valor;
                    const cb = document.querySelector(`input[name="${tipo}"][value="${valorString}"]`);
                    if (cb) {
                        cb.checked = true;
                        // Se for alergeno, atualizar badges
                        if (tipo === 'alergenos') {
                            atualizarAlergenosBadge();
                        }
                    }
                });
            }
        });
    }
}

function atualizarAlergenosBadge() {
    const checkboxes = document.querySelectorAll('input[name="alergenos"]:checked');
    const badgesContainer = document.getElementById('alergenos-badges');
    const placeholder = document.getElementById('alergenos-placeholder');

    if (!badgesContainer || !placeholder) return;

    badgesContainer.innerHTML = '';

    if (checkboxes.length > 0) {
        placeholder.style.display = 'none';
        checkboxes.forEach(checkbox => {
            const badge = document.createElement('div');
            badge.className = 'alergeno-badge';
            badge.innerHTML = `
                ${checkbox.nextElementSibling.textContent}
                <span class="remove" onclick="removerAlergenoBadge('${checkbox.value}')">×</span>
            `;
            badgesContainer.appendChild(badge);
        });
    } else {
        placeholder.style.display = 'flex';
    }
}

window.removerAlergenoBadge = function(valor) {
    const checkbox = document.querySelector(`input[name="alergenos"][value="${valor}"]`);
    if (checkbox) {
        checkbox.checked = false;
        atualizarAlergenosBadge();
        capturarFiltros();
    }
};

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

        recipeCardsDiv.appendChild(mensagem);
        container.appendChild(recipeCardsDiv);
        return;
    }


    let receitaIndex = 0;

    function criarCard(receita) {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'pointer';
        card.onclick = () => abrirReceita(receita.id_receita);

        const cardPreview = document.createElement('div');
        cardPreview.className = 'card-preview';

        const img = document.createElement('img');
        img.src = `${receita.imagem}`;
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

        cardDescription.appendChild(descricao);
        cardDescription.appendChild(recipeMeta);

        card.appendChild(cardPreview);
        card.appendChild(cardDescription);

        return card;
    }

    while (receitaIndex < receitas.length) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('recipe-cards');

        for (let i = 0; i < 4; i++) {
            if (receitaIndex < receitas.length) {
                rowDiv.appendChild(criarCard(receitas[receitaIndex]));
                receitaIndex++;
            }
        }

        container.appendChild(rowDiv);
    }
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
    if (isAllrecipesPage()) {
        inicializarPaginaAllrecipes();
        // Inicializar filtros dinâmicos após carregar a página
        setTimeout(async () => {
            await inicializarFiltrosDinamicos();
            carregarFiltrosSalvos();
        }, 100);
    }

    // Event listeners para elementos estáticos
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

function extrairFiltrosDaURL(urlParams) {
    const filtros = {};

    // Extrair filtros individuais da URL
    const nome = urlParams.get('nome');
    const tempoMax = urlParams.get('tempo_max');
    const dificuldade = urlParams.get('dificuldade');
    const categoria = urlParams.get('categoria');
    const tipo = urlParams.get('tipo');
    const alergenos = urlParams.get('alergenos');

    if (nome) filtros.nome = nome;
    if (tempoMax) filtros.tempo_max = Number(tempoMax);
    if (dificuldade) filtros.dificuldade = dificuldade;
    if (categoria) {
        // Converter para array de números
        filtros.categoria = categoria.split(',').map(id => Number(id.trim()));
    }
    if (tipo) {
        filtros.tipo = tipo.split(',').map(t => t.trim());
    }
    if (alergenos) {
        filtros.alergenos = alergenos.split(',').map(a => a.trim());
    }

    return filtros;
}

async function inicializarPaginaAllrecipes() {
    const urlParams = new URLSearchParams(window.location.search);
    const nomeBusca = urlParams.get('nome');


    if (nomeBusca) {

                const receitas = await buscarPorNome(nomeBusca);
        exibirResultados(receitas, nomeBusca);
        return;
    }

    const temFiltrosNaURL = urlParams.toString().length > 0;

    if (temFiltrosNaURL) {
        // Extrair filtros da URL e aplicar
        const filtrosDaURL = extrairFiltrosDaURL(urlParams);
        
        const receitas = await buscarPorFiltros(filtrosDaURL);
        exibirResultados(receitas, 'filtros da URL');
    } else {
        // Carregar todas as receitas
        try {
            const response = await fetch('http://localhost:8080/v1/toque_gourmet/receita');
            const data = await response.json();

            if (data.status && data.response && data.response.receita) {
                exibirResultados(data.response.receita, '');
            }
        } catch (error) {
            console.error('Erro ao carregar receitas:', error);
        }
    }
}

window.filtrarSistema = {
    executarBusca,
    capturarFiltros,
    redirectToAllrecipes
};