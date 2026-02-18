
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
import { useState, useEffect } from 'react';
import { MessageSquare, Send, Check, Clock, UserPlus } from 'lucide-react';
import { PeerChatDialog } from '@/components/student/peer-chat-dialog';
import type { PeerBuddy, ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-provider';
import {
  createConversationRequest,
  subscribeToMessages,
  sendMessage,
  subscribeToStudentConversations,
  type FirebaseConversation,
  type FirebaseMessage,
} from '@/lib/firebase/peer-messaging';

// Extended placeholder data to include status and ID
const availableBuddiesData: PeerBuddy[] = [
  { id: 'buddy_01', name: 'Buddy 01', specializations: ['Exam Stress', 'Anxiety'], status: 'Available' },
  { id: 'buddy_02', name: 'Buddy 02', specializations: ['Homesickness', 'Relationships'], status: 'Available' },
  { id: 'buddy_03', name: 'Buddy 03', specializations: ['Social Anxiety', 'Motivation'], status: 'Busy' },
  { id: 'buddy_04', name: 'Buddy 04', specializations: ['Depression', 'Coping Skills'], status: 'Available' },
  { id: 'buddy_05', name: 'Buddy 05', specializations: ['Time Management', 'Study Pressure'], status: 'Busy' },
  { id: 'buddy_06', name: 'Buddy 06', specializations: ['Career Doubts', 'General Chat'], status: 'Available' },
];

type RequestStatus = 'idle' | 'pending' | 'connected';

export default function SupportPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [requestStatus, setRequestStatus] = useState<Record<string, RequestStatus>>({});
  const [isChatOpen, setChatOpen] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<PeerBuddy | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<(FirebaseConversation & { id: string })[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Subscribe to student's conversations
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToStudentConversations(user.uid, (updatedConversations) => {
      setConversations(updatedConversations);
      
      // Update request status based on conversations
      const statusMap: Record<string, RequestStatus> = {};
      updatedConversations.forEach((conv) => {
        if (conv.status === 'pending') {
          statusMap[conv.peerBuddyId] = 'pending';
        } else if (conv.status === 'accepted' || conv.status === 'active') {
          statusMap[conv.peerBuddyId] = 'connected';
        }
      });
      setRequestStatus(statusMap);
    });

    return () => unsubscribe();
  }, [user]);

  // Subscribe to messages for active conversation
  useEffect(() => {
    if (!activeConversationId) return;

    const unsubscribe = subscribeToMessages(activeConversationId, (firebaseMessages) => {
      const chatMessages: ChatMessage[] = firebaseMessages.map((msg) => ({
        id: msg.id,
        sender: msg.senderId === user?.uid ? 'You' : msg.sender,
        text: msg.text,
        timestamp: msg.timestamp,
      }));
      setMessages(chatMessages);
    });

    return () => unsubscribe();
  }, [activeConversationId, user]);

  const handleSendRequest = async (buddy: PeerBuddy) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to send a request.',
      });
      return;
    }

    if (buddy.status !== 'Available') {
      toast({
        variant: 'destructive',
        title: 'Buddy Not Available',
        description: `${buddy.name} is currently busy. Please try another buddy.`,
      });
      return;
    }

    try {
      setRequestStatus(prev => ({ ...prev, [buddy.id]: 'pending' }));
      
      const conversationId = await createConversationRequest(
        user.uid,
        user.displayName || 'Anonymous Student',
        buddy.id,
        buddy.name
      );

      toast({
        title: 'Request Sent!',
        description: `Your request to connect with ${buddy.name} has been sent.`,
      });
    } catch (error) {
      console.error('Error sending request:', error);
      setRequestStatus(prev => ({ ...prev, [buddy.id]: 'idle' }));
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: 'Failed to send request. Please try again.',
      });
    }
  };

  const handleOpenChat = (buddy: PeerBuddy) => {
    // Find the conversation for this buddy
    const conversation = conversations.find(
      (conv) => conv.peerBuddyId === buddy.id
    );

    if (conversation) {
      setSelectedBuddy(buddy);
      setActiveConversationId(conversation.id);
      setChatOpen(true);
    }
  };
  
  const handleSendMessage = async (text: string) => {
    if (!selectedBuddy || !user || !activeConversationId) return;

    try {
      await sendMessage(
        activeConversationId,
        user.uid,
        user.displayName || 'Anonymous Student',
        text
      );
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Message Failed',
        description: 'Failed to send message. Please try again.',
      });
    }
  };


  const connectedBuddies = availableBuddiesData.filter(buddy => requestStatus[buddy.id] === 'connected');
  const availableAndPendingBuddies = availableBuddiesData.filter(buddy => requestStatus[buddy.id] !== 'connected');

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

      {/* Connected Buddies Section */}
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
                    {buddy.specializations.map(spec => (
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
      
      {/* Available Buddies Section */}
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {availableAndPendingBuddies.map(buddy => {
            const status = requestStatus[buddy.id] || 'idle';
            const isAvailable = buddy.status === 'Available';

            return (
                <Card key={buddy.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{buddy.name}</CardTitle>
                        <div className="flex items-center gap-1.5">
                            <span className={cn("h-2 w-2 rounded-full", isAvailable ? "bg-green-500" : "bg-gray-400")}></span>
                            <span className="text-xs text-muted-foreground">{buddy.status}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                    <p className="text-sm font-medium mb-2">Specializations:</p>
                    <div className="flex flex-wrap gap-2">
                    {buddy.specializations.map(spec => (
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
      </div>

    </div>
  );
}
