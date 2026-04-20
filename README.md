# 🛍️ Craftiva.eu — European Artisan B2B Marketplace

Plataforma B2B que conecta artesãos europeus verificados com compradores que valorizam autenticidade, qualidade e origem europeia garantida.

## 🌟 Visão Geral

Marketplace multilíngue (PT/EN/ES) especializado em produtos artesanais de alta qualidade, focado exclusivamente em artesãos europeus verificados.

### Características

- ✅ **B2B-First** — Otimizado para grossistas
- 🇪🇺 **Europa Exclusiva** — Apenas artesãos EU
- 🌍 **Trilíngue** — PT/EN/ES nativo
- 🎨 **Storytelling** — História de cada artesão
- 📊 **Analytics** — Firebase tracking completo
- 🔒 **Seguro** — Auth + Firestore rules

---

## 🚀 Quick Start

```bash
# 1. Instalar
npm install

# 2. Configurar Firebase
cp .env.example .env.local
# Editar .env.local com credenciais

# 3. Executar
npm run dev
```

Aceder: **http://localhost:3000**

---

## 🏗️ Tech Stack

**Frontend**: React 19, TypeScript, Tailwind, Vite  
**Backend**: Firebase (Auth, Firestore, Storage)  
**i18n**: i18next (3 idiomas)

---

## 🔧 Scripts

```bash
npm run dev        # Desenvolvimento
npm run build      # Build produção
npm run sitemap    # Gerar sitemap.xml
npm run deploy     # Deploy Firebase
```

---

## 📁 Estrutura

```
src/
├── components/      # React components
├── firebase.ts      # Firebase config
├── i18n.ts         # Traduções PT/EN/ES
└── types.ts        # TypeScript types

public/
├── favicon.svg     # Logo
├── robots.txt      # SEO
└── sitemap.xml     # SEO
```

---

## 🔥 Firebase Setup

1. Criar projeto Firebase
2. Ativar Authentication, Firestore, Storage
3. Copiar config para .env.local
4. `firebase init` → `firebase deploy`

Ver: **DEPLOY_GUIDE.md**

---

## 🌍 Idiomas

- 🇵🇹 Português (default)
- 🇬🇧 English
- 🇪🇸 Español

---

## 📊 SEO

✅ Meta tags completas  
✅ Open Graph + Twitter Cards  
✅ Schema.org markup  
✅ Sitemap.xml automático

---

## 📝 Documentação

- **DEPLOY_GUIDE.md** — Deploy passo-a-passo
- **DEPLOY_CHECKLIST.md** — Checklist completa
- **craftiva_analise_completa.md** — Análise técnica

---

**Versão**: 1.0.0  
**Status**: 🚀 Production Ready

Copyright © 2026 Craftiva.eu
