
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLocale } from '@/context/locale-provider';
import { Calendar } from 'lucide-react';

const waitlistedStudents = [
  {
    id: 'student1',
    studentId: '#4455',
    university: 'Princeton University',
    note: 'I expect to have openings next week. Please check back on Monday.',
    timestamp: '2 days ago',
  },
  {
    id: 'student2',
    studentId: '#6677',
    university: 'Cornell University',
    note: 'My schedule is currently full. I will reach out if a spot opens up.',
    timestamp: '4 days ago',
  },
  {
    id: 'student3',
    studentId: '#1011',
    university: 'Dartmouth College',
    note: 'Just put on the waitlist yesterday.',
    timestamp: '1 day ago',
  },
  {
    id: 'student4',
    studentId: '#1415',
    university: 'Duke University',
    note: 'Added today, should be visible.',
    timestamp: '35 minutes ago',
  },
];

export default function WaitlistedPage() {
    const { t } = useLocale();
  return (
    <div className="space-y-8">
       <header>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                {t.waitlistedAppointments}
            </h1>
            <p className="mt-2 text-muted-foreground">
                {t.waitlistedAppointmentsDescExternal}
            </p>
       </header>

      <div className="space-y-6">
        {waitlistedStudents.map(student => (
          <Card key={student.id}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {t.studentId.replace('{id}', student.studentId)}
                </h3>
                <p className="text-sm text-muted-foreground">{student.university}</p>
                <p className="mt-4 text-muted-foreground italic">"{student.note}"</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <p className="text-xs text-muted-foreground">{student.timestamp}</p>
                 <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  {t.schedule}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
