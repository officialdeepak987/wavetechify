
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { updateHomepageContent } from "../_actions/homepage-actions"
import { useRouter } from "next/navigation"
import type { HomepageContent } from "@/lib/types"

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
    heroFeatures: z.string(),
    heroProgressValue: z.string().min(1, "Progress value is required."),
    heroProgressText: z.string().min(10, "Progress text is required."),
    
    // About Us Section
    aboutGreeting: z.string().min(1, "Greeting is required."),
    aboutHeadline: z.string().min(1, "Headline is required."),
    aboutSubheadline: z.string().min(1, "Subheadline is required."),
    aboutAwardTitle: z.string().min(1, "Award title is required."),
    aboutAwardText: z.string().min(1, "Award text is required."),

    // About Page
    aboutPageGreeting: z.string().min(1),
    aboutPageHeadline: z.string().min(1),
    aboutPageSubheadline: z.string().min(1),
    aboutPageMissionCards: z.string(),
    
    // Why Choose Us Section
    whyUsGreeting: z.string().min(1),
    whyUsHeadline: z.string().min(1),
    whyUsSubheadline: z.string().min(1),
    whyUsCards: z.string(), // JSON string
    
    // Working Process Section
    workingProcessGreeting: z.string().min(1),
    workingProcessHeadline: z.string().min(1),
    workingProcessSteps: z.string(), // JSON string

    // FAQ Section
    faqHeadline: z.string().min(1),
    faqSubheadline: z.string().min(1),
    faqItems: z.string(), // JSON string
})

interface HomepageFormProps {
    content: HomepageContent;
}

export function HomepageForm({ content }: HomepageFormProps) {
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        heroGreeting: content.hero.greeting,
        heroBrandName: content.hero.brandName,
        heroHeadline: content.hero.headline,
        heroSubheadline: content.hero.subheadline,
        heroCtaButton: content.hero.ctaButton,
        heroStatCard1Value: content.hero.statCard1.value,
        heroStatCard1Text: content.hero.statCard1.text,
        heroFeatures: content.hero.featureCard.features.join(', '),
        heroProgressValue: content.hero.progressCard.value,
        heroProgressText: content.hero.progressCard.text,
        
        aboutGreeting: content.about.greeting,
        aboutHeadline: content.about.headline,
        aboutSubheadline: content.about.subheadline,
        aboutAwardTitle: content.about.awardCard.title,
        aboutAwardText: content.about.awardCard.text,

        aboutPageGreeting: content.aboutPage.greeting,
        aboutPageHeadline: content.aboutPage.headline,
        aboutPageSubheadline: content.aboutPage.subheadline,
        aboutPageMissionCards: JSON.stringify(content.aboutPage.missionCards, null, 2),

        whyUsGreeting: content.whyUs.greeting,
        whyUsHeadline: content.whyUs.headline,
        whyUsSubheadline: content.whyUs.subheadline,
        whyUsCards: JSON.stringify(content.whyUs.cards, null, 2),
        
        workingProcessGreeting: content.workingProcess.greeting,
        workingProcessHeadline: content.workingProcess.headline,
        workingProcessSteps: JSON.stringify(content.workingProcess.steps, null, 2),
        
        faqHeadline: content.faq.headline,
        faqSubheadline: content.faq.subheadline,
        faqItems: JSON.stringify(content.faq.items, null, 2),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateHomepageContent(formData);
    
    if (result.success) {
        toast({
            title: "Content Updated!",
            description: result.message,
        });
        router.refresh();
    } else {
        toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* HERO SECTION */}
        <h2 className="text-2xl font-bold border-b pb-2">Hero Section</h2>
        <div className="grid md:grid-cols-2 gap-4">
            <FormField control={form.control} name="heroGreeting" render={({ field }) => ( <FormItem><FormLabel>Greeting Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="heroBrandName" render={({ field }) => ( <FormItem><FormLabel>Brand Name (Highlighted)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        <FormField control={form.control} name="heroHeadline" render={({ field }) => ( <FormItem><FormLabel>Headline</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="heroSubheadline" render={({ field }) => ( <FormItem><FormLabel>Sub-headline</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="heroCtaButton" render={({ field }) => ( <FormItem><FormLabel>Call-to-Action Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        <h3 className="text-xl font-semibold border-b pb-2">Hero Cards</h3>
        <div className="grid md:grid-cols-2 gap-4">
            <FormField control={form.control} name="heroStatCard1Value" render={({ field }) => ( <FormItem><FormLabel>Stat Card Value (e.g., 150+)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="heroStatCard1Text" render={({ field }) => ( <FormItem><FormLabel>Stat Card Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        <FormField control={form.control} name="heroFeatures" render={({ field }) => ( <FormItem><FormLabel>Features Card (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        <div className="grid md:grid-cols-2 gap-4">
            <FormField control={form.control} name="heroProgressValue" render={({ field }) => ( <FormItem><FormLabel>Progress Card Value (e.g., 88)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="heroProgressText" render={({ field }) => ( <FormItem><FormLabel>Progress Card Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>

        {/* ABOUT US SECTION (HOMEPAGE) */}
        <h2 className="text-2xl font-bold border-t pt-8">About Us Section (Homepage)</h2>
        <FormField control={form.control} name="aboutGreeting" render={({ field }) => ( <FormItem><FormLabel>Greeting</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="aboutHeadline" render={({ field }) => ( <FormItem><FormLabel>Headline</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="aboutSubheadline" render={({ field }) => ( <FormItem><FormLabel>Subheadline</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem> )} />
        <div className="grid md:grid-cols-2 gap-4">
             <FormField control={form.control} name="aboutAwardTitle" render={({ field }) => ( <FormItem><FormLabel>Award Card Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
             <FormField control={form.control} name="aboutAwardText" render={({ field }) => ( <FormItem><FormLabel>Award Card Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        
        {/* ABOUT US PAGE */}
        <h2 className="text-2xl font-bold border-t pt-8">About Us Page</h2>
        <FormField control={form.control} name="aboutPageGreeting" render={({ field }) => ( <FormItem><FormLabel>Greeting</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="aboutPageHeadline" render={({ field }) => ( <FormItem><FormLabel>Headline</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="aboutPageSubheadline" render={({ field }) => ( <FormItem><FormLabel>Subheadline</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="aboutPageMissionCards" render={({ field }) => ( <FormItem><FormLabel>Mission Cards (JSON)</FormLabel><FormControl><Textarea rows={12} {...field} /></FormControl><FormDescription>JSON array of objects with "icon", "title", "description" keys. Use Lucide icon names.</FormDescription><FormMessage /></FormItem> )} />

        {/* WHY CHOOSE US SECTION */}
        <h2 className="text-2xl font-bold border-t pt-8">Why Choose Us Section</h2>
        <FormField control={form.control} name="whyUsGreeting" render={({ field }) => ( <FormItem><FormLabel>Greeting</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="whyUsHeadline" render={({ field }) => ( <FormItem><FormLabel>Headline</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="whyUsSubheadline" render={({ field }) => ( <FormItem><FormLabel>Subheadline</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="whyUsCards" render={({ field }) => ( <FormItem><FormLabel>Feature Cards (JSON)</FormLabel><FormControl><Textarea rows={8} {...field} /></FormControl><FormDescription>JSON array of objects with "icon", "title", "description" keys. Use Lucide icon names.</FormDescription><FormMessage /></FormItem> )} />
        
        {/* WORKING PROCESS SECTION */}
        <h2 className="text-2xl font-bold border-t pt-8">Working Process Section</h2>
        <FormField control={form.control} name="workingProcessGreeting" render={({ field }) => ( <FormItem><FormLabel>Greeting</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="workingProcessHeadline" render={({ field }) => ( <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="workingProcessSteps" render={({ field }) => ( <FormItem><FormLabel>Process Steps (JSON)</FormLabel><FormControl><Textarea rows={8} {...field} /></FormControl><FormDescription>JSON array of objects with "title" and "content" keys.</FormDescription><FormMessage /></FormItem> )} />

        {/* FAQ SECTION */}
        <h2 className="text-2xl font-bold border-t pt-8">FAQ Section</h2>
        <FormField control={form.control} name="faqHeadline" render={({ field }) => ( <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="faqSubheadline" render={({ field }) => ( <FormItem><FormLabel>Subheadline</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="faqItems" render={({ field }) => ( <FormItem><FormLabel>FAQ Items (JSON)</FormLabel><FormControl><Textarea rows={10} {...field} /></FormControl><FormDescription>JSON array of objects with "question" and "answer" keys.</FormDescription><FormMessage /></FormItem> )} />

        <Button type="submit" disabled={form.formState.isSubmitting}>
           {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save All Content
        </Button>
      </form>
    </Form>
  )
}
