
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
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Session Summary Generator
        </h1>
        <p className="mt-2 text-gray-500">
          Enter session notes to generate a summary and actionable advice. This
          can be sent to the student via email, which you can collect during
          your session.
        </p>
      </div>

      <div className="p-6 space-y-6 rounded-lg bg-blue-50/50 border border-blue-100">
        <div className="space-y-2">
            <Label htmlFor="student-name">Student Name</Label>
            <Input
              id="student-name"
              placeholder="Enter student's name"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              disabled={isLoading}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="session-notes">Session Notes</Label>
            <Textarea
              id="session-notes"
              placeholder="Enter detailed notes from the counseling session..."
              value={sessionNotes}
              onChange={e => setSessionNotes(e.target.value)}
              rows={5}
              disabled={isLoading}
              className="bg-white"
            />
          </div>
           <Button onClick={handleGenerateSummary} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Summary
          </Button>
      </div>
      

      {(isLoading || summaryResult) && (
        <div className="p-6 space-y-6 rounded-lg bg-blue-50/50 border border-blue-100 animate-in fade-in-50">
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
                        <p className="text-gray-700">
                            {summaryResult.summary}
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Actionable Advice</h3>
                        <p className="text-gray-700 whitespace-pre-line">
                            {summaryResult.actionableAdvice.join('\n')}
                        </p>
                    </div>
                     <Button onClick={handleSendEmail} className="bg-green-100 text-green-800 hover:bg-green-200">
                        <Send className="mr-2 h-4 w-4" />
                        Send to Student
                    </Button>
                </>
            )}
        </div>
      )}
    </div>
  );
}
