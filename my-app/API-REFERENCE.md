# 🔌 Referência Rápida de API

## 📌 Base URL
```
http://localhost:3000/api
```

## 🔐 Autenticação de Admin

Todos os endpoints de admin requerem o header:
```
x-user-id: <id-do-admin>
```

Exemplo com curl:
```bash
curl -H "x-user-id: 1" http://localhost:3000/api/admin/dashboard
```

## 👤 Endpoints de Utilizador

### Login
```
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}

Resposta (200):
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "João",
    "lastName": "Silva",
    "role": "customer"
  }
}
```

### Registar
```
POST /users/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "senha123",
  "firstName": "João",
  "lastName": "Silva",
  "phone": "912345678"
}

Resposta (200):
{
  "success": true,
  "userId": 1,
  "message": "Utilizador registado com sucesso"
}
```

### Obter Perfil
```
GET /users/{userId}

Resposta (200):
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "João",
  "last_name": "Silva",
  "phone": "912345678",
  "address": "Rua X, 123",
  "city": "Olhão",
  "postal_code": "8700-173",
  "country": "Portugal",
  "role": "customer",
  "created_at": "2026-06-11T10:30:00Z"
}
```

### Atualizar Perfil
```
PUT /users/{userId}
Content-Type: application/json

{
  "firstName": "João",
  "lastName": "Silva",
  "phone": "912345678",
  "address": "Rua Y, 456",
  "city": "Olhão",
  "postalCode": "8700-173"
}

Resposta (200):
{
  "success": true,
  "message": "Perfil atualizado"
}
```

## 📦 Endpoints de Encomendas

### Obter Encomendas do Utilizador
```
GET /orders/user/{userId}

Resposta (200):
[
  {
    "id": 1,
    "order_number": "ORD-1234567890-ABC",
    "user_id": 1,
    "total_price": 50.00,
    "status": "enviada",
    "payment_method": "cartao",
    "payment_status": "pago",
    "created_at": "2026-06-10T15:30:00Z",
    "updated_at": "2026-06-11T10:00:00Z"
  }
]
```

### Criar Encomenda
```
POST /orders
Content-Type: application/json

{
  "userId": 1,
  "cartItems": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 25.00,
      "selectedOptions": {}
    }
  ],
  "totalPrice": 50.00,
  "shippingAddress": "Rua X, 123",
  "paymentMethod": "cartao",
  "notes": "Entrega após 18h"
}

Resposta (200):
{
  "success": true,
  "orderId": 1,
  "orderNumber": "ORD-1234567890-ABC",
  "message": "Encomenda criada com sucesso"
}
```

### Obter Detalhes da Encomenda
```
GET /orders/{orderId}

Resposta (200):
{
  "id": 1,
  "order_number": "ORD-1234567890-ABC",
  "user_id": 1,
  "total_price": 50.00,
  "status": "enviada",
  "payment_method": "cartao",
  "payment_status": "pago",
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "name": "Produto X",
      "quantity": 2,
      "price": 25.00,
      "image_url": "..."
    }
  ]
}
```

## 🛡️ Endpoints de Admin

### Dashboard
```
GET /admin/dashboard
Headers: x-user-id: 1

Resposta (200):
{
  "totalUsers": 45,
  "totalOrders": 120,
  "totalRevenue": 5500.00,
  "pendingOrders": 5,
  "totalProducts": 200,
  "lowStockProducts": 12
}
```

### Listar Encomendas (Admin)
```
GET /admin/orders
Headers: x-user-id: 1

Resposta (200):
[
  {
    "id": 1,
    "order_number": "ORD-1234567890-ABC",
    "email": "customer@example.com",
    "first_name": "João",
    "last_name": "Silva",
    "total_price": 50.00,
    "status": "enviada",
    "payment_status": "pago",
    "created_at": "2026-06-10T15:30:00Z"
  }
]
```

### Ver Detalhes da Encomenda (Admin)
```
GET /admin/orders/{orderId}
Headers: x-user-id: 1

Resposta (200): Mesma estrutura acima com todos os detalhes
```

### Atualizar Status de Encomenda (Admin)
```
PUT /admin/orders/{orderId}/status
Headers: x-user-id: 1
Content-Type: application/json

{
  "status": "processada"
}

Status válidos: pendente, processada, enviada, entregue, cancelada

Resposta (200):
{
  "success": true,
  "message": "Status atualizado"
}
```

### Listar Utilizadores (Admin)
```
GET /admin/users
Headers: x-user-id: 1

Resposta (200):
[
  {
    "id": 1,
    "email": "user@example.com",
    "first_name": "João",
    "last_name": "Silva",
    "phone": "912345678",
    "city": "Olhão",
    "created_at": "2026-06-10T10:00:00Z"
  }
]
```

### Listar Pagamentos (Admin)
```
GET /admin/payments
Headers: x-user-id: 1

Resposta (200):
[
  {
    "id": 1,
    "order_id": 1,
    "order_number": "ORD-1234567890-ABC",
    "amount": 50.00,
    "method": "cartao",
    "status": "confirmado",
    "reference": null,
    "transaction_id": "TXN-123456",
    "created_at": "2026-06-10T15:30:00Z"
  }
]
```

### Relatório de Vendas (Admin)
```
GET /admin/reports/sales?startDate=2026-06-01&endDate=2026-06-30
Headers: x-user-id: 1

Resposta (200):
{
  "period": {
    "startDate": "2026-06-01",
    "endDate": "2026-06-30"
  },
  "sales": [
    {
      "date": "2026-06-11",
      "orders": 5,
      "revenue": 250.00
    }
  ],
  "summary": {
    "count": 120,
    "total": 5500.00
  }
}
```

### Top Produtos (Admin)
```
GET /admin/reports/top-products?limit=10
Headers: x-user-id: 1

Resposta (200):
[
  {
    "id": 1,
    "name": "Produto X",
    "sku": "PROD-001",
    "price": 25.00,
    "sold_count": 50,
    "total_quantity": 75
  }
]
```

### Histórico de Atividades (Admin)
```
GET /admin/activity-log?limit=100
Headers: x-user-id: 1

Resposta (200):
[
  {
    "id": 1,
    "user_id": 1,
    "action": "login",
    "description": "Utilizador fez login",
    "email": "admin@loja.pt",
    "first_name": "Admin",
    "last_name": "Loja",
    "created_at": "2026-06-11T10:30:00Z"
  }
]
```

### Listar Contactos (Admin)
```
GET /admin/contacts
Headers: x-user-id: 1

Resposta (200):
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "912345678",
    "message": "Gostaria de saber mais sobre...",
    "subject": "Dúvida sobre produto",
    "status": "nao_lido",
    "created_at": "2026-06-11T10:00:00Z"
  }
]
```

### Marcar Contacto como Lido (Admin)
```
PUT /admin/contacts/{contactId}
Headers: x-user-id: 1
Content-Type: application/json

{
  "status": "lido"
}

Status válidos: nao_lido, lido, respondido

Resposta (200):
{
  "success": true,
  "message": "Contacto atualizado"
}
```

## 🔍 Códigos de Resposta

```
200 OK                  - Sucesso
400 Bad Request         - Dados inválidos
401 Unauthorized        - Não autenticado
403 Forbidden           - Sem permissão (não é admin)
404 Not Found           - Recurso não existe
500 Internal Error      - Erro no servidor
```

## 📨 Exemplos com JavaScript

### Login
```javascript
const response = await fetch('http://localhost:3000/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'admin@loja.pt', 
    password: 'Admin@123' 
  })
});

const data = await response.json();
console.log(data.user);
```

### Dashboard Admin
```javascript
const response = await fetch('http://localhost:3000/api/admin/dashboard', {
  headers: { 'x-user-id': '1' }
});

const data = await response.json();
console.log(data.totalOrders);
```

---

**Última atualização:** Junho 2026
