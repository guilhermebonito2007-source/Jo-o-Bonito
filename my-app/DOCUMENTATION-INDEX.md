# 📚 Índice de Documentação - Loja Sende

## 🎯 Por Onde Começar?

### ⚡ Estou com Pressa
👉 [QUICK-START.md](./QUICK-START.md) - 5 passos para começar

### 🔧 Quer Detalhar Setup
👉 [SETUP.md](./SETUP.md) - Instruções passo a passo

### 🌐 Quer Usar Domínio Próprio
👉 [DOMAIN-SETUP.md](./DOMAIN-SETUP.md) - Atribuir domínio (NOVO!)
👉 [QUICK-DEPLOY.md](./QUICK-DEPLOY.md) - Deploy rápido (NOVO!)
👉 [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) - Guia completo deploy (NOVO!)

### 🛡️ É Administrador
👉 [ADMIN-GUIDE.md](./ADMIN-GUIDE.md) - Guia completo de admin

### 💻 Quer Desenvolver
👉 [API-REFERENCE.md](./API-REFERENCE.md) - Endpoints de API

### ✅ Quer Testar
👉 [TEST-CHECKLIST.md](./TEST-CHECKLIST.md) - Testes e validação

### 📁 Estrutura de Arquivos
👉 [FILES-STRUCTURE.md](./FILES-STRUCTURE.md) - Todos os arquivos criados

### 📋 Resumo Técnico
👉 [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md) - O que foi implementado

---

## 📑 Documentação Rápida

### 🚀 Instalação & Setup
| Arquivo | Descrição |
|---------|-----------|
| [QUICK-START.md](./QUICK-START.md) | Setup em 5 passos |
| [SETUP.md](./SETUP.md) | Setup detalhado |

### 🌐 Deploy & Domínio (NOVO!)
| Arquivo | Descrição |
|---------|-----------|
| [DOMAIN-SETUP.md](./DOMAIN-SETUP.md) | Guia: Usar domínio próprio |
| [QUICK-DEPLOY.md](./QUICK-DEPLOY.md) | Deploy rápido (5 min) |
| [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) | Guia completo (detalhado) |
| [nginx.conf.example](./nginx.conf.example) | Config Nginx pronta |
| [deploy.sh](./deploy.sh) | Script deploy Linux |
| [setup-windows.ps1](./setup-windows.ps1) | Script setup Windows |

### 👤 Perfil & Utilizadores
| Arquivo | Descrição |
|---------|-----------|
| [ADMIN-GUIDE.md](./ADMIN-GUIDE.md) | Gestão de utilizadores |
| Perfil HTML | `src/prefil/prefil.html` |

### 🛡️ Admin & Painel
| Arquivo | Descrição |
|---------|-----------|
| [ADMIN-GUIDE.md](./ADMIN-GUIDE.md) | Guia do painel |
| [src/admin/README.md](./src/admin/README.md) | Info rápida do admin |
| Admin HTML | `src/admin/admin.html` |

### 💻 Desenvolvimento
| Arquivo | Descrição |
|---------|-----------|
| [API-REFERENCE.md](./API-REFERENCE.md) | Endpoints da API |
| [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md) | Detalhes técnicos |
| [FILES-STRUCTURE.md](./FILES-STRUCTURE.md) | Estrutura de arquivos |

### ✅ Testes & Validação
| Arquivo | Descrição |
|---------|-----------|
| [TEST-CHECKLIST.md](./TEST-CHECKLIST.md) | Checklist completo |

---

## 🎓 Guias por Perfil

### 👨‍💼 Para Gerenciador/Admin
1. Leia: [QUICK-START.md](./QUICK-START.md)
2. Depois: [ADMIN-GUIDE.md](./ADMIN-GUIDE.md)
3. Use: [TEST-CHECKLIST.md](./TEST-CHECKLIST.md) para validar

### 👨‍💻 Para Desenvolvedor
1. Leia: [SETUP.md](./SETUP.md)
2. Depois: [API-REFERENCE.md](./API-REFERENCE.md)
3. Consulte: [FILES-STRUCTURE.md](./FILES-STRUCTURE.md)

### 👥 Para Cliente/Utilizador
1. Leia: [QUICK-START.md](./QUICK-START.md)
2. Acesse: `http://localhost:3000/prefil/prefil.html`
3. Consulte: [ADMIN-GUIDE.md](./ADMIN-GUIDE.md) - secção "Perfil de Utilizador"

---

## 🔑 Credenciais Rápidas

```
Admin:
- Email: admin@loja.pt
- Senha: Admin@123 (ALTERE NA PRIMEIRA LOGIN!)
```

---

## 🌐 URLs Importantes

| Descrição | URL |
|-----------|-----|
| Página Inicial | http://localhost:3000 |
| Admin Login | http://localhost:3000/admin/admin-login.html |
| Admin Panel | http://localhost:3000/admin/admin.html |
| Perfil Utilizador | http://localhost:3000/prefil/prefil.html |
| API Health Check | http://localhost:3000/api/health |
| Produtos | http://localhost:3000/api/products |

---

## 📞 Estrutura de Suporte

Se encontrar problemas:

1. **Erro de Login:** Verifique [ADMIN-GUIDE.md](./ADMIN-GUIDE.md#-troubleshooting)
2. **Erro de API:** Verifique [API-REFERENCE.md](./API-REFERENCE.md#-códigos-de-resposta)
3. **Erro de Instalação:** Verifique [SETUP.md](./SETUP.md)
4. **Erro Geral:** Consulte [TEST-CHECKLIST.md](./TEST-CHECKLIST.md)

---

## 📊 Mapa Mental do Projeto

```
Loja Sende
│
├─ 🚀 Setup
│  ├─ QUICK-START.md (5 passos)
│  ├─ SETUP.md (detalhado)
│  └─ FILES-STRUCTURE.md (arquivos)
│
├─ 🛡️ Admin
│  ├─ ADMIN-GUIDE.md (guia completo)
│  ├─ src/admin/ (interface)
│  └─ TEST-CHECKLIST.md (testes)
│
├─ 👤 Perfil
│  ├─ Perfil HTML (interface)
│  └─ ADMIN-GUIDE.md (funcionalidades)
│
├─ 💻 API
│  ├─ API-REFERENCE.md (endpoints)
│  ├─ IMPLEMENTATION-SUMMARY.md (detalhes)
│  └─ backend/routes/ (código)
│
└─ 📚 Documentação
   └─ Este arquivo (índice)
```

---

## ✨ Checklist de Leitura

### Primeiro Acesso
- [ ] QUICK-START.md
- [ ] SETUP.md
- [ ] Credenciais de admin

### Antes de Usar em Produção
- [ ] ADMIN-GUIDE.md
- [ ] TEST-CHECKLIST.md
- [ ] Alterar senha de admin
- [ ] Testar todos os endpoints

### Para Desenvolvimento
- [ ] API-REFERENCE.md
- [ ] FILES-STRUCTURE.md
- [ ] IMPLEMENTATION-SUMMARY.md

---

## 🎉 Próximos Passos

1. ✅ Instale o projeto (QUICK-START.md)
2. ✅ Teste o painel (ADMIN-GUIDE.md)
3. ✅ Valide funcionalidades (TEST-CHECKLIST.md)
4. ✅ Explore a API (API-REFERENCE.md)
5. ✅ Customize conforme necessário

---

**Última Atualização:** Junho 2026
**Versão:** 1.0.0
**Status:** ✅ Pronto para Produção

---

*Para dúvidas ou sugestões, revise os documentos acima ou contacte o desenvolvedor.*
