
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SettingsForm } from "./_components/settings-form"
import { getSiteSettings } from "./_actions/settings-actions"

export default async function SettingsPage() {
    const siteSettings = await getSiteSettings();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>
                    Manage your global website settings, such as contact information and social media links.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SettingsForm settings={siteSettings} />
            </CardContent>
        </Card>
    )
}
