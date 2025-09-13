

'use client';

import React, { useState } from 'react';
import type { Conversation, Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bot, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { analyzeChatRisk } from '@/ai/flows/analyze-chat-risk';
import { Loader2 } from 'lucide-react';
import { EscalateDialog } from './escalate-dialog';

type ChatWindowProps = {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
};

type RiskAnalysisResult = {
    riskLevel: 'low' | 'medium' | 'high';
    summary: string;
    keyConcerns: string[];
}

export function ChatWindow({
  conversation,
  messages,
  onSendMessage,
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<RiskAnalysisResult | null>(null);
  const [isEscalateOpen, setEscalateOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleAnalyzeRisk = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
        const chatHistory = messages.map(m => `${typeof m.sender === 'string' ? 'Buddy' : 'Student'}: ${m.content}`).join('\n');
        const result = await analyzeChatRisk({ chatHistory });
        setAnalysisResult(result);
        toast({
            title: "Analysis Complete",
            description: `Student risk level assessed as ${result.riskLevel}.`
        })
    } catch(error) {
        console.error("Risk analysis failed", error);
        toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: "Could not analyze chat risk. Please try again."
        })
    } finally {
        setIsAnalyzing(false);
    }
  }
  
  const riskBadgeVariant = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive'
  } as const;

  return (
     <>
        <EscalateDialog isOpen={isEscalateOpen} setIsOpen={setEscalateOpen} student={conversation.participant} />
        <div className="flex h-full flex-col">
        <header className="flex items-center gap-4 border-b bg-background p-4">
            <h2 className="text-lg font-semibold">
            Chat with {conversation.participant.alias}
            </h2>
            <Badge variant={riskBadgeVariant[conversation.risk] || 'secondary'}>{conversation.risk}</Badge>
            <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleAnalyzeRisk} disabled={isAnalyzing}>
                {isAnalyzing ? <Loader2 className="mr-2 animate-spin"/> : <Bot />}
                Analyze Risk
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setEscalateOpen(true)}>
                <AlertTriangle />
                Escalate
            </Button>
            </div>
        </header>

        <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
            {analysisResult && (
                 <div className="rounded-lg border bg-muted/50 p-4">
                    <h4 className="font-semibold mb-2">AI Risk Analysis Result</h4>
                    <p className="text-sm"><strong>Risk Level:</strong> <span className={cn(
                        analysisResult.riskLevel === 'high' && 'text-destructive',
                        analysisResult.riskLevel === 'medium' && 'text-yellow-600',
                    )}>{analysisResult.riskLevel}</span></p>
                    <p className="text-sm"><strong>Key Concerns:</strong> {analysisResult.keyConcerns.join(', ')}</p>
                    <p className="text-sm mt-2"><strong>Summary:</strong> {analysisResult.summary}</p>
                </div>
            )}
            {messages.map(message => (
                <div
                key={message.id}
                className={cn(
                    'flex items-end gap-2',
                    message.sender === 'me' ? 'justify-end' : 'justify-start'
                )}
                >
                {message.sender !== 'me' && (
                    <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.avatar} />
                    <AvatarFallback>{message.sender.alias.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div className="max-w-md rounded-lg bg-card px-4 py-2 shadow-sm">
                    <p className="text-sm">{message.content}</p>
                    <p className="mt-1 text-right text-xs text-muted-foreground">
                    {message.timestamp}
                    </p>
                </div>
                {message.sender === 'me' && (
                     <Avatar className="h-8 w-8">
                        <AvatarFallback><User/></AvatarFallback>
                    </Avatar>
                )}
                </div>
            ))}
            </div>
        </ScrollArea>

        <footer className="border-t bg-background p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your supportive message..."
                autoComplete="off"
            />
            <Button type="submit">
                <Send />
            </Button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
            Remember: Be supportive, non-judgmental, and encourage professional
            help when needed.
            </p>
        </footer>
        </div>
     </>
  );
}
