
'use server';

/**
 * @fileOverview Personalized content recommendation AI agent.
 *
 * - recommendContent - A function that handles the content recommendation process.
 * - RecommendContentInput - The input type for the recommendContent function.
 * - RecommendContentOutput - The return type for the recommendContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ContactInquiry } from '@/lib/types';
import inquiriesData from '@/lib/inquiries.json';

async function getInquiries(): Promise<ContactInquiry[]> {
    return inquiriesData as ContactInquiry[];
}


const RecommendContentInputSchema = z.object({
  availableContent: z.array(z.string()).describe('The list of available content (URLs with titles).'),
});
export type RecommendContentInput = z.infer<typeof RecommendContentInputSchema>;

const RecommendContentOutputSchema = z.array(z.string()).describe('A list of up to 3 recommended content URLs.');
export type RecommendContentOutput = z.infer<typeof RecommendContentOutputSchema>;

export async function recommendContent(input: RecommendContentInput): Promise<RecommendContentOutput> {
  return recommendContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendContentPrompt',
  input: {schema: z.object({
    inquiries: z.array(z.object({ subject: z.string(), message: z.string() })),
    availableContent: z.array(z.string()),
  })},
  output: {schema: RecommendContentOutputSchema},
  prompt: `You are an expert content recommendation system for a tech company's blog.
  Your goal is to recommend the most relevant articles to a general audience based on the topics people are most frequently asking about in contact forms.

  Analyze the subjects and messages from the following user inquiries to identify the most popular topics and themes.
  
  ## User Inquiries:
  {{#each inquiries}}
  - Subject: {{{subject}}}, Message: {{{message}}}
  {{/each}}

  ## Available Blog Posts:
  {{#each availableContent}}
  - {{{this}}}
  {{/each}}

  Based on the recurring themes in the user inquiries, select up to 3 of the most relevant blog posts from the "Available Blog Posts" list.
  Return only the list of URLs for the recommended posts. Do not recommend a post if it is not highly relevant to the inquiries.
  `,
});

const recommendContentFlow = ai.defineFlow(
  {
    name: 'recommendContentFlow',
    inputSchema: RecommendContentInputSchema,
    outputSchema: RecommendContentOutputSchema,
  },
  async ({ availableContent }) => {
    const inquiries = await getInquiries();
    
    // We only need a summary of inquiries for the prompt
    const inquirySummaries = inquiries.map(i => ({ subject: i.subject, message: i.message.substring(0, 100) }));

    const {output} = await prompt({
        inquiries: inquirySummaries,
        availableContent,
    });
    return output!;
  }
);
