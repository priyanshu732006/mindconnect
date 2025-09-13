
'use server';

import { initialPosts, allUsers } from './data';
import type { Post } from './types';

// In-memory 'database' for posts
let posts: Post[] = [...initialPosts];

// In a real app, these would be proper database operations.
// For this prototype, we'll just manipulate the in-memory array.

export async function getPosts(): Promise<Post[]> {
  // Return posts sorted by most recent
  return posts.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export async function addPost(
  post: Omit<
    Post,
    'id' | 'author' | 'upvotes' | 'comments' | 'timestamp'
  >
): Promise<Post> {
  const newPost: Post = {
    ...post,
    id: `post${posts.length + 1}`,
    author: allUsers[Math.floor(Math.random() * allUsers.length)], // Assign a random author
    timestamp: new Date().toISOString(),
    upvotes: 0,
    comments: [],
  };
  posts.unshift(newPost);
  return newPost;
}
