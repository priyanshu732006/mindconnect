'use client';

import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/app-provider';
import { ReportPage } from '@/components/assessment/report-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AssessmentId, AssessmentResult } from '@/lib/types';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';

export default function SingleReportPage() {
  const params = useParams();
  const assessmentId = params.assessmentId as AssessmentId;
  const { assessmentResults } = useApp();
  const { user } = useAuth();
  const router = useRouter();

  const result = assessmentResults[assessmentId];

  if (!user) {
    return <Loader2 className="animate-spin" />;
  }

  if (!result) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/> Report Not Found</CardTitle>
          <CardDescription>You have not completed this assessment yet, or the results could not be found.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild>
                <Link href={`/student/assessment/${assessmentId}`}>Take Assessment</Link>
            </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <ReportPage
      studentName={user.displayName || 'Student'}
      date={new Date(result.date)}
      completedAssessments={[result]}
    />
  );
}
