
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
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/context/locale-provider';

// Placeholder data for crisis alerts
const crisisAlertsData = [
  {
    id: '1',
    studentName: 'Alex Martinez',
    wellbeingScore: 9,
    reason:
      'AI analysis of chat logs and text analysis indicates a high probability of self-harm intent. Keywords like "hopelessness" and "isolation" detected.',
  },
  {
    id: '2',
    studentName: 'Samantha Green',
    wellbeingScore: 7,
    reason:
      'Sudden withdrawal from social activities and dropping grades. Recent posts on social media show signs of depression.',
  },
  {
    id: '3',
    studentName: 'Tom Baker',
    wellbeingScore: 10,
    reason:
      'Multiple missed classes and assignments. Expressed feelings of being overwhelmed and unable to cope in a conversation with a peer buddy.',
  },
];

export default function CrisisAlertsPage() {
  const { toast } = useToast();
  const { t } = useLocale();

  const handleActionTaken = (studentName: string) => {
    toast({
      title: t.actionLogged,
      description: t.actionLoggedDesc.replace('{studentName}', studentName),
    });
  };

  const handleContact = (studentName: string) => {
    toast({
        title: t.contactingStudent,
        description: t.contactingStudentDesc.replace('{studentName}', studentName),
    });
  };


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t.crisisAlerts}
        </h1>
      </header>
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle />
            {t.crisisAlerts}
          </CardTitle>
          <CardDescription className="!text-destructive/80">
            {t.crisisAlertsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">{t.student}</TableHead>
                  <TableHead className="w-[150px]">{t.wellbeingScore}</TableHead>
                  <TableHead>{t.reasonForAlert}</TableHead>
                  <TableHead className="text-right w-[250px]">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crisisAlertsData.map(alert => (
                  <TableRow key={alert.id} className="hover:bg-destructive/10">
                    <TableCell className="font-medium">
                      {alert.studentName}
                    </TableCell>
                    <TableCell className="font-bold text-destructive">
                      {alert.wellbeingScore}/100
                    </TableCell>
                    <TableCell>{alert.reason}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="destructive" size="sm" onClick={() => handleContact(alert.studentName)}>
                        <Phone className="mr-2 h-4 w-4" />
                        {t.contact}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActionTaken(alert.studentName)}
                      >
                        {t.actionTaken}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
