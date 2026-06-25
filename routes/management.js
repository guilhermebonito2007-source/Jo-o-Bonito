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
    res.json({ id: result.id, message: 'Produto criado com sucesso' });
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
    res.json({ id: result.id, message: 'Categoria criada com sucesso' });
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

// ============ CUPÃ•ES ============

// Criar cupÃ£o
router.post('/coupons', async (req, res) => {
  try {
    const { code, discount_type, discount_value, max_uses, used_count } = req.body;
    const discountPercent = discount_type === 'percentage' ? discount_value : null;
    const discountFixed = discount_type === 'fixed' ? discount_value : null;
    const sql = `
      INSERT INTO coupon_codes (code, discount_percent, discount_fixed, max_uses, used_count, active)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await runQuery(sql, [code, discountPercent, discountFixed, max_uses || 999, used_count || 0, 1]);
    res.json({ id: result.id, message: 'Cupão criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar cupão
router.put('/coupons/:id', async (req, res) => {
  try {
    const { code, discount_type, discount_value, max_uses } = req.body;
    const discountPercent = discount_type === 'percentage' ? discount_value : null;
    const discountFixed = discount_type === 'fixed' ? discount_value : null;
    const sql = `
      UPDATE coupon_codes
      SET code=?, discount_percent=?, discount_fixed=?, max_uses=?
      WHERE id=?
    `;
    await runQuery(sql, [code, discountPercent, discountFixed, max_uses, req.params.id]);
    res.json({ message: 'Cupão atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar cupÃ£o
router.delete('/coupons/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM coupon_codes WHERE id=?', [req.params.id]);
    res.json({ message: 'CupÃ£o eliminado com sucesso' });
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
    const { name, email, phone, address, city, subject, message } = req.body;
    const sql = 'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)';
    const result = await runQuery(sql, [
      name || email,
      email,
      phone || '',
      subject || city || 'Contacto',
      message || address || 'Sem mensagem'
    ]);
    res.json({ id: result.id, message: 'Contacto criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar contacto
router.put('/contacts/:id', async (req, res) => {
  try {
    const { name, email, phone, address, city, subject, message, status } = req.body;
    const sql = 'UPDATE contacts SET name=?, email=?, phone=?, subject=?, message=?, status=? WHERE id=?';
    await runQuery(sql, [
      name || email,
      email,
      phone || '',
      subject || city || 'Contacto',
      message || address || 'Sem mensagem',
      status || 'nao_lido',
      req.params.id
    ]);
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


