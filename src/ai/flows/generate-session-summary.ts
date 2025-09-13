
'use server';

/**
 * @fileOverview Generates a session summary and actionable advice from counselor notes.
 *
 * - generateSessionSummary - A function that takes session notes and returns a structured summary.
 * - GenerateSessionSummaryInput - The input type for the generateSessionSummary function.
 * - GenerateSessionSummaryOutput - The return type for the generateSessionSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSessionSummaryInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  sessionNotes: z.string().describe('The detailed notes from the counseling session.'),
});
export type GenerateSessionSummaryInput = z.infer<typeof GenerateSessionSummaryInputSchema>;

const GenerateSessionSummaryOutputSchema = z.object({
  summary: z.string().describe('A brief, easy-to-understand summary of the session that can be shared with the student.'),
  actionableAdvice: z.array(z.string()).describe('A list of clear, actionable advice points for the student to follow.'),
});
export type GenerateSessionSummaryOutput = z.infer<typeof GenerateSessionSummaryOutputSchema>;


export async function generateSessionSummary(input: GenerateSessionSummaryInput): Promise<GenerateSessionSummaryOutput> {
    return generateSessionSummaryFlow(input);
}


const summaryPrompt = ai.definePrompt({
    name: 'sessionSummaryPrompt',
    input: { schema: GenerateSessionSummaryInputSchema },
    output: { schema: GenerateSessionSummaryOutputSchema },
    prompt: `You are an expert counseling assistant. Your task is to process session notes and generate a student-friendly summary and actionable advice. The tone should be supportive, empathetic, and encouraging.

    Session Notes for student "{{studentName}}":
    ---
    {{{sessionNotes}}}
    ---
    
    Based on these notes:
    1.  **Summary:** Write a concise summary of the key discussion points, insights, and feelings explored during the session. This should be phrased in a way that is easy for the student to understand and reflect upon.
    2.  **Actionable Advice:** Create a list of 3-5 clear, concrete, and manageable steps or strategies the student can take before the next session. These should be directly related to the issues discussed.
    `,
});

const generateSessionSummaryFlow = ai.defineFlow(
  {
    name: 'generateSessionSummaryFlow',
    inputSchema: GenerateSessionSummaryInputSchema,
    outputSchema: GenerateSessionSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await summaryPrompt(input);
    return output!;
  }
);
