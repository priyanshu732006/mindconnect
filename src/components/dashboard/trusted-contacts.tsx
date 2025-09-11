import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';

const contacts = [
  { name: 'Jane Doe', relation: 'Mother', avatar: 'https://picsum.photos/seed/contact1/100/100' },
  { name: 'John Smith', relation: 'Friend', avatar: 'https://picsum.photos/seed/contact2/100/100' },
];

export function TrustedContacts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trusted Contacts</CardTitle>
        <CardDescription>
          These contacts will be notified in a crisis situation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map(contact => (
            <div key={contact.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={contact.avatar} data-ai-hint="person avatar" />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.relation}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" /> Add New Contact
        </Button>
      </CardFooter>
    </Card>
  );
}
