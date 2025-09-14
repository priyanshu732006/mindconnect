
'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  BarChart,
  TrendingUp,
  Users,
  MessageSquare,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/context/auth-provider';
import { useLocale } from '@/context/locale-provider';

// Placeholder data
const supportRequestData = [
  { month: 'Jan', requests: 65 },
  { month: 'Feb', requests: 59 },
  { month: 'Mar', requests: 80 },
  { month: 'Apr', requests: 81 },
  { month: 'May', requests: 56 },
  { month: 'Jun', requests: 55 },
  { month: 'Jul', requests: 40 },
];

const topConcernsData = [
  { name: 'Academics', value: 31, fill: 'hsl(var(--chart-1))' },
  { name: 'Anxiety', value: 22, fill: 'hsl(var(--chart-2))' },
  { name: 'Relationships', value: 20, fill: 'hsl(var(--chart-3))' },
  { name: 'Depression', value: 14, fill: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 13, fill: 'hsl(var(--chart-5))' },
];

const lineChartConfig = {
  requests: {
    label: 'Requests',
    color: 'hsl(140 60% 50%)',
  },
};

const pieChartConfig = {
  value: {
    label: 'Concerns',
  },
  Academics: {
    label: 'Academics',
    color: 'hsl(var(--chart-1))',
  },
  Anxiety: {
    label: 'Anxiety',
    color: 'hsl(var(--chart-2))',
  },
  Relationships: {
    label: 'Relationships',
    color: 'hsl(var(--chart-3))',
  },
  Depression: {
    label: 'Depression',
    color: 'hsl(var(--chart-4))',
  },
  Other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))',
  },
};

export default function PeerBuddyDashboardPage() {
  const { user } = useAuth();
  const { t } = useLocale();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t.peerBuddyDashboard}
        </h1>
         <p className="text-muted-foreground mt-1">
          {t.peerBuddyDashboardDesc}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-green-50/50 border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t.totalSupportRequests}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,281</div>
            <p className="text-xs text-muted-foreground">
              {t.fromLastMonth.replace('{value}', '+20.1%')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t.activePeerBuddies}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73</div>
            <p className="text-xs text-muted-foreground">
              {t.sinceLastMonth.replace('{value}', '+5')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.communityPosts}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">{t.thisMonth.replace('{value}', '+180')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.topConcern}</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t.academics}</div>
            <p className="text-xs text-muted-foreground">
              {t.topConcernDesc}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.supportRequestTrends}</CardTitle>
            <CardDescription>
              {t.supportRequestTrendsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig} className="h-[250px] w-full">
              <LineChart data={supportRequestData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Line
                  dataKey="requests"
                  type="monotone"
                  stroke="var(--color-requests)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: 'var(--color-requests)' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.topConcerns}</CardTitle>
            <CardDescription>
              {t.topConcernsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={pieChartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                  <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={topConcernsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          className="text-xs font-bold"
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {topConcernsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    verticalAlign="bottom"
                    align="center"
                    iconSize={8}
                    wrapperStyle={{ paddingTop: 20 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
