
'use server';

/**
 * @fileOverview AI-powered moderation for anonymous community discussions.
 *
 * - moderatePost - A function to moderate community posts.
 * - ModeratePostInput - The input type for the moderatePost function.
 * - ModeratePostOutput - The return type for the moderatePost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModeratePostInputSchema = z.object({
  postContent: z.string().describe('The content of the community post to be moderated.'),
  topicCategory: z.string().describe('The topic category of the post (e.g., mental health, academics, relationships).'),
});
export type ModeratePostInput = z.infer<typeof ModeratePostInputSchema>;

const ModeratePostOutputSchema = z.object({
  isAppropriate: z.boolean().describe('Whether the post is appropriate for the community.'),
  flagReason: z.string().optional().describe('The reason the post was flagged as inappropriate, if applicable.'),
});
export type ModeratePostOutput = z.infer<typeof ModeratePostOutputSchema>;

export async function moderatePost(input: ModeratePostInput): Promise<ModeratePostOutput> {
  return moderatePostFlow(input);
}

const moderatePostPrompt = ai.definePrompt({
  name: 'moderatePostPrompt',
  input: {schema: ModeratePostInputSchema},
  output: {schema: ModeratePostOutputSchema},
  prompt: `You are an AI-powered moderator for an anonymous student community discussion forum.
Your goal is to ensure a safe and stigma-free environment by identifying and flagging inappropriate content based on predefined topic categories.

Analyze the following post content and determine if it is appropriate for the community, given its topic category.

Post Content: {{{postContent}}}
Topic Category: {{{topicCategory}}}

Consider the following criteria for determining appropriateness:
- Respectful and constructive communication
- Relevance to the topic category
- Absence of hate speech, harassment, or discrimination
- No promotion of illegal activities or self-harm
- No sharing of personally identifiable information

Respond with a JSON object indicating whether the post is appropriate and, if not, the reason for flagging it.
`,
});

const moderatePostFlow = ai.defineFlow(
  {
    name: 'moderatePostFlow',
    inputSchema: ModeratePostInputSchema,
    outputSchema: ModeratePostOutputSchema,
  },
  async input => {
    const {output} = await moderatePostPrompt(input);
    return output!;
  }
);
