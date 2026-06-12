# FreteBR Backend

Backend Node.js + Express + MySQL para a plataforma FreteBR.

## Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do MySQL.

## Execução

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

## Estrutura do Projeto

```
src/
├── config/
│   └── database.js          # Configuração MySQL
├── db/
│   └── initDb.js            # Script de inicialização do banco
├── controllers/
│   ├── authController.js    # Lógica de autenticação
│   └── cargasController.js  # Lógica de cargas
├── routes/
│   ├── authRoutes.js        # Rotas de autenticação
│   └── cargasRoutes.js      # Rotas de cargas
├── middleware/
│   └── auth.js              # Middleware JWT
└── utils/
    └── validators.js        # Validadores
```

## API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil do usuário (autenticado)
- `PUT /api/auth/profile` - Atualizar perfil (autenticado)

### Cargas

- `GET /api/cargas` - Listar todas as cargas (com filtros)
- `GET /api/cargas/:id` - Obter carga por ID
- `POST /api/cargas` - Criar nova carga (autenticado)
- `PUT /api/cargas/:id` - Atualizar carga (autenticado)
- `DELETE /api/cargas/:id` - Deletar carga (autenticado)
- `GET /api/cargas/my-cargas/list` - Listar minhas cargas (autenticado)

## Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

Ao fazer login ou registrar, você recebe um token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer seu_token_aqui
```

## Variáveis de Ambiente

```
DB_HOST=localhost           # Host do MySQL
DB_PORT=3306               # Porta do MySQL
DB_USER=root               # Usuário MySQL
DB_PASSWORD=               # Senha MySQL
DB_NAME=frete_amigo        # Nome do banco
JWT_SECRET=sua_chave_secreta_aqui  # Chave secreta JWT
JWT_EXPIRES_IN=7d          # Tempo de expiração do token
PORT=3000                  # Porta do servidor
NODE_ENV=development       # Ambiente (development/production)
```

## Banco de Dados

O banco de dados é criado automaticamente na primeira execução com as seguintes tabelas:

- **users** - Usuários da plataforma
- **profiles** - Perfis detalhados dos usuários
- **user_roles** - Papéis/roles dos usuários
- **cargas** - Cargas publicadas

## Exemplo de Uso

### 1. Registrar novo usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "senha": "senha123",
    "nome_completo": "Seu Nome",
    "telefone": "11999999999",
    "tipo_perfil": "embarcador"
  }'
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "senha": "senha123"
  }'
```

### 3. Criar nova carga

```bash
curl -X POST http://localhost:3000/api/cargas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_jwt" \
  -d '{
    "origem_cidade": "São Paulo",
    "origem_estado": "SP",
    "destino_cidade": "Rio de Janeiro",
    "destino_estado": "RJ",
    "data_coleta": "2024-07-01",
    "tipo_carga": "Eletrônicos",
    "peso_kg": 500,
    "valor_frete": 1500,
    "tipo_veiculo": "Truck",
    "tipo_carroceria": "Baú"
  }'
```

### 4. Listar cargas com filtros

```bash
curl "http://localhost:3000/api/cargas?origem_estado=SP&destino_estado=RJ&tipo_veiculo=Truck"
```

## Licença

MIT
