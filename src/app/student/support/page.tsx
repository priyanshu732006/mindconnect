
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// Placeholder data for peer buddies
const peerBuddies = [
  {
    id: '1',
    name: 'Rohan Joshi',
    avatarSeed: 'buddy1',
    specializations: ['Exam Stress', 'Anxiety', 'Study Pressure'],
  },
  {
    id: '2',
    name: 'Isha Verma',
    avatarSeed: 'buddy2',
    specializations: ['Homesickness', 'Relationships', 'Time Management'],
  },
  {
    id: '3',
    name: 'Kabir Khan',
    avatarSeed: 'buddy3',
    specializations: ['Social Anxiety', 'Motivation', 'Career Doubts'],
  },
  {
    id: '4',
    name: 'Mira Nair',
    avatarSeed: 'buddy4',
    specializations: ['Depression', 'Coping Skills', 'General Chat'],
  },
];

export default function SupportPage() {
  const { toast } = useToast();
  const [requestedBuddies, setRequestedBuddies] = useState<string[]>([]);

  const handleSendRequest = (buddyId: string, buddyName: string) => {
    setRequestedBuddies([...requestedBuddies, buddyId]);
    toast({
      title: 'Request Sent!',
      description: `Your request to connect with ${buddyName} has been sent.`,
    });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Find a Peer Buddy
        </h1>
        <p className="text-muted-foreground mt-2">
          Connect with a trained peer who can relate to what you're going
          through. All conversations are confidential.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {peerBuddies.map(buddy => {
          const isRequested = requestedBuddies.includes(buddy.id);
          return (
            <Card key={buddy.id} className="flex flex-col">
              <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src={`https://picsum.photos/seed/${buddy.avatarSeed}/200/200`}
                    alt={buddy.name}
                    data-ai-hint="student portrait"
                  />
                  <AvatarFallback>{buddy.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{buddy.name}</CardTitle>
                <CardDescription>Peer Buddy</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm font-medium mb-2 text-center">
                  Can help with:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {buddy.specializations.map(spec => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleSendRequest(buddy.id, buddy.name)}
                  disabled={isRequested}
                >
                  {isRequested ? 'Request Sent' : 'Send Request'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
