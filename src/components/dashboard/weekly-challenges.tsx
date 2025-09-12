
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

const challenges = [
    { text: 'Write 3 journal entries', completed: true },
    { text: 'Complete 1 assessment', completed: true },
    { text: 'Maintain a 3-day streak', completed: false },
];

export function WeeklyChallenges() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Challenges</CardTitle>
                <CardDescription>Complete these for bonus coins!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {challenges.map((challenge, index) => (
                    <div key={index} className="flex items-center gap-3">
                        {challenge.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                        <span className={challenge.completed ? 'text-muted-foreground line-through' : ''}>
                            {challenge.text}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
