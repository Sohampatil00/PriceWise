'use client';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PredictionsPage() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header title="Predictive Analytics" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Demand & Shortage Forecast</CardTitle>
                        <CardDescription>
                           AI-powered predictions to prevent stockouts and optimize pricing. This feature is under development.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Predictive charts and data on product demand and potential shortages will be displayed here.</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
