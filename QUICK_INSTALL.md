# ⚡ CRAFTIVA.EU — INSTALAÇÃO RÁPIDA (15 MINUTOS)

Este guia leva-te de zero a site online em ~15 minutos.

---

## ✅ PRÉ-REQUISITOS

Antes de começar, verifica que tens:

1. **Node.js 18+** instalado
   ```bash
   node --version  # deve ser v18.0.0 ou superior
   ```
   Se não tens, instalar: https://nodejs.org/

2. **Conta Google** (para Firebase)

3. **Domínio craftiva.eu** (já tens ✓)

---

## 🚀 PASSO 1: EXTRAIR CÓDIGO (1 min)

```bash
# Extrair o ZIP
unzip craftiva-eu-production-ready.zip -d craftiva-eu
cd craftiva-eu

# Instalar dependências
npm install
```

---

## 🔥 PASSO 2: CRIAR PROJETO FIREBASE (5 min)

### 2.1 Console Firebase

1. Ir para: https://console.firebase.google.com/
2. Clicar **"Add project"**
3. Nome: `craftiva-eu`
4. Ativar Google Analytics: **Sim**
5. Aguardar criação...

### 2.2 Ativar Serviços

**Authentication:**
- Ir para Authentication → Sign-in method
- Ativar **Email/Password** ✓
- Ativar **Google** ✓ (escolher support email)

**Firestore:**
- Ir para Firestore Database → Create database
- Região: `europe-west1` (Bélgica)
- Modo: **Production**

**Storage:**
- Ir para Storage → Get started
- Região: `europe-west1`

### 2.3 Obter Credenciais

1. Project Settings (ícone engrenagem)
2. Scroll down → "Your apps"
3. Clicar **</>** (Web)
4. App nickname: `Craftiva Web App`
5. ☑️ Also set up Firebase Hosting
6. **COPIAR** o firebaseConfig completo

---

## ⚙️ PASSO 3: CONFIGURAR .ENV (2 min)

```bash
# Na pasta do projeto
cp .env.example .env.local
nano .env.local  # ou usar teu editor
```

**Colar (com os TEUS valores copiados do Firebase):**

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXX...
VITE_FIREBASE_AUTH_DOMAIN=craftiva-eu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=craftiva-eu
VITE_FIREBASE_STORAGE_BUCKET=craftiva-eu.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

Guardar e fechar.

---

## 🧪 PASSO 4: TESTAR LOCAL (2 min)

```bash
# Gerar sitemap
npm run sitemap

# Executar
npm run dev
```

Abrir: **http://localhost:3000**

✅ Verificar:
- Homepage carrega
- Seletor de idiomas funciona (canto inferior direito)
- Modal de login abre

---

## 🚀 PASSO 5: DEPLOY (5 min)

### 5.1 Instalar Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 5.2 Inicializar Firebase

```bash
firebase init
```

**Seleções:**
- ☑ Firestore
- ☑ Hosting  
- ☑ Storage
- Public directory: **dist** (não "public"!)
- Single-page app: **Yes**
- Overwrite index.html: **No**

### 5.3 Deploy

```bash
npm run deploy
```

⏳ Aguardar 1-2 minutos...

✅ Vais receber:
```
Hosting URL: https://craftiva-eu.web.app
```

### 5.4 Publicar Firestore Rules

1. Firebase Console → Firestore → Rules
2. Copiar conteúdo de `firestore.rules` (do projeto)
3. Colar e **Publish**

---

## 🌐 PASSO 6: DOMÍNIO CUSTOM (Variável)

### 6.1 Adicionar no Firebase

1. Firebase Console → Hosting
2. **Add custom domain**
3. Introduzir: `craftiva.eu`
4. Copiar DNS records mostrados

### 6.2 Configurar DNS

No teu registrar de domínio:

**Tipo A:**
```
Nome: @ (ou vazio)
Valor: 151.101.1.195
       151.101.65.195
```

**Tipo CNAME (para www):**
```
Nome: www
Valor: craftiva-eu.web.app.
```

### 6.3 Aguardar Propagação

⏳ 30 min - 48h (normalmente < 2h)

Verificar: https://dnschecker.org/#A/craftiva.eu

Quando propagar:
- SSL provisiona automaticamente
- https://craftiva.eu fica online!

---

## ✅ VERIFICAÇÃO FINAL

### No Firebase Console
- [ ] Authentication tem providers ativos
- [ ] Firestore tem rules publicadas
- [ ] Storage tem rules publicadas
- [ ] Hosting mostra domínio "Connected"

### No Site
- [ ] https://craftiva.eu carrega
- [ ] Registo de utilizador funciona
- [ ] Login com Google funciona
- [ ] Upload de produto funciona (sellers)

---

## 🎯 PRÓXIMOS PASSOS

### Imediato
- Criar 2-3 produtos de teste
- Testar fluxo completo buyer/seller
- Submeter sitemap ao Google Search Console

### Esta Semana
- Integrar Stripe (pagamentos)
- Setup email transacional
- Recrutar primeiros sellers

---

## 🐛 TROUBLESHOOTING

**Erro: "Firebase not configured"**
→ Verificar .env.local tem todas as variáveis

**Erro: "Permission denied" Firestore**
→ Publicar firestore.rules no console

**Site não carrega no domínio**
→ Verificar DNS propagou: `dig craftiva.eu`

**Build falha**
→ `rm -rf node_modules && npm install`

---

## 📞 SUPORTE

**Documentação completa**: Ver DEPLOY_GUIDE.md  
**Checklist detalhada**: Ver DEPLOY_CHECKLIST.md

**Firebase Docs**: https://firebase.google.com/docs  
**Vite Docs**: https://vitejs.dev/

---

🎉 **Parabéns! O Craftiva.eu está online!**

**URL Produção**: https://craftiva.eu  
**URL Firebase**: https://craftiva-eu.web.app

Agora é só adicionar sellers e começar a vender!
