/**
 * Exemplo de integração do cart.js com a API
 * 
 * Modifique o seu cart.js para usar a API em vez de localStorage
 */

import ApiClient from './api-client.js';

const api = new ApiClient();

// Exemplo 1: Carregar produtos do backend
async function loadProducts() {
  try {
    const products = await api.getProducts();
    console.log('Produtos carregados:', products);
    // Atualizar DOM com produtos...
  } catch (err) {
    console.error('Erro ao carregar produtos:', err);
  }
}

// Exemplo 2: Adicionar ao carrinho
async function handleAddToCart(productId, quantity, options, price) {
  try {
    // Se não está autenticado, usar localStorage
    if (!api.userId) {
      // Fallback para localStorage
      addToCartLocal(productId, quantity, options, price);
      return;
    }

    const result = await api.addToCart(productId, quantity, options, price);
    if (result.success) {
      alert('Produto adicionado ao carrinho!');
      updateCartUI();
    }
  } catch (err) {
    console.error('Erro ao adicionar ao carrinho:', err);
  }
}

// Exemplo 3: Mostrar carrinho
async function updateCartUI() {
  try {
    if (!api.userId) {
      // Mostrar carrinho do localStorage
      displayLocalCart();
      return;
    }

    const cart = await api.getCart();
    console.log('Carrinho:', cart);
    
    // Atualizar quantidade de itens
    document.getElementById('cartCount').textContent = cart.items.length;
    
    // Atualizar total
    document.getElementById('cartTotal').textContent = cart.total.toFixed(2);
    
    // Atualizar lista de itens...
  } catch (err) {
    console.error('Erro ao atualizar carrinho:', err);
  }
}

// Exemplo 4: Fazer checkout
async function handleCheckout(shippingData, paymentMethod) {
  try {
    // Obter itens do carrinho
    const cart = await api.getCart();
    
    // Criar encomenda
    const order = await api.createOrder(
      cart.items.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price,
        selectedOptions: JSON.parse(item.selected_options)
      })),
      cart.total,
      shippingData,
      paymentMethod
    );

    if (order.success) {
      console.log('Encomenda criada:', order.orderNumber);
      
      // Redirecionar para página de pagamento
      window.location.href = `/carrinho/checkout.html?orderId=${order.orderId}`;
    }
  } catch (err) {
    console.error('Erro ao fazer checkout:', err);
  }
}

// Exemplo 5: Registar novo utilizador
async function handleRegister(formData) {
  try {
    const result = await api.register(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.phone
    );

    if (result.success) {
      alert('Registado com sucesso!');
      // Redirecionar para login...
    } else {
      alert('Erro: ' + result.error);
    }
  } catch (err) {
    console.error('Erro ao registar:', err);
  }
}

// Exemplo 6: Fazer login
async function handleLogin(email, password) {
  try {
    const result = await api.login(email, password);
    
    if (result.success) {
      console.log('Utilizador autenticado:', result.user);
      // Redirecionar para página inicial...
      window.location.href = '/index.html';
    } else {
      alert('Email ou password incorretos');
    }
  } catch (err) {
    console.error('Erro ao fazer login:', err);
  }
}

// Exemplo 7: Processar pagamento MBWay
async function handleMBWayPayment(orderId, phoneNumber) {
  try {
    const result = await api.processMBWay(orderId, phoneNumber);
    
    if (result.success) {
      alert('Pedido de pagamento enviado para o seu telemóvel!');
      // Monitorar estado do pagamento...
    }
  } catch (err) {
    console.error('Erro ao processar MBWay:', err);
  }
}

// Exemplo 8: Gerar referência Multibanco
async function handleMultibancoPayment(orderId) {
  try {
    const result = await api.generateMultibanco(orderId);
    
    if (result.success) {
      const ref = result.reference;
      document.getElementById('mbReference').textContent = ref.reference;
      document.getElementById('mbEntity').textContent = ref.entity;
      document.getElementById('mbAmount').textContent = ref.amount.toFixed(2);
    }
  } catch (err) {
    console.error('Erro ao gerar Multibanco:', err);
  }
}

// Exportar funções para usar no HTML
window.CartAPI = {
  loadProducts,
  handleAddToCart,
  handleCheckout,
  handleRegister,
  handleLogin,
  handleMBWayPayment,
  handleMultibancoPayment
};
