'use client';

import { useState } from 'react';
import { ShieldQuestion, Loader2 } from 'lucide-react';
import { classifyEssentialGood } from '@/ai/flows/classify-essential-good';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function ClassifyEssentialButton({ product }: { product: Product }) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const firestore = useFirestore();

    const handleClassify = async () => {
        setIsLoading(true);
        try {
            const result = await classifyEssentialGood({
                productName: product.name,
                productDescription: product.description,
            });

            const productRef = doc(firestore, 'products', product.id);
            await setDoc(productRef, { isEssential: result.isEssential }, { merge: true });

            toast({
                title: "Classification Complete",
                description: `Product "${product.name}" has been classified as ${result.isEssential ? 'Essential' : 'Non-Essential'}.`,
            });
        } catch (error) {
            console.error('Failed to classify product:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to classify product with AI. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenuItem onClick={handleClassify} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <ShieldQuestion className="mr-2 h-4 w-4" />
            )}
            <span>Classify Essential</span>
        </DropdownMenuItem>
    );
}
