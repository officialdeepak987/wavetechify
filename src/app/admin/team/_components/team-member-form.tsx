
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
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { TeamMember } from "@/lib/types"
import { createTeamMember, updateTeamMember } from "../_actions/team-actions"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(5, "Role must be at least 5 characters."),
  twitter: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  image: z.any(),
  imageHint: z.string().min(2, "Image hint must be at least 2 characters."),
})

interface TeamMemberFormProps {
    member?: TeamMember;
}

export function TeamMemberForm({ member }: TeamMemberFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: member || {
      name: "",
      role: "",
      twitter: "",
      linkedin: "",
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

    const result = member 
      ? await updateTeamMember(member.id, formData)
      : await createTeamMember(formData);

    if (result.success) {
      toast({
        title: member ? "Member Updated!" : "Member Added!",
        description: result.message,
      });
      router.push('/admin/team');
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
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Role / Position</FormLabel>
                    <FormControl><Input placeholder="Lead Developer" {...field} /></FormControl>
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
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-4">
                            <div className="flex-grow">
                                <Input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => field.onChange(e.target.files)}
                                />
                            </div>
                            {member?.image && typeof member.image === 'string' && (
                                <img src={member.image} alt="Current image" className="h-16 w-16 object-cover rounded-md" />
                            )}
                        </div>
                    </FormControl>
                    <FormDescription>
                        {member ? "Upload a new photo to replace the existing one." : "A photo is required for new members."}
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
                    <FormControl><Input placeholder="e.g., 'man smiling'" {...field} /></FormControl>
                    <FormDescription>A short hint for AI image generation (2 words max).</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />

        <div className="grid md:grid-cols-2 gap-8">
             <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Twitter URL</FormLabel>
                    <FormControl><Input placeholder="https://twitter.com/username" {...field} /></FormControl>
                    <FormDescription>Optional: Full URL to Twitter profile.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl><Input placeholder="https://linkedin.com/in/username" {...field} /></FormControl>
                    <FormDescription>Optional: Full URL to LinkedIn profile.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
       
        <Button type="submit" disabled={form.formState.isSubmitting}>
           {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {member ? 'Update Member' : 'Add Member'}
        </Button>
      </form>
    </Form>
  )
}
