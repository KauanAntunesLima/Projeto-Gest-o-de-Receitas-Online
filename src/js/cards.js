async function fetchDados(url) {
    console.log(url)
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        return null;
    }
}

async function fetchReceitas() {
    const data = await fetchDados('http://localhost:8080/v1/toque_gourmet/receita');
    if (data && data.status && data.response && data.response.receita) {
        return data.response.receita;
    }
    return [];
}

export function criarCard(receita) {

    const card = document.createElement('div');
    card.classList.add('card');
    card.addEventListener('click', () => {
        
        window.location.href = `${'/src/assets/pages/recipe.html'}?id=${receita.id_receita}`;
    });

    const cardPreview = document.createElement('div');
    cardPreview.classList.add('card-preview');

    const img = document.createElement('img');

    img.src = receita.imagem 
    img.alt = receita.titulo || receita.nome;
    img.classList.add('recipe-preview');

    const cardTitleRatio = document.createElement('div');
    cardTitleRatio.classList.add('card-title-ratio');

    const spanTitle = document.createElement('span');
    spanTitle.textContent = receita.titulo;

    const ratioDiv = document.createElement('div');
    ratioDiv.classList.add('ratio');

    const starPath = './src/assets/img/Star 5.svg';
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('img');
        star.src = starPath;
        star.alt = 'star';
        star.classList.add('star');
        ratioDiv.appendChild(star);
    }

    cardTitleRatio.appendChild(spanTitle);
    cardTitleRatio.appendChild(ratioDiv);
    cardPreview.appendChild(img);
    cardPreview.appendChild(cardTitleRatio);

    const cardDescription = document.createElement('div');
    cardDescription.classList.add('card-description');
    const p = document.createElement('p');
    p.textContent = receita.descricao || 'Sem descrição disponível';
    cardDescription.appendChild(p);

    card.appendChild(cardPreview);
    card.appendChild(cardDescription);

    return card;
}

function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

export async function initHome() {
    const containers = document.querySelectorAll('.recipe-cards');
    if (containers.length === 0) return;

    const receitas = await fetchReceitas();
    let receitaIndex = 0;

    containers.forEach(container => {
        clearContainer(container);
        for (let i = 0; i < 4; i++) {
            if (receitaIndex < receitas.length) {
                container.appendChild(criarCard(receitas[receitaIndex]));
                receitaIndex++;
            }
        }
    });
}

export async function initAllRecipes() {
    const mainContainer = document.getElementById('all-recipes-container');
    if (!mainContainer) return;

    const receitas = await fetchReceitas();
    clearContainer(mainContainer);
    let receitaIndex = 0;

    while (receitaIndex < receitas.length) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('recipe-cards');

        for (let i = 0; i < 4; i++) {
            if (receitaIndex < receitas.length) {
                rowDiv.appendChild(criarCard(receitas[receitaIndex]));
                receitaIndex++;
            }
        }

        
        mainContainer.appendChild(rowDiv);
    }
}

function criarIngredientInfo(nomeIng, qtd, medida) {
    const divInfo = document.createElement('div');
    divInfo.classList.add('ingredient-info');

    const spanNome = document.createElement('span');
    spanNome.textContent = nomeIng;

    const unityInfo = document.createElement('div');
    unityInfo.classList.add('unity-info');

    const spanQtd = document.createElement('span');
    spanQtd.textContent = `Quantidade: ${qtd}`;

    const spanMedida = document.createElement('span');
    spanMedida.textContent = `Unidade: ${medida}`;

    unityInfo.appendChild(spanQtd);
    unityInfo.appendChild(spanMedida);
    divInfo.appendChild(spanNome);
    divInfo.appendChild(unityInfo);

    return divInfo;
}

function criarStep(passo) {
    const divStep = document.createElement('div');
    divStep.classList.add('step');
    divStep.textContent = passo;
    return divStep;
}

export async function initRecipeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) return;

    const data = await fetchDados(`http://localhost:8080/v1/toque_gourmet/receita/${id}`);
    let receita = data && data.receita || (data && data.response && data.response.receita && data.response.receita[0]) || data;

    if (!receita) return;

    const bgImg = document.getElementById('recipe-bg-img');
    if (bgImg) {
        bgImg.src = receita.imagem
    }

    const titleEl = document.getElementById('recipe-title');
    if(titleEl) {
        titleEl.textContent = receita.titulo || receita.nome;
    }

    const diffEl = document.getElementById('recipe-difficulty-text');
    if(diffEl) {
        diffEl.textContent = receita.dificuldade || 'Média';
    }

    const ingredientsContainer = document.getElementById('ingredients-list');
    if (ingredientsContainer && receita.ingredientes) {
        clearContainer(ingredientsContainer);

        receita.ingredientes.forEach(ing => {
            const nomeIng = ing.nome || ing.nome_ingrediente || 'Ingrediente';
            const qtd = ing.quantidade || '';
            const medida = ing.medida || ing.unidade_medida || '';

            ingredientsContainer.appendChild(criarIngredientInfo(nomeIng, qtd, medida));
        });
    }

    const stepsContainer = document.getElementById('steps-list');
    if (stepsContainer && receita.modo_preparo) {
        clearContainer(stepsContainer);

        let passos = Array.isArray(receita.modo_preparo) ?
            receita.modo_preparo :
            receita.modo_preparo.split('.').filter(p => p.trim() !== '');

        passos.forEach(passo => {
            stepsContainer.appendChild(criarStep(passo));
        });
    }
}