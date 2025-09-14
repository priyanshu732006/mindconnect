
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share2, User } from 'lucide-react';
import type { Post } from '@/lib/types';
import Link from 'next/link';
import { useLocale } from '@/context/locale-provider';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
    const { t } = useLocale();
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="bg-muted">
              <AvatarFallback>
                {post.author.alias.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold hover:underline cursor-pointer">{post.author.alias}</p>
              <p className="text-xs text-muted-foreground">
                {post.timestamp}
              </p>
            </div>
          </div>
           <Link href="#">
            <Badge variant="outline" className="capitalize cursor-pointer hover:bg-accent">{t[post.category.toLowerCase().replace(' ', '') as keyof typeof t] || post.category}</Badge>
           </Link>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
        <CardDescription className="text-base text-foreground/80">
          {post.content}
        </CardDescription>
      </CardContent>
      <CardFooter className="gap-4 text-muted-foreground text-sm">
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <span>{post.upvotes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{t.commentsCount.replace('{count}', String(post.comments.length))}</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
          <Share2 className="h-4 w-4" />
          <span>{t.share}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
