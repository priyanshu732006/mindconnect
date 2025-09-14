
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
import { Info, CheckCircle, Users, AlertTriangle } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, AreaChart, Area } from 'recharts';

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

const engagementData = [
  { day: 'Mon', rate: 58 },
  { day: 'Tue', rate: 62 },
  { day: 'Wed', rate: 71 },
  { day: 'Thu', rate: 75 },
  { day: 'Fri', rate: 72 },
  { day: 'Sat', rate: 80 },
  { day: 'Sun', rate: 85 },
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

const engagementChartConfig = {
  rate: {
    label: 'Engagement Rate',
    color: 'hsl(262, 85%, 60%)',
  },
};


export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Admin Dashboard
        </h1>
      </header>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Peer Buddies</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On-Campus Counselors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Unchanged</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 since yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Crisis Monitoring</CardTitle>
                <CardDescription>Real-time alerts for students in need of support.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={['item-1']}>
                    <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <div className="flex items-center gap-3">
                        <AlertTriangle className="text-destructive" />
                        <div>
                            <p>High Risk</p>
                            <p className="text-xs text-muted-foreground">2 students</p>
                        </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-10">
                        <p className="font-mono text-sm">STU-8820</p>
                        <p className="font-mono text-sm">STU-5926</p>
                    </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Platform Engagement</CardTitle>
                <CardDescription>Weekly average user engagement rate.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={engagementChartConfig} className="h-[250px] w-full">
                     <AreaChart
                        data={engagementData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
                        >
                        <defs>
                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-rate)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-rate)" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tick={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="rate" stroke="var(--color-rate)" fillOpacity={1} fill="url(#colorRate)" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
      
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
