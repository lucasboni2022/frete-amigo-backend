# Guia de Inicialização - FreteBR Backend

## Pré-requisitos

- Node.js 16+ instalado
- MySQL 8+ instalado e rodando
- npm ou yarn como gerenciador de pacotes

## Passo 1: Clonar o repositório

```bash
cd c:\des\frete-amigo-backend
```

## Passo 2: Instalar dependências

```bash
npm install
```

## Passo 3: Configurar banco de dados MySQL

### Opção A: Criação automática (recomendado)

O servidor cria automaticamente o banco e tabelas na primeira execução.

Certifique-se que o MySQL está rodando e edite o `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=frete_amigo
```

### Opção B: Criação manual

1. Abra o MySQL Workbench ou CLI
2. Execute o arquivo `Script/schema.sql`:

```bash
mysql -u root -p < Script/schema.sql
```

## Passo 4: Configurar variáveis de ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=frete_amigo

# JWT - MUDE ISTO EM PRODUÇÃO!
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_mude_em_producao
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

## Passo 5: Iniciar o servidor

### Desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Produção

```bash
npm start
```

Você deve ver:

```
✅ Conexão com banco de dados estabelecida
✅ Banco de dados inicializado com sucesso!
🚀 Servidor rodando em http://localhost:3000
📝 API disponível em http://localhost:3000/api
```

## Testar a API

### Health Check

```bash
curl http://localhost:3000/api/health
```

Resposta esperada:
```json
{"status":"OK","message":"Backend está funcionando"}
```

### Registrar novo usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "senha": "senha123",
    "nome_completo": "Teste User",
    "telefone": "11999999999",
    "tipo_perfil": "embarcador"
  }'
```

### Fazer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "senha": "senha123"
  }'
```

## Troubleshooting

### Erro: "ECONNREFUSED" ou "connect ECONNREFUSED"

O MySQL não está rodando. Inicie o MySQL:

**Windows:**
```bash
net start MySQL80
```

**Mac:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

### Erro: "Access denied for user 'root'"

Verifique as credenciais no `.env`. A senha deve estar correta.

### Erro: "Unknown database 'frete_amigo'"

Execute o `Script/schema.sql` manualmente ou deixe a inicialização automática rodar.

### Porta 3000 já está em uso

Mude a porta no `.env`:

```env
PORT=3001
```

## Estrutura de Diretórios

```
frete-amigo-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração MySQL
│   ├── db/
│   │   └── initDb.js            # Inicialização do banco
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticação
│   │   └── cargasController.js  # Lógica de cargas
│   ├── routes/
│   │   ├── authRoutes.js        # Rotas de autenticação
│   │   └── cargasRoutes.js      # Rotas de cargas
│   ├── middleware/
│   │   └── auth.js              # Middleware JWT
│   └── utils/
│       └── validators.js        # Funções de validação
├── Script/
│   ├── DDL.txt                  # Schema original
│   └── schema.sql               # Schema SQL para inicialização
├── server.js                    # Entrada principal
├── package.json                 # Dependências
├── .env                        # Variáveis de ambiente (não fazer commit)
├── .env.example                # Exemplo de variáveis
├── .gitignore                  # Arquivos ignorados pelo Git
├── README.md                   # Documentação principal
└── API.md                      # Documentação da API
```

## Recursos Adicionais

- [Documentação da API](./API.md) - Endpoints e exemplos de uso
- [README.md](./README.md) - Informações gerais do projeto
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/)
- [JWT.io](https://jwt.io/) - Entenda tokens JWT

## Próximos Passos

1. ✅ Backend Node.js + Express + MySQL criado
2. 📋 Criar Frontend em React/Next.js/Vue (separado)
3. 🔐 Implementar autenticação OAuth (Google, GitHub, etc)
4. 📱 Criar aplicativo mobile (React Native, Flutter)
5. 🚀 Deploy em produção (Heroku, AWS, DigitalOcean, etc)

---

Dúvidas? Consulte a documentação da API em `API.md`
