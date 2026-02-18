

'use client';

import { useState, useEffect } from 'react';
import { allUsers } from '@/lib/data';
import type { User, Conversation } from '@/lib/types';
import { ConversationList } from '@/components/peer-buddy/chat/conversation-list';
import { ChatWindow } from '@/components/peer-buddy/chat/chat-window';
import { useAuth } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import {
  acceptConversation,
  sendMessage,
  subscribeToMessages,
  subscribeToPeerBuddyConversations,
  type FirebaseConversation,
  type FirebaseMessage,
} from '@/lib/firebase/peer-messaging';

// Define the chat message type to match the expected structure
type ChatMessage = {
  id: string;
  sender: 'me' | User;
  content: string;
  timestamp: string;
};


export default function StudentChatsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Subscribe to peer buddy's conversations
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToPeerBuddyConversations(user.uid, (firebaseConversations) => {
      // Convert Firebase conversations to UI Conversation type
      const uiConversations: Conversation[] = firebaseConversations.map((conv) => {
        // Create a User object for the student
        const studentUser: User = {
          id: conv.studentId,
          alias: conv.studentName,
          avatar: `https://picsum.photos/seed/${conv.studentId}/100/100`,
          role: 'student',
        };

        return {
          id: conv.id,
          participant: studentUser,
          messages: [], // Messages are loaded separately
          unreadCount: 0,
          lastMessage: 'Chat conversation',
          lastMessageTimestamp: new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'stable', // Default status
          tags: [], // Could be extended in the future
          risk: 'low', // Default risk level
          requestStatus: conv.status === 'pending' ? 'pending' : 'accepted',
        };
      });

      setConversations(uiConversations);
    });

    return () => unsubscribe();
  }, [user]);

  // Subscribe to messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const unsubscribe = subscribeToMessages(selectedConversation.id, (firebaseMessages) => {
      // Convert Firebase messages to UI Message type
      const uiMessages: ChatMessage[] = firebaseMessages.map((msg): ChatMessage => {
        if (msg.senderId === user?.uid) {
          return {
            id: msg.id,
            sender: 'me' as const,
            content: msg.text,
            timestamp: msg.timestamp,
          };
        } else {
          return {
            id: msg.id,
            sender: selectedConversation.participant,
            content: msg.text,
            timestamp: msg.timestamp,
          };
        }
      });

      setMessages(uiMessages);
    });

    return () => unsubscribe();
  }, [selectedConversation, user]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleAcceptRequest = async (conversationId: string) => {
    try {
      await acceptConversation(conversationId);
      
      // Update local state
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId ? { ...c, requestStatus: 'accepted' } : c
        )
      );
      
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(prev => prev ? { ...prev, requestStatus: 'accepted' } : null);
      }

      toast({
        title: 'Request Accepted',
        description: 'You can now chat with this student.',
      });
    } catch (error) {
      console.error('Error accepting request:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Accept',
        description: 'Could not accept the request. Please try again.',
      });
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user) return;

    try {
      await sendMessage(
        selectedConversation.id,
        user.uid,
        user.displayName || 'Peer Buddy',
        content
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

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <div className="w-1/3 min-w-[350px] border-r">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={handleSelectConversation}
          onAcceptRequest={handleAcceptRequest}
        />
      </div>
      <div className="flex-1">
        {selectedConversation ? (
          <ChatWindow 
            conversation={selectedConversation}
            messages={messages as any}
            onSendMessage={handleSendMessage}
           />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted/50">
            <p className="text-muted-foreground">
              Select a conversation to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
