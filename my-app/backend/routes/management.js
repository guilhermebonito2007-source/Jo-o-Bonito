const express = require('express');
const router = express.Router();
const { getAll, getOne, runQuery } = require('../database');

// ============ PRODUTOS ============

// Criar produto
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, stock, category_id, sku, image_url, specs, options } = req.body;
    const sql = `
      INSERT INTO products (name, description, price, stock, category_id, sku, image_url, specs, options)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      name, description, price, stock, category_id, sku, image_url,
      JSON.stringify(specs || {}),
      JSON.stringify(options || [])
    ];
    
    const result = await runQuery(sql, params);
    res.json({ id: result.lastID, message: 'Produto criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar produto
router.put('/products/:id', async (req, res) => {
  try {
    const { name, description, price, stock, category_id, sku, image_url, specs, options } = req.body;
    const sql = `
      UPDATE products 
      SET name=?, description=?, price=?, stock=?, category_id=?, sku=?, image_url=?, specs=?, options=?
      WHERE id=?
    `;
    const params = [
      name, description, price, stock, category_id, sku, image_url,
      JSON.stringify(specs || {}),
      JSON.stringify(options || []),
      req.params.id
    ];
    
    await runQuery(sql, params);
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar produto
router.delete('/products/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ message: 'Produto eliminado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ CATEGORIAS ============

// Criar categoria
router.post('/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    const sql = 'INSERT INTO categories (name, description) VALUES (?, ?)';
    const result = await runQuery(sql, [name, description]);
    res.json({ id: result.lastID, message: 'Categoria criada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar categoria
router.put('/categories/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const sql = 'UPDATE categories SET name=?, description=? WHERE id=?';
    await runQuery(sql, [name, description, req.params.id]);
    res.json({ message: 'Categoria atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar categoria
router.delete('/categories/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM categories WHERE id=?', [req.params.id]);
    res.json({ message: 'Categoria eliminada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ CUPÕES ============

// Criar cupão
router.post('/coupons', async (req, res) => {
  try {
    const { code, discount_type, discount_value, max_uses, used_count } = req.body;
    const sql = `
      INSERT INTO coupon_codes (code, discount_type, discount_value, max_uses, used_count)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await runQuery(sql, [code, discount_type, discount_value, max_uses || 999, used_count || 0]);
    res.json({ id: result.lastID, message: 'Cupão criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar cupão
router.put('/coupons/:id', async (req, res) => {
  try {
    const { code, discount_type, discount_value, max_uses } = req.body;
    const sql = `
      UPDATE coupon_codes 
      SET code=?, discount_type=?, discount_value=?, max_uses=?
      WHERE id=?
    `;
    await runQuery(sql, [code, discount_type, discount_value, max_uses, req.params.id]);
    res.json({ message: 'Cupão atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar cupão
router.delete('/coupons/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM coupon_codes WHERE id=?', [req.params.id]);
    res.json({ message: 'Cupão eliminado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ UTILIZADORES ============

// Atualizar utilizador
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const sql = 'UPDATE users SET name=?, email=?, role=? WHERE id=?';
    await runQuery(sql, [name, email, role, req.params.id]);
    res.json({ message: 'Utilizador atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar utilizador
router.delete('/users/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM users WHERE id=?', [req.params.id]);
    res.json({ message: 'Utilizador eliminado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ CONTACTOS ============

// Criar contacto
router.post('/contacts', async (req, res) => {
  try {
    const { email, phone, address, city } = req.body;
    const sql = 'INSERT INTO contacts (email, phone, address, city) VALUES (?, ?, ?, ?)';
    const result = await runQuery(sql, [email, phone, address, city]);
    res.json({ id: result.lastID, message: 'Contacto criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar contacto
router.put('/contacts/:id', async (req, res) => {
  try {
    const { email, phone, address, city } = req.body;
    const sql = 'UPDATE contacts SET email=?, phone=?, address=?, city=? WHERE id=?';
    await runQuery(sql, [email, phone, address, city, req.params.id]);
    res.json({ message: 'Contacto atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar contacto
router.delete('/contacts/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM contacts WHERE id=?', [req.params.id]);
    res.json({ message: 'Contacto eliminado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
