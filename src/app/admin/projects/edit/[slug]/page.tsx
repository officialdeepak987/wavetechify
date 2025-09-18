
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ProjectForm } from "../../_components/project-form"
import { getProject } from "../../_actions/project-actions"
import { notFound } from "next/navigation"
import type { Project } from "@/lib/types"

// Transform project for form compatibility
const transformProjectForForm = (project: Project) => {
    return {
        ...project,
        requirements: Array.isArray(project.requirements) ? project.requirements.join(', ') : '',
    };
};

export default async function EditProjectPage({ params }: { params: { slug: string } }) {
    const project = await getProject(params.slug)

    if (!project) {
        notFound();
    }

    const plainProject = transformProjectForForm(project);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Project</CardTitle>
                <CardDescription>
                    Modify the form below to update the project details.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ProjectForm project={plainProject} />
            </CardContent>
        </Card>
    )
}
