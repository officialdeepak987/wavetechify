
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getHomepageContent } from "./_actions/homepage-actions"
import { HomepageForm } from "./_components/homepage-form"

export const revalidate = 0;

export default async function HomepageSettingsPage() {
    const homepageContent = await getHomepageContent();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Homepage & Content Pages</CardTitle>
                <CardDescription>
                    Manage the content displayed on your website's main pages.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <HomepageForm content={homepageContent} />
            </CardContent>
        </Card>
    )
}
