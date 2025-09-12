
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { useApp } from "@/context/app-provider";

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😭', label: 'Crying' },
  { emoji: '😠', label: 'Angry' },
];

export function MoodJournal() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const { addJournalEntry } = useApp();

  const handleSubmit = () => {
    if (!selectedMood) return;
    addJournalEntry(selectedMood, journalEntry);
    setSelectedMood(null);
    setJournalEntry('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Check-in</CardTitle>
        <CardDescription>How are you feeling today? Log your mood and write a journal entry to earn coins.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-around">
          {moods.map(mood => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood.label)}
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
        <Textarea
          placeholder="What's on your mind? (Optional)"
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
        />
        <Button onClick={handleSubmit} disabled={!selectedMood}>
          Save Entry (+2 Coins)
        </Button>
      </CardContent>
    </Card>
  );
}
