

import type { User, Post, Conversation, Message } from './types';
import { BookCopy, Bot, Trophy } from 'lucide-react';

export const allUsers: User[] = [
  { id: 'Student_12', alias: 'Student_12', role: 'student', avatar: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'Buddy_5', alias: 'Buddy_5', role: 'peer-buddy', avatar: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'Counselor_3', alias: 'Counselor_3', role: 'counsellor', avatar: 'https://picsum.photos/seed/user3/100/100' },
  { id: 'Student_54', alias: 'Student_54', role: 'student', avatar: 'https://picsum.photos/seed/buddy1/100/100' },
  { id: 'buddy2', alias: 'Peer Buddy', role: 'peer-buddy', avatar: 'https://picsum.photos/seed/buddy2/100/100' },
  { id: 'STU-247', alias: 'Anonymous Student #247', role: 'student', avatar: 'https://picsum.photos/seed/STU-247/100/100' },
  { id: 'STU-189', alias: 'Anonymous Student #189', role: 'student', avatar: 'https://picsum.photos/seed/STU-189/100/100' },
];

export const initialPosts: Post[] = [
  {
    id: 'post1',
    author: allUsers.find(u => u.id === 'Student_12')!,
    title: 'Struggling with exam anxiety - any tips?',
    content:
      "I've been having a really hard time with anxiety around exams lately. It's affecting my sleep and concentration. Has anyone dealt with something similar?",
    category: 'Anxiety',
    timestamp: '2024-09-13',
    upvotes: 28,
    comments: [{id: 'c1', author: allUsers[1], content: 'First comment', timestamp: '2024-09-13', upvotes: 2}, {id: 'c2', author: allUsers[2], content: 'Second comment', timestamp: '2024-09-13', upvotes: 5}],
  },
  {
    id: 'post2',
    author: allUsers.find(u => u.id === 'Buddy_5')!,
    title: 'Finally reached out for help - best decision ever!',
    content:
      "After months of struggling alone, I finally connected with a peer buddy through this platform. It's amazing how much better I feel just having someone to talk to who understands.",
    category: 'Success Stories',
    timestamp: '2024-09-12',
    upvotes: 45,
    comments: [{id: 'c1', author: allUsers[0], content: 'That is great to hear!', timestamp: '2024-09-12', upvotes: 4}],
  },
  {
    id: 'post3',
    author: allUsers.find(u => u.id === 'Counselor_3')!,
    title: 'Resource: Time Management Workshop',
    content:
      "Hi everyone, just a reminder that the university is hosting a free time management workshop next Tuesday. It can be really helpful for reducing stress during busy periods. Sign-up link is on the student portal.",
    category: 'Study Tips',
    timestamp: '2024-09-11',
    upvotes: 15,
    comments: [],
  },
  {
    id: 'post4',
    author: allUsers.find(u => u.id === 'Student_54')!,
    title: 'Feeling really down lately',
    content:
      "I haven't been feeling like myself for a while. It's hard to get out of bed and I'm not interested in things I used to enjoy. Not sure what to do.",
    category: 'Depression',
    timestamp: '2024-09-10',
    upvotes: 32,
    comments: [
        {id: 'c1', author: allUsers[1], content: 'First comment', timestamp: '2024-09-10', upvotes: 2}, 
        {id: 'c2', author: allUsers[2], content: 'Second comment', timestamp: '2024-09-10', upvotes: 5},
        {id: 'c3', author: allUsers[1], content: 'Third comment', timestamp: '2024-09-10', upvotes: 2}, 
        {id: 'c4', author: allUsers[2], content: 'Fourth comment', timestamp: '2024-09-10', upvotes: 5},
        {id: 'c5', author: allUsers[1], content: 'Fifth comment', timestamp: '2024-09-10', upvotes: 2}, 
    ],
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
