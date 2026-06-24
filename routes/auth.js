// Rotas de Autenticação - Login, Logout, Validação
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getOne, runQuery } = require('../database');
const { loginLimiter } = require('../middleware/security');
const { validateEmail, validatePassword } = require('../middleware/security');
const logger = require('../utils/logger');

// POST /auth/login - Login com email e senha
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação de Input
    if (!email || !password) {
      logger.security('Failed login attempt - missing credentials', { 
        email: email ? 'provided' : 'missing',
        ip: req.ip 
      });
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Validar formato de email
    if (!validateEmail(email)) {
      logger.security('Failed login attempt - invalid email format', { 
        email,
        ip: req.ip 
      });
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Buscar utilizador
    const user = await getOne(
      'SELECT id, email, password, role, first_name, last_name FROM users WHERE email = ? AND role = ?',
      [email, 'admin']
    );

    if (!user) {
      logger.security('Failed login attempt - user not found or not admin', { 
        email,
        ip: req.ip 
      });
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Comparar senhas
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.security('Failed login attempt - invalid password', { 
        email,
        ip: req.ip 
      });
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Gerar JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`
      },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Registar login bem-sucedido
    logger.audit('Admin login successful', user.id, 'users', {});
    logger.security('Admin login success', { 
      userId: user.id,
      email: user.email,
      ip: req.ip 
    });

    // Responder com token e dados do utilizador
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`
      }
    });

  } catch (err) {
    logger.error('Login error', { error: err.message });
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// POST /auth/logout - Logout (token invalidado no frontend)
router.post('/logout', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(400).json({ error: 'Token não fornecido' });
    }

    // Log do logout
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      logger.audit('Admin logout', decoded.id, 'users', {});
      logger.security('Admin logout', { userId: decoded.id, email: decoded.email });
    } catch (err) {
      // Token já expirado, mas ainda vamos responder positivamente
    }

    res.json({ success: true, message: 'Logout realizado com sucesso' });

  } catch (err) {
    logger.error('Logout error', { error: err.message });
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// GET /auth/verify - Verificar validade do token
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ valid: false, error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

    res.json({
      valid: true,
      user: decoded
    });

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ valid: false, error: 'Token expirado' });
    }
    return res.status(401).json({ valid: false, error: 'Token inválido' });
  }
});

// POST /auth/refresh - Renovar token
router.post('/refresh', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', {
      ignoreExpiration: true
    });

    // Gerar novo token
    const newToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      token: newToken
    });

  } catch (err) {
    logger.error('Token refresh error', { error: err.message });
    res.status(401).json({ error: 'Não foi possível renovar o token' });
  }
});

// POST /auth/change-password - Mudar palavra-passe (requer autenticação)
router.post('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { currentPassword, newPassword } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Validar novo password
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ 
        error: 'Palavra-passe fraca. Mínimo 8 caracteres, 1 maiúscula e 1 número' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

    // Buscar utilizador
    const user = await getOne('SELECT password FROM users WHERE id = ?', [decoded.id]);

    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    // Validar password atual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      logger.security('Failed password change attempt - invalid current password', {
        userId: decoded.id,
        email: decoded.email
      });
      return res.status(401).json({ error: 'Palavra-passe atual incorreta' });
    }

    // Hash da nova password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar password
    await runQuery(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, decoded.id]
    );

    logger.audit('Password changed', decoded.id, 'users', {});
    logger.security('Admin password changed', { userId: decoded.id, email: decoded.email });

    res.json({ success: true, message: 'Palavra-passe alterada com sucesso' });

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    logger.error('Change password error', { error: err.message });
    res.status(500).json({ error: 'Erro ao alterar palavra-passe' });
  }
});

module.exports = router;
