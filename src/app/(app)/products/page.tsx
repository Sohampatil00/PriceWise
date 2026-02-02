'use client';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { ProductsTable } from '@/components/products/products-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Database } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ProductsPage() {
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Products">
        <Link href="/products/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {isLoading && <p>Loading products...</p>}
        {!isLoading && products && products.length > 0 && <ProductsTable products={products} />}
        {!isLoading && products?.length === 0 && (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="font-headline">Your product catalog is empty</CardTitle>
              <CardDescription>
                Get started by adding your first product or by populating your database with sample data.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="flex gap-4">
                <Link href="/products/new">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add First Product
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
