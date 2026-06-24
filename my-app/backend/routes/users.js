const express = require('express');
const bcrypt = require('bcryptjs');
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

// Registar utilizador
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios' });
    }

    // Verificar se utilizador existe
    const existing = await getOne('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email já registado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Adicionar utilizador
    const result = await runQuery(
      `INSERT INTO users (email, password, first_name, last_name, phone, role)
       VALUES (?, ?, ?, ?, ?, 'customer')`,
      [email, hashedPassword, firstName, lastName, phone]
    );

    res.json({
      success: true,
      userId: result.id,
      message: 'Utilizador registado com sucesso'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios' });
    }

    const user = await getOne(
      'SELECT id, email, first_name, last_name, password, role FROM users WHERE email = ? AND is_active = 1',
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Comparar password com hash
    const validPassword = await bcrypt.compare(password, user.password || '');
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Registar atividade
    await runQuery(
      'INSERT INTO activity_log (user_id, action, description) VALUES (?, ?, ?)',
      [user.id, 'login', 'Utilizador fez login']
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter perfil
router.get('/:userId', async (req, res) => {
  try {
    const user = await getOne(
      `SELECT id, email, first_name, last_name, phone, address, city, postal_code, 
              country, role, created_at FROM users WHERE id = ?`,
      [req.params.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar perfil
router.put('/:userId', async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, postalCode } = req.body;

    await runQuery(
      `UPDATE users 
       SET first_name = ?, last_name = ?, phone = ?, address = ?, city = ?, postal_code = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [firstName, lastName, phone, address, city, postalCode, req.params.userId]
    );

    // Registar atividade
    await runQuery(
      'INSERT INTO activity_log (user_id, action, description) VALUES (?, ?, ?)',
      [req.params.userId, 'profile_update', 'Perfil atualizado']
    );

    res.json({ success: true, message: 'Perfil atualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter histórico de atividade (admin)
router.get('/admin/activity/log', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const activities = await getAll(
      `SELECT al.*, u.email, u.first_name, u.last_name 
       FROM activity_log al 
       LEFT JOIN users u ON al.user_id = u.id 
       ORDER BY al.created_at DESC LIMIT 1000`,
      []
    );

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
