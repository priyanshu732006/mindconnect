
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, Square, UserCheck } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { analyzeVoiceAction } from '@/app/actions';
import { useApp } from '@/context/app-provider';

export default function VoiceAnalysisPage() {
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { voiceAnalysis, setVoiceAnalysis } = useApp();
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
        setIsRecording(true);
        setVoiceAnalysis(null);

        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = handleAnalysis;
        mediaRecorderRef.current.start();
        
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);

      } catch (error) {
        console.error('Error accessing microphone:', error);
        setHasMicPermission(false);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings.',
        });
      }
    }
  };
  
  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          if(timerRef.current) clearInterval(timerRef.current);
          
          // Stop all media tracks
          const stream = mediaRecorderRef.current.stream;
          stream.getTracks().forEach(track => track.stop());
      }
  }

  const handleAnalysis = useCallback(async () => {
    if (audioChunksRef.current.length === 0) return;

    setIsAnalyzing(true);
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    audioChunksRef.current = [];

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
        const audioDataUri = reader.result as string;
        try {
            const result = await analyzeVoiceAction(audioDataUri);
            if (result) {
                setVoiceAnalysis(result);
                toast({
                    title: 'Analysis Complete',
                    description: 'Your voice analysis has been updated.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Analysis Failed',
                    description: 'Could not analyze the audio. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error analyzing voice:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An error occurred during the analysis.',
            });
        } finally {
            setIsAnalyzing(false);
        }
    };
  }, [toast, setVoiceAnalysis]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Voice Analysis
        </h1>
        <p className="text-muted-foreground mt-2">
          Get an AI-powered mood estimation based on your voice. Speak for a few seconds and see the result.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Tone-Reader</CardTitle>
          <CardDescription>
            Click "Start Recording" and speak clearly into your microphone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
            <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-md">
                <Mic className={`w-16 h-16 text-muted-foreground transition-colors duration-300 ${isRecording && 'text-destructive'}`} />
                <p className="text-2xl font-bold font-mono mt-4">{formatTime(recordingTime)}</p>
                <p className="text-sm text-muted-foreground mt-1">{isRecording ? 'Recording in progress...' : 'Ready to record'}</p>
            </div>
          
          {hasMicPermission === false && (
            <Alert variant="destructive">
              <AlertTitle>Microphone Access Required</AlertTitle>
              <AlertDescription>
                Please allow microphone access in your browser to use this feature.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center gap-2">
             {!isRecording ? (
                 <Button onClick={startRecording} disabled={isAnalyzing}>
                     <Mic className="mr-2" /> Start Recording
                 </Button>
             ) : (
                <Button onClick={stopRecording} variant="destructive" disabled={isAnalyzing}>
                    <Square className="mr-2" /> Stop Recording
                </Button>
             )}
          </div>
        </CardContent>
      </Card>
      
      {isAnalyzing && (
          <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Analyzing your voice...</p>
          </div>
      )}

      {voiceAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg"><strong>Mood:</strong> {voiceAnalysis.mood}</p>
            <p><strong>Confidence:</strong> {Math.round(voiceAnalysis.confidence * 100)}%</p>
            <p className="text-muted-foreground">{voiceAnalysis.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
