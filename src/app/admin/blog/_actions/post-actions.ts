
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import type { Post } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import postsData from '@/lib/blog-posts.json';

const postsFilePath = path.join(process.cwd(), 'src/lib/blog-posts.json');
const publicImagesPath = path.join(process.cwd(), 'public/images');

export async function getPosts(): Promise<Post[]> {
    // The JSON file is now directly imported.
    return postsData as Post[];
}

async function savePosts(posts: Post[]) {
    if (process.env.VERCEL) {
       console.warn("Filesystem write operations are disabled on Vercel. Using in-memory data. For persistence, use a database.");
       // In a real scenario, you'd update a database here. We'll proceed with in-memory for this demo.
       // To prevent build errors, we'll avoid writing to the filesystem.
       return;
    }
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
}

export async function getPost(slug: string): Promise<Post | undefined> {
    const posts = await getPosts();
    return posts.find((p) => p.slug === slug);
}


// Schema for text-based fields only
const postSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(5).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  author: z.string().min(2),
  imageHint: z.string().min(2),
  excerpt: z.string().min(10),
  content: z.string().min(100),
  redirectUrl: z.string().url().optional().or(z.literal('')),
});

type ActionResponse = {
    success: boolean;
    message: string;
}

// Helper to save image
async function saveImage(imageFile: File): Promise<string | null> {
    // Ensure the public/images directory exists
    await fs.mkdir(publicImagesPath, { recursive: true });

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Sanitize file name to prevent directory traversal
    const safeFileName = path.basename(imageFile.name).replace(/[^a-zA-Z0-9._-]/g, '');
    const imagePath = path.join(publicImagesPath, safeFileName);
    
    await fs.writeFile(imagePath, buffer);
    return `/images/${safeFileName}`; // Return the public URL path
}


export async function createPost(formData: FormData): Promise<ActionResponse> {
    const rawData = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        author: formData.get('author'),
        imageHint: formData.get('imageHint'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        redirectUrl: formData.get('redirectUrl') || '',
    };
    
    const imageFile = formData.get('image') as File | null;

    const parsed = postSchema.safeParse(rawData);

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data.' };
    }
    
    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: 'Featured image is required.' };
    }
    
    const { title, slug, author, imageHint, excerpt, content, redirectUrl } = parsed.data;
    
    let posts = await getPosts();
    if (posts.some(p => p.slug === slug)) {
        return { success: false, message: 'A post with this slug already exists.' };
    }

    try {
        const imageUrl = await saveImage(imageFile);
        if (!imageUrl) {
            return { success: false, message: 'Failed to save image.' };
        }
        
        const newPost: Post = {
            id: new Date().getTime().toString(),
            title,
            slug,
            author,
            imageHint,
            excerpt,
            content,
            redirectUrl,
            image: imageUrl,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        };
        
        posts.unshift(newPost);
        await savePosts(posts);

        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);
        
        return { success: true, message: 'Post created successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}


export async function updatePost(id: string, formData: FormData): Promise<ActionResponse> {
     const rawData = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        author: formData.get('author'),
        imageHint: formData.get('imageHint'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        redirectUrl: formData.get('redirectUrl') || '',
    };
    
    const imageFile = formData.get('image') as File | null;

    const parsed = postSchema.safeParse(rawData);

    if (!parsed.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    const { title, slug, author, imageHint, excerpt, content, redirectUrl } = parsed.data;
    
    let posts = await getPosts();
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
        return { success: false, message: 'Post not found.' };
    }

    const existingPost = posts[postIndex];

    if (slug !== existingPost.slug && posts.some(p => p.slug === slug && p.id !== id)) {
        return { success: false, message: 'Another post with this slug already exists.' };
    }

    try {
        let imageUrl = existingPost.image;
        // Check if a new image was uploaded and is valid
        if (imageFile && imageFile.size > 0) {
            imageUrl = await saveImage(imageFile) || existingPost.image;
        }

        const updatedPost: Post = {
            ...existingPost,
            title,
            slug,
            author,
            imageHint,
            excerpt,
            content,
            redirectUrl,
            image: imageUrl,
        };

        posts[postIndex] = updatedPost;
        await savePosts(posts);
        
        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        revalidatePath(`/blog/${existingPost.slug}`); // Revalidate old path
        revalidatePath(`/blog/${slug}`); // Revalidate new path

        return { success: true, message: 'Post updated successfully.' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Server error: ${errorMessage}` };
    }
}

export async function deletePost(id: string): Promise<ActionResponse> {
    if (!id) {
      return { success: false, message: 'Post ID is required.' };
    }
  
    try {
      let posts = await getPosts();
      const postToDelete = posts.find((post) => post.id === id);

      if (!postToDelete) {
        return { success: false, message: 'Post not found.' };
      }
      
      const updatedPosts = posts.filter((post) => post.id !== id);
  
      await savePosts(updatedPosts);
      
      // TODO: Delete image file from /public/images if it's not used by any other post

      revalidatePath('/admin/blog');
      revalidatePath('/blog');
      revalidatePath(`/blog/${postToDelete.slug}`);
  
      return { success: true, message: 'Post successfully deleted.' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, message: `Server error: ${errorMessage}` };
    }
}
