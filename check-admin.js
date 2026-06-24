// Verificar admin
const { getOne, getAll } = require('./database');

async function check() {
    try {
        const admin = await getOne('SELECT id, email, role FROM users WHERE role = ?', ['admin']);
        console.log('Admin encontrado:', admin);
        
        const all = await getAll('SELECT id, email, role FROM users');
        console.log('\nTodos os utilizadores:');
        console.table(all);
    } catch (err) {
        console.error('Erro:', err.message);
    }
    process.exit(0);
}

check();
