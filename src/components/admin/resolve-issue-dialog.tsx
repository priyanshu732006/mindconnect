
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

type Issue = {
    id: string;
    raisedBy: string;
    raiserRole: string;
    raisedAgainst: string;
    againstRole: string;
    description: string;
    status: string;
} | null;


type ResolveIssueDialogProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    issue: Issue;
    onIssueResolved: (issueId: string) => void;
}

export function ResolveIssueDialog({ isOpen, setIsOpen, issue, onIssueResolved }: ResolveIssueDialogProps) {
    const { toast } = useToast();
    const [action, setAction] = useState('');

    useEffect(() => {
        // Reset action when dialog opens for a new issue
        if(isOpen) {
            setAction('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!action.trim()) {
            toast({
                variant: 'destructive',
                title: 'Action required',
                description: 'Please describe the action taken.',
            });
            return;
        }

        if (issue) {
            console.log({
                issueId: issue.id,
                resolution: action,
            });
            
            toast({
                title: 'Issue Resolved',
                description: `The issue (${issue.id}) has been marked as resolved.`,
            });
            
            onIssueResolved(issue.id);
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Resolve Issue</DialogTitle>
                    <DialogDescription>
                       What action was taken to resolve this issue?
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="action" className="text-right">
                            Action
                        </Label>
                        <Textarea 
                            id="action" 
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            placeholder="Describe the resolution steps..."
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
