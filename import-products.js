#!/usr/bin/env node

/**
 * Script para importar produtos do PRODUCT_DETAILS (cart.js) para a base de dados
 * Uso: node import-products.js
 */

const { initDatabase, getOne, runQuery } = require('./database');

// Importar os produtos do cart.js
const PRODUCT_DETAILS = require('../src/cart.js');

// Mapeamento de nomes de categoria
const categoryMap = {
  'limpeza': 'Produtos De Limpeza',
  'drogarias': 'Produtos de Drogarias',
  'fertilizantes': 'Fertilizantes',
  'higiene': 'Produtos De Higiene Pessoal',
  'plasticos': 'Produtos Plásticos'
};

const importProducts = async () => {
  try {
    console.log('🚀 Iniciando importação de produtos...\n');

    // Obter categorias
    const categories = {};
    for (const [key, categoryName] of Object.entries(categoryMap)) {
      const category = await getOne(
        'SELECT id FROM categories WHERE name = ?',
        [categoryName]
      );
      if (category) {
        categories[key] = category.id;
      }
    }

    let imported = 0;

    // Importar produtos
    for (const [productId, productData] of Object.entries(PRODUCT_DETAILS)) {
      try {
        // Detectar categoria pelo ID
        let categoryId = 1; // Default
        for (const [key, id] of Object.entries(categories)) {
          if (productId.includes(key)) {
            categoryId = id;
            break;
          }
        }

        // Verificar se produto já existe
        const existing = await getOne(
          'SELECT id FROM products WHERE sku = ?',
          [productId]
        );

        if (existing) {
          console.log(`⏭️  Pulando: ${productData.title} (já existe)`);
          continue;
        }

        // Inserir produto
        await runQuery(
          `INSERT INTO products (category_id, name, description, price, stock, sku, specs, options)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            categoryId,
            productData.title,
            productData.description || '',
            0, // Preço - adicione manualmente
            10, // Stock padrão
            productId,
            JSON.stringify(productData.specs || {}),
            JSON.stringify(productData.options || [])
          ]
        );

        imported++;
        console.log(`✓ Importado: ${productData.title}`);
      } catch (err) {
        console.error(`✗ Erro ao importar ${productData.title}:`, err.message);
      }
    }

    console.log(`\n✅ Importação concluída: ${imported} produtos adicionados`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
};

// Inicializar e importar
initDatabase().then(importProducts);
