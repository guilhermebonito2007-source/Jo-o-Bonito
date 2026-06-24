-- Exemplo de dados para a base de dados
-- Execute isto após criar as tabelas

-- Inserir categorias (já feito automaticamente no init-database.js)
-- INSERT INTO categories (name, description) VALUES
-- ('Produtos De Limpeza', 'Produtos para limpeza da casa'),
-- ('Produtos de Drogarias', 'Produtos variados de drogaria'),
-- ('Fertilizantes', 'Fertilizantes e produtos agrícolas'),
-- ('Produtos De Higiene Pessoal', 'Artigos de higiene pessoal'),
-- ('Produtos Plásticos', 'Produtos de plástico diversos');

-- Produtos de exemplo - Limpeza
INSERT INTO products (category_id, name, description, price, stock, sku, specs, options) VALUES
(1, 'Lixívia Kiriko', 'Lixívia com ação desinfetante e branqueadora', 3.50, 50, 'limpeza-lixivia-kiriko',
 '{"Volume":"2 L","Tipo":"Liquido","Aplicação":"Pisos, azulejos e superfícies laváveis"}',
 '[{"name":"Aroma","label":"Aroma","values":["Neutra","Com Detergente","Perfumada","Limpa e Branqueia"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, specs, options) VALUES
(1, 'Limpa Vidros', 'Spray para vidros e espelhos com secagem rápida', 4.99, 30, 'limpeza-limpa-vidros',
 '{"Volume":"1 L","Indicado para":"Vidros, espelhos e superfícies transparentes"}',
 '[{"name":"Tipo","label":"Tipo","values":["Limpa Vidros In","Limpa Cristales","Multiusos"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, specs, options) VALUES
(1, 'Amaciador', 'Amaciador de roupa que deixa os tecidos macios', 5.99, 25, 'limpeza-amaciador',
 '{"Volume":"2 L","Tipo":"Líquido","Uso":"Roupas brancas e coloridas"}',
 '[{"name":"Tipo","label":"Tipo","values":["Talc:80 lavagens","Azahar:72 lavagens"]}]');

-- Utilizador de teste
INSERT INTO users (email, password, first_name, last_name, phone, address, city, postal_code) VALUES
('cliente@exemplo.com', 'senha123', 'João', 'Silva', '967154934', 'Rua Exemplo 10', 'Olhão', '8700-173');

-- Cupão de desconto de teste
INSERT INTO coupon_codes (code, discount_percent, max_uses, valid_until) VALUES
('PRIMEIRACOMPRA', 10, 100, datetime('now', '+30 days'));

INSERT INTO coupon_codes (code, discount_fixed, max_uses, valid_until) VALUES
('DESCONTO5EUR', 5, 50, datetime('now', '+60 days'));

-- Contacto de teste
INSERT INTO contacts (name, email, phone, message, subject) VALUES
('Maria Santos', 'maria@exemplo.com', '913849235', 'Gostaria de saber mais sobre o produto X', 'Dúvida sobre produto');

-- Consultas úteis para gestão

-- Total de vendas por produto
SELECT p.name, COUNT(oi.id) as quantidade_vendida, SUM(oi.price * oi.quantity) as faturacao
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id
ORDER BY faturacao DESC;

-- Clientes mais ativos
SELECT u.first_name, u.last_name, COUNT(o.id) as num_encomendas, SUM(o.total_price) as total_gasto
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
ORDER BY total_gasto DESC;

-- Status de pagamentos pendentes
SELECT o.order_number, o.total_price, o.payment_status, o.created_at
FROM orders o
WHERE o.payment_status = 'nao_pago'
ORDER BY o.created_at DESC;

-- Produtos com stock baixo
SELECT name, stock
FROM products
WHERE stock < 5
ORDER BY stock ASC;

-- Últimas encomendas
SELECT o.order_number, u.first_name, u.email, o.total_price, o.status, o.created_at
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC
LIMIT 10;
