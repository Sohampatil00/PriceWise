'use client';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CompetitorMapPage() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header title="Competitor Price Map" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Competitor Landscape</CardTitle>
                        <CardDescription>
                            Visualizing your prices against competitors like Amazon, Flipkart, and BigBasket. This feature is under development.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-muted-foreground py-12">
                            <p className="text-lg font-semibold">Coming Soon</p>
                            <p>A map visualization will be displayed here to compare your prices with competitors in different regions, highlighting opportunities for dynamic adjustments, especially during crisis events.</p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
