
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Peer Support Platform
        </h1>
        <p className="text-muted-foreground mt-2">
          Connect with fellow students in a safe and supportive community.
        </p>
      </header>
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-full max-w-md">
            <Image 
              src="https://picsum.photos/seed/community/600/400" 
              alt="Community illustration" 
              width={600}
              height={400}
              className="rounded-lg"
              data-ai-hint="people community"
            />
          </div>
          <CardTitle className="mt-6 text-2xl">Coming Soon!</CardTitle>
          <CardDescription>
            We're building a secure, moderated forum where you can share experiences and offer mutual support.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">This feature is under development and will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
