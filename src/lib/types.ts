
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
