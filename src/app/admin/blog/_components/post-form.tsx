
"use client"

import * as React from "react"
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
import { Loader2, Wand2 } from "lucide-react"
import type { Post } from "@/lib/types"
import { createPost, updatePost } from "../_actions/post-actions"
import { generateBlogContent } from "@/ai/flows/blog-content-generator"

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  slug: z.string(),
  author: z.string().min(2, { message: "Author must be at least 2 characters." }),
  imageHint: z.string().min(2, { message: "Image hint must be at least 2 characters." }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters." }),
  content: z.string().min(100, { message: "Content must be at least 100 characters." }),
  redirectUrl: z.string().url({ message: "Must be a valid URL." }).optional().or(z.literal('')),
  image: z.any().optional(),
})

interface PostFormProps {
    post?: Post;
}

const generateSlug = (title: string) => {
    if (!title) return '';
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
};

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: post || {
      title: "",
      slug: "",
      author: "",
      imageHint: "",
      excerpt: "",
      content: "",
      redirectUrl: "",
    },
  })
  
  const imageRef = form.register("image");

  // Watch title field to auto-generate slug
  const titleValue = form.watch("title");
  React.useEffect(() => {
    if (titleValue) {
        const slug = generateSlug(titleValue);
        form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [titleValue, form, post]);

  const handleGenerateContent = async () => {
    const title = form.getValues("title");
    if (!title || title.length < 5) {
      toast({
        title: "Title is too short",
        description: "Please enter a descriptive title before generating content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    form.setValue("content", "Generating... please wait.");
    try {
      const result = await generateBlogContent({ title });
      if (result.content) {
        form.setValue("content", result.content, { shouldValidate: true });
        toast({
          title: "Content Generated!",
          description: "The AI has generated a draft for your blog post.",
        });
      } else {
        throw new Error("AI did not return content.");
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
      form.setValue("content", "Sorry, there was an error generating content. Please try again.");
      toast({
        title: "Error Generating Content",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const formData = new FormData();
    // Append all text fields to formData
    Object.keys(values).forEach(key => {
        if (key !== 'image' && values[key as keyof typeof values]) {
            formData.append(key, values[key as keyof typeof values] as string);
        }
    });
    
    // Handle the image file
    const imageFile = values.image?.[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const action = post 
      ? updatePost.bind(null, post.id) 
      : createPost;

    try {
        const result = await action(formData);

        if (result.success) {
        toast({
            title: post ? "Post Updated!" : "Post Created!",
            description: `The blog post has been successfully ${post ? 'updated' : 'saved'}.`,
        });
        router.push('/admin/blog');
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

    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="The Future of AI" {...field} />
              </FormControl>
              <FormDescription>
                This is the main title of your blog post.
              </FormDescription>
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
                <Input placeholder="the-future-of-ai" {...field} disabled className="bg-muted" />
              </FormControl>
              <FormDescription>
                This is the URL-friendly version of the title. It's auto-generated.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Featured Image</FormLabel>
                <FormControl>
                    <div className="flex items-center gap-4">
                        <div className="flex-grow">
                            <Input 
                                type="file" 
                                accept="image/*"
                                {...imageRef}
                            />
                        </div>
                        {post?.image && typeof post.image === 'string' && (
                            <img src={post.image} alt="Current image" className="h-16 w-16 object-cover rounded-md" />
                        )}
                    </div>
                </FormControl>
                <FormDescription>
                    {post ? "Upload a new image to replace the existing one." : "Upload an image for the new post."}
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
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short summary of the blog post..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief summary that appears in list views.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                 <FormLabel>Content</FormLabel>
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateContent}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Generate with AI
                  </Button>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Write your blog post content here, or generate it with AI."
                  rows={15}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The full content of the blog post. HTML is supported.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="redirectUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Redirect URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/new-post-url" {...field} />
              </FormControl>
              <FormDescription>
                If you set this, visiting this post's slug will automatically redirect to the provided URL.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          disabled={isSubmitting || isGenerating}
        >
           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {post ? 'Update Post' : 'Create Post'}
        </Button>
      </form>
    </Form>
  )
}
