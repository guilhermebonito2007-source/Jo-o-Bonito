const { initDatabase, runQuery } = require('./database');

const addSampleOrders = async () => {
  try {
    console.log('🔄 Inicializando base de dados...');
    await initDatabase();
    
    console.log('🔄 Adicionando encomendas de teste...');
    
    // Obter um utilizador para associar à encomenda
    const { getOne } = require('./database');
    const user = await getOne('SELECT id FROM users WHERE role = "customer" LIMIT 1');
    
    if (!user) {
      console.log('⚠️  Nenhum utilizador encontrado. Criando um utilizador de teste...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('user123', 10);
      
      await runQuery(
        `INSERT INTO users (email, password, first_name, last_name, phone, role, is_active)
         VALUES (?, ?, ?, ?, ?, 'customer', 1)`,
        ['cliente@example.com', hashedPassword, 'Cliente', 'Teste', '912345678']
      );
    }
    
    // Adicionar encomendas de teste
    const orders = [
      {
        order_number: 'ORD-001',
        user_id: user?.id || 1,
        total_price: 45.50,
        status: 'pendente',
        payment_method: 'cartao',
        payment_status: 'nao_pago',
        notes: 'Encomenda de teste'
      },
      {
        order_number: 'ORD-002',
        user_id: user?.id || 1,
        total_price: 120.00,
        status: 'processada',
        payment_method: 'mbway',
        payment_status: 'pago',
        notes: 'Encomenda em processamento'
      },
      {
        order_number: 'ORD-003',
        user_id: user?.id || 1,
        total_price: 89.99,
        status: 'enviada',
        payment_method: 'transferencia',
        payment_status: 'pago',
        notes: 'Encomenda enviada'
      },
      {
        order_number: 'ORD-004',
        user_id: user?.id || 1,
        total_price: 250.00,
        status: 'entregue',
        payment_method: 'multibanco',
        payment_status: 'pago',
        notes: 'Encomenda entregue'
      }
    ];
    
    for (const order of orders) {
      await runQuery(
        `INSERT INTO orders (order_number, user_id, total_price, status, payment_method, payment_status, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [order.order_number, order.user_id, order.total_price, order.status, order.payment_method, order.payment_status, order.notes]
      );
    }
    
    console.log('✓ Encomendas de teste adicionadas com sucesso!');
    console.log('  - ORD-001: Pendente');
    console.log('  - ORD-002: Processada');
    console.log('  - ORD-003: Enviada');
    console.log('  - ORD-004: Entregue');
    process.exit(0);

  } catch (err) {
    console.error('❌ Erro ao adicionar encomendas:', err);
    process.exit(1);
  }
};

addSampleOrders();
