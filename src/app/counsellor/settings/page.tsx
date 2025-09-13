
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  bio: z.string().min(1, 'Bio is required.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function CounsellorSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const counsellorName = user?.displayName || 'Jane Doe';
  const counsellorEmail = user?.email || 'jane.doe@university.edu';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      title: 'On-Campus Counselor',
      bio: 'Dedicated to supporting student well-being and success. I specialize in stress management and academic anxiety. Feel free to reach out to schedule a confidential session.',
    },
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = data => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved.',
    });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Settings
        </h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              This is how others will see you on the site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src="https://picsum.photos/seed/counsellor_profile/200"
                  alt={counsellorName}
                  data-ai-hint="counsellor avatar"
                />
                <AvatarFallback>{counsellorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline">
                Change Photo
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={counsellorName} disabled />
              <p className="text-sm text-muted-foreground">
                Your name cannot be changed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={counsellorEmail} disabled />
              <p className="text-sm text-muted-foreground">
                Your college email address cannot be changed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., On-Campus Counselor"
              />
              <p className="text-sm text-muted-foreground">
                Your title, e.g., "On-Campus Counselor", "Peer Support Lead".
              </p>
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                rows={4}
                placeholder="A brief bio that will be displayed on your public profile."
              />
               <p className="text-sm text-muted-foreground">
                A brief bio that will be displayed on your public profile.
              </p>
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Update Profile</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
