# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos archivos de dependencias para aprovechar el caché de Docker
COPY package*.json ./

# Instalamos todas las dependencias (incluyendo las de desarrollo para compilar)
RUN npm install

# Copiamos el resto del código y el tsconfig que ya corregimos
COPY . .

# Compilamos el proyecto (esto generará la carpeta /dist)
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copiamos solo los archivos necesarios para ejecutar
COPY package*.json ./

# Instalamos solo las dependencias de producción (--omit=dev)
RUN npm install --omit=dev

# Copiamos la carpeta compilada desde el stage anterior
COPY --from=builder /app/dist ./dist

# Exponemos el puerto que configuramos en NestJS
EXPOSE 3000

# Comando para arrancar el microservicio
CMD ["node", "dist/main.js"]