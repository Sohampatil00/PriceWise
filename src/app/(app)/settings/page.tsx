import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { GenerateRules } from '@/components/settings/generate-rules';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Settings" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Pricing Rules</CardTitle>
                <CardDescription>
                  Set global constraints and rules for the optimization engine.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="min-margin" className="flex flex-col space-y-1">
                    <span>Minimum Profit Margin</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Ensure prices never drop below this profit margin percentage.
                    </span>
                  </Label>
                  <div className="relative w-24">
                    <Input id="min-margin" type="number" defaultValue="15" />
                    <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">%</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="match-competitor" className="flex flex-col space-y-1">
                    <span>Auto-match Competitors</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Automatically adjust prices to match or beat competitors.
                    </span>
                  </Label>
                  <Switch id="match-competitor" defaultChecked />
                </div>
                <Separator />
                 <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="clearance-days" className="flex flex-col space-y-1">
                    <span>Clearance Pricing Trigger</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Days in stock before clearance pricing is activated.
                    </span>
                  </Label>
                  <Input id="clearance-days" className="w-24" type="number" defaultValue="60" />
                </div>
              </CardContent>
            </Card>

            <GenerateRules />
          </div>
        </div>
      </main>
    </div>
  );
}
