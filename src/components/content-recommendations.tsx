'use client';

import { useState, useEffect } from 'react';
import { recommendContent } from '@/ai/flows/content-personalization';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Wand2 } from 'lucide-react';

interface ContentRecommendationsProps {
  allPosts: Post[];
}

export default function ContentRecommendations({ allPosts }: ContentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const availableContent = allPosts.map(p => `URL: /blog/${p.slug}, Title: ${p.title}`);
        
        const response = await recommendContent({
          availableContent: availableContent,
        });

        const recommendedPosts = response
          .map(url => allPosts.find(p => `/blog/${p.slug}` === url))
          .filter((p): p is Post => p !== undefined);
        
        setRecommendations(recommendedPosts);
      } catch (err) {
        setError('Failed to load recommendations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [allPosts]);

  if (loading) {
    return (
      <Card className="mb-12 bg-accent/20 border-accent/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-primary">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Finding Articles For You...</span>
          </CardTitle>
          <CardDescription>
            Our AI is analyzing popular topics to personalize your content.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error || recommendations.length === 0) {
    return null; // Don't show the component if there's an error or no recommendations
  }

  return (
    <div className="mb-12">
      <Card className="bg-accent/20 border-accent/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-primary">
            <Wand2 />
            <span>Recommended For You</span>
          </CardTitle>
          <CardDescription>
            Based on popular inquiries, we think you'll find these articles interesting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map(post => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                   <Image
                      src={post.image}
                      alt={post.title}
                      width={400}
                      height={200}
                      className="w-full h-40 object-cover"
                      data-ai-hint={post.imageHint}
                    />
                  <CardHeader>
                    <CardTitle className="text-base font-headline group-hover:text-accent transition-colors">{post.title}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
