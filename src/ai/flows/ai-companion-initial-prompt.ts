'use server';

/**
 * @fileOverview This file defines the Genkit flow for the AI mental health companion's initial prompt.
 *
 * - aiCompanionInitialPrompt - A function that takes a user's initial prompt and returns a response from the AI companion.
 * - AICompanionInitialPromptInput - The input type for the aiCompanionInitialPrompt function.
 * - AICompanionInitialPromptOutput - The return type for the aiCompanionInitialPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICompanionInitialPromptInputSchema = z.object({
  prompt: z.string().describe('The initial prompt from the user.'),
});
export type AICompanionInitialPromptInput = z.infer<typeof AICompanionInitialPromptInputSchema>;

const AICompanionInitialPromptOutputSchema = z.object({
  response: z.string().describe('The AI companion response to the initial prompt.'),
});
export type AICompanionInitialPromptOutput = z.infer<typeof AICompanionInitialPromptOutputSchema>;

export async function aiCompanionInitialPrompt(input: AICompanionInitialPromptInput): Promise<AICompanionInitialPromptOutput> {
  return aiCompanionInitialPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCompanionInitialPromptPrompt',
  input: {schema: AICompanionInitialPromptInputSchema},
  output: {schema: AICompanionInitialPromptOutputSchema},
  prompt: `You are a mental health companion providing first-aid support and coping strategies. Please respond to the following prompt from the user:\n\n{{{prompt}}}`,
});

const aiCompanionInitialPromptFlow = ai.defineFlow(
  {
    name: 'aiCompanionInitialPromptFlow',
    inputSchema: AICompanionInitialPromptInputSchema,
    outputSchema: AICompanionInitialPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
