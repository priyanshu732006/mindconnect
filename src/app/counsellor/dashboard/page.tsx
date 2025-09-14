
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, MessageSquare, Users, AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocale } from "@/context/locale-provider";

const recentActivity = [
    {
        icon: CheckCircle2,
        title: "Crisis Alert Resolved",
        description: "You resolved the crisis alert for Alex Martinez.",
        time: "about 1 hour ago",
        iconClass: "text-green-500",
        titleKey: "crisisAlertResolved",
        descKey: "crisisAlertResolvedDesc"
    },
    {
        icon: MessageSquare,
        title: "Replied to a discussion",
        description: "You replied to the thread 'Feeling overwhelmed with finals'.",
        time: "about 2 hours ago",
        iconClass: "text-gray-500",
        titleKey: "repliedToDiscussion",
        descKey: "repliedToDiscussionDesc"
    },
    {
        icon: Calendar,
        title: "Appointment Accepted",
        description: "You accepted the appointment with John Smith.",
        time: "about 4 hours ago",
        iconClass: "text-blue-500",
        titleKey: "appointmentAccepted",
        descKey: "appointmentAcceptedDesc"
    },
    {
        icon: FileText,
        title: "New Discussion Started",
        description: "You started a new discussion: 'How to deal with burnout?'",
        time: "about 8 hours ago",
        iconClass: "text-purple-500",
        titleKey: "newDiscussionStarted",
        descKey: "newDiscussionStartedDesc"
    },
]

export default function CounsellorDashboardPage() {
    const { user } = useAuth();
    const { t } = useLocale();
    const counsellorName = user?.displayName?.split(' ')[0] || t.counsellor;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    {t.welcomeBack.replace('{name}', counsellorName)}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {t.counsellorDashboardDesc}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                            {t.upcomingAppointments}
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">7</div>
                        <p className="text-xs text-muted-foreground">{t.inYourSchedule}</p>
                    </CardContent>
                </Card>
                <Link href="/counsellor/crisis-alerts">
                    <Card className="border-destructive/50 hover:bg-destructive/10 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center justify-between text-destructive">
                                {t.activeCrisisAlerts}
                                <AlertTriangle className="h-4 w-4" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-destructive">3</div>
                            <p className="text-xs text-destructive/80">{t.immediateAttentionRequired}</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div>
                <h2 className="text-xl font-semibold tracking-tight font-headline mb-4">{t.communityEngagement}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                {t.totalPosts}
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
                                {t.totalComments}
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
                 <h2 className="text-xl font-semibold tracking-tight font-headline mb-4">{t.recentActivity}</h2>
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
                                            <p className="font-medium">{t[activity.titleKey as keyof typeof t] || activity.title}</p>
                                            <p className="text-sm text-muted-foreground">{activity.description.includes('Alex Martinez') ? t.crisisAlertResolvedDesc.replace('{studentName}', 'Alex Martinez') : activity.description.includes('John Smith') ? t.appointmentAcceptedDesc.replace('{studentName}', 'John Smith') : t[activity.descKey as keyof typeof t] || activity.description}</p>
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
