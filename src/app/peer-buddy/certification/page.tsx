
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

export default function CertificationPage() {
  const { toast } = useToast();

  const handleRequest = () => {
    toast({
      title: 'Request Sent!',
      description:
        'Your request for a certificate of contribution has been sent to the administration.',
    });
  };

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Award className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Peer Buddy Certification</CardTitle>
          <CardDescription className="pt-2">
            Claim your official certificate of contribution for your valuable
            service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            When you complete your role or graduate, you can request an
            official certificate from the college to acknowledge your
            contribution to the community. This certificate is a valuable
            addition to your resume and portfolio.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={handleRequest}>
            Request Certificate of Contribution
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
