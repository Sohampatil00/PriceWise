export interface Product {
  id: string;
  name: string;
  category: string;
  cost: number;
  current_price: number;
  min_price: number;
  max_price: number;
  target_margin: number;
  inventory: number;
  sales_last_30d: number;
  imageUrl: string;
  imageHint: string;
  description: string;
}

export interface Competitor {
  product_id: string;
  competitor: 'Amazon' | 'Walmart' | 'BestBuy' | 'Target';
  price: number;
  last_updated: string;
}

export interface PriceHistory {
  date: string;
  price: number;
}

export interface Experiment {
  id: string;
  name: "Price Test" | "Demand Spike" | "Margin Push";
  product_id: string;
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
