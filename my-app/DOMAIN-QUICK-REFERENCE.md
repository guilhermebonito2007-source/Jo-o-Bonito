# 🚀 Domínio Próprio - Referência Rápida

## 1️⃣ Registar Domínio

```
namecheap.com → Procurar → Comprar (~€5/ano)
Confirmar email
Aguardar confirmação
```

## 2️⃣ Configurar DNS

**Painel Namecheap → Manage → DNS Records**

```
Type: A       Host: @    Value: SEU_IP    TTL: 3600
Type: A       Host: www  Value: SEU_IP    TTL: 3600
```

**Obter IP:**
```powershell
# Local
ipconfig

# Remoto (VPS)
# Ver no painel do provedor
```

**Testar DNS:**
```bash
nslookup seu-dominio.pt
# Ou: https://mxtoolbox.com
```

## 3️⃣ Instalar Nginx + SSL

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

# Certificado automático
sudo certbot --nginx -d seu-dominio.pt -d www.seu-dominio.pt
```

### Windows
```powershell
# Opcão 1: Chocolatey
choco install nginx

# Opção 2: Manual
# https://nginx.org/en/download.html

# Executar script
.\setup-windows.ps1 -Domain "seu-dominio.local"
```

## 4️⃣ Configurar Nginx

**Usar configuração pronta:**
```bash
# Linux
sudo cp nginx.conf.example /etc/nginx/sites-available/seu-dominio.conf

# Editar e substituir
sudo nano /etc/nginx/sites-available/seu-dominio.conf
# - meu-site.pt → seu-dominio.pt
# - 127.0.0.1:3000 → seu IP:porta

# Ativar
sudo ln -s /etc/nginx/sites-available/seu-dominio.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 5️⃣ Atualizar .env

```env
NODE_ENV=production
DOMAIN=seu-dominio.pt
DOMAIN_URL=https://seu-dominio.pt
CORS_ORIGIN=https://seu-dominio.pt,https://www.seu-dominio.pt
COOKIE_SECURE=true
COOKIE_SAMESITE=Strict
```

## 6️⃣ Deploy

```bash
# PM2 (recomendado)
npm install -g pm2

cd backend
pm2 start server.js --name "loja"
pm2 startup
pm2 save

# Status
pm2 status
pm2 logs
```

## 7️⃣ Testar

```
https://seu-dominio.pt                    ← Frontend
https://seu-dominio.pt/admin/admin.html   ← Admin
https://seu-dominio.pt/api/health         ← API
```

---

## 🖥️ Opções por Cenário

### 💻 Casa (Desenvolvimento)
```
1. Script: setup-windows.ps1
2. Domínio local em .hosts
3. Certificado auto-assinado
4. Testes apenas localmente
```

### 🔧 Servidor Dedicado
```
1. VPS (Hetzner €3/mês)
2. Script: deploy.sh seu-dominio.pt
3. Let's Encrypt automático
4. PM2 + Systemd
```

### ☁️ Platform as a Service
```
1. Render.com / Railway.app
2. Conectar GitHub
3. Deploy automático
4. Domínio customizado
```

---

## ✅ Checklist

- [ ] Domínio registado
- [ ] DNS propagado (nslookup funciona)
- [ ] Nginx instalado
- [ ] Certificado SSL em /etc/letsencrypt ou C:\nginx\certs
- [ ] nginx.conf configurado
- [ ] .env atualizado
- [ ] Backend a rodar (pm2 status)
- [ ] https://seu-dominio.pt funciona
- [ ] Admin panel acessível

---

## 🆘 Problemas Comuns

| Erro | Fix |
|------|-----|
| "Recusou ligar" | Firewall: Abrir portas 80, 443 |
| "ERR_SSL_VERSION_OR_CIPHER_MISMATCH" | Certificado inválido. Renovar: `certbot renew` |
| "404 Not Found" | Nginx config errada. Test: `nginx -t` |
| "Cannot GET /" | Node.js não está ativo. `pm2 start` |
| "CORS error" | Editar CORS_ORIGIN no .env |

---

## 📚 Documentação

| Documento | Para Quem |
|-----------|----------|
| DOMAIN-SETUP.md | Explicação completa |
| QUICK-DEPLOY.md | Deploy rápido (5 min) |
| DEPLOYMENT-GUIDE.md | Detalhes técnicos |
| nginx.conf.example | Config pronta |

---

## 📞 Links Úteis

- **Let's Encrypt:** https://letsencrypt.org/
- **Nginx Docs:** https://nginx.org/en/docs/
- **Registar:** https://www.namecheap.com/
- **VPS:** https://www.hetzner.com/cloud
- **DNS Dinâmico:** https://www.noip.com/

---

**⏱️ Tempo total: ~30 minutos**

🎉 Sucesso! Seu site está online!
