
export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type WellbeingData = {
  wellbeingScore: number;
  summary: string;
};
