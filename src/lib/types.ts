
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
};
