'use client';
import { Header } from '@/components/layout/header';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Experiment, Kpi, Product } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';
import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const experimentsQuery = useMemoFirebase(() => collection(firestore, 'experiments'), [firestore]);
  const { data: experiments, isLoading: isLoadingExperiments } = useCollection<Experiment>(experimentsQuery);

  const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  const activeExperiments = experiments?.filter(e => e.status === 'active') ?? [];

  const kpis: Kpi[] = useMemo(() => {
    if (!products) return [
      { title: "Total Revenue", value: "₹0", change: "0%", changeType: "neutral", description: "vs. last month" },
      { title: "Average Margin", value: "0%", change: "0%", changeType: "neutral", description: "vs. last month" },
      { title: "Active Experiments", value: "0", change: "0", changeType: "neutral", description: "vs. last week" },
      { title: "Price Adjustments", value: "0", change: "0%", changeType: "neutral", description: "in last 24h" }
    ];

    const totalRevenue = products.reduce((acc, product) => acc + (product.salesLast30d * product.currentPrice), 0);
    const avgMargin = products.length > 0
      ? products.reduce((acc, product) => acc + ((product.currentPrice - product.cost) / product.currentPrice) * 100, 0) / products.length
      : 0;

    return [
      {
        title: "Total Revenue",
        value: `₹${(totalRevenue / 1000).toFixed(1)}k`, // Simple formatting
        change: "0%", // No history yet
        changeType: "neutral",
        description: "calculated from 30d sales"
      },
      {
        title: "Average Margin",
        value: `${avgMargin.toFixed(1)}%`,
        change: "0%",
        changeType: "neutral",
        description: "across all products"
      },
      {
        title: "Active Experiments",
        value: activeExperiments.length.toString(),
        change: "0",
        changeType: "neutral",
        description: "currently running"
      },
      {
        title: "Price Adjustments",
        value: "0", // Not tracked yet
        change: "0%",
        changeType: "neutral",
        description: "in last 24h"
      }
    ];
  }, [products, activeExperiments.length]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {user && (
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <img
                src={user.imageUrl}
                alt="Profile"
                className="h-16 w-16 rounded-full border-2 border-primary/20"
              />
              <div className="flex flex-col">
                <CardTitle className="text-2xl font-headline">Welcome back, {user.fullName || user.firstName}!</CardTitle>
                <CardDescription className="text-base">{user.primaryEmailAddress?.emailAddress}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="font-headline">Revenue Performance</CardTitle>
              <CardDescription>Optimized vs. Baseline Revenue</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {/* Empty chart data for now as requested */}
              <RevenueChart data={[]} />
              <p className="text-center text-sm text-muted-foreground mt-4">
                No revenue data available yet. Add products and track sales to see performance.
              </p>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-headline">Active Experiments</CardTitle>
              <CardDescription>Ongoing price optimization tests.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingExperiments ? <p>Loading experiments...</p> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">End Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeExperiments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                          No active experiments
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeExperiments.map((exp) => (
                        <TableRow key={exp.id}>
                          <TableCell className="font-medium">{exp.name}</TableCell>
                          <TableCell>
                            <Badge variant={'outline'} className="bg-yellow-400/20 text-yellow-600 hover:bg-yellow-400/30">
                              <Clock className="mr-1 h-3 w-3" />
                              {exp.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{exp.endDate}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
