#!/bin/bash

# 🚀 CRAFTIVA.EU - DEPLOY AUTOMÁTICO
# Script interativo para fazer deploy completo

set -e

echo "🎨 CRAFTIVA.EU - Deploy Automático Iniciado"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar Firebase CLI
echo -e "${BLUE}[1/7]${NC} Verificando Firebase CLI..."
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}Firebase CLI não encontrado. Instalando...${NC}"
    npm install -g firebase-tools
fi
echo -e "${GREEN}✓ Firebase CLI instalado${NC}"
echo ""

# 2. Instalar dependências
echo -e "${BLUE}[2/7]${NC} Instalando dependências do projeto..."
npm install --silent
echo -e "${GREEN}✓ Dependências instaladas${NC}"
echo ""

# 3. Firebase Login
echo -e "${BLUE}[3/7]${NC} Autenticação Firebase..."
echo -e "${YELLOW}⚠️  Isto vai abrir o browser para login${NC}"
echo "Pressiona ENTER para continuar..."
read
firebase login
echo -e "${GREEN}✓ Autenticado no Firebase${NC}"
echo ""

# 4. Criar projeto Firebase
echo -e "${BLUE}[4/7]${NC} Vamos criar o projeto Firebase..."
echo ""
echo "Opções:"
echo "  1) Criar projeto NOVO (craftiva-eu)"
echo "  2) Usar projeto EXISTENTE"
echo ""
read -p "Escolhe (1 ou 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo -e "${YELLOW}📋 IMPORTANTE: Vais precisar fazer isto manualmente:${NC}"
    echo ""
    echo "1. Abre: https://console.firebase.google.com/"
    echo "2. Clica 'Add project'"
    echo "3. Nome: craftiva-eu"
    echo "4. Ativa Google Analytics: Sim"
    echo "5. Aguarda criação do projeto"
    echo ""
    echo "Depois de criado:"
    echo "  → Authentication → Sign-in method"
    echo "     ✓ Ativar Email/Password"
    echo "     ✓ Ativar Google"
    echo ""
    echo "  → Firestore Database → Create database"
    echo "     • Região: europe-west1"
    echo "     • Modo: Production"
    echo ""
    echo "  → Storage → Get started"
    echo "     • Região: europe-west1"
    echo ""
    echo "Pressiona ENTER quando tiveres terminado..."
    read
    
    PROJECT_ID="craftiva-eu"
else
    echo ""
    firebase projects:list
    echo ""
    read -p "Introduz o PROJECT ID: " PROJECT_ID
fi

echo -e "${GREEN}✓ Projeto: $PROJECT_ID${NC}"
echo ""

# 5. Inicializar Firebase no projeto
echo -e "${BLUE}[5/7]${NC} Inicializando Firebase..."
firebase use "$PROJECT_ID"
firebase init hosting firestore storage --project "$PROJECT_ID" <<EOF
dist
y
y
n
n
firestore.rules
firestore.indexes.json
storage.rules
EOF
echo -e "${GREEN}✓ Firebase inicializado${NC}"
echo ""

# 6. Obter credenciais
echo -e "${BLUE}[6/7]${NC} Obtendo credenciais Firebase..."
echo ""
echo -e "${YELLOW}📋 Agora precisas das credenciais da Web App:${NC}"
echo ""
echo "1. Abre: https://console.firebase.google.com/project/$PROJECT_ID/settings/general"
echo "2. Scroll down até 'Your apps'"
echo "3. Se não tens Web App ainda:"
echo "   • Clica no ícone </> (Web)"
echo "   • App nickname: Craftiva Web App"
echo "   • ☑ Firebase Hosting"
echo "   • Regista a app"
echo ""
echo "4. Copia o firebaseConfig:"
echo "   const firebaseConfig = {"
echo "     apiKey: \"...\","
echo "     authDomain: \"...\","
echo "     ..."
echo "   }"
echo ""
echo "Pressiona ENTER quando tiveres as credenciais prontas..."
read

# Criar .env.local interativo
echo ""
echo -e "${YELLOW}Vamos criar o ficheiro .env.local...${NC}"
echo ""

read -p "API Key: " API_KEY
read -p "Auth Domain: " AUTH_DOMAIN
read -p "Project ID: " PROJ_ID
read -p "Storage Bucket: " STORAGE_BUCKET
read -p "Messaging Sender ID: " SENDER_ID
read -p "App ID: " APP_ID
read -p "Measurement ID: " MEASUREMENT_ID

cat > .env.local <<ENVEOF
VITE_FIREBASE_API_KEY=$API_KEY
VITE_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=$PROJ_ID
VITE_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=$SENDER_ID
VITE_FIREBASE_APP_ID=$APP_ID
VITE_FIREBASE_MEASUREMENT_ID=$MEASUREMENT_ID
VITE_APP_ENV=production
VITE_APP_URL=https://craftiva.eu
ENVEOF

echo -e "${GREEN}✓ .env.local criado${NC}"
echo ""

# 7. Build e Deploy
echo -e "${BLUE}[7/7]${NC} Build e Deploy..."
echo ""

echo "Gerando sitemap..."
npm run sitemap

echo "Building..."
npm run build

echo "Deploying to Firebase..."
firebase deploy

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}    ✅ DEPLOY CONCLUÍDO COM SUCESSO!    ${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "🌐 URL Firebase: https://$PROJECT_ID.web.app"
echo "🌐 URL Firebase: https://$PROJECT_ID.firebaseapp.com"
echo ""
echo -e "${YELLOW}📋 PRÓXIMO PASSO: Configurar domínio custom${NC}"
echo ""
echo "1. Firebase Console → Hosting → Add custom domain"
echo "2. Introduz: craftiva.eu"
echo "3. Copia os DNS records"
echo "4. No Namecheap:"
echo "   • Advanced DNS"
echo "   • Adiciona os records A e CNAME"
echo "5. Aguarda propagação (30min - 48h)"
echo ""
echo "Ficheiro de credenciais: .env.local"
echo ""
