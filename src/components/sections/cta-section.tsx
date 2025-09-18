

'use client'

import { Button } from "../ui/button";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { SiteSettings } from "@/lib/types";
import { getSiteSettings } from "@/app/admin/settings/_actions/settings-actions";

export function CtaSection() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        async function fetchSettings() {
        const siteSettings = await getSiteSettings();
        setSettings(siteSettings);
        }
        fetchSettings();
    }, []);

    if (!settings) {
        return (
            <section className="py-20 bg-primary">
                <div className="container text-center">
                     <Loader2 className="h-8 w-8 animate-spin text-primary-foreground mx-auto" />
                </div>
            </section>
        )
    }


    return (
        <section className="py-20 bg-primary text-primary-foreground">
            <div className="container text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Work, Let's Chat</h2>
                <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                    Our team of experts is ready to collaborate with you every step of the way, from initial consultation to implementation.
                </p>
                <Button asChild variant="secondary" size="lg" className="mt-8">
                    <Link href="/contact">Contact Us Today</Link>
                </Button>

                <div className="mt-16 grid sm:grid-cols-3 gap-8 text-left">
                    <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-white/80" />
                        <div>
                            <h4 className="font-semibold">Write to us</h4>
                            <p className="text-primary-foreground/80">{settings.contactEmail}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-white/80" />
                        <div>
                            <h4 className="font-semibold">Call Us</h4>
                            <p className="text-primary-foreground/80">{settings.contactPhone}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-white/80" />
                        <div>
                            <h4 className="font-semibold">Our Office</h4>
                            <p className="text-primary-foreground/80">{settings.officeAddress}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
