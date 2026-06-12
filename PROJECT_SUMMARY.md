# 📦 Projeto FreteBR Backend - Sumário Completo

## ✅ O que foi criado

Um backend **Node.js + Express + MySQL** completo para a plataforma FreteBR com:

### Autenticação & Segurança
- ✅ Autenticação com JWT (JSON Web Tokens)
- ✅ Hash de senhas com bcryptjs
- ✅ Middleware de autenticação para rotas protegidas
- ✅ Roles/Papéis de usuário (admin, user)

### Banco de Dados
- ✅ Integração com MySQL 8+
- ✅ Pool de conexões para performance
- ✅ Inicialização automática de tabelas
- ✅ Schema baseado no seu DDL original
- ✅ Índices de performance nas colunas principais

### Recursos da API

#### 👤 Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil do usuário
- `PUT /api/auth/profile` - Atualizar perfil

#### 📦 Cargas
- `GET /api/cargas` - Listar todas as cargas (com filtros)
- `GET /api/cargas/:id` - Obter carga específica
- `POST /api/cargas` - Criar nova carga
- `PUT /api/cargas/:id` - Atualizar carga
- `DELETE /api/cargas/:id` - Deletar carga
- `GET /api/cargas/my-cargas/list` - Listar minhas cargas

### Recursos de Filtro
- Filtrar por estado de origem e destino
- Filtrar por tipo de veículo
- Filtrar por status da carga
- Paginação automática nos resultados

## 📁 Estrutura de Diretórios

```
frete-amigo-backend/
│
├── 📄 server.js                  ← Ponto de entrada principal
├── 📄 package.json               ← Dependências do projeto
├── 📄 .env                       ← Configurações (não fazer commit)
├── 📄 .env.example               ← Exemplo de configurações
├── 📄 .gitignore                 ← Arquivos ignorados pelo Git
│
├── 📚 Documentação
│   ├── 📄 README.md              ← Informações gerais
│   ├── 📄 API.md                 ← Documentação completa da API
│   └── 📄 STARTUP.md             ← Guia de inicialização
│
├── 📁 src/
│   │
│   ├── 📁 config/
│   │   └── 📄 database.js        ← Configuração da conexão MySQL
│   │
│   ├── 📁 db/
│   │   └── 📄 initDb.js          ← Script de inicialização do banco
│   │
│   ├── 📁 controllers/
│   │   ├── 📄 authController.js  ← Lógica de autenticação
│   │   └── 📄 cargasController.js ← Lógica de cargas
│   │
│   ├── 📁 routes/
│   │   ├── 📄 authRoutes.js      ← Endpoints de autenticação
│   │   └── 📄 cargasRoutes.js    ← Endpoints de cargas
│   │
│   ├── 📁 middleware/
│   │   └── 📄 auth.js            ← Verificação JWT
│   │
│   └── 📁 utils/
│       └── 📄 (para validadores)
│
└── 📁 Script/
    ├── 📄 DDL.txt                ← Schema original
    └── 📄 schema.sql             ← Schema SQL para inicialização manual
```

## 🚀 Inicialização Rápida

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar .env
```bash
cp .env.example .env
# Edite com suas credenciais MySQL
```

### 3. Iniciar servidor
```bash
npm run dev        # Desenvolvimento (com auto-reload)
npm start          # Produção
```

### 4. Testar API
```bash
curl http://localhost:3000/api/health
```

## 📊 Tabelas do Banco de Dados

### `users`
- id (UUID)
- email (único)
- nome_completo
- telefone
- password (hash bcrypt)
- created_at, updated_at

### `profiles`
- id (fk users)
- nome_completo
- telefone
- empresa
- tipo (motorista, embarcador, transportadora)
- cidade, estado
- created_at, updated_at

### `user_roles`
- id (UUID)
- user_id (fk users)
- role (admin, user)

### `cargas`
- id (UUID)
- user_id (fk users)
- origem_cidade, origem_estado
- destino_cidade, destino_estado
- data_coleta
- tipo_carga
- peso_kg
- valor_frete
- tipo_veiculo
- tipo_carroceria
- observacoes
- status (ativa, negociando, fechada, cancelada)
- created_at, updated_at

## 🔧 Dependências Instaladas

```json
{
  "express": "^4.18.2",              // Framework web
  "mysql2": "^3.6.0",                // Driver MySQL
  "jsonwebtoken": "^9.0.0",          // Autenticação JWT
  "bcryptjs": "^2.4.3",              // Hash de senhas
  "dotenv": "^16.0.3",               // Variáveis de ambiente
  "uuid": "^9.0.0",                  // Geração de UUIDs
  "cors": "^2.8.5",                  // CORS para frontend
  "express-validator": "^7.0.0"      // Validação de dados
}
```

## 📋 Checklist de Configuração

- [ ] MySQL instalado e rodando
- [ ] Node.js 16+ instalado
- [ ] `npm install` executado
- [ ] `.env` configurado com credenciais MySQL
- [ ] Servidor iniciado com `npm run dev`
- [ ] API respondendo em `http://localhost:3000/api/health`
- [ ] Teste de registro: `POST /api/auth/register`
- [ ] Teste de login: `POST /api/auth/login`
- [ ] Token JWT recebido e funcional

## 🔐 Segurança

- Senhas hasheadas com bcryptjs
- JWT com expiração configurável
- Middleware de autenticação em rotas sensíveis
- CORS habilitado para integração com frontend
- Validação de entrada com express-validator

## 📚 Documentação Completa

Veja arquivos para mais detalhes:

- **[README.md](./README.md)** - Visão geral e uso básico
- **[API.md](./API.md)** - Documentação completa de todos os endpoints
- **[STARTUP.md](./STARTUP.md)** - Guia passo a passo de inicialização

## 🎯 Próximas Etapas

1. **Configurar o Frontend** em outro diretório
   - React / Next.js / Vue
   - Consumir endpoints da API
   - Autenticação com JWT

2. **Adicionar Funcionalidades Extras**
   - Negociação de fretes
   - Sistema de mensagens
   - Avaliações e reputação
   - Pagamento online

3. **Deploy em Produção**
   - Heroku, AWS, DigitalOcean, etc
   - Variáveis de ambiente seguras
   - Backup automático do banco
   - Monitoramento e logs

## 💡 Exemplos de Uso

### Registrar
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "senha": "senha123",
    "nome_completo": "João Silva",
    "telefone": "11999999999",
    "tipo_perfil": "embarcador"
  }'
```

### Criar Carga
```bash
curl -X POST http://localhost:3000/api/cargas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_jwt" \
  -d '{
    "origem_cidade": "São Paulo",
    "origem_estado": "SP",
    "destino_cidade": "Rio de Janeiro",
    "destino_estado": "RJ",
    "data_coleta": "2024-07-10",
    "tipo_carga": "Eletrônicos",
    "peso_kg": 500,
    "valor_frete": 1500,
    "tipo_veiculo": "Truck"
  }'
```

## ⚡ Performance

- Pool de conexões MySQL para reutilização
- Índices nas colunas mais consultadas
- Paginação automática em listagens
- Validação e sanitização de entrada

---

**Status:** ✅ Backend completo e pronto para uso

**Versão:** 1.0.0

**Criado:** Junho 2024
