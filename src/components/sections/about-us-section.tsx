
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import placeholderImages from "@/lib/placeholder-images.json";
import { getHomepageContent } from "@/app/admin/settings/homepage/_actions/homepage-actions";

export async function AboutUsSection() {
  const content = await getHomepageContent();
  const aboutContent = content.about;
  
  return (
    <section className="py-20 md:py-32 bg-primary/5">
      <div className="container grid lg:grid-cols-2 gap-16 items-center animate-fade-in-up">
        <div className="relative">
          <Image
            src={placeholderImages.about.sectionImage.src}
            alt="Team collaborating for web development in Dubai"
            width={600}
            height={600}
            className="rounded-lg shadow-2xl"
            data-ai-hint={placeholderImages.about.sectionImage.hint}
          />
          <Card className="absolute -bottom-16 -right-16 w-full max-w-sm bg-card/80 backdrop-blur-sm shadow-xl hidden lg:block">
             <CardHeader className="flex-row items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-lg text-primary">{aboutContent.awardCard.title}</CardTitle>
              </CardHeader>
            <CardContent>
              <p className="text-sm text-card-foreground">
                {aboutContent.awardCard.text}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase font-headline">{aboutContent.greeting}</p>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                {aboutContent.headline}
            </h2>
            <p className="text-muted-foreground">
                {aboutContent.subheadline}
            </p>
        </div>
      </div>
    </section>
  );
}
