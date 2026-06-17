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
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
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
    const coupons = await getAll('SELECT * FROM coupon_codes');
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
