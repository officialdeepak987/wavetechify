
import { PricingSection } from "@/components/sections/pricing-section";
import { FaqSection } from "@/components/sections/faq-section";
import Link from "next/link";
import { Award, CheckCircle, ShieldCheck } from "lucide-react";
import { PopupInquiryForm } from "@/components/popup-inquiry-form";
import { PricingComparisonTable } from "@/components/pricing-comparison-table";
import type { Metadata } from 'next';
import { getPricingData } from "../admin/pricing/_actions/pricing-actions";
import { Button } from "@/components/ui/button";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wavetechify.in';

export async function generateMetadata(): Promise<Metadata> {
  const title = "Website Development & Digital Marketing Packages in India, Dubai & Worldwide";
  const description = "Explore affordable and transparent pricing for website development, IT services, and digital marketing. Choose a plan that fits your business needs in India, Dubai & worldwide.";
  
  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/pricing`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/pricing`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

const trustPoints = [
    { icon: Award, text: "5+ Years Experience" },
    { icon: CheckCircle, text: "100+ Projects Delivered" },
    { icon: ShieldCheck, text: "Free Support & AI Tools" }
]

export default async function PricingPage() {
  const pricingData = await getPricingData();
  
  const generatePricingSchema = () => {
    const offerCatalog: any = {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      "name": "Website Development and IT Service Packages",
      "itemListElement": []
    };

    for (const countryCode in pricingData) {
      const country = pricingData[countryCode];
      country.plans.forEach(plan => {
        offerCatalog.itemListElement.push({
          "@type": "Offer",
          "name": `${plan.name} (${country.name})`,
          "price": plan.priceMonthly,
          "priceCurrency": country.currency,
          "description": plan.features.join(', '),
          "url": `${siteUrl}/pricing`,
          "category": "Website Development"
        });
      });
    }

    return JSON.stringify(offerCatalog);
  }

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generatePricingSchema() }}
      />
      <PopupInquiryForm />

      <section className="bg-primary/5 py-20 text-center">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Website Development & Digital Marketing Packages in India, Dubai & Worldwide</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose a plan that fits your business needs in India, Dubai & worldwide.
          </p>
        </div>
      </section>
      
      <PricingSection />

      <section className="py-20 bg-background">
        <div className="container">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Full Feature Comparison</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                   A detailed look at our web development packages in India and Dubai to help you choose the best fit.
                </p>
            </div>
            <PricingComparisonTable pricingData={pricingData} />
        </div>
      </section>

      <section className="py-20 bg-primary/5">
        <div className="container">
           <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Why Choose the Best Website Development Company in India & Dubai?</h2>
                 <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                   Our experience and commitment to quality make us the right partner for your digital growth.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {trustPoints.map((point, index) => (
                    <div key={index} className="flex flex-col items-center text-center gap-4 p-6 bg-card rounded-lg border">
                        <point.icon className="h-10 w-10 text-accent"/>
                        <p className="font-semibold text-lg text-primary">{point.text}</p>
                    </div>
                ))}
            </div>
            <div className="text-center mt-12 space-x-4">
                 <Button asChild>
                    <Link href="/portfolio">Our Work</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/services">Our Services</Link>
                </Button>
            </div>
        </div>
      </section>
      
      <FaqSection />
    </div>
  );
}
