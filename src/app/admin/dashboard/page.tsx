'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  AlertCircle,
  CheckCircle,
  Users,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const peerImpactData = [
    { name: 'Buddy A', students: 12 },
    { name: 'Buddy B', students: 8 },
    { name: 'Buddy C', students: 5 },
    { name: 'Buddy D', students: 10 },
    { name: 'Buddy E', students: 3 },
    { name: 'Buddy F', students: 7 },
];

const counselorUtilizationData = [
    { name: 'Dr. Smith', bookings: 5 },
    { name: 'Dr. Jones', bookings: 15 },
    { name: 'Dr. Doe', bookings: 3 },
    { name: 'Dr. Ray', bookings: 8 },
];

const peerImpactChartConfig = {
    students: {
        label: 'Students',
        color: 'hsl(var(--chart-1))',
    },
};

const counselorUtilizationChartConfig = {
    bookings: {
        label: 'Bookings',
        color: 'hsl(var(--primary))',
    },
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
                <CardTitle>Risk Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="text-yellow-600" />
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
        </div>

        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Peer Buddy Impact</CardTitle>
                    <CardDescription>Number of students supported by each peer buddy.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={peerImpactChartConfig} className="h-[200px] w-full">
                        <BarChart data={peerImpactData} margin={{ left: -20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="students" fill="var(--color-students)" radius={4} />
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
                     <ChartContainer config={counselorUtilizationChartConfig} className="h-[200px] w-full">
                        <BarChart data={counselorUtilizationData} margin={{ left: -20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="bookings" fill="var(--color-bookings)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
