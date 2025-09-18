
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { CountryPricing, PricingData, PricingPlan } from '@/lib/types';
import pricingDataJson from '@/lib/pricing-plans.json';

const pricingFilePath = path.join(process.cwd(), 'src/lib/pricing-plans.json');

type ActionResponse = {
    success: boolean;
    message: string;
}

export async function getPricingData(): Promise<PricingData> {
    return pricingDataJson as PricingData;
}

async function savePricingData(data: PricingData) {
    if (process.env.VERCEL) {
        console.warn("Filesystem write operations are disabled on Vercel. Using in-memory data. For persistence, use a database.");
        return;
    }
    await fs.writeFile(pricingFilePath, JSON.stringify(data, null, 2), 'utf-8');
    revalidatePath('/admin/pricing');
    revalidatePath('/pricing');
}

// Country Actions
const countrySchema = z.object({
    countryCode: z.string().min(2).max(2).transform(v => v.toUpperCase()),
    name: z.string().min(2),
    currency: z.string().min(3).max(3).transform(v => v.toUpperCase()),
    currencySymbol: z.string().min(1),
});

export async function addOrUpdateCountry(formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = countrySchema.safeParse(rawData);

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data for country.' };
    }

    try {
        const data = await getPricingData();
        const { countryCode, ...countryData } = parsed.data;

        if (!data[countryCode]) {
            data[countryCode] = { ...countryData, plans: [] }; // Add new country
        } else {
            data[countryCode] = { ...data[countryCode], ...countryData }; // Update existing
        }

        await savePricingData(data);
        return { success: true, message: `Country ${countryCode} saved successfully.` };
    } catch (error) {
        return { success: false, message: 'Server error while saving country.' };
    }
}

export async function deleteCountry(countryCode: string): Promise<ActionResponse> {
    try {
        const data = await getPricingData();
        if (!data[countryCode]) {
            return { success: false, message: 'Country not found.' };
        }
        delete data[countryCode];
        await savePricingData(data);
        return { success: true, message: `Country ${countryCode} deleted successfully.` };
    } catch (error) {
        return { success: false, message: 'Server error while deleting country.' };
    }
}


// Plan Actions
const planSchema = z.object({
    id: z.string().optional(),
    countryCode: z.string(),
    name: z.string().min(2),
    priceMonthly: z.coerce.number().positive(),
    priceSuffix: z.string().min(1),
    features: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
});

export async function addOrUpdatePlan(formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = planSchema.safeParse(rawData);

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data for plan.' };
    }
    
    try {
        const data = await getPricingData();
        const { countryCode, id, ...planData } = parsed.data;

        if (!data[countryCode]) {
            return { success: false, message: 'Country not found for this plan.' };
        }

        const planIndex = data[countryCode].plans.findIndex(p => p.id === id);

        if (planIndex > -1) {
            // Update existing plan
            data[countryCode].plans[planIndex] = { ...data[countryCode].plans[planIndex], ...planData };
        } else {
            // Add new plan
            const newPlan: PricingPlan = {
                id: `${countryCode.toLowerCase()}-${new Date().getTime()}`,
                ...planData
            };
            data[countryCode].plans.push(newPlan);
        }

        await savePricingData(data);
        return { success: true, message: `Plan in ${countryCode} saved successfully.` };
    } catch (error) {
        return { success: false, message: 'Server error while saving plan.' };
    }
}


export async function deletePlan(countryCode: string, planId: string): Promise<ActionResponse> {
    try {
        const data = await getPricingData();
        if (!data[countryCode]) {
            return { success: false, message: 'Country not found.' };
        }

        const initialLength = data[countryCode].plans.length;
        data[countryCode].plans = data[countryCode].plans.filter(p => p.id !== planId);
        
        if (data[countryCode].plans.length === initialLength) {
             return { success: false, message: 'Plan not found.' };
        }

        await savePricingData(data);
        return { success: true, message: 'Plan deleted successfully.' };
    } catch (error) {
        return { success: false, message: 'Server error while deleting plan.' };
    }
}
