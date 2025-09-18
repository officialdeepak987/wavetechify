
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ServiceForm } from "../_components/service-form"

export default function NewServicePage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Service</CardTitle>
                <CardDescription>
                    Fill out the form below to add a new service to your website.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ServiceForm />
            </CardContent>
        </Card>
    )
}
