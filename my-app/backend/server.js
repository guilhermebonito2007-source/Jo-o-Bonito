const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./database');
const logger = require('./utils/logger');
const {
  securityMiddleware,
  globalLimiter,
  errorHandler,
  requestLogger
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE DE SEGURANÇA =====
securityMiddleware(app);

// Logging de Requisições
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(req.method, req.path, res.statusCode, duration);
  });
  next();
});

// JSON Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS - Configuração Segura
const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || defaultOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Auth']
};
app.use(cors(corsOptions));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../src')));

// ===== ROTAS =====
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const managementRoutes = require('./routes/management');
const authRoutes = require('./routes/auth');

// Compatibilidade para ecrãs antigos de administração/CRUD.
app.get('/api/users', async (req, res) => {
  try {
    const { getAll } = require('./database');
    const users = await getAll(
      `SELECT id, email, first_name, last_name, phone, address, city, role, is_active, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { getAll } = require('./database');
    const orders = await getAll(
      `SELECT o.*, o.total_price as total, u.email, u.first_name, u.last_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/payments', async (req, res) => {
  try {
    const { getAll } = require('./database');
    const payments = await getAll(
      `SELECT p.*, o.order_number
       FROM payments p
       LEFT JOIN orders o ON p.order_id = o.id
       ORDER BY p.created_at DESC`
    );
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/activity-log', async (req, res) => {
  try {
    const { getAll } = require('./database');
    const activities = await getAll(
      `SELECT al.*, u.email, u.first_name, u.last_name
       FROM activity_log al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT 500`
    );
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports/top-products', async (req, res) => {
  try {
    const { getAll } = require('./database');
    const topProducts = await getAll(
      `SELECT p.id, p.name, COUNT(oi.id) as sold_count, SUM(oi.quantity) as total_quantity
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       GROUP BY oi.product_id
       ORDER BY total_quantity DESC
       LIMIT 10`
    );
    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/management', managementRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor ativo' });
});

// Debug endpoint - Mostrar estatísticas da BD
app.get('/api/debug/db-stats', async (req, res) => {
  try {
    const { getAll } = require('./database');
    const productCount = await getAll('SELECT COUNT(*) as count FROM products');
    const categoryCount = await getAll('SELECT COUNT(*) as count FROM categories');
    const products = await getAll('SELECT id, name, price, stock FROM products LIMIT 5');
    const categories = await getAll('SELECT * FROM categories');

    res.json({
      productCount: productCount[0]?.count || 0,
      categoryCount: categoryCount[0]?.count || 0,
      sampleProducts: products,
      categories: categories,
      dbFile: require('path').join(__dirname, '../database/loja_sende.db')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoints para visualizador
app.get('/api/categories', async (req, res) => {
  try {
    const { getAll } = require('./database');
    const categories = await getAll('SELECT * FROM categories');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/coupons', async (req, res) => {
  try {
    const { getAll } = require('./database');
    const coupons = await getAll(`
      SELECT *,
             CASE WHEN discount_percent IS NOT NULL THEN 'percentage' ELSE 'fixed' END as discount_type,
             COALESCE(discount_percent, discount_fixed, 0) as discount_value
      FROM coupon_codes
    `);
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const { getAll } = require('./database');
    const contacts = await getAll('SELECT * FROM contacts');
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ENDPOINT DE TESTE - Simular login admin
app.get('/api/test/admin-login', async (req, res) => {
  try {
    const { getOne } = require('./database');
    const admin = await getOne('SELECT id, email, role FROM users WHERE role = ? LIMIT 1', ['admin']);
    if (admin) {
      res.json({
        success: true,
        user: {
          id: admin.id,
          email: admin.email,
          firstName: 'Admin',
          lastName: 'Test',
          role: admin.role
        }
      });
    } else {
      res.status(404).json({ error: 'Admin não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ERROR HANDLER =====
app.use(errorHandler);

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// ===== INICIAR SERVIDOR =====
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`🌐 Servidor rodando em http://localhost:${PORT}`);
      logger.info(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    logger.error('❌ Erro ao iniciar servidor:', { error: err.message });
    process.exit(1);
  });

module.exports = app;
