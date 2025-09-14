
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/context/locale-provider';

export default function CertificationPage() {
  const { toast } = useToast();
  const { t } = useLocale();

  const handleRequest = () => {
    toast({
      title: t.requestSent,
      description:
        t.requestSentDesc,
    });
  };

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Award className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>{t.peerBuddyCertification}</CardTitle>
          <CardDescription className="pt-2">
            {t.peerBuddyCertificationClaim}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t.peerBuddyCertificationDesc}
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={handleRequest}>
            {t.requestCertificate}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
