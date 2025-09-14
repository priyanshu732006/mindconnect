
'use client';

import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import Link from 'next/link';
import { LiveUserCounter } from '@/components/live-user-counter';
import Image from 'next/image';
import { useLocale } from '@/context/locale-provider';

export default function LandingPage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">{t.login}</Link>
          </Button>
          <Button asChild>
            <Link href="/register">{t.register}</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
              {t.landingTitle}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              {t.landingSubtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/demo">{t.tryDemo}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">{t.registerNow}</Link>
              </Button>
            </div>
            <div className="mt-12 flex justify-center">
              <LiveUserCounter />
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
           <div className="relative w-full aspect-[2/1] max-w-5xl mx-auto">
             <Image 
                src="https://picsum.photos/seed/dashboardview/1200/600"
                alt="दिव्यManas Dashboard"
                layout="fill"
                objectFit="cover"
                className="rounded-xl shadow-2xl"
                data-ai-hint="app dashboard"
             />
           </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} दिव्यManas. {t.allRightsReserved}</p>
      </footer>
    </div>
  );
}
