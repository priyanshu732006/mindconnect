
'use client';

import { useAuth } from '@/context/auth-provider';
import { Loader2 } from 'lucide-react';
import AppLayout from '../(app)/layout';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import AuthGuard from '@/components/auth-guard';
import { UserRole } from '@/lib/types';
import ExternalCounsellorLayout from './external/layout';

export default function CounsellorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { counsellorType, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && counsellorType === 'external') {
        if(!pathname.startsWith('/counsellor/external')) {
            router.replace('/counsellor/external/dashboard');
        }
    }
  }, [counsellorType, loading, router, pathname]);


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If the user is an external counselor AND is on an external page, use the dedicated layout.
  if (counsellorType === 'external') {
    // AuthGuard is now inside ExternalCounsellorLayout
    return <>{children}</>;
  }
  
  // For all other cases (e.g., on-campus counselor), use the default AppLayout.
  return (
    <AuthGuard role={UserRole.counsellor}>
        <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}
