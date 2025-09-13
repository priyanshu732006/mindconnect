
'use client';

import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useApp } from '@/context/app-provider';

export default function AuthGuard({ children, role: requiredRole }: { children: React.ReactNode, role: UserRole }) {
  const { user, loading, role: userRole } = useAuth();
  const { setNavItemsByRole } = useApp();
  const router = useRouter();

  useEffect(() => {
    // This ensures the nav items are set correctly for the current section of the app.
    setNavItemsByRole(requiredRole);
  }, [requiredRole, setNavItemsByRole]);

  useEffect(() => {
    if (loading) {
      return; // Wait for authentication to complete
    }

    if (!user) {
      router.push('/login');
      return;
    }

    // After loading, if user has a role and it does NOT match, redirect them
    if (userRole && userRole !== requiredRole) {
      router.push(`/${userRole}/dashboard`);
    } else if (!userRole) {
      // If loading is done and there's still no role, it might be fetching.
      // We wait instead of redirecting immediately to /landing.
      // The onAuthStateChanged listener in AuthProvider will trigger a re-render when the role arrives.
    }
    
  }, [user, userRole, loading, requiredRole, router]);

  // While loading, or if conditions for rendering haven't been met, show a spinner.
  if (loading || !user || userRole !== requiredRole) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  // If all checks pass, render the children
  return <>{children}</>;
}
