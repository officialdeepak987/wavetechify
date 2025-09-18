
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import type { Service } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import servicesData from '@/lib/services.json';

const servicesFilePath = path.join(process.cwd(), 'src/lib/services.json');
const publicImagesPath = path.join(process.cwd(), 'public/images');

export async function getServices(): Promise<Service[]> {
    return servicesData as Service[];
}

async function saveServices(services: Service[]) {
    if (process.env.VERCEL) {
        console.warn("Filesystem write operations are disabled on Vercel. Using in-memory data. For persistence, use a database.");
        return;
    }
    await fs.writeFile(servicesFilePath, JSON.stringify(services, null, 2), 'utf-8');
}

export async function getService(slug: string): Promise<Service | undefined> {
    const services = await getServices();
    return services.find((p) => p.slug === slug);
}

const formSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(5).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  icon: z.string().min(2),
  description: z.string().min(10),
  longDescription: z.string().min(50),
  points: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  tags: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  imageHint: z.string().min(2, "Image hint must be at least 2 characters."),
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
});

type ActionResponse = {
    success: boolean;
    message: string;
}

// Helper to save image
async function saveImage(imageFile: File): Promise<string | null> {
    await fs.mkdir(publicImagesPath, { recursive: true });

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeFileName = path.basename(imageFile.name).replace(/[^a-zA-Z0-9._-]/g, '');
    const imagePath = path.join(publicImagesPath, safeFileName);
    
    await fs.writeFile(imagePath, buffer);
    return `/images/${safeFileName}`;
}


export async function createService(formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = formSchema.safeParse(rawData);
    
    const imageFile = formData.get('image') as File | null;

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: 'Featured image is required.' };
    }
    
    const { title, slug, icon, description, longDescription, points, tags, imageHint, bgColor, textColor } = parsed.data;
    
    const services = await getServices();
    if (services.some(p => p.slug === slug)) {
        return { success: false, message: 'A service with this slug already exists.' };
    }

    try {
        const imageUrl = await saveImage(imageFile);
        if (!imageUrl) {
            return { success: false, message: 'Failed to save image.' };
        }
        
        const newService: Service = {
            id: new Date().getTime().toString(),
            title,
            slug,
            icon,
            description,
            longDescription,
            points,
            tags,
            image: imageUrl,
            imageHint,
            bgColor: bgColor || 'bg-gray-200',
            textColor: textColor || 'text-gray-800'
        };
        
        services.unshift(newService);
        await saveServices(services);

        revalidatePath('/admin/services');
        revalidatePath('/services');
        revalidatePath(`/services/${slug}`);
        
        return { success: true, message: 'Service created successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}


export async function updateService(id: string, formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = formSchema.safeParse(rawData);
    
    const imageFile = formData.get('image') as File | null;

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    const { title, slug, icon, description, longDescription, points, tags, imageHint, bgColor, textColor } = parsed.data;

    const services = await getServices();
    const serviceIndex = services.findIndex(p => p.id === id);

    if (serviceIndex === -1) {
        return { success: false, message: 'Service not found.' };
    }

    const existingService = services[serviceIndex];

    if (slug !== existingService.slug && services.some(p => p.slug === slug && p.id !== id)) {
        return { success: false, message: 'Another service with this slug already exists.' };
    }

    try {
        let imageUrl = existingService.image;
        if (imageFile && imageFile.size > 0) {
            imageUrl = await saveImage(imageFile) || existingService.image;
        }

        const updatedService: Service = {
            ...existingService,
            title,
            slug,
            icon,
            description,
            longDescription,
            points,
            tags,
            image: imageUrl,
            imageHint,
            bgColor: bgColor || existingService.bgColor,
            textColor: textColor || existingService.textColor,
        };

        services[serviceIndex] = updatedService;
        await saveServices(services);
        
        revalidatePath('/admin/services');
        revalidatePath('/services');
        revalidatePath(`/services/${existingService.slug}`);
        revalidatePath(`/services/${slug}`);

        return { success: true, message: 'Service updated successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}

export async function deleteService(id: string): Promise<ActionResponse> {
    if (!id) {
      return { success: false, message: 'Service ID is required.' };
    }
  
    try {
      const services = await getServices();
      const serviceToDelete = services.find((service) => service.id === id);

      if (!serviceToDelete) {
        return { success: false, message: 'Service not found.' };
      }
      
      const updatedServices = services.filter((service) => service.id !== id);
  
      await saveServices(updatedServices);
      
      revalidatePath('/admin/services');
      revalidatePath('/services');
      revalidatePath(`/services/${serviceToDelete.slug}`);
  
      return { success: true, message: 'Service successfully deleted.' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, message: `Server error: ${errorMessage}` };
    }
}
