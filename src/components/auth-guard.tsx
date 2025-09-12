
'use client';

import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/types';

export default function AuthGuard({ children, role }: { children: React.ReactNode, role: UserRole }) {
  const { user, loading, role: userRole, setRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (userRole !== role) {
        // When the page role guard doesn't match the current user role,
        // redirect to the landing page to re-evaluate the correct dashboard.
        router.push('/landing');
      }
    }
  }, [user, loading, router, userRole, role]);

  useEffect(() => {
    // Set the role for the layout and other components
    setRole(role);
  }, [role, setRole]);

  if (loading || !user || userRole !== role) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
