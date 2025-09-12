'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/calculate-wellbeing-score.ts';
import '@/ai/flows/ai-companion-initial-prompt.ts';
import '@/ai/flows/facial-analysis.ts';
import '@/ai/flows/voice-analysis.ts';
