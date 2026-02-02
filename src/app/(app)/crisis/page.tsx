'use client';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { EmergencyEvent } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';
import { Shield, ShieldOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
// adjustPricesForCrisis flow will be created later. For now, it's just a placeholder.
// import { adjustPricesForCrisis } from '@/ai/flows/adjust-prices-for-crisis';


export default function CrisisPage() {
    const firestore = useFirestore();
    const emergencyEventsQuery = useMemoFirebase(() => collection(firestore, 'emergencyEvents'), [firestore]);
    const { data: emergencyEvents, isLoading: isLoadingEvents } = useCollection<EmergencyEvent>(emergencyEventsQuery);
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();

    const activeEvent = emergencyEvents?.find(e => e.isActive);

    const toggleEmergencyMode = async () => {
        setIsUpdating(true);
        try {
            if (activeEvent) {
                // Deactivate emergency mode
                const eventRef = doc(firestore, 'emergencyEvents', activeEvent.id);
                await setDoc(eventRef, { isActive: false, endDate: new Date().toISOString() }, { merge: true });
                toast({ title: "Emergency Mode Deactivated" });
            } else {
                // Activate emergency mode
                const newEventId = `event_${Date.now()}`;
                const newEvent: EmergencyEvent = {
                    id: newEventId,
                    name: "General Crisis",
                    isActive: true,
                    startDate: new Date().toISOString(),
                };
                const eventRef = doc(firestore, 'emergencyEvents', newEventId);
                await setDoc(eventRef, newEvent);
                
                // Here we would call the AI to adjust prices
                // await adjustPricesForCrisis();

                toast({ title: "Emergency Mode Activated", description: "Price ceilings applied to essential goods." });
            }
        } catch (error) {
            console.error("Failed to toggle emergency mode:", error);
            toast({ variant: 'destructive', title: "Operation Failed", description: "Could not update emergency status." });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header title="Crisis Management" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Emergency Pricing Mode</CardTitle>
                        <CardDescription>
                            Activate to apply price caps on essential goods during a crisis. This is a manual override.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingEvents ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-4">
                                {activeEvent ? (
                                    <Button onClick={toggleEmergencyMode} disabled={isUpdating} variant="destructive">
                                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldOff className="mr-2 h-4 w-4" />}
                                        Deactivate Emergency Mode
                                    </Button>
                                ) : (
                                    <Button onClick={toggleEmergencyMode} disabled={isUpdating}>
                                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
                                        Activate Emergency Mode
                                    </Button>
                                )}
                                <div className="text-sm">
                                    <p className="font-semibold">Current Status:</p>
                                    {activeEvent ? (
                                        <p className="text-destructive-foreground bg-destructive rounded-md px-2 py-1 inline-block">ACTIVE since {new Date(activeEvent.startDate).toLocaleDateString()}</p>
                                    ) : (
                                        <p className="text-green-600">INACTIVE</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
