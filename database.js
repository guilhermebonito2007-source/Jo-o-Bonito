const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/loja_sende.db');

let db = null;

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Erro ao conectar à base de dados:', err);
        reject(err);
      } else {
        console.log('✓ Conectado à base de dados SQLite');
        resolve();
      }
    });
  });
};

const getDb = () => {
  if (!db) {
    throw new Error('Base de dados não inicializada');
  }
  return db;
};

// Executar query com Promise
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDb().run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Obter um registo
const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDb().get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Obter múltiplos registos
const getAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDb().all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

module.exports = {
  initDatabase,
  getDb,
  runQuery,
  getOne,
  getAll
};
