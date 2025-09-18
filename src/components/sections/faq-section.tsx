
import { getHomepageContent } from "@/app/admin/settings/homepage/_actions/homepage-actions";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
export async function FaqSection() {
    const content = await getHomepageContent();
    const faqs = content.faq.items;
    
    if (!faqs || faqs.length === 0) {
        return null;
    }

    const midPoint = Math.ceil(faqs.length / 2);
    const firstHalf = faqs.slice(0, midPoint);
    const secondHalf = faqs.slice(midPoint);

    return (
      <section className="py-20 bg-primary/5 animate-fade-in-up">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">{content.faq.headline}</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.faq.subheadline}
            </p>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-x-8">
            <Accordion type="single" collapsible className="w-full">
              {firstHalf.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Accordion type="single" collapsible className="w-full">
              {secondHalf.map((faq, index) => (
                <AccordionItem key={index + midPoint} value={`item-${index + midPoint}`}>
                  <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
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
    )
  }
