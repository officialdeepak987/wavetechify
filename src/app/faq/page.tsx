
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { categorizedFaqs } from "@/lib/data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function FaqPage() {

    const generateFaqJsonLd = () => {
        const faqData = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": categorizedFaqs.flatMap(category => 
            category.faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          )
        };
        return JSON.stringify(faqData);
      };

    return (
        <div className="bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: generateFaqJsonLd() }}
            />
            <section className="bg-primary/5 py-12">
                <div className="container flex justify-between items-center">
                <h1 className="text-4xl font-bold font-headline text-primary">Frequently Asked Questions</h1>
                <div className="text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-accent">Home</Link>
                    <ChevronRight className="inline-block mx-2 h-4 w-4" />
                    <span>FAQ</span>
                </div>
                </div>
            </section>

            <section className="container py-20">
                <div className="max-w-4xl mx-auto space-y-12">
                    {categorizedFaqs.map((category, catIndex) => (
                        <div key={catIndex}>
                            <h2 className="text-2xl md:text-3xl font-bold font-headline text-primary mb-6">{category.title}</h2>
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {category.faqs.map((faq, faqIndex) => (
                                <AccordionItem key={faqIndex} value={`item-${catIndex}-${faqIndex}`} className="bg-primary/5 rounded-lg px-6 border-b-0">
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
                    ))}
                </div>
            </section>
        </div>
    )
}
