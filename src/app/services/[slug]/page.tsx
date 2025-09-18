
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getService, getServices } from "@/app/admin/services/_actions/service-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, Download, FileText, Phone, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metadata } from 'next';
import * as Icons from "lucide-react";
import { PopupInquiryForm } from "@/components/popup-inquiry-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PricingSection } from "@/components/sections/pricing-section";
import placeholderImages from "@/lib/placeholder-images.json";

type Props = {
  params: { slug: string }
}

const serviceFaqs = [
    {
      question: "What is the typical timeframe for this service?",
      answer: "A typical project takes between 6-12 weeks, depending on the complexity. We work closely with you to establish a timeline that meets your needs."
    },
    {
      question: "Do you offer ongoing support after completion?",
      answer: "Yes, we offer monthly retainers to continuously support and improve your solution. This includes technical updates, performance monitoring, and help desk support."
    },
    {
        question: "How do you ensure the security of the solution?",
        answer: "Security is a top priority. We build on secure frameworks, implement SSL certificates, use best practices for data handling, and offer ongoing maintenance plans to keep your product protected from threats."
    }
  ]

export const revalidate = 0;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wavetechify.in';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService(params.slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  const serviceUrl = `${siteUrl}/services/${service.slug}`;

  return {
    title: `${service.title} | Wavetechify.in Services`,
    description: service.description,
    alternates: {
      canonical: serviceUrl,
    },
    openGraph: {
      title: service.title,
      description: service.description,
      url: serviceUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: service.title,
      description: service.description,
    },
  };
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

const Icon = ({ name, ...props }: { name: string } & React.ComponentProps<(typeof Icons)["ChevronRight"]>) => {
    const LucideIcon = Icons[name as keyof typeof Icons] || HelpCircle;
    return <LucideIcon {...props} />;
};

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);
  const allServices = await getServices();
  const currentIndex = allServices.findIndex((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const otherServices = allServices.filter(s => s.slug !== params.slug).slice(0, 3);
  const previousService = currentIndex > 0 ? allServices[currentIndex - 1] : null;
  const nextService = currentIndex < allServices.length - 1 ? allServices[currentIndex + 1] : null;

  return (
    <div className="bg-background">
      <PopupInquiryForm />
      <section className="bg-primary/5 py-12">
        <div className="container flex justify-between items-center">
          <h1 className="text-4xl font-bold font-headline text-primary">Service Details</h1>
          <div className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="inline-block mx-2 h-4 w-4" />
            <Link href="/services" className="hover:text-accent">Services</Link>
            <ChevronRight className="inline-block mx-2 h-4 w-4" />
            <span>Service Details</span>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <Image
                src={placeholderImages.services.detailImage1.src}
                alt={service.title}
                width={800}
                height={500}
                className="rounded-lg shadow-lg w-full"
                data-ai-hint={placeholderImages.services.detailImage1.hint}
                priority
              />
            </div>
            <h2 className="text-3xl font-bold font-headline text-primary mb-4">{service.title}</h2>
            <p className="text-muted-foreground mb-6">{service.longDescription}</p>
            
            <h3 className="text-2xl font-bold font-headline text-primary mb-4">Connecting the World Digitally</h3>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              {service.points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground mb-12">
              Information Technology is a broad field encompassing the design, development, implementation, and maintenance of computer systems and software applications. This industry plays a crucial role in shaping our modern world, with innovations such as cloud computing.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {otherServices.map((other) => (
                <Card key={other.slug} className="text-center p-4">
                  <div className="flex justify-center mb-4">
                     <div className="p-4 bg-accent/10 rounded-full inline-block">
                       <div className="p-3 bg-accent/20 rounded-full">
                         <Icon name={other.icon} className="h-6 w-6 text-accent" />
                       </div>
                     </div>
                  </div>
                  <CardHeader className="p-0">
                    <CardTitle className="font-headline text-lg mb-2">{other.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-xs text-muted-foreground mb-4">{other.description}</p>
                    <Button asChild variant="link">
                        <Link href={`/services/${other.slug}`}>Read More <ChevronRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mb-12">
                <h3 className="text-2xl font-bold font-headline text-primary mb-4">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {serviceFaqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="bg-primary/5 rounded-lg px-6 border-b-0">
                        <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline text-primary">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base">
                            {faq.answer}
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>


            <p className="text-muted-foreground mb-8">
              Information Technology is a broad field encompassing the design, development, implementation, and maintenance of computer systems and software applications. This industry plays a crucial role in shaping our modern world, with innovations such as cloud computing.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Image src={placeholderImages.services.detailImage2.src} alt="Team meeting" width={400} height={300} className="rounded-lg" data-ai-hint={placeholderImages.services.detailImage2.hint} />
              <Image src={placeholderImages.services.detailImage3.src} alt="Developers at work" width={400} height={300} className="rounded-lg" data-ai-hint={placeholderImages.services.detailImage3.hint} />
            </div>

            <div className="flex justify-between items-center">
              {previousService ? (
                <Button asChild variant="outline">
                  <Link href={`/services/${previousService.slug}`}>
                    <ChevronRight className="mr-2 h-4 w-4 rotate-180" /> Previous Service
                  </Link>
                </Button>
              ) : <div />}
              {nextService ? (
                <Button asChild variant="outline">
                  <Link href={`/services/${nextService.slug}`}>
                    Next Service <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : <div />}
            </div>

          </div>
          <aside className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">All Services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {allServices.map((s) => (
                     <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} className={cn("flex items-center justify-between p-3 rounded-md transition-colors", s.slug === params.slug ? "bg-accent/10 text-accent font-semibold" : "hover:bg-muted/50")}>
                           <span>{s.title}</span>
                           <ChevronRight className="h-4 w-4" />
                        </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground text-center p-8">
              <CardHeader className="p-0">
                <CardTitle className="font-headline text-2xl text-white">Need Help? Call Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-0 mt-4">
                <div className="p-4 bg-white/20 rounded-full inline-block">
                  <Phone className="h-8 w-8" />
                </div>
                <p className="text-3xl font-bold">(+888) 178 456 765</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Company Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild variant="outline" className="w-full justify-between">
                  <a href="/downloads/company-brochure.pdf" download>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent"/>
                      <span>Company Brochure</span>
                    </div>
                    <Download className="h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-between">
                  <a href="/downloads/service-manual.pdf" download>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent"/>
                      <span>Service Manual</span>
                    </div>
                     <Download className="h-5 w-5" />
                  </a>
                </Button>
              </CardContent>
            </Card>

          </aside>
        </div>
      </section>

      <PricingSection />
    </div>
  );
}
