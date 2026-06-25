const express = require('express');
const router = express.Router();
const { getAll, getOne, runQuery } = require('../database');

// Gerar número de encomenda
const generateOrderNumber = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Criar encomenda
router.post('/', async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod, notes } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    const orderNumber = generateOrderNumber();

    // Criar encomenda
    const result = await runQuery(
      `INSERT INTO orders (user_id, order_number, total_price, payment_method, shipping_address, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId || null, orderNumber, totalPrice, paymentMethod, JSON.stringify(shippingAddress), notes]
    );

    const orderId = result.id;

    // Adicionar itens da encomenda
    for (const item of cartItems) {
      await runQuery(
        `INSERT INTO order_items (order_id, product_id, quantity, price, selected_options)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price, JSON.stringify(item.selectedOptions || {})]
      );

      // Atualizar stock do produto
      await runQuery(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    // Limpar carrinho
    if (userId) {
      await runQuery('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    }

    res.json({
      success: true,
      orderId,
      orderNumber,
      message: 'Encomenda criada com sucesso'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter encomendas do utilizador
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await getAll(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId]
    );

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter detalhes da encomenda
router.get('/:orderId', async (req, res) => {
  try {
    const order = await getOne('SELECT * FROM orders WHERE id = ?', [req.params.orderId]);

    if (!order) {
      return res.status(404).json({ error: 'Encomenda não encontrada' });
    }

    const items = await getAll(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [req.params.orderId]
    );

    order.items = items;
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar status da encomenda
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;

    const validStatus = ['pendente', 'processada', 'enviada', 'entregue', 'cancelada'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    await runQuery(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.params.orderId]
    );

    res.json({ success: true, message: 'Status atualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancelar encomenda
router.put('/:orderId/cancel', async (req, res) => {
  try {
    const order = await getOne('SELECT * FROM orders WHERE id = ?', [req.params.orderId]);

    if (!order) {
      return res.status(404).json({ error: 'Encomenda não encontrada' });
    }

    if (['entregue', 'cancelada'].includes(order.status)) {
      return res.status(400).json({ error: 'Esta encomenda não pode ser cancelada' });
    }

    await runQuery(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['cancelada', req.params.orderId]
    );

    // Devolver stock
    const items = await getAll('SELECT * FROM order_items WHERE order_id = ?', [req.params.orderId]);
    for (const item of items) {
      await runQuery(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    res.json({ success: true, message: 'Encomenda cancelada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
