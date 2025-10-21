
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/app-provider";
import { CheckCircle2, Circle } from "lucide-react";
import { useLocale } from "@/context/locale-provider";

export function WeeklyChallenges() {
    const { assessmentResults, journalEntries, streak } = useApp();
    const { t } = useLocale();

    const hasCompletedAllAssessments = 
        !!assessmentResults['phq-9'] && 
        !!assessmentResults['gad-7'] && 
        !!assessmentResults['ghq-12'];
    
    const hasWrittenThreeJournalEntries = journalEntries.length >= 3;
    const hasThreeDayStreak = streak >= 3;

    const challenges = [
        { text: t.challengeWrite3Entries || 'Write 3 journal entries', completed: hasWrittenThreeJournalEntries },
        { text: t.challengeCompleteAssessments || 'Complete all assessments', completed: hasCompletedAllAssessments },
        { text: t.challenge3DayStreak || 'Maintain a 3-day streak', completed: hasThreeDayStreak },
    ];


    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.weeklyChallenges}</CardTitle>
                <CardDescription>{t.weeklyChallengesDesc}</CardDescription>
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
