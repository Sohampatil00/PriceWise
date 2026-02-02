import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-pricing-rules.ts';
import '@/ai/flows/summarize-price-experiment-results.ts';
import '@/ai/flows/classify-essential-good.ts';
