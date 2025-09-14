
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
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Bed, Monitor } from 'lucide-react';
import { DailyCheckinData } from '@/lib/types';

const checkinSchema = z.object({
  mood: z.string().min(1, { message: 'Please select a mood.' }),
  journalEntry: z.string().optional(),
  sleepHours: z.number().min(0).max(24),
  screenTimeHours: z.number().min(0).max(24),
});

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😭', label: 'Crying' },
  { emoji: '😠', label: 'Angry' },
];

type DailyCheckinDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function DailyCheckinDialog({
  isOpen,
  setIsOpen,
}: DailyCheckinDialogProps) {
  const { addJournalEntry } = useApp();
  const form = useForm<z.infer<typeof checkinSchema>>({
    resolver: zodResolver(checkinSchema),
    defaultValues: {
      journalEntry: '',
      sleepHours: 8,
      screenTimeHours: 5,
    },
  });

  const selectedMood = form.watch('mood');
  const sleepHours = form.watch('sleepHours');
  const screenTimeHours = form.watch('screenTimeHours');
  
  const setCheckinTimestamp = () => {
    localStorage.setItem('lastDailyCheckin', new Date().toISOString());
  }

  const onSubmit = (values: z.infer<typeof checkinSchema>) => {
    addJournalEntry(values as DailyCheckinData);
    form.reset();
    setIsOpen(false);
  };
  
  const handleClose = (open: boolean) => {
      if (!open) {
          // If user closes dialog without submitting, mark as checked in to prevent it from popping up again today
          setCheckinTimestamp();
      }
      setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your Daily Check-in</DialogTitle>
          <DialogDescription>
            Take a moment to reflect on your day. This helps in calculating your well-being score.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
                control={form.control}
                name="mood"
                render={() => (
                    <FormItem>
                    <FormLabel>How are you feeling today?</FormLabel>
                     <div className="flex justify-around py-2">
                        {moods.map(mood => (
                            <button
                            type="button"
                            key={mood.label}
                            onClick={() => form.setValue('mood', mood.label, { shouldValidate: true })}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-lg text-4xl transition-transform duration-200 hover:scale-110",
                                selectedMood === mood.label ? 'bg-accent scale-110' : ''
                            )}
                            >
                            <span>{mood.emoji}</span>
                            <span className="text-xs text-muted-foreground">{mood.label}</span>
                            </button>
                        ))}
                        </div>
                     <FormMessage />
                    </FormItem>
                )}
            />
            
            <FormField
              control={form.control}
              name="journalEntry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's on your mind? (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Feel free to write anything..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="sleepHours"
                render={({ field }) => (
                    <FormItem>
                        <Label htmlFor="sleep-slider" className="flex items-center gap-2"><Bed /> Sleep Hours: <span className="font-bold">{sleepHours} hrs</span></Label>
                         <FormControl>
                            <Slider
                                id="sleep-slider"
                                min={0}
                                max={12}
                                step={0.5}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                            />
                         </FormControl>
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="screenTimeHours"
                render={({ field }) => (
                    <FormItem>
                        <Label htmlFor="screen-time-slider" className="flex items-center gap-2"><Monitor /> Screen Time: <span className="font-bold">{screenTimeHours} hrs</span></Label>
                        <FormControl>
                             <Slider
                                id="screen-time-slider"
                                min={0}
                                max={16}
                                step={0.5}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="submit">Save Entry & Get Score (+2 Coins)</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
