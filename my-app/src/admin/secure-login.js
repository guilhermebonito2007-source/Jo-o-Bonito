// Secure Login - Script separado para CSP compliance
const API_URL = '/api';
let currentToken = null;
let currentUser = null;

// Recuperar token do localStorage
function loadToken() {
    const saved = localStorage.getItem('adminToken');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            currentToken = data.token;
            currentUser = data.user;
            displayUserInfo();
        } catch (e) {
            console.error('Erro ao carregar token:', e);
        }
    }
}

// Guardar token
function saveToken(token, user) {
    localStorage.setItem('adminToken', JSON.stringify({ token, user }));
}

// Mostrar alerta
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    setTimeout(() => {
        alertBox.className = 'alert';
    }, 5000);
}

// Submeter login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');

    submitBtn.disabled = true;
    loading.style.display = 'block';

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao autenticar');
        }

        currentToken = data.token;
        currentUser = data.user;
        saveToken(currentToken, currentUser);

        showAlert(`Bem-vindo, ${currentUser.name}!`, 'success');
        displayUserInfo();

    } catch (err) {
        showAlert(err.message, 'error');
        console.error('Erro:', err);
    } finally {
        submitBtn.disabled = false;
        loading.style.display = 'none';
    }
});

// Mostrar informações do utilizador
function displayUserInfo() {
    if (!currentToken || !currentUser) {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('toggleTokenBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
        return;
    }

    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('toggleTokenBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'inline-block';

    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userRole').textContent = currentUser.role;
}

// Toggle token visibility
document.getElementById('toggleTokenBtn').addEventListener('click', () => {
    const tokenDisplay = document.getElementById('tokenDisplay');
    if (tokenDisplay.style.display === 'none' || !tokenDisplay.style.display) {
        document.getElementById('tokenValue').textContent = currentToken;
        tokenDisplay.style.display = 'block';
        document.getElementById('toggleTokenBtn').textContent = 'Esconder Token';
    } else {
        tokenDisplay.style.display = 'none';
        document.getElementById('toggleTokenBtn').textContent = 'Ver Token';
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            currentToken = null;
            currentUser = null;
            localStorage.removeItem('adminToken');
            showAlert('Logout realizado com sucesso', 'success');
            displayUserInfo();
            document.getElementById('loginForm').reset();
            document.getElementById('email').value = 'admin@loja.pt';
            document.getElementById('password').value = 'Admin@123';
        }
    } catch (err) {
        showAlert('Erro ao fazer logout: ' + err.message, 'error');
    }
});

// Carregar token ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    loadToken();
});
