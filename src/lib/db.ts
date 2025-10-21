
'use server';

import { initialPosts, allUsers } from './data';
import type { Post } from './types';
import { getDatabase, ref, get, query, orderByChild, equalTo } from 'firebase/database';


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

export async function getUsersByRole(role: string): Promise<any[]> {
    const db = getDatabase();
    const usersRef = ref(db, 'userRoles');
    try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            const usersData = snapshot.val();
            const allUsers = Object.keys(usersData).map(key => ({
                id: key,
                ...usersData[key]
            }));
            // Filter by role on the client side
            return allUsers.filter(user => user.role === role);
        }
    } catch(e) {
        console.error("Error fetching users by role", e);
    }
    return [];
}
