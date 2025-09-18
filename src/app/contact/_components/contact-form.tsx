
'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, formatISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { submitContactInquiry, type FormState } from '../actions';
import { Label } from '@/components/ui/label';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Message
        </Button>
    )
}

export function ContactForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [preferredDate, setPreferredDate] = useState<Date | undefined>();

  const initialState: FormState = { success: false, message: '' };
  const [state, formAction] = useActionState<FormState, FormData>(submitContactInquiry, initialState);

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
        setPreferredDate(undefined);
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="Regarding a new project" required />
            </div>
            <div className="flex flex-col space-y-2">
                <Label>Preferred Date (Optional)</Label>
                <input type="hidden" name="preferredDate" value={preferredDate ? formatISO(preferredDate, { representation: 'date' }) : ''} />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "pl-3 text-left font-normal",
                            !preferredDate && "text-muted-foreground"
                        )}
                        >
                        {preferredDate ? (
                            format(preferredDate, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={preferredDate}
                        onSelect={setPreferredDate}
                        disabled={(date) =>
                        date < new Date()
                        }
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Tell us about your project or inquiry..." rows={6} required minLength={10} />
        </div>
        <div>
          {state.message && !state.success && (
            <p className="text-sm font-medium text-destructive mb-4">{state.message}</p>
          )}
          <SubmitButton />
        </div>
    </form>
  )
}
