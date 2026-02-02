'use client';

import { useState } from 'react';
import { generateInitialPricingRules } from '@/ai/flows/generate-initial-pricing-rules';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface PricingRule {
    condition: string;
    action: string;
}

export function GenerateRules() {
  const [isLoading, setIsLoading] = useState(false);
  const [productDescription, setProductDescription] = useState('');
  const [rules, setRules] = useState<PricingRule[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!productDescription.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter a product description.',
      });
      return;
    }

    setIsLoading(true);
    setRules([]);
    try {
      const result = await generateInitialPricingRules({ productDescription });
      const parsedRules = JSON.parse(result.pricingRules);
      setRules(parsedRules);
    } catch (error) {
      console.error('Failed to generate pricing rules:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate AI rules. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Wand2 /> AI Rule Generation</CardTitle>
        <CardDescription>
          Generate initial pricing rules based on a product description.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="product-description">Product Description</Label>
          <Textarea
            id="product-description"
            placeholder="e.g., High-fidelity wireless headphones with noise-cancelling technology..."
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows={4}
          />
        </div>
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Rules
        </Button>
        {rules.length > 0 && (
          <div className="space-y-4 rounded-md border p-4">
            <h4 className="font-medium">Suggested Rules:</h4>
            <ul className="space-y-2 text-sm">
                {rules.map((rule, index) => (
                    <li key={index} className="flex flex-col rounded-md border bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="sm:w-1/2">
                            <p className="font-semibold text-muted-foreground">Condition</p>
                            <p className="font-mono">{rule.condition}</p>
                        </div>
                         <div className="mt-2 border-t pt-2 sm:mt-0 sm:w-1/2 sm:border-l sm:border-t-0 sm:pl-3">
                            <p className="font-semibold text-muted-foreground">Action</p>
                            <p>{rule.action}</p>
                        </div>
                    </li>
                ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
