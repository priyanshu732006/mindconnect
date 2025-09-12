
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useApp } from "@/context/app-provider";

const assessments = [
  { id: 'phq-9', name: 'PHQ-9', description: 'Screens for symptoms of depression.', coinValue: 1 },
  { id: 'gad-7', name: 'GAD-7', description: 'Measures severity of anxiety.', coinValue: 1 },
  { id: 'ghq-12', name: 'GHQ-12', description: 'General mental well-being screening.', coinValue: 1 },
];

export function Assessments() {
  const { completeAssessment } = useApp();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Standard Assessments</CardTitle>
        <CardDescription>
          Complete these standardized screenings to get a clearer picture of your well-being and earn coins.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {assessments.map(assessment => (
          <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-bold">{assessment.name}</p>
              <p className="text-sm text-muted-foreground">{assessment.description}</p>
            </div>
            <Button onClick={() => completeAssessment(assessment.name)}>
                Start (+{assessment.coinValue} Coin)
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
