
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TeamMemberForm } from "../../_components/team-member-form"
import { getTeamMember } from "../../_actions/team-actions"
import { notFound } from "next/navigation"

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
    const member = await getTeamMember(params.id);

    if (!member) {
        notFound();
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Team Member</CardTitle>
                <CardDescription>
                    Modify the form below to update the team member's details.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TeamMemberForm member={member} />
            </CardContent>
        </Card>
    )
}
