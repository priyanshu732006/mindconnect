
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Waitlisted Appointments
      </h1>
      <p className="mt-2 text-gray-500">
        Students who are waiting for an available slot. Appointments are
        automatically removed after one week.
      </p>

      <div className="mt-8 space-y-6">
        {waitlistedStudents.map(student => (
          <Card key={student.id} className="shadow-sm">
            <CardContent className="p-6 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Student {student.studentId}
                  </h3>
                  <p className="text-sm text-gray-500">{student.university}</p>
                </div>
                <p className="text-xs text-gray-400">{student.timestamp}</p>
              </div>
              <p className="mt-4 text-gray-600 italic">"{student.note}"</p>
              <div className="absolute bottom-6 right-6">
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
