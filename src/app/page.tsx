import { getAllBlogPosts } from "@/lib/blog";
import BlogPostCard from "@/components/BlogPostCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export const metadata = {
    title: "Home",
    description:
        "Welcome to my blog - discover my latest thoughts, stories and ideas",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const posts = await getAllBlogPosts();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                My Blog
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Place where i dump my thoughts
                            </p>
                        </div>
                        <Link href="/create">
                            <Button className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                New Post
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            No blog posts yet
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Start by creating your first blog post!
                        </p>
                        <Link href="/create">
                            <Button
                                size="lg"
                                className="flex items-center gap-2"
                            >
                                <PlusCircle className="h-5 w-5" />
                                Create Your First Post
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Latest Posts
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {posts.length}{" "}
                                {posts.length === 1 ? "post" : "posts"}{" "}
                                published
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <BlogPostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
