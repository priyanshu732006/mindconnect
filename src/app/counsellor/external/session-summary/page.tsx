
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSessionSummaryAction } from '@/app/actions';
import { GenerateSessionSummaryOutput } from '@/ai/flows/generate-session-summary';
import { Separator } from '@/components/ui/separator';

export default function SessionSummaryPage() {
  const [studentName, setStudentName] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryResult, setSummaryResult] =
    useState<GenerateSessionSummaryOutput | null>(null);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    if (!studentName.trim() || !sessionNotes.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please enter both a student name and session notes.',
      });
      return;
    }

    setIsLoading(true);
    setSummaryResult(null);

    try {
      const result = await generateSessionSummaryAction({
        studentName,
        sessionNotes,
      });
      if (result) {
        setSummaryResult(result);
        toast({
          title: 'Summary Generated',
          description:
            'The AI-powered session summary has been successfully created.',
        });
      } else {
        throw new Error('The summary generation returned no result.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'An error occurred while generating the summary. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = () => {
     if (!summaryResult) return;
     toast({
        title: 'Email Sent (Simulated)',
        description: `An email has been sent to the student with the session summary.`
     })
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Session Summary Generator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter session notes to generate a summary and actionable advice for students.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Session Details</CardTitle>
                <CardDescription>Enter notes to generate a summary and action plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="student-name">Student Name</Label>
                    <Input
                    id="student-name"
                    placeholder="Enter student's name"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="session-notes">Session Notes</Label>
                    <Textarea
                    id="session-notes"
                    placeholder="Enter detailed notes from the counseling session..."
                    value={sessionNotes}
                    onChange={e => setSessionNotes(e.target.value)}
                    rows={8}
                    disabled={isLoading}
                    />
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleGenerateSummary} disabled={isLoading}>
                    {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Summary
                </Button>
            </CardFooter>
        </Card>

        <Card>
             <CardHeader>
                <CardTitle>AI Generated Output</CardTitle>
                <CardDescription>Review the generated summary and advice before sending.</CardDescription>
            </CardHeader>
             <CardContent className="space-y-6">
                {(isLoading || summaryResult) ? (
                    <>
                        {isLoading && !summaryResult && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                <p className="text-muted-foreground">Generating summary...</p>
                            </div>
                        )}
                        {summaryResult && (
                            <>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Generated Summary</h3>
                                    <p className="text-muted-foreground">
                                        {summaryResult.summary}
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Actionable Advice</h3>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        {summaryResult.actionableAdvice.map((advice, index) => (
                                            <li key={index}>{advice}</li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Output will appear here</p>
                    </div>
                )}
             </CardContent>
             {summaryResult && (
                <CardFooter>
                     <Button onClick={handleSendEmail} variant="secondary">
                        <Send className="mr-2 h-4 w-4" />
                        Send to Student
                    </Button>
                </CardFooter>
             )}
        </Card>
      </div>

    </div>
  );
}
