# 🚀 CRAFTIVA.EU — GUIA DE DEPLOY COMPLETO
*Firebase Hosting + Custom Domain Setup*

---

## 📋 PRÉ-REQUISITOS

- ✅ Domínio craftiva.eu (já tens)
- ✅ Conta Google
- ✅ Node.js 18+ instalado
- ✅ Código do Craftiva.eu

---

## PARTE 1: CRIAR PROJETO FIREBASE (15 minutos)

### 1.1 Aceder à Firebase Console

1. Ir para: https://console.firebase.google.com/
2. Clicar em **"Add project"** / **"Adicionar projeto"**

### 1.2 Configurar Projeto

**Passo 1 - Nome do projeto:**
```
Nome: craftiva-eu
ID do projeto: craftiva-eu (ou craftiva-eu-prod)
```
➡️ Clicar **Continue**

**Passo 2 - Google Analytics:**
```
☑️ Enable Google Analytics (RECOMENDADO)
```
➡️ Clicar **Continue**

**Passo 3 - Analytics Account:**
```
Selecionar: "Default Account for Firebase" (ou criar nova)
```
➡️ Clicar **Create project**

⏳ Aguardar 30-60 segundos...

✅ Quando aparecer "Your new project is ready", clicar **Continue**

---

## PARTE 2: CONFIGURAR FIREBASE SERVICES (20 minutos)

### 2.1 Ativar Authentication

1. No painel esquerdo, clicar em **🔐 Authentication**
2. Clicar em **Get started**
3. Ativar **Email/Password**:
   - Clicar na aba **Sign-in method**
   - Clicar em **Email/Password**
   - Toggle para **Enabled**
   - ✅ Salvar

4. Ativar **Google Sign-in**:
   - Clicar em **Google**
   - Toggle para **Enabled**
   - **Project support email**: escolher teu email
   - ✅ Salvar

### 2.2 Criar Firestore Database

1. No painel esquerdo, clicar em **🔥 Firestore Database**
2. Clicar em **Create database**
3. **Location**: Escolher `europe-west1` (Bélgica - mais próximo de Portugal)
4. **Security rules**: Selecionar **Start in production mode**
5. Clicar **Enable**

⏳ Aguardar criação da base de dados...

### 2.3 Configurar Storage (Upload de Imagens)

1. No painel esquerdo, clicar em **📦 Storage**
2. Clicar em **Get started**
3. **Security rules**: Aceitar as regras padrão
4. **Storage location**: `europe-west1` (mesma do Firestore)
5. Clicar **Done**

### 2.4 Ativar Hosting

1. No painel esquerdo, clicar em **🌐 Hosting**
2. Clicar em **Get started**
3. Por agora, apenas **fechar** (vamos configurar via CLI)

---

## PARTE 3: OBTER CREDENCIAIS FIREBASE (5 minutos)

### 3.1 Criar Web App

1. No **Project Overview** (ícone ⚙️ engrenagem no topo)
2. Clicar em **Project settings**
3. Scroll down até **"Your apps"**
4. Clicar no ícone **</>** (Web)

**Configuração:**
```
App nickname: Craftiva Web App
☑️ Also set up Firebase Hosting (marcar esta opção)
```

5. Clicar **Register app**

### 3.2 Copiar Configuração

Vais ver algo assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "craftiva-eu.firebaseapp.com",
  projectId: "craftiva-eu",
  storageBucket: "craftiva-eu.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

**🚨 GUARDAR ESTES VALORES** - vamos precisar!

6. Clicar **Continue to console**

---

## PARTE 4: SETUP LOCAL DO PROJETO (10 minutos)

### 4.1 Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 4.2 Login no Firebase

```bash
firebase login
```

➡️ Vai abrir o browser para autenticação Google
➡️ Autorizar o Firebase CLI

### 4.3 Navegar para a pasta do projeto

```bash
cd /caminho/para/craftiva_eu
# (onde está o código que extraíste do ZIP)
```

### 4.4 Inicializar Firebase

```bash
firebase init
```

**Seleções interativas:**

```
? Which Firebase features do you want to set up?
❯ ◉ Firestore
  ◉ Hosting
  ◉ Storage
  
(usar ESPAÇO para marcar, ENTER para confirmar)
```

**Firestore Setup:**
```
? What file should be used for Firestore Rules?
➡️ firestore.rules (já existe no projeto)

? What file should be used for Firestore indexes?
➡️ firestore.indexes.json (ENTER para criar)
```

**Hosting Setup:**
```
? What do you want to use as your public directory?
➡️ dist (não "public"!)

? Configure as a single-page app (rewrite all urls to /index.html)?
➡️ Yes

? Set up automatic builds and deploys with GitHub?
➡️ No (por agora)

? File dist/index.html already exists. Overwrite?
➡️ No (NÃO sobrescrever!)
```

**Storage Setup:**
```
? What file should be used for Storage Rules?
➡️ storage.rules (ENTER para criar)
```

### 4.5 Criar ficheiro .env.local

Criar ficheiro `.env.local` na raiz do projeto:

```bash
nano .env.local
# ou usar teu editor preferido
```

**Colar (substituir pelos TEUS valores do passo 3.2):**

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=craftiva-eu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=craftiva-eu
VITE_FIREBASE_STORAGE_BUCKET=craftiva-eu.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**💾 Guardar e fechar**

### 4.6 Atualizar src/firebase.ts

Editar `src/firebase.ts` para usar as variáveis de ambiente:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
```

---

## PARTE 5: APLICAR QUICK FIXES (30 minutos)

### 5.1 Atualizar index.html

Substituir `index.html` pelo código do ficheiro **craftiva_quick_fixes.md** (secção 1)

### 5.2 Criar robots.txt

```bash
mkdir -p public
nano public/robots.txt
```

Copiar conteúdo da secção 2 do **quick_fixes.md**

### 5.3 Criar Favicon

```bash
nano public/favicon.svg
```

Copiar código SVG da secção 8 do **quick_fixes.md**

### 5.4 Internacionalizar Footer

Editar:
- `src/App.tsx` (linhas 179-191)
- `src/i18n.ts` (adicionar secções `footer`)

Usar código da secção 5 do **quick_fixes.md**

### 5.5 Criar sitemap generator

```bash
mkdir -p scripts
nano scripts/generate-sitemap.js
```

Copiar código da secção 4 do **quick_fixes.md**

Adicionar ao `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "sitemap": "node scripts/generate-sitemap.js",
    "deploy": "npm run build && firebase deploy"
  }
}
```

Gerar sitemap:
```bash
npm run sitemap
```

---

## PARTE 6: BUILD & DEPLOY (10 minutos)

### 6.1 Testar Build Local

```bash
npm install
npm run build
```

✅ Verificar que a pasta `dist/` foi criada

### 6.2 Preview Local

```bash
npm run preview
```

➡️ Abrir http://localhost:4173
➡️ Testar navegação, login, etc.

### 6.3 Deploy para Firebase

```bash
firebase deploy
```

⏳ Aguardar upload...

**Output esperado:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/craftiva-eu/overview
Hosting URL: https://craftiva-eu.web.app
```

### 6.4 Testar Site Online

Abrir: https://craftiva-eu.web.app

✅ Verificar que está tudo funcional

---

## PARTE 7: CONECTAR DOMÍNIO CUSTOM (20 minutos)

### 7.1 Adicionar Domínio no Firebase

1. Firebase Console → **Hosting**
2. Clicar em **Add custom domain**
3. Introduzir: `craftiva.eu`
4. Clicar **Continue**

### 7.2 Adicionar www (opcional mas recomendado)

Repetir processo para `www.craftiva.eu`

### 7.3 Configurar DNS

Firebase vai mostrar registos DNS para adicionar:

**Tipo A (para craftiva.eu):**
```
Type: A
Name: @ (ou deixar vazio)
Value: 151.101.1.195
       151.101.65.195
```

**Tipo CNAME (para www.craftiva.eu):**
```
Type: CNAME
Name: www
Value: craftiva-eu.web.app.
```

### 7.4 Atualizar DNS no teu Registrar

**Onde está registado o craftiva.eu?**
- GoDaddy / Namecheap / Google Domains / Cloudflare / Outro?

**Passos genéricos:**
1. Login no painel do registrar
2. Ir para **DNS Management** / **Gestão de DNS**
3. **Apagar** quaisquer registos A existentes para `@` e `www`
4. **Adicionar** os novos registos fornecidos pelo Firebase
5. **Guardar alterações**

### 7.5 Aguardar Propagação DNS

⏳ Pode demorar 5 minutos a 48 horas (normalmente < 2 horas)

**Verificar status:**
```bash
# No terminal
dig craftiva.eu

# Ou online
https://dnschecker.org/#A/craftiva.eu
```

### 7.6 Verificar SSL Certificate

Firebase provisiona SSL automaticamente via Let's Encrypt.

Quando DNS propagar:
1. Firebase Console → Hosting
2. Ver status em **Custom domains**
3. Aguardar status mudar para **Connected** ✅

---

## PARTE 8: CONFIGURAÇÃO FINAL (15 minutos)

### 8.1 Configurar Firestore Security Rules

Firebase Console → Firestore Database → Rules

Substituir pelo conteúdo do ficheiro `firestore.rules` que já está no projeto.

Clicar **Publish**

### 8.2 Configurar Storage Rules

Firebase Console → Storage → Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024  // 5MB
                   && request.resource.contentType.matches('image/.*');
    }
    
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Clicar **Publish**

### 8.3 Google Search Console

1. Ir para: https://search.google.com/search-console
2. Adicionar propriedade: `craftiva.eu`
3. Verificar via **DNS TXT record** (Firebase já adicionou)
4. Submeter sitemap: `https://craftiva.eu/sitemap.xml`

### 8.4 Google Analytics (já configurado via Firebase)

Firebase Console → Analytics → Dashboard

➡️ Verificar que eventos estão a ser tracked

---

## PARTE 9: SMOKE TESTS (10 minutos)

### ✅ Checklist Final

Testar em https://craftiva.eu:

- [ ] Homepage carrega corretamente
- [ ] Seletor de idiomas funciona (PT/EN/ES)
- [ ] Registo de utilizador (email + password)
- [ ] Login com Google
- [ ] Seleção de role (Buyer/Seller)
- [ ] Criar produto (se seller)
- [ ] Busca e filtros
- [ ] Product details page
- [ ] Wishlist
- [ ] Sistema de mensagens
- [ ] Responsive mobile
- [ ] Analytics tracking (ver no Firebase Console)

### 🐛 Se algo não funcionar:

**Erro: "Firebase: Error (auth/...)"**
➡️ Verificar que Authentication está ativada no console

**Erro: "Permission denied" no Firestore**
➡️ Publicar firestore.rules novamente

**Imagens não fazem upload**
➡️ Verificar Storage rules publicadas

**Site não carrega no domínio custom**
➡️ Verificar DNS com `dig craftiva.eu`

---

## PARTE 10: PRÓXIMOS PASSOS

### Imediato (após deploy)
- [ ] Criar 2-3 produtos de teste
- [ ] Testar fluxo completo buyer → seller
- [ ] Monitorizar erros (Firebase Console → Crashlytics)
- [ ] Verificar performance (Hosting → Performance)

### Semana 1
- [ ] Integrar Stripe para pagamentos
- [ ] Email transacional (SendGrid)
- [ ] Recrutar primeiros 5 sellers beta
- [ ] Publicar primeiros blog posts SEO

### Mês 1
- [ ] Sistema de orders completo
- [ ] Dashboard analytics para sellers
- [ ] Programa de seller verification
- [ ] Campanhas Google Ads

---

## 📞 SUPORTE & DEBUGGING

### Logs do Firebase

```bash
# Ver logs em tempo real
firebase functions:log

# Ver erros de hosting
firebase hosting:channel:list
```

### Comandos Úteis

```bash
# Re-deploy apenas hosting
firebase deploy --only hosting

# Re-deploy apenas firestore rules
firebase deploy --only firestore:rules

# Ver projetos Firebase
firebase projects:list

# Mudar projeto ativo
firebase use craftiva-eu
```

### Variáveis de Ambiente

**Para adicionar novas variáveis:**

1. Adicionar em `.env.local`
2. Prefixar com `VITE_` (para Vite expor ao browser)
3. Aceder via `import.meta.env.VITE_NOME_VARIAVEL`

**⚠️ NUNCA commitar .env.local para git!**

---

## 🎉 DEPLOY COMPLETO!

O teu Craftiva.eu está agora **live** em:
- ✅ https://craftiva.eu (domínio custom)
- ✅ https://www.craftiva.eu (com www)
- ✅ https://craftiva-eu.web.app (backup Firebase)

**Próxima sessão**: Implementar sistema de pagamentos (Stripe) + emails transacionais.

---

*Tempo total estimado: **2-3 horas** (incluindo propagação DNS)*
