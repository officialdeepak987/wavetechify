
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TestimonialForm } from "../../_components/testimonial-form"
import { getTestimonial } from "../../_actions/testimonial-actions"
import { notFound } from "next/navigation"

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
    const testimonial = await getTestimonial(params.id);

    if (!testimonial) {
        notFound();
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Testimonial</CardTitle>
                <CardDescription>
                    Modify the form below to update the client testimonial.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TestimonialForm testimonial={testimonial} />
            </CardContent>
        </Card>
    )
}
