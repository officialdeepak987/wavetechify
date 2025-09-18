
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ProjectForm } from "../_components/project-form"

export default function NewProjectPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Project</CardTitle>
                <CardDescription>
                    Fill out the form below to add a new project to your portfolio.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ProjectForm />
            </CardContent>
        </Card>
    )
}
