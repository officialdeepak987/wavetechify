import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { getProjects } from "@/app/admin/projects/_actions/project-actions";

export async function PortfolioSection() {
  const projects = await getProjects();
  return (
    <section className="py-20 bg-primary/5 animate-fade-in-up">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="max-w-2xl">
                <p className="text-sm font-semibold text-primary tracking-widest uppercase font-headline">Success With Project</p>
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mt-2">Our Recent Best Works</h2>
                <p className="mt-4 text-muted-foreground">
                    Our recent projects highlight our expertise in delivering tailored solutions that meet the unique needs and objectives of our clients custom software.
                </p>
            </div>
            <Button asChild>
                <Link href="/portfolio">All Works <ArrowRight className="ml-2" /></Link>
            </Button>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {projects.map((project, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                 <div className="p-1">
                    <Card className="overflow-hidden border-none shadow-none group">
                        <Link href={`/portfolio/${project.slug}`} className="block">
                            <div className="overflow-hidden rounded-lg">
                                <Image
                                src={project.image}
                                alt={project.title}
                                width={600}
                                height={400}
                                className="w-full h-auto aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={project.imageHint}
                                />
                            </div>
                        </Link>
                        <CardContent className="p-4 bg-transparent">
                            <h3 className="font-bold text-xl text-primary group-hover:text-primary/80 transition-colors">
                                <Link href={`/portfolio/${project.slug}`}>{project.title}</Link>
                            </h3>
                            <p className="text-sm text-muted-foreground">{project.category}</p>
                            <Button asChild variant="link" className="p-0 mt-2 text-primary group-hover:text-primary/80">
                                <Link href={`/portfolio/${project.slug}`}>
                                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                 </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
