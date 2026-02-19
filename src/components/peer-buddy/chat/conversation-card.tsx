

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, UserPlus } from 'lucide-react';

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

  const isPending = requestStatus === 'pending';

  return (
    <Card
      onClick={onSelect}
      className={cn(
        'cursor-pointer transition-all hover:bg-card',
        isSelected ? 'border-primary bg-primary/5' : 'bg-transparent shadow-none border-border',
        isPending && 'border-orange-300 bg-orange-50/50 dark:bg-orange-950/20 shadow-sm'
      )}
    >
      <div className="p-4">
        {/* Header with Avatar and Student Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className={cn(isPending && 'ring-2 ring-orange-400 ring-offset-2')}>
                <AvatarImage src={participant.avatar} />
                <AvatarFallback>{participant.alias.slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isPending && (
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center">
                  <Clock className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{participant.alias}</p>
                {isPending && (
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800">
                    <UserPlus className="h-3 w-3 mr-1" />
                    New Request
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Student ID: {participant.id.slice(0, 8)}...</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-6 w-6 justify-center rounded-full">
              {unreadCount}
            </Badge>
          )}
        </div>

        {/* Last Message Preview */}
        <p className="mt-3 text-sm text-muted-foreground truncate">{lastMessage}</p>
        
        {/* Timestamp and Status */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{lastMessageTimestamp}</span>
          <span className={cn('font-semibold', statusColors[status])}>
            {status}
          </span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {isPending ? (
          <Button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onAcceptRequest(); 
            }} 
            className="mt-3 w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800"
            size="lg"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Accept Student Request
          </Button>
        ) : (
          <div className="mt-3 w-full rounded-md bg-green-100 dark:bg-green-950 px-3 py-2 flex items-center justify-center gap-2 text-sm font-medium text-green-800 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            Chat Active
          </div>
        )}
      </div>
    </Card>
  );
}
