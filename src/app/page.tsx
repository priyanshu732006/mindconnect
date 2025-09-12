
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

        if (!user) {
            router.push('/landing');
            return;
        }
        
        // If user is logged in and has a role, redirect to their dashboard
        if (role) {
            setNavItemsByRole(role);
            router.push(`/${role}/dashboard`);
        } else {
            // This case should ideally not be hit for a logged-in user
            // as the role should be set upon login/registration.
            // As a fallback, we push them to the landing page to restart the flow.
            router.push('/landing');
        }
        
    }, [user, role, loading, router, setNavItemsByRole]);
    
    // Fallback loader for any transient states.
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
}
