
'use client';

import { useApp } from '@/context/app-provider';
import { useAuth } from '@/context/auth-provider';
import { ReportPage } from '@/components/assessment/report-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { assessmentData } from '@/lib/assessments';
import { Loader2, AlertTriangle } from 'lucide-react';
import { AssessmentId } from '@/lib/types';

export default function ConsolidatedReportPage() {
  const { assessmentResults } = useApp();
  const { user } = useAuth();

  const allAssessmentIds = Object.keys(assessmentData) as AssessmentId[];
  const completedAssessments = allAssessmentIds.filter(id => !!assessmentResults[id]);
  const allCompleted = completedAssessments.length === allAssessmentIds.length;

  if (!user) {
    return <Loader2 className="animate-spin" />;
  }

  if (!allCompleted) {
    const remainingAssessments = allAssessmentIds.filter(id => !assessmentResults[id]);
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/> Complete All Assessments</CardTitle>
          <CardDescription>You must complete all baseline assessments before generating a consolidated report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-semibold">Remaining Assessments:</p>
          <ul className="list-disc pl-5 text-muted-foreground">
            {remainingAssessments.map(id => <li key={id}>{assessmentData[id].name}</li>)}
          </ul>
        </CardContent>
        <CardContent>
            <Button asChild>
                <Link href="/student/dashboard">Return to Dashboard</Link>
            </Button>
        </CardContent>
      </Card>
    );
  }

  // If all are completed, render the full report.
  // The ReportPage is now used for the consolidated view.
  return (
    <ReportPage
      studentName={user.displayName || 'Student'}
      date={new Date()}
      completedAssessments={completedAssessments.map(id => assessmentResults[id]!)}
    />
  );
}
