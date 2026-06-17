# 🚀 GUIA RÁPIDO - Setup da Base de Dados

## 1️⃣ Instalar Node.js (se ainda não tiver)

Baixe em: https://nodejs.org/

## 2️⃣ Abrir Terminal

Abra o terminal em: `my-app/backend/`

```bash
cd backend
```

## 3️⃣ Instalar Dependências

```bash
npm install
```

## 4️⃣ Criar e Inicializar Base de Dados

```bash
npm run init-db
```

Isto vai:
- ✅ Criar o ficheiro `database/loja_sende.db`
- ✅ Criar todas as tabelas necessárias
- ✅ Inserir as 5 categorias
- ✅ Criar conta admin padrão

**Credenciais Admin:**
- 📧 Email: `admin@loja.pt`
- 🔑 Senha: `Admin@123`
- ⚠️ Altere a senha na primeira login!

## 5️⃣ Iniciar o Servidor

```bash
npm run dev
```

Verá algo como:
```
✓ Conectado à base de dados SQLite
✓ Tabelas criadas com sucesso
✓ Conta admin criada com sucesso!
  📧 Email: admin@loja.pt
  🔑 Senha: Admin@123
🌐 Servidor rodando em http://localhost:3000
```

## 6️⃣ Aceder ao Painel de Admin

Abra no browser:
```
http://localhost:3000/admin/admin-login.html
```

Faça login com as credenciais acima.

## 7️⃣ Testar a API

Abra o browser:
- http://localhost:3000/api/health
- http://localhost:3000/api/products
- http://localhost:3000 - Página inicial

## 📚 Documentação Completa

Para documentação detalhada sobre o sistema de admin e gerenciamento de perfil:
👉 Veja [ADMIN-GUIDE.md](./ADMIN-GUIDE.md)

## 7️⃣ (Opcional) Importar Produtos

Se quiser importar os produtos do seu `cart.js`:

```bash
node import-products.js
```

---

## 📂 Estrutura de Ficheiros Criados

```
my-app/
├── backend/
│   ├── routes/           # API endpoints
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   └── payments.js
│   ├── database.js       # Conexão com SQLite
│   ├── server.js         # Servidor Express
│   ├── init-database.js  # Script para criar BD
│   ├── import-products.js # Script para importar produtos
│   ├── package.json
│   ├── .env
│   ├── .gitignore
│   └── README.md
├── database/
│   ├── schema.sql        # Definição de tabelas
│   ├── sample-data.sql   # Dados de exemplo
│   └── loja_sende.db     # (criado após npm run init-db)
└── src/
    ├── api-client.js              # Cliente para chamar API
    └── cart-api-integration.js    # Exemplos de integração
```

---

## 🔗 Próximo: Integrar no Frontend

No seu `index.html` ou `cart.html`, adicione:

```html
<script type="module">
  import CartAPI from './cart-api-integration.js';
  
  // Agora pode usar:
  // CartAPI.loadProducts()
  // CartAPI.handleAddToCart(id, qtd, options, price)
  // CartAPI.handleCheckout(shipping, paymentMethod)
</script>
```

---

## ❓ Problemas Comuns

**Erro: "sqlite3 module not found"**
```bash
npm install sqlite3
```

**Erro: "Port 3000 already in use"**
```bash
# Mude a porta no .env
PORT=3001
```

**Base de dados com erro**
```bash
# Deletar e recriá-la
rm database/loja_sende.db
npm run init-db
```

---

## 📞 Endpoints Principais

```
Produtos:       GET /api/products
Categorias:     GET /api/products/categories
Carrinho:       GET|POST|PUT|DELETE /api/cart
Encomendas:     GET|POST|PUT /api/orders
Utilizadores:   POST /api/users/register|login
Pagamentos:     POST|GET|PUT /api/payments
```

---

**Sucesso! A sua base de dados está pronta. 🎉**

Para mais informações, veja: `backend/README.md`
