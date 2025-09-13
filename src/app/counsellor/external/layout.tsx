
'use client';

import { useAuth } from '@/context/auth-provider';
import { externalCounsellorNavItems } from '@/lib/external-counsellor-nav';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth-guard';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

function ExternalCounsellorLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-gray-800">
       <aside className="flex w-64 flex-col border-r bg-white p-6">
        <Link href="/counsellor/external/dashboard" className="mb-8 text-2xl font-bold">
          CounselorConnect
        </Link>
        <nav className="flex flex-col gap-2">
          {externalCounsellorNavItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-green-50 hover:text-green-700',
                {
                  'bg-green-100 text-green-700 font-semibold':
                    pathname === item.href,
                }
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100">
                    <Avatar className="h-10 w-10 border-2 border-white">
                        <AvatarFallback className="bg-gray-700 text-white">
                            {user?.displayName?.charAt(0) ?? 'N'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{user?.displayName ?? 'Dr. Emily Carter'}</p>
                        <p className="text-sm text-gray-500">Counselor</p>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56 mb-2">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.displayName ?? 'Dr. Emily Carter'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Counselor
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}


export default function ExternalCounsellorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard role={UserRole.counsellor}>
      <ExternalCounsellorLayoutContent>
        {children}
      </ExternalCounsellorLayoutContent>
    </AuthGuard>
  );
}
