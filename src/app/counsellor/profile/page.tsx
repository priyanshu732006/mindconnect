
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function CounsellorProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const counsellorName = user?.displayName || 'Jane Doe';
  const counsellorEmail = user?.email || 'jane.doe@university.edu';
  const aboutMeText =
    'Dedicated to supporting student well-being and success. I specialize in stress management and academic anxiety. Feel free to reach out to schedule a confidential session.';
  const title = 'On-Campus Counselor';
    
  const handleUpdate = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been successfully saved.',
    });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Settings
        </h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="flex items-center gap-4">
                 <Avatar className="h-20 w-20">
                    <AvatarImage
                        src="https://picsum.photos/seed/counsellor_profile/200"
                        alt={counsellorName}
                        data-ai-hint="counsellor avatar"
                    />
                    <AvatarFallback>{counsellorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
            </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={counsellorName} disabled />
            <p className="text-xs text-muted-foreground">
              Your name cannot be changed.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={counsellorEmail} disabled />
            <p className="text-xs text-muted-foreground">
              Your college email address cannot be changed.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" defaultValue={title} />
            <p className="text-xs text-muted-foreground">
                Your title, e.g., "On-Campus Counselor", "Peer Support Lead".
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={5}
              defaultValue={aboutMeText}
            />
             <p className="text-xs text-muted-foreground">
                A brief bio that will be displayed on your public profile.
            </p>
          </div>
        </CardContent>
         <CardFooter>
          <Button onClick={handleUpdate}>Update Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
