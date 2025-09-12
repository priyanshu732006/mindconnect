
import { FacialAnalysisOutput } from "./ai/flows/facial-analysis";
import { VoiceAnalysisOutput } from "./ai/flows/voice-analysis";

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type WellbeingData = {
  wellbeingScore: number;
  summary: string;
};

export type TrustedContact = {
    id: string;
    name: string;
    relation: string;
    avatar: string;
    phone: string;
};

export type FacialAnalysisData = FacialAnalysisOutput;
export type VoiceAnalysisData = VoiceAnalysisOutput;
