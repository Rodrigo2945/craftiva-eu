# ✅ CRAFTIVA.EU — DEPLOY CHECKLIST

Use esta checklist para acompanhar o progresso do deploy.

---

## 🔥 FIREBASE SETUP

### Criar Projeto
- [ ] Aceder a https://console.firebase.google.com/
- [ ] Criar projeto "craftiva-eu"
- [ ] Ativar Google Analytics
- [ ] Projeto criado com sucesso

### Authentication
- [ ] Ativar Email/Password
- [ ] Ativar Google Sign-in
- [ ] Configurar email de suporte

### Firestore Database
- [ ] Criar database
- [ ] Selecionar região: europe-west1
- [ ] Modo: Production
- [ ] Database criada

### Storage
- [ ] Ativar Storage
- [ ] Região: europe-west1
- [ ] Regras padrão aceites

### Web App
- [ ] Criar Web App "Craftiva Web App"
- [ ] Copiar firebaseConfig
- [ ] Guardar credenciais em segurança

---

## 💻 SETUP LOCAL

### Ambiente
- [ ] Node.js 18+ instalado
- [ ] Firebase CLI instalado: `npm install -g firebase-tools`
- [ ] Login Firebase: `firebase login`
- [ ] Autenticação bem-sucedida

### Projeto
- [ ] Código extraído do ZIP
- [ ] Navegar para pasta do projeto
- [ ] `npm install` executado
- [ ] Dependências instaladas

### Configuração
- [ ] `firebase init` executado
- [ ] Firestore selecionado ✓
- [ ] Hosting selecionado ✓
- [ ] Storage selecionado ✓
- [ ] Public directory = `dist`
- [ ] SPA = Yes
- [ ] Não sobrescrever index.html

---

## 🔧 QUICK FIXES

### Ficheiros Criados
- [ ] public/robots.txt
- [ ] public/favicon.svg
- [ ] scripts/generate-sitemap.js
- [ ] .env.example
- [ ] .gitignore (se não existia)

### Ficheiros Atualizados
- [ ] index.html (meta tags completas)
- [ ] package.json (scripts adicionados)
- [ ] src/firebase.ts (env variables)
- [ ] src/i18n.ts (secção footer)
- [ ] src/App.tsx (footer internacionalizado)

### Environment Variables
- [ ] .env.local criado
- [ ] VITE_FIREBASE_API_KEY preenchido
- [ ] VITE_FIREBASE_AUTH_DOMAIN preenchido
- [ ] VITE_FIREBASE_PROJECT_ID preenchido
- [ ] VITE_FIREBASE_STORAGE_BUCKET preenchido
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID preenchido
- [ ] VITE_FIREBASE_APP_ID preenchido
- [ ] VITE_FIREBASE_MEASUREMENT_ID preenchido

### Geração de Assets
- [ ] Sitemap gerado: `npm run sitemap`
- [ ] public/sitemap.xml existe
- [ ] Favicon visível em public/

---

## 🧪 BUILD & TEST

### Build Local
- [ ] `npm run build` executado
- [ ] Build bem-sucedido
- [ ] Pasta dist/ criada
- [ ] Sem erros TypeScript

### Preview Local
- [ ] `npm run preview` executado
- [ ] Site abre em localhost:4173
- [ ] Homepage carrega
- [ ] Navegação funciona
- [ ] Login modal abre
- [ ] Seletor de idiomas funciona

---

## 🚀 FIREBASE DEPLOY

### Primeiro Deploy
- [ ] `firebase deploy` executado
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Hosting deployed
- [ ] URL Firebase recebido: https://craftiva-eu.web.app

### Verificação Inicial
- [ ] Site abre no URL Firebase
- [ ] Console sem erros JavaScript
- [ ] Firebase Analytics tracking
- [ ] Autenticação funciona
- [ ] Firestore conecta

---

## 🌐 DOMÍNIO CUSTOM

### Firebase Hosting
- [ ] Add custom domain: craftiva.eu
- [ ] Add custom domain: www.craftiva.eu
- [ ] Registos DNS copiados

### DNS Configuration
- [ ] Aceder ao registrar do domínio
- [ ] Apagar registos A existentes
- [ ] Adicionar novo registo A (craftiva.eu)
- [ ] Adicionar registo CNAME (www)
- [ ] Alterações guardadas

### Propagação & SSL
- [ ] DNS propagado (verificar com `dig craftiva.eu`)
- [ ] Status no Firebase = "Connected"
- [ ] SSL certificate provisionado
- [ ] HTTPS funciona
- [ ] Redirect www → apex funciona (ou vice-versa)

---

## 🔒 SECURITY RULES

### Firestore
- [ ] Firebase Console → Firestore → Rules
- [ ] Copiar conteúdo de firestore.rules
- [ ] Publicar regras
- [ ] Testar criação de produto (deve funcionar)
- [ ] Testar edição por não-owner (deve bloquear)

### Storage
- [ ] Firebase Console → Storage → Rules
- [ ] Adicionar regras (ver DEPLOY_GUIDE.md)
- [ ] Publicar regras
- [ ] Testar upload de imagem < 5MB (deve funcionar)
- [ ] Testar upload > 5MB (deve bloquear)

---

## 📊 ANALYTICS & MONITORING

### Google Search Console
- [ ] Adicionar propriedade craftiva.eu
- [ ] Verificação DNS completada
- [ ] Sitemap submetido
- [ ] Sitemap indexado

### Firebase Analytics
- [ ] Aceder Firebase Console → Analytics
- [ ] Events a aparecer em Realtime
- [ ] page_view tracking
- [ ] Custom events (se implementados)

### Performance
- [ ] Firebase Console → Hosting → Performance
- [ ] Métricas a carregar
- [ ] TTI < 3s
- [ ] FCP < 1.5s

---

## ✅ SMOKE TESTS

### Funcionalidade Core
- [ ] Homepage carrega
- [ ] Produtos listam (se existirem)
- [ ] Registo de utilizador (email)
- [ ] Login com email
- [ ] Login com Google
- [ ] Seleção de role (Buyer/Seller)
- [ ] Dashboard de seller acessível
- [ ] Criação de produto funciona
- [ ] Upload de imagens funciona
- [ ] Product details page
- [ ] Filtros e busca
- [ ] Wishlist
- [ ] Sistema de mensagens
- [ ] Perfil de utilizador

### Multi-idioma
- [ ] Português (default)
- [ ] English
- [ ] Español
- [ ] Seletor de línguas no canto inferior direito
- [ ] Mudança de idioma persiste

### Responsivo
- [ ] Desktop (> 1024px)
- [ ] Tablet (768px - 1024px)
- [ ] Mobile (< 768px)
- [ ] Touch interactions funcionam

### SEO
- [ ] Título correto no browser tab
- [ ] Meta description presente (view source)
- [ ] Open Graph tags (testar em https://opengraph.xyz/)
- [ ] Favicon aparece
- [ ] robots.txt acessível: /robots.txt
- [ ] sitemap.xml acessível: /sitemap.xml

---

## 🎯 PÓS-DEPLOY

### Imediato (Dia 1)
- [ ] Criar conta de teste (buyer)
- [ ] Criar conta de teste (seller)
- [ ] Criar 2-3 produtos de exemplo
- [ ] Testar fluxo completo
- [ ] Monitorar Firebase Console por erros

### Semana 1
- [ ] Publicar no Google Search Console
- [ ] Criar conta Google My Business
- [ ] Setup Stripe (próxima fase)
- [ ] Email transacional (SendGrid/Mailgun)
- [ ] Recrutar 3-5 sellers beta

### Mês 1
- [ ] 10 sellers ativos
- [ ] 50+ produtos listados
- [ ] Sistema de orders implementado
- [ ] Blog com 5+ posts SEO
- [ ] Primeira campanha Google Ads

---

## 🐛 TROUBLESHOOTING

### Se algo correr mal:

**Build falha:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Firebase deploy falha:**
```bash
firebase logout
firebase login
firebase use craftiva-eu
firebase deploy
```

**DNS não propaga:**
- Aguardar até 48h
- Verificar: https://dnschecker.org
- Contactar support do registrar

**Erros de autenticação:**
- Verificar Firebase Console → Authentication
- Verificar .env.local tem todas as variáveis
- Limpar cache do browser

**Firestore permission denied:**
- Publicar firestore.rules novamente
- Verificar que utilizador fez login

---

## 📞 RECURSOS & SUPORTE

### Documentação
- Firebase: https://firebase.google.com/docs
- Vite: https://vitejs.dev/
- React Router: https://reactrouter.com/

### Suporte
- Firebase Support: https://firebase.google.com/support
- Stack Overflow: tag [firebase]
- Discord: Fireship.io community

### Ferramentas
- DNS Check: https://dnschecker.org/
- SSL Test: https://www.ssllabs.com/ssltest/
- SEO Test: https://www.seobility.net/en/seocheck/
- Performance: https://pagespeed.web.dev/

---

**Data de conclusão:** ____ / ____ / ____

**Deploy realizado por:** ________________

**URL final:** https://craftiva.eu ✅
