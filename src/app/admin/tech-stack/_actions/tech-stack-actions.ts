
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { Technology } from '@/lib/types';
import techStackData from '@/lib/tech-stack.json';

const techStackFilePath = path.join(process.cwd(), 'src/lib/tech-stack.json');

type ActionResponse = {
    success: boolean;
    message: string;
};

// Helper function to read the data file
async function readTechStackFile(): Promise<Technology[]> {
    return techStackData as Technology[];
}

// Helper function to write to the data file
async function writeTechStackFile(data: Technology[]) {
    if (process.env.VERCEL) {
        console.warn("Filesystem write operations are disabled on Vercel. Using in-memory data. For persistence, use a database.");
        return;
    }
    await fs.writeFile(techStackFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Action to get all technologies
export async function getTechStack(): Promise<Technology[]> {
    return await readTechStackFile();
}

// Schema for validation
const techSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name cannot be empty."),
});

// Action to add or update a technology
export async function addOrUpdateTechnology(formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = techSchema.safeParse(rawData);

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    try {
        const techStack = await readTechStackFile();
        const { id, name } = parsed.data;

        if (id) {
            // Update existing technology
            const techIndex = techStack.findIndex(t => t.id === id);
            if (techIndex > -1) {
                techStack[techIndex].name = name;
            } else {
                return { success: false, message: 'Technology not found.' };
            }
        } else {
            // Add new technology
            const newTech: Technology = {
                id: new Date().getTime().toString(),
                name,
            };
            techStack.push(newTech);
        }

        await writeTechStackFile(techStack);
        revalidatePath('/'); // Revalidate homepage to show new tech stack
        revalidatePath('/admin/tech-stack');

        return { success: true, message: `Technology '${name}' saved successfully.` };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}

// Action to delete a technology
export async function deleteTechnology(id: string): Promise<ActionResponse> {
    if (!id) {
        return { success: false, message: 'ID is required.' };
    }

    try {
        const techStack = await readTechStackFile();
        const updatedTechStack = techStack.filter(t => t.id !== id);

        if (techStack.length === updatedTechStack.length) {
            return { success: false, message: 'Technology not found.' };
        }

        await writeTechStackFile(updatedTechStack);
        revalidatePath('/');
        revalidatePath('/admin/tech-stack');

        return { success: true, message: 'Technology deleted successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}
