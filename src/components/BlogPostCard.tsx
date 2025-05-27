import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BlogPost } from "@/types/blog";

interface BlogPostCardProps {
    post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <Link href={`/blog/${post.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="relative h-48 w-full">
                    <Image
                        src={post.bannerUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <CardHeader className="pb-2">
                    <h2 className="text-xl font-semibold line-clamp-2 hover:text-blue-600 transition-colors">
                        {post.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                    </p>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                </CardContent>
            </Card>
        </Link>
    );
}
