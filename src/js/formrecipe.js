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
        const dados = {
            titulo: document.querySelector('.top-infos input[type="text"]').value,
            tempoPreparo: {
                horas: document.querySelector('.time-inputs input:nth-child(1)').value,
                minutos: document.querySelector('.time-inputs input:nth-child(2)').value,
                segundos: document.querySelector('.time-inputs input:nth-child(3)').value
            },
            passos: [],
            ingredientes: [],
            alergenos: [],
            categorias: [],
            dificuldade: ''
        };

        document.querySelectorAll('.step-item textarea').forEach(textarea => {
            if (textarea.value.trim()) {
                dados.passos.push(textarea.value.trim());
            }
        });

        document.querySelectorAll('.ingredient-row').forEach(row => {
            const inputs = row.querySelectorAll('input');
            const nome = inputs[1].value.trim();
            const quantidade = inputs[2].value.trim();
            const unidade = inputs[3].value.trim();

            if (nome) {
                dados.ingredientes.push({
                    nome,
                    quantidade,
                    unidade
                });
            }
        });

        document.querySelectorAll('.allergen-row').forEach(row => {
            const allergenInput = row.querySelector('input[type="text"]');
            const select = row.querySelector('.ingredient-select');
            const allergen = allergenInput.value.trim();
            const ingredientId = select.value;

            if (allergen) {
                dados.alergenos.push({
                    nome: allergen,
                    ingredienteId: ingredientId || null
                });
            }
        });

        document.querySelectorAll('.other-fields .extra-row').forEach(row => {
            const label = row.querySelector('label').textContent;
            const input = row.querySelector('input, select');
            const value = input.value.trim();

            if (value) {
                switch(label) {
                    case 'Categoria':
                        dados.categorias.push(value);
                        break;
                    case 'Nível de Dificuldade':
                        dados.dificuldade = value;
                        break;
                }
            }
        });

        console.log('Dados do formulário:', dados);
        alert('Receita cadastrada com sucesso! Verifique o console para ver os dados.');

        return dados;
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