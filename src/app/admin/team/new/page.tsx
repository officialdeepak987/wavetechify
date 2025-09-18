
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TeamMemberForm } from "../_components/team-member-form"

export default function NewTeamMemberPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Team Member</CardTitle>
                <CardDescription>
                    Fill out the form below to add a new person to your team.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TeamMemberForm />
            </CardContent>
        </Card>
    )
}
