
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { submitHomepageInquiry, type FormState } from '@/app/contact/actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mail, User, Building, Loader2, MessagesSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Inquiry <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
    )
}

export function BlogInquiryForm() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    const [state, formAction] = useActionState<FormState, FormData>(submitHomepageInquiry, {
        success: false,
        message: '',
    });

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

    return(
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <MessagesSquare className="h-6 w-6 text-accent" />
                    Have a Project in Mind?
                </CardTitle>
                <CardDescription>
                    Let's talk about your requirements. Fill out the form below and we'll get in touch.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={formAction} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input name="name" required placeholder="Your Name" className="pl-10" />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input name="email" type="email" required placeholder="Your Email" className="pl-10" />
                    </div>
                     <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input name="company" placeholder="Your Company (Optional)" className="pl-10" />
                    </div>
                    <div>
                        <Textarea name="message" required minLength={10} placeholder="Tell us about your project..." rows={4} />
                    </div>
                    <div>
                        <SubmitButton />
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
