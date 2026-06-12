# ⚡ Quick Start - FreteBR Backend

## 🎯 Em 5 Minutos

### 1. Abra o terminal e navegue até o projeto

```bash
cd c:\des\frete-amigo-backend
```

### 2. Instale dependências (se ainda não fez)

```bash
npm install
```

### 3. Verifique seu .env

```bash
cat .env
```

Certifique-se que está assim:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=frete_amigo
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_mude_em_producao
PORT=3000
NODE_ENV=development
```

### 4. Inicie o servidor

```bash
npm run dev
```

Você deve ver:
```
✅ Conexão com banco de dados estabelecida
✅ Banco de dados inicializado com sucesso!
🚀 Servidor rodando em http://localhost:3000
📝 API disponível em http://localhost:3000/api
```

### 5. Teste a API (abra outro terminal)

```bash
# Health check
curl http://localhost:3000/api/health

# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","senha":"123456","nome_completo":"Teste","tipo_perfil":"embarcador"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","senha":"123456"}'
```

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start

# Listar pacotes instalados
npm list

# Atualizar dependências
npm update

# Verificar vulnerabilidades
npm audit

# Limpar cache npm
npm cache clean --force
```

---

## 🌐 Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/auth/profile` | Obter meu perfil |
| PUT | `/api/auth/profile` | Atualizar meu perfil |
| GET | `/api/cargas` | Listar todas as cargas |
| POST | `/api/cargas` | Criar nova carga |
| GET | `/api/cargas/:id` | Obter carga específica |
| PUT | `/api/cargas/:id` | Atualizar carga |
| DELETE | `/api/cargas/:id` | Deletar carga |
| GET | `/api/cargas/my-cargas/list` | Minhas cargas |

---

## 📋 Exemplo: Fluxo Completo

### 1️⃣ Registrar

```bash
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123",
    "nome_completo": "João Silva",
    "telefone": "11999999999",
    "tipo_perfil": "embarcador"
  }')

echo $TOKEN_RESPONSE
```

**Resposta esperada:**
```json
{
  "message": "Usuário registrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-aqui",
    "email": "joao@example.com",
    "nome_completo": "João Silva",
    "tipo": "embarcador"
  }
}
```

### 2️⃣ Criar Carga

```bash
TOKEN="seu_token_jwt_aqui"

curl -X POST http://localhost:3000/api/cargas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "origem_cidade": "São Paulo",
    "origem_estado": "SP",
    "destino_cidade": "Rio de Janeiro",
    "destino_estado": "RJ",
    "data_coleta": "2024-07-15",
    "tipo_carga": "Eletrônicos",
    "peso_kg": 500,
    "valor_frete": 1500,
    "tipo_veiculo": "Truck",
    "tipo_carroceria": "Baú"
  }'
```

### 3️⃣ Listar Cargas

```bash
# Todas as cargas
curl "http://localhost:3000/api/cargas"

# Filtradas
curl "http://localhost:3000/api/cargas?origem_estado=SP&destino_estado=RJ"

# Com paginação
curl "http://localhost:3000/api/cargas?page=1&limit=20"
```

### 4️⃣ Obter Minha Carga

```bash
TOKEN="seu_token_jwt_aqui"
CARGA_ID="uuid-da-carga"

curl -X GET http://localhost:3000/api/cargas/$CARGA_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 5️⃣ Atualizar Carga

```bash
TOKEN="seu_token_jwt_aqui"
CARGA_ID="uuid-da-carga"

curl -X PUT http://localhost:3000/api/cargas/$CARGA_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "valor_frete": 1800,
    "status": "negociando"
  }'
```

---

## 🆘 Troubleshooting

### ❌ "ECONNREFUSED"
MySQL não está rodando.

**Windows:**
```bash
net start MySQL80
```

### ❌ "Access denied for user"
Credenciais incorretas no `.env`.

Verifique seu usuário/senha MySQL:
```bash
mysql -u root -p
```

### ❌ "Port 3000 already in use"
Outra aplicação está usando a porta.

Mude em `.env`:
```env
PORT=3001
```

### ❌ "Unknown database 'frete_amigo'"
Execute manualmente:
```bash
mysql -u root < Script/schema.sql
```

---

## 📚 Documentação Completa

- **[README.md](./README.md)** - Visão geral
- **[API.md](./API.md)** - Todos os endpoints
- **[STARTUP.md](./STARTUP.md)** - Guia completo
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Resumo detalhado
- **[FILES_CREATED.md](./FILES_CREATED.md)** - Lista de arquivos

---

## 🎮 Testadores Online

Use estes para testar a API:

- **Postman:** https://www.postman.com
- **Insomnia:** https://insomnia.rest
- **Thunder Client:** VS Code extension
- **REST Client:** VS Code extension

---

## 💾 Estrutura do Projeto

```
src/
├── config/database.js       ← Conexão MySQL
├── db/initDb.js             ← Inicialização
├── controllers/
│   ├── authController.js
│   └── cargasController.js
├── routes/
│   ├── authRoutes.js
│   └── cargasRoutes.js
└── middleware/auth.js       ← JWT
```

---

## 🚀 Deploy (Futuro)

```bash
# Heroku
heroku create seu-app-name
heroku config:set JWT_SECRET=sua_chave
git push heroku main

# AWS
aws lambda create-function ...

# DigitalOcean
doctl apps create ...
```

---

**Pronto para começar? `npm run dev` 🎉**
