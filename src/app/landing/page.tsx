
'use client';
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import Logo from "@/components/logo";
import { useApp } from "@/context/app-provider";

export default function LandingPage() {
    const { user, role, loading, setRole: setAuthRole } = useAuth();
    const { setNavItemsByRole } = useApp();
    const router = useRouter();

    const handleRoleSelect = (selectedRole: UserRole) => {
        setAuthRole(selectedRole); // Set the role in the auth context
        setNavItemsByRole(selectedRole); // Set the nav items in the app context
        router.push(`/${selectedRole}/dashboard`);
    }

    useEffect(() => {
        if (loading) {
            return; // Wait for auth state to be confirmed
        }

        if (!user) {
            router.push('/login');
            return;
        }

        // If a user is logged in and has a role, redirect them to their dashboard
        if (user && role) {
            router.push(`/${role}/dashboard`);
        }
        // If they are logged in but have no role, they will be shown the role selection UI.
        
    }, [user, role, loading, router]);


    // Show a loader while authentication is in progress or redirects are happening.
    if (loading || (user && role)) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }
    
    // If the user is logged in but has no role, show the role selection UI.
    if(user && !role){
         return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <Logo className="justify-center mb-4" />
                        <CardTitle>Select Your Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">Choose which dashboard you want to proceed to.</p>
                        <div className="flex flex-col gap-3">
                            <Button onClick={() => handleRoleSelect(UserRole.student)} size="lg">Student Dashboard <ArrowRight className="ml-2" /></Button>
                            <Button onClick={() => handleRoleSelect(UserRole.counsellor)} size="lg" variant="outline">Counsellor Dashboard <ArrowRight className="ml-2" /></Button>
                            <Button onClick={() => handleRoleSelect(UserRole['peer-buddy'])} size="lg" variant="outline">Peer Buddy Dashboard <ArrowRight className="ml-2" /></Button>
                            <Button onClick={() => handleRoleSelect(UserRole.admin)} size="lg" variant="outline">Admin Dashboard <ArrowRight className="ml-2" /></Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // This is the fallback state, usually when the user is logged out and about to be redirected.
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
}
