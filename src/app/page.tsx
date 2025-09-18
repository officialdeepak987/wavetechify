
import { Hero } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services-section";
import { AboutUsSection } from "@/components/sections/about-us-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { Stats } from "@/components/sections/stats";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { WorkingProcessSection } from "@/components/sections/working-process-section";
import { ContactUsSection } from "@/components/sections/contact-us-section";
import { TeamSection } from "@/components/sections/team-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { BlogSection } from "@/components/sections/blog-section";
import { FaqSection } from "@/components/sections/faq-section";
import { WhyChooseUsSection } from "@/components/sections/why-us-section";
import { getHomepageContent } from "./admin/settings/homepage/_actions/homepage-actions";


export default async function Home() {
  const pageContent = await getHomepageContent();

  return (
    <div className="flex flex-col">
      <Hero testimonials={pageContent.testimonials} content={pageContent} />
      <TechStackSection />
      <AboutUsSection />
      <ServicesSection />
      <PricingSection />
      <Stats/>
      <WorkingProcessSection content={pageContent.workingProcess} />
      <WhyChooseUsSection />
      <PortfolioSection />
      <TestimonialsSection testimonials={pageContent.testimonials} />
      <PartnersSection />
      <BlogSection />
      <TeamSection />
      <ContactUsSection />
      <FaqSection />
    </div>
  );
}
