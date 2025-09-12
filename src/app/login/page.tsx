
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
import { useTransition, useEffect, useState } from "react";
import { Loader2, ArrowRight, User, Briefcase, Users, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required."),
    role: z.nativeEnum(UserRole, { errorMap: () => ({ message: "Please select a role to continue." }) }),
});

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { login, user } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    form.setValue("role", role);
  }

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      try {
        await login(values.email, values.password, values.role);
        router.push('/');
      } catch (error) {
        let description = "An unexpected error occurred. Please try again.";
        if (error instanceof FirebaseError) {
            switch(error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    description = "Invalid email or password."
                    break;
                case 'auth/custom-error':
                    description = (error as any).customData._tokenResponse.error.message;
                    break;
                default:
                    description = "An error occurred during login. Please try again."
            }
        } else if (error instanceof Error) {
            description = error.message;
        }

        toast({
          variant: "destructive",
          title: "Login Failed",
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
  
  const roleConfig = {
      [UserRole.student]: { icon: User, label: "Student" },
      [UserRole.counsellor]: { icon: Briefcase, label: "Counsellor" },
      [UserRole['peer-buddy']]: { icon: Users, label: "Peer Buddy" },
      [UserRole.admin]: { icon: UserCog, label: "Admin" },
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Logo className="justify-center mb-2" />
          <CardTitle>Login to Your Account</CardTitle>
           {!selectedRole && (
                <CardDescription>
                    Please select your role to continue.
                </CardDescription>
           )}
           {selectedRole && (
                <CardDescription>
                    Logging in as a <span className="font-bold capitalize">{selectedRole.replace('-', ' ')}</span>.
                </CardDescription>
           )}
        </CardHeader>

        {!selectedRole ? (
            <CardContent className="grid grid-cols-2 gap-4">
                {Object.values(UserRole).map(role => {
                    const Icon = roleConfig[role].icon;
                    return (
                        <Button 
                            key={role}
                            variant="outline" 
                            className="flex flex-col h-24"
                            onClick={() => handleRoleSelect(role)}
                        >
                            <Icon className="w-8 h-8 mb-2" />
                            <span className="capitalize">{role.replace('-', ' ')}</span>
                        </Button>
                    )
                })}
            </CardContent>
        ) : (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user@university.edu" {...field} />
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
                            render={({ field }) => <input type="hidden" {...field} />}
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                      <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                      </Button>
                      <Button variant="link" size="sm" onClick={() => setSelectedRole(null)}>
                        Back to role selection
                      </Button>
                    </CardFooter>
                </form>
            </Form>
        )}
        <CardFooter className={cn("flex-col", selectedRole && "hidden")}>
             <p className="text-xs text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="underline hover:text-primary">
                  Register here
                </Link>
              </p>
        </CardFooter>
      </Card>
    </div>
  );
}
