
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
import { getWellbeingCategory } from '@/lib/utils';
import Link from 'next/link';

// Placeholder data
const crisisAlerts = [
  { id: '1', studentName: 'Rohan Mehra', score: 8, time: '2 minutes ago', status: 'New' },
  { id: '2', studentName: 'Anjali Desai', score: 12, time: '15 minutes ago', status: 'Contacted' },
  { id: '3', studentName: 'Karan Singh', score: 5, time: '1 hour ago', status: 'Resolved' },
];

export default function CrisisMonitoringPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Crisis Monitoring
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and manage real-time crisis alerts for students.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>
            Students flagged as being in a crisis state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Well-being Score</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crisisAlerts.map((alert) => {
                  const category = getWellbeingCategory(alert.score);
                  return (
                     <TableRow key={alert.id} className={alert.status === 'New' ? 'bg-destructive/10' : ''}>
                        <TableCell className="font-medium">{alert.studentName}</TableCell>
                        <TableCell>
                            <span className={`font-bold ${category.colorClass}`}>{alert.score} ({category.name})</span>
                        </TableCell>
                        <TableCell>{alert.time}</TableCell>
                        <TableCell>
                            <Badge variant={alert.status === 'New' ? 'destructive' : 'outline'}>
                                {alert.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/user-management/${alert.id}`}>View Details</Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                  )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
