# 🌐 Domínio Próprio - Tudo Pronto!

## 📦 O Que Foi Criado?

Criei uma **documentação e scripts completos** para você atribuir um domínio próprio ao seu servidor.

### 📚 Documentação (4 ficheiros)

```
├── DOMAIN-SETUP.md                  ← Guia visual + arquitetura
├── QUICK-DEPLOY.md                  ← Deploy em 5-7 passos rápidos  
├── DEPLOYMENT-GUIDE.md              ← Guia COMPLETO (detalhado)
├── DOMAIN-QUICK-REFERENCE.md        ← Cheat sheet 1 página
```

**Use:**
- ⚡ **Quick-Deploy.md** se tem pressa (5 min)
- 📖 **Deployment-Guide.md** para entender tudo
- 🎨 **Domain-Setup.md** para ver a arquitetura

### 🤖 Scripts Automáticos (2 ficheiros)

```
├── deploy.sh                        ← Automático Linux (Bash)
│   └── Uso: ./deploy.sh seu-dominio.pt
│
└── setup-windows.ps1                ← Automático Windows (PowerShell)
    └── Uso: .\setup-windows.ps1 -Domain "seu-dominio.local"
```

### ⚙️ Configurações (2 ficheiros)

```
├── nginx.conf.example               ← Config Nginx pronta
└── .env.example                     ← Variáveis atualizadas
    └── Já tem campos para DOMAIN, DOMAIN_URL, etc
```

---

## ⚡ Comece Agora (Opção Mais Rápida)

### 1. Ler (2 min)
```
Abrir: DOMAIN-QUICK-REFERENCE.md
```

### 2. Registar Domínio (5 min)
```
namecheap.com
Procurar: seu-dominio.pt
Comprar: €5-10/ano
```

### 3. Configurar DNS (5 min)
```
Painel Namecheap → DNS Records
Adicionar 2 registos tipo A com seu IP
```

### 4. Executar Script (5 min)

**Se for Linux:**
```bash
chmod +x deploy.sh
./deploy.sh seu-dominio.pt
```

**Se for Windows:**
```powershell
.\setup-windows.ps1 -Domain "seu-dominio.local"
```

### 5. Testar (1 min)
```
Abrir: https://seu-dominio.pt
✅ Deve funcionar!
```

**⏱️ Total: ~20 minutos**

---

## 🎯 Opções Disponíveis

### 💻 Desenvolvimento Local
Ficheiros: `setup-windows.ps1`, `.env.example`
- ✅ Domínio local (seu-dominio.local)
- ✅ Certificado auto-assinado
- ✅ Rápido para testes

### 🔧 Servidor Próprio/VPS (RECOMENDADO)
Ficheiros: `deploy.sh`, `nginx.conf.example`
- ✅ Domínio real (seu-dominio.pt)
- ✅ SSL/TLS automático (Let's Encrypt)
- ✅ Profissional
- 💰 Custo: €3-10/mês (VPS)

### ☁️ Platform as a Service
Ficheiros: Guias em DEPLOYMENT-GUIDE.md
- ✅ Deploy 1-clique
- ✅ Domínio customizado
- ✅ Zero configuração
- 💰 Custo: €5-20/mês

---

## 📋 Checklist

Antes de usar, verifique:

- [ ] Backend `.env` configurado
- [ ] Servidor Node.js a rodar (`npm start`)
- [ ] Nginx instalado (Linux) ou disponível (Windows)
- [ ] Firewall permite portas 80 e 443
- [ ] Domínio registado (opcional, pode testar local)

---

## 📞 Dúvidas?

**Leia os ficheiros nesta ordem:**

1. **DOMAIN-QUICK-REFERENCE.md** (1 página, rápido)
2. **QUICK-DEPLOY.md** (passos rápidos)
3. **DOMAIN-SETUP.md** (completo com diagramas)
4. **DEPLOYMENT-GUIDE.md** (muito detalhado)

---

## 🚀 Próximas Etapas

**Depois de online:**

1. ✅ Domínio funcionando
2. ✅ Admin panel acessível
3. ✅ Produtos carregam
4. ✅ Login funciona

**Depois, considere:**

- 📧 Configurar email (SMTP)
- 🔒 Melhorar segurança
- 📊 Adicionar Analytics
- 🚀 Otimizar velocidade
- 🔄 Backups automáticos

---

## 🎁 Resumo do Que Recebi

```
📁 Documentação Completa
├── 4 ficheiros .md de orientação
├── Diagramas e tabelas
├── Troubleshooting completo
└── Links e recursos

🤖 Scripts Automáticos
├── deploy.sh (Linux)
├── setup-windows.ps1 (Windows)
└── Configurações prontas

⚙️ Ficheiros de Configuração
├── nginx.conf.example (web server)
└── .env.example (variáveis)

💡 Cheat Sheets & Guias
├── Referência rápida 1 página
├── Deploy em 5 passos
└── Guia visual com arquitetura
```

---

## 🌟 Destaques

✅ **Documentação Profissional**
- Seteções completas
- Exemplos práticos
- Troubleshooting

✅ **Scripts Automáticos**
- Setup completo em 1 comando
- Funcionam em Linux e Windows
- Geram certificados automáticos

✅ **Suporte Múltiplas Opções**
- VPS/Servidor dedicado
- Desenvolvimento local
- Cloud platforms

✅ **Segurança**
- SSL/TLS automático
- Configurações seguras
- Melhores práticas

---

## 📞 Suporte Rápido

| Problema | Ver |
|----------|-----|
| Não sei por onde começar | DOMAIN-QUICK-REFERENCE.md |
| Quero deploy rápido | QUICK-DEPLOY.md |
| Quero entender tudo | DEPLOYMENT-GUIDE.md |
| Tenho erro específico | DEPLOYMENT-GUIDE.md → Troubleshooting |

---

## ✨ Resultado Final

Depois de seguir os passos:

```
✅ Domínio próprio (seu-dominio.pt)
✅ HTTPS/SSL seguro
✅ Site em produção
✅ Admin funcional
✅ Banco de dados ativo
✅ Pronto para vender!
```

---

🎉 **Tudo pronto para colocar seu site online!**

Começar agora?

👉 Abrir: `DOMAIN-QUICK-REFERENCE.md` (1 minuto de leitura)

Boa sorte! 🚀
