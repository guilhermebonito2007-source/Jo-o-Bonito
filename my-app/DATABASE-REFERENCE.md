# 📋 Tabelas da Base de Dados - Referência Completa

## 1️⃣ CATEGORIES (Categorias)
Armazena as categorias de produtos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| name | TEXT | Nome da categoria (único) |
| description | TEXT | Descrição |
| icon | TEXT | URL do ícone |
| created_at | DATETIME | Data de criação |

**Exemplo:**
```sql
INSERT INTO categories (name, description) 
VALUES ('Produtos De Limpeza', 'Produtos para limpeza da casa');
```

---

## 2️⃣ PRODUCTS (Produtos)
Catálogo de todos os produtos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| category_id | INTEGER | FK para categoria |
| name | TEXT | Nome do produto |
| description | TEXT | Descrição |
| price | REAL | Preço em EUR |
| stock | INTEGER | Quantidade em stock |
| sku | TEXT | Código único do produto |
| image_url | TEXT | URL da imagem |
| specs | TEXT | JSON com especificações |
| options | TEXT | JSON com opções (volumes, cores, etc) |
| created_at | DATETIME | Data de criação |
| updated_at | DATETIME | Data de última atualização |

**Exemplo:**
```sql
INSERT INTO products (category_id, name, price, stock, sku, specs, options)
VALUES (1, 'Lixívia Kiriko', 3.50, 50, 'limpeza-lixivia-kiriko',
        '{"Volume":"2 L","Tipo":"Liquido"}',
        '[{"name":"Aroma","values":["Neutra","Perfumada"]}]');
```

---

## 3️⃣ USERS (Utilizadores)
Dados dos clientes/utilizadores.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| email | TEXT | Email (único) |
| password | TEXT | Password (hash) |
| first_name | TEXT | Primeiro nome |
| last_name | TEXT | Apelido |
| phone | TEXT | Telemóvel |
| address | TEXT | Morada |
| city | TEXT | Cidade |
| postal_code | TEXT | Código postal |
| country | TEXT | País (default: Portugal) |
| created_at | DATETIME | Data de criação |
| updated_at | DATETIME | Data de atualização |

---

## 4️⃣ CART_ITEMS (Carrinho)
Itens que os utilizadores adicionam ao carrinho.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| user_id | INTEGER | FK para utilizador |
| product_id | INTEGER | FK para produto |
| quantity | INTEGER | Quantidade |
| selected_options | TEXT | JSON com opções escolhidas |
| price | REAL | Preço no momento da adição |
| session_id | TEXT | ID de sessão (não autenticados) |
| created_at | DATETIME | Data de adição |

---

## 5️⃣ ORDERS (Encomendas)
Todas as encomendas feitas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| user_id | INTEGER | FK para utilizador |
| order_number | TEXT | Número da encomenda (único) |
| total_price | REAL | Valor total |
| status | TEXT | pendente/processada/enviada/entregue/cancelada |
| payment_method | TEXT | cartao/mbway/transferencia/multibanco |
| payment_status | TEXT | nao_pago/pago/reembolso |
| shipping_address | TEXT | JSON com morada de entrega |
| notes | TEXT | Notas especiais |
| created_at | DATETIME | Data de criação |
| updated_at | DATETIME | Última atualização |

**Status válidos:**
- `pendente` - Aguardando processamento
- `processada` - Paga e pronta para envio
- `enviada` - Em trânsito
- `entregue` - Entregue ao cliente
- `cancelada` - Cancelada pelo cliente

---

## 6️⃣ ORDER_ITEMS (Itens de Encomenda)
Detalhes de cada item de uma encomenda.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| order_id | INTEGER | FK para encomenda |
| product_id | INTEGER | FK para produto |
| quantity | INTEGER | Quantidade |
| price | REAL | Preço no momento da compra |
| selected_options | TEXT | JSON com opções escolhidas |
| created_at | DATETIME | Data de criação |

---

## 7️⃣ PAYMENTS (Pagamentos)
Registos de tentativas de pagamento.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| order_id | INTEGER | FK para encomenda |
| amount | REAL | Valor do pagamento |
| method | TEXT | Método: cartao/mbway/transferencia/multibanco |
| status | TEXT | pendente/confirmado/falhado/reembolso |
| reference | TEXT | Referência (ex: referência MB) |
| transaction_id | TEXT | ID da transação (único) |
| created_at | DATETIME | Data de criação |
| updated_at | DATETIME | Última atualização |

---

## 8️⃣ CONTACTS (Contactos)
Mensagens de formulário de contacto.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| name | TEXT | Nome do contactante |
| email | TEXT | Email |
| phone | TEXT | Telemóvel |
| message | TEXT | Mensagem |
| subject | TEXT | Assunto |
| status | TEXT | nao_lido/lido/respondido |
| created_at | DATETIME | Data de criação |

---

## 9️⃣ REVIEWS (Avaliações)
Comentários e avaliações de produtos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| product_id | INTEGER | FK para produto |
| user_id | INTEGER | FK para utilizador |
| rating | INTEGER | Nota (1-5 estrelas) |
| comment | TEXT | Comentário |
| helpful_count | INTEGER | Votos de "útil" |
| status | TEXT | pendente/aprovada/rejeitada |
| created_at | DATETIME | Data de criação |

---

## 🔟 COUPON_CODES (Cupões)
Cupões e códigos de desconto.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| code | TEXT | Código (único) - ex: "PRIMEIRACOMPRA" |
| discount_percent | REAL | Desconto em % |
| discount_fixed | REAL | Desconto em EUR |
| max_uses | INTEGER | Usos máximos |
| used_count | INTEGER | Vezes já usado |
| valid_from | DATETIME | Data início |
| valid_until | DATETIME | Data fim |
| active | BOOLEAN | Ativo (1) ou inativo (0) |
| created_at | DATETIME | Data de criação |

---

## 1️⃣1️⃣ ACTIVITY_LOG (Histórico)
Registo de ações dos utilizadores.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| user_id | INTEGER | FK para utilizador |
| action | TEXT | Tipo de ação: login/logout/compra/etc |
| description | TEXT | Descrição detalhada |
| ip_address | TEXT | IP do utilizador |
| created_at | DATETIME | Data/hora |

---

## 📊 Consultas SQL Úteis

### Vendas por categoria
```sql
SELECT c.name, COUNT(*) as vendas, SUM(oi.quantity) as unidades
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN categories c ON p.category_id = c.id
GROUP BY c.id
ORDER BY vendas DESC;
```

### Clientes mais leais
```sql
SELECT u.email, COUNT(o.id) as encomendas, SUM(o.total_price) as gasto
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
HAVING encomendas > 0
ORDER BY gasto DESC;
```

### Produtos sem stock
```sql
SELECT name, stock FROM products WHERE stock = 0;
```

### Encomendas não pagas
```sql
SELECT order_number, total_price, created_at
FROM orders
WHERE payment_status = 'nao_pago'
ORDER BY created_at DESC;
```

---

✅ Referência completa da base de dados
