

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
import { Textarea } from '@/components/ui/textarea';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { sendSmsAction } from '@/app/actions';

type EscalateDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  student: User;
};

// In a real app, this would come from a database.
const ON_CAMPUS_COUNSELLOR_PHONE = '+919999999999'; // Example phone number

export function EscalateDialog({
  isOpen,
  setIsOpen,
  student,
}: EscalateDialogProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast({
        variant: 'destructive',
        title: 'Reason required',
        description: 'Please provide a reason for escalation.',
      });
      return;
    }

    setIsSending(true);
    const messageBody = `CRISIS ESCALATION for ${student.alias} (${student.id}). Reason: ${reason}. Please follow up immediately.`;

    const result = await sendSmsAction(ON_CAMPUS_COUNSELLOR_PHONE, messageBody);

    if (result.success) {
      toast({
        title: 'Escalation Successful',
        description:
          'The on-campus crisis team has been notified via SMS.',
      });
    } else {
        toast({
            variant: 'destructive',
            title: 'Escalation Failed',
            description: result.error || 'Could not send SMS. Please contact the crisis team directly.'
        });
    }
    
    setIsSending(false);
    setIsOpen(false);
    setReason('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escalate to Crisis Team</DialogTitle>
          <DialogDescription>
            You are about to send an urgent SMS to the on-campus crisis counselor regarding{' '}
            <strong>{student.alias}</strong>. Only use this for immediate safety
            concerns.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label htmlFor="reason" className="text-sm font-medium">
            Reason for Escalation
          </label>
          <Textarea
            id="reason"
            placeholder="Briefly describe why you are escalating this chat (e.g., mentions of self-harm, severe distress)..."
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isSending}
          >
            {isSending && <Loader2 className="mr-2 animate-spin" />}
            Send Urgent Alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
