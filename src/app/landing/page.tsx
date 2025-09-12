
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import Link from 'next/link';
import { LiveUserCounter } from '@/components/live-user-counter';
import Image from 'next/image';
import { Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
              A Safe Space for Student Minds
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              The Student Wellness Hub is your comprehensive, AI-driven partner for mental health support. Start your journey towards a healthier mind today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/demo">Try a Demo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Register Now</Link>
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
                alt="Student Wellness Hub Dashboard"
                layout="fill"
                objectFit="cover"
                className="rounded-xl shadow-2xl"
                data-ai-hint="app dashboard"
             />
           </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Student Wellness Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
