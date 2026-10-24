# Craftiva.eu

Marketplace B2B de artesãos europeus verificados. Lojas pedem encomendas com quantidade mínima (MOQ); o pagamento, por agora, combina-se entre as partes. Aplicação React + TypeScript + Vite + Tailwind, com Firebase (Firestore, Analytics e login Google) e textos em português, inglês e espanhol. O português é a língua por omissão.

## Correr em local

```bash
npm install
npm run dev
```

O servidor de desenvolvimento fica em `http://127.0.0.1:3000`. Para a build de produção:

```bash
npm run build
npm run preview
```

Sem variáveis de ambiente, a aplicação usa a configuração web pública do projecto `craftiva-eu` e, se o Firestore estiver vazio ou inacessível, mostra a coleção de demonstração local. Para apontar a outro projecto Firebase, copia `.env.example` para `.env.local`.

## Passos manuais (Firebase e GitHub)

O agente que preparou este código **não** publica regras nem dados no Firebase, e **não** faz push para `github.com/Rodrigo2945/craftiva-eu`. Quem mantém o projecto aplica as alterações no repositório GitHub e corre os comandos abaixo na sua máquina, com sessão iniciada na conta certa.

### 1. Trazer as alterações para o GitHub

Há um pacote `git format-patch` (relativo a `main` do repositório público) para aplicar no clone do GitHub:

```bash
git clone https://github.com/Rodrigo2945/craftiva-eu
cd craftiva-eu
git checkout main
git am /caminho/para/os-patches/*.patch
git push origin main
```

O push para `main` dispara o workflow `.github/workflows/github-pages.yml`, que faz a build e publica em GitHub Pages com o CNAME `craftiva.eu`. A build copia `index.html` para `404.html`, para rotas como `/blog` e `/category/ceramics` abrirem directamente.

Confirma os secrets do repositório (`VITE_FIREBASE_*`) em Settings → Secrets → Actions. Sem eles, a build usa a configuração pública já presente no código.

### 2. Publicar as regras do Firestore

As regras em `firestore.rules` deixam `products`, `listings`, `categories` e `blog` legíveis por qualquer pessoa. Escrever continua reservado ao dono autenticado do documento ou a um administrador (`users/{uid}.role == "admin"` ou custom claim `admin`).

Na raiz do projecto, com a [Firebase CLI](https://firebase.google.com/docs/cli) e sessão iniciada:

```bash
npx firebase login
npx firebase deploy --only firestore:rules,firestore:indexes --project craftiva-eu
```

O ficheiro `.firebaserc` já aponta para `craftiva-eu`. Só as regras e os índices são publicados; o site continua no GitHub Pages, não no Firebase Hosting.

### 3. Semear os produtos de demonstração

O script usa o **Admin SDK**, que ignora as security rules. Precisa de uma conta de serviço com permissão para escrever no Firestore (Firebase console → Project settings → Service accounts → Generate new private key). Não commits esse JSON.

```bash
export GOOGLE_APPLICATION_CREDENTIALS="$PWD/service-account.json"
npm run seed
```

Em alternativa, cola o JSON na variável `FIREBASE_SERVICE_ACCOUNT`. O script grava cerca de oito produtos com IDs estáveis (`demo-...`), MOQ, preço «desde €» e `verified: true`, e pode ser corrido outra vez sem duplicar.

Enquanto o catálogo remoto estiver vazio ou a devolver erro, o site mostra os mesmos produtos a partir de `data/demo-products.json`.
