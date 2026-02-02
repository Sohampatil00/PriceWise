'use client';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Beaker, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SummarizeButton } from '@/components/experiments/summarize-button';
import { useCollection } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';
import type { Experiment, Product } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';

export default function ExperimentsPage() {
    const firestore = useFirestore();
    const experimentsQuery = useMemoFirebase(() => collection(firestore, 'experiments'), [firestore]);
    const { data: experiments, isLoading: isLoadingExperiments } = useCollection<Experiment>(experimentsQuery);

    const activeExperiments = experiments?.filter((e) => e.status === 'active') ?? [];
    const completedExperiments = experiments?.filter((e) => e.status === 'completed') ?? [];
    const draftExperiments = experiments?.filter((e) => e.status === 'draft') ?? [];

    const ExperimentCard = ({ exp }: { exp: Experiment }) => {
        const productRef = useMemoFirebase(() => doc(firestore, 'products', exp.productId), [firestore, exp.productId]);
        const { data: product, isLoading: isLoadingProduct } = useDoc<Product>(productRef);

        const statusConfig = {
            active: { icon: Clock, color: "bg-yellow-400/20 text-yellow-600 hover:bg-yellow-400/30", label: "Active" },
            completed: { icon: CheckCircle, color: "bg-green-400/20 text-green-600 hover:bg-green-400/30", label: "Completed" },
            draft: { icon: Beaker, color: "bg-gray-400/20 text-gray-600 hover:bg-gray-400/30", label: "Draft" },
        };
        const currentStatus = statusConfig[exp.status];
        
        if (isLoadingProduct) {
            return <Card>Loading product...</Card>
        }
        
        return (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="font-headline text-lg">{exp.name}</CardTitle>
                            <CardDescription>{product?.name}</CardDescription>
                        </div>
                        <Badge variant="outline" className={currentStatus.color}>
                            <currentStatus.icon className="mr-1 h-3 w-3" />
                            {currentStatus.label}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Period</span>
                        <span>{exp.startDate} to {exp.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Control Price</span>
                        <span>₹{exp.controlPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Experiment Price</span>
                        <span>₹{exp.experimentPrice.toFixed(2)}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    {exp.status === 'completed' && <SummarizeButton experiment={exp} />}
                    {exp.status !== 'completed' && <Button variant="outline" className="w-full">View Details</Button>}
                </CardFooter>
            </Card>
        );
    }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Experiments">
         <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Experiment
        </Button>
      </Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="active">
            <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                {isLoadingExperiments ? <p>Loading experiments...</p> : activeExperiments.map(exp => <ExperimentCard key={exp.id} exp={exp} />)}
            </TabsContent>
            <TabsContent value="completed" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                 {isLoadingExperiments ? <p>Loading experiments...</p> : completedExperiments.map(exp => <ExperimentCard key={exp.id} exp={exp} />)}
            </TabsContent>
            <TabsContent value="draft" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                 {isLoadingExperiments ? <p>Loading experiments...</p> : draftExperiments.map(exp => <ExperimentCard key={exp.id} exp={exp} />)}
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
