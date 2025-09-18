'use server';

/**
 * @fileOverview A smart suggestion tool that provides relevant articles, services, or case studies based on user activity.
 *
 * - suggestRelevantContent - A function that suggests content based on the current page or user activity.
 * - SuggestRelevantContentInput - The input type for the suggestRelevantContent function.
 * - SuggestRelevantContentOutput - The return type for the suggestRelevantContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantContentInputSchema = z.object({
  currentUrl: z
    .string()
    .describe('The URL of the current page the user is viewing.'),
  userActivity: z
    .string()
    .optional()
    .describe('A description of the user activity on the site.'),
});
export type SuggestRelevantContentInput = z.infer<typeof SuggestRelevantContentInputSchema>;

const SuggestRelevantContentOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggested articles, services, or case studies.'),
});
export type SuggestRelevantContentOutput = z.infer<typeof SuggestRelevantContentOutputSchema>;

export async function suggestRelevantContent(
  input: SuggestRelevantContentInput
): Promise<SuggestRelevantContentOutput> {
  return suggestRelevantContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantContentPrompt',
  input: {schema: SuggestRelevantContentInputSchema},
  output: {schema: SuggestRelevantContentOutputSchema},
  prompt: `You are an AI assistant that suggests relevant articles, services, or case studies based on the user's current page and activity on the website.

  Current URL: {{{currentUrl}}}
  User Activity: {{{userActivity}}}

  Based on the current URL and user activity, suggest a list of relevant articles, services, or case studies that the user might be interested in. Return the suggestions as a list of strings.
  Each string in the list should be a short title of the suggested content.
  Do not suggest content that is not related to the current URL or user activity.
`,
});

const suggestRelevantContentFlow = ai.defineFlow(
  {
    name: 'suggestRelevantContentFlow',
    inputSchema: SuggestRelevantContentInputSchema,
    outputSchema: SuggestRelevantContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
