'use client';
import { use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PriceHistoryChart } from '@/components/products/price-history-chart';
import { Separator } from '@/components/ui/separator';
import { useDoc, useCollection, useFirestore } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Product, CompetitorPrice, PriceHistory } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = use(params as any);
  const firestore = useFirestore();

  const productRef = useMemoFirebase(() => doc(firestore, 'products', id), [firestore, id]);
  const { data: product, isLoading: isProductLoading } = useDoc<Product>(productRef);

  const competitorsQuery = useMemoFirebase(() => product ? collection(firestore, 'products', id, 'competitorPrices') : null, [product, firestore, id]);
  const { data: productCompetitors, isLoading: areCompetitorsLoading } = useCollection<CompetitorPrice>(competitorsQuery);

  const priceHistoryQuery = useMemoFirebase(() => product ? collection(firestore, 'products', id, 'priceHistory') : null, [product, firestore, id]);
  const { data: priceHistory, isLoading: isHistoryLoading } = useCollection<PriceHistory>(priceHistoryQuery);

  if (isProductLoading || areCompetitorsLoading || isHistoryLoading) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center">
            <p>Loading product details...</p>
        </div>
    );
  }

  if (!product) {
    notFound();
  }

  const formattedPriceHistory = priceHistory?.map(h => ({ date: new Date(h.timestamp).toISOString().split('T')[0], price: h.price })) ?? [];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title={product.name} />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-5">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
           <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                        <Image src={product.imageUrl} alt={product.name} fill objectFit="cover" data-ai-hint={product.imageHint} />
                    </div>
                     <div className="grid gap-2">
                        <div className="text-xl font-bold">{product.name}</div>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                     </div>
                    <Separator />
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="col-span-2 font-medium text-muted-foreground">Current Price</div>
                        <div className="col-span-2 text-3xl font-bold text-primary">₹{product.currentPrice.toFixed(2)}</div>
                        
                        <div className="font-medium text-muted-foreground">Category</div>
                        <div><Badge variant="outline">{product.category}</Badge></div>

                        <div className="font-medium text-muted-foreground">Cost</div>
                        <div>₹{product.cost.toFixed(2)}</div>
                        
                        <div className="font-medium text-muted-foreground">Inventory</div>
                        <div>{product.inventory} units</div>

                        <div className="font-medium text-muted-foreground">Target Margin</div>
                        <div>{product.targetMargin}%</div>

                         <div className="font-medium text-muted-foreground">Price Range</div>
                        <div>₹{product.minPrice.toFixed(2)} - ₹{product.maxPrice.toFixed(2)}</div>
                     </div>
                </CardContent>
            </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
           <Card>
            <CardHeader>
                <CardTitle className="font-headline">Price History</CardTitle>
                <CardDescription>Last 30 days of price adjustments.</CardDescription>
            </CardHeader>
            <CardContent>
                <PriceHistoryChart data={formattedPriceHistory} />
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
                <CardTitle className="font-headline">Competitor Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Competitor</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productCompetitors?.map((c) => {
                    const priceDiff = product.currentPrice - c.price;
                    const diffColor = priceDiff > 0 ? 'text-green-600' : priceDiff < 0 ? 'text-red-500' : 'text-muted-foreground';
                    const diffSign = priceDiff > 0 ? '+' : '';

                    return (
                        <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.competitor}</TableCell>
                        <TableCell>₹{c.price.toFixed(2)}</TableCell>
                        <TableCell className={`text-right font-medium ${diffColor}`}>
                            {diffSign}₹{priceDiff.toFixed(2)}
                        </TableCell>
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
