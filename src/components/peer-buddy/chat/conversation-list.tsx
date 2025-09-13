

'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { ConversationCard } from './conversation-card';

type ConversationListProps = {
  conversations: Conversation[];
  selectedConversationId: string | null | undefined;
  onSelectConversation: (conversation: Conversation) => void;
  onAcceptRequest: (conversationId: string) => void;
};

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onAcceptRequest,
}: ConversationListProps) {
  return (
    <div className="flex h-full flex-col bg-muted/50">
      <header className="border-b p-4">
        <h2 className="text-lg font-semibold">
          Active Chats ({conversations.length})
        </h2>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search chats..." className="pl-8" />
        </div>
      </header>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {conversations.map(convo => (
            <ConversationCard
              key={convo.id}
              conversation={convo}
              isSelected={convo.id === selectedConversationId}
              onSelect={() => onSelectConversation(convo)}
              onAcceptRequest={() => onAcceptRequest(convo.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
