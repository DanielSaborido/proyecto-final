FROM node:16-alpine

WORKDIR /app

# Instalar dependencias
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copiar archivos de la aplicación
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
