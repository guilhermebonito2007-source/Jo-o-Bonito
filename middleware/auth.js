// Middleware de Autenticação
const jwt = require('jsonwebtoken');
const { getOne } = require('../database');

// Middleware de Verificação de JWT
const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// Middleware de Verificação de Admin
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware de Verificação de Autenticação (Cookie/Session)
const requireAuth = async (req, res, next) => {
  try {
    const adminAuth = req.headers['x-admin-auth'];
    
    if (!adminAuth) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Verificar se é JSON válido
    let authData;
    try {
      authData = JSON.parse(Buffer.from(adminAuth, 'base64').toString());
    } catch {
      return res.status(401).json({ error: 'Dados de autenticação inválidos' });
    }

    // Verificar se utilizador existe e é admin
    const user = await getOne(
      'SELECT id, email, role FROM users WHERE id = ? AND role = ?',
      [authData.id, 'admin']
    );

    if (!user) {
      return res.status(401).json({ error: 'Utilizador não encontrado ou sem permissões' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware para Verificar Proprietário do Recurso
const verifyOwnership = async (req, res, next) => {
  try {
    const resourceUserId = req.params.userId || req.body.userId;
    
    if (req.user.role !== 'admin' && req.user.id !== parseInt(resourceUserId)) {
      return res.status(403).json({ error: 'Acesso negado a este recurso' });
    }
    
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware para Validar ID de Recurso
const validateResourceId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      return res.status(400).json({ error: 'ID de recurso inválido' });
    }
    
    next();
  };
};

// Middleware de Rate Limit por Utilizador
const rateLimitByUser = require('express-rate-limit')({
  keyGenerator: (req) => req.user?.id || req.ip,
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições, tente novamente mais tarde'
});

// Middleware para Definir Período de Expiração de Cache
const setCacheControl = (maxAge = 3600) => {
  return (req, res, next) => {
    res.set('Cache-Control', `public, max-age=${maxAge}`);
    next();
  };
};

module.exports = {
  verifyJWT,
  requireAdmin,
  requireAuth,
  verifyOwnership,
  validateResourceId,
  rateLimitByUser,
  setCacheControl
};
