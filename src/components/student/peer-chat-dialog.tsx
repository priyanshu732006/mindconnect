
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Smile } from 'lucide-react';
import type { PeerBuddy, ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import React, { useRef, useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


type PeerChatDialogProps = {
  buddy: PeerBuddy;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
};

export function PeerChatDialog({
  buddy,
  isOpen,
  onOpenChange,
  messages,
  onSendMessage
}: PeerChatDialogProps) {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(!input.trim()) return;
      onSendMessage(input);
      setInput('');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Chat with {buddy.name}</DialogTitle>
          <DialogDescription>
            This is a private and confidential chat.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'You' ? 'justify-end' : 'justify-start')}>
                        {msg.sender !== 'You' && (
                            <Avatar className="w-8 h-8">
                                <AvatarFallback>{buddy.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className="flex flex-col">
                            <div className={cn(
                                'max-w-xs rounded-2xl px-4 py-2 text-sm',
                                msg.sender === 'You' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
                            )}>
                                <p>{msg.text}</p>
                            </div>
                             <span className={cn("text-xs text-muted-foreground mt-1 px-1", msg.sender === 'You' ? 'text-right' : 'text-left')}>
                                {msg.timestamp}
                            </span>
                        </div>
                         {msg.sender === 'You' && (
                            <Avatar className="w-8 h-8">
                                <AvatarFallback>Y</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
            </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-background">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <div className="relative flex-1">
                    <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="pr-10"
                    />
                    <Button type="button" size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                        <Smile className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
                <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
