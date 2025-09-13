
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { assessmentData } from "@/lib/assessments";
import { useApp } from "@/context/app-provider";

export function Assessments() {
  const { assessmentResults } = useApp();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Standard Assessments</CardTitle>
        <CardDescription>
          Complete these standardized screenings to get a clearer picture of your well-being. You can take them once a week.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.values(assessmentData).map(assessment => {
          const result = assessmentResults[assessment.id];
          const hasTaken = !!result;

          return (
            <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-bold">{assessment.name}</p>
                <p className="text-sm text-muted-foreground">{assessment.description}</p>
                {hasTaken && (
                  <p className="text-xs text-primary mt-1">
                    Last score: {result.score} ({result.interpretation}). Taken on {new Date(result.date).toLocaleDateString()}.
                  </p>
                )}
              </div>
              <Button asChild>
                  <Link href={`/student/assessment/${assessment.id}`}>{hasTaken ? 'Retake' : 'Start'} Assessment</Link>
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  );
}
