
'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, MessagesSquare, BarChart2, Award } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-provider';

export default function PeerBuddyDashboardPage() {
  const { user } = useAuth();

  // Placeholder stats
  const stats = {
    pendingRequests: 3,
    activeConnections: 12,
    postsAuthored: 5,
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome, {user?.displayName || 'Peer Buddy'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's your hub for supporting the student community.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <Link
              href="/peer-buddy/requests"
              className="text-xs text-muted-foreground underline"
            >
              View requests
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Connections
            </CardTitle>
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConnections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Posts Authored</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.postsAuthored}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessagesSquare /> Community Forum
            </CardTitle>
            <CardDescription>
              Participate in anonymous discussions to guide and support peers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/peer-buddy/community">Join Discussions</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award /> Certification
            </CardTitle>
            <CardDescription>
              Track your progress and get certified for your contributions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/peer-buddy/certification">View Certification</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Specializations</CardTitle>
          <CardDescription>
            These are the areas students can seek your help for. You can update
            them in your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <span className="px-3 py-1 text-sm rounded-full bg-accent text-accent-foreground">
            Exam Stress
          </span>
          <span className="px-3 py-1 text-sm rounded-full bg-accent text-accent-foreground">
            Anxiety
          </span>
          <span className="px-3 py-1 text-sm rounded-full bg-accent text-accent-foreground">
            Study Pressure
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
