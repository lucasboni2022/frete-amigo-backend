# 🚨 TROUBLESHOOTING - Erro ao Iniciar Server

## ❌ Problema

```
Failed running 'server.js'. Waiting for file changes before restarting...
```

---

## ✅ SOLUÇÕES

### 1️⃣ **Verifique se MySQL está rodando**

#### Windows:
```bash
# Verificar status
sc query MySQL80

# Se não estiver rodando, inicie:
net start MySQL80
```

#### Mac:
```bash
brew services list | grep mysql
brew services start mysql
```

#### Linux:
```bash
sudo systemctl status mysql
sudo systemctl start mysql
```

---

### 2️⃣ **Verifique o arquivo .env**

Arquivo: `c:\des\frete-amigo-backend\.env`

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

**Importe:** 
- `DB_USER` e `DB_PASSWORD` devem bater com seu MySQL
- Se tiver senha no MySQL, adicione em `DB_PASSWORD`

---

### 3️⃣ **Teste a conexão MySQL**

#### Via Command Line:
```bash
# Conectar ao MySQL
mysql -u root -p

# Dentro do MySQL, execute:
SHOW DATABASES;
```

#### Se der erro "Access denied":
- Verifique o password no `.env`
- Se não tiver senha, deixe vazio: `DB_PASSWORD=`

---

### 4️⃣ **Se o banco não existir**

Execute manualmente:
```bash
cd c:\des\frete-amigo-backend
mysql -u root < Script/schema.sql
```

Ou no MySQL Workbench:
1. Abra `Script/schema.sql`
2. Clique em "Execute All"
3. Confirme

---

## 🔧 CONFIGURAÇÃO PASSO A PASSO

### **Se você NÃO tem MySQL instalado:**

1. Baixe: https://dev.mysql.com/downloads/mysql/
2. Instale (Windows installer recomendado)
3. Durante instalação, defina senha para `root` ou deixe em branco
4. Termine a instalação

### **Se MySQL está instalado mas não rodando:**

**Windows:**
```bash
# Verificar
sc query MySQL80

# Iniciar
net start MySQL80

# Parar
net stop MySQL80
```

### **Se as credenciais estão erradas:**

1. Abra `.env`
2. Edite `DB_USER` e `DB_PASSWORD`
3. Salve o arquivo
4. O servidor vai reiniciar automaticamente (modo watch)

---

## 📋 CHECKLIST ANTES DE INICIAR

- [ ] MySQL instalado
- [ ] MySQL rodando (`net start MySQL80`)
- [ ] Arquivo `.env` editado com credenciais corretas
- [ ] Banco de dados criado (`Script/schema.sql`)
- [ ] npm install já foi executado
- [ ] Porta 3000 está disponível

---

## 🚀 DEPOIS QUE TUDO ESTIVER OK

```bash
cd c:\des\frete-amigo-backend
npm run dev
```

Você verá:
```
✅ Conexão com banco de dados estabelecida
✅ Banco de dados inicializado com sucesso!
🚀 Servidor rodando em http://localhost:3000
📝 API disponível em http://localhost:3000/api
```

---

## 🧪 TESTE EM OUTRO TERMINAL

```bash
# Health check
curl http://localhost:3000/api/health

# Resposta esperada:
# {"status":"OK","message":"Backend está funcionando"}
```

---

## 📞 ERRO ESPECÍFICO: keepAliveInitialDelayMs

Este aviso pode ser ignorado (será corrigido em versões futuras do mysql2):

```
Ignoring invalid configuration option passed to Connection: keepAliveInitialDelayMs
```

**Solução (opcional):** Remova de `src/config/database.js`:

Procure por:
```javascript
keepAliveInitialDelayMs: 0,
```

E delete essa linha.

---

## 🎯 COMANDOS ÚTEIS

```bash
# Iniciar em desenvolvimento
npm run dev

# Iniciar em produção
npm start

# Ver logs do npm
npm logs

# Instalar dependências novamente
npm install

# Limpar cache
npm cache clean --force
```

---

## 💡 DICAS

- Use **MySQL Workbench** para gerenciar o banco visualmente
- Veja os logs do `.env` para credenciais corretas
- Deixe o servidor rodando em um terminal separado
- Use outro terminal para testes com curl/Postman

---

**Dúvidas?** Consulte a documentação completa em `STARTUP.md` ou `README.md`
