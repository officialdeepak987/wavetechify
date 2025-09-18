
'use client'
import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPricingData } from '@/app/admin/pricing/_actions/pricing-actions';
import type { PricingData, PricingPlan } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { PricingInquiryForm } from '../pricing-inquiry-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export function PricingSection() {
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [pricingData, setPricingData] = useState<PricingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const plugin = useRef(
      Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    useEffect(() => {
      async function fetchInitialData() {
        try {
          const data = await getPricingData();
          setPricingData(data);

          if (!data || Object.keys(data).length === 0) {
            setLoading(false);
            return;
          }

          // First, try to detect user's location
          try {
            const response = await fetch('https://ipapi.co/json/');
            const locationData = await response.json();
            const userCountry = locationData.country_code;

            if (userCountry && data[userCountry]) {
              setSelectedCountry(userCountry);
            } else if (data['IN']) {
              setSelectedCountry('IN');
            } else {
              setSelectedCountry(Object.keys(data)[0]);
            }
          } catch (locationError) {
            console.error("Could not fetch location, defaulting country.", locationError);
            if (data['IN']) {
              setSelectedCountry('IN');
            } else {
              setSelectedCountry(Object.keys(data)[0]);
            }
          }
        } catch (error) {
          console.error("Failed to fetch pricing data:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchInitialData();
    }, []);

     const toggleExpand = (planId: string) => {
        setExpandedCards(prev => ({
            ...prev,
            [planId]: !prev[planId]
        }));
    };

    const handleInquiryClick = (planName: string) => {
        setSelectedPlan(planName);
        setIsFormOpen(true);
    }

    if (loading) {
        return (
            <section className="py-20 bg-primary/5 animate-fade-in-up">
                <div className="container text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-4 text-muted-foreground">Loading Pricing...</p>
                </div>
            </section>
        )
    }
    
    if (!pricingData || Object.keys(pricingData).length === 0) {
        return (
            <section className="py-20 bg-primary/5 animate-fade-in-up">
                <div className="container text-center">
                    <p className="text-muted-foreground">No pricing information is available.</p>
                </div>
            </section>
        )
    }
    
    const currentPricing = selectedCountry ? pricingData[selectedCountry] : null;

    // Sort plans by price
    if (currentPricing?.plans) {
        currentPricing.plans.sort((a, b) => a.priceMonthly - b.priceMonthly);
    }

    return (
    <section className="py-20 bg-primary/5 animate-fade-in-up">
      <div className="container">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            Our Pricing Plan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing for your business needs. All plans are a one-time payment.
          </p>
        </div>
        
        {selectedCountry && (
          <div className="flex justify-center mb-12">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                      {Object.keys(pricingData).map((countryCode) => (
                          <SelectItem key={countryCode} value={countryCode}>
                              {pricingData[countryCode].name} ({pricingData[countryCode].currency})
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
        )}

        {currentPricing && (
          <Carousel
              plugins={[plugin.current]}
              opts={{
                  align: "start",
                  loop: true,
              }}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              className="w-full"
          >
            <CarouselContent>
              {currentPricing.plans.map((plan: PricingPlan) => {
                  const isExpanded = expandedCards[plan.id] || false;
                  const featuresToShow = isExpanded ? plan.features : plan.features.slice(0, 5);

                  return (
                  <CarouselItem key={plan.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1 h-full">
                          <Card className={cn("flex flex-col h-full transition-all duration-300", plan.name.includes("Normal") ? "border-2 border-primary shadow-2xl" : "border-border")}>
                            <CardHeader className="text-center">
                                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                                <div className="text-4xl font-bold text-primary">
                                {currentPricing.currencySymbol}
                                {plan.priceMonthly}
                                <span className="text-sm font-normal text-muted-foreground">{plan.priceSuffix}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col">
                                <ul className="space-y-4 mb-8 flex-grow">
                                {featuresToShow.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                                </ul>
                                {plan.features.length > 5 && (
                                    <Button 
                                        variant="link" 
                                        className="p-0 mb-4 self-center"
                                        onClick={() => toggleExpand(plan.id)}
                                    >
                                        {isExpanded ? 'Read Less' : 'Read More'}
                                    </Button>
                                )}
                                <Button className="w-full mt-auto" onClick={() => handleInquiryClick(plan.name)}>Started Now +</Button>
                            </CardContent>
                          </Card>
                      </div>
                  </CarouselItem>
                  );
              })}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
            </div>
          </Carousel>
        )}
      </div>
      {selectedPlan && (
        <PricingInquiryForm
          planName={selectedPlan}
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
        />
      )}
    </section>
    );
}
