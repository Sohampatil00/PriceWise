import { Header } from '@/components/layout/header';
import { products } from '@/lib/data';
import { ProductsTable } from '@/components/products/products-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Products">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <ProductsTable products={products} />
      </main>
    </div>
  );
}
