
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/app-provider';
import { TrustedContact } from '@/lib/types';
import { useEffect } from 'react';

const phoneRegex = new RegExp(
  /^(\+91)?[6-9]\d{9}$/
);

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relation: z.string().min(1, 'Relation is required'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid Indian phone number (e.g., +91XXXXXXXXXX)'),
});

type AddEditContactDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  contact?: TrustedContact;
};

export function AddEditContactDialog({
  isOpen,
  setIsOpen,
  contact,
}: AddEditContactDialogProps) {
  const { addContact, updateContact } = useApp();
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      relation: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (contact) {
      form.reset(contact);
    } else {
      form.reset({ name: '', relation: '', phone: '' });
    }
  }, [contact, form, isOpen]);

  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    if (contact) {
      updateContact({ ...contact, ...values });
    } else {
      addContact(values);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{contact ? 'Edit' : 'Add'} Trusted Contact</DialogTitle>
          <DialogDescription>
            Enter the details of the person you trust. This person will be contacted in a crisis.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relation</FormLabel>
                  <FormControl>
                    <Input placeholder="Mother" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91XXXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{contact ? 'Save Changes' : 'Add Contact'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
