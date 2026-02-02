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
    {
        productId: 'prod_006',
        name: 'Fortune Sunlite Refined Sunflower Oil',
        category: 'Groceries',
        cost: 135,
        currentPrice: 155,
        minPrice: 140,
        maxPrice: 180,
        targetMargin: 15,
        inventory: 1200,
        salesLast30d: 2500,
        imageUrl: 'https://picsum.photos/seed/oil/600/400',
        imageHint: 'sunflower oil',
        description: '1 litre pouch of refined sunflower oil. Light and healthy, it is ideal for all types of Indian cooking.',
        isEssential: true,
        competitors: [
            { competitor: 'Amazon', price: 152, lastUpdated: new Date().toISOString() },
            { competitor: 'BigBasket', price: 155, lastUpdated: new Date().toISOString() },
            { competitor: 'Reliance', price: 154, lastUpdated: new Date().toISOString() },
        ]
    },
    {
        productId: 'prod_007',
        name: 'Maggi 2-Minute Noodles',
        category: 'Snacks',
        cost: 90,
        currentPrice: 105,
        minPrice: 95,
        maxPrice: 120,
        targetMargin: 16,
        inventory: 3000,
        salesLast30d: 8000,
        imageUrl: 'https://picsum.photos/seed/noodles/600/400',
        imageHint: 'instant noodles',
        description: 'Family pack of 6 Maggi noodles. India\'s favorite instant noodle that is loved by all ages.',
        isEssential: false,
        competitors: [
            { competitor: 'Amazon', price: 104, lastUpdated: new Date().toISOString() },
            { competitor: 'Flipkart', price: 105, lastUpdated: new Date().toISOString() },
            { competitor: 'BigBasket', price: 105, lastUpdated: new Date().toISOString() },
        ]
    },
    {
        productId: 'prod_008',
        name: 'Brooke Bond Red Label Tea',
        category: 'Beverages',
        cost: 450,
        currentPrice: 520,
        minPrice: 480,
        maxPrice: 580,
        targetMargin: 15,
        inventory: 600,
        salesLast30d: 900,
        imageUrl: 'https://picsum.photos/seed/tea/600/400',
        imageHint: 'tea leaves',
        description: '1kg pack of Red Label tea. A blend of tea leaves that gives you a strong, satisfying cup of tea.',
        isEssential: false,
        competitors: [
            { competitor: 'Amazon', price: 515, lastUpdated: new Date().toISOString() },
            { competitor: 'Flipkart', price: 520, lastUpdated: new Date().toISOString() },
            { competitor: 'BigBasket', price: 518, lastUpdated: new Date().toISOString() },
        ]
    },
    {
        productId: 'prod_009',
        name: 'Colgate MaxFresh Toothpaste',
        category: 'Personal Care',
        cost: 180,
        currentPrice: 210,
        minPrice: 190,
        maxPrice: 240,
        targetMargin: 18,
        inventory: 1000,
        salesLast30d: 2200,
        imageUrl: 'https://picsum.photos/seed/toothpaste/600/400',
        imageHint: 'toothpaste tube',
        description: '300g tube of Colgate MaxFresh toothpaste. Packed with cooling crystals to give you intense cooling and super freshness.',
        isEssential: true,
        competitors: [
            { competitor: 'Amazon', price: 208, lastUpdated: new Date().toISOString() },
            { competitor: 'Nykaa', price: 210, lastUpdated: new Date().toISOString() },
            { competitor: 'BigBasket', price: 210, lastUpdated: new Date().toISOString() },
        ]
    },
    {
        productId: 'prod_010',
        name: 'Lifebuoy Total 10 Soap',
        category: 'Personal Care',
        cost: 120,
        currentPrice: 145,
        minPrice: 130,
        maxPrice: 160,
        targetMargin: 20,
        inventory: 2500,
        salesLast30d: 6000,
        imageUrl: 'https://picsum.photos/seed/soap/600/400',
        imageHint: 'soap bar',
        description: 'Value pack of 4 Lifebuoy Total 10 soaps. It gives you 100% stronger protection from infection-causing germs.',
        isEssential: true,
        competitors: [
            { competitor: 'BigBasket', price: 145, lastUpdated: new Date().toISOString() },
            { competitor: 'Amazon', price: 142, lastUpdated: new Date().toISOString() },
            { competitor: 'Flipkart', price: 145, lastUpdated: new Date().toISOString() },
        ]
    },
    {
        productId: 'prod_011',
        name: 'Surf Excel Easy Wash Detergent Powder',
        category: 'Household',
        cost: 480,
        currentPrice: 550,
        minPrice: 500,
        maxPrice: 600,
        targetMargin: 15,
        inventory: 800,
        salesLast30d: 1300,
        imageUrl: 'https://picsum.photos/seed/detergent/600/400',
        imageHint: 'detergent powder',
        description: '4kg pack of Surf Excel Easy Wash. The new Surf excel Easy Wash is made with a superior technology that removes stains 2x better.',
        isEssential: true,
        competitors: [
            { competitor: 'Amazon', price: 545, lastUpdated: new Date().toISOString() },
            { competitor: 'Flipkart', price: 550, lastUpdated: new Date().toISOString() },
            { competitor: 'BigBasket', price: 548, lastUpdated: new Date().toISOString() },
        ]
    },
    {
        productId: 'prod_012',
        name: 'Clinic Plus Shampoo',
        category: 'Personal Care',
        cost: 420,
        currentPrice: 480,
        minPrice: 450,
        maxPrice: 520,
        targetMargin: 14,
        inventory: 900,
        salesLast30d: 1800,
        imageUrl: 'https://picsum.photos/seed/shampoo/600/400',
        imageHint: 'shampoo bottle',
        description: '1 litre bottle of Clinic Plus Strong & Long Health shampoo. Nourishes and makes hair up to 35x stronger.',
        isEssential: false,
        competitors: [
            { competitor: 'Nykaa', price: 475, lastUpdated: new Date().toISOString() },
            { competitor: 'Amazon', price: 478, lastUpdated: new Date().toISOString() },
            { competitor: 'Flipkart', price: 480, lastUpdated: new Date().toISOString() },
        ]
    },
    {
        productId: 'prod_013',
        name: 'Infant Formula',
        category: 'Baby Care',
        cost: 600,
        currentPrice: 750,
        minPrice: 650,
        maxPrice: 850,
        targetMargin: 25,
        inventory: 300,
        salesLast30d: 400,
        imageUrl: 'https://picsum.photos/seed/formula/600/400',
        imageHint: 'baby formula',
        description: 'Stage 2 infant formula for babies after 6 months. A spray-dried follow-up formula with DHA ARA for infants after 6 months when they are not breastfed.',
        isEssential: true,
        competitors: [
            { competitor: 'Amazon', price: 740, lastUpdated: new Date().toISOString() },
            { competitor: 'BigBasket', price: 750, lastUpdated: new Date().toISOString() },
        ]
    },
    {
        productId: 'prod_014',
        name: 'Paracetamol Tablets',
        category: 'Health',
        cost: 25,
        currentPrice: 35,
        minPrice: 30,
        maxPrice: 45,
        targetMargin: 40,
        inventory: 5000,
        salesLast30d: 10000,
        imageUrl: 'https://picsum.photos/seed/paracetamol/600/400',
        imageHint: 'medicine tablets',
        description: 'Strip of 15 Paracetamol 650mg tablets. Relieves pain and reduces fever.',
        isEssential: true,
        competitors: [
            { competitor: 'Nykaa', price: 34, lastUpdated: new Date().toISOString() }, // Assuming Nykaa has a pharmacy section for demo
            { competitor: 'Reliance', price: 35, lastUpdated: new Date().toISOString() },
        ]
    }
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
