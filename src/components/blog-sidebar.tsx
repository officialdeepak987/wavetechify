import Link from "next/link";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { getPosts } from "@/app/admin/blog/_actions/post-actions";
import { getServices } from "../app/admin/services/_actions/service-actions";

const tags = ["IT Support", "Solutions", "Web", "Marketing", "Cloud", "Security"];

export async function BlogSidebar() {
    const blogPosts = await getPosts();
    const services = await getServices();
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="relative">
                        <Input placeholder="Search..." className="pr-10" />
                        <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground h-8 w-8">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   {services.slice(0, 4).map(service => (
                        <Link key={service.slug} href={`/services/${service.slug}`} className="flex justify-between items-center p-4 rounded-lg border hover:bg-accent/10 hover:border-accent transition-colors">
                            <span className="font-semibold">{service.title}</span>
                            <ArrowRight className="h-5 w-5 text-accent"/>
                        </Link>
                   ))}
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Recent Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {blogPosts.slice(0, 3).map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.slug} className="flex items-start gap-4 group">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover w-20 h-20"
                      data-ai-hint={post.imageHint}
                    />
                    <div>
                        <p className="text-xs text-muted-foreground">Technology</p>
                        <h4 className="font-semibold leading-tight group-hover:text-accent transition-colors">
                           {post.title}
                        </h4>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Tags</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <Button key={tag} variant="outline" size="sm" asChild>
                            <Link href="#">{tag}</Link>
                        </Button>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
