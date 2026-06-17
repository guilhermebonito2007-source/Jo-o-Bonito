// ==================== ADMIN PAINEL PROFISSIONAL ====================
// Sistema de Administração Completo - Loja Sende

const API_BASE = 'http://localhost:3000/api';
let currentAdmin = null;

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    setupProductForm();
    loadDashboard();
    console.log('✅ Painel Admin Profissional Carregado');
});

// ==================== AUTENTICAÇÃO ====================
function checkAuth() {
    let adminData = localStorage.getItem('adminAuth');
    
    if (!adminData) {
        const userData = localStorage.getItem('lojaUserAuth');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.role === 'admin') {
                    adminData = JSON.stringify({
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: 'admin'
                    });
                    localStorage.setItem('adminAuth', adminData);
                }
            } catch (err) {
                console.error('Erro ao ler dados:', err);
            }
        }
    }
    
    if (!adminData) {
        window.location.href = '../prefil/prefil.html';
        return;
    }
    
    try {
        currentAdmin = JSON.parse(adminData);
        updateAdminInfo();
        displayAdminInfo();
    } catch (err) {
        window.location.href = '../prefil/prefil.html';
    }
}

function updateAdminInfo() {
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.innerHTML = `
            <div style="font-weight: 600;">👤 ${currentAdmin.firstName} ${currentAdmin.lastName}</div>
            <small style="opacity: 0.8;">${currentAdmin.email}</small>
        `;
    }
}

function displayAdminInfo() {
    const elements = {
        'adminEmail': 'joao_bonito_1970@sapo.pt',
        'adminPassword': 'Admin123',
        'adminName': currentAdmin.firstName + ' ' + currentAdmin.lastName,
        'adminPhone': '910175058'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
}

function copyAdminInfo() {
    const info = `
Email: ${document.getElementById('adminEmail')?.textContent || ''}
Palavra-passe: ${document.getElementById('adminPassword')?.textContent || ''}
Nome: ${document.getElementById('adminName')?.textContent || ''}
Telefone: ${document.getElementById('adminPhone')?.textContent || ''}
    `.trim();
    
    navigator.clipboard.writeText(info).then(() => {
        showNotification('✓ Informações copiadas!', 'success');
    }).catch(() => {
        showNotification('❌ Erro ao copiar', 'error');
    });
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Navegação Sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            navigateToSection(section);
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // Search/Filter
    document.getElementById('ordersSearch')?.addEventListener('keyup', filterTable);
    document.getElementById('usersSearch')?.addEventListener('keyup', filterTable);
    document.getElementById('paymentFilter')?.addEventListener('change', filterPaymentsByMethod);

    // Modal close
    document.querySelectorAll('[data-action="close-modal"]').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });

    // Add Product button
    const addProductBtn = document.querySelector('button[data-action="add-product"]');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', openProductModal);
    }

    // Document delegation for edit/delete buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('button[data-action="edit-product"]')) {
            const productId = e.target.dataset.productId;
            openEditProductModal(productId);
        }
        if (e.target.matches('button[data-action="delete-product"]')) {
            const productId = e.target.dataset.productId;
            deleteProduct(productId);
        }
    });
}

// ==================== NAVEGAÇÃO ====================
function navigateToSection(section) {
    // Atualizar nav-links
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`)?.classList.add('active');

    // Atualizar seções
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + 'Section')?.classList.add('active');

    // Atualizar título
    const titles = {
        dashboard: 'Dashboard',
        products: 'Produtos',
        orders: 'Encomendas',
        users: 'Utilizadores',
        payments: 'Pagamentos',
        reports: 'Relatórios',
        activity: 'Atividades'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = titles[section] || 'Dashboard';

    // Carregar dados
    switch(section) {
        case 'products': loadProducts(); break;
        case 'orders': loadOrders(); break;
        case 'users': loadUsers(); break;
        case 'payments': loadPayments(); break;
        case 'reports': loadReports(); break;
        case 'activity': loadActivity(); break;
        default: loadDashboard();
    }
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    try {
        const usersResponse = await fetch(`${API_BASE}/users`);
        const ordersResponse = await fetch(`${API_BASE}/orders`);
        const productsResponse = await fetch(`${API_BASE}/products`);

        const users = await usersResponse.json();
        const orders = await ordersResponse.json();
        const products = await productsResponse.json();

        // Garantir que são arrays
        const usersList = Array.isArray(users) ? users : [];
        const ordersList = Array.isArray(orders) ? orders : [];
        const productsList = Array.isArray(products) ? products : [];

        // Atualizar estatísticas
        document.getElementById('totalUsers').textContent = usersList.length || 0;
        document.getElementById('totalOrders').textContent = ordersList.length || 0;
        document.getElementById('totalProducts').textContent = productsList.length || 0;

        // Calcular receita
        const totalRevenue = ordersList.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
        document.getElementById('totalRevenue').textContent = `€${totalRevenue.toFixed(2)}`;

        // Encomendas pendentes
        const pending = ordersList.filter(o => o.status === 'pendente').length;
        document.getElementById('pendingOrders').textContent = pending;

        // Produtos com baixo stock
        const lowStock = productsList.filter(p => parseFloat(p.stock) <= 5).length;
        document.getElementById('lowStockProducts').textContent = lowStock;

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        // Não mostrar notificação para o user no dashboard para não deixar o painel quebrado
        document.getElementById('totalUsers').textContent = '?';
        document.getElementById('totalOrders').textContent = '?';
        document.getElementById('totalProducts').textContent = '?';
    }
}

// ==================== PRODUTOS ====================
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();
        const productsList = Array.isArray(products) ? products : [];

        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        productsList.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>€${parseFloat(product.price).toFixed(2)}</td>
                <td><strong>${product.stock || 0}</strong></td>
                <td>${product.category || '-'}</td>
                <td>
                    <button class="btn btn-small btn-primary" data-action="edit-product" data-product-id="${product.id}">Editar</button>
                    <button class="btn btn-small btn-danger" data-action="delete-product" data-product-id="${product.id}">Deletar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showNotification('❌ Erro ao carregar produtos', 'error');
    }
}

function openProductModal() {
    const modal = document.getElementById('productModal');
    document.getElementById('productForm').reset();
    document.getElementById('productModalTitle').textContent = 'Novo Produto';
    document.getElementById('productForm').dataset.mode = 'add';
    document.getElementById('productForm').dataset.productId = '';
    if (modal) modal.classList.add('active');
}

function openEditProductModal(productId) {
    // Buscar produto atual para preencher o form
    fetch(`${API_BASE}/products/${productId}`)
        .then(r => r.json())
        .then(product => {
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock || 0;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productDescription').value = product.description || '';
            
            document.getElementById('productModalTitle').textContent = 'Editar Produto';
            document.getElementById('productForm').dataset.mode = 'edit';
            document.getElementById('productForm').dataset.productId = productId;
            
            const modal = document.getElementById('productModal');
            if (modal) modal.classList.add('active');
        })
        .catch(err => {
            console.error('Erro ao buscar produto:', err);
            showNotification('❌ Erro ao carregar produto', 'error');
        });
}

async function deleteProduct(productId) {
    if (!confirm('Tem a certeza que deseja deletar este produto?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('✓ Produto deletado com sucesso', 'success');
            loadProducts();
        } else {
            showNotification('❌ Erro ao deletar produto', 'error');
        }
    } catch (error) {
        console.error('Erro ao deletar:', error);
        showNotification('❌ Erro ao deletar produto', 'error');
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

// Setup form listener
function setupProductForm() {
    const form = document.getElementById('productForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const mode = form.dataset.mode || 'add';
        const productId = form.dataset.productId || '';
        
        const productData = {
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            category: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value
        };

        try {
            if (mode === 'add') {
                const response = await fetch(`${API_BASE}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    showNotification('✓ Produto adicionado com sucesso', 'success');
                    closeModal();
                    loadProducts();
                } else {
                    showNotification('❌ Erro ao adicionar produto', 'error');
                }
            } else {
                const response = await fetch(`${API_BASE}/products/${productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    showNotification('✓ Produto atualizado com sucesso', 'success');
                    closeModal();
                    loadProducts();
                } else {
                    showNotification('❌ Erro ao atualizar produto', 'error');
                }
            }
        } catch (error) {
            console.error('Erro:', error);
            showNotification('❌ Erro ao guardar produto', 'error');
        }
    });
}

// ==================== ENCOMENDAS ====================
async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders`);
        const orders = await response.json();

        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.email || 'Cliente'}</td>
                <td>€${order.total?.toFixed(2) || '0.00'}</td>
                <td><span class="status-badge status-${order.status}">${order.status || 'pendente'}</span></td>
                <td><span class="status-badge status-${order.payment_status}">${order.payment_status || 'nao_pago'}</span></td>
                <td>${new Date(order.created_at).toLocaleDateString('pt-PT')}</td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="viewOrder(${order.id})">Ver</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro:', error);
        showNotification('❌ Erro ao carregar encomendas', 'error');
    }
}

async function viewOrder(orderId) {
    showNotification('🔧 Funcionalidade em desenvolvimento', 'info');
}

function filterTable(e) {
    const searchTerm = e.target.value.toLowerCase();
    const tableId = e.target.id === 'ordersSearch' ? 'ordersTableBody' : 'usersTableBody';
    const rows = document.querySelectorAll(`#${tableId} tr`);
    
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? '' : 'none';
    });
}

// ==================== UTILIZADORES ====================
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        const users = await response.json();

        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.email}</td>
                <td>${user.first_name || ''} ${user.last_name || ''}</td>
                <td>${user.phone || '-'}</td>
                <td>${user.city || '-'}</td>
                <td>${new Date(user.created_at).toLocaleDateString('pt-PT')}</td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="editUser(${user.id})">Editar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro:', error);
        showNotification('❌ Erro ao carregar utilizadores', 'error');
    }
}

async function editUser(userId) {
    showNotification('🔧 Funcionalidade em desenvolvimento', 'info');
}

// ==================== PAGAMENTOS ====================
async function loadPayments() {
    try {
        const response = await fetch(`${API_BASE}/payments`);
        const payments = await response.json();

        const tbody = document.getElementById('paymentsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        payments.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${payment.id}</td>
                <td>#${payment.order_id}</td>
                <td>€${payment.amount?.toFixed(2) || '0.00'}</td>
                <td>${payment.method || 'Não especificado'}</td>
                <td><span class="status-badge status-${payment.status}">${payment.status || 'pendente'}</span></td>
                <td>${new Date(payment.created_at).toLocaleDateString('pt-PT')}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro:', error);
        showNotification('❌ Erro ao carregar pagamentos', 'error');
    }
}

function filterPaymentsByMethod(e) {
    const method = e.target.value;
    const rows = document.querySelectorAll('#paymentsTableBody tr');
    
    rows.forEach(row => {
        if (!method || row.textContent.includes(method)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// ==================== RELATÓRIOS ====================
async function loadReports() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();
        
        // Top produtos (simulado)
        const sorted = products.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 10);
        
        const tbody = document.querySelector('#topProductsTableBody');
        if (tbody) {
            tbody.innerHTML = sorted.map((p, i) => `
                <tr>
                    <td>${i + 1}. ${p.name}</td>
                    <td>${p.sold || 0}</td>
                    <td>€${(p.price * (p.sold || 0)).toFixed(2)}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function loadActivity() {
    try {
        const response = await fetch(`${API_BASE}/activity-log`);
        const activities = Array.isArray(await response.json()) ? await response.json() : [];

        const tbody = document.getElementById('activityTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        activities.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.user_id || 'Sistema'}</td>
                <td>${activity.action || '-'}</td>
                <td>${activity.description || '-'}</td>
                <td>${new Date(activity.created_at).toLocaleString('pt-PT')}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
    }
}

// ==================== LOGOUT ====================
function logout() {
    if (confirm('Tem a certeza que deseja fazer logout?')) {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('lojaUserAuth');
        window.location.href = '../index.html';
    }
}

// ==================== NOTIFICAÇÕES ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${
            type === 'success' ? '#27ae60' :
            type === 'error' ? '#e74c3c' :
            '#3498db'
        };
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== ESTILOS DE ANIMAÇÃO ====================
if (!document.querySelector('style[data-admin-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-admin-animations', 'true');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ Admin profissional iniciado com sucesso!')
