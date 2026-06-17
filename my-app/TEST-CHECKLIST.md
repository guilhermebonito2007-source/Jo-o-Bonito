# ✅ Checklist de Testes - Sistema de Admin e Perfil

## 🚀 Setup Inicial

- [ ] `npm install` executado com sucesso
- [ ] `npm run init-db` executado sem erros
- [ ] Admin criado com sucesso
- [ ] `npm run dev` iniciou o servidor em http://localhost:3000

## 🔐 Testes de Autenticação Admin

### Login de Admin
- [ ] Aceder a `http://localhost:3000/admin/admin-login.html`
- [ ] Inserir email: `admin@loja.pt`
- [ ] Inserir senha: `Admin@123`
- [ ] Clicar "Entrar"
- [ ] Verificar se redireciona para `admin.html`
- [ ] Verificar se mostra dados do admin

### Logout de Admin
- [ ] Clicar botão "Logout" no topo
- [ ] Confirmar logout
- [ ] Verificar se redireciona para login

### Segurança de Login
- [ ] Tentar login com email incorreto → erro "Credenciais inválidas"
- [ ] Tentar login com senha incorreta → erro "Credenciais inválidas"
- [ ] Tentar aceder a admin.html sem login → redireciona para login

## 📊 Testes de Dashboard

- [ ] Verificar estatísticas carregam corretamente
- [ ] Contar total de utilizadores
- [ ] Contar total de encomendas
- [ ] Calcular receita total
- [ ] Mostrar encomendas pendentes
- [ ] Mostrar produtos com baixo stock

## 📦 Testes de Gestão de Encomendas

- [ ] Carregar lista de encomendas
- [ ] Filtrar encomendas por número
- [ ] Clicar em "Ver Detalhes" de uma encomenda
- [ ] Modal mostra informações completas
- [ ] Ver itens da encomenda
- [ ] Atualizar status (pendente → processada)
- [ ] Atualizar status (processada → enviada)
- [ ] Atualizar status (enviada → entregue)
- [ ] Atualizar status (para cancelada)
- [ ] Verificar que status foi atualizado na lista
- [ ] Fechar modal

## 👥 Testes de Gestão de Utilizadores

- [ ] Carregar lista de utilizadores
- [ ] Filtrar utilizadores por email
- [ ] Clicar "Ver Detalhes" de um utilizador
- [ ] Modal mostra dados pessoais
- [ ] Mostrar lista de encomendas do utilizador
- [ ] Mostrar atividades recentes

## 💳 Testes de Pagamentos

- [ ] Carregar lista de pagamentos
- [ ] Filtrar por método "Cartão"
- [ ] Filtrar por método "MB WAY"
- [ ] Filtrar por método "Transferência"
- [ ] Filtrar por método "Multibanco"
- [ ] Verificar status de pagamento

## 📈 Testes de Relatórios

- [ ] Carregar Top 10 produtos mais vendidos
- [ ] Inserir data início
- [ ] Inserir data fim
- [ ] Clicar "Carregar Relatório"
- [ ] Verificar dados do relatório
- [ ] Mostrar total de encomendas e receita

## 📋 Testes de Histórico de Atividades

- [ ] Carregar histórico de atividades
- [ ] Verificar login do admin está registado
- [ ] Verificar atividades de utilizadores
- [ ] Verificar atualizações de encomendas registadas

## 💬 Testes de Contactos

- [ ] Carregar lista de contactos
- [ ] Clicar "Marcar Lido" em um contacto
- [ ] Verificar que status mudou para "lido"

## 👤 Testes de Perfil de Utilizador

### Registro
- [ ] Aceder a `http://localhost:3000/prefil/prefil.html`
- [ ] Clicar "Criar Conta"
- [ ] Preencher formulário com dados válidos
- [ ] Senha mínimo 6 caracteres
- [ ] Confirmar senha
- [ ] Clicar "Criar Conta"
- [ ] Verificar mensagem de sucesso
- [ ] Contas criadas aparecem na lista de admin

### Login
- [ ] Fazer login com a conta criada
- [ ] Verificar que mostra dados pessoais
- [ ] Verificar email correto
- [ ] Verificar nome correto

### Editar Perfil
- [ ] Clicar "Editar Perfil"
- [ ] Modificar dados (nome, telefone, endereço)
- [ ] Clicar "Guardar Alterações"
- [ ] Verificar que dados foram atualizados
- [ ] Verificar mudanças também no admin

### Ver Encomendas
- [ ] Clicar "Ver Encomendas"
- [ ] Verificar lista de encomendas do utilizador
- [ ] Verificar número de encomenda
- [ ] Verificar total
- [ ] Verificar status

### Logout de Utilizador
- [ ] Clicar "Fazer Logout"
- [ ] Confirmar logout
- [ ] Redireciona para tela de login

## 🔒 Testes de Segurança

- [ ] Passwords com hash não são visíveis na base de dados
- [ ] Não é possível ver senha de outro utilizador
- [ ] Utilizador comum não consegue aceder a `/admin/admin.html`
- [ ] Admin consegue aceder a dados de qualquer utilizador
- [ ] Atividades são registadas corretamente
- [ ] Histórico de atividades mostra apenas para admin

## 📱 Testes de Responsividade

- [ ] Admin panel funciona em desktop
- [ ] Admin panel funciona em tablet (se aplicável)
- [ ] Perfil de utilizador funciona em mobile
- [ ] Botões e formulários funcionam corretamente

## 🐛 Testes de Tratamento de Erros

- [ ] Erro ao conectar à base de dados → mensagem clara
- [ ] Erro na API → mensagem de erro
- [ ] Timeout → mensagem apropriada
- [ ] Formulário incompleto → validação
- [ ] Email inválido → validação

## 🚀 Testes de Performance

- [ ] Carregamento do dashboard < 2 segundos
- [ ] Carregamento de lista de encomendas < 2 segundos
- [ ] Não há lag ao filtrar dados
- [ ] Carregamento de relatórios < 3 segundos

## 📝 Anotações

Espaço para anotar problemas encontrados:

```
Problema: 
Solução:

---

Problema:
Solução:
```

## ✨ Após Completar Todos os Testes

- [ ] Documentação está atualizada
- [ ] Código está comentado
- [ ] Não há erros na console (F12)
- [ ] Não há warnings desnecessários
- [ ] Pronto para produção (após password change)

---

**Data de Testes:** ______________
**Testador:** ______________
**Status:** ✅ Completo / ⚠️ Com Problemas / ❌ Falhas Críticas
