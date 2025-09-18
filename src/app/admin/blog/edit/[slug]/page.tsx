
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { PostForm } from "../../_components/post-form"
import { getPost } from "../../_actions/post-actions"
import { notFound } from "next/navigation"

export default async function EditPostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Post</CardTitle>
                <CardDescription>
                    Modify the form below to update the blog post.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <PostForm post={post} />
            </CardContent>
        </Card>
    )
}

    