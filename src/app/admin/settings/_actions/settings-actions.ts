
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import type { SiteSettings } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import siteSettingsData from '@/lib/site-settings.json';

const settingsFilePath = path.join(process.cwd(), 'src/lib/site-settings.json');

const formSchema = z.object({
    contactEmail: z.string().email("Invalid email address."),
    contactPhone: z.string().min(10, "Phone number must be at least 10 characters."),
    officeAddress: z.string().min(10, "Address must be at least 10 characters."),
    twitterUrl: z.string().url().optional().or(z.literal('')),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
});

type ActionResponse = {
    success: boolean;
    message: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
    return siteSettingsData as SiteSettings;
}

async function saveSiteSettings(settings: SiteSettings) {
    if (process.env.VERCEL) {
        console.warn("Filesystem write operations are disabled on Vercel. Using in-memory data. For persistence, use a database.");
        return;
    }
    await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2), 'utf-8');
}


export async function updateSiteSettings(values: SiteSettings): Promise<ActionResponse> {
    const parsed = formSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    try {
        await saveSiteSettings(parsed.data);

        // Revalidate all paths that might use this data
        revalidatePath('/', 'layout');

        return { success: true, message: 'Site settings updated successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}
