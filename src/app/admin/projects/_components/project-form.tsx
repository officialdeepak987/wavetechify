
"use client"

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
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
import type { Project } from "@/lib/types"
import { createProject, updateProject } from "../_actions/project-actions"

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  slug: z.string(),
  category: z.string().min(3, "Category must be at least 3 characters."),
  client: z.string().min(2, "Client name must be at least 2 characters."),
  location: z.string().min(2, "Location must be at least 2 characters."),
  completedDate: z.string().min(5, "Date must be at least 5 characters."),
  description: z.string().min(10, "Short description must be at least 10 characters."),
  longDescription: z.string().min(50, "Long description must be at least 50 characters."),
  solution: z.string().min(50, "Solution must be at least 50 characters."),
  image: z.any(),
  imageHint: z.string().min(2, "Image hint must be at least 2 characters."),
  requirements: z.string(), // Changed to string to match textarea
})

const generateSlug = (title: string) => {
    if (!title) return '';
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
};

// This is for the form's internal state which uses a string for requirements
type PlainProject = Omit<Project, 'requirements'> & { requirements: string };

interface ProjectFormProps {
    project?: PlainProject;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const defaultVals = project ? project : {
      title: "",
      slug: "",
      category: "",
      client: "",
      location: "",
      completedDate: "",
      description: "",
      longDescription: "",
      solution: "",
      image: undefined,
      imageHint: "",
      requirements: "",
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultVals,
  })

  // Watch title field to auto-generate slug
  const titleValue = form.watch("title");
  React.useEffect(() => {
    if (titleValue && !project?.slug) { 
        const slug = generateSlug(titleValue);
        form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [titleValue, form, project]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    for (const key in values) {
      const value = values[key as keyof typeof values];
      if (key === 'image') {
        if (value instanceof FileList && value.length > 0) {
          formData.append(key, value[0]);
        }
      } else if (value) {
        formData.append(key, value as string);
      }
    }

    const result = project
      ? await updateProject(project.id, formData)
      : await createProject(formData);

    if (result.success) {
      toast({
        title: project ? "Project Updated!" : "Project Created!",
        description: result.message,
      });
      router.push('/admin/projects');
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
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="E-commerce Platform" {...field} /></FormControl>
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
                    <FormControl><Input placeholder="ecommerce-platform" {...field} readOnly={!!project} className="bg-muted" /></FormControl>
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
                    <FormLabel>Project Image</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-4">
                            <div className="flex-grow">
                                <Input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => field.onChange(e.target.files)}
                                />
                            </div>
                            {project?.image && typeof project.image === 'string' && (
                                <img src={project.image} alt="Current image" className="h-16 w-16 object-cover rounded-md" />
                            )}
                        </div>
                    </FormControl>
                    <FormDescription>
                        {project ? "Upload a new image to replace the current one." : "An image is required for a new project."}
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
                    <FormControl><Input placeholder="e.g., 'data dashboard'" {...field} /></FormControl>
                    <FormDescription>A short hint for AI image generation (2 words max).</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
             <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl><Input placeholder="Web Development" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl><Input placeholder="Innovate Inc." {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl><Input placeholder="New York, USA" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="completedDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Completed Date</FormLabel>
                    <FormControl><Input placeholder="20-12-2024" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
       
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief summary of the project..." {...field} />
              </FormControl>
              <FormDescription>This description appears on portfolio listing cards.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A detailed explanation of the project..." rows={5} {...field} />
              </FormControl>
               <FormDescription>This appears on the project detail page.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Requirements</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter key requirements separated by commas"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A comma-separated list of key requirements for this project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="solution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Solution & Result</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the solution and the final result..." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       
        <Button type="submit" disabled={form.formState.isSubmitting}>
           {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? 'Update Project' : 'Create Project'}
        </Button>
      </form>
    </Form>
  )
}
