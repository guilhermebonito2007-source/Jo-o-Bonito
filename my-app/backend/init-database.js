const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/loja_sende.db');
const SCHEMA_PATH = path.join(__dirname, '../database/schema.sql');

console.log('🚀 Inicializando base de dados...');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar à base de dados:', err);
    process.exit(1);
  }
  console.log('✓ Conectado à base de dados SQLite');
});

// Ler e executar o schema
const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error('❌ Erro ao criar tabelas:', err);
    process.exit(1);
  }
  console.log('✓ Tabelas criadas com sucesso');

  // Inserir categorias iniciais
  const categories = [
    { name: 'Produtos De Limpeza', description: 'Produtos para limpeza da casa' },
    { name: 'Produtos de Drogarias', description: 'Produtos variados de drogaria' },
    { name: 'Fertilizantes', description: 'Fertilizantes e produtos agrícolas' },
    { name: 'Produtos De Higiene Pessoal', description: 'Artigos de higiene pessoal' },
    { name: 'Produtos Plásticos', description: 'Produtos de plástico diversos' }
  ];

  let inserted = 0;
  categories.forEach(cat => {
    db.run(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [cat.name, cat.description],
      function(err) {
        if (err) {
          // Categorias podem já existir
          console.log(`ℹ️ Categoria ${cat.name} já existe ou erro ao inserir`);
        } else {
          inserted++;
          console.log(`✓ Categoria inserida: ${cat.name}`);
        }
        
        if (inserted === categories.length || inserted === 0) {
          // Criar conta admin
          createAdminUser(db);
        }
      }
    );
  });

  // Se nenhuma categoria foi inserida (já existem), criar admin mesmo assim
  if (categories.length === 0) {
    createAdminUser(db);
  }
});

// Função para criar conta admin
async function createAdminUser(db) {
  try {
    // Verificar se admin já existe
    db.get('SELECT id FROM users WHERE role = "admin"', async (err, row) => {
      if (err) {
        console.error('Erro ao verificar admin:', err);
        finishDatabase(db);
        return;
      }

      if (row) {
        console.log('ℹ️ Conta admin já existe na base de dados');
        finishDatabase(db);
        return;
      }

      // Hash password
      const adminPassword = 'Admin@123';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Criar admin
      db.run(
        `INSERT INTO users (email, password, first_name, last_name, phone, role, is_active)
         VALUES (?, ?, ?, ?, ?, 'admin', 1)`,
        ['admin@loja.pt', hashedPassword, 'Admin', 'Loja', '916000000'],
        (err) => {
          if (err) {
            console.error('Erro ao criar admin:', err);
          } else {
            console.log('✓ Conta admin criada com sucesso!');
            console.log('  📧 Email: admin@loja.pt');
            console.log('  🔑 Senha: Admin@123');
            console.log('  ⚠️  Altere a senha na primeira login!');
          }
          finishDatabase(db);
        }
      );
    });
  } catch (err) {
    console.error('Erro ao criar admin:', err);
    finishDatabase(db);
  }
}

// Finalizar base de dados
function finishDatabase(db) {
  console.log('\n✅ Base de dados inicializada com sucesso!');
  console.log(`📁 Arquivo: ${DB_PATH}`);
  console.log('\n🚀 Próximos passos:');
  console.log('   1. npm install (instalar dependências)');
  console.log('   2. npm run dev (iniciar servidor)');
  console.log('   3. Aceder a http://localhost:3000/admin/admin-login.html');
  db.close();
}

