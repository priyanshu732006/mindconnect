
'use client';

import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useApp } from '@/context/app-provider';

export default function AuthGuard({ children, role }: { children: React.ReactNode, role: UserRole }) {
  const { user, loading, role: userRole } = useAuth();
  const { setNavItemsByRole } = useApp();
  const router = useRouter();

  useEffect(() => {
    // This ensures the nav items are set correctly for the current section of the app.
    setNavItemsByRole(role);
  }, [role, setNavItemsByRole]);

  useEffect(() => {
    if (loading) {
      return; // Wait for authentication to complete
    }

    if (!user) {
      router.push('/login');
      return;
    }

    if (userRole && userRole !== role) {
      // If a role is set but doesn't match the page's required role, go to the landing page.
      // The landing page will then redirect them to their correct dashboard.
      router.push('/landing');
    }
    
  }, [user, userRole, loading, role, router]);

  // While loading, or if the user is not logged in, or if the roles don't match yet, show a spinner.
  if (loading || !user || userRole !== role) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return <>{children}</>;
}
