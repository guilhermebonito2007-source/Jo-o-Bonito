const express = require('express');
const router = express.Router();
const { getAll, getOne, runQuery } = require('../database');

// Obter todos os produtos
router.get('/', async (req, res) => {
  try {
    const categoryId = req.query.category;
    let sql = `
      SELECT p.*, COALESCE(c.name, 'Sem Categoria') as category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    let params = [];

    if (categoryId) {
      sql += ' WHERE p.category_id = ?';
      params = [categoryId];
    }

    const products = await getAll(sql, params);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter produto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await getOne(
      `SELECT p.*, COALESCE(c.name, 'Sem Categoria') as category
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    // Parse JSON fields
    product.specs = JSON.parse(product.specs || '{}');
    product.options = JSON.parse(product.options || '[]');
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter categorias
router.get('/categories', async (req, res) => {
  try {
    const categories = await getAll('SELECT * FROM categories');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pesquisar produtos
router.get('/search', async (req, res) => {
  try {
    const query = `%${req.query.q}%`;
    const products = await getAll(
      'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?',
      [query, query]
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adicionar novo produto
router.post('/', async (req, res) => {
  try {
    const { name, price, stock, category, description } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ error: 'Nome, preço e stock são obrigatórios' });
    }

    // Se category for uma string, tentar encontrar ou criar a categoria
    let categoryId = 1; // Default category ID
    if (category && typeof category === 'string') {
      try {
        // Tentar encontrar a categoria existente
        const cat = await getOne('SELECT id FROM categories WHERE name = ?', [category]);
        if (cat) {
          categoryId = cat.id;
        } else {
          // Criar nova categoria se não existir
          const result = await runQuery(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [category, '']
          );
          categoryId = result.id;
        }
      } catch (err) {
        console.error('Erro ao processar categoria:', err);
        categoryId = 1; // Fallback to default
      }
    } else if (category && typeof category === 'number') {
      categoryId = category;
    }

    const sql = `
      INSERT INTO products (category_id, name, price, stock, description)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await runQuery(sql, [categoryId, name, parseFloat(price), parseInt(stock), description || '']);
    
    res.status(201).json({
      id: result.id,
      category_id: categoryId,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      description: description || '',
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erro ao adicionar produto:', err);
    res.status(500).json({ error: err.message });
  }
});

// Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const { name, price, stock, category, description } = req.body;
    const productId = req.params.id;

    // Se category for uma string, tentar encontrar ou criar a categoria
    let categoryId = 1; // Default category ID
    if (category && typeof category === 'string') {
      try {
        // Tentar encontrar a categoria existente
        const cat = await getOne('SELECT id FROM categories WHERE name = ?', [category]);
        if (cat) {
          categoryId = cat.id;
        } else {
          // Criar nova categoria se não existir
          const result = await runQuery(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [category, '']
          );
          categoryId = result.id;
        }
      } catch (err) {
        console.error('Erro ao processar categoria:', err);
        categoryId = 1; // Fallback to default
      }
    } else if (category && typeof category === 'number') {
      categoryId = category;
    }

    const sql = `
      UPDATE products 
      SET name = ?, price = ?, stock = ?, category_id = ?, description = ?
      WHERE id = ?
    `;
    await runQuery(sql, [name, parseFloat(price), parseInt(stock), categoryId, description || '', productId]);

    res.json({
      id: productId,
      category_id: categoryId,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      description: description || '',
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: err.message });
  }
});

// Deletar produto
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Verificar se produto existe
    const product = await getOne('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await runQuery('DELETE FROM products WHERE id = ?', [productId]);
    res.json({ message: 'Produto deletado com sucesso', id: productId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
