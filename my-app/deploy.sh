#!/bin/bash
# ============================================================
# Script de Deploy Automático - Linux/Ubuntu
# ============================================================
# Uso: ./deploy.sh seu-dominio.pt

set -e

DOMAIN=${1:-seu-dominio.pt}
APP_NAME="loja-sende"
APP_PORT=3000
APP_DIR="/home/app/loja-sende"

echo "🚀 Deploy do $APP_NAME para $DOMAIN"

# ============================================================
# 1. CLONAR/ATUALIZAR REPOSITÓRIO
# ============================================================
echo "📦 Atualizando código..."
if [ ! -d "$APP_DIR" ]; then
    mkdir -p "$APP_DIR"
    git clone https://seu-repo.git "$APP_DIR"
else
    cd "$APP_DIR"
    git pull origin main
fi

# ============================================================
# 2. INSTALAR DEPENDÊNCIAS
# ============================================================
echo "📚 Instalando dependências..."
cd "$APP_DIR/backend"
npm install --production

# ============================================================
# 3. CONFIGURAR VARIÁVEIS DE AMBIENTE
# ============================================================
echo "⚙️  Configurando .env..."
if [ ! -f "$APP_DIR/backend/.env" ]; then
    cat > "$APP_DIR/backend/.env" << EOF
NODE_ENV=production
PORT=$APP_PORT
HOST=0.0.0.0
DOMAIN=$DOMAIN
DOMAIN_URL=https://$DOMAIN
CORS_ORIGIN=https://$DOMAIN,https://www.$DOMAIN
COOKIE_SECURE=true
COOKIE_SAMESITE=Strict
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
ADMIN_EMAIL=admin@loja.pt
ADMIN_PASSWORD=Admin@123
LOG_LEVEL=info
LOG_PATH=./logs
EOF
    echo "✅ .env criado"
else
    echo "✅ .env já existe"
fi

# ============================================================
# 4. PARAR APP ANTIGA (se existir)
# ============================================================
echo "🛑 Parando app antiga..."
pm2 stop "$APP_NAME" 2>/dev/null || true
pm2 delete "$APP_NAME" 2>/dev/null || true

# ============================================================
# 5. INICIAR NOVA APP COM PM2
# ============================================================
echo "🚀 Iniciando $APP_NAME com PM2..."
cd "$APP_DIR/backend"
pm2 start server.js --name "$APP_NAME" --env production

# ============================================================
# 6. CONFIGURAR NGINX
# ============================================================
echo "🔧 Configurando Nginx..."
sudo cp "$APP_DIR/nginx.conf.example" "/etc/nginx/sites-available/$DOMAIN.conf"

# Substituir domínio
sudo sed -i "s/meu-site.pt/$DOMAIN/g" "/etc/nginx/sites-available/$DOMAIN.conf"
sudo sed -i "s/127.0.0.1:3000/127.0.0.1:$APP_PORT/g" "/etc/nginx/sites-available/$DOMAIN.conf"

# Ativar
sudo ln -sf "/etc/nginx/sites-available/$DOMAIN.conf" "/etc/nginx/sites-enabled/$DOMAIN.conf"

# Testar config
if sudo nginx -t 2>/dev/null; then
    echo "✅ Nginx config OK"
    sudo systemctl reload nginx
else
    echo "❌ Erro na config Nginx!"
    exit 1
fi

# ============================================================
# 7. CERTIFICADO SSL
# ============================================================
echo "🔒 Configurando SSL/TLS com Let's Encrypt..."
if ! sudo certbot certificates 2>/dev/null | grep -q "$DOMAIN"; then
    sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m admin@$DOMAIN
else
    echo "✅ Certificado já existe"
fi

# ============================================================
# 8. AUTO-RENOVAÇÃO
# ============================================================
echo "⏰ Configurando renovação automática..."
sudo systemctl enable certbot.timer || true
sudo systemctl start certbot.timer || true

# ============================================================
# 9. PM2 STARTUP
# ============================================================
echo "🔄 Configurando PM2 para iniciar com o sistema..."
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u app --hp /home/app
pm2 save

# ============================================================
# 10. TESTES
# ============================================================
echo "✅ Testando..."
sleep 2

if curl -s -I "https://$DOMAIN" | grep -q "200\|301\|302"; then
    echo "✅ Site respondendo: https://$DOMAIN"
else
    echo "⚠️  Verificar: https://$DOMAIN"
fi

echo ""
echo "🎉 Deploy Concluído!"
echo "================================================"
echo "✅ App: https://$DOMAIN"
echo "✅ Status: pm2 status"
echo "✅ Logs: pm2 logs $APP_NAME"
echo "✅ Renewals: sudo certbot renew --dry-run"
echo "================================================"
