
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
import { MessageSquare, Send, Clock, Loader2, UserPlus } from 'lucide-react';
import { PeerChatDialog } from '@/components/student/peer-chat-dialog';
import type { PeerBuddy, ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useLocale } from '@/context/locale-provider';
import { getDatabase, ref, onValue, off, push, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebase/client-app';
import { useAuth } from '@/context/auth-provider';

type RequestStatus = 'idle' | 'pending' | 'connected';

export default function SupportPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const { user } = useAuth();
  const [availableBuddies, setAvailableBuddies] = useState<PeerBuddy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<Record<string, RequestStatus>>({});
  const [isChatOpen, setChatOpen] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<PeerBuddy | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const database = getDatabase(app);
    let dbUnsubscribe: (() => void) | undefined;

    const authUnsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (dbUnsubscribe) dbUnsubscribe();

      if (authUser) {
        const peerBuddiesRef = ref(database, 'peerBuddies');
        setIsLoading(true);

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
                .filter((buddy: any) => buddy.status === "Available" && buddy.id !== authUser.uid);

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
          console.error("Firebase read failed at /peerBuddies: " + error.message);
          setIsLoading(false);
        });

        dbUnsubscribe = unsubscribe;
      } else {
        setAvailableBuddies([]);
        setIsLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (dbUnsubscribe) dbUnsubscribe();
      if (chatRef.current) off(chatRef.current);
    };
  }, []);


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

    setTimeout(() => {
      setRequestStatus(prev => ({ ...prev, [buddy.id]: 'connected' }));
      toast({
        title: 'Request Accepted!',
        description: `${buddy.name} has accepted your request. You can now start a chat.`,
      });
    }, 2000);
  };

  const handleOpenChat = (buddy: PeerBuddy) => {
    if (!user) return;
    
    setSelectedBuddy(buddy);
    setChatOpen(true);

    const database = getDatabase(app);
    const chatId = [user.uid, buddy.id].sort().join('_');
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    
    if (chatRef.current) off(chatRef.current);
    chatRef.current = messagesRef;

    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const msgList: ChatMessage[] = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val
        }));
        setMessages(msgList);
      } else {
        const welcomeMsg: ChatMessage = {
          id: 'welcome',
          sender: buddy.name,
          text: `Hi! I'm ${buddy.name}. Thanks for connecting. How can I help you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([welcomeMsg]);
      }
    });
  };
  
  const handleSendMessage = (text: string) => {
      if(!selectedBuddy || !user) return;
      
      const database = getDatabase(app);
      const chatId = [user.uid, selectedBuddy.id].sort().join('_');
      const messagesRef = ref(database, `chats/${chatId}/messages`);
      const newMessageRef = push(messagesRef);
      
      set(newMessageRef, {
          sender: 'You',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          senderUid: user.uid
      });
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold tracking-tight font-headline mb-4 flex items-center gap-2">
            <MessageSquare className="text-primary" />
            Your Connected Buddies
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {connectedBuddies.map(buddy => (
              <Card key={buddy.id} className="flex flex-col bg-primary/5 border-primary/20 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{buddy.name}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(buddy.specializations as string[]).map((spec: string) => (
                      <Badge key={spec} variant="outline" className="text-[10px] py-0">{spec}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleOpenChat(buddy)}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Chat Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div>
         <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
            Find a Peer Buddy
            </h1>
            <p className="text-muted-foreground mt-2">
            Connect with a trained peer who can relate to what you're going
            through. All conversations are confidential.
            </p>
        </header>

        {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Searching for available buddies...</p>
            </div>
        ) : availableAndPendingBuddies.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {availableAndPendingBuddies.map(buddy => {
                const status = requestStatus[buddy.id] || 'idle';
                const isAvailable = buddy.status === 'Available';

                return (
                    <Card key={buddy.id} className="flex flex-col hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{buddy.name || 'Anonymous Buddy'}</CardTitle>
                            <div className="flex items-center gap-1.5">
                                <span className={cn("h-2 w-2 rounded-full", isAvailable ? "bg-green-500" : "bg-gray-400")}></span>
                                <span className="text-[10px] font-medium text-muted-foreground uppercase">{buddy.status}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Specializations</p>
                        <div className="flex flex-wrap gap-1.5">
                        {(buddy.specializations as string[]).map((spec) => (
                            <Badge key={spec} variant="secondary" className="text-[10px] py-0">{spec}</Badge>
                        ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                        variant={status === 'pending' ? 'outline' : 'default'}
                        className="w-full"
                        onClick={() => handleSendRequest(buddy)}
                        disabled={status === 'pending' || !isAvailable}
                        >
                        {status === 'idle' && <><UserPlus className="mr-2 h-4 w-4"/>Send Request</>}
                        {status === 'pending' && <><Clock className="mr-2 h-4 w-4"/>Request Pending</>}
                        </Button>
                    </CardFooter>
                    </Card>
                );
                })}
            </div>
        ) : (
             <div className="flex flex-col justify-center items-center h-64 text-center border-2 border-dashed rounded-xl bg-muted/30">
                <div className="bg-muted p-4 rounded-full mb-4">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-semibold">No peer buddies are available at this time.</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm px-4">This directory updates in real-time. Please check back shortly or explore our AI companion.</p>
            </div>
        )}
      </div>

    </div>
  );
}
