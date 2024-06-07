# Utiliza una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install --production

# Copia el resto del código fuente
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Utiliza una imagen base de Nginx
FROM nginx:alpine

# Copia los archivos estáticos de React construidos por Node.js a la carpeta de Nginx
COPY --from=0 /app/build /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
