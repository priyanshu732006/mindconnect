
'use client';
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useApp } from "@/context/app-provider";

export default function AppRootPage() {
    const { user, role, loading } = useAuth();
    const { setNavItemsByRole } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            return; // Wait until auth state is determined
        }

        if (user && role) {
            // If user and role are present, redirect to the correct dashboard
            setNavItemsByRole(role);
            router.push(`/${role}/dashboard`);
        } else if (!user) {
            // If there's no user, redirect to the landing page
            router.push('/landing');
        }
        // If there's a user but no role yet, we wait. 
        // The auth provider is likely still fetching it. The effect will re-run when `role` updates.
        
    }, [user, role, loading, router, setNavItemsByRole]);
    
    // Show a loader while waiting for redirection to happen.
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
}
