'use server';

/**
 * @fileOverview A Genkit flow for analyzing voice recordings for emotional tone.
 *
 * - analyzeVoice - A function that analyzes the voice in an audio clip and returns a mood assessment.
 * - VoiceAnalysisInput - The input type for the analyzeVoice function.
 * - VoiceAnalysisOutput - The return type for the analyzeVoice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VoiceAnalysisInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio recording of a person speaking, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VoiceAnalysisInput = z.infer<typeof VoiceAnalysisInputSchema>;

const VoiceAnalysisOutputSchema = z.object({
  mood: z.string().describe("The estimated primary mood from the voice tone (e.g., Calm, Anxious, Happy, Sad)."),
  confidence: z.number().describe("A confidence score (0-1) for the mood estimation."),
  summary: z.string().describe("A brief summary of the voice analysis, including notes on pace, tone, and sentiment."),
});
export type VoiceAnalysisOutput = z.infer<typeof VoiceAnalysisOutputSchema>;

export async function analyzeVoice(input: VoiceAnalysisInput): Promise<VoiceAnalysisOutput> {
  return voiceAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceAnalysisPrompt',
  input: { schema: VoiceAnalysisInputSchema },
  output: { schema: VoiceAnalysisOutputSchema },
  prompt: `You are an expert in voice analysis and sentiment detection. Analyze the provided audio recording of a person speaking.

  Based on the speaker's tone, pace, volume, and word choice, estimate their primary mood. Also provide a confidence score for your estimation and a brief summary of your findings.

  Audio: {{media url=audioDataUri}}`,
});

const voiceAnalysisFlow = ai.defineFlow(
  {
    name: 'voiceAnalysisFlow',
    inputSchema: VoiceAnalysisInputSchema,
    outputSchema: VoiceAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
