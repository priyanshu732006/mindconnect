
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
import { Calendar as CalendarIcon, Phone, Coins } from 'lucide-react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApp } from '@/context/app-provider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const bookingSchema = z.object({
  counselor: z.string().min(1, 'Please select a counselor.'),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string().min(1, 'Please select a time slot.'),
  useCoins: z.boolean().default(false),
});

const onCampusCounselors = [
  { id: '1', name: 'Dr. Emily Carter' },
  { id: '2', name: 'Dr. Ben Richards' },
];

const externalCounselors = [
    { id: '3', name: 'Dr. Sarah Mitchell', specialty: 'Anxiety & Stress', avatar: 'https://picsum.photos/seed/ext1/100/100' },
    { id: '4', name: 'Dr. David Chen', specialty: 'Depression & CBT', avatar: 'https://picsum.photos/seed/ext2/100/100' },
    { id: '5', name: 'Dr. Maria Garcia', specialty: 'Trauma & PTSD', avatar: 'https://picsum.photos/seed/ext3/100/100' },
];

const helplines = [
  { name: 'National Suicide Prevention Lifeline', number: '988' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741' },
  { name: 'The Trevor Project', number: '1-866-488-7386' },
];

export default function BookingPage() {
  const { toast } = useToast();
  const { coins, setCoins } = useApp();
  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      useCoins: false,
    }
  });

  const coinDiscount = (coins * 0.5).toFixed(2);
  const useCoins = form.watch('useCoins');

  function onCampusSubmit(values: z.infer<typeof bookingSchema>) {
    let description = `Your on-campus session with ${values.counselor} on ${format(values.date, 'PPP')} at ${values.time} is confirmed.`;
    if(values.useCoins && coins > 0) {
        description += ` A discount of ₹${coinDiscount} has been applied. Remaining coins: 0.`;
        setCoins(0);
    }
    
    toast({
      title: 'Appointment Booked!',
      description,
    });
    form.reset();
  }
  
  function onExternalSubmit(counselorName: string) {
    toast({
      title: 'Booking Redirect',
      description: `You are being redirected to book with ${counselorName}. This is a demo feature.`,
    });
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Book a Session
        </h1>
        <p className="text-muted-foreground mt-2">
          Choose between confidential sessions with on-campus or external
          counselors.
        </p>
      </header>
      <Tabs defaultValue="on-campus" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="on-campus">On-Campus</TabsTrigger>
          <TabsTrigger value="external">External</TabsTrigger>
        </TabsList>
        <TabsContent value="on-campus" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Schedule an On-Campus Session</CardTitle>
                <CardDescription>Appointments are free and confidential for all students. You can use your coins for discounts on any fees.</CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onCampusSubmit)}>
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
                              {onCampusCounselors.map(c => (
                                <SelectItem key={c.id} value={c.name}>
                                  {c.name}
                                </SelectItem>
                              ))}
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
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={date =>
                                    date < new Date() ||
                                    date < new Date('1900-01-01')
                                  }
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
                                <SelectItem value="10:00 AM">
                                  10:00 AM
                                </SelectItem>
                                <SelectItem value="11:00 AM">
                                  11:00 AM
                                 </SelectItem>
                                <SelectItem value="02:00 PM">
                                  02:00 PM
                                </SelectItem>
                                <SelectItem value="03:00 PM">
                                  03:00 PM
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <Card className="bg-accent/50 border-dashed">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center gap-2"><Coins /> Rewards</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                         <p className="text-sm text-muted-foreground mb-4">You have {coins} coins available, which can be redeemed for a discount of ₹{coinDiscount}.</p>
                        <FormField
                            control={form.control}
                            name="useCoins"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Switch
                                            id="use-coins"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={coins === 0}
                                        />
                                    </FormControl>
                                     <Label htmlFor="use-coins" className={cn("font-normal", coins === 0 && "text-muted-foreground")}>
                                       Use my coins for a ₹{coinDiscount} discount
                                    </Label>
                                </FormItem>
                            )}
                        />
                      </CardContent>
                    </Card>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">
                        {useCoins ? `Book & Redeem (₹${coinDiscount} Off)`: 'Book On-Campus Appointment'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mental Health Helplines</CardTitle>
                  <CardDescription>
                    Immediate, confidential support is available 24/7.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {helplines.map(line => (
                      <li
                        key={line.name}
                        className="flex items-start gap-3"
                      >
                        <Phone className="h-5 w-5 mt-1 text-primary" />
                        <div>
                          <p className="font-semibold">{line.name}</p>
                          <p className="text-muted-foreground">
                            {line.number}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="external" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Find an External Therapist</CardTitle>
                    <CardDescription>
                        Browse professional therapists and book a session directly through their platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {externalCounselors.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={c.avatar} data-ai-hint="therapist headshot" />
                                    <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">{c.name}</p>
                                    <p className="text-sm text-muted-foreground">{c.specialty}</p>
                                </div>
                            </div>
                            <Button onClick={() => onExternalSubmit(c.name)}>Book Now</Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
