# 📮 Postman Collection - FreteBR Backend

## 🎯 Configuração para freteamigo.premolexpert.com.br

---

## 📥 IMPORTAR NO POSTMAN

### Opção 1: Importar o arquivo JSON
1. Abra **Postman**
2. Clique em **File** → **Import**
3. Selecione: `FreteBR_Postman_Collection.json`
4. Clique em **Import**
5. ✅ Pronto! Todos os endpoints estarão disponíveis

### Opção 2: Copiar e colar manualmente
Se preferir, crie um novo projeto no Postman e adicione os endpoints abaixo.

---

## 🔐 VARIÁVEIS DE AMBIENTE

Crie 2 variáveis no Postman:

1. **token**
   - Tipo: String
   - Valor: Cole aqui o JWT recebido no login
   - Usado em: Todas as requisições autenticadas

2. **carga_id**
   - Tipo: String
   - Valor: UUID da carga
   - Usado em: Endpoints de carga específica

---

## 🔗 BASE URL

```
https://freteamigo.premolexpert.com.br/api
```

---

## 📋 ENDPOINTS

### 1️⃣ AUTENTICAÇÃO

#### Registrar
```
POST /auth/register

Body (JSON):
{
  "email": "usuario@example.com",
  "senha": "Senha@123",
  "nome_completo": "João Silva",
  "telefone": "11999999999",
  "tipo_perfil": "embarcador"
}

Resposta:
{
  "message": "Usuário registrado com sucesso",
  "token": "eyJhbGc...",
  "user": {...}
}
```

#### Login
```
POST /auth/login

Body (JSON):
{
  "email": "usuario@example.com",
  "senha": "Senha@123"
}

Resposta:
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGc...",
  "user": {...}
}
```

#### Obter Perfil
```
GET /auth/profile

Headers:
Authorization: Bearer {{token}}

Resposta:
{
  "id": "uuid",
  "email": "usuario@example.com",
  "nome_completo": "João Silva",
  "telefone": "11999999999",
  "empresa": null,
  "tipo": "embarcador",
  "cidade": null,
  "estado": null
}
```

#### Atualizar Perfil
```
PUT /auth/profile

Headers:
Authorization: Bearer {{token}}

Body (JSON):
{
  "nome_completo": "João Silva Santos",
  "telefone": "11988888888",
  "empresa": "Silva Transportes",
  "cidade": "São Paulo",
  "estado": "SP"
}

Resposta:
{
  "message": "Perfil atualizado com sucesso"
}
```

---

### 2️⃣ CARGAS

#### Listar Cargas
```
GET /cargas?origem_estado=SP&destino_estado=RJ&tipo_veiculo=Truck&page=1&limit=10

Parâmetros (opcionais):
- origem_estado: Estado de origem (ex: SP)
- destino_estado: Estado de destino (ex: RJ)
- tipo_veiculo: Tipo de veículo (ex: Truck)
- status: Status (ativa, negociando, fechada, cancelada)
- page: Número da página (padrão: 1)
- limit: Itens por página (padrão: 10)

Resposta:
{
  "cargas": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "origem_cidade": "São Paulo",
      "origem_estado": "SP",
      "destino_cidade": "Rio de Janeiro",
      "destino_estado": "RJ",
      "data_coleta": "2024-07-20",
      "tipo_carga": "Eletrônicos",
      "peso_kg": 500,
      "valor_frete": 1500,
      "tipo_veiculo": "Truck",
      "tipo_carroceria": "Baú",
      "observacoes": "Carga frágil",
      "status": "ativa",
      "created_at": "2024-06-12T10:30:00.000Z",
      "updated_at": "2024-06-12T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

#### Obter Carga por ID
```
GET /cargas/{{carga_id}}

Resposta:
{
  "id": "uuid",
  "user_id": "uuid",
  "origem_cidade": "São Paulo",
  "origem_estado": "SP",
  "destino_cidade": "Rio de Janeiro",
  "destino_estado": "RJ",
  "data_coleta": "2024-07-20",
  "tipo_carga": "Eletrônicos",
  "peso_kg": 500,
  "valor_frete": 1500,
  "tipo_veiculo": "Truck",
  "tipo_carroceria": "Baú",
  "observacoes": "Carga frágil",
  "status": "ativa",
  "created_at": "2024-06-12T10:30:00.000Z",
  "updated_at": "2024-06-12T10:30:00.000Z",
  "user_name": "João Silva",
  "email": "usuario@example.com",
  "telefone": "11999999999"
}
```

#### Criar Carga
```
POST /cargas

Headers:
Authorization: Bearer {{token}}

Body (JSON):
{
  "origem_cidade": "São Paulo",
  "origem_estado": "SP",
  "destino_cidade": "Rio de Janeiro",
  "destino_estado": "RJ",
  "data_coleta": "2024-07-20",
  "tipo_carga": "Eletrônicos",
  "peso_kg": 500,
  "valor_frete": 1500,
  "tipo_veiculo": "Truck",
  "tipo_carroceria": "Baú",
  "observacoes": "Carga frágil - cuidado ao manusear"
}

Resposta:
{
  "message": "Carga criada com sucesso",
  "carga": {
    "id": "uuid",
    "user_id": "uuid",
    "origem_cidade": "São Paulo",
    "origem_estado": "SP",
    "destino_cidade": "Rio de Janeiro",
    "destino_estado": "RJ",
    "data_coleta": "2024-07-20",
    "tipo_carga": "Eletrônicos",
    "peso_kg": 500,
    "tipo_veiculo": "Truck",
    "status": "ativa"
  }
}
```

#### Atualizar Carga
```
PUT /cargas/{{carga_id}}

Headers:
Authorization: Bearer {{token}}

Body (JSON):
{
  "valor_frete": 1800,
  "status": "negociando",
  "tipo_carroceria": "Graneleira",
  "observacoes": "Valor negociado"
}

Resposta:
{
  "message": "Carga atualizada com sucesso"
}
```

#### Deletar Carga
```
DELETE /cargas/{{carga_id}}

Headers:
Authorization: Bearer {{token}}

Resposta:
{
  "message": "Carga deletada com sucesso"
}
```

#### Minhas Cargas
```
GET /cargas/my-cargas/list?status=ativa&page=1&limit=10

Headers:
Authorization: Bearer {{token}}

Parâmetros (opcionais):
- status: Filtrar por status (ativa, negociando, fechada, cancelada)
- page: Número da página (padrão: 1)
- limit: Itens por página (padrão: 10)

Resposta:
{
  "cargas": [...],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### 3️⃣ HEALTH CHECK

#### Status do Servidor
```
GET /health

Resposta:
{
  "status": "OK",
  "message": "Backend está funcionando"
}
```

---

## 📱 FLUXO DE USO

### 1️⃣ Registrar novo usuário
```
POST /auth/register
```

### 2️⃣ Fazer login
```
POST /auth/login
→ Copie o "token" da resposta
```

### 3️⃣ Salvar token
```
1. Cole o token na variável {{token}} do Postman
2. Agora pode usar endpoints protegidos
```

### 4️⃣ Criar carga
```
POST /cargas
Headers: Authorization: Bearer {{token}}
```

### 5️⃣ Listar cargas
```
GET /cargas
```

### 6️⃣ Atualizar carga
```
PUT /cargas/{{carga_id}}
Headers: Authorization: Bearer {{token}}
```

---

## 🆘 DICAS

### Para copiar o token do Postman:
1. Faça login (POST /auth/login)
2. Na aba "Response", copie o valor de "token"
3. Vá para "Environment" → Edite a variável "{{token}}"
4. Cole o token e salve

### Para copiar ID da carga:
1. Crie ou liste cargas (POST/GET /cargas)
2. Copie o "id" da resposta
3. Cole em "{{carga_id}}" quando usar /cargas/{id}

### Status HTTP esperados:
- `200 OK` - Sucesso
- `201 Created` - Criado com sucesso
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Token ausente/inválido
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `500 Server Error` - Erro no servidor

---

## 📊 TIPOS DE VEÍCULOS

- Truck
- Carreta
- Bitrem
- Rodotrem
- VUC
- Van
- Furgão

---

## 📄 TIPOS DE CARROCERIA

- Baú
- Graneleira
- Refrigerada
- Porta-carros
- Tanque
- Aberta
- Plataforma

---

## 🔄 STATUS DE CARGA

- `ativa` - Carga ativa esperando proposta
- `negociando` - Em negociação
- `fechada` - Negócio fechado
- `cancelada` - Carga cancelada

---

## 🚀 DEPLOY

**Base URL em Produção:**
```
https://freteamigo.premolexpert.com.br/api
```

---

## 📞 SUPORTE

Todos os endpoints estão documentados em:
- `API.md` - Documentação técnica completa
- `README.md` - Guia geral do projeto

---

**Pronto para testar! 🎉**
