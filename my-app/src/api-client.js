/**
 * API Client para integração com o frontend
 * Adicione este ficheiro em: src/api-client.js
 * Use: import ApiClient from './api-client.js';
 */

class ApiClient {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
    this.userId = localStorage.getItem('userId');
  }

  // ===== PRODUTOS =====
  
  async getProducts(categoryId = null) {
    let url = `${this.baseUrl}/products`;
    if (categoryId) url += `?category=${categoryId}`;
    return fetch(url).then(r => r.json());
  }

  async getProduct(id) {
    return fetch(`${this.baseUrl}/products/${id}`).then(r => r.json());
  }

  async getCategories() {
    return fetch(`${this.baseUrl}/products/categories`).then(r => r.json());
  }

  async searchProducts(query) {
    return fetch(`${this.baseUrl}/products/search?q=${query}`).then(r => r.json());
  }

  // ===== CARRINHO =====

  async getCart() {
    return fetch(`${this.baseUrl}/cart/${this.userId}`).then(r => r.json());
  }

  async addToCart(productId, quantity, selectedOptions = {}, price) {
    return fetch(`${this.baseUrl}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        productId,
        quantity,
        selectedOptions,
        price
      })
    }).then(r => r.json());
  }

  async updateCartItem(itemId, quantity) {
    return fetch(`${this.baseUrl}/cart/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    }).then(r => r.json());
  }

  async removeFromCart(itemId) {
    return fetch(`${this.baseUrl}/cart/${itemId}`, {
      method: 'DELETE'
    }).then(r => r.json());
  }

  async clearCart() {
    return fetch(`${this.baseUrl}/cart/user/${this.userId}`, {
      method: 'DELETE'
    }).then(r => r.json());
  }

  // ===== UTILIZADORES =====

  async register(email, password, firstName, lastName, phone) {
    return fetch(`${this.baseUrl}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        phone
      })
    }).then(r => r.json());
  }

  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json());

    if (response.success) {
      this.userId = response.user.id;
      localStorage.setItem('userId', this.userId);
    }
    return response;
  }

  async getProfile() {
    return fetch(`${this.baseUrl}/users/${this.userId}`).then(r => r.json());
  }

  async updateProfile(firstName, lastName, phone, address, city, postalCode) {
    return fetch(`${this.baseUrl}/users/${this.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        address,
        city,
        postalCode
      })
    }).then(r => r.json());
  }

  // ===== ENCOMENDAS =====

  async createOrder(cartItems, totalPrice, shippingAddress, paymentMethod, notes = '') {
    return fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        cartItems,
        totalPrice,
        shippingAddress,
        paymentMethod,
        notes
      })
    }).then(r => r.json());
  }

  async getOrders() {
    return fetch(`${this.baseUrl}/orders/user/${this.userId}`).then(r => r.json());
  }

  async getOrder(orderId) {
    return fetch(`${this.baseUrl}/orders/${orderId}`).then(r => r.json());
  }

  async updateOrderStatus(orderId, status) {
    return fetch(`${this.baseUrl}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(r => r.json());
  }

  async cancelOrder(orderId) {
    return fetch(`${this.baseUrl}/orders/${orderId}/cancel`, {
      method: 'PUT'
    }).then(r => r.json());
  }

  // ===== PAGAMENTOS =====

  async createPayment(orderId, amount, method, reference = null) {
    return fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        amount,
        method,
        reference
      })
    }).then(r => r.json());
  }

  async processMBWay(orderId, phoneNumber) {
    return fetch(`${this.baseUrl}/payments/mbway/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        phone: phoneNumber
      })
    }).then(r => r.json());
  }

  async generateMultibanco(orderId) {
    return fetch(`${this.baseUrl}/payments/multibanco/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    }).then(r => r.json());
  }

  async getPayments(orderId) {
    return fetch(`${this.baseUrl}/payments/order/${orderId}`).then(r => r.json());
  }

  async updatePaymentStatus(paymentId, status) {
    return fetch(`${this.baseUrl}/payments/${paymentId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(r => r.json());
  }
}

export default ApiClient;
