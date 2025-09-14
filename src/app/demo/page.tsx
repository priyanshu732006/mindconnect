
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/logo";
import Link from "next/link";
import { Info } from "lucide-react";
import { useLocale } from "@/context/locale-provider";

export default function DemoPage() {
    const { t } = useLocale();
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
           <Logo className="justify-center mb-4" />
          <CardTitle>{t.welcomeToDemo}</CardTitle>
          <CardDescription>
            {t.welcomeToDemoDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground bg-accent/50 p-4 rounded-md border">
            <div className="flex items-start gap-3">
                <Info className="w-5 h-5 mt-0.5 text-primary" />
                <p className="text-left">
                   {t.demoFeaturesDisabled}
                </p>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 pt-6">
          <Button className="w-full" asChild>
            <Link href="/student/dashboard">{t.startDemo}</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">{t.cancel}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
