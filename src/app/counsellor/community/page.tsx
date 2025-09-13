
'use client';
import * as React from 'react';
import { getPosts } from '@/lib/db';
import { CreatePostForm } from '@/components/community/create-post-form';
import { PostCard } from '@/components/community/post-card';
import type { Post } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const categories = [
  'General',
  'Anxiety',
  'Depression',
  'Study Tips',
  'Success Stories',
  'Academics',
];

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = React.useState('General');
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  React.useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  const filteredPosts = posts.filter(
    post => activeCategory === 'General' || post.category === activeCategory
  );

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Community Discussions
        </h1>
        <p className="text-muted-foreground mt-2">
          Connect with others in a safe, supportive environment.
        </p>
      </header>
      
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
          <PlusCircle className="mr-2" /> New Discussion
        </Button>
      </div>

      {showCreateForm && <CreatePostForm />}

      <div className="space-y-6">
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
