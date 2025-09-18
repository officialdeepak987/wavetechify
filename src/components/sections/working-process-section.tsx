
'use client';

import { useState } from 'react';
import { Plus, Minus } from "lucide-react";
import { cn } from '@/lib/utils';
import type { HomepageContent } from '@/lib/types';

interface WorkingProcessSectionProps {
    content: HomepageContent['workingProcess'];
}

export function WorkingProcessSection({ content }: WorkingProcessSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const processSteps = content.steps || [];

  return (
    <section className="py-20 md:py-32 bg-primary/5 overflow-hidden animate-fade-in-up">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Accordion */}
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase font-headline">{content.greeting}</p>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mt-2 mb-10">
              {content.headline}
            </h2>

            <div className="space-y-2">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={cn("border-b-2 rounded-lg transition-all duration-300", activeIndex === index ? "bg-primary/10 border-primary/20" : "border-transparent")}
                >
                  <div 
                    className="flex justify-between items-center cursor-pointer p-4"
                    onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                  >
                    <h3 className="text-lg font-semibold text-primary">
                      <span className={cn("mr-4", activeIndex === index ? "text-primary" : "text-primary/50")}>0{index + 1}.</span>
                      {step.title}
                    </h3>
                    {activeIndex === index ? <Minus className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary/50" />}
                  </div>
                  {activeIndex === index && (
                    <div className="px-4 pb-4 ml-10">
                      <p className="text-muted-foreground text-sm">
                        {step.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Visual Stack */}
          <div className="hidden lg:flex items-center justify-center h-[500px] relative">
            <div className="relative w-[350px] h-full">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute w-full h-[120px] rounded-[50%] flex items-center justify-center text-xl font-semibold transition-all duration-300 ease-in-out cursor-pointer",
                    "border border-primary/20",
                    activeIndex === index
                      ? "bg-primary text-primary-foreground scale-110 z-10 shadow-lg"
                      : "bg-background text-primary/70 hover:bg-primary/5",
                  )}
                  style={{ top: `${20 * index}%` }}
                  onClick={() => setActiveIndex(index)}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
