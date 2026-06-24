// Profile Management - Integração com Base de Dados

// Chave usada para armazenar os dados de autenticação do utilizador.
const AUTH_KEY = 'lojaUserAuth';
const API_BASE = '/api';

// Lê os dados do utilizador do localStorage e retorna o objeto salvo.
function getUser() {
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erro ao ler dados do utilizador:', error);
      return null;
    }
  }
  return null;
}

// Guarda os dados do utilizador no localStorage.
function saveUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

// Remove os dados de autenticação quando o utilizador faz logout.
function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = '../index.html';
}

// Carrega os dados do perfil do utilizador a partir da API
async function loadProfileFromAPI(userId) {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`);
    
    if (!response.ok) {
      console.error('Erro ao carregar perfil');
      return null;
    }
    
    const userData = await response.json();
    return userData;
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
    return null;
  }
}

// Atualiza o perfil do utilizador na API
async function updateProfileInAPI(userId, profileData) {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar perfil');
    }
    
    return await response.json();
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    throw err;
  }
}

// Configura os controlos de tabulação para alternar entre login e criar conta.
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.getAttribute('data-tab');
    
    // Remove a classe ativa de todos os botões e conteúdos antes de ativar a nova aba.
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Ativa o botão e o conteúdo correspondentes à aba selecionada.
    button.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
  });
});

// Captura os dados do formulário de login e cria a sessão localmente.
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!email || !password) {
      alert('Preencha todos os campos');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao fazer login');
        return;
      }
      
      const data = await response.json();
      
      // Salvar dados do utilizador
      const user = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
        loggedIn: true
      };
      
      saveUser(user);
      
      // Se for admin, redirecionar para painel de admin
      if (data.user.role === 'admin') {
        // Guardar também em adminAuth para compatibilidade
        localStorage.setItem('adminAuth', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: 'admin'
        }));
        window.location.href = '../admin/admin.html';
        return;
      }
      
      showProfile();
      loginForm.reset();
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      alert('Erro ao fazer login. Tente novamente.');
    }
  });
}

// Captura os dados do formulário de criação de conta e salva o utilizador.
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();
    
    if (!firstName || !email || !password || !confirmPassword) {
      alert('Preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('As senhas não correspondem');
      return;
    }
    
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          email,
          password,
          lastName: '',
          phone: ''
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao criar conta');
        return;
      }
      
      const data = await response.json();
      alert('Conta criada com sucesso! Faça login para continuar.');
      
      // Limpar formulário e voltar para login
      signupForm.reset();
      document.querySelectorAll('.tab-btn')[0].click(); // Voltar para login
    } catch (err) {
      console.error('Erro ao criar conta:', err);
      alert('Erro ao criar conta. Tente novamente.');
    }
  });
}

// Mostra o perfil quando o utilizador está autenticado.
async function showProfile() {
  const user = getUser();
  
  if (!user || !user.loggedIn) {
    return;
  }
  
  // Ocultar seção de auth
  const authSection = document.getElementById('authSection');
  const profileSection = document.getElementById('profileSection');
  if (authSection) authSection.style.display = 'none';
  if (profileSection) profileSection.style.display = 'block';
  
  // Mostrar perfil
  const profileDiv = document.getElementById('profileDiv');
  if (!profileDiv) return;
  
  try {
    // Carregar dados completos do perfil da API
    const profileData = await loadProfileFromAPI(user.id);
    
    if (!profileData) {
      profileDiv.innerHTML = '<p>Erro ao carregar perfil</p>';
      return;
    }
    
    profileDiv.innerHTML = `
      <h2>Olá, ${profileData.first_name || user.firstName}! 👋</h2>
      
      <div class="profile-section">
        <h3>Informações Pessoais</h3>
        <div id="profileInfo">
          <p><strong>Email:</strong> ${profileData.email}</p>
          <p><strong>Nome:</strong> ${profileData.first_name} ${profileData.last_name}</p>
          <p><strong>Telefone:</strong> ${profileData.phone || 'Não informado'}</p>
          <p><strong>Cidade:</strong> ${profileData.city || 'Não informado'}</p>
          <p><strong>Código Postal:</strong> ${profileData.postal_code || 'Não informado'}</p>
          <button class="btn" onclick="editProfile()">Editar Perfil</button>
        </div>
      </div>
      
      <div class="profile-section">
        <h3>Minhas Encomendas</h3>
        <button class="btn" onclick="loadUserOrders(${user.id})">Ver Encomendas</button>
        <div id="ordersDiv"></div>
      </div>
      
      <div class="profile-section">
        <h3>Segurança</h3>
        <button class="btn" onclick="changePassword()">Alterar Senha</button>
      </div>
      
      <button class="btn btn-danger" onclick="confirmLogout()">Fazer Logout</button>
    `;
    
    // Armazenar dados completos do perfil
    const completeUser = {
      ...user,
      ...profileData
    };
    saveUser(completeUser);
    
  } catch (err) {
    console.error('Erro ao mostrar perfil:', err);
    profileDiv.innerHTML = '<p>Erro ao carregar perfil. Tente fazer login novamente.</p>';
  }
}

// Editar perfil
function editProfile() {
  const user = getUser();
  const profileDiv = document.getElementById('profileInfo');
  
  profileDiv.innerHTML = `
    <form id="editProfileForm">
      <input type="text" id="firstName" value="${user.first_name || ''}" placeholder="Primeiro Nome">
      <input type="text" id="lastName" value="${user.last_name || ''}" placeholder="Último Nome">
      <input type="tel" id="phone" value="${user.phone || ''}" placeholder="Telefone">
      <input type="text" id="address" value="${user.address || ''}" placeholder="Endereço">
      <input type="text" id="city" value="${user.city || ''}" placeholder="Cidade">
      <input type="text" id="postalCode" value="${user.postal_code || ''}" placeholder="Código Postal">
      <button type="submit" class="btn">Guardar Alterações</button>
      <button type="button" class="btn btn-secondary" onclick="showProfile()">Cancelar</button>
    </form>
  `;
  
  document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const updateData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value
      };
      
      await updateProfileInAPI(user.id, updateData);
      alert('Perfil atualizado com sucesso!');
      showProfile();
    } catch (err) {
      alert('Erro ao atualizar perfil: ' + err.message);
    }
  });
}

// Carregar encomendas do utilizador
async function loadUserOrders(userId) {
  try {
    const response = await fetch(`${API_BASE}/orders/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar encomendas');
    }
    
    const orders = await response.json();
    const ordersDiv = document.getElementById('ordersDiv');
    
    if (orders.length === 0) {
      ordersDiv.innerHTML = '<p>Ainda não tem encomendas</p>';
      return;
    }
    
    let html = '<table class="orders-table"><thead><tr><th>Número</th><th>Total</th><th>Status</th><th>Data</th></tr></thead><tbody>';
    
    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString('pt-PT');
      html += `
        <tr>
          <td>${order.order_number}</td>
          <td>€${order.total_price.toFixed(2)}</td>
          <td><span class="status-${order.status}">${order.status}</span></td>
          <td>${date}</td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    ordersDiv.innerHTML = html;
  } catch (err) {
    console.error('Erro ao carregar encomendas:', err);
    document.getElementById('ordersDiv').innerHTML = '<p>Erro ao carregar encomendas</p>';
  }
}

// Alterar senha
function changePassword() {
  const profileDiv = document.getElementById('profileDiv');
  
  profileDiv.innerHTML = `
    <div class="profile-section">
      <h3>Alterar Senha</h3>
      <form id="changePasswordForm">
        <input type="password" id="currentPassword" placeholder="Senha Atual" required>
        <input type="password" id="newPassword" placeholder="Nova Senha" required>
        <input type="password" id="confirmPassword" placeholder="Confirmar Nova Senha" required>
        <button type="submit" class="btn">Alterar Senha</button>
        <button type="button" class="btn btn-secondary" onclick="showProfile()">Cancelar</button>
      </form>
    </div>
  `;
  
  document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
      alert('As senhas não correspondem');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    alert('Funcionalidade em desenvolvimento. Contacte o suporte.');
  });
}

// Confirmar logout
function confirmLogout() {
  if (confirm('Tem a certeza que deseja fazer logout?')) {
    logoutUser();
  }
}

// Mostrar perfil se o utilizador já está autenticado
window.addEventListener('load', () => {
  const user = getUser();
  if (user && user.loggedIn) {
    if (user.role === 'admin') {
      window.location.href = '../admin/admin.html';
      return;
    }

    // Ocultar formulários
    const authSection = document.getElementById('authSection');
    const profileSection = document.getElementById('profileSection');
    if (authSection) authSection.style.display = 'none';
    if (profileSection) profileSection.style.display = 'block';
    showProfile();
  }
});
