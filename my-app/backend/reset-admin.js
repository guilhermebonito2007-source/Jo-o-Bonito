const bcrypt = require('bcryptjs');
const { runQuery, getOne, initDatabase } = require('./database');

// Novas credenciais do admin
const NEW_ADMIN = {
  email: 'joao_bonito_1970@sapo.pt',
  password: 'Admin123',
  firstName: 'João Bonito',
  lastName: 'Loja',
  phone: '910175058'
};

const resetAdmin = async () => {
  try {
    console.log('🔄 Inicializando base de dados...');
    await initDatabase();
    
    console.log('🔄 Atualizando credenciais do admin...');
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(NEW_ADMIN.password, 10);

    // Update the admin user
    await runQuery(
      `UPDATE users 
       SET email = ?, password = ?, first_name = ?, last_name = ?, phone = ?
       WHERE role = 'admin'`,
      [NEW_ADMIN.email, hashedPassword, NEW_ADMIN.firstName, NEW_ADMIN.lastName, NEW_ADMIN.phone]
    );

    console.log('✓ Credenciais do admin atualizadas com sucesso!');
    console.log(`  Email: ${NEW_ADMIN.email}`);
    console.log(`  Palavra-passe: ${NEW_ADMIN.password}`);
    process.exit(0);

  } catch (err) {
    console.error('❌ Erro ao atualizar admin:', err);
    process.exit(1);
  }
};

resetAdmin();
