
'use client';
import { useApp } from '@/context/app-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { getWellbeingCategory } from '@/lib/utils';
import Link from 'next/link';

export function CrisisAlert() {
  const { wellbeingData } = useApp();

  if (!wellbeingData) return null;

  const { name } = getWellbeingCategory(wellbeingData.wellbeingScore);

  if (name !== 'Crisis') return null;

  return (
    <Alert variant="destructive" className="bg-destructive/10">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Crisis Alert: Immediate Attention Recommended</AlertTitle>
      <AlertDescription>
        <p className="mb-4">
          Your well-being score indicates you may be in distress. It's important
          to reach out for support. Please consider one of the options below.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild variant="destructive">
            <Link href="/student/booking">Book with a Counselor</Link>
          </Button>
          <Button variant="outline">Contact Trusted Contacts</Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
