
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ShieldAlert, MessagesSquare, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-provider";


export default function CounsellorDashboardPage() {
    const { counsellorType } = useAuth();
    const isExternal = counsellorType === 'external';

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Counsellor Dashboard
                </h1>
                {counsellorType && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Role:</span>
                        <span className="font-semibold text-sm rounded-full px-3 py-1 bg-secondary text-secondary-foreground capitalize">
                            {counsellorType.replace('-', ' ')} Counsellor
                        </span>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CalendarCheck/> Appointments</CardTitle>
                        <CardDescription>View and manage your upcoming student sessions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild><Link href="/counsellor/appointments">Manage Appointments</Link></Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldAlert/> Crisis Alerts</CardTitle>
                        <CardDescription>Review and respond to students in immediate need.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" variant="destructive" asChild><Link href="/counsellor/crisis-alerts">View Active Alerts</Link></Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessagesSquare /> Community</CardTitle>
                        <CardDescription>Participate in anonymous, moderated discussions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild><Link href="/counsellor/community">Join Discussions</Link></Button>
                    </CardContent>
                </Card>
            </div>
            
            {isExternal && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Settings/> Fees & Discounts</CardTitle>
                        <CardDescription>Set your session fees and manage coin-based discounts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild><Link href="/counsellor/billing">Manage Billing</Link></Button>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}
