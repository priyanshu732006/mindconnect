
'use client';

import { useAuth } from '@/context/auth-provider';
import { Loader2 } from 'lucide-react';
import AppLayout from '../(app)/layout';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import AuthGuard from '@/components/auth-guard';
import { UserRole } from '@/lib/types';

export default function CounsellorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { counsellorType, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect ensures that on-campus counselors are not accessing external pages and vice-versa.
    if (!loading) {
      if (counsellorType === 'external' && !pathname.startsWith('/counsellor/external')) {
        router.replace('/counsellor/external/dashboard');
      } else if (counsellorType === 'on-campus' && pathname.startsWith('/counsellor/external')) {
        router.replace('/counsellor/dashboard');
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
  
  return (
    <AuthGuard role={UserRole.counsellor}>
        <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}
