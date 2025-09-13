
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { aiCompanionInitialPrompt } from '@/ai/flows/ai-companion-initial-prompt';
import { calculateWellbeingScore, CalculateWellbeingScoreInput } from '@/ai/flows/calculate-wellbeing-score';
import type { Message, WellbeingData, TrustedContact, FacialAnalysisData, VoiceAnalysisData, Post } from '@/lib/types';
import { analyzeFacialExpression, FacialAnalysisOutput } from '@/ai/flows/facial-analysis';
import { analyzeVoice, VoiceAnalysisOutput } from '@/ai/flows/voice-analysis';
import twilio from 'twilio';
import { moderatePost } from '@/ai/flows/moderate-community-posts';
import { addPost } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { generateSessionSummary, GenerateSessionSummaryOutput, GenerateSessionSummaryInput } from '@/ai/flows/generate-session-summary';


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
  input: CalculateWellbeingScoreInput,
): Promise<WellbeingData | null> {
  try {
    const conversation = input.conversation || (input.messages?.map(m => `${m.role === 'user' ? 'Student' : 'AI'}: ${m.content}`).join('\n\n') ?? '');

    const result = await calculateWellbeingScore({
      ...input,
      conversation: conversation.length > 0 ? conversation : undefined,
    });
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

export async function analyzeVoiceAction(audioDataUri: string): Promise<VoiceAnalysisOutput | null> {
    try {
        const result = await analyzeVoice({ audioDataUri });
        return result;
    } catch (error) {
        console.error('Error analyzing voice:', error);
        return null;
    }
}

export async function sendSmsAction(to: string, body: string): Promise<{ success: boolean; error?: string }> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !from) {
        return { success: false, error: 'Twilio is not configured. Please check your environment variables.' };
    }
    
    if(!accountSid.startsWith("AC")){
       return { success: false, error: 'Your Twilio Account SID appears to be invalid. Please check your environment variables.' };
    }

    const phoneRegex = new RegExp(
      /^\\+91[6-9]\d{9}$/
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


const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required.')
    .max(200, 'Title is too long.'),
  content: z
    .string()
    .min(1, 'Content is required.')
    .max(10000, 'Content is too long.'),
  category: z.string().min(1, 'Category is required.'),
});

type State = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function handleCreatePost(
  formData: FormData
): Promise<State> {
  const rawFormData = {
    title: formData.get('title'),
    content: formData.get('content'),
    category: formData.get('category'),
  };

  const parsed = createPostSchema.safeParse(rawFormData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors.map((e) => e.message).join(', '),
    };
  }

  try {
    const moderationResult = await moderatePost({
      postContent: parsed.data.content,
      topicCategory: parsed.data.category,
    });

    if (!moderationResult.isAppropriate) {
      return {
        success: false,
        error: `Post flagged: ${
          moderationResult.flagReason || 'Content violates community guidelines.'
        }`,
      };
    }

    await addPost(parsed.data as Omit<Post, 'id' | 'author' | 'upvotes' | 'comments' | 'timestamp'>);
    
    revalidatePath('/peer-buddy/community');

    return { success: true, message: 'Post created successfully!' };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function generateSessionSummaryAction(input: GenerateSessionSummaryInput): Promise<GenerateSessionSummaryOutput | null> {
    try {
        const result = await generateSessionSummary(input);
        return result;
    } catch (error) {
        console.error('Error generating session summary:', error);
        return null;
    }
}
