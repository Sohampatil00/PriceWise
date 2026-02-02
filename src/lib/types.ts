export interface Product {
  id: string;
  name: string;
  category: string;
  cost: number;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  targetMargin: number;
  inventory: number;
  salesLast30d: number;
  imageUrl: string;
  imageHint?: string;
  description: string;
  isEssential?: boolean;
}

export interface CompetitorPrice {
  id: string;
  productId: string;
  competitor: 'Amazon' | 'Walmart' | 'BestBuy' | 'Target';
  price: number;
  lastUpdated: string;
}

export interface PriceHistory {
  id: string;
  productId: string;
  price: number;
  timestamp: string;
}

export interface Experiment {
  id: string;
  name: string;
  productId: string;
  status: "active" | "completed" | "draft";
  startDate: string;
  endDate: string;
  controlPrice: number;
  experimentPrice: number;
  controlRevenue: number;
  experimentRevenue: number;
  controlUnitsSold: number;
  experimentUnitsSold: number;
  summary?: string;
}

export interface Kpi {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  description: string;
}

export interface EmergencyEvent {
  id: string;
  name: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
}
