import { Firestore, collection, writeBatch, doc } from 'firebase/firestore';
import type { Product, CompetitorPrice, Experiment } from './types';

// Omit 'id' as it will be auto-generated or assigned.
type ProductSeed = Omit<Product, 'id'>;
type CompetitorPriceSeed = Omit<CompetitorPrice, 'id' | 'productId'>;

const productsData: (ProductSeed & { competitors: CompetitorPriceSeed[], productId: string })[] = [
    {
      productId: 'prod_001',
      name: 'Aashirvaad Shudh Chakki Atta',
      category: 'Groceries',
      cost: 380,
      currentPrice: 450,
      minPrice: 400,
      maxPrice: 550,
      targetMargin: 15,
      inventory: 500,
      salesLast30d: 1200,
      imageUrl: 'https://picsum.photos/seed/atta/600/400',
      imageHint: 'wheat flour',
      description: '10kg pack of whole wheat flour, perfect for making soft rotis. Made from the choicest grains - heavy on the palm, golden amber in colour and hard in bite.',
      isEssential: true,
      competitors: [
        { competitor: 'Amazon', price: 445, lastUpdated: new Date().toISOString() },
        { competitor: 'Flipkart', price: 455, lastUpdated: new Date().toISOString() },
        { competitor: 'BigBasket', price: 450, lastUpdated: new Date().toISOString() },
      ]
    },
    {
      productId: 'prod_002',
      name: 'Tata Salt',
      category: 'Groceries',
      cost: 18,
      currentPrice: 24,
      minPrice: 20,
      maxPrice: 30,
      targetMargin: 25,
      inventory: 2000,
      salesLast30d: 5000,
      imageUrl: 'https://picsum.photos/seed/salt/600/400',
      imageHint: 'salt packet',
      description: '1kg packet of iodized salt. India\'s first packaged iodized salt brand with a legacy of trust and quality.',
      isEssential: true,
      competitors: [
        { competitor: 'Amazon', price: 23, lastUpdated: new Date().toISOString() },
        { competitor: 'Flipkart', price: 24, lastUpdated: new Date().toISOString() },
        { competitor: 'BigBasket', price: 24, lastUpdated: new Date().toISOString() },
      ]
    },
    {
      productId: 'prod_003',
      name: 'Amul Butter',
      category: 'Dairy',
      cost: 240,
      currentPrice: 275,
      minPrice: 260,
      maxPrice: 300,
      targetMargin: 12,
      inventory: 800,
      salesLast30d: 3500,
      imageUrl: 'https://picsum.photos/seed/butter/600/400',
      imageHint: 'butter block',
      description: '500g pasteurised butter. Made from the finest fresh cream, it has a delicious, creamy taste.',
      isEssential: true,
      competitors: [
        { competitor: 'BigBasket', price: 275, lastUpdated: new Date().toISOString() },
        { competitor: 'Reliance', price: 274, lastUpdated: new Date().toISOString() },
      ]
    },
    {
      productId: 'prod_004',
      name: 'Parle-G Biscuits',
      category: 'Snacks',
      cost: 65,
      currentPrice: 80,
      minPrice: 70,
      maxPrice: 90,
      targetMargin: 18,
      inventory: 1500,
      salesLast30d: 10000,
      imageUrl: 'https://picsum.photos/seed/biscuits/600/400',
      imageHint: 'biscuit packet',
      description: 'Large 800g family pack. Filled with the goodness of milk and wheat, Parle-G has been a source of all-round nourishment for the nation.',
      isEssential: false,
       competitors: [
        { competitor: 'Amazon', price: 78, lastUpdated: new Date().toISOString() },
        { competitor: 'Flipkart', price: 80, lastUpdated: new Date().toISOString() },
        { competitor: 'BigBasket', price: 80, lastUpdated: new Date().toISOString() },
      ]
    },
     {
      productId: 'prod_005',
      name: 'Dettol Antiseptic Liquid',
      category: 'Health',
      cost: 150,
      currentPrice: 190,
      minPrice: 170,
      maxPrice: 220,
      targetMargin: 20,
      inventory: 700,
      salesLast30d: 1500,
      imageUrl: 'https://picsum.photos/seed/antiseptic/600/400',
      imageHint: 'antiseptic liquid',
      description: '550ml bottle of Dettol Antiseptic Liquid. A safe and gentle antiseptic and disinfectant that kills germs and provides protection against infection.',
      isEssential: true,
      competitors: [
        { competitor: 'Amazon', price: 188, lastUpdated: new Date().toISOString() },
        { competitor: 'Nykaa', price: 190, lastUpdated: new Date().toISOString() },
      ]
    },
];

const experiments: Omit<Experiment, 'id'>[] = [
    {
      name: "Atta Price Reduction Test",
      productId: "prod_001",
      status: "completed",
      startDate: "2024-07-01",
      endDate: "2024-07-15",
      controlPrice: 460,
      experimentPrice: 450,
      controlRevenue: 230000, // 500 * 460
      experimentRevenue: 315000, // 700 * 450
      controlUnitsSold: 500,
      experimentUnitsSold: 700
    },
    {
      name: "Butter Weekend Sale",
      productId: "prod_003",
      status: "active",
      startDate: "2024-07-20",
      endDate: "2024-08-05",
      controlPrice: 275,
      experimentPrice: 265,
      controlRevenue: 275000, 
      experimentRevenue: 318000,
      controlUnitsSold: 1000,
      experimentUnitsSold: 1200
    },
     {
      name: "Biscuit Bundle Offer",
      productId: "prod_004",
      status: "draft",
      startDate: "2024-08-10",
      endDate: "2024-08-25",
      controlPrice: 80,
      experimentPrice: 75, // Effective price in bundle
      controlRevenue: 0,
      experimentRevenue: 0,
      controlUnitsSold: 0,
      experimentUnitsSold: 0
    }
];

export async function seedDatabase(db: Firestore) {
    const batch = writeBatch(db);

    // Seed Products and their Competitor Prices
    productsData.forEach((productData) => {
        const { productId, competitors, ...product } = productData;
        const productRef = doc(db, 'products', productId);
        batch.set(productRef, { ...product, id: productId });

        // Seed competitor prices for this product
        const competitorPricesRef = collection(productRef, 'competitorPrices');
        competitors.forEach(competitorPrice => {
            const competitorDocRef = doc(competitorPricesRef);
            batch.set(competitorDocRef, competitorPrice);
        });
    });

    // Seed Experiments
    experiments.forEach((exp, i) => {
        const id = `exp_00${i + 1}`;
        const docRef = doc(db, 'experiments', id);
        batch.set(docRef, { ...exp, id });
    });

    await batch.commit();
}
