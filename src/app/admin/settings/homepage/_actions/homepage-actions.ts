
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import type { HomepageContent, Testimonial } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import homepageContentData from '@/lib/homepage-content.json';
import testimonialsData from '@/lib/testimonials.json';


const contentFilePath = path.join(process.cwd(), 'src/lib/homepage-content.json');

const faqItemSchema = z.object({
    question: z.string().min(1, "FAQ Question cannot be empty"),
    answer: z.string().min(1, "FAQ Answer cannot be empty"),
});

const missionCardSchema = z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string()
});

const formSchema = z.object({
    heroGreeting: z.string().min(1, "Greeting is required."),
    heroBrandName: z.string().min(1, "Brand name is required."),
    heroHeadline: z.string().min(10, "Headline is required."),
    heroSubheadline: z.string().min(20, "Subheadline is required."),
    heroCtaButton: z.string().min(5, "CTA button text is required."),
    heroStatCard1Value: z.string().min(1, "Stat value is required."),
    heroStatCard1Text: z.string().min(5, "Stat text is required."),
    heroFeatures: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
    heroProgressValue: z.string().min(1, "Progress value is required."),
    heroProgressText: z.string().min(10, "Progress text is required."),
    
    // About Us Section
    aboutGreeting: z.string().min(1),
    aboutHeadline: z.string().min(1),
    aboutSubheadline: z.string().min(1),
    aboutAwardTitle: z.string().min(1),
    aboutAwardText: z.string().min(1),

    // About Page Section
    aboutPageGreeting: z.string().min(1),
    aboutPageHeadline: z.string().min(1),
    aboutPageSubheadline: z.string().min(1),
    aboutPageMissionCards: z.string().transform(val => {
        try {
            return JSON.parse(val);
        } catch {
            return [];
        }
    }).pipe(z.array(missionCardSchema)),

    // Why Choose Us Section
    whyUsGreeting: z.string().min(1),
    whyUsHeadline: z.string().min(1),
    whyUsSubheadline: z.string().min(1),
    whyUsCards: z.string().transform(val => {
        try {
            return JSON.parse(val);
        } catch {
            return [];
        }
    }).pipe(z.array(z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string()
    }))),

    // Working Process Section
    workingProcessGreeting: z.string().min(1),
    workingProcessHeadline: z.string().min(1),
    workingProcessSteps: z.string().transform(val => {
        try {
            return JSON.parse(val);
        } catch {
            return [];
        }
    }).pipe(z.array(z.object({
        title: z.string(),
        content: z.string()
    }))),

    // FAQ Section
    faqHeadline: z.string().min(1),
    faqSubheadline: z.string().min(1),
    faqItems: z.string().transform(val => {
        try {
            return JSON.parse(val);
        } catch {
            return [];
        }
    }).pipe(z.array(faqItemSchema))
});

type ActionResponse = {
    success: boolean;
    message: string;
}

interface PageContent extends HomepageContent {
    testimonials: Testimonial[];
}

export async function getHomepageContent(): Promise<PageContent> {
    return {
        ...(homepageContentData as HomepageContent),
        testimonials: testimonialsData as Testimonial[],
    };
}

async function saveHomepageContent(content: HomepageContent) {
    if (process.env.VERCEL) {
        console.warn("Filesystem write operations are disabled on Vercel. Using in-memory data. For persistence, use a database.");
        return;
    }
    await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2), 'utf-8');
}

export async function updateHomepageContent(formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    
    const parsed = formSchema.safeParse(rawData);

    if (!parsed.success) {
        console.error("Form validation failed:", parsed.error.flatten().fieldErrors);
        return { success: false, message: 'Invalid form data. Check all fields.' };
    }

    try {
        const currentContent = await getHomepageContent();
        
        const newContent: HomepageContent = {
            ...currentContent,
            hero: {
                greeting: parsed.data.heroGreeting,
                brandName: parsed.data.heroBrandName,
                headline: parsed.data.heroHeadline,
                subheadline: parsed.data.heroSubheadline,
                ctaButton: parsed.data.heroCtaButton,
                statCard1: {
                    value: parsed.data.heroStatCard1Value,
                    text: parsed.data.heroStatCard1Text
                },
                featureCard: {
                    features: parsed.data.heroFeatures,
                },
                progressCard: {
                    value: parsed.data.heroProgressValue,
                    text: parsed.data.heroProgressText,
                }
            },
             about: {
                greeting: parsed.data.aboutGreeting,
                headline: parsed.data.aboutHeadline,
                subheadline: parsed.data.aboutSubheadline,
                awardCard: {
                    title: parsed.data.aboutAwardTitle,
                    text: parsed.data.aboutAwardText,
                }
            },
            aboutPage: {
                greeting: parsed.data.aboutPageGreeting,
                headline: parsed.data.aboutPageHeadline,
                subheadline: parsed.data.aboutPageSubheadline,
                missionCards: parsed.data.aboutPageMissionCards
            },
            whyUs: {
                greeting: parsed.data.whyUsGreeting,
                headline: parsed.data.whyUsHeadline,
                subheadline: parsed.data.whyUsSubheadline,
                cards: parsed.data.whyUsCards
            },
            workingProcess: {
                greeting: parsed.data.workingProcessGreeting,
                headline: parsed.data.workingProcessHeadline,
                steps: parsed.data.workingProcessSteps
            },
            faq: {
                headline: parsed.data.faqHeadline,
                subheadline: parsed.data.faqSubheadline,
                items: parsed.data.faqItems
            }
        };

        await saveHomepageContent(newContent);
        
        revalidatePath('/'); // Revalidate homepage
        revalidatePath('/about'); // Revalidate about page

        return { success: true, message: 'Homepage content updated successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}
