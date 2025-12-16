# 🍽️ Gestão de Receitas Online

## 📌 Visão Geral

O **Gestão de Receitas Online** é uma plataforma web que permite aos usuários **criar, gerenciar, editar e compartilhar receitas culinárias** de forma simples, segura e intuitiva.

Cada usuário possui **controle total apenas sobre suas próprias receitas**, enquanto pode visualizar receitas publicadas por outros usuários, promovendo interação e troca de experiências.

---

## 🎯 Objetivo do Projeto

* Centralizar receitas em um único ambiente digital
* Garantir autonomia do usuário sobre suas receitas
* Oferecer uma experiência moderna, intuitiva e responsiva

---

## 🖼️ Imagens do Projeto

### 🔐 Tela de Login

![Tela de Login](./images/login.png)

### 📝 Cadastro de Usuário

![Cadastro de Usuário](./images/cadastro.png)

### 🏠 Página Inicial

![Página Inicial](./images/home.png)

### 🍲 Listagem de Receitas

![Página de listagem de receitas](./images/recipes.png)

### ➕ Criação de Receita

![Criação de Receita](./images/cadastrodereceita.png)

### ✏️ Edição de Receita

![Edição de Receita](./images/editarreceita.jpeg)

---

## 👤 Funcionalidades do Usuário

* Criar conta e realizar login
* Criar, editar e excluir suas próprias receitas
* Visualizar receitas de outros usuários
* Manter dados protegidos por autenticação

---

## 📱 Responsividade

O sistema é totalmente responsivo e funciona corretamente em:

* Smartphones
* Tablets
* Computadores

---

## 👥 Autores

* **Front-end**: Roger Ribeiro
* **Back-end**: Gabriel Cavalcante
* **Banco de Dados**: Kauan Antunes

---

## 🐳 Execução com Docker (Execução sem Docker abaixo)

 A implementação do Docker neste projeto foi realizada a partir de estudos externos, com apoio e orientação do meu irmão, o que contribuiu para o entendimento do processo de conteinerização, configuração dos serviços e integração entre back-end, front-end e banco de dados. - Roger R.

### Pré-requisitos

* Docker
* Docker Compose

Verifique a instalação:

```bash
docker --version
docker-compose --version
```

### Arquitetura

* **MySQL**: porta 5506
* **Back-end (Node.js)**: porta 8080
* **Front-end (Nginx)**: porta 3000

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/KauanAntunesLima/Projeto-Gest-o-de-Receitas-Online.git
cd Projeto-Gest-o-de-Receitas-Online
```

2. **Suba os containers**

```bash
docker-compose up -d
```

3. **Verifique os containers**

```bash
docker-compose ps
```

### Acessos

* Front-end: [http://localhost:3000](http://localhost:3000)
* Back-end: [http://localhost:8080](http://localhost:8080)
* Swagger: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
* MySQL: localhost:5506

---

## 🚀 Execução Sem Docker

### Clonagem das Branches

```bash
# Front-end
git clone --branch front-end https://github.com/KauanAntunesLima/Projeto-Gest-o-de-Receitas-Online.git frontend

# Back-end
git clone --branch back-end https://github.com/KauanAntunesLima/Projeto-Gest-o-de-Receitas-Online.git backend
```

---

### Back-end

Pré-requisitos:

* Node.js 14+
* MySQL 5.7 ou 8.0

```bash
cd backend
npm install
cp .env.example .env
```

Arquivo `.env`:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/toque_gourmet"
PORT=8080
```

```bash
npx prisma generate
npx prisma db push
npm start
```

Back-end disponível em: [http://localhost:8080](http://localhost:8080)

---

### Front-end

```bash
cd ../frontend
```

Abra o projeto utilizando:

* **Live Server (VS Code)** → `index.html`

Front-end disponível em: [http://localhost:5500](http://localhost:5500) (ou porta automática)

---

## 🛠️ Tecnologias Utilizadas

### Front-end

* HTML5, CSS3, JavaScript
* Vanilla JS
* Fetch API
* LocalStorage

### Back-end

* Node.js + Express
* Prisma ORM
* MySQL
* Multer
* CORS
* Swagger

---

## 📚 Principais Endpoints

### Autenticação

* `POST /v1/toque_gourmet/usuario`
* `POST /v1/toque_gourmet/usuario/login`

### Receitas

* `GET /v1/toque_gourmet/receita`
* `GET /v1/toque_gourmet/receita/usuario/{id}`
* `POST /v1/toque_gourmet/receita`
* `PUT /v1/toque_gourmet/receita/{id}`
* `DELETE /v1/toque_gourmet/receita/{id}`

### Avaliações

* `GET /v1/toque_gourmet/avaliacao/receita/{id}`
* `POST /v1/toque_gourmet/avaliacao`

---

## 📝 Observações Finais

* Docker é o método recomendado
* Banco é inicializado automaticamente no Docker
* Cada usuário gerencia apenas suas próprias receitas

