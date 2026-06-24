# 🚀 Deploy em Render.com + dominios.pt

Guia passo-a-passo para publicar a aplicação num domínio próprio.

## 📋 Pré-requisitos

- ✅ Domínio registado em [dominios.pt](https://www.dominios.pt)
- ✅ Conta em [GitHub.com](https://github.com)
- ✅ Conta em [Render.com](https://render.com)

---

## 🔧 Passo 1: Preparar o Projeto

### 1.1 Instalação local (teste)

```bash
cd backend
npm install
npm run build
npm start
```

Confirma que o servidor inicia sem erros em `http://localhost:3000`.

### 1.2 Commit e Push para GitHub

```bash
git add .
git commit -m "Preparado para deploy em Render"
git push origin main
```

---

## 🌐 Passo 2: Deploy em Render.com

### 2.1 Criar Web Service em Render

1. Acede a [https://render.com](https://render.com)
2. **Dashboard** → **New** → **Web Service**
3. Conecta com GitHub (autoriza se necessário)
4. Seleciona o repositório

### 2.2 Configurar o Web Service

| Campo | Valor |
|-------|-------|
| **Name** | `loja-sende` (ou nome à tua escolha) |
| **Environment** | `Node` |
| **Region** | `Frankfurt` (Europa) |
| **Branch** | `main` |
| **Build Command** | `cd backend && npm install && npm run build` |
| **Start Command** | `cd backend && npm start` |
| **Instance Type** | `Free` (ou Starter consoante necessidade) |

### 2.3 Adicionar Variáveis de Ambiente

Em **Environment**, adiciona:

```
NODE_ENV=production
PORT=10000
DOMAIN=seu-dominio.com
DOMAIN_URL=https://seu-dominio.com
ALLOWED_HOSTS=seu-dominio.com,www.seu-dominio.com
JWT_SECRET=<gera-uma-chave-segura-de-64-caracteres>
JWT_EXPIRE=7d
SESSION_SECRET=<gera-outra-chave-segura-de-64-caracteres>
CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com
COOKIE_SECURE=true
COOKIE_SAMESITE=Strict
ADMIN_EMAIL=admin@seu-dominio.com
ADMIN_PASSWORD=<muda-para-uma-password-segura>
```

> 💡 **Dica:** Gera secrets seguros em [generate.random.org](https://generate.random.org)

### 2.4 Deploy

1. Clica em **Create Web Service**
2. Render faz o build e deploy automaticamente
3. Aguarda até ver "✓ Live" (pode demorar 2-5 minutos)
4. Pega no URL fornecido (ex: `https://loja-sende.onrender.com`)

---

## 🔗 Passo 3: Configurar DNS em dominios.pt

### 3.1 Aceder à Zona DNS

1. Login em [dominios.pt](https://www.dominios.pt)
2. **Meus Domínios** → Seleciona teu domínio
3. **Gerir DNS** (ou "Zona DNS")

### 3.2 Criar Registos CNAME

Adiciona **dois registos CNAME** para apontar para Render:

#### Registo 1 - www
| Campo | Valor |
|-------|-------|
| **Host/Nome** | `www` |
| **Tipo** | `CNAME` |
| **Valor/Alvo** | `loja-sende.onrender.com` |
| **TTL** | `3600` |

#### Registo 2 - @ (raiz do domínio)
| Campo | Valor |
|-------|-------|
| **Host/Nome** | `@` (ou deixa vazio) |
| **Tipo** | `CNAME` |
| **Valor/Alvo** | `loja-sende.onrender.com` |
| **TTL** | `3600` |

### 3.3 Guarda as alterações

Clica em **Guardar** e aguarda a propagação DNS (5-30 minutos, geralmente mais rápido).

---

## ✅ Passo 4: Validar o Deploy

### 4.1 Testa a conectividade DNS

```bash
nslookup seu-dominio.com
nslookup www.seu-dominio.com
```

Deverá mostrar o IP de Render.

### 4.2 Acede ao site

- **Com www:** `https://www.seu-dominio.com`
- **Sem www:** `https://seu-dominio.com`

Se vires a loja carregada ✅, está tudo correto!

### 4.3 Testa o backend

```bash
curl https://seu-dominio.com/api/health
```

Deverá retornar:
```json
{"status":"OK","message":"Servidor ativo"}
```

---

## 🔐 Passo 5: Configurações de Segurança

### 5.1 HTTPS (Render)

Render fornece HTTPS automaticamente com certificados Let's Encrypt. Não precisa de configuração adicional.

### 5.2 Alterar Password do Admin

1. Acede a `https://seu-dominio.com/admin/admin-login.html`
2. Email: `admin@seu-dominio.com`
3. Password: (a que configuraste nas variáveis de ambiente)
4. **Altera a password na primeira login!**

### 5.3 Ativar força HTTPS em dominios.pt (Opcional)

Algumas plataformas permitem forçar HTTPS. Em dominios.pt, verifica se há uma opção para "SSL/HTTPS obrigatório".

---

## 🐛 Troubleshooting

### "ERR_NAME_NOT_RESOLVED" (domínio não encontrado)

- Aguarda 10-30 minutos para DNS propagar
- Verifica os registos CNAME em dominios.pt
- Testa com: `nslookup seu-dominio.com`

### "Connection Refused" (não consegue conectar)

- Verifica se o Web Service em Render está "Live" (verde)
- Verifica os Build Logs em Render para erros
- Tenta `npm run build` localmente para replicar o erro

### "Base de dados vazia"

- Render usa `/tmp` como storage temporário (apagado após deploy)
- Para data persistente, considera usar PostgreSQL em vez de SQLite
- Ver secção **Melhorias Futuras**

---

## 📈 Melhorias Futuras

### 1. **Database Persistente**

SQLite em Render é temporário. Para produção, recomenda-se:

- PostgreSQL no Render (pago, mas persistente)
- MongoDB Atlas (free tier disponível)
- Supabase (PostgreSQL com UI)

### 2. **CI/CD Automático**

Render faz deploy automático quando fazes push para `main`. Configura:

- Branch protection rules
- Tests antes de merge
- Staging environment

### 3. **Monitoring**

- Render Dashboard: Vê logs e uptime
- Ativa alertas por email em Render
- Integra com Sentry para error tracking

### 4. **Custom Domain com Subdomain**

Se quiseres `shop.seu-dominio.com`:

```
Host: shop
Tipo: CNAME
Valor: loja-sende.onrender.com
```

---

## 📞 Suporte

- **Render Docs:** https://render.com/docs
- **dominios.pt Help:** https://www.dominios.pt/pt/help
- **Node.js Deploy:** https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

---

**Status:** ✅ Deploy pronto para produção
**Data:** 2026-06-15
**Última atualização:** Vê DEPLOYMENT-GUIDE.md para mais detalhes
