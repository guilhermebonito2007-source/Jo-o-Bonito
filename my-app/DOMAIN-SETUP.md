# 🌐 Guia: Atribuir Domínio Próprio

## 📊 Arquitetura

```
┌─────────────────────────────────────┐
│        Seu Domínio                  │
│   seu-dominio.com                   │
│   (Registrado em Namecheap, etc)    │
└──────────────┬──────────────────────┘
               │
               │ DNS A Record aponta para
               ↓
┌─────────────────────────────────────┐
│   SEU SERVIDOR                      │
│   IP: 192.168.1.100 (ou IP público) │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │ Portas 80/443  │
       ↓                ↓
┌────────────┐  ┌────────────────┐
│  HTTP      │  │  HTTPS (SSL)   │
│ :80        │  │  :443          │
└──────┬─────┘  └────────┬───────┘
       └──────────┬──────┘
                  │
                  ↓
         ┌──────────────────┐
         │   NGINX          │
         │ (Proxy Reverso)  │
         └────────┬─────────┘
                  │
                  ↓ localhost:3000
         ┌──────────────────┐
         │   Node.js        │
         │   Express        │
         │   Servidor API   │
         └────────┬─────────┘
                  │
                  ↓
         ┌──────────────────┐
         │  SQLite DB       │
         │  Produtos        │
         │  Utilizadores    │
         └──────────────────┘
```

---

## 🎯 Passo a Passo Rápido

### 1. Registar Domínio (5 min)
```
Site: namecheap.com
Procurar: seu-dominio.pt
Comprar: €5 - €10/ano
Email: Confirmar compra
```

### 2. Configurar DNS (5 min)
```
Painel Namecheap → Manage Domain → DNS
Adicionar:
  Type A | Host @ | Value SEU_IP | TTL 3600
  Type A | Host www | Value SEU_IP | TTL 3600
```

### 3. Instalar Nginx + SSL (10 min)
```bash
# Linux
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.pt

# Windows
choco install nginx
# Configurar manualmente ou usar script
```

### 4. Configurar .env (2 min)
```env
DOMAIN=seu-dominio.pt
DOMAIN_URL=https://seu-dominio.pt
CORS_ORIGIN=https://seu-dominio.pt
COOKIE_SECURE=true
```

### 5. Deploy (5 min)
```bash
pm2 start backend/server.js --name "loja"
pm2 startup
```

### 6. Testar
```
Abrir: https://seu-dominio.pt
Admin: https://seu-dominio.pt/admin/admin.html
```

**⏱️ Total: ~25 minutos**

---

## 📚 Ficheiros de Ajuda

| Ficheiro | Descrição |
|----------|-----------|
| `DEPLOYMENT-GUIDE.md` | 📖 Guia COMPLETO (detalhado) |
| `QUICK-DEPLOY.md` | ⚡ Versão rápida |
| `nginx.conf.example` | ⚙️ Configuração Nginx pronta |
| `deploy.sh` | 🤖 Script automático (Linux) |
| `setup-windows.ps1` | 🤖 Script Windows |
| `.env.example` | 📝 Variáveis de ambiente |

---

## 🖥️ Opções por Tipo de Servidor

### 💻 Servidor em Casa (Internet Casa)

**Prós:**
- ✅ Grátis
- ✅ Controlo total

**Contras:**
- ❌ IP muda com frequência
- ❌ ISP pode bloquear
- ❌ Menos confiável

**Setup:**
```
1. Registar domínio
2. Usar DNS dinâmico (No-IP, DuckDNS)
3. Abrir portas 80/443 no router
4. Instalar Nginx localmente
```

### 🔧 VPS/Servidor Cloud (RECOMENDADO)

**Prós:**
- ✅ IP fixo
- ✅ Uptime 99.9%
- ✅ Profissional

**Contras:**
- ❌ Custo (€3-10/mês)

**Provedores:**
- Hetzner: €3/mês 🔥
- DigitalOcean: €5/mês
- Linode: €5/mês

**Setup:**
```
1. Contratar VPS com Ubuntu
2. SSH para VPS
3. Instalar Node.js + Nginx
4. Certificado Let's Encrypt
5. Deploy app
```

### ☁️ Plataforma Cloud (Mais Fácil)

**Prós:**
- ✅ Deploy em 1 clique
- ✅ SSL automático
- ✅ Sem configuração

**Contras:**
- ❌ Menos controlo
- ❌ Mais caro

**Opções:**
- **Vercel** (frontend grátis)
- **Render** (backend €7/mês)
- **Railway** (€5/mês)
- **Heroku** (€7/mês)

---

## 🚀 Deploy Automático

### Linux
```bash
chmod +x deploy.sh
./deploy.sh seu-dominio.pt
```

### Windows
```powershell
.\setup-windows.ps1 -Domain "seu-dominio.local"
```

---

## ✅ Checklist Final

**Antes de Colocar em Produção:**

- [ ] Domínio registado e DNS propagado
- [ ] Certificado SSL/TLS instalado
- [ ] Nginx a fazer proxy reverso (testado)
- [ ] .env com configurações corretas
- [ ] App a rodar com PM2/Systemd
- [ ] Testes funcionais passam
- [ ] Emails funcionam (opcional)
- [ ] Backups automáticos configurados

---

## 🔐 Segurança

**Essencial em Produção:**

```env
NODE_ENV=production
JWT_SECRET=chave_muito_segura_64_chars
COOKIE_SECURE=true
COOKIE_SAMESITE=Strict
```

**Firewall:**
```bash
# Linux - Abrir portas
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**SSL/TLS:**
```bash
# Renovação automática (Certbot)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 🆘 Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| "Recusou ligar" | Firewall/Portas bloqueadas | Abrir 80, 443 |
| "Certificado inválido" | DNS não propagou | Aguardar 24-48h |
| "Connection refused" | App não está ativa | `pm2 status` / `pm2 start` |
| "CORS error" | Origin não configurada | Atualizar `CORS_ORIGIN` |
| "404 Not Found" | Nginx config errada | `sudo nginx -t` |

---

## 📞 Recursos

- **Let's Encrypt:** https://letsencrypt.org/
- **Nginx:** https://nginx.org/
- **Registar Domínio:** https://www.namecheap.com/
- **DNS Dinâmico:** https://www.noip.com/
- **VPS:** https://www.hetzner.com/cloud

---

## 🎓 Próximas Etapas (Opcional)

Depois de online:

1. **Email** - Configurar SMTP para notificações
2. **CDN** - CloudFlare para acelerar site
3. **Backups** - Automáticos diários
4. **Monitoramento** - Verificar uptime
5. **Analytics** - Google Analytics
6. **SEO** - Google Search Console

---

## 📞 Suporte

Dúvidas?

1. Ver **DEPLOYMENT-GUIDE.md** (completo)
2. Ver **QUICK-DEPLOY.md** (resumido)
3. Contactar suporte do registador/provedor

---

🎉 **Boa sorte com o seu site!** 🎉

Quando estiver online, não esqueça de compartilhar o link! 😎
