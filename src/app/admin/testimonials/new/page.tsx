
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TestimonialForm } from "../_components/testimonial-form"

export default function NewTestimonialPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Testimonial</CardTitle>
                <CardDescription>
                    Fill out the form below to add a new client testimonial.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TestimonialForm />
            </CardContent>
        </Card>
    )
}
