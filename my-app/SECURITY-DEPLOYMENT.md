# 🔒 GUIA DE SEGURANÇA E DEPLOYMENT - PRODUÇÃO

**Versão**: 1.0  
**Data**: Junho 2026  
**Status**: Pronto para Produção  

---

## 📋 Conteúdo

1. [Checklist de Segurança](#checklist)
2. [Configuração do Ambiente](#ambiente)
3. [Deployment](#deployment)
4. [HTTPS/SSL](#https)
5. [Backup e Recuperação](#backup)
6. [Monitoramento](#monitoramento)
7. [Incidentes de Segurança](#incidentes)

---

## ✅ Checklist de Segurança {#checklist}

### 🔐 Autenticação e Autorização
- [x] Login com email e senha
- [x] JWT tokens com expiração (7 dias)
- [x] Hash bcrypt para passwords (10 rounds)
- [x] Validação de password forte (8+ chars, maiúscula, número)
- [x] Rate limiting no login (5 tentativas/15 min)
- [x] Logout com invalidação de token
- [x] Renovação de tokens
- [x] Middleware de autenticação nos endpoints sensíveis

### 🛡️ Proteção contra Ataques
- [x] Helmet - Headers de segurança HTTP
- [x] CORS - Whitelist de origens
- [x] XSS Prevention - Sanitização de strings
- [x] SQL Injection - Prepared statements (parameterized queries)
- [x] Rate Limiting - 100 req/15min global, 30 req/min API
- [x] CSRF Protection - Verificação de origem

### 📊 Input Validation
- [x] Validação de email
- [x] Validação de password
- [x] Validação de produtos
- [x] Validação de URLs
- [x] Sanitização de strings
- [x] Limitação de tamanho de payload (10MB)

### 🔑 Gestão de Credenciais
- [x] .env com variáveis sensíveis
- [x] .gitignore completo (sem .env em Git)
- [x] Credenciais não hardcoded
- [x] JWT_SECRET e SESSION_SECRET seguros
- [x] Chaves de API em variáveis de ambiente

### 📝 Logging e Auditoria
- [x] Logger estruturado (INFO, WARN, ERROR, DEBUG)
- [x] Logs de segurança (login, logout, mudanças)
- [x] Auditoria de ações (criação, edição, eliminação)
- [x] Logs HTTP com status e duração
- [x] Rotação de logs (elimina logs com >30 dias)

### ❌ Erros e Tratamento
- [x] Error handler global
- [x] Mensagens genéricas (sem stack traces)
- [x] Status HTTP corretos
- [x] Sem exposição de informações sensíveis

---

## 🔧 Configuração do Ambiente {#ambiente}

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Criar Arquivo .env
Copiar `.env.example` para `.env` e preencher com valores reais:

```bash
# Linux/Mac
cp .env.example .env

# Windows
Copy-Item .env.example -Destination .env
```

### 3. Variáveis Críticas no .env

```env
# Servidor
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Segurança - GERAR NOVAS CHAVES!
JWT_SECRET=GERA_UMA_STRING_ALEATORIA_64_CARACTERES_AQUI
SESSION_SECRET=GERA_OUTRA_STRING_ALEATORIA_64_CARACTERES

# CORS - Seu domínio
CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com

# Admin - MUDE A PASSWORD!
ADMIN_EMAIL=admin@loja.pt
ADMIN_PASSWORD=SenhaForte@2024

# Database
DB_PATH=./database/loja_sende.db
DB_BACKUP_PATH=./database/backups

# HTTPS
ENABLE_HTTPS=true
SSL_CERT_PATH=./certs/cert.pem
SSL_KEY_PATH=./certs/key.pem

# Logging
LOG_LEVEL=info
LOG_PATH=./logs

# Backup automático
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
```

### 4. Gerar Chaves Seguras
```bash
# Gerar JWT_SECRET (64 caracteres)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Gerar SESSION_SECRET (64 caracteres)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Deployment {#deployment}

### Opção 1: Node.js Direto com PM2

#### 1.1 Instalar PM2 Globalmente
```bash
npm install -g pm2
```

#### 1.2 Criar Arquivo de Configuração PM2
Criar `ecosystem.config.js` na raiz do projeto:

```javascript
module.exports = {
  apps: [{
    name: 'loja-sende-api',
    script: './backend/server.js',
    instances: 4,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
```

#### 1.3 Iniciar a Aplicação
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 1.4 Monitorar
```bash
pm2 monit
pm2 logs loja-sende-api
```

---

### Opção 2: Docker (Recomendado para Escalabilidade)

#### 2.1 Criar Dockerfile
Criar `Dockerfile` na raiz:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY backend/package*.json ./backend/

# Instalar dependências
WORKDIR /app/backend
RUN npm ci --only=production

# Copiar código
WORKDIR /app
COPY backend ./backend
COPY src ./src
COPY database ./database

# Expor porta
EXPOSE 3000

# Start
CMD ["node", "backend/server.js"]
```

#### 2.2 Criar .dockerignore
```
node_modules
npm-debug.log
.env
.git
.gitignore
logs
*.db-journal
database/backups
```

#### 2.3 Build e Deploy
```bash
# Build
docker build -t loja-sende:latest .

# Run
docker run -d \
  --name loja-sende \
  -p 3000:3000 \
  --env-file .env \
  -v /data/backups:/app/database/backups \
  loja-sende:latest
```

---

### Opção 3: Nginx como Reverse Proxy

#### 3.1 Configuração Nginx
Criar `/etc/nginx/sites-available/loja-sende.conf`:

```nginx
upstream app {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    
    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    # SSL Segurança
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Headers de Segurança
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy
    location /api {
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Servir arquivos estáticos
    location / {
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}
```

#### 3.2 Ativar Site
```bash
sudo ln -s /etc/nginx/sites-available/loja-sende.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔐 HTTPS/SSL {#https}

### Usando Let's Encrypt (Gratuito)

#### 1. Instalar Certbot
```bash
sudo apt-get install certbot python3-certbot-nginx
```

#### 2. Gerar Certificado
```bash
sudo certbot certonly --nginx -d seu-dominio.com -d www.seu-dominio.com
```

#### 3. Auto-Renewal
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

#### 4. Verificar Renovação
```bash
sudo certbot renew --dry-run
```

---

## 💾 Backup e Recuperação {#backup}

### Backup Automático de Base de Dados

Criar `backend/utils/backup.js`:

```javascript
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const backup = async () => {
  const backupDir = process.env.DB_BACKUP_PATH || './database/backups';
  const dbFile = process.env.DB_PATH || './database/loja_sende.db';
  
  // Criar diretório se não existir
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const backupFile = path.join(backupDir, `backup-${timestamp}.db`);

  // Copiar arquivo
  fs.copyFileSync(dbFile, backupFile);
  console.log(`✅ Backup criado: ${backupFile}`);

  // Manter apenas 30 dias de backups
  const files = fs.readdirSync(backupDir);
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

  files.forEach(file => {
    const filePath = path.join(backupDir, file);
    const stat = fs.statSync(filePath);
    if (stat.mtimeMs < thirtyDaysAgo) {
      fs.unlinkSync(filePath);
    }
  });
};

module.exports = { backup };
```

### Restaurar Backup
```bash
# Copiar arquivo de backup
cp database/backups/backup-2024-06-01.db database/loja_sende.db

# Reiniciar servidor
npm run dev
```

---

## 📊 Monitoramento {#monitoramento}

### Ver Logs
```bash
# Últimas 100 linhas
tail -100 logs/app-*.log

# Tempo real
tail -f logs/app-*.log

# Erros
grep "ERROR" logs/error-*.log
```

### Health Check
```bash
# Verificar se servidor está rodando
curl https://seu-dominio.com/api/health

# Resposta esperada:
# {"status":"OK","message":"Servidor ativo"}
```

### Metrics a Monitorar
- **Response Time**: < 200ms
- **Error Rate**: < 1%
- **CPU Usage**: < 80%
- **Memory Usage**: < 60%
- **Database Size**: Monitorar crescimento
- **Disk Space**: > 10% livre

---

## 🚨 Incidentes de Segurança {#incidentes}

### Suspeita de Breach

1. **Parar o servidor imediatamente**
   ```bash
   pm2 stop loja-sende-api
   ```

2. **Verificar logs**
   ```bash
   tail -500 logs/security-*.log
   tail -500 logs/audit-*.log
   ```

3. **Alterar credenciais**
   ```bash
   # Gerar nova admin password
   node -e "console.log(require('bcrypt').hashSync('NovaPassword@2024', 10))"
   
   # Atualizar database
   ```

4. **Criar backup**
   ```bash
   cp database/loja_sende.db database/loja_sende.db.backup-$(date +%s)
   ```

5. **Auditar acessos**
   - Verificar logins não autorizados
   - Verificar mudanças em dados sensíveis
   - Verificar requests suspeitas

6. **Comunicar com utilizadores** (se aplicável)

---

## 📱 Contato e Suporte

Para questões de segurança:
- Email: seguranca@loja.pt
- Resposta de emergência: 24/7

---

**Última Atualização**: Junho 2026  
**Próxima Revisão**: Setembro 2026
