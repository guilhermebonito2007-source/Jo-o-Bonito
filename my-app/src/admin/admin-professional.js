// Painel Admin Profissional - Painel Administrativo Profissional

const API_BASE = '/api';
let currentAdmin = null;

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    loadDashboard();
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
    } catch (err) {
        window.location.href = '../prefil/prefil.html';
    }
}

function updateAdminInfo() {
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.innerHTML = `
            <div class="admin-greeting">👤 ${currentAdmin.firstName} ${currentAdmin.lastName}</div>
            <small class="admin-email">${currentAdmin.email}</small>
        `;
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Navegação da Sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            navigateToSection(section);
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Busca de Encomendas
    const ordersSearch = document.getElementById('ordersSearch');
    if (ordersSearch) {
        ordersSearch.addEventListener('keyup', searchOrders);
    }

    // Busca de Utilizadores
    const usersSearch = document.getElementById('usersSearch');
    if (usersSearch) {
        usersSearch.addEventListener('keyup', searchUsers);
    }

    // Filtro de Pagamentos
    const paymentFilter = document.getElementById('paymentFilter');
    if (paymentFilter) {
        paymentFilter.addEventListener('change', filterPayments);
    }
}

// Delegated event listeners para botões das tabelas
document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    const id = target.dataset.id ? parseInt(target.dataset.id, 10) : NaN;
    if (Number.isNaN(id)) return;

    switch (action) {
        case 'view-order':
            viewOrder(id);
            break;
        case 'delete-order':
            deleteOrder(id);
            break;
        case 'edit-user':
            editUser(id);
            break;
        case 'delete-user':
            deleteUser(id);
            break;
        case 'edit-product':
            editProduct(id);
            break;
        case 'delete-product':
            deleteProduct(id);
            break;
        case 'view-contact':
            viewContact(id);
            break;
        default:
            break;
    }
});

// ==================== NAVEGAÇÃO ====================
function navigateToSection(section) {
    // Remover active de todas as seções
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Adicionar active à seção selecionada
    const sectionEl = document.getElementById(section + 'Section');
    if (sectionEl) {
        sectionEl.classList.add('active');
    }

    // Atualizar nav-link ativo
    const activeLink = document.querySelector(`[data-section="${section}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Atualizar título
    const titles = {
        dashboard: 'Dashboard',
        orders: 'Encomendas',
        users: 'Utilizadores',
        payments: 'Pagamentos',
        reports: 'Relatórios',
        activity: 'Atividades',
        contacts: 'Contactos',
        products: 'Produtos'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = titles[section] || 'Dashboard';
    }

    // Carregar dados específicos da seção
    switch(section) {
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'payments':
            loadPayments();
            break;
        case 'reports':
            loadReports();
            break;
        case 'activity':
            loadActivity();
            break;
        case 'contacts':
            loadContacts();
            break;
        case 'products':
            loadProducts();
            break;
        default:
            loadDashboard();
    }
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    try {
        // Carregar estatísticas
        const [users, orders, products] = await Promise.all([
            fetch(`${API_BASE}/users`).then(r => r.json()),
            fetch(`${API_BASE}/orders`).then(r => r.json()),
            fetch(`${API_BASE}/products`).then(r => r.json())
        ]);

        // Atualizar estatísticas
        document.getElementById('totalUsers').textContent = users.length || 0;
        document.getElementById('totalOrders').textContent = orders.length || 0;
        document.getElementById('totalProducts').textContent = products.length || 0;

        // Calcular receita total
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        document.getElementById('totalRevenue').textContent = `€${totalRevenue.toFixed(2)}`;

        // Encomendas pendentes
        const pendingOrders = orders.filter(o => o.status === 'pendente').length;
        document.getElementById('pendingOrders').textContent = pendingOrders;

        // Produtos com baixo stock
        const lowStockProducts = products.filter(p => p.stock <= 5).length;
        document.getElementById('lowStockProducts').textContent = lowStockProducts;

        console.log('Dashboard carregado com sucesso');
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showNotification('Erro ao carregar dashboard', 'error');
    }
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
                <td>${order.customer_name || 'Cliente'}</td>
                <td>€${order.total.toFixed(2)}</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td><span class="status-badge status-${order.payment_status}">${order.payment_status}</span></td>
                <td>${new Date(order.created_at).toLocaleDateString('pt-PT')}</td>
                <td>
                    <button class="btn btn-small btn-primary" data-action="view-order" data-id="${order.id}">Ver</button>
                    <button class="btn btn-small btn-danger" data-action="delete-order" data-id="${order.id}">Deletar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar encomendas:', error);
        showNotification('Erro ao carregar encomendas', 'error');
    }
}

function searchOrders(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#ordersTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

async function viewOrder(orderId) {
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}`);
        if (!response.ok) {
            showNotification('Encomenda não encontrada', 'error');
            return;
        }
        const order = await response.json();
        alert('Detalhes:\n' + JSON.stringify(order, null, 2));
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao carregar encomenda', 'error');
    }
}

async function deleteOrder(orderId) {
    if (confirm('Tem a certeza que deseja deletar esta encomenda?')) {
        try {
            const response = await fetch(`${API_BASE}/orders/${orderId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showNotification('Encomenda deletada com sucesso', 'success');
                loadOrders();
            } else {
                showNotification('Erro ao deletar encomenda', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            showNotification('Erro ao deletar encomenda', 'error');
        }
    }
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
                <td>${user.first_name} ${user.last_name}</td>
                <td>${user.phone || '-'}</td>
                <td>${user.city || '-'}</td>
                <td>${new Date(user.created_at).toLocaleDateString('pt-PT')}</td>
                <td>
                    <button class="btn btn-small btn-primary" data-action="edit-user" data-id="${user.id}">Editar</button>
                    <button class="btn btn-small btn-danger" data-action="delete-user" data-id="${user.id}">Deletar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar utilizadores:', error);
        showNotification('Erro ao carregar utilizadores', 'error');
    }
}

function searchUsers(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#usersTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

async function editUser(userId) {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`);
        if (!response.ok) {
            showNotification('Utilizador não encontrado', 'error');
            return;
        }
        const user = await response.json();
        const newEmail = prompt('Novo email:', user.email);
        if (newEmail && newEmail !== user.email) {
            const updateResponse = await fetch(`${API_BASE}/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail })
            });
            if (updateResponse.ok) {
                showNotification('Utilizador atualizado com sucesso', 'success');
                loadUsers();
            } else {
                showNotification('Erro ao atualizar utilizador', 'error');
            }
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao editar utilizador', 'error');
    }
}

async function deleteUser(userId) {
    if (confirm('Tem a certeza que deseja deletar este utilizador?')) {
        try {
            const response = await fetch(`${API_BASE}/users/${userId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showNotification('Utilizador deletado com sucesso', 'success');
                loadUsers();
            } else {
                showNotification('Erro ao deletar utilizador', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            showNotification('Erro ao deletar utilizador', 'error');
        }
    }
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
                <td>€${payment.amount.toFixed(2)}</td>
                <td>${payment.method}</td>
                <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
                <td>${new Date(payment.created_at).toLocaleDateString('pt-PT')}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar pagamentos:', error);
        showNotification('Erro ao carregar pagamentos', 'error');
    }
}

function filterPayments(e) {
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
        // Produtos mais vendidos
        const response = await fetch(`${API_BASE}/reports/top-products`);
        const topProducts = await response.json();

        const tbody = document.querySelector('#topProductsList table tbody');
        if (tbody) {
            tbody.innerHTML = '';
            topProducts.slice(0, 10).forEach((product, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${product.sold || 0}</td>
                    <td>€${product.revenue || 0}</td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
    }
}

// ==================== ATIVIDADES ====================
async function loadActivity() {
    try {
        const response = await fetch(`${API_BASE}/activity`);
        const activities = await response.json();

        const tbody = document.getElementById('activityTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        activities.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.user_id}</td>
                <td>${activity.action}</td>
                <td>${activity.description}</td>
                <td>${new Date(activity.created_at).toLocaleDateString('pt-PT')}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
    }
}

// ==================== CONTACTOS ====================
async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE}/contacts`);
        const contacts = await response.json();

        const tbody = document.getElementById('contactsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td><span class="status-badge status-${contact.status}">${contact.status}</span></td>
                <td>${new Date(contact.created_at).toLocaleDateString('pt-PT')}</td>
                <td>
                    <button class="btn btn-small btn-primary" data-action="view-contact" data-id="${contact.id}">Ver</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar contactos:', error);
    }
}

async function viewContact(contactId) {
    try {
        const response = await fetch(`${API_BASE}/contacts/${contactId}`);
        if (!response.ok) {
            showNotification('Contacto não encontrado', 'error');
            return;
        }
        const contact = await response.json();
        alert(`Contacto #${contact.id}\n\nNome: ${contact.name}\nEmail: ${contact.email}\nTelefone: ${contact.phone}\nStatus: ${contact.status}\nData: ${new Date(contact.created_at).toLocaleDateString('pt-PT')}`);
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao carregar contacto', 'error');
    }
}

// ==================== PRODUTOS ====================
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();

        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>€${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>${product.category}</td>
                <td>
                    <button class="btn btn-small btn-primary" data-action="edit-product" data-id="${product.id}">Editar</button>
                    <button class="btn btn-small btn-danger" data-action="delete-product" data-id="${product.id}">Deletar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

async function editProduct(productId) {
  try {
        const response = await fetch(`${API_BASE}/products/${productId}`);
        if (!response.ok) {
            showNotification('Produto não encontrado', 'error');
            return;
        }
        const product = await response.json();
        const newName = prompt('Novo nome:', product.name);
        if (newName && newName !== product.name) {
            const updateResponse = await fetch(`${API_BASE}/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            });
            if (updateResponse.ok) {
                showNotification('Produto atualizado com sucesso', 'success');
                loadProducts();
            } else {
                showNotification('Erro ao atualizar produto', 'error');
            }
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao editar produto', 'error');
    }
}

async function deleteProduct(productId) {
    if (confirm('Tem a certeza que deseja deletar este produto?')) {
        try {
            const response = await fetch(`${API_BASE}/products/${productId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showNotification('Produto deletado com sucesso', 'success');
                loadProducts();
            } else {
                showNotification('Erro ao deletar produto', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            showNotification('Erro ao deletar produto', 'error');
        }
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
    // Criar elemento de notificação se não existir
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(notificationContainer);
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        margin-bottom: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== INICIALIZAR ====================
console.log('Admin Panel Professional Carregado');
