
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
import { useLocale } from '@/context/locale-provider';

export default function SessionSummaryPage() {
  const [studentName, setStudentName] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryResult, setSummaryResult] =
    useState<GenerateSessionSummaryOutput | null>(null);
  const { toast } = useToast();
  const { t } = useLocale();

  const handleGenerateSummary = async () => {
    if (!studentName.trim() || !sessionNotes.trim()) {
      toast({
        variant: 'destructive',
        title: t.missingInformation,
        description: t.missingInformationDesc,
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
          title: t.summaryGenerated,
          description:
            t.summaryGeneratedDesc,
        });
      } else {
        throw new Error('The summary generation returned no result.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t.generationFailed,
        description:
          t.generationFailedDesc,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = () => {
     if (!summaryResult) return;
     toast({
        title: t.emailSent,
        description: t.emailSentDesc,
     })
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t.sessionSummaryGenerator}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t.sessionSummaryGeneratorDesc}
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>{t.sessionDetails}</CardTitle>
                <CardDescription>{t.sessionDetailsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="student-name">{t.studentName}</Label>
                    <Input
                    id="student-name"
                    placeholder={t.studentNamePlaceholder}
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="session-notes">{t.sessionNotes}</Label>
                    <Textarea
                    id="session-notes"
                    placeholder={t.sessionNotesPlaceholder}
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
                    {t.generateSummary}
                </Button>
            </CardFooter>
        </Card>

        <Card>
             <CardHeader>
                <CardTitle>{t.aiGeneratedOutput}</CardTitle>
                <CardDescription>{t.aiGeneratedOutputDesc}</CardDescription>
            </CardHeader>
             <CardContent className="space-y-6">
                {(isLoading || summaryResult) ? (
                    <>
                        {isLoading && !summaryResult && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                <p className="text-muted-foreground">{t.generatingSummary}...</p>
                            </div>
                        )}
                        {summaryResult && (
                            <>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{t.generatedSummary}</h3>
                                    <p className="text-muted-foreground">
                                        {summaryResult.summary}
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{t.actionableAdvice}</h3>
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
                        <p className="text-muted-foreground">{t.outputWillAppearHere}</p>
                    </div>
                )}
             </CardContent>
             {summaryResult && (
                <CardFooter>
                     <Button onClick={handleSendEmail} variant="secondary">
                        <Send className="mr-2 h-4 w-4" />
                        {t.sendToStudent}
                    </Button>
                </CardFooter>
             )}
        </Card>
      </div>

    </div>
  );
}
