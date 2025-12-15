# Usar imagem Node.js mais recente
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração do package
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Gerar o Prisma Client
RUN npx prisma generate

# Copiar o restante dos arquivos da aplicação
COPY . .

# Expor a porta que a aplicação roda
EXPOSE 8080

# Variável de ambiente para o banco de dados
ENV DATABASE_URL="mysql://root:password@mysql:3306/db_receitas"

# Comando para iniciar a aplicação
CMD ["npm", "start"]