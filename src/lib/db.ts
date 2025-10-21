
'use server';

import { initialPosts, allUsers } from './data';
import type { Post, User, UserRole } from './types';
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

export const getUsersByRole = async (role: UserRole): Promise<User[]> => {
  try {
    const db = getDatabase();
    const usersRef = ref(db, 'userRoles');
    const roleQuery = query(usersRef, orderByChild('role'), equalTo(role));

    const snapshot = await get(roleQuery);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(id => ({
        id,
        name: data[id].fullName, // Map fullName to name
        ...data[id],
        // Mocked properties for display
        alias: data[id].fullName || `User ${id.substring(0, 4)}`,
        avatar: `https://picsum.photos/seed/${id}/100/100`,
      }));
    }
    return [];
  } catch (error) {
    console.error(`Error fetching users by role "${role}":`, error);
    // Return an empty array or re-throw, depending on desired error handling
    return [];
  }
};
