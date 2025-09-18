import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getProjects } from "../admin/projects/_actions/project-actions";

export const revalidate = 0;

export default async function PortfolioPage() {
  const projects = await getProjects();
  return (
    <div className="bg-background">
      <section className="container text-center py-20">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Our Portfolio</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          We believe in delivering tangible results. Explore our case studies to see how we've helped businesses like yours overcome challenges and achieve their goals through technology.
        </p>
      </section>

      <section className="container pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden group">
               <Link href={`/portfolio/${project.slug}`}>
                  <div className="overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="w-full h-auto aspect-[3/2] object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={project.imageHint}
                    />
                  </div>
               </Link>
              <CardContent className="p-6 bg-card">
                <Badge variant="secondary" className="mb-2">{project.category}</Badge>
                <CardTitle className="font-headline text-xl mb-2">
                   <Link href={`/portfolio/${project.slug}`}>{project.title}</Link>
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
                <Button asChild variant="link" className="p-0 mt-4">
                  <Link href={`/portfolio/${project.slug}`}>Read Case Study <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

    