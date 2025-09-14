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
import {
  Heart,
  Users,
  AlertTriangle,
  Stethoscope,
  Info,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const engagementData = [
  { day: 'Mon', rate: 58 },
  { day: 'Tue', rate: 72 },
  { day: 'Wed', rate: 65 },
  { day: 'Thu', rate: 80 },
  { day: 'Fri', rate: 78 },
  { day: 'Sat', rate: 85 },
  { day: 'Sun', rate: 92 },
];

const chartConfig = {
  rate: {
    label: 'Engagement Rate',
    color: 'hsl(var(--primary))',
  },
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-muted-foreground">Wellness University</p>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Admin Dashboard
        </h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
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
            <CardTitle className="text-sm font-medium">
              On-Campus Counselors
            </CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
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
            <CardDescription>
              Real-time alerts for students in need of support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-destructive" />
                    <div>
                      <p>High Risk</p>
                      <p className="text-xs text-muted-foreground">
                        2 students
                      </p>
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
            <CardDescription>
              Weekly average user engagement rate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="h-[200px] w-full"
            >
              <AreaChart
                data={engagementData}
                margin={{ left: -20, top: 10, right: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-rate)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-rate)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[50, 100]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Area
                  dataKey="rate"
                  type="natural"
                  fill="url(#colorRate)"
                  stroke="var(--color-rate)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
