
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

        if (user) {
            // User is logged in, but role might still be loading from the hook.
            // Use sessionStorage as a faster, more reliable fallback for immediate redirection.
            const targetRole = role || sessionStorage.getItem('userRole');

            if(targetRole) {
                setNavItemsByRole(targetRole as any);
                router.push(`/${targetRole}/dashboard`);
            } else {
                // If role is still not found, it's an edge case.
                // Redirect to landing to prevent getting stuck.
                router.push('/landing');
            }
        } else {
            // If there's no user, redirect to the landing page
            router.push('/landing');
        }
        
    }, [user, role, loading, router, setNavItemsByRole]);
    
    // Show a loader while waiting for redirection to happen.
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
}
