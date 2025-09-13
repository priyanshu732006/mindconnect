
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
import { ArrowUp, MessageSquare } from 'lucide-react';
import type { Post } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{post.author.alias.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.author.alias}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.timestamp), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <Badge variant="secondary">{post.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {post.content}
        </CardDescription>
      </CardContent>
      <CardFooter className="gap-4">
        <Button variant="outline" size="sm">
          <ArrowUp className="mr-2 h-4 w-4" />
          {post.upvotes} Upvotes
        </Button>
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          {post.comments.length} Comments
        </Button>
      </CardFooter>
    </Card>
  );
}
