
'use client';
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useApp } from "@/context/app-provider";

export default function AppRootPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                // User is logged in, but their role might still be loading.
                // The redirection logic is now handled in the login page for a better UX.
                // This page now acts as a fallback. If a logged-in user lands here,
                // we'll try to redirect them based on sessionStorage, or to landing.
                const targetRole = sessionStorage.getItem('userRole');
                if (targetRole) {
                    const targetCounsellorType = sessionStorage.getItem('counsellorType');
                    if (targetRole === 'counsellor' && targetCounsellorType === 'external') {
                        router.replace(`/counsellor/external/dashboard`);
                    } else {
                        router.replace(`/${targetRole}/dashboard`);
                    }
                } else {
                     router.replace('/landing');
                }
            } else {
                // If there's no user, redirect to the landing page
                router.replace('/landing');
            }
        }
    }, [user, loading, router]);
    
    // Show a loader while waiting for auth state and redirection.
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
}
