'use client';
import { Header } from '@/components/layout/header';
import { ProductsTable } from '@/components/products/products-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';

export default function ProductsPage() {
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Products">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {isLoading && <p>Loading products...</p>}
        {products && <ProductsTable products={products} />}
      </main>
    </div>
  );
}
