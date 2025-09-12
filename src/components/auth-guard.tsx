
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

    if (userRole && userRole !== requiredRole) {
      router.push(`/${userRole}/dashboard`);
    } else if (!userRole) {
      router.push('/landing');
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

  return <>{children}</>;
}
