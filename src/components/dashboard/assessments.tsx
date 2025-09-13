
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { assessmentData } from "@/lib/assessments";
import { useApp } from "@/context/app-provider";
import { AssessmentId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Assessments() {
  const { assessmentResults } = useApp();

  const allAssessmentIds = Object.keys(assessmentData) as AssessmentId[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Standard Assessments</CardTitle>
        <CardDescription>
          Complete these one-time standardized screenings to get a clearer picture of your well-being.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allAssessmentIds.map(assessmentId => {
          const assessment = assessmentData[assessmentId];
          const result = assessmentResults[assessment.id];
          const hasTaken = !!result;

          return (
            <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-bold">{assessment.name}</p>
                <p className="text-sm text-muted-foreground">{assessment.description}</p>
                {hasTaken && (
                  <p className="text-xs text-primary mt-1">
                    Completed on {new Date(result.date).toLocaleDateString()}. Score: {result.score} ({result.interpretation}).
                  </p>
                )}
              </div>
              <Button asChild variant={hasTaken ? 'secondary' : 'default'}>
                  {hasTaken ? (
                    <Link href={`/student/assessment/${assessment.id}/report`}>View Report</Link>
                  ) : (
                    <Link href={`/student/assessment/${assessment.id}`}>Start Assessment</Link>
                  )}
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  );
}
