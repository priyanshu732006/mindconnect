
'use client';
import { useApp } from '@/context/app-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { getWellbeingCategory } from '@/lib/utils';
import Link from 'next/link';

export function CrisisAlert() {
  const { wellbeingData } = useApp();

  if (!wellbeingData || wellbeingData.wellbeingScore === 0) return null;

  const { name } = getWellbeingCategory(wellbeingData.wellbeingScore);

  if (name !== 'Crisis') return null;

  return (
    <Alert variant="destructive" className="bg-destructive/10">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Crisis Alert: Immediate Attention Recommended</AlertTitle>
      <AlertDescription>
        <p className="mb-4">
          Your well-being score indicates you may be in distress. An alert has been automatically sent to your trusted contacts and the on-campus counselor. Please also consider booking an immediate session.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild variant="destructive">
            <Link href="/student/booking">Book with a Counselor</Link>
          </Button>
           <Button variant="outline" asChild>
            <a href="tel:988">
              <Phone className="mr-2 h-4 w-4" />
              Call Lifeline (988)
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
