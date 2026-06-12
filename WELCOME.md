# 🎉 Bem-vindo ao FreteBR Backend!

## ✨ O que foi criado

Um **backend Node.js + Express + MySQL completo** pronto para produção com:

✅ **Autenticação com JWT** - Segura e escalável  
✅ **4 Tabelas MySQL** - Com relacionamentos e índices  
✅ **10+ Endpoints** - Bem estruturados e documentados  
✅ **Hash de Senhas** - Com bcryptjs  
✅ **Pool de Conexões** - Para performance  
✅ **Middleware JWT** - Proteção de rotas  
✅ **CORS Habilitado** - Pronto para frontend  
✅ **Documentação Completa** - 6 arquivos markdown  

---

## 🚀 Comece em 5 Minutos

```bash
# 1. Navegue até o projeto
cd c:\des\frete-amigo-backend

# 2. Instale dependências (se primeira vez)
npm install

# 3. Inicie o servidor
npm run dev

# 4. Pronto! API rodando em http://localhost:3000
```

Abra outro terminal e teste:
```bash
curl http://localhost:3000/api/health
```

---

## 📂 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| 📄 **QUICK_START.md** | ⭐ Leia primeiro! Inicialização rápida |
| 📄 **API.md** | 📚 Documentação de todos os endpoints |
| 📄 **STARTUP.md** | 🔧 Guia completo de inicialização |
| 📄 **README.md** | 📖 Visão geral do projeto |
| 📄 **.env** | 🔑 Configurações (NÃO VERSIONAR) |
| 📄 **server.js** | 🚀 Ponto de entrada da aplicação |

---

## 🗂️ Estrutura de Diretórios

```
frete-amigo-backend/
│
├── 📁 src/                         ← Código-fonte
│   ├── 📁 config/                  ← Banco de dados
│   ├── 📁 db/                      ← Inicialização
│   ├── 📁 controllers/             ← Lógica de negócio
│   ├── 📁 routes/                  ← Endpoints
│   ├── 📁 middleware/              ← JWT, validação
│   └── 📁 utils/                   ← Funções auxiliares
│
├── 📁 Script/                      ← SQL scripts
│   ├── DDL.txt                     ← Original
│   └── schema.sql                  ← Novo (auto-criado)
│
├── 📁 node_modules/                ← Dependências (100+)
│
├── 🚀 server.js                    ← Inicia a aplicação
├── 📦 package.json                 ← Dependências e scripts
├── 🔑 .env                        ← Variáveis de ambiente
├── 📚 QUICK_START.md              ← 📍 LEIA PRIMEIRO
├── 📚 API.md                      ← Documentação de endpoints
├── 📚 STARTUP.md                  ← Guia de inicialização
└── 📚 README.md                   ← Visão geral
```

---

## 🔐 Funcionalidades de Autenticação

### Registrar novo usuário
```bash
POST /api/auth/register
{
  "email": "usuario@example.com",
  "senha": "senha123",
  "nome_completo": "João Silva",
  "telefone": "11999999999",
  "tipo_perfil": "embarcador"
}
```

### Fazer login
```bash
POST /api/auth/login
{
  "email": "usuario@example.com",
  "senha": "senha123"
}
```
**Resposta:** `{ "token": "eyJhbGc...", "user": {...} }`

### Usar token em rotas protegidas
```
Authorization: Bearer seu_token_jwt_aqui
```

---

## 📦 Funcionalidades de Cargas

### Criar carga
```bash
POST /api/cargas
{
  "origem_cidade": "São Paulo",
  "origem_estado": "SP",
  "destino_cidade": "Rio de Janeiro",
  "destino_estado": "RJ",
  "data_coleta": "2024-07-15",
  "tipo_carga": "Eletrônicos",
  "peso_kg": 500,
  "valor_frete": 1500,
  "tipo_veiculo": "Truck"
}
```

### Listar cargas com filtros
```bash
GET /api/cargas?origem_estado=SP&destino_estado=RJ
```

### Buscar cargas específicas
```bash
GET /api/cargas/:id
```

---

## 🛠️ Dependências Principais

```json
{
  "express": "Framework web",
  "mysql2": "Driver MySQL com promises",
  "jsonwebtoken": "Autenticação JWT",
  "bcryptjs": "Hash de senhas",
  "dotenv": "Variáveis de ambiente",
  "uuid": "Geração de UUIDs",
  "cors": "Cross-origin requests",
  "express-validator": "Validação de dados"
}
```

---

## 🗄️ Banco de Dados

### 4 Tabelas criadas automaticamente:

1. **users** - Usuários da plataforma
2. **profiles** - Perfis detalhados
3. **user_roles** - Papéis/permissões
4. **cargas** - Cargas publicadas

Todos com:
- ✅ UUIDs como ID primária
- ✅ Timestamps (created_at, updated_at)
- ✅ Índices de performance
- ✅ Foreign keys com cascata

---

## 📊 Endpoints da API

### Autenticação (4)
- `POST   /api/auth/register`
- `POST   /api/auth/login`
- `GET    /api/auth/profile`
- `PUT    /api/auth/profile`

### Cargas (6+)
- `GET    /api/cargas` (com filtros e paginação)
- `GET    /api/cargas/:id`
- `POST   /api/cargas` (protegido)
- `PUT    /api/cargas/:id` (protegido)
- `DELETE /api/cargas/:id` (protegido)
- `GET    /api/cargas/my-cargas/list` (protegido)

### Health
- `GET    /api/health`

---

## ✅ Checklist de Configuração

- [ ] MySQL 8+ instalado
- [ ] `npm install` executado
- [ ] `.env` configurado com credenciais MySQL
- [ ] MySQL está rodando (`net start MySQL80` no Windows)
- [ ] Servidor iniciado com `npm run dev`
- [ ] API respondendo em `http://localhost:3000/api/health`
- [ ] Teste de registr0 funcionando
- [ ] Token JWT recebido e validado

---

## 🚨 Primeiros Passos

### 1. Leia o QUICK_START.md
```bash
cat QUICK_START.md
```

### 2. Inicie o servidor
```bash
npm run dev
```

### 3. Teste a API com curl ou Postman
```bash
curl http://localhost:3000/api/health
```

### 4. Crie seu primeiro usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "senha": "senha123",
    "nome_completo": "Seu Nome"
  }'
```

---

## 🔒 Segurança

✅ Senhas hasheadas com bcryptjs  
✅ JWT com expiração configurável  
✅ Middleware de autenticação  
✅ Validação de entrada  
✅ CORS habilitado  
✅ Variáveis de ambiente seguras  

---

## 📚 Documentação

### Iniciante?
→ Leia **[QUICK_START.md](./QUICK_START.md)** primeiro!

### Quer detalhes técnicos?
→ Veja **[API.md](./API.md)**

### Problemas ao iniciar?
→ Consulte **[STARTUP.md](./STARTUP.md)**

### Visão geral?
→ Leia **[README.md](./README.md)**

---

## 💡 Próximas Etapas

1. **Testar a API** - Use Postman ou curl
2. **Criar Frontend** - Em outro diretório (React, Next.js, Vue)
3. **Adicionar Features** - Negociação, mensagens, avaliações
4. **Deploy** - Heroku, AWS, DigitalOcean

---

## 🎓 Arquitetura

```
Client (Frontend)
       ↓ HTTP/HTTPS
    Express.js (Rotas)
       ↓
   Middleware (JWT)
       ↓
   Controllers (Lógica)
       ↓
   MySQL (Banco de dados)
       ↓
   Resposta JSON
```

---

## ⚡ Performance

- Pool de conexões MySQL (até 10 conexões simultâneas)
- Índices nas colunas mais consultadas
- Paginação automática
- Validação client-side

---

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento com auto-reload
npm start        # Produção
npm audit        # Verificar vulnerabilidades
npm update       # Atualizar dependências
```

---

## 🌍 URLs da API

```
Development: http://localhost:3000
API Base:    http://localhost:3000/api
Endpoints:   /auth, /cargas, /health
```

---

## 📞 Ajuda

1. **Erros de conexão?** → Verifique MySQL está rodando
2. **Token inválido?** → Faça login novamente
3. **Porta em uso?** → Mude em `.env`
4. **Banco não criado?** → Execute `Script/schema.sql`

---

## 🎯 Status do Projeto

✅ **Backend Node.js + Express** - Completo  
✅ **Banco de dados MySQL** - Estruturado  
✅ **Autenticação JWT** - Implementada  
✅ **Endpoints CRUD** - Prontos  
✅ **Documentação** - Completa  
❌ **Frontend** - Criar em outro diretório  

---

**Versão:** 1.0.0  
**Status:** ✅ Pronto para uso  
**Criado:** Junho 2024

---

## 🎉 Parabéns!

Seu backend está **100% pronto para uso**!

Próximo passo: **Leia [QUICK_START.md](./QUICK_START.md)** e comece a desenvolver! 🚀
