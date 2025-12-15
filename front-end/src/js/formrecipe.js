document.addEventListener('DOMContentLoaded', function() {

    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('usuario_id');
    const recipeData = urlParams.get('recipe');
    let receitaIdEditando = null;

    if (!usuarioId && !recipeData) {
        return; 
    }

    if (recipeData) {
        try {
            const parsedData = JSON.parse(decodeURIComponent(recipeData));
            const receitaBasica = parsedData.receita || parsedData.response?.receita?.[0] || parsedData;

            if (receitaBasica.id_receita) {
                receitaIdEditando = receitaBasica.id_receita;
                buscarReceitaPorId(receitaBasica.id_receita);
            }
        } catch (error) {
            console.error('Erro ao carregar dados da receita:', error);
        }
    } else if (urlParams.get('id')) {
        const receitaId = urlParams.get('id');
        receitaIdEditando = receitaId;
        buscarReceitaPorId(receitaId);
    }

    async function buscarReceitaPorId(receitaId) {
        try {
            const response = await fetch(`http://localhost:8080/v1/toque_gourmet/receita/${receitaId}`);
            const data = await response.json();

            if (data.status && data.response && data.response.receita) {
                const receita = Array.isArray(data.response.receita)
                    ? data.response.receita[0]
                    : data.response.receita;

                carregarDadosReceitaNoFormulario(receita);
            }
        } catch (error) {
            console.error('Erro ao buscar receita por ID:', error);
        }
    }

    function carregarDadosReceitaNoFormulario(receita) {

        const tituloInput = document.querySelector('.top-infos input[type="text"]');
        if (tituloInput && receita.titulo) {
            tituloInput.value = receita.titulo;
        }
        if (receita.tempo_preparo) {
            const minutos = receita.tempo_preparo;
            const horas = Math.floor(minutos / 60);
            const mins = minutos % 60;

            const horaInput = document.querySelector('.time-inputs input:nth-child(1)');
            const minutoInput = document.querySelector('.time-inputs input:nth-child(2)');
            const segundoInput = document.querySelector('.time-inputs input:nth-child(3)');

            if (horaInput) horaInput.value = horas;
            if (minutoInput) minutoInput.value = mins;
            if (segundoInput) segundoInput.value = 0;
        }

        const categoriaSelect = document.getElementById('categoria');
        if (categoriaSelect && receita.categoria && receita.categoria.nome) {
            categoriaSelect.value = receita.categoria.nome;
        }

        const dificuldadeSelect = document.getElementById('dificuldade');
        if (dificuldadeSelect && receita.dificuldade) {
            dificuldadeSelect.value = receita.dificuldade;
        }

        const cozinhaSelect = document.getElementById('tipo_cozinha');
        if (cozinhaSelect && receita.cozinha && receita.cozinha.length > 0) {
            const nomeCozinha = receita.cozinha[0].nome.toLowerCase();
            const cozinhaMap = {
                'brasileira': 'brasileira',
                'italiana': 'italiana',
                'japonesa': 'japonesa',
                'mexicana': 'mexicana',
                'francesa': 'francesa'
            };

            cozinhaSelect.value = cozinhaMap[nomeCozinha] || 'outra';
        }

        const previewImg = document.getElementById('preview-img');
        if (previewImg && receita.imagem) {
            previewImg.src = receita.imagem;
            previewImg.dataset.originalImage = receita.imagem;
        }
        if (receita.ingredientes && receita.ingredientes.length > 0) {
            const ingredientsBox = document.querySelector('.ingredients-box');
            if (ingredientsBox) {
                const primeiroIngrediente = ingredientsBox.querySelector('.ingredient-row');

                if (primeiroIngrediente) {
                    const ingredientesExistentes = ingredientsBox.querySelectorAll('.ingredient-row');
                    ingredientesExistentes.forEach((ing, index) => {
                        if (index > 0) ing.remove();
                    });

                    if (receita.ingredientes[0]) {
                        const inputs = primeiroIngrediente.querySelectorAll('input[type="text"]');
                        if (inputs[0]) inputs[0].value = receita.ingredientes[0].nome || '';
                        if (inputs[1]) inputs[1].value = receita.ingredientes[0].quantidade || '';
                        if (inputs[2]) inputs[2].value = receita.ingredientes[0].unidade || '';
                    }
                    for (let i = 1; i < receita.ingredientes.length; i++) {
                        const novoIngrediente = criarNovoIngrediente();
                        const inputs = novoIngrediente.querySelectorAll('input[type="text"]');
                        if (inputs[0]) inputs[0].value = receita.ingredientes[i].nome || '';
                        if (inputs[1]) inputs[1].value = receita.ingredientes[i].quantidade || '';
                        if (inputs[2]) inputs[2].value = receita.ingredientes[i].unidade || '';

                        const ultimoIngrediente = ingredientsBox.querySelector('.ingredient-row:last-of-type');
                        ingredientsBox.insertBefore(novoIngrediente, ultimoIngrediente.nextSibling);
                    }
                    atualizarBotoesIngredientes();
                }
            }
        }

        if (receita.modo_preparo && receita.modo_preparo.length > 0) {
            const stepsList = document.querySelector('.steps-list');
            if (stepsList) {
                const primeiroStep = stepsList.querySelector('.step-item');

                if (primeiroStep) {
                    const passosExistentes = stepsList.querySelectorAll('.step-item');
                    passosExistentes.forEach((passo, index) => {
                        if (index > 0) passo.remove();
                    });

                    if (receita.modo_preparo[0]) {
                        const textarea = primeiroStep.querySelector('textarea');
                        if (textarea) {
                            textarea.value = receita.modo_preparo[0].descricao || '';
                        }
                    }
                    for (let i = 1; i < receita.modo_preparo.length; i++) {
                        const novoStep = criarNovoStep();
                        const textarea = novoStep.querySelector('textarea');
                        if (textarea) {
                            textarea.value = receita.modo_preparo[i].descricao || '';
                        }

                        const ultimoStep = stepsList.querySelector('.step-item:last-of-type');
                        stepsList.insertBefore(novoStep, ultimoStep.nextSibling);
                    }
                    atualizarBotoesSteps();
                }
            }
        }

        adicionarBotaoExcluirReceita(receita.id_receita);
        gerenciarBotoesPrincipais();
    }

    function adicionarBotaoExcluirReceita(receitaId) {
        const formActions = document.querySelector('.form-actions');
        if (!formActions) return;

        const existingBtn = document.getElementById('btn-delete');
        if (existingBtn) return;
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete';
        deleteBtn.id = 'btn-delete';
        deleteBtn.textContent = 'Excluir Receita';

        deleteBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.')) {
                excluirReceita(receitaId);
            }
        });

        const clearBtn = document.getElementById('btn-clear');
        if (clearBtn) {
            formActions.insertBefore(deleteBtn, clearBtn);
        } else {
            formActions.appendChild(deleteBtn);
        }
    }

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

        if (receitaIdEditando) {
            btnConfirm.textContent = 'Atualizar Receita';
        }

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

    while (stepsList.firstChild) {
        stepsList.removeChild(stepsList.firstChild);
    }
    stepsList.appendChild(primeiroStep);
        atualizarBotoesSteps();

        const ingredientsBox = document.querySelector('.ingredients-box');
        const header = ingredientsBox.querySelector('.ingredients-header');
        const primeiroIngrediente = ingredientsBox.querySelector('.ingredient-row');

        while (ingredientsBox.firstChild) {
            ingredientsBox.removeChild(ingredientsBox.firstChild);
        }
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

        const usuarioLogado = localStorage.getItem('usuarioLogado');
        const userData = usuarioLogado ? JSON.parse(usuarioLogado) : null;
        const usuarioIdAtual = userData?.response?.usuario?.id_usuario || parseInt(usuarioId);

        const dados = {
            id_usuario: usuarioIdAtual,
            titulo: document.querySelector('.top-infos input[type="text"]').value.trim(),
            descricao: document.querySelector('.top-infos input[type="text"]').value.trim(),
            tempo_preparo: 0,
            dificuldade: '',
            data_criacao: new Date().toISOString().slice(0, 10),
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
            'brasileira': 1, 'japonesa': 3, 'italiana': 2,
            'mexicana': 4, 'francesa': 5, 'Outra': 6,
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

        if (receitaIdEditando) {
            const fileInput = document.getElementById('img-input');
            if (fileInput && fileInput.files.length > 0) {
                formData.append('imagem', fileInput.files[0]);
                const previewImg = document.getElementById('preview-img');
                if (previewImg && previewImg.dataset.originalImage && previewImg.dataset.originalImage !== 'null') {
                    formData.append('link_imagem', previewImg.dataset.originalImage);
                }
                formData.append('dados', JSON.stringify(dados));
                atualizarReceitaComImagem(receitaIdEditando, formData);
            } else {
                const previewImg = document.getElementById('preview-img');
                if (previewImg && previewImg.dataset.originalImage && previewImg.dataset.originalImage !== 'null') {
                    dados.imagem = previewImg.dataset.originalImage;
                }
                atualizarReceita(receitaIdEditando, dados);
            }
        } else {
            const fileInput = document.getElementById('img-input');
            if (fileInput && fileInput.files.length > 0) {
                formData.append('imagem', fileInput.files[0]);
            }
            formData.append('dados', JSON.stringify(dados));
            cadastrarReceita(formData);
        }
    }

    function cadastrarReceita(formData) {
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

    function atualizarReceita(receitaId, dados) {
        const confirmMessage = 'Deseja atualizar esta receita? As alterações serão salvas.';
        if (!confirm(confirmMessage)) {
            return;
        }

        fetch(`http://localhost:8080/v1/toque_gourmet/receita/${receitaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(result => {
            if (result.status) {
                alert('Receita atualizada com sucesso!');
                window.location.href = 'profile.html';
            } else {
                alert('Erro ao atualizar receita: ' + (result.message || 'Tente novamente.'));
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar receita:', error);
            alert('Erro ao atualizar receita. Tente novamente mais tarde.');
        });
    }

    function atualizarReceitaComImagem(receitaId, formData) {
        const confirmMessage = 'Deseja atualizar esta receita? As alterações serão salvas.';
        if (!confirm(confirmMessage)) {
            return;
        }

        fetch(`http://localhost:8080/v1/toque_gourmet/receita/upload/${receitaId}`, {
            method: 'PUT',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.status) {
                alert('Receita atualizada com sucesso!');
                window.location.href = 'profile.html';
            } else {
                alert('Erro ao atualizar receita: ' + (result.message || 'Tente novamente.'));
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar receita:', error);
            alert('Erro ao atualizar receita. Tente novamente mais tarde.');
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

    function excluirReceita(receitaId) {
        fetch(`http://localhost:8080/v1/toque_gourmet/receita/${receitaId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro na resposta da API');
        })
        .then(result => {
            alert('Receita excluída com sucesso!');
            window.location.href = 'profile.html';
        })
        .catch(error => {
            console.error('Erro ao excluir receita:', error);
            alert('Erro ao excluir receita. Tente novamente mais tarde.');
        });
    }

    gerenciarPassos();
    gerenciarIngredientes();
    gerenciarAlergenos();
    gerenciarOutrosCampos();
    if (!receitaIdEditando) {
        gerenciarBotoesPrincipais();
    }
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
