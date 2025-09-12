
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BarChart2, AlertTriangle, UserCheck } from "lucide-react";
import Link from "next/link";


export default function AdminDashboardPage() {
    // Placeholder data
    const userCounts = { students: 1250, peers: 75, counsellors: 12 };
    const crisisAlerts = 3;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Admin Dashboard
            </h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCounts.students}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Peer Buddies</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCounts.peers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Counsellors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCounts.counsellors}</div>
                    </CardContent>
                </Card>
                <Card className="border-destructive/50 bg-destructive/10 text-destructive-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Crisis Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{crisisAlerts}</div>
                        <Link href="/admin/crisis-monitoring" className="text-xs underline">View Alerts</Link>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Manage all user roles and view their activities.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full" asChild><Link href="/admin/user-management">Go to User Management</Link></Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Institutional Reports</CardTitle>
                        <CardDescription>Access anonymous well-being trends and analytics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild><Link href="/admin/reports">View Reports</Link></Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
