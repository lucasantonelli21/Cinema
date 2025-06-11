# Sistema Web de Controle de Cinema

## Objetivo

Desenvolver um sistema web de controle de cinema utilizando **React** (frontend) e **NestJS** (backend) com **PostgreSQL**, implementando funcionalidades como:

- Cadastro de filmes
- Cadastro de sessões  
- Cadastro de salas
- Venda de ingressos

Os dados são armazenados em banco PostgreSQL com **Prisma ORM**.

---

## Arquitetura do Sistema

### Backend (API)
- **Framework:** NestJS
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Containerização:** Docker

### Frontend
- **Framework:** React + Vite
- **Estilização:** CSS/Styled Components
- **Consumo de API:** Axios/Fetch

---

## Pré-requisitos

Antes de executar o sistema, certifique-se de ter instalado:

### 1. **Docker e Docker Compose**
```bash
# Verificar instalação
docker --version
docker-compose --version
```

### 2. **PostgreSQL**
O PostgreSQL deve estar rodando localmente ou no WSL:

#### **Windows (instalação local):**
- Baixe e instale o PostgreSQL
- Configure usuário: `postgres`
- Senha: `postgres` 
- Porta: `5432`

#### **WSL (recomendado):**
```bash
# No WSL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Configurar senha do usuário postgres
sudo -u postgres psql
ALTER USER postgres PASSWORD 'postgres';
\q

# Iniciar serviço
sudo service postgresql start
```

### 3. **Criar banco de dados:**
```bash
# Conectar no PostgreSQL
psql -U postgres -h localhost

# Criar banco
CREATE DATABASE cinema;

# Criar schema
\c cinema;
CREATE SCHEMA teste;
\q
```

---

## Configuração e Execução

### 1. **Clonar o repositório**
```bash
git clone <seu-repositorio>
cd "Projeto Cinema"
```

### 2. **Configurar string de conexão**

Edite o arquivo `docker-compose.yml` e ajuste o IP do PostgreSQL:

```yaml
environment:
  DATABASE_URL: postgresql://postgres:postgres@SEU_IP_AQUI:5432/cinema?schema=teste
```

#### **Descobrir o IP:**

**Se PostgreSQL no WSL:**
```bash
# No Windows (PowerShell)
wsl hostname -I
```

**Se PostgreSQL local no Windows:**
```yaml
DATABASE_URL: postgresql://postgres:postgres@host.docker.internal:5432/cinema?schema=teste
```

### 3. **Executar o sistema**


#### **Opção 1: Docker Compose direto**
```bash
# Construir e iniciar
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

#### **Opção 2: Script automático**
```bash
# Linux/WSL
chmod +x start-dev.sh
./start-dev.sh

# Windows PowerShell
.\start-dev.ps1
```

### 4. **Verificar se está rodando**

Após alguns minutos:

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

---

## Comandos Úteis

### **Docker:**
```bash
# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Ver logs específicos
docker-compose logs -f api
docker-compose logs -f frontend

# Parar tudo
docker-compose down

# Reconstruir sem cache
docker-compose build --no-cache

# Limpar sistema Docker
docker system prune -f
```

### **Debug:**
```bash
# Entrar no container da API
docker-compose exec api sh

# Entrar no container do Frontend
docker-compose exec frontend sh

# Executar Prisma manualmente
docker-compose exec api npx prisma generate
docker-compose exec api npx prisma migrate deploy
```

---

## Estrutura do Banco de Dados

### **Entidades:**

#### **Movies (Filmes)**
- id, titulo, sinopse, genero
- classificacao, duracao, dataEstreia
- imagemUrl, dataCriacao, dataAtualizacao

#### **Rooms (Salas)**  
- id, nome, capacidade, tipo
- dataCriacao, dataAtualizacao

#### **Sessions (Sessões)**
- id, movieId, roomId, dataHora
- preco, idioma, formato
- dataCriacao, dataAtualizacao

#### **Tickets (Ingressos)**
- id, sessionId, nomeCliente, cpfCliente
- assento, tipoPagamento, valorPago
- dataCriacao, dataAtualizacao

---

## Funcionalidades do Sistema

### **Backend (API) - Endpoints:**

#### **Filmes:** `/movies`
- `GET /movies` - Listar filmes
- `POST /movies` - Criar filme
- `GET /movies/:id` - Buscar filme
- `PUT /movies/:id` - Atualizar filme
- `DELETE /movies/:id` - Deletar filme

#### **Salas:** `/rooms`
- `GET /rooms` - Listar salas
- `POST /rooms` - Criar sala
- `GET /rooms/:id` - Buscar sala
- `PUT /rooms/:id` - Atualizar sala
- `DELETE /rooms/:id` - Deletar sala

#### **Sessões:** `/sessions`
- `GET /sessions` - Listar sessões
- `POST /sessions` - Criar sessão
- `GET /sessions/:id` - Buscar sessão
- `PUT /sessions/:id` - Atualizar sessão
- `DELETE /sessions/:id` - Deletar sessão

#### **Ingressos:** `/tickets`
- `GET /tickets` - Listar ingressos
- `POST /tickets` - Criar ingresso
- `GET /tickets/:id` - Buscar ingresso
- `PUT /tickets/:id` - Atualizar ingresso
- `DELETE /tickets/:id` - Deletar ingresso

### **Frontend (React) - Páginas:**

- **Index:** Visão geral do usuário
- **Filmes:** Cadastro e listagem de filmes
- **Salas:** Cadastro e listagem de salas
- **Sessões:** Cadastro e listagem de sessões
- **Ingressos:** Venda e listagem de ingressos

---

## Tecnologias Utilizadas

### **Backend:**
- NestJS (Node.js Framework)
- Prisma (ORM)
- PostgreSQL (Banco de dados)
- TypeScript
- Docker

### **Frontend:**
- React 18
- Vite (Build tool)
- TypeScript
- CSS Modules/Styled Components
- Axios (HTTP Client)

### **DevOps:**
- Docker & Docker Compose

---

## Solução de Problemas

### **Erro de conexão com PostgreSQL:**
1. Verificar se PostgreSQL está rodando:
   ```bash
   # Windows
   services.msc → PostgreSQL
   
   # WSL
   sudo service postgresql status
   ```

2. Verificar IP no docker-compose.yml
3. Testar conexão manual:
   ```bash
   psql -U postgres -h localhost -d cinema
   ```