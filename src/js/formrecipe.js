document.addEventListener('DOMContentLoaded', function() {
    function gerenciarPassos() {
        const stepsList = document.querySelector('.steps-list');

        stepsList.addEventListener('click', function(e) {
            if (e.target.closest('.add') && e.target.closest('.step-item')) {
                const stepItem = e.target.closest('.step-item');
                const novoStep = criarNovoStep();
                stepItem.parentNode.insertBefore(novoStep, stepItem.nextSibling);
                atualizarBotoesSteps();
            }

            if (e.target.closest('.delete') && e.target.closest('.step-item')) {
                const stepItem = e.target.closest('.step-item');
                const allSteps = document.querySelectorAll('.step-item');

                if (allSteps.length > 1) {
                    stepItem.remove();
                    atualizarBotoesSteps();
                } else {
                    alert('Necessario manter pelo menos um passo!');
                }
            }
        });
    }

    function criarNovoStep() {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Descreva o passo da receita...';

        const stepActions = document.createElement('div');
        stepActions.className = 'step-actions';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';

        const deleteImg = document.createElement('img');
        deleteImg.src = '../img/remove.png';
        deleteImg.alt = 'Remover';

        deleteBtn.appendChild(deleteImg);

        const addBtn = document.createElement('button');
        addBtn.className = 'add';

        const addImg = document.createElement('img');
        addImg.src = '../img/add.png';
        addImg.alt = 'Adicionar';

        addBtn.appendChild(addImg);

        stepActions.appendChild(deleteBtn);
        stepActions.appendChild(addBtn);
        stepDiv.appendChild(textarea);
        stepDiv.appendChild(stepActions);

        return stepDiv;
    }

    function atualizarBotoesSteps() {
        const allSteps = document.querySelectorAll('.step-item');

        allSteps.forEach((step) => {
            const actions = step.querySelector('.step-actions');

            while (actions.firstChild) {
                actions.removeChild(actions.firstChild);
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete';

            const deleteImg = document.createElement('img');
            deleteImg.src = '../img/remove.png';
            deleteImg.alt = 'Remover';

            deleteBtn.appendChild(deleteImg);

            const addBtn = document.createElement('button');
            addBtn.className = 'add';

            const addImg = document.createElement('img');
            addImg.src = '../img/add.png';
            addImg.alt = 'Adicionar';

            addBtn.appendChild(addImg);

            actions.appendChild(deleteBtn);
            actions.appendChild(addBtn);
        });
    }

    function gerenciarIngredientes() {
        const ingredientsBox = document.querySelector('.ingredients-box');

        ingredientsBox.addEventListener('click', function(e) {
            if (e.target.closest('.add') && e.target.closest('.ingredient-row')) {
                const ingredientRow = e.target.closest('.ingredient-row');
                const novoIngrediente = criarNovoIngrediente();
                ingredientRow.parentNode.insertBefore(novoIngrediente, ingredientRow.nextSibling);
                atualizarBotoesIngredientes();
            }

            if (e.target.closest('.delete') && e.target.closest('.ingredient-row')) {
                const ingredientRow = e.target.closest('.ingredient-row');
                const allIngredients = document.querySelectorAll('.ingredient-row');

                if (allIngredients.length > 1) {
                    ingredientRow.remove();
                    atualizarBotoesIngredientes();
                } else {
                    alert('É necessário manter pelo menos um ingrediente!');
                }
            }
        });
    }

    function criarNovoIngrediente() {
        const allIngredients = document.querySelectorAll('.ingredient-row');
        const newId = allIngredients.length + 1;

        const ingredientDiv = document.createElement('div');
        ingredientDiv.className = 'ingredient-row';
        ingredientDiv.setAttribute('data-ingredient-id', newId);

        const numberSpan = document.createElement('span');
        numberSpan.className = 'ingredient-number';
        numberSpan.textContent = newId;

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Ex: Nome do ingrediente';

        const quantityInput = document.createElement('input');
        quantityInput.type = 'text';
        quantityInput.placeholder = 'Ex: Quantidade';

        const unitInput = document.createElement('input');
        unitInput.type = 'text';
        unitInput.placeholder = 'Ex: Unidade';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';

        const deleteImg = document.createElement('img');
        deleteImg.src = '../img/remove.png';
        deleteImg.alt = 'Remover';

        deleteBtn.appendChild(deleteImg);

        const addBtn = document.createElement('button');
        addBtn.className = 'add';

        const addImg = document.createElement('img');
        addImg.src = '../img/add.png';
        addImg.alt = 'Adicionar';

        addBtn.appendChild(addImg);

        ingredientDiv.appendChild(numberSpan);
        ingredientDiv.appendChild(nameInput);
        ingredientDiv.appendChild(quantityInput);
        ingredientDiv.appendChild(unitInput);
        ingredientDiv.appendChild(deleteBtn);
        ingredientDiv.appendChild(addBtn);

        return ingredientDiv;
    }

    function atualizarBotoesIngredientes() {
        const allIngredients = document.querySelectorAll('.ingredient-row');

        allIngredients.forEach((ingredient) => {
            const buttons = ingredient.querySelectorAll('button');
            buttons.forEach(btn => btn.remove());

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete';

            const deleteImg = document.createElement('img');
            deleteImg.src = '../img/remove.png';
            deleteImg.alt = 'Remover';

            deleteBtn.appendChild(deleteImg);

            const addBtn = document.createElement('button');
            addBtn.className = 'add';

            const addImg = document.createElement('img');
            addImg.src = '../img/add.png';
            addImg.alt = 'Adicionar';

            addBtn.appendChild(addImg);

            ingredient.appendChild(deleteBtn);
            ingredient.appendChild(addBtn);
        });
    }

    function gerenciarAlergenos() {
        const allergensSection = document.querySelector('.allergens-section');

        allergensSection.addEventListener('click', function(e) {
            if (e.target.closest('.add') && e.target.closest('.allergen-row')) {
                const allergenRow = e.target.closest('.allergen-row');
                const novoAlergeno = criarNovoAlergeno();
                allergenRow.parentNode.insertBefore(novoAlergeno, allergenRow.nextSibling);
                atualizarSelectsAlergenos();
                atualizarBotoesAlergenos();
            }

            if (e.target.closest('.delete') && e.target.closest('.allergen-row')) {
                const allergenRow = e.target.closest('.allergen-row');
                const allAllergens = document.querySelectorAll('.allergen-row');

                if (allAllergens.length > 1) {
                    allergenRow.remove();
                    atualizarBotoesAlergenos();
                } else {
                    alert('É necessário manter pelo menos um campo de alérgeno!');
                }
            }
        });
    }

    function criarNovoAlergeno() {
        const allergenDiv = document.createElement('div');
        allergenDiv.className = 'allergen-row';

        const allergenInput = document.createElement('input');
        allergenInput.type = 'text';
        allergenInput.placeholder = 'Ex: Glúten, Lactose...';

        const select = document.createElement('select');
        select.className = 'ingredient-select';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecione um ingrediente';

        select.appendChild(defaultOption);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';

        const deleteImg = document.createElement('img');
        deleteImg.src = '../img/remove.png';
        deleteImg.alt = 'Remover';

        deleteBtn.appendChild(deleteImg);

        const addBtn = document.createElement('button');
        addBtn.className = 'add';

        const addImg = document.createElement('img');
        addImg.src = '../img/add.png';
        addImg.alt = 'Adicionar';

        addBtn.appendChild(addImg);

        allergenDiv.appendChild(allergenInput);
        allergenDiv.appendChild(select);
        allergenDiv.appendChild(deleteBtn);
        allergenDiv.appendChild(addBtn);

        return allergenDiv;
    }

    function atualizarSelectsAlergenos() {
        const ingredients = document.querySelectorAll('.ingredient-row');
        const selects = document.querySelectorAll('.ingredient-select');

        const createOptionsFragment = () => {
            const fragment = document.createDocumentFragment();

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Selecione um ingrediente';
            fragment.appendChild(defaultOption);

            ingredients.forEach(ingredient => {
                const id = ingredient.getAttribute('data-ingredient-id');
                const number = ingredient.querySelector('.ingredient-number').textContent;
                const nameInput = ingredient.querySelector('input[type="text"]');
                const name = nameInput ? nameInput.value || `Ingrediente ${number}` : `Ingrediente ${number}`;

                const option = document.createElement('option');
                option.value = id;
                option.textContent = `${number} - ${name}`;
                fragment.appendChild(option);
            });

            return fragment;
        };

        selects.forEach(select => {
            const currentValue = select.value;

            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }

            select.appendChild(createOptionsFragment());

            select.value = currentValue;
        });
    }

    function atualizarBotoesAlergenos() {
        const allAllergens = document.querySelectorAll('.allergen-row');

        allAllergens.forEach(allergen => {
            const buttons = allergen.querySelectorAll('button');
            buttons.forEach(btn => btn.remove());

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete';

            const deleteImg = document.createElement('img');
            deleteImg.src = '../img/remove.png';
            deleteImg.alt = 'Remover';

            deleteBtn.appendChild(deleteImg);

            const addBtn = document.createElement('button');
            addBtn.className = 'add';

            const addImg = document.createElement('img');
            addImg.src = '../img/add.png';
            addImg.alt = 'Adicionar';

            addBtn.appendChild(addImg);

            allergen.appendChild(deleteBtn);
            allergen.appendChild(addBtn);
        });
    }

    function gerenciarOutrosCampos() {
    }

    function gerenciarBotoesPrincipais() {
        const btnClear = document.getElementById('btn-clear');
        const btnConfirm = document.getElementById('btn-confirm');

        btnClear.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja limpar todos os campos?')) {
                limparTodosCampos();
            }
        });

        btnConfirm.addEventListener('click', function() {
            if (validarFormulario()) {
                coletarDadosFormulario();
            }
        });
    }

    function limparTodosCampos() {
        document.querySelectorAll('input[type="text"]').forEach(input => {
            input.value = '';
        });

        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.value = '';
        });

        const fileInput = document.getElementById('img-input');
        if (fileInput) {
            fileInput.value = '';
            const previewImg = document.getElementById('preview-img');
            if (previewImg) {
                previewImg.src = 'https://via.placeholder.com/500x300?text=Preview';
            }
        }

        resetarParaEstadoInicial();

        alert('Todos os campos foram limpos!');
    }

    function resetarParaEstadoInicial() {
        const stepsList = document.querySelector('.steps-list');
        const primeiroStep = stepsList.querySelector('.step-item');
        stepsList.innerHTML = '';
        stepsList.appendChild(primeiroStep);
        atualizarBotoesSteps();

        const ingredientsBox = document.querySelector('.ingredients-box');
        const header = ingredientsBox.querySelector('.ingredients-header');
        const primeiroIngrediente = ingredientsBox.querySelector('.ingredient-row');
        ingredientsBox.innerHTML = '';
        ingredientsBox.appendChild(header);
        ingredientsBox.appendChild(primeiroIngrediente);
        atualizarBotoesIngredientes();
    }

    function validarFormulario() {
        const titulo = document.querySelector('.top-infos input[type="text"]').value.trim();

        if (!titulo) {
            alert('Por favor, preencha o nome da receita!');
            return false;
        }

        const passos = document.querySelectorAll('.step-item textarea');
        let passoVazio = false;
        passos.forEach(passo => {
            if (!passo.value.trim()) {
                passoVazio = true;
            }
        });

        if (passoVazio) {
            alert('Por favor, preencha todos os passos da receita!');
            return false;
        }

        const ingredientes = document.querySelectorAll('.ingredient-row input:first-child');
        let ingredienteVazio = false;
        ingredientes.forEach(ingrediente => {
            if (!ingrediente.value.trim()) {
                ingredienteVazio = true;
            }
        });

        if (ingredienteVazio) {
            alert('Por favor, preencha pelo menos o nome dos ingredientes!');
            return false;
        }

        return true;
    }

    function coletarDadosFormulario() {
        const formData = new FormData();

        const dados = {
            id_usuario: 1,
            titulo: document.querySelector('.top-infos input[type="text"]').value.trim(),
            descricao: document.querySelector('.top-infos input[type="text"]').value.trim(),
            tempo_preparo: 0,
            dificuldade: '',
            data_criacao: new Date().toISOString().slice(0, 10),
            data_edicao: null,
            id_cozinha: 1,
            id_categoria: 1,
            ingredientes: [],
            modo_preparo: []
        };

        const horas = document.querySelector('.time-inputs input:nth-child(1)').value || 0;
        const minutos = document.querySelector('.time-inputs input:nth-child(2)').value || 0;
        const segundos = document.querySelector('.time-inputs input:nth-child(3)').value || 0;
        dados.tempo_preparo = (parseInt(horas) * 60) + parseInt(minutos) + Math.ceil(parseInt(segundos) / 60);

        const categoria = document.getElementById('categoria').value;
        const dificuldade = document.getElementById('dificuldade').value;
        const tipoCozinha = document.getElementById('tipo_cozinha').value;

        const categoriaMap = {
            'entradas': 1, 'pratos_principais': 2, 'acompanhamentos': 3, 'saladas': 4,
            'sopas': 5, 'massas': 6, 'carnes': 7, 'frango': 8, 'peixes_e_frutos_do_mar': 9,
            'lanches': 10, 'petiscos': 11, 'sobremesas': 12, 'bolos_e_tortas': 13,
            'bebidas': 14, 'vegano': 15, 'vegetariano': 16, 'light__fit': 17,
            'café_da_manhã': 18, 'brunch': 19
        };

        const cozinhaMap = {
            'brasileira': 1, 'italiana': 2, 'japonesa': 3, 'chinesa': 4, 'árabe': 5,
            'mexicana': 6, 'francesa': 7, 'americana': 8, 'mediterrânea': 9,
            'indiana': 10, 'coreana': 11, 'tailandesa': 12
        };

        const dificuldadeMap = {
            'facil': 'facil', 'medio': 'medio', 'dificil': 'dificil'
        };

        if (categoriaMap[categoria]) {
            dados.id_categoria = categoriaMap[categoria];
        }

        if (cozinhaMap[tipoCozinha]) {
            dados.id_cozinha = cozinhaMap[tipoCozinha];
        }

        if (dificuldadeMap[dificuldade]) {
            dados.dificuldade = dificuldadeMap[dificuldade];
        }

        let passoNumero = 1;
        document.querySelectorAll('.step-item textarea').forEach(textarea => {
            if (textarea.value.trim()) {
                dados.modo_preparo.push({
                    numero_passo: passoNumero++,
                    descricao: textarea.value.trim()
                });
            }
        });

        document.querySelectorAll('.ingredient-row').forEach((row, index) => {
            const inputs = row.querySelectorAll('input[type="text"]');
            const nome = inputs[0] ? inputs[0].value.trim() : '';
            const quantidade = inputs[1] ? inputs[1].value.trim() : '';
            const unidade = inputs[2] ? inputs[2].value.trim() : '';

            if (nome) {
                dados.ingredientes.push({
                    id_ingredientes: index + 1,
                    quantidade: quantidade || 'a gosto',
                    unidade: unidade || 'unidade'
                });
            }
        });

        formData.append('dados', JSON.stringify(dados));

        const fileInput = document.getElementById('img-input');
        if (fileInput && fileInput.files.length > 0) {
            formData.append('imagem', fileInput.files[0]);
        }

        fetch('http://localhost:8080/v1/toque_gourmet/receita/upload', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
          .then(result => {
              if (result.status) {
                  alert('Receita cadastrada com sucesso!');
                  limparTodosCampos();
              } else {
                  alert('Erro: ' + result.message);
              }
          });
    }

    function gerenciarPreviewImagem() {
        const imgInput = document.getElementById('img-input');
        const previewImg = document.getElementById('preview-img');

        if (imgInput && previewImg) {
            imgInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewImg.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    gerenciarPassos();
    gerenciarIngredientes();
    gerenciarAlergenos();
    gerenciarOutrosCampos();
    gerenciarBotoesPrincipais();
    gerenciarPreviewImagem();

    atualizarSelectsAlergenos();

    const ingredientsBox = document.querySelector('.ingredients-box');
    const observer = new MutationObserver(() => {
        atualizarSelectsAlergenos();
    });

    observer.observe(ingredientsBox, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-ingredient-id']
    });
});