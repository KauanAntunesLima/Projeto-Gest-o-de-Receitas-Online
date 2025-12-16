# 🍽️ Gestão de Receitas Online

## 📌 Visão Geral
O **Gestão de Receitas Online** é uma plataforma web desenvolvida para oferecer **autonomia total na organização de receitas culinárias**, permitindo que usuários criem, editem, visualizem e interajam com receitas de forma simples, rápida e segura.

O sistema também incentiva o **compartilhamento de receitas entre usuários**, promovendo interação e troca de experiências.

---

## 🎯 Objetivo do Projeto
O objetivo principal do software é:
- Facilitar a **gestão de receitas online**
- Garantir **controle total do usuário** sobre suas próprias receitas
- Centralizar receitas em um único ambiente digital
- Oferecer uma experiência **moderna, intuitiva e responsiva**

---

## 🖼️ Imagens do Projeto

### 🔐 Tela de Login
> Espaço destinado à imagem da tela de login do sistema.

![Tela de Login](./images/login.png)

---

### 📝 Cadastro de Usuário
> Espaço destinado à imagem da tela de cadastro de usuário.

![Cadastro de Usuário](./images/cadastro.png)

---

### 🏠 Página Inicial 
> Espaço destinado à landing page.

![Página Inicial](./images/home.png)

---

### 🍲 Listagem de Receitas

![Página de listagem de receitas](./images/recipes.png)

---

### ➕ Criação de Receita
> Espaço destinado à imagem da tela de criação de uma nova receita.

![Criação de Receita](./images/cadastrodereceita.png)

---

### ✏️ Edição de Receita
> Espaço destinado à imagem da tela de edição de receita.

![Edição de Receita](./images/editarreceita.jpeg)

---

## 👤 Funcionalidades do Usuário
O usuário do sistema pode:

- ✅ Criar uma conta e realizar login
- 🍲 Criar novas receitas
- 👀 Visualizar receitas publicadas por outros usuários
- ✏️ Editar suas próprias receitas
- 🗑️ Deletar suas próprias receitas
- 🔐 Manter seus dados protegidos por autenticação

> Cada usuário possui autonomia apenas sobre suas próprias receitas.

---

## 📱 Responsividade
O sistema é **totalmente responsivo**, funcionando corretamente em:
- Smartphones
- Tablets
- Computadores e notebooks

A interface se adapta automaticamente a qualquer tamanho de tela.

---

## 🛠️ Tecnologias Utilizadas
- Front-end: HTML, CSS, JavaScript
- Back-end: Node.js
- Banco de Dados: MySQL
- ORM: Prisma
- Documentação da API: Swagger

---

## Autores
- Desenvolvedor Front-end: Roger Ribeiro
- Desenvolvedor Back-end: Gabriel Cavalcante
- Desenvolvedor do Banco de Dados: Kauan Antunes

---

## 🐳 Tutorial de Inicialização com Docker (Passo a passo sem docker abaixo)

### 📋 Pré-requisitos
Antes de iniciar, certifique-se de ter o Docker e Docker Compose instalados em sua máquina:

- **Docker Desktop** (Windows/Mac): [Baixe aqui](https://www.docker.com/products/docker-desktop/)
- **Docker Engine** (Linux): [Siga o guia de instalação](https://docs.docker.com/engine/install/)

**Verifique se o Docker está instalado corretamente:**
```bash
docker --version
docker-compose --version
```

### 🏗️ Arquitetura dos Containers
O projeto utiliza 3 containers:
- **mysql**: Banco de dados MySQL 8.0 (porta 5506)
- **back-end**: API Node.js (porta 8080)
- **front-end**: Nginx servindo arquivos estáticos (porta 3000)

### 🚀 Passo a Passo para Iniciar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone <URL-DO-REPOSITORIO>
   cd Projeto-Gest-o-de-Receitas-Online
   ```

2. **Verifique o arquivo docker-compose.yml:**
   - O banco de dados será automaticamente inicializado com `./back-end/database/backup.sql`
   - Senhas padrão: `password` (para root e user)
   - Database: `db_receitas`

3. **Inicie os containers com Docker Compose:**
   ```bash
   docker-compose up -d
   ```

4. **Acompanhe o processo de inicialização:**
   ```bash
   docker-compose logs -f
   ```
   - O MySQL pode levar alguns minutos para inicializar completamente
   - O back-end só iniciará após o MySQL estar saudável

5. **Verifique se os containers estão rodando:**
   ```bash
   docker-compose ps
   ```
   Você deverá ver 3 containers com status "Up"

6. **Acesse a aplicação:**
   - Front-end: [http://localhost:3000](http://localhost:3000)
   - Back-end API: [http://localhost:8080](http://localhost:8080)
   - Documentação da API (Swagger): [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
   - Banco de dados (externamente): `localhost:5506`

### 🔧 Comandos Úteis

- **Parar todos os containers:**
  ```bash
  docker-compose down
  ```

- **Parar e remover volumes (cuidado: perderá dados do banco):**
  ```bash
  docker-compose down -v
  ```

- **Verificar logs de um serviço específico:**
  ```bash
  docker-compose logs back-end
  docker-compose logs mysql
  docker-compose logs front-end
  ```

- **Reconstruir os containers (após alterações nos Dockerfiles):**
  ```bash
  docker-compose up --build -d
  ```

- **Acessar o container do back-end:**
  ```bash
  docker-compose exec back-end sh
  ```

- **Acessar o MySQL diretamente:**
  ```bash
  docker-compose exec mysql mysql -u root -p
  # Senha: password
  ```

- **Reiniciar um serviço específico:**
  ```bash
  docker-compose restart back-end
  ```

### 🔐 Configurações do Banco de Dados

- **Host**: mysql (interno) / localhost (externo)
- **Porta interna**: 3306
- **Porta externa**: 5506
- **Database**: db_receitas
- **Usuário**: root / user
- **Senha**: password

### ⚠️ Solução de Problemas

- **Portas em uso:** Verifique se as portas 3000, 8080 e 5506 não estão sendo utilizadas:
  ```bash
  # Linux/Mac
  lsof -i :3000
  lsof -i :8080
  lsof -i :5506

  # Windows
  netstat -ano | findstr :3000
  ```

- **Permissões (Linux):** Adicione seu usuário ao grupo docker:
  ```bash
  sudo usermod -aG docker $USER
  # Faça logout e login novamente
  ```

- **Problemas com o MySQL:** Verifique se o container está saudável:
  ```bash
  docker-compose ps mysql
  docker-compose logs mysql
  ```

- **Limpar cache e rebuild completo:**
  ```bash
  docker-compose down
  docker system prune -a
  docker-compose up --build
  ```

- **Volume do MySQL persistente:** Os dados são salvos no volume `mysql_data` e persistem entre reinicializações

### 📝 Notas Importantes

- O projeto utiliza Node.js 18 no back-end
- O front-end é servido pelo Nginx (Alpine)
- O backup SQL é automaticamente importado na primeira inicialização
- Os containers se comunicam através da rede `app-network`
- O back-end aguarda o MySQL ficar saudável antes de iniciar (healthcheck)

O projeto estará pronto para uso em aproximadamente 2-3 minutos, tempo necessário para o Docker baixar as imagens, inicializar o MySQL e aguardar o healthcheck.

---


## 🚀 Instalação Rápida (Sem Docker)

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [MySQL](https://www.mysql.com/) (v5.7 ou v8.0)
- [Git](https://git-scm.com/)

### Passo 1: Clonar o Repositório

```bash
# Front-end
git clone --branch front-end https://github.com/KauanAntunesLima/Projeto-Gest-o-de-Receitas-Online.git frontend

# Back-end
git clone --branch back-end https://github.com/KauanAntunesLima/Projeto-Gest-o-de-Receitas-Online.git backend
```

### Passo 2: Configurar o Back-end

```bash
cd backend

# Instalar dependências
npm install

# Configurar banco de dados MySQL
# Crie um banco de dados chamado "toque_gourmet" no MySQL

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações:
```

Arquivo `.env`:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/toque_gourmet"
PORT=8080
```

```bash
# Gerar Prisma Client
npx prisma generate

# Executar migrações do banco de dados
npx prisma db push

# Iniciar o servidor back-end
npm start
```

O back-end estará rodando em: http://localhost:8080

### Passo 3: Configurar o Front-end

```bash
# Volte para o diretório principal
cd ../front-end
```

**Recomendado: Usar VS Code Live Server (mais simples)**
- Abra a pasta `front-end` no VS Code
- Clique com o botão direito no arquivo `index.html`
- Selecione **"Open with Live Server"**
- O front-end abrirá automaticamente em: http://localhost:5500 ou porta similar


O front-end estará rodando em http://localhost:3000 (se usar terminal) ou porta automática (com Live Server)

### Passo 4: Configurar o banco

```bash

# Executar o backup
mysql -u SeuUsuarioMySql -p SuaSenhaMySql < database/script.sql
# ou
mysql -u SeuUsuarioMySql -p SuaSenhaMySql < database/backup.sql

# Iniciar o servidor back-end
npm start
```


## 🛠️ Tecnologias Utilizadas

### Front-end
- **HTML5**, **CSS3**, **JavaScript ES6+**
- **Vanilla JS** (Sem frameworks)
- **Fetch API** para requisições HTTP
- **LocalStorage** para persistência de sessão

### Back-end
- **Node.js** com **Express.js**
- **Prisma ORM** para banco de dados
- **MySQL** como banco de dados relacional
- **Multer** para upload de arquivos
- **CORS** para comunicação entre origins
- **Swagger** para documentação da API

## 📚 Endpoints Principais da API

### Autenticação
- `POST /v1/toque_gourmet/usuario` - Criar usuário
- `POST /v1/toque_gourmet/usuario/login` - Login

### Receitas
- `GET /v1/toque_gourmet/receita` - Listar todas as receitas
- `GET /v1/toque_gourmet/receita/usuario/{id}` - Receitas do usuário
- `POST /v1/toque_gourmet/receita` - Criar nova receita
- `PUT /v1/toque_gourmet/receita/{id}` - Atualizar receita
- `DELETE /v1/toque_gourmet/receita/{id}` - Excluir receita

### Avaliações
- `GET /v1/toque_gourmet/avaliacao/receita/{id}` - Avaliações da receita
- `POST /v1/toque_gourmet/avaliacao` - Criar avaliação

## 🔧 Configuração Adicional

### Variáveis de Ambiente

O back-end utiliza as seguintes variáveis de ambiente:
- `DATABASE_URL`: String de conexão com o MySQL
- `PORT`: Porta do servidor (padrão: 8080)
- (Opcional) Configurações para upload de arquivos em nuvem
