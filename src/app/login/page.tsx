
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
import { Loader2, ArrowLeft, User, Briefcase, Users, UserCog, Building, Globe, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { UserRole, CounsellorType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/app-provider";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/context/locale-provider";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required."),
    role: z.nativeEnum(UserRole, { errorMap: () => ({ message: "Please select a role to continue." }) }),
    counsellorType: z.nativeEnum(CounsellorType).optional(),
});

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { login, user, loading, role: authRole } = useAuth();
  const { setNavItemsByRole } = useApp();
  const router = useRouter();
  const [counsellorTypeSelection, setCounsellorTypeSelection] = useState<CounsellorType | null>(null);
  const { t } = useLocale();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const selectedRole = form.watch("role");
  
  const handleRoleSelect = (role: UserRole) => {
    form.setValue("role", role);
    form.clearErrors();
  }

  const handleCounsellorTypeSelect = (type: CounsellorType) => {
    setCounsellorTypeSelection(type);
    form.setValue("counsellorType", type);
    form.clearErrors();
  }

  const handleBackToRoleSelection = () => {
    form.reset();
    setCounsellorTypeSelection(null);
  }

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      try {
        const { role, counsellorType } = await login(values.email, values.password, values.role, values.counsellorType);
        
        setNavItemsByRole(role, counsellorType);

        if (role === UserRole.counsellor && counsellorType === 'external') {
            router.push('/counsellor/external/dashboard');
        } else if (role === UserRole['peer-buddy']) {
            router.push('/peer-buddy/dashboard');
        } else {
            router.push(`/${role}/dashboard`);
        }

        toast({
          title: t.loginSuccessful,
          description: t.welcomeBack.replace('{name}', ''),
        });

      } catch (error) {
        let description = t.loginErrorUnexpected;
        if (error instanceof FirebaseError) {
            switch(error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    description = t.loginErrorInvalid;
                    break;
                case 'auth/custom-error':
                    description = (error as any).customData?._tokenResponse?.error?.message || error.message;
                    break;
                default:
                    description = `${t.loginError}: ${error.message}`
            }
        } else if (error instanceof Error) {
            description = error.message;
        }

        toast({
          variant: "destructive",
          title: t.loginFailed,
          description: description,
        });
      }
    });
  };

  useEffect(() => {
    if (!loading && user && authRole && !isPending) {
      const targetRole = authRole;
      const targetCounsellorType = sessionStorage.getItem('counsellorType') as CounsellorType;
      
      if (targetRole === UserRole.counsellor && targetCounsellorType === 'external') {
          router.replace('/counsellor/external/dashboard');
      } else if (targetRole === UserRole.student) {
          router.replace('/student/dashboard');
      } else if (targetRole === UserRole['peer-buddy']) {
          router.replace('/peer-buddy/dashboard');
      } else {
          router.replace(`/${targetRole}/dashboard`);
      }
    }
  }, [user, authRole, loading, router, isPending]);
  
  const roleConfig = {
      [UserRole.student]: { icon: User, label: t.student },
      [UserRole.counsellor]: { icon: Briefcase, label: t.counsellor },
      [UserRole['peer-buddy']]: { icon: Users, label: t.peerbuddy },
      [UserRole.admin]: { icon: UserCog, label: t.admin },
  }

  const showCounsellorTypeSelection = selectedRole === UserRole.counsellor && !counsellorTypeSelection;
  const showLoginForm = selectedRole && (!showCounsellorTypeSelection);
  
  if (loading || (user && !isPending && authRole)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Logo className="justify-center mb-2" />
          <CardTitle>{t.loginToYourAccount}</CardTitle>
           {!selectedRole ? (
                <CardDescription>
                    {t.selectRoleToContinue}
                </CardDescription>
           ) : showCounsellorTypeSelection ? (
                <CardDescription>
                    {t.selectCounselorType}
                </CardDescription>
           ) : (
                <CardDescription>
                    {t.loggingInAs?.replace('{role}', counsellorTypeSelection ? `${t[counsellorTypeSelection.replace('-', '') as keyof typeof t] || counsellorTypeSelection} ${t[selectedRole]}` : t[selectedRole]) || `Logging in as ${selectedRole}`}
                </CardDescription>
           )}
        </CardHeader>

        {!selectedRole ? (
            <CardContent className="grid grid-cols-2 gap-4">
                {Object.values(UserRole).map(role => {
                    const RoleIcon = roleConfig[role].icon;
                    return (
                        <Button 
                            key={role}
                            variant="outline" 
                            className="flex flex-col h-24"
                            onClick={() => handleRoleSelect(role)}
                        >
                            <RoleIcon className="w-8 h-8 mb-2" />
                            <span className="capitalize">{roleConfig[role].label}</span>
                        </Button>
                    )
                })}
            </CardContent>
        ) : showCounsellorTypeSelection ? (
             <CardContent className="grid grid-cols-2 gap-4">
                 <Button variant="outline" className="flex flex-col h-24" onClick={() => handleCounsellorTypeSelect(CounsellorType['on-campus'])}>
                    <Building className="w-8 h-8 mb-2" />
                    <span>{t.oncampus}</span>
                 </Button>
                 <Button variant="outline" className="flex flex-col h-24" onClick={() => handleCounsellorTypeSelect(CounsellorType.external)}>
                    <Globe className="w-8 h-8 mb-2" />
                    <span>{t.external}</span>
                </Button>
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
                                    <FormLabel>{t.email}</FormLabel>
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
                                    <FormLabel>{t.password}</FormLabel>
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
                        {t.login}
                      </Button>
                      <Button type="button" variant="link" size="sm" onClick={handleBackToRoleSelection}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t.backToRoleSelection}
                      </Button>
                    </CardFooter>
                </form>
            </Form>
        )}
        <CardFooter className={cn("flex-col pt-6 border-t")}>
            <div className="flex flex-col w-full gap-2 text-center">
                 <Button variant="outline" className="w-full" asChild>
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        {t.backToHome}
                    </Link>
                </Button>
                 <p className="text-xs text-center text-muted-foreground pt-2">
                    {t.dontHaveAccount}{" "}
                    <Link href="/register" className="underline hover:text-primary">
                    {t.registerHere}
                    </Link>
                </p>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
