# 🚀 Conectar ao GitHub - FreteBR Backend

## ✅ Git já foi inicializado localmente!

```
✓ Repositório Git criado
✓ 23 arquivos committed
✓ Pronto para conectar ao GitHub
```

---

## 📋 Passo a Passo para Conectar ao GitHub

### 1️⃣ Crie um repositório no GitHub

1. Acesse **https://github.com/new**
2. Nome: `frete-amigo-backend`
3. Descrição: `Backend Node.js + Express + MySQL para plataforma FreteBR`
4. Escolha **Private** ou **Public**
5. **NÃO** inicialize com README, .gitignore ou license
6. Clique em **Create repository**

### 2️⃣ Conecte o repositório local ao GitHub

Copie e execute EXATAMENTE UM dos comandos abaixo:

#### **OPÇÃO A: Via HTTPS (mais fácil)**
```bash
git remote add origin https://github.com/SEU_USUARIO/frete-amigo-backend.git
git branch -M main
git push -u origin main
```

#### **OPÇÃO B: Via SSH (mais seguro)**
```bash
git remote add origin git@github.com:SEU_USUARIO/frete-amigo-backend.git
git branch -M main
git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu username no GitHub!**

---

## 🔑 Autenticação GitHub

### Se usar HTTPS (Opção A):
1. GitHub pedirá seu usuário/senha
2. Você pode usar **Personal Access Token** ao invés de senha:
   - Acesse: https://github.com/settings/tokens
   - Crie um novo token com permissões: `repo`
   - Cole o token no lugar da senha

### Se usar SSH (Opção B):
1. Você precisa de chave SSH configurada
2. Se não tiver, execute:
```bash
ssh-keygen -t rsa -b 4096 -C "seu_email@example.com"
cat ~/.ssh/id_rsa.pub
```
3. Adicione a chave pública em: https://github.com/settings/keys

---

## ✅ Verificar Conexão

Após executar o comando de push, verifique:

```bash
# Verificar remotes
git remote -v

# Deve mostrar:
# origin  https://github.com/SEU_USUARIO/frete-amigo-backend.git (fetch)
# origin  https://github.com/SEU_USUARIO/frete-amigo-backend.git (push)
```

---

## 📤 Enviar para GitHub

### Primeira vez (já feita acima):
```bash
git push -u origin main
```

### Próximas vezes:
```bash
git push
```

---

## 🔄 Workflow Git Diário

### Ver status
```bash
git status
```

### Adicionar arquivos alterados
```bash
git add .
```

### Fazer commit
```bash
git commit -m "Descrição clara da mudança"
```

### Enviar para GitHub
```bash
git push
```

### Ver histórico
```bash
git log --oneline
```

---

## 📝 Boas Práticas de Commit

### ✅ Bons exemplos:
```
git commit -m "Add JWT authentication endpoints"
git commit -m "Fix MySQL connection pool issue"
git commit -m "Add API documentation for cargas endpoint"
git commit -m "Implement user profile update endpoint"
```

### ❌ Evitar:
```
git commit -m "fix"
git commit -m "updates"
git commit -m "stuff"
```

---

## 🔀 Branches

### Criar nova branch para feature:
```bash
git checkout -b feature/minha-feature
```

### Fazer commits na branch:
```bash
git add .
git commit -m "Implement minha-feature"
```

### Enviar para GitHub:
```bash
git push -u origin feature/minha-feature
```

### Depois fazer Pull Request no GitHub:
1. Acesse o repositório no GitHub
2. Clique em "Pull requests"
3. "New pull request"
4. Selecione `main` e sua branch
5. Crie o PR

---

## 🚫 O que NÃO versionar

Seu `.gitignore` já está configurado para:
```
node_modules/      ← Nunca commitar!
.env               ← Nunca commitar!
.DS_Store
*.log
```

**IMPORTANTE:** Nunca faça commit de:
- `.env` com senhas/chaves reais
- `node_modules/` (npm install recreates)
- Arquivos de log

---

## 📚 Recursos Úteis

### Aprender Git:
- https://git-scm.com/book/pt-BR/v2
- https://github.com/git-tips/tips

### GitHub:
- https://docs.github.com
- https://github.skills

### Cheat Sheet:
```bash
git init                    # Inicializar repo
git clone <url>             # Clonar repo
git add .                   # Adicionar tudo
git commit -m "msg"         # Fazer commit
git push                    # Enviar
git pull                    # Baixar atualizações
git status                  # Ver status
git log                     # Ver histórico
```

---

## ⚠️ Se der erro ao fazer push

### "fatal: remote origin already exists"
```bash
git remote remove origin
# Depois execute novamente o comando git remote add
```

### "permission denied"
Verifique chave SSH ou token de acesso

### "Authentication failed"
- Se HTTPS: use Personal Access Token
- Se SSH: configure chave SSH

---

## 🎯 Próximos Passos

1. ✅ Git inicializado localmente
2. 📋 Crie repositório no GitHub
3. 🔗 Execute comando `git push` acima
4. ✅ Acesse seu repositório em https://github.com/seu_usuario/frete-amigo-backend

---

## 📊 Informações do Repositório

```
Nome: frete-amigo-backend
Tipo: Backend Node.js
Stack: Express + MySQL + JWT
Arquivos: 23
Commits: 1 (inicial)
Linhas de código: ~1200+
Dependências: 8 principais
```

---

**Dúvidas?** Consulte a documentação do Git e GitHub nos links acima! 🚀
