
'use client';

import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import Link from 'next/link';
import { useLocale } from '@/context/locale-provider';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

const AIContactIcon = () => (
    <div className="relative w-10 h-10">
        <div className="absolute w-2 h-2 bg-primary rounded-full top-3 left-2 animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute w-2 h-2 bg-primary rounded-full top-3 left-2" style={{ animationDelay: '0s' }}></div>
        <div className="absolute w-2 h-2 bg-primary rounded-full top-3 right-2 animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute w-2 h-2 bg-primary rounded-full top-3 right-2" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute w-2 h-2 bg-primary rounded-full top-5 left-1/2 -translate-x-1/2 animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-2 h-2 bg-primary rounded-full top-5 left-1/2 -translate-x-1/2" style={{ animationDelay: '1s' }}></div>
    </div>
);


export default function LandingPage() {
  const { t } = useLocale();
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowContactForm(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const contactForm = document.getElementById('contact-form-container');
    if (contactForm) {
      observer.observe(contactForm);
    }

    return () => {
      if (contactForm) {
        observer.unobserve(contactForm);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between z-20">
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
        <section className="relative w-full h-[60vh] flex flex-col items-center justify-center p-8 overflow-hidden text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-foreground">
                {t.landingTitle}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
                {t.landingSubtitleShort}
            </p>
            <div className="flex flex-wrap justify-center space-x-4 mt-8">
                <Link href="/demo" className="bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 inline-block">
                   {t.tryDemo}
                </Link>
                 <Link href="/register" className="bg-secondary text-secondary-foreground font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 inline-block">
                   {t.registerNow}
                </Link>
            </div>
        </section>

        <section id="contact-form-container" className={`py-16 transition-opacity duration-1000 ${showContactForm ? 'opacity-100' : 'opacity-0'}`}>
             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold tracking-tight font-headline">{t.contactUs}</CardTitle>
                        <CardDescription>{t.contactUsDesc}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t.name}</Label>
                                <Input id="name" placeholder={t.yourName} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t.email}</Label>
                                <Input id="email" type="email" placeholder={t.yourEmail} />
                            </div>
                        </div>
                        <div className="relative space-y-2">
                            <Label htmlFor="message">{t.message}</Label>
                            <Textarea id="message" placeholder={t.howCanWeHelp} rows={5} className="w-full pr-12" />
                             <div className="absolute bottom-3 right-3">
                                <AIContactIcon />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">
                          {t.sendMessage}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm z-10">
        <p>&copy; {new Date().getFullYear()} दिव्यManas. {t.allRightsReserved}</p>
      </footer>
    </div>
  );
}
