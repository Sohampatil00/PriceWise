import { Firestore, collection, writeBatch, doc } from 'firebase/firestore';
import type { Product, CompetitorPrice, PriceHistory, Experiment } from './types';

const products: Omit<Product, 'id'>[] = [
    {
      name: 'Wireless Headphones',
      category: 'Electronics',
      cost: 5000,
      currentPrice: 7999,
      minPrice: 6000,
      maxPrice: 12000,
      targetMargin: 30,
      inventory: 150,
      salesLast30d: 320,
      imageUrl: 'https://picsum.photos/seed/1/600/400',
      imageHint: 'wireless headphones',
      description: 'High-fidelity wireless headphones with noise-cancelling technology, 20-hour battery life, and a comfortable over-ear design. Perfect for music lovers and frequent travelers.',
      isEssential: false,
    },
    {
      name: 'Infant Formula',
      category: 'Baby',
      cost: 1500,
      currentPrice: 2499,
      minPrice: 2000,
      maxPrice: 3500,
      targetMargin: 20,
      inventory: 250,
      salesLast30d: 800,
      imageUrl: 'https://picsum.photos/seed/pricewisebaby/600/400',
      imageHint: 'baby formula',
      description: 'Nutritionally complete infant formula for babies 0-12 months. Enriched with iron and DHA for brain development. A crucial item for infants.',
      isEssential: true,
    },
    {
      name: 'Ergonomic Office Chair',
      category: 'Furniture',
      cost: 12000,
      currentPrice: 24999,
      minPrice: 20000,
      maxPrice: 35000,
      targetMargin: 40,
      inventory: 45,
      salesLast30d: 95,
      imageUrl: 'https://picsum.photos/seed/3/600/400',
      imageHint: 'office chair',
      description: 'A fully adjustable ergonomic office chair with lumbar support, adjustable armrests, and a breathable mesh back. Designed for all-day comfort and improved posture.',
      isEssential: false,
    },
    {
      name: 'Paracetamol Tablets',
      category: 'Health',
      cost: 50,
      currentPrice: 99,
      minPrice: 70,
      maxPrice: 150,
      targetMargin: 50,
      inventory: 1000,
      salesLast30d: 2500,
      imageUrl: 'https://picsum.photos/seed/pricewisemed/600/400',
      imageHint: 'medicine tablets',
      description: 'Effective pain and fever relief. Paracetamol 500mg tablets for headaches, body aches, and fever. An essential household medicine.',
      isEssential: true,
    },
];

const experiments: Omit<Experiment, 'id'>[] = [
    {
      name: "Price Test",
      productId: "prod_001", // Wireless Headphones
      status: "completed",
      startDate: "2024-07-01",
      endDate: "2024-07-15",
      controlPrice: 8499,
      experimentPrice: 7999,
      controlRevenue: 1019880,
      experimentRevenue: 1279840,
      controlUnitsSold: 120,
      experimentUnitsSold: 160
    },
    {
      name: "Demand Spike",
      productId: "prod_004", // Paracetamol Tablets
      status: "active",
      startDate: "2024-07-20",
      endDate: "2024-08-05",
      controlPrice: 99,
      experimentPrice: 119,
      controlRevenue: 118800, // 1200 * 99
      experimentRevenue: 95200, // 800 * 119
      controlUnitsSold: 1200,
      experimentUnitsSold: 800
    },
     {
      name: "Margin Push",
      productId: "prod_003", // Office Chair
      status: "draft",
      startDate: "2024-08-10",
      endDate: "2024-08-25",
      controlPrice: 24999,
      experimentPrice: 26999,
      controlRevenue: 0,
      experimentRevenue: 0,
      controlUnitsSold: 0,
      experimentUnitsSold: 0
    }
];

export async function seedDatabase(db: Firestore) {
    const batch = writeBatch(db);

    // Seed Products
    products.forEach((product, i) => {
        const id = `prod_00${i + 1}`;
        const docRef = doc(db, 'products', id);
        batch.set(docRef, { ...product, id });
    });

    // Seed Experiments
    experiments.forEach((exp, i) => {
        const id = `exp_00${i + 1}`;
        const docRef = doc(db, 'experiments', id);
        batch.set(docRef, { ...exp, id });
    });

    await batch.commit();
}
