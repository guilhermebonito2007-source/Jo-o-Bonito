-- Dados de exemplo completos para a base de dados da Loja João Bonito
-- Execute este ficheiro após inicializar a base de dados

-- ===== INSERIR CATEGORIAS =====
-- (As categorias são inseridas automaticamente no init-database.js)

-- ===== PRODUTOS - LIMPEZA =====
INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(1, 'Lixívia Kiriko', 'Lixívia com ação desinfetante e branqueadora', 1.23, 100, 'limpeza-lixivia-kiriko', 'lexívia kiriko.png',
 '{"Volume":"2 L","Tipo":"Líquido","Aplicação":"Pisos, azulejos e superfícies laváveis"}',
 '[{"name":"Tipo","label":"Tipo","values":["Lixívia Clássica","Lixívia Perfumada"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(1, 'Limpa Frigorífico', 'Limpador especial para frigorífico', 1.32, 80, 'limpeza-limpa-frigorifico', 'limpa figorifico.png',
 '{"Volume":"500 ml","Tipo":"Spray","Aplicação":"Frigorífico e superfícies"}',
 '[{"name":"Aroma","label":"Aroma","values":["Neutro","Limão","Lavanda"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(1, 'Limpa Vidros', 'Spray para vidros e espelhos com secagem rápida', 1.56, 120, 'limpeza-limpa-vidros', 'limpa vidros.png',
 '{"Volume":"1 L","Indicado para":"Vidros, espelhos e superfícies transparentes"}',
 '[{"name":"Tipo","label":"Tipo","values":["Limpa Vidros","Multiusos"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(1, 'Limpa Alumínio', 'Limpador especial para alumínio e metais', 2.40, 60, 'limpeza-limpa-aluminio', 'limpa aluminio.png',
 '{"Volume":"500 ml","Tipo":"Cremoso","Aplicação":"Alumínio, cobre, latão"}',
 NULL);

-- ===== PRODUTOS - DROGARIAS =====
INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(2, 'Cal 5Kg', 'Cal viva em saco de 5 quilogramas', 3.10, 150, 'droga-cal-5kg', 'cal de 5kg.png',
 '{"Peso":"5 Kg","Tipo":"Cal Viva","Aplicação":"Agricultura e limpeza"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(2, 'Cal em Pasta', 'Cal em pasta pronta para usar', 4.00, 100, 'droga-cal-em-pasta', 'cal em pasta.jpg',
 '{"Peso":"500 g","Tipo":"Cal em Pasta","Aplicação":"Pintura e acabamentos"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(2, 'Carvão Vegetal 2Kg', 'Carvão vegetal em saco de 2 quilogramas', 2.10, 200, 'droga-carvao-vegetal-2kg', 'Carvão Vegetal 2kg.png',
 '{"Peso":"2 Kg","Tipo":"Carvão Vegetal","Aplicação":"Churrascaria e aquecimento"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(2, 'Carvão Vegetal 3Kg', 'Carvão vegetal em saco de 3 quilogramas', 3.80, 180, 'droga-carvao-vegetal-3kg', 'Carvão Vegetal 3kg.png',
 '{"Peso":"3 Kg","Tipo":"Carvão Vegetal","Aplicação":"Churrascaria e aquecimento"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(2, 'Carvão Vegetal 5Kg', 'Carvão vegetal em saco de 5 quilogramas', 5.50, 150, 'droga-carvao-vegetal-5kg', 'Carvão Vegetal 5kg.png',
 '{"Peso":"5 Kg","Tipo":"Carvão Vegetal","Aplicação":"Churrascaria e aquecimento"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(2, 'Champô para Cães', 'Champô especializado para cães', 8.99, 75, 'droga-champoo-caes', 'Champoo para cães.jpg',
 ' {"Volume":"500 ml","Tipo":"Champô","Aplicação":"Higiene animal"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(2, 'Cola para Madeira', 'Cola branca para madeira', 4.50, 120, 'droga-cola-madeira', 'Cola para madeira.jpg',
 '{"Volume":"250 ml","Tipo":"Cola Branca","Aplicação":"Carpintaria"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(2, 'Creolina em Garrafa', 'Desinfetante creolina em garrafa', 6.75, 95, 'droga-creolina-garrafa', 'Creolina em Garrafa.png',
 '{"Volume":"1 L","Tipo":"Desinfetante","Aplicação":"Higiene e desinfecção"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(2, 'Creolina em Lata', 'Desinfetante creolina em lata', 7.50, 85, 'droga-creolina-lata', 'Creolina em Lata.png',
 '{"Volume":"5 L","Tipo":"Desinfetante","Aplicação":"Higiene e desinfecção"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(2, 'Petróleo 1 Litro', 'Petróleo em garrafa de 1 litro', 3.99, 140, 'droga-petroleo-1l', 'Petroleo 1 Litro.png',
 '{"Volume":"1 L","Tipo":"Petróleo","Aplicação":"Iluminação e aquecimento"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(2, 'Petróleo 5 Litros', 'Petróleo em garrafa de 5 litros', 18.50, 60, 'droga-petroleo-5l', 'Petroleo 5 litros.png',
 '{"Volume":"5 L","Tipo":"Petróleo","Aplicação":"Iluminação e aquecimento"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(2, 'Sebo para Calçado', 'Creme de sebo para tratamento de calçado', 5.99, 110, 'droga-sebo-calcado', 'Sebo para calçado.jpg',
 '{"Volume":"200 ml","Tipo":"Sebo","Aplicação":"Tratamento de calçado"}',
 NULL);

-- ===== PRODUTOS - FERTILIZANTES =====
INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(3, 'Terra Vegetal 25kg', 'Terra vegetal de qualidade para plantações', 30.00, 50, 'fert-terra', 'terra vegetal 25Kg.png',
 '{"Peso":"25 Kg","Tipo":"Terra Vegetal","Aplicação":"Jardinagem e agricultura"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(3, 'Esturme de Cavalo 50L', 'Adubo orgânico natural de esturme de cavalo', 27.00, 40, 'fert-adubo', 'Campocheio esturme de cavalo de 50L.png',
 '{"Volume":"50 L","Tipo":"Esturme","Aplicação":"Fertilização organica"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(3, 'Cloreto de Potássio', 'Fertilizante mineral cloreto de potássio', 22.00, 60, 'fert-composto', 'Cloreto de potássio.png',
 '{"Peso":"Saco","Tipo":"Mineral","Aplicação":"Fertirrigação"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(3, 'Corretivo Agrícola Orgânico', 'Corretivo agrícola orgânico de qualidade', 15.00, 80, 'fert-corretivo', 'Corretivo Agrícola Orgânico Siro Agro3.png',
 '{"Tipo":"Orgânico","Aplicação":"Correção de solos"}',
 NULL);

-- ===== PRODUTOS - HIGIENE PESSOAL =====
INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(4, 'Guardanapo', 'Guardanapos descartáveis de qualidade', 1.20, 500, 'higiene-guardanapo', 'guardanapo.png',
 '{"Tipo":"Descartável","Unidades":"Pacote de 100"}',
 '[{"name":"Cores","label":"Cores","values":["Branco","Cores Sortidas"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(4, 'Algodão', 'Algodão em disco para higiene pessoal', 1.10, 450, 'higiene-algodao', 'algudao.png',
 '{"Tipo":"Discos","Unidades":"Pacote de 100 discos"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(4, 'Champô', 'Champô premium para cuidados capilares', 4.99, 200, 'higiene-champoo', 'champoo.png',
 '{"Volume":"250 ml","Tipo":"Champô","Indicação":"Cabelo normal e oleoso"}',
 '[{"name":"Tipo","label":"Tipo","values":["Cabelelo Normal","Cabelelo Oleoso","Cabelelo Seco"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(4, 'Esponja Redonda', 'Esponja redonda para banho', 1.00, 300, 'higiene-esponja', 'esponja de banho redondo.png',
 '{"Tipo":"Esponja","Formato":"Redonda"}',
 '[{"name":"Cores","label":"Cores","values":["Verde","Azul","Amarela"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(4, 'Esponja de Banho para Massagem', 'Esponja especial para banho e massagem', 2.20, 250, 'higiene-esponja-massagem', 'esponja de  banho massagem.png',
 '{"Tipo":"Esponja Massagem","Formato":"Irregular"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(4, 'Gel de Banho', 'Gel de banho hidratante e perfumado', 3.10, 280, 'higiene-gel-banho', 'gel de banho.png',
 '{"Volume":"500 ml","Tipo":"Gel","Indicação":"Todos os tipos de pele"}',
 '[{"name":"Aroma","label":"Aroma","values":["Lavanda","Rosa","Morango"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(4, 'Pasta de Dentes', 'Pasta de dentes com flúor', 3.25, 350, 'higiene-pasta-dentes', 'pasta de dentes.png',
 '{"Volume":"75 ml","Tipo":"Creme","Ingrediente":"Flúor"}',
 '[{"name":"Sabor","label":"Sabor","values":["Menta","Morango","Frutos Vermelhos"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(4, 'Rolo de Cozinha', 'Rolo de papel de cozinha descartável', 2.75, 400, 'higiene-rolo-cozinha', 'rolo de cozinha.png',
 '{"Tipo":"Papel","Unidades":"Rolo","Camadas":"2 camadas"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(4, 'Sabonete Líquido', 'Sabonete líquido para mãos e corpo', 3.99, 320, 'higiene-sabonete-liquido', 'sabonete liquido.png',
 '{"Volume":"250 ml","Tipo":"Líquido","Aplicação":"Mãos e corpo"}',
 '[{"name":"Aroma","label":"Aroma","values":["Neutro","Citrico","Flores"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(4, 'Sabonete', 'Sabonete em barra para higiene pessoal', 2.50, 400, 'higiene-sabonete', 'sabonete.png',
 '{"Tipo":"Barra","Peso":"125 g","Aplicação":"Higiene pessoal"}',
 '[{"name":"Aroma","label":"Aroma","values":["Neutro","Mel","Glicerina"]}]');

-- ===== PRODUTOS - PLÁSTICOS =====
INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(5, 'Alguidares de Plástico', 'Alguidares de plástico resistente', 1.20, 300, 'plastico-alguidares', 'alguidares.png',
 '{"Tipo":"Plástico","Capacidade":"5-10 L","Aplicação":"Múltiplos usos"}',
 '[{"name":"Tamanho","label":"Tamanho","values":["Pequeno","Médio","Grande"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(5, 'Balde de Construção', 'Balde de plástico para construção e limpeza', 1.50, 250, 'plastico-balde-construcao', 'balde de construção.png',
 '{"Tipo":"Plástico","Capacidade":"10 L","Aplicação":"Construção e limpeza"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(5, 'Balde Redondo', 'Balde redondo de plástico versátil', 2.20, 280, 'plastico-balde-redondo', 'balde redondo.png',
 '{"Tipo":"Plástico","Capacidade":"12 L","Aplicação":"Múltiplos usos"}',
 NULL);

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(5, 'Cesta para Roupa', 'Cesta de plástico para armazenamento de roupa', 3.10, 200, 'plastico-cesta-armazenamento', 'cesta para a roupa.png',
 '{"Tipo":"Plástico","Uso":"Roupa e armazenamento","Cor":"Vária"}',
 '[{"name":"Cores","label":"Cores","values":["Branco","Azul","Rosa","Verde"]}]');

INSERT INTO products (category_id, name, description, price, stock, sku, image_url, specs, options) VALUES
(5, 'Escova Sanitária sem Suporte', 'Escova sanitária de plástico', 1.00, 400, 'plastico-escova-sanitaria', 'escova savitaria sem suporte.png',
 '{"Tipo":"Plástico","Uso":"Higiene sanitária"}',
 '[{"name":"Cores","label":"Cores","values":["Preto","Branco","Cinzento"]}]');

-- ===== UTILIZADORES DE TESTE =====
-- Nota: As senhas devem ser hash em bcrypt na aplicação
INSERT INTO users (email, password, first_name, last_name, phone, address, city, postal_code, role, is_active) VALUES
('admin@loja.pt', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Admin', 'Loja', '916000000', 'Rua Admin 1', 'Olhão', '8700-173', 'admin', 1);

INSERT INTO users (email, password, first_name, last_name, phone, address, city, postal_code, role, is_active) VALUES
('cliente@exemplo.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'João', 'Silva', '967154934', 'Rua Exemplo 10', 'Olhão', '8700-173', 'customer', 1);

-- ===== CUPÕES DE DESCONTO =====
INSERT INTO coupon_codes (code, discount_percent, max_uses, valid_until, active) VALUES
('PRIMEIRACOMPRA', 10, 100, datetime('now', '+30 days'), 1);

INSERT INTO coupon_codes (code, discount_fixed, max_uses, valid_until, active) VALUES
('DESCONTO5EUR', 5, 50, datetime('now', '+60 days'), 1);

INSERT INTO coupon_codes (code, discount_percent, max_uses, valid_until, active) VALUES
('VERAO2024', 15, 200, datetime('now', '+90 days'), 1);

-- ===== EXEMPLOS DE CONTACTO =====
INSERT INTO contacts (name, email, phone, message, subject, status) VALUES
('Maria Santos', 'maria@exemplo.com', '913849235', 'Gostaria de saber mais sobre o produto X', 'Dúvida sobre produto', 'nao_lido');

INSERT INTO contacts (name, email, phone, message, subject, status) VALUES
('José Pereira', 'jose@exemplo.com', '914190584', 'Como faço para colocar uma encomenda?', 'Como encomendar', 'lido');
