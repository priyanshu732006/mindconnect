
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera, UserCheck } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { analyzeFacialExpressionAction } from '@/app/actions';
import type { FacialAnalysisOutput } from '@/ai/flows/facial-analysis';
import { useApp } from '@/context/app-provider';

export default function FacialAnalysisPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { facialAnalysis, setFacialAnalysis } = useApp();
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
        setIsCameraOn(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    }
  };
  
  const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
  }

  const handleAnalysis = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    setFacialAnalysis(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if(context){
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoDataUri = canvas.toDataURL('image/jpeg');

        try {
            const result = await analyzeFacialExpressionAction(photoDataUri);
            if (result) {
                setFacialAnalysis(result);
                 toast({
                    title: 'Analysis Complete',
                    description: 'Your facial analysis has been updated.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Analysis Failed',
                    description: 'Could not analyze the image. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error analyzing facial expression:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An error occurred during the analysis.',
            });
        } finally {
            setIsAnalyzing(false);
        }
    }
  }, [setFacialAnalysis, toast]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Facial Analysis
        </h1>
        <p className="text-muted-foreground mt-2">
          Get an AI-powered mood estimation based on your facial expression.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Mood-Reader</CardTitle>
          <CardDescription>
            Position your face in the camera frame and click "Analyze My Mood" to begin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
             <video ref={videoRef} className={`w-full h-full object-cover ${!isCameraOn && 'hidden'}`} autoPlay muted playsInline />
             {!isCameraOn && <Camera className="w-16 h-16 text-muted-foreground" />}
          </div>
          
          {hasCameraPermission === false && (
            <Alert variant="destructive">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser to use this feature.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
             {!isCameraOn ? (
                 <Button onClick={startCamera}>
                     <Camera className="mr-2" /> Start Camera
                 </Button>
             ) : (
                 <>
                    <Button onClick={stopCamera} variant="outline">Stop Camera</Button>
                    <Button onClick={handleAnalysis} disabled={isAnalyzing}>
                        {isAnalyzing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <UserCheck className="mr-2" />
                        )}
                        Analyze My Mood
                    </Button>
                 </>
             )}
          </div>
        </CardContent>
      </Card>
      
      {isAnalyzing && (
          <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Analyzing your expression...</p>
          </div>
      )}

      {facialAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg"><strong>Mood:</strong> {facialAnalysis.mood}</p>
            <p><strong>Confidence:</strong> {Math.round(facialAnalysis.confidence * 100)}%</p>
            <p className="text-muted-foreground">{facialAnalysis.summary}</p>
          </CardContent>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
