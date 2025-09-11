
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { aiCompanionInitialPrompt } from '@/ai/flows/ai-companion-initial-prompt';
import { wellbeingScoreFromConversation } from '@/ai/flows/wellbeing-score-from-conversation';
import type { Message, WellbeingData, TrustedContact } from '@/lib/types';
import { analyzeFacialExpression, FacialAnalysisOutput } from '@/ai/flows/facial-analysis';
import twilio from 'twilio';


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

export async function sendSmsAction(to: string, body: string): Promise<{ success: boolean; error?: string }> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !from || !accountSid.startsWith('AC')) {
        console.error('Twilio credentials are not configured correctly in .env file.');
        return { success: false, error: 'Twilio is not configured. Please check your environment variables.' };
    }

    const phoneRegex = new RegExp(
      /^\+91[6-9]\d{9}$/
    );

    if(!phoneRegex.test(to)){
       return { success: false, error: `The phone number ${to} is not a valid Indian phone number` };
    }

    const client = twilio(accountSid, authToken);

    try {
        await client.messages.create({ body, from, to });
        return { success: true };
    } catch (error: any) {
        console.error('Failed to send SMS via Twilio:', error);
        const errorMessage = error.message || 'An unknown error occurred while sending SMS.';
        return { success: false, error: `Failed to send SMS: ${errorMessage}` };
    }
}
