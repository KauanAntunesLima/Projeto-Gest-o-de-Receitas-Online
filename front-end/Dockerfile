# Usar imagem nginx para servir arquivos estáticos
FROM nginx:alpine

# Remover o arquivo de configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar arquivo de configuração personalizado do nginx
COPY nginx.conf /etc/nginx/conf.d/

# Copiar todos os arquivos estáticos para o diretório do nginx
COPY . /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]