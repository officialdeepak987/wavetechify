
'use client'

import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { ContactInquiry } from "@/lib/types"
import { Eye, Loader2, MoreHorizontal, Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
  } from "@/components/ui/dropdown-menu"
import { format, parseISO } from 'date-fns'
import { deleteInquiry, getInquiriesAction } from '@/app/contact/actions'
import { useToast } from '@/hooks/use-toast'

function formatDisplayDate(dateInput: Date | string | undefined | null): string {
    if (!dateInput) {
        return 'N/A';
    }

    try {
        const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
        // Check if the date is valid after parsing
        if (isNaN(date.getTime())) {
            return 'N/A';
        }
        return format(date, 'PPP');
    } catch (error) {
        // This will catch cases where parseISO fails on an invalid string format
        return 'Invalid Date';
    }
}


export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const inquiriesData = await getInquiriesAction();
            setInquiries(inquiriesData);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load inquiries.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await deleteInquiry(id);
        if (result.success) {
            // Refetch inquiries to update the list
            await fetchInquiries();
            toast({
                title: "Inquiry Deleted",
                description: "The inquiry has been successfully removed.",
            });
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Contact Inquiries</CardTitle>
                    <CardDescription>
                        Recent submissions from the website contact form.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact Inquiries</CardTitle>
                <CardDescription>
                    Recent submissions from the website contact form.
                </CardDescription>
            </CardHeader>
            <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead className="hidden md:table-cell">Submitted</TableHead>
                                <TableHead className="hidden md:table-cell">Preferred Date</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inquiries.map((inquiry) => (
                                <TableRow key={inquiry.id}>
                                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{inquiry.email}</TableCell>
                                    <TableCell>{inquiry.subject}</TableCell>
                                    <TableCell className="hidden md:table-cell">{formatDisplayDate(inquiry.date)}</TableCell>
                                    <TableCell className="hidden md:table-cell">{formatDisplayDate(inquiry.preferredDate)}</TableCell>
                                    <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            
                                            {/* View Action */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>{inquiry.subject}</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            From: {inquiry.name} ({inquiry.email})
                                                            <br />
                                                            Submitted: {formatDisplayDate(inquiry.date)}
                                                            <br />
                                                            Preferred Date: {formatDisplayDate(inquiry.preferredDate)}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <div className="my-4 max-h-60 overflow-y-auto whitespace-pre-wrap rounded-md border bg-muted p-4 text-sm text-muted-foreground">
                                                        {inquiry.message}
                                                    </div>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Close</AlertDialogCancel>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            
                                            <DropdownMenuSeparator />

                                            {/* Delete Action */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the inquiry from {inquiry.name}.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            onClick={() => handleDelete(inquiry.id)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
            </CardContent>
        </Card>
    )
}
