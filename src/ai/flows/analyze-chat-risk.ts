
'use server';

/**
 * @fileOverview An AI flow to analyze chat conversations for student risk assessment.
 *
 * - analyzeChatRisk - A function to analyze the risk level of a student based on a chat conversation.
 * - AnalyzeChatRiskInput - The input type for the analyzeChatRisk function.
 * - AnalyzeChatRiskOutput - The return type for the analyzeChatRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeChatRiskInputSchema = z.object({
  chatHistory: z.string().describe('The full transcript of the chat conversation between the student and the counselor.'),
});
export type AnalyzeChatRiskInput = z.infer<typeof AnalyzeChatRiskInputSchema>;

const AnalyzeChatRiskOutputSchema = z.object({
  riskLevel: z.enum(['low', 'medium', 'high']).describe("The assessed risk level of the student. Use 'low' for general stress or academic concerns, 'medium' for persistent anxiety/depression or significant distress, and 'high' for explicit mentions of self-harm, crisis, or immediate danger."),
  keyConcerns: z.array(z.string()).describe("A list of the student's key concerns or issues identified from the chat."),
  summary: z.string().describe('A brief summary of the student\'s emotional state and the reasoning for the risk assessment.'),
});
export type AnalyzeChatRiskOutput = z.infer<typeof AnalyzeChatRiskOutputSchema>;

export async function analyzeChatRisk(input: AnalyzeChatRiskInput): Promise<AnalyzeChatRiskOutput> {
  return analyzeChatRiskFlow(input);
}

const analyzeRiskPrompt = ai.definePrompt({
  name: 'analyzeRiskPrompt',
  input: {schema: AnalyzeChatRiskInputSchema},
  output: {schema: AnalyzeChatRiskOutputSchema},
  prompt: `You are an expert mental health crisis counselor. Your task is to analyze a chat conversation between a student and a peer buddy to assess the student's risk level.

Analyze the following conversation transcript:
{{{chatHistory}}}

Based on the conversation, determine the student's risk level, identify their key concerns, and provide a summary.
- Risk Level: Assess as 'low', 'medium', or 'high'. A 'high' risk designation should be reserved for situations indicating immediate danger, crisis, or mentions of self-harm. 'Medium' is for significant distress or persistent negative feelings. 'Low' is for general stress or academic concerns.
- Key Concerns: List the primary issues the student is facing (e.g., "Exam Anxiety", "Relationship Problems", "Depression").
- Summary: Briefly explain your reasoning for the assessed risk level and summarize the student's emotional state.`,
});

const analyzeChatRiskFlow = ai.defineFlow(
  {
    name: 'analyzeChatRiskFlow',
    inputSchema: AnalyzeChatRiskInputSchema,
    outputSchema: AnalyzeChatRiskOutputSchema,
  },
  async input => {
    const {output} = await analyzeRiskPrompt(input);
    return output!;
  }
);
