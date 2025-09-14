
'use client';

import { useParams, useRouter } from 'next/navigation';
import { assessmentData } from '@/lib/assessments';
import { AssessmentForm } from '@/components/assessment/assessment-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AssessmentId } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/app-provider';
import { useEffect } from 'react';
import { useLocale } from '@/context/locale-provider';

export default function AssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.assessmentId as AssessmentId;
  const currentAssessment = assessmentData[assessmentId];
  const { assessmentResults } = useApp();
  const { t } = useLocale();

  useEffect(() => {
    // If the assessment has already been taken, redirect to the dashboard.
    if (assessmentResults[assessmentId]) {
      router.push('/student/dashboard');
    }
  }, [assessmentId, assessmentResults, router]);

  if (!currentAssessment) {
    return (
      <div className="space-y-8">
        <header className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/student/dashboard"><ArrowLeft/></Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
            {t.assessmentNotFound}
            </h1>
        </header>
        <Card>
            <CardHeader>
                <CardTitle>{t.error}</CardTitle>
                <CardDescription>{t.assessmentNotFoundDesc}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/student/dashboard">{t.returnToDashboard}</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render a loading state or nothing while the redirect is being processed.
  if (assessmentResults[assessmentId]) {
    return null;
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
                {t.assessmentPrompt}
            </p>
        </div>
      </header>
      
      <AssessmentForm assessment={currentAssessment} />

    </div>
  );
}
