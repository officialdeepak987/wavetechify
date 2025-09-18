import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Calendar } from "lucide-react";
import { BlogSidebar } from "@/components/blog-sidebar";
import ContentRecommendations from "@/components/content-recommendations";
import { getPosts } from "../admin/blog/_actions/post-actions";
import { BlogInquiryForm } from "@/components/blog-inquiry-form";

export const revalidate = 0; // Revalidate this page on every request

export default async function BlogPage() {
  const blogPosts = await getPosts();

  return (
    <div className="bg-primary/5">
      <section className="container py-20">
      <ContentRecommendations allPosts={blogPosts} />
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="space-y-12">
              {blogPosts.map((post) => (
                <Card key={post.slug} className="overflow-hidden group flex flex-col md:flex-row shadow-none border-none bg-card">
                  <div className="md:w-2/5">
                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-lg">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={post.imageHint}
                      />
                    </Link>
                  </div>
                  <CardContent className="p-6 md:w-3/5 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span>By {post.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold font-headline text-primary mb-4 flex-grow">
                      <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">{post.title}</Link>
                    </h2>
                    <p className="text-muted-foreground mb-6 line-clamp-2 flex-grow">{post.excerpt}</p>
                    <div className="mt-auto">
                      <Button asChild variant="link" className="p-0 self-start">
                        <Link href={`/blog/${post.slug}`}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <aside className="space-y-8">
            <BlogSidebar />
            <BlogInquiryForm />
          </aside>
        </div>
      </section>
    </div>
  );
}
