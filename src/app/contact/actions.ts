
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import type { ContactInquiry } from '@/lib/types';
import { format, formatISO } from 'date-fns';
import { revalidatePath } from 'next/cache';
import inquiriesData from '@/lib/inquiries.json';

const inquiriesFilePath = path.join(process.cwd(), 'src/lib/inquiries.json');

async function getInquiries(): Promise<ContactInquiry[]> {
    return inquiriesData as ContactInquiry[];
}

async function saveInquiries(inquiries: ContactInquiry[]) {
    if (process.env.VERCEL) {
        console.warn("Filesystem write operations are disabled on Vercel. Using in-memory data. For persistence, use a database.");
        return;
    }
    await fs.writeFile(inquiriesFilePath, JSON.stringify(inquiries, null, 2), 'utf-8');
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  preferredDate: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date().optional()),
});

export type FormState = {
    success: boolean;
    message: string;
}

// This is the action for the main /contact page
export async function submitContactInquiry(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const rawData = Object.fromEntries(formData.entries());
    
    const parsed = formSchema.safeParse(rawData);

    if (!parsed.success) {
        const errorMessages = parsed.error.issues.map(issue => issue.message).join(', ');
        return { success: false, message: `Invalid input: ${errorMessages}` };
    }

    try {
        const inquiries = await getInquiries();
        const newInquiry: ContactInquiry = {
            id: new Date().getTime().toString(),
            ...parsed.data,
            date: format(new Date(), 'yyyy-MM-dd'),
            preferredDate: parsed.data.preferredDate ? format(parsed.data.preferredDate, 'yyyy-MM-dd') : null,
        };

        inquiries.unshift(newInquiry); // Add to the beginning of the list
        await saveInquiries(inquiries);

        return { success: true, message: "Thanks for reaching out. We'll get back to you shortly." };
    } catch (error) {
        console.error('Failed to process contact form:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}


// This is the action for the homepage contact form
const homepageFormSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    company: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
  });

export async function submitHomepageInquiry(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const parsed = homepageFormSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
        const errorMessages = parsed.error.issues.map(issue => issue.message).join(', ');
        return { success: false, message: `Invalid input: ${errorMessages}` };
    }

    try {
        const { name, email, phone, company, message } = parsed.data;
        const subject = `Inquiry from ${company || 'Homepage Form'}`;
        const finalMessage = `Phone: ${phone || 'N/A'}\n\n${message}`;

        const inquiries = await getInquiries();
        const newInquiry: ContactInquiry = {
            id: new Date().getTime().toString(),
            name,
            email,
            subject,
            message: finalMessage,
            date: format(new Date(), 'yyyy-MM-dd'),
            preferredDate: null,
        };
        
        inquiries.unshift(newInquiry);
        await saveInquiries(inquiries);
        
        return { success: true, message: "Thanks for your inquiry! We will get back to you soon." };
    } catch (error) {
         console.error('Failed to process homepage contact form:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}

// Action for pricing inquiry form
const pricingInquirySchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'A valid phone number is required'),
    message: z.string().optional(),
    planName: z.string(),
  });

export async function submitPricingInquiry(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const parsed = pricingInquirySchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
        const errorMessages = parsed.error.issues.map(issue => issue.message).join(', ');
        return { success: false, message: `Invalid input: ${errorMessages}` };
    }
    
    try {
        const { name, email, phone, message, planName } = parsed.data;
        const subject = `Pricing Inquiry: ${planName}`;
        const finalMessage = `Phone/WhatsApp: ${phone}\n\n${message || 'No message provided.'}`;

        const inquiries = await getInquiries();
        const newInquiry: ContactInquiry = {
            id: new Date().getTime().toString(),
            name,
            email,
            subject,
            message: finalMessage,
            date: format(new Date(), 'yyyy-MM-dd'),
            preferredDate: null,
        };
        
        inquiries.unshift(newInquiry);
        await saveInquiries(inquiries);

        return { success: true, message: `Thanks for your interest in the ${planName}. We will contact you shortly!` };

    } catch (error) {
        console.error('Failed to process pricing inquiry:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}

export async function deleteInquiry(inquiryId: string): Promise<FormState> {
    if (!inquiryId) {
      return { success: false, message: 'Inquiry ID is required.' };
    }
  
    try {
      const inquiries = await getInquiries();
      const updatedInquiries = inquiries.filter((inquiry) => inquiry.id !== inquiryId);
  
      if (inquiries.length === updatedInquiries.length) {
        return { success: false, message: 'Inquiry not found.' };
      }
  
      await saveInquiries(updatedInquiries);
      
      // Revalidate the path to refresh the data on the inquiries page
      revalidatePath('/admin/inquiries');
  
      return { success: true, message: 'Inquiry successfully deleted.' };
    } catch (error) {
      console.error('Failed to delete inquiry:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, message: `Server error: ${errorMessage}` };
    }
}

export async function getInquiriesAction(): Promise<ContactInquiry[]> {
    return await getInquiries();
}
