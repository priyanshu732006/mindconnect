
'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/app-provider';
import { getAIResponse } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const { messages, addMessage } = useApp();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    addMessage('user', userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(messages, userMessage);
      addMessage('assistant', aiResponse);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Could not get a response from the AI companion. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">
        AI Companion
      </h1>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Bot className="w-12 h-12 mb-4" />
                  <p className="text-lg">I'm here to listen.</p>
                  <p>How are you feeling today?</p>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex items-start gap-4',
                      message.role === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-md rounded-2xl px-4 py-3',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted rounded-bl-none'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                     {message.role === 'user' && (
                      <Avatar className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </Avatar>
                    )}
                  </div>
                ))
              )}
               {isLoading && (
                 <div className="flex items-start gap-4 justify-start">
                    <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </Avatar>
                    <div className="bg-muted rounded-2xl px-4 py-3 rounded-bl-none flex items-center">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
               )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                rows={1}
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
