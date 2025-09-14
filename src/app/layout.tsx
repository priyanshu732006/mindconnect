
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/app-provider';
import { AuthProvider } from '@/context/auth-provider';
import { LocaleProvider } from '@/context/locale-provider';

export const metadata: Metadata = {
  title: 'दिव्यManas',
  description: 'Your partner in mental well-being.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <AuthProvider>
          <AppProvider>
            <LocaleProvider>
              {children}
              <Toaster />
            </LocaleProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
