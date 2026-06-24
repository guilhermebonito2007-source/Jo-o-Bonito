# 📦 Projeto Preparado para Render.com + dominios.pt

**Status:** ✅ Pronto para deploy em produção

---

## 🎯 Resumo do que foi feito

| ✅ | Ação | Ficheiro |
|---|---|---|
| ✅ | Script de preparação criado | `backend/prepare-render.js` |
| ✅ | Package.json atualizado com script `build` | `backend/package.json` |
| ✅ | Variáveis de ambiente preparadas | `backend/.env.production` |
| ✅ | Gitignore configurado | `.gitignore` (raiz) |
| ✅ | Guia completo de deploy | `RENDER-DEPLOY.md` |

---

## 🚀 Como fazer deploy agora

### **Opção 1: Deploy Completo (Recomendado)**

Segue este guia passo-a-passo:

👉 **[Ver RENDER-DEPLOY.md](RENDER-DEPLOY.md)**

**Resumo dos passos:**
1. Push para GitHub
2. Criar Web Service em Render.com
3. Configurar variáveis de ambiente
4. Apontar DNS em dominios.pt
5. Testar ✅

**Tempo estimado:** 15-20 minutos (+ 5-30 minutos de propagação DNS)

---

### **Opção 2: Teste Local Antes de Deploy**

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run build
npm start

# Terminal 2 - Testar API
curl http://localhost:10000/api/health
```

Deverá ver:
```json
{"status":"OK","message":"Servidor ativo"}
```

---

## 🔐 Configurações Importantes para Render

### Variáveis de Ambiente Essenciais

```
NODE_ENV=production
PORT=10000
DOMAIN=seu-dominio.com
JWT_SECRET=<chave-segura-64-chars>
SESSION_SECRET=<chave-segura-64-chars>
ADMIN_PASSWORD=<muda-a-password>
```

Ver `.env.production` para a lista completa.

---

## 🔗 Configuração DNS em dominios.pt

### Registos Necessários

```
Tipo: CNAME
Host: www → loja-sende.onrender.com
Host: @   → loja-sende.onrender.com
```

**Propaga em:** 5-30 minutos

---

## 📞 Próximas Etapas

- [ ] Clona o repo em GitHub (se não tiveres)
- [ ] Segue o guia [RENDER-DEPLOY.md](RENDER-DEPLOY.md)
- [ ] Altera as passwords nos Env Vars de Render
- [ ] Testa o site no domínio

---

## 📚 Documentação Completa

- **Deploy em Render:** [RENDER-DEPLOY.md](RENDER-DEPLOY.md)
- **API Reference:** [API-REFERENCE.md](API-REFERENCE.md)
- **Segurança:** [API-SECURITY-REFERENCE.md](API-SECURITY-REFERENCE.md)
- **Database:** [DATABASE-REFERENCE.md](DATABASE-REFERENCE.md)

---

**Data:** 2026-06-15  
**Estado:** ✅ Pronto para produção
