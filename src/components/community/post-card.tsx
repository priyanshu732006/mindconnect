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
import { ArrowUp, MessageSquare, Share2, User } from 'lucide-react';
import type { Post } from '@/lib/types';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="bg-muted">
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.author.alias}</p>
              <p className="text-xs text-muted-foreground">
                {post.timestamp}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">{post.category}</Badge>
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
          <ArrowUp className="h-4 w-4" />
          <span>{post.upvotes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments.length} Comments</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </div>
      </CardFooter>
    </Card>
  );
}
