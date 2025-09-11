
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/logo";
import Link from "next/link";
import { Info } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
           <Logo className="justify-center mb-4" />
          <CardTitle>Welcome to the 2-Day Demo</CardTitle>
          <CardDescription>
            You're about to start a temporary 48-hour demo experience. You'll get access to our core AI analysis tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground bg-accent/50 p-4 rounded-md border">
            <div className="flex items-start gap-3">
                <Info className="w-5 h-5 mt-0.5 text-primary" />
                <p className="text-left">
                    Features like appointment booking and the crisis alert safety net are disabled during the demo. Register for a full account to unlock all features.
                </p>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 pt-6">
          <Button className="w-full" asChild>
            <Link href="/student/dashboard">Start Demo</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
