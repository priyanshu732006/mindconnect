
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
import { useLocale } from '@/context/locale-provider';

const profileSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  bio: z.string().min(1, 'Bio is required.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function CounsellorSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();

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
      title: t.profileUpdated,
      description: t.profileUpdatedDesc,
    });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t.settings}
        </h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{t.profileSettings}</CardTitle>
            <CardDescription>
              {t.profileSettingsDesc}
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
                {t.changePhoto}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input id="name" value={counsellorName} disabled />
              <p className="text-sm text-muted-foreground">
                {t.nameCannotBeChanged}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input id="email" value={counsellorEmail} disabled />
              <p className="text-sm text-muted-foreground">
                {t.emailCannotBeChanged}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">{t.title}</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder={t.titlePlaceholder}
              />
              <p className="text-sm text-muted-foreground">
                {t.titleDesc}
              </p>
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t.bio}</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                rows={4}
                placeholder={t.bioPlaceholder}
              />
               <p className="text-sm text-muted-foreground">
                {t.bioDesc}
              </p>
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">{t.updateProfile}</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
