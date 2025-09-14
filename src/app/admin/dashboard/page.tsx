
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Info, CheckCircle, Users } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const peerImpactData = [
    { buddy: 'Rohan J.', students: 45 },
    { buddy: 'Priya S.', students: 28 },
    { buddy: 'Anika M.', students: 22 },
    { buddy: 'Karan P.', students: 18 },
    { buddy: 'Sneha R.', students: 15 },
    { buddy: 'Arjun K.', students: 10 },
];

const counselorUtilizationData = [
    { counselor: 'Dr. Singh', bookings: 35 },
    { counselor: 'Dr. Reddy', bookings: 25 },
    { counselor: 'Dr. Mehta', bookings: 48 },
    { counselor: 'Dr. Gupta', bookings: 12 },
    { counselor: 'Dr. Kumar', bookings: 30 },
];

const peerImpactChartConfig = {
  students: {
    label: 'Students Supported',
    color: 'hsl(195, 74%, 62%)',
  },
};

const counselorUtilChartConfig = {
    bookings: {
        label: 'Bookings',
        color: 'hsl(262, 85%, 60%)',
    },
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h1>
      </header>

      <Card>
        <CardContent className="p-6">
          <Accordion type="multiple" defaultValue={['item-1']}>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Info className="text-yellow-600" />
                  <div>
                    <p>Medium Risk</p>
                    <p className="text-xs text-muted-foreground">1 student</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-10">
                <p className="font-mono text-sm">STU-5926</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" />
                  <div>
                    <p>Resolved Risk</p>
                    <p className="text-xs text-muted-foreground">1 student</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-10">
                 <p className="font-mono text-sm">STU-8820</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Peer Buddy Impact</CardTitle>
                <CardDescription>Number of students supported by each peer buddy.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={peerImpactChartConfig} className="h-[250px] w-full">
                    <BarChart data={peerImpactData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                        <XAxis dataKey="buddy" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar dataKey="students" fill="var(--color-students)" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Counselor Utilization</CardTitle>
                <CardDescription>Student bookings and attendance for each counselor.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={counselorUtilChartConfig} className="h-[250px] w-full">
                    <BarChart data={counselorUtilizationData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                        <XAxis dataKey="counselor" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar dataKey="bookings" fill="var(--color-bookings)" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
