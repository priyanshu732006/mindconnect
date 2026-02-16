'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Clock, Loader2 } from 'lucide-react';
import { PeerChatDialog } from '@/components/student/peer-chat-dialog';
import type { PeerBuddy, ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useLocale } from '@/context/locale-provider';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase/client-app';

type RequestStatus = 'idle' | 'pending' | 'connected';

export default function SupportPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [availableBuddies, setAvailableBuddies] = useState<PeerBuddy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<Record<string, RequestStatus>>({});
  const [isChatOpen, setChatOpen] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<PeerBuddy | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const dbRef = useRef<any>(null);

  useEffect(() => {
    setIsLoading(true);

    // Use the explicit database instance from client-app.ts
    // Added explicit leading slash just in case of environment-specific path resolution
    const peerBuddiesRef = ref(database, '/peerBuddies');
    dbRef.current = peerBuddiesRef;

    const unsubscribe = onValue(peerBuddiesRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const buddiesFromDb: PeerBuddy[] = Object.entries(data)
            .map(([id, value]: [string, any]) => ({
              id,
              ...value,
              specializations: value.specializations 
                ? (Array.isArray(value.specializations) ? value.specializations : Object.values(value.specializations))
                : [],
            }))
            .filter((buddy: any) => buddy.status === "Available");

          setAvailableBuddies(buddiesFromDb);
        } else {
          setAvailableBuddies([]);
        }
      } catch (err) {
        console.error("Error processing buddies data:", err);
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Firebase read failed: " + error.message);
      // We keep the old list if a read fails to avoid UI flickering during rule updates
      setIsLoading(false);
    });

    return () => {
      if (dbRef.current) {
        off(dbRef.current);
      }
    };
  }, []); // Only run once on mount


  const handleSendRequest = (buddy: PeerBuddy) => {
    if (buddy.status !== 'Available') {
      toast({
        variant: 'destructive',
        title: 'Buddy Not Available',
        description: `${buddy.name} is currently busy. Please try another buddy.`,
      });
      return;
    }

    setRequestStatus(prev => ({ ...prev, [buddy.id]: 'pending' }));
    toast({
      title: 'Request Sent!',
      description: `Your request to connect with ${buddy.name} has been sent.`,
    });

    // Simulate auto-acceptance for demonstration purposes
    setTimeout(() => {
      setRequestStatus(prev => ({ ...prev, [buddy.id]: 'connected' }));
      toast({
        title: 'Request Accepted!',
        description: `${buddy.name} has accepted your request. You can now start a chat.`,
      });
    }, 3000);
  };

  const handleOpenChat = (buddy: PeerBuddy) => {
    setSelectedBuddy(buddy);
    // In a real app, you would fetch existing messages for this buddy
    setMessages([
        {
            id: '1',
            sender: buddy.name,
            text: `Hi! I'm ${buddy.name}. Thanks for connecting. How can I help you today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
    ]);
    setChatOpen(true);
  };
  
  const handleSendMessage = (text: string) => {
      if(!selectedBuddy) return;
      const newMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'You',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, newMessage]);
  }

  const connectedBuddies = availableBuddies.filter(buddy => requestStatus[buddy.id] === 'connected');
  const availableAndPendingBuddies = availableBuddies.filter(buddy => requestStatus[buddy.id] !== 'connected');

  return (
    <div className="space-y-8">
      {selectedBuddy && (
          <PeerChatDialog
            buddy={selectedBuddy}
            isOpen={isChatOpen}
            onOpenChange={setChatOpen}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
      )}

      {connectedBuddies.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Your Connected Buddies</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {connectedBuddies.map(buddy => (
              <Card key={buddy.id} className="flex flex-col bg-primary/5 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{buddy.name}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm font-medium mb-2">Specializations:</p>
                  <div className="flex flex-wrap gap-2">
                    {(buddy.specializations as string[]).map((spec: string) => (
                      <Badge key={spec} variant="outline">{spec}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleOpenChat(buddy)}>
                    <MessageSquare className="mr-2" /> Chat Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div>
         <header>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
            Find a Peer Buddy
            </h1>
            <p className="text-muted-foreground mt-2">
            Connect with a trained peer who can relate to what you're going
            through. All conversations are confidential.
            </p>
        </header>

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : availableAndPendingBuddies.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {availableAndPendingBuddies.map(buddy => {
                const status = requestStatus[buddy.id] || 'idle';
                const isAvailable = buddy.status === 'Available';

                return (
                    <Card key={buddy.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{buddy.name || 'Anonymous Buddy'}</CardTitle>
                            <div className="flex items-center gap-1.5">
                                <span className={cn("h-2 w-2 rounded-full", isAvailable ? "bg-green-500" : "bg-gray-400")}></span>
                                <span className="text-xs text-muted-foreground">{buddy.status}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-sm font-medium mb-2">Specializations:</p>
                        <div className="flex flex-wrap gap-2">
                        {(buddy.specializations as string[]).map((spec) => (
                            <Badge key={spec} variant="secondary">{spec}</Badge>
                        ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                        className="w-full"
                        onClick={() => handleSendRequest(buddy)}
                        disabled={status === 'pending' || !isAvailable}
                        >
                        {status === 'idle' && <><Send className="mr-2"/>Send Request</>}
                        {status === 'pending' && <><Clock className="mr-2"/>Request Pending</>}
                        </Button>
                    </CardFooter>
                    </Card>
                );
                })}
            </div>
        ) : (
             <div className="flex flex-col justify-center items-center h-64 text-center">
                <p className="text-muted-foreground font-semibold">No peer buddies are available at this time.</p>
                <p className="text-sm text-muted-foreground mt-2">This could be because no users have registered as a Peer Buddy yet or they are all currently busy.</p>
            </div>
        )}
      </div>

    </div>
  );
}
