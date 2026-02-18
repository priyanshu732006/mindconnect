

'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Search, Bell } from 'lucide-react';
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
  // Separate pending and accepted conversations
  const pendingRequests = conversations.filter(c => c.requestStatus === 'pending');
  const activeChats = conversations.filter(c => c.requestStatus === 'accepted');

  return (
    <div className="flex h-full flex-col bg-muted/50">
      <header className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Student Conversations
          </h2>
          {pendingRequests.length > 0 && (
            <Badge variant="destructive" className="gap-1">
              <Bell className="h-3 w-3" />
              {pendingRequests.length} New
            </Badge>
          )}
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search chats..." className="pl-8" />
        </div>
      </header>
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {/* Pending Requests Section */}
          {pendingRequests.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <Bell className="h-4 w-4 text-orange-600" />
                <h3 className="text-sm font-semibold text-orange-600">
                  Pending Requests ({pendingRequests.length})
                </h3>
              </div>
              {pendingRequests.map(convo => (
                <ConversationCard
                  key={convo.id}
                  conversation={convo}
                  isSelected={convo.id === selectedConversationId}
                  onSelect={() => onSelectConversation(convo)}
                  onAcceptRequest={() => onAcceptRequest(convo.id)}
                />
              ))}
            </div>
          )}

          {/* Active Chats Section */}
          {activeChats.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground px-2">
                Active Chats ({activeChats.length})
              </h3>
              {activeChats.map(convo => (
                <ConversationCard
                  key={convo.id}
                  conversation={convo}
                  isSelected={convo.id === selectedConversationId}
                  onSelect={() => onSelectConversation(convo)}
                  onAcceptRequest={() => onAcceptRequest(convo.id)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground">
                No conversation requests yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Students will appear here when they request to connect
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
