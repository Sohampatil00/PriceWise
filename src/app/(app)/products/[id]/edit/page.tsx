'use client';

import { useRouter, notFound } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateDocumentNonBlocking } from '@/firebase';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useEffect } from 'react';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters long.'),
  category: z.string().min(2, 'Category is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  cost: z.coerce.number().positive(),
  currentPrice: z.coerce.number().positive(),
  minPrice: z.coerce.number().positive(),
  maxPrice: z.coerce.number().positive(),
  inventory: z.coerce.number().int().nonnegative(),
  targetMargin: z.coerce.number().min(0).max(100),
  salesLast30d: z.coerce.number().int().nonnegative(),
  imageUrl: z.string().url('Please enter a valid image URL.'),
  imageHint: z.string().optional(),
});

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const firestore = useFirestore();
  const { toast } = useToast();

  const productRef = useMemoFirebase(() => doc(firestore, 'products', id), [firestore, id]);
  const { data: product, isLoading: isLoadingProduct } = useDoc<Product>(productRef);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: product ?? {},
  });

  useEffect(() => {
    if (product) {
      form.reset(product);
    }
  }, [product, form]);

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    const productDocRef = doc(firestore, 'products', id);
    updateDocumentNonBlocking(productDocRef, values);

    toast({
      title: 'Product Updated',
      description: `"${values.name}" has been updated.`,
    });
    router.push('/products');
  };
  
  if (isLoadingProduct) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Edit Product" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="mx-auto w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="font-headline">Product Information</CardTitle>
            <CardDescription>Update the details for the product.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 'Aashirvaad Atta'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 'Groceries'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the product..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost (₹)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Price (₹)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Price (₹)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Price (₹)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="inventory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetMargin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Margin (%)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="salesLast30d"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Sales (Last 30d)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://picsum.photos/seed/..." {...field} />
                        </FormControl>
                         <FormDescription>Use picsum.photos for placeholder images.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="imageHint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Hint</FormLabel>
                        <FormControl>
                          <Input placeholder="Two keywords for AI to find an image (e.g. 'wheat flour')" {...field} />
                        </FormControl>
                         <FormDescription>This helps our AI find better images for your product later.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
