

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, AlertTriangle, Heart, Info, TrendingUp } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';

const engagementData = [
  { day: 'Mon', rate: 58 },
  { day: 'Tue', rate: 62 },
  { day: 'Wed', rate: 75 },
  { day: 'Thu', rate: 70 },
  { day: 'Fri', rate: 81 },
  { day: 'Sat', rate: 85 },
  { day: 'Sun', rate: 88 },
];

const chartConfig = {
  rate: {
    label: "Engagement Rate",
    color: "hsl(var(--chart-1))",
  }
}

const crisisData = [
    { id: 'STU-8820', risk: 'High' },
    { id: 'STU-1234', risk: 'High' },
]

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8 p-4 md:p-8">
            <div>
                <p className="text-muted-foreground">Wellness University</p>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Admin Dashboard
                </h1>
            </div>

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
                        <Heart className="h-4 w-4 text-muted-foreground" />
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Crisis Monitoring</CardTitle>
                        <CardDescription>Real-time alerts for students in need of support.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="text-destructive" />
                                <div >
                                    <p className="font-semibold">High Risk</p>
                                    <p className="text-sm text-muted-foreground">2 students</p>
                                </div>
                            </div>
                            <TrendingUp className="text-destructive"/>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            {crisisData.map(c => (
                                <div key={c.id} className="flex items-center justify-between">
                                    <span>{c.id}</span>
                                    <span className="font-medium text-destructive">{c.risk}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Platform Engagement</CardTitle>
                        <CardDescription>Weekly average user engagement rate.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ChartContainer config={chartConfig} className="h-[200px] w-full">
                           <AreaChart data={engagementData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-rate)" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="var(--color-rate)" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8}/>
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[50, 100]}/>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Area type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={2} fillOpacity={1} fill="url(#colorEngagement)" />
                           </AreaChart>
                       </ChartContainer>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
