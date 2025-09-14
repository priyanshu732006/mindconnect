
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
import { useLocale } from '@/context/locale-provider';

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
    onIssueResolved: (issueId: string, resolution: string) => void;
}

export function ResolveIssueDialog({ isOpen, setIsOpen, issue, onIssueResolved }: ResolveIssueDialogProps) {
    const { toast } = useToast();
    const [action, setAction] = useState('');
    const { t } = useLocale();

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
                title: t.actionRequired,
                description: t.actionRequiredDesc,
            });
            return;
        }

        if (issue) {
            toast({
                title: t.issueResolved,
                description: t.issueResolvedDesc.replace('{issueId}', issue.id),
            });
            
            onIssueResolved(issue.id, action);
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t.resolveIssue}</DialogTitle>
                    <DialogDescription>
                       {t.resolveIssueDesc}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="action" className="text-right">
                            {t.action}
                        </Label>
                        <Textarea 
                            id="action" 
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            placeholder={t.resolutionStepsPlaceholder}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>{t.cancel}</Button>
                    <Button onClick={handleSubmit}>{t.submit}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

    