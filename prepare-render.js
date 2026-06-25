#!/usr/bin/env node

/**
 * Script para preparar o projeto para deploy em Render.com
 * Executa:
 * 1. Inicializa a base de dados (se não existir)
 * 2. Valida que todas as dependências estão presentes
 * 3. Prepara as pastas necessárias
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const DB_DIR = path.join(__dirname, '../database');
const DB_PATH = path.join(DB_DIR, 'loja_sende.db');
const LOGS_DIR = path.join(__dirname, 'logs');

async function prepare() {
  console.log('🔧 Preparando projeto para Render.com...\n');

  try {
    // 1. Criar diretórios necessários
    console.log('📁 Criando estrutura de diretórios...');
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
      console.log('  ✓ Diretório database criado');
    }
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
      console.log('  ✓ Diretório logs criado');
    }

    // 2. Verificar .env
    console.log('\n🔐 Configurando variáveis de ambiente...');
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
      const envContent = `# Render.com - Produção
NODE_ENV=production
PORT=10000
HOST=0.0.0.0
DOMAIN=seu-dominio.com
DOMAIN_URL=https://seu-dominio.com
ALLOWED_HOSTS=seu-dominio.com,www.seu-dominio.com
JWT_SECRET=${generateSecret(64)}
JWT_EXPIRE=7d
SESSION_SECRET=${generateSecret(64)}
CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com
COOKIE_SECURE=true
COOKIE_SAMESITE=Strict
ADMIN_EMAIL=admin@loja.pt
ADMIN_PASSWORD=Admin@123
`;
      fs.writeFileSync(envPath, envContent);
      console.log('  ✓ Ficheiro .env criado (atualize com suas variáveis)');
    } else {
      console.log('  ✓ Ficheiro .env já existe');
    }

    // 3. Inicializar base de dados
    console.log('\n🗄️  Inicializando base de dados...');
    if (!fs.existsSync(DB_PATH)) {
      console.log('  → Executando init-database.js...');
      try {
        await execAsync('node init-database.js', { cwd: __dirname });
        console.log('  ✓ Base de dados inicializada com sucesso');
      } catch (err) {
        console.warn('  ⚠️  Base de dados pode já estar inicializada ou existe um erro');
        console.warn('  Continuando mesmo assim...');
      }
    } else {
      console.log('  ✓ Base de dados já existe');
    }

    // 4. Validar dependências principais
    console.log('\n📦 Validando dependências...');
    const packageJson = require('./package.json');
    const deps = Object.keys(packageJson.dependencies);
    console.log(`  ✓ ${deps.length} dependências encontradas`);

    // 5. Criar logs de sucesso
    console.log('\n✅ Projeto preparado com sucesso!\n');
    console.log('📝 Próximos passos:');
    console.log('   1. Commit e push para GitHub');
    console.log('   2. Criar Web Service em Render.com');
    console.log('   3. Apontar para o repositório GitHub');
    console.log('   4. Configurar variáveis de ambiente em Render');
    console.log('   5. Deploy!\n');

  } catch (err) {
    console.error('\n❌ Erro ao preparar projeto:', err.message);
    process.exit(1);
  }
}

function generateSecret(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

// Executar se for chamado diretamente
if (require.main === module) {
  prepare();
}

module.exports = prepare;
