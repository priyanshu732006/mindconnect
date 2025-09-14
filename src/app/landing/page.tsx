
'use client';

import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import Link from 'next/link';
import { LiveUserCounter } from '@/components/live-user-counter';
import Image from 'next/image';
import { useLocale } from '@/context/locale-provider';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function LandingPage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <LanguageSwitcher />
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
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight font-headline">Contact Us</CardTitle>
                    <CardDescription>Have questions? We'd love to hear from you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your Name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Your Email" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="How can we help you?" rows={5} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Send Message</Button>
                </CardFooter>
            </Card>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px.8 py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} दिव्यManas. {t.allRightsReserved}</p>
      </footer>
    </div>
  );
}
