
'use client';

import { useParams, useRouter } from 'next/navigation';
import { assessmentData } from '@/lib/assessments';
import { AssessmentForm } from '@/components/assessment/assessment-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AssessmentId } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.assessmentId as AssessmentId;
  const currentAssessment = assessmentData[assessmentId];

  if (!currentAssessment) {
    return (
      <div className="space-y-8">
        <header className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/student/dashboard"><ArrowLeft/></Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
            Assessment Not Found
            </h1>
        </header>
        <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>The assessment you are looking for does not exist.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/student/dashboard">Return to Dashboard</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
         <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft/>
         </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                {currentAssessment.name}
            </h1>
            <p className="text-muted-foreground mt-2">
                Over the last 2 weeks, how often have you been bothered by any of the following problems?
            </p>
        </div>
      </header>
      
      <AssessmentForm assessment={currentAssessment} />

    </div>
  );
}
