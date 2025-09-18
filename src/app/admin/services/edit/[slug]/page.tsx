
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ServiceForm } from "../../_components/service-form"
import { getService } from "../../_actions/service-actions"
import { notFound } from "next/navigation"
import type { Service } from "@/lib/types"

const transformServiceToPlainObject = (service: Service) => {
    return {
        ...service,
        points: service.points?.join(', ') || '',
        tags: service.tags?.join(', ') || '',
    };
};


export default async function EditServicePage({ params }: { params: { slug: string } }) {
    const service = await getService(params.slug)

    if (!service) {
        notFound();
    }
    
    const plainService = transformServiceToPlainObject(service);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Service</CardTitle>
                <CardDescription>
                    Modify the form below to update the service.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ServiceForm service={plainService} />
            </CardContent>
        </Card>
    )
}
