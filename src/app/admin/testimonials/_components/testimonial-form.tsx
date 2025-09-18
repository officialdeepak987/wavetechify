
"use client"

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
import type { Testimonial } from "@/lib/types"
import { createTestimonial, updateTestimonial } from "../_actions/testimonial-actions"

const formSchema = z.object({
  author: z.string().min(2, "Author name must be at least 2 characters."),
  company: z.string().min(2, "Company name must be at least 2 characters."),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  image: z.any(),
  imageHint: z.string().min(2, "Image hint must be at least 2 characters."),
})

interface TestimonialFormProps {
    testimonial?: Testimonial;
}

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: testimonial || {
      author: "",
      company: "",
      quote: "",
      image: undefined,
      imageHint: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    for (const key in values) {
      const value = values[key as keyof typeof values];
       if (key === 'image') {
        if (value instanceof FileList && value.length > 0) {
          formData.append(key, value[0]);
        }
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    }

    const result = testimonial 
      ? await updateTestimonial(testimonial.id, formData)
      : await createTestimonial(formData);

    if (result.success) {
      toast({
        title: testimonial ? "Testimonial Updated!" : "Testimonial Added!",
        description: result.message,
      });
      router.push('/admin/testimonials');
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
                name="author"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Company & Role</FormLabel>
                    <FormControl><Input placeholder="CEO, Innovate Inc." {...field} /></FormControl>
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
                    <FormLabel>Author's Photo</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-4">
                            <div className="flex-grow">
                                <Input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => field.onChange(e.target.files)}
                                />
                            </div>
                            {testimonial?.image && typeof testimonial.image === 'string' && (
                                <img src={testimonial.image} alt="Current image" className="h-16 w-16 object-cover rounded-full" />
                            )}
                        </div>
                    </FormControl>
                    <FormDescription>
                         {testimonial ? "Upload a new photo to replace the existing one." : "A photo is required for new testimonials."}
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
                    <FormControl><Input placeholder="e.g., 'man professional'" {...field} /></FormControl>
                    <FormDescription>A short hint for AI image generation (2 words max).</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />

        <FormField
          control={form.control}
          name="quote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote</FormLabel>
              <FormControl>
                <Textarea placeholder="The full quote from the client..." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       
        <Button type="submit" disabled={form.formState.isSubmitting}>
           {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {testimonial ? 'Update Testimonial' : 'Add Testimonial'}
        </Button>
      </form>
    </Form>
  )
}
