
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { submitHomepageInquiry, type FormState } from '@/app/contact/actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mail, User, Building, Loader2, X } from "lucide-react";
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from './ui/dialog';

const POPUP_SESSION_KEY = 'inquiry_popup_shown';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Inquiry <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
    )
}

export function PopupInquiryForm() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const [state, formAction] = useActionState<FormState, FormData>(submitHomepageInquiry, {
        success: false,
        message: '',
    });

    useEffect(() => {
        const hasBeenShown = sessionStorage.getItem(POPUP_SESSION_KEY);
        if (!hasBeenShown) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem(POPUP_SESSION_KEY, 'true');
            }, 10000); // 10-second delay

            return () => clearTimeout(timer);
        }
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
            setIsOpen(false); // Close popup on successful submission
        }
    }, [state, toast]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
             sessionStorage.setItem(POPUP_SESSION_KEY, 'true');
        }
        setIsOpen(open);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Have a Project in Mind?</DialogTitle>
                    <DialogDescription>
                        Let's talk about your requirements. Fill out the form and we'll get in touch shortly.
                    </DialogDescription>
                </DialogHeader>
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
                        <Textarea name="message" required minLength={10} placeholder="Tell us about your project..." rows={3} />
                    </div>
                    <div>
                        <SubmitButton />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
