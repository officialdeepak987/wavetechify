
'use client';

import { BrainCircuit, ShieldCheck, ThumbsUp, Target } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useInView } from "@/hooks/use-in-view";

const statsData = [
    {
        icon: BrainCircuit,
        value: 5,
        suffix: "+",
        label: "Years of experience",
    },
    {
        icon: ShieldCheck,
        value: 280,
        suffix: "+",
        label: "Success Stories",
    },
    {
        icon: ThumbsUp,
        value: 1,
        suffix: "K+",
        label: "Companies Trust Us",
    },
    {
        icon: Target,
        value: 100,
        suffix: "%",
        label: "Results Guaranteed",
    },
];

const AnimatedNumber = ({ targetValue, suffix = '' }: { targetValue: number, suffix?: string }) => {
    const [currentValue, setCurrentValue] = useState(0);
    const duration = 2500; // Animation duration in ms

    useEffect(() => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCurrentValue(Math.floor(progress * targetValue));
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }, [targetValue, duration]);

    return (
        <p className="text-4xl font-bold text-primary">
            {currentValue}{suffix}
        </p>
    );
};


export function Stats() {
    const statsRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(statsRef, { once: true });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section ref={statsRef} className="py-20 bg-primary/5">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {statsData.map((stat, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-start gap-4">
                                <div className="bg-accent/10 p-4 rounded-full">
                                    <stat.icon className="w-8 h-8 text-primary" />
                                </div>
                                <div className="mt-auto">
                                    {isMounted && isInView ? <AnimatedNumber targetValue={stat.value} suffix={stat.suffix} /> : <p className="text-4xl font-bold text-primary">0{stat.suffix}</p>}
                                    <p className="text-muted-foreground mt-1">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                        <img
                            src="https://picsum.photos/seed/stats-team-3/600/800"
                            alt="Professional team"
                            width={600}
                            height={800}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint="team professional"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <h3 className="text-4xl font-bold">12000+</h3>
                            <p className="text-lg text-primary-foreground/90 mt-1">employees in 30 countries in Europe</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
