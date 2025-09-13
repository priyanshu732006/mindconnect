
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import { allUsers, User } from '@/lib/data';

// Initial state with some pending requests
const initialRequests: User[] = allUsers.slice(0, 3);

export default function RequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const { toast } = useToast();

  const handleResponse = (
    student: User,
    action: 'accepted' | 'rejected'
  ) => {
    setRequests(prev => prev.filter(req => req.id !== student.id));
    toast({
      title: `Request ${action}`,
      description: `You have ${action} the connection request from ${student.alias}.`,
    });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Connection Requests
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and respond to students who want to connect with you.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            You have {requests.length} pending student requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requests.length > 0 ? (
            requests.map(student => (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <Avatar>
                    <AvatarFallback>{student.alias.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{student.alias}</p>
                    <p className="text-sm text-muted-foreground">
                      Wants to connect with you.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button
                    size="sm"
                    onClick={() => handleResponse(student, 'accepted')}
                  >
                    <Check className="mr-2 h-4 w-4" /> Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleResponse(student, 'rejected')}
                  >
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>No pending requests at the moment.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
