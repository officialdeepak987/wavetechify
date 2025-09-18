
'use client'

import Link from "next/link";
import { Mail, MapPin, Phone, Twitter, Linkedin, Github, Loader2 } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { SiteSettings } from "@/lib/types";
import { useState, useEffect } from "react";
import { getSiteSettings } from "@/app/admin/settings/_actions/settings-actions";

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const siteSettings = await getSiteSettings();
      setSettings(siteSettings);
    }
    fetchSettings();
  }, []);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wavetechify.in';

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Wavetechify.in",
    "image": `${siteUrl}/logo.png`,
    "@id": siteUrl,
    "url": siteUrl,
    "telephone": settings?.contactPhone,
    "email": settings?.contactEmail,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.officeAddress.split(',')[0],
      "addressLocality": "Innovation City",
      "addressRegion": "CA",
      "postalCode": "90210",
      "addressCountry": "US"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "India"
      },
      {
        "@type": "Country",
        "name": "United Arab Emirates"
      },
      {
        "@type": "Country",
        "name": "Singapore"
      }
    ],
    "sameAs": [
      settings?.twitterUrl,
      settings?.linkedinUrl,
      settings?.githubUrl
    ]
  };

  if (!settings) {
    return (
       <footer className="bg-primary/5 border-t">
        <div className="container py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
        </div>
      </footer>
    );
  }


  return (
    <footer className="bg-primary/5 border-t">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Leading IT services company in Dubai, providing affordable website development in India and custom software solutions for startups in Singapore.
            </p>
            <form className="flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Enter you Email" />
                <Button type="submit">Sign up</Button>
            </form>
            <div className="flex space-x-1">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={settings.twitterUrl || '#'}><Twitter className="h-5 w-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href={settings.linkedinUrl || '#'}><Linkedin className="h-5 w-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href={settings.githubUrl || '#'}><Github className="h-5 w-5" /></Link>
                </Button>
            </div>
          </div>

          <div className="lg:col-start-3">
            <h3 className="font-headline font-semibold text-primary">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-1" />
                    <span className="text-muted-foreground">{settings.officeAddress}</span>
                </li>
                <li className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-primary mt-1" />
                    <span className="text-muted-foreground">{settings.contactPhone}</span>
                </li>
                <li className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-primary mt-1" />
                    <span className="text-muted-foreground">{settings.contactEmail}</span>
                </li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-primary">Quick links</h3>
            <div className="grid grid-cols-2 mt-4 gap-y-2 text-sm">
                <Link href="/about" className="text-muted-foreground hover:text-primary">About us</Link>
                <Link href="/about#team" className="text-muted-foreground hover:text-primary">Team</Link>
                <Link href="/#testimonials" className="text-muted-foreground hover:text-primary">Testimonial</Link>
                <Link href="/services" className="text-muted-foreground hover:text-primary">Services</Link>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">Faq</Link>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link>
                 <Link href="/portfolio" className="text-muted-foreground hover:text-primary">Portfolio</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Wavetechify.in. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-primary">Terms & Condition</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-primary">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
