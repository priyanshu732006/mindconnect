
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Video } from 'lucide-react';

const scheduledAppointments = [
  {
    id: 'appt1',
    studentId: '#1234',
    university: 'Harvard University',
    avatar: 'https://picsum.photos/seed/student1/100/100',
    dateTime: 'Tuesday, September 16, 2025 at 9:47 PM',
  },
  {
    id: 'appt2',
    studentId: '#5678',
    university: 'Yale University',
    avatar: 'https://picsum.photos/seed/student2/100/100',
    dateTime: 'Tuesday, September 16, 2025 at 11:47 PM',
  },
  {
    id: 'appt3',
    studentId: '#9012',
    university: 'Columbia University',
    avatar: 'https://picsum.photos/seed/student3/100/100',
    dateTime: 'Wednesday, September 17, 2025 at 9:47 PM',
  },
];

export default function ScheduledAppointmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Scheduled Appointments
      </h1>
      <p className="mt-2 text-gray-500">
        A list of all your upcoming sessions.
      </p>

      <Card className="mt-8">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Student</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledAppointments.map(appt => (
                <TableRow key={appt.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={appt.avatar} data-ai-hint="student avatar" />
                        <AvatarFallback>
                          {appt.university.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          Student {appt.studentId} from {appt.university}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appt.university}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{appt.dateTime}</TableCell>
                  <TableCell className="text-right">
                    <Button>
                      <Video className="mr-2 h-4 w-4" />
                      Start Meeting
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
