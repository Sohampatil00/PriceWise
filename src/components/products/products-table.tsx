'use client';
import Image from 'next/image';
import Link from 'next/link';
import { MoreHorizontal, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Product } from '@/lib/types';
import { deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { ClassifyEssentialButton } from './classify-essential-button';

export function ProductsTable({ products }: { products: Product[] }) {
  const firestore = useFirestore();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
        deleteDocumentNonBlocking(doc(firestore, 'products', id));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Product Catalog</CardTitle>
        <CardDescription>
          Manage your products and view their pricing details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Inventory</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={product.name}
                    className="aspect-square rounded-md object-cover"
                    data-ai-hint={product.imageHint}
                    height="64"
                    src={product.imageUrl}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">
                    <Link href={`/products/${product.id}`} className="hover:underline">
                        {product.name}
                    </Link>
                </TableCell>
                <TableCell>
                  {product.isEssential && (
                    <Badge variant="outline" className="bg-blue-400/20 text-blue-600 hover:bg-blue-400/30 border-blue-400/30">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Essential
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.inventory}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  ₹{product.currentPrice.toFixed(2)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/products/${product.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/products/${product.id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(product.id)}>Delete</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <ClassifyEssentialButton product={product} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{products.length > 0 ? 1 : 0}-{products.length}</strong> of <strong>{products.length}</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
