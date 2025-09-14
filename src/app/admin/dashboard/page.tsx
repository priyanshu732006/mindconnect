
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
import { Info, CheckCircle, Users, AlertTriangle, X } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, AreaChart, Area } from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ResolveIssueDialog } from '@/components/admin/resolve-issue-dialog';
import { useLocale } from '@/context/locale-provider';

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

const initialOpenIssuesData = [
  {
    id: 'IS-002',
    raisedBy: 'Priya Sharma',
    raiserRole: 'Peer Buddy',
    raisedAgainst: 'Anika Verma',
    againstRole: 'Student',
    description: 'Student is showing signs of severe distress during chats.',
    status: 'Open',
  },
   {
    id: 'IS-003',
    raisedBy: 'Admin System',
    raiserRole: 'System',
    raisedAgainst: 'Rohan Joshi',
    againstRole: 'Peer Buddy',
    description: 'Peer buddy has not responded to 5 consecutive requests.',
    status: 'Open',
  },
];

const initialResolvedIssuesData = [
    {
        id: 'IS-001',
        raisedBy: 'Dr. Evans',
        raiserRole: 'Counselor',
        raisedAgainst: 'John Doe',
        againstRole: 'Student',
        description: 'Missed three consecutive counseling sessions without notice.',
        status: 'Resolved',
        resolution: 'Called the student and notified his parents.',
    }
]


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
  const [showOpenIssues, setShowOpenIssues] = useState(false);
  const [openIssuesData, setOpenIssuesData] = useState(initialOpenIssuesData);
  const [resolvedIssuesData, setResolvedIssuesData] = useState(initialResolvedIssuesData);
  const [isResolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<(typeof openIssuesData)[0] | null>(null);
  const { t } = useLocale();

  const handleOpenResolveDialog = (issue: (typeof openIssuesData)[0]) => {
    setSelectedIssue(issue);
    setResolveDialogOpen(true);
  }

  const handleIssueResolved = (issueId: string, resolution: string) => {
    const issueToResolve = openIssuesData.find(issue => issue.id === issueId);
    if(issueToResolve) {
        setResolvedIssuesData(prev => [{...issueToResolve, status: 'Resolved', resolution}, ...prev]);
    }
    setOpenIssuesData(prev => prev.filter(issue => issue.id !== issueId));
  }


  return (
    <div className="space-y-8">
      <ResolveIssueDialog 
        isOpen={isResolveDialogOpen}
        setIsOpen={setResolveDialogOpen}
        issue={selectedIssue}
        onIssueResolved={handleIssueResolved}
      />
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t.adminDashboard}
        </h1>
      </header>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.totalStudents}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">{t.fromLastMonth.replace('{value}', '+5.2%')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.peerBuddies}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">{t.sinceLastMonth.replace('{value}', '+2')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.onCampusCounselors}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">{t.unchanged}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setShowOpenIssues(!showOpenIssues)}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.openIssues}</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openIssuesData.length}</div>
            <p className="text-xs text-muted-foreground">{t.sinceYesterday.replace('{value}', '+1')}</p>
          </CardContent>
        </Card>
      </div>

        {showOpenIssues && (
            <Card className="animate-in fade-in-50">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t.openIssues}</CardTitle>
                        <CardDescription>{t.openIssuesDesc}</CardDescription>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => setShowOpenIssues(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.issueId}</TableHead>
                                <TableHead>{t.raisedBy}</TableHead>
                                <TableHead>{t.raiserRole}</TableHead>
                                <TableHead>{t.raisedAgainst}</TableHead>
                                <TableHead>{t.againstRole}</TableHead>
                                <TableHead>{t.description}</TableHead>
                                <TableHead>{t.status}</TableHead>
                                <TableHead className="text-right">{t.action}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {openIssuesData.map((issue) => (
                                <TableRow key={issue.id}>
                                    <TableCell className="font-mono">{issue.id}</TableCell>
                                    <TableCell className="font-medium text-primary">{issue.raisedBy}</TableCell>
                                    <TableCell>{issue.raiserRole}</TableCell>
                                    <TableCell className="font-medium text-primary">{issue.raisedAgainst}</TableCell>
                                    <TableCell>{issue.againstRole}</TableCell>
                                    <TableCell className="max-w-[250px]">{issue.description}</TableCell>
                                    <TableCell>
                                        <Badge variant="destructive">{t[issue.status.toLowerCase() as keyof typeof t] || issue.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => handleOpenResolveDialog(issue)}>{t.resolve}</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}
        
         {showOpenIssues && resolvedIssuesData.length > 0 && (
            <Card className="animate-in fade-in-50">
                <CardHeader>
                    <CardTitle>{t.resolvedIssues}</CardTitle>
                    <CardDescription>{t.resolvedIssuesDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.issueId}</TableHead>
                                <TableHead>{t.raisedBy}</TableHead>
                                <TableHead>{t.raiserRole}</TableHead>
                                <TableHead>{t.raisedAgainst}</TableHead>
                                <TableHead>{t.againstRole}</TableHead>
                                <TableHead>{t.description}</TableHead>
                                <TableHead>{t.status}</TableHead>
                                <TableHead>{t.resolution}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resolvedIssuesData.map((issue) => (
                                <TableRow key={issue.id}>
                                    <TableCell className="font-mono">{issue.id}</TableCell>
                                    <TableCell className="font-medium text-primary">{issue.raisedBy}</TableCell>
                                    <TableCell>{issue.raiserRole}</TableCell>
                                    <TableCell className="font-medium text-primary">{issue.raisedAgainst}</TableCell>
                                    <TableCell>{issue.againstRole}</TableCell>
                                    <TableCell className="max-w-[250px]">{issue.description}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-primary/10 text-primary">{t[issue.status.toLowerCase() as keyof typeof t] || issue.status}</Badge>
                                    </TableCell>
                                    <TableCell className="max-w-[250px]">{issue.resolution}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>{t.crisisMonitoring}</CardTitle>
                <CardDescription>{t.crisisMonitoringRealTimeDesc}</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={['item-1']}>
                    <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <div className="flex items-center gap-3">
                        <AlertTriangle className="text-destructive" />
                        <div>
                            <p>{t.highRisk}</p>
                            <p className="text-xs text-muted-foreground">{t.studentsCount.replace('{count}', '2')}</p>
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
                <CardTitle>{t.platformEngagement}</CardTitle>
                <CardDescription>{t.platformEngagementDesc}</CardDescription>
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
                <CardTitle>{t.peerBuddyImpact}</CardTitle>
                <CardDescription>{t.peerBuddyImpactDesc}</CardDescription>
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
                <CardTitle>{t.counselorUtilization}</CardTitle>
                <CardDescription>{t.counselorUtilizationDesc}</CardDescription>
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
