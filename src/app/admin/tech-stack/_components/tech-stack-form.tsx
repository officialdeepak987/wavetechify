
'use client';

import * as React from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Technology } from '@/lib/types';
import { addOrUpdateTechnology } from '../_actions/tech-stack-actions';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
});

interface TechStackFormProps {
    children: React.ReactNode;
    technology?: Technology;
    onSave: () => void;
}

export function TechStackForm({ children, technology, onSave }: TechStackFormProps) {
    const [open, setOpen] = React.useState(false);
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm({
        initialValues: {
            name: technology?.name || '',
        },
        validate: zodResolver(formSchema),
    });

    // When the dialog opens, reset the form to the current technology's values
    React.useEffect(() => {
        if (open) {
            form.setValues({ name: technology?.name || '' });
            form.resetDirty();
            form.resetErrors();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, technology]);


    const handleSubmit = async (values: typeof form.values) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', values.name);
        if (technology?.id) {
            formData.append('id', technology.id);
        }

        const result = await addOrUpdateTechnology(formData);

        if (result.success) {
            toast({ title: "Success", description: result.message });
            onSave();
            setOpen(false);
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{technology ? 'Edit' : 'Add'} Technology</DialogTitle>
                    <DialogDescription>
                        {technology ? 'Update the name of this technology.' : 'Add a new technology to display on the homepage.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Technology Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Next.js"
                            {...form.getInputProps('name')}
                        />
                        {form.errors.name && <p className="text-sm text-destructive mt-1">{form.errors.name}</p>}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
