
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-provider';
import Link from 'next/link';
import { useLocale } from '@/context/locale-provider';

export default function CounsellorProfilePage() {
  const { user } = useAuth();
  const { t } = useLocale();
  
  const counsellorName = user?.displayName || 'Jane Doe';
  const counsellorEmail = user?.email || 'jane.doe@university.edu';
  const aboutMeText =
    'Dedicated to supporting student well-being and success. I specialize in stress management and academic anxiety. Feel free to reach out to schedule a confidential session.';
  const title = 'On-Campus Counselor';
    
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t.profile}
        </h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{t.myProfile}</CardTitle>
          <CardDescription>
            {t.myProfileDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                 <Avatar className="h-24 w-24">
                    <AvatarImage
                        src="https://picsum.photos/seed/counsellor_profile/200"
                        alt={counsellorName}
                        data-ai-hint="counsellor avatar"
                    />
                    <AvatarFallback>{counsellorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-bold">{counsellorName}</h2>
                    <p className="text-muted-foreground">{t[title.toLowerCase().replace('-', '') as keyof typeof t] || title}</p>
                    <p className="text-muted-foreground text-sm">{counsellorEmail}</p>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold">{t.aboutMe}</h3>
                <p className="text-muted-foreground mt-2">{aboutMeText}</p>
            </div>
        </CardContent>
         <CardFooter>
          <Button asChild>
            <Link href="/counsellor/settings">{t.editProfile}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
