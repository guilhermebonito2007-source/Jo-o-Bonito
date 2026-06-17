# Sistema de Admin e Perfil de Utilizador - Loja Sende

## 📋 Visão Geral

Este documento descreve o sistema integrado de admin e gerenciamento de perfil de utilizador implementado na Loja Sende.

## 🔐 Segurança

### Hash de Password
- Utiliza **bcryptjs** para hash seguro de passwords
- Passwords com salt de 10 rounds
- Passwords nunca armazenadas em plaintext

### Autenticação Admin
- Middleware de autenticação via header `x-user-id`
- Verificação de role `admin` em todas as rotas administrativas
- Tokens JWT (preparado para implementação futura)

## 👤 Conta Admin Padrão

Quando a base de dados é inicializada, uma conta admin é criada automaticamente:

```
Email: admin@loja.pt
Senha: Admin@123
```

**⚠️ IMPORTANTE:** Altere a senha na primeira login!

## 🚀 Como Iniciar

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Inicializar Base de Dados

```bash
npm run init-db
```

Isto vai:
- Criar todas as tabelas
- Inserir categorias iniciais
- Criar a conta admin padrão

### 3. Iniciar o Servidor

```bash
npm start        # Produção
npm run dev      # Desenvolvimento (com nodemon)
```

### 4. Aceder ao Painel de Admin

```
http://localhost:3000/admin/admin-login.html
```

## 📱 Funcionalidades do Admin

### Dashboard
- Estatísticas gerais (utilizadores, encomendas, receita)
- Encomendas pendentes
- Produtos com baixo stock

### Gestão de Encomendas
- Listar todas as encomendas
- Ver detalhes completos
- Atualizar status (pendente → processada → enviada → entregue/cancelada)
- Filtrar e pesquisar

### Gestão de Utilizadores
- Listar todos os clientes
- Ver detalhes do utilizador
- Ver histórico de encomendas
- Ver atividades do utilizador

### Gestão de Pagamentos
- Listar todos os pagamentos
- Filtrar por método (cartão, MB WAY, transferência, multibanco)
- Ver status de pagamento

### Relatórios
- Produtos mais vendidos (top 10)
- Relatório de vendas por período
- Exportação de dados

### Histórico de Atividades
- Log de todas as ações de admin
- Login/logout de utilizadores
- Alterações de perfil
- Atualizações de encomendas

### Gestão de Contactos
- Listar contactos/suporte
- Marcar como lido/respondido

## 👥 Funcionalidades do Perfil de Utilizador

### Autenticação
- Registro com validação
- Login com hash de password
- Persistência de sessão em localStorage

### Gestão de Perfil
- Ver informações pessoais
- Editar perfil
- Visualizar histórico de encomendas
- Alterar senha

### Integração API
- Login: `POST /api/users/login`
- Register: `POST /api/users/register`
- Perfil: `GET /api/users/{userId}`
- Atualizar Perfil: `PUT /api/users/{userId}`

## 📊 Estrutura de Base de Dados

### Tabela `users`
```sql
id              INTEGER PRIMARY KEY
email           TEXT UNIQUE NOT NULL
password        TEXT NOT NULL (hashed)
first_name      TEXT
last_name       TEXT
phone           TEXT
address         TEXT
city            TEXT
postal_code     TEXT
country         TEXT
role            TEXT (customer/admin)
is_active       BOOLEAN
created_at      DATETIME
updated_at      DATETIME
```

### Tabela `activity_log`
```sql
id              INTEGER PRIMARY KEY
user_id         INTEGER
action          TEXT
description     TEXT
ip_address      TEXT
created_at      DATETIME
```

## 🔌 Endpoints de Admin

### Dashboard
```
GET /api/admin/dashboard
```

### Encomendas
```
GET /api/admin/orders
GET /api/admin/orders/:orderId
PUT /api/admin/orders/:orderId/status
```

### Utilizadores
```
GET /api/admin/users
GET /api/admin/users/:userId
```

### Pagamentos
```
GET /api/admin/payments
```

### Relatórios
```
GET /api/admin/reports/sales?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
GET /api/admin/reports/top-products?limit=10
```

### Atividades
```
GET /api/admin/activity-log
```

### Contactos
```
GET /api/admin/contacts
PUT /api/admin/contacts/:contactId
```

## 🔑 Headers Necessários

Todas as rotas de admin requerem o header:
```
x-user-id: <id-do-admin>
```

Exemplo:
```bash
curl -H "x-user-id: 1" http://localhost:3000/api/admin/dashboard
```

## 📝 Boas Práticas

### Para Administradores
1. ✅ Altere a senha padrão na primeira login
2. ✅ Revise regularmente o histórico de atividades
3. ✅ Monitore o stock de produtos
4. ✅ Responda aos contactos dos clientes
5. ✅ Faça backup regular da base de dados

### Para Utilizadores
1. ✅ Use uma senha forte (mínimo 6 caracteres)
2. ✅ Mantenha informações de perfil atualizadas
3. ✅ Verifique regularmente o status das encomendas
4. ✅ Contacte o suporte para questões

## 🐛 Troubleshooting

### Admin não consegue fazer login
- Verifique se a base de dados foi inicializada
- Verifique se o email e senha estão corretos
- Confirme que a conta tem role `admin`

### Erro "Acesso negado" em rotas de admin
- Verifique se o header `x-user-id` está sendo enviado
- Verifique se a conta do utilizador tem role `admin`
- Verifique se a conta está ativa (`is_active = 1`)

### Passwords não funcionam
- Certifique-se de que bcryptjs está instalado
- Verifique se o schema foi criado com o campo role

## 📚 Tecnologias Utilizadas

- **Express.js** - Framework web
- **SQLite3** - Base de dados
- **bcryptjs** - Hash de passwords
- **CORS** - Compartilhamento de recursos
- **ES6+** - JavaScript moderno

## 🔄 Próximas Melhorias

- [ ] Implementar JWT para autenticação
- [ ] Adicionar 2FA (Two-Factor Authentication)
- [ ] Email de confirmação para registro
- [ ] Reset de password por email
- [ ] Exportação de relatórios em PDF
- [ ] Dashboard com gráficos
- [ ] Notificações em tempo real
- [ ] Backup automático de base de dados

## 📧 Suporte

Para questões ou problemas, contacte o desenvolvedor ou suporte técnico.

---

**Última atualização:** Junho 2026
**Versão:** 1.0.0
