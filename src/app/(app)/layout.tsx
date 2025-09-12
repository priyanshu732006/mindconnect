
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { LogOut, Menu } from 'lucide-react';

import Logo from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/auth-provider';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/app-provider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, role } = useAuth();
  const router = useRouter();
  const [isSheetOpen, setSheetOpen] = React.useState(false);
  const { navItems } = useApp();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const closeSheet = () => setSheetOpen(false);

  const NavLinks = ({
    className,
    itemClassName,
  }: {
    className?: string;
    itemClassName?: string;
  }) => (
    <nav
      className={cn('flex items-center gap-2', className)}
      aria-label="Main navigation"
    >
      {navItems.map(item => (
        <Button
          key={item.href}
          asChild
          variant={pathname === item.href ? 'secondary' : 'ghost'}
          onClick={closeSheet}
          className={cn('justify-start', itemClassName)}
          title={item.label}
        >
          <Link href={item.href}>
            <item.icon className="h-5 w-5" />
            <span className="md:hidden lg:inline">{item.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Logo />
              <NavLinks
                className="mt-8 flex-col items-stretch gap-2"
                itemClassName="text-base"
              />
            </SheetContent>
          </Sheet>
          <Logo />
        </div>

        {/* Center Section - Navigation */}
        <div className="hidden flex-1 justify-center md:flex">
          <div className="mx-auto">
            <NavLinks />
          </div>
        </div>

        {/* Right Section - User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    user?.photoURL ??
                    `https://picsum.photos/seed/${role}/100/100`
                  }
                  alt="User"
                  data-ai-hint={`${role} avatar`}
                />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.displayName ?? 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                 <p className="text-xs leading-none text-muted-foreground capitalize pt-1">
                  {role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-8">{children}</main>
    </div>
  );
}
