import { Header } from '@/components/layout/header';
import { kpis, revenueData, experiments } from '@/lib/data';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  const activeExperiments = experiments.filter(e => e.status === 'active');
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
              <RevenueChart data={revenueData} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-headline">Active Experiments</CardTitle>
              <CardDescription>Ongoing price optimization tests.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">End Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeExperiments.map((exp) => (
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
