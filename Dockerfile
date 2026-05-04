# --- STAGE 1: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./

# Primera corrección:
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# --- STAGE 2: Production ---
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./

# SEGUNDA CORRECCIÓN (Aquí es donde falló ahora):
RUN npm install --omit=dev --legacy-peer-deps

COPY --from=builder /app/dist ./dist
# No es necesario copiar node_modules si los instalamos arriba con --omit=dev

EXPOSE 3000
CMD ["node", "dist/main.js"]