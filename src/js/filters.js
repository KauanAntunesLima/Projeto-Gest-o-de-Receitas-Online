/* ===================================================================
   Allrecipes - filtros dinâmicos (refatorado, DOM-only, sem innerHTML)
   =================================================================== */

   let timeout;

   // ----------------------- Helpers -----------------------
   function isAllrecipesPage() {
       return window.location.pathname.includes('allrecipes.html') ||
              window.location.pathname.endsWith('/assets/pages/allrecipes');
   }
   
   async function safeFetchJson(url, options) {
       try {
           const res = await fetch(url, options);
           return await res.json();
       } catch (err) {
           console.error(`Erro na requisição ${url}:`, err);
           return null;
       }
   }
   
   function clearElementChildren(el) {
       if (!el) return;
       while (el.firstChild) el.removeChild(el.firstChild);
   }
   
   // ----------------------- API -----------------------
   async function buscarCategoriasAPI() {
       const data = await safeFetchJson('http://localhost:8080/v1/toque_gourmet/categoria');
       return data?.status && data?.response?.categoria ? data.response.categoria : [];
   }
   
   async function buscarAlergenosAPI() {
       const data = await safeFetchJson('http://localhost:8080/v1/toque_gourmet/alergenos');
       if (!data || !data.response) return [];
       return data.response.alergenos || data.response.alergeno || [];
   }
   
   async function buscarPorNome(nome) {
       const data = await safeFetchJson(`http://localhost:8080/v1/toque_gourmet/receita/nome/${encodeURIComponent(nome)}`);
       return data?.status_code === 200 ? data.response.receitas || [] : [];
   }
   
   async function buscarPorFiltros(filtros) {
       const data = await safeFetchJson('http://localhost:8080/v1/toque_gourmet/receita/filtro', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(filtros)
       });
       return data?.status_code === 200 ? data.response.receitas || [] : [];
   }
   
   // ----------------------- Render filtros -----------------------
   function criarFiltroCategorias(categorias) {
       const filterChoices = document.querySelector('.filter-choices');
       if (!filterChoices) return;
   
       // Remove bloco se já existir (evita duplicação)
       const existente = document.getElementById('filtro-categorias');
       if (existente) existente.remove();
   
       const grupo = document.createElement('div');
       grupo.className = 'filtro-group';
       grupo.id = 'filtro-categorias';
   
       const titulo = document.createElement('h3');
       titulo.textContent = 'Categoria';
       grupo.appendChild(titulo);
   
       categorias.forEach(categoria => {
           const label = document.createElement('label');
   
           const input = document.createElement('input');
           input.type = 'checkbox';
           input.name = 'categoria';
           // usar id apropriado — manter string para facilitar localStorage/URL
           input.value = String(categoria.id_categoria ?? categoria.id ?? categoria.codigo ?? '');
   
           const span = document.createElement('span');
           span.textContent = categoria.nome ?? '';
   
           label.appendChild(input);
           label.appendChild(span);
           grupo.appendChild(label);
       });
   
       // Insere no final de filterChoices (CSS mantém aparência)
       filterChoices.appendChild(grupo);
   }
   
   function criarFiltroAlergenos(alergenos) {
       const dropdown = document.getElementById('alergenos-dropdown');
       if (!dropdown) return;
   
       // limpa filhos sem innerHTML
       clearElementChildren(dropdown);
   
       alergenos.forEach(alergeno => {
           const label = document.createElement('label');
           label.className = 'multi-select-option';
   
           const input = document.createElement('input');
           input.type = 'checkbox';
           input.name = 'alergenos';
           // valor em lowercase (mantenha consistência com seu backend/URL se necessário)
           input.value = (alergeno.nome ?? '').toLowerCase();
   
           const span = document.createElement('span');
           span.textContent = alergeno.nome ?? '';
   
           // ao marcar, atualiza badges e filtros
           input.addEventListener('change', () => {
               atualizarAlergenosBadge();
               capturarFiltros();
           });
   
           label.appendChild(input);
           label.appendChild(span);
           dropdown.appendChild(label);
       });
   }
   
   function atualizarAlergenosBadge() {
       const badgesContainer = document.getElementById('alergenos-badges');
       const placeholder = document.getElementById('alergenos-placeholder');
       if (!badgesContainer || !placeholder) return;
   
       // limpa badges sem innerHTML
       clearElementChildren(badgesContainer);
   
       const checked = Array.from(document.querySelectorAll('input[name="alergenos"]:checked'));
   
       if (checked.length === 0) {
           placeholder.style.display = 'flex';
           return;
       }
   
       placeholder.style.display = 'none';
   
       checked.forEach(input => {
           const badge = document.createElement('div');
           badge.className = 'alergeno-badge';
   
           const nomeSpan = document.createElement('span');
           // se houver label/nextElementSibling, usa texto; senão usa value
           nomeSpan.textContent = input.nextElementSibling ? input.nextElementSibling.textContent : input.value;
   
           const removeBtn = document.createElement('span');
           removeBtn.className = 'remove';
           removeBtn.textContent = '×';
           removeBtn.addEventListener('click', () => {
               input.checked = false;
               atualizarAlergenosBadge();
               capturarFiltros();
           });
   
           badge.appendChild(nomeSpan);
           badge.appendChild(removeBtn);
           badgesContainer.appendChild(badge);
       });
   }
   
   // ----------------------- Filtros / Persistência -----------------------
   function extrairFiltrosDaURL(urlParams) {
       const filtros = {};
       const nome = urlParams.get('nome');
       const tempoMax = urlParams.get('tempo_max');
       const dificuldade = urlParams.get('dificuldade');
       const categoria = urlParams.get('categoria');
       const tipo = urlParams.get('tipo');
       const alergenos = urlParams.get('alergenos');
   
       if (nome) filtros.nome = nome;
       if (tempoMax) filtros.tempo_max = Number(tempoMax);
       if (dificuldade) filtros.dificuldade = dificuldade;
       if (categoria) filtros.categoria = categoria.split(',').map(s => Number(s.trim()));
       if (tipo) filtros.tipo = tipo.split(',').map(s => s.trim());
       if (alergenos) filtros.alergenos = alergenos.split(',').map(s => s.trim());
   
       return filtros;
   }
   
   async function capturarFiltros() {
       const tempoSelecionado = Array.from(document.querySelectorAll('input[name="tempo"]:checked')).map(cb => cb.value);
   
       const filtros = {
           dificuldade: document.querySelector('input[name="dificuldade"]:checked')?.value ?? null,
           tipo: Array.from(document.querySelectorAll('input[name="tipo"]:checked')).map(cb => cb.value),
           categoria: Array.from(document.querySelectorAll('input[name="categoria"]:checked'))
               .map(cb => {
                   const n = Number(cb.value);
                   return isNaN(n) ? null : n;
               }).filter(x => x !== null),
           alergenos: Array.from(document.querySelectorAll('input[name="alergenos"]:checked')).map(cb => cb.value)
       };
   
       if (tempoSelecionado.length > 0) {
           filtros.tempo_max = Math.min(...tempoSelecionado.map(Number));
       }
   
       // remover campos vazios
       Object.keys(filtros).forEach(k => {
           const v = filtros[k];
           if (v === null || v === undefined) delete filtros[k];
           if (Array.isArray(v) && v.length === 0) delete filtros[k];
       });
   
       localStorage.setItem('recipeFilters', JSON.stringify(filtros));
   
       if (!isAllrecipesPage()) {
           // build query and redirect
           const params = new URLSearchParams();
           if (filtros.nome) params.set('nome', filtros.nome);
           if (filtros.tempo_max) params.set('tempo_max', filtros.tempo_max);
           if (filtros.dificuldade) params.set('dificuldade', filtros.dificuldade);
           if (filtros.tipo) params.set('tipo', filtros.tipo.join(','));
           if (filtros.categoria) params.set('categoria', filtros.categoria.join(','));
           if (filtros.alergenos) params.set('alergenos', filtros.alergenos.join(','));
           const qs = params.toString();
           window.location.href = qs ? `/src/assets/pages/allrecipes.html?${qs}` : 'allrecipes.html';
           return;
       }
   
       const receitas = await buscarPorFiltros(filtros);
       exibirResultados(receitas, 'filtros aplicados');
   }
   
   function carregarFiltrosSalvos() {
       const raw = localStorage.getItem('recipeFilters');
       if (!raw) return;
       let filtros;
       try {
           filtros = JSON.parse(raw);
       } catch {
           return;
       }
   
       Object.keys(filtros).forEach(tipo => {
           const valor = filtros[tipo];
           if (tipo === 'dificuldade' && valor) {
               const cb = document.querySelector(`input[name="dificuldade"][value="${valor}"]`);
               if (cb) cb.checked = true;
           } else if (Array.isArray(valor)) {
               valor.forEach(v => {
                   const vStr = tipo === 'categoria' ? String(v) : String(v);
                   const cb = document.querySelector(`input[name="${tipo}"][value="${vStr}"]`);
                   if (cb) cb.checked = true;
               });
           } else {
               // outros casos ignorados aqui
           }
       });
   
       // após marcar checkboxes, atualizar badges/alergenos e aplicar filtros
       atualizarAlergenosBadge();
       // aplicamos capturarFiltros para que o resultado seja consistente com os checks
       // mas só se estivermos na página de receitas
       if (isAllrecipesPage()) {
           capturarFiltros();
       }
   }
   
   // ----------------------- Results rendering (sem innerHTML) -----------------------
   function criarCard(receita) {
       const card = document.createElement('div');
       card.className = 'card';
       card.style.cursor = 'pointer';
       card.addEventListener('click', () => abrirReceita(receita.id_receita));
   
       const cardPreview = document.createElement('div');
       cardPreview.className = 'card-preview';
   
       const img = document.createElement('img');
       img.src = receita.imagem ?? '';
       img.alt = receita.titulo ?? '';
       img.className = 'recipe-preview';
   
       const cardTitleRatio = document.createElement('div');
       cardTitleRatio.className = 'card-title-ratio';
   
       const titulo = document.createElement('span');
       titulo.textContent = receita.titulo ?? '';
   
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
       descricao.textContent = receita.descricao ?? '';
   
       const recipeMeta = document.createElement('div');
       recipeMeta.className = 'recipe-meta';
   
       cardDescription.appendChild(descricao);
       cardDescription.appendChild(recipeMeta);
   
       card.appendChild(cardPreview);
       card.appendChild(cardDescription);
   
       return card;
   }
   
   function exibirResultados(receitas, termo) {
       const container = document.getElementById('all-recipes-container');
       if (!container) return;
   
       // limpa sem usar innerHTML
       clearElementChildren(container);
   
       if (!receitas || receitas.length === 0) {
           const wrapper = document.createElement('div');
           wrapper.className = 'recipe-cards';
           wrapper.style.justifyContent = 'center';
           wrapper.style.alignItems = 'center';
   
           const p = document.createElement('p');
           p.textContent = 'Nenhuma receita encontrada.';
           wrapper.appendChild(p);
           container.appendChild(wrapper);
           return;
       }
   
       // criar rows com até 4 cards (mantendo seu layout atual)
       let index = 0;
       while (index < receitas.length) {
           const row = document.createElement('div');
           row.className = 'recipe-cards';
   
           for (let i = 0; i < 4 && index < receitas.length; i++, index++) {
               row.appendChild(criarCard(receitas[index]));
           }
   
           container.appendChild(row);
       }
   }
   
   // ----------------------- Navegação / UI helpers -----------------------
   function abrirReceita(id) {
       window.location.href = `recipe.html?id=${id}`;
   }
   
   window.toggleSelect = function() {
       const dropdown = document.getElementById('alergenos-dropdown');
       if (!dropdown) return;
       dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
   };
   
   // fecha dropdown ao clicar fora
   document.addEventListener('click', (e) => {
       const container = document.querySelector('.multi-select-container');
       if (container && !container.contains(e.target)) {
           const dropdown = document.getElementById('alergenos-dropdown');
           if (dropdown) dropdown.style.display = 'none';
       }
   });
   
   // ----------------------- Inicialização -----------------------
   async function inicializarFiltrosDinamicos() {
       if (!isAllrecipesPage()) return;
   
       // carrega categorias + alergenos
       const [categorias, alergenos] = await Promise.all([buscarCategoriasAPI(), buscarAlergenosAPI()]);
   
       if (categorias && categorias.length) criarFiltroCategorias(categorias);
       if (alergenos && alergenos.length) criarFiltroAlergenos(alergenos);
   
       // usando event delegation em vez de registrar muitos listeners
       const filterChoices = document.querySelector('.filter-choices');
       if (filterChoices) {
           // remove listener duplicado anterior e adiciona apenas um
           filterChoices.removeEventListener('change', onFilterChoicesChange, true);
           filterChoices.addEventListener('change', onFilterChoicesChange, true);
       }
   
       // pequena espera para garantir DOM pronto antes de carregar salvos
       setTimeout(() => {
           carregarFiltrosSalvos();
           atualizarAlergenosBadge();
       }, 60);
   }
   
   function onFilterChoicesChange(e) {
       // se mudou qualquer checkbox que não seja de alergenos, captura filtros
       const target = e.target;
       if (!target) return;
       if (target.matches('input[type="checkbox"]')) {
           // se for alergeno, já é tratado no criarFiltroAlergenos
           if (target.name === 'alergenos') return;
           // debounce para evitar chamadas em excesso
           clearTimeout(timeout);
           timeout = setTimeout(() => {
               capturarFiltros();
           }, 120);
       }
   }
   
   // ----------------------- Página de receitas -----------------------
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
           const filtrosDaURL = extrairFiltrosDaURL(urlParams);
           const receitas = await buscarPorFiltros(filtrosDaURL);
           exibirResultados(receitas, 'filtros da URL');
           return;
       }
   
       // carregar todas as receitas
       const data = await safeFetchJson('http://localhost:8080/v1/toque_gourmet/receita');
       if (data?.status && data?.response?.receita) {
           exibirResultados(data.response.receita || [], '');
       }
   }
   
   // ----------------------- Search handlers -----------------------
   async function executarBusca() {
       const searchInput = document.querySelector('.search-bar input');
       const termo = searchInput ? searchInput.value.trim() : '';
       if (!termo) return;
   
       if (!isAllrecipesPage()) {
           // redireciona com query
           const params = new URLSearchParams({ nome: termo });
           window.location.href = `/src/assets/pages/allrecipes.html?${params.toString()}`;
       } else {
           const receitas = await buscarPorNome(termo);
           exibirResultados(receitas, termo);
       }
   }
   
   // ----------------------- DOMContentLoaded -----------------------
   document.addEventListener('DOMContentLoaded', () => {
       if (isAllrecipesPage()) {
           inicializarPaginaAllrecipes();
           // inicializa filtros dinâmicos (categorias + alergenos)
           setTimeout(() => inicializarFiltrosDinamicos(), 60);
       }
   
       // search handlers (tecla enter + debounce input)
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
                   if (searchInput.value.trim()) executarBusca();
               }, 500);
           });
       }
   });
   
   // ----------------------- Expose API (opcional) -----------------------
   window.filtrarSistema = {
       executarBusca,
       capturarFiltros,
       redirectToAllrecipes
   };
   