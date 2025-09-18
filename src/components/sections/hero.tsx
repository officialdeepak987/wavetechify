
'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Hand } from "lucide-react";
import placeholderImages from "@/lib/placeholder-images.json";
import type { HomepageContent, Testimonial } from "@/lib/types";
import { useEffect, useState } from "react";

interface HeroProps {
  testimonials: Testimonial[];
  content: HomepageContent;
}

export function Hero({ testimonials, content }: HeroProps) {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (content) {
      const timer = setTimeout(() => {
        setProgressValue(parseInt(content.hero.progressCard.value, 10) || 0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [content]);

  if (!content) {
    return <section className="bg-background overflow-hidden"><div className="container py-18 lg:py-10 h-[500px]"></div></section>;
  }

  const heroContent = content.hero;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;

  return (
    <section className="bg-background overflow-hidden">
      <div className="container py-18 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="bg-primary/5 rounded-2xl p-8 lg:p-12 h-full flex flex-col justify-center animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <Hand className="h-6 w-6 text-yellow-500 -rotate-12" />
              <p className="text-sm font-bold">{heroContent.greeting} <span className="bg-accent text-accent-foreground px-2 py-1 rounded">{heroContent.brandName}</span></p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary leading-tight">
              {heroContent.headline}
            </h1>
            <p className="mt-6 text-muted-foreground">
              {heroContent.subheadline}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Button asChild size="lg">
                <Link href="/contact">
                  {heroContent.ctaButton}
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 h-full animate-fade-in [animation-delay:200ms]">
            <div className="bg-accent/20 rounded-2xl overflow-hidden p-2 flex items-end">
                <Image
                    src={placeholderImages.hero.image1.src}
                    alt="Hand holding a smartphone"
                    width={300}
                    height={400}
                    className="w-full object-contain "
                    data-ai-hint={placeholderImages.hero.image1.hint}
                />
            </div>
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                 <h2 className="text-6xl font-bold">{heroContent.statCard1.value}</h2>
                 <p className="mt-2 font-medium">{heroContent.statCard1.text}</p>
                 <div className="flex items-center -space-x-2 mt-4">
                    {testimonials.slice(0,3).map((testimonial) => (
                      <Image key={testimonial.id} src={testimonial.image} alt={testimonial.author} width={40} height={40} className="rounded-full border-2 border-primary-foreground/50" data-ai-hint={testimonial.imageHint} />
                    ))}
                    <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold border-2 border-primary-foreground/50">2k+</div>
                </div>
            </div>
            <div className="bg-primary/10 rounded-2xl p-4 flex flex-col justify-center gap-3">
                {heroContent.featureCard.features.map((feature, index) => (
                    <div key={index} className="bg-background p-2 rounded-full flex justify-between items-center text-sm font-medium">
                        <span className="pl-2">{feature}</span>
                        <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Plus className="w-4 h-4" /></Button>
                    </div>
                ))}
            </div>
            <div className="bg-cover bg-center rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center items-center text-primary-foreground" style={{backgroundImage: `url('${placeholderImages.hero.statBg.src}')`}} data-ai-hint={placeholderImages.hero.statBg.hint}>
                <div className="absolute inset-0 bg-primary/70"></div>
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                            className="text-primary-foreground/20"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                        />
                         <circle
                            className="text-white"
                            strokeWidth="10"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset: strokeDashoffset,
                                transition: 'stroke-dashoffset 1.5s ease-out',
                                transform: 'rotate(-90deg)',
                                transformOrigin: '50% 50%',
                            }}
                        />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">{`${progressValue}%`}</span>
                </div>
                <p className="mt-4 text-center text-sm relative">{heroContent.progressCard.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
