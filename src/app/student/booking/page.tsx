
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, Phone } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const bookingSchema = z.object({
  counselor: z.string().min(1, 'Please select a counselor.'),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string().min(1, 'Please select a time slot.'),
});

const helplines = [
    { name: 'National Suicide Prevention Lifeline', number: '988' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741' },
    { name: 'The Trevor Project', number: '1-866-488-7386' },
];

export default function BookingPage() {
    const { toast } = useToast();
  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
  });

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    toast({
        title: 'Appointment Booked!',
        description: `Your session with ${values.counselor} on ${format(values.date, "PPP")} at ${values.time} is confirmed.`
    })
    form.reset();
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Book an Appointment
        </h1>
        <p className="text-muted-foreground mt-2">
          Schedule a confidential session with an on-campus counselor.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Schedule a Session</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="counselor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Counselor</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a counselor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Dr. Emily Carter">
                            Dr. Emily Carter
                          </SelectItem>
                          <SelectItem value="Dr. Ben Richards">
                            Dr. Ben Richards
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={date => date < new Date() || date < new Date('1900-01-01')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time slot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                            <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                            <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                            <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Book Appointment</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Mental Health Helplines</CardTitle>
                    <CardDescription>Immediate, confidential support is available 24/7.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {helplines.map(line => (
                            <li key={line.name} className="flex items-start gap-3">
                                <Phone className="h-5 w-5 mt-1 text-primary"/>
                                <div>
                                    <p className="font-semibold">{line.name}</p>
                                    <p className="text-muted-foreground">{line.number}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
