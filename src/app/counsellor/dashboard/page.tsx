
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, MessageSquare, Users, AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentActivity = [
    {
        icon: CheckCircle2,
        title: "Crisis Alert Resolved",
        description: "You resolved the crisis alert for Alex Martinez.",
        time: "about 1 hour ago",
        iconClass: "text-green-500"
    },
    {
        icon: MessageSquare,
        title: "Replied to a discussion",
        description: "You replied to the thread 'Feeling overwhelmed with finals'.",
        time: "about 2 hours ago",
        iconClass: "text-gray-500"
    },
    {
        icon: Calendar,
        title: "Appointment Accepted",
        description: "You accepted the appointment with John Smith.",
        time: "about 4 hours ago",
        iconClass: "text-blue-500"
    },
    {
        icon: FileText,
        title: "New Discussion Started",
        description: "You started a new discussion: 'How to deal with burnout?'",
        time: "about 8 hours ago",
        iconClass: "text-purple-500"
    },
]

export default function CounsellorDashboardPage() {
    const { user } = useAuth();
    const counsellorName = user?.displayName?.split(' ')[0] || 'Counsellor';

    // This page is now only for on-campus counsellors.
    // External counsellors are routed to /counsellor/external/dashboard

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Welcome back, {counsellorName}!
                </h1>
                <p className="text-muted-foreground mt-1">
                    Here's a quick overview of your activities.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                            Upcoming Appointments
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">7</div>
                        <p className="text-xs text-muted-foreground">in your schedule</p>
                    </CardContent>
                </Card>
                <Link href="/counsellor/crisis-alerts">
                    <Card className="border-destructive/50 hover:bg-destructive/10 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center justify-between text-destructive">
                                Active Crisis Alerts
                                <AlertTriangle className="h-4 w-4" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-destructive">3</div>
                            <p className="text-xs text-destructive/80">Immediate attention required</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div>
                <h2 className="text-xl font-semibold tracking-tight font-headline mb-4">Community Engagement</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Total Posts
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">4</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                Total Comments
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">8</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <div>
                 <h2 className="text-xl font-semibold tracking-tight font-headline mb-4">Recent Activity</h2>
                 <Card>
                     <CardContent className="p-0">
                         <div className="divide-y divide-border">
                            {recentActivity.map((activity, index) => {
                                const Icon = activity.icon;
                                return (
                                     <div key={index} className="flex items-center gap-4 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                            <Icon className={`h-5 w-5 ${activity.iconClass}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{activity.title}</p>
                                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                )
                            })}
                         </div>
                     </CardContent>
                 </Card>
            </div>

        </div>
    );
}
