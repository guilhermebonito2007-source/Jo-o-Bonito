// ==================== ADMIN PAINEL PROFISSIONAL ====================
// Sistema de AdministraÃ§Ã£o Completo - Loja Sende

const API_BASE = '/api';
let currentAdmin = null;

function adminHeaders(extra = {}) {
    return {
        'Content-Type': 'application/json',
        'x-user-id': String(currentAdmin?.id || ''),
        ...extra
    };
}

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: adminHeaders(options.headers || {})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || 'Erro na API');
    }
    return data;
}

function formatMoney(value) {
    return `â‚¬${(parseFloat(value) || 0).toFixed(2)}`;
}

function getOrderTotal(order) {
    return parseFloat(order.total_price ?? order.total ?? 0);
}

function getCustomerName(order) {
    const name = `${order.first_name || ''} ${order.last_name || ''}`.trim();
    return name || order.email || 'Cliente';
}

// ==================== INICIALIZAÃ‡ÃƒO ====================
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    setupProductForm();
    loadDashboard();
    console.log('âœ… Painel Admin Profissional Carregado');
});

// ==================== AUTENTICAÃ‡ÃƒO ====================
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
            <div style="font-weight: 600;">ðŸ‘¤ ${currentAdmin.firstName} ${currentAdmin.lastName}</div>
            <small style="opacity: 0.8;">${currentAdmin.email}</small>
        `;
    }
}

function displayAdminInfo() {
    const elements = {
        'adminEmail': currentAdmin.email || 'admin@loja.pt',
        'adminPassword': '********',
        'adminName': `${currentAdmin.firstName || 'Admin'} ${currentAdmin.lastName || 'Loja'}`.trim(),
        'adminPhone': currentAdmin.phone || 'Não disponível'
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
        showNotification('âœ“ InformaÃ§Ãµes copiadas!', 'success');
    }).catch(() => {
        showNotification('âŒ Erro ao copiar', 'error');
    });
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // NavegaÃ§Ã£o Sidebar
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
    document.getElementById('loadSalesReportBtn')?.addEventListener('click', loadSalesReport);

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

// ==================== NAVEGAÃ‡ÃƒO ====================
function navigateToSection(section) {
    // Atualizar nav-links
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`)?.classList.add('active');

    // Atualizar seÃ§Ãµes
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + 'Section')?.classList.add('active');

    // Atualizar tÃ­tulo
    const titles = {
        dashboard: 'Dashboard',
        products: 'Produtos',
        orders: 'Encomendas',
        users: 'Utilizadores',
        payments: 'Pagamentos',
        reports: 'RelatÃ³rios',
        activity: 'Atividades',
        contacts: 'Contactos'
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
        case 'contacts': loadContacts(); break;
        default: loadDashboard();
    }
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    try {
        const [dashboard, products] = await Promise.all([
            apiRequest('/admin/dashboard'),
            apiRequest('/products')
        ]);
        const productsList = Array.isArray(products) ? products : [];

        // Atualizar estatÃ­sticas
        document.getElementById('totalUsers').textContent = dashboard.totalUsers || 0;
        document.getElementById('totalOrders').textContent = dashboard.totalOrders || 0;
        document.getElementById('totalProducts').textContent = productsList.length || 0;
        document.getElementById('totalRevenue').textContent = formatMoney(dashboard.totalRevenue);
        document.getElementById('pendingOrders').textContent = dashboard.pendingOrders || 0;
        document.getElementById('lowStockProducts').textContent = dashboard.lowStockProducts || 0;

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        // NÃ£o mostrar notificaÃ§Ã£o para o user no dashboard para nÃ£o deixar o painel quebrado
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
                <td>â‚¬${parseFloat(product.price).toFixed(2)}</td>
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
        showNotification('âŒ Erro ao carregar produtos', 'error');
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
            showNotification('âŒ Erro ao carregar produto', 'error');
        });
}

async function deleteProduct(productId) {
    if (!confirm('Tem a certeza que deseja deletar este produto?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('âœ“ Produto deletado com sucesso', 'success');
            loadProducts();
        } else {
            showNotification('âŒ Erro ao deletar produto', 'error');
        }
    } catch (error) {
        console.error('Erro ao deletar:', error);
        showNotification('âŒ Erro ao deletar produto', 'error');
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
                    showNotification('âœ“ Produto adicionado com sucesso', 'success');
                    closeModal();
                    loadProducts();
                } else {
                    showNotification('âŒ Erro ao adicionar produto', 'error');
                }
            } else {
                const response = await fetch(`${API_BASE}/products/${productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    showNotification('âœ“ Produto atualizado com sucesso', 'success');
                    closeModal();
                    loadProducts();
                } else {
                    showNotification('âŒ Erro ao atualizar produto', 'error');
                }
            }
        } catch (error) {
            console.error('Erro:', error);
            showNotification('âŒ Erro ao guardar produto', 'error');
        }
    });
}

// ==================== ENCOMENDAS ====================
async function loadOrders() {
    try {
        const orders = await apiRequest('/admin/orders');

        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.order_number || `#${order.id}`}</td>
                <td>${getCustomerName(order)}</td>
                <td>${formatMoney(getOrderTotal(order))}</td>
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
        showNotification('Erro ao carregar encomendas', 'error');
    }
}

async function viewOrder(orderId) {
    try {
        const order = await apiRequest(`/admin/orders/${orderId}`);
        const items = Array.isArray(order.items) ? order.items : [];
        const payments = Array.isArray(order.payments) ? order.payments : [];
        const itemRows = items.map(item => `
            <tr>
                <td>${item.name || `Produto #${item.product_id}`}</td>
                <td>${item.quantity}</td>
                <td>${formatMoney(item.price)}</td>
            </tr>
        `).join('') || '<tr><td colspan="3">Sem itens registados</td></tr>';

        showInfoModal('Detalhes da Encomenda', `
            <p><strong>Número:</strong> ${order.order_number || `#${order.id}`}</p>
            <p><strong>Total:</strong> ${formatMoney(order.total_price)}</p>
            <p><strong>Status:</strong>
                <select id="orderStatusSelect">
                    ${['pendente', 'processada', 'enviada', 'entregue', 'cancelada'].map(status => `
                        <option value="${status}" ${status === order.status ? 'selected' : ''}>${status}</option>
                    `).join('')}
                </select>
                <button class="btn btn-small btn-primary" onclick="updateOrderStatus(${order.id})">Atualizar</button>
            </p>
            <p><strong>Pagamento:</strong> ${order.payment_status || 'nao_pago'} ${payments[0]?.method ? `(${payments[0].method})` : ''}</p>
            <h3>Itens</h3>
            <table class="data-table">
                <thead><tr><th>Produto</th><th>Qtd.</th><th>Preço</th></tr></thead>
                <tbody>${itemRows}</tbody>
            </table>
        `);
    } catch (error) {
        console.error('Erro ao abrir encomenda:', error);
        showNotification('Erro ao abrir encomenda', 'error');
    }
}

async function updateOrderStatus(orderId) {
    const status = document.getElementById('orderStatusSelect')?.value;
    if (!status) return;

    try {
        await apiRequest(`/admin/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        showNotification('Status atualizado com sucesso', 'success');
        closeModal();
        loadOrders();
        loadDashboard();
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        showNotification('Erro ao atualizar status', 'error');
    }
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
        const users = await apiRequest('/admin/users');

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
                    <button class="btn btn-small btn-primary" onclick="viewUser(${user.id})">Ver</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao carregar utilizadores', 'error');
    }
}

async function viewUser(userId) {
    try {
        const details = await apiRequest(`/admin/users/${userId}`);
        const user = details.user || {};
        const orders = Array.isArray(details.orders) ? details.orders : [];
        const activities = Array.isArray(details.activities) ? details.activities : [];
        const orderRows = orders.map(order => `
            <tr>
                <td>${order.order_number}</td>
                <td>${formatMoney(order.total_price)}</td>
                <td>${order.status}</td>
            </tr>
        `).join('') || '<tr><td colspan="3">Sem encomendas</td></tr>';
        const activityRows = activities.slice(0, 10).map(activity => `
            <tr>
                <td>${activity.action}</td>
                <td>${activity.description || '-'}</td>
            </tr>
        `).join('') || '<tr><td colspan="2">Sem atividades</td></tr>';

        showInfoModal('Detalhes do Utilizador', `
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Nome:</strong> ${user.first_name || ''} ${user.last_name || ''}</p>
            <p><strong>Telefone:</strong> ${user.phone || '-'}</p>
            <p><strong>Morada:</strong> ${user.address || '-'} ${user.city || ''}</p>
            <h3>Encomendas</h3>
            <table class="data-table"><thead><tr><th>Número</th><th>Total</th><th>Status</th></tr></thead><tbody>${orderRows}</tbody></table>
            <h3>Atividades Recentes</h3>
            <table class="data-table"><thead><tr><th>Ação</th><th>Descrição</th></tr></thead><tbody>${activityRows}</tbody></table>
        `);
    } catch (error) {
        console.error('Erro ao abrir utilizador:', error);
        showNotification('Erro ao abrir utilizador', 'error');
    }
}
// ==================== PAGAMENTOS ====================
async function loadPayments() {
    try {
        const payments = await apiRequest('/admin/payments');

        const tbody = document.getElementById('paymentsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        payments.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.reference || `#${payment.id}`}</td>
                <td>${payment.order_number || `#${payment.order_id}`}</td>
                <td>${formatMoney(payment.amount)}</td>
                <td>${payment.method || 'Não especificado'}</td>
                <td><span class="status-badge status-${payment.status}">${payment.status || 'pendente'}</span></td>
                <td>${new Date(payment.created_at).toLocaleDateString('pt-PT')}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao carregar pagamentos', 'error');
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

// ==================== RELATÃ“RIOS ====================
async function loadReports() {
    try {
        const topProducts = await apiRequest('/admin/reports/top-products');
        const tbody = document.querySelector('#topProductsTableBody');
        if (tbody) {
            tbody.innerHTML = topProducts.map((p, i) => `
                <tr>
                    <td>${i + 1}. ${p.name}</td>
                    <td>${p.sold_count || 0}</td>
                    <td>${p.total_quantity || 0}</td>
                </tr>
            `).join('') || '<tr><td colspan="3">Sem vendas registadas</td></tr>';
        }
        await loadSalesReport();
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao carregar relatórios', 'error');
    }
}

async function loadSalesReport() {
    const startDate = document.getElementById('salesStartDate')?.value;
    const endDate = document.getElementById('salesEndDate')?.value;
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    try {
        const report = await apiRequest(`/admin/reports/sales${params.toString() ? `?${params}` : ''}`);
        const container = document.getElementById('salesReportContent');
        if (!container) return;
        const summary = report.summary || {};
        const rows = (report.sales || []).map(day => `
            <tr>
                <td>${new Date(day.date).toLocaleDateString('pt-PT')}</td>
                <td>${day.orders}</td>
                <td>${formatMoney(day.revenue)}</td>
            </tr>
        `).join('') || '<tr><td colspan="3">Sem vendas neste período</td></tr>';

        container.innerHTML = `
            <p><strong>Total de encomendas:</strong> ${summary.count || 0}</p>
            <p><strong>Receita:</strong> ${formatMoney(summary.total)}</p>
            <table class="data-table">
                <thead><tr><th>Data</th><th>Encomendas</th><th>Receita</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar relatório de vendas:', error);
        showNotification('Erro ao carregar relatório de vendas', 'error');
    }
}

async function loadActivity() {
    try {
        const activities = await apiRequest('/admin/activity-log');

        const tbody = document.getElementById('activityTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        activities.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.email || activity.user_id || 'Sistema'}</td>
                <td>${activity.action || '-'}</td>
                <td>${activity.description || '-'}</td>
                <td>${new Date(activity.created_at).toLocaleString('pt-PT')}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
        showNotification('Erro ao carregar atividades', 'error');
    }
}

async function loadContacts() {
    try {
        const contacts = await apiRequest('/admin/contacts');
        const tbody = document.getElementById('contactsTableBody');
        if (!tbody) return;

        tbody.innerHTML = contacts.map(contact => `
            <tr>
                <td>${contact.name || '-'}</td>
                <td>${contact.email || '-'}</td>
                <td>${contact.subject || '-'}</td>
                <td><span class="status-badge status-${contact.status}">${contact.status || 'nao_lido'}</span></td>
                <td>${new Date(contact.created_at).toLocaleDateString('pt-PT')}</td>
                <td><button class="btn btn-small btn-primary" onclick="markContactRead(${contact.id})">Marcar lido</button></td>
            </tr>
        `).join('') || '<tr><td colspan="6">Sem contactos</td></tr>';
    } catch (error) {
        console.error('Erro ao carregar contactos:', error);
        showNotification('Erro ao carregar contactos', 'error');
    }
}

async function markContactRead(contactId) {
    try {
        await apiRequest(`/admin/contacts/${contactId}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'lido' })
        });
        showNotification('Contacto marcado como lido', 'success');
        loadContacts();
    } catch (error) {
        console.error('Erro ao atualizar contacto:', error);
        showNotification('Erro ao atualizar contacto', 'error');
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

function showInfoModal(title, html) {
    let modal = document.getElementById('infoModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'infoModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" data-action="close-modal">&times;</span>
                <h2 id="infoModalTitle"></h2>
                <div id="infoModalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('[data-action="close-modal"]').addEventListener('click', closeModal);
    }

    document.getElementById('infoModalTitle').textContent = title;
    document.getElementById('infoModalBody').innerHTML = html;
    modal.classList.add('active');
}

// ==================== NOTIFICAÃ‡Ã•ES ====================
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

// ==================== ESTILOS DE ANIMAÃ‡ÃƒO ====================
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

console.log('âœ… Admin profissional iniciado com sucesso!')




