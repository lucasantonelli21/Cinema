FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache bash curl openssl

WORKDIR /app

# Copiar apenas arquivos essenciais
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copiar apenas schemas do Prisma
COPY prisma/schema.prisma ./prisma/

# Copiar apenas código fonte
COPY src ./src

# Instalar TODAS as dependências (incluindo dev para build)
RUN npm install

# Instalar CLIs globalmente
RUN npm install -g prisma @nestjs/cli

# Gerar cliente Prisma para Linux
RUN npx prisma generate

# Verificar onde o Prisma foi gerado
RUN echo "📁 Verificando Prisma Client:" && \
    ls -la node_modules/.prisma/client/ && \
    echo "📁 Verificando @prisma/client:" && \
    ls -la node_modules/@prisma/client/

# Compilar aplicação TypeScript
RUN npm run build

# Criar diretório para uploads
RUN mkdir -p uploads

# Expor portas
EXPOSE 3000 9229

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Comando para desenvolvimento
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]