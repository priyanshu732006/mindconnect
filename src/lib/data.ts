
import type { User, Post } from './types';

export const allUsers: User[] = [
  { id: 'user1', alias: 'Student_A', role: 'student' },
  { id: 'user2', alias: 'Student_B', role: 'student' },
  { id: 'user3', alias: 'Student_C', role: 'student' },
  { id: 'buddy1', alias: 'Buddy_01', role: 'peer-buddy' },
  { id: 'buddy2', alias: 'Buddy_02', role: 'peer-buddy' },
];

export const initialPosts: Post[] = [
  {
    id: 'post1',
    author: allUsers[0],
    title: 'Feeling overwhelmed with final exams',
    content:
      'I have three finals next week and I feel like I can\'t handle the pressure. Any tips for managing exam stress? I\'m really struggling to focus and feel anxious all the time.',
    category: 'Academics',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    upvotes: 15,
    comments: [],
  },
  {
    id: 'post2',
    author: allUsers[1],
    title: 'Success Story: I finally passed my toughest class!',
    content:
      'Just wanted to share a win! After failing it once, I finally passed my statistics course. It took a lot of late nights and extra help, but it feels so good to be done. Don\'t give up!',
    category: 'Success Stories',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    upvotes: 42,
    comments: [],
  },
  {
    id: 'post3',
    author: allUsers[3],
    title: 'Tip: The Pomodoro Technique for studying',
    content:
      'If you struggle with focusing for long periods, try the Pomodoro Technique. Study for 25 minutes, then take a 5-minute break. After four sessions, take a longer break. It really helps!',
    category: 'Study Tips',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    upvotes: 28,
    comments: [],
  },
];
