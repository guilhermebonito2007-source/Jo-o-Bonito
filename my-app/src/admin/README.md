# 🛡️ Painel de Admin - Loja Sende

## ⚡ Acesso Rápido

```
URL: http://localhost:3000/admin/admin-login.html
```

## 🔐 Credenciais Padrão

```
Email: admin@loja.pt
Senha: Admin@123
```

⚠️ **Altere a senha na primeira login!**

## 📁 Arquivos

- `admin.html` - Interface do painel
- `admin.css` - Estilos
- `admin.js` - Lógica JavaScript
- `admin-login.html` - Página de login
- `admin-login.js` - Lógica de login

## ✨ Funcionalidades

### 📊 Dashboard
- Estatísticas gerais da loja
- Total de utilizadores, encomendas e receita
- Encomendas pendentes
- Produtos com baixo stock

### 📦 Encomendas
- Listar todas as encomendas
- Ver detalhes completos
- Atualizar status
- Filtrar por número/cliente

### 👥 Utilizadores
- Listar todos os clientes
- Ver dados pessoais
- Ver histórico de encomendas
- Ver atividades do utilizador

### 💳 Pagamentos
- Listar todos os pagamentos
- Filtrar por método
- Ver status de pagamento

### 📈 Relatórios
- Produtos mais vendidos
- Vendas por período
- Relatórios customizados

### 📋 Atividades
- Log de todas as ações
- Logins de utilizadores
- Atualizações de dados

### 💬 Contactos
- Mensagens de suporte
- Marcar como lido/respondido

## 🚀 Como Começar

1. **Instale o backend:**
   ```bash
   cd backend
   npm install
   npm run init-db
   npm run dev
   ```

2. **Aceda ao painel:**
   ```
   http://localhost:3000/admin/admin-login.html
   ```

3. **Faça login com as credenciais padrão**

4. **Altere a senha imediatamente**

## 📚 Documentação

👉 Ver [ADMIN-GUIDE.md](../ADMIN-GUIDE.md) para documentação completa

## 🆘 Problemas?

- **Login não funciona:** Verifique se `npm run init-db` foi executado
- **Erro de conexão:** Verifique se o servidor está rodando em `http://localhost:3000`
- **Sem acesso:** Verifique se tem role de `admin` na base de dados

---

**Desenvolvido com ❤️ para Loja Sende**
