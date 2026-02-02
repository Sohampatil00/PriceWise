import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { products, competitors, getPriceHistory } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PriceHistoryChart } from '@/components/products/price-history-chart';
import { Separator } from '@/components/ui/separator';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const productCompetitors = competitors.filter((c) => c.product_id === product.id);
  const priceHistory = getPriceHistory(product.id, product.current_price);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title={product.name} />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">Price History</CardTitle>
                <CardDescription>Last 30 days of price adjustments.</CardDescription>
            </CardHeader>
            <CardContent>
                <PriceHistoryChart data={priceHistory} />
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
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productCompetitors.map((c) => (
                    <TableRow key={c.competitor}>
                      <TableCell className="font-medium">{c.competitor}</TableCell>
                      <TableCell>${c.price.toFixed(2)}</TableCell>
                      <TableCell>{new Date(c.last_updated).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative aspect-video w-full">
                        <Image src={product.imageUrl} alt={product.name} fill objectFit="cover" className="rounded-lg" data-ai-hint={product.imageHint} />
                    </div>
                     <div className="grid gap-2">
                        <div className="text-lg font-bold">{product.name}</div>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                     </div>
                    <Separator />
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="font-medium text-muted-foreground">Category</div>
                        <div><Badge variant="outline">{product.category}</Badge></div>

                        <div className="font-medium text-muted-foreground">Current Price</div>
                        <div className="font-bold">${product.current_price.toFixed(2)}</div>
                        
                        <div className="font-medium text-muted-foreground">Cost</div>
                        <div>${product.cost.toFixed(2)}</div>
                        
                        <div className="font-medium text-muted-foreground">Inventory</div>
                        <div>{product.inventory} units</div>

                        <div className="font-medium text-muted-foreground">Target Margin</div>
                        <div>{product.target_margin}%</div>

                         <div className="font-medium text-muted-foreground">Price Range</div>
                        <div>${product.min_price.toFixed(2)} - ${product.max_price.toFixed(2)}</div>
                     </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
