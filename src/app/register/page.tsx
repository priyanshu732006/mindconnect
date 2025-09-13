
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTransition, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { FirebaseError } from "firebase/app";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const specializationItems = [
    { id: 'exam-stress', label: 'Exam Stress' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'study-pressure', label: 'Study Pressure' },
    { id: 'motivation', label: 'Motivation' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'homesickness', label: 'Homesickness' },
] as const;

const baseSchema = z.object({
    fullName: z.string().min(1, "Full name is required."),
    email: z.string().email("Please enter a valid college email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    role: z.nativeEnum(UserRole),
});

const studentSchema = baseSchema.extend({
    role: z.literal(UserRole.student),
    collegeName: z.string().min(1, "College name is required."),
    course: z.string().min(1, "Course is required."),
    year: z.string().min(1, "Year of study is required."),
    personalEmail: z.string().email("Please enter a valid personal email.").optional().or(z.literal('')),
    emergencyContactName: z.string().min(1, "Emergency contact name is required."),
    emergencyContactRelation: z.string().min(1, "Emergency contact relation is required."),
    emergencyContactPhone: z.string().min(1, "Emergency contact phone is required."),
    sleepHours: z.string().optional(),
    screenTimeHours: z.string().optional(),
});

const counsellorSchema = baseSchema.extend({
     role: z.literal(UserRole.counsellor),
     counsellorType: z.enum(['on-campus', 'external'], { required_error: "Please select counsellor type" }),
});

const peerBuddySchema = baseSchema.extend({
    role: z.literal(UserRole['peer-buddy']),
    collegeName: z.string().min(1, "College name is required for verification."),
    collegePhone: z.string().min(1, "College phone number is required for verification."),
    specializations: z.array(z.string()).refine(value => value.some(item => item), {
        message: "You have to select at least one specialization.",
    }),
});

const registerSchema = z.discriminatedUnion("role", [
    studentSchema,
    counsellorSchema,
    peerBuddySchema,
    baseSchema.extend({ role: z.literal(UserRole.admin) })
]);


export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const { register, user } = useAuth();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: UserRole.student,
      // @ts-expect-error
      collegeName: "",
      course: "",
      year: "",
      personalEmail: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
      sleepHours: "",
      screenTimeHours: "",
      specializations: [],
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    startTransition(async () => {
      try {
        let studentDetails;
        let counsellorType;
        let peerBuddyDetails;

        if (values.role === UserRole.student) {
          studentDetails = {
            collegeName: values.collegeName,
            course: values.course,
            year: values.year,
            personalEmail: values.personalEmail,
            emergencyContacts: [{
              name: values.emergencyContactName,
              relation: values.emergencyContactRelation,
              phone: values.emergencyContactPhone,
            }],
            lifestyle: {
              sleepHours: values.sleepHours,
              screenTimeHours: values.screenTimeHours,
            }
          };
        } else if (values.role === UserRole.counsellor) {
          counsellorType = values.counsellorType;
        } else if (values.role === UserRole['peer-buddy']) {
          peerBuddyDetails = {
            collegeName: values.collegeName,
            collegePhone: values.collegePhone,
            specializations: values.specializations,
          };
        }

        await register(values.email, values.password, values.fullName, values.role, { counsellorType, studentDetails, peerBuddyDetails });
        
        toast({
            title: "Registration Successful",
            description: "You can now log in with your new account.",
        });
        router.push("/login");
      } catch(error) {
        let description = "An unexpected error occurred. Please try again.";
        if (error instanceof FirebaseError) {
            switch(error.code) {
                case 'auth/email-already-in-use':
                    description = "This email is already registered."
                    break;
                case 'auth/weak-password':
                    description = "The password is too weak."
                    break;
                default:
                    description = "An error occurred during registration. Please try again."
            }
        } else if (error instanceof Error) {
            description = error.message;
        }
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: description,
        });
      }
    });
  };

  useEffect(() => {
    if (user) {
      router.push('/landing');
    }
  }, [user, router]);

  const watchedRole = form.watch("role");
  const emailLabel = watchedRole === UserRole.student || watchedRole === UserRole['peer-buddy'] ? 'College Email' : 'Email';
  const emailPlaceholder = watchedRole === UserRole.student || watchedRole === UserRole['peer-buddy'] ? 'user@college.edu' : 'user@example.com';

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md my-8">
        <CardHeader className="text-center">
          <Logo className="justify-center mb-2" />
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Join the hub to start your wellness journey.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                     <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>I am a...</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="counsellor">Counsellor</SelectItem>
                                        <SelectItem value="peer-buddy">Peer Buddy</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Alex Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{emailLabel}</FormLabel>
                                <FormControl>
                                    <Input placeholder={emailPlaceholder} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {watchedRole === UserRole.student && (
                        <>
                            <Separator className="my-6" />
                            <p className="text-sm font-medium text-muted-foreground">Student Details</p>
                             <FormField
                                control={form.control}
                                name="personalEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Personal Email (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="alex.doe@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="collegeName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>College Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="University of Example" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="course"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Computer Science" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Year of Study</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 2nd Year" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <Separator className="my-6" />
                             <p className="text-sm font-medium text-muted-foreground">Primary Emergency Contact</p>
                            <FormField
                                control={form.control}
                                name="emergencyContactName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact's Full Name</FormLabel>
                                        <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="emergencyContactRelation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Relation to You</FormLabel>
                                        <FormControl><Input placeholder="e.g., Mother, Friend" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="emergencyContactPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact's Phone Number</FormLabel>
                                        <FormControl><Input placeholder="+91XXXXXXXXXX" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator className="my-6" />
                             <p className="text-sm font-medium text-muted-foreground">Optional Lifestyle Info</p>
                             <FormField
                                control={form.control}
                                name="sleepHours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Avg. Hours of Sleep per Night</FormLabel>
                                        <FormControl><Input type="number" placeholder="e.g., 7" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="screenTimeHours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Avg. Daily Screen Time (hours)</FormLabel>
                                        <FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    
                    {watchedRole === UserRole['peer-buddy'] && (
                        <>
                             <Separator className="my-6" />
                             <p className="text-sm font-medium text-muted-foreground">Peer Buddy Verification</p>
                             <FormField
                                control={form.control}
                                name="collegeName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>College Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="University of Example" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="collegePhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>College Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+91XXXXXXXXXX" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator className="my-6" />
                            <FormField
                                control={form.control}
                                name="specializations"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">Areas of Specialization</FormLabel>
                                            <FormMessage />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                        {specializationItems.map((item) => (
                                            <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="specializations"
                                            render={({ field }) => {
                                                return (
                                                <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.label)}
                                                        onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), item.label])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                (value) => value !== item.label
                                                                )
                                                            )
                                                        }}
                                                    />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                    {item.label}
                                                    </FormLabel>
                                                </FormItem>
                                                )
                                            }}
                                            />
                                        ))}
                                        </div>
                                    </FormItem>
                                )}
                                />
                        </>
                    )}

                    {watchedRole === UserRole.counsellor && (
                         <FormField
                            control={form.control}
                            name="counsellorType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Counsellor Type</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="on-campus" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                        On-Campus Counsellor
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="external" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                        External Counsellor
                                        </FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Register
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="underline hover:text-primary">
                        Login here
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}

    