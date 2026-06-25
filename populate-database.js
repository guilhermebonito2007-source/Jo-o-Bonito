const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/loja_sende.db');
const SCHEMA_PATH = path.join(__dirname, '../database/schema.sql');
const DATA_PATH = path.join(__dirname, '../database/complete-data.sql');

console.log('🚀 Preenchendo base de dados com dados de exemplo...\n');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar à base de dados:', err);
    process.exit(1);
  }
  console.log('✓ Conectado à base de dados SQLite');
});

// Ler e executar os dados
const data = fs.readFileSync(DATA_PATH, 'utf8');

// Dividir em statements individuais e executar
const statements = data.split(';').filter(s => s.trim());

let executed = 0;
let errors = [];

statements.forEach((statement, index) => {
  const trimmed = statement.trim();
  if (!trimmed) return;

  db.run(trimmed, function(err) {
    if (err) {
      errors.push(`Statement ${index + 1}: ${err.message}`);
    } else {
      executed++;
      if (executed % 10 === 0) {
        console.log(`✓ ${executed} registos inseridos...`);
      }
    }

    // Quando terminar o último statement
    if (executed + errors.length === statements.length) {
      finishDatabase(db, executed, errors);
    }
  });
});

function finishDatabase(db, executed, errors) {
  console.log('\n✅ Importação de dados concluída!');
  console.log(`📊 ${executed} registos inseridos com sucesso`);
  
  if (errors.length > 0) {
    console.log(`⚠️  ${errors.length} erros durante a importação (pode ser normal se os dados já existem):`);
    errors.slice(0, 5).forEach(err => console.log(`   - ${err}`));
    if (errors.length > 5) {
      console.log(`   ... e ${errors.length - 5} mais erros`);
    }
  }

  console.log('\n📋 Resumo de dados:');
  
  // Contar registos
  db.all(`
    SELECT 
      (SELECT COUNT(*) FROM categories) as categories,
      (SELECT COUNT(*) FROM products) as products,
      (SELECT COUNT(*) FROM users) as users,
      (SELECT COUNT(*) FROM coupon_codes) as coupons,
      (SELECT COUNT(*) FROM contacts) as contacts
  `, (err, rows) => {
    if (rows && rows.length > 0) {
      const data = rows[0];
      console.log(`  • Categorias: ${data.categories}`);
      console.log(`  • Produtos: ${data.products}`);
      console.log(`  • Utilizadores: ${data.users}`);
      console.log(`  • Cupões: ${data.coupons}`);
      console.log(`  • Contactos: ${data.contacts}`);
    }

    console.log('\n🎉 Base de dados pronta para apresentação!');
    db.close();
  });
}
