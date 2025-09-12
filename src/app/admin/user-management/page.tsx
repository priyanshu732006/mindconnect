
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
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/lib/types';

// Placeholder data - in a real app, this would come from your database
const users = [
  { id: '1', name: 'Aarav Sharma', role: UserRole.student, email: 'aarav.sharma@university.edu', lastLogin: '2 hours ago', engagement: 'High' },
  { id: '2', name: 'Dr. Priya Singh', role: UserRole.counsellor, email: 'priya.singh@university.edu', lastLogin: '1 day ago', bookings: 22 },
  { id: '3', name: 'Rohan Joshi', role: UserRole['peer-buddy'], email: 'rohan.joshi@university.edu', lastLogin: '30 minutes ago', supported: 15 },
  { id: '4', name: 'Sanya Gupta', role: UserRole.student, email: 'sanya.gupta@university.edu', lastLogin: '3 days ago', engagement: 'Low' },
  { id: '5', name: 'Vikram Reddy', role: UserRole.admin, email: 'vikram.reddy@university.edu', lastLogin: '5 minutes ago', engagement: 'High' },
  { id: '6', name: 'Isha Verma', role: UserRole['peer-buddy'], email: 'isha.verma@university.edu', lastLogin: '5 hours ago', supported: 8 },
];

export default function UserManagementPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          User Management
        </h1>
        <p className="text-muted-foreground mt-2">
          View, manage, and track activity for all users across the platform.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Metrics</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{user.role.replace('-', ' ')}</Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    {user.role === UserRole.student && `Engagement: ${user.engagement}`}
                    {user.role === UserRole.counsellor && `Bookings: ${user.bookings}`}
                    {user.role === UserRole['peer-buddy'] && `Students Supported: ${user.supported}`}
                    {user.role === UserRole.admin && `Activity: ${user.engagement}`}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
