# 📦 Loja Sende - Backend com Base de Dados

Base de dados completa para o e-commerce Loja Sende usando **Node.js + Express + SQLite**.

## 🚀 Instalação

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Inicializar base de dados

```bash
npm run init-db
```

Isto vai criar o ficheiro `loja_sende.db` na pasta `database/` com todas as tabelas.

### 3. Iniciar o servidor

**Desenvolvimento (com hot reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

O servidor estará disponível em: `http://localhost:3000`

---

## 📊 Estrutura da Base de Dados

### Tabelas principais:

- **categories** - Categorias de produtos
- **products** - Catálogo de produtos
- **users** - Utilizadores/clientes
- **cart_items** - Itens do carrinho
- **orders** - Encomendas
- **order_items** - Itens de cada encomenda
- **payments** - Registos de pagamentos
- **contacts** - Formulário de contacto
- **reviews** - Avaliações de produtos
- **coupon_codes** - Cupões de desconto
- **activity_log** - Histórico de atividades

---

## 🔌 API Endpoints

### Produtos
```
GET  /api/products                    - Listar todos os produtos
GET  /api/products?category=1         - Produtos por categoria
GET  /api/products/:id                - Detalhes do produto
GET  /api/products/categories         - Listar categorias
GET  /api/products/search?q=termo     - Pesquisar produtos
```

### Carrinho
```
GET    /api/cart/:userId              - Obter carrinho
POST   /api/cart                       - Adicionar ao carrinho
PUT    /api/cart/:itemId              - Atualizar quantidade
DELETE /api/cart/:itemId              - Remover do carrinho
DELETE /api/cart/user/:userId         - Limpar carrinho
```

### Encomendas
```
POST   /api/orders                    - Criar encomenda
GET    /api/orders/user/:userId       - Minhas encomendas
GET    /api/orders/:orderId           - Detalhes da encomenda
PUT    /api/orders/:orderId/status    - Atualizar status
PUT    /api/orders/:orderId/cancel    - Cancelar encomenda
```

### Utilizadores
```
POST   /api/users/register            - Registar
POST   /api/users/login               - Login
GET    /api/users/:userId             - Obter perfil
PUT    /api/users/:userId             - Atualizar perfil
```

### Pagamentos
```
POST   /api/payments                  - Registar pagamento
GET    /api/payments/order/:orderId   - Pagamentos da encomenda
PUT    /api/payments/:paymentId/status - Atualizar status
POST   /api/payments/mbway/process    - Processar MBWay
POST   /api/payments/multibanco/generate - Gerar Multibanco
```

---

## 📝 Exemplos de Uso

### Adicionar ao carrinho
```javascript
fetch('http://localhost:3000/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    productId: 5,
    quantity: 2,
    selectedOptions: { aroma: 'Limão' },
    price: 12.99
  })
})
```

### Criar encomenda
```javascript
fetch('http://localhost:3000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    cartItems: [
      { productId: 5, quantity: 2, price: 12.99, selectedOptions: {} }
    ],
    totalPrice: 25.98,
    shippingAddress: { street: 'Rua X', city: 'Olhão', postal: '8700' },
    paymentMethod: 'cartao'
  })
})
```

---

## 🔧 Importar Produtos

Para importar os seus produtos do `cart.js` para a base de dados, crie um script `import-products.js`:

```javascript
const { getAll, runQuery } = require('./database');

// Ler PRODUCT_DETAILS do cart.js
// Mapear para a base de dados com INSERT

// Execute: node import-products.js
```

---

## 🛡️ TODO - Segurança

- [ ] Hash de passwords com bcrypt
- [ ] JWT para autenticação
- [ ] Validação de inputs
- [ ] Rate limiting
- [ ] CORS configurado
- [ ] Variáveis de ambiente

---

## 📱 Integrar no Frontend

No seu `cart.js` ou ficheiro principal:

```javascript
const API_URL = 'http://localhost:3000/api';

// Carregar produtos
fetch(`${API_URL}/products`)
  .then(res => res.json())
  .then(products => console.log(products));

// Adicionar ao carrinho
function addToCart(productId, quantity) {
  fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: currentUserId,
      productId,
      quantity,
      price: productPrice
    })
  });
}
```

---

## 📖 Próximos Passos

1. ✅ Base de dados criada
2. ⬜ Integrar API com frontend
3. ⬜ Hash de passwords
4. ⬜ Autenticação JWT
5. ⬜ Validação de emails
6. ⬜ Upload de imagens de produtos
7. ⬜ Dashboard de administração

---

Desenvolvido para Loja Sende 🏪
