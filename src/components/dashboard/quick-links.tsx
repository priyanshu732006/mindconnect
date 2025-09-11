import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, BookHeart, CalendarCheck } from 'lucide-react';

const links = [
  {
    href: '/chat',
    title: 'AI Companion',
    description: 'Talk through your thoughts anytime.',
    icon: Bot,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    href: '/resources',
    title: 'Resource Hub',
    description: 'Articles, videos, and exercises.',
    icon: BookHeart,
    color: 'bg-green-100 text-green-700',
  },
  {
    href: '/booking',
    title: 'Book an Appointment',
    description: 'Schedule a session with a counselor.',
    icon: CalendarCheck,
    color: 'bg-purple-100 text-purple-700',
  },
];

export function QuickLinks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {links.map(link => (
        <Link href={link.href} key={link.href} className="group">
          <Card className="h-full transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">{link.title}</CardTitle>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${link.color}`}
              >
                <link.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
