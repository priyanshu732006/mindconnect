
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
