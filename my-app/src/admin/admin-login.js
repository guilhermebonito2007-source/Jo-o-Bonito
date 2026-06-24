// Admin Login JavaScript

const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
        window.location.href = 'admin.html';
    }

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submitBtn');
    const alert = document.getElementById('alert');

    // Clear alert
    alert.classList.remove('show', 'alert-error', 'alert-success', 'alert-info');

    if (!email || !password) {
        showAlert('Por favor preencha todos os campos', 'error');
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Entrando...';

        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showAlert(data.error || 'Erro ao fazer login', 'error');
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Entrar';
            return;
        }

        // Check if user is admin
        if (data.user.role !== 'admin') {
            showAlert('Acesso negado. Apenas administradores podem acessar este painel.', 'error');
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Entrar';
            return;
        }

        // Store admin auth
        const adminData = {
            id: data.user.id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            role: data.user.role
        };

        localStorage.setItem('adminAuth', JSON.stringify(adminData));

        showAlert('Login realizado com sucesso! Redirecionando...', 'success');

        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        showAlert('Erro ao fazer login. Tente novamente.', 'error');
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Entrar';
    }
}

function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert alert-${type} show`;
}
