
'use client';

import {
  AlertTriangle,
  Check,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const stats = [
  { title: 'New Requests', value: '4', description: 'Pending your review' },
  { title: 'Scheduled', value: '3', description: 'Upcoming appointments' },
  { title: 'Waitlisted', value: '6', description: 'Awaiting open slots' },
];

const requests = [
  {
    studentId: '#2345',
    university: 'Stanford University',
    time: 'about 2 hours ago',
    priority: 'High',
  },
  {
    studentId: '#6789',
    university: 'University of California, Berkeley',
    time: 'about 5 hours ago',
    priority: 'Medium',
  },
  {
    studentId: '#1122',
    university: 'Massachusetts Institute of Technology',
    time: '1 day ago',
    priority: 'Low',
  },
  {
    studentId: '#3344',
    university: 'New York University',
    time: '2 days ago',
    priority: 'High',
  },
];

const priorityStyles = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-gray-100 text-gray-700',
};

export default function ExternalCounsellorDashboard() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">External Counselor Dashboard</h1>
      </header>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className='pb-2'>
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">
                {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Incoming Requests</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {requests.map(request => (
                    <Card
                        key={request.studentId}
                        className="p-5"
                    >
                        <div className="flex items-start justify-between">
                        <div>
                            <p className="font-bold">
                            Student {request.studentId}
                            </p>
                            <p className="text-sm text-muted-foreground">{request.university}</p>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            priorityStyles[
                                request.priority as keyof typeof priorityStyles
                            ]
                            }`}
                        >
                            {request.priority}
                        </span>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Requested {request.time}</span>
                        </div>
                        <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
                        <Button variant="outline" size="sm">
                            <X className="h-4 w-4" />
                            Reject
                        </Button>
                        <Button variant="secondary" size="sm">
                            <Clock className="h-4 w-4" />
                            Waitlist
                        </Button>
                        <Button size="sm">
                            <Check className="h-4 w-4" />
                            Accept
                        </Button>
                        </div>
                    </Card>
                    ))}
                </CardContent>
            </Card>
        </div>

        <div>
            <Card className="bg-primary/10 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                    <span>Adaptive Scheduling Assistant</span>
                    <Sparkles className="h-5 w-5 text-primary" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <p className="font-semibold">Recommendation:</p>
                    <p>
                        Based on the <span className="font-bold">high urgency</span> and
                        your open slot this afternoon, it is recommended to{' '}
                        <span className="font-bold">
                        accept the request from Stanford University
                        </span>
                        .
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                        <Button size="sm" className="flex-1">
                            Accept Recommendation
                        </Button>
                        <Button size="sm" variant="ghost">
                            Dismiss
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
