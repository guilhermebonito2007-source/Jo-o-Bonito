const express = require('express');
const router = express.Router();
const { getAll, getOne, runQuery } = require('../database');

// Obter carrinho do utilizador
router.get('/:userId', async (req, res) => {
  try {
    const items = await getAll(
      `SELECT ci.*, p.name, p.price, p.image_url 
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.user_id = ?`,
      [req.params.userId]
    );

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      items,
      total: parseFloat(total.toFixed(2))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adicionar ao carrinho
router.post('/', async (req, res) => {
  try {
    const { userId, sessionId, productId, quantity, selectedOptions, price } = req.body;

    if (!productId || !quantity || !price) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta' });
    }

    // Verificar se o produto já existe no carrinho
    const existing = await getOne(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND selected_options = ?',
      [userId || null, productId, JSON.stringify(selectedOptions || {})]
    );

    if (existing) {
      // Atualizar quantidade
      await runQuery(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing.id]
      );
      return res.json({ success: true, message: 'Quantidade atualizada' });
    }

    // Adicionar novo item
    await runQuery(
      `INSERT INTO cart_items (user_id, product_id, quantity, selected_options, price, session_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId || null, productId, quantity, JSON.stringify(selectedOptions || {}), price, sessionId]
    );

    res.json({ success: true, message: 'Produto adicionado ao carrinho' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar quantidade
router.put('/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity <= 0) {
      // Remover item
      await runQuery('DELETE FROM cart_items WHERE id = ?', [req.params.itemId]);
      return res.json({ success: true, message: 'Produto removido' });
    }

    await runQuery(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, req.params.itemId]
    );

    res.json({ success: true, message: 'Quantidade atualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remover do carrinho
router.delete('/:itemId', async (req, res) => {
  try {
    await runQuery('DELETE FROM cart_items WHERE id = ?', [req.params.itemId]);
    res.json({ success: true, message: 'Produto removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Limpar carrinho
router.delete('/user/:userId', async (req, res) => {
  try {
    await runQuery('DELETE FROM cart_items WHERE user_id = ?', [req.params.userId]);
    res.json({ success: true, message: 'Carrinho limpo' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
