
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { submitHomepageInquiry, type FormState } from '@/app/contact/actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mail, MapPin, MessagesSquare, Phone, User, Building, PhoneIcon, Loader2 } from "lucide-react";
import type { SiteSettings } from '@/lib/types';
import { getSiteSettings } from '@/app/admin/settings/_actions/settings-actions';


const steps = [
    { title: "Share your requirements" },
    { title: "Discuss them with our experts" },
    { title: "Get a free quote" },
    { title: "Start the project" },
]

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Request <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
    )
}

export function ContactUsSection() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    const [state, formAction] = useActionState<FormState, FormData>(submitHomepageInquiry, {
        success: false,
        message: '',
    });

    useEffect(() => {
        async function fetchSettings() {
            const siteSettings = await getSiteSettings();
            setSettings(siteSettings);
        }
        fetchSettings();
    }, []);

    useEffect(() => {
        if (state.message) {
            toast({
                title: state.success ? 'Message Sent!' : 'Error',
                description: state.message,
                variant: state.success ? 'default' : 'destructive'
            });
        }
        if (state.success) {
            formRef.current?.reset();
        }
    }, [state, toast]);

    if (!settings) {
        return <section className="py-20 md:py-32 bg-primary/5"></section>
    }

    return(
        <section className="py-20 md:py-32 bg-primary relative overflow-hidden">
             <div className="container">
                <div className="grid lg:grid-cols-2 gap-16 items-center bg-card p-8 md:p-12 rounded-2xl shadow-lg">
                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-sm font-semibold text-accent tracking-widest uppercase font-headline">You are here</p>
                            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mt-2">Let's Start</h2>
                            <p className="text-muted-foreground mt-2">Initiating Your Journey to Success and Growth.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-accent/10 rounded-full">
                                    <Phone className="h-5 w-5 text-accent"/>
                                </div>
                                <span className="text-primary font-semibold">{settings.contactPhone}</span>
                            </div>
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-accent/10 rounded-full">
                                    <Mail className="h-5 w-5 text-accent"/>
                                </div>
                                <span className="text-primary font-semibold">{settings.contactEmail}</span>
                            </div>
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-accent/10 rounded-full">
                                    <MapPin className="h-5 w-5 text-accent"/>
                                </div>
                                <span className="text-primary font-semibold">{settings.officeAddress}</span>
                            </div>
                        </div>

                        <div className="relative pl-8">
                             <div className="absolute left-3 top-2 bottom-2 w-px bg-border -z-10" />
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-center gap-4 mb-6 relative">
                                    <div className="h-7 w-7 bg-background border-2 border-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <h4 className="font-semibold text-primary">{step.title}</h4>
                                </div>
                            ))}
                        </div>
                    </div>

                     <div className="flex flex-col gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <MessagesSquare className="h-5 w-5 text-accent" />
                                <p className="text-sm font-semibold text-accent tracking-widest uppercase font-headline">Let's Connect!</p>
                            </div>
                            <h2 className="text-2xl font-bold font-headline text-primary">Send us a message, and we'll promptly discuss your project with you.</h2>
                        </div>
                        <form ref={formRef} action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input name="name" required placeholder="Your Name" className="pl-10" />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input name="email" type="email" required placeholder="Your Email" className="pl-10" />
                            </div>
                            <div className="relative">
                                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input name="phone" placeholder="Your Phone No." className="pl-10" />
                            </div>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input name="company" placeholder="Your Company Name" className="pl-10" />
                            </div>
                            <div className="md:col-span-2">
                                <Textarea name="message" required minLength={10} placeholder="How can we help you?" rows={5} />
                            </div>
                             <div className="md:col-span-2">
                                <SubmitButton />
                            </div>
                        </form>
                    </div>
                </div>
             </div>
        </section>
    )
}
