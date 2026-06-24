# ============================================================
# Script de Setup - Windows com Domínio Local
# ============================================================
# Uso: .\setup-windows.ps1 -Domain "seu-dominio.local"

param(
    [string]$Domain = "loja.local"
)

Write-Host "🚀 Setup para $Domain (Windows)" -ForegroundColor Green

# ============================================================
# 1. VERIFICAR SE NGINX ESTÁ INSTALADO
# ============================================================
Write-Host "🔍 Verificando Nginx..." -ForegroundColor Cyan
$nginxPath = "C:\nginx\nginx.exe"

if (!(Test-Path $nginxPath)) {
    Write-Host "❌ Nginx não encontrado!" -ForegroundColor Red
    Write-Host "💡 Instalar em: https://nginx.org/en/download.html" -ForegroundColor Yellow
    Write-Host "   Ou usar: choco install nginx" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Nginx encontrado" -ForegroundColor Green

# ============================================================
# 2. CRIAR FICHEIRO HOSTS LOCAL
# ============================================================
Write-Host "📝 Configurando ficheiro hosts..." -ForegroundColor Cyan
$hostsFile = "C:\Windows\System32\drivers\etc\hosts"
$hostEntry = "127.0.0.1`t$Domain www.$Domain"

# Verificar se já existe
if ((Get-Content $hostsFile) -match $Domain) {
    Write-Host "✅ Já configurado no hosts" -ForegroundColor Green
} else {
    # Adicionar (requer admin)
    try {
        Add-Content $hostsFile "`n$hostEntry"
        Write-Host "✅ Adicionado ao hosts" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Necessário privilégios admin para editar hosts" -ForegroundColor Yellow
        Write-Host "   Adicionar manualmente a: $hostsFile" -ForegroundColor Yellow
        Write-Host "   Linha: $hostEntry" -ForegroundColor Yellow
    }
}

# ============================================================
# 3. CRIAR CERTIFICADO AUTO-ASSINADO (para testes)
# ============================================================
Write-Host "🔒 Criando certificado auto-assinado..." -ForegroundColor Cyan
$certPath = "C:\nginx\certs"
New-Item -ItemType Directory -Force -Path $certPath | Out-Null

$certFile = "$certPath\$Domain.crt"
$keyFile = "$certPath\$Domain.key"

if ((Test-Path $certFile) -and (Test-Path $keyFile)) {
    Write-Host "✅ Certificado já existe" -ForegroundColor Green
} else {
    # Gerar com OpenSSL (se disponível) ou instrução manual
    if (Get-Command openssl -ErrorAction SilentlyContinue) {
        & openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
            -keyout $keyFile -out $certFile `
            -subj "/C=PT/ST=PT/L=Olhao/O=Loja/CN=$Domain" `
            2>$null
        Write-Host "✅ Certificado criado" -ForegroundColor Green
    } else {
        Write-Host "⚠️  OpenSSL não encontrado" -ForegroundColor Yellow
        Write-Host "   Usar certificado Let's Encrypt em produção" -ForegroundColor Yellow
    }
}

# ============================================================
# 4. CRIAR CONFIGURAÇÃO NGINX
# ============================================================
Write-Host "⚙️  Criando configuração Nginx..." -ForegroundColor Cyan
$nginxConf = "C:\nginx\conf\sites\$Domain.conf"
New-Item -ItemType Directory -Force -Path (Split-Path $nginxConf) | Out-Null

$confContent = @"
# Redirecionamento HTTP para HTTPS
server {
    listen 80;
    server_name $Domain www.$Domain;
    return 301 https://`$server_name`$request_uri;
}

# HTTPS com certificado local
server {
    listen 443 ssl;
    server_name $Domain www.$Domain;

    # Certificado local (auto-assinado)
    ssl_certificate C:/nginx/certs/$Domain.crt;
    ssl_certificate_key C:/nginx/certs/$Domain.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 50M;

    # Proxy reverso para Node.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }

    # Arquivos estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1d;
    }
}
"@

Set-Content -Path $nginxConf -Value $confContent -Encoding UTF8
Write-Host "✅ Configuração criada: $nginxConf" -ForegroundColor Green

# ============================================================
# 5. EDITAR nginx.conf PRINCIPAL
# ============================================================
Write-Host "🔧 Editando nginx.conf principal..." -ForegroundColor Cyan
$mainConf = "C:\nginx\conf\nginx.conf"

if ((Get-Content $mainConf) -notmatch "include.*sites") {
    $content = Get-Content $mainConf
    $content = $content -replace '(http \{)', "`$1`n    include sites/*.conf;"
    Set-Content -Path $mainConf -Value $content
    Write-Host "✅ Include adicionado" -ForegroundColor Green
} else {
    Write-Host "✅ Include já existe" -ForegroundColor Green
}

# ============================================================
# 6. ATUALIZAR .env
# ============================================================
Write-Host "⚙️  Atualizando .env..." -ForegroundColor Cyan
$envFile = "$PSScriptRoot\backend\.env"

if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $envContent = $envContent -replace "DOMAIN=.*", "DOMAIN=$Domain"
    $envContent = $envContent -replace "DOMAIN_URL=.*", "DOMAIN_URL=https://$Domain"
    $envContent = $envContent -replace "CORS_ORIGIN=.*", "CORS_ORIGIN=https://$Domain,https://www.$Domain"
    Set-Content -Path $envFile -Value $envContent
    Write-Host "✅ .env atualizado" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env não encontrado" -ForegroundColor Yellow
}

# ============================================================
# 7. INICIAR NGINX
# ============================================================
Write-Host "🚀 Iniciando Nginx..." -ForegroundColor Cyan
$nginx = Get-Process nginx -ErrorAction SilentlyContinue

if ($nginx) {
    Write-Host "⚠️  Nginx já está a rodar" -ForegroundColor Yellow
    Write-Host "   Recarregando..." -ForegroundColor Yellow
    & C:\nginx\nginx.exe -s reload
} else {
    & C:\nginx\nginx.exe
    Start-Sleep -Seconds 1
    if (Get-Process nginx -ErrorAction SilentlyContinue) {
        Write-Host "✅ Nginx iniciado" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao iniciar Nginx" -ForegroundColor Red
        exit 1
    }
}

# ============================================================
# 8. TESTAR
# ============================================================
Write-Host "✅ Testando conexão..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

try {
    $response = Invoke-WebRequest -Uri "http://localhost" -ErrorAction SilentlyContinue
    Write-Host "✅ Servidor respondendo" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Verificar conexão" -ForegroundColor Yellow
}

# ============================================================
# RESUMO
# ============================================================
Write-Host ""
Write-Host "🎉 Setup Concluído!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ Domínio: https://$Domain" -ForegroundColor White
Write-Host "✅ Frontend: $PSScriptRoot\src\index.html" -ForegroundColor White
Write-Host "✅ Backend: $PSScriptRoot\backend\server.js" -ForegroundColor White
Write-Host "✅ Admin: https://$Domain/admin/admin.html" -ForegroundColor White
Write-Host ""
Write-Host "📝 Próximas ações:" -ForegroundColor Cyan
Write-Host "   1. Iniciar backend: npm start (em backend/)" -ForegroundColor White
Write-Host "   2. Aceitar certificado (auto-assinado) no navegador" -ForegroundColor White
Write-Host "   3. Abrir: https://$Domain" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Nota: Certificado é auto-assinado (apenas desenvolvimento)" -ForegroundColor Yellow
Write-Host "   Em produção, usar Let's Encrypt ou certificado válido" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
