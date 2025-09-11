
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { aiCompanionInitialPrompt } from '@/ai/flows/ai-companion-initial-prompt';
import { wellbeingScoreFromConversation } from '@/ai/flows/wellbeing-score-from-conversation';
import type { Message, WellbeingData } from '@/lib/types';
import { analyzeFacialExpression, FacialAnalysisOutput } from '@/ai/flows/facial-analysis';


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function login(values: z.infer<typeof loginSchema>) {
    // This is a mock authentication. In a real app, you'd validate credentials against a database.
    console.log('Logging in with:', values.email);

    // Simulate successful login
    redirect('/student/dashboard');
}


export async function getAIResponse(
  history: Message[],
  newMessage: string
): Promise<string> {
  try {
    const conversationHistory = history
      .map(m => `${m.role === 'user' ? 'User' : 'Companion'}: ${m.content}`)
      .join('\n');

    const prompt = `You are a mental health companion providing first-aid support and coping strategies. Below is the conversation history. Please respond to the last user message.

${conversationHistory}
User: ${newMessage}
Companion:`;

    const result = await aiCompanionInitialPrompt({ prompt });
    return result.response;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return 'I am sorry, but I am having trouble connecting right now. Please try again later.';
  }
}

export async function analyzeWellbeing(
  history: Message[]
): Promise<WellbeingData | null> {
  if (history.length === 0) return null;
  try {
    const conversation = history
      .map(m => `${m.role === 'user' ? 'Student' : 'AI'}: ${m.content}`)
      .join('\n\n');

    const result = await wellbeingScoreFromConversation({ conversation });
    return result;
  } catch (error) {
    console.error('Error analyzing wellbeing:', error);
    return null;
  }
}

export async function analyzeFacialExpressionAction(photoDataUri: string): Promise<FacialAnalysisOutput | null> {
    try {
        const result = await analyzeFacialExpression({ photoDataUri });
        return result;
    } catch (error) {
        console.error('Error analyzing facial expression:', error);
        return null;
    }
}
