# 🚀 Guia de Deploy com Domínio Próprio

Este guia mostra como atribuir um domínio próprio ao seu servidor Node.js/Express.

## 📋 Índice
1. [Registar um Domínio](#registar-um-domínio)
2. [Configurar DNS](#configurar-dns)
3. [Instalar Nginx (Proxy Reverso)](#instalar-nginx)
4. [Certificado SSL/TLS Gratuito](#certificado-ssltls)
5. [Configuração do Servidor](#configuração-do-servidor)
6. [Deploy em Produção](#deploy-em-produção)

---

## 1. Registar um Domínio

### Onde Registar?
- **Namecheap** (recomendado - €4-5/ano)
- **GoDaddy**
- **Google Domains**
- **Registadores locais Portugal** (Fccn, Associação Domínios)

### Exemplo de Domínio
```
meu-site.pt              ← Domínio raiz
www.meu-site.pt          ← Subdomínio www
```

---

## 2. Configurar DNS

Depois de registar o domínio, precisa apontar para o seu servidor.

### Obter o IP do Servidor
```powershell
# Windows - Ver IP local
ipconfig

# Para servidor remoto - IP público
# Pode ver em: https://whatismyipaddress.com
```

### Adicionar Registos DNS
Acesse o painel de controlo do seu registador e adicione:

**Tipo A Record:**
```
Host: @  (ou deixar em branco)
Type: A
Value: 192.168.1.100  (seu IP público/servidor)
TTL: 3600
```

**Para www:**
```
Host: www
Type: A
Value: 192.168.1.100
TTL: 3600
```

**Ou CNAME (alternativa):**
```
Host: www
Type: CNAME
Value: meu-site.pt
TTL: 3600
```

⏱️ **Aguarde 24-48 horas** para a propagação DNS

### Testar DNS
```powershell
# Windows
nslookup meu-site.pt

# Ou online: https://mxtoolbox.com
```

---

## 3. Instalar Nginx

Nginx vai fazer de **proxy reverso** - direciona as requisições para o Node.js.

### Instalação

**Windows:**
```powershell
# Descarregar Nginx
# https://nginx.org/en/download.html
# Ou usar package manager

# Se usar Chocolatey:
choco install nginx
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configurar Nginx

Criar ficheiro de configuração em:
- **Windows:** `C:\nginx\conf\sites-available\meu-site.conf`
- **Linux:** `/etc/nginx/sites-available/meu-site.conf`

```nginx
# Redirecionar HTTP para HTTPS
server {
    listen 80;
    server_name meu-site.pt www.meu-site.pt;
    return 301 https://$server_name$request_uri;
}

# HTTPS (depois de instalar SSL)
server {
    listen 443 ssl http2;
    server_name meu-site.pt www.meu-site.pt;

    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/meu-site.pt/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/meu-site.pt/privkey.pem;

    # Configurações SSL de Segurança
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Proxy reverso para Node.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Para WebSockets (se precisar)
    location /ws {
        proxy_pass http://127.0.0.1:3000/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }

    # Limite de tamanho de upload
    client_max_body_size 50M;
}
```

**Ativar a configuração (Linux):**
```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/meu-site.conf /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

---

## 4. Certificado SSL/TLS Gratuito

Usando **Certbot** e **Let's Encrypt**:

### Instalação

**Windows (manual):**
```
# Descarregar de https://certbot.eff.org
# Ou usar wsl2 + Ubuntu
```

**Linux:**
```bash
sudo apt install certbot python3-certbot-nginx
```

### Gerar Certificado

```bash
# Gerar certificado automaticamente com Nginx
sudo certbot --nginx -d meu-site.pt -d www.meu-site.pt

# Ou manual
sudo certbot certonly --standalone -d meu-site.pt -d www.meu-site.pt
```

### Renovação Automática

```bash
# Testar renovação
sudo certbot renew --dry-run

# Certbot renova automaticamente (cron job)
# Verificar status:
sudo systemctl list-timers
```

---

## 5. Configuração do Servidor

### Atualizar .env

```env
# ===== SERVIDOR =====
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# ===== DOMÍNIO =====
DOMAIN=meu-site.pt
DOMAIN_URL=https://meu-site.pt

# ===== CORS =====
CORS_ORIGIN=https://meu-site.pt,https://www.meu-site.pt

# ===== SEGURANÇA =====
COOKIE_SECURE=true
COOKIE_SAMESITE=Strict
```

### Atualizar server.js (se necessário)

O servidor já está configurado para aceitar qualquer domínio via CORS, mas pode adicionar validação:

```javascript
// Adicionar após cors middleware
app.use((req, res, next) => {
    const host = req.get('host');
    const allowedHosts = process.env.ALLOWED_HOSTS?.split(',') || ['localhost', 'meu-site.pt'];
    
    // Verificar host
    if (!allowedHosts.some(h => host.includes(h))) {
        return res.status(403).json({ error: 'Host não permitido' });
    }
    
    next();
});
```

### Redirecionamento de www

Adicionar ao Nginx (já está na config acima):

```nginx
# Redirecionar www.meu-site.pt → meu-site.pt
server {
    listen 80;
    server_name meu-site.pt www.meu-site.pt;
    return 301 https://meu-site.pt$request_uri;
}
```

---

## 6. Deploy em Produção

### Opção A: Servidor Local/Casa

✅ **Vantagens:**
- Controlo total
- Sem custos de hosting

❌ **Desvantagens:**
- IP pode mudar (usar DNS dinâmico)
- Precisa de segurança/firewall
- Internet pode cair
- ISP pode bloquear

**Configurar DNS Dinâmico:**
```
Use serviços como No-IP, DuckDNS para atualizar IP automaticamente
```

### Opção B: VPS/Servidor Cloud

✅ **Recomendado para produção**

Provedores populares:
- **Hetzner** (€3-5/mês - alemanha, ótimo custo)
- **DigitalOcean** (€5-15/mês)
- **Linode** (€5-30/mês)
- **Azure/AWS** (mais caro)

**Steps:**
1. Contratar VPS com Ubuntu 20.04/22.04
2. Conectar via SSH
3. Instalar Node.js
4. Clonar projeto
5. Instalar Nginx
6. Certificado SSL/TLS
7. Usar PM2/Systemd para manter app ativa

### Usar PM2 para manter servidor ligado

```bash
# Instalar PM2
npm install -g pm2

# Iniciar app
pm2 start backend/server.js --name "loja-sende"

# Auto-iniciar com sistema
pm2 startup
pm2 save

# Ver status
pm2 status
pm2 logs
```

### Script de Deploy Automático

Criar `deploy.sh`:

```bash
#!/bin/bash
cd /home/user/meu-app
git pull origin main
cd backend
npm install
pm2 restart loja-sende
```

---

## ✅ Checklist Final

- [ ] Domínio registado
- [ ] DNS configurado e propagado
- [ ] Nginx instalado e configurado
- [ ] Certificado SSL/TLS instalado
- [ ] .env atualizado com domínio
- [ ] Firewall permite portas 80 e 443
- [ ] Node.js app em modo production
- [ ] PM2 ou Systemd ativa
- [ ] Testes funcionais realizados

---

## 🔍 Troubleshooting

### "Conexão recusada"
```bash
# Verificar se servidor está a rodar
pm2 status

# Verificar logs
pm2 logs loja-sende
```

### "Certificado inválido"
```bash
# Renovar certificado
sudo certbot renew --force-renewal
```

### "DNS não está resolvendo"
```bash
# Aguardar propagação (24-48h)
nslookup meu-site.pt

# Ou usar DNS externo
nslookup meu-site.pt 8.8.8.8
```

### "Nginx: Host não encontrado"
```bash
# Recarregar Nginx
sudo systemctl reload nginx

# Ou testar config
sudo nginx -t
```

---

## 📞 Suporte Adicional

- **Let's Encrypt:** https://letsencrypt.org/
- **Nginx Docs:** https://nginx.org/en/docs/
- **Certbot:** https://certbot.eff.org/

✨ **Sucesso no deploy!** ✨
