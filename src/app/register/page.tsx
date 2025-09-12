
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


const registerSchema = z.object({
    fullName: z.string().min(1, "Full name is required."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    role: z.nativeEnum(UserRole),
    counsellorType: z.enum(['on-campus', 'external']).optional(),
}).refine(data => {
    if (data.role === UserRole.counsellor) {
        return !!data.counsellorType;
    }
    return true;
}, {
    message: "Please select counsellor type",
    path: ["counsellorType"],
});

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
    },
  });

  const watchedRole = form.watch("role");

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    startTransition(async () => {
      try {
        await register(values.email, values.password, values.fullName, values.role, values.counsellorType);
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
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="student@university.edu" {...field} />
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
