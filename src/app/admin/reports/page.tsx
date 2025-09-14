
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
import { useLocale } from '@/context/locale-provider';

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
    const { t } = useLocale();
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t.institutionalReports}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t.institutionalReportsDesc}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t.monthlyActiveStudents}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1,050</div>
                <p className="text-xs text-muted-foreground">{t.fromLastMonth.replace('{value}', '+5%')}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t.engagementRate}</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">82%</div>
                <p className="text-xs text-muted-foreground">{t.engagementRateDesc}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t.crisisAlertsThisMonth}</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-destructive">12</div>
                <p className="text-xs text-muted-foreground">{t.fromLastMonth.replace('{value}', '-10%')}</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.overallWellbeingTrend}</CardTitle>
          <CardDescription>
            {t.overallWellbeingTrendDesc}
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
