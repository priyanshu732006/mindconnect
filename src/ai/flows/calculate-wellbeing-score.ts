
'use server';
/**
 * @fileOverview A flow that analyzes a conversation, facial analysis, and voice analysis to generate a Well-being Score.
 *
 * - calculateWellbeingScore - A function that generates a Well-being Score.
 * - CalculateWellbeingScoreInput - The input type for the calculateWellbeingScore function.
 * - CalculateWellbeingScoreOutput - The return type for the calculateWellbeingScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define schemas directly here to avoid "use server" export issues.
const FacialAnalysisOutputSchema = z.object({
  mood: z.string().describe("The estimated mood of the person in the photo (e.g., Happy, Sad, Neutral, Surprised)."),
  confidence: z.number().describe("A confidence score (0-1) for the mood estimation."),
  summary: z.string().describe("A brief summary of the facial expression analysis."),
});

const VoiceAnalysisOutputSchema = z.object({
  mood: z.string().describe("The estimated primary mood from the voice tone (e.g., Calm, Anxious, Happy, Sad)."),
  confidence: z.number().describe("A confidence score (0-1) for the mood estimation."),
  summary: z.string().describe("A brief summary of the voice analysis, including notes on pace, tone, and sentiment."),
});


const CalculateWellbeingScoreInputSchema = z.object({
  conversation: z
    .string()
    .optional()
    .describe('The conversation between the student and the AI companion.'),
  facialAnalysis: FacialAnalysisOutputSchema.optional().describe('The results of a facial analysis.'),
  voiceAnalysis: VoiceAnalysisOutputSchema.optional().describe('The results of a voice analysis.'),
});
export type CalculateWellbeingScoreInput = z.infer<
  typeof CalculateWellbeingScoreInputSchema
>;

const CalculateWellbeingScoreOutputSchema = z.object({
  wellbeingScore: z
    .number()
    .describe(
      'A numerical score representing the student\'s well-being, from 1 to 100.'
    ),
  summary: z
    .string()
    .optional()
    .describe('A brief summary of the conversation and the score.'),
});
export type CalculateWellbeingScoreOutput = z.infer<
  typeof CalculateWellbeingScoreOutputSchema
>;

export async function calculateWellbeingScore(
  input: CalculateWellbeingScoreInput
): Promise<CalculateWellbeingScoreOutput> {
  return calculateWellbeingScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateWellbeingScorePrompt',
  input: {schema: CalculateWellbeingScoreInputSchema},
  output: {schema: CalculateWellbeingScoreOutputSchema},
  prompt: `You are an AI mental health expert tasked with analyzing inputs to determine a student's well-being score.

  The well-being score should be a number between 1 and 100. A score of 1 indicates a severe crisis, while a score of 100 indicates excellent well-being.

  Consider factors such as the student's expressed emotions, concerns, and overall tone from the conversation.
  Also consider the mood and confidence from the facial and voice analysis data, if available.
  
  Your summary should synthesize all available information.

  {{#if conversation}}
  Conversation:
  {{{conversation}}}
  {{/if}}

  {{#if facialAnalysis}}
  Facial Analysis:
  - Mood: {{facialAnalysis.mood}} (Confidence: {{facialAnalysis.confidence}})
  - Summary: {{facialAnalysis.summary}}
  {{/if}}

  {{#if voiceAnalysis}}
  Voice Analysis:
  - Mood: {{voiceAnalysis.mood}} (Confidence: {{voiceAnalysis.confidence}})
  - Summary: {{voiceAnalysis.summary}}
  {{/if}}

  Based on the available data, provide a well-being score and a brief summary of your analysis.
  `,
});

const calculateWellbeingScoreFlow = ai.defineFlow(
  {
    name: 'calculateWellbeingScoreFlow',
    inputSchema: CalculateWellbeingScoreInputSchema,
    outputSchema: CalculateWellbeingScoreOutputSchema,
  },
  async input => {
    if (!input.conversation && !input.facialAnalysis && !input.voiceAnalysis) {
      return {
        wellbeingScore: 0,
        summary: "Start a conversation or use the analysis tools to get your well-being score.",
      }
    }
    const {output} = await prompt(input);
    return output!;
  }
);
