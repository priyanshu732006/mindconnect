
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, MessagesSquare, BarChart2, Award } from "lucide-react";
import Link from "next/link";

export default function PeerBuddyDashboardPage() {

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Peer Buddy Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UserPlus /> Connection Requests</CardTitle>
                        <CardDescription>Review and accept requests from students seeking support.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild><Link href="/peer-buddy/requests">View Requests</Link></Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessagesSquare /> Community Forum</CardTitle>
                        <CardDescription>Participate in anonymous discussions to guide and support peers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild><Link href="/peer-buddy/community">Join Discussions</Link></Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart2 /> Well-being Trends</CardTitle>
                        <CardDescription>View aggregated, anonymized insights about student well-being.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild><Link href="/peer-buddy/trends">View Trends</Link></Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Award /> Certification</CardTitle>
                        <CardDescription>Track your progress and get certified by the college for your contributions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button className="w-full" asChild><Link href="/peer-buddy/certification">View Certification</Link></Button>
                    </CardContent>
                </Card>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle>Your Specializations</CardTitle>
                     <CardDescription>These are the areas students can seek your help for. You can update them in your profile.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-sm rounded-full bg-accent text-accent-foreground">Exam Stress</span>
                    <span className="px-3 py-1 text-sm rounded-full bg-accent text-accent-foreground">Anxiety</span>
                    <span className="px-3 py-1 text-sm rounded-full bg-accent text-accent-foreground">Study Pressure</span>
                </CardContent>
            </Card>

        </div>
    );
}
