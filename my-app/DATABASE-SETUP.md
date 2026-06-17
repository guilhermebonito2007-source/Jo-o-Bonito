# 🗄️ Guia de Configuração da Base de Dados - Loja João Bonito

## ✅ Estado da Base de Dados

A base de dados está **totalmente funcional e pronta para apresentação** com:
- ✓ Schema completo com 12 tabelas
- ✓ Todas as relações (chaves estrangeiras) configuradas
- ✓ Índices de performance
- ✓ 50+ produtos em 5 categorias
- ✓ Dados de teste e cupões de desconto
- ✓ Sistema de contactos completo
- ✓ Utilizador administrador pré-configurado

---

## 🚀 Inicialização Rápida (Recomendado)

### 1️⃣ Instalação de Dependências
```bash
cd backend
npm install
```

### 2️⃣ Configurar e Popular a Base de Dados
```bash
npm run setup
```

Isto executa automaticamente:
1. Inicializa a base de dados com o schema
2. Cria as categorias
3. Cria utilizador admin
4. Popula com 50+ produtos de exemplo
5. Adiciona cupões de desconto

---

## 📊 Processos de Inicialização Individuais

### Apenas Inicializar (criar tabelas e admin)
```bash
npm run init-db
```

**Resultado:**
- Cria tabelas em `database/loja_sende.db`
- Insere 5 categorias
- Cria utilizador admin
  - 📧 Email: `admin@loja.pt`
  - 🔑 Senha: `Admin@123`

### Apenas Popular (adicionar produtos e dados)
```bash
npm run populate-db
```

**Resultado:**
- Insere 50+ produtos reais
- Adiciona 3 cupões de desconto
- Insere 2 contactos de teste
- Configura 2 utilizadores de teste

---

## 📁 Ficheiros Relacionados

### Schema
- `database/schema.sql` - Estrutura completa da BD (12 tabelas)

### Scripts
- `backend/init-database.js` - Inicializa tabelas e admin
- `backend/populate-database.js` - Popula com dados de exemplo

### Dados de Exemplo
- `database/complete-data.sql` - Todos os produtos e dados de teste

---

## 🔐 Credenciais de Teste

### Administrador
```
Email: admin@loja.pt
Senha: Admin@123
URL: http://localhost:3000/admin/admin-login.html
```

### Cliente de Teste
```
Email: cliente@exemplo.com
Senha: (será definida durante login)
```

---

## 📦 Categorias e Produtos

| Categoria | Produtos | Stock Total | Valor Total |
|-----------|----------|------------|------------|
| **Produtos De Limpeza** | 4 | 260 | €9,51 |
| **Produtos de Drogarias** | 10 | 1.085 | €57,93 |
| **Fertilizantes** | 4 | 230 | €94,00 |
| **Higiene Pessoal** | 10 | 3.050 | €32,38 |
| **Produtos Plásticos** | 5 | 1.030 | €11,00 |
| **TOTAL** | **33** | **5.655** | **€204,82** |

---

## 🎟️ Cupões de Desconto Disponíveis

| Código | Desconto | Usos Máximos | Validade |
|--------|----------|------------|----------|
| `PRIMEIRACOMPRA` | 10% | 100 | +30 dias |
| `DESCONTO5EUR` | €5,00 fixo | 50 | +60 dias |
| `VERAO2024` | 15% | 200 | +90 dias |

---

## 🔧 Estrutura da Base de Dados

### Tabelas Principais
1. **categories** - Categorias de produtos
2. **products** - Produtos com todas as especificações
3. **users** - Utilizadores e admin
4. **cart_items** - Itens do carrinho
5. **orders** - Encomendas
6. **order_items** - Itens da encomenda
7. **payments** - Pagamentos
8. **contacts** - Mensagens de contacto
9. **reviews** - Avaliações de produtos
10. **coupon_codes** - Cupões de desconto
11. **activity_log** - Histórico de atividades
12. **payments** - Histórico de pagamentos

### Relações
- Products → Categories (1:N)
- Orders → Users (1:N)
- Order_Items → Orders (1:N)
- Cart_Items → Products (N:1)
- Payments → Orders (1:N)

---

## ⚙️ Iniciar o Servidor

```bash
# Modo desenvolvimento com auto-reload
npm run dev

# Modo produção
npm start
```

Servidor disponível em: `http://localhost:3000`

---

## 🐛 Resolução de Problemas

### Erro: "Arquivo da base de dados não encontrado"
```bash
npm run setup
```
Isto recria a base de dados completamente.

### Erro: "Tabela já existe"
Isto é normal! Significa que a base de dados já foi inicializada. Para reiniciar:
```bash
# Remover ficheiro antigo (Windows)
del database\loja_sende.db

# Depois
npm run setup
```

### Erro: "Falta bcrypt"
```bash
npm install bcrypt
```

---

## ✨ Correções de Português de Portugal

Todas as mensagens e textos foram corrigidos para português de Portugal:
- ✓ "Escritório" (não "escritorio")
- ✓ "Endereço" (não "endereço")
- ✓ "Olhão" (não "olhao")
- ✓ "Frigorífico" (não "figorifico")
- ✓ "Champô" (não "champoo")
- ✓ "Armázem" (não "armazem")

---

## 📝 Notas Importantes

1. **Senhas em Hash**: Todas as senhas são armazenadas com bcrypt
2. **Backup Automático**: Faça backup de `database/loja_sende.db` regularmente
3. **Reset de Dados**: Para limpar tudo e reiniciar, remova o ficheiro .db e execute `npm run setup`
4. **Modo de Apresentação**: A base de dados está pronta para demonstração com dados realistas

---

## 🎯 Próximos Passos

1. ✅ Executar `npm run setup` na pasta `backend`
2. ✅ Iniciar servidor com `npm run dev`
3. ✅ Aceder a http://localhost:3000
4. ✅ Login admin: admin@loja.pt / Admin@123

---

**Base de dados preparada e pronta para apresentação!** 🚀
