
'use client';

import { useAuth } from '@/context/auth-provider';
import { Loader2 } from 'lucide-react';
import AppLayout from '../(app)/layout';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ExternalCounsellorLayout from './external/layout';

export default function CounsellorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { counsellorType, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect ensures that as soon as the counsellorType is determined,
    // we are on the correct path.
    if (!loading && counsellorType === 'external') {
        // If we are an external counsellor but not on the external path, redirect.
        if(!window.location.pathname.startsWith('/counsellor/external')) {
            router.replace('/counsellor/external/dashboard');
        }
    }
  }, [counsellorType, loading, router]);


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (counsellorType === 'external') {
    return <ExternalCounsellorLayout>{children}</ExternalCounsellorLayout>;
  }

  // Default to on-campus layout
  return <AppLayout>{children}</AppLayout>;
}
