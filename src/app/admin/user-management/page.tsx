
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
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/lib/types';
import { useLocale } from '@/context/locale-provider';

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
    const { t } = useLocale();

    const getRoleLabel = (role: UserRole) => {
        const key = role.replace('-', '') as keyof typeof t;
        return t[key] || role;
    }
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t.userManagement}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t.userManagementDesc}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{t.allUsers}</CardTitle>
          <CardDescription>{t.allUsersDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.role}</TableHead>
                <TableHead>{t.email}</TableHead>
                <TableHead>{t.lastLogin}</TableHead>
                <TableHead>{t.metrics}</TableHead>
                <TableHead>
                  <span className="sr-only">{t.actions}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{getRoleLabel(user.role)}</Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    {user.role === UserRole.student && `${t.engagement}: ${t[user.engagement.toLowerCase() as keyof typeof t] || user.engagement}`}
                    {user.role === UserRole.counsellor && `${t.bookings}: ${user.bookings}`}
                    {user.role === UserRole['peer-buddy'] && `${t.studentsSupported}: ${user.supported}`}
                    {user.role === UserRole.admin && `${t.activity}: ${t[user.engagement.toLowerCase() as keyof typeof t] || user.engagement}`}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t.toggleMenu}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
                        <DropdownMenuItem>{t.viewDetails}</DropdownMenuItem>
                        <DropdownMenuItem>{t.editUser}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">{t.suspendUser}</DropdownMenuItem>
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
