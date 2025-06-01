# Imagen base
FROM node:18

# Crear y usar directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar dependencias (sin nodemon en producción)
RUN npm install --omit=dev

# Copiar todo el código
COPY . .

# Exponer el puerto que usará la app
EXPOSE 3000

# Comando de inicio (usa node en vez de nodemon para producción)
CMD ["node", "src/server.js"]
