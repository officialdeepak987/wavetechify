
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { PostForm } from "../_components/post-form"

export default function NewPostPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>
                    Fill out the form below to create a new blog article.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <PostForm />
            </CardContent>
        </Card>
    )
}
