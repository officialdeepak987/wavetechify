
'use client'

import React, { useState } from 'react';
import type { PricingData, PricingPlan } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from './ui/card';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { PricingInquiryForm } from './pricing-inquiry-form';

interface PricingComparisonTableProps {
  pricingData: PricingData;
}

export function PricingComparisonTable({ pricingData }: PricingComparisonTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (!pricingData || Object.keys(pricingData).length === 0) {
    return null;
  }
  
  const handleInquiryClick = (planName: string) => {
    setSelectedPlan(planName);
    setIsFormOpen(true);
  }

  // Combine and sort all plans by price
  const allSortedPlans = Object.entries(pricingData)
    .flatMap(([countryCode, countryData]) => 
      countryData.plans.map(plan => ({ 
        ...plan, 
        countryName: countryData.name, 
        currencySymbol: countryData.currencySymbol,
        countryCode: countryCode 
      }))
    )
    .sort((a, b) => a.priceMonthly - b.priceMonthly);

  // Find all unique features across all sorted plans
  const allFeatures = new Set<string>();
  allSortedPlans.forEach(plan => {
    plan.features.forEach(feature => allFeatures.add(feature));
  });
  const uniqueFeatures = Array.from(allFeatures);

  return (
    <Card>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
                <Table className="min-w-full divide-y divide-border">
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[250px] min-w-[250px] px-6 py-4 text-left text-sm font-semibold text-primary sticky left-0 bg-muted/50 z-10">Features</TableHead>
                            {allSortedPlans.map(plan => (
                                <TableHead key={plan.id} className={cn("w-[200px] min-w-[200px] px-6 py-4 text-center text-sm font-semibold text-primary", plan.name.includes("Normal") && "bg-primary/10")}>
                                    {plan.name}
                                    <Badge variant="secondary" className="block mt-1">{plan.countryName}</Badge>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border bg-background">
                        {/* Pricing Row */}
                        <TableRow className="bg-muted/20">
                            <TableCell className="px-6 py-4 font-semibold text-primary sticky left-0 bg-muted/20 z-10">Price</TableCell>
                            {allSortedPlans.map(plan => (
                                <TableCell key={plan.id} className={cn("px-6 py-4 text-center font-bold text-lg", plan.name.includes("Normal") && "bg-primary/5")}>
                                    {plan.currencySymbol}{plan.priceMonthly.toLocaleString()}
                                    <span className="block text-xs font-normal text-muted-foreground">{plan.priceSuffix}</span>
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Features Rows */}
                        {uniqueFeatures.map((feature, index) => (
                            <TableRow key={index}>
                                <TableCell className="px-6 py-4 font-medium text-muted-foreground sticky left-0 bg-background z-10">{feature}</TableCell>
                                {allSortedPlans.map(plan => (
                                    <TableCell key={plan.id} className={cn("px-6 py-4 text-center", plan.name.includes("Normal") && "bg-primary/5")}>
                                        {plan.features.includes(feature) ? (
                                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                                        ) : (
                                            <Minus className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                         {/* Action Row */}
                        <TableRow>
                            <TableCell className="px-6 py-4 font-semibold text-primary sticky left-0 bg-background z-10"></TableCell>
                            {allSortedPlans.map(plan => (
                                <TableCell key={plan.id} className={cn("px-6 py-4 text-center", plan.name.includes("Normal") && "bg-primary/5")}>
                                   <Button onClick={() => handleInquiryClick(plan.name)}>Buy Now</Button>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </CardContent>
         {selectedPlan && (
            <PricingInquiryForm
                planName={selectedPlan}
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
            />
        )}
    </Card>
  );
}
