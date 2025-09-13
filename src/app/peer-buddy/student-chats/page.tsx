

'use client';

import { useState } from 'react';
import { allUsers, User } from '@/lib/data';
import { ConversationList } from '@/components/peer-buddy/chat/conversation-list';
import { ChatWindow } from '@/components/peer-buddy/chat/chat-window';
import type { Conversation, Message } from '@/lib/types';
import { initialConversations, initialMessages } from '@/lib/data';


export default function StudentChatsPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(conversations[1]);
   const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // In a real app, you would fetch the messages for this conversation
    setMessages(initialMessages)
  };

  const handleAcceptRequest = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? { ...c, requestStatus: 'accepted' } : c
      )
    );
     if (selectedConversation?.id === conversationId) {
      setSelectedConversation(prev => prev ? { ...prev, requestStatus: 'accepted' } : null);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      content: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);
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
            messages={messages}
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
