# ⚡ Deploy Rápido com Domínio Próprio

## 🎯 Passos Principais (5 Minutos)

### 1️⃣ Registar Domínio
- Ir para **Namecheap.com** ou similar
- Registar `seu-dominio.pt` (~€5/ano)
- ✅ Aguardar confirmação do email

### 2️⃣ Configurar DNS (no painel do registador)

**Adicionar 2 registos:**

| Tipo | Host | Valor | TTL |
|------|------|-------|-----|
| A | @ | SEU_IP_PÚBLICO | 3600 |
| A | www | SEU_IP_PÚBLICO | 3600 |

**Como obter IP público:**
```powershell
# Se servidor estiver em casa:
(Invoke-WebRequest -Uri "https://api.ipify.org").Co..      ntent

# Se for VPS, está no painel do provedor
```

⏱️ **Aguarde 10-30 minutos** para propagação

### 3️⃣ Certificado SSL Grátis (Let's Encrypt)

**Linux (recomendado):**
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Gerar certificado automaticamente
sudo certbot --nginx -d seu-dominio.pt -d www.seu-dominio.pt

# Pronto! Nginx recarrega automaticamente
```

**Windows (via WSL2):**
```powershell
# Ativar WSL2 e Ubuntu
wsl --install

# Depois dentro do WSL, seguir comandos Linux acima
```

### 4️⃣ Configurar Nginx (Proxy Reverso)

**Copiar ficheiro de exemplo:**
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/seu-dominio.conf
```

**Editar ficheiro:**
```bash
sudo nano /etc/nginx/sites-available/seu-dominio.conf
```

**Substituir:**
- `joaobonito.pt` → seu-dominio.pt
- `127.0.0.1:3000` → IP:PORTA do seu servidor Node

**Ativar:**
```bash
# Criar link
sudo ln -s /etc/nginx/sites-available/seu-dominio.conf /etc/nginx/sites-enabled/

# Testar config
sudo nginx -t

# Recarregar
sudo systemctl reload nginx
```

### 5️⃣ Atualizar Variáveis de Ambiente

**Editar `backend/.env`:**
```env
NODE_ENV=production
DOMAIN=seu-dominio.pt
DOMAIN_URL=https://seu-dominio.pt
CORS_ORIGIN=https://seu-dominio.pt,https://www.seu-dominio.pt
COOKIE_SECURE=true
```

### 6️⃣ Deploy (Manter app ativa com PM2)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar app
cd backend
pm2 start server.js --name "loja-sende"

# Auto-iniciar com sistema
pm2 startup
pm2 save

# Ver status
pm2 status
pm2 logs
```

### 7️⃣ Testar

```bash
# Testar DNS
nslookup seu-dominio.pt

# Aceder
https://seu-dominio.pt

# Verificar certificado (deve estar verde 🟢)
```

---

## 🚀 Alternativa: Deploy em 1 Clique (VPS Cloud)

### Heroku (Simples - €7/mês)
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create seu-dominio

# Deploy
git push heroku main

# Domain
heroku domains:add seu-dominio.pt
```

### Vercel (Para frontend - Grátis!)
- Conectar GitHub
- Deploy automático
- SSL grátis

### Replit (Muito simples - Grátis)
- Clonar projeto
- Deploy com 1 clique
- Domínio customizado pago

---

## ✅ Checklist Final

- [ ] DNS configurado (propagação completa)
- [ ] Certificado SSL instalado
- [ ] Nginx a fazer proxy reverso
- [ ] .env atualizado
- [ ] PM2 a manter app ativa
- [ ] Testes: https://seu-dominio.pt
- [ ] Admin panel funciona
- [ ] Produtos carregam

---

## 🔧 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "Recusou-se a ligar" | Firewall bloqueando 80/443. Abrir portas. |
| "Certificado inválido" | Aguardar propagação DNS. Testar com `nslookup seu-dominio.pt` |
| "404 Not Found" | Nginx config errada. Ver: `sudo nginx -t` |
| "Connection refused" | Node.js não está ativo. Ver: `pm2 status` |
| "CORS error" | Atualizar `CORS_ORIGIN` no .env |

---

## 📝 Referências

- **DEPLOYMENT-GUIDE.md** - Guia completo (mais detalhes)
- **nginx.conf.example** - Configuração Nginx completa
- **.env.example** - Todas as variáveis de ambiente

---

🎉 **Pronto! Seu site está online com domínio próprio!**

Dúvidas? Ver DEPLOYMENT-GUIDE.md para mais detalhes.
