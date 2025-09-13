

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';

type ConversationCardProps = {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
  onAcceptRequest: () => void;
};

const statusColors = {
  improving: 'text-green-600',
  stable: 'text-yellow-600',
  declining: 'text-red-600',
};

export function ConversationCard({
  conversation,
  isSelected,
  onSelect,
  onAcceptRequest,
}: ConversationCardProps) {
  const {
    participant,
    lastMessage,
    lastMessageTimestamp,
    unreadCount,
    status,
    tags,
    requestStatus,
  } = conversation;

  return (
    <Card
      onClick={onSelect}
      className={cn(
        'cursor-pointer transition-all hover:bg-card',
        isSelected ? 'border-primary bg-primary/5' : 'bg-transparent shadow-none border-border'
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={participant.avatar} />
              <AvatarFallback>{participant.alias.slice(0,2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{participant.alias}</p>
              <p className="text-xs text-muted-foreground">{participant.id}</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-6 w-6 justify-center rounded-full">
              {unreadCount}
            </Badge>
          )}
        </div>
        <p className="mt-3 text-sm text-muted-foreground truncate">{lastMessage}</p>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{lastMessageTimestamp}</span>
          <span className={cn('font-semibold', statusColors[status])}>
            {status}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        {requestStatus === 'pending' && (
          <Button onClick={(e) => { e.stopPropagation(); onAcceptRequest(); }} className="mt-3 w-full">
            Accept student's request
          </Button>
        )}
         {requestStatus === 'accepted' && (
            <div className="mt-3 w-full rounded-md bg-green-100 px-3 py-2 text-center text-sm font-medium text-green-800">
                Accepted
            </div>
        )}
      </div>
    </Card>
  );
}
