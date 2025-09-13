
import { LucideIcon } from "lucide-react";

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type WellbeingData = {
  wellbeingScore: number;
  summary: string;
  selfHarmRisk: boolean;
};

export type TrustedContact = {
    id: string;
    name: string;
    relation: string;
    avatar: string;
    phone: string;
};

export type FacialAnalysisData = {
    mood: string;
    confidence: number;
    summary: string;
};
export type VoiceAnalysisData = {
    mood: string;
    confidence: number;
    summary: string;
};

export enum UserRole {
    student = 'student',
    admin = 'admin',
    counsellor = 'counsellor',
    'peer-buddy' = 'peer-buddy'
}

export type CounsellorType = 'on-campus' | 'external';

export type NavItem = {
    href: string;
    icon: LucideIcon;
    label: string;
}

export type DailyCheckinData = {
    mood: string;
    journalEntry?: string;
    sleepHours: number;
    screenTimeHours: number;
}

// Assessment Types
export type AssessmentId = 'phq-9' | 'gad-7' | 'ghq-12';

export type AssessmentQuestion = {
    text: string;
};

export type AssessmentOption = {
    text: string;
    value: number;
};

export type InterpretationThreshold = {
    minScore: number;
    text: string;
};

export type Assessment = {
    id: AssessmentId;
    name: string;
    description: string;
    questions: AssessmentQuestion[];
    options: AssessmentOption[];
    interpretation: InterpretationThreshold[];
};

export type Answer = {
    questionIndex: number;
    value: number;
};

export type AssessmentResult = {
    id: AssessmentId;
    name: string;
    score: number;
    interpretation: string;
    answers: Answer[];
    date: string;
};

export type AssessmentResults = {
    "phq-9": AssessmentResult | null;
    "gad-7": AssessmentResult | null;
    "ghq-12": AssessmentResult | null;
};


// Peer Buddy Types
export type PeerBuddy = {
    id: string;
    name: string;
    specializations: string[];
    status: 'Available' | 'Busy';
}

export type ChatMessage = {
    id: string;
    sender: string; // 'You' or buddy's name
    text: string;
    timestamp: string;
}

// Community Types
export type User = {
    id: string;
    alias: string;
    role: 'student' | 'peer-buddy';
};
  
export type Comment = {
    id: string;
    author: User;
    content: string;
    timestamp: string;
    upvotes: number;
};

export type Post = {
    id: string;
    author: User;
    title: string;
    content: string;
    category: string;
    timestamp: string;
    upvotes: number;
    comments: Comment[];
};
