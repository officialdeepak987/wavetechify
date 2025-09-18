
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getServices } from "@/app/admin/services/_actions/service-actions";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";
import { Badge } from "../ui/badge";

export async function ServicesSection() {
  const allServices = await getServices();
  
  if (!allServices || allServices.length === 0) {
    return null;
  }

  const featuredServices = allServices.slice(0, 5);

  return (
    <section className="py-20 bg-background animate-fade-in-up">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-accent tracking-widest uppercase font-headline">
              Our Specialize
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mt-2">
              Featured Services
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {featuredServices.map((service, index) => {
                let colSpan = 'lg:col-span-2';
                if (index === 0) colSpan = 'lg:col-span-3';
                if (index === 1) colSpan = 'lg:col-span-3';
                if (index > 1) colSpan = 'lg:col-span-2';

                return (
                    <div key={service.id} className={cn("group relative rounded-2xl p-8 flex flex-col justify-between overflow-hidden min-h-[300px]", colSpan, service.bgColor, service.textColor)}>
                        <Image 
                            src={service.image} 
                            alt={service.title} 
                            layout="fill" 
                            className="object-cover transition-transform duration-300 group-hover:scale-105" 
                            data-ai-hint={service.imageHint} 
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <h3 className="text-2xl font-bold font-headline">{service.title}</h3>
                            <div className="mt-auto flex justify-between items-end">
                                <div className="flex gap-2">
                                    {service.tags?.map(tag => (
                                        <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-none">{tag}</Badge>
                                    ))}
                                </div>
                                <Link href={`/services/${service.slug}`} className="w-12 h-12 bg-white/90 text-black rounded-full flex items-center justify-center hover:bg-white transition-colors">
                                    <ArrowUpRight />
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        <div className="text-center mt-12">
            <Button asChild variant="outline">
                <Link href="/services">MORE SERVICES</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
