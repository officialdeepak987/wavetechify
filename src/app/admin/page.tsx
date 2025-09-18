
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export default function AdminDashboardPage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to Your Dashboard</CardTitle>
                    <CardDescription>
                        This is your central hub for managing your website's content.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>You can manage your blog posts, services, projects, and more using the navigation menu on the left.</p>
                </CardContent>
            </Card>
        </div>
    )
}
