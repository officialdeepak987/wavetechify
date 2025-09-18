import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BlogSidebar } from "@/components/blog-sidebar";
import { User, Calendar, Folder, ChevronRight, MessageSquare, Twitter, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next';
import { getPost, getPosts } from "@/app/admin/blog/_actions/post-actions";
import { getSiteSettings } from "@/app/admin/settings/_actions/settings-actions";
import { BlogInquiryForm } from "@/components/blog-inquiry-form";
import { PopupInquiryForm } from "@/components/popup-inquiry-form";
import { PricingSection } from "@/components/sections/pricing-section";
import placeholderImages from "@/lib/placeholder-images.json";


type Props = {
  params: { slug: string }
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`;


  return {
    title: `${post.title} | Wavetechify.in Blog`,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
        title: post.title,
        description: post.excerpt,
        url: postUrl,
        type: 'article',
        publishedTime: new Date(post.date).toISOString(),
        authors: [post.author],
        images: [
            {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: post.title,
            },
        ],
    },
     twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}


export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const posts = await getPosts();
  const postIndex = posts.findIndex((p) => p.slug === params.slug);

  if (postIndex === -1) {
    notFound();
  }

  const post = posts[postIndex];

  if (post.redirectUrl) {
    redirect(post.redirectUrl);
  }
  
  const settings = await getSiteSettings();
  const previousPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;
  const tags = ["IT Support", "Solutions", "Web"];

  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "headline": post.title,
    "description": post.excerpt,
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Wavetechify.in",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString()
  };

  return (
    <article className="bg-background">
      <PopupInquiryForm />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="bg-primary/5 py-12">
        <div className="container flex justify-between items-center">
          <h1 className="text-4xl font-bold font-headline text-primary">Blog Details</h1>
          <div className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="inline-block mx-2 h-4 w-4" />
            <Link href="/blog" className="hover:text-accent">Blog</Link>
            <ChevronRight className="inline-block mx-2 h-4 w-4" />
            <span>Blog Details</span>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={600}
                className="rounded-lg shadow-lg mb-8 w-full h-auto aspect-video object-cover"
                data-ai-hint={post.imageHint}
                priority
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>By {post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Folder className="w-4 h-4" />
                <span>Technology</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-8">{post.title}</h1>

            <div
              className="prose prose-lg max-w-none text-muted-foreground prose-headings:font-headline prose-headings:text-primary prose-a:text-accent prose-strong:text-primary prose-blockquote:border-accent prose-blockquote:text-primary prose-blockquote:font-medium"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 py-6 border-y flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <Badge key={tag} variant="outline" asChild>
                                <Link href="#">{tag}</Link>
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                     <span className="font-semibold">Share:</span>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={settings.twitterUrl} target="_blank"><Twitter className="h-5 w-5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={settings.linkedinUrl} target="_blank"><Linkedin className="h-5 w-5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={settings.githubUrl} target="_blank"><Github className="h-5 w-5" /></Link>
                    </Button>
                </div>
            </div>

            <div className="mt-12 flex justify-between items-center">
              {previousPost ? (
                <Button asChild variant="outline">
                  <Link href={`/blog/${previousPost.slug}`}>
                    <ChevronRight className="mr-2 h-4 w-4 rotate-180" /> Previous Post
                  </Link>
                </Button>
              ) : <div />}
              {nextPost ? (
                <Button asChild variant="outline">
                  <Link href={`/blog/${nextPost.slug}`}>
                    Next Post <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : <div />}
            </div>

            <div className="mt-16">
              <h2 className="text-3xl font-bold font-headline text-primary mb-8 flex items-center gap-2">
                <MessageSquare className="w-7 h-7 text-accent" />
                Leave a Comment
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <Image src={placeholderImages.blog.avatar1.src} alt="avatar" width={80} height={80} className="rounded-full" data-ai-hint={placeholderImages.blog.avatar1.hint} />
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-primary">Theresa Webb</h4>
                      <Button variant="outline" size="sm">Reply</Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Dog Trainer</p>
                    <p className="text-muted-foreground">Information Technology is a broad field encompassing the design implement maintenance of computer systems and software applications.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                   <Image src={placeholderImages.blog.avatar2.src} alt="avatar" width={80} height={80} className="rounded-full" data-ai-hint={placeholderImages.blog.avatar2.hint} />
                   <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-primary">David Beckham</h4>
                       <Button variant="outline" size="sm">Reply</Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Web Designer</p>
                    <p className="text-muted-foreground">Great article! This is a very clear explanation of a complex topic. Thanks for sharing.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16">
                <BlogInquiryForm />
            </div>

          </div>
          <aside>
            <BlogSidebar />
          </aside>
        </div>
      </section>
      <PricingSection />
    </article>
  );
}
