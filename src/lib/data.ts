

import type { User, Post, Conversation, Message } from './types';
import { BookCopy, Bot, Trophy } from 'lucide-react';

export const allUsers: User[] = [
  { id: 'user1', alias: 'Anonymous User', role: 'student', avatar: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'user2', alias: 'Anonymous User', role: 'student', avatar: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'user3', alias: 'Anonymous User', role: 'student', avatar: 'https://picsum.photos/seed/user3/100/100' },
  { id: 'buddy1', alias: 'Peer Buddy', role: 'peer-buddy', avatar: 'https://picsum.photos/seed/buddy1/100/100' },
  { id: 'buddy2', alias: 'Peer Buddy', role: 'peer-buddy', avatar: 'https://picsum.photos/seed/buddy2/100/100' },
  { id: 'STU-247', alias: 'Anonymous Student #247', role: 'student', avatar: 'https://picsum.photos/seed/STU-247/100/100' },
  { id: 'STU-189', alias: 'Anonymous Student #189', role: 'student', avatar: 'https://picsum.photos/seed/STU-189/100/100' },
];

export const initialPosts: Post[] = [
  {
    id: 'post1',
    author: allUsers[0],
    title: 'Struggling with exam anxiety - any tips?',
    content:
      "I've been having a really hard time with anxiety around exams lately. It's affecting my sleep and concentration. Has anyone dealt with something similar?",
    category: 'Academics',
    timestamp: '9/13/2025',
    upvotes: 28,
    comments: [],
  },
  {
    id: 'post2',
    author: allUsers[1],
    title: 'Finally reached out for help - best decision ever!',
    content:
      "After months of struggling alone, I finally connected with a peer buddy through this platform. It's amazing how much better I feel just having someone to talk to who understands.",
    category: 'Success Stories',
    timestamp: '9/12/2025',
    upvotes: 45,
    comments: [],
  },
  {
    id: 'post3',
    author: allUsers[3],
    title: 'Tip: The Pomodoro Technique for studying',
    content:
      'If you struggle with focusing for long periods, try the Pomodoro Technique. Study for 25 minutes, then take a 5-minute break. After four sessions, take a longer break. It really helps!',
    category: 'Study Tips',
    timestamp: '9/10/2025',
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
