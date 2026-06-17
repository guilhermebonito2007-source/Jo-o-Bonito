const express = require('express');
const router = express.Router();
const { getAll, getOne, runQuery } = require('../database');

// Criar pagamento
router.post('/', async (req, res) => {
  try {
    const { orderId, amount, method, reference, transactionId } = req.body;

    if (!orderId || !amount || !method) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta' });
    }

    // Validar encomenda
    const order = await getOne('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      return res.status(404).json({ error: 'Encomenda não encontrada' });
    }

    // Criar pagamento
    const result = await runQuery(
      `INSERT INTO payments (order_id, amount, method, reference, transaction_id)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, amount, method, reference, transactionId]
    );

    // Se o pagamento for confirmado, atualizar status da encomenda
    if (method === 'confirmado') {
      await runQuery(
        'UPDATE orders SET payment_status = ? WHERE id = ?',
        ['pago', orderId]
      );
    }

    res.json({
      success: true,
      paymentId: result.id,
      message: 'Pagamento registado'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter pagamentos da encomenda
router.get('/order/:orderId', async (req, res) => {
  try {
    const payments = await getAll(
      'SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC',
      [req.params.orderId]
    );

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar status de pagamento
router.put('/:paymentId/status', async (req, res) => {
  try {
    const { status } = req.body;

    const validStatus = ['pendente', 'confirmado', 'falhado', 'reembolso'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const payment = await getOne('SELECT * FROM payments WHERE id = ?', [req.params.paymentId]);
    if (!payment) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }

    await runQuery(
      'UPDATE payments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.params.paymentId]
    );

    // Se confirmado, atualizar encomenda
    if (status === 'confirmado') {
      await runQuery(
        'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
        ['pago', 'processada', payment.order_id]
      );
    }

    res.json({ success: true, message: 'Status atualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Processar pagamento MBWay
router.post('/mbway/process', async (req, res) => {
  try {
    const { orderId, phone } = req.body;

    // TODO: Implementar integração com API do MBWay
    const result = await runQuery(
      `INSERT INTO payments (order_id, amount, method, status, reference)
       SELECT id, total_price, ?, ?, ?
       FROM orders WHERE id = ?`,
      ['mbway', 'pendente', phone, orderId]
    );

    res.json({
      success: true,
      paymentId: result.id,
      message: 'Pagamento MBWay enviado'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gerar referência Multibanco
router.post('/multibanco/generate', async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await getOne('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      return res.status(404).json({ error: 'Encomenda não encontrada' });
    }

    // TODO: Integrar com serviço de geração de Multibanco
    const reference = {
      entity: '12345',
      reference: Math.random().toString().substring(2, 10),
      amount: order.total_price
    };

    const result = await runQuery(
      `INSERT INTO payments (order_id, amount, method, status, reference)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, order.total_price, 'multibanco', 'pendente', JSON.stringify(reference)]
    );

    res.json({
      success: true,
      paymentId: result.id,
      reference
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
