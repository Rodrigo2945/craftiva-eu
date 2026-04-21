// Script para adicionar produtos demo ao Firestore
// Executar: node add-demo-products.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAMYDgSMGLSDBduh2WP11J9ngpLWbUA9jU",
  authDomain: "craftiva-eu.firebaseapp.com",
  projectId: "craftiva-eu",
  storageBucket: "craftiva-eu.firebasestorage.app",
  messagingSenderId: "959426499872",
  appId: "1:959426499872:web:22dcc36f98f7999edcf345"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const demoProducts = [
  {
    name: "Tigela de Cerâmica Artesanal",
    description: "Tigela feita à mão em roda de oleiro. Acabamento em esmalte natural azul cobalto. Perfeita para servir sopas ou cereais.",
    price: 45,
    category: "ceramics",
    images: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800"],
    sellerId: "demo-seller-1",
    sellerName: "Maria Ceramista",
    status: "active",
    materials: ["Argila local", "Esmalte natural"],
    productionTime: "2-3 semanas",
    isCustomizable: true,
    location: "Porto, Portugal",
    tags: ["cerâmica", "azul", "tigela", "artesanal"]
  },
  {
    name: "Colar de Prata com Pedra Natural",
    description: "Colar em prata 925 com quartzo rosa natural. Design minimalista e elegante. Cada pedra é única.",
    price: 89,
    category: "jewelry",
    images: ["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800"],
    sellerId: "demo-seller-2",
    sellerName: "João Ourivesaria",
    status: "active",
    materials: ["Prata 925", "Quartzo rosa"],
    productionTime: "1 semana",
    isCustomizable: true,
    location: "Lisboa, Portugal"
  },
  {
    name: "Manta de Lã Merino",
    description: "Manta tecida à mão em lã merino 100%. Padrão tradicional português. Quente e macia.",
    price: 156,
    category: "textiles",
    images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800"],
    sellerId: "demo-seller-3",
    sellerName: "Ana Tecelagem",
    status: "active",
    materials: ["Lã merino 100%"],
    productionTime: "3-4 semanas",
    isCustomizable: false,
    location: "Guimarães, Portugal"
  },
  {
    name: "Tábua de Corte em Madeira de Oliveira",
    description: "Tábua artesanal em madeira de oliveira portuguesa. Acabamento com óleo natural. Ideal para queijos e enchidos.",
    price: 67,
    category: "wood",
    images: ["https://images.unsplash.com/photo-1565183997392-2f4f7d29b03b?w=800"],
    sellerId: "demo-seller-4",
    sellerName: "Carlos Carpintaria",
    status: "active",
    materials: ["Madeira de oliveira", "Óleo natural"],
    productionTime: "1-2 semanas",
    isCustomizable: true,
    location: "Alentejo, Portugal"
  },
  {
    name: "Vela Aromática de Cera de Abelha",
    description: "Vela 100% natural em cera de abelha portuguesa. Aroma suave de lavanda. Queima por 40h.",
    price: 28,
    category: "cosmetics",
    images: ["https://images.unsplash.com/photo-1602874801006-95ad31b93c0d?w=800"],
    sellerId: "demo-seller-5",
    sellerName: "Sofia Natural",
    status: "active",
    materials: ["Cera de abelha", "Óleo essencial de lavanda"],
    productionTime: "3 dias",
    isCustomizable: false,
    location: "Sintra, Portugal"
  },
  {
    name: "Brincos de Cortiça Portuguesa",
    description: "Brincos leves em cortiça natural portuguesa. Design contemporâneo. Hipoalergénicos.",
    price: 34,
    category: "jewelry",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"],
    sellerId: "demo-seller-2",
    sellerName: "João Ourivesaria",
    status: "active",
    materials: ["Cortiça natural", "Prata 925"],
    productionTime: "3-5 dias",
    isCustomizable: false,
    location: "Lisboa, Portugal"
  },
  {
    name: "Jarra de Cerâmica Esmaltada",
    description: "Jarra grande em cerâmica com esmalte verde floresta. Perfeita para flores ou como peça decorativa.",
    price: 52,
    category: "ceramics",
    images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800"],
    sellerId: "demo-seller-1",
    sellerName: "Maria Ceramista",
    status: "active",
    materials: ["Argila", "Esmalte verde"],
    productionTime: "2 semanas",
    isCustomizable: true,
    location: "Porto, Portugal"
  },
  {
    name: "Almofada de Linho Natural",
    description: "Almofada em linho 100% natural com padrão geométrico bordado à mão. Tons terrosos.",
    price: 45,
    category: "textiles",
    images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800"],
    sellerId: "demo-seller-3",
    sellerName: "Ana Tecelagem",
    status: "active",
    materials: ["Linho 100%"],
    productionTime: "1 semana",
    isCustomizable: true,
    location: "Guimarães, Portugal"
  },
  {
    name: "Relógio de Parede em Cortiça",
    description: "Relógio minimalista com moldura em cortiça natural. Mecanismo silencioso. Design português.",
    price: 78,
    category: "wood",
    images: ["https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800"],
    sellerId: "demo-seller-4",
    sellerName: "Carlos Carpintaria",
    status: "active",
    materials: ["Cortiça", "Mecanismo japonês"],
    productionTime: "5 dias",
    isCustomizable: false,
    location: "Alentejo, Portugal"
  },
  {
    name: "Sabonete Artesanal de Azeite",
    description: "Sabonete 100% natural com azeite português e lavanda. Hidratante e suave para pele sensível.",
    price: 12,
    category: "cosmetics",
    images: ["https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800"],
    sellerId: "demo-seller-5",
    sellerName: "Sofia Natural",
    status: "active",
    materials: ["Azeite virgem", "Lavanda", "Glicerina vegetal"],
    productionTime: "1 semana (cura)",
    isCustomizable: false,
    location: "Sintra, Portugal"
  }
];

async function addDemoProducts() {
  console.log('🚀 A adicionar produtos demo ao Firestore...\n');
  
  for (const product of demoProducts) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        views: Math.floor(Math.random() * 500),
        favorites: Math.floor(Math.random() * 50)
      });
      console.log(`✅ ${product.name} - ID: ${docRef.id}`);
    } catch (error) {
      console.error(`❌ Erro ao adicionar ${product.name}:`, error);
    }
  }
  
  console.log('\n✨ Produtos demo adicionados com sucesso!');
  process.exit(0);
}

addDemoProducts();
