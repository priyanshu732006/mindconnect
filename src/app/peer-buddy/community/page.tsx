
'use client';
import * as React from 'react';
import { getPosts } from '@/lib/db';
import { CreatePostForm } from '@/components/community/create-post-form';
import { PostCard } from '@/components/community/post-card';
import type { Post } from '@/lib/types';

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<Post[]>([]);

  React.useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Community Forum
        </h1>
        <p className="text-muted-foreground mt-2">
          Share advice, answer questions, and support the student community.
          All posts are anonymous.
        </p>
      </header>

      <CreatePostForm />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Recent Discussions
        </h2>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
