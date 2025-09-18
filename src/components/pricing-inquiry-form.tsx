
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { submitPricingInquiry, type FormState } from '@/app/contact/actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, Phone, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface PricingInquiryFormProps {
  planName: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Submit Inquiry
    </Button>
  );
}

export function PricingInquiryForm({ planName, isOpen, onOpenChange }: PricingInquiryFormProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState<FormState, FormData>(submitPricingInquiry, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Inquiry Sent!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
    if (state.success) {
      formRef.current?.reset();
      onOpenChange(false);
    }
  }, [state, toast, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">
            Inquiry for: <span className="text-accent-foreground">{planName}</span>
          </DialogTitle>
          <DialogDescription>
            Please fill out your details below, and one of our experts will contact you shortly.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="planName" value={planName} />
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input name="name" required placeholder="Your Name" className="pl-10" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input name="email" type="email" required placeholder="Your Email" className="pl-10" />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input name="phone" required placeholder="Phone / WhatsApp Number" className="pl-10" />
          </div>
          <div>
            <Textarea name="message" placeholder="Any specific questions? (Optional)" rows={3} />
          </div>
          <div>
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
