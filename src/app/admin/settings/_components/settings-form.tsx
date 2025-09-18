
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
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { SiteSettings } from "@/lib/types"
import { updateSiteSettings } from "../_actions/settings-actions"
import { useRouter } from "next/navigation"


const formSchema = z.object({
    contactEmail: z.string().email("Invalid email address."),
    contactPhone: z.string().min(10, "Phone number must be at least 10 characters."),
    officeAddress: z.string().min(10, "Address must be at least 10 characters."),
    twitterUrl: z.string().url().optional().or(z.literal('')),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
})

interface SettingsFormProps {
    settings: SiteSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await updateSiteSettings(values)
    
    if (result.success) {
        toast({
            title: "Settings Updated!",
            description: result.message,
        });
        router.refresh(); // This reloads server components with new data
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
        <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl><Input placeholder="contact@example.com" {...field} /></FormControl>
                <FormDescription>The primary email address for public contact.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl>
                 <FormDescription>The primary phone number for public contact.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="officeAddress"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Office Address</FormLabel>
                <FormControl><Input placeholder="123 Tech Lane, Innovation City" {...field} /></FormControl>
                <FormDescription>The physical address of your main office.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />

        <h3 className="text-lg font-medium pt-4 border-t">Social Media Links</h3>

        <FormField
            control={form.control}
            name="twitterUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Twitter URL</FormLabel>
                <FormControl><Input placeholder="https://twitter.com/username" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl><Input placeholder="https://linkedin.com/in/username" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl><Input placeholder="https://github.com/username" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
       
        <Button type="submit" disabled={form.formState.isSubmitting}>
           {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
        </Button>
      </form>
    </Form>
  )
}
