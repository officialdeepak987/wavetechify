
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import type { Testimonial } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import testimonialsData from '@/lib/testimonials.json';

const testimonialsFilePath = path.join(process.cwd(), 'src/lib/testimonials.json');
const publicImagesPath = path.join(process.cwd(), 'public/images');

async function getTestimonials(): Promise<Testimonial[]> {
    return testimonialsData as Testimonial[];
}

async function saveTestimonials(testimonials: Testimonial[]) {
    if (process.env.VERCEL) {
        console.warn("Filesystem write operations are disabled on Vercel. Using in-memory data. For persistence, use a database.");
        return;
    }
    await fs.writeFile(testimonialsFilePath, JSON.stringify(testimonials, null, 2), 'utf-8');
}

export async function getTestimonial(id: string): Promise<Testimonial | undefined> {
    const testimonials = await getTestimonials();
    return testimonials.find((p) => p.id === id);
}

const formSchema = z.object({
  author: z.string().min(2, "Author name must be at least 2 characters."),
  company: z.string().min(2, "Company name must be at least 2 characters."),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
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

export async function createTestimonial(formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = formSchema.safeParse(rawData);

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data.' };
    }
    
    const { author, company, quote, imageHint } = parsed.data;
    const imageFile = rawData.image as File | undefined;
    
    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: 'Author photo is required.' };
    }
    
    try {
        const imageUrl = await saveImage(imageFile);
        if (!imageUrl) {
            return { success: false, message: 'Failed to save image.' };
        }
        
        const newTestimonial: Testimonial = {
            id: new Date().getTime().toString(),
            author,
            company,
            quote,
            imageHint,
            image: imageUrl,
        };
        
        const testimonials = await getTestimonials();
        testimonials.unshift(newTestimonial);
        await saveTestimonials(testimonials);

        revalidatePath('/admin/testimonials');
        revalidatePath('/');
        
        return { success: true, message: 'Testimonial added successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}

export async function updateTestimonial(id: string, formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = formSchema.safeParse(rawData);

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    const { author, company, quote, imageHint } = parsed.data;
    const imageFile = rawData.image as File | undefined;

    const testimonials = await getTestimonials();
    const testimonialIndex = testimonials.findIndex(p => p.id === id);

    if (testimonialIndex === -1) {
        return { success: false, message: 'Testimonial not found.' };
    }

    const existingTestimonial = testimonials[testimonialIndex];

    try {
        let imageUrl = existingTestimonial.image;
        if (imageFile && imageFile.size > 0) {
            imageUrl = await saveImage(imageFile) || existingTestimonial.image;
        }

        const updatedTestimonial: Testimonial = {
            ...existingTestimonial,
            author,
            company,
            quote,
            imageHint,
            image: imageUrl,
        };

        testimonials[testimonialIndex] = updatedTestimonial;
        await saveTestimonials(testimonials);
        
        revalidatePath('/admin/testimonials');
        revalidatePath('/');

        return { success: true, message: 'Testimonial updated successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}

export async function deleteTestimonial(id: string): Promise<ActionResponse> {
    if (!id) {
      return { success: false, message: 'Testimonial ID is required.' };
    }
  
    try {
      const testimonials = await getTestimonials();
      const updatedTestimonials = testimonials.filter((t) => t.id !== id);

      if (testimonials.length === updatedTestimonials.length) {
        return { success: false, message: 'Testimonial not found.' };
      }
  
      await saveTestimonials(updatedTestimonials);
      
      revalidatePath('/admin/testimonials');
      revalidatePath('/');
  
      return { success: true, message: 'Testimonial successfully deleted.' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, message: `Server error: ${errorMessage}` };
    }
}
