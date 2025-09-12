
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
            return;
        }

        if (!user) {
            router.push('/landing');
            return;
        }

        if (role) {
            router.push(`/${role}/dashboard`);
        }
        
    }, [user, role, loading, router]);
    
    const handleRoleSelect = (selectedRole: UserRole) => {
        setAuthRole(selectedRole);
        setNavItemsByRole(selectedRole);
        router.push(`/${selectedRole}/dashboard`);
    }

    if (loading || (user && role)) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }
    
    if (user && !role) {
         return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <Logo className="justify-center mb-4" />
                        <CardTitle>Select Your Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">Choose which dashboard you want to proceed to. You will only have to do this once.</p>
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

    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
}
