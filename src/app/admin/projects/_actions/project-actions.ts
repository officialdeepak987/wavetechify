
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import type { Project } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import projectsData from '@/lib/projects.json';

const projectsFilePath = path.join(process.cwd(), 'src/lib/projects.json');
const publicImagesPath = path.join(process.cwd(), 'public/images');

export async function getProjects(): Promise<Project[]> {
    return projectsData as Project[];
}

async function saveProjects(projects: Project[]) {
    if (process.env.VERCEL) {
        console.warn("Filesystem write operations are disabled on Vercel. Using in-memory data. For persistence, use a database.");
        return;
    }
    await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), 'utf-8');
}

export async function getProject(slug: string): Promise<Project | undefined> {
    const projects = await getProjects();
    return projects.find((p) => p.slug === slug);
}


const formSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(5).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().min(3),
  client: z.string().min(2),
  location: z.string().min(2),
  completedDate: z.string().min(5),
  description: z.string().min(10),
  longDescription: z.string().min(50),
  solution: z.string().min(50),
  imageHint: z.string().min(2),
  requirements: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
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


export async function createProject(formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = formSchema.safeParse(rawData);

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data.' };
    }
    
    const { title, slug, category, client, location, completedDate, description, longDescription, solution, imageHint, requirements } = parsed.data;
    const imageFile = rawData.image as File | undefined;
    
    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: 'Featured image is required.' };
    }
    
    const projects = await getProjects();
    if (projects.some(p => p.slug === slug)) {
        return { success: false, message: 'A project with this slug already exists.' };
    }

    try {
        const imageUrl = await saveImage(imageFile);
        if (!imageUrl) {
            return { success: false, message: 'Failed to save image.' };
        }
        
        const newProject: Project = {
            id: new Date().getTime().toString(),
            title,
            slug,
            category,
            client,
            location,
            completedDate,
            description,
            longDescription,
            solution,
            imageHint,
            requirements,
            image: imageUrl,
        };
        
        projects.unshift(newProject);
        await saveProjects(projects);

        revalidatePath('/admin/projects');
        revalidatePath('/portfolio');
        revalidatePath(`/portfolio/${slug}`);
        
        return { success: true, message: 'Project created successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}


export async function updateProject(id: string, formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = formSchema.safeParse(rawData);

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    const { title, slug, category, client, location, completedDate, description, longDescription, solution, imageHint, requirements } = parsed.data;
    const imageFile = rawData.image as File | undefined;

    const projects = await getProjects();
    const projectIndex = projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
        return { success: false, message: 'Project not found.' };
    }

    const existingProject = projects[projectIndex];

    if (slug !== existingProject.slug && projects.some(p => p.slug === slug && p.id !== id)) {
        return { success: false, message: 'Another project with this slug already exists.' };
    }

    try {
        let imageUrl = existingProject.image;
        if (imageFile && imageFile.size > 0) {
            imageUrl = await saveImage(imageFile) || existingProject.image;
        }

        const updatedProject: Project = {
            ...existingProject,
            title,
            slug,
            category,
            client,
            location,
            completedDate,
            description,
            longDescription,
            solution,
            imageHint,
            requirements,
            image: imageUrl,
        };

        projects[projectIndex] = updatedProject;
        await saveProjects(projects);
        
        revalidatePath('/admin/projects');
        revalidatePath('/portfolio');
        revalidatePath(`/portfolio/${existingProject.slug}`);
        revalidatePath(`/portfolio/${slug}`);

        return { success: true, message: 'Project updated successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}

export async function deleteProject(id: string): Promise<ActionResponse> {
    if (!id) {
      return { success: false, message: 'Project ID is required.' };
    }
  
    try {
      const projects = await getProjects();
      const projectToDelete = projects.find((project) => project.id === id);

      if (!projectToDelete) {
        return { success: false, message: 'Project not found.' };
      }
      
      const updatedProjects = projects.filter((project) => project.id !== id);
  
      await saveProjects(updatedProjects);
      
      revalidatePath('/admin/projects');
      revalidatePath('/portfolio');
      revalidatePath(`/portfolio/${projectToDelete.slug}`);
  
      return { success: true, message: 'Project successfully deleted.' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, message: `Server error: ${errorMessage}` };
    }
}
