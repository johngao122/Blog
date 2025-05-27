"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreatePostForm from "@/components/CreatePostForm";
import { CreateBlogPost } from "@/types/blog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreatePostPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (post: CreateBlogPost) => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", post.title);
            formData.append("content", post.content);
            formData.append("excerpt", post.excerpt);
            formData.append("bannerFile", post.bannerFile);
            formData.append("published", post.published.toString());

            const response = await fetch("/api/blog", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to create blog post");
            }

            const createdPost = await response.json();

            if (post.published) {
                router.push(`/blog/${createdPost.slug}`);
            } else {
                router.push("/");
            }
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create blog post. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Blog
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Create New Post
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Write and publish your blog post
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <CreatePostForm onSubmit={handleSubmit} isLoading={isLoading} />
            </main>
        </div>
    );
}
