const bcrypt = require('bcryptjs');
const { getOne, runQuery } = require('./database');

// Credenciais padrão do admin
const DEFAULT_ADMIN = {
  email: 'admin@loja.pt',
  password: 'Admin@123', // Mudar após primeira login!
  firstName: 'Admin',
  lastName: 'Loja',
  phone: '916000000'
};

const initializeAdmin = async () => {
  try {
    // Verificar se admin já existe
    const existingAdmin = await getOne('SELECT id FROM users WHERE role = "admin"');
    
    if (existingAdmin) {
      console.log('✓ Admin já existe na base de dados');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

    // Criar admin
    await runQuery(
      `INSERT INTO users (email, password, first_name, last_name, phone, role, is_active)
       VALUES (?, ?, ?, ?, ?, 'admin', 1)`,
      [DEFAULT_ADMIN.email, hashedPassword, DEFAULT_ADMIN.firstName, DEFAULT_ADMIN.lastName, DEFAULT_ADMIN.phone]
    );

    console.log('✓ Conta admin criada com sucesso!');
    console.log(`  Email: ${DEFAULT_ADMIN.email}`);
    console.log(`  Senha: ${DEFAULT_ADMIN.password}`);
    console.log('  ⚠️  Altere a senha na primeira login!');

  } catch (err) {
    console.error('Erro ao inicializar admin:', err);
  }
};

module.exports = { initializeAdmin };
