
import { WellbeingScore } from '@/components/dashboard/wellbeing-score';
import { CrisisAlert } from '@/components/dashboard/crisis-alert';
import { TrustedContacts } from '@/components/dashboard/trusted-contacts';
import { QuickLinks } from '@/components/dashboard/quick-links';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Droplet, GitBranch, Smile, Sunrise } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">
        Student Dashboard
      </h1>
      <CrisisAlert />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <WellbeingScore />
        </div>
        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Daily Check-in</CardTitle>
                    <CardDescription>How are you feeling today?</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-around mb-4">
                        <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full text-2xl">😊</Button>
                        <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full text-2xl">🙂</Button>
                        <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full text-2xl">😐</Button>
                        <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full text-2xl">😕</Button>
                        <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full text-2xl">😢</Button>
                    </div>
                    <Textarea placeholder="What's on your mind? (Optional)" />
                    <Button className="w-full mt-4">Submit</Button>
                </CardContent>
            </Card>
          <TrustedContacts />
        </div>
      </div>
      
       <Card>
            <CardHeader>
                <CardTitle>Track Your Lifestyle</CardTitle>
                <CardDescription>Log your daily habits to see how they impact your well-being.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Placeholder for lifestyle tracking components */}
                 <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50"><Sunrise className="text-primary" /> Sleep Hours</div>
                 <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50"><Activity className="text-primary" /> Activity Level</div>
                 <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50"><Droplet className="text-primary" /> Water Intake</div>
                 <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50"><Smile className="text-primary" /> Social Interaction</div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Mental Health Assessments</CardTitle>
                <CardDescription>Take standard questionnaires to gain more insight into your mental state.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline">PHQ-9 (Depression)</Button>
                <Button variant="outline">GAD-7 (Anxiety)</Button>
                <Button variant="outline">GHQ (General Health)</Button>
            </CardContent>
        </Card>
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Explore
        </h2>
        <QuickLinks />
      </div>
    </div>
  );
}
