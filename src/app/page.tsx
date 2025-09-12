
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

export default function AppRootPage() {
    const { user, role, loading, setRole: setAuthRole } = useAuth();
    const { setNavItemsByRole } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            return; // Wait until auth state is determined
        }

        if (!user) {
            router.push('/landing');
            return;
        }
        
        // If user is logged in and has a role, redirect to their dashboard
        if (role) {
            setNavItemsByRole(role);
            router.push(`/${role}/dashboard`);
        }
        
        // If user is logged in but has no role, the UI for role selection will be shown.

    }, [user, role, loading, router, setNavItemsByRole]);
    
    const handleRoleSelect = (selectedRole: UserRole) => {
        setAuthRole(selectedRole);
        // The useEffect will trigger the redirect once the role is set.
    }

    // This is the gatekeeper. It shows a loader while auth state is being determined.
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }
    
    // If auth is done, user is logged in, but no role is assigned yet.
    if (user && !role) {
         return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <Logo className="justify-center mb-4" />
                        <CardTitle>Welcome! Select Your Role</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">To continue to your dashboard, please select your role. You will only need to do this once.</p>
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
    
    // Fallback loader for any other transient states.
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
}
