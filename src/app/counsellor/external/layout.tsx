
'use client';

import { useAuth } from '@/context/auth-provider';
import { externalCounsellorNavItems } from '@/lib/external-counsellor-nav';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth-guard';
import { UserRole } from '@/lib/types';
import { Loader2 } from 'lucide-react';

function ExternalCounsellorLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-50 text-gray-800">
      <aside className="flex w-64 flex-col bg-white p-6 shadow-md">
        <div className="mb-8 text-2xl font-bold">CounselorConnect</div>
        <nav className="flex-1">
          <ul>
            {externalCounsellorNavItems.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'mb-2 flex items-center gap-3 rounded-lg p-3 text-base font-medium text-gray-600 transition-colors hover:bg-gray-100',
                    {
                      'bg-green-100 text-green-800 hover:bg-green-100':
                        pathname === item.href,
                    }
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarFallback className="bg-gray-700 text-white">
                {user?.displayName?.charAt(0) ?? 'N'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{user?.displayName ?? 'Dr. Emily Carter'}</p>
              <p className="text-sm text-gray-500">Counselor</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard role={UserRole.counsellor}>
            <ExternalCounsellorLayout>{children}</ExternalCounsellorLayout>
        </AuthGuard>
    )
}
