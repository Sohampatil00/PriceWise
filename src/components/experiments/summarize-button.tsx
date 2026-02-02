'use client';

import { useState } from 'react';
import { summarizePriceExperimentResults } from '@/ai/flows/summarize-price-experiment-results';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, Lightbulb, TrendingUp, BarChart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Experiment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function SummarizeButton({ experiment }: { experiment: Experiment }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof summarizePriceExperimentResults>> | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizePriceExperimentResults(experiment);
      setSummary(result);
    } catch (error) {
      console.error('Failed to summarize experiment results:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate AI summary. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" onClick={handleSummarize}>
          <Wand2 className="mr-2 h-4 w-4" />
          Summarize with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <Wand2 /> AI Summary: {experiment.name}
          </DialogTitle>
          <DialogDescription>
            AI-powered analysis of the completed price experiment.
          </DialogDescription>
        </DialogHeader>
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Generating analysis...</p>
          </div>
        )}
        {summary && (
          <div className="grid gap-4 py-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-accent">
                        <Lightbulb /> Recommended Action
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold text-lg">{summary.recommendedAction}</p>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp /> Revenue Impact
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{summary.revenueImpact}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <BarChart /> Units Sold Impact
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{summary.unitsSoldImpact}</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="text-base">Detailed Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{summary.summary}</p>
                </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
