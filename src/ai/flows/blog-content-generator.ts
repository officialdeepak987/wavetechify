'use server';

/**
 * @fileOverview An AI agent for generating blog post content.
 *
 * - generateBlogContent - A function that handles the blog content generation process.
 * - GenerateBlogContentInput - The input type for the generateBlogContent function.
 * - GenerateBlogContentOutput - The return type for the generateBlogContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogContentInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
});
export type GenerateBlogContentInput = z.infer<typeof GenerateBlogContentInputSchema>;

const GenerateBlogContentOutputSchema = z.object({
    content: z.string().describe('The generated blog post content as an HTML string. It should include headings (h2, h3), paragraphs (p), and lists (ul, li).'),
});
export type GenerateBlogContentOutput = z.infer<typeof GenerateBlogContentOutputSchema>;


export async function generateBlogContent(
  input: GenerateBlogContentInput
): Promise<GenerateBlogContentOutput> {
  return generateBlogContentFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateBlogContentPrompt',
  input: {schema: GenerateBlogContentInputSchema},
  output: {schema: GenerateBlogContentOutputSchema},
  prompt: `You are an expert blog writer and SEO specialist.
  Your task is to generate a comprehensive, well-structured, and engaging blog post based on the provided title.
  The output must be a single HTML string.

  Guidelines:
  - The content should be informative and valuable to the reader.
  - Structure the article with appropriate headings (<h2>, <h3>), paragraphs (<p>), and unordered lists (<ul> with <li> items).
  - Do not include <h1> tags, as the title will be the main heading.
  - Write in a clear, concise, and professional tone.
  - Ensure the HTML is clean and well-formatted.

  Blog Post Title:
  "{{{title}}}"
  `,
});


const generateBlogContentFlow = ai.defineFlow(
  {
    name: 'generateBlogContentFlow',
    inputSchema: GenerateBlogContentInputSchema,
    outputSchema: GenerateBlogContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
