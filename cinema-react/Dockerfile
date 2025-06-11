FROM node:18-alpine

WORKDIR /app

# Instalar dependências básicas
RUN apk add --no-cache bash curl

# Copiar package files
COPY package*.json ./

# Instalar deps
RUN npm install

# Copiar código
COPY . .

# Expor porta do Vite
EXPOSE 5173

# Health check simples
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5173 || exit 1

# Comando direto
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]