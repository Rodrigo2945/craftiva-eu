// Semeia a coleção de demonstração no Firestore.
//
// As security rules não deixam um cliente anónimo escrever. Este script usa
// o Admin SDK, que ignora as rules. Não faças commit da chave.
//
//   export GOOGLE_APPLICATION_CREDENTIALS="$PWD/service-account.json"
//   npm run seed
//
// Em alternativa: FIREBASE_SERVICE_ACCOUNT com o JSON ou com o caminho do ficheiro.
// Correr outra vez actualiza os mesmos IDs (demo-...), sem duplicar.

import { readFileSync, existsSync } from 'node:fs';
import { initializeApp, cert, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const catalog = JSON.parse(
  readFileSync(new URL('./data/demo-products.json', import.meta.url), 'utf8'),
);

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    const text = raw.trim().startsWith('{') ? raw : readFileSync(raw, 'utf8');
    return JSON.parse(text);
  }
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath && existsSync(credentialsPath)) {
    return JSON.parse(readFileSync(credentialsPath, 'utf8'));
  }
  return null;
}

function initAdmin() {
  if (getApps().length > 0) return getApps()[0];
  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    console.error(`
Falta a conta de serviço. O catálogo local já aparece no site sem este passo.
Para gravar os mesmos produtos no Firestore:

  1. Firebase console → Project settings → Service accounts → Generate new private key
  2. Guarda o ficheiro fora do git, por exemplo service-account.json
  3. export GOOGLE_APPLICATION_CREDENTIALS="$PWD/service-account.json"
  4. npm run seed

O projecto esperado é craftiva-eu.
`);
    process.exit(1);
  }

  return initializeApp({
    credential: serviceAccount.project_id ? cert(serviceAccount) : applicationDefault(),
    projectId: serviceAccount.project_id || process.env.GCLOUD_PROJECT || 'craftiva-eu',
  });
}

async function seed() {
  initAdmin();
  const db = getFirestore();
  const batch = db.batch();

  for (const category of catalog.categories) {
    batch.set(db.collection('categories').doc(category.id), category, { merge: true });
  }

  const sellers = new Map();
  for (const product of catalog.products) {
    const { sellerStory, craftType, createdAt, ...stored } = product;
    batch.set(
      db.collection('products').doc(product.id),
      {
        ...stored,
        createdAt: Timestamp.fromDate(new Date(createdAt)),
      },
      { merge: true },
    );
    if (!sellers.has(product.sellerId)) {
      sellers.set(product.sellerId, {
        uid: product.sellerId,
        displayName: product.sellerName,
        role: 'seller',
        story: sellerStory,
        bio: sellerStory,
        craftType,
        createdAt: Timestamp.fromDate(new Date(createdAt)),
      });
    }
  }

  for (const [sellerId, profile] of sellers) {
    batch.set(db.collection('users').doc(sellerId), profile, { merge: true });
  }

  await batch.commit();
  console.log(`Gravados ${catalog.products.length} produtos, ${catalog.categories.length} categorias e ${sellers.size} oficinas.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
