
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
import { Loader2, Sparkles, Copy, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSessionSummaryAction } from '@/app/actions';
import { GenerateSessionSummaryOutput } from '@/ai/flows/generate-session-summary';
import { Check } from 'lucide-react';

export default function SessionSummaryPage() {
  const [studentName, setStudentName] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryResult, setSummaryResult] =
    useState<GenerateSessionSummaryOutput | null>(null);
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

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

  const handleCopy = () => {
    if (!summaryResult) return;
    const fullText = `Session Summary:\n${
      summaryResult.summary
    }\n\nActionable Advice:\n${summaryResult.actionableAdvice
      .map(item => `- ${item}`)
      .join('\n')}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    toast({
      title: 'Copied to Clipboard!',
      description: 'The summary and advice have been copied.',
    });
    setTimeout(() => setIsCopied(false), 2000);
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

      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-6">
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
              rows={10}
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

      {summaryResult && (
        <Card className="shadow-sm bg-white animate-in fade-in-50">
          <CardHeader>
            <CardTitle>Generated Summary for {studentName}</CardTitle>
            <CardDescription>
              Review the AI-generated content below. You can copy it or send it
              directly to the student.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Session Summary</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md border">
                {summaryResult.summary}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Actionable Advice</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 bg-gray-50 p-4 rounded-md border">
                {summaryResult.actionableAdvice.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button onClick={handleCopy} variant="outline">
              {isCopied ? (
                <Check className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {isCopied ? 'Copied!' : 'Copy'}
            </Button>
            <Button onClick={handleSendEmail}>
              <Send className="mr-2 h-4 w-4" />
              Send via Email
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
