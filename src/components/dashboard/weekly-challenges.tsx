
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/app-provider";
import { CheckCircle2, Circle } from "lucide-react";

export function WeeklyChallenges() {
    const { assessmentResults, messages, streak } = useApp();

    const hasCompletedAllAssessments = 
        !!assessmentResults['phq-9'] && 
        !!assessmentResults['gad-7'] && 
        !!assessmentResults['ghq-12'];
    
    const hasWrittenThreeJournalEntries = messages.filter(m => m.role === 'user').length >= 3;
    const hasThreeDayStreak = streak >= 3;

    const challenges = [
        { text: 'Write 3 journal entries', completed: hasWrittenThreeJournalEntries },
        { text: 'Complete all assessments', completed: hasCompletedAllAssessments },
        { text: 'Maintain a 3-day streak', completed: hasThreeDayStreak },
    ];


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
