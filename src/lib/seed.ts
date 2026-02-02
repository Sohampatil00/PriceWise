import { Firestore, collection, writeBatch } from 'firebase/firestore';
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
      description: 'High-fidelity wireless headphones with noise-cancelling technology, 20-hour battery life, and a comfortable over-ear design. Perfect for music lovers and frequent travelers.'
    },
    {
      name: 'Smart Coffee Maker',
      category: 'Home Appliances',
      cost: 8000,
      currentPrice: 12999,
      minPrice: 10000,
      maxPrice: 18000,
      targetMargin: 25,
      inventory: 80,
      salesLast30d: 150,
      imageUrl: 'https://picsum.photos/seed/2/600/400',
      imageHint: 'coffee maker',
      description: 'Wi-Fi enabled smart coffee maker that can be controlled via a mobile app. Brew your coffee from anywhere, schedule brewing times, and customize your coffee strength.'
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
      description: 'A fully adjustable ergonomic office chair with lumbar support, adjustable armrests, and a breathable mesh back. Designed for all-day comfort and improved posture.'
    },
    {
      name: '4K Action Camera',
      category: 'Electronics',
      cost: 15000,
      currentPrice: 21999,
      minPrice: 18000,
      maxPrice: 30000,
      targetMargin: 35,
      inventory: 200,
      salesLast30d: 450,
      imageUrl: 'https://picsum.photos/seed/4/600/400',
      imageHint: 'action camera',
      description: 'A rugged, waterproof 4K action camera with image stabilization. Capture stunning videos and photos of your adventures. Comes with a variety of mounts and accessories.'
    },
];

const experiments: Omit<Experiment, 'id'>[] = [
    {
      name: "Price Test",
      productId: "prod_001",
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
      productId: "prod_004",
      status: "active",
      startDate: "2024-07-20",
      endDate: "2024-08-05",
      controlPrice: 21999,
      experimentPrice: 23999,
      controlRevenue: 2639880,
      experimentRevenue: 1919920,
      controlUnitsSold: 120,
      experimentUnitsSold: 80
    },
     {
      name: "Margin Push",
      productId: "prod_002",
      status: "draft",
      startDate: "2024-08-10",
      endDate: "2024-08-25",
      controlPrice: 12999,
      experimentPrice: 13999,
      controlRevenue: 0,
      experimentRevenue: 0,
      controlUnitsSold: 0,
      experimentUnitsSold: 0
    }
];

export async function seedDatabase(db: Firestore) {
    const batch = writeBatch(db);

    // Seed Products
    const productsCollection = collection(db, 'products');
    products.forEach((product, i) => {
        const id = `prod_00${i + 1}`;
        const docRef = collection(productsCollection, id);
        batch.set(docRef, { ...product, id });
    });

    // Seed Experiments
    const experimentsCollection = collection(db, 'experiments');
    experiments.forEach((experiment, i) => {
        const id = `exp_00${i + 1}`;
        const docRef = collection(experimentsCollection, id);
        batch.set(docRef, { ...experiment, id });
    });

    await batch.commit();
}
