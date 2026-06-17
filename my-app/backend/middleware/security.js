// Configuração de Segurança - middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss');

// Rate Limiter Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições
  message: 'Muitas requisições deste IP, tente novamente mais tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiter para Login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: 'Muitas tentativas de login, tente novamente em 15 minutos',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiter para API
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // máximo 30 requisições
  message: 'Muitas requisições à API, tente novamente mais tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de Segurança Geral
const securityMiddleware = (app) => {
  // Helmet - Define headers HTTP seguros
  app.use(helmet());
  
  // Rate Limiting
  app.use(globalLimiter);
};

// Validação de Email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

// Validação de Senha
const validatePassword = (password) => {
  // Mínimo 8 caracteres, pelo menos 1 maiúscula, 1 número
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password) && password.length <= 128;
};

// Validação de Campos de Produto
const validateProduct = (product) => {
  const errors = [];
  
  if (!product.name || product.name.trim().length === 0) {
    errors.push('Nome do produto é obrigatório');
  }
  if (product.name && product.name.length > 255) {
    errors.push('Nome do produto muito longo (máximo 255 caracteres)');
  }
  
  if (!product.price || product.price < 0) {
    errors.push('Preço inválido');
  }
  if (product.price > 999999.99) {
    errors.push('Preço muito elevado');
  }
  
  if (product.stock === undefined || product.stock < 0) {
    errors.push('Stock inválido');
  }
  if (product.stock > 9999999) {
    errors.push('Stock muito elevado');
  }
  
  if (!product.category_id || product.category_id <= 0) {
    errors.push('Categoria inválida');
  }
  
  return errors;
};

// Sanitização de String (XSS Prevention)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return xss(str, {
    whiteList: {}, // Sem tags HTML permitidas
    stripIgnoredTag: true,
    stripLeadingAndTrailingWhitespace: true
  }).slice(0, 255); // Limitar tamanho
};

// Validação de URL
const validateURL = (url) => {
  if (!url) return true; // URL é opcional
  try {
    new URL(url);
    return url.length <= 2048;
  } catch {
    return false;
  }
};

// Middleware de Tratamento de Erro Global
const errorHandler = (err, req, res, next) => {
  const logger = require('../utils/logger');
  
  logger.error('Erro detectado', {
    path: req.path,
    method: req.method,
    error: err.message
  });

  // Validação de Erro
  if (err.status === 400) {
    return res.status(400).json({ error: 'Pedido inválido', details: err.message });
  }

  // Erro de Autenticação
  if (err.status === 401) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  // Erro de Autorização
  if (err.status === 403) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  // Erro não encontrado
  if (err.status === 404) {
    return res.status(404).json({ error: 'Recurso não encontrado' });
  }

  // Erro de Conflito
  if (err.status === 409) {
    return res.status(409).json({ error: 'Conflito: Recurso já existe' });
  }

  // Erro genérico de servidor
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Tente novamente mais tarde'
  });
};

// Middleware de Logging
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
    
    console.log(`[${logLevel}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
};

module.exports = {
  globalLimiter,
  loginLimiter,
  apiLimiter,
  securityMiddleware,
  validateEmail,
  validatePassword,
  validateProduct,
  sanitizeString,
  validateURL,
  errorHandler,
  requestLogger
};
