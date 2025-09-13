
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Shield } from 'lucide-react';

const completedAppointments = [
  {
    id: 'appt1',
    studentId: '#3456',
    university: 'University of Chicago',
    avatar: 'https://picsum.photos/seed/student4/100/100',
    dateTime: 'Thursday, September 11, 2025 at 9:47 PM',
  },
  {
    id: 'appt2',
    studentId: '#7890',
    university: 'University of Pennsylvania',
    avatar: 'https://picsum.photos/seed/student5/100/100',
    dateTime: 'Wednesday, September 10, 2025 at 9:47 PM',
  },
];

export default function CompletedAppointmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Completed Appointments
      </h1>
      <p className="mt-2 text-gray-500">
        A list of all your past sessions.
      </p>

      <Card className="mt-8">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Student</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedAppointments.map(appt => (
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
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">Completed</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Shield className="mr-2 h-4 w-4" />
                      Complaint
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
