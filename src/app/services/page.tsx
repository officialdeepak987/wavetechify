
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { getServices } from "../admin/services/_actions/service-actions";


const faqs = [
    {
      question: "What is the typical timeframe for a website development project?",
      answer: "A typical website development project takes between 6-12 weeks, depending on the complexity of the design and the number of features required. We work closely with you to establish a timeline that meets your needs."
    },
    {
      question: "Do you offer ongoing SEO services?",
      answer: "Yes, we offer monthly SEO retainers to continuously improve your search engine rankings. This includes keyword tracking, content creation, link building, and technical SEO audits."
    },
    {
        question: "How do you approach mobile app development?",
        answer: "We follow an agile development process, starting with a discovery phase to understand your goals. We then move to UI/UX design, development, testing, and deployment, with regular check-ins to ensure the final product meets your vision."
    },
    {
        question: "What kind of graphic design services do you provide?",
        answer: "We offer a full suite of graphic design services, including logo design, branding packages, marketing materials, social media graphics, and website assets. Our goal is to create a cohesive and professional visual identity for your brand."
    },
    {
      question: "Can you edit video footage that I've already shot?",
      answer: "Absolutely. We can work with your existing footage to create professional, engaging videos for marketing, social media, or internal use. We handle color correction, audio mixing, graphics, and final editing."
    },
    {
      question: "How do you ensure the security of the websites you build?",
      answer: "Security is a top priority. We build on secure frameworks, implement SSL certificates, use best practices for data handling, and offer ongoing maintenance plans to keep your website protected from threats."
    }
  ]

const Icon = ({ name, ...props }: { name: string } & React.ComponentProps<(typeof Icons)["ChevronRight"]>) => {
    const LucideIcon = Icons[name as keyof typeof Icons] || Icons.HelpCircle;
    return <LucideIcon {...props} />;
};
  
export const revalidate = 0;

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <div className="bg-background">
      <section className="bg-primary/5 py-12">
        <div className="container flex justify-between items-center">
          <h1 className="text-4xl font-bold font-headline text-primary">Service</h1>
          <div className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="inline-block mx-2 h-4 w-4" />
            <span>Service</span>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex-row items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                        <Icon name={service.icon} className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="font-headline text-xl text-primary">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">{service.description}</p>
                </CardContent>
                <div className="px-6 py-4 mt-auto">
                    <Link href={`/services/${service.slug}`} className="font-semibold text-primary group-hover:text-accent flex items-center gap-2">
                        Learn More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </Card>
          ))}
        </div>
      </section>
      
      <section className="py-20 bg-primary/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              IT Technology is a dynamic field implementation an support management IT Technology.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6 border">
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
        </div>
      </section>
    </div>
  );
}
