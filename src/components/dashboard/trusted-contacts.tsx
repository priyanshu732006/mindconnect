
'use client';

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
import { MoreVertical, UserPlus } from 'lucide-react';
import { useApp } from '@/context/app-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { AddEditContactDialog } from './add-edit-contact-dialog';
import { useState } from 'react';
import { TrustedContact } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

export function TrustedContacts() {
  const { trustedContacts, deleteContact } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<
    TrustedContact | undefined
  >(undefined);

  const handleEdit = (contact: TrustedContact) => {
    setSelectedContact(contact);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedContact(undefined);
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Trusted Contacts</CardTitle>
          <CardDescription>
            These contacts will be notified in a crisis situation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trustedContacts.map(contact => (
              <div
                key={contact.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={contact.avatar}
                      data-ai-hint="person avatar"
                    />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.relation}
                    </p>
                  </div>
                </div>
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(contact)}>
                        Edit
                      </DropdownMenuItem>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {contact.name} from your
                        trusted contacts.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteContact(contact.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={handleAdd}>
            <UserPlus className="mr-2 h-4 w-4" /> Add New Contact
          </Button>
        </CardFooter>
      </Card>
      <AddEditContactDialog
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        contact={selectedContact}
      />
    </>
  );
}
