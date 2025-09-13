
'use client';

import { useAuth } from '@/context/auth-provider';
import { Loader2 } from 'lucide-react';
import AppLayout from '../(app)/layout';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
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
    // This effect ensures that as soon as the counsellorType is determined,
    // we are on the correct path.
    if (!loading && counsellorType === 'external') {
        // If we are an external counsellor but not on the external path, redirect.
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
  if (counsellorType === 'external' && pathname.startsWith('/counsellor/external')) {
    return <ExternalCounsellorLayout>{children}</ExternalCounsellorLayout>;
  }

  // For all other cases (e.g., on-campus counselor), use the default AppLayout.
  return <AppLayout>{children}</AppLayout>;
}
