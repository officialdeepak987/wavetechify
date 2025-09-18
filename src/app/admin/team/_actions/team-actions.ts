
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import type { TeamMember } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import teamMembersData from '@/lib/team-members.json';

const teamMembersFilePath = path.join(process.cwd(), 'src/lib/team-members.json');
const publicImagesPath = path.join(process.cwd(), 'public/images');

export async function getTeamMembers(): Promise<TeamMember[]> {
    return teamMembersData as TeamMember[];
}

async function saveTeamMembers(members: TeamMember[]) {
    if (process.env.VERCEL) {
        console.warn("Filesystem write operations are disabled on Vercel. Using in-memory data. For persistence, use a database.");
        return;
    }
    await fs.writeFile(teamMembersFilePath, JSON.stringify(members, null, 2), 'utf-8');
}

export async function getTeamMember(id: string): Promise<TeamMember | undefined> {
    const members = await getTeamMembers();
    return members.find((p) => p.id === id);
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(5, "Role must be at least 5 characters."),
  twitter: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  imageHint: z.string().min(2, "Image hint must be at least 2 characters."),
  image: z.any().optional(),
});


type ActionResponse = {
    success: boolean;
    message: string;
}

async function saveImage(imageFile: File | undefined): Promise<string | null> {
    if (!imageFile) return null;
    await fs.mkdir(publicImagesPath, { recursive: true });
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imagePath = path.join(publicImagesPath, imageFile.name);
    await fs.writeFile(imagePath, buffer);
    return `/images/${imageFile.name}`;
}

export async function createTeamMember(formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = formSchema.safeParse(rawData);

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data.' };
    }
    
    const { name, role, twitter, linkedin, imageHint } = parsed.data;
    const imageFile = rawData.image as File | undefined;
    
    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: 'Profile photo is required.' };
    }
    
    try {
        const imageUrl = await saveImage(imageFile);
        if (!imageUrl) {
            return { success: false, message: 'Failed to save image.' };
        }
        
        const newMember: TeamMember = {
            id: new Date().getTime().toString(),
            name,
            role,
            twitter,
            linkedin,
            imageHint,
            image: imageUrl,
        };
        
        const members = await getTeamMembers();
        members.unshift(newMember);
        await saveTeamMembers(members);

        revalidatePath('/admin/team');
        revalidatePath('/');
        revalidatePath('/about');
        
        return { success: true, message: 'Team member added successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}

export async function updateTeamMember(id: string, formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = formSchema.safeParse(rawData);

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    const { name, role, twitter, linkedin, imageHint } = parsed.data;
    const imageFile = rawData.image as File | undefined;

    const members = await getTeamMembers();
    const memberIndex = members.findIndex(p => p.id === id);

    if (memberIndex === -1) {
        return { success: false, message: 'Team member not found.' };
    }

    const existingMember = members[memberIndex];

    try {
        let imageUrl = existingMember.image;
        if (imageFile && imageFile.size > 0) {
            imageUrl = await saveImage(imageFile) || existingMember.image;
        }

        const updatedMember: TeamMember = {
            ...existingMember,
            name,
            role,
            twitter,
            linkedin,
            imageHint,
            image: imageUrl,
        };

        members[memberIndex] = updatedMember;
        await saveTeamMembers(members);
        
        revalidatePath('/admin/team');
        revalidatePath('/');
        revalidatePath('/about');

        return { success: true, message: 'Team member updated successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}

export async function deleteTeamMember(id: string): Promise<ActionResponse> {
    if (!id) {
      return { success: false, message: 'Member ID is required.' };
    }
  
    try {
      const members = await getTeamMembers();
      const updatedMembers = members.filter((member) => member.id !== id);

      if (members.length === updatedMembers.length) {
        return { success: false, message: 'Member not found.' };
      }
  
      await saveTeamMembers(updatedMembers);
      
      revalidatePath('/admin/team');
      revalidatePath('/');
      revalidatePath('/about');
  
      return { success: true, message: 'Team member successfully deleted.' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, message: `Server error: ${errorMessage}` };
    }
}
