
'use client';

import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children, role }: { children: React.ReactNode, role: UserRole }) {
  const { user, loading, role: userRole, setRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // We need to set the role for the AppProvider to correctly set the nav items
    // This should be done regardless of auth state
    setRole(role);
  }, [role, setRole]);

  useEffect(() => {
    if (loading) {
      return; // Wait for authentication to complete
    }

    if (!user) {
      router.push('/login');
      return;
    }

    if (userRole && userRole !== role) {
      // If a role is set but doesn't match, go to landing to re-route.
      router.push('/landing');
    }
    
  }, [user, userRole, loading, role, router]);

  // While loading, or if the user is not logged in, or the roles don't match yet, show a spinner.
  if (loading || !user || userRole !== role) {
    return (
        <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return <>{children}</>;
}
