
import Image from "next/image";
import * as Icons from "lucide-react";
import { getHomepageContent } from "@/app/admin/settings/homepage/_actions/homepage-actions";
import placeholderImages from "@/lib/placeholder-images.json";

const Icon = ({ name, ...props }: { name: string } & React.ComponentProps<(typeof Icons)["Trophy"]>) => {
    const LucideIcon = Icons[name as keyof typeof Icons] || Icons.HelpCircle;
    return <LucideIcon {...props} />;
};

export async function WhyChooseUsSection() {
    const content = await getHomepageContent();
    const whyUsContent = content.whyUs;
    const cards = whyUsContent.cards || [];

    return (
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40rem] h-[40rem] bg-primary/5 rounded-full -z-10" />
             <div className="absolute inset-0 bg-cover bg-center z-0 opacity-5" style={{backgroundImage: "url('https://picsum.photos/seed/why-us-bg/1200/800')"}} data-ai-hint="background pattern"></div>
            <div className="container grid lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <p className="text-sm font-semibold text-accent tracking-widest uppercase font-headline">{whyUsContent.greeting}</p>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                            {whyUsContent.headline}
                        </h2>
                        <p className="text-muted-foreground">
                           {whyUsContent.subheadline}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {cards.map((card) => (
                            <div key={card.title} className="rounded-2xl p-6 flex flex-col justify-center items-center text-center bg-primary/5">
                                <div className="p-3 bg-white/20 rounded-full inline-block mb-4">
                                    <Icon name={card.icon} className="h-6 w-6 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold font-headline mb-2">{card.title}</h3>
                                <p className="text-sm opacity-90">{card.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:block">
                    <Image src={placeholderImages.whyUs.mainImage.src} alt="Why Choose Us" width={600} height={700} className="rounded-2xl object-cover" data-ai-hint={placeholderImages.whyUs.mainImage.hint} />
                </div>
            </div>
        </section>
    )
}
