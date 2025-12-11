# 📸 **API Upload de Imagens para Azure**

## 🚀 **Endpoints Disponíveis**

### **1. Criar Receita com Upload de Imagem**
```http
POST /v1/toque_gourmet/receita/upload
Content-Type: multipart/form-data
```

**Body:**
- `imagem`: arquivo (JPG, PNG, JPEG - máximo 5MB)
- `dados`: JSON com os dados da receita

**Exemplo com FormData:**
```javascript
const formData = new FormData();

// Dados da receita como JSON string
const dadosReceita = {
    id_usuario: 1,
    titulo: "Bolo de Chocolate",
    descricao: "Delicioso bolo com cobertura",
    tempo_preparo: 45,
    dificuldade: "facil",
    data_criacao: "2025-12-11",
    data_edicao: null,
    id_cozinha: 1,
    id_categoria: 1,
    ingredientes: [
        {
            id_ingredientes: 1,
            quantidade: 200,
            unidade: "g"
        }
    ],
    modo_preparo: [
        {
            numero_passo: 1,
            descricao: "Misturar ingredientes"
        }
    ]
};

formData.append('imagem', fileInput.files[0]); // Arquivo de imagem
formData.append('dados', JSON.stringify(dadosReceita));

fetch('http://localhost:8080/v1/toque_gourmet/receita/upload', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### **2. Atualizar Receita com Upload de Imagem**
```http
PUT /v1/toque_gourmet/receita/upload/:id
Content-Type: multipart/form-data
```

**Parâmetros:**
- `id`: ID da receita na URL

**Body:**
- `imagem`: arquivo (JPG, PNG, JPEG - máximo 5MB)
- `dados`: JSON com os dados da receita (sem incluir id_receita)

---

## 📋 **Respostas da API**

### **Sucesso (200/201)**
```json
{
    "development": "Gabriel Cavalcante dos Santos",
    "api_description": "API para manipular dados do Projeto de Gestão de Receitas",
    "version": "1.0.10.25",
    "request_date": "12/11/2025",
    "response": {
        "id_usuario": 1,
        "titulo": "Bolo de Chocolate",
        "descricao": "Delicioso bolo com cobertura",
        "imagem": "https://uploadfotoss.blob.core.windows.net/uploadfotos/1701234567890_foto.jpg",
        // ... outros dados da receita
    },
    "status": true,
    "status_code": 201
}
```

### **Erro (400)**
```json
{
    "status": false,
    "status_code": 400,
    "message": "É necessário enviar uma imagem",
    "error": "Nenhum arquivo enviado"
}
```

### **Erro de Upload (400)**
```json
{
    "status": false,
    "status_code": 400,
    "message": "Erro ao fazer upload da imagem",
    "error": "Falha no upload para Azure"
}
```

---

## ⚙️ **Configuração do Upload**

- **Formatos aceitos:** JPG, PNG, JPEG
- **Tamanho máximo:** 5MB
- **Storage:** Azure Blob Storage
- **Container:** uploadfotos
- **Nome do arquivo:** Timestamp + nome original

---

## 🔄 **Fluxo de Upload**

1. **Front-end** envia FormData com imagem + dados JSON
2. **Multer** processa o arquivo no back-end
3. **Controller Azure** faz upload para blob storage
4. **Retorna URL** da imagem no Azure
5. **Insere/Atualiza** receita no banco com a URL

---

## 💡 **Exemplo Completo com HTML**

```html
<form id="form-receita" enctype="multipart/form-data">
    <input type="text" id="titulo" placeholder="Título da receita">
    <textarea id="descricao" placeholder="Descrição"></textarea>
    <input type="number" id="tempo_preparo" placeholder="Tempo (min)">
    <select id="dificuldade">
        <option value="facil">Fácil</option>
        <option value="medio">Médio</option>
        <option value="dificil">Difícil</option>
    </select>
    <input type="file" id="imagem" accept="image/*" required>
    <button type="submit">Cadastrar Receita</button>
</form>

<script>
document.getElementById('form-receita').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Coleta os dados do formulário
    const dadosReceita = {
        id_usuario: 1,
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        tempo_preparo: parseInt(document.getElementById('tempo_preparo').value),
        dificuldade: document.getElementById('dificuldade').value,
        data_criacao: new Date().toISOString().split('T')[0],
        data_edicao: null,
        // ... outros campos
    };

    formData.append('imagem', document.getElementById('imagem').files[0]);
    formData.append('dados', JSON.stringify(dadosReceita));

    try {
        const response = await fetch('http://localhost:8080/v1/toque_gourmet/receita/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status) {
            alert('Receita cadastrada com sucesso!');
            console.log('Imagem:', result.response.imagem);
        } else {
            alert('Erro: ' + result.message);
        }
    } catch (error) {
        alert('Erro na requisição: ' + error.message);
    }
});
</script>
```

## ✅ **Pronto para usar!**

As rotas de upload estão integradas com o sistema de receitas e prontas para uso no front-end!