
'use client';

import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { Appointment } from '@/app/counsellor/external/completed/page';

type ComplaintDialogProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    appointment: Appointment | null;
}

export function ComplaintDialog({ isOpen, setIsOpen, appointment }: ComplaintDialogProps) {
    const { toast } = useToast();
    const [message, setMessage] = useState('');

    const handleSendComplaint = () => {
        if (!message.trim()) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please describe the issue in detail.',
            });
            return;
        }

        // In a real app, you would submit this to a backend service.
        console.log('Complaint submitted:', {
            studentId: appointment?.studentId,
            university: appointment?.university,
            message: message,
        });

        toast({
            title: 'Complaint Sent',
            description: `Your complaint regarding Student ${appointment?.studentId} has been sent for review.`,
        });

        setMessage('');
        setIsOpen(false);
    }
    
    if (!appointment) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>File a Complaint</DialogTitle>
                    <DialogDescription>
                        Write your complaint regarding Student {appointment.studentId} from {appointment.university}. 
                        This will be sent to the admin of {appointment.university} for review.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="message">
                            Your Message
                        </Label>
                        <Textarea 
                            id="message" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Please describe the issue in detail..."
                            className="col-span-3"
                            rows={5}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSendComplaint}>Send Complaint</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
