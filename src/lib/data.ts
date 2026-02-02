import type { Product, Competitor, PriceHistory, Experiment, Kpi } from './types';

export const products: Product[] = [
  {
    id: 'prod_001',
    name: 'Wireless Headphones',
    category: 'Electronics',
    cost: 50,
    current_price: 79.99,
    min_price: 60,
    max_price: 120,
    target_margin: 30,
    inventory: 150,
    sales_last_30d: 320,
    imageUrl: 'https://picsum.photos/seed/1/600/400',
    imageHint: 'wireless headphones',
    description: 'High-fidelity wireless headphones with noise-cancelling technology, 20-hour battery life, and a comfortable over-ear design. Perfect for music lovers and frequent travelers.'
  },
  {
    id: 'prod_002',
    name: 'Smart Coffee Maker',
    category: 'Home Appliances',
    cost: 80,
    current_price: 129.99,
    min_price: 100,
    max_price: 180,
    target_margin: 25,
    inventory: 80,
    sales_last_30d: 150,
    imageUrl: 'https://picsum.photos/seed/2/600/400',
    imageHint: 'coffee maker',
    description: 'Wi-Fi enabled smart coffee maker that can be controlled via a mobile app. Brew your coffee from anywhere, schedule brewing times, and customize your coffee strength.'
  },
  {
    id: 'prod_003',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    cost: 120,
    current_price: 249.99,
    min_price: 200,
    max_price: 350,
    target_margin: 40,
    inventory: 45,
    sales_last_30d: 95,
    imageUrl: 'https://picsum.photos/seed/3/600/400',
    imageHint: 'office chair',
    description: 'A fully adjustable ergonomic office chair with lumbar support, adjustable armrests, and a breathable mesh back. Designed for all-day comfort and improved posture.'
  },
  {
    id: 'prod_004',
    name: '4K Action Camera',
    category: 'Electronics',
    cost: 150,
    current_price: 219.99,
    min_price: 180,
    max_price: 300,
    target_margin: 35,
    inventory: 200,
    sales_last_30d: 450,
    imageUrl: 'https://picsum.photos/seed/4/600/400',
    imageHint: 'action camera',
    description: 'A rugged, waterproof 4K action camera with image stabilization. Capture stunning videos and photos of your adventures. Comes with a variety of mounts and accessories.'
  },
];

export const competitors: Competitor[] = [
  { product_id: 'prod_001', competitor: 'Amazon', price: 75.99, last_updated: '2024-07-29T10:30:00Z' },
  { product_id: 'prod_001', competitor: 'BestBuy', price: 79.99, last_updated: '2024-07-29T11:00:00Z' },
  { product_id: 'prod_002', competitor: 'Walmart', price: 125.00, last_updated: '2024-07-29T09:00:00Z' },
  { product_id: 'prod_003', competitor: 'Target', price: 255.50, last_updated: '2024-07-28T14:00:00Z' },
  { product_id: 'prod_004', competitor: 'Amazon', price: 215.99, last_updated: '2024-07-29T12:00:00Z' },
];

export const getPriceHistory = (productId: string, basePrice: number): PriceHistory[] => {
  const history: PriceHistory[] = [];
  let price = basePrice;
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    price += (Math.random() - 0.5) * (basePrice * 0.05); // Fluctuate by up to 5%
    if (i % 7 === 0) price += (Math.random() - 0.6) * (basePrice * 0.1); // Weekly adjustment
    history.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }
  return history;
};


export const experiments: Experiment[] = [
    {
      id: "exp_001",
      name: "Price Test",
      product_id: "prod_001",
      status: "completed",
      startDate: "2024-07-01",
      endDate: "2024-07-15",
      controlPrice: 84.99,
      experimentPrice: 79.99,
      controlRevenue: 10198.8,
      experimentRevenue: 12798.4,
      controlUnitsSold: 120,
      experimentUnitsSold: 160
    },
    {
      id: "exp_002",
      name: "Demand Spike",
      product_id: "prod_004",
      status: "active",
      startDate: "2024-07-20",
      endDate: "2024-08-05",
      controlPrice: 219.99,
      experimentPrice: 239.99,
      controlRevenue: 26398.8,
      experimentRevenue: 19199.2,
      controlUnitsSold: 120,
      experimentUnitsSold: 80
    },
     {
      id: "exp_003",
      name: "Margin Push",
      product_id: "prod_002",
      status: "draft",
      startDate: "2024-08-10",
      endDate: "2024-08-25",
      controlPrice: 129.99,
      experimentPrice: 139.99,
      controlRevenue: 0,
      experimentRevenue: 0,
      controlUnitsSold: 0,
      experimentUnitsSold: 0
    }
];

export const kpis: Kpi[] = [
    {
        title: "Total Revenue",
        value: "$1.2M",
        change: "+12.5%",
        changeType: "increase",
        description: "vs. last month"
    },
    {
        title: "Average Margin",
        value: "38.2%",
        change: "-1.8%",
        changeType: "decrease",
        description: "vs. last month"
    },
    {
        title: "Active Experiments",
        value: "3",
        change: "+1",
        changeType: "increase",
        description: "vs. last week"
    },
    {
        title: "Price Adjustments",
        value: "1,482",
        change: "+21%",
        changeType: "increase",
        description: "in last 24h"
    }
];

export const revenueData = [
    { date: 'Jan', optimized: 4000, baseline: 2400 },
    { date: 'Feb', optimized: 3000, baseline: 1398 },
    { date: 'Mar', optimized: 5200, baseline: 3800 },
    { date: 'Apr', optimized: 4780, baseline: 3908 },
    { date: 'May', optimized: 6900, baseline: 4800 },
    { date: 'Jun', optimized: 5390, baseline: 3800 },
    { date: 'Jul', optimized: 6490, baseline: 4300 },
];
