
"use client"

import * as React from "react";
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
import { useRouter } from "next/navigation"
import type { Service } from "@/lib/types"
import { createService, updateService } from "../_actions/service-actions"

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  slug: z.string(),
  icon: z.string().min(2, "Icon name must be at least 2 characters."),
  description: z.string().min(10, "Short description must be at least 10 characters."),
  longDescription: z.string().min(50, "Long description must be at least 50 characters."),
  points: z.string(),
  tags: z.string(),
  image: z.any().optional(),
  imageHint: z.string().min(2, "Image hint must be at least 2 characters."),
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
})

const generateSlug = (title: string) => {
    if (!title) return '';
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

type PlainService = Omit<Service, 'points' | 'tags'> & { points: string; tags: string };

interface ServiceFormProps {
    service?: PlainService;
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: service ? {
      ...service,
      points: service.points || '',
      tags: service.tags || '',
    } : {
      title: "",
      slug: "",
      icon: "Code2",
      description: "",
      longDescription: "",
      points: "",
      tags: "",
      imageHint: "",
      bgColor: "",
      textColor: ""
    },
  })

  const imageRef = form.register("image");

  const titleValue = form.watch("title");
  React.useEffect(() => {
    if (titleValue && !service) { // Only auto-generate for new services
        const slug = generateSlug(titleValue);
        form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [titleValue, form, service]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
        if (key !== 'image' && values[key as keyof typeof values] != null) {
            formData.append(key, values[key as keyof typeof values] as string);
        }
    });

    const imageFile = values.image?.[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const action = service 
      ? updateService.bind(null, service.id) 
      : createService;

    try {
        const result = await action(formData);

        if (result.success) {
            toast({
                title: service ? "Service Updated!" : "Service Created!",
                description: result.message,
            });
            router.push('/admin/services');
            router.refresh();
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
        }
    } catch (e) {
        toast({
            title: "Error",
            description: "An unexpected error occurred.",
            variant: "destructive",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input placeholder="Web Development" {...field} />
                </FormControl>
                <FormDescription>The main title of the service.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                    <Input placeholder="web-development" {...field} readOnly={!!service} className="bg-muted"/>
                </FormControl>
                <FormDescription>The URL is auto-generated from the title.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Featured Image</FormLabel>
                <FormControl>
                    <div className="flex items-center gap-4">
                        <div className="flex-grow">
                            <Input type="file" accept="image/*" {...imageRef} />
                        </div>
                        {service?.image && typeof service.image === 'string' && (
                            <img src={service.image} alt="Current image" className="h-16 w-16 object-cover rounded-md" />
                        )}
                    </div>
                </FormControl>
                <FormDescription>
                    {service ? "Upload a new image to replace the existing one." : "Upload an image for the new service."}
                </FormDescription>
                <FormMessage />
            </FormItem>
        )}
        />
        <FormField
          control={form.control}
          name="imageHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image AI Hint</FormLabel>
              <FormControl>
                <Input placeholder="e.g. data security" {...field} />
              </FormControl>
              <FormDescription>
                A 1-2 word hint for AI-generated images.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Icon Name</FormLabel>
                <FormControl>
                    <Input placeholder="Code2" {...field} />
                </FormControl>
                <FormDescription>
                    The name of the icon from the Lucide icon library (e.g., "Code2", "Smartphone"). See lucide.dev for options.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief summary of the service..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>This description appears on service listing cards.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed explanation of the service..."
                  rows={6}
                  {...field}
                />
              </FormControl>
               <FormDescription>This appears on the service detail page.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="points"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Points</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter key points separated by commas"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A comma-separated list of key features or deliverables for this service.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Consultation, Strategy" {...field} />
              </FormControl>
              <FormDescription>
                A comma-separated list of tags for the service card.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid md:grid-cols-2 gap-8">
            <FormField control={form.control} name="bgColor" render={({ field }) => ( <FormItem><FormLabel>Background Color</FormLabel><FormControl><Input placeholder="e.g. bg-blue-600" {...field} /></FormControl><FormDescription>Tailwind class for card background.</FormDescription><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="textColor" render={({ field }) => ( <FormItem><FormLabel>Text Color</FormLabel><FormControl><Input placeholder="e.g. text-white" {...field} /></FormControl><FormDescription>Tailwind class for card text.</FormDescription><FormMessage /></FormItem> )} />
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
           {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {service ? 'Update Service' : 'Create Service'}
        </Button>
      </form>
    </Form>
  )
}
