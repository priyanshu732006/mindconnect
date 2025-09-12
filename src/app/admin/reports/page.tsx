
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart, Users, Zap } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid } from 'recharts';

// Placeholder data
const wellbeingTrendData = [
  { month: 'Jan', averageScore: 78 },
  { month: 'Feb', averageScore: 72 },
  { month: 'Mar', averageScore: 68 },
  { month: 'Apr', averageScore: 75 },
  { month: 'May', averageScore: 81 },
  { month: 'Jun', averageScore: 79 },
];

const chartConfig = {
  averageScore: {
    label: 'Average Score',
    color: 'hsl(var(--chart-1))',
  },
};

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Institutional Reports
        </h1>
        <p className="text-muted-foreground mt-2">
          Anonymous analytics to identify well-being patterns and guide
          interventions.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Monthly Active Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1,050</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">82%</div>
                <p className="text-xs text-muted-foreground">Students using a feature weekly</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Crisis Alerts This Month</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-destructive">12</div>
                <p className="text-xs text-muted-foreground">-10% from last month</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Well-being Trend</CardTitle>
          <CardDescription>
            Monthly average well-being score across the institution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <RechartsBarChart data={wellbeingTrendData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis domain={[50, 100]} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="averageScore" fill="var(--color-averageScore)" radius={4} />
            </RechartsBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
