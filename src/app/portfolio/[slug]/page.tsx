
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProject, getProjects } from "@/app/admin/projects/_actions/project-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import type { Metadata } from 'next';
import { PopupInquiryForm } from "@/components/popup-inquiry-form";

type Props = {
  params: { slug: string }
}

export const revalidate = 0;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wavetechify.in';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }
  
  const projectUrl = `${siteUrl}/portfolio/${project.slug}`;
  const imageUrl = project.image.startsWith('http') ? project.image : `${siteUrl}${project.image}`;

  return {
    title: `${project.title} | Wavetechify.in Portfolio`,
    description: project.description,
    alternates: {
      canonical: projectUrl,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      url: projectUrl,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
     twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  const allProjects = await getProjects();
  const otherProjects = allProjects.filter(p => p.slug !== params.slug).slice(0, 2);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-primary/5">
        <PopupInquiryForm />
        <div className="container py-20">
            <div className="bg-background p-8 md:p-12 rounded-2xl shadow-lg">
                <section className="mb-12">
                    <Image 
                        src={project.image}
                        alt={project.title}
                        width={1200}
                        height={600}
                        className="rounded-lg w-full"
                        data-ai-hint={project.imageHint}
                        priority
                    />
                </section>

                <section className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">{project.title}</h1>
                    <p className="text-muted-foreground mb-8">
                        {project.longDescription}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm border-y py-4 mb-12">
                        <div>
                            <p className="font-semibold text-primary">SERVICES</p>
                            <p className="text-muted-foreground">{project.category}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-primary">CLIENT</p>
                            <p className="text-muted-foreground">{project.client}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-primary">LOCATION</p>
                            <p className="text-muted-foreground">{project.location}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-primary">COMPLETED DATE</p>
                            <p className="text-muted-foreground">{project.completedDate}</p>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold font-headline text-primary mb-4">Project Requirement</h2>
                        <p className="text-muted-foreground mb-6">
                           In this phase of the {project.title}, our focus is on executing robust data migration strategies to ensure the seamless transfer of data from on-premises servers to cloud storage solutions. Leveraging advanced techniques and tools,
                        </p>
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                            {project.requirements.map((req, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                                    <span className="text-muted-foreground">{req}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold font-headline text-primary mb-4">Solution & Result</h2>
                        <p className="text-muted-foreground">
                           {project.solution}
                        </p>
                    </div>

                </section>

                 <section>
                    <h2 className="text-2xl font-bold font-headline text-primary text-center mb-8">Our Similar Projects</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {otherProjects.map((p) => (
                            <Link href={`/portfolio/${p.slug}`} key={p.slug} className="group">
                                <Card className="overflow-hidden">
                                    <div className="overflow-hidden">
                                    <Image
                                        src={p.image}
                                        alt={p.title}
                                        width={600}
                                        height={400}
                                        className="w-full h-auto aspect-[3/2] object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint={p.imageHint}
                                    />
                                    </div>
                                    <CardContent className="p-4">
                                        <Badge>{p.category}</Badge>
                                        <CardTitle className="text-lg font-headline mt-2">{p.title}</CardTitle>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    </div>
  );
}
