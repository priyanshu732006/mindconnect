'use server';
/**
 * @fileOverview A flow that analyzes a conversation and generates a Well-being Score.
 *
 * - wellbeingScoreFromConversation - A function that generates a Well-being Score from a conversation.
 * - WellbeingScoreFromConversationInput - The input type for the wellbeingScoreFromConversation function.
 * - WellbeingScoreFromConversationOutput - The return type for the wellbeingScoreFromConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WellbeingScoreFromConversationInputSchema = z.object({
  conversation: z
    .string()
    .describe('The conversation between the student and the AI companion.'),
});
export type WellbeingScoreFromConversationInput = z.infer<
  typeof WellbeingScoreFromConversationInputSchema
>;

const WellbeingScoreFromConversationOutputSchema = z.object({
  wellbeingScore: z
    .number()
    .describe(
      'A numerical score representing the student\'s well-being, from 1 to 100.'
    ),
  summary: z
    .string()
    .describe('A brief summary of the conversation and the score.'),
});
export type WellbeingScoreFromConversationOutput = z.infer<
  typeof WellbeingScoreFromConversationOutputSchema
>;

export async function wellbeingScoreFromConversation(
  input: WellbeingScoreFromConversationInput
): Promise<WellbeingScoreFromConversationOutput> {
  return wellbeingScoreFromConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wellbeingScoreFromConversationPrompt',
  input: {schema: WellbeingScoreFromConversationInputSchema},
  output: {schema: WellbeingScoreFromConversationOutputSchema},
  prompt: `You are an AI mental health expert tasked with analyzing a conversation between a student and an AI companion to determine the student's well-being score.

  The well-being score should be a number between 1 and 100. A score of 1 indicates a severe crisis, while a score of 100 indicates excellent well-being.

  Consider factors such as the student's expressed emotions, concerns, and overall tone. Also consider the AI companion's responses and whether they were helpful and supportive.

  Conversation: {{{conversation}}}

  Based on the conversation above, provide a well-being score and a brief summary of your analysis.

  Well-being Score: {{wellbeingScore}}
  Summary: {{summary}}`,
});

const wellbeingScoreFromConversationFlow = ai.defineFlow(
  {
    name: 'wellbeingScoreFromConversationFlow',
    inputSchema: WellbeingScoreFromConversationInputSchema,
    outputSchema: WellbeingScoreFromConversationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
