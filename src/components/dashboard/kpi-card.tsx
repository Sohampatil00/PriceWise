import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Kpi } from '@/lib/types';

export function KpiCard({ title, value, change, changeType, description }: Kpi) {
  const isIncrease = changeType === 'increase';
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {isIncrease ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={isIncrease ? 'text-green-500' : 'text-red-500'}>{change}</span>
          {' '}{description}
        </p>
      </CardContent>
    </Card>
  );
}
