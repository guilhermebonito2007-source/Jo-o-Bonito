// Sistema de Logging
const fs = require('fs');
const path = require('path');

// Criar diretório de logs se não existir
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const CURRENT_LOG_LEVEL = LOG_LEVELS[LOG_LEVEL.toUpperCase()] || LOG_LEVELS.INFO;

// Formatar data em formato ISO
const formatDate = () => {
  return new Date().toISOString();
};

// Determinar nome do arquivo de log baseado na data
const getLogFile = (logType = 'app') => {
  const date = new Date();
  const filename = `${logType}-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.log`;
  return path.join(logsDir, filename);
};

// Escrever no arquivo de log
const writeToFile = (logType, level, message, data = {}) => {
  const logEntry = {
    timestamp: formatDate(),
    level,
    message,
    data,
    pid: process.pid
  };

  const logFile = getLogFile(logType);
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
};

// Logger - Erro
const error = (message, data = {}) => {
  if (CURRENT_LOG_LEVEL >= LOG_LEVELS.ERROR) {
    console.error(`❌ [ERROR] ${formatDate()} - ${message}`, data);
    writeToFile('error', 'ERROR', message, data);
  }
};

// Logger - Aviso
const warn = (message, data = {}) => {
  if (CURRENT_LOG_LEVEL >= LOG_LEVELS.WARN) {
    console.warn(`⚠️ [WARN] ${formatDate()} - ${message}`, data);
    writeToFile('app', 'WARN', message, data);
  }
};

// Logger - Info
const info = (message, data = {}) => {
  if (CURRENT_LOG_LEVEL >= LOG_LEVELS.INFO) {
    console.log(`ℹ️ [INFO] ${formatDate()} - ${message}`, data);
    writeToFile('app', 'INFO', message, data);
  }
};

// Logger - Debug
const debug = (message, data = {}) => {
  if (CURRENT_LOG_LEVEL >= LOG_LEVELS.DEBUG) {
    console.debug(`🐛 [DEBUG] ${formatDate()} - ${message}`, data);
    writeToFile('app', 'DEBUG', message, data);
  }
};

// Logger de Segurança
const security = (event, details = {}) => {
  const logEntry = {
    timestamp: formatDate(),
    event,
    details,
    level: 'SECURITY'
  };
  
  console.log(`🔒 [SECURITY] ${formatDate()} - ${event}`, details);
  writeToFile('security', 'SECURITY', event, details);
};

// Logger de Auditoria
const audit = (action, userId, resource, changes = {}) => {
  const logEntry = {
    timestamp: formatDate(),
    action,
    userId,
    resource,
    changes,
    level: 'AUDIT'
  };
  
  writeToFile('audit', 'AUDIT', `${action} by user ${userId}`, { resource, changes });
};

// Logger de Requisições HTTP
const http = (method, path, statusCode, duration, userId = null) => {
  const logLevel = statusCode >= 400 ? 'WARN' : 'INFO';
  writeToFile('http', logLevel, `${method} ${path}`, {
    statusCode,
    duration: `${duration}ms`,
    userId
  });
};

// Limpar logs antigos (mais de 30 dias)
const cleanOldLogs = () => {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  fs.readdirSync(logsDir).forEach(file => {
    const filePath = path.join(logsDir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.mtimeMs < thirtyDaysAgo) {
      fs.unlinkSync(filePath);
      info(`Arquivo de log antigo eliminado: ${file}`);
    }
  });
};

// Executar limpeza de logs uma vez por dia
setInterval(cleanOldLogs, 24 * 60 * 60 * 1000);

module.exports = {
  error,
  warn,
  info,
  debug,
  security,
  audit,
  http
};
