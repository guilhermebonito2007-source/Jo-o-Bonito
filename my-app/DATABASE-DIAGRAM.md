```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BASE DE DADOS - LOJA SENDE                              │
│                                                                              │
│  Database: loja_sende.db (SQLite)                                          │
│  Backend: Node.js + Express                                                 │
│  Total de Tabelas: 11                                                       │
└─────────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────────┐
│                         DIAGRAMA DE RELAÇÕES                              │
└────────────────────────────────────────────────────────────────────────────┘


                              ┌──────────────┐
                              │ CATEGORIES   │
                              ├──────────────┤
                              │ id (PK)      │
                              │ name         │
                              │ description  │
                              └──────────────┘
                                     △
                                     │ (1:N)
                                     │
                ┌────────────────────┴───────────────────────┐
                │                                            │
                ▼                                            ▼
        ┌──────────────┐                          ┌──────────────┐
        │ PRODUCTS     │                          │   REVIEWS    │
        ├──────────────┤                          ├──────────────┤
        │ id (PK)      │                          │ id (PK)      │
        │ category_id  │◄──────(FK)──────────────►│ product_id   │
        │ name         │                          │ user_id      │
        │ price        │                          │ rating       │
        │ stock        │                          │ comment      │
        │ specs (JSON) │                          └──────────────┘
        │ options      │                                 △
        └──────────────┘                                 │
               △                                         │
               │                                    (FK to USERS)
        ┌──────┴──────┐                                  │
        │             │                                  │
    (1:N)         (1:N)                                  │
        │             │                          ┌──────────────┐
        │             │                          │   USERS      │
        ▼             ▼                          ├──────────────┤
    ┌─────────────────────┐                      │ id (PK)      │
    │  CART_ITEMS         │                      │ email        │
    ├─────────────────────┤                      │ password     │
    │ id (PK)             │                      │ first_name   │
    │ user_id (FK)        │◄─────────────────────┤ last_name    │
    │ product_id (FK)     │                      │ phone        │
    │ quantity            │                      │ address      │
    │ selected_options    │                      │ city         │
    └─────────────────────┘                      │ postal_code  │
                                                 └──────────────┘
                                                        △
                                                        │
                                                   (1:N)│
                                                        │
                        ┌───────────────────────────────┴──────────────────┐
                        │                                                  │
                        ▼                                                  ▼
                    ┌─────────────┐                              ┌──────────────┐
                    │   ORDERS    │◄──────────(1:N)──────────────│ ACTIVITY_LOG │
                    ├─────────────┤                              ├──────────────┤
                    │ id (PK)     │                              │ id (PK)      │
                    │ user_id (FK)│                              │ user_id (FK) │
                    │ order_number│                              │ action       │
                    │ total_price │                              │ description  │
                    │ status      │                              │ ip_address   │
                    │ payment_*   │                              └──────────────┘
                    └─────────────┘
                           △
                           │
                      (1:N)│
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
    ┌──────────────┐                 ┌──────────────┐
    │ ORDER_ITEMS  │                 │  PAYMENTS    │
    ├──────────────┤                 ├──────────────┤
    │ id (PK)      │                 │ id (PK)      │
    │ order_id (FK)│                 │ order_id (FK)│
    │ product_id   │                 │ amount       │
    │ quantity     │                 │ method       │
    │ price        │                 │ status       │
    └──────────────┘                 │ reference    │
                                     └──────────────┘


┌────────────────────────────────────────────────────────────────────────────┐
│                      TABELAS ADICIONAIS (sem FK)                          │
├────────────────────────────────────────────────────────────────────────────┤

┌──────────────┐       ┌─────────────────┐       ┌──────────────┐
│   CONTACTS   │       │ COUPON_CODES    │       │   REVIEWS    │
├──────────────┤       ├─────────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)         │       │ (veja acima) │
│ name         │       │ code            │       └──────────────┘
│ email        │       │ discount_%      │
│ phone        │       │ max_uses        │
│ message      │       │ valid_from      │
│ subject      │       │ valid_until     │
│ status       │       │ active          │
└──────────────┘       └─────────────────┘

└────────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE COMPRA (Estados)                              │
└────────────────────────────────────────────────────────────────────────────┘

1. Cliente adiciona produtos
   └─► CART_ITEMS (product_id, user_id, quantity)

2. Cliente faz checkout
   └─► Cria ORDER (status = 'pendente', payment_status = 'nao_pago')
   └─► ORDER_ITEMS (cópia dos itens do carrinho)
   └─► Limpa CART_ITEMS

3. Cliente escolhe método de pagamento
   └─► PAYMENTS (method = cartao/mbway/transferencia/multibanco)
   └─► Se confirmado:
       ├─► ORDER.payment_status = 'pago'
       └─► ORDER.status = 'processada'

4. Encomenda é processada
   └─► ORDER.status = 'enviada'
   └─► Atualizar PRODUCTS.stock

5. Cliente recebe
   └─► ORDER.status = 'entregue'


┌────────────────────────────────────────────────────────────────────────────┐
│                        ESTATÍSTICAS & QUERIES                             │
└────────────────────────────────────────────────────────────────────────────┘

📊 Total de vendas por período:
   SELECT DATE(created_at), COUNT(*), SUM(total_price)
   FROM orders
   GROUP BY DATE(created_at);

💰 Produtos mais vendidos:
   SELECT p.name, COUNT(*) as vendas
   FROM order_items oi
   JOIN products p ON oi.product_id = p.id
   GROUP BY p.id
   ORDER BY vendas DESC
   LIMIT 10;

👥 Clientes premium (maior gasto):
   SELECT u.email, COUNT(o.id), SUM(o.total_price)
   FROM users u
   LEFT JOIN orders o ON u.id = o.user_id
   GROUP BY u.id
   HAVING SUM(o.total_price) > 100;

📦 Stock crítico (< 5 unidades):
   SELECT name, stock FROM products WHERE stock < 5;

⏳ Encomendas pendentes de pagamento:
   SELECT order_number, total_price
   FROM orders
   WHERE payment_status = 'nao_pago'
   ORDER BY created_at DESC;

❌ Encomendas não processadas (> 24h):
   SELECT order_number, created_at
   FROM orders
   WHERE status = 'pendente'
   AND created_at < datetime('now', '-1 day');


┌────────────────────────────────────────────────────────────────────────────┐
│                          ÍNDICES (Performance)                            │
└────────────────────────────────────────────────────────────────────────────┘

✅ idx_products_category      - Buscar por categoria
✅ idx_cart_user              - Carrinho por utilizador
✅ idx_orders_user            - Encomendas por utilizador
✅ idx_order_items_order      - Itens por encomenda
✅ idx_payments_order         - Pagamentos por encomenda
✅ idx_reviews_product        - Avaliações por produto


┌────────────────────────────────────────────────────────────────────────────┐
│                       SEGURANÇA & VALIDAÇÕES                             │
└────────────────────────────────────────────────────────────────────────────┘

🔐 Campos obrigatórios (NOT NULL):
   - USERS: email, password
   - PRODUCTS: name, price, category_id
   - ORDERS: user_id, order_number, total_price
   - PAYMENTS: order_id, amount, method

🔑 Campos únicos (UNIQUE):
   - USERS.email
   - PRODUCTS.sku
   - ORDERS.order_number
   - COUPON_CODES.code
   - PAYMENTS.transaction_id

✅ Enums (valores permitidos):
   - ORDERS.status: 'pendente', 'processada', 'enviada', 'entregue', 'cancelada'
   - ORDERS.payment_status: 'nao_pago', 'pago', 'reembolso'
   - ORDERS.payment_method: 'cartao', 'mbway', 'transferencia', 'multibanco'
   - PAYMENTS.status: 'pendente', 'confirmado', 'falhado', 'reembolso'
   - REVIEWS.status: 'pendente', 'aprovada', 'rejeitada'
   - CONTACTS.status: 'nao_lido', 'lido', 'respondido'


┌────────────────────────────────────────────────────────────────────────────┐
│                          PRÓXIMAS FASES                                   │
└────────────────────────────────────────────────────────────────────────────┘

📋 Fase 1: Setup (✅ COMPLETO)
   ✅ Schema da BD
   ✅ API REST básica
   ✅ Integração frontend

📋 Fase 2: Segurança
   ⏳ Hash de passwords (bcrypt)
   ⏳ JWT para autenticação
   ⏳ Validações de inputs
   ⏳ Rate limiting

📋 Fase 3: Pagamentos
   ⏳ Integração MBWay
   ⏳ Integração Multibanco
   ⏳ Integração Stripe/Paypal (opcional)

📋 Fase 4: Admin
   ⏳ Dashboard de vendas
   ⏳ Gestão de stock
   ⏳ Gestão de utilizadores
   ⏳ Relatórios

```

Última atualização: 2026-06-11
