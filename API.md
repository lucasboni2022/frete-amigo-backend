# API Documentation - FreteBR Backend

## Base URL

```
http://localhost:3000/api
```

## Authentication

A API usa Bearer Token (JWT) para autenticação. Obtenha o token fazendo login ou registrando.

### Header obrigatório para rotas protegidas:

```
Authorization: Bearer <seu_token_jwt>
```

---

## Autenticação (Auth)

### 1. Registrar novo usuário

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "email": "usuario@example.com",
  "senha": "senha123",
  "nome_completo": "João Silva",
  "telefone": "11999999999",
  "tipo_perfil": "embarcador"
}
```

**Resposta (201):**
```json
{
  "message": "Usuário registrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "nome_completo": "João Silva",
    "tipo": "embarcador"
  }
}
```

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "usuario@example.com",
  "senha": "senha123"
}
```

**Resposta (200):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "nome_completo": "João Silva"
  }
}
```

---

### 3. Obter Perfil

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "nome_completo": "João Silva",
  "telefone": "11999999999",
  "created_at": "2024-06-12T10:30:00.000Z",
  "empresa": null,
  "tipo": "embarcador",
  "cidade": null,
  "estado": null
}
```

---

### 4. Atualizar Perfil

**Endpoint:** `PUT /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nome_completo": "João Silva Santos",
  "telefone": "11988888888",
  "empresa": "Silva Transportes",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

**Resposta (200):**
```json
{
  "message": "Perfil atualizado com sucesso"
}
```

---

## Cargas

### 1. Criar Carga

**Endpoint:** `POST /cargas`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "origem_cidade": "São Paulo",
  "origem_estado": "SP",
  "destino_cidade": "Rio de Janeiro",
  "destino_estado": "RJ",
  "data_coleta": "2024-07-10",
  "tipo_carga": "Eletrônicos",
  "peso_kg": 500,
  "valor_frete": 1500,
  "tipo_veiculo": "Truck",
  "tipo_carroceria": "Baú",
  "observacoes": "Carga frágil - cuidado ao manusear"
}
```

**Resposta (201):**
```json
{
  "message": "Carga criada com sucesso",
  "carga": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "origem_cidade": "São Paulo",
    "origem_estado": "SP",
    "destino_cidade": "Rio de Janeiro",
    "destino_estado": "RJ",
    "data_coleta": "2024-07-10",
    "tipo_carga": "Eletrônicos",
    "peso_kg": 500,
    "tipo_veiculo": "Truck",
    "status": "ativa"
  }
}
```

---

### 2. Listar Cargas (com filtros)

**Endpoint:** `GET /cargas`

**Query Parameters:**
- `origem_estado`: Estado de origem (ex: SP)
- `destino_estado`: Estado de destino (ex: RJ)
- `tipo_veiculo`: Tipo de veículo (ex: Truck)
- `status`: Status da carga (ativa, negociando, fechada, cancelada)
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)

**Exemplo:**
```
GET /cargas?origem_estado=SP&destino_estado=RJ&tipo_veiculo=Truck&page=1&limit=20
```

**Resposta (200):**
```json
{
  "cargas": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "origem_cidade": "São Paulo",
      "origem_estado": "SP",
      "destino_cidade": "Rio de Janeiro",
      "destino_estado": "RJ",
      "data_coleta": "2024-07-10",
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
    "limit": 20,
    "pages": 3
  }
}
```

---

### 3. Obter Carga por ID

**Endpoint:** `GET /cargas/:id`

**Resposta (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "origem_cidade": "São Paulo",
  "origem_estado": "SP",
  "destino_cidade": "Rio de Janeiro",
  "destino_estado": "RJ",
  "data_coleta": "2024-07-10",
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

---

### 4. Atualizar Carga

**Endpoint:** `PUT /cargas/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "valor_frete": 1800,
  "status": "negociando",
  "tipo_carroceria": "Graneleira",
  "observacoes": "Atualizado - novo valor"
}
```

**Resposta (200):**
```json
{
  "message": "Carga atualizada com sucesso"
}
```

---

### 5. Deletar Carga

**Endpoint:** `DELETE /cargas/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "message": "Carga deletada com sucesso"
}
```

---

### 6. Listar Minhas Cargas

**Endpoint:** `GET /cargas/my-cargas/list`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: Filtrar por status (opcional)
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)

**Resposta (200):**
```json
{
  "cargas": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "origem_cidade": "São Paulo",
      "origem_estado": "SP",
      "destino_cidade": "Rio de Janeiro",
      "destino_estado": "RJ",
      "data_coleta": "2024-07-10",
      "tipo_carga": "Eletrônicos",
      "peso_kg": 500,
      "valor_frete": 1500,
      "tipo_veiculo": "Truck",
      "tipo_carroceria": "Baú",
      "status": "ativa",
      "created_at": "2024-06-12T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

## Status HTTP

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos ou campos obrigatórios faltando
- `401 Unauthorized`: Token ausente, inválido ou expirado
- `403 Forbidden`: Sem permissão para acessar o recurso
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro no servidor

---

## Tipos de Veículos

- Truck
- Carreta
- Bitrem
- Rodotrem
- VUC
- Van
- Furgão

## Tipos de Carroceria

- Baú
- Graneleira
- Refrigerada
- Porta-carros
- Tanque
- Aberta
- Plataforma
