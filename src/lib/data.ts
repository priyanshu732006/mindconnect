

import type { User, Post, Conversation, Message } from './types';
import { BookCopy, Bot, Trophy } from 'lucide-react';

export const allUsers: User[] = [
  { id: 'user1', alias: 'Student_A', role: 'student', avatar: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'user2', alias: 'Student_B', role: 'student', avatar: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'user3', alias: 'Student_C', role: 'student', avatar: 'https://picsum.photos/seed/user3/100/100' },
  { id: 'buddy1', alias: 'Buddy_01', role: 'peer-buddy', avatar: 'https://picsum.photos/seed/buddy1/100/100' },
  { id: 'buddy2', alias: 'Buddy_02', role: 'peer-buddy', avatar: 'https://picsum.photos/seed/buddy2/100/100' },
  { id: 'STU-247', alias: 'Anonymous Student #247', role: 'student', avatar: 'https://picsum.photos/seed/STU-247/100/100' },
  { id: 'STU-189', alias: 'Anonymous Student #189', role: 'student', avatar: 'https://picsum.photos/seed/STU-189/100/100' },
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


export const initialConversations: Conversation[] = [
    {
      id: 'convo-247',
      participant: allUsers.find(u => u.id === 'STU-247')!,
      messages: [],
      unreadCount: 0,
      lastMessage: 'Thank you for helping me wit...',
      lastMessageTimestamp: '2m ago',
      status: 'improving',
      tags: ['anxiety', 'exams'],
      risk: 'low',
      requestStatus: 'accepted'
    },
    {
      id: 'convo-189',
      participant: allUsers.find(u => u.id === 'STU-189')!,
      messages: [],
      unreadCount: 2,
      lastMessage: 'I\'m still struggling with sleep i...',
      lastMessageTimestamp: '15m ago',
      status: 'stable',
      tags: ['sleep', 'stress'],
      risk: 'medium',
      requestStatus: 'pending'
    },
     {
      id: 'convo-303',
      participant: { id: 'STU-303', alias: 'Anonymous Student #303', role: 'student', avatar: 'https://picsum.photos/seed/STU-303/100/100' },
      messages: [],
      unreadCount: 0,
      lastMessage: 'What are some good ways to...',
      lastMessageTimestamp: '1h ago',
      status: 'stable',
      tags: ['motivation', 'procrastination'],
      risk: 'low',
      requestStatus: 'accepted'
    },
    {
      id: 'convo-415',
      participant: { id: 'STU-415', alias: 'Anonymous Student #415', role: 'student', avatar: 'https://picsum.photos/seed/STU-415/100/100' },
      messages: [],
      unreadCount: 0,
      lastMessage: 'I had a fight with my roommate.',
      lastMessageTimestamp: '3h ago',
      status: 'declining',
      tags: ['relationships', 'conflict'],
      risk: 'medium',
      requestStatus: 'accepted'
    }
  ];
  
  export const initialMessages: Message[] = [
    {
      id: 'msg-1',
      sender: allUsers.find(u => u.id === 'STU-189')!,
      content: 'I can\'t seem to fall asleep before 3 AM these days.',
      timestamp: 'Yesterday'
    },
    {
      id: 'msg-2',
      sender: 'me',
      content: 'That sounds exhausting. Have you tried any relaxation techniques before bed?',
      timestamp: 'Yesterday'
    }
  ];
