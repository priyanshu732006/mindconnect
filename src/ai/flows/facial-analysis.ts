'use server';

/**
 * @fileOverview A Genkit flow for analyzing facial expressions from an image.
 *
 * - analyzeFacialExpression - A function that analyzes the facial expression in an image and returns a mood assessment.
 * - FacialAnalysisInput - The input type for the analyzeFacialExpression function.
 * - FacialAnalysisOutput - The return type for the analyzeFacialExpression function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FacialAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type FacialAnalysisInput = z.infer<typeof FacialAnalysisInputSchema>;

const FacialAnalysisOutputSchema = z.object({
  mood: z.string().describe("The estimated mood of the person in the photo (e.g., Happy, Sad, Neutral, Surprised)."),
  confidence: z.number().describe("A confidence score (0-1) for the mood estimation."),
  summary: z.string().describe("A brief summary of the facial expression analysis."),
});
export type FacialAnalysisOutput = z.infer<typeof FacialAnalysisOutputSchema>;

export async function analyzeFacialExpression(input: FacialAnalysisInput): Promise<FacialAnalysisOutput> {
  return facialAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'facialAnalysisPrompt',
  input: {schema: FacialAnalysisInputSchema},
  output: {schema: FacialAnalysisOutputSchema},
  prompt: `You are an expert in analyzing human facial expressions. Analyze the provided image and estimate the person's mood.

  Provide the estimated mood, a confidence score for your estimation, and a brief summary.

  Photo: {{media url=photoDataUri}}`,
});

const facialAnalysisFlow = ai.defineFlow(
  {
    name: 'facialAnalysisFlow',
    inputSchema: FacialAnalysisInputSchema,
    outputSchema: FacialAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
