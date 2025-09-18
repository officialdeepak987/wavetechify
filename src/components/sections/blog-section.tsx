
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import { getPosts } from "@/app/admin/blog/_actions/post-actions";

export async function BlogSection() {
  const blogPosts = await getPosts();
  return (
    <section className="py-20 animate-fade-in-up">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Transforming Ideas into Reality Tomorrow</h2>
          </div>
          <div>
            <p className="text-muted-foreground">
              IT Technology is a dynamic field encompassing the stu implementation an support, and management.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map((post) => (
            <Card key={post.slug} className="overflow-hidden group flex flex-col shadow-none border rounded-lg">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="overflow-hidden rounded-t-lg">
                    <Image
                    src={post.image}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={post.imageHint}
                    />
                </div>
              </Link>
              <CardContent className="p-6 flex-grow flex flex-col">
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
                <CardTitle className="font-headline text-xl mb-auto">
                  <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors line-clamp-2">{post.title}</Link>
                </CardTitle>
                <div className="pt-4 mt-auto">
                    <Button asChild variant="link" className="p-0 text-primary hover:text-accent">
                        <Link href={`/blog/${post.slug}`}>Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

    