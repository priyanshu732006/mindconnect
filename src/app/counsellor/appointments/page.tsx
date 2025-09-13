
'use client';

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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Placeholder Data
const upcomingAppointments = [
  { id: 1, student: 'Emily White', date: '2024-08-16', time: '02:30 PM', status: 'Pending' },
  { id: 2, student: 'Jessica Miller', date: '2024-08-15', time: '11:30 AM', status: 'Pending' },
  { id: 3, student: 'Sarah Brown', date: '2024-08-17', time: '09:00 AM', status: 'Pending' },
];

const pendingPhysicalMeets = [
  { id: 1, student: 'Laura Green', date: '2024-08-20', time: '11:00 AM', status: 'Pending Meet', message: 'Confirmed. Looking forward to our session.' },
  { id: 2, student: 'David Clark', date: '2024-08-21', time: '03:00 PM', status: 'Pending Meet', message: 'See you on Wednesday.' },
];

const waitlistedAppointments = [
  { id: 1, student: 'Olivia Martinez', date: '2024-08-22', time: '10:00 AM', status: 'Waitlisted', message: 'I am available next Monday at 2 PM. Please let me know if that works.' },
];

const completedAppointments = [
  { id: 1, student: 'Robert Wilson', date: '2024-08-12', time: '03:00 PM', status: 'Completed', message: 'Appointment confirmed. See you then!' },
  { id: 2, student: 'Michael Johnson', date: '2024-08-10', time: '01:00 PM', status: 'Completed', message: 'Thanks for the session!' },
];

export default function AppointmentsPage() {
    const { toast } = useToast();

    const handleAccept = (studentName: string) => {
        toast({ title: 'Appointment Accepted', description: `Appointment with ${studentName} has been confirmed.` });
    };
    
    const handleWaitlist = (studentName: string) => {
        toast({ title: 'Added to Waitlist', description: `${studentName} has been added to the waiting list.` });
    };

    const handleMarkAsCompleted = (studentName: string) => {
        toast({ title: 'Marked as Completed', description: `Appointment with ${studentName} is now complete.` });
    };
    
    const handleMoveToPending = (studentName: string) => {
        toast({ title: 'Moved to Pending', description: `${studentName} has been moved to pending physical meets.` });
    };

    const handleDelete = (studentName: string) => {
        toast({ title: 'Appointment Archived', description: `The completed appointment with ${studentName} has been archived.` });
    };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Appointments
        </h1>
      </header>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>
            These appointments are awaiting your confirmation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingAppointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">{appt.student}</TableCell>
                  <TableCell>{appt.date}</TableCell>
                  <TableCell>{appt.time}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{appt.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" onClick={() => handleAccept(appt.student)}>Accept</Button>
                    <Button variant="secondary" size="sm" onClick={() => handleWaitlist(appt.student)}>Add to waiting list</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Physical Meet */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Physical Meet</CardTitle>
          <CardDescription>
            These appointments have been accepted and are scheduled for a physical meeting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingPhysicalMeets.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">{appt.student}</TableCell>
                  <TableCell>{appt.date}</TableCell>
                  <TableCell>{appt.time}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-blue-600 border-blue-200 bg-blue-50">{appt.status}</Badge>
                  </TableCell>
                  <TableCell>{appt.message}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleMarkAsCompleted(appt.student)}>Mark as Completed</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Waitlisted Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Waitlisted Appointments</CardTitle>
          <CardDescription>
            These students are on the waiting list for an appointment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Original Date</TableHead>
                <TableHead>Original Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waitlistedAppointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">{appt.student}</TableCell>
                  <TableCell>{appt.date}</TableCell>
                  <TableCell>{appt.time}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-yellow-600 border-yellow-200 bg-yellow-50">{appt.status}</Badge>
                  </TableCell>
                  <TableCell>{appt.message}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleMoveToPending(appt.student)}>Move to Pending Meet</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Completed Appointments */}
       <Card>
        <CardHeader>
          <CardTitle>Completed Appointments</CardTitle>
          <CardDescription>
            A log of all completed appointments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedAppointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">{appt.student}</TableCell>
                  <TableCell>{appt.date}</TableCell>
                  <TableCell>{appt.time}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-green-600 border-green-200 bg-green-50">{appt.status}</Badge>
                  </TableCell>
                  <TableCell>{appt.message}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(appt.student)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
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
