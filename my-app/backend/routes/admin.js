const express = require('express');
const router = express.Router();
const { getAll, getOne, runQuery } = require('../database');

// Middleware de autenticação
const isAuthenticated = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  req.userId = userId;
  next();
};

// Middleware de admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await getOne('SELECT role FROM users WHERE id = ?', [req.userId]);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas admin' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dashboard - Resumo geral
router.get('/dashboard', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const totalUsers = await getOne('SELECT COUNT(*) as count FROM users WHERE role = "customer"');
    const totalOrders = await getOne('SELECT COUNT(*) as count FROM orders');
    const totalRevenue = await getOne('SELECT SUM(total_price) as total FROM orders WHERE status != "cancelada"');
    const pendingOrders = await getOne('SELECT COUNT(*) as count FROM orders WHERE status = "pendente"');
    const totalProducts = await getOne('SELECT COUNT(*) as count FROM products');
    const lowStockProducts = await getOne('SELECT COUNT(*) as count FROM products WHERE stock < 10');

    res.json({
      totalUsers: totalUsers?.count || 0,
      totalOrders: totalOrders?.count || 0,
      totalRevenue: totalRevenue?.total || 0,
      pendingOrders: pendingOrders?.count || 0,
      totalProducts: totalProducts?.count || 0,
      lowStockProducts: lowStockProducts?.count || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todas as encomendas
router.get('/orders', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const orders = await getAll(
      `SELECT o.*, u.email, u.first_name, u.last_name 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`,
      []
    );

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Detalhe de encomenda
router.get('/orders/:orderId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const order = await getOne('SELECT * FROM orders WHERE id = ?', [req.params.orderId]);

    if (!order) {
      return res.status(404).json({ error: 'Encomenda não encontrada' });
    }

    const items = await getAll(
      `SELECT oi.*, p.name, p.image_url, p.sku 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [req.params.orderId]
    );

    const payments = await getAll(
      'SELECT * FROM payments WHERE order_id = ?',
      [req.params.orderId]
    );

    order.items = items;
    order.payments = payments;

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar status de encomenda
router.put('/orders/:orderId/status', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pendente', 'processada', 'enviada', 'entregue', 'cancelada'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    await runQuery(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.params.orderId]
    );

    // Registar atividade
    await runQuery(
      'INSERT INTO activity_log (user_id, action, description) VALUES (?, ?, ?)',
      [req.userId, 'order_status_update', `Encomenda ${req.params.orderId} atualizada para ${status}`]
    );

    res.json({ success: true, message: 'Status atualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todos os utilizadores
router.get('/users', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await getAll(
      `SELECT id, email, first_name, last_name, phone, address, city, role, is_active, created_at 
       FROM users 
       WHERE role = 'customer'
       ORDER BY created_at DESC`,
      []
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Detalhe do utilizador
router.get('/users/:userId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const user = await getOne(
      'SELECT * FROM users WHERE id = ?',
      [req.params.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    // Obter encomendas do utilizador
    const orders = await getAll(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId]
    );

    // Obter atividades do utilizador
    const activities = await getAll(
      'SELECT * FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [req.params.userId]
    );

    res.json({
      user,
      orders,
      activities
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar pagamentos
router.get('/payments', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const payments = await getAll(
      `SELECT p.*, o.order_number, o.total_price, u.email, u.first_name, u.last_name
       FROM payments p
       JOIN orders o ON p.order_id = o.id
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY p.created_at DESC`,
      []
    );

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Relatório de vendas por período
router.get('/reports/sales', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = req.query.endDate || new Date().toISOString().split('T')[0];

    const sales = await getAll(
      `SELECT DATE(created_at) as date, COUNT(*) as orders, SUM(total_price) as revenue
       FROM orders
       WHERE DATE(created_at) BETWEEN ? AND ? AND status != 'cancelada'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [startDate, endDate]
    );

    const totalSales = await getOne(
      `SELECT COUNT(*) as count, SUM(total_price) as total
       FROM orders
       WHERE DATE(created_at) BETWEEN ? AND ? AND status != 'cancelada'`,
      [startDate, endDate]
    );

    res.json({
      period: { startDate, endDate },
      sales,
      summary: totalSales
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Relatório de produtos mais vendidos
router.get('/reports/top-products', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const limit = req.query.limit || 10;

    const topProducts = await getAll(
      `SELECT p.id, p.name, p.sku, p.price, COUNT(oi.id) as sold_count, SUM(oi.quantity) as total_quantity
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       GROUP BY p.id
       ORDER BY total_quantity DESC
       LIMIT ?`,
      [limit]
    );

    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Histórico de atividades
router.get('/activity-log', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const limit = req.query.limit || 500;
    const activities = await getAll(
      `SELECT al.*, u.email, u.first_name, u.last_name 
       FROM activity_log al 
       LEFT JOIN users u ON al.user_id = u.id 
       ORDER BY al.created_at DESC 
       LIMIT ?`,
      [limit]
    );

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar contactos/suporte
router.get('/contacts', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const contacts = await getAll(
      'SELECT * FROM contacts ORDER BY created_at DESC',
      []
    );

    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Marcar contacto como lido/respondido
router.put('/contacts/:contactId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    await runQuery(
      'UPDATE contacts SET status = ? WHERE id = ?',
      [status, req.params.contactId]
    );

    res.json({ success: true, message: 'Contacto atualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
