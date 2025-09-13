
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

const AssessmentResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    score: z.number(),
    interpretation: z.string(),
    date: z.string(),
});

const CalculateWellbeingScoreInputSchema = z.object({
  conversation: z
    .string()
    .optional()
    .describe('The conversation between the student and the AI companion.'),
  facialAnalysis: FacialAnalysisOutputSchema.optional().describe('The results of a facial analysis.'),
  voiceAnalysis: VoiceAnalysisOutputSchema.optional().describe('The results of a voice analysis.'),
  mood: z.string().optional().describe('The student\'s self-reported mood for the day.'),
  journalEntry: z.string().optional().describe('A journal entry from the student.'),
  sleepHours: z.number().optional().describe('The number of hours the student slept.'),
  screenTimeHours: z.number().optional().describe('The number of hours the student spent on screens.'),
  assessmentResults: z.array(AssessmentResultSchema).optional().describe("An array of completed standardized assessment results (e.g., PHQ-9, GAD-7)."),
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
  selfHarmRisk: z.boolean().describe('Whether the conversation indicates a risk of self-harm.')
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

  Consider all available factors: expressed emotions in conversations, mood from analysis tools, self-reported data, and formal assessment results. Higher scores on assessments like PHQ-9 (depression) and GAD-7 (anxiety) should lower the well-being score significantly.
  
  Your summary should synthesize all available information.
  
  Critically, you must analyze the conversation and journal entries for any indication of self-harm intent or ideation. If any such language is present, set the selfHarmRisk field to true. Otherwise, set it to false.

  {{#if conversation}}
  Conversation History:
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
  
  {{#if mood}}
  Self-Reported Mood: {{mood}}
  {{/if}}

  {{#if journalEntry}}
  Journal Entry:
  {{{journalEntry}}}
  {{/if}}

  {{#if sleepHours}}
  Hours Slept: {{sleepHours}}
  {{/if}}
  
  {{#if screenTimeHours}}
  Screen Time (hours): {{screenTimeHours}}
  {{/if}}

  {{#if assessmentResults}}
  Completed Assessments:
  {{#each assessmentResults}}
  - {{this.name}}: Score {{this.score}} (Interpretation: {{this.interpretation}})
  {{/each}}
  {{/if}}

  Based on all the available data, provide a well-being score, a brief summary of your analysis, and assess the self-harm risk.
  `,
});

const calculateWellbeingScoreFlow = ai.defineFlow(
  {
    name: 'calculateWellbeingScoreFlow',
    inputSchema: CalculateWellbeingScoreInputSchema,
    outputSchema: CalculateWellbeingScoreOutputSchema,
  },
  async input => {
    if (!input.conversation && !input.facialAnalysis && !input.voiceAnalysis && !input.mood && !input.assessmentResults) {
      return {
        wellbeingScore: 0,
        summary: "Start a conversation or use the analysis tools to get your well-being score.",
        selfHarmRisk: false,
      }
    }
    const {output} = await prompt(input);
    return output!;
  }
);
