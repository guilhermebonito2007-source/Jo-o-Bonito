# 🔐 API REFERENCE - SEGURA E COMPLETA

**Versão**: 2.0 (Com Autenticação)  
**Base URL**: `https://seu-dominio.com/api`  
**Autenticação**: JWT Bearer Token  

---

## 📋 Índice

1. [Autenticação](#autenticação)
2. [Headers Obrigatórios](#headers)
3. [Produtos](#produtos)
4. [Carrinho](#carrinho)
5. [Pedidos](#pedidos)
6. [Utilizadores](#utilizadores)
7. [Admin - CRUD](#admin)
8. [Erros](#erros)

---

## 🔑 Autenticação {#autenticação}

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@loja.pt",
  "password": "Admin@123"
}
```

**Resposta Sucesso (200)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@loja.pt",
    "role": "admin",
    "name": "Admin Test"
  }
}
```

**Resposta Erro (401)**:
```json
{
  "error": "Email ou senha inválidos"
}
```

**Rate Limiting**: 5 tentativas por 15 minutos

---

### Logout
```http
POST /auth/logout
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Verificar Token
```http
GET /auth/verify
Authorization: Bearer YOUR_JWT_TOKEN
```

**Resposta Sucesso (200)**:
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "admin@loja.pt",
    "role": "admin",
    "name": "Admin Test"
  }
}
```

---

### Renovar Token
```http
POST /auth/refresh
Authorization: Bearer YOUR_JWT_TOKEN
```

**Resposta Sucesso (200)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Mudar Palavra-passe
```http
POST /auth/change-password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentPassword": "Admin@123",
  "newPassword": "NovaPassword@2024"
}
```

**Requisitos de Password**:
- Mínimo 8 caracteres
- Pelo menos 1 maiúscula
- Pelo menos 1 número
- Máximo 128 caracteres

---

## 📝 Headers Obrigatórios {#headers}

### Para Requisições Autenticadas
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Headers de Segurança (Adicionados Automaticamente)
- `Strict-Transport-Security`: max-age=31536000
- `X-Content-Type-Options`: nosniff
- `X-Frame-Options`: DENY
- `X-XSS-Protection`: 1; mode=block
- `Referrer-Policy`: strict-origin-when-cross-origin

---

## 📦 Produtos {#produtos}

### Listar Produtos
```http
GET /products
```

**Query Parameters**:
- `category_id` (opcional): Filtrar por categoria
- `limit` (opcional): Máximo 100, padrão 50
- `offset` (opcional): Para paginação

**Resposta (200)**:
```json
[
  {
    "id": 1,
    "name": "Detergente Neutro",
    "price": 3.50,
    "stock": 100,
    "category_id": 1,
    "description": "Detergente neutro com fórmula concentrada"
  }
]
```

---

### Obter Produto Específico
```http
GET /products/:id
```

---

### Criar Produto (Admin)
```http
POST /products
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Novo Produto",
  "price": 19.99,
  "stock": 50,
  "category_id": 1,
  "description": "Descrição do produto",
  "sku": "PROD-001",
  "image_url": "https://example.com/image.jpg"
}
```

**Validações**:
- Nome: obrigatório, max 255 caracteres
- Preço: >= 0, <= 999.999,99
- Stock: >= 0
- Categoria: obrigatória, deve existir

**Resposta Sucesso (201)**:
```json
{
  "id": 100,
  "message": "Produto criado com sucesso"
}
```

---

### Editar Produto (Admin)
```http
PUT /products/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Nome Atualizado",
  "price": 24.99,
  "stock": 75
}
```

---

### Eliminar Produto (Admin)
```http
DELETE /products/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

**Resposta (200)**:
```json
{
  "message": "Produto eliminado com sucesso"
}
```

---

## 🛒 Carrinho {#carrinho}

### Adicionar ao Carrinho
```http
POST /cart/add
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

---

### Ver Carrinho
```http
GET /cart
```

---

### Atualizar Quantidade
```http
PUT /cart/item/:product_id
Content-Type: application/json

{
  "quantity": 5
}
```

---

### Remover do Carrinho
```http
DELETE /cart/item/:product_id
```

---

## 📋 Pedidos {#pedidos}

### Criar Pedido
```http
POST /orders
Authorization: Bearer YOUR_JWT_TOKEN (Opcional para guest)
Content-Type: application/json

{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "shipping_address": "Rua da Loja, 123",
  "payment_method": "mbway"
}
```

---

### Obter Pedidos do Utilizador
```http
GET /orders
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Obter Pedido Específico
```http
GET /orders/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 👤 Utilizadores {#utilizadores}

### Registar Novo Utilizador
```http
POST /users/register
Content-Type: application/json

{
  "email": "novo@exemplo.com",
  "password": "Senha@2024",
  "first_name": "João",
  "last_name": "Silva"
}
```

---

### Obter Perfil
```http
GET /users/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Atualizar Perfil
```http
PUT /users/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "first_name": "João",
  "last_name": "Silva",
  "phone": "910000000"
}
```

---

## ⚙️ Admin - CRUD {#admin}

### Dashboard
```http
GET /admin/dashboard
Authorization: Bearer YOUR_JWT_TOKEN
```

**Resposta**:
```json
{
  "totalUsers": 150,
  "totalOrders": 432,
  "totalRevenue": 5240.50,
  "pendingOrders": 12,
  "totalProducts": 35,
  "lowStockProducts": 3
}
```

---

### Gerenciar Categorias
```http
GET /management/categories
POST /management/categories
PUT /management/categories/:id
DELETE /management/categories/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Gerenciar Cupões
```http
GET /management/coupons
POST /management/coupons
PUT /management/coupons/:id
DELETE /management/coupons/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Gerenciar Utilizadores
```http
GET /management/users
PUT /management/users/:id
DELETE /management/users/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Gerenciar Contactos
```http
GET /management/contacts
POST /management/contacts
PUT /management/contacts/:id
DELETE /management/contacts/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## ❌ Erros {#erros}

### Códigos de Erro Comuns

| Código | Mensagem | Solução |
|--------|----------|---------|
| 400 | Pedido inválido | Verificar parâmetros enviados |
| 401 | Não autenticado | Fazer login e fornecer JWT token |
| 403 | Acesso negado | Utilizador sem permissões |
| 404 | Recurso não encontrado | Verificar ID do recurso |
| 409 | Conflito | Recurso já existe |
| 429 | Muitas requisições | Aguardar antes de reenviar |
| 500 | Erro interno | Contactar suporte |

---

### Exemplo de Resposta de Erro
```json
{
  "error": "Email ou senha inválidos",
  "status": 401,
  "timestamp": "2024-06-12T10:30:00Z"
}
```

---

## 🔒 Boas Práticas de Segurança

1. **Nunca compartilhe seu JWT token**
2. **Use HTTPS apenas** (nunca HTTP em produção)
3. **Guarde o token com segurança** (localStorage ou sessionStorage)
4. **Renovar token regularmente** (`POST /auth/refresh`)
5. **Logout ao trocar dispositivo ou browser**
6. **Não envie dados sensíveis em URLs** (use POST body)
7. **Validar entrada do utilizador** no frontend
8. **CORS** apenas permite origens autorizadas

---

**Última Atualização**: Junho 2026
