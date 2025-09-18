
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight, HelpCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { Stats } from "@/components/sections/stats";
import { TeamSection } from "@/components/sections/team-section";
import { WhyChooseUsSection } from "@/components/sections/why-us-section";
import { CtaSection } from "@/components/sections/cta-section";
import { PartnersSection } from "@/components/sections/partners-section";
import placeholderImages from "@/lib/placeholder-images.json";
import { getHomepageContent } from "../admin/settings/homepage/_actions/homepage-actions";


const Icon = ({ name, ...props }: { name: string } & React.ComponentProps<(typeof Icons)["HelpCircle"]>) => {
    const LucideIcon = Icons[name as keyof typeof Icons] || HelpCircle;
    return <LucideIcon {...props} />;
};


export default async function AboutUsPage() {
    const content = await getHomepageContent();
    const aboutPageContent = content.aboutPage;

    return (
        <div className="bg-background">
            <section className="bg-primary/5 py-12">
                <div className="container flex justify-between items-center">
                    <h1 className="text-4xl font-bold font-headline text-primary">About Us</h1>
                    <div className="text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-accent">Home</Link>
                        <ChevronRight className="inline-block mx-2 h-4 w-4" />
                        <span>About Us</span>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container grid lg:grid-cols-2 gap-16 items-center">
                    <div className="grid grid-cols-2 gap-4">
                        <Image src={placeholderImages.about.pageImage1.src} alt="Team discussing work" width={600} height={800} className="rounded-lg object-cover w-full h-full" data-ai-hint={placeholderImages.about.pageImage1.hint} />
                        <Image src={placeholderImages.about.pageImage2.src} alt="Man presenting on a board" width={600} height={800} className="rounded-lg object-cover w-full h-full" data-ai-hint={placeholderImages.about.pageImage2.hint} />
                    </div>
                    <div className="flex flex-col gap-6">
                        <p className="text-sm font-semibold text-accent tracking-widest uppercase font-headline">{aboutPageContent.greeting}</p>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                            {aboutPageContent.headline}
                        </h2>
                        <p className="text-muted-foreground">
                            {aboutPageContent.subheadline}
                        </p>
                        <div className="grid sm:grid-cols-2 gap-6 mt-4">
                            {aboutPageContent.missionCards.map(card => (
                                <Card key={card.title} className="bg-primary/5 border-none shadow-sm">
                                    <CardHeader className="flex-row items-center gap-4">
                                        <div className="p-3 bg-card rounded-full">
                                            <Icon name={card.icon} className="h-6 w-6 text-accent" />
                                        </div>
                                        <h4 className="font-headline text-lg text-primary">{card.title}</h4>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{card.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            <PartnersSection />

            <Stats />
            <TeamSection />
            <WhyChooseUsSection />
            <CtaSection />
        </div>
    );
}
